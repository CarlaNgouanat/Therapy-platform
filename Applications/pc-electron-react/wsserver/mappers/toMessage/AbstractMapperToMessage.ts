import { AbstractModel } from '@shared/models/AbstractModel';
import { WSMessage } from '@wsserver/messages/WSMessage';
import { AbstractPayload } from '@wsserver/payloads/AbstractPayload';

/**
 * Class abstract AbstractMapperToMessage
 * Cette classe abstraite représente la structure générale d'un mapper
 */
export abstract class AbstractMapperToMessage<
  Message extends WSMessage<Payload>,
  Payload extends AbstractPayload,
  Model extends AbstractModel,
> {
  /**
   * Transforme un modèle en payload
   * @param model Model représentant une donnée
   * @returns Objet Payload transformé
   */
  public abstract mapModelToPayload(model: Model): Payload;

  /**
   * Transforme un payload en messsage
   * @param payload Payload représentant une donnée à envoyer au serveur de WebSocket
   * @returns Objet Message à envoyer
   */
  public abstract mapPayloadToMessage(payload: Payload): Message;

  /**
   * Transforme un modèle en messsage
   * @param model Model représentant une donnée
   * @returns Objet Message à envoyer
   */
  public mapModelToMessage(model: Model): Message {
    return this.mapPayloadToMessage(this.mapModelToPayload(model));
  }
}
