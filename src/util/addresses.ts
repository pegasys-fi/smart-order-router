import { Token } from '@pollum-io/sdk-core';
import { FACTORY_ADDRESS } from '@pollum-io/v3-sdk';

import { ChainId, NETWORKS_WITH_SAME_UNISWAP_ADDRESSES } from './chains';

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  ...constructSameAddressMap(FACTORY_ADDRESS),
};

export const QUOTER_V2_ADDRESSES: AddressMap = {
  ...constructSameAddressMap('0x4aa7D3a3D8025e653886EbD5f2e9416a7b4ADe22'),
};

export const MIXED_ROUTE_QUOTER_V1_ADDRESSES: AddressMap = {};

export const UNISWAP_MULTICALL_ADDRESSES: AddressMap = {
  [ChainId.ROLLUX]: '0x25DAE2f7ad027b29b4e968ecC899F8A8A0f54B2A',
  [ChainId.ROLLUX_TANENBAUM]: '0x0fC3574BFff5FF644A11B7B13A70B484F8e01D08'
};

export const SWAP_ROUTER_02_ADDRESSES = (_chainId: number) => {
  return '0x0D38D4b4E53ca671b8AF722F71FCf3666a971BC6';
};

export const OVM_GASPRICE_ADDRESS =
  '0x420000000000000000000000000000000000000F';
export const ARB_GASINFO_ADDRESS = '0x000000000000000000000000000000000000006C';
export const TICK_LENS_ADDRESS = '0x6dfd1ea91128733Dc96479b7d1b0F4bC36C31C44';
export const NONFUNGIBLE_POSITION_MANAGER_ADDRESS =
  '0x4dB158Eec5c5d63F9A09535882b835f36d3fd012';
export const V3_MIGRATOR_ADDRESS = '0x2b75Ee991F4E5572451E186E5cd2148Ba4B286e5';
export const MULTICALL2_ADDRESS = '0xc9E6E07CB460F36A6D5826f70647eff7e1823899';

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
