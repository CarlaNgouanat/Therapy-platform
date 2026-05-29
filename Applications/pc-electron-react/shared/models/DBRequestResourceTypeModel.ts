import { AbstractModel } from '@shared/models/AbstractModel';
import { ResourceType } from '@shared/types/ResourceType';

/**
 * Model représentant une requête à la base de données avec un type de ressource
 */
export interface DBRequestResourceTypeModel extends AbstractModel {
  type: ResourceType;
}
