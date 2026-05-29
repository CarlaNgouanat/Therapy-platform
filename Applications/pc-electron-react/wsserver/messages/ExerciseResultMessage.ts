import { ResultPayload } from '@wsserver/payloads/ResultPayload';
import { WSMessage } from '@wsserver/messages/WSMessage';

/**
 * Structure pour un message sur la vérification des résultats du patient (envoyé depuis l'ordinateur de l'othophoniste)
 */
export type ExerciseResultMessage = WSMessage<ResultPayload>;
