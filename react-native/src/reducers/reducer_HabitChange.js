import {
  HABIT_CHECK_IN,
  HABIT_CHECK_IN_SUCCESS,
  HABIT_CHECK_IN_FAIL,
  LEAVE_HABIT,
  LEAVE_HABIT_SUCCESS,
  LEAVE_HABIT_FAIL,
  JOIN_HABIT,
  JOIN_HABIT_SUCCESS,
  JOIN_HABIT_FAIL,
} from '../actions/types'

const INITIAL_STATE = {
  error: '',
  message: '',
  count: '',
  rank: '',
  loading: false,
  userHabits: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case HABIT_CHECK_IN:
      return {...state, loading: true}
    case HABIT_CHECK_IN_SUCCESS:
      return {...state, message: 'You have checked in', userHabits: action.payload, loading: false}
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