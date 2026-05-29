import { useContext } from 'react';
import { ActiveSessionContextType } from '@shared/types/ActiveSessionContextType';
import { ActiveSessionContext } from '@/contexts/ActiveSessionContext';

export function useActiveSession(): ActiveSessionContextType {
  const ctx = useContext(ActiveSessionContext);
  if (!ctx) {
    throw new Error(
      'useActiveSession must be used within ActiveSessionProvider'
    );
  }
  return ctx;
}
