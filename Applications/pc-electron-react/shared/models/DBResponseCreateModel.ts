import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Model représentant une réponse de la base de données pour une création
 */
export interface DBResponseCreateModel extends AbstractModel {
  newId: number;
}
