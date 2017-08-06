import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Image, Platform, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import {Container, Content, Header, Card, Form, Item, Input, Label, Icon, Button, Text, Spinner, Left, Right, Body, Title, Tab, Tabs, ScrollableTab} from 'native-base'
import {Actions} from 'react-native-router-flux'
import { Font } from 'expo'
import {getHabits, getCategoryList} from '../actions'
import HabitsList from './HabitsList';

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
  }
  componentWillReceiveProps(newProps){
    console.log(newProps)
    if(newProps.categories !== undefined){
      this.setState({isReady: true})
    }
  }

  componentWillMount() {
      if(this.props.categories === undefined){
        this.props.getCategoryList();
      }
  }
  renderTabs(){
    var tabsArr = [];
    this.props.categories.map((category)=>{
      tabsArr.push(
        <Tab heading={category}>
          <HabitsList categoryName={category} />
        </Tab>
      )
    })
    return tabsArr;
  }
  render(){
    console.log(this.state.isReady);
    if (!this.state.isReady) {
    
      return <Spinner style={{flex: 1, alignSelf: 'center'}} />;
    }
    return (
      <Container>
        <Image source={require('./bgnd4.jpeg')} style={{flex: 1, width: null, height: null, resizeMode: "cover"}}>
        <Content style={{paddingTop: 54}}>
          <Tabs renderTabBar={()=> <ScrollableTab />}>
            {this.renderTabs().bind(this)}
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
