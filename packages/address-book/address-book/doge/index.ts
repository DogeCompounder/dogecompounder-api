import { kibbleswap } from './platforms/kibbleswap';
import { yodeswap } from './platforms/yodeswap';
import { beefyfinance } from './platforms/beefyfinance';
import { boneswap } from './platforms/boneswap';
import { dogemuskswap } from './platforms/dogemuskswap';
import { tokens } from './tokens/tokens';
import { convertSymbolTokenMapToAddressTokenMap } from '../../util/convertSymbolTokenMapToAddressTokenMap';
import Chain from '../../types/chain';
import { ConstInterface } from '../../types/const';

const _doge = {
  platforms: {
    kibbleswap,
    yodeswap,
    boneswap,
    dogemuskswap,
    beefyfinance,
  },
  tokens,
  tokenAddressMap: convertSymbolTokenMapToAddressTokenMap(tokens),
};

export const doge: ConstInterface<typeof _doge, Chain> = _doge;
