import {combineReducers} from 'redux'
import AuthReducer from './reducer_Auth';
import HabitsReducer from './reducer_HabitsList';

export default combineReducers({
  auth: AuthReducer,
  habitsInfo: HabitsReducer,
})

