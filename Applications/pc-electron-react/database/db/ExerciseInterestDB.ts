import { AbstractDB } from '@database/db/AbstractDB';
import { ExerciseInterestModel } from '@shared/models/ExerciseInterestModel';
import { ExerciseInterestMapper } from '@database/mappers/ExerciseInterestMapper';
import { ExerciseInterestTable } from '@database/tables/ExerciseInterestTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';

/**
 * Class ExerciseInterestDB
 * Cette classe interagit avec la base de données
 */
export class ExerciseInterestDB extends AbstractDB<
  ExerciseInterestTable,
  ExerciseInterestModel
> {
  // Définition du mapper
  protected mapper: new () => AbstractMapper<
    ExerciseInterestTable,
    ExerciseInterestModel
  > = ExerciseInterestMapper;
}
