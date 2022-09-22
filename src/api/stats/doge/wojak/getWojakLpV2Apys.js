const BigNumber = require('bignumber.js');
const { MultiCall } = require('eth-multicall');
const { dogeWeb3: web3, multicallAddress } = require('../../../../utils/web3');

const MasterChef = require('../../../../abis/doge/WojakMasterChefV2.json');
const ERC20 = require('../../../../abis/ERC20.json');
const fetchPrice = require('../../../../utils/fetchPrice');
const pools = require('../../../../data/doge/wojakLpPoolsV2.json');
const { compound } = require('../../../../utils/compound');
const { BASE_HPY, DOGE_CHAIN_ID } = require('../../../../constants');
const { getTradingFeeApr } = require('../../../../utils/getTradingFeeApr');
const { cakeClient } = require('../../../../apollo/client');
import { getFarmWithTradingFeesApy } from '../../../../utils/getFarmWithTradingFeesApy';
import { PCS_LPF } from '../../../../constants';
import { getContract, getContractWithProvider } from '../../../../utils/contractHelper';

const masterchef = '0x065AAE6127D2369C85fE3086b6707Ac5dBe8210a';
const oracle = 'tokens';
const oracleId = 'WOJK';
const DECIMALS = '1e18';
const secondsPerBlock = 2;
const secondsPerYear = 31536000;

const pancakeLiquidityProviderFee = PCS_LPF;

export const getWojakLpV2Apys = async () => {
  let apys = {};
  let apyBreakdowns = {};

  const tokenPrice = await fetchPrice({ oracle, id: oracleId });
  const { blockRewards, totalAllocPoint } = await getMasterChefData();
  const { balances, allocPoints } = await getPoolsData(pools);

  const pairAddresses = pools.map(pool => pool.address);
  const tradingAprs = await getTradingFeeApr(
    cakeClient,
    pairAddresses,
    pancakeLiquidityProviderFee
  );

  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i];

    const beefyPerformanceFee = pool.beefyFee ? pool.beefyFee : 0.045;
    const shareAfterBeefyPerformanceFee = 1 - beefyPerformanceFee;

    const lpPrice = await fetchPrice({ oracle: 'lps', id: pool.name });
    const totalStakedInUsd = balances[i].times(lpPrice).dividedBy('1e18');

    const poolBlockRewards = blockRewards.times(allocPoints[i]).dividedBy(totalAllocPoint);

    const yearlyRewards = poolBlockRewards.dividedBy(secondsPerBlock).times(secondsPerYear);
    const yearlyRewardsInUsd = yearlyRewards.times(tokenPrice).dividedBy(DECIMALS);

    const simpleApy = yearlyRewardsInUsd.dividedBy(totalStakedInUsd);
    // console.log(pool.name, totalStakedInUsd.valueOf(), yearlyRewards.valueOf(), yearlyRewardsInUsd.valueOf(),  simpleApy.valueOf(), allocPoints[i].valueOf(), totalAllocPoint.valueOf(), poolBlockRewards.valueOf())
    const vaultApr = simpleApy.times(shareAfterBeefyPerformanceFee);
    const vaultApy = compound(simpleApy, BASE_HPY, 1, shareAfterBeefyPerformanceFee);
    const tradingApr = tradingAprs[pool.address.toLowerCase()] ?? new BigNumber(0);
    const totalApy = getFarmWithTradingFeesApy(
      simpleApy,
      tradingApr,
      BASE_HPY,
      1,
      shareAfterBeefyPerformanceFee
    );
    const legacyApyValue = { [pool.name]: totalApy };
    // Add token to APYs object
    apys = { ...apys, ...legacyApyValue };

    // Create reference for breakdown /apy
    const componentValues = {
      [pool.name]: {
        vaultApr: vaultApr.toNumber(),
        compoundingsPerYear: BASE_HPY,
        beefyPerformanceFee: beefyPerformanceFee,
        vaultApy: vaultApy,
        lpFee: pancakeLiquidityProviderFee,
        tradingApr: tradingApr.toNumber(),
        totalApy: totalApy,
      },
    };
    // Add token to APYs object
    apyBreakdowns = { ...apyBreakdowns, ...componentValues };
  }

  // Return both objects for later parsing
  return {
    apys,
    apyBreakdowns,
  };
};

const getMasterChefData = async () => {
  const masterchefContract = getContractWithProvider(MasterChef, masterchef, web3);
  const blockRewards = new BigNumber(await masterchefContract.methods.wojkPerBlock(true).call());
  const totalAllocPoint = new BigNumber(
    await masterchefContract.methods.totalRegularAllocPoint().call()
  );
  return { blockRewards, totalAllocPoint };
};

const getPoolsData = async pools => {
  const masterchefContract = getContract(MasterChef, masterchef);
  const multicall = new MultiCall(web3, multicallAddress(DOGE_CHAIN_ID));
  const balanceCalls = [];
  const allocPointCalls = [];
  pools.forEach(pool => {
    const tokenContract = getContract(ERC20, pool.address);
    balanceCalls.push({
      balance: tokenContract.methods.balanceOf(masterchef),
    });
    allocPointCalls.push({
      allocPoint: masterchefContract.methods.poolInfo(pool.poolId),
    });
  });

  const res = await multicall.all([balanceCalls, allocPointCalls]);

  const balances = res[0].map(v => new BigNumber(v.balance));
  const allocPoints = res[1].map(v => v.allocPoint['2']);
  return { balances, allocPoints };
};
