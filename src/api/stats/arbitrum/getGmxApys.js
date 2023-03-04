import { arbitrumWeb3 as web3, multicallAddress } from '../../../utils/web3';
import BigNumber from 'bignumber.js';
import { MultiCall } from 'eth-multicall';
import { ARBITRUM_CHAIN_ID } from '../../../constants';

const Strategy = require('../../../abis/StrategyABI.json');
const RewardTracker = require('../../../abis/arbitrum/RewardTracker.json');
const Distributor = require('../../../abis/arbitrum/Distributor.json');
const fetchPrice = require('../../../utils/fetchPrice');
import getApyBreakdown from '../common/getApyBreakdown';
import { getContractWithProvider } from '../../../utils/contractHelper';
const pools = require('../../../data/arbitrum/gmxPools.json');

const DECIMALS = '1e18';
const SECONDS_PER_YEAR = 31536000;

const getGmxApys = async () => {
  let promises = [];
  let farmAprs = [];
  pools.forEach(pool => promises.push(getPoolApy(pool)));
  const values = await Promise.all(promises);
  for (const item of values) {
    farmAprs.push(item);
  }

  return getApyBreakdown(pools, 0, farmAprs, 0);
};

const getPoolApy = async pool => {
  const [yearlyRewardsInUsd, totalStakedInUsd] = await Promise.all([
    getYearlyRewardsInUsd(pool),
    getTotalStakedInUsd(pool),
  ]);

  return yearlyRewardsInUsd.dividedBy(totalStakedInUsd);
};

const getYearlyRewardsInUsd = async pool => {
  let promises = [];
  let yearlyRewardsInUsd = new BigNumber(0);
  pool.rewardTrackers.forEach(rewardTracker =>
    promises.push(getTrackerRewards(pool, rewardTracker))
  );
  const values = await Promise.all(promises);
  for (const item of values) {
    yearlyRewardsInUsd = yearlyRewardsInUsd.plus(item);
  }

  return yearlyRewardsInUsd;
};

const getTrackerRewards = async (pool, rewardTracker) => {
  const multicall = new MultiCall(web3, multicallAddress(ARBITRUM_CHAIN_ID));
  const rewardTrackerContract = getContractWithProvider(RewardTracker, rewardTracker.address, web3);
  const distibutorContract = getContractWithProvider(Distributor, rewardTracker.distributor, web3);

  const distibutorCalls = [];
  const trackerCalls = [];

  distibutorCalls.push({ rewardPerSecond: distibutorContract.methods.tokensPerInterval() });
  trackerCalls.push({
    stakedAmounts: rewardTrackerContract.methods.stakedAmounts(pool.strategy),
    totalSupply: rewardTrackerContract.methods.totalSupply(),
  });

  const res = await multicall.all([distibutorCalls, trackerCalls]);

  const rewardPerSecond = new BigNumber(res[0].map(v => v.rewardPerSecond));
  const stakedAmounts = new BigNumber(res[1].map(v => v.stakedAmounts));
  const totalSupply = new BigNumber(res[1].map(v => v.totalSupply));
  const rewardPrice = await fetchPrice({ oracle: 'tokens', id: pool.rewardToken });

  const yearlyRewardsInUsd = rewardPerSecond
    .times(SECONDS_PER_YEAR)
    .times(rewardPrice)
    .dividedBy(DECIMALS);
  const strategyRewardsInUsd = yearlyRewardsInUsd.times(totalSupply).dividedBy(totalSupply);

  return strategyRewardsInUsd;
};

const getTotalStakedInUsd = async pool => {
  let staked = 0;
  const stakedTrackerContract = getContractWithProvider(RewardTracker, pool.stakedTracker, web3);
  staked = new BigNumber(await stakedTrackerContract.methods.totalSupply().call());
  const stakedPrice = await fetchPrice({ oracle: pool.oracle, id: pool.tokenId });
  return staked.times(stakedPrice).dividedBy(DECIMALS);
};

module.exports = { getGmxApys };
