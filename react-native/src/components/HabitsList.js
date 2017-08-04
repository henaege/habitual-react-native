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
     await this.props.getHabits(this.props.user.data.token)
    // console.log(this.props.getHabits(this.props.user.data.token))
    // this.props.getHabits(this.props.user.data.token)

    this.setState({ isReady: true });
    
  }

  // componentDidMount(){
  //   console.log(this.props.user)
  //   if (this.props.user != null){
  //     console.log(this.props.getHabits(this.props.user.data.token))
  //     // return(
  //     //   <HabitItems habits={this.props.habits} />
  //     // )
  //   }
  // }


  render(){
    if (!this.state.isReady) {
      console.log(this.props.habits)
      return <Spinner />;
    }
    return (
      <Container>
        <Image source={require('./bgnd5.jpeg')} style={{flex: 1, width: null, height: null, resizeMode: "cover"}}>
        <Content style={{paddingTop: 54}}>
          {/*<HabitItems habits={this.props.getHabits(this.props.user.data.token)}/>*/}
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