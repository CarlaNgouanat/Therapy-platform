import { TabletConnectionPayload } from '@shared/types/WSMessage';

/**
 * Preload-side listener types for lifecycle events.
 * Each returns a cleanup function to remove the listener.
 */
export type IpcLifecycleListenersType = {
  onTabletConnected: (
    callback: (payload: TabletConnectionPayload) => void
  ) => () => void;
  onTabletDisconnected: (callback: () => void) => () => void;
  onAckReceived: (callback: () => void) => () => void;
  onAckTimeout: (callback: () => void) => () => void;
};
