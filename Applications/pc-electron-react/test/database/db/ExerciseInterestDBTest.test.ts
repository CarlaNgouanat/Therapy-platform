import { describe, it, expect, vi } from 'vitest';
import { ExerciseInterestDB } from '@database/db/ExerciseInterestDB';
import { ExerciseInterestModel } from '@shared/models/ExerciseInterestModel';
import { ExerciseInterestTable } from '@database/tables/ExerciseInterestTable';

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
describe('ExerciseInterestDB - mapper configuration', () => {
  const exerciseInterestDB: ExerciseInterestDB = new ExerciseInterestDB();

  it("> Vérifie l'utilisation du mapper", () => {
    const patientInterestTable: ExerciseInterestTable = {
      interest_id: 4,
      exercise_id: 5,
    };

    const patientInterestModel: ExerciseInterestModel = {
      interestId: 4,
      exerciseId: 5,
    };

    expect(
      new exerciseInterestDB['mapper']().mapTableToModel(patientInterestTable)
    ).toStrictEqual(patientInterestModel);
  });
});
