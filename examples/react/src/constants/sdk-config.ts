import { BLOCKCHAIN_NAME, Configuration } from 'rubic-sdk';

export const configuration: Configuration = {
  rpcProviders: {
    [BLOCKCHAIN_NAME.AVALANCHE]: {
      mainRpc: 'https://rpc.ankr.com/avalanche_fuji'
    },
    [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
      mainRpc: 'https://bsc-dataseed.binance.org/'
    },
    [BLOCKCHAIN_NAME.POLYGON]: {
      mainRpc: 'https://polygon-rpc.com'
    },
    [BLOCKCHAIN_NAME.FANTOM]: {
      mainRpc: 'https://rpc.ftm.tools'
    },
  }
}