import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LogsManager } from '@shared/utils/LogsManager';

describe('LogsManager', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // --- getLogWithColor ---

  describe('getLogWithColor', () => {
    it('> Retourne un texte avec la couleur demandée', () => {
      const result = LogsManager['getLogWithColor']('TEST', 'bgRed');
      expect(result).toBe('\x1b[41mTEST\x1b[0m');
    });

    it('> Utilise bien la couleur fgGreen', () => {
      const result = LogsManager['getLogWithColor']('OK', 'fgGreen');
      expect(result).toBe('\x1b[32mOK\x1b[0m');
    });
  });

  // --- GROUP ---

  describe('createGroup', () => {
    it('> Appelle console.group avec le bon format', () => {
      const spy = vi.spyOn(console, 'group').mockImplementation(() => {});
      LogsManager.createGroup('MyClass', 'myFunction');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toContain('MyClass > myFunction');
    });
  });

  describe('endGroup', () => {
    it('> Appelle console.groupEnd', () => {
      const spy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
      LogsManager.endGroup();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  // --- LOG TEXTE ---

  describe('log methods', () => {
    it('> logError appelle console.log avec ERROR', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      LogsManager.logError('Une erreur');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toContain('ERROR');
      expect(spy.mock.calls[0][0]).toContain('Une erreur');
    });

    it('> logWarning appelle console.log avec WARNING', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      LogsManager.logWarning('Attention');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toContain('WARNING');
    });

    it('> logSuccess appelle console.log avec SUCCESS', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      LogsManager.logSuccess('Succès');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toContain('SUCCESS');
    });

    it('> logInfo appelle console.log avec INFO', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      LogsManager.logInfo('Information');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toContain('INFO');
    });
  });
});
