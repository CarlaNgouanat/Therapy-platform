import { AbstractDB } from '@database/db/AbstractDB';
import { PatientModel } from '@shared/models/PatientModel';
import { PatientMapper } from '@database/mappers/PatientMapper';
import { PatientTable } from '@database/tables/PatientTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { PatientWithInterestsModel } from '@shared/models/PatientWithInterestsModel';
import { InterestDB } from '@database/db/InterestDB';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';
import { DBResponseUpdateModel } from '@shared/models/DBResponseUpdateModel';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';

/**
 * Class PatientDB
 * Cette classe interagit avec la base de données
 */
export class PatientDB extends AbstractDB<PatientTable, PatientModel> {
  // Définition du mapper
  protected mapper: new () => AbstractMapper<PatientTable, PatientModel> =
    PatientMapper;

  /**
   * Récupération de tous les patients avec les intérêts
   * @returns Renvoie un tableau d'objet PatientWithInterestsModel[]
   */
  public getAllPatientsWithInterests(): PatientWithInterestsModel[] {
    // Récupération des patients
    const interestDB: InterestDB = new InterestDB();
    const patients: PatientModel[] = this.getAll(
      'SELECT * FROM patients ORDER BY first_name, last_name'
    );

    // Fusion des patients et des intérêts
    return patients.map((value: PatientModel): PatientWithInterestsModel => {
      return <PatientWithInterestsModel>{
        ...value,
        interests: interestDB.getByPatientId(<DBRequestIdModel>{
          id: value.id,
        }),
      };
    });
  }

  /**
   * Récupération des centres d'intérêts d'un patient
   * @param modelId Model avec un identifiant
   * @returns Renvoie un objet PatientWithInterestsModel
   * @throws Renvoie une erreur si l'identifiant du patient n'existe pas
   */
  public getPatientWithInterestsById(
    modelId: DBRequestIdModel
  ): PatientWithInterestsModel {
    // Récupération de le patient
    const interestDB: InterestDB = new InterestDB();
    const patient: PatientModel | undefined = this.get(
      'SELECT * FROM patients WHERE id = ?',
      modelId.id
    );

    // On arrête le traitement si aucun patient n'a été trouvé
    if (!patient)
      throw new Error(
        "Impossible de récupérer le patient, car son identifiant n'existe pas"
      );

    // Fusion du patient et des intérêts
    return <PatientWithInterestsModel>{
      ...patient,
      interests: interestDB.getByPatientId(<DBRequestIdModel>{
        id: patient.id,
      }),
    };
  }

  /**
   * Ajout un nouveau patient à la base de données
   * @param patientWithInterests Détail du patient sous la forme de PatientWithInterestsModel
   * @returns Renvoie un model avec le l'identifiant de la nouvelle donnée
   */
  public createPatient(
    patientWithInterests: PatientWithInterestsModel
  ): DBResponseCreateModel {
    // Mapping des données en table
    const patientTable: PatientTable = new this.mapper().mapModelToTable(
      patientWithInterests
    );

    // Ajout du patient
    const responseCreate: DBResponseCreateModel = this.create(
      'INSERT INTO patients (first_name, last_name, birth_date, gender, notes) VALUES (?, ?, ?, ?, ?)',
      patientTable.first_name,
      patientTable.last_name,
      patientTable.birth_date,
      patientTable.gender,
      patientTable.notes
    );
    patientWithInterests.id = responseCreate.newId;

    // Ajout des intérêts
    const interestDB: InterestDB = new InterestDB();
    interestDB.setForPatient(patientWithInterests);

    // Renvoie du nouvel identifiant
    return responseCreate;
  }

  /**
   * Modification des données d'un patient
   * @param patientWithInterests Détail du patient sous la forme de PatientWithInterestsModel
   * @returns Renvoie un model avec le nombre de ligne modifiée
   * @throws Renvoie une erreur si l'identifiant du patient n'existe pas
   */
  public updatePatient(
    patientWithInterests: PatientWithInterestsModel
  ): DBResponseUpdateModel {
    // Mapping des données en table
    const patientTable: PatientTable = new this.mapper().mapModelToTable(
      patientWithInterests
    );

    // Modification du patient
    const responseUpdate: DBResponseUpdateModel = this.update(
      'UPDATE patients SET first_name = ?, last_name = ?, birth_date = ?, gender = ?, notes = ? WHERE id = ?',
      patientTable.first_name,
      patientTable.last_name,
      patientTable.birth_date,
      patientTable.gender,
      patientTable.notes,
      patientWithInterests.id
    );

    // Modification des intérêts
    const interestDB: InterestDB = new InterestDB();
    const responseSet: DBResponseUpdateModel =
      interestDB.setForPatient(patientWithInterests);
    responseUpdate.nbUpdateLine += responseSet.nbUpdateLine;

    // Si aucune ligne n'a été modifiée, alors on renvoie une erreur
    if (responseUpdate.nbUpdateLine == 0)
      throw new Error(
        "Impossible de mettre à jour le patient parce que l'identifiant n'existe pas"
      );
    // Sinon, on renvoie le nombre ligne de modifiée
    else return responseUpdate;
  }

  /**
   * Suppresion d'un patient à partir de son identifiant
   * @param modelId Model avec un identifiant
   * @returns Renvoie un model avec le nombre de ligne supprimée
   * @throws Renvoie une erreur si l'identifiant du patient n'existe pas
   */
  public deleteById(modelId: DBRequestIdModel): DBResponseDeleteModel {
    const responseDelete: DBResponseDeleteModel = this.delete(
      'DELETE FROM patients WHERE id = ?',
      modelId.id
    );

    // Si aucune ligne n'a été supprimée, on renvoie une erreur
    if (responseDelete.nbDeleteLine == 0)
      throw new Error(
        "Impossible de supprimer le patient parce que l'identifiant n'existe pas"
      );
    // Sinon, on renvoie le nombre de ligne
    else return responseDelete;
  }
}
