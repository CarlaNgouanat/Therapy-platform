import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Model représentant une réponse de la base de données pour une modification
 */
export interface DBResponseUpdateModel extends AbstractModel {
  nbUpdateLine: number;
}
