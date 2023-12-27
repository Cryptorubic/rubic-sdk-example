const express = require('express');
const app = express();
const port = 3000;

const SDK = require('rubic-sdk');
const {BLOCKCHAIN_NAME} = require("rubic-sdk");

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/calculate', async (req, res) => {
    const fromAddress = req.query.fromAddress;
    if (!fromAddress) {
        res.send('Wrong from address');
        return;
    }

    const toAddress = req.query.toAddress;
    if (!toAddress) {
        res.send('Wrong to address');
        return;
    }

    const amount = req.query.amount;
    if (!amount) {
        res.send('Wrong from amount');
        return;
    }

    const fromBlockchain = req.query.fromBlockchain;
    if (!fromBlockchain) {
        res.send('Wrong from blockchain');
        return;
    }

    const toBlockchain = req.query.toBlockchain;
    if (!toBlockchain) {
        res.send('Wrong to blockchain');
        return;
    }

    const rubicSdk = await SDK.SDK.createSDK(
        {
            rpcProviders: {
                [BLOCKCHAIN_NAME.ETHEREUM]: {
                    rpcList: ['https://rpc.ankr.com/eth/']
                },
                [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
                    rpcList: ['https://rpc.ankr.com/bsc']
                },
                [BLOCKCHAIN_NAME.POLYGON]: {
                    rpcList: ['https://polygon-rpc.com']
                }
            }
        }
    )

    try {
        if (fromBlockchain === toBlockchain) {
            const wrappedTrades = await (rubicSdk.onChainManager.calculateTrade(
                { address: fromAddress, blockchain: fromBlockchain },
                String(amount),
                toAddress
            ));
            console.log(wrappedTrades);
            const bestTrade = wrappedTrades.filter(el => !el.error)[0];
            res.send(`Min amount out: ${bestTrade.toTokenAmountMin.stringWeiAmount}, provider: ${bestTrade.type}`);
            return;
        } else {
            const wrappedTrades = await (rubicSdk.crossChainManager.calculateTrade(
                { address: fromAddress, blockchain: fromBlockchain },
                String(amount),
                { address: toAddress, blockchain: toBlockchain }
            ));
            const bestTrade = wrappedTrades[0];
            res.send(`Min amount out: ${bestTrade.trade.toTokenAmountMin.toFixed()}, provider: ${bestTrade.tradeType}`);
            return;
        }
    } catch(err) {
        console.log(err);
        res.send('Calculation error.');
        return;
    }

    res.send(`from: ${fromAddress}, to: ${toAddress}, amount: ${amount}, fromBlockchain: ${fromBlockchain}, toBlockchain: ${toBlockchain}`);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
