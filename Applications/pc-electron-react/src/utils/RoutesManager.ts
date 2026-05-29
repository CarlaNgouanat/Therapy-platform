import { Route, RouteId, ROUTES } from '@/config/Routes';

/**
 * Static class RoutesManager
 * Cette classe gère l'utilisation des routes
 */
export class RoutesManager {
  /**
   * Renvoie un lien de navigation à partir d'un identifiant et d'une liste de paramètre
   * @param routeId Identfiant de la route
   * @param params Liste des paramètres à ajouter dans la route
   */
  public static navigateTo(
    routeId: RouteId,
    ...params: string[]
  ): string | null {
    const routePath: string | null = this.getPathWithRouteId(routeId);
    if (routePath !== null) {
      return this.bindRoute(routePath, ...params);
    } else return null;
  }

  /**
   * Renvoie le path de navigation à partir
   * @param routeId Identfiant de la route
   */
  private static getPathWithRouteId(routeId: RouteId): string | null {
    const route: Route[] = ROUTES.filter((route: Route) => {
      return route.id === routeId;
    });

    /**
     * Si la route n'existe pas, on renvoie null
     * Sinon, on renvoie le chemain
     */
    if (route.length === 0) return null;
    else return route[0].path;
  }

  /**
   * Construit via un chemin et une liste de paramètre
   * Pour chaque variable contenue dans la route, il faut qu'il y ait un paramètre supplémentaire dans la fonction
   * @param routePath Path vers la destination
   * @param params Liste des paramètres à ajouter dans la route
   */
  private static bindRoute(
    routePath: string,
    ...params: string[]
  ): string | null {
    const pathPeaces: string[] = routePath.split('/');

    // 1er Check pour vérifier les zones à compléter et le nombre de paramètres
    let nbParams: number = 0;
    pathPeaces.forEach((peace: string) => {
      if (peace.length > 0) {
        if (peace[0] === ':') nbParams += 1;
      }
    });
    if (nbParams !== params.length) return null;

    // Bind des paramètres de la route
    let indexBind: number = 0;
    return pathPeaces
      .map((peace: string) => {
        let saveString: string = peace;
        if (peace.length > 0) {
          if (peace[0] === ':') {
            saveString = params[indexBind];
            indexBind += 1;
          }
        }

        return saveString;
      })
      .join('/');
  }
}
