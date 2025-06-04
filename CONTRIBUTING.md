# Contributing to TrueNAS Shell Selector

Thank you for considering contributing to the TrueNAS Shell Selector Firefox extension! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Firefox Browser
- Node.js and npm (for development tools)
- Basic knowledge of JavaScript and Firefox WebExtensions API

### Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd TrueNas-shell-selector
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the extension in Firefox:
   ```
   npm start
   ```

## Project Structure

- `manifest_v2/` - Contains the Manifest V2 version of the extension (better supported in Firefox)
- `manifest_v3/` - Contains the Manifest V3 version for future compatibility
- `popup/` - Contains the extension popup UI files
- `content_scripts/` - Contains scripts that interact with TrueNAS web pages
- `background/` - Contains background scripts for the extension
- `icons/` - Contains extension icons

## Development Workflow

1. Make your changes to the code
2. Test the extension using `npm start` or the VS Code task "web-ext: run"
3. Lint your code using `npm run lint` or the VS Code task "web-ext: lint"
4. Build the extension using `npm run build` or the VS Code task "web-ext: build"
5. Submit a pull request with your changes

## Testing

When testing the extension, ensure it works properly with:

1. TrueNAS SCALE UI
2. Different shell selections (bash, sh, zsh, fish)
3. Various browsers (Firefox is primary, but cross-browser compatibility is a plus)

## TrueNAS SCALE UI Integration

This extension specifically targets the TrueNAS SCALE web interface. It looks for:

- The input field with `data-test="input-command"` attribute
- The submit button with `data-test="button-choose-pool"` attribute

If the TrueNAS UI changes, the selectors in `content_scripts/shell-selector.js` may need to be updated.

## Coding Standards

- Use modern JavaScript features
- Follow the existing code style
- Use the Firefox `browser.*` namespace instead of Chrome's `chrome.*`
- Add comments to explain complex functionality
- Ensure error handling for all browser API calls

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the version number in manifest.json files following [SemVer](http://semver.org/)
3. Your PR will be reviewed by the maintainers
4. Once approved, your changes will be merged

## Firefox Add-on Policies

Ensure all contributions comply with [Firefox Add-on Policies](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/AMO/Policy)