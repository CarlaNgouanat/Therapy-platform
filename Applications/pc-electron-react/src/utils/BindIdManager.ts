/**
 * Utilisation du binder
 * Le binder construit des identifiants en fonction de la hiérarchie définit via les appelles
 * On commence les appels à 1
 *
 * Par exemple:
 * <div id={bind(1, "div")}>                        --> div
 *      <h1 id={bind(2, "h1")}></h1>                --> div-h1
 *      <p id={bind(2, "p")}>                       --> div-p
 *          <span id={bind(3, "span")}>             --> div-p-span
 *          </span>
 *      </p>
 *      <img id={bind(2, "img")}>                   --> div-img
 * </div>
 */

/**
 * Class BindIdManager
 * Cette classe permet de définir un identifiant dynamique pour les balises react
 */
export class BindIdManager {
  // Tableau avec la liste des identifiants
  private tabId: string[] = [];

  /**
   * Constructeur avec l'identifiant de départ
   * @param startingId Identifiant départ
   */
  constructor(startingId: string) {
    this.tabId[0] = startingId;
  }

  /**
   * Crée un nouvel identifiant à partir de l'index et du nouvel identifiant
   * @param index Index dans la hiérarchie (Attention l'index doit est strictement supérieur à 0)
   * @param newId Nouvelle identifiant
   * @returns Nouvelle identifiant
   * @throws Renvoie une erreur si l'index est inférieur ou égal à 0
   */
  bindId(index: number, newId: string): string {
    /**
     * Vérification de l'index
     * 3 cas :
     * - Soit le l'index est supérieur ou égal à la taille du tableau, auquel cas on ajoute l'id au tableau
     * - Soit l'index est inférieur, auquel on vide le tableau jusqu'à l'endroit où placer l'index
     * - Cas particulier, l'index est inférieur ou égal à 0, alors on soulève une erreur
     */
    if (index <= 0) {
      throw new Error("L'index ne peut être inférieur ou égal à 0");
    } else if (index < this.tabId.length) {
      this.tabId = this.tabId.splice(0, index);
    }
    this.tabId.push(newId);

    return this.tabId.join('-');
  }

  /**
   * Renvoie l'identifiant cournant
   * @returns Renvoie un string
   */
  getCurrentId(): string {
    return this.tabId.join('-');
  }
}
