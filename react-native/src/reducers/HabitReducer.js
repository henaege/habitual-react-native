import {
  GET_HABITS_LIST,
  GET_HABITS_SUCCESS,
  GET_HABITS_FAIL,
  GET_CATEGORIES_LIST,
  GET_CATEGORIES_LIST_SUCCESS,
  GET_CATEGORIES_LIST_FAIL,
  HABIT_CHECK_IN,
  HABIT_CHECK_IN_SUCCESS,
  HABIT_CHECK_IN_FAIL,
  LEAVE_HABIT,
  LEAVE_HABIT_SUCCESS,
  LEAVE_HABIT_FAIL,
  JOIN_HABIT,
  JOIN_HABIT_SUCCESS,
  JOIN_HABIT_FAIL,
  GET_USER_HABITS_LIST,
  GET_USER_HABITS_LIST_SUCCESS,
  GET_USER_HABITS_LIST_FAIL
} from '../actions/types'

const INITIAL_STATE = {
  habits: [],
  categories: undefined,
  error: '',
  message: '',
  count: '',
  rank: '',
  loading: false,
  userHabits: []
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
    case HABIT_CHECK_IN:
      return {...state, loading: true}
    case HABIT_CHECK_IN_SUCCESS:
      return {...state, message: 'You have checked in', rank: action.payload, loading: false}
    case HABIT_CHECK_IN_FAIL:
      return {...state, message: 'You failed to check in', loading: false}
    case LEAVE_HABIT:
      return {...state, loading: true}
    case LEAVE_HABIT_SUCCESS:
      return {...state, message: 'You have left the habit.', loading: false}
    case LEAVE_HABIT_FAIL:
      return {...state, message: 'You failed to leave the habit', loading: false}
    case JOIN_HABIT:
      return {...state, loading: true}
    case JOIN_HABIT_FAIL:
      return {...state, message: action.payload, loading: false}
    case JOIN_HABIT_SUCCESS:
      return {...state, message: action.payload.msg, rank: action.payload.rank, loading: false}
    default:
      return state
  }
}