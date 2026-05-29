import { InterestModel } from '@shared/models/InterestModel';
import { InterestTable } from '@database/tables/InterestTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { DateMapper } from './date/DateMapper';

/**
 * Class InterestMapper
 * Cette classe transforme les données de modèle à table ou de table à modèle
 */
export class InterestMapper extends AbstractMapper<
  InterestTable,
  InterestModel
> {
  /**
   * Transforme la table en modèle
   * @param table Table représentant un intérêt
   * @returns Renvoie un objet InterestTable
   */
  public mapTableToModel(table: InterestTable): InterestModel {
    // Récupération du mapper
    const dateMapper: DateMapper = new DateMapper();

    return {
      id: table.id,
      name: table.name,
      createdAt: dateMapper.stringToDate(table.created_at),
    };
  }

  /**
   * Transforme un modèle en table
   * @param model Modèle représentant un intérêt
   * @returns Renvoie un objet ExerciseTable
   */
  public mapModelToTable(model: InterestModel): InterestTable {
    // Récupération du mapper
    const dateMapper: DateMapper = new DateMapper();

    return {
      id: model.id,
      name: model.name,
      created_at: dateMapper.dateToString(model.createdAt),
    };
  }
}
