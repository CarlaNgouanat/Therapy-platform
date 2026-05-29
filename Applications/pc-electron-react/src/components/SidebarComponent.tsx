import { WifiOff, Wifi, CircleDotIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QRCode } from '@/components/ui/shadcn-io/qr-code';

import {
  useNavigate,
  useLocation,
  NavigateFunction,
  Location,
} from 'react-router';
import React, { useEffect, useState } from 'react';
import { SIDEBAR_ROUTES } from '@/config/RoutesSidebar';
import { useWebSocket } from '@/contexts/UseWebSocket';
import { useActiveSession } from '@/contexts/UseActiveSession';
import { Route } from '@/config/Routes';
import { WSContextType } from '@shared/types/WSContextType';
import icon from '@/assets/logo.png';
import { BindIdManager } from '@/utils/BindIdManager';
import { RoutesManager } from '@/utils/RoutesManager';

// --- FONCTIONS ---

/**
 * Vérification si le lien donné est actif (correspond au chemin actuel)
 * @param location
 * @param url
 * @returns Renvoie un booléen
 */
function isActive(location: Location, url: string): boolean {
  const path: string =
    location?.pathname ??
    (typeof window !== 'undefined' ? window.location.pathname : '');
  return path === url || (url !== '/' && path.startsWith(url));
}

/**
 * Récupère les données du serveur de socket
 * @returns Renvoie les données sous la forme d'un tableau
 */
async function getServerData(): Promise<string[]> {
  return [
    await window.electronAPI.serverConfGetIp(),
    await window.electronAPI.serverConfGetPort(),
  ];
}

// --- COMPOSANT ---

/**
 * Barre latérale de navigation de l'application
 * @returns Renvoie le compoasnt
 */
export function SidebarComponent() {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager('SidebarComponent');

  // --- NAVIGATION ---
  const iconRedirection: string | null = RoutesManager.navigateTo('dashboard');
  const navigate: NavigateFunction = useNavigate();
  const location: Location<unknown> = useLocation();

  // --- WEBSOCKET ET TABLETTE ---
  const webSocket: WSContextType = useWebSocket();
  const { activeSession } = useActiveSession();
  const [ip, setIp] = useState<string>();
  const [port, setPort] = useState<string>();

  // Au chargement, récupération de la liste
  useEffect(() => {
    getServerData().then(([ip, port]) => {
      (setIp(ip), setPort(port));
    });
  }, []);

  // Information de la tablette
  const tabletConnected: boolean = webSocket.tabletConnected;

  // --- VARIABLES ---
  // État de la sidebar pour gérer l'affichage quand expanded ou collapsed
  const { state } = useSidebar();

  // --- COMPOSANT ---
  return (
    <Sidebar id={bindId.bindId(1, 'Sidebar')} collapsible="icon">
      {/* 1ère partie avec le logo et les icons d'aggrandissement / rétrécissement */}
      <SidebarHeader id={bindId.bindId(2, 'SidebarHeader')}>
        {state === 'expanded' && (
          <div
            id={bindId.bindId(3, 'ExpandContainer')}
            className="flex flex-col"
          >
            <div
              id={bindId.bindId(4, 'SidebarContainer')}
              className="flex justify-end"
            >
              <SidebarTrigger />
            </div>
            <button
              id={bindId.bindId(4, 'ButtonRedirectContainer')}
              onClick={() => {
                if (iconRedirection !== null) navigate(iconRedirection);
              }}
              className="flex justify-center py-4"
            >
              <img
                id={bindId.bindId(5, 'Logo')}
                src={icon}
                alt="Logo DisMesMots"
                className="h-10"
              />
            </button>
          </div>
        )}
        {state === 'collapsed' && (
          <div
            id={bindId.bindId(3, 'CollapseContainer')}
            className="flex justify-center px-4 py-2"
          >
            <SidebarTrigger />
          </div>
        )}
      </SidebarHeader>

      {/* 2ème partie avec la liste des logos */}
      <SidebarContent id={bindId.bindId(2, 'SidebarContent')}>
        <SidebarGroup id={bindId.bindId(3, 'SidebarGroup')}>
          <SidebarGroupContent id={bindId.bindId(4, 'SidebarGroupContent')}>
            <SidebarMenu id={bindId.bindId(5, 'SidebarMenu')}>
              {SIDEBAR_ROUTES.map(
                (page: Route): React.JSX.Element => (
                  <SidebarMenuItem
                    id={bindId.bindId(6, 'SidebarMenuItem')}
                    key={page.id}
                  >
                    <SidebarMenuButton
                      id={bindId.bindId(7, 'SidebarMenuButton')}
                      asChild
                      isActive={isActive(location, page.path)}
                    >
                      <a
                        id={bindId.bindId(8, 'RedirectionLink')}
                        href={page.path}
                        onClick={(
                          e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                        ): void => {
                          e.preventDefault();
                          navigate(page.path);
                        }}
                      >
                        {page.icon}
                        <p id={bindId.bindId(9, 'NameLink')}>{page.name}</p>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 3ème partie avec le bouton sur la session active et le bouton de connexion de la tablette */}
      <SidebarFooter id={bindId.bindId(2, 'SidebarFooter')}>
        <div id={bindId.bindId(3, 'Container')} className="flex flex-col gap-2">
          {/* Section sur la session active */}
          {activeSession && (
            <SidebarMenu id={bindId.bindId(4, 'ActiveSessionContainer')}>
              <SidebarMenuItem id={bindId.bindId(5, 'SidebarMenuItem')}>
                <SidebarMenuButton
                  id={bindId.bindId(6, 'Button')}
                  size="lg"
                  className="w-full justify-start h-auto py-3 border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-900 group-data-[collapsible=icon]:!p-2"
                  onClick={() => {
                    const sessionPath: string | null = RoutesManager.navigateTo(
                      'session',
                      String(activeSession.patientId),
                      String(activeSession.id),
                      'IN_PROGRESS'
                    );
                    if (sessionPath !== null) navigate(sessionPath);
                  }}
                  title="Aller à la séance en cours"
                >
                  <div
                    id={bindId.bindId(7, 'IconContainer')}
                    className="relative flex items-center justify-center"
                  >
                    <div
                      id={bindId.bindId(8, 'IconAnimation')}
                      className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"
                    ></div>
                    <CircleDotIcon
                      id={bindId.bindId(8, 'Icon')}
                      className="relative inline-flex h-4 w-4 text-blue-600"
                    />
                  </div>
                  {state === 'expanded' && (
                    <div
                      id={bindId.bindId(7, 'ExpendedDetailsContainer')}
                      className="flex flex-col gap-0.5 text-left leading-none ml-2"
                    >
                      <span
                        id={bindId.bindId(8, 'SpanSession')}
                        className="font-semibold text-blue-800"
                      >
                        Séance en cours
                      </span>
                      <span
                        id={bindId.bindId(8, 'SpanInfoPatient')}
                        className="text-xs text-blue-700 truncate max-w-[140px]"
                      >
                        {activeSession.patient.firstName}{' '}
                        {activeSession.patient.lastName}
                      </span>
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}

          {/* Section sur la connexion de la tablette */}
          {tabletConnected ? (
            <Button id={bindId.bindId(4, 'ConnectedButton')} className="w-full">
              <Wifi />
              {state === 'expanded' && (
                <span id={bindId.bindId(5, 'Label')}>
                  {webSocket.tabletDeviceName ?? 'Tablette connectée'}
                </span>
              )}
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger id={bindId.bindId(4, 'DisconnectedDialogTrigger')}>
                <Button
                  id={bindId.bindId(5, 'DisconnectedButton')}
                  className="w-full"
                  variant="destructive"
                >
                  <WifiOff />
                  {state === 'expanded' && (
                    <span id={bindId.bindId(6, 'Label')}>
                      Connecter la tablette
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent id={bindId.bindId(4, 'DisconnectedDialogContent')}>
                <DialogHeader id={bindId.bindId(5, 'HeaderSection')}>
                  <DialogTitle
                    id={bindId.bindId(6, 'TitleSection')}
                    className="mx-auto mb-4"
                  >
                    Scannez ce QR code depuis la tablette
                  </DialogTitle>
                  <DialogDescription
                    id={bindId.bindId(6, 'DescriptionSection')}
                  >
                    <QRCode
                      id={bindId.bindId(7, 'QrCode')}
                      className="size-48 rounded border bg-white p-4 shadow-xs mx-auto"
                      data={`${ip}:${port}`}
                    />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
