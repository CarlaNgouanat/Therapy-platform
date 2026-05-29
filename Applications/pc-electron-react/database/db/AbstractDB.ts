import Database from 'better-sqlite3';
import { DBManager } from '@database/db/DBManager';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { AbstractModel } from '@shared/models/AbstractModel';
import { AbstractTable } from '@database/tables/AbstractTable';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { DBResponseUpdateModel } from '@shared/models/DBResponseUpdateModel';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';

/**
 * Class abstract AbstractDB
 * Cette classe abstraite représente la structure générale d'un fichier de DB
 */
export abstract class AbstractDB<
  Table extends AbstractTable,
  Model extends AbstractModel,
> {
  // Instance du driver
  protected dbManager: DBManager = DBManager.getInstance();

  // Définition du mapper en abstract
  protected abstract mapper: new () => AbstractMapper<Table, Model>;

  /**
   * Récupérer une donnée de la base de données
   * @param request Requête à exécuter
   * @param params Liste des paramètres
   * @returns Renvoie un objet model correspondant au résultat
   */
  protected get<BindParameters extends unknown[]>(
    request: string,
    ...params: BindParameters
  ): Model | undefined {
    return this.dbManager.getRequest(this.mapper, request, ...params);
  }

  /**
   * Récupérer plusieurs données de la base de données
   * @param request Requête à exécuter
   * @param params Liste des paramètres
   * @returns Renvoie un tableau d'objet correspondant au résultat
   */
  protected getAll<BindParameters extends unknown[]>(
    request: string,
    ...params: BindParameters
  ): Model[] {
    return this.dbManager.getAllRequest(this.mapper, request, ...params);
  }

  /**
   * Ajouter une ligne à la base de données
   * @param request Requête à exécuter
   * @param params Liste des paramètres
   * @returns Renvoie un model avec le l'identifiant de la nouvelle donnée
   */
  protected create<BindParameters extends unknown[]>(
    request: string,
    ...params: BindParameters
  ): DBResponseCreateModel {
    const resRequest: Database.RunResult = this.dbManager.execRequest(
      request,
      ...params
    );
    return <DBResponseCreateModel>{
      newId: resRequest.lastInsertRowid as number,
    };
  }

  /**
   * Modifier des données de la base de données
   * @param request Requête à exécuter
   * @param params Liste des paramètres
   * @returns Renvoie un model avec le nombre de ligne modifiée
   */
  protected update<BindParameters extends unknown[]>(
    request: string,
    ...params: BindParameters
  ): DBResponseUpdateModel {
    const resRequest: Database.RunResult = this.dbManager.execRequest(
      request,
      ...params
    );
    return <DBResponseUpdateModel>{
      nbUpdateLine: resRequest.changes,
    };
  }

  /**
   * Supprimer des lignes de la base de données
   * @param request Requête à exécuter
   * @param params Liste des paramètres
   * @returns Renvoie un model avec le nombre de ligne supprimée
   */
  protected delete<BindParameters extends unknown[]>(
    request: string,
    ...params: BindParameters
  ): DBResponseDeleteModel {
    const resRequest: Database.RunResult = this.dbManager.execRequest(
      request,
      ...params
    );
    return <DBResponseDeleteModel>{
      nbDeleteLine: resRequest.changes,
    };
  }
}
