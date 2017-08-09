import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Image, Platform, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import {Container, Content, Header, Card, Form, Item, Input, Label, Icon, Button, Text, Spinner, Left, Right, Body, Title, Tab, Tabs, ScrollableTab} from 'native-base'
import {Actions} from 'react-native-router-flux'
import { Font } from 'expo'
import {getCategoryList} from '../actions'
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
    this.props.getCategoryList();
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
        <Tab tabStyle={{flex: 1, backgroundColor: '#D8DBE2'}}
        textStyle={{color: '#000'}}
        activeTextStyle={{color: '#48A9A6', fontWeight: 'bold'}}
        activeTabStyle={{backgroundColor: '#EAE0CC'}}
        heading={category} key={category}>
          <HabitsList categoryName={category} scene={this.props.sceneKey}/>
        </Tab>
      )
    })
    return tabsArr
  }
  render(){

    console.log(this.props)

    if (!this.state.isReady) {
    
      return <Spinner style={{flex: 1, alignSelf: 'center'}} />;
    }
    const CategoryTabs = this.renderTabs();
    return (
      <Container>
        <Image source={require('./bgnd7.png')} style={{flex: 1, width: null, height: null, resizeMode: "cover"}}>
        <Content style={{paddingTop: (Platform.OS === 'ios') ? 64 : 54}}>
          <Tabs tabStyle={{flex: 1, backgroundColor: '#48A9A6'}} textStyle={{color: '#888'}}
          activeTextStyle={{color: '#fff', fontWeight: 'bold'}}
           tabBarPosition={'top'} tabBarUnderlineStyle={{backgroundColor: "#EE6055"}} renderTabBar={()=> <ScrollableTab activeTextStyle={{backgroundColor: "#FFD97D"}} />}>
            {CategoryTabs}
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

export default connect(mapStateToProps, {getCategoryList})(AddHabit)
