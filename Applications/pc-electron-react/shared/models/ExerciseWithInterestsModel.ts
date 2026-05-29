import { ExerciseModel } from '@shared/models/ExerciseModel';
import { InterestModel } from '@shared/models/InterestModel';

/**
 * Modèle représentant un exercice avec des centres d'intérêt
 */
export interface ExerciseWithInterestsModel extends ExerciseModel {
  interests: InterestModel[];
}
