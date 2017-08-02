import React from 'react'
import {Scene, Router, Actions} from 'react-native-router-flux'

import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import HabitsList from './components/HabitsList'
import AddHabit from './components/AddHabit'
import NavBar from './components/common/NavBar'

const RouterComponent = () => {
  return(
    <Router >
      <Scene key="auth" navigationBarStyle={{opacity: 0}}>
        <Scene key='register' component={RegisterForm} />
        <Scene key='login' component={LoginForm} initial />
      </Scene>
      <Scene onRight={()=> Actions.addHabit()} rightTitle="Add" key="main" navigationBarStyle={{backgroundColor:'transparent'}}>
        <Scene key='habitsList' component={HabitsList} />
        <Scene key="addHabit" component={AddHabit} title="Add habit">

        </Scene>
      </Scene>
    </Router>
  )
}

export default RouterComponent