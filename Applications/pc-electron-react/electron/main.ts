import { app, BrowserWindow } from 'electron';

// Force l'utilisation du français (ignoré si app déjà prête)
app.commandLine.appendSwitch('lang', 'fr');

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { DBManager } from '@database/db/DBManager.ts';
import { WSServer } from '@wsserver/server/WSServer';
import { DevMockData } from '@database/mocks/DevMockData';
import { LogsManager } from '@shared/utils/LogsManager';
import { IpcMainManager } from '@electron/utils/IpcMainManager';
import ipcServer from '@electron/utils/data/IpcServer';
import ipcDB from './utils/data/IpcDB';
import ipcSendServices from './utils/data/IpcSendServices';

//  Lancement de l'application
LogsManager.createGroup('Main', '.');
LogsManager.logInfo("Lancement de l'application PC");

// --- VARIABLES ---

/**
 * Liste des liens utiles :
 * - __dirname : Dossier où se trouve le fichier main.js
 * - process.env.APP_ROOT : Racine du projet
 * - VITE_DEV_SERVER_URL : URL du localhost où est lancé l'application en mode développement
 * - MAIN_DIST : Dossier dist-electron
 * - RENDERER_DIST : Dossier dist
 * - process.env.VITE_PUBLIC : Dossier public
 */
LogsManager.logInfo("Définition des paramètres générales de l'application");
const dBManager: DBManager = DBManager.getInstance();
const __dirname: string = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, '..');
export const VITE_DEV_SERVER_URL: string | undefined =
  process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST: string = path.join(
  process.env.APP_ROOT,
  'dist-electron'
);
export const RENDERER_DIST: string = path.join(process.env.APP_ROOT, 'dist');
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

app.setName('DisMesMots');

// Variable représentant la fenêtre
let win: BrowserWindow | null;
const wsserver: WSServer = WSServer.getInstance();

// --- FENÊTRE ---

// Création de la fenêtre
function createWindow() {
  LogsManager.createGroup('Main', 'createWindow');

  // Icons
  LogsManager.logInfo('Définition des icones');
  const iconPath = path.join(process.env.VITE_PUBLIC!, 'icon.png');

  // Sur macOS, définir l'icône du dock
  if (process.platform === 'darwin') {
    app.dock!.setIcon(iconPath);
  }

  // Définition des paramètres de la fenêtre
  LogsManager.logInfo('Définition des dimensions de la page');
  win = new BrowserWindow({
    icon: iconPath,
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  // Si le projet est lancé en mode développeur, utilisation de l'url VITE_DEV_SERVER_URL
  // Sinon, lancement de l'application en mode production
  if (VITE_DEV_SERVER_URL) {
    LogsManager.logInfo('Chargement des données du src');
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    LogsManager.logInfo('Chargement des données du dist');
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  LogsManager.logSuccess("L'application a été créée avec succès");
  LogsManager.endGroup();
}

// Gestion lorsque toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  LogsManager.createGroup('Main', 'event > window-all-closed');

  if (process.platform !== 'darwin') {
    LogsManager.logInfo('Fermeture des services');
    wsserver.stopWebSocketServer(); // Arret du serveur WebSocket
    dBManager.closeDB(); // Fermeture de la base de données
    app.quit(); // Fermeture de l'application
    win = null; // Suppression de la référence à la fenêtre
    LogsManager.logSuccess("L'application a été fermée avec succès");
  } else {
    const error: string = "Impossible de fermer l'application";
    LogsManager.logError(error);
    throw new Error(error);
  }
  LogsManager.endGroup();
});

// Gestion lorsque l'application est activée
app.on('activate', () => {
  LogsManager.createGroup('Main', 'event > activate');

  // Sur macOS, il est courant de recréer une fenêtre dans l'application lorsque
  // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres ouvertes.
  if (BrowserWindow.getAllWindows().length === 0) {
    LogsManager.logInfo("Création de l'interface");
    createWindow();
  } else {
    LogsManager.logWarning("L'application est déjà ouverte");
  }
  LogsManager.endGroup();
});

// Gestion lorsque l'application est prête
app.whenReady().then(() => {
  LogsManager.createGroup('Main', 'app > whenReady');

  // IPC Manager
  LogsManager.logInfo("Définition des fonctions à sauvegarder dans l'IPC");
  const ipcManager: IpcMainManager = new IpcMainManager();

  LogsManager.logInfo(
    "Définition des fonctions de la DB à sauvegarder dans l'IPC"
  );
  ipcManager.saveFunctionsInIpcHandleDB(ipcDB);

  LogsManager.logInfo(
    "Définition des fonctions du serveur à sauvegarder dans l'IPC"
  );
  ipcManager.saveFunctionsInIpcHandleServer(ipcServer);

  LogsManager.logInfo(
    "Définition des fonctions websocket (envoie) à sauvegarder dans l'IPC"
  );
  ipcManager.saveFunctionsInIpcHandleSendServices(ipcSendServices);

  // Initialisation de la base de données
  LogsManager.logInfo('Connexion avec la base de données');
  dBManager.openDB();

  // Seed test exercises in development mode
  if (VITE_DEV_SERVER_URL) {
    LogsManager.logInfo(
      'Sauvegarde des données de tests dans la base de données (mock)'
    );
    DevMockData.seedTestExercises();
  }

  // Lancement du serveur WebSocket
  LogsManager.logInfo('Lancement du serveur de socket');
  wsserver.startWebSocketServer();

  // Création de la fenêtre
  LogsManager.logInfo('Création de la fenêtre');
  createWindow();

  // Register lifecycle events (tablet connect/disconnect, ACK)
  ipcManager.registerLifecycleEvents(win);

  LogsManager.logSuccess("L'application a été lancée avec succès");
  LogsManager.endGroup();
});
LogsManager.endGroup();
