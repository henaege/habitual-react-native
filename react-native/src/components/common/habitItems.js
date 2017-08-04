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
  }

  onDeleteBTN(){
    console.log('button pressed')
  }

  checkInPressed(data){
    console.log(data)
    this.props.checkInMyHabit(this.props.user.token, data)
  }

  deleteRow(secId, rowId, rowMap) {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.state.listViewData];
    newData.splice(rowId, 1);
    this.setState({ listViewData: newData });
  }
  render() {
    console.log(this.props.habits);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    return (

          <List style={{marginTop: 10}} disableRightSwipe={true}
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
              <ListItem >
                <Left style={{flex: 1, alignItems: 'flex-start', paddingLeft: 10}}>
                  <Button
        title="Delete Record"
        onPress={() => Alert.alert(
          'Alert Title',
          'alertMessage',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
            {text: 'OK', onPress:()=> this._onDeleteBTN},
          ],
          { cancelable: false }
        )}
      />
                  <Icon name="checkmark-circle"/>
                  
                </Left>
                <Right style={{flex: 3, paddingRight: 10}}><Text style={{fontSize:20, fontWeight: '500', alignSelf: 'center', textTransform: 'capitalize'}}>{data}</Text>
                </Right>
              </ListItem>}
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger onPress={()=> {
                this.deleteRow(secId, rowId, rowMap)
                alert(data + " has been deleted.")}}>
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
