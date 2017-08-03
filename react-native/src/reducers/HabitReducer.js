import {
  GET_HABITS_LIST,
  GET_HABITS_SUCCESS,
  GET_HABITS_FAIL,
  GET_CATEGORIES_LIST,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
} from '../actions/types'

const INITIAL_STATE = {
  habits: [],
  categories: [],
  error: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_HABITS_LIST:
      return {...state, loading: true}
    case GET_HABITS_SUCCESS:
      return {...state, habits: action.payload}
    case GET_HABITS_FAIL:
      return { ...state, error: 'No habits to list', loading: false }
    case GET_CATEGORIES_LIST: 
      return {...state, loading: true}
    case GET_CATEGORIES_SUCCESS:
      return {...state, categories: action.payload}
    case GET_CATEGORIES_FAIL:
      return { ...state, error: 'Could not retrieve categories', loading: false }
    default:
      return state
  }
}