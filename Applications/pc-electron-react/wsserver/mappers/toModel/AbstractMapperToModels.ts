import { AbstractModel } from '@shared/models/AbstractModel';
import { WSMessage } from '@wsserver/messages/WSMessage';
import { AbstractPayload } from '@wsserver/payloads/AbstractPayload';

/**
 * Class abstract AbstractMapperToModel
 * Cette classe abstraite représente la structure générale d'un mapper
 */
export abstract class AbstractMapperToModel<
  Message extends WSMessage<Payload>,
  Payload extends AbstractPayload,
  Model extends AbstractModel,
> {
  /**
   * Transforme un message en modèle
   * @param message Message du serveur de socket
   * @returns Objet Modèle transformé
   */
  public abstract mapMessageToModel(message: Message): Model;
}
