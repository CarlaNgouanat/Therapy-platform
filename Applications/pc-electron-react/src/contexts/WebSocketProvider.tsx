import React, { useEffect, useState } from 'react';
import { WebSocketContext } from '@/contexts/WebSocketContext';

/**
 * Provider v2: listens to lifecycle events from Main process via IPC.
 * No more native WebSocket connection in the renderer.
 */
export const WebSocketProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState({
    connected: true, // The main process WS server is always running
    tabletConnected: false,
    tabletDeviceName: null as string | null,
    tabletAckStatus: 'unknown' as 'ok' | 'timeout' | 'unknown',
  });

  useEffect(() => {
    const cleanupConnected = window.electronAPI.onTabletConnected((payload) => {
      setState((s) => ({
        ...s,
        tabletConnected: true,
        tabletDeviceName: payload.device_name,
        tabletAckStatus: 'unknown',
      }));
    });

    const cleanupDisconnected = window.electronAPI.onTabletDisconnected(() => {
      setState((s) => ({
        ...s,
        tabletConnected: false,
        tabletDeviceName: null,
        tabletAckStatus: 'unknown',
      }));
    });

    const cleanupAckTimeout = window.electronAPI.onAckTimeout(() => {
      setState((s) => ({ ...s, tabletAckStatus: 'timeout' }));
    });

    const cleanupAckReceived = window.electronAPI.onAckReceived(() => {
      setState((s) => ({ ...s, tabletAckStatus: 'ok' }));
    });

    // Check initial tablet status
    window.electronAPI.sessionServiceGetTabletStatus().then((status) => {
      setState((s) => ({ ...s, tabletConnected: status.connected }));
    });

    return () => {
      cleanupConnected();
      cleanupDisconnected();
      cleanupAckTimeout();
      cleanupAckReceived();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={state}>
      {children}
    </WebSocketContext.Provider>
  );
};
