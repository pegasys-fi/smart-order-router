import { Protocol } from '@pollum-io/router-sdk';
import { Token } from '@pollum-io/sdk-core';

import { MixedRoute, V1Route, V3Route } from '../../../../routers';

interface CachedRouteParams<Route extends V3Route | V1Route | MixedRoute> {
  route: Route;
  percent: number;
}

/**
 * Class defining the route to cache
 *
 * @export
 * @class CachedRoute
 */
export class CachedRoute<Route extends V3Route | V1Route | MixedRoute> {
  public readonly route: Route;
  public readonly percent: number;

  /**
   * @param route
   * @param percent
   */
  constructor({ route, percent }: CachedRouteParams<Route>) {
    this.route = route;
    this.percent = percent;
  }

  public get protocol(): Protocol {
    return this.route.protocol;
  }

  public get tokenIn(): Token {
    return this.route.input;
  }

  public get tokenOut(): Token {
    return this.route.output;
  }
}
