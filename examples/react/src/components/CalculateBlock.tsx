import {Box, Button, TextField} from "@mui/joy";
import {CrossChainTrade, OnChainTrade, PriceTokenAmount} from "rubic-sdk";
import React from "react";

interface CalculateBlockProps {
    amount: number;
    fromToken: any;
    toToken: any;
    onCalculate: (el: any) => void;
    trade?: OnChainTrade | CrossChainTrade | null;
    loading: boolean;
}

const getAmount = (trade: OnChainTrade | CrossChainTrade | undefined | null) => {
    if (!trade) {
        return '';
    }
    if (trade?.toTokenAmountMin instanceof PriceTokenAmount) {
        return trade?.toTokenAmountMin.tokenAmount?.toFixed()
    } else {
        return trade?.toTokenAmountMin.toFixed();
    }
}


const CalculateBlock = ({ onCalculate, trade, loading }: CalculateBlockProps) => {
    return <Box marginTop={ '20px' } style={ { 'display': 'flex', 'gap': '20px' } }>
        <Button disabled={ loading } onClick={ onCalculate } >Calculate trade</Button>
        <TextField type={ 'text' } disabled={ true } value={ getAmount(trade) } />
    </Box>
}

export default CalculateBlock;
