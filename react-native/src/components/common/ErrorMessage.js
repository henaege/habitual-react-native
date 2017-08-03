import React from 'react'
import { Toast } from 'native-base'

const ErrorMessage = (props) => {
   return (
      Toast.show({
         text:props.errorMessage,
         position:'bottom',
         buttonText: 'Okay'
      })
   )
}


export { ErrorMessage }