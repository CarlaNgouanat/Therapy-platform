import { ExerciseDB } from '@database/db/ExerciseDB';
import { PCAExerciseModel } from '@shared/models/exercises/PCAExerciseModel';
import { SFAExerciseModel } from '@shared/models/exercises/SFAExerciseModel';
import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { LogsManager } from '@shared/utils/LogsManager';

/**
 * Class static DevMockData
 * Cette classe ajoute des données dans la base de données pour avoir un jeu de données pour le développement
 */
export class DevMockData {
  /**
   * Fonction qui ajoute les données mockées dans le jeu de données
   * Développement uniquement
   */
  static seedTestExercises(): void {
    // Logs
    LogsManager.createGroup('DevMockData', 'seedTestExercises');
    LogsManager.logInfo(
      'Ajout des données de test à la base de données (Mock)'
    );

    // Récupération des données
    const exerciseDB: ExerciseDB = new ExerciseDB();

    // Si les données n'existent pas alors, on les ajoute
    return;
    if (exerciseDB.getMockValues().length === 0) {
      // On ajoute 2 exercices SFA et un exercice PCA
      const exerciseSFA1: ExerciseWithInterestsModel = <
        ExerciseWithInterestsModel
      >{
        id: 1,
        name: 'Test - Pizza SFA',
        model: 'SFA',
        patientId: null,
        createdAt: new Date(''),
        data: <SFAExerciseModel>{
          sfaCategory: 'Aliment, Nourriture, Plat italien',
          sfaUse: 'Se nourrir, Partager un repas, Dîner entre amis',
          sfaAction: 'Manger, Couper, Partager, Cuire',
          sfaProperties: 'Rond, Chaud, Fromage, Tomate',
          sfaAssociation: 'Italie, Restaurant, Faim, Fête',
        },
        interests: [],
      };
      exerciseDB.createExercise(exerciseSFA1);
      LogsManager.logInfo('Ajout de la 1ère donnée de test (SFA)');

      const exerciseSFA2: ExerciseWithInterestsModel = <
        ExerciseWithInterestsModel
      >{
        id: 2,
        name: 'Test - Pomme SFA',
        model: 'SFA',
        patientId: null,
        createdAt: new Date(''),
        data: <SFAExerciseModel>{
          sfaCategory: 'Fruit, Aliment',
          sfaUse: 'Manger, Cuisiner',
          sfaAction: 'Croquer, Éplucher, Couper',
          sfaProperties: 'Rouge, Vert, Croquant, Sucré',
          sfaAssociation: 'Santé, Automne, Compote',
        },
        interests: [],
      };
      exerciseDB.createExercise(exerciseSFA2);
      LogsManager.logInfo('Ajout de la 2ème donnée de test (SFA)');

      const exercisePCA: ExerciseWithInterestsModel = <
        ExerciseWithInterestsModel
      >{
        id: 3,
        name: 'Test - Exercice PCA',
        model: 'PCA',
        patientId: null,
        createdAt: new Date(''),
        data: <PCAExerciseModel>{},
        interests: [],
      };
      exerciseDB.createExercise(exercisePCA);
      LogsManager.logInfo('Ajout de la 1ère donnée de test (PCA)');

      // Logs
      LogsManager.logSuccess('Les données ont été ajoutées avec succès');
    } else {
      // Logs
      LogsManager.logInfo('Les données existent déjà dans la base de données');
    }

    // Logs
    LogsManager.endGroup();
  }
}
