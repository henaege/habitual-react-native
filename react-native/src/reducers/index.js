import {combineReducers} from 'redux'
import AuthReducer from './reducer_Auth';
import HabitsListReducer from './reducer_HabitsList';
import HabitChangeReducer from './reducer_HabitChange'

export default combineReducers({
  auth: AuthReducer,
  habitsListInfo: HabitsListReducer,
  habitChangeInfo: HabitChangeReducer,
})

