import { ExerciseResultMessage } from '@wsserver/messages/ExerciseResultMessage';
import { ResultPayload } from '@wsserver/payloads/ResultPayload';
import { ResultExerciseModel } from '@shared/models/ResultExerciseModel';
import { AbstractMapperToMessage } from '@wsserver/mappers/toMessage/AbstractMapperToMessage';

/**
 * Class ExerciseResultMapperToMessage
 * Cette classe transforme les données d'un modèle en message
 */
export class ExerciseResultMapperToMessage extends AbstractMapperToMessage<
  ExerciseResultMessage,
  ResultPayload,
  ResultExerciseModel
> {
  /**
   * Transforme un modèle en payload
   * @param model Model représentant une donnée
   * @returns Objet Payload transformé
   */
  public mapModelToPayload(model: ResultExerciseModel): ResultPayload {
    return <ResultPayload>{
      exercise_id: model.exercise.id,
      field_type: model.fieldType,
      is_correct: model.correct,
      expected_value: model.expectedValue,
    };
  }

  /**
   * Transforme un payload en messsage
   * @param payload Payload représentant une donnée à envoyer au serveur de WebSocket
   * @returns Objet Message à envoyer
   */
  public mapPayloadToMessage(payload: ResultPayload): ExerciseResultMessage {
    return <ExerciseResultMessage>{
      event: 'ACK',
      payload: payload,
      timestamp: new Date().toISOString(),
    };
  }
}
