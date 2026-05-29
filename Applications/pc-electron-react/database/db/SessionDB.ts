import { AbstractDB } from '@database/db/AbstractDB';
import { SessionModel } from '@shared/models/SessionModel';
import { SessionMapper } from '@database/mappers/SessionMapper';
import { SessionTable } from '@database/tables/SessionTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { SessionExerciseDB } from '@database/db/SessionExerciseDB';
import { SessionWithExerciseCountModel } from '@shared/models/SessionWithExerciseCountModel';
import { DBResponseUpdateModel } from '@shared/models/DBResponseUpdateModel';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';
import { ActiveSessionPatientModel } from '@shared/models/ActiveSessionPatientModel';
import { PatientDB } from './PatientDB';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';
import { IsActiveSessionModel } from '@shared/models/IsActiveSessionModel';

/**
 * Class SessionDB
 * Cette classe interagit avec la base de données
 */
export class SessionDB extends AbstractDB<SessionTable, SessionModel> {
  // Définition du mapper
  protected mapper: new () => AbstractMapper<SessionTable, SessionModel> =
    SessionMapper;

  /**
   * Récupère de la session actuelle avec le patient
   * @returns Renvoie un objet ActiveSessionPatientModel
   * @throws Renvoie une erreur si la session n'existe pas
   */
  public isActivePatient(): IsActiveSessionModel {
    // Récupération des sessions ainsi que le nombre d'exercices associés
    const sessions: SessionModel[] = this.getAll(
      "SELECT * FROM sessions WHERE status = 'IN_PROGRESS' ORDER BY date DESC LIMIT 1"
    );

    return {
      isActive: sessions.length > 0,
    };
  }

  /**
   * Récupère de la session actuelle avec le patient
   * @returns Renvoie un objet ActiveSessionPatientModel
   * @throws Renvoie une erreur si la session n'existe pas
   */
  public getActivePatient(): ActiveSessionPatientModel {
    // Récupération des sessions ainsi que le nombre d'exercices associés
    const session: SessionModel | undefined = this.get(
      "SELECT * FROM sessions WHERE status = 'IN_PROGRESS' ORDER BY date DESC LIMIT 1"
    );

    // Renvoie d'une erreur si la session n'existe pas
    if (!session) {
      throw new Error(
        "Impossible de récupérer les données de la session, car elle n'existe pas"
      );
    }

    const patientDB: PatientDB = new PatientDB();
    return {
      ...session,
      patient: patientDB.getPatientWithInterestsById({
        id: session.patientId,
      } as DBRequestIdModel),
    };
  }

  /**
   * Récupère les sessions associés à un patient
   * @param modelId Model avec un identifiant
   * @returns Liste sous la forme de SessionWithExerciseCountModel
   */
  public getByPatient(
    modelId: DBRequestIdModel
  ): SessionWithExerciseCountModel[] {
    // Mise à jour des statuts des sessions planifiées pour lesquelles la date est passée
    this.update(
      `UPDATE sessions 
             SET status = 'LATE' 
             WHERE patient_id = ? 
             AND status IN ('PLANNED') 
             AND date < datetime('now', '+1 hour')`,
      modelId.id
    );
    this.update(
      `UPDATE sessions 
             SET status = 'PLANNED' 
             WHERE patient_id = ? 
             AND status IN ('LATE') 
             AND date > datetime('now', '+1 hour')`,
      modelId.id
    );

    // TODO : Utiliser un trigger ou une fonction SQL

    // Récupération des sessions ainsi que le nombre d'exercices associés
    const sessionExerciseDB: SessionExerciseDB = new SessionExerciseDB();
    const sessions: SessionModel[] = this.getAll(
      'SELECT * FROM sessions WHERE patient_id = ? ORDER BY date DESC',
      modelId.id
    );

    return sessions.map(
      (session: SessionModel): SessionWithExerciseCountModel => {
        return <SessionWithExerciseCountModel>{
          ...session,
          exerciseCount: sessionExerciseDB.getBySession(<DBRequestIdModel>{
            id: session.id,
          }).length,
        };
      }
    );
  }

  /**
   * Récupére une session à partir de son identifiant
   * @param modelId Model avec un identifiant
   * @returns Renvoie un objet SessionModel
   * @throws Renvoie une erreur si l'identifiant de la session n'existe pas
   */
  public getById(modelId: DBRequestIdModel): SessionModel {
    const session: SessionModel | undefined = this.get(
      'SELECT * FROM sessions WHERE id = ?',
      modelId.id
    );

    // On arrête le traitement si aucune session n'a été trouvé
    if (!session)
      throw new Error(
        "Impossible de récupérer la session, car son identifiant n'existe pas"
      );
    else return session;
  }

  /**
   * Lance une nouvelle session
   * @param session Session à lancer
   * @returns Renvoie un model avec le nombre de ligne modifiée
   * @throws Renvoie une erreur si l'identifiant de la session n'existe pas
   */
  public startSession(session: SessionModel): DBResponseUpdateModel {
    let nbUpdate: number = 0;
    const targetSession = this.getById({
      id: session.id,
    } as DBRequestIdModel);

    const isActive = this.isActivePatient();
    if (isActive.isActive) {
      const activeSession = this.getActivePatient();

      // ANCIEN - Conflit : une autre séance est déjà en cours
      // Conflit : Essaye de lancer la même séance
      if (activeSession.id === targetSession.id) {
        throw new Error(
          "Impossible de démarrer l'exercice, car l'exercice demandé est déjà actif"
        );
      }

      const responseActive: DBResponseUpdateModel = this.updateSessionStatus({
        ...activeSession,
        status: 'PLANNED',
        date: new Date(),
      });
      nbUpdate += responseActive.nbUpdateLine;
    }

    // Démarrage normal (ou reprise idempotente)
    const responseTarget: DBResponseUpdateModel = this.updateSessionStatus({
      ...targetSession,
      status: 'IN_PROGRESS',
      date: new Date(),
    });

    nbUpdate += responseTarget.nbUpdateLine;
    return {
      nbUpdateLine: nbUpdate,
    };
  }

  /**
   * Création d'une nouvelle session pour un patient
   * @param session Session à créer
   * @returns Renvoie un model avec le l'identifiant de la nouvelle donnée
   */
  public createSession(session: SessionModel): DBResponseCreateModel {
    // Mapping des données en table
    const sessionTable: SessionTable = new this.mapper().mapModelToTable(
      session
    );

    // Ajout d'une nouvelle séance pour un patient
    const responseCreate: DBResponseCreateModel = this.create(
      'INSERT INTO sessions (patient_id, date, status, notes) VALUES (?, ?, ?, ?)',
      sessionTable.patient_id,
      sessionTable.date,
      sessionTable.status,
      sessionTable.notes
    );

    return responseCreate;
  }

  /**
   * Mise à jour  des données de la session
   * @param sessionModel Donnée d'une session
   * @returns Renvoie un model avec le nombre de ligne modifiée
   * @throws Renvoie une erreur si l'identifiant de la session n'existe pas
   */
  public updateSession(sessionModel: SessionModel): DBResponseUpdateModel {
    // Mapping des données en table
    const sessionTable: SessionTable = new this.mapper().mapModelToTable(
      sessionModel
    );

    // Modification de la session
    const responseUpdate: DBResponseUpdateModel = this.update(
      'UPDATE sessions SET patient_id = ?, date = ?, status = ?, notes = ?, created_at = ? WHERE id = ?',
      sessionTable.patient_id,
      sessionTable.date,
      sessionTable.status,
      sessionTable.notes,
      sessionTable.created_at,
      sessionTable.id
    );

    // Si aucune ligne n'a été modifiée, alors on renvoie une erreur
    if (responseUpdate.nbUpdateLine == 0)
      throw new Error(
        "Impossible de mettre à jour la session parce que l'identifiant n'existe pas"
      );
    // Sinon, on renvoie le nombre ligne de modifiée
    else return responseUpdate;
  }

  /**
   * Mise à jour du statut d'une session (avec mise à jour de la date si passage à IN_PROGRESS)
   * @param sessionModel Donnée d'une session
   * @returns Renvoie un model avec le nombre de ligne modifiée
   * @throws Renvoie une erreur si l'identifiant de la session n'existe pas
   */
  public updateSessionStatus(
    sessionModel: SessionModel
  ): DBResponseUpdateModel {
    const session: SessionModel | undefined = this.get(
      'SELECT * FROM sessions WHERE id = ?',
      sessionModel.id
    );

    if (session) {
      // Si le statut passe à IN_PROGRESS depuis un autre statut, mettre à jour la date vers maintenant
      if (
        sessionModel.status === 'IN_PROGRESS' &&
        session.status !== 'IN_PROGRESS'
      ) {
        sessionModel.date = new Date();
        const responseUpdate: DBResponseUpdateModel =
          this.updateSession(sessionModel);
        return responseUpdate;
      }

      // Sinon, mettre à jour uniquement le statut
      else {
        const responseUpdate: DBResponseUpdateModel =
          this.updateSession(sessionModel);
        return responseUpdate;
      }
    } else
      throw new Error(
        "Impossible de mettre à jour la session parce que l'identifiant n'existe pas"
      );
  }

  /**
   * Suppression d'une session
   * @param modelId Model avec un identifiant
   * @returns Renvoie true si l'élément a bien été supprimé
   * @throws Renvoie une erreur si l'identifiant de la session n'existe pas
   */
  public deleteById(modelId: DBRequestIdModel): DBResponseDeleteModel {
    const responseDelete: DBResponseDeleteModel = this.delete(
      'DELETE FROM sessions WHERE id = ?',
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
