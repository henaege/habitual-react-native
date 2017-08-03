import {combineReducers} from 'redux'
import AuthReducer from './AuthReducer'
import HabitReducer from './HabitReducer'

export default combineReducers({
  auth: AuthReducer,
  habitsInfo: HabitReducer
})

