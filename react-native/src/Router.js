import React from 'react'
import PropTypes from 'prop-types';
import {Scene, Router, Actions} from 'react-native-router-flux'
import {Platform, StatusBar} from 'react-native'

import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import HabitsList from './components/HabitsList'
import AddHabit from './components/AddHabit'

const RouterComponent = () => {
  return(
    <Router>
     
      <Scene key="auth1">

        <Scene onRight={()=> Actions.auth2()} key='login' component={LoginForm} title="Welcome" titleStyle={{color: '#D8DBE2' }}rightTitle="Register" navigationBarStyle={{backgroundColor: 'transparent', paddingTop: (Platform.OS === 'android') ? 14 : 0, paddingBottom: (Platform.OS === 'android') ? 24 : 0, borderColor: 'transparent'}} />
      </Scene>
      <Scene key="auth2">
        <Scene onRight={()=> Actions.auth1()} key='register' component={RegisterForm} title="Welcome" rightTitle="Log In" navigationBarStyle={{backgroundColor: 'transparent', paddingTop: (Platform.OS === 'android') ? 14 : 0}} />
      </Scene>
      
      <Scene key="main" title="Your Habits:" >
        <Scene onRight={()=> Actions.addHabit()}
          type='reset' rightTitle="Add" key='habitsList'
          title="Your Habits" component={HabitsList}
          navigationBarStyle={{backgroundColor:"#48A9A6",
          opacity: 0.8, paddingTop: (Platform.OS === 'android')
          ? 14 : 0, paddingBottom: (Platform.OS === 'android')
          ? 24 : 0, borderColor: 'transparent'}}
          renderBackButton={() => (null)} initial/>

        <Scene key="addHabit" component={AddHabit} title="Add Habit" navigationBarStyle={{backgroundColor:(Platform.OS === 'android') ? 'transparent': "#48A9A6", opacity: 0.8, paddingTop: (Platform.OS === 'android') ? 14 : 0, paddingBottom: (Platform.OS === 'android') ? 24 : 0, borderColor: 'transparent'}}/>
      </Scene> 
    </Router>
  )
}

export default RouterComponent