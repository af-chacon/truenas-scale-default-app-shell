// Background script for TrueNAS Shell Selector extension

// Extension version - should match manifest
const EXTENSION_VERSION = '1.0.0';

// Default shell to use if none is set
const DEFAULT_SHELL = 'bash';

// Shell options available in the extension
const AVAILABLE_SHELLS = ['bash', 'sh', 'zsh', 'fish'];

// Message type definitions
interface GetShellPreferenceMessage {
  action: 'getShellPreference';
}

interface SetShellPreferenceMessage {
  action: 'setShellPreference';
  shell: string;
}

interface LogActivityMessage {
  action: 'logActivity';
  data: any;
}

interface CheckVersionMessage {
  action: 'checkVersion';
}

type Message = 
  | GetShellPreferenceMessage 
  | SetShellPreferenceMessage
  | LogActivityMessage
  | CheckVersionMessage;

// Storage type definitions
interface StorageData {
  shellPreference?: string;
  extensionVersion?: string;
  lastUsed?: number;
}

// Initialize default preferences when the extension is installed
browser.runtime.onInstalled.addListener(async (details: browser.runtime._OnInstalledDetails): Promise<void> => {
  console.log('TrueNAS Shell Selector installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // Set default preferences
    try {
      await browser.storage.local.set({
        shellPreference: DEFAULT_SHELL,
        extensionVersion: EXTENSION_VERSION,
        lastUsed: Date.now()
      });
      console.log('Default preferences set');
      
      // Open welcome page
      await browser.tabs.create({
        url: 'https://github.com/af-chacon/truenas-scale-default-app-shell/wiki/Getting-Started'
      });
    } catch (error) {
      console.error('Error setting default preferences:', error);
    }
  } else if (details.reason === 'update') {
    // Update version information and preserve user preferences
    try {
      const data = await browser.storage.local.get();
      await browser.storage.local.set({
        ...data,
        extensionVersion: EXTENSION_VERSION,
        lastUsed: Date.now()
      });
      console.log('Extension updated to version', EXTENSION_VERSION);
    } catch (error) {
      console.error('Error updating version information:', error);
    }
  }
});

// Listen for messages from content scripts or popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background script received message:', message);
  console.log('Sender:', sender);
  
  try {
    switch (message.action) {
      case 'getShellPreference':
        console.log('Handling getShellPreference');
        // Direct storage access instead of async handler
        browser.storage.local.get('shellPreference').then(result => {
          console.log('Retrieved shell preference:', result);
          sendResponse({
            success: true,
            shellPreference: result.shellPreference || DEFAULT_SHELL
          });
        }).catch(error => {
          console.error('Error getting shell preference:', error);
          sendResponse({
            success: false,
            error: 'Failed to get preference',
            shellPreference: DEFAULT_SHELL
          });
        });
        return true; // Required for asynchronous sendResponse
        
      case 'saveShellPreference':
        console.log('Handling saveShellPreference with shell:', message.shell);
        // Direct storage access instead of async handler
        browser.storage.local.set({ 
          shellPreference: message.shell,
          lastUsed: Date.now() 
        }).then(() => {
          console.log('Shell preference saved:', message.shell);
          sendResponse({ success: true });
        }).catch(error => {
          console.error('Error saving shell preference:', error);
          sendResponse({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        });
        return true;
        
      case 'checkVersion':
        console.log('Handling checkVersion');
        sendResponse({
          success: true,
          currentVersion: EXTENSION_VERSION,
          storedVersion: EXTENSION_VERSION
        });
        return true;
        
      default:
        console.warn('Unknown message action:', message.action);
        sendResponse({ success: false, error: 'Unknown action' });
        return false;
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ success: false, error: 'Internal error' });
    return false;
  }
});