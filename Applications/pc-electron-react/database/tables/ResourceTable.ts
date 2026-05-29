import { ResourceType } from '@shared/types/ResourceType';
import { AbstractTable } from '@database/tables/AbstractTable';

/**
 * Table représentant une ressource
 * Une ressource correspond à un média ou un mot qui peut être utilisé par l'orthophoniste durant les exercices
 * Ce sont des sortes d'indications qui sont là pour aider le patient
 */
export interface ResourceTable extends AbstractTable {
  id: number;
  name: string;
  type: ResourceType;
  file_path: string;
  created_at: string;
}
