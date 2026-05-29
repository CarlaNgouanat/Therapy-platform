import { SessionModel } from '@shared/models/SessionModel';
import { SessionTable } from '@database/tables/SessionTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { DateMapper } from './date/DateMapper';

/**
 * Class SessionMapper
 * Cette classe transforme les données de modèle à table ou de table à modèle
 */
export class SessionMapper extends AbstractMapper<SessionTable, SessionModel> {
  /**
   * Transforme la table en modèle
   * @param table Table représentant une session
   * @returns Renvoie un objet SessionModel
   */
  public mapTableToModel(table: SessionTable): SessionModel {
    // Récupération du mapper
    const dateMapper: DateMapper = new DateMapper();

    return {
      id: table.id,
      patientId: table.patient_id,
      date: dateMapper.stringToDate(table.date),
      status: table.status,
      notes: table.notes,
      createdAt: dateMapper.stringToDate(table.created_at),
    };
  }

  /**
   * Transforme un modèle en table
   * @param model Modèle représentant une session
   * @returns Renvoie un objet SessionTable
   */
  public mapModelToTable(model: SessionModel): SessionTable {
    // Récupération du mapper
    const dateMapper: DateMapper = new DateMapper();

    return {
      id: model.id,
      patient_id: model.patientId,
      date: dateMapper.dateToString(model.date),
      status: model.status,
      notes: model.notes,
      created_at: dateMapper.dateToString(model.createdAt),
    };
  }
}
