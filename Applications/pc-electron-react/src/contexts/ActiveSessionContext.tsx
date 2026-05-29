import { createContext } from 'react';
import { ActiveSessionContextType } from '@shared/types/ActiveSessionContextType';

// Données de la session active
export const ActiveSessionContext = createContext<
  ActiveSessionContextType | undefined
>(undefined);
