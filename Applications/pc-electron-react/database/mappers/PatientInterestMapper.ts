import { PatientInterestModel } from '@shared/models/PatientInterestModel';
import { PatientInterestTable } from '@database/tables/PatientInterestTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';

/**
 * Class PatientInterestMapper
 * Cette classe transforme les données de modèle à table ou de table à modèle
 */
export class PatientInterestMapper extends AbstractMapper<
  PatientInterestTable,
  PatientInterestModel
> {
  /**
   * Transforme la table en modèle
   * @param table Table représentant un lien patient - intérêt
   * @returns Renvoie un objet PatientInterestTable
   */
  public mapTableToModel(table: PatientInterestTable): PatientInterestModel {
    return {
      patientId: table.patient_id,
      interestId: table.interest_id,
    };
  }

  /**
   * Transforme un modèle en table
   * @param model Modèle représentant un lien patient - intérêt
   * @returns Renvoie un objet ExerciseTable
   */
  public mapModelToTable(model: PatientInterestModel): PatientInterestTable {
    return {
      patient_id: model.patientId,
      interest_id: model.interestId,
    };
  }
}
