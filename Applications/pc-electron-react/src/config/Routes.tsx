import PatientsPage from '@/pages/PatientsPage';
import ExercisesPage from '@/pages/ExercisesPage';
import PatientDetailsPage from '@/pages/PatientDetailsPage';
import ExerciseDetailsPage from '@/pages/ExerciseDetailsPage';
import SettingsPage from '@/pages/SettingsPage';
import { Book, Brain, Home, Settings, UsersRound } from 'lucide-react';
import DashboardPage from '@/pages/DashboardPage';
import { SessionDetailsPage } from '@/pages/SessionDetailsPage';
import { LibraryPage } from '@/pages/LibraryPage';

// Configuration des routes de l'application
export const ROUTES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: <Home />,
    path: '/dashboard',
    component: <DashboardPage />,
    showInSidebar: false,
  },
  {
    id: 'patients',
    name: 'Patients',
    icon: <UsersRound />,
    path: '/patients',
    component: <PatientsPage />,
    showInSidebar: true,
  },
  {
    id: 'patient',
    name: 'Patient',
    icon: <UsersRound />,
    path: '/patients/:patientId',
    component: <PatientDetailsPage />,
    showInSidebar: false,
  },
  {
    id: 'session',
    name: 'Séance',
    icon: <UsersRound />,
    path: '/patients/:patientId/sessions/:sessionId/:exoMode',
    component: <SessionDetailsPage />,
    showInSidebar: false,
  },
  {
    id: 'exercises',
    name: 'Exercices',
    icon: <Brain />,
    path: '/exercises',
    component: <ExercisesPage />,
    showInSidebar: true,
  },
  {
    id: 'exercise',
    name: 'Exercice',
    icon: <Brain />,
    path: '/exercises/:exerciseId',
    component: <ExerciseDetailsPage />,
    showInSidebar: false,
  },
  {
    id: 'library',
    name: 'Bibliothèque',
    icon: <Book />,
    path: '/library',
    component: <LibraryPage />,
    showInSidebar: true,
  },
  {
    id: 'settings',
    name: 'Paramètres',
    icon: <Settings />,
    path: '/settings',
    component: <SettingsPage />,
    showInSidebar: true,
  },
] as const;

// Type pour un identifiant de route
export type RouteId = (typeof ROUTES)[number]['id'];

// Type pour une route
export type Route = (typeof ROUTES)[number];
