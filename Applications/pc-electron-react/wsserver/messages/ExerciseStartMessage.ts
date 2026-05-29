import { ExercisePayload } from '@wsserver/payloads/ExercisePayload';
import { WSMessage } from '@wsserver/messages/WSMessage';

/**
 * Structure pour un message pour le lancement d'un nouvel exercice
 */
export type ExerciseStartMessage = WSMessage<ExercisePayload>;
