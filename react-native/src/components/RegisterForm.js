import React, {Component} from 'react'
import {Image} from 'react-native'
import {connect} from 'react-redux'
import {emailChanged, passwordChanged, nameChanged, confirmPasswordChanged, registerUser, registerUserFail} from '../actions'
import {Container, Content, Header, Card, Form, Item, Input, Label, Icon, Button, Text, Spinner, Left, Right, Body, Title} from 'native-base'
import {Actions} from 'react-native-router-flux'


class RegisterForm extends Component{
  constructor(){
    super()
    this.state = {
      isReady: false,
      passwordNotMatch: false,
      lengthCheck: false
    }
  }

  onEmailChange(text){
    if(this.state.lengthCheck){
      this.setState({
        lengthCheck: false,
        passwordNotMatch: false
      })
      this.props.registerUserFail()
    }
    this.props.emailChanged(text)
  }

  onPasswordChange(text){
    this.props.passwordChanged(text)
  }

  onConfirmPasswordChange(text){
    this.props.confirmPasswordChanged(text)
  }

  onNameChange(text){
    this.props.nameChanged(text)
  }

  onButtonPress(){
    var inputArr = [this.props.password, this.props.confirmPassword, this.props.email];
    inputArr.map((inputItem)=>{
      // console.log(inputItem.length);
      if(inputItem.length < 8){
        this.setState({
          lengthCheck:true
        })
      }
    })
    if(this.props.password != this.props.confirmPassword){
      console.log(this.props.confirmPassword);
      this.setState({
        passwordNotMatch: true
      })
    }else{
      const {email, password, name} = this.props
      this.props.registerUser({email, password, name})
    }
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
  renderForm(){
    if(this.state.lengthCheck){
      return (
          <Form style={{marginTop: 20, flex: 1}}>
            <Item style={{flex: 1}}  error>
              <Label style={{fontWeight: 'bold'}}>Email</Label>
              <Icon name="close-circle"/>
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
            <Item style={{flex: 1}}floatingLabel  error>
              <Label  style={{fontWeight: 'bold'}}>Password</Label>
              <Icon name="close-circle"/>
              <Input secureTextEntry={true} onChangeText={this.onPasswordChange.bind(this)} value={this.props.password}/>
            </Item>
            {this.renderConfirmPassword()}
            
            <Left style={{flex: 1}} />
            <Body style={{flex: 1}}>
              
              {this.renderButton()}
            </Body>
            <Right style={{flex: 1}} />
            </Form>

      )
    }else{
      return(

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
            <Item style={{flex: 1}}floatingLabel>
              <Label  style={{fontWeight: 'bold'}} >Password</Label>
              <Input secureTextEntry={true} onChangeText={this.onPasswordChange.bind(this)} value={this.props.password}/>
            </Item>
            {this.renderConfirmPassword()}
            
            <Left style={{flex: 1}} />
            <Body style={{flex: 1}}>
              
              {this.renderButton()}
            </Body>
            <Right style={{flex: 1}} />
          </Form>
      )
    }
  }
  renderConfirmPassword(){
    if(this.state.passwordNotMatch){
      return (
        <Item style={{flex: 1, flexDirection: 'row'}}floatingLabel error>
            <Label  style={{fontWeight: 'bold'}} >Confirm Password</Label>
            <Icon name="close-circle"/>
            <Input secureTextEntry={true} onChangeText={this.onConfirmPasswordChange.bind(this)} value={this.props.confirmPassword} placeholder="passwords don't match" />
        </Item>
      )
    }else{
      return(
        <Item style={{flex: 1}}floatingLabel>
          <Label  style={{fontWeight: 'bold'}} >Confirm Password</Label>
          <Input secureTextEntry={true} onChangeText={this.onConfirmPasswordChange.bind(this)} value={this.props.confirmPassword} iconRight/>
        </Item>
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

              
              {this.renderForm()}
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

export default connect(mapStateToProps, {emailChanged, passwordChanged, nameChanged, confirmPasswordChanged, registerUser, registerUserFail})(RegisterForm)