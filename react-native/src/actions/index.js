import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import {EMAIL_CHANGED, PASSWORD_CHANGED, LOGIN_USER_SUCCESS, LOGIN_USER, LOGIN_USER_FAIL, REGISTER_USER, REGISTER_USER_SUCCESS, REGISTER_USER_FAIL} from './types'

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

export const loginUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user))
      .catch((error) => {
        console.log(error);

        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(user => loginUserSuccess(dispatch, user))
          .catch(() => loginUserFail(dispatch));
      });
  };
};

const loginUserFail = (dispatch) => {
  dispatch({ type: LOGIN_USER_FAIL });
};

const loginUserSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  });

  Actions.main();
};

export const registerUser = ({email, password}) => {
  console.log(password);
  return (dispatch) => {
    dispatch({type: LOGIN_USER})
    const dataObj = {'email': email, 'password': password};
    axiosReq('POST', habitsAPI + 'mobileLogin', dataObj)
      .then((response)=>{
        if(response.data.msg === 'loginSuccess'){
          loginUserSuccess(dispatch, response)
        }else{
          loginUserFail(dispatch)
        }
      })
      .catch(()=>loginUserFail(dispatch))
  }
}

const registerUserFail = (dispatch) =>{
  dispatch({type: REGISTER_USER_FAIL})
}

const registerUserSuccess = (dispatch, user) => {
  dispatch({
    type: REGISTER_USER_SUCCESS,
    payload: user
  })
  Actions.habitsList();
}

export const shortPass = (password)=>{
  dispatch({type: PASSWORD_SHORT})
}