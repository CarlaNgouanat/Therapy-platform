import { PatientGender } from '@shared/types/PatientGender';
import { AbstractTable } from '@database/tables/AbstractTable';

/**
 * Table représentant un patient
 */
export interface PatientTable extends AbstractTable {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: PatientGender;
  notes: string;
  created_at: string;
}
