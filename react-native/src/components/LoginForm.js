import React, {Component} from 'react'
import {Image, Platform, StyleSheet, ActivityIndicator} from 'react-native'
import {connect} from 'react-redux'
import {emailChanged, passwordChanged, loginUser} from '../actions'
import {Container, Content, Header, Card, Form, Item, Input, Label, Icon, Button, Text, Spinner, Left, Right, Body, Title} from 'native-base'
import {Actions} from 'react-native-router-flux'
import { Font } from 'expo'


class LoginForm extends Component{
  constructor(){
    super()
    this.state = {
      isReady: false
    }
  }

  onEmailChange(text){
    this.props.emailChanged(text)
  }

  onPasswordChange(text){
    this.props.passwordChanged(text)
  }

  onButtonPress(){
    const {email, password} = this.props
    this.props.loginUser({email, password})
  }

  renderButton(){
    if (this.props.loading){
      return <ActivityIndicator />
    } else {
    return(
      <Button onPress={this.onButtonPress.bind(this)}style={{flex: 1, marginTop: 30, backgroundColor: "#48A9A6", opacity: 0.8}} iconRight>
        <Text>Log In</Text>
        <Icon name='md-log-in' />
      </Button>
    )
  }
  }
  

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Heebo: require("native-base/Fonts/Heebo_Regular.ttf"),
Roboto_medium: require("native-base/Fonts/Heebo_Regular.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });

    this.setState({ isReady: true });
  }
  render(){
    if (!this.state.isReady) {
      return <Spinner />;
    }
    return (
      <Container>
        <Image source={require('./bgnd3.jpeg')} style={{flex: 1, width: null, height: null, resizeMode: "cover"}}>
        
        {/*<Header style={{backgroundColor: "transparent", marginTop: (Platform.OS === 'ios') ? 0 : 24}}>
          
          <Left style={{flex: 1}}>
            
          </ Left>
          <Body style={{flex: 1}}>
          </ Body>
          <Right style={{flex: 1}}>
            
              <Text style={{color: 'blue'}}>Register</Text>
            
          </Right>
        </Header>*/}

        <Content style={{paddingTop: 54}}>
              <Left style={{flex: 1}} />
              <Body style={{flex: 1}}>
                {/*<Text style={{fontSize: 32, fontWeight: '700'}}>
                  Welcome to
                </Text>*/}
                <Image style={{flex: 1, opacity: 0.8, marginTop: 10}} source={require('./Habitual-logo.png')}></Image>
              </Body>
              <Right style={{flex: 1}} />
            
              <Left style={{flex: 1}} />
              <Body style={{flex: 1}}>
                <Text style={{fontSize: 16, marginTop: 10}}>The Alexa-enabled Social Habit Tracking App</Text>
              </Body>
              <Right style={{flex: 1}} />

              

          <Form style={{marginTop: 55, flex: 1}}>
            <Item style={{flex: 1}}>
              <Label style={{fontWeight: 'bold'}}>Email</Label>
              <Input type={'email'} placeholder="(Your Amazon account email)"
                onChangeText={this.onEmailChange.bind(this)}
                value={this.props.email} />
            </Item>
            <Item style={{flex: 1}}floatingLabel last>
              <Label  style={{fontWeight: 'bold'}} >Password</Label>
              <Input secureTextEntry={true} onChangeText={this.onPasswordChange.bind(this)} value={this.props.password}/>
            </Item>
            
            <Left style={{flex: 1}} />
            <Body style={{flex: 1}}>
              <Text style={{fontSize: 20, alignSelf: 'center', color: 'red'}}>{this.props.error}</Text>
            </Body>
            <Right style={{flex: 1}} />
            <Left style={{flex: 1}} />
            <Body style={{flex: 1}}>
              {this.renderButton()}
            </Body>
            <Right style={{flex: 1}} />

          </Form>
        </Content>
        </Image>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  contentStyle: {
    ...Platform.select({
      ios: {
        paddingTop: 54
      },
      android: {
        paddingTop: 74
      }
    })
  }
})

const mapStateToProps = ({auth}) => {
  const {email, password, error, loading} = auth
  return { email, password, error, loading }
}

export default connect(mapStateToProps, {emailChanged, passwordChanged, loginUser})(LoginForm)