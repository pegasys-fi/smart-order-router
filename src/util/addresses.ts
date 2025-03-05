import { Token } from '@pollum-io/sdk-core';
import { FACTORY_ADDRESS, FACTORY_ADDRESS_ZKSYS } from '@pollum-io/v3-sdk';

import { ChainId, NETWORKS_WITH_SAME_UNISWAP_ADDRESSES } from './chains';

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  ...constructSameAddressMap(FACTORY_ADDRESS),
  [ChainId.ZKSYS_TANENBAUM]: FACTORY_ADDRESS_ZKSYS
};

export const QUOTER_V2_ADDRESSES: AddressMap = {
  ...constructSameAddressMap('0x4aa7D3a3D8025e653886EbD5f2e9416a7b4ADe22'),
  [ChainId.ZKSYS_TANENBAUM]: '0x70a2dE04bA3b025ba141570A4B0812Fe3129f6FA',
};

export const MIXED_ROUTE_QUOTER_V1_ADDRESSES: AddressMap = {
  [ChainId.ROLLUX]: '0xD8EDc12630284A057461300dE5317b148F7F8926',
};

export const UNISWAP_MULTICALL_ADDRESSES: AddressMap = {
  [ChainId.ROLLUX]: '0x25DAE2f7ad027b29b4e968ecC899F8A8A0f54B2A',
  [ChainId.ROLLUX_TANENBAUM]: '0x0fC3574BFff5FF644A11B7B13A70B484F8e01D08'
};

export const SWAP_ROUTER_02_ADDRESSES = (_chainId: number) => {
  switch (_chainId) {
    case ChainId.ROLLUX_TANENBAUM:
    case ChainId.ROLLUX:
      return '0x347E5995B99CB77dfbe50aDe97b155f1eCD953cD';
    case ChainId.ZKSYS_TANENBAUM:
      return '0x185607836c038549e38847A6d6E65d73176dbf07'
    default:
      throw new Error(`Unknown chain id: ${_chainId}`);
  }
};

export const OVM_GASPRICE_ADDRESS =
  '0x420000000000000000000000000000000000000F';
export const ARB_GASINFO_ADDRESS = '0x000000000000000000000000000000000000006C';
export const TICK_LENS_ADDRESS = '0x6dfd1ea91128733Dc96479b7d1b0F4bC36C31C44';
export const NONFUNGIBLE_POSITION_MANAGER_ADDRESS =
  '0x4dB158Eec5c5d63F9A09535882b835f36d3fd012';

export const V3_MIGRATOR_ADDRESS: AddressMap = {
  ...constructSameAddressMap('0x2b75Ee991F4E5572451E186E5cd2148Ba4B286e5'),
  [ChainId.ZKSYS_TANENBAUM]: '0xd0cBC5dc1D4Fd9dBAbf79246a6fF250E85606D63',
}

export const MULTICALL2_ADDRESS: AddressMap = {
  ...constructSameAddressMap('0xc9E6E07CB460F36A6D5826f70647eff7e1823899'),
  [ChainId.ZKSYS_TANENBAUM]: '0x73470551052d901925e91E64281703a119b85f52',
}

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
  [ChainId.ZKSYS_TANENBAUM]: new Token(
    ChainId.ZKSYS_TANENBAUM,
    '0x8BBb86D74e11C388913000f598A8C0F6B9e35055',
    18,
    'WSYS',
    'Wrapped Syscoin'
  ),
};
