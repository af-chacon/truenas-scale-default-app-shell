// This content script runs on TrueNAS SCALE web pages
// It will set the shell preference when the terminal input field is detected

import { Shell } from "../background/shells";

// Listen for DOM changes to detect when the command input field appears
const observer = new MutationObserver((mutationList: MutationRecord[]): void => {
  checkForCommandInput(mutationList);
});

// Configure the observer to watch for changes to the body and its descendants
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
});

// Check for the command input field in the applications tab
function checkForCommandInput(mutationList: MutationRecord[]): void {
  // Check if we're in the applications tab
  if (!isInApplicationsTab()) {
    return;
  }
  
  // Look for the specific input element with the data-test attribute
  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      for (const node of mutation.addedNodes){
        if (!(node instanceof HTMLElement)) {
          continue; // Skip non-HTMLElement nodes
        }
        const commandInput = node.querySelector('input[data-test="input-command"]') as HTMLInputElement | null;
        if (commandInput) {
          applyShellPreference(commandInput);
          break; // Stop checking further once we find the input
        }
      }
    }
  }
}

// Apply the shell preference when the command input is detected
function applyShellPreference(commandInput: HTMLInputElement): void {
  browser.storage.local.get('shellPreference')
    .then((result: { [key: string]: unknown }) => {
      const shell = typeof result.shellPreference === 'string' ? result.shellPreference : Shell.Bash;
      setShellPreference(shell, commandInput);
    })
    .catch(() => {
      // Default to bash on error
      setShellPreference(Shell.Bash, commandInput);
    });
}

// Function to set the shell preference in TrueNAS SCALE UI
function setShellPreference(shell: string, commandInput?: HTMLInputElement): boolean {
  
  if (!commandInput) {
    return false; // Ensure commandInput is provided
  }
  
  try {
    // Focus the command input
    commandInput.focus();
    
    // Set the value of the input field
    commandInput.value = `/bin/${shell}`;
    
    // Dispatch input event to ensure TrueNAS recognizes the change
    commandInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Find and click the submit button
    setTimeout((): void => {
      const submitButton = document.querySelector('button[data-test="button-choose-pool"]') as HTMLButtonElement | null;
      if (submitButton) {
        console.log('TrueNAS Shell Selector: Clicking submit button');
        submitButton.click();
      } else {
        console.error('TrueNAS Shell Selector: Submit button not found');
      }
    }, 500); // Short delay to ensure the input value is registered
    
    return true;
  } catch (error) {
    console.error('TrueNAS Shell Selector: Error setting shell preference', error);
    return false;
  }
}

// Add a helper function to detect if we're in the applications tab
function isInApplicationsTab(): boolean {
  const url = window.location.href;
  return url.includes('/apps') || 
        url.includes('/applications') || 
        url.includes('/shell');
}