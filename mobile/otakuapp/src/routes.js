import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Feed from './pages/Feed';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

export default createAppContainer(
    createStackNavigator({
        //PAGINAS DA APLICAÇÃO
        Login,
        Cadastro,
        Feed,
        Upload, 
    }),
);