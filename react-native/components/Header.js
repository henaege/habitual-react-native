import React from 'react';
import {StyleSheet} from 'react-native';
import {Header, Left, Right, Body, Button, Icon, Title } from 'native-base';


const Head = (props)=>{
	const {HeaderStyle, positionStyle} = styles;
	return(
		<Header style={HeaderStyle}>
          
          <Left style={positionStyle}>
            <Button size={10}transparent>
              <Icon name='menu' />
            </Button>
          </ Left>
          <Body style={{positionStyle}}>
          
            <Title style={{alignSelf: "center"}}>{props.header}</Title>
          </ Body>
          <Right style={positionStyle}/>
		</Header>
	)
}
const styles = {
	HeaderStyle: {
		marginTop: 24, 
		backgroundColor: "#48A9A6", 
		opacity: 0.8
	},
	positionStyle:{
		flex:1
	}
}
export {Head};
