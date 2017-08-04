import React, { Component } from 'react';
import { ListView } from 'react-native';
import { Container, Header, Content, Button, Icon, List, ListItem, Text, Left, Right, Body } from 'native-base';
import {connect} from 'react-redux'


class HabitItems extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      basic: true,
      listViewData: this.props.props,
    };
  }

  

  deleteRow(secId, rowId, rowMap) {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.state.listViewData];
    newData.splice(rowId, 1);
    this.setState({ listViewData: newData });
  }
  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    return (

          <List style={{marginTop: 10}}
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
              <ListItem style={{flex: 1}}>
                <Left style={{flex: 1, alignItems: 'flex-start', paddingLeft: 10}}>
                  <Icon name="arrow-dropleft"/>
                </Left>
                <Body style={{flex: 2, alignItems: 'center'}}>
                  <Text style={{fontSize:20, fontWeight: '500'}}>{data}</Text>
                </Body>
                <Right style={{flex: 1, alignItems: 'flex-end', paddingRight: 10}}>
                  <Icon name="arrow-dropright"/>
                </Right>
              </ListItem>}
            renderLeftHiddenRow={data =>
              <Button full onPress={() => alert(data)}>
                <Icon active name="checkmark-circle" />
              </Button>}
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
