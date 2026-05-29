import { ipcRenderer, contextBridge, IpcRendererEvent } from 'electron';
import { IpcServerPromiseType } from '@electron/utils/data/IpcServerPreload';
import ipcServerChannels from '@electron/utils/data/IpcServerChannels';
import { IpcDBPromiseType } from '@electron/utils/data/IpcDBPreload';
import ipcDBChannels from '@electron/utils/data/IpcDBChannels';
import { IpcSendServicesPromiseType } from '@electron/utils/data/IpcSendServicesPreload';
import ipcSendServicesChannels from '@electron/utils/data/IpcSendServicesChannels';
import { IpcLifecycleListenersType } from '@electron/utils/data/IpcLifecycleEventsPreload';
import { TabletConnectionPayload } from '@shared/types/WSMessage';

// --- IPC RENDERER ---

// Exposition de l'API IPC Renderer afin de permettre au code d'interagir avec le processus principal
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});

// --- ELECTRON API ---

const apiServer: IpcServerPromiseType = {} as IpcServerPromiseType;
for (const channel of ipcServerChannels) {
  // @ts-expect-error Fonctionne, mais demande des types trop précis
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiServer[channel as keyof IpcServerPromiseType] = ((...args: any[]) =>
    ipcRenderer.invoke(
      channel,
      ...args
    )) as IpcServerPromiseType[typeof channel];
}

const apiDB: IpcDBPromiseType = {} as IpcDBPromiseType;
for (const channel of ipcDBChannels) {
  // @ts-expect-error Fonctionne, mais demande des types trop précis
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiDB[channel as keyof IpcDBPromiseType] = ((...args: any[]) =>
    ipcRenderer.invoke(channel, ...args)) as IpcDBPromiseType[typeof channel];
}

const apiSendServices: IpcSendServicesPromiseType =
  {} as IpcSendServicesPromiseType;
for (const channel of ipcSendServicesChannels) {
  // @ts-expect-error Fonctionne, mais demande des types trop précis
  apiSendServices[channel as keyof IpcSendServicesPromiseType] = ((
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) =>
    ipcRenderer.invoke(
      channel,
      ...args
    )) as IpcSendServicesPromiseType[typeof channel];
}

const apiLifecycleListeners: IpcLifecycleListenersType = {
  onTabletConnected: (callback: (payload: TabletConnectionPayload) => void) => {
    const listener = (
      _event: IpcRendererEvent,
      value: TabletConnectionPayload
    ) => callback(value);
    ipcRenderer.on('tabletConnected', listener);
    return () => {
      ipcRenderer.off('tabletConnected', listener);
    };
  },
  onTabletDisconnected: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('tabletDisconnected', listener);
    return () => {
      ipcRenderer.off('tabletDisconnected', listener);
    };
  },
  onAckReceived: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('ackReceived', listener);
    return () => {
      ipcRenderer.off('ackReceived', listener);
    };
  },
  onAckTimeout: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('ackTimeout', listener);
    return () => {
      ipcRenderer.off('ackTimeout', listener);
    };
  },
};

contextBridge.exposeInMainWorld('electronAPI', {
  ...apiServer,
  ...apiDB,
  ...apiSendServices,
  ...apiLifecycleListeners,
});
