import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Table représentant la session active d'un patient
 */
export interface IsActiveSessionModel extends AbstractModel {
  isActive: boolean;
}
