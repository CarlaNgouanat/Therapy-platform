import { ColorType } from '@shared/types/ColorType';

/**
 * Class static LogsManager
 * Cette classe met en forme et gère les logs dans la console
 */
export class LogsManager {
  // --- COULEUR ---

  /**
   * Renvoie un texte avec une couleur
   * @param log Log à afficher
   * @param color Couleur à utiliser
   * @returns
   */
  private static getLogWithColor(log: string, color: ColorType): string {
    // Liste des couleurs disponibles
    const colorPanel: Map<ColorType, string> = new Map<ColorType, string>([
      ['reset', '\x1b[0m'],
      ['bright', '\x1b[1m'],
      ['dim', '\x1b[2m'],
      ['underscore', '\x1b[4m'],
      ['blink', '\x1b[5m'],
      ['reverse', '\x1b[7m'],
      ['hidden', '\x1b[8m'],

      ['fgBlack', '\x1b[30m'],
      ['fgRed', '\x1b[31m'],
      ['fgGreen', '\x1b[32m'],
      ['fgYellow', '\x1b[33m'],
      ['fgBlue', '\x1b[34m'],
      ['fgMagenta', '\x1b[35m'],
      ['fgCyan', '\x1b[36m'],
      ['fgWhite', '\x1b[37m'],
      ['fgGray', '\x1b[90m'],

      ['bgBlack', '\x1b[40m'],
      ['bgRed', '\x1b[41m'],
      ['bgGreen', '\x1b[42m'],
      ['bgYellow', '\x1b[43m'],
      ['bgBlue', '\x1b[44m'],
      ['bgMagenta', '\x1b[45m'],
      ['bgCyan', '\x1b[46m'],
      ['bgWhite', '\x1b[47m'],
      ['bgGray', '\x1b[100m'],
    ]);

    return `${colorPanel.get(color)}${log}${colorPanel.get('reset')}`;
  }

  // --- GROUP ---

  /**
   * Créer un groupe via un string pour regrouper des affichages
   * @param className Class où se trouve le groupe de log
   * @param functionName Fonction où se trouve le groupe de log
   */
  public static createGroup(className: string, functionName: string): void {
    console.group(
      `[${LogsManager.getLogWithColor('GROUP', 'bgGray')}] ${className} > ${functionName}`
    );
  }

  /**
   * Ferme un groupe précédemment ouvert
   */
  public static endGroup(): void {
    console.groupEnd();
  }

  // --- AFFICHAGE ---

  /**
   * Affiche un texte
   * @param title Titre de la section
   * @param colorTitle Couleur du titre
   * @param log Log à afficher
   */
  private static logTexte(
    title: string,
    colorTitle: ColorType,
    log: string
  ): void {
    console.log(`[${LogsManager.getLogWithColor(title, colorTitle)}] ${log}`);
  }

  /**
   * Afficher une erreur
   * @param log Log à afficher
   */
  public static logError(log: string): void {
    this.logTexte('ERROR', 'bgRed', log);
  }

  /**
   * Afficher un warning
   * @param log Log à afficher
   */
  public static logWarning(log: string): void {
    this.logTexte('WARNING', 'bgYellow', log);
  }

  /**
   * Affiche une action qui s'est effectuée avec succès
   * @param log Log à afficher
   */
  public static logSuccess(log: string): void {
    this.logTexte('SUCCESS', 'bgGreen', log);
  }

  /**
   * Affiche une action qui s'est effectuée avec succès
   * @param log Log à afficher
   */
  public static logInfo(log: string): void {
    this.logTexte('INFO', 'bgBlue', log);
  }
}
