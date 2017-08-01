import React from 'react';
import {StyleSheet, Image} from 'react-native'
import { Container, Header, Title, Content, Footer, FooterTab, Left, Right, Body, Text, Spinner, Form, Item, Input, Label, Button, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });

    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <Spinner />;
    }
    return (
      <Container>
        <Image source={require('./bgnd2.jpeg')} style={{flex: 1, width: null, height: null, resizeMode: "cover"}}>
        
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
        
        <Content style={{marginTop: 55}}>
              <Left style={{flex: 1}} />
              <Body style={{flex: 1}}>
                <Text style={{fontSize: 32, fontWeight: '700'}}>
                  Welcome to Habitual
                </Text>
              </Body>
              <Right style={{flex: 1}} />
            
              <Left style={{flex: 1}} />
              <Body style={{flex: 1}}>
                <Text style={{fontSize: 20}}>The Social Habit App</Text>
              </Body>
              <Right style={{flex: 1}} />

              

          <Form style={{marginTop: 55, flex: 1}}>
            <Item style={{flex: 1}}>
              <Label style={{fontWeight: 'bold'}}>Email</Label>
              <Input placeholder="(Your Amazon account email)"/>
            </Item>
            <Item style={{flex: 1}}floatingLabel last>
              <Label style={{fontWeight: 'bold'}}>Password</Label>
              <Input />
            </Item>
            
            <Left style={{flex: 1}} />
            <Body style={{flex: 1}}>
              <Button style={{marginTop: 30, backgroundColor: "#48A9A6", opacity: 0.8}} iconRight>
                <Text>Log In</Text>
                <Icon name='md-log-in' />
              </Button>
            </Body>
            <Right style={{flex: 1}} />
          
          
          </Form>
          
        </Content>
        </Image>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
