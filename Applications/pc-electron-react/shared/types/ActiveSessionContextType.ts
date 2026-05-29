import { ActiveSessionPatientModel } from '@shared/models/ActiveSessionPatientModel';
import { SessionModel } from '@shared/models/SessionModel';

/**
 * Définition du format pour une session active
 */
export type ActiveSessionContextType = {
  activeSession: ActiveSessionPatientModel | null;
  loading: boolean;
  startupPromptHandled: boolean;
  markStartupPromptHandled: () => void;
  refreshActiveSession: () => Promise<ActiveSessionPatientModel | null>;
  startSession: (session: SessionModel) => Promise<void>;
};
