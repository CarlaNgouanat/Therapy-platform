import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Model représentant une requête à la base de données avec un nom
 */
export interface DBRequestNameModel extends AbstractModel {
  name: string;
}
