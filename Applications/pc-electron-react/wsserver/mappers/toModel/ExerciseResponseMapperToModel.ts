import { ResponsePayload } from '@wsserver/payloads/ResponsePayload';
import { AbstractMapperToModel } from './AbstractMapperToModels';
import { ExerciseResponseMessage } from '@wsserver/messages/ExerciseResponseMessage';
import { ExpectedResponseModel } from '@shared/models/ExpectedResponseModel';

/**
 * Class ExerciseResponseMapperToModel
 * Cette classe transforme les données d'un message en modèle
 */
export class ExerciseResponseMapperToModel extends AbstractMapperToModel<
  ExerciseResponseMessage,
  ResponsePayload,
  ExpectedResponseModel
> {
  /**
   * Transforme un message en modèle
   * @param message Message du serveur de socket
   * @returns Objet Modèle transformé
   */
  public mapMessageToModel(
    message: ExerciseResponseMessage
  ): ExpectedResponseModel {
    return <ExpectedResponseModel>{
      exerciseId: message.payload.exercise_id,
      fieldType: message.payload.field_type,
      value: message.payload.value,
      expectedValue: null,
    };
  }
}
