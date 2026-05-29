import { beforeEach, describe, it, expect, vi } from 'vitest';
import { InterestModel } from '@shared/models/InterestModel';
import { ExerciseDB } from '@database/db/ExerciseDB';
import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { ExerciseModel } from '@shared/models/ExerciseModel';
import { SFAExerciseModel } from '@shared/models/exercises/SFAExerciseModel';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { ExerciseMapper } from '@database/mappers/ExerciseMapper';
import { ExerciseTable } from '@database/tables/ExerciseTable';
import { DBResponseUpdateModel } from '@shared/models/DBResponseUpdateModel';

// Mock des fonctions pour espionner les appels
const mockGet = vi.fn();
const mockAll = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockInterestGet = vi.fn();
const mockInterestSet = vi.fn();

// Mock de la fonction electron pour simuler le système
vi.mock('electron', () => {
  return {
    app: {
      getPath: () => {
        return '/';
      },
    },
  };
});

vi.mock('@database/db/DBManager', () => {
  return {
    DBManager: class {
      static getInstance = () => vi.fn();
      getRequest = vi.fn();
      getAllRequest = () => vi.fn();
      execRequest = () => vi.fn();
    },
  };
});

// Mock InterestDB
vi.mock('@database/db/InterestDB', () => {
  return {
    InterestDB: class {
      getByExerciseId = mockInterestGet;
      setForExercise = mockInterestSet;
    },
  };
});

// Test de la fonction de récupération de toutes les données
describe('ExerciseDB > getAllExercisesWithInterests', () => {
  // Données de test
  const exerciseBD: ExerciseDB = new ExerciseDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    exerciseBD['get'] = mockGet;
    exerciseBD['getAll'] = mockAll;
    exerciseBD['create'] = mockCreate;
    exerciseBD['update'] = mockUpdate;
    exerciseBD['delete'] = mockDelete;
  });

  // Vérificiation des données lorsque le tableau renvoyé est vide
  it('> Test de la fonction de récupération avec un tableau vide', () => {
    mockAll.mockReturnValue([]);

    const exercices: ExerciseWithInterestsModel[] =
      exerciseBD.getAllExercisesWithInterests();
    expect(exercices).toStrictEqual([]);
  });

  // Vérificiation des données lorsque le tableau renvoyé est rempli
  it('> Test de la fonction de récupération avec un tableau rempli', () => {
    // Définition de fausses données pour le test
    const fakeDataExercises: ExerciseModel[] = [
      {
        id: 1,
        name: 'Test Exercise',
        model: 'SFA',
        patientId: 10,
        createdAt: new Date(2024, 5, 1, 10, 10, 10),
        data: <SFAExerciseModel>{
          sfaCategory: 'category',
          sfaUse: 'use',
          sfaAction: 'action',
          sfaProperties: 'properties',
          sfaAssociation: 'association',
        },
      },
    ];
    const fakeDataInterests: InterestModel[] = [
      {
        id: 2,
        name: 'Music',
        createdAt: new Date(2024, 2, 1, 10, 10, 10),
      },
    ];
    mockAll.mockReturnValueOnce(fakeDataExercises);
    mockInterestGet.mockReturnValueOnce(fakeDataInterests);

    const exercisesWithInterests: ExerciseWithInterestsModel[] =
      exerciseBD.getAllExercisesWithInterests();

    expect(exercisesWithInterests).toStrictEqual([
      {
        id: 1,
        name: 'Test Exercise',
        model: 'SFA',
        patientId: 10,
        createdAt: new Date(2024, 5, 1, 10, 10, 10),
        data: <SFAExerciseModel>{
          sfaCategory: 'category',
          sfaUse: 'use',
          sfaAction: 'action',
          sfaProperties: 'properties',
          sfaAssociation: 'association',
        },
        interests: [
          {
            id: 2,
            name: 'Music',
            createdAt: new Date(2024, 2, 1, 10, 10, 10),
          },
        ],
      },
    ]);
  });
});

// Test de la fonction de récupération de toutes les données
describe('ExerciseDB > getMockValues', () => {
  // Données de test
  const exerciseBD: ExerciseDB = new ExerciseDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    exerciseBD['get'] = mockGet;
    exerciseBD['getAll'] = mockAll;
    exerciseBD['create'] = mockCreate;
    exerciseBD['update'] = mockUpdate;
    exerciseBD['delete'] = mockDelete;
  });

  // Vérificiation des données lorsque le tableau renvoyé est vide
  it('> Test de la fonction de récupération avec un tableau vide', () => {
    mockAll.mockReturnValue([]);

    const exercices: ExerciseModel[] = exerciseBD.getMockValues();
    expect(exercices).toStrictEqual([]);
  });

  // Vérificiation des données lorsque le tableau renvoyé est rempli
  it('> Test de la fonction de récupération avec un tableau rempli', () => {
    // Définition de fausses données pour le test
    const fakeDataExercises: ExerciseModel[] = [
      {
        id: 1,
        name: 'Test Exercise',
        model: 'SFA',
        patientId: 10,
        createdAt: new Date(2024, 5, 1, 10, 10, 10),
        data: <SFAExerciseModel>{
          sfaCategory: 'category',
          sfaUse: 'use',
          sfaAction: 'action',
          sfaProperties: 'properties',
          sfaAssociation: 'association',
        },
      },
    ];
    mockAll.mockReturnValueOnce(fakeDataExercises);

    const exercisesWithInterests: ExerciseModel[] = exerciseBD.getMockValues();

    expect(exercisesWithInterests).toStrictEqual([
      {
        id: 1,
        name: 'Test Exercise',
        model: 'SFA',
        patientId: 10,
        createdAt: new Date(2024, 5, 1, 10, 10, 10),
        data: <SFAExerciseModel>{
          sfaCategory: 'category',
          sfaUse: 'use',
          sfaAction: 'action',
          sfaProperties: 'properties',
          sfaAssociation: 'association',
        },
      },
    ]);
  });
});

// Test de la fonction de récupération d'une seule donnée
describe('ExerciseDB > getExerciseWithInterestsById', () => {
  // Données de test
  const exerciseBD: ExerciseDB = new ExerciseDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    exerciseBD['get'] = mockGet;
    exerciseBD['getAll'] = mockAll;
    exerciseBD['create'] = mockCreate;
    exerciseBD['update'] = mockUpdate;
    exerciseBD['delete'] = mockDelete;
  });

  // Vérificiation de la donnée lorsqu'elle n'existe pas
  it('> Test de la fonction de récupération avec une donnée undefined', () => {
    mockGet.mockReturnValue(undefined);

    expect(() => {
      exerciseBD.getExerciseWithInterestsById(<DBRequestIdModel>{
        id: testId,
      });
    }).toThrow();
  });

  // Vérificiation de la donnée lorsqu'elle existe
  it('> Test de la fonction de récupération avec une donnée exitante', () => {
    // Définition de fausses données pour le test
    const fakeDataExercise: ExerciseModel = {
      id: 1,
      name: 'Test Exercise',
      model: 'SFA',
      patientId: 10,
      createdAt: new Date(2024, 5, 1, 10, 10, 10),
      data: <SFAExerciseModel>{
        sfaCategory: 'category',
        sfaUse: 'use',
        sfaAction: 'action',
        sfaProperties: 'properties',
        sfaAssociation: 'association',
      },
    };
    const fakeDataInterests: InterestModel[] = [
      {
        id: 2,
        name: 'Music',
        createdAt: new Date(2024, 2, 1, 10, 10, 10),
      },
    ];
    mockGet.mockReturnValue(fakeDataExercise);
    mockInterestGet.mockReturnValue(fakeDataInterests);

    const exercice: ExerciseWithInterestsModel | undefined =
      exerciseBD.getExerciseWithInterestsById(<DBRequestIdModel>{
        id: testId,
      });
    expect(exercice).toStrictEqual({
      id: 1,
      name: 'Test Exercise',
      model: 'SFA',
      patientId: 10,
      createdAt: new Date(2024, 5, 1, 10, 10, 10),
      data: <SFAExerciseModel>{
        sfaCategory: 'category',
        sfaUse: 'use',
        sfaAction: 'action',
        sfaProperties: 'properties',
        sfaAssociation: 'association',
      },
      interests: [
        {
          id: 2,
          name: 'Music',
          createdAt: new Date(2024, 2, 1, 10, 10, 10),
        },
      ],
    });
  });
});

// Test de la fonction de récupération d'une seule donnée
describe('ExerciseDB > getById', () => {
  // Données de test
  const exerciseBD: ExerciseDB = new ExerciseDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    exerciseBD['get'] = mockGet;
    exerciseBD['getAll'] = mockAll;
    exerciseBD['create'] = mockCreate;
    exerciseBD['update'] = mockUpdate;
    exerciseBD['delete'] = mockDelete;
  });

  // Vérificiation de la donnée lorsqu'elle n'existe pas
  it('> Test de la fonction de récupération avec une donnée undefined', () => {
    mockGet.mockReturnValue(undefined);

    expect(() => {
      exerciseBD.getById(<DBRequestIdModel>{
        id: testId,
      });
    }).toThrow();
  });

  // Vérificiation de la donnée lorsqu'elle existe
  it('> Test de la fonction de récupération avec une donnée exitante', () => {
    // Définition de fausses données pour le test
    const fakeDataExercise: ExerciseModel = {
      id: 1,
      name: 'Test Exercise',
      model: 'SFA',
      patientId: 10,
      createdAt: new Date(2024, 5, 1, 10, 10, 10),
      data: <SFAExerciseModel>{
        sfaCategory: 'category',
        sfaUse: 'use',
        sfaAction: 'action',
        sfaProperties: 'properties',
        sfaAssociation: 'association',
      },
    };
    mockGet.mockReturnValue(fakeDataExercise);

    const exercice: ExerciseModel | undefined = exerciseBD.getById(<
      DBRequestIdModel
    >{
      id: testId,
    });
    expect(exercice).toStrictEqual(fakeDataExercise);
  });
});

// Test de la fonction de création d'un nouvel exercice
describe('ExerciseDB > createExercise', () => {
  // Données de test
  const exerciseBD: ExerciseDB = new ExerciseDB();
  const testExerciseWithInterests: ExerciseWithInterestsModel = {
    id: 1,
    name: 'Test Exercise',
    model: 'SFA',
    patientId: 10,
    createdAt: new Date(2024, 5, 1, 10, 10, 10),
    data: <SFAExerciseModel>{
      sfaCategory: 'category',
      sfaUse: 'use',
      sfaAction: 'action',
      sfaProperties: 'properties',
      sfaAssociation: 'association',
    },
    interests: [
      {
        id: 2,
        name: 'Music',
        createdAt: new Date(2024, 2, 1, 10, 10, 10),
      },
    ],
  };

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    exerciseBD['get'] = mockGet;
    exerciseBD['getAll'] = mockAll;
    exerciseBD['create'] = mockCreate;
    exerciseBD['update'] = mockUpdate;
    exerciseBD['delete'] = mockDelete;
  });

  // Vérification du renvoie de l'identifiant après création
  it("> Test de la création d'une nouvelle donnée", () => {
    const testId: number = 5;
    mockCreate.mockReturnValue(<DBResponseCreateModel>{
      newId: testId,
    });

    const responseCreate: DBResponseCreateModel = exerciseBD.createExercise(
      testExerciseWithInterests
    );
    const exerciseMapper: ExerciseMapper = new ExerciseMapper();
    const exerciseTable: ExerciseTable = exerciseMapper.mapModelToTable(
      testExerciseWithInterests
    );

    expect(mockCreate).toHaveBeenCalledWith(
      'INSERT INTO exercises (name, model, patient_id, data) VALUES (?, ?, ?, ?)',
      exerciseTable.name,
      exerciseTable.model,
      exerciseTable.patient_id,
      exerciseTable.data
    );

    expect(responseCreate.newId).toBe(testId);
  });
});

// Test de la fonction de mise à jour d'un exercice
describe('ExerciseDB > updateExercice', () => {
  // Données de test
  const exerciseBD: ExerciseDB = new ExerciseDB();
  const testExerciseWithInterests: ExerciseWithInterestsModel = {
    id: 1,
    name: 'Test Exercise',
    model: 'SFA',
    patientId: 10,
    createdAt: new Date(2024, 5, 1, 10, 10, 10),
    data: <SFAExerciseModel>{
      sfaCategory: 'category',
      sfaUse: 'use',
      sfaAction: 'action',
      sfaProperties: 'properties',
      sfaAssociation: 'association',
    },
    interests: [
      {
        id: 2,
        name: 'Music',
        createdAt: new Date(2024, 2, 1, 10, 10, 10),
      },
    ],
  };

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    exerciseBD['get'] = mockGet;
    exerciseBD['getAll'] = mockAll;
    exerciseBD['create'] = mockCreate;
    exerciseBD['update'] = mockUpdate;
    exerciseBD['delete'] = mockDelete;
  });

  // Vérification du retour quand aucune ligne n'a été modifiée
  it("> Test du retour quand aucune ligne n'a été modifiée", () => {
    mockUpdate.mockReturnValue(<DBResponseUpdateModel>{
      nbUpdateLine: 0,
    });
    mockInterestSet.mockReturnValue(<DBResponseUpdateModel>{
      nbUpdateLine: 0,
    });

    expect(() => {
      exerciseBD.updateExercice(testExerciseWithInterests);
    }).toThrow();
  });

  // Vérification du retour quand au moins une ligne a été modifiée
  it('> Test du retour quand au moins une ligne a été modifiée', () => {
    mockUpdate.mockReturnValue(<DBResponseUpdateModel>{
      nbUpdateLine: 5,
    });
    mockInterestSet.mockReturnValue(<DBResponseUpdateModel>{
      nbUpdateLine: 6,
    });

    const responseUpdate: DBResponseUpdateModel = exerciseBD.updateExercice(
      testExerciseWithInterests
    );
    expect(responseUpdate.nbUpdateLine).toStrictEqual(11);
  });
});

// Test de la fonction de suppression d'un exercice
describe('ExerciseDB > deleteById', () => {
  // Données de test
  const exerciseBD: ExerciseDB = new ExerciseDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    exerciseBD['get'] = mockGet;
    exerciseBD['getAll'] = mockAll;
    exerciseBD['create'] = mockCreate;
    exerciseBD['update'] = mockUpdate;
    exerciseBD['delete'] = mockDelete;
  });

  // Vérification du retour quand aucune ligne n'a été supprimée
  it("> Testdu retour quand aucune ligne n'a été supprimée", () => {
    mockDelete.mockReturnValue(<DBResponseDeleteModel>{
      nbDeleteLine: 0,
    });

    expect(() => {
      exerciseBD.deleteById(<DBRequestIdModel>{
        id: testId,
      });
    }).toThrow();
  });

  // Vérification du retour quand au moins une ligne a été supprimée
  it('> Test du retour quand au moins une ligne a été supprimée', () => {
    mockDelete.mockReturnValue(<DBResponseDeleteModel>{
      nbDeleteLine: 5,
    });

    const responseDelete: DBResponseDeleteModel = exerciseBD.deleteById(<
      DBRequestIdModel
    >{
      id: testId,
    });
    expect(responseDelete.nbDeleteLine).toBe(5);
  });
});
