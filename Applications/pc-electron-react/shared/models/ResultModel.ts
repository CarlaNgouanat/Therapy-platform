import { AbstractModel } from '@shared/models/AbstractModel';
import { SFAFieldType } from '@shared/types/SFAFieldType.ts';

/**
 * Modèle représentant un résultat pour une section d'exercice
 */
export interface ResultModel extends AbstractModel {
  correct: boolean;
  fieldType: SFAFieldType;
}
