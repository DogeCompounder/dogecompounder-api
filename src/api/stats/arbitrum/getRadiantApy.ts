import { MultiCall } from 'eth-multicall';
import { arbitrumWeb3 as web3, multicallAddress } from '../../../utils/web3';
import { ARBITRUM_CHAIN_ID as chainId } from '../../../constants';
import { getContract, getContractWithProvider } from '../../../utils/contractHelper';
import IRadiantPool from '../../../abis/IRadiantPool.json';
import BigNumber from 'bignumber.js';
import getApyBreakdown from '../common/getApyBreakdown';

const secondsPerYear = 31536000;
const radiantPool = '0x2032b9a8e9f7e76768ca9271003d3e43e1616b1f';

const IRadiantPoolAbi = [
  {
    name: 'getReserveData',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'asset', type: 'address' }],
    outputs: [
      { name: 'data', type: 'uint256' },
      { name: 'liquidityIndex', type: 'uint128' },
      { name: 'variableBorrowIndex', type: 'uint128' },
      { name: 'currentLiquidityRate', type: 'uint128' },
      { name: 'currentVariableBorrowRate', type: 'uint128' },
      { name: 'currentStableBorrowRate', type: 'uint128' },
      { name: 'lastUpdateTimestamp', type: 'uint40' },
      { name: 'aTokenAddress', type: 'address' },
      { name: 'stableDebtTokenAddress', type: 'address' },
      { name: 'variableDebtTokenAddress', type: 'address' },
      { name: 'interestRateStrategyAddress', type: 'address' },
      { name: 'id', type: 'uint8' },
    ],
  },
];

const pools = [
  {
    name: 'arbitrum-radiant-wbtc',
    asset: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    oracleId: 'WBTC',
  },
  {
    name: 'arbitrum-radiant-usdt',
    asset: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    oracleId: 'USDT',
  },
  {
    name: 'arbitrum-radiant-usdc',
    asset: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    oracleId: 'USDC',
  },
  {
    name: 'arbitrum-radiant-dai',
    asset: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    oracleId: 'DAI',
  },
  {
    name: 'arbitrum-radiant-weth',
    asset: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    oracleId: 'WETH',
  },
];

export const getRadiantApy = async () => {
  const baseApys = {};
  const farmApys = await getRadiantApys(pools);
  const poolsMap = pools.map(p => ({ name: p.name, address: p.name }));
  return getApyBreakdown(poolsMap, baseApys, farmApys, 0);
};

export const getRadiantApys = async pools => {
  const apys = [];
  const multicall = new MultiCall(web3, multicallAddress(chainId));
  const lendingPoolCalls = [];

  pools.forEach((pool, i) => {
    const lendingPool = getContract(IRadiantPoolAbi, radiantPool);
    lendingPoolCalls.push({
      reserveData: lendingPool.methods.getReserveData(pool.asset),
    });
  });

  const res = await multicall.all([lendingPoolCalls]);
  const poolInfo = res[0].map(v => ({
    supplyApy: new BigNumber(v.reserveData[3]),
    borrowApy: new BigNumber(v.reserveData[4]),
  }));

  for (let i = 0; i < pools.length; i++) {
    const info = poolInfo[i];

    const apy = info.supplyApy.div('1e27');
    apys.push(apy);
  }
  return apys;
};
