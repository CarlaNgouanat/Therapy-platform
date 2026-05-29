import { IsAliveWebSocket } from '@wsserver/utils/IsAliveWebSocket';
import { describe, expect, it, vi } from 'vitest';

vi.mock('ws', () => {
  return {
    WebSocket: vi.fn(),
  };
});

// Test du mapper de isAliveWebSocket
describe('isAliveWebSocket', () => {
  // Liste des données à tester
  const isAliveWebSocket: IsAliveWebSocket = new IsAliveWebSocket(null);

  // Test des valeurs par défaut
  it('> Valeur par défaut de IsAliveWebSocket', () => {
    expect(isAliveWebSocket.isAlive).toBeFalsy();
    expect(isAliveWebSocket.id).toBe(-1);
  });
});
