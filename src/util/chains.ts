import { Ether, NativeCurrency, Token } from '@pollum-io/sdk-core';

export enum ChainId {
  ROLLUX_TESTNET = 57000,
}

// WIP: Gnosis, Moonbeam
export const SUPPORTED_CHAINS: ChainId[] = [ChainId.ROLLUX_TESTNET];

export const V2_SUPPORTED = [ChainId.ROLLUX_TESTNET];

export const HAS_L1_FEE = [ChainId.ROLLUX_TESTNET];

export const NETWORKS_WITH_SAME_UNISWAP_ADDRESSES = [ChainId.ROLLUX_TESTNET];

export const ID_TO_CHAIN_ID = (id: number): ChainId => {
  switch (id) {
    case 57000:
      return ChainId.ROLLUX_TESTNET;
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};

export enum ChainName {
  ROLLUX_TESTNET = 'rollux-testnet',
}

export enum NativeCurrencyName {
  // Strings match input for CLI
  SYS = 'SYS',
}
export const NATIVE_NAMES_BY_ID: { [chainId: number]: string[] } = {
  [ChainId.ROLLUX_TESTNET]: [
    'SYS',
    'Syscoin',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  ],
};

export const NATIVE_CURRENCY: { [chainId: number]: NativeCurrencyName } = {
  [ChainId.ROLLUX_TESTNET]: NativeCurrencyName.SYS,
};

export const ID_TO_NETWORK_NAME = (id: number): ChainName => {
  switch (id) {
    case 57000:
      return ChainName.ROLLUX_TESTNET;
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};

export const CHAIN_IDS_LIST = Object.values(ChainId).map((c) =>
  c.toString()
) as string[];

export const ID_TO_PROVIDER = (id: ChainId): string => {
  switch (id) {
    case ChainId.ROLLUX_TESTNET:
      return 'https://rpc-tanenbaum.rollux.com/'!;

    default:
      throw new Error(`Chain id: ${id} not supported`);
  }
};

export const WRAPPED_NATIVE_CURRENCY: { [chainId in ChainId]: Token } = {
  [ChainId.ROLLUX_TESTNET]: new Token(
    ChainId.ROLLUX_TESTNET,
    '0x4200000000000000000000000000000000000006',
    18,
    'WSYS',
    'Wrapped Syscoin'
  ),
};

export class ExtendedEther extends Ether {
  public get wrapped(): Token {
    if (this.chainId in WRAPPED_NATIVE_CURRENCY)
      return WRAPPED_NATIVE_CURRENCY[this.chainId as ChainId];
    throw new Error('Unsupported chain ID');
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } =
    {};

  public static onChain(chainId: number): ExtendedEther {
    return (
      this._cachedExtendedEther[chainId] ??
      (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId))
    );
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency } = {};
export function nativeOnChain(chainId: number): NativeCurrency {
  if (cachedNativeCurrency[chainId] != undefined)
    return cachedNativeCurrency[chainId]!;
  cachedNativeCurrency[chainId] = ExtendedEther.onChain(chainId);
  return cachedNativeCurrency[chainId]!;
}
