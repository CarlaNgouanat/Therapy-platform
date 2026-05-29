import { AbstractTable } from '@database/tables/AbstractTable';

/**
 * Table représentant un lien exercice - centre d'intérêt
 */
export interface ExerciseInterestTable extends AbstractTable {
  exercise_id: number;
  interest_id: number;
}
