# Amazon Product Analyzer - Frontend Guide

This document provides a quick start guide for the frontend interface of the Amazon Product Analyzer.

## 📋 Overview

The frontend interface allows users to:

1. Enter an Amazon product URL
2. View a comprehensive analysis of the product and its reviews
3. See AI-generated summaries of product reviews
4. Browse similar products

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- For local development: Python or Node.js (optional)

### Running the Interface

#### Method 1: Direct File Opening (may encounter CORS issues)

You can directly open the HTML file in your browser:

```
/pages/index.html
```

**Note:** This method might result in CORS errors when trying to load the JSON data.

#### Method 2: Using a Local Server (recommended)

To avoid CORS issues, run the application using a local server:

**With Python:**
```bash
# From the project root directory
python -m http.server 8000

# Then visit in your browser:
# http://localhost:8000/pages/index.html
```

**With Node.js:**
```bash
# Install http-server if not already installed
npm install -g http-server

# Run from project root
http-server -p 8000

# Then visit in your browser:
# http://localhost:8000/pages/index.html
```

## 🖥️ Using the Interface

1. **Enter a Product URL**
   - Paste an Amazon product URL into the input field
   - Click "Analyze Product"

2. **View Results**
   - After processing, you'll see:
     - Product image, title, and details
     - Specifications table
     - AI review summary with pros and cons
     - Top user reviews
     - Similar products (if available)

3. **Compare Another Product**
   - Click "Compare Another Product" to start over

## ⚠️ Troubleshooting CORS Issues

If you encounter error messages about CORS (Cross-Origin Resource Sharing):

1. **Use Sample Data**
   - The interface provides a fallback option with sample data
   - Click "Use Sample Data" on the error screen

2. **Use a Local Server**
   - Follow the instructions in "Method 2" above

3. **Check File Paths**
   - Ensure the relative path to review.json is correct
   - The default path in the code is "../review.json" relative to the app.js file

## 🔧 Technical Structure

The interface consists of three main components:

1. **HTML (pages/index.html)**
   - Semantic structure with proper sections and semantic tags
   - Responsive layout that works on mobile and desktop

2. **CSS (styles/main.css)**
   - Mobile-first design approach
   - CSS variables for consistent styling
   - Responsive breakpoints

3. **JavaScript (scripts/js/app.js)**
   - Fetches and processes JSON data
   - Dynamically renders product information
   - Handles error states and provides fallbacks
   - Manages UI interactions

## 🤝 Contributing

If you'd like to enhance the frontend:

1. Improve the responsive design for better mobile experience
2. Add dark mode toggle functionality
3. Implement accessibility improvements
4. Add sorting/filtering options for reviews

Please follow the existing code style and structure when making contributions. 