#!/usr/bin/env python3
import argparse
import logging
import sys
import json
from typing import Dict, Any, List, Optional

from scraper import AmazonScraper, scrape_amazon_product
from review_analyzer import ReviewAnalyzer, analyze_product_reviews
from ai_summarizer import ReviewSummarizer, summarize_reviews

def setup_logging(verbose: bool = False) -> None:
    """Configure logging for the application."""
    log_level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )

def extract_product_details(url: str) -> Dict[str, Any]:
    """Extract product description and specifications."""
    description, specs = scrape_amazon_product(url)
    
    return {
        "description": description,
        "specifications": specs
    }

def extract_and_analyze_reviews(url: str, max_pages: int = 3) -> Dict[str, Any]:
    """Extract reviews and analyze them."""
    reviews, analysis = analyze_product_reviews(url, max_pages)
    
    return {
        "reviews": reviews,
        "analysis": analysis
    }

def find_similar_products(url: str) -> List[Dict[str, Any]]:
    """Find similar products listed on the product page."""
    analyzer = ReviewAnalyzer()
    return analyzer.find_similar_products(url)

def generate_ai_summary(reviews: List[Dict[str, Any]], api_key: Optional[str] = None) -> Dict[str, Any]:
    """Generate an AI-powered summary of the reviews."""
    return summarize_reviews(reviews, api_key)

def save_results_to_json(data: Dict[str, Any], output_file: str) -> None:
    """Save analysis results to a JSON file."""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    logging.info(f"Results saved to {output_file}")

def print_summary(data: Dict[str, Any]) -> None:
    """Print a summary of the analysis results to the console."""
    print("\n" + "="*80)
    print("AMAZON PRODUCT SUMMARY")
    print("="*80)
    
    # Product information
    if "product_details" in data:
        specs = data["product_details"].get("specifications", {})
        print(f"\nProduct: {specs.get('Brand', '')} {specs.get('Title', '')}")
        print(f"ASIN: {specs.get('ASIN', 'Unknown')}")
        
        # Print a few key specifications
        important_specs = ["Brand", "Capacity", "Material", "Color", "Product Dimensions", "Item Weight"]
        print("\nSpecifications:")
        for spec in important_specs:
            if spec in specs:
                print(f"  {spec}: {specs[spec]}")
    
    # Review analysis
    if "review_data" in data and "analysis" in data["review_data"]:
        analysis = data["review_data"]["analysis"]
        print(f"\nTotal Reviews: {analysis.get('total_reviews', 0)}")
        print(f"Average Rating: {analysis.get('average_rating', 0)} stars")
        
        # Rating distribution
        if "rating_counts" in analysis:
            print("\nRating Distribution:")
            for star, count in analysis["rating_counts"].items():
                print(f"  {star}: {count} reviews")
    
    # AI summary
    if "ai_summary" in data:
        summary = data["ai_summary"]
        print("\n" + "-"*80)
        print("AI-GENERATED REVIEW SUMMARY")
        print("-"*80)
        print(f"\n{summary.get('summary', 'No summary available.')}")
        
        # Key points
        if "key_points" in summary and summary["key_points"]:
            print("\nKey Points:")
            for point in summary["key_points"]:
                print(f"• {point}")
        
        # Pros and cons
        if "pros" in summary and summary["pros"]:
            print("\nPros:")
            for pro in summary["pros"]:
                print(f"✓ {pro}")
        
        if "cons" in summary and summary["cons"]:
            print("\nCons:")
            for con in summary["cons"]:
                print(f"✗ {con}")
    
    # Similar products
    if "similar_products" in data and data["similar_products"]:
        print("\n" + "-"*80)
        print("SIMILAR PRODUCTS")
        print("-"*80)
        for i, product in enumerate(data["similar_products"][:5], 1):
            print(f"{i}. {product.get('title', 'Unknown')}")
            print(f"   URL: {product.get('url', '')}")
            if product.get('price_text'):
                print(f"   Price: {product['price_text']}")
            print()
    
    print("="*80)

def process_product(url: str, output_file: Optional[str] = None, 
                   max_review_pages: int = 3, api_key: Optional[str] = None,
                   skip_similar: bool = False, verbose: bool = False) -> Dict[str, Any]:
    """
    Process a product URL and perform all analyses.
    
    Args:
        url (str): The Amazon product URL
        output_file (str, optional): Path to save results as JSON
        max_review_pages (int): Maximum number of review pages to scrape
        api_key (str, optional): API key for AI service
        skip_similar (bool): Skip finding similar products
        verbose (bool): Enable verbose logging
        
    Returns:
        Dict[str, Any]: Complete analysis results
    """
    # Setup logging
    setup_logging(verbose)
    
    logging.info(f"Processing Amazon product: {url}")
    
    # Create the result dictionary
    result = {
        "url": url,
        "product_details": {},
        "review_data": {},
        "ai_summary": {},
        "similar_products": []
    }
    
    # 1. Extract product details
    logging.info("Step 1: Extracting product details")
    try:
        result["product_details"] = extract_product_details(url)
        logging.info("Product details extracted successfully")
    except Exception as e:
        logging.error(f"Error extracting product details: {str(e)}")
    
    # 2. Extract and analyze reviews
    logging.info("Step 2: Extracting and analyzing reviews")
    try:
        result["review_data"] = extract_and_analyze_reviews(url, max_pages=max_review_pages)
        logging.info(f"Extracted {len(result['review_data'].get('reviews', []))} reviews")
    except Exception as e:
        logging.error(f"Error extracting reviews: {str(e)}")
    
    # 3. Generate AI summary if we have reviews
    if result["review_data"].get("reviews"):
        logging.info("Step 3: Generating AI summary")
        try:
            result["ai_summary"] = generate_ai_summary(
                result["review_data"]["reviews"], 
                api_key=api_key
            )
            logging.info("AI summary generated successfully")
        except Exception as e:
            logging.error(f"Error generating AI summary: {str(e)}")
    
    # 4. Find similar products if not skipped
    if not skip_similar:
        logging.info("Step 4: Finding similar products")
        try:
            result["similar_products"] = find_similar_products(url)
            logging.info(f"Found {len(result['similar_products'])} similar products")
        except Exception as e:
            logging.error(f"Error finding similar products: {str(e)}")
    
    # Save results if output file is specified
    if output_file:
        try:
            save_results_to_json(result, output_file)
        except Exception as e:
            logging.error(f"Error saving results: {str(e)}")
    
    # Print summary
    print_summary(result)
    
    return result

def main():
    """Main entry point of the application."""
    parser = argparse.ArgumentParser(
        description="Amazon Product Review Aggregator & Summarizer",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    
    parser.add_argument(
        "url",
        help="Amazon product URL to analyze"
    )
    
    parser.add_argument(
        "-o", "--output",
        help="Save results to this JSON file",
        default=None
    )
    
    parser.add_argument(
        "-p", "--pages",
        help="Maximum number of review pages to scrape",
        type=int,
        default=3
    )
    
    parser.add_argument(
        "-k", "--api-key",
        help="API key for AI service",
        default=None
    )
    
    parser.add_argument(
        "--skip-similar",
        help="Skip finding similar products",
        action="store_true"
    )
    
    parser.add_argument(
        "-v", "--verbose",
        help="Enable verbose logging",
        action="store_true"
    )
    
    args = parser.parse_args()
    
    try:
        # Process the product
        process_product(
            url=args.url,
            output_file=args.output,
            max_review_pages=args.pages,
            api_key=args.api_key,
            skip_similar=args.skip_similar,
            verbose=args.verbose
        )
    except KeyboardInterrupt:
        logging.info("Process interrupted by user")
        sys.exit(1)
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        sys.exit(1)
    
    sys.exit(0)

if __name__ == "__main__":
    main() 