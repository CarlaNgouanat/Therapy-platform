import { WebSocketServer, WebSocket } from 'ws';
import { WSServerConf } from '@wsserver/server/WSServerConf';
import { IsAliveWebSocket } from '@wsserver/utils/IsAliveWebSocket';
import {
  WSMessage,
  parseWSMessage,
  serializeWSMessage,
  TabletConnectionPayload,
  AckPayload,
} from '@shared/types/WSMessage';
import { LogsManager } from '@shared/utils/LogsManager';

// --- Handler Types ---

export type TabletConnectedHandler = (payload: TabletConnectionPayload) => void;
export type TabletDisconnectedHandler = () => void;
export type AckHandler = (ackId: string) => void;
export type MessageHandler = (
  message: WSMessage,
  client: IsAliveWebSocket
) => void;

/**
 * Class Singleton WSServer
 * v2: Dedicated tablet client model with targeted sends (no broadcast).
 */
export class WSServer {
  // --- VARIABLES ---

  private webSocketServer: WebSocketServer | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private tabletClient: IsAliveWebSocket | null = null;

  private messageHandlers: MessageHandler[] = [];
  private tabletConnectedHandlers: TabletConnectedHandler[] = [];
  private tabletDisconnectedHandlers: TabletDisconnectedHandler[] = [];
  private ackHandlers: AckHandler[] = [];

  private confServer: WSServerConf = new WSServerConf();

  private static instance: WSServer | null = null;

  // --- SINGLETON ---

  private constructor() {}

  public static getInstance(): WSServer {
    if (WSServer.instance === null) {
      WSServer.instance = new WSServer();
    }
    return WSServer.instance;
  }

  // --- SERVER LIFECYCLE ---

  public startWebSocketServer(port: string = this.confServer.getPort()): void {
    if (this.webSocketServer) {
      LogsManager.logWarning('Le serveur de socket est déjà lancé');
      return;
    }

    this.webSocketServer = new WebSocketServer({ port: parseInt(port) });

    this.webSocketServer.on('connection', (socket: WebSocket) => {
      const ws = socket as IsAliveWebSocket;
      ws.isAlive = true;
      LogsManager.logInfo("Un client s'est connecté au serveur de socket");

      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('message', (msg: string) => {
        const raw = msg.toString();
        const parsed = parseWSMessage(raw);

        if (!parsed) return;

        // Handle TABLET_CONNECTED: register this socket as the tablet
        if (parsed.event === 'TABLET_CONNECTED') {
          this.tabletClient = ws;
          const payload = parsed.payload as TabletConnectionPayload;
          LogsManager.logInfo(`Tablette identifiée: ${payload.device_name}`);
          this.tabletConnectedHandlers.forEach((h) => h(payload));
          return;
        }

        // Handle ACK
        if (parsed.event === 'ACK') {
          const payload = parsed.payload as AckPayload;
          this.ackHandlers.forEach((h) => h(payload.ack_id));
          return;
        }

        // Other messages: pass to generic handlers
        this.messageHandlers.forEach((h) => h(parsed, ws));
      });

      ws.on('close', () => {
        LogsManager.logInfo("Un client s'est déconnecté");
        if (ws === this.tabletClient) {
          this.tabletClient = null;
          LogsManager.logInfo("La tablette s'est déconnectée");
          this.tabletDisconnectedHandlers.forEach((h) => h());
        }
      });
    });

    // Heartbeat: 30s interval
    this.heartbeatInterval = setInterval(
      this.heartbeatAction.bind(this),
      30000
    );

    LogsManager.logSuccess(
      `Serveur lancé sur ws://${this.confServer.getIp()}:${port}`
    );
  }

  public stopWebSocketServer(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.webSocketServer) {
      this.webSocketServer.close();
      this.webSocketServer = null;
    }
    this.tabletClient = null;
  }

  private heartbeatAction(): void {
    if (!this.webSocketServer) return;

    (this.webSocketServer.clients as Set<IsAliveWebSocket>).forEach(
      (ws: IsAliveWebSocket) => {
        if (ws.isAlive === false) {
          LogsManager.logWarning('Client inactif, déconnexion');
          if (ws === this.tabletClient) {
            this.tabletClient = null;
            this.tabletDisconnectedHandlers.forEach((h) => h());
          }
          ws.terminate();
          return;
        }
        ws.isAlive = false;
        ws.ping();
      }
    );
  }

  // --- TABLET COMMUNICATION ---

  public sendToTablet(message: WSMessage): boolean {
    if (!this.tabletClient || this.tabletClient.readyState !== WebSocket.OPEN) {
      LogsManager.logWarning("Impossible d'envoyer: tablette non connectée");
      return false;
    }
    this.tabletClient.send(serializeWSMessage(message));
    return true;
  }

  public isTabletConnected(): boolean {
    return (
      this.tabletClient !== null &&
      this.tabletClient.readyState === WebSocket.OPEN
    );
  }

  // --- EVENT REGISTRATION ---

  public onMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  public onTabletConnected(handler: TabletConnectedHandler): void {
    this.tabletConnectedHandlers.push(handler);
  }

  public onTabletDisconnected(handler: TabletDisconnectedHandler): void {
    this.tabletDisconnectedHandlers.push(handler);
  }

  public onAck(handler: AckHandler): void {
    this.ackHandlers.push(handler);
  }

  // --- QUERIES ---

  public isServerRunning(): boolean {
    return this.webSocketServer !== null;
  }

  public getConnectedClientsCount(): number {
    return this.webSocketServer?.clients.size ?? 0;
  }
}
