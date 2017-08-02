import React, { Component } from 'react';
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import reducers from './src/reducers'
import firebase from 'firebase'
import ReduxThunk from 'redux-thunk'
import LoginForm from './src/components/LoginForm'
import Router from './src/Router'



 class App extends Component {
   componentWillMount(){
     // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBFC8Wc9Sa0eqX4FFQbp0PgW8fVp3cEM6w",
      authDomain: "manager-acb0e.firebaseapp.com",
      databaseURL: "https://manager-acb0e.firebaseio.com",
      projectId: "manager-acb0e",
      storageBucket: "manager-acb0e.appspot.com",
      messagingSenderId: "157943443704"
    };
  firebase.initializeApp(config);
  }
  render() {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        <Router />
      </Provider>
    );
  }
}

export default App
