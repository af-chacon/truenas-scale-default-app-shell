// Background script for TrueNAS Shell Selector extension
import { Shell } from "./shells";

// Initialize default preferences when the extension is installed
browser.runtime.onInstalled.addListener(async (details: browser.runtime._OnInstalledDetails): Promise<void> => {
  
  if (details.reason === 'install') {
    // Set default preferences
    try {
      await browser.storage.local.set({
        shellPreference: Shell.Bash, // Default to bash
      });
      
      // Open welcome page
      await browser.tabs.create({
        url: 'https://github.com/af-chacon/truenas-scale-default-app-shell/wiki/Getting-Started'
      });
    } catch {
      // do nothing
    }
  } else if (details.reason === 'update') {
    // Update version information and preserve user preferences
    try {
      const data = await browser.storage.local.get();
      await browser.storage.local.set({
        ...data,
      });
    } catch {
      // do nothing
    }
  }
});