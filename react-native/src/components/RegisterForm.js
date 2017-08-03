import React, {Component} from 'react'
import {Image} from 'react-native'
import {connect} from 'react-redux'
import {emailChanged, passwordChanged, registerUser} from '../actions'
import {Container, Content, Header, Card, Form, Item, Input, Label, Icon, Button, Text, Spinner, Left, Right, Body, Title} from 'native-base'
import {Actions} from 'react-native-router-flux'


class RegisterForm extends Component{
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

  onConfirmPasswordChange(text){
    this.props.confirmPassword(text)
  }

  onNameChange(text){
    this.props.nameChanged(text)
  }

  onButtonPress(){
    const {email, password} = this.props
    this.props.registerUser({email, password})
  }

  renderButton(){
    if (this.props.loading){
      return <Spinner />
    } else {
    return(
      <Button onPress={this.onButtonPress.bind(this)}style={{marginTop: 20, backgroundColor: "#48A9A6", opacity: 0.8}} iconRight>
        <Text>Register</Text>
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
        <Image source={require('./bgnd2.jpeg')} style={{flex: 1, width: null, height: null, resizeMode: "cover"}}>
        
        <Header style={{backgroundColor: "transparent", opacity: 0.8, marginTop: 24}}>
          
          <Left style={{flex: 1}}>
            
          </ Left>
          <Body style={{flex: 1}}>
          
            <Title style={{alignSelf: "center"}}>Register</Title>
          </ Body>
          <Right style={{flex: 1}}>
            <Button onPress={()=> Actions.login()}size={10}transparent>
              <Text>Login</Text>
            </Button>
          </Right>
        </Header>

        <Content style={{marginTop: 20}}>
              <Left style={{flex: 1}} />
              <Body style={{flex: 1}}>
                <Text style={{fontSize: 32, fontWeight: '700', fontFamily: "Heebo"}}>
                  Welcome to
                </Text>
                <Image style={{flex: 1, opacity: 0.9, marginTop: 10}} source={require('./Habitual-logo.png')}></Image>
              </Body>
              <Right style={{flex: 1}} />
            
              <Left style={{flex: 1}} />
              <Body style={{flex: 1}}>
                <Text style={{fontSize: 16, marginTop: 10, fontFamily: 'Heebo'}}>The Alexa-enabled Social Habit Tracking App</Text>
              </Body>
              <Right style={{flex: 1}} />

              

          <Form style={{marginTop: 20, flex: 1}}>
            <Item style={{flex: 1}}>
              <Label style={{fontWeight: 'bold'}}>Email</Label>
              <Input type={'email'} placeholder="(Your Amazon account email)"
                onChangeText={this.onEmailChange.bind(this)}
                value={this.props.email} />
            </Item>
            <Item style={{flex: 1}}>
              <Label style={{fontWeight: 'bold'}}>Name</Label>
              <Input type={'text'} placeholder="Name"
                onChangeText={this.onNameChange.bind(this)}
                value={this.props.name} />
            </Item>
            <Item style={{flex: 1}}floatingLabel last>
              <Label  style={{fontWeight: 'bold'}} >Password</Label>
              <Input secureTextEntry={true} onChangeText={this.onPasswordChange.bind(this)} value={this.props.password}/>
            </Item>
            <Item style={{flex: 1}}floatingLabel last>
              <Label  style={{fontWeight: 'bold'}} >Confirm Password</Label>
              <Input secureTextEntry={true} onChangeText={this.onConfirmPasswordChange.bind(this)} value={this.props.confirmPassword}/>
            </Item>
            
            <Left style={{flex: 1}} />
            <Body style={{flex: 1}}>
              <Text style={{fontSize: 20, alignSelf: 'center', color: 'red'}}>{this.props.error}</Text>
              
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

const styles = {
  formStyle: {
    flex: 1,
    marginTop: 60
  }
}

const mapStateToProps = ({auth}) => {
  const {email, password, confirmPassword, error, loading, name} = auth
  return { email, password, confirmPassword, error, loading, name}
}

export default connect(mapStateToProps, {emailChanged, passwordChanged})(RegisterForm)