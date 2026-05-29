import { WebSocket } from 'ws';

/**
 * class IsAliveWebSocket
 * Cette class rajoute la clé "isAlive" à la classe WebSocket de ws
 * Le but ici est d'ajouter un moyen de vérifier l'état de connexion de l'utilisateur
 */
export class IsAliveWebSocket extends WebSocket {
  isAlive: boolean = false;
  id: number = -1;
}
