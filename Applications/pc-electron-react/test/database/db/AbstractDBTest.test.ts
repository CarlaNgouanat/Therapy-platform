import { beforeEach, describe, it, expect, vi } from 'vitest';
import { AbstractDB } from '@database/db/AbstractDB';
import { AbstractMapper } from '@database/mappers/AbstractMapper';
import { AbstractModel } from '@shared/models/AbstractModel';
import { AbstractTable } from '@database/tables/AbstractTable';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { DBResponseUpdateModel } from '@shared/models/DBResponseUpdateModel';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';

// Mock des fonctions pour espionner les appels
const mockGetRequest = vi.fn();
const mockGetAllRequest = vi.fn();
const mockExecRequest = vi.fn();

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
      static getInstance() {
        return {
          getRequest: mockGetRequest,
          getAllRequest: mockGetAllRequest,
          execRequest: mockExecRequest,
        };
      }
    },
  };
});

// Création des fausses classes de test (model / table / mapper)
interface FakeTable extends AbstractTable {}
interface FakeModel extends AbstractModel {}

class FakeMapper extends AbstractMapper<FakeTable, FakeModel> {
  mapTableToModel(): FakeModel {
    return {} as FakeModel;
  }
  mapModelToTable(): FakeTable {
    return {} as FakeTable;
  }
}

// Création de la fausse classe DB
class TestDB extends AbstractDB<FakeTable, FakeModel> {
  protected mapper = FakeMapper;
}

// Test de la requête sur le renvoie d'une donnée
describe('AbstractDB > get', () => {
  const testDB: TestDB = new TestDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.clearAllMocks();
  });

  // Renvoie d'un undefined
  it("> Renvoie d'un undefined sans paramètre", () => {
    const request: string = 'SELECT * from fake';
    mockGetRequest.mockReturnValue(undefined);

    const resRequest: undefined | FakeModel = testDB['get'](request);

    expect(mockGetRequest).toHaveBeenCalledWith(testDB['mapper'], request);
    expect(resRequest).toBeUndefined();
  });

  it("> Renvoie d'un modèle avec des paramètres", () => {
    const request: string = 'SELECT * from fake';
    const param1: string = 'param1';
    const param2: string = 'param2';
    mockGetRequest.mockReturnValue(<FakeModel>{});

    const resRequest: undefined | FakeModel = testDB['get'](
      request,
      param1,
      param2
    );

    expect(mockGetRequest).toHaveBeenCalledWith(
      testDB['mapper'],
      request,
      param1,
      param2
    );
    expect(resRequest).toStrictEqual({});
  });
});

// Test de la requête sur le renvoie plusieurs données
describe('AbstractDB > getAll', () => {
  const testDB: TestDB = new TestDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.clearAllMocks();
  });

  // Renvoie d'un tableau vide
  it("> Renvoie d'un tableau vide sans paramètre", () => {
    const request: string = 'SELECT * from fake';
    mockGetAllRequest.mockReturnValue([]);

    const resRequest: undefined | FakeModel = testDB['getAll'](request);

    expect(mockGetAllRequest).toHaveBeenCalledWith(testDB['mapper'], request);
    expect(resRequest).toStrictEqual([]);
  });

  it("> Renvoie d'un tableau avec des paramètres", () => {
    const request: string = 'SELECT * from fake';
    const param1: string = 'param1';
    const param2: string = 'param2';
    mockGetAllRequest.mockReturnValue([{}, {}, {}]);

    const resRequest: undefined | FakeModel = testDB['getAll'](
      request,
      param1,
      param2
    );

    expect(mockGetAllRequest).toHaveBeenCalledWith(
      testDB['mapper'],
      request,
      param1,
      param2
    );
    expect(resRequest).toStrictEqual([{}, {}, {}]);
  });
});

// Test de la requête sur l'ajout d'une nouvelle donnée
describe('AbstractDB > create', () => {
  const testDB: TestDB = new TestDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.clearAllMocks();
  });

  // Renvoie d'un identifiant sans paramètre
  it("> Renvoie d'un identifiant sans paramètre", () => {
    const request: string = 'INSERT INTO ...';
    mockExecRequest.mockReturnValue({
      lastInsertRowid: 0,
    });

    const resRequest: undefined | FakeModel = testDB['create'](request);

    expect(mockExecRequest).toHaveBeenCalledWith(request);
    expect(resRequest).toStrictEqual(<DBResponseCreateModel>{
      newId: 0,
    });
  });

  // Renvoie d'un identifiant avec des paramètres
  it("> Renvoie d'un identifiant avec des paramètres", () => {
    const request: string = 'INSERT INTO ...';
    const param1: string = 'param1';
    const param2: string = 'param2';
    mockExecRequest.mockReturnValue({
      lastInsertRowid: 5,
    });

    const resRequest: undefined | FakeModel = testDB['create'](
      request,
      param1,
      param2
    );

    expect(mockExecRequest).toHaveBeenCalledWith(request, param1, param2);
    expect(resRequest).toStrictEqual(<DBResponseCreateModel>{
      newId: 5,
    });
  });
});

// Test de la requête sur la mise à jour de données
describe('AbstractDB > update', () => {
  const testDB: TestDB = new TestDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.clearAllMocks();
  });

  // Renvoie aucune ligne de modifiée
  it('> Renvoie aucune ligne de modifiée', () => {
    const request: string = 'UPDATE ...';
    mockExecRequest.mockReturnValue({
      changes: 0,
    });

    const resRequest: undefined | FakeModel = testDB['update'](request);

    expect(mockExecRequest).toHaveBeenCalledWith(request);
    expect(resRequest).toStrictEqual(<DBResponseUpdateModel>{
      nbUpdateLine: 0,
    });
  });

  it('> Renvoie plusieurs lignes modifiées', () => {
    const request: string = 'UPDATE ...';
    const param1: string = 'param1';
    const param2: string = 'param2';
    mockExecRequest.mockReturnValue({
      changes: 5,
    });

    const resRequest: undefined | FakeModel = testDB['update'](
      request,
      param1,
      param2
    );

    expect(mockExecRequest).toHaveBeenCalledWith(request, param1, param2);
    expect(resRequest).toStrictEqual(<DBResponseUpdateModel>{
      nbUpdateLine: 5,
    });
  });
});

// Test de la requête sur la suppression de données
describe('AbstractDB > delete', () => {
  const testDB: TestDB = new TestDB();

  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.clearAllMocks();
  });

  // Renvoie aucune ligne de supprimée
  it('> Renvoie aucune ligne de modifiée', () => {
    const request: string = 'DELETE ...';
    mockExecRequest.mockReturnValue({
      changes: 0,
    });

    const resRequest: undefined | FakeModel = testDB['delete'](request);

    expect(mockExecRequest).toHaveBeenCalledWith(request);
    expect(resRequest).toStrictEqual(<DBResponseDeleteModel>{
      nbDeleteLine: 0,
    });
  });

  it('> Renvoie plusieurs lignes supprimée', () => {
    const request: string = 'DELETE ...';
    const param1: string = 'param1';
    const param2: string = 'param2';
    mockExecRequest.mockReturnValue({
      changes: 5,
    });

    const resRequest: undefined | FakeModel = testDB['delete'](
      request,
      param1,
      param2
    );

    expect(mockExecRequest).toHaveBeenCalledWith(request, param1, param2);
    expect(resRequest).toStrictEqual(<DBResponseDeleteModel>{
      nbDeleteLine: 5,
    });
  });
});
