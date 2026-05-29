import { IpcServerType } from '@electron/utils/data/IpcServerPreload';

// --- SERVER ---

const ipcServerChannels: (keyof IpcServerType)[] = [
  'serverGetConnectedClientsCount',
  'serverConfGetIp',
  'serverConfGetPort',
];
export default ipcServerChannels;
