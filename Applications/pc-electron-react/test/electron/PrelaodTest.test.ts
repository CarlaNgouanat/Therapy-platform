import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- MOCKS ---

// Mock des fonctions du WSServer
const {
  mockIpcInvoke,
  mockIpcOn,
  mockIpcOff,
  mockSend,
  mockExposeInMainWorld,
  mockBrowserSend,
} = vi.hoisted(() => ({
  mockIpcHandle: vi.fn(),
  mockIpcInvoke: vi.fn(),
  mockIpcOn: vi.fn(),
  mockIpcOff: vi.fn(),
  mockSend: vi.fn(),
  mockOnMessage: vi.fn(),
  mockExposeInMainWorld: vi.fn(),
  mockBrowserSend: vi.fn(),
}));

// Mock Electron
vi.mock('electron', () => ({
  contextBridge: {
    exposeInMainWorld: mockExposeInMainWorld,
  },
  ipcRenderer: {
    invoke: mockIpcInvoke,
    on: mockIpcOn,
    off: mockIpcOff,
    send: mockSend,
  },
  BrowserWindow: class {
    webContents = {
      send: mockBrowserSend,
    };
  },
  IpcRendererEvent: vi.fn(),
}));

// Mock node:os
vi.mock('node:os', () => ({
  default: {
    networkInterfaces: vi.fn(),
  },
}));

// Vérification des utilisées dans le
describe('Preload', () => {
  // À exécuter avant chaque test
  beforeEach(async () => {
    // Réinitialisation des mocks
    vi.resetModules();
    vi.clearAllMocks();
    await import('@electron/preload');
  });

  // Vérification sur l'exposition de l'ipcRenderer
  it("> Test sur l'exposition de l'ipcRenderer", async () => {
    expect(mockExposeInMainWorld).toHaveBeenNthCalledWith(
      1,
      'ipcRenderer',
      expect.objectContaining({
        on: expect.any(Function),
        off: expect.any(Function),
        send: expect.any(Function),
        invoke: expect.any(Function),
      })
    );
  });

  // Vérification sur l'utilisation des fonctions de l'IPC Renderer
  it("> Test sur l'utilisation des fonctions de l'IPC Renderer", async () => {
    const exposeCall = mockExposeInMainWorld.mock.calls.find(
      ([name]) => name === 'ipcRenderer'
    );

    const exposed = exposeCall![1];
    const listener = vi.fn();

    exposed.on('test-channel', listener);
    exposed.off('test-channel', listener);
    exposed.send('test-channel', 'data');
    exposed.invoke('test-channel', 'data');

    // récupérer la fonction interne passée à ipcRenderer.on
    const wrappedListener = mockIpcOn.mock.calls[0][1];

    const fakeEvent = { sender: 'test' };
    wrappedListener(fakeEvent, 'arg1', 'arg2');
    expect(mockIpcOn).toHaveBeenCalledWith(
      'test-channel',
      expect.any(Function)
    );

    expect(mockIpcOff).toHaveBeenCalledWith('test-channel', listener);
    expect(mockSend).toHaveBeenCalledWith('test-channel', 'data');
    expect(mockIpcInvoke).toHaveBeenCalledWith('test-channel', 'data');
    expect(listener).toHaveBeenCalledWith(fakeEvent, 'arg1', 'arg2');
  });

  // Vérification sur l'exposition de l'ipcRenderer
  it("> Test sur l'exposition de l'electronAPI", async () => {
    expect(mockExposeInMainWorld).toHaveBeenNthCalledWith(
      2,
      'electronAPI',
      expect.objectContaining({
        exerciseGetAllExercisesWithInterests: expect.any(Function),
        serverConfGetIp: expect.any(Function),
        sessionServiceLoadExercise: expect.any(Function),
        sessionServiceSelectField: expect.any(Function),
        sessionServiceEndSession: expect.any(Function),
        onTabletConnected: expect.any(Function),
        onTabletDisconnected: expect.any(Function),
        onAckReceived: expect.any(Function),
        onAckTimeout: expect.any(Function),
      })
    );
  });
});
