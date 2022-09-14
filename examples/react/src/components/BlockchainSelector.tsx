import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import React from 'react';
import {BLOCKCHAIN_NAME, BlockchainName} from "rubic-sdk";
import Box from '@mui/joy/Box';
import FormLabel from '@mui/joy/FormLabel';

interface BlockchainSelectorProps {
    type: 'from' | 'to';
    onSelectBlockchain: (event: BlockchainName | null) => void;
    value: BlockchainName;
    loading: boolean;
}

const blockchains = [
    {
        value: BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN,
        label: 'BNB Chain'
    },
    {
        value: BLOCKCHAIN_NAME.POLYGON,
        label: 'Polygon'
    }
];

const BlockchainSelector = ({ type, onSelectBlockchain, value, loading }: BlockchainSelectorProps) => {
    const label = type === 'from' ? 'From blockchain: ' : 'To blockchain';
    const selectBlockchain = (blockchain: any) => { onSelectBlockchain(blockchain) };

    return (
        <Box marginRight={ '20px' } sx={{ width: 150 }}>
            <FormLabel htmlFor="select-field-pet">{label}</FormLabel>
            <Select disabled={ loading } value={ value } size="md" defaultValue={ blockchains[0].value } onChange={ selectBlockchain }>
                { blockchains.map(blockchain => (<Option key={blockchain.value} value={blockchain.value}>{blockchain.label}</Option>))}
            </Select>
        </Box>
    );
}

export default BlockchainSelector;
