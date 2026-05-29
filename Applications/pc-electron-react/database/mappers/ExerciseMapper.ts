import { ExerciseModel } from '@shared/models/ExerciseModel';
import { ExerciseTable } from '@database/tables/ExerciseTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { AbstractExerciseMapper } from '@database/mappers/exercises/AbstractExerciseMapper';
import { AbstractModel } from '@shared/models/AbstractModel';
import { ExerciseType } from '@shared/types/ExerciseType';
import { PCAExerciseMapper } from './exercises/PCAExerciseMapper';
import { OtherExerciseMapper } from './exercises/OtherExerciseMapper';
import { SFAExerciseMapper } from './exercises/SFAExerciseMapper';
import { DateMapper } from './date/DateMapper';

/**
 * Class ExerciseMapper
 * Cette classe transforme les données de modèle à table ou de table à modèle
 */
export class ExerciseMapper extends AbstractMapper<
  ExerciseTable,
  ExerciseModel
> {
  /**
   * Transforme la table en modèle
   * @param table Table représentant un exercice
   * @returns Renvoie un objet ExerciseModel
   */
  public mapTableToModel(table: ExerciseTable): ExerciseModel {
    // Récupération du mapper
    const mapperExercise: AbstractExerciseMapper<AbstractModel> =
      this.getExerciseMapper(table.model);
    const dateMapper: DateMapper = new DateMapper();

    return {
      id: table.id,
      name: table.name,
      model: table.model,
      patientId: table.patient_id,
      createdAt: dateMapper.stringToDate(table.created_at),
      data: mapperExercise.mapJsonStrToModel(table.data),
    };
  }

  /**
   * Transforme un modèle en table
   * @param model Modèle représentant un exercice
   * @returns Renvoie un objet ExerciseTable
   */
  public mapModelToTable(model: ExerciseModel): ExerciseTable {
    // Récupération du mapper
    const mapperExercise: AbstractExerciseMapper<AbstractModel> =
      this.getExerciseMapper(model.model);
    const dateMapper: DateMapper = new DateMapper();

    return {
      id: model.id,
      name: model.name,
      model: model.model,
      patient_id: model.patientId,
      created_at: dateMapper.dateToString(model.createdAt),
      data: mapperExercise.mapModelToJsonStr(model.data),
    };
  }

  /**
   * Sélectionne le mapper adapté en fonction du type d'exercice
   * @param valueModel Type d'exercice
   * @returns Renvoie le mapper
   */
  private getExerciseMapper(
    valueModel: ExerciseType
  ): AbstractExerciseMapper<AbstractModel> {
    switch (valueModel) {
      case 'PCA':
        return new PCAExerciseMapper();
      case 'SFA':
        return new SFAExerciseMapper();
      default:
        return new OtherExerciseMapper();
    }
  }
}
