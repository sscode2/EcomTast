const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create the HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  // Parse the URL to handle query parameters correctly
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Handle the root path
  if (pathname === '/') {
    pathname = '/Admin/admin.html';
  }
  
  // Handle URL decoding for spaces and special characters
  pathname = decodeURIComponent(pathname);
  
  // Special handling for UserPanel path (previously "User panel")
  if (pathname.startsWith('/User%20panel/')) {
    pathname = '/UserPanel/' + pathname.substring(15);
  }
  
  console.log(`Resolved pathname: ${pathname}`);
  
  // Resolve the file path
  let filePath = path.join(process.cwd(), pathname);
  
  console.log(`File path: ${filePath}`);
  
  // Get the file extension
  const extname = path.extname(filePath).toLowerCase();
  
  // Set the content type based on the file extension
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        console.log(`File not found: ${filePath}`);
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        // Server error
        console.log(`Server error: ${err.code}`);
        res.writeHead(500);
        res.end('500 Internal Server Error');
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Admin panel: http://localhost:${PORT}/Admin/admin.html`);
  console.log(`User panel: http://localhost:${PORT}/UserPanel/user.html`);
});