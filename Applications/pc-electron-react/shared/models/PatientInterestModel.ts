import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Modèle représentant un lien patient - centre d'intérêt
 */
export interface PatientInterestModel extends AbstractModel {
  patientId: number;
  interestId: number;
}
