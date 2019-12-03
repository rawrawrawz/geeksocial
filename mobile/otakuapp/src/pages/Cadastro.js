import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import api from '../services/api';
import PropTypes from 'prop-types';


export default class Cadastro extends Component {
    static navigationOptions = {
        headerTitle: 'Cadastro',
        backgroundColor: '#B2EBF2'
    };    

    static propTypes = {
        navigation: PropTypes.shape({
          navigate: PropTypes.func,
          dispatch: PropTypes.func,
        }).isRequired,
      };
    //SETAR OS CAMPOS
    state = {
        usuario: '',
        email: '',
        password: '',
        error: '',
      };
    
      handleUsuarioChange = (usuario) => {
        this.setState({ usuario });
      };

      handleEmailChange = (email) => {
        this.setState({ email });
      };
    
      handlePasswordChange = (password) => {
        this.setState({ password });
      };
               
      //FUNÇÃO CADASTRO
      handleSignUpPress = async () => {
        if (this.state.email.length === 0 || this.state.password.length === 0|| this.state.usuario.length === 0) {
          alert('Preencha todos os campos para continuar!', () => false);
        } else {
          try {
            
            const usuario = {
                name: this.state.usuario, 
                email: this.state.email,
                password: this.state.password
            }
    
            console.log('inicio');
            const response = await api.post('http://10.0.3.2:3333/auth/register', usuario);
            
            console.log('resposta');
            if (response.status == 200) {
              alert('Usuário cadastrado com sucesso!');
            }
    
            
            this.props.navigation.navigate('Login');
               
          } 
            catch (_err) {
            console.log('erro');
            let mensagem = 'Houve um problema no cadastro do usuario: '
            if (_err.response.status == 400) {
              mensagem += _err.response.data.error;
              alert(mensagem);

            }
              
          }
        }
      };
      
      //CORPO
    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>


                <View style={styles.form}>
                <Text style={styles.label}> Usuario: </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Seu usuario"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholderTextColor="#999"                       
                        onChangeText={this.handleUsuarioChange}
                        value={this.state.usuario}

                    />

                    <Text style={styles.label}> Email: </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Seu e-mail"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholderTextColor="#999"
                        onChangeText={this.handleEmailChange}
                        value={this.state.email}

                    />
                  
                    <Text style={styles.label}> Senha: </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Sua senha"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholderTextColor="#999"
                        onChangeText={this.handlePasswordChange}
                        value={this.state.password}
                        secureTextEntry

                    />

                    <TouchableOpacity style={styles.button} onPress={this.handleSignUpPress}>
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>
                    
               
                </View>
            </KeyboardAvoidingView>
        );
    }
}

//ESTILIZAÇÃO
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B2EBF2'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#444',
        height: 44,
        marginBottom: 20,
        borderRadius: 2,
        backgroundColor: '#fff'
    },
    label: {
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 8,
    },
    form: {
        alignSelf: 'stretch',
        paddingHorizontal: 30,
        marginTop: 30,
    },
    button: {
        height: 42,
        backgroundColor: '#039BE5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },

});