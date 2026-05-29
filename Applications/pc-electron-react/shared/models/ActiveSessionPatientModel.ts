import { SessionModel } from './SessionModel';
import { PatientWithInterestsModel } from './PatientWithInterestsModel';

/**
 * Table représentant la session active d'un patient
 */
export interface ActiveSessionPatientModel extends SessionModel {
  patient: PatientWithInterestsModel;
}
