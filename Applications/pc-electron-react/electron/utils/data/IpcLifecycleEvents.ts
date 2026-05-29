import { TabletConnectionPayload } from '@shared/types/WSMessage';

/**
 * Lifecycle events sent from Main process to Renderer.
 * These are NOT triggered by incoming WS messages — they come from
 * WSServer lifecycle callbacks and SessionService timer callbacks.
 */
export type IpcLifecycleEventsType = {
  tabletConnected: TabletConnectionPayload;
  tabletDisconnected: void;
  ackReceived: void;
  ackTimeout: void;
};

export const ipcLifecycleEventChannels: (keyof IpcLifecycleEventsType)[] = [
  'tabletConnected',
  'tabletDisconnected',
  'ackReceived',
  'ackTimeout',
];
