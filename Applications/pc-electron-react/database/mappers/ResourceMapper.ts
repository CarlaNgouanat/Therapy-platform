import { ResourceModel } from '@shared/models/ResourceModel';
import { ResourceTable } from '@database/tables/ResourceTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { DateMapper } from './date/DateMapper';

/**
 * Class Resource
 * Cette classe transforme les données de modèle à table ou de table à modèle
 */
export class ResourceMapper extends AbstractMapper<
  ResourceTable,
  ResourceModel
> {
  /**
   * Transforme la table en modèle
   * @param table Table représentant une resource
   * @returns Renvoie un objet ResourceModel
   */
  public mapTableToModel(table: ResourceTable): ResourceModel {
    // Récupération du mapper
    const dateMapper: DateMapper = new DateMapper();

    return {
      id: table.id,
      name: table.name,
      type: table.type,
      filePath: table.file_path,
      createdAt: dateMapper.stringToDate(table.created_at),
    };
  }

  /**
   * Transforme un modèle en table
   * @param model Modèle représentant une resource
   * @returns Renvoie un objet ResourceTable
   */
  public mapModelToTable(model: ResourceModel): ResourceTable {
    // Récupération du mapper
    const dateMapper: DateMapper = new DateMapper();

    return {
      id: model.id,
      name: model.name,
      type: model.type,
      file_path: model.filePath,
      created_at: dateMapper.dateToString(model.createdAt),
    };
  }
}
