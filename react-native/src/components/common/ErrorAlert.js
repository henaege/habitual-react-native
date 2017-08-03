import React from 'react'
import { Alert } from 'react-native'

const ErrorAlert = (props) => {
   return (
         Alert.alert(
            {this.props.errorMessage}
         )
   )
}


export { ErrorAlert };