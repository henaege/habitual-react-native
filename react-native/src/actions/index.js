import axiosReq from '../helpers/axiosRequest';
import {Actions} from 'react-native-router-flux'
import {EMAIL_CHANGED, NAME_CHANGED, PASSWORD_CHANGED, CONFIRM_PASSWORD_CHANGED, LOGIN_USER_SUCCESS, LOGIN_USER, LOGIN_USER_FAIL, REGISTER_USER, REGISTER_USER_SUCCESS, REGISTER_USER_FAIL, GET_HABIT_LIST, GET_HABITS_SUCCESS, GET_HABITS_FAIL} from './types'

const habitsAPI = 'http:/test.iamdrewt.net/'
export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};
export const confirmPasswordChanged = (text) => {
  return {
    type: CONFIRM_PASSWORD_CHANGED,
    payload: text
  };
};
export const nameChanged = (text) => {
  return {
    type: NAME_CHANGED,
    payload: text
  };
};
export const loginUser = ({ email, password }) => {
  console.log(email);
  return (dispatch) => {
    dispatch({type: LOGIN_USER})
    const dataObj = {'email': email, 'password': password};
    axiosReq('POST', habitsAPI + 'mobileLogin', dataObj)
      .then((response)=>{
        console.log(response);
        if(response.data.msg === 'loginSuccess'){
          loginUserSuccess(dispatch, response)
        }else{
          loginUserFail(dispatch)
        }
      })
      .catch(()=>loginUserFail(dispatch))
  };
};

const loginUserFail = (dispatch) => {
  return (dispatch) =>{dispatch({ type: LOGIN_USER_FAIL })};
};

const loginUserSuccess = (dispatch, user) => {
  Actions.main();
  return (dispatch)=> {dispatch({type: LOGIN_USER_SUCCESS,
    payload: user})};
};

export const registerUser = ({email, password, name}) => {
  console.log(password);
  return (dispatch) => {
    dispatch({type: REGISTER_USER})
    const dataObj = {'email': email, 'password': password, 'userName': name};
    axiosReq('POST', habitsAPI + 'mobileRegister', dataObj)
      .then((response)=>{
        console.log(response);
        if(response.data.msg === 'userInserted'){
          registerUserSuccess(dispatch, response)
        }else{
          registerUserFail(dispatch)
        }
      })
      .catch(()=>registerUserFail(dispatch))
  }
}

export const registerUserFail = () =>{
  return (dispatch) =>{dispatch({
    type: REGISTER_USER_FAIL})}
}

const registerUserSuccess = (dispatch, user) => {
  Actions.main();
  return (dispatch)=> {dispatch({
    type: REGISTER_USER_SUCCESS,
    payload: user
  })}
}

export const getHabits = (token)=> {
  return (dispatch) => {
    dispatch({
    type: GET_HABITS_LIST
    })
    const dataObj = {'token': token}
    axiosReq('POST', habitsAPI + 'getMyHabitList', dataObj)
      .then((response)=>{
        if (response.data.msg === 'NoHabitJoined'){
          getCategoryList(dispatch)
        } else {
            listUserHabits()
        }
      })
      .catch(()=> getHabitsFail(dispatch)) 
  }
}


const getHabitsFail = (dispatch)=> {
  return (dispatch)=> {dispatch({type: GET_HABITS_FAIL 
  })}
}

const getCategoryList = ()=> {
  return (dispatch)=> {
    dispatch({
      type: GET_CATEGORY_LIST
    })
    axiosReq('GET', habitsAPI + 'categorylist')
      .then((response)=> {
        getCategorySuccess(dispatch, response)
      })
      .catch(()=> getCategoryFail(dispatch))
  }
}

const listUserHabits = (dispatch)=> {
  const userHabits = []
  response.data.map((name)=> {
    userHabits.push(name)
  })
return (dispatch)=> {dispatch({
  type: GET_HABITS_SUCCESS,
    payload: userHabits
  })}
}

const getCategorySuccess = (dispatch, response)=>{
  const categorylist = []
    response.data.map((category)=> {
      categorylist.push(category)
    })
    return (dispatch)=> {dispatch({
      type: GET_CATEGORY_SUCCESS,
      payload: categorylist
    })}
}

const getCategoryFail = (dispatch)=> {
  return (dispatch)=> {dispatch({type: GET_CATEGORY_FAIL})}
  
}