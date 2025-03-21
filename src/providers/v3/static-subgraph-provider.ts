/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Token } from '@pollum-io/sdk-core';
import { FeeAmount, Pool } from '@pollum-io/v3-sdk';
import JSBI from 'jsbi';
import _ from 'lodash';

import { unparseFeeAmount } from '../../util/amounts';
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

import { IV3PoolProvider } from './pool-provider';
import { IV3SubgraphProvider, V3SubgraphPool } from './subgraph-provider';

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
 * Provider that uses a hardcoded list of V3 pools to generate a list of subgraph pools.
 *
 * Since the pools are hardcoded and the data does not come from the Subgraph, the TVL values
 * are dummys and should not be depended on.
 *
 * Useful for instances where other data sources are unavailable. E.g. Subgraph not available.
 *
 * @export
 * @class StaticV3SubgraphProvider
 */
export class StaticV3SubgraphProvider implements IV3SubgraphProvider {
  constructor(
    private chainId: ChainId,
    private poolProvider: IV3PoolProvider
  ) { }

  public async getPools(
    tokenIn?: Token,
    tokenOut?: Token
  ): Promise<V3SubgraphPool[]> {
    log.info('In static subgraph provider for V3');
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

    const pairs: [Token, Token, FeeAmount][] = _(basePairs)
      .filter((tokens): tokens is [Token, Token] =>
        Boolean(tokens[0] && tokens[1])
      )
      .filter(
        ([tokenA, tokenB]) =>
          tokenA.address !== tokenB.address && !tokenA.equals(tokenB)
      )
      .flatMap<[Token, Token, FeeAmount]>(([tokenA, tokenB]) => {
        return [
          [tokenA, tokenB, FeeAmount.LOWEST],
          [tokenA, tokenB, FeeAmount.LOW],
          [tokenA, tokenB, FeeAmount.MEDIUM],
          [tokenA, tokenB, FeeAmount.HIGH],
        ];
      })
      .value();

    log.info(
      `V3 Static subgraph provider about to get ${pairs.length} pools on-chain`
    );
    const poolAccessor = await this.poolProvider.getPools(pairs);
    const pools = poolAccessor.getAllPools();

    const poolAddressSet = new Set<string>();
    const subgraphPools: V3SubgraphPool[] = _(pools)
      .map((pool) => {
        const { token0, token1, fee, liquidity } = pool;

        const poolAddress = Pool.getAddress(pool.token0, pool.token1, pool.fee);

        if (poolAddressSet.has(poolAddress)) {
          return undefined;
        }
        poolAddressSet.add(poolAddress);

        const liquidityNumber = JSBI.toNumber(liquidity);

        return {
          id: poolAddress,
          feeTier: unparseFeeAmount(fee),
          liquidity: liquidity.toString(),
          token0: {
            id: token0.address,
          },
          token1: {
            id: token1.address,
          },
          // As a very rough proxy we just use liquidity for TVL.
          tvlSYS: liquidityNumber,
          tvlUSD: liquidityNumber,
        };
      })
      .compact()
      .value();

    return subgraphPools;
  }
}
