import { ExerciseResponseMessage } from '@wsserver/messages/ExerciseResponseMessage';
import { ResponsePayload } from '../../payloads/ResponsePayload';
import { ResponseExerciseModel } from '@shared/models/ResponseExerciseModel';
import { AbstractMapperToMessage } from '@wsserver/mappers/toMessage/AbstractMapperToMessage';

/**
 * Class ExerciseResponseMapperToMessage
 * Cette classe transforme les données d'un modèle en message
 */
export class ExerciseResponseMapperToMessage extends AbstractMapperToMessage<
  ExerciseResponseMessage,
  ResponsePayload,
  ResponseExerciseModel
> {
  /**
   * Transforme un modèle en payload
   * @param model Model représentant une donnée
   * @returns Objet Payload transformé
   */
  public mapModelToPayload(model: ResponseExerciseModel): ResponsePayload {
    return <ResponsePayload>{
      exercise_id: model.exercise.id,
      field_type: model.fieldType,
      value: model.value,
    };
  }

  /**
   * Transforme un payload en messsage
   * @param payload Payload représentant une donnée à envoyer au serveur de WebSocket
   * @returns Objet Message à envoyer
   */
  public mapPayloadToMessage(
    payload: ResponsePayload
  ): ExerciseResponseMessage {
    return <ExerciseResponseMessage>{
      event: 'ACK',
      payload: payload,
      timestamp: new Date().toISOString(),
    };
  }
}
