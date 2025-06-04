# Debugging the TrueNAS Shell Selector Extension

This document provides information on how to debug and test the TrueNAS Shell Selector extension during development.

## Loading the Extension in Firefox

1. Open Firefox
2. Navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Browse to your extension directory and select the `manifest.json` file

The extension will now be loaded and can be debugged.

## Debugging Tools

### Console Logs

You can view console logs from your extension in the Browser Console:

1. Press `Ctrl+Shift+J` (or `Cmd+Shift+J` on macOS) to open the Browser Console
2. Look for messages from your extension

### Inspecting the Popup

To inspect the extension popup:

1. Right-click on the extension icon in the toolbar
2. Select "Inspect"
3. This will open the DevTools panel focused on the popup

### Content Script Debugging

To debug the content scripts:

1. Open the target website (TrueNAS web interface)
2. Press F12 to open DevTools
3. Go to the "Debugger" panel
4. Find your content script in the sources list
5. Set breakpoints as needed

## Reloading the Extension

After making changes to your extension:

1. Go back to `about:debugging`
2. Find your extension in the list
3. Click "Reload"

## Testing Shell Switching

To test shell switching functionality:

1. Open a TrueNAS web interface
2. Open a terminal in the TrueNAS UI
3. Click the TrueNAS Shell Selector extension icon
4. Select a shell and click "Save Preference"
5. Verify that the shell is switched correctly

## Troubleshooting

### Extension Not Loading

- Make sure your `manifest.json` file is valid
- Check the Browser Console for any error messages

### Shell Not Switching

- Check the Browser Console for error messages
- Inspect the DOM structure of the TrueNAS terminal to ensure selectors in the content script match
- Try manually entering the shell switching command in the terminal to verify it works

### Popup Not Displaying Correctly

- Check for CSS or HTML errors in the popup files
- Verify that all required files are being loaded correctly
