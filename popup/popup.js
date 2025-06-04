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
    
    // Save to storage
    browser.storage.local.set({
      shellPreference: selectedShell
    }, function() {
      // Update status message
      const statusMessage = document.getElementById('status-message');
      statusMessage.textContent = 'Preference saved!';
      
      // Clear status message after 2 seconds
      setTimeout(function() {
        statusMessage.textContent = '';
      }, 2000);
      
      // Notify content script to update the shell
      browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
          action: 'updateShell',
          shell: selectedShell
        });
      });
    });
  });
});
