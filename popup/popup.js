document.addEventListener('DOMContentLoaded', function() {
  // Load saved shell preference
  browser.storage.local.get('shellPreference', function(result) {
    if (result.shellPreference) {
      document.querySelector(`input[value="${result.shellPreference}"]`).checked = true;
    } else {
      // Default to bash if no preference is set
      document.querySelector('input[value="bash"]').checked = true;
    }
  });

  // Save button click handler
  document.getElementById('save-btn').addEventListener('click', function() {
    const selectedShell = document.querySelector('input[name="shell"]:checked').value;
    const statusMessage = document.getElementById('status-message');
    
    // Save to storage
    browser.storage.local.set({
      shellPreference: selectedShell
    }, function() {
      // Update status message
      statusMessage.textContent = 'Preference saved!';
      
      // Notify content script to update the shell
      browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length === 0) {
          statusMessage.textContent = 'No active tab found';
          statusMessage.style.color = '#f44336'; // Red for error
          return;
        }
        
        try {
          browser.tabs.sendMessage(tabs[0].id, {
            action: 'updateShell',
            shell: selectedShell
          }, function(response) {
            if (browser.runtime.lastError) {
              console.error("Error sending message:", browser.runtime.lastError);
              statusMessage.textContent = 'Not on a TrueNAS page';
              statusMessage.style.color = '#f44336'; // Red for error
            } else {
              statusMessage.textContent = 'Shell preference applied!';
              statusMessage.style.color = '#4CAF50'; // Green for success
            }
          });
        } catch (error) {
          console.error("Error:", error);
          statusMessage.textContent = 'Error: ' + error.message;
          statusMessage.style.color = '#f44336'; // Red for error
        }
        
        // Clear status message after 3 seconds
        setTimeout(function() {
          statusMessage.textContent = '';
          statusMessage.style.color = '#4CAF50'; // Reset to success color
        }, 3000);
      });
    });
  });
});
