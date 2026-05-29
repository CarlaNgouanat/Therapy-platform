import { AbstractModel } from '@shared/models/AbstractModel';

/**
 * Class abstract AbstractExerciseMapper
 * Cette classe abstraite représente la structure générale d'un mapper pour un exercice
 */
export abstract class AbstractExerciseMapper<Model extends AbstractModel> {
  /**
   * Transforme un json stringifié en modèle
   * @param jsonStr json stringifé de la base de données
   * @returns Objet Modèle équivalent
   */
  public mapJsonStrToModel(jsonStr: string): Model {
    return JSON.parse(jsonStr) as Model;
  }

  /**
   * Transforme un modèle en json stringifié
   * @param model Model représentant une donnée
   * @returns Json stringifié équivalent
   */
  public mapModelToJsonStr(model: Model): string {
    return JSON.stringify(model);
  }
}
