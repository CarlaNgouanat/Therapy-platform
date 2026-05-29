# Outils partagés

les outils partagés sont des classes ou des fonctions accessibles autant côté serveur que côté applicatif.

Ici, on met à dispostion :

- Une classe pour afficher des messages personnalisées dans la console. L'idée à travers celle-ci est de normaliser l'affichage de message et les rendre plus attractif et lisible ;

```ts
/**
 * Class static LogsManager
 * Cette classe met en forme et gère les logs dans la console
 */
export class LogsManager {

  // --- GROUP ---

  /**
   * Créer un groupe via un string pour regrouper des affichages
   * @param className Class où se trouve le groupe de log
   * @param functionName Fonction où se trouve le groupe de log
   */
  public static createGroup(className: string, functionName: string): void {
    ... // [GROUP] <className> > <functioName>
  }

  /**
   * Ferme un groupe précédemment ouvert
   */
  public static endGroup(): void {
    ...
  }

  // --- AFFICHAGE ---

  /**
   * Afficher une erreur
   * @param log Log à afficher
   */
  public static logError(log: string): void {
    ... // [ERROR] <log>
  }

  /**
   * Afficher un warning
   * @param log Log à afficher
   */
  public static logWarning(log: string): void {
    ... // [WARNING] <log>
  }

  /**
   * Affiche une action qui s'est effectuée avec succès
   * @param log Log à afficher
   */
  public static logSuccess(log: string): void {
    ... // [SUCCESS] <log>
  }

  /**
   * Affiche une action qui s'est effectuée avec succès
   * @param log Log à afficher
   */
  public static logInfo(log: string): void {
    ... // [INFO] <log>
  }
}
```

- ...

## Redirections

- [Retour au README.md du dossier `shared`](./../README.md)
- [Retour au README.md de la racine](./../../README.md)

<style>
  @import "../../docs/readmeDocs/assets/style.css"
</style>
