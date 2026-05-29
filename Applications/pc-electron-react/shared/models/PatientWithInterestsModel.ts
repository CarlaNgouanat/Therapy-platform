import { PatientModel } from '@shared/models/PatientModel';
import { InterestModel } from '@shared/models/InterestModel';

/**
 * Modèle représentant un exercice avec des centres d'intérêt
 */
export interface PatientWithInterestsModel extends PatientModel {
  interests: InterestModel[];
}
