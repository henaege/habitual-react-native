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
      isReady: false,
      categoryList: []
    }

    this.setCategoryList = this.setCategoryList.bind(this);
  }

  componentWillReceiveProps(newProps){
    if(newProps.categories !== undefined){
      if(this.state.categoryList.length === 0){
        this.setCategoryList(newProps);
      }
      this.setState({isReady: true})
    }
  }

  componentWillMount() {
      if(this.props.categories === undefined){
        this.props.getCategoryList();
      }
  }
  setCategoryList(newProps){
    var categoryArr = [];
    newProps.categories.map((category)=>{
      categoryArr.push(category)
    })
    this.setState({
      categoryList: categoryArr
    })
  }
  renderTabs(){
    var tabsArr = [];
    this.state.categoryList.map((category)=>{
      tabsArr.push(
        <Tab heading={category} key={category}>
          <HabitsList categoryName={category} />
        </Tab>
      )
    })
    return tabsArr
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
            {this.renderTabs()}
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
