import { SessionStatus } from '@shared/types/SessionStatus';
import { AbstractTable } from '@database/tables/AbstractTable';

/**
 * Table représentant un exercice en session
 */
export interface SessionTable extends AbstractTable {
  id: number;
  patient_id: number;
  date: string;
  status: SessionStatus;
  notes: string;
  created_at: string;
}
