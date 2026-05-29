// Base
import {
  DashboardComponentInterface,
  DashboardRedirectionComponent,
} from '@/components/dashboard/DashboardRedirectionComponent';
import { PageHeader } from '@/components/PageHeader';
import { BindIdManager } from '@/utils/BindIdManager';
import { RoutesManager } from '@/utils/RoutesManager';
import { Book, Brain, Settings, Users } from 'lucide-react';
import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router';

/**
 * Page d'affichage la page d'acceuil
 * @returns Renvoie un composant
 */
export default function DashboardPage(): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager('DashboardPage');

  // --- NAVIGATION ---
  const navigate: NavigateFunction = useNavigate();
  const patientRedirect: string | null = RoutesManager.navigateTo('patients');
  const exercisesRedirect: string | null =
    RoutesManager.navigateTo('exercises');
  const libraryRedirect: string | null = RoutesManager.navigateTo('library');
  const settingsRedirect: string | null = RoutesManager.navigateTo('settings');
  // TODO : gérer le cas où path == null

  const listRedirection: DashboardComponentInterface[] = [
    {
      id: 'patientComponent',
      title: 'Gérer les patients et leurs séances',
      text: 'Créer un nouveau patient, consulter ou modifier son profil et organiser des séances',
      redirection: () => {
        if (patientRedirect !== null) navigate(patientRedirect);
      },
      icons: <Users className="w-full h-full" />,
    },
    {
      id: 'exercisesComponent',
      title: 'Gérer les exercices',
      text: 'Créer et personnaliser des exercices adaptés aux besoins des patients',
      redirection: () => {
        if (exercisesRedirect !== null) navigate(exercisesRedirect);
      },
      icons: <Brain className="w-full h-full" />,
    },
    {
      id: 'libraryComponent',
      title: 'Accéder aux ressources ',
      text: 'Consulter et ajouter des mots, des images et des sons ',
      redirection: () => {
        if (libraryRedirect !== null) navigate(libraryRedirect);
      },
      icons: <Book className="w-full h-full" />,
    },
    {
      id: 'settingsComponent',
      title: 'Accéder au profil',
      text: 'Gérer vos informations personnelles et vos données  ',
      redirection: () => {
        if (settingsRedirect !== null) navigate(settingsRedirect);
      },
      icons: <Settings className="w-full h-full" />,
    },

    // TODO : WIFI Section
  ];

  // --- COMPOSANT ---
  return (
    <div
      id={bindId.bindId(1, 'PageContainer')}
      className="h-full flex flex-col gap-6"
    >
      <PageHeader
        title={
          <>
            <span>Bienvenue sur </span>
            <span className="text-[#1880D9]">DisMes</span>
            <span className="text-[#04B84A]">Mots</span>
          </>
        }
        subtitle="Application d’accompagnement des séances d’orthophonie"
      />

      <div
        id={bindId.bindId(2, 'StartingContainer')}
        className="flex flex-col gap-[24px]"
      >
        <h3 id={bindId.bindId(3, 'Title')} className="text-2xl font-bold">
          Comment démarrer ?
        </h3>
        {listRedirection.map((section: DashboardComponentInterface) => (
          <DashboardRedirectionComponent
            key={section.id}
            id={bindId.bindId(3, section.id)}
            title={section.title}
            text={section.text}
            redirection={section.redirection}
            icons={section.icons}
          />
        ))}
      </div>
    </div>
  );
}
