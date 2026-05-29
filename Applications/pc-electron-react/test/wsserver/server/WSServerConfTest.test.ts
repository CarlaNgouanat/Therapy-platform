import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WSServerConf } from '@wsserver/server/WSServerConf';

// Mock des fonctions pour espionner les appels
const { mockNetwork } = vi.hoisted(() => ({
  mockNetwork: vi.fn(),
}));

// Mock node:os
vi.mock('node:os', () => ({
  default: {
    networkInterfaces: mockNetwork,
  },
}));

// Test de la fonction de renvoie de l'adresse IP
describe('WSServerConf > getIp', () => {
  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.resetAllMocks();
  });

  // Test du renvoie de l'adresse IP de la carte si IPv4 et external
  it("> Test du renvoie de l'adresse IP de la carte si IPv4 et external", () => {
    // Mock des données de la carte réseau
    mockNetwork.mockReturnValue({
      eth0: [
        {
          address: '192.168.1.10',
          family: 'IPv4',
          internal: false,
          netmask: '255.255.255.0',
          cidr: null,
          mac: '00:00:00:00:00:00',
        },
      ],
    });

    // Test du renvoie de l'adresse IP
    const conf = new WSServerConf();
    expect(conf.getIp()).toBe('192.168.1.10');
  });

  // Test du renvoie de l'adresse IP par défaut avec aucune carte
  it("> Test du renvoie de l'adresse IP par défaut avec aucune carte", () => {
    // Mock des données de la carte réseau
    mockNetwork.mockReturnValue({
      eth0: undefined,
    });

    // Test du renvoie de l'adresse IP
    const conf = new WSServerConf();
    expect(conf.getIp()).toBe('127.0.0.1');
  });

  // Test du renvoie de l'adresse IP stockée dans WSServerConf si IPv4 et internal
  it("> Test du renvoie de l'adresse IP stockée dans WSServerConf si IPv4 et internal", () => {
    // Mock des données de la carte réseau
    mockNetwork.mockReturnValue({
      lo: [
        {
          address: '127.0.0.5',
          family: 'IPv4',
          internal: true,
          netmask: '255.0.0.0',
          cidr: null,
          mac: '00:00:00:00:00:00',
        },
      ],
    });

    // Test du renvoie de l'adresse IP
    const conf = new WSServerConf();
    expect(conf.getIp()).toBe('127.0.0.1');
  });
});

// Test de la fonction de renvoie du port
describe('WSServerConf > getPort', () => {
  // À exécuter avant chaque test
  beforeEach(() => {
    // Réinitialisation des données
    vi.resetAllMocks();
  });

  // Vérification du renvoie du port stockée dans la configuration
  it('> Test du renvoie du port par défaut', () => {
    // Test du renvoie du port
    const conf = new WSServerConf();
    expect(conf.getPort()).toBe('4933');
  });
});
