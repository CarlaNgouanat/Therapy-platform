import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { AbstractTable } from '@database/tables/AbstractTable';
import { AbstractModel } from '@shared/models/AbstractModel';
import { LogsManager } from '@shared/utils/LogsManager';

/**
 * Singleton DBManager
 * Cette classe utilise le drive de better-sqilte3 pour interagir avec la base de données (au format .db)
 */
export class DBManager {
  // --- VARIABLES ---

  // Driver vers la base de données
  private db: Database.Database | null = null;

  // Définition du chemin vers la base de données (différent en mode dev et prod)
  private readonly dbPath: string = process.env.VITE_DEV_SERVER_URL
    ? 'dismesmots.db' // Mode dev : stockage dans le dossier du projet
    : path.join(app.getPath('userData'), 'dismesmots.db'); // Mode prod : stockage dans le dossier userData d'Electron

  private readonly startPath: string = process.env.VITE_DEV_SERVER_URL
    ? 'database/files/StartDB.sql' // Mode dev : stockage dans le dossier du projet
    : path.join(app.getPath('userData'), 'database', 'files', 'StartDB.sql'); // Mode prod : stockage dans le dossier userData d'Electron

  // Instance de la classe
  private static instance: DBManager | null = null;

  // --- SINGLETON ---

  // Singleton - On empêche d'instancier la classe
  private constructor() {}

  /**
   * Récupérer une instance de la classe DBManager (singleton)
   * @returns Renvoie un objet DBManager
   */
  public static getInstance(): DBManager {
    if (DBManager.instance === null) {
      LogsManager.logInfo(
        "Création d'une nouvelle instance pour la base de données"
      );
      DBManager.instance = new DBManager();
    }
    return DBManager.instance;
  }

  // --- GESTION DU DRIVER ---

  /**
   * Lance la connexion avec la base de données
   * @throws Met fin au processus et renvoie une erreur si le lien est éronné
   */
  public openDB(): void {
    LogsManager.createGroup('DBManager', 'openDB');
    LogsManager.logInfo('Lancement de la connexion avec la base de données');

    if (!this.db) {
      // Ouverture de la base de données
      LogsManager.logInfo(
        `Connexion à la base de données à l'url : ${this.dbPath}`
      );
      this.db = new Database(this.dbPath);

      // Activation du journal WAL pour de meilleures performances
      LogsManager.logInfo(`Activation du journal WAL`);
      this.db.pragma('journal_mode = WAL');

      LogsManager.logSuccess(`La connexion a été établie avec succès`);

      // Initialisation de la base de données
      try {
        LogsManager.logInfo(
          "Récupération du fichier .sql d'initialisation de la base de données (tables, vues, ...)"
        );
        const data: string = fs.readFileSync(this.startPath, 'utf8');

        LogsManager.logInfo('Exécution de la configuration');
        this.execScript(data);

        LogsManager.logSuccess(
          'La Base de données a été initialisée avec succès'
        );
      } catch (error: unknown) {
        LogsManager.logError(
          "Impossible de récupérer le fichier .sql d'initialisation"
        );
        throw new Error(error as string);
      }
    } else {
      LogsManager.logWarning('La connexion a déjà été établie');
    }

    LogsManager.endGroup();
  }

  /**
   * Ferme la connexion avec la base de données
   */
  public closeDB() {
    LogsManager.createGroup('DBManager', 'closeDB');
    LogsManager.logInfo('Fermeture de la connexion avec la base de données');

    if (this.db) {
      LogsManager.logInfo('Fermeture de la connexion');
      this.db.close();
      this.db = null;
      LogsManager.logSuccess('La connexion a été fermée avec succès');
    } else {
      LogsManager.logWarning('La connexion est déjà fermée');
    }

    LogsManager.endGroup();
  }

  // --- EXÉCUTION DES REQUÊTES ---

  /**
   * Exécute un ensemble de requête à exécuter
   * @param requests Requêtes à exécuter
   * @returns Renvoie un objet Database.Database qui correspond au résultat de la requête
   * @throws Renvoie une erreur si la base de données n'est pas initialisée
   */
  public execScript(requests: string): Database.Database {
    if (this.db) {
      return this.db.exec(requests);
    } else {
      throw new Error(
        "Impossible d'effectuer les requêtes, si la connexion n'a pas encore été établie"
      );
    }
  }
  /**
   * Exécute une requête dans la base de données
   * @param request Requête à exécuter
   * @param params Liste des paramètres
   * @returns Renvoie un objet Database.RunResult qui correspond au résultat de la requête
   * @throws Renvoie une erreur si la base de données n'est pas initialisée
   */
  public execRequest<BindParameters extends unknown[]>(
    request: string,
    ...params: BindParameters
  ): Database.RunResult {
    if (this.db) {
      return this.db.prepare(request).run(...params);
    } else {
      throw new Error(
        "Impossible d'effectuer une requête, si la connexion n'a pas encore été établie"
      );
    }
  }

  /**
   * Récupère une donnée d'une table de la base de données
   * @param request Requête à exécuter
   * @param params Liste des paramètres
   * @returns Renvoie la donnée sous la forme d'un Model
   * @throws Renvoie une erreur si la base de données n'est pas initialisée
   */
  public getRequest<
    Table extends AbstractTable,
    Model extends AbstractModel,
    BindParameters extends unknown[],
  >(
    mapper: new () => AbstractMapper<Table, Model>,
    request: string,
    ...params: BindParameters
  ): Model | undefined {
    if (this.db) {
      const row = this.db.prepare(request).get(...params) as Table | undefined;

      if (!row) return undefined;
      else return new mapper().mapTableToModel(row);
    } else {
      throw new Error(
        "Impossible d'effectuer une requête, si la connexion n'a pas encore été établie"
      );
    }
  }

  /**
   * Récupère plusieurs données d'une table de la base de données
   * @param request Requête à exécuter
   * @param params Liste des paramètres
   * @returns Renvoie les données sous la forme d'un tableau de Model[]
   * @throws Renvoie une erreur si la base de données n'est pas initialisée
   */
  public getAllRequest<
    Table extends AbstractTable,
    Model extends AbstractModel,
    BindParameters extends unknown[],
  >(
    mapper: new () => AbstractMapper<Table, Model>,
    request: string,
    ...params: BindParameters
  ): Model[] {
    if (this.db) {
      const row = this.db.prepare(request).all(...params) as Table[];

      const instanceMapper: AbstractMapper<Table, Model> = new mapper();
      return row.map(
        (value: Table): Model => instanceMapper.mapTableToModel(value)
      );
    } else {
      throw new Error(
        "Impossible d'effectuer une requête, si la connexion n'a pas encore été établie"
      );
    }
  }
}
