import React from 'react';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket',
    ' AsyncStorage ',
    'React state update'    
])


import Routes from './routes';

export default function app() {
    return <Routes />
}