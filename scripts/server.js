/**
 * Simple HTTP server for local development
 * This helps avoid CORS issues when testing the frontend
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Port to run the server on
const PORT = 8000;

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url);
  
  // Get the path from the URL
  let pathname = path.join(__dirname, '..', parsedUrl.pathname);
  
  // Default to index.html if path is a directory
  if (pathname.endsWith('/')) {
    pathname = path.join(pathname, 'pages/index.html');
  }
  
  // Redirect root to index.html
  if (pathname === path.join(__dirname, '..')) {
    pathname = path.join(__dirname, '..', 'pages/index.html');
  }
  
  // Get the file extension
  const ext = path.extname(pathname);
  
  // Check if the file exists
  fs.stat(pathname, (err, stat) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.statusCode = 404;
        res.end(`File ${pathname} not found!`);
        return;
      }
      
      // Other server error
      res.statusCode = 500;
      res.end(`Error checking for file: ${err.code}`);
      return;
    }
    
    // If it's a directory, redirect to index.html
    if (stat.isDirectory()) {
      pathname = path.join(pathname, 'index.html');
    }
    
    // Read the file
    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error reading file: ${err.code}`);
        return;
      }
      
      // Set the content type based on file extension
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      
      // Send the file data
      res.end(data);
    });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`
========================================
🚀 Amazon Product Analyzer Server 🚀
========================================

Server started at http://localhost:${PORT}

To view the application:
👉 http://localhost:${PORT}/pages/index.html

Press Ctrl+C to stop the server
  `);
}); 