import { ExerciseInterestModel } from '@shared/models/ExerciseInterestModel';
import { ExerciseInterestTable } from '@database/tables/ExerciseInterestTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';

/**
 * Class ExerciseInterestMapper
 * Cette classe transforme les données de modèle à table ou de table à modèle
 */
export class ExerciseInterestMapper extends AbstractMapper<
  ExerciseInterestTable,
  ExerciseInterestModel
> {
  /**
   * Transforme la table en modèle
   * @param table Table représentant un lien exercice - intérêt
   * @returns Renvoie un objet ExerciseInterestTable
   */
  public mapTableToModel(table: ExerciseInterestTable): ExerciseInterestModel {
    return {
      exerciseId: table.exercise_id,
      interestId: table.interest_id,
    };
  }

  /**
   * Transforme un modèle en table
   * @param model Modèle représentant un lien exercice - intérêt
   * @returns Renvoie un objet ExerciseTable
   */
  public mapModelToTable(model: ExerciseInterestModel): ExerciseInterestTable {
    return {
      exercise_id: model.exerciseId,
      interest_id: model.interestId,
    };
  }
}
