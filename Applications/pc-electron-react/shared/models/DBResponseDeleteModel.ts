import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Model représentant une réponse de la base de données pour une suppresion
 */
export interface DBResponseDeleteModel extends AbstractModel {
  nbDeleteLine: number;
}
