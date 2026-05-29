import { AbstractModel } from '@shared/models/AbstractModel';
import { AbstractTable } from '@database/tables/AbstractTable';

/**
 * Class abstract AbstractMapper
 * Cette classe abstraite représente la structure générale d'un mapper
 */
export abstract class AbstractMapper<
  Table extends AbstractTable,
  Model extends AbstractModel,
> {
  /**
   * Transforme une table en modèle
   * @param table Table de la base de données
   * @returns Objet Modèle équivalent
   */
  public abstract mapTableToModel(table: Table): Model;

  /**
   * Transforme un modèle en table
   * @param model Model représentant une donnée
   * @returns Objet Table équivalent
   */
  public abstract mapModelToTable(model: Model): Table;
}
