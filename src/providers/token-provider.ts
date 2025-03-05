import { Token } from '@pollum-io/sdk-core';
import _ from 'lodash';

import { IERC20Metadata__factory } from '../types/v3/factories/IERC20Metadata__factory';
import { ChainId, log, WRAPPED_NATIVE_CURRENCY } from '../util';

import { IMulticallProvider } from './multicall-provider';
import { ProviderConfig } from './provider';

/**
 * Provider for getting token data.
 *
 * @export
 * @interface ITokenProvider
 */
export interface ITokenProvider {
  /**
   * Gets the token at each address. Any addresses that are not valid ERC-20 are ignored.
   *
   * @param addresses The token addresses to get.
   * @param [providerConfig] The provider config.
   * @returns A token accessor with methods for accessing the tokens.
   */
  getTokens(
    addresses: string[],
    providerConfig?: ProviderConfig
  ): Promise<TokenAccessor>;
}

export type TokenAccessor = {
  getTokenByAddress(address: string): Token | undefined;
  getTokenBySymbol(symbol: string): Token | undefined;
  getAllTokens: () => Token[];
};

export const USDC_ROLLUX = new Token(
  ChainId.ROLLUX,
  '0x368433CaC2A0B8D76E64681a9835502a1f2A8A30',
  6,
  'USDC',
  'USD//C'
);
export const USDT_ROLLUX = new Token(
  ChainId.ROLLUX,
  '0x28c9c7Fb3fE3104d2116Af26cC8eF7905547349c',
  6,
  'USDT',
  'Tether USD'
);
export const DAI_ROLLUX = new Token(
  ChainId.ROLLUX,
  '0x5B0aC6194499621630ddebb30c4aBE37037b30Ec',
  18,
  'DAI',
  'Dai Stablecoin'
);

// Some well known tokens on each chain for seeding cache / testing.
export const USDC_ROLLUX_TANENBAUM = new Token(
  ChainId.ROLLUX_TANENBAUM,
  '0x2Be160796F509CC4B1d76fc97494D56CF109C3f1',
  6,
  'USDC',
  'USD//C'
);
export const USDT_ROLLUX_TANENBAUM = new Token(
  ChainId.ROLLUX_TANENBAUM,
  '0xb97915AED8B5996dE24Ce760EC8DE5A91E820dF7',
  6,
  'USDT',
  'Tether USD'
);
export const DAI_ROLLUX_TANENBAUM = new Token(
  ChainId.ROLLUX_TANENBAUM,
  '0xccA991E1Bdca2846640d366116d60BC25C2815db',
  18,
  'DAI',
  'Dai Stablecoin'
);

// Some well known tokens on each chain for seeding cache / testing.
export const USDC_ZKSYS_TANENBAUM = new Token(
  ChainId.ZKSYS_TANENBAUM,
  '0xdf2d98dccf84180ceb337475fcadd0003ea14e2e',
  6,
  'USDC',
  'USD//C'
);
export const USDT_ZKSYS_TANENBAUM = new Token(
  ChainId.ZKSYS_TANENBAUM,
  '0xfc25fa595ef72210d429b3f5913834df40c98cc5',
  6,
  'USDT',
  'Tether USD'
);

export class TokenProvider implements ITokenProvider {
  constructor(
    private chainId: ChainId,
    protected multicall2Provider: IMulticallProvider
  ) { }

  public async getTokens(
    _addresses: string[],
    providerConfig?: ProviderConfig
  ): Promise<TokenAccessor> {
    const addressToToken: { [address: string]: Token } = {};
    const symbolToToken: { [symbol: string]: Token } = {};

    const addresses = _(_addresses)
      .map((address) => address.toLowerCase())
      .uniq()
      .value();

    if (addresses.length > 0) {
      const [symbolsResult, decimalsResult] = await Promise.all([
        this.multicall2Provider.callSameFunctionOnMultipleContracts<
          undefined,
          [string]
        >({
          addresses,
          contractInterface: IERC20Metadata__factory.createInterface(),
          functionName: 'symbol',
          providerConfig,
        }),
        this.multicall2Provider.callSameFunctionOnMultipleContracts<
          undefined,
          [number]
        >({
          addresses,
          contractInterface: IERC20Metadata__factory.createInterface(),
          functionName: 'decimals',
          providerConfig,
        }),
      ]);

      const { results: symbols } = symbolsResult;
      const { results: decimals } = decimalsResult;

      for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i]!;

        const symbolResult = symbols[i];
        const decimalResult = decimals[i];

        if (!symbolResult?.success || !decimalResult?.success) {
          log.info(
            {
              symbolResult,
              decimalResult,
            },
            `Dropping token with address ${address} as symbol or decimal are invalid`
          );
          continue;
        }

        const symbol = symbolResult.result[0]!;
        const decimal = decimalResult.result[0]!;

        addressToToken[address.toLowerCase()] = new Token(
          this.chainId,
          address,
          decimal,
          symbol
        );
        symbolToToken[symbol.toLowerCase()] =
          addressToToken[address.toLowerCase()]!;
      }

      log.info(
        `Got token symbol and decimals for ${Object.values(addressToToken).length
        } out of ${addresses.length} tokens on-chain ${providerConfig ? `as of: ${providerConfig?.blockNumber}` : ''
        }`
      );
    }

    return {
      getTokenByAddress: (address: string): Token | undefined => {
        return addressToToken[address.toLowerCase()];
      },
      getTokenBySymbol: (symbol: string): Token | undefined => {
        return symbolToToken[symbol.toLowerCase()];
      },
      getAllTokens: (): Token[] => {
        return Object.values(addressToToken);
      },
    };
  }
}

export const DAI_ON = (chainId: ChainId): Token => {
  switch (chainId) {
    case ChainId.ROLLUX:
      return DAI_ROLLUX;
    case ChainId.ROLLUX_TANENBAUM:
      return DAI_ROLLUX_TANENBAUM;
    default:
      throw new Error(`Chain id: ${chainId} not supported`);
  }
};

export const USDT_ON = (chainId: ChainId): Token => {
  switch (chainId) {
    case ChainId.ROLLUX:
      return USDT_ROLLUX;
    case ChainId.ROLLUX_TANENBAUM:
      return USDT_ROLLUX_TANENBAUM;
    case ChainId.ZKSYS_TANENBAUM:
      return USDT_ZKSYS_TANENBAUM;
    default:
      throw new Error(`Chain id: ${chainId} not supported`);
  }
};

export const USDC_ON = (chainId: ChainId): Token => {
  switch (chainId) {
    case ChainId.ROLLUX:
      return USDC_ROLLUX;
    case ChainId.ROLLUX_TANENBAUM:
      return USDC_ROLLUX_TANENBAUM;
    case ChainId.ZKSYS_TANENBAUM:
      return USDC_ZKSYS_TANENBAUM;
    default:
      throw new Error(`Chain id: ${chainId} not supported`);
  }
};

export const WNATIVE_ON = (chainId: ChainId): Token => {
  return WRAPPED_NATIVE_CURRENCY[chainId];
};
