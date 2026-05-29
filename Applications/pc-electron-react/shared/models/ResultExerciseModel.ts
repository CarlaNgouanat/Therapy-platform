import { AbstractModel } from '@shared/models/AbstractModel';
import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { SFAFieldType } from '@shared/types/SFAFieldType.ts';

/**
 * Modèle représentant un résultat complet pour une section d'exercice
 */
export interface ResultExerciseModel extends AbstractModel {
  exercise: ExerciseWithInterestsModel;
  correct: boolean;
  fieldType: SFAFieldType;
  expectedValue?: string;
}
