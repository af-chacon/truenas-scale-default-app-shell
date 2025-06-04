#!/usr/bin/env node
/**
 * Utility script to add new localhost port entries to all manifest files
 * Usage: node add-localhost-port.js <port>
 * Example: node add-localhost-port.js 9090
 */

const fs = require('fs');
const path = require('path');

// Files to update
const manifestFiles = [
  'manifest.json',
  'manifest_v2/manifest.json',
  'manifest_v3/manifest.json'
];

// Get port from command line arguments
const port = process.argv[2];

if (!port || isNaN(parseInt(port))) {
  console.error('Please provide a valid port number');
  console.error('Usage: node add-localhost-port.js <port>');
  process.exit(1);
}

// Add HTTP and HTTPS entries for the port
const httpEntry = `"http://localhost:${port}/*"`;
const httpsEntry = `"https://localhost:${port}/*"`;

// Process each manifest file
manifestFiles.forEach(manifestFile => {
  const filePath = path.join(__dirname, manifestFile);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the matches array in the content_scripts section
  const matchesRegex = /"matches":\s*\[([\s\S]*?)\]/;
  const matchesMatch = content.match(matchesRegex);
  
  if (!matchesMatch) {
    console.warn(`Could not find matches array in ${filePath}`);
    return;
  }
  
  // Get the current matches array content
  let matchesContent = matchesMatch[1];
  
  // Check if the port entries already exist
  if (matchesContent.includes(httpEntry) || matchesContent.includes(httpsEntry)) {
    console.warn(`Port ${port} is already in ${filePath}`);
    return;
  }
  
  // Add the new entries
  matchesContent = matchesContent.trim();
  if (matchesContent.endsWith(',')) {
    matchesContent += `\n        ${httpEntry},\n        ${httpsEntry},`;
  } else {
    matchesContent += `,\n        ${httpEntry},\n        ${httpsEntry}`;
  }
  
  // Replace the matches array in the content
  const updatedContent = content.replace(matchesRegex, `"matches": [${matchesContent}]`);
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  
  console.log(`Added port ${port} to ${filePath}`);
});

console.log('Done!');