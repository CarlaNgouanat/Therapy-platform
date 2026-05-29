import { describe, it, expect, vi } from 'vitest';
import { PatientInterestDB } from '@database/db/PatientInterestDB';
import { PatientInterestTable } from '@database/tables/PatientInterestTable';
import { PatientInterestModel } from '@shared/models/PatientInterestModel';

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

// Test de la configuration du mapper
describe('PatientInterestDB - mapper configuration', () => {
  const patientInterestDB: PatientInterestDB = new PatientInterestDB();

  it("> Vérifie l'utilisation du mapper", () => {
    const patientInterestTable: PatientInterestTable = {
      interest_id: 4,
      patient_id: 5,
    };

    const patientInterestModel: PatientInterestModel = {
      interestId: 4,
      patientId: 5,
    };

    expect(
      new patientInterestDB['mapper']().mapTableToModel(patientInterestTable)
    ).toStrictEqual(patientInterestModel);
  });
});
