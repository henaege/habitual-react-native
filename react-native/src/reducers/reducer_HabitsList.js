import {
  GET_HABITS_LIST,
  GET_HABITS_SUCCESS,
  GET_HABITS_FAIL,
  GET_CATEGORIES_LIST,
  GET_CATEGORIES_LIST_SUCCESS,
  GET_CATEGORIES_LIST_FAIL,
  GET_USER_HABITS_LIST,
  GET_USER_HABITS_LIST_SUCCESS,
<<<<<<< HEAD:react-native/src/reducers/reducer_HabitsList.js
  GET_USER_HABITS_LIST_FAIL,
  HABIT_CHECK_IN,
  HABIT_CHECK_IN_SUCCESS,
  HABIT_CHECK_IN_FAIL,
  LEAVE_HABIT,
  LEAVE_HABIT_SUCCESS,
  LEAVE_HABIT_FAIL,
  JOIN_HABIT,
  JOIN_HABIT_SUCCESS,
  JOIN_HABIT_FAIL,
=======
  GET_USER_HABITS_LIST_FAIL
>>>>>>> 59bcce3a73c3e4256ee12237fe263bbcd851bc9e:react-native/src/reducers/reducer_HabitsList.js
} from '../actions/types';

const INITIAL_STATE = {
  habits: [],
  categories: undefined,
  error: '',
  message: '',
  loading: false,
<<<<<<< HEAD:react-native/src/reducers/reducer_HabitsList.js
  userHabits: [],
  count: '',
  rank: '',
=======
  userHabits: []
>>>>>>> 59bcce3a73c3e4256ee12237fe263bbcd851bc9e:react-native/src/reducers/reducer_HabitsList.js
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_HABITS_LIST:
      return {...state, habits: action.payload, loading: true}
    case GET_HABITS_SUCCESS:
      return {...state, habits: action.payload}
    case GET_HABITS_FAIL:
      return { ...state, error: 'No habits to list', loading: false }
    case GET_USER_HABITS_LIST:
      return {...state, userHabits: action.payload, loading: true}
    case GET_USER_HABITS_LIST_SUCCESS:
      return {...state, userHabits: action.payload, loading: false}
    case GET_USER_HABITS_LIST_FAIL:
      return {...state, error: "You don't have habits in your list", loading: false}
    case GET_CATEGORIES_LIST: 
      return {...state, loading: true}
    case GET_CATEGORIES_LIST_SUCCESS:
      return {...state, categories: action.payload,loading:false}
    case GET_CATEGORIES_LIST_FAIL:
      return { ...state, error: 'Could not retrieve categories', loading: false }
    default:
      return state
  }
}