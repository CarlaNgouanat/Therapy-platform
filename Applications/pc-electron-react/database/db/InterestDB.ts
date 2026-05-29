import { AbstractDB } from '@database/db/AbstractDB';
import { InterestModel } from '@shared/models/InterestModel';
import { InterestMapper } from '@database/mappers/InterestMapper';
import { InterestTable } from '@database/tables/InterestTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { DBRequestNameModel } from '@shared/models/DBRequestNameModel';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';
import { PatientWithInterestsModel } from '@shared/models/PatientWithInterestsModel';
import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';
import { DBResponseUpdateModel } from '@shared/models/DBResponseUpdateModel';

/**
 * Class InterestDB
 * Cette classe interagit avec la base de données
 */
export class InterestDB extends AbstractDB<InterestTable, InterestModel> {
  // Définition du mapper
  protected mapper: new () => AbstractMapper<InterestTable, InterestModel> =
    InterestMapper;

  /**
   * Récupère ou crée un nouveau centre d'intérêt à partir d'un nom
   * @param modelName Model avec un nom
   * @returns Identifiant de l'intérêt dans la base de données
   */
  private getOrCreate(modelName: DBRequestNameModel): DBResponseCreateModel {
    // Formatage du nom
    const nameLowerCase = modelName.name.trim().toLowerCase();
    const nameCapitalize =
      nameLowerCase.charAt(0).toUpperCase() + nameLowerCase.slice(1);

    // Récupération de centre d'intérêt
    const data: InterestModel | undefined = this.get(
      'SELECT * FROM interests WHERE LOWER(name) = ?',
      nameLowerCase
    );

    // Si l'intérêt existe déjà, son identifiant
    if (data) {
      return <DBResponseCreateModel>{
        newId: data.id,
      };
    }

    // Sinon, on le crée
    else {
      return this.create(
        'INSERT INTO interests (name) VALUES (?)',
        nameCapitalize
      );
    }
  }

  /**
   * Renvoie tous les centres d'intérêts
   * @returns Renvoie un tableau d'objet InterestModel
   */
  public getAllInterests(): InterestModel[] {
    return this.getAll('SELECT * FROM interests ORDER BY name');
  }

  /**
   * Crée un centre d'intérêt à partir de son nom
   * @param modelName Model avec un nom
   * @returns Identifiant du centre d'intérêt créé ou existant
   */
  public createInterest(modelName: DBRequestNameModel): DBResponseCreateModel {
    return this.getOrCreate(modelName);
  }

  /**
   * Modifie le nom d'un centre d'intérêt
   * @param interest Données du centre d'intérêt
   * @returns Nombre de lignes modifiées
   */
  public updateInterest(interest: InterestModel): DBResponseUpdateModel {
    const nameLowerCase: string = interest.name.trim().toLowerCase();
    const nameCapitalize: string =
      nameLowerCase.charAt(0).toUpperCase() + nameLowerCase.slice(1);

    return this.update(
      'UPDATE interests SET name = ? WHERE id = ?',
      nameCapitalize,
      interest.id
    );
  }

  /**
   * Supprime un centre d'intérêt
   * @param modelId Model avec un identifiant
   * @returns Nombre de lignes supprimées
   * @throws Renvoie une erreur si l'identifiant n'existe pas
   */
  public deleteInterest(modelId: DBRequestIdModel): DBResponseDeleteModel {
    const responseDelete: DBResponseDeleteModel = this.delete(
      'DELETE FROM interests WHERE id = ?',
      modelId.id
    );

    if (responseDelete.nbDeleteLine === 0) {
      throw new Error(
        "Impossible de supprimer le centre d'intérêt parce que l'identifiant n'existe pas"
      );
    }

    return responseDelete;
  }

  /**
   * Renvoie la liste des centres d'intérêts associés à un patient
   * @param modelId Model avec un identifiant
   */
  public getByPatientId(modelId: DBRequestIdModel): InterestModel[] {
    return this.getAll(
      `SELECT i.* 
             FROM interests i 
             JOIN patient_interests pi ON i.id = pi.interest_id 
             WHERE pi.patient_id = ?
             ORDER BY i.name`,
      modelId.id
    );
  }

  /**
   * Renvoie la liste des centres d'intérêts associés à un exercice
   * @param modelId Model avec un identifiant
   */
  public getByExerciseId(modelId: DBRequestIdModel): InterestModel[] {
    return this.getAll(
      `SELECT i.* 
             FROM interests i 
             JOIN exercise_interests ei ON i.id = ei.interest_id 
             WHERE ei.exercise_id = ?
             ORDER BY i.name`,
      modelId.id
    );
  }

  /**
   * Suppresion des liens qui ne sont pas utilisés
   */
  private cleanupOrphaned(): DBResponseDeleteModel {
    return this.delete(
      `DELETE FROM interests 
             WHERE id NOT IN (
                SELECT DISTINCT interest_id FROM patient_interests
                UNION
                SELECT DISTINCT interest_id FROM exercise_interests
             )`
    );
  }

  /**
   * Modifie la liste des centres d'intérêts d'un patient
   * @param patient Données d'un patient
   */
  public setForPatient(
    patient: PatientWithInterestsModel
  ): DBResponseUpdateModel {
    // Suppression de tous les liens intérêts-patients existants
    const responseDelete: DBResponseDeleteModel = this.delete(
      'DELETE FROM patient_interests WHERE patient_id = ?',
      patient.id
    );

    // Récréation des liens à partir de la liste d'intérêts
    if (patient.interests.length > 0) {
      for (const interest of patient.interests) {
        // Mapping des données en table
        const interestTable: InterestTable = new this.mapper().mapModelToTable(
          interest
        );

        const responseCreate: DBResponseCreateModel = this.getOrCreate(<
          DBRequestNameModel
        >{
          name: interestTable.name,
        });
        this.create(
          'INSERT INTO patient_interests (patient_id, interest_id) VALUES (?, ?)',
          patient.id,
          responseCreate.newId
        );
      }
    }

    // Nettoyage des intérêts orphelins
    const reponseCleanUp: DBResponseDeleteModel = this.cleanupOrphaned();

    // Renvoie du nombre de ligne modifiée
    return <DBResponseUpdateModel>{
      nbUpdateLine:
        responseDelete.nbDeleteLine +
        reponseCleanUp.nbDeleteLine +
        patient.interests.length,
    };
  }

  /**
   * Modifie la liste des centres d'intérêts d'un exercice
   * @param exercise Données d'un exercice
   */
  public setForExercise(
    exercise: ExerciseWithInterestsModel
  ): DBResponseUpdateModel {
    // Suppression de tous les liens intérêts-patients existants
    const responseDelete: DBResponseDeleteModel = this.delete(
      'DELETE FROM exercise_interests WHERE exercise_id = ?',
      exercise.id
    );

    // Récréation des liens à partir de la liste d'intérêts
    if (exercise.interests.length > 0) {
      for (const interest of exercise.interests) {
        // Mapping des données en table
        const interestTable: InterestTable = new this.mapper().mapModelToTable(
          interest
        );

        const responseCreate: DBResponseCreateModel = this.getOrCreate(<
          DBRequestNameModel
        >{
          name: interestTable.name,
        });
        this.create(
          'INSERT INTO exercise_interests (exercise_id, interest_id) VALUES (?, ?)',
          exercise.id,
          responseCreate.newId
        );
      }
    }

    // Nettoyage des intérêts orphelins
    const responseCleanUp: DBResponseDeleteModel = this.cleanupOrphaned();

    // Renvoie du nombre de ligne modifiée
    return <DBResponseUpdateModel>{
      nbUpdateLine:
        responseDelete.nbDeleteLine +
        responseCleanUp.nbDeleteLine +
        exercise.interests.length,
    };
  }
}
