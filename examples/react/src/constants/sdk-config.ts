import { BLOCKCHAIN_NAME, Configuration } from 'rubic-sdk';

export const configuration: Configuration = {
    rpcProviders: {
        [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
            mainRpc: 'https://bsc-dataseed.binance.org/'
        },
        [BLOCKCHAIN_NAME.POLYGON]: {
            mainRpc: 'https://polygon-rpc.com'
        }
    }
}
