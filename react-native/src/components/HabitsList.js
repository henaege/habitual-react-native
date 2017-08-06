import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Image, Platform, StyleSheet, Alert} from 'react-native'
import {connect} from 'react-redux'
import HabitItems from './common/habitItems'
import {Container, Content, Header, Card, Form, Item, Input, Label, Icon, Button, Text, Spinner, Left, Right, Body, Title, List, ListItem, Thumbnail} from 'native-base'
import {Actions} from 'react-native-router-flux'
import { Font } from 'expo'
import {getHabits, getCategoryList, getHabitsFail} from '../actions'

class HabitsList extends Component{
  constructor(){
    super()
    this.state = {
      isReady: false
    }

    this.renderAlert = this.renderAlert.bind(this);
  }

  componentWillReceiveProps(newProps){
    // console.log(newProps)
    this.setState({isReady: true})
  }

  componentWillMount() {
       this.props.getHabits(this.props.user.data.token)
  }

  renderAlert(){
    if(this.props.rank !== undefined && this.props.rank.length >1){
      return (
       Alert.alert(
          this.props.message,
          'Your rank is ' + this.props.rank
        )
      )
    }else{
      // console.log(this.props.message);
      // if(this.props.message !== undefined && this.props.rank.message >1){
      //   return (
      //     Alert.alert(
      //       this.props.message
      //     )
      //   )
      // }
    }
  }
  render(){
    console.log(this.state.isReady);
    if (!this.state.isReady) {
    
      return <Spinner style={{flex: 1, alignSelf: 'center'}} />;
    }
    // console.log(this.props.habits)
    return (
      
      <Container>
        <Image source={require('./bgnd5.jpeg')} style={{flex: 1, width: null, height: null, resizeMode: "cover"}}>
        <Content style={{paddingTop: 54}}>
          <HabitItems props={this.props.habits} />
          {this.renderAlert()}
          <Button disabled full><Text>{this.props.error}</Text></Button>
        </Content>
        </Image>
      </Container>
    )
  }
}

const mapStateToProps = ({habitsInfo, auth}) => {
  const {habits, categories, error, loading, message, rank} = habitsInfo
  const {user} = auth

  return { habits, categories, error, loading, user, message, rank}
}

export default connect(mapStateToProps, {getHabits, getCategoryList, getHabitsFail})(HabitsList)