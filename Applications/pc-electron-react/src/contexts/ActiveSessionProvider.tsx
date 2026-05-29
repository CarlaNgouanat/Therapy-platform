import React, { useCallback, useEffect, useState } from 'react';
import { ActiveSessionPatientModel } from '@shared/models/ActiveSessionPatientModel';
import { SessionModel } from '@shared/models/SessionModel';
import { IsActiveSessionModel } from '@shared/models/IsActiveSessionModel';
import { ActiveSessionContext } from '@/contexts/ActiveSessionContext';

/**
 * Composant sur la session active
 * @param children Contenu de la page **en lecture uniquement**
 */
export const ActiveSessionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}): React.JSX.Element => {
  // --- DATA ---
  const [activeSession, setActiveSession] =
    useState<ActiveSessionPatientModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [startupPromptHandled, setStartupPromptHandled] = useState(false);

  /**
   * --- FONCTION DE CALLBACK ---
   * Le mot-clé callback est une surcouche autour d'une fonction qui permet de la transmettre au reste de l'application sans qu'elle soit redéfinit à cause de render
   */

  // Foncion sur la mise à jour de la session active
  const refreshActiveSession = useCallback(async () => {
    // On recherche s'il exsite déjà une session active
    const isActive: IsActiveSessionModel =
      await window.electronAPI.sessionIsActivePatient();

    // Récupération de la session concernée
    let current: ActiveSessionPatientModel | null = null;
    if (isActive.isActive) {
      current = await window.electronAPI.sessionGetActivePatient();
      setActiveSession(current);
    } else {
      setActiveSession(null);
    }
    return current;
  }, []);

  // Fonction sur le lancement d'une nouvelles session
  const startSession = useCallback(
    async (session: SessionModel) => {
      await window.electronAPI.sessionStartSession(session);
      await refreshActiveSession();
    },
    [refreshActiveSession]
  );

  // ?
  const markStartupPromptHandled = useCallback(() => {
    setStartupPromptHandled(true);
  }, []);

  // --- USEEFFECT---

  // Recherche d'une session active dès le lancement de l'application
  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      if (mounted) {
        await refreshActiveSession();
        setLoading(false);
      }
    };

    hydrate();
    return () => {
      mounted = false;
    };
  }, [refreshActiveSession]);

  // --- COMPOSANT ---
  return (
    <ActiveSessionContext.Provider
      value={{
        activeSession,
        loading,
        startupPromptHandled,
        markStartupPromptHandled,
        refreshActiveSession,
        startSession,
      }}
    >
      {children}
    </ActiveSessionContext.Provider>
  );
};
