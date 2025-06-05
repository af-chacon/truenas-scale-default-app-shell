// Custom script to create minimal valid PNG icons
// This is a fallback for when ImageMagick is not available

const fs = require('fs');
const path = require('path');

// Icon sizes
const iconSizes = [19, 38, 48, 96];

// Create a basic minimal valid PNG (1x1 transparent pixel)
const minimalPNG = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 
  0x0A, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0x60, 0x00, 0x00, 0x00, 
  0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33, 0x00, 0x00, 0x00, 0x00, 0x49, 
  0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
]);

// Create the icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'src', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create each icon
iconSizes.forEach(size => {
  const iconPath = path.join(iconsDir, `icon-${size}.png`);
  fs.writeFileSync(iconPath, minimalPNG);
  console.log(`Created minimal PNG placeholder: ${iconPath}`);
});

// Create the dist/icons directory if it doesn't exist
const distIconsDir = path.join(__dirname, 'dist', 'icons');
if (!fs.existsSync(distIconsDir)) {
  fs.mkdirSync(distIconsDir, { recursive: true });
}

// Copy icons to dist directory
iconSizes.forEach(size => {
  const iconPath = path.join(iconsDir, `icon-${size}.png`);
  const distIconPath = path.join(distIconsDir, `icon-${size}.png`);
  fs.copyFileSync(iconPath, distIconPath);
  console.log(`Copied icon to dist: ${distIconPath}`);
});

console.log('Icon creation and copying complete.');
