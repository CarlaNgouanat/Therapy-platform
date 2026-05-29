import { AbstractTable } from '@database/tables/AbstractTable';

/**
 * Table représentant un centre d'intérêt
 */
export interface InterestTable extends AbstractTable {
  id: number;
  name: string;
  created_at: string;
}
