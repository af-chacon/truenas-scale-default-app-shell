// Background script for TrueNAS Shell Selector extension

// Extension version
const EXTENSION_VERSION = '1.0.0';

// Initialize default preferences when the extension is installed
browser.runtime.onInstalled.addListener(function(details) {
  console.log('TrueNAS Shell Selector installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // Set default preferences
    browser.storage.local.set({
      shellPreference: 'bash', // Default shell
      extensionVersion: EXTENSION_VERSION
    }).then(() => {
      console.log('Default preferences set');
    }).catch(error => {
      console.error('Error setting default preferences:', error);
    });
    
    // Open welcome page
    browser.tabs.create({
      url: 'https://github.com/af-chacon/truenas-scale-default-app-shell/wiki/Getting-Started'
    });
  } else if (details.reason === 'update') {
    // Update version information
    browser.storage.local.set({
      extensionVersion: EXTENSION_VERSION
    });
  }
});

// Listen for messages from content scripts or popup
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'getShellPreference') {
    browser.storage.local.get('shellPreference', function(result) {
      sendResponse(result.shellPreference || 'bash');
    });
    return true; // Required for asynchronous sendResponse
  } else if (message.action === 'logActivity') {
    console.log('Activity log:', message.data);
    sendResponse({ success: true });
    return true;
  }
});
