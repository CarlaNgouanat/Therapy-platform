import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Modèle représentant un centre d'intérêt
 */
export interface InterestModel extends AbstractModel {
  id: number;
  name: string;
  createdAt: Date;
}
