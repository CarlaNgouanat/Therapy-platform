import { beforeEach, describe, it, expect, vi } from 'vitest';
import { SessionDB } from '@database/db/SessionDB';
import { SessionWithExerciseCountModel } from '@shared/models/SessionWithExerciseCountModel';
import { SessionModel } from '@shared/models/SessionModel';
import { SessionExerciseModel } from '@shared/models/SessionExerciseModel';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { SessionMapper } from '@database/mappers/SessionMapper';
import { SessionTable } from '@database/tables/SessionTable';
import { DBResponseUpdateModel } from '@shared/models/DBResponseUpdateModel';
import { ActiveSessionPatientModel } from '@shared/models/ActiveSessionPatientModel';
import { PatientWithInterestsModel } from '@shared/models/PatientWithInterestsModel';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';
import { IsActiveSessionModel } from '@shared/models/IsActiveSessionModel';

// Mock des fonctions pour espionner les appels
const mockGet = vi.fn();
const mockAll = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockSessionGet = vi.fn();
const mockPatientGet = vi.fn();

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
vi.mock('@database/db/patientDB', () => {
  return {
    PatientDB: class {
      getPatientWithInterestsById = mockPatientGet;
    },
  };
});

// Mock InterestDB
vi.mock('@database/db/SessionExerciseDB', () => {
  return {
    SessionExerciseDB: class {
      getBySession = mockSessionGet;
    },
  };
});

// Test de la fonction de création d'une nouvelle session pour un patient
describe('SessionDB > isActivePatient', () => {
  // Données de test
  const sessionDB: SessionDB = new SessionDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionDB['get'] = mockGet;
    sessionDB['getAll'] = mockAll;
    sessionDB['create'] = mockCreate;
    sessionDB['update'] = mockUpdate;
    sessionDB['delete'] = mockDelete;
  });

  // Vérificiation de la donnée lorsqu'aucune session n'est active
  it("> Test de la donnée lorsqu'aucune session n'est active", () => {
    mockAll.mockReturnValue([]);

    const isActive: IsActiveSessionModel = sessionDB.isActivePatient();
    expect(isActive.isActive).toBeFalsy();
  });

  // Vérificiation de la donnée lorsqu'elle existe
  it('> Test de la fonction de récupération avec une donnée exitante', () => {
    // Définition de fausses données pour le test
    const fakeDataSession: ActiveSessionPatientModel = {
      patient: <PatientWithInterestsModel>{
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date(1990, 0, 1, 10, 5, 32),
        gender: 'MALE',
        notes: 'Test note',
        createdAt: new Date(2024, 0, 1, 15, 25, 45),
        interests: [],
      },
      id: 12,
      patientId: 3,
      date: new Date(2024, 1, 1, 15, 25, 45),
      status: 'LATE',
      notes: 'Initial session',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
    };
    mockAll.mockReturnValue([fakeDataSession]);

    const isActive: IsActiveSessionModel = sessionDB.isActivePatient();
    expect(isActive.isActive).toBeTruthy();
  });
});

// Test de la fonction de création d'une nouvelle session pour un patient
describe('SessionDB > getActivePatient', () => {
  // Données de test
  const sessionDB: SessionDB = new SessionDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionDB['get'] = mockGet;
    sessionDB['getAll'] = mockAll;
    sessionDB['create'] = mockCreate;
    sessionDB['update'] = mockUpdate;
    sessionDB['delete'] = mockDelete;
  });

  // Vérificiation de la donnée lorsqu'elle n'existe pas
  it('> Test de la fonction de récupération avec une donnée undefined', () => {
    mockGet.mockReturnValue(undefined);

    expect(() => {
      sessionDB.getActivePatient();
    }).toThrow();
  });

  // Vérificiation de la donnée lorsqu'elle existe
  // it('> Test de la fonction de récupération avec une donnée exitante', () => {
  //   // Définition de fausses données pour le test
  //   const fakeDataSession: ActiveSessionPatientModel = {
  //     patient: <PatientWithInterestsModel>{
  //       id: 1,
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       birthDate: new Date(1990, 0, 1, 10, 5, 32),
  //       gender: 'MALE',
  //       notes: 'Test note',
  //       createdAt: new Date(2024, 0, 1, 15, 25, 45),
  //       interests: [],
  //     },
  //     id: 12,
  //     patientId: 3,
  //     date: new Date(2024, 1, 1, 15, 25, 45),
  //     status: 'LATE',
  //     notes: 'Initial session',
  //     createdAt: new Date(2024, 0, 1, 15, 25, 45),
  //   };
  //   mockGet.mockReturnValue(fakeDataSession);
  //   mockPatientGet.mockReturnValue(fakeDataSession.patient);

  //   const session: ActiveSessionPatientModel | undefined =
  //     sessionDB.getActivePatient();
  //   expect(session).toStrictEqual(fakeDataSession);
  // });
});

// Test de la fonction de récupération des patients d'une session
describe('SessionDB > getByPatient', () => {
  // Données de test
  const sessionDB: SessionDB = new SessionDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionDB['get'] = mockGet;
    sessionDB['getAll'] = mockAll;
    sessionDB['create'] = mockCreate;
    sessionDB['update'] = mockUpdate;
    sessionDB['delete'] = mockDelete;
  });

  // Vérificiation des données lorsque le tableau renvoyé est vide
  it('> Test de la fonction de récupération avec un tableau vide', () => {
    mockAll.mockReturnValue([]);

    const sessions: SessionWithExerciseCountModel[] = sessionDB.getByPatient(<
      DBRequestIdModel
    >{
      id: testId,
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      `UPDATE sessions 
             SET status = 'LATE' 
             WHERE patient_id = ? 
             AND status IN ('PLANNED') 
             AND date < datetime('now', '+1 hour')`,
      testId
    );
    expect(mockAll).toHaveBeenCalledWith(
      'SELECT * FROM sessions WHERE patient_id = ? ORDER BY date DESC',
      testId
    );
    expect(sessions).toStrictEqual([]);
  });

  // Vérificiation des données lorsque le tableau renvoyé est rempli
  it('> Test de la fonction de récupération avec un tableau rempli', () => {
    // Définition de fausses données pour le test
    const fakeDataSessions: SessionModel[] = [
      {
        id: 12,
        patientId: 3,
        date: new Date(2024, 1, 1, 15, 25, 45),
        status: 'LATE',
        notes: 'Initial session',
        createdAt: new Date(2024, 0, 1, 15, 25, 45),
      },
    ];
    const fakeSessionExercises: SessionExerciseModel[] = [
      {
        id: 8,
        sessionId: 2,
        exerciseId: 4,
        status: 'DONE',
      },
    ];

    mockAll.mockReturnValueOnce(fakeDataSessions);
    mockSessionGet.mockReturnValueOnce(fakeSessionExercises);

    const sessions: SessionWithExerciseCountModel[] = sessionDB.getByPatient(<
      DBRequestIdModel
    >{
      id: testId,
    });
    expect(sessions).toStrictEqual([
      {
        id: 12,
        patientId: 3,
        date: new Date(2024, 1, 1, 15, 25, 45),
        status: 'LATE',
        notes: 'Initial session',
        createdAt: new Date(2024, 0, 1, 15, 25, 45),
        exerciseCount: 1,
      },
    ]);
  });
});

// Test de la fonction de création d'une nouvelle session pour un patient
describe('SessionDB > getById', () => {
  // Données de test
  const sessionDB: SessionDB = new SessionDB();
  const testId: number = 12;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionDB['get'] = mockGet;
    sessionDB['getAll'] = mockAll;
    sessionDB['create'] = mockCreate;
    sessionDB['update'] = mockUpdate;
    sessionDB['delete'] = mockDelete;
  });

  // Vérificiation de la donnée lorsqu'elle n'existe pas
  it('> Test de la fonction de récupération avec une donnée undefined', () => {
    mockGet.mockReturnValue(undefined);

    expect(() => {
      sessionDB.getById(<DBRequestIdModel>{
        id: testId,
      });
    }).toThrow();
  });

  // Vérificiation de la donnée lorsqu'elle existe
  it('> Test de la fonction de récupération avec une donnée exitante', () => {
    // Définition de fausses données pour le test
    const fakeDataSession: SessionModel = {
      id: 12,
      patientId: 3,
      date: new Date(2024, 1, 1, 15, 25, 45),
      status: 'LATE',
      notes: 'Initial session',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
    };
    mockGet.mockReturnValue(fakeDataSession);

    const patient: SessionModel | undefined = sessionDB.getById(<
      DBRequestIdModel
    >{
      id: testId,
    });
    expect(patient).toStrictEqual(fakeDataSession);
  });
});

// Test de la fonction de création d'une nouvelle session pour un patient
describe('SessionDB > startSession', () => {
  // Données de test
  const sessionDB: SessionDB = new SessionDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionDB['get'] = mockGet;
    sessionDB['getAll'] = mockAll;
    sessionDB['create'] = mockCreate;
    sessionDB['update'] = mockUpdate;
    sessionDB['delete'] = mockDelete;
  });

  // Vérification du renvoie d'une erreur pour le lancement d'une session déjà lancée
  it("> Test du renvoie d'une erreur pour le lancement d'une session déjà lancée", () => {
    const fakeDataSession = <SessionModel>{
      id: 1,
      patientId: 3,
      date: new Date(2024, 1, 1, 15, 25, 45),
      status: 'LATE',
      notes: 'Initial session',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
    };
    const fakeDataActiveSession: ActiveSessionPatientModel = {
      patient: <PatientWithInterestsModel>{
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date(1990, 0, 1, 10, 5, 32),
        gender: 'MALE',
        notes: 'Test note',
        createdAt: new Date(2024, 0, 1, 15, 25, 45),
        interests: [],
      },
      id: 12,
      patientId: 3,
      date: new Date(2024, 1, 1, 15, 25, 45),
      status: 'LATE',
      notes: 'Initial session',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
    };
    mockGet.mockReturnValueOnce(fakeDataSession);
    mockGet.mockReturnValueOnce(fakeDataActiveSession);
    sessionDB.isActivePatient = vi.fn(() => {
      return <IsActiveSessionModel>{
        isActive: true,
      };
    });

    expect(() => {
      sessionDB.startSession(fakeDataSession);
    }).toThrow();
  });

  // Vérificiation du 1er lancement d'un exerice (passage à IN_PROGRESS)
  it("> Test du 1er lancement d'un exerice (passage à IN_PROGRESS)", () => {
    const fakeDataSession = <SessionModel>{
      id: 12,
      patientId: 3,
      date: new Date(2024, 1, 1, 15, 25, 45),
      status: 'LATE',
      notes: 'Initial session',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
    };
    mockGet.mockReturnValue(fakeDataSession);
    sessionDB.isActivePatient = vi.fn(() => {
      return <IsActiveSessionModel>{
        isActive: false,
      };
    });
    sessionDB.updateSessionStatus = vi.fn(() => {
      return <DBResponseUpdateModel>{
        nbUpdateLine: 1,
      };
    });

    const responseUpdate: DBResponseUpdateModel =
      sessionDB.startSession(fakeDataSession);
    expect(responseUpdate.nbUpdateLine).toStrictEqual(1);
  });

  // // Vérificiation du 2ème lancement d'un exerice (passage à IN_PROGRESS)
  // it("> Test du 2ème lancement d'un exerice (passage à IN_PROGRESS)", () => {
  //   const fakeDataSession = <SessionModel>{
  //     id: 12,
  //     patientId: 3,
  //     date: new Date(2024, 1, 1, 15, 25, 45),
  //     status: 'LATE',
  //     notes: 'Initial session',
  //     createdAt: new Date(2024, 0, 1, 15, 25, 45),
  //   };
  //   const fakeDataActiveSession: ActiveSessionPatientModel = {
  //     patient: <PatientWithInterestsModel>{
  //       id: 1,
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       birthDate: new Date(1990, 0, 1, 10, 5, 32),
  //       gender: 'MALE',
  //       notes: 'Test note',
  //       createdAt: new Date(2024, 0, 1, 15, 25, 45),
  //       interests: [],
  //     },
  //     id: 11,
  //     patientId: 3,
  //     date: new Date(2024, 1, 1, 15, 25, 45),
  //     status: 'LATE',
  //     notes: 'Initial session',
  //     createdAt: new Date(2024, 0, 1, 15, 25, 45),
  //   };
  //   mockGet.mockReturnValueOnce(fakeDataSession);
  //   mockGet.mockReturnValueOnce(fakeDataActiveSession);
  //   mockPatientGet.mockReturnValue(fakeDataActiveSession.patient);
  //   sessionDB.isActivePatient = vi.fn(() => {
  //     return <IsActiveSessionModel>{
  //       isActive: true,
  //     };
  //   });
  //   sessionDB.updateSessionStatus = vi.fn(() => {
  //     return <DBResponseUpdateModel>{
  //       nbUpdateLine: 1,
  //     };
  //   });

  //   const responseUpdate: DBResponseUpdateModel =
  //     sessionDB.startSession(fakeDataSession);
  //   expect(responseUpdate.nbUpdateLine).toStrictEqual(2);
  // });
});

// Test de la fonction de création d'une nouvelle session pour un patient
describe('SessionDB > createSession', () => {
  // Données de test
  const sessionDB: SessionDB = new SessionDB();
  const testSession: SessionModel = {
    id: 12,
    patientId: 3,
    date: new Date(2024, 1, 1, 15, 25, 45),
    status: 'LATE',
    notes: 'Initial session',
    createdAt: new Date(2024, 0, 1, 15, 25, 45),
  };

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionDB['get'] = mockGet;
    sessionDB['getAll'] = mockAll;
    sessionDB['create'] = mockCreate;
    sessionDB['update'] = mockUpdate;
    sessionDB['delete'] = mockDelete;
  });

  // Vérification de l'appel de la fonction de préparation
  it('> Test de la fonction de préparation', () => {
    const testId: number = 1;
    mockCreate.mockReturnValue(<DBResponseCreateModel>{
      newId: testId,
    });

    const mapper: SessionMapper = new SessionMapper();
    const sessionTable: SessionTable = mapper.mapModelToTable(testSession);

    const responseCreate: DBResponseCreateModel =
      sessionDB.createSession(testSession);
    expect(mockCreate).toHaveBeenCalledWith(
      'INSERT INTO sessions (patient_id, date, status, notes) VALUES (?, ?, ?, ?)',
      sessionTable.patient_id,
      sessionTable.date,
      sessionTable.status,
      sessionTable.notes
    );
    expect(responseCreate.newId).toBe(testId);
  });
});

// Test de la fonction de mise à jour d'un patient
describe('SessionDB > updateSession', () => {
  // Données de test
  const sessionDB: SessionDB = new SessionDB();
  const testSession: SessionModel = {
    id: 12,
    patientId: 3,
    date: new Date(2024, 1, 1, 15, 25, 45),
    status: 'LATE',
    notes: 'Initial session',
    createdAt: new Date(2024, 0, 1, 15, 25, 45),
  };

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionDB['get'] = mockGet;
    sessionDB['getAll'] = mockAll;
    sessionDB['create'] = mockCreate;
    sessionDB['update'] = mockUpdate;
    sessionDB['delete'] = mockDelete;
  });

  // Vérification du retour quand aucune ligne n'a été modifiée
  it("> Test du retour quand aucune ligne n'a été modifiée", () => {
    mockUpdate.mockReturnValue(<DBResponseUpdateModel>{
      nbUpdateLine: 0,
    });

    expect(() => {
      sessionDB.updateSession(testSession);
    }).toThrow();
  });

  // Vérification du retour quand au moins une ligne a été modifiée
  it('> Test du retour quand au moins une ligne a été modifiée', () => {
    mockUpdate.mockReturnValue(<DBResponseUpdateModel>{
      nbUpdateLine: 5,
    });

    const responseUpdate: DBResponseUpdateModel =
      sessionDB.updateSession(testSession);
    expect(responseUpdate.nbUpdateLine).toStrictEqual(5);
  });
});

// Test de la fonction de mise à jour d'une session
describe('SessionDB > updateSessionStatus', () => {
  // Données de test
  const sessionDB: SessionDB = new SessionDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionDB['get'] = mockGet;
    sessionDB['getAll'] = mockAll;
    sessionDB['create'] = mockCreate;
    sessionDB['update'] = mockUpdate;
    sessionDB['delete'] = mockDelete;
  });

  // Vérification de l'appel de la fonction de préparation avec une session qui n'existe pas
  it("> Test de la fonction de préparation complète avec une session qui n'existe pas", () => {
    mockGet.mockReturnValue(undefined);

    const testSession: SessionModel = {
      id: 12,
      patientId: 3,
      date: new Date(2024, 1, 1, 15, 25, 45),
      status: 'LATE',
      notes: 'Initial session',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
    };

    expect(() => {
      sessionDB.updateSessionStatus(testSession);
    }).toThrow();
  });

  // Vérification de l'appel de la fonction de préparation avec un status en IN_PROGRESS
  it('> Test de la fonction de préparation complète avec un status en IN_PROGRESS', () => {
    const testSession: SessionModel = {
      id: 12,
      patientId: 3,
      date: new Date(2024, 1, 1, 15, 25, 45),
      status: 'IN_PROGRESS',
      notes: 'Initial session',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
    };
    const oldSession: SessionModel = {
      id: 12,
      patientId: 3,
      date: new Date(2024, 1, 1, 15, 25, 45),
      status: 'LATE',
      notes: 'Initial session',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
    };
    const sessionTable: SessionTable = new sessionDB[
      'mapper'
    ]().mapModelToTable(testSession);

    mockGet.mockReturnValue(oldSession);
    mockUpdate.mockReturnValue(<DBResponseUpdateModel>{
      nbUpdateLine: 5,
    });

    const responseUpdate: DBResponseUpdateModel =
      sessionDB.updateSessionStatus(testSession);
    expect(mockGet).toHaveBeenCalledWith(
      'SELECT * FROM sessions WHERE id = ?',
      testSession.id
    );
    expect(mockUpdate).toHaveBeenCalledWith(
      'UPDATE sessions SET patient_id = ?, date = ?, status = ?, notes = ?, created_at = ? WHERE id = ?',
      sessionTable.patient_id,
      expect.any(String),
      sessionTable.status,
      sessionTable.notes,
      sessionTable.created_at,
      sessionTable.id
    );
    expect(responseUpdate.nbUpdateLine).toBe(5);
  });

  // Vérification de l'appel de la fonction de préparation sans un status en IN_PROGRESS
  it('> Test de la fonction de préparation complète sans un status en IN_PROGRESS', () => {
    const testSession: SessionModel = {
      id: 12,
      patientId: 3,
      date: new Date(2024, 1, 1, 15, 25, 45),
      status: 'LATE',
      notes: 'Initial session',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
    };
    const oldSession: SessionModel = {
      id: 12,
      patientId: 3,
      date: new Date(2024, 1, 1, 15, 25, 45),
      status: 'IN_PROGRESS',
      notes: 'Initial session',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
    };
    const sessionTable: SessionTable = new sessionDB[
      'mapper'
    ]().mapModelToTable(testSession);

    mockGet.mockReturnValue(oldSession);
    mockUpdate.mockReturnValue(<DBResponseUpdateModel>{
      nbUpdateLine: 7,
    });

    const responseUpdate: DBResponseUpdateModel =
      sessionDB.updateSessionStatus(testSession);
    expect(mockGet).toHaveBeenCalledWith(
      'SELECT * FROM sessions WHERE id = ?',
      testSession.id
    );
    expect(mockUpdate).toHaveBeenCalledWith(
      'UPDATE sessions SET patient_id = ?, date = ?, status = ?, notes = ?, created_at = ? WHERE id = ?',
      sessionTable.patient_id,
      sessionTable.date,
      sessionTable.status,
      sessionTable.notes,
      sessionTable.created_at,
      sessionTable.id
    );
    expect(responseUpdate.nbUpdateLine).toBe(7);
  });
});

// Test de la fonction de suppression d'un exercice
describe('SessionDB > deleteById', () => {
  // Données de test
  const sessionDB: SessionDB = new SessionDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    sessionDB['get'] = mockGet;
    sessionDB['getAll'] = mockAll;
    sessionDB['create'] = mockCreate;
    sessionDB['update'] = mockUpdate;
    sessionDB['delete'] = mockDelete;
  });

  // Vérification du retour quand aucune ligne n'a été supprimée
  it("> Testdu retour quand aucune ligne n'a été supprimée", () => {
    mockDelete.mockReturnValue(<DBResponseDeleteModel>{
      nbDeleteLine: 0,
    });

    expect(() => {
      sessionDB.deleteById(<DBRequestIdModel>{
        id: testId,
      });
    }).toThrow();
  });

  // Vérification du retour quand au moins une ligne a été supprimée
  it('> Test du retour quand au moins une ligne a été supprimée', () => {
    mockDelete.mockReturnValue(<DBResponseDeleteModel>{
      nbDeleteLine: 5,
    });

    const responseDelete: DBResponseDeleteModel = sessionDB.deleteById(<
      DBRequestIdModel
    >{
      id: testId,
    });
    expect(responseDelete.nbDeleteLine).toBe(5);
  });
});
