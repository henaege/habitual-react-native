import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Image, Platform, StyleSheet, Alert, View} from 'react-native'
import {connect} from 'react-redux'
import HabitsList from './common/HabitsList';
import {Container, Content, Header, Card, Form, Item, Input, Label, Icon, Button, Text, Spinner, Left, Right, Body, Title, List, ListItem, Thumbnail} from 'native-base'
import {Actions} from 'react-native-router-flux'
import { Font } from 'expo'
import {getUserHabits} from '../actions/habitsActions';

class UserHabitsList extends Component{
  constructor(){
    super()
    this.state = {
      isReady: false,
      listUpdated: false,
    }

    this.renderAlert = this.renderAlert.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this)
  }

  componentWillReceiveProps(newProps){
    console.log(newProps);
    this.setState({isReady: true })
  }


  componentWillMount() {
    this.props.getUserHabits(this.props.user.data.token)
  }

  renderEmpty(){
    if (this.props.error.length > 0){
      return (
        <Button disabled full><Text>{this.props.error}</Text></Button>
        )
    }   
  }

  renderAlert(message){
      return (
       Alert.alert(
          message,
          '',
          [
            {text: 'OK', onPress: () => {
            }},
          ],
          { cancelable: false }
        )
      )
  }
  render(){
    if (!this.state.isReady) {
    
      return <Spinner style={{flex: 1, alignSelf: 'center'}} />;
    }
    else{  
      return (  
        <Container>
          <Image source={require('../images/bgnd8.png')} style={{flex: 1, width: null, height: null, resizeMode: "cover"}}>
          <Content>
            <HabitList props={this.props.userHabits} MyHabitListAlert={this.renderAlert} allProps={this.props}/>
            {this.renderEmpty()}
          </Content>
          </Image>
        </Container>
      )
    }
  }
}

const mapStateToProps = ({habitsListInfo, auth}) => {
  const {userHabits, error, loading, message} = habitsListInfo
  const {user} = auth

  return {userHabits, error, loading, user, message}
}

export default connect(mapStateToProps, {getUserHabits})(HabitsList)