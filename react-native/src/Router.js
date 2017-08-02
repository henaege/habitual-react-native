import React from 'react'
import {Scene, Router} from 'react-native-router-flux'
import LoginForm from './components/LoginForm'
import HabitsList from './components/HabitsList'

const RouterComponent = () => {
  return(
    <Router sceneStyle={{paddingTop: 60}}>
      <Scene key="auth" navigationBarStyle={{backgroundColor:'transparent'}}>
        <Scene key='login' component={LoginForm} title="Log In" navigationBarStyle={{backgroundColor:'transparent'}} />
      </Scene>
      <Scene key="main">
        <Scene key='habitsList' component={HabitsList} title='Habits' navigationBarStyle={{backgroundColor:'transparent'}}/>
      </Scene>
    </Router>
  )
}

export default RouterComponent