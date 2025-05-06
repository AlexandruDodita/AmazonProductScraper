/**
 * Amazon Product Analyzer - Frontend JavaScript
 * Handles UI interactions, API calls, and rendering product data
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const analyzeForm = document.getElementById('analyze-form');
    const resultsContainer = document.getElementById('results-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const urlInput = document.getElementById('product-url');
    const compareButton = document.getElementById('compare-another');
    const errorMessage = document.getElementById('error-message');
    const fallbackContainer = document.getElementById('fallback-container');

    // Fallback data (sample data for when fetch fails)
    const fallbackData = {
        "url": "https://www.amazon.com/sample-product",
        "product_details": {
            "description": "Sample Product - This is fallback data shown when the actual data cannot be loaded. This could be due to CORS restrictions when running locally.",
            "specifications": {
                "Brand": "Sample Brand",
                "Model": "Fallback Model",
                "Color": "Blue",
                "Dimensions": "10 x 5 x 2 inches",
                "Weight": "1.5 pounds"
            },
            "image_url": "https://via.placeholder.com/300x300?text=Sample+Product",
            "price": "$99.99"
        },
        "review_data": {
            "reviews": [
                {
                    "reviewer_name": "Sample Reviewer",
                    "title": "5.0 out of 5 stars - Great Product!",
                    "rating": 5.0,
                    "date": "Reviewed on January 1, 2025",
                    "text": "This is a sample review shown when the actual reviews cannot be loaded. The product works great!",
                    "verified_purchase": true,
                    "helpful_votes": 10
                },
                {
                    "reviewer_name": "Another Reviewer",
                    "title": "4.0 out of 5 stars - Good but could be better",
                    "rating": 4.0,
                    "date": "Reviewed on February 15, 2025",
                    "text": "Another sample review. Product is good but has a few minor issues that could be improved.",
                    "verified_purchase": true,
                    "helpful_votes": 5
                },
                {
                    "reviewer_name": "Third Reviewer",
                    "title": "3.0 out of 5 stars - Mixed feelings",
                    "rating": 3.0,
                    "date": "Reviewed on March 20, 2025",
                    "text": "A third sample review. I have mixed feelings about this product. Some features are nice but others need improvement.",
                    "verified_purchase": false,
                    "helpful_votes": 2
                }
            ],
            "analysis": {
                "average_rating": 4.0,
                "total_reviews": 3,
                "rating_counts": {
                    "1_star": 0,
                    "2_star": 0,
                    "3_star": 1,
                    "4_star": 1,
                    "5_star": 1
                }
            }
        },
        "ai_summary": {
            "summary": "This is a sample summary shown when actual data cannot be loaded. The product generally receives positive reviews with users praising the quality and functionality. Some minor issues were noted by a few reviewers.",
            "key_points": [
                "Good quality for the price",
                "Easy to use",
                "Some minor design flaws"
            ],
            "pros": [
                "High quality materials",
                "Good value for money",
                "Helpful customer service",
                "Easy setup process"
            ],
            "cons": [
                "Minor design issues",
                "Could have more features",
                "Occasional software glitches"
            ],
            "sentiment": "positive"
        },
        "similar_products": [
            {
                "title": "Similar Product 1",
                "image_url": "https://via.placeholder.com/150x150?text=Similar+1",
                "price": "$89.99"
            },
            {
                "title": "Similar Product 2",
                "image_url": "https://via.placeholder.com/150x150?text=Similar+2",
                "price": "$109.99"
            }
        ]
    };

    // Event Listeners
    analyzeForm.addEventListener('submit', handleAnalyzeSubmit);
    compareButton.addEventListener('click', resetUI);
    document.getElementById('try-fallback').addEventListener('click', useFallbackData);

    /**
     * Handles the analyze form submission
     * @param {Event} e - The form submit event
     */
    async function handleAnalyzeSubmit(e) {
        e.preventDefault();
        
        const url = urlInput.value.trim();
        if (!url) {
            showError('Please enter an Amazon product URL');
            return;
        }
        
        if (!isValidAmazonUrl(url)) {
            showError('Please enter a valid Amazon product URL');
            return;
        }
        
        showLoading();
        
        try {
            let data;
            
            try {
                // In a real implementation with a proper backend:
                // const response = await fetch(`/analyze?url=${encodeURIComponent(url)}`);
                
                // For local testing - using relative path to help with CORS issues
                const response = await fetch('../review.json');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                data = await response.json();
            } catch (fetchError) {
                console.error('Error fetching product data:', fetchError);
                // Show fallback error UI instead of just an error message
                showFallbackError(fetchError);
                return;
            }
            
            renderProductData(data);
            showResults();
        } catch (error) {
            console.error('Error processing product data:', error);
            showError('Failed to process product data. Please try again later.');
        } finally {
            hideLoading();
        }
    }

    /**
     * Shows the fallback error screen with options
     * @param {Error} error - The error that occurred
     */
    function showFallbackError(error) {
        hideLoading();
        fallbackContainer.classList.remove('hidden');
        analyzeForm.classList.add('hidden');
        
        // Update error details
        document.getElementById('error-details').textContent = error.toString();
        
        if (error.toString().includes('CORS') || error.toString().includes('NetworkError')) {
            document.getElementById('cors-message').classList.remove('hidden');
        } else {
            document.getElementById('cors-message').classList.add('hidden');
        }
    }

    /**
     * Uses the fallback data when the fetch fails
     */
    function useFallbackData() {
        fallbackContainer.classList.add('hidden');
        renderProductData(fallbackData);
        showResults();
    }

    /**
     * Validates if the URL is from Amazon
     * @param {string} url - The URL to validate
     * @returns {boolean} True if valid Amazon URL
     */
    function isValidAmazonUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.includes('amazon.com') || 
                   urlObj.hostname.includes('amazon.');
        } catch (e) {
            return false;
        }
    }

    /**
     * Renders the product data in the UI
     * @param {Object} data - The product data JSON
     */
    function renderProductData(data) {
        // Product Card
        document.getElementById('product-image').src = data.product_details.image_url;
        document.getElementById('product-image').alt = data.product_details.description.substring(0, 50) + '...';
        document.getElementById('product-title').textContent = data.product_details.description.split('-')[0];
        document.getElementById('product-price').textContent = data.product_details.price;
        document.getElementById('product-description').textContent = data.product_details.description;
        
        // Specifications Table
        const specsTable = document.getElementById('specs-table');
        specsTable.innerHTML = '';
        
        Object.entries(data.product_details.specifications).forEach(([key, value]) => {
            const row = document.createElement('tr');
            
            const keyCell = document.createElement('th');
            keyCell.textContent = key;
            row.appendChild(keyCell);
            
            const valueCell = document.createElement('td');
            valueCell.textContent = value;
            row.appendChild(valueCell);
            
            specsTable.appendChild(row);
        });
        
        // AI Summary
        document.getElementById('summary-text').textContent = data.ai_summary.summary;
        
        // Pros and Cons
        const prosList = document.getElementById('pros-list');
        const consList = document.getElementById('cons-list');
        
        prosList.innerHTML = '';
        consList.innerHTML = '';
        
        data.ai_summary.pros.forEach(pro => {
            const li = document.createElement('li');
            li.textContent = pro;
            prosList.appendChild(li);
        });
        
        data.ai_summary.cons.forEach(con => {
            const li = document.createElement('li');
            li.textContent = con;
            consList.appendChild(li);
        });
        
        // Top Reviews
        const reviewsList = document.getElementById('reviews-list');
        reviewsList.innerHTML = '';
        
        const topReviews = data.review_data.reviews.slice(0, 3);
        
        topReviews.forEach(review => {
            const reviewEl = document.createElement('article');
            reviewEl.classList.add('review');
            
            const header = document.createElement('header');
            
            const title = document.createElement('h4');
            title.textContent = review.title;
            header.appendChild(title);
            
            const meta = document.createElement('div');
            meta.classList.add('review-meta');
            meta.innerHTML = `
                <span class="reviewer">${review.reviewer_name}</span> | 
                <span class="rating">${review.rating} stars</span> | 
                <span class="date">${review.date}</span>
            `;
            header.appendChild(meta);
            
            reviewEl.appendChild(header);
            
            const excerpt = document.createElement('p');
            excerpt.textContent = review.text.length > 200 
                ? review.text.substring(0, 200) + '...' 
                : review.text;
            reviewEl.appendChild(excerpt);
            
            const readMore = document.createElement('a');
            readMore.href = data.url;
            readMore.textContent = 'Read more';
            readMore.classList.add('read-more');
            readMore.target = '_blank';
            reviewEl.appendChild(readMore);
            
            reviewsList.appendChild(reviewEl);
        });
        
        // Similar Products
        const similarContainer = document.getElementById('similar-products-container');
        const similarList = document.getElementById('similar-products-list');
        similarList.innerHTML = '';
        
        if (data.similar_products && data.similar_products.length > 0) {
            similarContainer.classList.remove('hidden');
            
            data.similar_products.forEach(product => {
                const productEl = document.createElement('div');
                productEl.classList.add('similar-product');
                
                const img = document.createElement('img');
                img.src = product.image_url || 'https://via.placeholder.com/100';
                img.alt = product.title || 'Similar product';
                productEl.appendChild(img);
                
                const title = document.createElement('h4');
                title.textContent = product.title || 'Product';
                productEl.appendChild(title);
                
                similarList.appendChild(productEl);
            });
        } else {
            similarContainer.classList.add('hidden');
        }
    }

    /**
     * Shows the loading spinner and hides the form
     */
    function showLoading() {
        loadingSpinner.classList.remove('hidden');
        analyzeForm.classList.add('hidden');
        errorMessage.classList.add('hidden');
        fallbackContainer.classList.add('hidden');
    }

    /**
     * Hides the loading spinner
     */
    function hideLoading() {
        loadingSpinner.classList.add('hidden');
    }

    /**
     * Shows the results container and hides the form
     */
    function showResults() {
        resultsContainer.classList.remove('hidden');
        analyzeForm.classList.add('hidden');
        fallbackContainer.classList.add('hidden');
    }

    /**
     * Resets the UI back to the initial state
     */
    function resetUI() {
        resultsContainer.classList.add('hidden');
        analyzeForm.classList.remove('hidden');
        fallbackContainer.classList.add('hidden');
        urlInput.value = '';
    }

    /**
     * Shows an error message
     * @param {string} message - The error message to display
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
}); 