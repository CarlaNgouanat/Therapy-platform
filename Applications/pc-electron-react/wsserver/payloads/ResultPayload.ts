import { AbstractPayload } from '@wsserver/payloads/AbstractPayload';
import { SFAFieldType } from '@shared/types/SFAFieldType';

/**
 * Payload regroupant les données sur l'envoie de résultat vers la tablette
 */
export interface ResultPayload extends AbstractPayload {
  exercise_id: number;
  field_type: SFAFieldType;
  is_correct: boolean;
  expected_value?: string; // Optional: show correct answer if wrong
}
