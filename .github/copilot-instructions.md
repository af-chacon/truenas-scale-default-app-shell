<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# TrueNAS Shell Selector Firefox Extension

This is a Firefox extension project that allows users to select and switch between different shells in TrueNAS web interface.

## Project Structure
- `manifest_v2/` - Contains the Manifest V2 version of the extension (better supported in Firefox)
- `manifest_v3/` - Contains the Manifest V3 version for future compatibility
- `popup/` - Contains the extension popup UI files
- `content_scripts/` - Contains scripts that interact with TrueNAS web pages
- `background/` - Contains background scripts for the extension
- `icons/` - Contains extension icons

## Development Focus
- Firefox extension APIs using the WebExtensions API
- DOM manipulation for interacting with TrueNAS web UI
- Web storage for saving user preferences

## When suggesting code:
- Use the Firefox browser.* namespace instead of chrome.* for browser APIs
- Focus on robust shell selection and switching in TrueNAS web terminal
- Provide proper error handling for terminal interactions
