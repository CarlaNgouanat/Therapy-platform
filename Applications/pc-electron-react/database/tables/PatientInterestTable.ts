import { AbstractTable } from '@database/tables/AbstractTable';

/**
 * Table représentant un lien patient - centre d'intérêt
 */
export interface PatientInterestTable extends AbstractTable {
  patient_id: number;
  interest_id: number;
}
