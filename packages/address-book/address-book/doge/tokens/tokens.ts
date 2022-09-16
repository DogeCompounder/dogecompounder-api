import { ConstRecord } from '../../../types/const';
import Token from '../../../types/token';

const DOGE = {
  name: 'DogeCoin',
  symbol: 'DOGE',
  address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  chainId: 2000,
  decimals: 18,
  website: '',
  description:
    '',
  logoURI:
    '',
} as const;

const _tokens = {
  KIB: {
    name: 'Kibble',
    symbol: 'KIB',
    address: '0x1e1026ba0810e6391b0f86afa8a9305c12713b66',
    chainId: 2000,
    decimals: 18,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  USDCm: {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0x765277eebeca2e31912c9946eae1021199b39c61',
    chainId: 2000,
    decimals: 6,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  DC: {
    name: 'Dogechain Token',
    symbol: 'DC',
    address: '0x7b4328c127b85369d9f82ca0503b000d09cf9180',
    chainId: 2000,
    decimals: 18,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  USDTm: {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d',
    chainId: 2000,
    decimals: 6,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  DAIm: {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    address: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c',
    chainId: 2000,
    decimals: 18,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
    chainId: 2000,
    decimals: 18,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  WETH: {
    name: 'Wrapped ETH',
    symbol: 'WETH',
    address: '0x9f4614e4ea4a0d7c4b1f946057ec030bee416cbb',
    chainId: 2000,
    decimals: 18,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0x85c2d3bebffd83025910985389ab8ad655abc946',
    chainId: 2000,
    decimals: 6,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  USDT: {
    name: 'Tether USDT',
    symbol: 'USDT',
    address: '0x7f8e71dd5a7e445725f0ef94c7f01806299e877a',
    chainId: 2000,
    decimals: 6,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  DAI: {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    address: '0xb3306f03595490e5cc3a1b1704a5a158d3436ffc',
    chainId: 2000,
    decimals: 18,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  CHEWY: {
    name: 'CHEWY',
    symbol: 'CHEWY',
    address: '0xba2fa659f475f69eeefa245523dba9c14bba7163',
    chainId: 2000,
    decimals: 18,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  YODE: {
    name: 'YodeDEX Token',
    symbol: 'YODE',
    address: '0x6FC4563460d5f45932C473334d5c1C5B4aEA0E01',
    chainId: 2000,
    decimals: 18,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  DOGEPUP: {
    name: 'DOGE PUP TOKEN',
    symbol: 'DOGEPUP',
    address: '0x1b15b9446b9f632a78396a1680daae17f74ce8d9',
    chainId: 2000,
    decimals: 18,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  WBTC: {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0xfA9343C3897324496A05fC75abeD6bAC29f8A40f',
    chainId: 2000,
    decimals: 8,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  BNB: {
    name: 'Binance',
    symbol: 'BNB',
    address: '0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F',
    chainId: 2000,
    decimals: 18,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  BUSD: {
    name: 'BUSD Token',
    symbol: 'BUSD',
    address: '0x332730a4F6E03D9C55829435f10360E13cfA41Ff',
    chainId: 2000,
    decimals: 18,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
  SLURP: {
    name: 'FKSLURPDEV',
    symbol: 'SLURP',
    address: '0x0caE51e1032e8461f4806e26332c030E34De3aDb',
    chainId: 2000,
    decimals: 18,
    logoURI:
      '',
    website: '',
    description:
      '',
  },
} as const;
export const tokens: ConstRecord<typeof _tokens, Token> = _tokens;
