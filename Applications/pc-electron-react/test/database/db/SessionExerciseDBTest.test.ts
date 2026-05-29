import { beforeEach, describe, it, expect, vi } from 'vitest';
import { ExerciseModel } from '@shared/models/ExerciseModel';
import { SessionExerciseDB } from '@database/db/SessionExerciseDB';
import { SessionExerciseModel } from '@shared/models/SessionExerciseModel';
import { SessionModel } from '@shared/models/SessionModel';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';
import { SFAExerciseModel } from '@shared/models/exercises/SFAExerciseModel';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { SessionExerciseMapper } from '@database/mappers/SessionExerciseMapper';
import { SessionExerciseTable } from '@database/tables/SessionExerciseTable';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';
import { DBResponseUpdateModel } from '@shared/models/DBResponseUpdateModel';

// Mock des fonctions pour espionner les appels
const mockGet = vi.fn();
const mockAll = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockExerciseGet = vi.fn();
const mockSessionGet = vi.fn();

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
vi.mock('@database/db/ExerciseDB', () => {
  return {
    ExerciseDB: class {
      getById = mockExerciseGet;
    },
  };
});

// Mock InterestDB
vi.mock('@database/db/SessionDB', () => {
  return {
    SessionDB: class {
      getById = mockSessionGet;
    },
  };
});

// Test de la fonction de récupération des patients d'une session
describe('sessionExerciseDB > getBySession', () => {
  // Données de test
  const sessionExerciseDB: SessionExerciseDB = new SessionExerciseDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionExerciseDB['get'] = mockGet;
    sessionExerciseDB['getAll'] = mockAll;
    sessionExerciseDB['create'] = mockCreate;
    sessionExerciseDB['update'] = mockUpdate;
    sessionExerciseDB['delete'] = mockDelete;
  });

  // Vérificiation des données lorsque le tableau renvoyé est vide
  it('> Test de la fonction de récupération avec un tableau vide', () => {
    mockAll.mockReturnValue([]);

    const resTab: SessionExerciseModel[] = sessionExerciseDB.getBySession(<
      DBRequestIdModel
    >{
      id: testId,
    });

    expect(mockAll).toHaveBeenCalledWith(
      'SELECT * FROM session_exercises WHERE session_id = ?',
      testId
    );
    expect(resTab).toStrictEqual([]);
  });

  // Vérificiation des données lorsque le tableau renvoyé est rempli
  it('> Test de la fonction de récupération avec un tableau rempli', () => {
    // Définition de fausses données pour le test
    const fakeSessionExercises: SessionExerciseModel[] = [
      {
        id: 8,
        sessionId: 2,
        exerciseId: 4,
        status: 'DONE',
      },
    ];
    mockAll.mockReturnValue(fakeSessionExercises);

    const resTab: SessionExerciseModel[] = sessionExerciseDB.getBySession(<
      DBRequestIdModel
    >{
      id: testId,
    });
    expect(resTab).toStrictEqual(fakeSessionExercises);
  });
});

// Test de la fonction de récupération des exercices pour une session précise
describe('sessionExerciseDB > getExercisesForSession', () => {
  // Données de test
  const sessionExerciseDB: SessionExerciseDB = new SessionExerciseDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionExerciseDB['get'] = mockGet;
    sessionExerciseDB['getAll'] = mockAll;
    sessionExerciseDB['create'] = mockCreate;
    sessionExerciseDB['update'] = mockUpdate;
    sessionExerciseDB['delete'] = mockDelete;
  });

  // Vérificiation des données lorsque le tableau renvoyé est vide
  it('> Test de la fonction de récupération avec un tableau vide', () => {
    mockAll.mockReturnValue([]);

    const exercices: SessionExerciseModel[] =
      sessionExerciseDB.getExercisesForSession(<DBRequestIdModel>{
        id: testId,
      });

    expect(mockAll).toHaveBeenCalledWith(
      'SELECT * FROM session_exercises WHERE session_id = ?',
      testId
    );
    expect(exercices).toStrictEqual([]);
  });

  // Vérificiation des données lorsque le tableau renvoyé est rempli, mais aucun exercice lié
  it('> Test de la fonction de récupération avec un tableau rempli, mais aucun exercice lié', () => {
    // Définition de fausses données pour le test
    const fakeDataExercises: SessionExerciseModel[] = [
      {
        id: 8,
        sessionId: 2,
        exerciseId: 4,
        status: 'DONE',
      },
    ];
    mockAll.mockReturnValue(fakeDataExercises);
    mockExerciseGet.mockReturnValue(undefined);

    const exercices: SessionExerciseModel[] =
      sessionExerciseDB.getExercisesForSession(<DBRequestIdModel>{
        id: testId,
      });

    expect(exercices).toStrictEqual([]);
  });

  // Vérificiation des données lorsque le tableau renvoyé est rempli
  it('> Test de la fonction de récupération avec un tableau rempli', () => {
    // Définition de fausses données pour le test
    const fakeDataExercises: SessionExerciseModel[] = [
      {
        id: 8,
        sessionId: 2,
        exerciseId: 4,
        status: 'DONE',
      },
    ];
    const fakeDataExercise: ExerciseModel = {
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
    };
    mockAll.mockReturnValue(fakeDataExercises);
    mockExerciseGet.mockReturnValue(fakeDataExercise);

    const exercices: SessionExerciseModel[] =
      sessionExerciseDB.getExercisesForSession(<DBRequestIdModel>{
        id: testId,
      });
    expect(exercices).toStrictEqual([
      {
        id: 8,
        sessionId: 2,
        exerciseId: 4,
        status: 'DONE',
        exercise: {
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
        },
      },
    ]);
  });
});

// la fonction de création d'un nouvel exercice à la session
describe('sessionExerciseDB > addExerciseToSession', () => {
  // Données de test
  const sessionExerciseDB: SessionExerciseDB = new SessionExerciseDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionExerciseDB['get'] = mockGet;
    sessionExerciseDB['getAll'] = mockAll;
    sessionExerciseDB['create'] = mockCreate;
    sessionExerciseDB['update'] = mockUpdate;
    sessionExerciseDB['delete'] = mockDelete;
  });

  // Vérification de l'appel de la fonction de préparation
  it('> Test de la fonction de préparation', () => {
    mockCreate.mockReturnValue(<DBResponseCreateModel>{
      newId: testId,
    });
    const fakeDataExercise: SessionExerciseModel = {
      id: 8,
      sessionId: 2,
      exerciseId: 4,
      status: 'DONE',
    };
    const mapperSesionExercise: SessionExerciseMapper =
      new SessionExerciseMapper();
    const sessionExerciseTable: SessionExerciseTable =
      mapperSesionExercise.mapModelToTable(fakeDataExercise);

    const responseCreate: DBResponseCreateModel =
      sessionExerciseDB.addExerciseToSession(fakeDataExercise);
    expect(mockCreate).toHaveBeenCalledWith(
      'INSERT INTO session_exercises (session_id, exercise_id, status) VALUES (?, ?, ?)',
      sessionExerciseTable.session_id,
      sessionExerciseTable.exercise_id,
      sessionExerciseTable.status
    );
    expect(responseCreate.newId).toBe(testId);
  });
});

// Test de la fonction de mise à jour du status d'un exercice
describe('sessionExerciseDB > updateSessionExerciseStatus', () => {
  // Données de test
  const sessionExerciseDB: SessionExerciseDB = new SessionExerciseDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionExerciseDB['get'] = mockGet;
    sessionExerciseDB['getAll'] = mockAll;
    sessionExerciseDB['create'] = mockCreate;
    sessionExerciseDB['update'] = mockUpdate;
    sessionExerciseDB['delete'] = mockDelete;
  });

  // Vérification de l'appel de la fonction de préparation avec aucune donnée mise à jour
  it('> Test de la fonction de préparation complète avec aucune donnée mise à jour', () => {
    const fakeDataExercise: SessionExerciseModel = {
      id: 8,
      sessionId: 2,
      exerciseId: 4,
      status: 'PENDING',
    };

    mockUpdate.mockReturnValue(<DBResponseUpdateModel>{
      nbUpdateLine: 0,
    });

    expect(() => {
      sessionExerciseDB.updateSessionExerciseStatus(fakeDataExercise);
    }).toThrow();
  });

  // Vérification de l'appel de la fonction de préparation avec uniquement la mise à jour
  it('> Test de la fonction de préparation complète avec uniquement la mise à jour', () => {
    const fakeDataExercise: SessionExerciseModel = {
      id: 8,
      sessionId: 2,
      exerciseId: 4,
      status: 'PENDING',
    };

    mockUpdate.mockReturnValue(<DBResponseUpdateModel>{
      nbUpdateLine: 5,
    });

    const responseUpdate: DBResponseUpdateModel =
      sessionExerciseDB.updateSessionExerciseStatus(fakeDataExercise);
    expect(mockUpdate).toHaveBeenCalledWith(
      'UPDATE session_exercises SET status = ? WHERE id = ?',
      fakeDataExercise.status,
      fakeDataExercise.id
    );
    expect(responseUpdate.nbUpdateLine).toBe(5);
  });

  // Vérification de l'appel de la fonction de préparation avec un identifiant de session qui n'existe pas
  it("> Test de la fonction de préparation complète avec un identifiant de session qui n'existe pas", () => {
    const fakeDataExercise: SessionExerciseModel = {
      id: 8,
      sessionId: 2,
      exerciseId: 4,
      status: 'DONE',
    };

    mockUpdate.mockReturnValue(<DBResponseUpdateModel>{
      nbUpdateLine: 5,
    });
    mockGet.mockReturnValue(undefined);

    const responseUpdate: DBResponseUpdateModel =
      sessionExerciseDB.updateSessionExerciseStatus(fakeDataExercise);
    expect(mockUpdate).toHaveBeenCalledWith(
      'UPDATE session_exercises SET status = ? WHERE id = ?',
      fakeDataExercise.status,
      fakeDataExercise.id
    );
    expect(mockGet).toHaveBeenCalledWith(
      'SELECT session_id FROM session_exercises WHERE id = ?',
      fakeDataExercise.id
    );
    expect(responseUpdate.nbUpdateLine).toBe(5);
  });

  // Vérification de l'appel de la fonction de préparation avec un exercice qui n'existe pas
  it("> Test de la fonction de préparation complète avec un exercice qui n'existe pas", () => {
    const fakeDataExercise: SessionExerciseModel = {
      id: 8,
      sessionId: 2,
      exerciseId: 4,
      status: 'DONE',
    };

    const fakeOldDataExerise: SessionExerciseModel = {
      id: 8,
      sessionId: 2,
      exerciseId: 4,
      status: 'DONE',
    };
    const sessionExerciseMapper: SessionExerciseMapper =
      new SessionExerciseMapper();
    const fakeOldDataExeriseTable: SessionExerciseTable =
      sessionExerciseMapper.mapModelToTable(fakeOldDataExerise);

    mockUpdate.mockReturnValue(<DBResponseUpdateModel>{
      nbUpdateLine: 5,
    });
    mockGet.mockReturnValue(fakeOldDataExerise);
    mockSessionGet.mockReturnValue(undefined);

    const responseUpdate: DBResponseUpdateModel =
      sessionExerciseDB.updateSessionExerciseStatus(fakeDataExercise);
    expect(mockUpdate).toHaveBeenCalledWith(
      'UPDATE session_exercises SET status = ? WHERE id = ?',
      fakeDataExercise.status,
      fakeDataExercise.id
    );
    expect(mockGet).toHaveBeenCalledWith(
      'SELECT session_id FROM session_exercises WHERE id = ?',
      fakeDataExercise.id
    );
    expect(mockSessionGet).toHaveBeenCalledWith(<DBRequestIdModel>{
      id: fakeOldDataExeriseTable.session_id,
    });
    expect(responseUpdate.nbUpdateLine).toBe(5);
  });

  // Vérification de l'appel de la fonction de préparation avec un status incompatible
  it('> Test de la fonction de préparation complète avec un status incompatible', () => {
    const fakeDataExercise: SessionExerciseModel = {
      id: 8,
      sessionId: 2,
      exerciseId: 4,
      status: 'DONE',
    };

    const fakeOldDataExerise: SessionExerciseModel = {
      id: 8,
      sessionId: 2,
      exerciseId: 4,
      status: 'DONE',
    };
    const sessionExerciseMapper: SessionExerciseMapper =
      new SessionExerciseMapper();
    const fakeOldDataExeriseTable: SessionExerciseTable =
      sessionExerciseMapper.mapModelToTable(fakeOldDataExerise);

    const fakeSession: SessionModel = {
      id: 12,
      patientId: 3,
      date: new Date(2024, 1, 1, 15, 25, 45),
      status: 'IN_PROGRESS',
      notes: 'Initial session',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
    };

    mockUpdate.mockReturnValue(<DBResponseUpdateModel>{
      nbUpdateLine: 5,
    });
    mockGet.mockReturnValue(fakeOldDataExerise);
    mockSessionGet.mockReturnValue(fakeSession);

    const responseUpdate: DBResponseUpdateModel =
      sessionExerciseDB.updateSessionExerciseStatus(fakeDataExercise);
    expect(mockUpdate).toHaveBeenCalledWith(
      'UPDATE session_exercises SET status = ? WHERE id = ?',
      fakeDataExercise.status,
      fakeDataExercise.id
    );
    expect(mockGet).toHaveBeenCalledWith(
      'SELECT session_id FROM session_exercises WHERE id = ?',
      fakeDataExercise.id
    );
    expect(mockSessionGet).toHaveBeenCalledWith(<DBRequestIdModel>{
      id: fakeOldDataExeriseTable.session_id,
    });
    expect(responseUpdate.nbUpdateLine).toBe(5);
  });

  // Vérification de l'appel de la fonction de préparation complète
  it('> Test de la fonction de préparation complète', () => {
    const fakeDataExercise: SessionExerciseModel = {
      id: 8,
      sessionId: 2,
      exerciseId: 4,
      status: 'DONE',
    };

    const fakeOldDataExerise: SessionExerciseModel = {
      id: 8,
      sessionId: 2,
      exerciseId: 4,
      status: 'DONE',
    };
    const sessionExerciseMapper: SessionExerciseMapper =
      new SessionExerciseMapper();
    const fakeOldDataExeriseTable: SessionExerciseTable =
      sessionExerciseMapper.mapModelToTable(fakeOldDataExerise);

    const fakeSession: SessionModel = {
      id: 12,
      patientId: 3,
      date: new Date(2024, 1, 1, 15, 25, 45),
      status: 'LATE',
      notes: 'Initial session',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
    };

    mockUpdate.mockReturnValueOnce(<DBResponseUpdateModel>{
      nbUpdateLine: 5,
    });
    mockGet.mockReturnValue(fakeOldDataExerise);
    mockSessionGet.mockReturnValue(fakeSession);
    mockUpdate.mockReturnValueOnce(<DBResponseUpdateModel>{
      nbUpdateLine: 4,
    });

    sessionExerciseDB.updateSessionExerciseStatus(fakeDataExercise);
    expect(mockUpdate).toHaveBeenNthCalledWith(
      1,
      'UPDATE session_exercises SET status = ? WHERE id = ?',
      fakeDataExercise.status,
      fakeDataExercise.id
    );
    expect(mockGet).toHaveBeenCalledWith(
      'SELECT session_id FROM session_exercises WHERE id = ?',
      fakeDataExercise.id
    );
    expect(mockSessionGet).toHaveBeenCalledWith(<DBRequestIdModel>{
      id: fakeOldDataExeriseTable.session_id,
    });
    expect(mockUpdate).toHaveBeenNthCalledWith(
      2,
      "UPDATE sessions SET status = 'IN_PROGRESS', date = ? WHERE id = ?",
      expect.any(String),
      fakeOldDataExeriseTable.session_id
    );
  });
});

// Test de la fonction de suppression d'un exercice d'une session
describe('sessionExerciseDB > deleteById', () => {
  // Données de test
  const sessionExerciseDB: SessionExerciseDB = new SessionExerciseDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionExerciseDB['get'] = mockGet;
    sessionExerciseDB['getAll'] = mockAll;
    sessionExerciseDB['create'] = mockCreate;
    sessionExerciseDB['update'] = mockUpdate;
    sessionExerciseDB['delete'] = mockDelete;
  });

  // Vérification du retour quand aucune ligne n'a été supprimée
  it("> Test du retour quand aucune ligne n'a été supprimée", () => {
    mockDelete.mockReturnValue(<DBResponseDeleteModel>{
      nbDeleteLine: 0,
    });

    expect(() => {
      sessionExerciseDB.deleteById(<DBRequestIdModel>{
        id: testId,
      });
    }).toThrow();
  });

  // Vérification du retour quand au moins une ligne a été supprimée
  it('> Test du retour quand au moins une ligne a été supprimée', () => {
    mockDelete.mockReturnValue(<DBResponseDeleteModel>{
      nbDeleteLine: 5,
    });

    const responseDelete: DBResponseDeleteModel = sessionExerciseDB.deleteById(<
      DBRequestIdModel
    >{
      id: testId,
    });
    expect(responseDelete.nbDeleteLine).toBe(5);
  });
});
