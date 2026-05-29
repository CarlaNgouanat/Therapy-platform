# Dossier `wsserver`

Ce dossier regroupe toutes les fonctions utilisées pour gérer le serveur de socket `ws`.

On y retrouve les dossiers :

- `server` - Contient la configuration et le gestionnaire du serveur de socket (lancement, interactions, arrêt, ...) ;
- `services` - Contient l'ensemble des services qui interagissent avec le serveur. Un service une classe métier qui envoie des messages au serveur ou traite le contenu des messages ;
- `utils` - Classes utiles au fonctionnement du serveur ;
- `messages` - Contient les différents types de messages à envoyer au serveur. Chaque message correspond à un type qui étend `WSMessage<Payload>` ;
- `payloads` - Contient les interfaces correspondant aux données contenues dans les messages ;
- `models` (situé dans le dossier /shared) - Contient un ensemble d'interface représentant les données traitées ;
- `mappers` - Contient un ensemble de classes qui permet de passer d'un message à un modèle et d'un modèle à un message ;

```ts
`./`
|
|- `wsserver`
|  |
|  |- `mappers`
|  |- `messages`
|  |- `payloads`
|  |- `server`
|  |- `services`
|  |- `utils`
|
|- `shared`
   |
   |- `models`
```

## Structure générale

Pour chaque nouvelle interaction avec le serveur, il est recommandée de créer des services distincts utilisant les fonctions mises à disposition dans le `WSServer.ts`.

Pour créer une requête `PC -> Server`, il faut que la fonction :

- prenne en paramètre un modèle (si des données doivent être envoyées) ;
- Ne renvoie rien (`void`) ;
- Utilise une des fonctions de broadcast (privilégier l'envoie WSMessage pour garder un format commun entre les messages) ;

À l'inverse une requête `Server -> PC`, il faut que la fonction :

- prenne en paramètre un WSMessage (si des données doivent être reçues) ;
- Renvoie un modèle ;

Le but ici est de bien séparer le traitement de données pour garantir l'unicité et la solidité du code.

![Sutrcture générale de la base de données](../docs/readmeDocs/assets/WSServerStruct.png)

## Redirections

- [README.md du dossier `server`](./server/README.md)
- [README.md du dossier `services`](./services/README.md)
- [README.md du dossier `utils`](./utils/README.md)
- [README.md du dossier `messages`](./messages/README.md)
- [README.md du dossier `payloads`](./payloads/README.md)
- [README.md du dossier `models`](./../shared/models/README.md)
- [README.md du dossier `mappers`](./mappers/README.md)
- [Retour au README.md de la racine](./../README.md)

<style>
  @import "../docs/readmeDocs/assets/style.css"
</style>
