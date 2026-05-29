import { AbstractModel } from '@shared/models/AbstractModel';
import { SFAFieldType } from '@shared/types/SFAFieldType.ts';

/**
 * Modèle représentant un résultat pour une section d'exercice
 */
export interface ResponseModel extends AbstractModel {
  value: string;
  fieldType: SFAFieldType;
}
