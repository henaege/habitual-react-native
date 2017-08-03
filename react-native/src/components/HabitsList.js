import React, {Component} from 'react'
import {Image, Platform, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import {HabitItems} from './common/HabitItems'
import {Container, Content, Header, Card, Form, Item, Input, Label, Icon, Button, Text, Spinner, Left, Right, Body, Title, List, ListItem, Thumbnail} from 'native-base'
import {Actions} from 'react-native-router-flux'
import { Font } from 'expo'
import {getHabits, getCategoryList} from '../actions'

class HabitsList extends Component{
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

  componentDidMount(){
    console.log(this.props.user)
    if (this.props.user != null){
      console.log(this.props.getHabits(this.props.user.data.token))
      // return(
      //   <HabitItems habits={this.props.habits} />
      // )
    }
  }


  render(){
    if (!this.state.isReady) {
      return <Spinner />;
    }
    return (
      <Container>
        <Image source={require('./bgnd5.jpeg')} style={{flex: 1, width: null, height: null, resizeMode: "cover"}}>
        <Content style={{paddingTop: 54}}>

        </Content>
        </Image>
      </Container>
    )
  }
}

const mapStateToProps = ({habitsInfo, auth}) => {
  const {habits, categories, error, loading} = habitsInfo

  const {user} = auth

  return { habits, categories, error, loading, user }
}

export default connect(mapStateToProps, {getHabits, getCategoryList})(HabitsList)