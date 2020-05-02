import React, { Component } from 'react';
import {View, TextInput, Text, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, AsyncStorage} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import injectedJavaScript from '../constants/injectedJavasScript';
const injectedJavaScriptString = injectedJavaScript;

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isLogged: false,
            isLogging: false,
            isMapDisplayed: true,
            isDetectionDisplay: true,
            login: '',
            password: '',
            currentPage: 'test',
            error: null,
            url: 'http://nainwak.fr/jeu/',
            injectedJavaScript: injectedJavaScriptString,
        };
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            title: 'Nainwak',
            headerLeft: null,
            headerRight: null,
        });

        AsyncStorage.getItem('login_data').then((data) => {
            if (data) {
                const dataParsed = JSON.parse(data);
                this.setState({
                    login: dataParsed.login,
                    password: dataParsed.password,
                })
            }
        }, (e) => {
            console.log('e', e);
        });
    }

    headerLeft = () => {
        return (
            <View>
                { this.state.currentPage === 'jeu' ? (
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity key="map"
                                          style={{marginLeft: 15}}
                                          onPress={() => {
                                              this.setState({
                                                  isMapDisplayed: !this.state.isMapDisplayed,
                                                  isDetectionDisplay : true,
                                              })
                                          }}>
                            <Icon name="map" padding={5} size={20} backgroundColor="#F75C03" color="#DD7700">
                            </Icon>
                        </TouchableOpacity>
                    </View>
                ) : null }
            </View>
        )
    };

    headerRight = () => {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity key="menu"
                                  style={{marginRight: 15}}
                                  onPress={() => {
                                      this.setState({isDetectionDisplay: !this.state.isDetectionDisplay, isMapDisplayed: false})
                                  }}>
                    <Icon name="navicon" padding={5} size={20} backgroundColor="#F75C03" color="#DD7700">
                    </Icon>
                </TouchableOpacity>
            </View>
        );
    };

    onNavigationStateChange = () => {
        this.setState({
            isLoading: !this.state.isLoading,
        });
    };

    handleMessage = (e) => {
        let data = JSON.parse(e.nativeEvent.data);
        let currentPage = data.page;
        if (currentPage === 'jeu' && this.state.isLogged === false) {
            this.setState({
                isLogged: true,
            }, () => {
                this.props.navigation.setOptions({
                    title: `${data.name.trim()} (${data.papv.trim()})`,
                    headerLeft: this.headerLeft,
                    headerRight: this.headerRight,
                });
            })
        }

        if (currentPage === 'login') {
            this.setState({
                isLogged: false,
                isLogging: false,
            })
        }

        if (data.error) {
            AsyncStorage.removeItem('login_data');
            this.setState({
                error: data.error,
                isLogging: false,
                injectedJavaScript: injectedJavaScriptString,
            }, () => {
                this.refs['nainwak'].goBack();
            });
        }

        this.setState({
            currentPage,
        });
    };

    signIn = () => {
        let i = injectedJavaScriptString;
        i = i.replace('LOGIN', this.state.login);
        i = i.replace('PASSWORD', this.state.password);

        let data = {
            login: this.state.login,
            password: this.state.password,
        };

        AsyncStorage.setItem('login_data', JSON.stringify(data));
        this.setState({
            isLogging: true,
            injectedJavaScript: i,
            error: null,
        }, () => {
            this.refs['nainwak'].reload();
        })
    };

    getTopOffset = () => {
      let top = 0;

      if (!this.state.isMapDisplayed) {
          top = -296;
      }

      if (!this.state.isDetectionDisplay) {
          top = - Math.round(Dimensions.get('window').height) - 296;
      }

      return top;
    };

    render() {
        return (
            <View style={styles.container}>

                { this.state.isLoading ? <ActivityIndicator size="large" color="#DD7700" style={{backgroundColor: '#fff', padding: 20}}/> : null }
                <WebView ref="nainwak" source={{ uri: this.state.url }}
                         onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                         injectedJavaScript={this.state.injectedJavaScript}
                         javaScriptEnabled = {true}
                         domStorageEnabled = {true}
                         onMessage={this.handleMessage}
                         style={[styles.webView, {top: this.getTopOffset()} ]}
                />

                { this.state.isLogged === false ? (
                    <View style={styles.loginView}>
                        { this.state.isLogging ? <ActivityIndicator size="large" color="#DD7700" style={{backgroundColor: '#fff', padding: 20}}/> : (
                            <View style={{width: '100%', alignItems: 'center'}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold', paddingBottom: 20}}>
                                    Connexion
                                </Text>
                                <TextInput
                                    style={styles.inputBox}
                                    value={this.state.login}
                                    onChangeText={(login) => {this.setState({login})}}
                                    placeholder='Votre identifiant'
                                    autoCapitalize='none'
                                />
                                <TextInput
                                    style={styles.inputBox}
                                    value={this.state.password}
                                    onChangeText={(password) => {this.setState({password})}}
                                    secureTextEntry={true}
                                    visiblePassword={true}
                                    placeholder='Mot de passe'
                                    autoCapitalize='none'
                                />

                                { this.state.error ? (
                                    <View>
                                        <Text style={{paddingTop: 20, textAlign: 'center', fontWeight: 'bold', color:'#ff2432'}}>{this.state.error}</Text>
                                    </View>
                                ) : null }

                                <TouchableOpacity onPress={this.signIn} style={[styles.shadow, {backgroundColor: '#DD7700', marginTop: 30, padding: 15, borderRadius: 5, width: 200}]}>
                                    <Text style={{textAlign: 'center', color: '#fff', fontWeight: 'bold'}}>Jouer</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ) : null }

            </View>
        );
    }
}

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        position: 'relative',
    },
    loginView: {
        position: 'absolute',
        backgroundColor: 'white',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    webView: {
        position: 'absolute',
        backgroundColor: 'white',
        top: -296,
        bottom: - (Math.round(Dimensions.get('window').height) + 100),
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actions: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 100,
        zIndex: 1000
    },
    button: {
        textAlign: 'center',
        padding: 5,
        backgroundColor: '#fdfdfd',
        borderWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: 0,
        borderColor: '#ededed',
    },
    option: {
        backgroundColor: '#fdfdfd',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: 0,
        borderColor: '#ededed',
    },
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center'
    },
});
