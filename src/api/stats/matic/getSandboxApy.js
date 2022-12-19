import { MultiCall } from 'eth-multicall';
import { polygonWeb3 as web3, multicallAddress } from '../../../utils/web3';
import { POLYGON_CHAIN_ID as chainId } from '../../../constants';
import getApyBreakdown from '../common/getApyBreakdown';
import { getContract, getContractWithProvider } from '../../../utils/contractHelper';
import BigNumber from 'bignumber.js';

const tradingFees = 0.0002;
const rewardPerWeek = new BigNumber(200000);

const ISandbox = [
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256', name: '' }],
  },
];

const pools = [
  {
    name: 'polygon-single-sand',
    oracleId: 'SAND',
    rewardPool: '0xA6E383bdA26E4c52A3A3a3463552c42494669aBd',
  },
];

export const getSandboxApy = async () => {
  const baseApys = {};
  const farmApys = await getPoolApys(pools);
  const poolsMap = pools.map(p => ({ name: p.name, address: p.name }));
  return getApyBreakdown(poolsMap, baseApys, farmApys, tradingFees);
};

const getPoolApys = async pools => {
  const apys = [];
  const multicall = new MultiCall(web3, multicallAddress(chainId));

  const rewardPoolCalls = [];
  const extraRewardCalls = [];
  pools.forEach(pool => {
    const rewardPool = getContract(ISandbox, pool.rewardPool);
    rewardPoolCalls.push({
      totalSupply: rewardPool.methods.totalSupply(),
    });
  });

  const res = await multicall.all([rewardPoolCalls, extraRewardCalls]);
  const poolInfo = res[0].map(v => ({
    totalSupply: new BigNumber(v.totalSupply),
  }));

  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i];
    const info = poolInfo[i];

    const apy = rewardPerWeek.times('1e18').times(54).div(info.totalSupply);
    apys.push(apy);
  }

  return apys;
};
