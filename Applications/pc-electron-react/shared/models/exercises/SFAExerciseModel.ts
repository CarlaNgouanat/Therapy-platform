import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Modèle représentant un exercice SFA
 */
export interface SFAExerciseModel extends AbstractModel {
  sfaCategory: string;
  sfaUse: string;
  sfaAction: string;
  sfaProperties: string;
  sfaAssociation: string;
}
