import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  AsyncStorage,
  TouchableOpacity,
  Image
} from 'react-native';

import Aplicacao from '../components/Aplicacao'
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Home extends Component {

  constructor() {
    super();
    this.state = {
      apps: [],
      token: '',
      user: ''
    }
  }

  logout() {
    AsyncStorage.clear();
    this.props.navigator.resetTo({
      screen: 'Login',
      title: 'Login',
      navigatorStyle: {
        navBarHidden: true
      }
    });
  }

  showBuildsCallback(slugApp){
    this.props.navigator.push({
      screen: 'Builds',
      title: 'Builds',
      passProps: {
        slugApp : slugApp
      }
    });
  }

  componentDidMount() {
    //load user
    AsyncStorage.getItem('user')
      .then(user =>{
        if(user) {
          this.setState({user : user})
        }
      });

    //load token
    AsyncStorage.getItem('token')
      .then(token => {
        if (token) {
          this.setState({token})
        }
      })
      .then(() => {

        fetch('https://api.bitrise.io/v0.1/me/apps',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'token ' + this.state.token
            }
          })
          .then(resposta => resposta.json())
          .then(json =>
            this.setState({ apps: json })
          ).catch(err =>
            console.error('deu ruim')
          )

      })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={{uri: this.state.user.avatar_url}} style={styles.foto}/>
          <Text style={styles.title}>Bitrise Companion</Text>
          <TouchableOpacity onPressIn={() => this.logout()} style={styles.button_exit}>
            <Icon size={30} name="exit-to-app" color="#fff"/>
          </TouchableOpacity>
        </View>
        <FlatList style={styles.lista}
          keyExtractor={item => item.slug}
          data={this.state.apps.data}
          renderItem={({ item }) =>
            <Aplicacao app={item}
              showBuildsCallback={this.showBuildsCallback.bind(this)} />
          }
        />
      </View>
    );
  }
}
const width = Dimensions.get('screen').width;
const margin = Platform.OS == 'ios' ? 20 : 0;

const styles = StyleSheet.create({
  container: {
    marginTop: margin,
    flex: 1,
  },
  header: {
    height: 50,
    backgroundColor: '#3aa792',
    flexDirection: 'row'
  },
  button_exit:{
    marginRight: 5,
    justifyContent: 'center',
  },
  title: {
    flex:1,
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center'
  }
});
