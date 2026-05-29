import { SessionModel } from '@shared/models/SessionModel';

/**
 * Modèle représentant une session avec un nombre d'exercices
 */
export interface SessionWithExerciseCountModel extends SessionModel {
  exerciseCount: number;
}
