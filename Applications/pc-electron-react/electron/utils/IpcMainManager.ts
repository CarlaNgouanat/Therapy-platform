import { BrowserWindow, ipcMain } from 'electron';
import { WSServer } from '@wsserver/server/WSServer';
import { SessionService } from '@wsserver/services/SessionService';
import { IpcDBType } from '@electron/utils/data/IpcDBPreload';
import { IpcSendServicesType } from '@electron/utils/data/IpcSendServicesPreload';
import { IpcServerType } from '@electron/utils/data/IpcServerPreload';
import { LogsManager } from '@shared/utils/LogsManager';

/**
 * Class IpcMainManager
 * Initialise les fonctions utilisées dans l'IPC
 */
export class IpcMainManager {
  // --- IPC Handle ---

  public saveFunctionsInIpcHandleDB(maps: IpcDBType): void {
    this.saveFunctionsInIpcHandle(maps);
  }

  public saveFunctionsInIpcHandleSendServices(maps: IpcSendServicesType): void {
    this.saveFunctionsInIpcHandle(maps);
  }

  public saveFunctionsInIpcHandleServer(maps: IpcServerType): void {
    this.saveFunctionsInIpcHandle(maps);
  }

  private saveFunctionsInIpcHandle(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handlers: Record<string, (...args: any[]) => any>
  ): void {
    for (const [channel, handler] of Object.entries(handlers)) {
      ipcMain.handle(channel, (_event, ...args) => handler(...args));
    }
  }

  // --- LIFECYCLE EVENTS ---

  /**
   * Register lifecycle events that forward WSServer and SessionService
   * callbacks to the renderer process via IPC.
   */
  public registerLifecycleEvents(win: BrowserWindow | null): void {
    const wsServer = WSServer.getInstance();
    const sessionService = SessionService.getInstance();

    wsServer.onTabletConnected((payload) => {
      if (win) {
        win.webContents.send('tabletConnected', payload);
      }
    });

    wsServer.onTabletDisconnected(() => {
      if (win) {
        win.webContents.send('tabletDisconnected');
      }
    });

    sessionService.setOnAckReceived(() => {
      if (win) {
        win.webContents.send('ackReceived');
      }
    });

    sessionService.setOnAckTimeout(() => {
      if (win) {
        win.webContents.send('ackTimeout');
      }
    });

    LogsManager.logInfo('Lifecycle events enregistrés');
  }
}
