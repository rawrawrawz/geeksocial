import React, { Component } from 'react';
import { View } from 'react-native';
import { TouchableOpacity, TextInput, Text, Image, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import api from '../services/api';
import {AsyncStorage} from 'react-native';


export default class Upload extends Component {
    

    static navigationOptions = {
        headerTitle: 'Nova publicação'
    };
    //ARMAZENAR USUARIO
    async getItem(key) {
        return await AsyncStorage.getItem(key)
            .then((result) => {
                if (result) {
                    try {
                        result = JSON.parse(result);
                    } catch (e) {
                    }
                }
                return result;
            });
    
    }
    //SETAR CAMPOS
    state = {
        preview: null,
        imagem: null,
        autor: '',        
        lugar: '',
        descricao: '',
        hashtags: '',
        logado: this.getItem('@OtakuApp:nome'),        
    };

    //SELECIONAR IMAGEM
    handleSelectImage = () => {
        ImagePicker.showImagePicker({
            title: 'Selecionar a imagem',
        }, upload => {
            if (upload.error){
                console.log('Error');
            }else if (upload.didCancel){
                console.log('Used canceled');
            } else {
                const preview = {
                    uri: `data:imagem/jpeg;base64,${upload.data}`,
                }

                let prefix;
                let ext;

                if (upload.fileName) {
                    [prefix, ext] = upload.fileName.split('.')
                    ext = ext.toLowerCase() == 'heic' ? 'jpg' : ext;
                }else{
                    prefix = new Date().getTime();
                    ext = 'jpg';
                }

                const imagem = {
                    uri: upload.uri,
                    type: upload.type,
                    name: `${prefix}.${ext}`
                };

                this.setState({ preview, imagem });
            }
        })
    }

    //ENVIAR POST
    handleSubmit = async () => {
        const data = new FormData();
        const user = await this.getItem('@OtakuApp:nome');
        
        data.append('imagem', this.state.imagem);
        data.append('autor', user);
        data.append('lugar', this.state.lugar);
        data.append('descricao', this.state.descricao);
        data.append('hashtags', this.state.hashtags);

        await api.post('posts', data)
        

        
        

        this.props.navigation.navigate('Feed');


    }

    //CORPO
    render() {
        console.log(this.state.logado);
        
        return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.selectButton} onPress={this.handleSelectImage}>
                <Text style={styles.selectButtonText}>Selecionar imagem</Text>
            </TouchableOpacity>

            {this.state.preview && <Image style={styles.preview} source={this.state.preview} /> }
            
            <TextInput
                style={styles.input}
                autoCorret={false}
                autoCapitalize="none"
                placeholder="Local"
                placeholderTextColor="#999"
                value={this.state.lugar}
                onChangeText={lugar => this.setState({ lugar })}
            />

            <TextInput
                style={styles.input}
                autoCorret={false}
                autoCapitalize="none"
                placeholder="Descrição"
                placeholderTextColor="#999"
                value={this.state.descricao}
                onChangeText={descricao => this.setState({ descricao })}
            />

            <TextInput
                style={styles.input}
                autoCorret={false}
                autoCapitalize="none"
                placeholder="Hashtags"
                placeholderTextColor="#999"
                value={this.state.hashtags}
                onChangeText={hashtags => this.setState({ hashtags })}
            />

            <TouchableOpacity style={styles.shareButton} onPress={this.handleSubmit}>
                <Text style={styles.shareButtonText}>
                    Compartilhar</Text>
            </TouchableOpacity>

        </View>

        );
    }
}

//ESTILIZAÇÃO
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    height: 42,

    justifyContent: 'center',
    alignItems: 'center',
  },

  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },

  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 4,
  },

  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginTop: 10,
    fontSize: 16,
  },

  shareButton: {
    backgroundColor: '#0288D1',
    borderRadius: 4,
    height: 42,
    marginTop: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },

  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
});
