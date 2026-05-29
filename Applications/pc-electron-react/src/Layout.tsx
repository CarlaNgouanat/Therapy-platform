// Base
import React, { useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
  Outlet,
  NavigateFunction,
  Location,
} from 'react-router';
// Importation des routes de la sidebar
// Composants shadcn/ui
import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarComponent } from '@/components/SidebarComponent';
// Icônes
import { ArrowLeftIcon } from 'lucide-react';
import { SIDEBAR_ROUTES } from '@/config/RoutesSidebar';
import { useActiveSession } from '@/contexts/UseActiveSession';
import ActiveSessionDialog from './components/activeSession/ActiveSessionDialog';
import { RoutesManager } from './utils/RoutesManager';
import { BindIdManager } from './utils/BindIdManager';

// --- NAVIGATION ---

/**
 * Navigation vers une page session
 * @param navigate Objet de navigation
 * @param patientId Identifiant du patient
 * @param sessionId Identifiant de la session
 */
function navigateSession(
  navigate: NavigateFunction,
  patientId: string,
  sessionId: string
) {
  // Navigation vers la nouvelle page
  const path: string | null = RoutesManager.navigateTo(
    'session',
    patientId,
    sessionId,
    'IN_PROGRESS'
  );
  if (path !== null) {
    navigate(path);
  }
  // TODO : gérer le cas où path == null
}

// --- COMPOSANT ---

/**
 * Disposition générale de l'application avec la sidebar à gauche et le contenu à droite (ainsi qu'un header pour un bouton retour lorsque nécessaire)
 * @returns Renvoie un composant
 */
export default function Layout(): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager('Layout');

  // --- LOCATION/NAVIGATION ---
  const location: Location<unknown> = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const {
    activeSession,
    loading,
    startupPromptHandled,
    markStartupPromptHandled,
  } = useActiveSession();

  // --- DIALOG ---
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);

  // --- DISPOSITION ET RETOUR ---

  // Vérification si la page courante est une des pages de base de la sidebar
  const isMainPage =
    SIDEBAR_ROUTES.some((page) => page.path === location.pathname) ||
    location.pathname === '/' ||
    location.pathname === '/dashboard';

  // Gestion du bouton retour
  const handleBack = () => {
    navigate(-1);
  };

  // --- USEFFECT ---

  // Au démarrage de l'application, on vérifie si on doit afficher la pop up de reprise de séance
  useEffect(() => {
    if (!loading && !startupPromptHandled) {
      if (activeSession) {
        setIsResumeDialogOpen(true);
      } else {
        markStartupPromptHandled();
      }
    }
  }, [
    loading,
    startupPromptHandled,
    activeSession,
    markStartupPromptHandled,
    setIsResumeDialogOpen,
  ]);

  // --- COMPOSANT ---
  return (
    <>
      <SidebarProvider id={bindId.bindId(1, 'ActiveSessionDialog')}>
        <SidebarComponent />
        <main
          id={bindId.bindId(2, 'MainInterface')}
          className="flex-1 overflow-hidden flex flex-col h-screen"
        >
          <div
            id={bindId.bindId(3, 'Container')}
            className="flex items-center gap-4 px-4 pt-4 shrink-0"
          >
            {!isMainPage && (
              <div
                id={bindId.bindId(4, 'BackContainer')}
                className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleBack}
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                <p id={bindId.bindId(5, 'Text')}>Retour</p>
              </div>
            )}
          </div>
          <div
            id={bindId.bindId(3, 'Page')}
            className="flex-1 overflow-auto p-4"
          >
            <Outlet />
          </div>
        </main>
      </SidebarProvider>

      <ActiveSessionDialog
        id={bindId.bindId(1, 'ActiveSessionDialog')}
        isOpen={isResumeDialogOpen}
        onClose={() => {
          markStartupPromptHandled();
          setIsResumeDialogOpen(false);
        }}
        onNavigate={(patientId: string, sessionId: string) => {
          if (patientId !== '' && sessionId !== '')
            navigateSession(navigate, patientId, sessionId);
          markStartupPromptHandled();
          setIsResumeDialogOpen(false);
        }}
        activeSession={activeSession}
      />
    </>
  );
}
