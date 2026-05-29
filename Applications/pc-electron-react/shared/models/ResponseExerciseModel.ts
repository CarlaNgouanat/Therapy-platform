import { AbstractModel } from '@shared/models/AbstractModel';
import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { SFAFieldType } from '@shared/types/SFAFieldType';

/**
 * Modèle représentant un résultat complet pour une section d'exercice
 */
export interface ResponseExerciseModel extends AbstractModel {
  exercise: ExerciseWithInterestsModel;
  value: string;
  fieldType: SFAFieldType;
}
