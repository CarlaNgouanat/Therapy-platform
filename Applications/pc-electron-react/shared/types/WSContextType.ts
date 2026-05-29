/**
 * Définition du format du contexte de gestion WebSocket v2
 */
export type WSContextType = {
  connected: boolean;
  tabletConnected: boolean;
  tabletDeviceName: string | null;
  tabletAckStatus: 'ok' | 'timeout' | 'unknown';
};
