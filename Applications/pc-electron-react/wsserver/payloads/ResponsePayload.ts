import { AbstractPayload } from '@wsserver/payloads/AbstractPayload';
import { SFAFieldType } from '@shared/types/SFAFieldType';

/**
 * Payload regroupant les données sur une réponse du patient
 */
export interface ResponsePayload extends AbstractPayload {
  exercise_id: number;
  field_type: SFAFieldType;
  value: string;
}
