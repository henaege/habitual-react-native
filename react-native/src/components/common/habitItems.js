import React, { Component } from 'react';
import { ListView, Alert } from 'react-native';
import { Container, Header, Content, Button, Icon, List, ListItem, Text, Left, Right, Body } from 'native-base';
import {connect} from 'react-redux'
import {checkInMyHabit} from '../../actions'

var alertMessage = 'Remember, you can check in up to twice per day!'

class HabitItems extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      basic: true,
      listViewData: this.props.props,
    };
    this.checkInPressed = this.checkInPressed.bind(this);
    this.deleteHabit = this.deleteHabit.bind(this)
  }

  checkInPressed(data){
    var habitName = data.toLowerCase();
    console.log(habitName)
    this.props.checkInMyHabit(this.props.user.token, habitName)
  }

  deleteHabit(data){
    this.props.leaveHabit(this.props.user.token, data)
  }

  deleteRow(secId, rowId, rowMap, data) {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.state.listViewData];
    newData.splice(rowId, 1);
    this.props.leaveHabit(this.props.user.token, data);
    this.setState({ listViewData: newData });
  }
  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    return (

          <List style={{marginTop: 10}} disableRightSwipe={true}
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
              <ListItem >
                <Left style={{flex: 1, alignItems: 'flex-start', paddingLeft: 10}}>
                  <Button full onPress={()=>
                    Alert.alert(
                      'Check in to ' + data,
                      alertMessage,
                      [
                        {text: 'Cancel', onPress: ()=>{console.log("alert button")}},
                        {text: 'OK', onPress: () => {
                          this.checkInPressed(data);
                        }},
                      ],
                      { cancelable: false }
                    )}>
                    <Icon name="checkmark-circle"/>
                  </Button>
                </Left>
                <Right style={{flex: 3, paddingRight: 10}}>
                  <Text style={{fontSize:20, fontWeight: '500', alignSelf: 'center'}}>
                    {data}
                  </Text>
                </Right>
              </ListItem>}
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger onPress={()=> {
                Alert.alert(
                  "Are you sure you want to cancel " + data,
                  [
                    {text: 'Delete', onPress: ()=>{
                      this.deleteHabit(data)
                      this.deleteRow(secId, rowId, rowMap, data)
                    }},
                    {text: 'Back'}
                  ]
                  )}}>
                <Icon active name="trash" />
              </Button>}
            leftOpenValue={75}
            rightOpenValue={-75}
            
          />
    );
  }
}

const mapStateToProps = ({habitsInfo, auth})=> {
  const {habits, categories, error, loading} = habitsInfo

  const {user} = auth

  return { habits, categories, error, loading, user }
}


export default connect(mapStateToProps, {checkInMyHabit})(HabitItems)
