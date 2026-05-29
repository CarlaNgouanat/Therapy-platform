import { AbstractDB } from '@database/db/AbstractDB';
import { ExerciseModel } from '@shared/models/ExerciseModel';
import { ExerciseMapper } from '@database/mappers/ExerciseMapper';
import { ExerciseTable } from '@database/tables/ExerciseTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { InterestDB } from '@database/db/InterestDB';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';
import { DBResponseUpdateModel } from '@shared/models/DBResponseUpdateModel';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';

/**
 * Class ExerciseDB
 * Cette classe interagit avec la base de données
 */
export class ExerciseDB extends AbstractDB<ExerciseTable, ExerciseModel> {
  // Définition du mapper
  protected mapper: new () => AbstractMapper<ExerciseTable, ExerciseModel> =
    ExerciseMapper;

  /**
   * Récupération de tous les exercices avec les intérêts
   * @returns Renvoie un tableau d'objet ExerciseWithInterestsModel[]
   */
  public getAllExercisesWithInterests(): ExerciseWithInterestsModel[] {
    // Récupération des exercices
    const interestDB: InterestDB = new InterestDB();
    const exercises: ExerciseModel[] = this.getAll(
      'SELECT * FROM exercises ORDER BY name'
    );

    // Fusion des exercices et des intérêts
    return exercises.map((value: ExerciseModel): ExerciseWithInterestsModel => {
      return <ExerciseWithInterestsModel>{
        ...value,
        interests: interestDB.getByExerciseId(<DBRequestIdModel>{
          id: value.id,
        }),
      };
    });
  }

  /**
   * Récupération des exercices de tests
   * @returns Renvoie un tableau d'objet ExerciseModel[]
   */
  public getMockValues(): ExerciseModel[] {
    // Récupération des exercices
    return this.getAll("SELECT * FROM exercises WHERE name LIKE 'Test -%'");
  }

  /**
   * Récupération des centres d'intérêts d'un exercice
   * @param modelId Model avec un identifiant
   * @returns Renvoie un objet ExerciseWithInterestsModel ou undefined si l'exercice n'a pas pu être trouvé
   * @throws Renvoie une erreur si l'identifiant de l'exercice n'existe pas
   */
  public getExerciseWithInterestsById(
    modelId: DBRequestIdModel
  ): ExerciseWithInterestsModel {
    // Récupération de l'exercice
    const interestDB: InterestDB = new InterestDB();
    const exercise: ExerciseModel | undefined = this.get(
      'SELECT * FROM exercises WHERE id = ?',
      modelId.id
    );

    // On arrête le traitement si aucun exercice n'a été trouvé
    if (!exercise)
      throw new Error(
        "Impossible de récupérer les centres d'intérêts de l'exercice, car son identifiant n'existe pas"
      );

    // Fusion de l'exercice et des intérêts
    return <ExerciseWithInterestsModel>{
      ...exercise,
      interests: interestDB.getByExerciseId(<DBRequestIdModel>{
        id: exercise.id,
      }),
    };
  }

  /**
   * Récupére un exercice à partir de son identifiant
   * @param modelId Model avec un identifiant
   * @returns Renvoie un objet ExerciseModel
   * @throws Renvoie une erreur si l'identifiant de l'exercice n'existe pas
   */
  public getById(modelId: DBRequestIdModel): ExerciseModel {
    const exercise: ExerciseModel | undefined = this.get(
      'SELECT * FROM exercises WHERE id = ?',
      modelId.id
    );

    // On arrête le traitement si aucun exercice n'a été trouvé
    if (!exercise)
      throw new Error(
        "Impossible de récupérer l'exercise, car son identifiant n'existe pas"
      );
    return exercise;
  }

  /**
   * Ajout un nouvel exercice à la base de données
   * @param exerciseWithInterests Détail de l'exercice sous la forme de ExerciseWithInterestsModel
   * @returns Renvoie un model avec le l'identifiant de la nouvelle donnée
   */
  public createExercise(
    exerciseWithInterests: ExerciseWithInterestsModel
  ): DBResponseCreateModel {
    // Mapping des données en table
    const exerciseTable: ExerciseTable = new this.mapper().mapModelToTable(
      exerciseWithInterests
    );

    // Ajout de l'exercice
    const responseCreate: DBResponseCreateModel = this.create(
      'INSERT INTO exercises (name, model, patient_id, data) VALUES (?, ?, ?, ?)',
      exerciseTable.name,
      exerciseTable.model,
      exerciseTable.patient_id,
      exerciseTable.data
    );
    exerciseWithInterests.id = responseCreate.newId;

    // Ajout des intérêts
    const interestDB: InterestDB = new InterestDB();
    interestDB.setForExercise(exerciseWithInterests);

    // Renvoie du nouvel identifiant
    return responseCreate;
  }

  /**
   * Modification des données d'un exercice
   * @param exerciseWithInterests Détail de l'exercice sous la forme de ExerciseWithInterestsModel
   * @returns Renvoie un model avec le nombre de ligne modifiée
   * @throws Renvoie une erreur si l'identifiant de l'exercice n'existe pas
   */
  public updateExercice(
    exerciseWithInterests: ExerciseWithInterestsModel
  ): DBResponseUpdateModel {
    // Mapping des données en table
    const exerciseTable: ExerciseTable = new this.mapper().mapModelToTable(
      exerciseWithInterests
    );

    // Modification de l'exercice
    const responseUpdate: DBResponseUpdateModel = this.update(
      'UPDATE exercises SET name = ?, model = ?, patient_id = ?, data = ? WHERE id = ?',
      exerciseTable.name,
      exerciseTable.model,
      exerciseTable.patient_id,
      exerciseTable.data,
      exerciseTable.id
    );

    // Modification des intérêts
    const interestDB: InterestDB = new InterestDB();
    const responseSet: DBResponseUpdateModel = interestDB.setForExercise(
      exerciseWithInterests
    );
    responseUpdate.nbUpdateLine += responseSet.nbUpdateLine;

    // Si aucune ligne n'a été modifiée, alors on renvoie une erreur
    if (responseUpdate.nbUpdateLine == 0)
      throw new Error(
        "Impossible de mettre à jour l'exercice parce que l'identifiant n'existe pas"
      );
    // Sinon, on renvoie le nombre ligne de modifiée
    else return responseUpdate;
  }

  /**
   * Suppresion d'un exercice à partir de son identifiant
   * @param modelId Model avec un identifiant
   * @returns Renvoie un model avec le nombre de ligne supprimée
   * @throws Renvoie une erreur si l'identifiant de l'exercice n'existe pas
   */
  public deleteById(modelId: DBRequestIdModel): DBResponseDeleteModel {
    const responseDelete: DBResponseDeleteModel = this.delete(
      'DELETE FROM exercises WHERE id = ?',
      modelId.id
    );

    // Si aucune ligne n'a été supprimée, on renvoie une erreur
    if (responseDelete.nbDeleteLine == 0)
      throw new Error(
        "Impossible de supprimer l'exercice parce que l'identifiant n'existe pas"
      );
    // Sinon, on renvoie le nombre de ligne
    else return responseDelete;
  }
}
