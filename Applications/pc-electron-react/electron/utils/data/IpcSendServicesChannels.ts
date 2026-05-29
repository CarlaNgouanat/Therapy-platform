import { IpcSendServicesType } from '@electron/utils/data/IpcSendServicesPreload';

const ipcSendServicesChannels: (keyof IpcSendServicesType)[] = [
  'sessionServiceLoadExercise',
  'sessionServiceSelectField',
  'sessionServiceDeselectField',
  'sessionServiceSendValidation',
  'sessionServiceMarkAnswerGiven',
  'sessionServiceEndSession',
  'sessionServiceGetTabletStatus',
  'sessionServiceGetConnectedClientsCount',
];
export default ipcSendServicesChannels;
