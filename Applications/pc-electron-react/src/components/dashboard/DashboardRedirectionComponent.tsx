import { BindIdManager } from '@/utils/BindIdManager';
import React from 'react';

// Interface avec les données requises
export interface DashboardComponentInterface {
  id: string;
  title: string;
  text: string;
  icons: JSX.Element;
  redirection: () => void;
}

/**
 * Composant représentant un bouton de redirection du dashboard
 * @param dashboardData Données nécessaire pour afficher un bouton
 * @returns Renvoie un composant DashboardRedirectionComponent
 */
export function DashboardRedirectionComponent(
  dashboardData: DashboardComponentInterface
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dashboardData.id + 'DashboardRedirectionComponent'
  );

  // --- COMPOSANT ---
  return (
    <button
      id={bindId.bindId(1, 'BbuttonRedirection')}
      onClick={() => dashboardData.redirection()}
      className="w-full bg-white px-4 py-5 shadow-sm rounded-lg"
    >
      <div
        id={bindId.bindId(2, 'Container')}
        className="w-full grid grid-cols-[64px_1fr] gap-6 flex items-center align-center"
      >
        <div id={bindId.bindId(3, 'IconsContainer')} className="w-16 h-16">
          {dashboardData.icons}
        </div>
        <div
          id={bindId.bindId(3, 'TextContainer')}
          className="w-full flex flex-col gap-4"
        >
          <h1 id={bindId.bindId(4, 'Title')} className="text-2xl text-left">
            {dashboardData.title}
          </h1>
          <p id={bindId.bindId(4, 'Text')} className="text-xl text-left">
            {dashboardData.text}
          </p>
        </div>
      </div>
    </button>
  );
}
