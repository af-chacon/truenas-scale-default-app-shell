// This content script runs on TrueNAS web pages
// It will set the shell preference when a shell terminal is opened

// Listen for shell preference updates from the popup
browser.runtime.onMessage.addListener(function(message) {
  if (message.action === 'updateShell') {
    setShellPreference(message.shell);
  }
});

// Listen for DOM changes to detect when a terminal is opened
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const node = mutation.addedNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Look for terminal elements
          // This selector will need to be adjusted based on TrueNAS web UI structure
          const terminalElements = node.querySelectorAll('.terminal-container, xterm-terminal');
          if (terminalElements.length > 0) {
            applyShellPreference();
          }
        }
      }
    }
  });
});

// Configure the observer to watch for changes to the body and its descendants
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Apply the shell preference when a terminal is detected
function applyShellPreference() {
  browser.storage.local.get('shellPreference', function(result) {
    if (result.shellPreference) {
      setShellPreference(result.shellPreference);
    }
  });
}

// Function to actually set the shell preference in TrueNAS
function setShellPreference(shell) {
  // This implementation will need to be adjusted based on how TrueNAS handles shell selection
  // For example, it might need to find a shell selector dropdown or button and click it,
  // or it might need to enter a command to change the shell
  
  console.log('Setting shell preference to:', shell);
  
  // Example implementation - find terminal input and type a shell change command
  const terminalInputs = document.querySelectorAll('.xterm-helper-textarea, .terminal-input');
  if (terminalInputs.length > 0) {
    const input = terminalInputs[0];
    
    // Focus the terminal
    input.focus();
    
    // Create and dispatch keyboard events to type the command
    const shellCommand = `exec ${shell}\n`;
    
    // This is a simplistic approach - in a real implementation, you'd want to
    // use the proper APIs to interact with the terminal
    document.execCommand('insertText', false, shellCommand);
  }
}
