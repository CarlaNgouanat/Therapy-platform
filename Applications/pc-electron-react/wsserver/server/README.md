# Server de socket et détails des interactions `WSServer.ts`

La classe `WSServer` est utilisée pour lancer et gérer le serveur de socket. Elle sert également de passerelle entre le serveur et les applications afin de leur permettre d'interagir.

La configuration du serveur a été déplacé dans le fichier `WSServerConf.ts` qui indique l'ip et le port sur lequel le serveur doit se lancer. Ici : `ws://127.0.0.1:4933`.

```ts
export class WSServerConf {
  // --- VARIABLES ---

  // Port et ip par défaut
  private readonly ip: string = '127.0.0.1';
  private readonly port: string = '4933';

  ...
}

```

Dernier point sur quelques fonctions importantes de classe `WSServer.ts` :

- `startWebSocketServer` - Lance le serveur de socket et utilise la fonction `createWebServer` qui initialise tous les évènements clients ;
- `stopWebSocketServer` - Arrêt complètement le serveur avec tous ses services ;
- `onMessage` - Ajout une nouvelle fonction à exécuter lorsque le serveur reçoit un message d'un des clients connectés ;
- `broadcastWSMessage` et `broadcastStringMessage` - Envoie un message au serveur qui sera transmis à toutes les personnes connectés ;

```ts
export class WSServer {

  // --- LANCEMENT ---

  public startWebSocketServer(port: string = this.confServer.getPort()): void {
    ...
  }

  private createWebServer(port: string): void {
    ...
  }

  // --- ARRÊT ---

  public stopWebSocketServer(): void {
    ...
  }

  // --- HANDLERS ---

  public onMessage(handler: MessageHandlerType<AbstractPayload>): void {
    ...
  }

  // --- ENVOI DE MESSAGES ---

  public broadcastWSMessage(wsMessage: WSMessage<AbstractPayload>): void {
    ...
  }

  public broadcastStringMessage(message: string) {
    ...
  }

  ...
}
```

![Interaction entre les différents fichiers et le serveur de socket](../../docs/readmeDocs/assets/WSServerStruct.png)

En ce qui concerne les fonctions métiers qui envoient et lisent des messages du serveur, on privilégiera la création de services spécifiques afin de bien séparer serveur et métier.

## Détail sur le fonctionnement

Pour lancer le serveur, on instancie 4 mots-clés et une boucle pour vérifier que les utilisateurs soient connectés :

- Le 1er mot-clé `connection` permet de définir pour chaque nouvelle connexion d'un utilisateur, un ensemble de mots-clés/évènements ;
- Le 2nd mot-clé `pong` est utilisé pour la boucle qui vérifie que les utilisateurs sont bien connectés (`ping` -> `pong`) ;
- Le 3ème mot-clé `message` définit les actions à effectuer lorsque le serveur reçoit un message provenant d'un des utilisateurs. C'est ce mot-clé qui permet l'interacation PC vers tablette ;
- Le 4ème mot-clé `close` affiche simplement un message quand on capte la déconnexion d'un utilication ;
- La boucle (via `SetInterval`) vérifie toutes les 30s si tous les utilisateurs sont bien connectés au serveur en utilisant le `ping`. Si l'utilisateur ne répond pas, alors on le déconnecte. C'est une sécurité en plus de ce qui est déjà présent chez le client ;

## Redirections

- [Retour au README.md du dossier `wsserver`](./../README.md)
- [Retour au README.md de la racine](./../../README.md)

<style>
  @import "../../docs/readmeDocs/assets/style.css"
</style>
