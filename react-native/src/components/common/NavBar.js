import React, { Component } from 'react';
import {Header, Left, Right, Body, Button, Title, Text, Icon, Container, Spinner} from 'native-base'
import { Actions, Router, Scene } from 'react-native-router-flux';

class NavBar extends Component {
  constructor(){
    super()
    this.state = {
      isReady: false
    }
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Montserrat_Medium.ttf"),
      Roboto_medium: require("native-base/Fonts/Montserrat_Medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });

    this.setState({ isReady: true });
  }
  render(){
    if (!this.state.isReady) {
      return <Spinner />;
    }
    return(
      <Container>
        <Header style={{marginTop: 24, backgroundColor: "#48A9A6", opacity: 0.8}}>
          
          <Left style={{flex: 1}}>
            <Button size={10}transparent>
              <Icon name='menu' />
            </Button>
          </ Left>
          <Body style={{flex: 1}}>
          
            <Title style={{alignSelf: "center"}}>Habitual</Title>
          </ Body>
          <Right style={{flex: 1}}/>
        </Header>
      </Container>
  )
  }
}
export default NavBar