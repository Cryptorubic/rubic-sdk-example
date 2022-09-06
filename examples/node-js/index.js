const express = require('express');
const app = express();
const port = 3000;

const SDK = require('rubic-sdk');
const {BLOCKCHAIN_NAME, InstantTrade} = require("rubic-sdk");

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/calculate', async (req, res) => {
    const fromAddress = req.query.fromAddress;
    if (!fromAddress) {
        res.send('Wrong from address');
    }

    const toAddress = req.query.toAddress;
    if (!toAddress) {
        res.send('Wrong to address');
    }

    const amount = req.query.amount;
    if (!amount) {
        res.send('Wrong from amount');
    }

    const fromBlockchain = req.query.fromBlockchain;
    if (!fromBlockchain) {
        res.send('Wrong from blockchain');
    }

    const toBlockchain = req.query.toBlockchain;
    if (!toBlockchain) {
        res.send('Wrong to blockchain');
    }

    const rubicSdk = await SDK.SDK.createSDK(
        {
            rpcProviders: {
                [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
                    mainRpc: 'https://bsc-dataseed.binance.org/'
                },
                [BLOCKCHAIN_NAME.POLYGON]: {
                    mainRpc: 'https://polygon-rpc.com'
                }
            }
        }
    )

    try {
        if (fromBlockchain === toBlockchain) {
            const wrappedTrades = await (rubicSdk.instantTrades.calculateTrade(
                { address: fromAddress, blockchain: fromBlockchain },
                String(amount),
                toAddress
            ));
            const bestTrade = wrappedTrades.filter(el => !el.error)[0];
            res.send(`Min amount out: ${bestTrade.toTokenAmountMin.stringWeiAmount}`);
        } else {
            const wrappedTrades = await (rubicSdk.crossChain.calculateTrade(
                { address: fromAddress, blockchain: fromBlockchain },
                String(amount),
                { address: toAddress, blockchain: toBlockchain }
            ));
            const bestTrade = wrappedTrades[0];
            res.send(`Min amount out: ${bestTrade.trade.toTokenAmountMin.toFixed()}`);
        }
    } catch {
        res.send('Calculation error.');
    }

    res.send(`from: ${fromAddress}, to: ${toAddress}, amount: ${amount}, fromBlockchain: ${fromBlockchain}, toBlockchain: ${toBlockchain}`);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
