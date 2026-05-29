import { beforeEach, describe, it, expect, vi } from 'vitest';
import { InterestDB } from '@database/db/InterestDB';
import { InterestModel } from '@shared/models/InterestModel';
import { DBRequestNameModel } from '@shared/models/DBRequestNameModel';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';
import { PatientWithInterestsModel } from '@shared/models/PatientWithInterestsModel';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';
import { DBResponseUpdateModel } from '@shared/models/DBResponseUpdateModel';
import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { SFAExerciseModel } from '@shared/models/exercises/SFAExerciseModel';

// Mock des fonctions pour espionner les appels
const mockGet = vi.fn();
const mockAll = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

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

// Test de la fonction de récupération ou de la création d'un intérêt
describe('InterestDB > getOrCreate', () => {
  // Données de test
  const interestDB: InterestDB = new InterestDB();
  const testInterestModel: InterestModel = {
    id: 2,
    name: 'Music',
    createdAt: new Date(2024, 2, 1, 10, 10, 10),
  };
  const testName: string = 'AbCeFG';
  const testNameLowerCase = testName.trim().toLowerCase();
  const testNameCapitalize =
    testNameLowerCase.charAt(0).toUpperCase() + testNameLowerCase.slice(1);

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    interestDB['get'] = mockGet;
    interestDB['getAll'] = mockAll;
    interestDB['create'] = mockCreate;
    interestDB['update'] = mockUpdate;
    interestDB['delete'] = mockDelete;
  });

  // Vérification de l'appel de la fonction de récupération de l'identifiant d'un intérêt
  it("> Test de la récupération d'un intérêt", () => {
    const testId: number = 2;
    mockGet.mockReturnValue(testInterestModel);

    const responseCreate: DBResponseCreateModel = interestDB['getOrCreate'](<
      DBRequestNameModel
    >{
      name: testName,
    });
    expect(mockGet).toHaveBeenCalledWith(
      'SELECT * FROM interests WHERE LOWER(name) = ?',
      testNameLowerCase
    );
    expect(responseCreate.newId).toBe(testId);
  });

  // Vérification de l'appel de la fonction de création d'un nouvel intérêt
  it("> Test de la fonction de la fonction de création d'un nouvel intérêt", () => {
    const testId: number = 5;
    mockGet.mockReturnValue(undefined);
    mockCreate.mockReturnValue(<DBResponseCreateModel>{
      newId: testId,
    });

    const responseCreate: DBResponseCreateModel = interestDB['getOrCreate'](<
      DBRequestNameModel
    >{
      name: testName,
    });
    expect(mockGet).toHaveBeenCalledWith(
      'SELECT * FROM interests WHERE LOWER(name) = ?',
      testNameLowerCase
    );
    expect(mockCreate).toHaveBeenCalledWith(
      'INSERT INTO interests (name) VALUES (?)',
      testNameCapitalize
    );
    expect(responseCreate.newId).toBe(testId);
  });
});

// Test de la fonction de récupération de toutes les données
describe('InterestDB > getAllInterests', () => {
  // Données de test
  const interestDB: InterestDB = new InterestDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    interestDB['get'] = mockGet;
    interestDB['getAll'] = mockAll;
    interestDB['create'] = mockCreate;
    interestDB['update'] = mockUpdate;
    interestDB['delete'] = mockDelete;
  });

  // Vérification de l'appel de la fonction de préparation
  it('> Test de la fonction de préparation', () => {
    interestDB.getAllInterests();
    expect(mockAll).toHaveBeenCalledWith(
      'SELECT * FROM interests ORDER BY name'
    );
  });
});

// Test de la fonction de récupération des intérêts d'un patient
describe('InterestDB > getByPatientId', () => {
  // Données de test
  const interestDB: InterestDB = new InterestDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    interestDB['get'] = mockGet;
    interestDB['getAll'] = mockAll;
    interestDB['create'] = mockCreate;
    interestDB['update'] = mockUpdate;
    interestDB['delete'] = mockDelete;
  });

  // Vérification de l'appel de la fonction de préparation
  it('> Test de la fonction de préparation', () => {
    interestDB.getByPatientId(<DBRequestIdModel>{
      id: testId,
    });
    expect(mockAll).toHaveBeenCalledWith(
      `SELECT i.* 
             FROM interests i 
             JOIN patient_interests pi ON i.id = pi.interest_id 
             WHERE pi.patient_id = ?
             ORDER BY i.name`,
      testId
    );
  });
});

// Test de la fonction de récupération des intérêts d'un exercice
describe('InterestDB > getByExerciseId', () => {
  // Données de test
  const interestDB: InterestDB = new InterestDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    interestDB['get'] = mockGet;
    interestDB['getAll'] = mockAll;
    interestDB['create'] = mockCreate;
    interestDB['update'] = mockUpdate;
    interestDB['delete'] = mockDelete;
  });

  // Vérification de l'appel de la fonction de préparation
  it('> Test de la fonction de préparation', () => {
    interestDB.getByExerciseId(<DBRequestIdModel>{
      id: testId,
    });
    expect(mockAll).toHaveBeenCalledWith(
      `SELECT i.* 
             FROM interests i 
             JOIN exercise_interests ei ON i.id = ei.interest_id 
             WHERE ei.exercise_id = ?
             ORDER BY i.name`,
      testId
    );
  });
});

// Test de la fonction de suppression d'un exercice
describe('InterestDB > cleanupOrphaned', () => {
  // Données de test
  const interestDB: InterestDB = new InterestDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    interestDB['get'] = mockGet;
    interestDB['getAll'] = mockAll;
    interestDB['create'] = mockCreate;
    interestDB['update'] = mockUpdate;
    interestDB['delete'] = mockDelete;
  });

  // Vérification de l'appel de la fonction de préparation
  it('> Test de la fonction de préparation', () => {
    interestDB['cleanupOrphaned']();
    expect(mockDelete).toHaveBeenCalledWith(
      `DELETE FROM interests 
             WHERE id NOT IN (
                SELECT DISTINCT interest_id FROM patient_interests
                UNION
                SELECT DISTINCT interest_id FROM exercise_interests
             )`
    );
  });
});

// Test de la fonction de mise à jour d'une liste d'intérêt pour un patient
describe('InterestDB > setForPatient', () => {
  // Données de test
  const interestDB: InterestDB = new InterestDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    interestDB['get'] = mockGet;
    interestDB['getAll'] = mockAll;
    interestDB['create'] = mockCreate;
    interestDB['update'] = mockUpdate;
    interestDB['delete'] = mockDelete;
  });

  // Vérification de l'appel de la fonction d'ajout avec un tableau vide
  it("> Test de la fonction d'ajout avec un tableau vide", () => {
    const patientWithInterests: PatientWithInterestsModel = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date(1990, 0, 1, 10, 5, 32),
      gender: 'MALE',
      notes: 'Test note',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
      interests: [],
    };

    mockDelete.mockReturnValueOnce(<DBResponseDeleteModel>{
      nbDeleteLine: 4,
    });
    mockDelete.mockReturnValueOnce(<DBResponseDeleteModel>{
      nbDeleteLine: 2,
    });

    const responseDelete: DBResponseUpdateModel =
      interestDB.setForPatient(patientWithInterests);
    expect(responseDelete.nbUpdateLine).toBe(6);

    expect(mockDelete).toHaveBeenCalledWith(
      'DELETE FROM patient_interests WHERE patient_id = ?',
      patientWithInterests.id
    );
  });

  // Vérification de l'appel de la fonction d'ajout avec un tableau rempli
  it("> Test de la fonction d'ajout avec un tableau rempli", () => {
    const patientWithInterests: PatientWithInterestsModel = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date(1990, 0, 1, 10, 5, 32),
      gender: 'MALE',
      notes: 'Test note',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
      interests: [
        {
          id: 2,
          name: 'Music',
          createdAt: new Date(2024, 0, 1, 15, 25, 45),
        },
      ],
    };
    mockGet.mockReturnValue(patientWithInterests.interests[0]);

    mockDelete.mockReturnValueOnce(<DBResponseDeleteModel>{
      nbDeleteLine: 4,
    });
    mockDelete.mockReturnValueOnce(<DBResponseDeleteModel>{
      nbDeleteLine: 2,
    });

    const responseDelete: DBResponseUpdateModel =
      interestDB.setForPatient(patientWithInterests);
    expect(responseDelete.nbUpdateLine).toBe(7);

    expect(mockDelete).toHaveBeenCalledWith(
      'DELETE FROM patient_interests WHERE patient_id = ?',
      patientWithInterests.id
    );
    expect(mockCreate).toHaveBeenCalledWith(
      'INSERT INTO patient_interests (patient_id, interest_id) VALUES (?, ?)',
      patientWithInterests.id,
      patientWithInterests.interests[0].id
    );
  });
});

// Test de la fonction de mise à jour d'une liste d'intérêt pour un exercice
describe('InterestDB > setForExercise', () => {
  // Données de test
  const interestDB: InterestDB = new InterestDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    interestDB['get'] = mockGet;
    interestDB['getAll'] = mockAll;
    interestDB['create'] = mockCreate;
    interestDB['update'] = mockUpdate;
    interestDB['delete'] = mockDelete;
  });

  // Vérification de l'appel de la fonction d'ajout avec un tableau vide
  it("> Test de la fonction d'ajout avec un tableau vide", () => {
    const exerciseWithInterests: ExerciseWithInterestsModel = {
      id: 1,
      name: 'Test Exercise',
      model: 'SFA',
      patientId: 10,
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
      data: <SFAExerciseModel>{
        sfaCategory: 'category',
        sfaUse: 'use',
        sfaAction: 'action',
        sfaProperties: 'properties',
        sfaAssociation: 'association',
      },
      interests: [],
    };

    mockDelete.mockReturnValueOnce(<DBResponseDeleteModel>{
      nbDeleteLine: 3,
    });
    mockDelete.mockReturnValueOnce(<DBResponseDeleteModel>{
      nbDeleteLine: 7,
    });

    const responseDelete: DBResponseUpdateModel = interestDB.setForExercise(
      exerciseWithInterests
    );
    expect(responseDelete.nbUpdateLine).toBe(10);

    expect(mockDelete).toHaveBeenCalledWith(
      'DELETE FROM exercise_interests WHERE exercise_id = ?',
      exerciseWithInterests.id
    );
  });

  // Vérification de l'appel de la fonction d'ajout avec un tableau rempli
  it("> Test de la fonction d'ajout avec un tableau rempli", () => {
    const exerciseWithInterests: ExerciseWithInterestsModel = {
      id: 1,
      name: 'Test Exercise',
      model: 'SFA',
      patientId: 10,
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
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
          createdAt: new Date(2024, 0, 1, 15, 25, 45),
        },
      ],
    };
    mockGet.mockReturnValue(exerciseWithInterests.interests[0]);

    mockDelete.mockReturnValueOnce(<DBResponseDeleteModel>{
      nbDeleteLine: 3,
    });
    mockDelete.mockReturnValueOnce(<DBResponseDeleteModel>{
      nbDeleteLine: 7,
    });

    const responseDelete: DBResponseUpdateModel = interestDB.setForExercise(
      exerciseWithInterests
    );
    expect(responseDelete.nbUpdateLine).toBe(11);

    expect(mockDelete).toHaveBeenCalledWith(
      'DELETE FROM exercise_interests WHERE exercise_id = ?',
      exerciseWithInterests.id
    );
    expect(mockCreate).toHaveBeenCalledWith(
      'INSERT INTO exercise_interests (exercise_id, interest_id) VALUES (?, ?)',
      exerciseWithInterests.id,
      exerciseWithInterests.interests[0].id
    );
  });
});
