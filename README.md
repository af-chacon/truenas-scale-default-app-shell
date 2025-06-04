# TrueNAS Shell Selector

A Firefox extension that allows you to select and switch between different shells in the TrueNAS web interface.

## Features

- Easily switch between Bash, Sh, Zsh, and Fish shells
- Persistent shell preference storage
- Automatic shell switching when opening a TrueNAS terminal
- Simple, user-friendly interface

## Installation

### Development Installation

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Navigate to your extension folder and select the `manifest.json` file from the `manifest_v2` directory

### Production Installation

*Coming soon* - The extension will be available on the Firefox Add-ons store after testing and review.

## Usage

1. Click on the TrueNAS Shell Selector icon in your Firefox toolbar
2. Select your preferred shell (Bash, Sh, Zsh, or Fish)
3. Click "Save Preference"
4. The extension will automatically apply your shell preference when you open a terminal in the TrueNAS web interface

## Development

### Project Structure

- `manifest_v2/` - Contains the Manifest V2 version of the extension (better supported in Firefox)
- `manifest_v3/` - Contains the Manifest V3 version for future compatibility
- `popup/` - Contains the extension popup UI files
- `content_scripts/` - Contains scripts that interact with TrueNAS web pages
- `background/` - Contains background scripts for the extension
- `icons/` - Contains extension icons

### Building and Testing

1. Make your changes to the extension code
2. Test the extension using the temporary installation method described above
3. For debugging, use the Firefox Browser Console (Ctrl+Shift+J or Cmd+Shift+J)

## Notes

- This extension is specifically designed for the TrueNAS web interface
- You may need to adjust the terminal detection selectors in `shell-selector.js` based on your specific TrueNAS version
- The current implementation assumes standard shell switching commands work in the TrueNAS terminal

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
