import {BLOCKCHAIN_NAME, BlockchainName, CrossChainTrade, InstantTrade, SDK} from "rubic-sdk";
import React, {useEffect, useState} from "react";
import TokenSelector from "./TokenSelector";
import AmountInput from "./AmountInput";
import BlockchainSelector from "./BlockchainSelector";
import styles from './Form.module.scss';
import {tokens} from "../constants/tokens";
import CalculateBlock from "./CalculateBlock";
import useAsyncEffect from "use-async-effect";
import {configuration} from "../constants/sdk-config";
import LoginBlock from "./LoginBlock";
import Box from "@mui/joy/Box";
import SwapBlock from "./SwapBlock";
import {LifiTrade} from "rubic-sdk/lib/features/instant-trades/dexes/common/lifi/lifi-trade";
import {BlockchainInfo} from "../constants/blockchain-info";

export interface FormProps {}

const Form = ({}: FormProps) => {
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState<string | null>(null);

    const [fromBlockchain, setFromBlockchain] = useState<BlockchainName>(BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN);
    const [toBlockchain, setToBlockchain] = useState<BlockchainName>(BLOCKCHAIN_NAME.POLYGON);

    const [fromFilteredTokens, setFromFilteredTokens] = useState<any>(tokens.filter(el => el.blockchain === fromBlockchain));
    const [toFilteredTokens, setToFilteredTokens] = useState<any>(tokens.filter(el => el.blockchain === toBlockchain));

    const [fromToken, setFromToken] = useState<any | null>(fromFilteredTokens[0]);
    const [toToken, setToToken] = useState<any | null>(toFilteredTokens[0]);

    const [sdk, setSdk] = useState<SDK | null>(null);

    const enterFrom = (address: string) => {
        const token = tokens.find(el => el.address === address && el.blockchain === fromBlockchain);
        setFromToken(token);
    };

    const enterTo = (address: any) => {
        const token = tokens.find(el => el.address === address && el.blockchain === toBlockchain);
        setToToken(token);
    };

    const enterAmount = (el: any) => {
        const amount = el?.target?.value;
        setAmount(amount);
    }

    const onLogin = (address: string | null) => {
        setAddress(address);
    }

    const selectFromBlockchain = (el: any) => {
        setFromBlockchain(el);
    }

    const selectToBlockchain = (el: any) => {
        setToBlockchain(el);
    }

    const setTradeData = async () => {
        if (sdk) {
            setLoading(true);
            try {
                console.log('Calculating trade, be patient...')
                if (fromBlockchain === toBlockchain) {
                    const wrappedTrades = await (sdk.instantTrades.calculateTrade(fromToken, String(amount), toToken))
                    const bestTrade = wrappedTrades.filter(el =>  !(el instanceof LifiTrade))[0];
                    if (bestTrade instanceof InstantTrade) {
                        setTrade(bestTrade);
                    }
                } else {
                    const wrappedTrades = await (sdk.crossChain.calculateTrade(fromToken, String(amount), toToken))
                    console.log('Response:', wrappedTrades)
                    const validTrades = wrappedTrades.filter(x => x.trade != null)
                    const bestTrade = validTrades.length > 0 ? validTrades[0] : undefined
                    if (bestTrade) {
                        console.log('Best trade found:', bestTrade, bestTrade?.trade?.toTokenAmountMin.toString())
                        setTrade(bestTrade.trade);
                    } else {
                        console.log(`0 valid trades found from ${wrappedTrades.length} in the response`)
                    }
                }
            } finally {
                setLoading(false);
            }
        }
    }

    const [trade, setTrade] = useState<CrossChainTrade | InstantTrade | null>(null);

    useEffect(() => {
        const filteredTokens = tokens.filter(el => el.blockchain === fromBlockchain);
        setFromFilteredTokens(filteredTokens);
        setFromToken(filteredTokens[0]);
    }, [fromBlockchain]);

    useEffect(() => {
        const filteredTokens = tokens.filter(el => el.blockchain === toBlockchain);
        setToFilteredTokens(filteredTokens);
        setToToken(filteredTokens[0]);
    }, [toBlockchain]);

    useAsyncEffect(async () => {
        setSdk(await SDK.createSDK(configuration));
        setLoading(false);
    }, [])

    useAsyncEffect(async () => {
        setLoading(true);
        try {
            await sdk?.updateConfiguration({
                ...configuration,
                walletProvider: address ? {
                    core: window.ethereum,
                    chainId: window.ethereum?.networkVersion,
                    address
                } : undefined,
            });
        } finally {
            setLoading(false);
        }
    }, [address])

    return (
        <Box sx={{ width: 400 }}>
            <form className={ styles.form }>
                <LoginBlock onLogin={ onLogin } address={ address }/>
                <div className={ styles.formBlock }>
                    <BlockchainSelector
                        type='from'
                        value={ fromBlockchain }
                        onSelectBlockchain={ selectFromBlockchain }
                        loading={ loading }
                    />
                    {
                        fromFilteredTokens.length
                            ? <TokenSelector
                                tokens={ fromFilteredTokens }
                                type={ 'from' }
                                onChange={ enterFrom }
                                loading={ loading }
                                    />
                            : null
                    }
                </div>
                <div className={ styles.formBlock }>
                    <BlockchainSelector
                        type='to'
                        value={ toBlockchain }
                        onSelectBlockchain={ selectToBlockchain }
                        loading={ loading }
                    />
                    {
                        toFilteredTokens.length
                            ? <TokenSelector
                                tokens={ toFilteredTokens }
                                type={ 'to' }
                                onChange={ enterTo }
                                loading={ loading }
                            />
                            : null
                    }
                </div>

                <AmountInput
                    value={ amount }
                    onChange={ enterAmount }
                    loading={ loading }
                />

                <CalculateBlock
                    amount={ amount }
                    fromToken={ fromToken }
                    toToken={ toToken }
                    onCalculate={ setTradeData }
                    trade={ trade }
                    loading={ loading }
                />

                <SwapBlock trade={ trade } loading={ loading } address={ address } onLoadingChange={setLoading} />
            </form>
        </Box>
    );
}

export default Form;
