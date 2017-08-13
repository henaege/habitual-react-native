import {combineReducers} from 'redux'
import AuthReducer from './reducer_Auth';
<<<<<<< HEAD
import HabitsReducer from './reducer_HabitsList';

export default combineReducers({
  auth: AuthReducer,
  habitsInfo: HabitsReducer,
=======
import HabitsListReducer from './reducer_HabitsList';
import HabitChangeReducer from './reducer_HabitChange'

export default combineReducers({
  auth: AuthReducer,
  habitsListInfo: HabitsListReducer,
  habitChangeInfo: HabitChangeReducer,
>>>>>>> 59bcce3a73c3e4256ee12237fe263bbcd851bc9e
})

