import { SessionExerciseStatus } from '@shared/types/SessionExerciseStatus';
import { AbstractTable } from '@database/tables/AbstractTable';

/**
 * Table représentant un exercice en session
 */
export interface SessionExerciseTable extends AbstractTable {
  id: number;
  session_id: number;
  exercise_id: number;
  status: SessionExerciseStatus;
}
