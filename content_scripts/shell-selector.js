// This content script runs on TrueNAS SCALE web pages
// It will set the shell preference when the terminal input field is detected

// Listen for shell preference updates from the popup
browser.runtime.onMessage.addListener(function(message) {
  if (message.action === 'updateShell') {
    setShellPreference(message.shell);
  }
});

// Listen for DOM changes to detect when the command input field appears
const observer = new MutationObserver(function(mutations) {
  checkForCommandInput();
});

// Configure the observer to watch for changes to the body and its descendants
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
});

// Initial check when the page loads
document.addEventListener('DOMContentLoaded', function() {
  checkForCommandInput();
});

// Check for the command input field in the applications tab
function checkForCommandInput() {
  // Look for the specific input element with the data-test attribute
  const commandInput = document.querySelector('input[data-test="input-command"]');
  if (commandInput) {
    console.log('TrueNAS Shell Selector: Command input detected');
    applyShellPreference(commandInput);
  }
}

// Apply the shell preference when the command input is detected
function applyShellPreference(commandInput) {
  browser.storage.local.get('shellPreference', function(result) {
    if (result.shellPreference) {
      setShellPreference(result.shellPreference, commandInput);
    } else {
      // Default to bash if no preference is set
      setShellPreference('bash', commandInput);
    }
  });
}

// Function to set the shell preference in TrueNAS SCALE UI
function setShellPreference(shell, commandInput) {
  console.log('Setting shell preference to:', shell);
  
  if (!commandInput) {
    commandInput = document.querySelector('input[data-test="input-command"]');
    if (!commandInput) {
      console.error('TrueNAS Shell Selector: Command input not found');
      return false;
    }
  }
  
  // Focus the command input
  commandInput.focus();
  
  // Set the value of the input field
  commandInput.value = shell;
  
  // Dispatch input event to ensure TrueNAS recognizes the change
  commandInput.dispatchEvent(new Event('input', { bubbles: true }));
  
  // Find and click the submit button
  setTimeout(() => {
    const submitButton = document.querySelector('button[data-test="button-choose-pool"]');
    if (submitButton) {
      console.log('TrueNAS Shell Selector: Clicking submit button');
      submitButton.click();
    } else {
      console.error('TrueNAS Shell Selector: Submit button not found');
    }
  }, 500); // Short delay to ensure the input value is registered
  
  return true;
}

// Add a helper function to detect if we're in the applications tab
function isInApplicationsTab() {
  // This is a simple check that might need to be adjusted based on the actual URL structure
  const url = window.location.href;
  return url.includes('/apps') || url.includes('/applications');
}
