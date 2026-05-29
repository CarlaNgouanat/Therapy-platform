// Base
import React from 'react';
import ReactDOM from 'react-dom/client';
// Contextes
// Importat de l'application et de la feuille de style principale
import App from '@/App';
import '@/index.css';
import { WebSocketProvider } from '@/contexts/WebSocketProvider';
import { ActiveSessionProvider } from './contexts/ActiveSessionProvider';

// Rendu de l'application React dans l'élément HTML avec l'identifiant 'root'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebSocketProvider>
      <ActiveSessionProvider>
        <App />
      </ActiveSessionProvider>
    </WebSocketProvider>
  </React.StrictMode>
);
