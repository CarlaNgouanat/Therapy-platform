/**
 * Liste des différents types d'évènements pour le protocole WebSocket v2
 */
export type WSEventType =
  | 'SESSION_STATE' // PC -> Tablet: full state snapshot
  | 'SESSION_END' // PC -> Tablet: return to wait screen
  | 'TABLET_CONNECTED' // Tablet -> PC: device info on connect
  | 'ACK'; // Tablet -> PC: confirms receipt of a message
