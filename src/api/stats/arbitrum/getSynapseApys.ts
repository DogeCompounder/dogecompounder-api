import { arbitrumWeb3 } from '../../../utils/web3';
import { ARBITRUM_CHAIN_ID } from '../../../constants';

import { getMiniChefApys } from '../common/getMiniChefApys';

import SynapseMiniChefV2 from '../../../abis/arbitrum/SynapseMiniChefV2.json';
import _pools from '../../../data/arbitrum/synapsePools.json';
const pools: SingleAssetPool[] = _pools;

import { addressBook } from '../../../../packages/address-book/address-book';
import { SingleAssetPool } from '../../../types/LpPool';
import { AbiItem } from 'web3-utils';

const {
  arbitrum: {
    platforms: {
      synapse: { chef },
    },
    tokens: { SYN },
  },
} = addressBook;

export const getSynapseApys = () => {
  return getMiniChefApys({
    minichefConfig: {
      minichef: chef,
      minichefAbi: SynapseMiniChefV2 as AbiItem[],
      outputOracleId: SYN.symbol,
      tokenPerSecondContractMethodName: 'synapsePerSecond',
    },
    pools,
    web3: arbitrumWeb3,
    chainId: ARBITRUM_CHAIN_ID,
  });
};
