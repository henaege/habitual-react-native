import React, { Component } from 'react';
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import reducers from './src/reducers'
import ReduxThunk from 'redux-thunk'
import LoginForm from './src/components/LoginForm'
import Router from './src/Router'
import { Root } from 'native-base';



 class App extends Component {

  render() {
    return (
      <Root>
        <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
          <Router />
        </Provider>
      </Root>
    )
  }
}

export default App
