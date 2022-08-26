import SDK, {BLOCKCHAIN_NAME} from 'rubic-sdk';

// SDK Setup

const config = {
    rpcProviders: {
        [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
            mainRpc: 'https://bsc-dataseed.binance.org/'
        },
        [BLOCKCHAIN_NAME.POLYGON]: {
            mainRpc: 'https://polygon-rpc.com'
        }
    }
};

const rubicSdk = await SDK.createSDK(config);

// On-Chain trade calculation and swap. 1 ETH to USDT

const fromOnChainToken = {
    blockchain: BLOCKCHAIN_NAME.ETHEREUM,
    address: '0x0000000000000000000000000000000000000000'
};

const fromOnChainAmount = 1;

const toTokenAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';

const onChainTrades = await rubicSdk.instantTrades.calculateTrade(
    fromOnChainToken,
    fromOnChainAmount,
    toTokenAddress
);

const bestOnChainTrade = onChainTrades[0];

const receipt = await bestOnChainTrade.swap();

console.log(receipt) // On-Chain transaction receipt

// Cross-Chain trade calculation and swap. 1 ETH to BUSD (in BNB chain)

const fromCrossChainToken = {
    blockchain: BLOCKCHAIN_NAME.ETHEREUM,
    address: '0x0000000000000000000000000000000000000000'
};
const fromCrossChainAmount = 1;

const toToken = {
    blockchain: BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN,
    address: '0xe9e7cea3dedca5984780bafc599bd69add087d56'
};

const crossChainTrades = await rubicSdk.crossChain.calculateTrade(
    fromCrossChainToken,
    fromCrossChainAmount,
    toToken
);

const bestCrossChainTrade = crossChainTrades[0];

const hash = bestCrossChainTrade.trade.swap();

console.log(hash) // Cross Chain transaction receipt
