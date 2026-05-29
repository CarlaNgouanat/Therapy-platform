# Outils du WebSocket

Dans ce dossier, on stocke les classes et fonctions utiles au bon fonctionnement du WebSocket.

On retrouve :

- `IsAliveWebSocket.ts` : Cette classe importe la classe `WebSocket` disponible dans `ws` pour ajouter une clé `isAlive : boolean` qui est utilisée pour vérifier la connexion des appareils au serveur ;

```ts
export class IsAliveWebSocket extends WebSocket {
  isAlive: boolean = false;
}
```

- `MessageHandlerType.ts` : Ce type correspond à une fonction qui prend en paramètre un WSMessage (`message: WSMessage<Payload>`) et client du serveur WebSocket (`client: IsAliveWebSocket`). Il a pour but de définir une action à effectuer lorsque le client reçoit un message du serveur ;

```ts
export type MessageHandlerType<Payload extends AbstractPayload> = (
  message: WSMessage<Payload>,
  client: IsAliveWebSocket
) => void;
```

- `WSParser.ts` : Cette classe statique parse des messages de `WSMessage` à `string` et de `string` à `WSMessage` ;

```ts
export class WSParser {
  static parseWSMessage<Payload extends AbstractPayload>(
    stringMessage: string
  ): WSMessage<Payload> | null {
    try {
      const parsed = JSON.parse(stringMessage);
      if (parsed && typeof parsed.event === 'string' && parsed.payload) {
        return parsed as WSMessage<Payload>;
      }
      return null;
    } catch {
      return null;
    }
  }

  static serializeWSMessage<Payload extends AbstractPayload>(
    message: WSMessage<Payload>
  ): string {
    return JSON.stringify(message);
  }
}
```

## Redirections

- [Retour au README.md du dossier `wsserver`](./../README.md)
- [Retour au README.md de la racine](./../../README.md)

<style>
  @import "../../docs/readmeDocs/assets/style.css"
</style>
