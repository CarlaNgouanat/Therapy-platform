# Dossier `pc-electron-react`

Ce dossier concerne l'application PC en `Electron/React/Vite` (`Typescript`).

On y retrouve les dossiers :

- `database` - Contient tous les fichiers relatifs à la base de données SQLite ;
- `docs` - Contient les documentations générées et les images utilisées dans les `README.md` ;
- `electron` - Contient les données pour lancer `Electron` ;
- `public` - Contient les fichiers médias utilisés par `Electron` (et non l'application `React`) ;
- `shared` - Contient les fichiers partagés entre l'application `React` et `Electron` ;
- `src` - Contient les fichiers relatives à l'application `React` ;
- `test` - Contient l'ensemble des tests unitaires
- `wsserver` - Contient les fichiers relatifs au serveur de socket

```ts
`./`
|
|- `database`
|- `docs`
|- `electron`
|- `public`
|- `shared`
|- `src`
|- `test`
|- `wsserver`
```

![Fonctionnement de l'application simplifié](docs/readmeDocs/assets/HowDoesItWorks.png)

Liste des commandes disponibles :

- `npm run dev` : Lancement l'application en mode développement ;
- `npm run launch` : Lancement de l'application en production ;
- `npm run build` : Build de l'application ;
- `npm run lint` : Vérifie si le code est conforme aux paramètres du lint ;
- `npm run lint:fix` : Tentative de path du lint (marche rarement) ;
- `npm run prettier` : Lance le prettier pour rendre conforme les fichiers à la configuration du prettier ;
- `npm run prettier:check` : Vérifie si le code est conforme aux paramètres au prettier ;
- `npm run preview` : Lance la preview de l'application sur un localhost ;
- `npm run test` : Lance les tests unitaires (processus en fond qui se relance à chaque sauvegarde) ;
- `npm run test:coverage` : Lance les tests unitaires et détermine le coverage des tests ;
- `npm run docs` : Génération de la documentation ;
- `npm run postinstall` : Installation des dépendances pour l'electron builder ;

## Redirections

- [README.md du dossier `database`](./database/README.md)
- [README.md du dossier `electron`](./electron/README.md)
- [README.md du dossier `shared`](./shared/README.md)
- [README.md du dossier `wsserver`](./wsserver/README.md)

<style>
  @import "./docs/readmeDocs/assets/style.css"
</style>
