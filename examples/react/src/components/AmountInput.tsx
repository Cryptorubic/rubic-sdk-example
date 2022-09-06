import React from "react";
import FormLabel from "@mui/joy/FormLabel";
import {TextField} from "@mui/joy";
import Box from "@mui/joy/Box";

export interface AmountInputProps {
    onChange: (el: unknown) => void;
    value: number;
    loading: boolean;
}

const AmountInput = ({ value, onChange, loading }: AmountInputProps) => (
    <Box sx={{ width: 320 }}>
        <FormLabel htmlFor="select-field-pet">From amount</FormLabel>
        <TextField disabled={ loading } type={ 'number' } value={ value } onChange={ onChange } placeholder="Enter amount" />
    </Box>
);

export default AmountInput;
