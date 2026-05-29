import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Model représentant une requête à la base de données avec un id
 */
export interface DBRequestIdModel extends AbstractModel {
  id: number;
}
