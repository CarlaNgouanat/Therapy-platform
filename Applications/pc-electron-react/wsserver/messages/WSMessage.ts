import { AbstractPayload } from '@wsserver/payloads/AbstractPayload';
import { WSEventType } from '@shared/types/WSEventType';

/**
 * Structure de base d'un message WebSocket
 * Tous les messages doivent suivre cette structure
 */
export interface WSMessage<Payload extends AbstractPayload> {
  event: WSEventType;
  payload: Payload;
  timestamp: string;
}
