import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Image, Platform, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import {getHabits, getCategoryList} from '../actions'
import {Container, Content, Header, Card, Form, Item, Input, Label, Icon, Button, Text, Spinner, Left, Right, Body, Title, Tab, Tabs, ScrollableTab} from 'native-base'
import {Actions} from 'react-native-router-flux'
import { Font } from 'expo'

class AddHabit extends Component{
  constructor(){
    super()
    this.state = {
      isReady: false
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
  componentWillReceiveProps(newProps){
    // console.log(newProps)
    this.setState({isReady: true})
  }

  componentWillMount() {
       this.props.getCategoryList();
  }
  render(){
    if (!this.state.isReady) {
      return <Spinner />;
    }
    return (
      <Container>
        <Image source={require('./bgnd4.jpeg')} style={{flex: 1, width: null, height: null, resizeMode: "cover"}}>
        <Content style={{paddingTop: 54}}>
          <Tabs renderTabBar={()=> <ScrollableTab />}>
            <Tab heading="Exercise">
              <HabitItems props={this.props.habits} />
            </Tab>
          <Tab heading="Health & Wellness">
            <HabitItems props={this.props.habits} />
          </Tab>
          <Tab heading="Learning">
            <HabitItems props={this.props.habits} />
          </Tab>
          <Tab heading="Self-improvement">
            <HabitItems props={this.props.habits} />
          </Tab>
          <Tab heading="Other">
            <HabitItems props={this.props.habits} />
          </Tab>
        </Tabs>
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

export default connect(mapStateToProps, {getHabits, getCategoryList})(AddHabit)
