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
      listUpdated: false
    }

    this.renderAlert = this.renderAlert.bind(this);
  }

  componentWillReceiveProps(newProps){
    console.log(newProps)
    
    this.setState({isReady: true, listUpdated: true})
  }


  componentWillMount() {
      if(this.props.categoryName !== undefined){
        console.log('get habits from category');
        this.props.getHabitsFromCategory(this.props.categoryName);
      }else{
        this.props.getUserHabits(this.props.user.data.token)
      }
  }

  renderAlert(){
    console.log(this.props);
    if(this.props.rank !== undefined && this.props.message.length >1){
      return (
       Alert.alert(
          this.props.message,
          'Your rank is ' + this.props.rank,
          [
            {text: 'OK', onPress: () => {
              this.props.getUserHabits(this.props.user.data.token)
              Actions.habitsList()
            }},
          ],
          { cancelable: false }
        )
      )
    }else{
      if(this.props.message !== undefined && this.props.rank === undefined){
        return (
          Alert.alert(
            this.props.message,
            '',
            [
            {text: 'OK', onPress: () => {
              this.props.getUserHabits(this.props.user.data.token)
            }},
          ],
          )
        )
      }
    }
  }
  render(){
    if (!this.state.isReady) {
    
      return <Spinner style={{flex: 1, alignSelf: 'center'}} />;
    }
    if(this.props.categoryName !== undefined){
      console.log(this.props.habits);
      return <HabitItems props={this.props.habits} add={true}/>
    }
    else{
      console.log(this.props.userHabits);
      return (  
        <Container>
          <Image source={require('./bgnd5.jpeg')} style={{flex: 1, width: null, height: null, resizeMode: "cover"}}>
          <Content style={{paddingTop: 54}}>
            <HabitItems props={this.props.userHabits} />
            {this.renderAlert()}
            <Button disabled full><Text>{this.props.error}</Text></Button>
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