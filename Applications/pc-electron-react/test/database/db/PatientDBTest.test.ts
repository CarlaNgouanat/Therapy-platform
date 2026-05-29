import { beforeEach, describe, it, expect, vi } from 'vitest';
import { InterestModel } from '@shared/models/InterestModel';
import { PatientDB } from '@database/db/PatientDB';
import { PatientModel } from '@shared/models/PatientModel';
import { PatientWithInterestsModel } from '@shared/models/PatientWithInterestsModel';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { PatientMapper } from '@database/mappers/PatientMapper';
import { PatientTable } from '@database/tables/PatientTable';
import { DBResponseUpdateModel } from '@shared/models/DBResponseUpdateModel';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';

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
      getByPatientId = mockInterestGet;
      setForPatient = mockInterestSet;
    },
  };
});

// Test de la fonction de récupération de toutes les données
describe('PatientDB > getAllPatientsWithInterests', () => {
  // Données de test
  const patientDB: PatientDB = new PatientDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    patientDB['get'] = mockGet;
    patientDB['getAll'] = mockAll;
    patientDB['create'] = mockCreate;
    patientDB['update'] = mockUpdate;
    patientDB['delete'] = mockDelete;
  });

  // Vérificiation des données lorsque le tableau renvoyé est vide
  it('> Test de la fonction de récupération avec un tableau vide', () => {
    mockAll.mockReturnValue([]);

    const patients: PatientModel[] = patientDB.getAllPatientsWithInterests();
    expect(patients).toStrictEqual([]);
  });

  // Vérificiation des données lorsque le tableau renvoyé est rempli
  it('> Test de la fonction de récupération avec un tableau rempli', () => {
    // Définition de fausses données pour le test
    const fakeDataPatients: PatientModel[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date(1990, 0, 1, 10, 5, 32),
        gender: 'MALE',
        notes: 'Test note',
        createdAt: new Date(2024, 0, 1, 15, 25, 45),
      },
    ];
    const fakeDataInterests: InterestModel[] = [
      {
        id: 2,
        name: 'Music',
        createdAt: new Date(2024, 0, 1, 15, 25, 45),
      },
    ];
    mockAll.mockReturnValueOnce(fakeDataPatients);
    mockInterestGet.mockReturnValueOnce(fakeDataInterests);

    const patientsWithInterests: PatientWithInterestsModel[] =
      patientDB.getAllPatientsWithInterests();
    expect(patientsWithInterests).toStrictEqual([
      {
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
      },
    ]);
  });
});

// Test de la fonction de récupération d'une seule donnée
describe('PatientDB > getPatientWithInterestsById', () => {
  // Données de test
  const patientDB: PatientDB = new PatientDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    patientDB['get'] = mockGet;
    patientDB['getAll'] = mockAll;
    patientDB['create'] = mockCreate;
    patientDB['update'] = mockUpdate;
    patientDB['delete'] = mockDelete;
  });

  // Vérificiation de la donnée lorsqu'elle n'existe pas
  it('> Test de la fonction de récupération avec une donnée undefined', () => {
    mockGet.mockReturnValue(undefined);

    expect(() => {
      patientDB.getPatientWithInterestsById(<DBRequestIdModel>{
        id: testId,
      });
    }).toThrow();
  });

  // Vérificiation de la donnée lorsqu'elle existe
  it('> Test de la fonction de récupération avec une donnée exitante', () => {
    // Définition de fausses données pour le test
    const fakeDataPatient: PatientModel = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date(1990, 0, 1, 10, 5, 32),
      gender: 'MALE',
      notes: 'Test note',
      createdAt: new Date(2024, 0, 1, 15, 25, 45),
    };
    const fakeDataInterests: InterestModel[] = [
      {
        id: 2,
        name: 'Music',
        createdAt: new Date(2024, 0, 1, 15, 25, 45),
      },
    ];

    mockGet.mockReturnValue(fakeDataPatient);
    mockInterestGet.mockReturnValue(fakeDataInterests);

    const patient: PatientModel | undefined =
      patientDB.getPatientWithInterestsById(<DBRequestIdModel>{
        id: testId,
      });
    expect(patient).toStrictEqual({
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
    });
  });
});

// Test de la fonction de création d'un nouveau patient
describe('PatientDB > createPatient', () => {
  // Données de test
  const patientDB: PatientDB = new PatientDB();
  const testPatientWithInterests: PatientWithInterestsModel = {
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

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    patientDB['get'] = mockGet;
    patientDB['getAll'] = mockAll;
    patientDB['create'] = mockCreate;
    patientDB['update'] = mockUpdate;
    patientDB['delete'] = mockDelete;
  });

  // Vérification du renvoie de l'identifiant après création
  it("> Test de la création d'une nouvelle donnée", () => {
    const testId: number = 5;
    mockCreate.mockReturnValue(<DBResponseCreateModel>{
      newId: testId,
    });

    const responseCreate: DBResponseCreateModel = patientDB.createPatient(
      testPatientWithInterests
    );

    const patientMapper: PatientMapper = new PatientMapper();
    const patientTable: PatientTable = patientMapper.mapModelToTable(
      testPatientWithInterests
    );

    expect(mockCreate).toHaveBeenCalledWith(
      'INSERT INTO patients (first_name, last_name, birth_date, gender, notes) VALUES (?, ?, ?, ?, ?)',
      patientTable.first_name,
      patientTable.last_name,
      patientTable.birth_date,
      patientTable.gender,
      patientTable.notes
    );

    expect(responseCreate.newId).toBe(testId);
  });
});

// Test de la fonction de mise à jour d'un patient
describe('PatientDB > updateExercice', () => {
  // Données de test
  const patientDB: PatientDB = new PatientDB();
  const testPatientWithInterests: PatientWithInterestsModel = {
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

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    patientDB['get'] = mockGet;
    patientDB['getAll'] = mockAll;
    patientDB['create'] = mockCreate;
    patientDB['update'] = mockUpdate;
    patientDB['delete'] = mockDelete;
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
      patientDB.updatePatient(testPatientWithInterests);
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

    const responseUpdate: DBResponseUpdateModel = patientDB.updatePatient(
      testPatientWithInterests
    );
    expect(responseUpdate.nbUpdateLine).toStrictEqual(11);
  });
});

// Test de la fonction de suppression d'un patient
describe('PatientDB > deleteById', () => {
  // Données de test
  const patientDB: PatientDB = new PatientDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    patientDB['get'] = mockGet;
    patientDB['getAll'] = mockAll;
    patientDB['create'] = mockCreate;
    patientDB['update'] = mockUpdate;
    patientDB['delete'] = mockDelete;
  });

  // Vérification du retour quand aucune ligne n'a été supprimée
  it("> Testdu retour quand aucune ligne n'a été supprimée", () => {
    mockDelete.mockReturnValue(<DBResponseDeleteModel>{
      nbDeleteLine: 0,
    });

    expect(() => {
      patientDB.deleteById(<DBRequestIdModel>{
        id: testId,
      });
    }).toThrow();
  });

  // Vérification du retour quand au moins une ligne a été supprimée
  it('> Test du retour quand au moins une ligne a été supprimée', () => {
    mockDelete.mockReturnValue(<DBResponseDeleteModel>{
      nbDeleteLine: 5,
    });

    const responseDelete: DBResponseDeleteModel = patientDB.deleteById(<
      DBRequestIdModel
    >{
      id: testId,
    });
    expect(responseDelete.nbDeleteLine).toBe(5);
  });
});
