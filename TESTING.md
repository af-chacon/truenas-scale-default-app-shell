# Testing Guide for TrueNAS Shell Selector

This document outlines test cases to ensure the TrueNAS Shell Selector extension works correctly.

## Prerequisite
- Firefox browser
- Access to a TrueNAS web interface (can be a test instance or VM)

## Test Cases

### Installation Tests

1. **Basic Installation**
   - Load the extension in Firefox using `about:debugging`
   - Verify the extension icon appears in the browser toolbar
   - Expected: Extension loads without errors

2. **Extension Popup**
   - Click the extension icon in the toolbar
   - Verify the popup opens and displays shell options
   - Expected: Popup shows Bash, Sh, Zsh, and Fish options with a "Save Preference" button

### Functionality Tests

3. **Shell Preference Storage**
   - Select a shell in the popup
   - Click "Save Preference"
   - Reload the extension
   - Open the popup again
   - Expected: Previously selected shell is still selected

4. **Shell Switching in TrueNAS**
   - Open a TrueNAS web interface
   - Open a terminal in the TrueNAS UI
   - Set a shell preference using the extension
   - Expected: Terminal shell should switch to the selected shell

5. **Automatic Shell Application**
   - Set a shell preference
   - Close and reopen a terminal in TrueNAS
   - Expected: The new terminal should automatically use the preferred shell

### Error Handling Tests

6. **Connection Issues**
   - Disable network connection
   - Try to use the extension
   - Expected: Extension should handle the error gracefully and provide a user-friendly message

7. **TrueNAS Version Compatibility**
   - Test the extension with different versions of TrueNAS if available
   - Expected: Extension should work across different supported versions

## Bug Reporting

When reporting bugs, please include:
- Firefox version
- TrueNAS version
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

## Regression Testing

After any code changes, re-run all the test cases above to ensure no regressions are introduced.
