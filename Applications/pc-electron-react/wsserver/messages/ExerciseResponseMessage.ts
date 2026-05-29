import { ResponsePayload } from '../payloads/ResponsePayload';
import { WSMessage } from '@wsserver/messages/WSMessage';

/**
 * Structure pour un message sur les réponses données par le patient
 */
export type ExerciseResponseMessage = WSMessage<ResponsePayload>;
