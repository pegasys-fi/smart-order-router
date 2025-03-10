import { Token } from '@pollum-io/sdk-core';
import { Pair } from '@pollum-io/v1-sdk';
import _ from 'lodash';

import { ChainId, WRAPPED_NATIVE_CURRENCY } from '../../util/chains';
import { log } from '../../util/log';
import {
  DAI_ROLLUX,
  DAI_ROLLUX_TANENBAUM,
  USDC_ROLLUX,
  USDC_ROLLUX_TANENBAUM,
  USDC_ZKSYS_TANENBAUM,
  USDT_ROLLUX,
  USDT_ROLLUX_TANENBAUM,
  USDT_ZKSYS_TANENBAUM,
} from '../token-provider';

import { IV2SubgraphProvider, V2SubgraphPool } from './subgraph-provider';

type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ROLLUX]: [
    WRAPPED_NATIVE_CURRENCY[ChainId.ROLLUX]!,
    DAI_ROLLUX,
    USDC_ROLLUX,
    USDT_ROLLUX,
  ],
  [ChainId.ROLLUX_TANENBAUM]: [
    WRAPPED_NATIVE_CURRENCY[ChainId.ROLLUX_TANENBAUM]!,
    USDC_ROLLUX_TANENBAUM,
    USDT_ROLLUX_TANENBAUM,
    DAI_ROLLUX_TANENBAUM,
  ],
  [ChainId.ZKSYS_TANENBAUM]: [
    WRAPPED_NATIVE_CURRENCY[ChainId.ZKSYS_TANENBAUM]!,
    USDC_ZKSYS_TANENBAUM,
    USDT_ZKSYS_TANENBAUM,
  ],
};

/**
 * Provider that does not get data from an external source and instead returns
 * a hardcoded list of Subgraph pools.
 *
 * Since the pools are hardcoded, the liquidity/price values are dummys and should not
 * be depended on.
 *
 * Useful for instances where other data sources are unavailable. E.g. subgraph not available.
 *
 * @export
 * @class StaticV2SubgraphProvider
 */
export class StaticV2SubgraphProvider implements IV2SubgraphProvider {
  constructor(private chainId: ChainId) { }

  public async getPools(
    tokenIn?: Token,
    tokenOut?: Token
  ): Promise<V2SubgraphPool[]> {
    log.info('In static subgraph provider for V2');
    const bases = BASES_TO_CHECK_TRADES_AGAINST[this.chainId];

    const basePairs: [Token, Token][] = _.flatMap(
      bases,
      (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase])
    );

    if (tokenIn && tokenOut) {
      basePairs.push(
        [tokenIn, tokenOut],
        ...bases.map((base): [Token, Token] => [tokenIn, base]),
        ...bases.map((base): [Token, Token] => [tokenOut, base])
      );
    }

    const pairs: [Token, Token][] = _(basePairs)
      .filter((tokens): tokens is [Token, Token] =>
        Boolean(tokens[0] && tokens[1])
      )
      .filter(
        ([tokenA, tokenB]) =>
          tokenA.address !== tokenB.address && !tokenA.equals(tokenB)
      )
      .value();

    const poolAddressSet = new Set<string>();

    const subgraphPools: V2SubgraphPool[] = _(pairs)
      .map(([tokenA, tokenB]) => {
        const poolAddress = Pair.getAddress(tokenA, tokenB);

        if (poolAddressSet.has(poolAddress)) {
          return undefined;
        }
        poolAddressSet.add(poolAddress);

        const [token0, token1] = tokenA.sortsBefore(tokenB)
          ? [tokenA, tokenB]
          : [tokenB, tokenA];

        return {
          id: poolAddress,
          liquidity: '100',
          token0: {
            id: token0.address,
          },
          token1: {
            id: token1.address,
          },
          supply: 100,
          reserve: 100,
          reserveUSD: 100,
        };
      })
      .compact()
      .value();

    return subgraphPools;
  }
}
