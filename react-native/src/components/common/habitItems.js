import React, { Component } from 'react';
import { ListView, Alert } from 'react-native';
import { Container, Header, Content, Button, Icon, List, ListItem, Text, Left, Right, Body } from 'native-base';
import {connect} from 'react-redux'
import {checkInMyHabit, leaveHabit, joinAHabit} from '../../actions'



var alertMessage = 'Remember, you can check in up to twice per day!'

class HabitItems extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      basic: true,
      listViewData: this.props.props,
      alertOn: false
    };
    this.checkInPressed = this.checkInPressed.bind(this);
    this.deleteHabit = this.deleteHabit.bind(this);
    this.renderIcons = this.renderIcons.bind(this);
    this.renderCountRank = this.renderCountRank.bind(this)
  }

  checkInPressed(data){
    var habitName = data.name.toLowerCase();
    var userToken = this.props.user.data.token
    this.props.checkInMyHabit(userToken, habitName)
  }

  deleteHabit(data){
    var message = 'Deleting...';
    this.props.leaveHabit(this.props.user.data.token, data.name)
    this.props.MyHabitListAlert(message);
  }
  addPressed(data){
    var message = 'Adding your habit...';
    this.props.joinAHabit(this.props.user.data.token, data.name)
    this.props.MyHabitListAlert(message);
  }

  deleteRow(secId, rowId, rowMap) {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.state.listViewData];
    newData.splice(rowId, 1);
    this.setState({ listViewData: newData });
  }

  renderIcons(){
    if(this.props.add){
      return <Icon name="add-circle" />
    }
    else{
      return  <Icon name="checkmark-circle"/>
    }
  }
  renderCountRank(data){
    console.log(data);
    if(!this.props.add){
      return <Text style={{fontSize: 16, alignSelf: 'center'}}> Check-ins: {data.count} Rank: {data.rank}</Text>
    }
  }
  renderAlert(data){
    if(this.props.add){
      return (
        Alert.alert(
          'Add ' + data.name + ' to your habits list',
          '',
          [
            {text: 'Cancel', onPress: ()=>{console.log("alert button")}},
            {text: 'OK', onPress: () => {
              this.addPressed(data);
            }},
          ],
          { cancelable: false }
        )
      )
    }else{
      return (
        Alert.alert(
          'Check in to ' + data.name,
          alertMessage,
          [
            {text: 'Cancel', onPress: ()=>{console.log("alert button")}},
            {text: 'OK', onPress: () => {
              this.checkInPressed(data);
            }},
          ],
          { cancelable: false }
        )
      )
    }
  }
  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    const BtnIcons = this.renderIcons();

    var styling = {}
    if(this.props.allProps.sceneKey == "habitsList"){
      console.log('pass')
      styling = {
        marginTop: 10
      }
    } else {
     styling = {
       marginTop: 0
     }
    }

    return (

          <List style={styling} disableRightSwipe={true}
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
              <ListItem style={{backgroundColor: '#CCDAD1'}}>
                <Left style={{flex: 1, alignItems: 'flex-start', paddingLeft: 10}}>
                  <Button style={{backgroundColor: "#48A9A6"}}onPress={()=> this.renderAlert(data)}>
                    {BtnIcons}
                  </Button>
                </Left>
                <Right style={{flex: 3, paddingRight: 10}}>
                  <Text style={{fontSize:20, fontWeight: '500', alignSelf: 'center'}}>{data.name}</Text>
                  {this.renderCountRank(data)}
                </Right>
              </ListItem>}
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger onPress={()=>
                Alert.alert(
                  "Are you sure you want to cancel",
                  " " + data.name,
                  [
                    {text: 'Delete', onPress: ()=>{
                      this.deleteHabit(data)
                      this.deleteRow(secId, rowId, rowMap)
                    }},
                    {text: 'Back'}
                  ]
                  )}>
                <Icon active name="trash" />
              </Button>}
            leftOpenValue={75}
            rightOpenValue={-75}
            
          />
    );
  }
}

const mapStateToProps = ({habitsInfo, auth})=> {
  const {categories, error, loading} = habitsInfo

  const {user} = auth

  return { categories, error, loading, user }
}


export default connect(mapStateToProps, {checkInMyHabit, leaveHabit, joinAHabit})(HabitItems)
