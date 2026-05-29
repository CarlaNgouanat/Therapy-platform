import { beforeEach, describe, it, expect, vi } from 'vitest';
import { ResourceDB } from '@database/db/ResourceDB';
import { ResourceType } from '@shared/types/ResourceType';
import { DBRequestResourceTypeModel } from '@shared/models/DBRequestResourceTypeModel';
import { ResourceModel } from '@shared/models/ResourceModel';
import { ResourceMapper } from '@database/mappers/ResourceMapper';
import { ResourceTable } from '@database/tables/ResourceTable';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';

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

// Test de la fonction de récupération de toutes les données à partir d'un type
describe('ResourceDB > getByType', () => {
  // Données de test
  const resourceDB: ResourceDB = new ResourceDB();
  const testType: ResourceType = 'IMAGE';

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    resourceDB['get'] = mockGet;
    resourceDB['getAll'] = mockAll;
    resourceDB['create'] = mockCreate;
    resourceDB['update'] = mockUpdate;
    resourceDB['delete'] = mockDelete;
  });

  // Vérification de l'appel de la requête
  it("> Test de l'appel de la requête", () => {
    mockAll.mockReturnValue([]);

    resourceDB.getByType(<DBRequestResourceTypeModel>{
      type: testType,
    });
    expect(mockAll).toHaveBeenCalledWith(
      'SELECT * FROM resources WHERE type = ? ORDER BY name',
      testType
    );
  });
});

// Test de la fonction de création d'une nouvelle ressource
describe('ResourceDB > createResource', () => {
  // Données de test
  const resourceDB: ResourceDB = new ResourceDB();
  const testResource: ResourceModel = {
    id: 5,
    name: 'Image Test',
    type: 'IMAGE',
    filePath: '/path/to/file.png',
    createdAt: new Date(2024, 0, 1, 15, 25, 45),
  };
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    resourceDB['get'] = mockGet;
    resourceDB['getAll'] = mockAll;
    resourceDB['create'] = mockCreate;
    resourceDB['update'] = mockUpdate;
    resourceDB['delete'] = mockDelete;
  });

  // Vérification de l'appel de la requête
  it("> Test de l'appel de la requête", () => {
    const resourceMapper: ResourceMapper = new ResourceMapper();
    const resourceTable: ResourceTable =
      resourceMapper.mapModelToTable(testResource);

    mockCreate.mockReturnValue(<DBResponseCreateModel>{
      newId: testId,
    });

    const responseCreate: DBResponseCreateModel =
      resourceDB.createResource(testResource);
    expect(mockCreate).toHaveBeenCalledWith(
      'INSERT INTO resources (name, type, file_path) VALUES (?, ?, ?)',
      resourceTable.name,
      resourceTable.type,
      resourceTable.file_path
    );

    expect(responseCreate.newId).toBe(testId);
  });
});

// Test de la fonction de suppression d'une ressource
describe('ResourceDB > deleteResource', () => {
  // Données de test
  const resourceDB: ResourceDB = new ResourceDB();
  const testId: number = 5;

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks();
    resourceDB['get'] = mockGet;
    resourceDB['getAll'] = mockAll;
    resourceDB['create'] = mockCreate;
    resourceDB['update'] = mockUpdate;
    resourceDB['delete'] = mockDelete;
  });

  // Vérification du retour quand aucune ligne n'a été supprimée
  it("> Test du retour quand aucune ligne n'a été supprimée", () => {
    mockDelete.mockReturnValue(<DBResponseDeleteModel>{
      nbDeleteLine: 0,
    });

    expect(() => {
      resourceDB.deleteResource(<DBRequestIdModel>{
        id: testId,
      });
    }).toThrow();
  });

  // Vérification du retour quand au moins une ligne a été supprimée
  it('> Test du retour quand au moins une ligne a été supprimée', () => {
    mockDelete.mockReturnValue(<DBResponseDeleteModel>{
      nbDeleteLine: 5,
    });

    const responseDelete: DBResponseDeleteModel = resourceDB.deleteResource(<
      DBRequestIdModel
    >{
      id: testId,
    });
    expect(responseDelete.nbDeleteLine).toBe(5);
  });
});
