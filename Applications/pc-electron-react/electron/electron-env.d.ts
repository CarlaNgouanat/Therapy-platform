/// <reference types="vite-plugin-electron/electron-env" />

import { IpcDBPromiseType } from '@electron/utils/data/IpcDBPreload';
import { IpcServerPromiseType } from '@electron/utils/data/IpcServerPreload';
import { IpcSendServicesPromiseType } from '@electron/utils/data/IpcSendServicesPreload';
import { IpcLifecycleListenersType } from '@electron/utils/data/IpcLifecycleEventsPreload';

declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string;
    VITE_PUBLIC: string;
  }
}

declare global {
  interface Window {
    ipcRenderer: import('electron').IpcRenderer;
    electronAPI: IpcDBPromiseType &
      IpcServerPromiseType &
      IpcSendServicesPromiseType &
      IpcLifecycleListenersType;
  }
}
