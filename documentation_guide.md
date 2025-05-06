# 🛒 Amazon Product Review Aggregator & Comparator

> This micro SaaS tool aggregates Amazon product reviews, providing AI-generated summaries to help users make informed purchasing decisions. It also offers similar product comparisons to show alternatives. The platform monetizes through affiliate links and targeted advertisements.

---

## 📋 Table of Contents
- [Installation](#-installation)
- [Usage](#-usage)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-file-structure)
- [Frontend Interface](#-frontend-interface)
- [Local Development](#-local-development)
- [Future Development](#-future-components)
- [Testing](#-test-components)

---

## 📥 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/amazon-product-analyzer.git
cd amazon-product-analyzer

# Install dependencies
pip install -r requirements.txt
```

### Dependencies
- Python 3.8+
- BeautifulSoup4
- Requests
- Other packages listed in requirements.txt

---

## 🚀 Usage

### Basic Usage
```bash
python main.py "https://www.amazon.com/dp/B00SX2YSMS" -o results.json
```

### Advanced Options
```bash
# With verbose logging
python main.py "https://www.amazon.com/dp/B00SX2YSMS" -v -o results.json

# Specify max review pages to scrape
python main.py "https://www.amazon.com/dp/B00SX2YSMS" -p 5 -o results.json

# Skip similar products search
python main.py "https://www.amazon.com/dp/B00SX2YSMS" --skip-similar -o results.json

# Provide AI API key for better summaries
python main.py "https://www.amazon.com/dp/B00SX2YSMS" -k "your-api-key" -o results.json
```

### Example Output
```json
{
  "url": "https://www.amazon.com/dp/B00SX2YSMS",
  "product_details": {
    "description": "Product description...",
    "specifications": { ... },
    "image_url": "https://m.media-amazon.com/images/I/71XCVyI4unL._AC_SX522_.jpg",
    "price": "$195.99"
  },
  "review_data": {
    "reviews": [ ... ],
    "analysis": {
      "average_rating": 4.5,
      "total_reviews": 15,
      "rating_counts": { ... },
      "top_positive_reviews": [ ... ],
      "top_negative_reviews": [ ... ]
    }
  },
  "ai_summary": {
    "summary": "Overall positive reviews...",
    "key_points": [ ... ],
    "pros": [ ... ],
    "cons": [ ... ]
  },
  "similar_products": [ ... ]
}
```

---

## 🏗️ System Architecture

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Amazon.com   │────▶│  Web Scraper  │────▶│ Review Parser │
└───────────────┘     └───────────────┘     └───────────────┘
                                                    │
                                                    ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Similar Items │◀────│ AI Summarizer │◀────│Data Aggregator│
└───────────────┘     └───────────────┘     └───────────────┘
        │                     │                     │
        └─────────────┬──────────────┬─────────────┘
                      │              │
                      ▼              ▼
              ┌─────────────┐ ┌──────────────┐
              │  JSON Data  │ │   User UI    │
              └─────────────┘ └──────────────┘
```

### Data Flow
1. **Input**: Amazon product URL (either direct link or ASIN)
2. **Web Scraping**: Extract product details, reviews, and similar products
3. **Analysis**: Calculate statistics and metrics from review data
4. **AI Processing**: Generate summaries, extract key points, pros and cons
5. **Output**: JSON formatted data and user-friendly UI presentation

---

## 📁 Project File Structure

### 🔸 Core Components

#### [`main.py`](main.py) - Command-line interface and main entry point
*Orchestrates the workflow and provides user interface*

| Function | Description |
|----------|-------------|
| **`setup_logging(verbose)`** | Configures logging with appropriate verbosity level |
| **`extract_product_details(url)`** | Extracts product information, specifications, and image URL |
| **`extract_and_analyze_reviews(url, max_pages)`** | Extracts and analyzes product reviews |
| **`generate_ai_summary(reviews, api_key)`** | Generates AI summaries from review data |
| **`process_product(...)`** | Main pipeline function |
| **`main()`** | Entry point that handles CLI arguments |

#### [`scripts/python/scraper.py`](scripts/python/scraper.py) - Core scraping functionality
*Extracts product data from Amazon pages*

**`AmazonScraper`** - OOP implementation with resilient HTML parsing
- **`__init__(user_agent)`** - Initializes scraper with customizable user agent
- **`fetch_page(url)`** - Retrieves HTML content with error handling
- **`extract_product_description(html_content)`** - Parses product descriptions
- **`extract_tech_specs(html_content)`** - Extracts technical specifications
- **`extract_product_image(html_content)`** - Extracts product display image URL
- **`extract_product_price(html_content)`** - Extracts product price
- **`scrape_product(url)`** - Main orchestration method

**Utility Functions**
- **`scrape_amazon_product(url)`** - Simplified access to scraping functionality

#### [`scripts/python/review_analyzer.py`](scripts/python/review_analyzer.py) - Review processing and analysis
*Extracts and analyzes Amazon product reviews*

**`ReviewAnalyzer`** - Handles review extraction and sentiment analysis
- **`__init__(user_agent)`** - Initializes the analyzer
- **`extract_reviews(product_url, max_pages)`** - Extracts reviews with direct web scraping
- **`_parse_review_page(html_content)`** - Parses HTML for reviews
- **`_extract_review_snippets(soup)`** - Extracts review snippets from product pages
- **`analyze_sentiment(reviews)`** - Analyzes rating distribution, sentiment, and extracts top positive/negative reviews
- **`find_similar_products(product_url)`** - Finds similar products through web scraping
- **`_extract_similar_product_info(element)`** - Extracts product details

**Utility Functions**
- **`analyze_product_reviews(url, max_review_pages)`** - Quick review analysis

#### [`scripts/python/ai_summarizer.py`](scripts/python/ai_summarizer.py) - AI integration
*Generates summaries from review data*

**`ReviewSummarizer`** - Creates concise, AI-generated summaries
- **`__init__(api_key)`** - Initializes with optional API key
- **`generate_summary(reviews)`** - Processes reviews into summaries
- **`highlight_key_points(reviews)`** - Extracts important points

**Utility Functions**
- **`summarize_reviews(reviews, api_key)`** - Quick summary generation

### 🔸 Frontend Components

#### [`pages/index.html`](pages/index.html) - Main application interface
*Provides user interface for analyzing Amazon products*

**Semantic Structure**
- **`<header>`** - App name and description
- **`<section class="form-container">`** - URL input form
- **`<section id="results-container">`** - Product analysis results
- **`<section id="fallback-container">`** - Error handling interface
- **`<footer>`** - Copyright and attribution

**Key Sections**
- **Product Card** - Displays product image, title, price, and description
- **Specifications Table** - Shows product specifications in a two-column layout
- **Review Highlights** - Displays AI-generated summary with pros and cons
- **Top Reviews** - Shows the top 3 user reviews with metadata
- **Similar Products** - Displays alternative product options if available
- **Error Handling** - Dedicated error display with CORS troubleshooting

#### [`styles/main.css`](styles/main.css) - Styling for the application
*Mobile-first responsive design with clean visual components*

**Key Features**
- **Responsive Layout** - Adapts to different screen sizes
- **Card-based Design** - Clear visual separation of content sections
- **Modern Typography** - Clean and readable text hierarchy
- **Loading Indicators** - Visual feedback during data processing
- **Error Displays** - Informative error messages with troubleshooting help

#### [`scripts/js/app.js`](scripts/js/app.js) - Client-side functionality
*Handles user interactions and data rendering*

**`DOMContentLoaded` Event Handler** - Sets up the application when page loads

**Key Functions**
- **`handleAnalyzeSubmit(e)`** - Processes form submission and fetches product data
- **`renderProductData(data)`** - Populates the UI with product information
- **`showFallbackError(error)`** - Displays user-friendly error messages
- **`useFallbackData()`** - Provides mock data when real data can't be fetched
- **`showLoading()`/`hideLoading()`** - Manages loading state visibility
- **`resetUI()`** - Returns to initial state for analyzing another product

## 🌐 Local Development

To run the application locally and avoid CORS issues, use one of these approaches:

### Using a Local Server

The simplest way to run the application is with a local web server:

#### Python HTTP Server
```bash
# Navigate to project directory
cd amazon-product-analyzer

# Start a simple HTTP server
python -m http.server 8000
```
Then open http://localhost:8000/pages/index.html in your browser.

#### Node.js HTTP Server
If you have Node.js installed:
```bash
# Install http-server globally if not already installed
npm install -g http-server

# Start server in project directory
http-server -p 8000
```

### Handling CORS Errors

If you encounter CORS errors when developing locally:

1. **Use the Fallback Data**:
   - The application includes a fallback option that uses sample data when CORS errors occur
   - Click "Use Sample Data" on the error screen to see how the UI works with mock data

2. **Modify Fetch Paths**:
   - Ensure the path to review.json is relative to the HTML file location
   - Update the path in app.js to correctly target the JSON file

3. **Browser Extensions**:
   - For testing only, you can use browser extensions that disable CORS restrictions
   - Note: This approach is not recommended for production use

### Testing the Interface

To test the UI without a backend:

```bash
# Check if all required files are in place
node scripts/test-ui.js
```

This will verify the file structure and JSON format.

---

### 🔹 Future Components

#### `scripts/python/product_comparator.py` - Product comparison
*Will compare similar products based on reviews and specifications*

**`ProductComparator`** - Will find and compare similar products
- **`find_similar_products(product_id)`** - Will locate similar products
- **`generate_comparison_table(products)`** - Will create comparison data

#### `scripts/python/api_service.py` - API endpoints
*Will provide RESTful endpoints for frontend integration*

**`APIService`** - Will expose data through a REST API
- **`get_product_summary(product_id)`** - Will return product data and summaries
- **`get_comparison_data(product_ids)`** - Will return comparison data

---

### 🧪 Test Components

#### [`testers/test_scraper.py`](testers/test_scraper.py)
- **`test_amazon_scraper(url)`** - Tests product extraction

#### [`testers/test_review_analyzer.py`](testers/test_review_analyzer.py)
- **`test_review_analyzer(url)`** - Tests review extraction and analysis

#### [`testers/test_ai_summarizer.py`](testers/test_ai_summarizer.py)
- **`test_ai_summarizer()`** - Tests AI summary generation
- **`test_full_pipeline(product_url)`** - Tests the complete workflow 