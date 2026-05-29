import { PatientModel } from '@shared/models/PatientModel';
import { PatientTable } from '@database/tables/PatientTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { DateMapper } from './date/DateMapper';

/**
 * Class PatientMapper
 * Cette classe transforme les données de modèle à table ou de table à modèle
 */
export class PatientMapper extends AbstractMapper<PatientTable, PatientModel> {
  /**
   * Transforme la table en modèle
   * @param table Table représentant un patient
   * @returns Renvoie un objet PatientTable
   */
  public mapTableToModel(table: PatientTable): PatientModel {
    // Récupération du mapper
    const dateMapper: DateMapper = new DateMapper();

    return {
      id: table.id,
      firstName: table.first_name,
      lastName: table.last_name,
      birthDate: dateMapper.stringToDate(table.birth_date),
      gender: table.gender,
      notes: table.notes,
      createdAt: dateMapper.stringToDate(table.created_at),
    };
  }

  /**
   * Transforme un modèle en table
   * @param model Modèle représentant un patient
   * @returns Renvoie un objet ExerciseTable
   */
  public mapModelToTable(model: PatientModel): PatientTable {
    // Récupération du mapper
    const dateMapper: DateMapper = new DateMapper();

    return {
      id: model.id,
      first_name: model.firstName,
      last_name: model.lastName,
      birth_date: dateMapper.dateToString(model.birthDate),
      gender: model.gender,
      notes: model.notes,
      created_at: dateMapper.dateToString(model.createdAt),
    };
  }
}
