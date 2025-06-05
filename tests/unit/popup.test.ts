import { loadShellPreference, saveShellPreference, addVersionInfo } from '../../src/popup/popup';

// Mock browser.storage.local
const mockStorage: Record<string, any> = {};
(globalThis as any).browser = {
  storage: {
    local: {
      get: jest.fn((key) => Promise.resolve({ [key]: mockStorage[key] })),
      set: jest.fn((data) => {
        Object.assign(mockStorage, data);
        return Promise.resolve();
      }),
    },
  },
};

describe('Popup Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  });

  test('loadShellPreference retrieves the correct shell preference', async () => {
    mockStorage.shellPreference = 'bash';
    const preference = await loadShellPreference();
    expect(preference).toBe('bash');
    expect(browser.storage.local.get).toHaveBeenCalledWith('shellPreference');
  });

  test('saveShellPreference saves the shell preference correctly', async () => {
    await saveShellPreference('zsh');
    expect(mockStorage.shellPreference).toBe('zsh');
    expect(browser.storage.local.set).toHaveBeenCalledWith({ shellPreference: 'zsh' });
  });

  test('addVersionInfo adds the correct version info to the DOM', () => {
    document.body.innerHTML = '<div id="version"></div>';
    addVersionInfo();
    const versionElement = document.getElementById('version');
    expect(versionElement).not.toBeNull();
    expect(versionElement?.textContent).toBe('Version: 1.0.0');
  });
});