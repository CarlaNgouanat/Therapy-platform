# Dossier Shared

## Informations générales

Le dossier `shared` rend accessible des types des interfaces, des classes et des fonctions au backend (electron, la base de données et le serveur de socket) et à l'application React.

Le but ici est d'éviter la duplication de code et faciliter la communication entre les 2 parties.

## Utilisation

La clé `"path"` du `tsconfig.json` permet de créer des alias (ici `@shared`) afin de faciliter les importations et éviter de devoir naviguer dans l'arborescence des dossiers (`../../../`).

```json
{
    "compilerOptions": {
        ...
        "paths": {
            ...
            "@shared/*": ["./shared/*"]
        }
    }
}

```

Afin que la dossier soit accesible depuis l'application React, il faut aussi rajouté une ligne dans la liste des alias disponible du fichier `vite.config.ts`.

```ts
export default defineConfig({
    ...
    resolve: {
        ...
        alias: {
            ...
            '@shared': path.resolve(__dirname, './shared')
        },
    },
});
```

Attention, il ne faut pas ajouter tous les paths dans la configuration de vite. Certaines choses comme la base de données ou la configuration, doivent rester côté backend et ne pas être utilisable par l'interface.

Exemple d'importation :

```ts
import { SessionModel } from '@shared/models/SessionModel';
import { SessionExercise } from '@shared/types/SessionExercise';
import { LogsManager } from '@shared/utils/LogsManager';
```

## Redirections

- [README.md du dossier `models`](./models/README.md)
- [README.md du dossier `types`](./types/README.md)
- [README.md du dossier `utils`](./utils/README.md)
- [Retour au README.md de la racine](./../README.md)

<style>
  @import "../docs/readmeDocs/assets/style.css"
</style>
