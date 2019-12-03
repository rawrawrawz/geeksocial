import React, { Component } from 'react';
import api from '../services/api';
import io from 'socket.io-client';
import { View, Image, Text, StyleSheet, TouchableOpacity, BackHandler,RefreshControl } from 'react-native';
import plus from '../assets/plus.png';
import { FlatList } from 'react-native-gesture-handler';
import more from '../assets/more.png';
import like2 from '../assets/like2.png';
import comment from '../assets/comment.png';
import logout from '../assets/logout.png';
import {AsyncStorage} from 'react-native';
import logonome from '../assets/logonome.png';



export default class Feed extends Component {

    //ARMAZENAR USUARIO
    async setItem(key, value) {
        try {
            return await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
        }
    }

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

   
    
    //FUNCAO DELETE
    async delete(id, autor) {

        cabeca = await this.getItem('@OtakuApp:nome');
        if(cabeca == autor){
            await this.setItem('@OtakuApp:delete', id)
            api.post(`/posts/${id}/delete`);            
            
           alert('Post excluido');
        }else{
            alert('Você só pode excluir suas fotos');
        }
        console.log(id, autor);
        console.log(cabeca);
    }

    static navigationOptions = ({ navigation }) => ({
                
        headerTitle: <Image style={{ height:40, width:'100%', marginTop:7}} source={logonome}/>,
        headerStyle: {
            backgroundColor: "#03A9F4",
            
            
        },
        headerRight:(
            <TouchableOpacity style={{ marginRight: 15, marginTop: 3 }} onPress={() => navigation.navigate('Login')}>
            <Image style={{ height: 25, width: 25 }} source={logout} />
        </TouchableOpacity>

        ),
        headerLeft: (
        <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.navigate('Upload')}>
                <Image style={{ height: 25, width: 25 }} source={plus} />
            </TouchableOpacity>
        )
        
    });
    //SETAR OS CAMPOS
    state = {
        feed: [],
        logout: this.getItem('@OtakuApp:logado'),
        refreshing: false,    
    };

    
    // _onRefresh() {
    //     this.setState({refreshing: true});
    //     fetchData().then(() => {
    //       this.setState({refreshing: false});
    //     });
    //   }

    //BUSCA OS DADOS DO BACK
    async componentDidMount() {
        this.registerToSocket();

        const response = await api.get('posts');
        const sair = await this.getItem('@OtakuApp:logado');
        this.setState({logout: sair})
        this.setState({ feed: response.data });
    }

        registerToSocket = () => {
        const socket = io('http://10.0.3.2:3333');

        socket.on('post', newPost => {
            this.setState({ feed: [newPost, ... this.state.feed] });
        })
        
        socket.on('like', likedPost => {
            this.setState({
                feed: this.state.feed.map(post => post._id == likedPost._id ? likedPost : post)
            });
        })
    }

    //FUNÇÃO DE LIKE
    handleLike = id => {
        api.post(`/posts/${id}/like`);
        
    }

    
    //CORPO
    render() {

        return (
            <View style={styles.container}>
                          
                               
                <FlatList 
                // refreshControl={
                //     <RefreshControl
                //       refreshing={this.state.refreshing}
                //       onRefresh={this._onRefresh.bind(this)}
                //     />
                //   }
                data={ this.state.FlatListItems }
                
                    data={this.state.feed}
                    keyExtractor={post => post._id}
                    renderItem={({ item }) => (
                        <View style={styles.feedItem}>

                            <View style={styles.feedItemHeader}>
                                <View style={styles.userInfo}>
                                    <Text style={styles.name}>{item.autor}</Text>
                                    <Text style={styles.place}>{item.lugar}</Text>

                                </View>
                                <TouchableOpacity id={item._id}  onPress={() => {this.delete(item._id, item.autor)}}>
                                    <Image source={more} />
                                    
                                </TouchableOpacity>
                            </View>

                            <Image style={styles.feedImage} source={{ uri: `http://10.0.3.2:3333/files/${item.imagem}` }} />

                            <View style={styles.feedItemFooter}>
                                <View style={styles.actions}>
                                    <TouchableOpacity style={styles.action} onPress={() => { this.handleLike(item._id) }}>
                                        <Image style={{ height: 18, width: 18 }} source={like2} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.action} onPress={() => { }}>
                                        <Image source={comment} />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.likes}>{item.curtidas} curtidas</Text>

                                <Text style={styles.description}>{item.descricao}</Text>

                                <Text style={styles.hashtags}>{item.hashtags}</Text>
                            </View>

                        </View>
                    )}
                />
            </View>
            
        );
    }
}

//ESTILIZAÇÃO
const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    feedItem: {
        marginTop: 20
    },
    feedItemHeader: {
        paddingHorizontal: 15,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 14,
        color: '#000'
    },
    place: {
        fontSize: 12,
        color: '#666',
        marginTop: 2
    },
    feedImage: {
        width: '100%',
        height: 400,
        marginVertical: 15,
    },
    feedItemFooter: {
        paddingHorizontal: 15,
    },
    actions: {
        flexDirection: 'row'
    },
    action: {
        marginRight: 8,
    },
    likes: {
        marginTop: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    description: {
        lineHeight: 18,
        color: '#000',
    },
    hashtags: {
        color: '#039BE5',
    },
});