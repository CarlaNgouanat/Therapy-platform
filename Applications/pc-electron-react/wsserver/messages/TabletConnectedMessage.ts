import { TabletConnectionPayload } from '../payloads/TableConnectionPayload';
import { WSMessage } from '@wsserver/messages/WSMessage';

/**
 * Structure pour un message pour la connexion d'une nouvelle tablette au serveur de socket
 */
export type TabletConnectedMessage = WSMessage<TabletConnectionPayload>;
