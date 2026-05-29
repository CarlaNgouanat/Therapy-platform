import { WSContextType } from '@shared/types/WSContextType';
import React, { createContext } from 'react';

// Données du client WebSocket
export const WebSocketContext: React.Context<WSContextType | undefined> =
  createContext<WSContextType | undefined>(undefined);
