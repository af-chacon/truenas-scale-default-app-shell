// Background script for TrueNAS Shell Selector extension

// Initialize default preferences when the extension is installed
browser.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    browser.storage.local.set({
      shellPreference: 'bash' // Default shell
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
  }
});
