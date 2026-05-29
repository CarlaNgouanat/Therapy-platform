import os from 'node:os';

/**
 * Class WSServerConf
 * Cette classe contient la configuration du serveur adresse ip / port
 */
export class WSServerConf {
  // --- VARIABLES ---

  // Port et ip par défaut
  private readonly ip: string = '127.0.0.1';
  private readonly port: string = '4933';

  // --- CONSTRUCTEUR ---

  /**
   * Constructeur
   * Initialisation de l'adresse IP
   */
  constructor() {
    this.ip = this.getLocalIp();
  }

  /**
   * Recupération de l'adresse IP Locale
   * @return Renvoie l'adresse IP locale et en cas d'échec, renvoie l'adresse par défaut
   * @private
   */
  private getLocalIp(): string {
    const nets: NodeJS.Dict<os.NetworkInterfaceInfo[]> = os.networkInterfaces();
    for (const name in nets) {
      for (const net of nets[name] || []) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
    return this.ip;
  }

  // --- GETTER ---

  /**
   * Adresse IP du serveur
   * @return Renvoie l'adresse IP au format string
   */
  public getIp(): string {
    return this.ip;
  }

  /**
   * Port du serveur
   * @return Renvoie le port au format string
   */
  public getPort() {
    return this.port;
  }
}
