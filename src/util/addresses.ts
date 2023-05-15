import { Token } from '@pollum-io/sdk-core';
import { FACTORY_ADDRESS } from '@pollum-io/v2-sdk';

import { ChainId, NETWORKS_WITH_SAME_UNISWAP_ADDRESSES } from './chains';

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  ...constructSameAddressMap(FACTORY_ADDRESS),
};

export const QUOTER_V2_ADDRESSES: AddressMap = {
  ...constructSameAddressMap('0xC3d7521CD0Dbde97d9607C4e6389B806B36e8f66'),
};

export const MIXED_ROUTE_QUOTER_V1_ADDRESSES: AddressMap = {
};

export const UNISWAP_MULTICALL_ADDRESSES: AddressMap = {
  ...constructSameAddressMap('0xCbA1683e1f0BA5061573CCE7C1A73a80C3827cef'),
};

export const SWAP_ROUTER_02_ADDRESSES = (_chainId: number) => {
  return '0xfB2529aE4D41ae6c8B6782a5CBb56E24141133D8';
};

export const OVM_GASPRICE_ADDRESS =
  '0x420000000000000000000000000000000000000F';
export const ARB_GASINFO_ADDRESS = '0x000000000000000000000000000000000000006C';
export const TICK_LENS_ADDRESS = '0x36975dfB9B2b1c858f77c6797cf7454ACC57816f';
export const NONFUNGIBLE_POSITION_MANAGER_ADDRESS =
  '0xc224d913A70c2AaF34B6f72479995B114020ad8b';
export const V3_MIGRATOR_ADDRESS = '0x8C2d6B3651989385D93b66cE61db6602457b257b';
export const MULTICALL2_ADDRESS = '0x8e59ED2DF847Ad3d19624480Db5B2B3Ba27fC9a8';

export type AddressMap = { [chainId: number]: string };

export function constructSameAddressMap<T extends string>(
  address: T,
  additionalNetworks: ChainId[] = []
): { [chainId: number]: T } {
  return NETWORKS_WITH_SAME_UNISWAP_ADDRESSES.concat(
    additionalNetworks
  ).reduce<{
    [chainId: number]: T;
  }>((memo, chainId) => {
    memo[chainId] = address;
    return memo;
  }, {});
}

export const WETH9: {
  [chainId in ChainId]: Token;
} = {
  [ChainId.ROLLUX]: new Token(
    ChainId.ROLLUX,
    '0x4200000000000000000000000000000000000006',
    18,
    'WSYS',
    'Wrapped Syscoin'
  ),
  [ChainId.ROLLUX_TANENBAUM]: new Token(
    ChainId.ROLLUX_TANENBAUM,
    '0x4200000000000000000000000000000000000006',
    18,
    'WSYS',
    'Wrapped Syscoin'
  ),
};
