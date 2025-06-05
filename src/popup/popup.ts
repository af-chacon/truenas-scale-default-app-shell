// Interfaces for shell preferences and messages
interface ShellPreference {
  shellPreference?: string;
}

interface GetShellPreferenceResponse {
  success: boolean;
  shellPreference?: string;
  error?: string;
}

interface SetShellPreferenceResponse {
  success: boolean;
  error?: string;
}

interface UpdateShellMessage {
  action: 'updateShell';
  shell: string;
}

// Debug function to log popup initialization
function debugPopup(message: string, error?: any): void {
  console.log(`DEBUG POPUP: ${message}`);
  if (error) {
    console.error('DEBUG ERROR:', error);
  }
  
  // Try to show debug info in the popup itself
  const debugElement = document.createElement('div');
  debugElement.textContent = message;
  debugElement.style.color = error ? 'red' : 'blue';
  debugElement.style.padding = '5px';
  debugElement.style.margin = '5px';
  debugElement.style.border = '1px solid #ccc';
  
  // Add to body if possible
  try {
    document.body.appendChild(debugElement);
  } catch (appendError) {
    console.error('Could not append debug element:', appendError);
  }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  try {
    debugPopup('Popup DOM loaded');
    
    // Check if essential elements exist
    const container = document.querySelector('.container');
    if (!container) {
      debugPopup('Container element not found in popup HTML', new Error('Missing container'));
    }
    
    const saveButton = document.getElementById('save-btn');
    if (!saveButton) {
      debugPopup('Save button not found in popup HTML', new Error('Missing save-btn'));
    }
    
    const statusMessage = document.getElementById('status-message');
    if (!statusMessage) {
      debugPopup('Status message element not found', new Error('Missing status-message'));
    }
    
    // Try to load preferences
    debugPopup('Loading shell preference...');
    loadShellPreference();
    
    // Set up button
    debugPopup('Setting up save button...');
    setupSaveButton();
    
    // Add version info
    debugPopup('Adding version info...');
    addVersionInfo();
    
    debugPopup('Popup initialization complete');
  } catch (error) {
    debugPopup('Error during popup initialization', error);
  }
});

// Load the saved shell preference from storage
function loadShellPreference(): void {
  try {
    debugPopup('Loading shell preference directly from storage...');
    
    browser.storage.local.get('shellPreference')
      .then(result => {
        debugPopup(`Storage result: ${JSON.stringify(result)}`);
        
        const shellValue = result.shellPreference || 'bash';
        debugPopup(`Setting shell: ${shellValue}`);
        
        // Select the appropriate radio button
        const radioButton = document.querySelector(`input[value="${shellValue}"]`) as HTMLInputElement;
        if (radioButton) {
          radioButton.checked = true;
          debugPopup(`Selected ${shellValue} shell`);
        } else {
          debugPopup(`No radio button found for ${shellValue}`, new Error('Invalid shell option'));
          selectDefaultShell();
        }
      })
      .catch(error => {
        debugPopup('Error loading preference from storage', error);
        selectDefaultShell();
      });
  } catch (error) {
    debugPopup("Exception during loadShellPreference", error);
    selectDefaultShell();
  }
}

// Select the default shell (bash)
function selectDefaultShell(): void {
  try {
    const defaultElement = document.querySelector('input[value="bash"]') as HTMLInputElement;
    if (defaultElement) {
      defaultElement.checked = true;
      debugPopup("Default shell (bash) selected");
    } else {
      debugPopup("Could not find bash radio button", new Error('Missing bash option'));
    }
  } catch (error) {
    debugPopup("Exception in selectDefaultShell", error);
  }
}

// Set up the save button click handler
function setupSaveButton(): void {
  try {
    const saveButton = document.getElementById('save-btn');
    if (!saveButton) {
      debugPopup("Save button not found", new Error('Missing save-btn'));
      return;
    }
    
    saveButton.addEventListener('click', function() {
      debugPopup("Save button clicked");
      try {
        const selectedInput = document.querySelector('input[name="shell"]:checked') as HTMLInputElement;
        if (!selectedInput) {
          showStatusMessage("Please select a shell", "error");
          debugPopup("No shell selected", new Error('No selection'));
          return;
        }
        
        const selectedShell = selectedInput.value.toLowerCase();
        debugPopup(`Shell selected: ${selectedShell}`);
        saveShellPreference(selectedShell);
      } catch (error) {
        debugPopup("Error in save button handler", error);
      }
    });
    
    debugPopup("Save button handler set up successfully");
  } catch (error) {
    debugPopup("Exception in setupSaveButton", error);
  }
}

// Save the shell preference to storage and notify active tab
function saveShellPreference(selectedShell: string): void {
  try {
    const statusMessage = document.getElementById('status-message');
    if (!statusMessage) {
      debugPopup("Status message element not found", new Error('Missing status-message'));
      return;
    }

    debugPopup(`Saving shell preference directly to storage: ${selectedShell}`);

    // Save preference directly to storage
    browser.storage.local.set({ 
      shellPreference: selectedShell,
      lastUsed: Date.now()
    })
    .then(() => {
      debugPopup(`Successfully saved ${selectedShell} preference to storage`);
      showStatusMessage("Preference saved!", "success");
      
      // Try to notify active tab
      try {
        notifyActiveTabIfPossible(selectedShell);
      } catch (error) {
        debugPopup("Non-critical error notifying tab:", error);
      }
    })
    .catch(error => {
      debugPopup("Error saving preference to storage", error);
      showStatusMessage('Error: ' + (error.message || "Unknown error"), "error");
    });
  } catch (error) {
    debugPopup("Exception in saveShellPreference", error);
  }
}

// Notify active tab if it's a TrueNAS page
async function notifyActiveTabIfPossible(selectedShell: string): Promise<void> {
  try {
    debugPopup(`Attempting to notify active tab about shell: ${selectedShell}`);
    const tabs = await browser.tabs.query({active: true, currentWindow: true});
    
    if (tabs.length === 0) {
      debugPopup("No active tab found", new Error('No active tab'));
      return;
    }
    
    // Check if it's a TrueNAS page
    const url = tabs[0].url || '';
    debugPopup(`Found active tab: ${url}`);
    
    // Only try to send message to TrueNAS pages
    if (!url.match(/truenas\.(com|local)/) && !url.match(/scale\.lan/) && !url.match(/localhost/)) {
      debugPopup("Not a TrueNAS page, skipping content script notification");
      return;
    }
    
    // Send message to content script
    const message: UpdateShellMessage = {
      action: 'updateShell',
      shell: selectedShell
    };
    
    browser.tabs.sendMessage(tabs[0].id as number, message)
      .then(response => {
        debugPopup(`Content script response: ${response}`);
        if (response === true) {
          showStatusMessage("Shell preference applied to TrueNAS!", "success");
        }
      })
      .catch(error => {
        debugPopup("Error sending message to tab (likely not a TrueNAS page)", error);
      });
  } catch (error) {
    debugPopup("Exception in notifyActiveTabIfPossible", error);
  }
}

// Show a status message with the specified type (success, error, warning)
function showStatusMessage(message: string, type: "success" | "error" | "warning"): void {
  try {
    const statusMessage = document.getElementById('status-message');
    if (!statusMessage) {
      debugPopup("Status message element not found", new Error('Missing status-message'));
      return;
    }
    
    debugPopup(`Showing status message: ${message} (${type})`);
    
    statusMessage.textContent = message;
    
    // Set appropriate color based on message type
    switch (type) {
      case "success":
        statusMessage.style.color = '#4CAF50'; // Green
        break;
      case "error":
        statusMessage.style.color = '#f44336'; // Red
        break;
      case "warning":
        statusMessage.style.color = '#ff9800'; // Orange
        break;
    }
    
    // Clear status message after 3 seconds
    setTimeout(function() {
      if (statusMessage) {
        statusMessage.textContent = '';
        debugPopup("Cleared status message");
      }
    }, 3000);
  } catch (error) {
    debugPopup("Exception in showStatusMessage", error);
  }
}

// Add version information to the popup
function addVersionInfo(): void {
  try {
    debugPopup("Adding version info directly");
    
    // Hardcoded version for simplicity
    const version = '1.0.0';
    
    const infoPanel = document.querySelector('.info-panel');
    if (infoPanel) {
      const versionInfo = document.createElement('p');
      versionInfo.className = 'version-info';
      versionInfo.textContent = `Version: ${version}`;
      versionInfo.style.fontSize = '10px';
      versionInfo.style.color = '#888';
      versionInfo.style.textAlign = 'right';
      versionInfo.style.marginTop = '10px';
      infoPanel.appendChild(versionInfo);
      debugPopup(`Added version info: ${version}`);
    } else {
      debugPopup("Info panel not found", new Error('Missing info-panel'));
    }
  } catch (error) {
    debugPopup("Exception in addVersionInfo", error);
  }
}