import { Shell } from "../background/shells";
import { getErrorMessage } from "../helpers/ErrorHelper";

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  try {
    loadShellPreference();
    setupSaveButton();
  } catch (error) {
    const msg: string = getErrorMessage(error);
    console.error("Error during popup initialization", msg);
    showStatusMessage("Error initializing popup: " + (getErrorMessage(msg) ?? "Unknown error"), "error");
  }
});

// Load the saved shell preference from storage
function loadShellPreference(): void {
  try {
    
    browser.storage.local.get('shellPreference')
      .then(result => {        
        const storedShell = result.shellPreference as string | undefined;
        const shellValue: Shell = Shell[(storedShell as keyof typeof Shell)] ?? Shell.Bash;

        // Select the appropriate radio button
        const radioButton = document.querySelector(`input[value="${shellValue}"]`) as HTMLInputElement;
        if (radioButton) {
          radioButton.checked = true;
        } else {
          selectDefaultShell();
        }
      })
      .catch(() => {
        selectDefaultShell();
      });
  } catch {
    selectDefaultShell();
  }
}

// Select the default shell (bash)
function selectDefaultShell(): void {
  try {
    const defaultElement = document.querySelector('input[value="bash"]') as HTMLInputElement;
    if (defaultElement) {
      defaultElement.checked = true;
    }
  } catch {
    // do nothing
  }
}

// Set up the save button click handler
function setupSaveButton(): void {
  try {
    const saveButton = document.getElementById('save-btn');
    if(!saveButton) {
      return;
    }
    saveButton.addEventListener('click', function() {
      try {
        const selectedInput = document.querySelector('input[name="shell"]:checked') as HTMLInputElement;
        if (!selectedInput) {
          showStatusMessage("Please select a shell", "error");
          return;
        }
        
        const selectedShell = selectedInput.value.toLowerCase();
        saveShellPreference(selectedShell);
      } catch {
        // do nothing
      }
    });
    
  } catch {
        // do nothing
      }
}

// Save the shell preference to storage and notify active tab
function saveShellPreference(selectedShell: string): void {
  try {
    const statusMessage = document.getElementById('status-message');
    if (!statusMessage) {
      return;
    }

    // Save preference directly to storage
    browser.storage.local.set({ 
      shellPreference: selectedShell,
      lastUsed: Date.now()
    })
    .then(() => {
      showStatusMessage("Preference saved!", "success");
    })
    .catch(error => {
      showStatusMessage('Error: ' + (error.message || "Unknown error"), "error");
    });
  } catch {
        // do nothing
  }
}

// Show a status message with the specified type (success, error, warning)
function showStatusMessage(message: string, type: "success" | "error" | "warning"): void {
  try {
    const statusMessage = document.getElementById('status-message');
    if (!statusMessage) {
      return;
    }
      
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
      }
    }, 3000);
  } catch {
        // do nothing
  }
}