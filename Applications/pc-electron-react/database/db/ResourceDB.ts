import { AbstractDB } from '@database/db/AbstractDB';
import { ResourceModel } from '@shared/models/ResourceModel';
import { ResourceMapper } from '@database/mappers/ResourceMapper';
import { ResourceTable } from '@database/tables/ResourceTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { DBRequestResourceTypeModel } from '@shared/models/DBRequestResourceTypeModel';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';

/**
 * Class ResourceDB
 * Cette classe interagit avec la base de données
 */
export class ResourceDB extends AbstractDB<ResourceTable, ResourceModel> {
  // Définition du mapper
  protected mapper: new () => AbstractMapper<ResourceTable, ResourceModel> =
    ResourceMapper;

  /**
   * Récuépartion de toutes les ressources d'un type donné
   * @param modelType Model avec un type de ressource
   * @returns Renvoie un tableau de ResourceModel
   */
  public getByType(modelType: DBRequestResourceTypeModel): ResourceModel[] {
    return this.getAll(
      'SELECT * FROM resources WHERE type = ? ORDER BY name',
      modelType.type
    );
  }

  /**
   * Création d'une nouvelle ressource
   * @param resource Objet ResourceModel avec les informations de la ressource à créer
   * @returns Renvoie un model avec le l'identifiant de la nouvelle donnée
   */
  public createResource(resource: ResourceModel): DBResponseCreateModel {
    // Mapping des données en table
    const resourceTable: ResourceTable = new this.mapper().mapModelToTable(
      resource
    );

    // Ajout de la ressource
    const responseCreate: DBResponseCreateModel = this.create(
      'INSERT INTO resources (name, type, file_path) VALUES (?, ?, ?)',
      resourceTable.name,
      resourceTable.type,
      resourceTable.file_path
    );

    return responseCreate;
  }

  /**
   * Suppression d'une ressource
   * @param modelId Model avec un identifiant
   * @returns Renvoie true si l'élément a bien été supprimé
   * @throws Renvoie une erreur si l'identifiant de la ressource n'existe pas
   */
  public deleteResource(modelId: DBRequestIdModel): DBResponseDeleteModel {
    const responseDelete: DBResponseDeleteModel = this.delete(
      'DELETE FROM resources WHERE id = ?',
      modelId.id
    );

    // Si aucune ligne n'a été supprimée, on renvoie une erreur
    if (responseDelete.nbDeleteLine == 0)
      throw new Error(
        "Impossible de supprimer la ressource parce que l'identifiant n'existe pas"
      );
    // Sinon, on renvoie le nombre de ligne
    else return responseDelete;
  }
}
