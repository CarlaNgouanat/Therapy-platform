import { ResourceType } from '@shared/types/ResourceType';
import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Modèle représentant une ressource
 * Une ressource correspond à un média ou un mot qui peut être utilisé par l'orthophoniste durant les exercices
 * Ce sont des sortes d'indications qui sont là pour aider le patient
 */
export interface ResourceModel extends AbstractModel {
  id: number;
  name: string;
  type: ResourceType;
  filePath: string;
  createdAt: Date;
}
