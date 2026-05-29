import { ExerciseModel } from '@shared/models/ExerciseModel';
import { SessionExerciseModel } from '@shared/models/SessionExerciseModel';
/**
 * Modèle représentant un lien session - exercice et son exercice associé
 */
export interface SessionExerciseWithExerciseModel extends SessionExerciseModel {
  exercise: ExerciseModel;
}
