import React, { FC } from 'react';
import Form from './components/Form';
import { CssVarsProvider } from '@mui/joy/styles';

export const Main: FC = () => (
    <CssVarsProvider>
        <Form />
    </CssVarsProvider>
)
