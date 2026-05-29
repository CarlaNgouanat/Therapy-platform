import { AbstractDB } from '@database/db/AbstractDB';
import { SessionExerciseModel } from '@shared/models/SessionExerciseModel';
import { SessionExerciseMapper } from '@database/mappers/SessionExerciseMapper';
import { SessionExerciseTable } from '@database/tables/SessionExerciseTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { SessionDB } from '@database/db/SessionDB';
import { SessionModel } from '@shared/models/SessionModel';
import { SessionExerciseWithExerciseModel } from '@shared/models/SessionExerciseWithExerciseModel';
import { ExerciseDB } from '@database/db/ExerciseDB';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';
import { DBResponseUpdateModel } from '@shared/models/DBResponseUpdateModel';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';

/**
 * Class SessionExerciseDB
 * Cette classe interagit avec la base de données
 */
export class SessionExerciseDB extends AbstractDB<
  SessionExerciseTable,
  SessionExerciseModel
> {
  // Définition du mapper
  protected mapper: new () => AbstractMapper<
    SessionExerciseTable,
    SessionExerciseModel
  > = SessionExerciseMapper;

  /**
   * Récupére nombre de lien session - exercice à partir d'un identifiant de session
   * @param modelId Model avec un identifiant
   * @returns Renvoie un tableau de liens SessionExerciseModel
   */
  public getBySession(modelId: DBRequestIdModel): SessionExerciseModel[] {
    return this.getAll(
      'SELECT * FROM session_exercises WHERE session_id = ?',
      modelId.id
    );
  }

  /**
   * Récupération de tous les exercices d'une session donnée
   * @param modelId Model avec un identifiant
   * @returns Renvoie un tableau de SessionExerciseWithExerciseModel
   */
  public getExercisesForSession(
    modelId: DBRequestIdModel
  ): SessionExerciseWithExerciseModel[] {
    const exerciseDB: ExerciseDB = new ExerciseDB();

    return this.getBySession(modelId)
      .map(
        (
          sessionExercise: SessionExerciseModel
        ): SessionExerciseWithExerciseModel => {
          return <SessionExerciseWithExerciseModel>{
            ...sessionExercise,
            exercise: exerciseDB.getById({
              id: sessionExercise.exerciseId,
            } as DBRequestIdModel),
          };
        }
      )
      .filter(
        (
          sessionExerciseWithExerciseModel: SessionExerciseWithExerciseModel
        ) => {
          return sessionExerciseWithExerciseModel.exercise !== undefined;
        }
      );
  }

  /**
   * Ajout d'un exercice à une session
   * @param sessionExercise Objet SessionExercise Model
   * @returns Renvoie un model avec le l'identifiant de la nouvelle donnée
   */
  public addExerciseToSession(
    sessionExercise: SessionExerciseModel
  ): DBResponseCreateModel {
    // Mapping des données en table
    const sessionExerciseTable: SessionExerciseTable =
      new this.mapper().mapModelToTable(sessionExercise);

    // Ajout d'un nouvel exercice à la séance
    const responseCreate: DBResponseCreateModel = this.create(
      'INSERT INTO session_exercises (session_id, exercise_id, status) VALUES (?, ?, ?)',
      sessionExerciseTable.session_id,
      sessionExerciseTable.exercise_id,
      sessionExerciseTable.status
    );

    return responseCreate;
  }

  /**
   * Mise à jour du statut d'un exercice dans une session (et mise à jour de la session si nécessaire)
   * @param sessionExercise Donnée d'un exercice d'une session
   * @returns Renvoie un model avec le nombre de ligne modifiée
   * @throws Renvoie une erreur si l'identifiant de la session d'exercice n'existe pas
   */
  public updateSessionExerciseStatus(
    sessionExercise: SessionExerciseModel
  ): DBResponseUpdateModel {
    // Mapping des données en table
    const sessionExerciseTable: SessionExerciseTable =
      new this.mapper().mapModelToTable(sessionExercise);

    const responseUpdate: DBResponseUpdateModel = this.update(
      'UPDATE session_exercises SET status = ? WHERE id = ?',
      sessionExerciseTable.status,
      sessionExerciseTable.id
    );

    // Si l'exercice est marqué comme terminé
    if (sessionExerciseTable.status === 'DONE') {
      const dataSessionExercise: SessionExerciseModel | undefined = this.get(
        'SELECT session_id FROM session_exercises WHERE id = ?',
        sessionExerciseTable.id
      );

      // Si l'exercice de session existe
      if (dataSessionExercise) {
        const dataSessionExerciseTable: SessionExerciseTable =
          new this.mapper().mapModelToTable(sessionExercise);

        const sessionDB: SessionDB = new SessionDB();
        const dataSession: SessionModel | undefined = sessionDB.getById(<
          DBRequestIdModel
        >{
          id: dataSessionExerciseTable.session_id,
        });

        // Si la session existe et n'est pas déjà en cours, mise à jour de son statut et de sa date
        if (dataSession && dataSession.status !== 'IN_PROGRESS') {
          const now = new Date().toISOString();
          const responseUpdateSession: DBResponseUpdateModel = this.update(
            "UPDATE sessions SET status = 'IN_PROGRESS', date = ? WHERE id = ?",
            now,
            dataSessionExerciseTable.session_id
          );
          responseUpdate.nbUpdateLine += responseUpdateSession.nbUpdateLine;
        }
      }
    }

    // Si aucune ligne n'a été modifiée, alors on renvoie une erreur
    if (responseUpdate.nbUpdateLine == 0)
      throw new Error(
        "Impossible de mettre à jour la session d'exercice parce que l'identifiant n'existe pas"
      );
    // Sinon, on renvoie le nombre ligne de modifiée
    else return responseUpdate;
  }

  /**
   * Suppression d'un exercice d'une session
   * @param modelId Model avec un identifiant
   * @returns Renvoie true si l'élément a bien été supprimé
   * @throws Renvoie une erreur si l'identifiant de la session d'exercice n'existe pas
   */
  public deleteById(modelId: DBRequestIdModel): DBResponseDeleteModel {
    const responseDelete: DBResponseDeleteModel = this.delete(
      'DELETE FROM session_exercises WHERE id = ?',
      modelId.id
    );

    // Si aucune ligne n'a été supprimée, on renvoie une erreur
    if (responseDelete.nbDeleteLine == 0)
      throw new Error(
        "Impossible de supprimer la session d'exercice parce que l'identifiant n'existe pas"
      );
    // Sinon, on renvoie le nombre de ligne
    else return responseDelete;
  }
}
