import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Modèle représentant un lien exercice - centre d'intérêt intérêt
 */
export interface ExerciseInterestModel extends AbstractModel {
  exerciseId: number;
  interestId: number;
}
