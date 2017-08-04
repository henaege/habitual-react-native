import React, { Component } from 'react';
import { ListView, Alert } from 'react-native';
import { Container, Header, Content, Button, Icon, List, ListItem, Text, Left, Right, Body } from 'native-base';
import {connect} from 'react-redux'

var alertMessage = 'Remember, you can check in up 2 twice per day!'

class HabitItems extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      basic: true,
      listViewData: this.props.props,
    };
  }

  checkInPressed(){

  }

  deleteRow(secId, rowId, rowMap) {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.state.listViewData];
    newData.splice(rowId, 1);
    this.setState({ listViewData: newData });
  }
  render() {
    console.log(this.props.habits);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    return (

          <List style={{marginTop: 10}} disableRightSwipe={true}
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
              <ListItem >
                <Left style={{flex: 1, alignItems: 'flex-start', paddingLeft: 10}}>
                  <Button onPress={()=>
                    Alert.alert(
                      'Check In to ' + data,
                        alertMessage,
                        [
                          {text: 'Cancel'}, 
                          {text: 'OK', onPress:()=>{this.checkInPressed.bind(this)}}
                        ]
                        )} style={{backgroundColor: "#48A9A6", opacity: 0.9}}>
                  <Icon name="checkmark-circle"/>
                  </Button>
                </Left>
                <Right style={{flex: 3, paddingRight: 10}}><Text style={{fontSize:20, fontWeight: '500', alignSelf: 'center'}}>{data}</Text>
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


export default HabitItems;
