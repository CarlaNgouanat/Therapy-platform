import { PatientGender } from '@shared/types/PatientGender';
import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Modèle représentant un patient
 */
export interface PatientModel extends AbstractModel {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: PatientGender;
  notes: string;
  createdAt: Date;
}
