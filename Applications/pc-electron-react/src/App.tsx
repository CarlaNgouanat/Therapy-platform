// Base
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import Layout from '@/Layout';
import { ROUTES } from '@/config/Routes';

// Configuration du routeur avec createBrowserRouter (Data Router requis pour useBlocker)
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      ...ROUTES.map((route) => ({
        path: route.path,
        element: route.component,
      })),
    ],
  },
]);

// Composant principal de l'application
function App(): React.JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
