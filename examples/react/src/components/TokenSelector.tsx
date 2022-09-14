import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import React from 'react';
import Box from '@mui/joy/Box';
import FormLabel from '@mui/joy/FormLabel';

export interface TokenSelectorProps {
    onChange: (el: any) => void;
    type: 'from' | 'to';
    tokens: { name: string; address: string; }[];
    loading: boolean;
}

const TokenSelector = ({ onChange, type, tokens, loading }: TokenSelectorProps) => {
    const label = type === 'from' ? 'From token: ' : 'To token';

    return (
        <Box sx={{width: 150}}>
            <FormLabel htmlFor="select-field-pet">{label}</FormLabel>
            <Select onChange={ onChange } disabled={ loading } size="md" defaultValue={tokens[0].address}>
                {tokens.map(token => (<Option key={token.address+token.name} value={token.address}>{token.name}</Option>))}
            </Select>
        </Box>
    );
}

export default TokenSelector;
