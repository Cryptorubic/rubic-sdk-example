import { BLOCKCHAIN_NAME, Configuration } from 'rubic-sdk';

export const configuration: Configuration = {
    rpcProviders: {
        [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
            rpcList: ['https://bsc-dataseed.binance.org/', 'https://rpc.ankr.com/bsc'],
            mainRpcTimeout: 8000
        },
        [BLOCKCHAIN_NAME.POLYGON]: {
            rpcList: ['https://polygon-rpc.com', 'https://polygon.llamarpc.com'],
            mainRpcTimeout: 8000
        }
    }
}
