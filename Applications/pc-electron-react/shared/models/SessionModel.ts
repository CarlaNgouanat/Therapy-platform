import { SessionStatus } from '@shared/types/SessionStatus';
import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Table représentant un exercice en session
 */
export interface SessionModel extends AbstractModel {
  id: number;
  patientId: number;
  date: Date;
  status: SessionStatus;
  notes: string;
  createdAt: Date;
}
