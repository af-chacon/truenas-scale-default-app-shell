// Function to set the shell preference in TrueNAS SCALE UI
function setShellPreference(shell: string, commandInput?: HTMLInputElement): boolean {
  console.log('Setting shell preference to:', shell);
  
  if (!commandInput) {
    const input = document.querySelector('input[data-test="input-command"]') as HTMLInputElement | null;
    commandInput = input !== null ? input : undefined;
    if (!commandInput) {
      console.error('TrueNAS Shell Selector: Command input not found');
      return false;
    }
  }
  
  try {
    // Focus the command input
    commandInput.focus();
    
    // Set the value of the input field
    commandInput.value = shell;
    
    // Dispatch input event to ensure TrueNAS recognizes the change
    const inputEvent = new Event('input', { bubbles: true });
    commandInput.dispatchEvent(inputEvent);
    
    // Find the submit button
    const submitButton = document.querySelector('button[data-test="button-choose-pool"]') as HTMLButtonElement | null;
    if (submitButton) {
      // Use requestAnimationFrame instead of setTimeout for better performance
      requestAnimationFrame(() => {
        if (submitButton) {
          console.log('TrueNAS Shell Selector: Clicking submit button');
          submitButton.click();
        }
      });
    } else {
      console.error('TrueNAS Shell Selector: Submit button not found');
    }
    
    return true;
  } catch (error) {
    console.error('TrueNAS Shell Selector: Error setting shell preference', error);
    return false;
  }
}