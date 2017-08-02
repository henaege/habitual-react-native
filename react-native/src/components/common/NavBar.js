import React, { Component } from 'react';
import {Header, Left, Right, Body, Title} from 'native-base'
import { Actions, Router, Scene } from 'react-native-router-flux';

class NavBar extends Component {
  render() {
    return (

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

    )
  }
}