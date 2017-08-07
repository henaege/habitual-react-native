import React from 'react';
import {Alert} from 'react-native';


const AlertMessage = (props) => {
	console.log('AlertMessage');
   return (
    Alert.alert(
      props.alertTile,
      props.alertMessage,
	  props.btns,
      { cancelable: false }
    )
   )
}


export { AlertMessage }