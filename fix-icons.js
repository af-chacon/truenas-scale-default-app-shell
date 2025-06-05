#!/usr/bin/env node
/**
 * This script checks if the icon files are valid PNGs
 * and creates placeholder icons if they don't exist or are corrupted
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Icon sizes and paths
const icons = [
  { size: 19, path: 'src/icons/icon-19.png' },
  { size: 38, path: 'src/icons/icon-38.png' },
  { size: 48, path: 'src/icons/icon-48.png' },
  { size: 96, path: 'src/icons/icon-96.png' }
];

// Function to check if a file is a valid PNG
function isValidPNG(filePath) {
  try {
    // Simple PNG signature check (first 8 bytes)
    const buffer = Buffer.alloc(8);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);
    
    const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    return buffer.equals(pngSignature);
  } catch (error) {
    return false;
  }
}

// Check each icon and create placeholders if needed
icons.forEach(icon => {
  const iconPath = path.join(__dirname, icon.path);
  
  if (!fs.existsSync(iconPath) || !isValidPNG(iconPath)) {
    console.log(`Creating placeholder icon: ${icon.path}`);
    
    try {
      // Check if ImageMagick is installed
      execSync('which convert', { stdio: 'ignore' });
      
      // Create a simple placeholder icon using ImageMagick
      const command = `convert -size ${icon.size}x${icon.size} xc:transparent -fill "#0078d7" -draw "circle ${icon.size/2},${icon.size/2} ${icon.size/2},${icon.size*0.25}" -fill white -draw "text ${icon.size*0.3},${icon.size*0.6} 'T'" ${iconPath}`;
      
      // Ensure the directory exists
      const dir = path.dirname(iconPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Create the icon
      execSync(command);
      console.log(`Created icon: ${icon.path}`);
    } catch (error) {
      console.error(`Error creating icon ${icon.path}: ${error.message}`);
      console.log('ImageMagick might not be installed. Please install it or create icons manually.');
      
      // Create an empty PNG file as fallback
      try {
        // Ensure the directory exists
        const dir = path.dirname(iconPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Create a minimal valid PNG (1x1 transparent pixel)
        const minimalPNG = Buffer.from([
          0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 
          0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 
          0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 
          0x0A, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0x60, 0x00, 0x00, 0x00, 
          0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33, 0x00, 0x00, 0x00, 0x00, 0x49, 
          0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        
        fs.writeFileSync(iconPath, minimalPNG);
        console.log(`Created minimal PNG placeholder for ${icon.path}`);
      } catch (fallbackError) {
        console.error(`Failed to create fallback icon: ${fallbackError.message}`);
      }
    }
  } else {
    console.log(`Icon ${icon.path} exists and is valid.`);
  }
});

console.log('Icon check complete.');
