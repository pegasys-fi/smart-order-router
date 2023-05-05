import { Token } from '@pollum-io/sdk-core';
import { FACTORY_ADDRESS } from '@pollum-io/v2-sdk';

import { ChainId, NETWORKS_WITH_SAME_UNISWAP_ADDRESSES } from './chains';


export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  ...constructSameAddressMap(FACTORY_ADDRESS),
  [ChainId.ROLLUX_TESTNET]: FACTORY_ADDRESS,

};

export const QUOTER_V2_ADDRESSES: AddressMap = {
  ...constructSameAddressMap('0x61fFE014bA17989E743c5F6cB21bF9697530B21e'),
  [ChainId.ROLLUX_TESTNET]: "",

};

export const MIXED_ROUTE_QUOTER_V1_ADDRESSES: AddressMap = {
  [ChainId.ROLLUX_TESTNET]: "",
};

export const UNISWAP_MULTICALL_ADDRESSES: AddressMap = {
  ...constructSameAddressMap('0x1F98415757620B543A52E61c46B32eB19261F984'),
  [ChainId.ROLLUX_TESTNET]: "",

};

export const SWAP_ROUTER_02_ADDRESSES = (_chainId: number) => {
  return '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
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
  [ChainId.ROLLUX_TESTNET]: new Token(
    ChainId.ROLLUX_TESTNET,
    '0x4200000000000000000000000000000000000006',
    18,
    'WSYS',
    'Wrapped Syscoin'
  ),
};
