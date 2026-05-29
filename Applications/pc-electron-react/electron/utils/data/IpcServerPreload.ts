// --- SERVER ---

export type IpcServerType = {
  // WSServer
  serverGetConnectedClientsCount: () => number;

  // WSServerConf
  serverConfGetIp: () => string;
  serverConfGetPort: () => string;
};

export type IpcServerPromiseType = {
  [key in keyof IpcServerType]: (
    ...params: Parameters<IpcServerType[key]>
  ) => Promise<ReturnType<IpcServerType[key]>>;
};
