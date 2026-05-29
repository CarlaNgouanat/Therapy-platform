import { SessionExerciseModel } from '@shared/models/SessionExerciseModel';
import { SessionExerciseTable } from '@database/tables/SessionExerciseTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';

/**
 * Class SessionExerciseMapper
 * Cette classe transforme les données de modèle à table ou de table à modèle
 */
export class SessionExerciseMapper extends AbstractMapper<
  SessionExerciseTable,
  SessionExerciseModel
> {
  /**
   * Transforme la table en modèle
   * @param table Table représentant un exercice
   * @returns Renvoie un objet SessionExerciseModel
   */
  public mapTableToModel(table: SessionExerciseTable): SessionExerciseModel {
    return {
      id: table.id,
      sessionId: table.session_id,
      exerciseId: table.exercise_id,
      status: table.status,
    };
  }

  /**
   * Transforme un modèle en table
   * @param model Modèle représentant un exercice
   * @returns Renvoie un objet SessionExerciseTable
   */
  public mapModelToTable(model: SessionExerciseModel): SessionExerciseTable {
    return {
      id: model.id,
      session_id: model.sessionId,
      exercise_id: model.exerciseId,
      status: model.status,
    };
  }
}
