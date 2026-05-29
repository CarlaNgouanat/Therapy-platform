import { ExerciseStartMessage } from '@wsserver/messages/ExerciseStartMessage';
import { ExercisePayload } from '@wsserver/payloads/ExercisePayload';
import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { AbstractMapperToMessage } from '@wsserver/mappers/toMessage/AbstractMapperToMessage';
import { SFAExerciseModel } from '@shared/models/exercises/SFAExerciseModel';

/**
 * Class ExerciseStartMapperToMessage
 * Cette classe transforme les données d'un modèle en message
 */
export class ExerciseStartMapperToMessage extends AbstractMapperToMessage<
  ExerciseStartMessage,
  ExercisePayload,
  ExerciseWithInterestsModel
> {
  /**
   * Transforme un modèle en payload
   * @param model Model représentant une donnée
   * @returns Objet Payload transformé
   */
  public mapModelToPayload(model: ExerciseWithInterestsModel): ExercisePayload {
    /**
     * On vérifie si les données stockées réfèrent bien un exercice SFA
     * Si oui, on définit data comme un SFAExerciseModel
     * Sinon, on le définit comme null
     */
    const data: SFAExerciseModel | null =
      (model.data as SFAExerciseModel).sfaAction !== undefined
        ? (model.data as SFAExerciseModel)
        : null;

    return <ExercisePayload>{
      id: model.id,
      name: model.name,
      model: model.model,
      sfa_category: data !== null ? data.sfaCategory : null,
      sfa_use: data !== null ? data.sfaUse : null,
      sfa_action: data !== null ? data.sfaAction : null,
      sfa_properties: data !== null ? data.sfaProperties : null,
      sfa_association: data !== null ? data.sfaAssociation : null,
      image_url: null,
    };
  }

  /**
   * Transforme un payload en messsage
   * @param payload Payload représentant une donnée à envoyer au serveur de WebSocket
   * @returns Objet Message à envoyer
   */
  public mapPayloadToMessage(payload: ExercisePayload): ExerciseStartMessage {
    return <ExerciseStartMessage>{
      event: 'ACK',
      payload: payload,
      timestamp: new Date().toISOString(),
    };
  }
}
