import { arbitrumWeb3, avaxWeb3 } from '../../../utils/web3';
import { getSwapPrices } from '../common/swap/getSwapPrices';
import { SingleAssetPool } from '../../../types/LpPool';

import _pools from '../../../data/arbitrum/synapsePools.json';
const pools: SingleAssetPool[] = _pools;

export const getArbiSynapsePrices = async () => {
  return getSwapPrices({
    web3: arbitrumWeb3,
    pools,
  });
};
