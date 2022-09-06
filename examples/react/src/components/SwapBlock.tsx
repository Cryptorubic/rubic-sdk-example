import {Box, Button, TextField} from "@mui/joy";
import {CrossChainTrade, InstantTrade, PriceTokenAmount} from "rubic-sdk";
import React, {useState} from "react";
import useAsyncEffect from "use-async-effect";

interface SwapBlockProps {
    trade?: InstantTrade | CrossChainTrade | null;
    loading: boolean;
    address: string | null;
    onLoadingChange: (loading: boolean) => void;
}

const handleTrade = async (trade: InstantTrade | CrossChainTrade | undefined | null, isApproved: boolean, loadingHandle: (loading: boolean) => void) => {
    try {
        if (isApproved || trade?.from.address === '0x0000000000000000000000000000000000000000') {
            const result = await trade?.swap({
                onConfirm: (hash: string) => {
                    alert(`Swap transaction ${hash} was sent.`);
                }
            });
            console.log(result);
        } else {
            const result = await trade?.approve({
                onTransactionHash: () => {
                    alert(`Approve transaction was sent.`);
                }
            });
            console.log(result);
        }
    } catch {
        alert('Swap error.');
    }
}


const SwapBlock = ({ trade, loading, address, onLoadingChange }: SwapBlockProps) => {
    const [needApprove, setApprove] = useState(true);
    // if (!trade) {
    //     alert('No trade object.');
    //     return null;
    // }

    useAsyncEffect(async () => {
        const isApproved = await trade?.needApprove() || false;
        setApprove(isApproved);
    }, []);




    // return <Box marginTop={ '20px' } style={ { 'display': 'flex', 'gap': '20px' } }>
    //     <Button disabled={ loading } onClick={ onCalculate } >Calculate trade</Button>
    //     <TextField type={ 'text' } disabled={ true } value={ getAmount(trade) } />
    // </Box>
    return address ? <Box marginTop={ '20px' }>
        <Button fullWidth={ true } disabled={ loading } onClick={ () => handleTrade(trade, needApprove, onLoadingChange) } >
            { needApprove ? 'Approve' : 'Swap' }
        </Button>
    </Box> : null;
}

export default SwapBlock;
