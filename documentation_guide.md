# 🛒 Amazon Product Review Aggregator & Comparator

> This micro SaaS tool aggregates Amazon product reviews, providing AI-generated summaries to help users make informed purchasing decisions. It also offers similar product comparisons to show alternatives. The platform monetizes through affiliate links and targeted advertisements.

---

## 📋 Table of Contents
- [Installation](#-installation)
- [Usage](#-usage)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-file-structure)
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
    "specifications": { ... }
  },
  "review_data": {
    "reviews": [ ... ],
    "analysis": {
      "average_rating": 4.5,
      "total_reviews": 15,
      "rating_counts": { ... }
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
              │  JSON Data  │ │Command Line UI│
              └─────────────┘ └──────────────┘
```

### Data Flow
1. **Input**: Amazon product URL (either direct link or ASIN)
2. **Web Scraping**: Extract product details, reviews, and similar products
3. **Analysis**: Calculate statistics and metrics from review data
4. **AI Processing**: Generate summaries, extract key points, pros and cons
5. **Output**: JSON formatted data and terminal readable summary

---

## 📁 Project File Structure

### 🔸 Core Components

#### [`main.py`](main.py) - Command-line interface and main entry point
*Orchestrates the workflow and provides user interface*

| Function | Description |
|----------|-------------|
| **`setup_logging(verbose)`** | Configures logging with appropriate verbosity level |
| **`extract_product_details(url)`** | Extracts product information and specifications |
| **`extract_and_analyze_reviews(url, max_pages)`** | Extracts and analyzes product reviews |
| **`generate_ai_summary(reviews, api_key)`** | Generates AI summaries from review data |
| **`process_product(...)`** | Main pipeline function |
| **`main()`** | Entry point that handles CLI arguments |

#### [`scraper.py`](scraper.py) - Core scraping functionality
*Extracts product data from Amazon pages*

**`AmazonScraper`** - OOP implementation with resilient HTML parsing
- **`__init__(user_agent)`** - Initializes scraper with customizable user agent
- **`fetch_page(url)`** - Retrieves HTML content with error handling
- **`extract_product_description(html_content)`** - Parses product descriptions
- **`extract_tech_specs(html_content)`** - Extracts technical specifications
- **`scrape_product(url)`** - Main orchestration method

**Utility Functions**
- **`scrape_amazon_product(url)`** - Simplified access to scraping functionality

#### [`review_analyzer.py`](review_analyzer.py) - Review processing and analysis
*Extracts and analyzes Amazon product reviews*

**`ReviewAnalyzer`** - Handles review extraction and sentiment analysis
- **`__init__(user_agent)`** - Initializes the analyzer
- **`extract_reviews(product_url, max_pages)`** - Extracts reviews with direct web scraping
- **`_parse_review_page(html_content)`** - Parses HTML for reviews
- **`_extract_review_snippets(soup)`** - Extracts review snippets from product pages
- **`analyze_sentiment(reviews)`** - Analyzes rating distribution and sentiment
- **`find_similar_products(product_url)`** - Finds similar products through web scraping
- **`_extract_similar_product_info(element)`** - Extracts product details

**Utility Functions**
- **`analyze_product_reviews(url, max_review_pages)`** - Quick review analysis

#### [`ai_summarizer.py`](ai_summarizer.py) - AI integration
*Generates summaries from review data*

**`ReviewSummarizer`** - Creates concise, AI-generated summaries
- **`__init__(api_key)`** - Initializes with optional API key
- **`generate_summary(reviews)`** - Processes reviews into summaries
- **`highlight_key_points(reviews)`** - Extracts important points

**Utility Functions**
- **`summarize_reviews(reviews, api_key)`** - Quick summary generation

---

### 🔹 Future Components

#### `product_comparator.py` - Product comparison
*Will compare similar products based on reviews and specifications*

**`ProductComparator`** - Will find and compare similar products
- **`find_similar_products(product_id)`** - Will locate similar products
- **`generate_comparison_table(products)`** - Will create comparison data

#### `api_service.py` - API endpoints
*Will provide RESTful endpoints for frontend integration*

**`APIService`** - Will expose data through a REST API
- **`get_product_summary(product_id)`** - Will return product data and summaries
- **`get_comparison_data(product_ids)`** - Will return comparison data

---

### 🧪 Test Components

#### [`test_scraper.py`](test_scraper.py)
- **`test_amazon_scraper(url)`** - Tests product extraction

#### [`test_review_analyzer.py`](test_review_analyzer.py)
- **`test_review_analyzer(url)`** - Tests review extraction and analysis

#### [`test_ai_summarizer.py`](test_ai_summarizer.py)
- **`test_ai_summarizer()`** - Tests AI summary generation
- **`test_full_pipeline(product_url)`** - Tests the complete workflow 