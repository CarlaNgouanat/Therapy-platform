import { SessionExerciseStatus } from '@shared/types/SessionExerciseStatus';
import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Modèle représentant un exercice en session
 */
export interface SessionExerciseModel extends AbstractModel {
  id: number;
  sessionId: number;
  exerciseId: number;
  status: SessionExerciseStatus;
}
