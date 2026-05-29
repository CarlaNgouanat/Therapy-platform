import { AbstractModel } from '@shared/models/AbstractModel';
import { SFAFieldType } from '@shared/types/SFAFieldType';

/**
 * Modèle représentant une réponse attendue par le programme
 */
export interface ExpectedResponseModel extends AbstractModel {
  exerciseId: number;
  fieldType: SFAFieldType;
  value: string;
  expectedValue: string | null;
}
