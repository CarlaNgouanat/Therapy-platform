import { WSServer } from '@wsserver/server/WSServer';
import { WSServerConf } from '@wsserver/server/WSServerConf';
import { IpcServerType } from '@electron/utils/data/IpcServerPreload';

// --- SERVER ---

const wsServer: WSServer = WSServer.getInstance();
const wsServerConf: WSServerConf = new WSServerConf();

// Tableau associatif key - function
const ipcServer = <IpcServerType>{
  // WSServer
  serverGetConnectedClientsCount:
    wsServer.getConnectedClientsCount.bind(wsServer),

  // WSServerConf
  serverConfGetIp: wsServerConf.getIp.bind(wsServerConf),
  serverConfGetPort: wsServerConf.getPort.bind(wsServerConf),
};
export default ipcServer;
