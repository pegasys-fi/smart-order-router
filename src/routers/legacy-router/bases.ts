/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Token } from '@pollum-io/sdk-core';

import {
  DAI_ROLLUX,
  ITokenProvider,
  USDC_ROLLUX,
  USDT_ROLLUX,
} from '../../providers/token-provider';
import { ChainId, WRAPPED_NATIVE_CURRENCY } from '../../util/chains';

type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

export const BASES_TO_CHECK_TRADES_AGAINST = (
  _tokenProvider: ITokenProvider
): ChainTokenList => {
  return {
    [ChainId.ROLLUX_TESTNET]: [
      WRAPPED_NATIVE_CURRENCY[ChainId.ROLLUX_TESTNET]!,
      DAI_ROLLUX,
      USDC_ROLLUX,
      USDT_ROLLUX,
    ],
  };
};

// const getBasePairByAddress = async (
//   tokenProvider: ITokenProvider,
//   _chainId: ChainId,
//   fromAddress: string,
//   toAddress: string
// ): Promise<{ [tokenAddress: string]: Token[] }> => {
//   const accessor = await tokenProvider.getTokens([toAddress]);
//   const toToken: Token | undefined = accessor.getTokenByAddress(toAddress);

//   if (!toToken) return {};

//   return {
//     [fromAddress]: [toToken],
//   };
// };

export const ADDITIONAL_BASES = async (
  _tokenProvider: ITokenProvider
): Promise<{
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] };
}> => {
  return {};
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES = async (
  _tokenProvider: ITokenProvider
): Promise<{
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] };
}> => {
  return {};
};
