# Liste des types

Les types structures les données utilisées dans l'application. Dans ce dossier, ces types sont communs entre le serveur et l'application React.

## ColorType

Liste des couleurs disponibles pour écrire un texte coloré dans la console.

```ts
export type ColorType =
  | 'reset'
  | 'bright'
  | 'dim'
  | 'underscore'
  | 'blink'
  | 'reverse'
  | 'hidden'
  | 'fgBlack'
  | 'fgRed'
  | 'fgGreen'
  | 'fgYellow'
  | 'fgBlue'
  | 'fgMagenta'
  | 'fgCyan'
  | 'fgWhite'
  | 'fgGray'
  | 'bgBlack'
  | 'bgRed'
  | 'bgGreen'
  | 'bgYellow'
  | 'bgBlue'
  | 'bgMagenta'
  | 'bgCyan'
  | 'bgWhite'
  | 'bgGray';
```

## ExerciseType

Liste des différentes catégories d'exercices disponibles dans l'application. Chaque nouvel exercice doit apparaître dans ce type.

En effet, il permet de distinguer l'exercice dans le model (`ExerciseModel.ts`).

```ts
export type ExerciseType = 'SFA' | 'PCA' | 'OTHER';
```

## PatientGender

Liste des différents genres gérés par l'application.

```ts
export type PatientGender = 'MALE' | 'FEMALE' | 'OTHER';
```

## ResourceType

Liste des ressources (médias, mots) disponibles.

```ts
export type ResourceType = 'IMAGE' | 'SOUND' | 'WORD';
```

## SessionExerciseStatus

Définition du status d'un exercice.

```ts
export type SessionExerciseStatus = 'PENDING' | 'DONE';
```

## SessionStatus

Définition du status d'une session.

```ts
export type SessionStatus =
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'LATE';
```

## SFAFieldType

Liste des sections du SFA.

```ts
export type SFAFieldType =
  | 'CATEGORY' // sfaCategory - "C'est un..."
  | 'USE' // sfaUse - "Sert à..."
  | 'ACTION' // sfaAction - "Fait quoi?"
  | 'PROPERTIES' // sfaProperties - "C'est en..."
  | 'ASSOCIATION'; // sfaAssociation - "Me fait penser à..."
```

## WSContextType

Définition du format du contexte de gestion WebSocket.

```ts
export type WSContextType = {
  connected: boolean; // Booléen représentant l'état de la connexion avec le serveur
  messages: string[]; // Ensemble des messages échangés avec le serveur
  ip: string; // Adresse IP du client
  tabletConnected: boolean; // Booléen représentant l'état de la connexion avec la tablette
  send: (msg: string) => void; // Fonction d'envoi de message vers le serveur
};
```

## WSEventType

Liste des différents types d'évènements pour les sockets.

```ts
export type WSEventType =
  | 'TABLET_CONNECTED' // Tablet -> PC: Tablette connecté avec succès
  | 'TABLET_DISCONNECTED' // Tablet -> PC: Tablette déconnecté
  | 'EXERCISE_START' // PC -> Tablet: Envoie d'un exercice sur la tablette
  | 'EXERCISE_RESPONSE' // Tablet -> PC: Patient envoie une réponse
  | 'EXERCISE_RESULT'; // PC -> Tablet: Validation des résultats (correct / incorrect)
```

## Redirections

- [Retour au README.md du dossier `shared`](./../README.md)
- [Retour au README.md de la racine](./../../README.md)

<style>
  @import "../../docs/readmeDocs/assets/style.css"
</style>
