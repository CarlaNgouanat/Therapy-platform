import { AbstractPayload } from '@wsserver/payloads/AbstractPayload';
import { ExerciseType } from '@shared/types/ExerciseType';

/**
 * Payload regroupant les données d'un exercice (PCA, SFA, ...)
 */
export interface ExercisePayload extends AbstractPayload {
  id: number;
  name: string;
  model: ExerciseType;
  sfa_category?: string | null;
  sfa_use?: string | null;
  sfa_action?: string | null;
  sfa_properties?: string | null;
  sfa_association?: string | null;
  image_url?: string | null;
}
