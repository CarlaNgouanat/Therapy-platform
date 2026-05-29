import { useContext } from 'react';
import { WebSocketContext } from '@/contexts/WebSocketContext';
import { WSContextType } from '@shared/types/WSContextType';

// --- UTILISATION ---

/**
 * Utilisation des données contenues dans le webSocket
 * @return Renvoie un objet de type WSContextType
 * @throws Error Renvoie une exception si les données n'existent pas
 */
export function useWebSocket(): WSContextType {
  const ctx: WSContextType | undefined = useContext(WebSocketContext);
  if (!ctx)
    throw new Error('useWebSocket must be used within WebSocketProvider');
  return ctx;
}
