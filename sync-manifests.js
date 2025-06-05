#!/usr/bin/env node
/**
 * Synchronize manifest files to ensure they stay in sync
 * This script updates all manifest files based on the root manifest.json
 */

const fs = require('fs');
const path = require('path');

// Files to update
const sourceManifest = 'manifest.json';
const targetManifests = [
  'manifest_v2/manifest.json',
  'manifest_v3/manifest.json'
];

// Read the source manifest
console.log(`Reading source manifest: ${sourceManifest}`);
const sourceContent = fs.readFileSync(sourceManifest, 'utf8');
const sourceData = JSON.parse(sourceContent);

// Process each target manifest
targetManifests.forEach(targetFile => {
  console.log(`Updating target manifest: ${targetFile}`);
  const targetPath = path.join(__dirname, targetFile);
  
  if (!fs.existsSync(targetPath)) {
    console.warn(`File not found: ${targetPath}`);
    return;
  }
  
  const targetContent = fs.readFileSync(targetPath, 'utf8');
  const targetData = JSON.parse(targetContent);
  
  // Keep the target manifest_version as is
  const manifestVersion = targetData.manifest_version;
  
  // For manifest V3, convert browser_action to action
  if (manifestVersion === 3) {
    // Create a deep copy of the source data
    const updatedData = JSON.parse(JSON.stringify(sourceData));
    
    // Change manifest_version to 3
    updatedData.manifest_version = 3;
    
    // Replace browser_action with action
    if (updatedData.browser_action) {
      updatedData.action = updatedData.browser_action;
      delete updatedData.browser_action;
    }
    
    // Replace background scripts with service_worker
    if (updatedData.background && updatedData.background.scripts) {
      const backgroundScript = updatedData.background.scripts[0];
      updatedData.background = {
        service_worker: backgroundScript
      };
    }
    
    // Write the updated data back to the file
    fs.writeFileSync(targetPath, JSON.stringify(updatedData, null, 2));
  } else {
    // For manifest V2, just copy most fields but keep the manifest_version
    const updatedData = JSON.parse(JSON.stringify(sourceData));
    updatedData.manifest_version = manifestVersion;
    fs.writeFileSync(targetPath, JSON.stringify(updatedData, null, 2));
  }
  
  console.log(`Updated ${targetFile}`);
});

console.log('Manifest synchronization complete.');
