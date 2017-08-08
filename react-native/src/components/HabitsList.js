import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Image, Platform, StyleSheet, Alert, View} from 'react-native'
import {connect} from 'react-redux'
import HabitItems from './common/habitItems'
import {Container, Content, Header, Card, Form, Item, Input, Label, Icon, Button, Text, Spinner, Left, Right, Body, Title, List, ListItem, Thumbnail} from 'native-base'
import {Actions} from 'react-native-router-flux'
import { Font } from 'expo'
import {getUserHabits, getCategoryList, getHabitsFail, getHabitsFromCategory} from '../actions'

class HabitsList extends Component{
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
    this.setState({isReady: true, listUpdated: !this.state.listUpdated})
  }


  componentWillMount() {
      if(this.props.categoryName !== undefined){
        this.props.getHabitsFromCategory(this.props.categoryName);
      }else{
        this.props.getUserHabits(this.props.user.data.token)
      }
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
              Actions.habitsList()
            }},
          ],
          { cancelable: false }
        )
      )
  }
  render(){

    var sceneKey1 = this.props.sceneKey

    if (!this.state.isReady) {
    
      return <Spinner style={{flex: 1, alignSelf: 'center'}} />;
    }
    if(this.props.categoryName !== undefined){
      return <HabitItems props={this.props.habits} sceneKey1={sceneKey1} MyHabitListAlert={this.renderAlert} add={true}/>
    }
    else{
      
      return (  
        <Container>
          <Image source={require('./bgnd5.jpeg')} style={{flex: 1, width: null, height: null, resizeMode: "cover"}}>
          <Content style={{paddingTop: 54}}>
            <HabitItems props={this.props.userHabits} MyHabitListAlert={this.renderAlert} sceneKey1={sceneKey1}/>
            {this.renderEmpty()}
          </Content>
          </Image>
        </Container>
      )
    }
  }
}

const mapStateToProps = ({habitsInfo, auth}) => {
  const {habits, userHabits, categories, error, loading, message, rank} = habitsInfo
  const {user} = auth

  return { habits, userHabits, categories, error, loading, user, message, rank}
}

export default connect(mapStateToProps, {getUserHabits, getCategoryList, getHabitsFail, getHabitsFromCategory})(HabitsList)