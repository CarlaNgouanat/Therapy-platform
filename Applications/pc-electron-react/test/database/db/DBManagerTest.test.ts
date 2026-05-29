import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs';
import { DBManager } from '@database/db/DBManager';
import { LogsManager } from '@shared/utils/LogsManager';
import { InterestTable } from '@database/tables/InterestTable';
import { InterestMapper } from '@database/mappers/InterestMapper';
import { InterestModel } from '@shared/models/InterestModel';

// Données de test
const interest1: InterestTable = {
  id: 1,
  name: 'abc',
  created_at: '2024-12-31 23:59:59',
};
const interest2: InterestTable = {
  id: 2,
  name: 'def',
  created_at: '2024-12-30 23:59:59',
};
const interest3: InterestTable = {
  id: 3,
  name: 'ghi',
  created_at: '2024-12-29 23:59:59',
};

// Mock des fonctions du driver de BetterSQlite3
const mockRun = vi.fn();
const mockGet = vi.fn().mockReturnValue(interest1);
const mockAll = vi.fn().mockReturnValue([interest1, interest2, interest3]);
const mockPrepare = vi.fn(() => ({
  run: mockRun,
  get: mockGet,
  all: mockAll,
}));
const mockExec = vi.fn();
const mockPragma = vi.fn();
const mockClose = vi.fn();

const mockDB = {
  pragma: mockPragma,
  prepare: mockPrepare,
  exec: mockExec,
  close: mockClose,
};

// Mock Electron
vi.mock('electron', () => {
  return {
    app: {
      getPath: () => '/',
    },
  };
});

// Mock Logs
vi.mock('@shared/utils/LogsManager');

// Mock fs
vi.mock('node:fs');

// Mock better-sqlite3
vi.mock('better-sqlite3', () => {
  return {
    default: vi.fn(function () {
      return mockDB;
    }),
  };
});

// Vérification sur la récupération de l'instance du singleton
describe('DBManager > getInstance', () => {
  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.clearAllMocks();
    DBManager['instance'] = null;
  });

  // On vérifie si on récupère toujours la même instance de la classe quand on appelle DBManager.getInstance()
  it('> Renvoie toujours la même instance', () => {
    const instance1: DBManager = DBManager.getInstance();
    const instance2: DBManager = DBManager.getInstance();

    expect(instance1).toBe(instance2);
  });
});

// Vérification sur le lancement de la base de données
describe('DBManager > openDB', () => {
  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.clearAllMocks();
    DBManager['instance'] = null;
  });

  // Création d'une nouvelle connexion s'il n'existe pas
  it("> Ouvre la connexion si elle n'existe pas", () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue('CREATE TABLE test');

    const manager: DBManager = DBManager.getInstance();
    manager.openDB();

    expect(mockPragma).toHaveBeenCalledWith('journal_mode = WAL');
    expect(fs.readFileSync).toHaveBeenCalled();
  });

  // Vérification de l'affichage du warning lorsqu'on essaye de créer une connexion déjà créée
  it('> Ne rouvre pas la DB si elle est déjà ouverte', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue('CREATE TABLE test');

    const manager: DBManager = DBManager.getInstance();

    manager.openDB();
    manager.openDB();

    expect(LogsManager.logWarning).toHaveBeenCalledWith(
      'La connexion a déjà été établie'
    );
  });

  // Vérification sur le renvoie d'une erreur si le fichier d'initialisation n'est pas trouvé
  it('> Ne rouvre pas la DB si elle est déjà ouverte', () => {
    vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('ENOENT');
    });

    const manager: DBManager = DBManager.getInstance();
    expect(() => {
      manager.openDB();
    }).toThrow();
  });
});

// Vérification sur la fermeture de la connexion vers la base de données
describe('DBManager > closeDB', () => {
  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.clearAllMocks();
    DBManager['instance'] = null;
  });

  // Fermerture de la connexion
  it('> Ferme la connexion', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue('CREATE TABLE test');

    const manager: DBManager = DBManager.getInstance();

    manager.openDB();
    manager.closeDB();

    expect(mockClose).toHaveBeenCalled();
  });

  // Vérification de l'affichage du warning lorsqu'on essaye de fermer une connexion déjà fermée
  it('> Ne refermer pas la DB si elle est déjà fermée', () => {
    const manager: DBManager = DBManager.getInstance();
    manager.closeDB();

    expect(LogsManager.logWarning).toHaveBeenCalledWith(
      'La connexion est déjà fermée'
    );
  });
});

// Vérification sur l'exécution d'une requête
describe('DBManager > execScript', () => {
  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.clearAllMocks();
    DBManager['instance'] = null;
  });

  // Lancement d'un ensemble de requêtes et vérification des appels
  it('> Exécute un ensemble de requêtes', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue('CREATE TABLE test');

    const manager = DBManager.getInstance();

    manager.openDB();
    manager.execScript('INSERT INTO test VALUES (?); SELECT * from test;');

    expect(mockExec).toHaveBeenCalledWith(
      'INSERT INTO test VALUES (?); SELECT * from test;'
    );
  });

  // Vérification du renvoie d'erreur dans le cas où la connexion est fermée
  it('> Lance une erreur si la DB est fermée', () => {
    const manager: DBManager = DBManager.getInstance();

    expect(() => {
      manager.execScript('SELECT 1');
    }).toThrow();
  });
});

// Vérification sur l'exécution d'une requête
describe('DBManager > execRequest', () => {
  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.clearAllMocks();
    DBManager['instance'] = null;
  });

  // Lancement d'une requête et vérification des appels
  it('> Exécute une requête', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue('CREATE TABLE test');

    const manager = DBManager.getInstance();

    manager.openDB();
    manager.execRequest('INSERT INTO test VALUES (?)', 1);

    expect(mockRun).toHaveBeenCalledWith(1);
  });

  // Vérification du renvoie d'erreur dans le cas où la connexion est fermée
  it('> Lance une erreur si la DB est fermée', () => {
    const manager: DBManager = DBManager.getInstance();

    expect(() => {
      manager.execRequest('SELECT 1');
    }).toThrow();
  });
});

// Vérification sur l'exécution d'une requête renvoyant une donnée
describe('DBManager > getRequest', () => {
  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.clearAllMocks();
    DBManager['instance'] = null;
  });

  // Vérification du cas où le get renvoie un modèle
  it('> Renvoie un modèle via le mapper', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue('CREATE TABLE test');

    const manager: DBManager = DBManager.getInstance();
    manager.openDB();

    const result: InterestModel | undefined = manager.getRequest(
      InterestMapper,
      'SELECT * FROM test'
    );

    expect(result).toStrictEqual({
      id: 1,
      name: 'abc',
      createdAt: new Date(2024, 11, 31, 23, 59, 59),
    });
  });

  // Vérification du cas où le get renvoie undefined
  it('> Renvoie undefined via le mapper', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue('CREATE TABLE test');
    mockGet.mockReturnValue(undefined);

    const manager: DBManager = DBManager.getInstance();
    manager.openDB();

    const result: InterestModel | undefined = manager.getRequest(
      InterestMapper,
      'SELECT * FROM test'
    );

    expect(result).toStrictEqual(undefined);
  });

  // Vérification du renvoie d'erreur dans le cas où la connexion est fermée
  it('> Lance une erreur si la DB est fermée', () => {
    const manager: DBManager = DBManager.getInstance();

    expect(() => {
      manager.getRequest(InterestMapper, 'SELECT * FROM test');
    }).toThrow();
  });
});

// Vérification sur l'exécution d'une requête renvoyant plusieurs données
describe('DBManager > getAllRequest', () => {
  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.clearAllMocks();
    DBManager['instance'] = null;
  });

  // Vérification du renvoie de plusieurs données mappées via le all
  it('> Renvoie plusieurs models', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue('CREATE TABLE test');

    const manager = DBManager.getInstance();
    manager.openDB();

    const result = manager.getAllRequest(InterestMapper, 'SELECT * FROM test');

    expect(result.length).toBe(3);
    expect(result[0].id).toBe(1);
  });

  // Vérification du renvoie d'erreur dans le cas où la connexion est fermée
  it('> Lance une erreur si la DB est fermée', () => {
    const manager: DBManager = DBManager.getInstance();

    expect(() => {
      manager.getAllRequest(InterestMapper, 'SELECT * FROM test');
    }).toThrow();
  });
});
