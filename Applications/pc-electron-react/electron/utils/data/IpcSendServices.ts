import { SessionService } from '@wsserver/services/SessionService';
import { IpcSendServicesType } from '@electron/utils/data/IpcSendServicesPreload';

// --- SERVICES ---

const sessionService: SessionService = SessionService.getInstance();

const ipcSendServices = <IpcSendServicesType>{
  sessionServiceLoadExercise: sessionService.loadExercise.bind(sessionService),
  sessionServiceSelectField: sessionService.selectField.bind(sessionService),
  sessionServiceDeselectField:
    sessionService.deselectField.bind(sessionService),
  sessionServiceSendValidation:
    sessionService.sendValidation.bind(sessionService),
  sessionServiceMarkAnswerGiven:
    sessionService.markAnswerGiven.bind(sessionService),
  sessionServiceEndSession: sessionService.endSession.bind(sessionService),
  sessionServiceGetTabletStatus:
    sessionService.getTabletStatus.bind(sessionService),
  sessionServiceGetConnectedClientsCount:
    sessionService.getConnectedClientsCount.bind(sessionService),
};

export default ipcSendServices;
