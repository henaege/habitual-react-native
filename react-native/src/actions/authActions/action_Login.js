import axiosReq from '../helpers/axiosRequest';
import {Actions} from 'react-native-router-flux';
import habitsAPI from '../habitsAPI';
import {LOGIN_USER_SUCCESS, LOGIN_USER, LOGIN_USER_FAIL} from '../types';


export const loginUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch({type: LOGIN_USER})
    const dataObj = {'email': email, 'password': password};
    axiosReq('POST', habitsAPI + 'mobileLogin', dataObj)
      .then((response)=>{
        console.log(response);
        if(response.data.msg === 'loginSuccess'){
          loginUserSuccess(dispatch, response.data)
        }else{
          loginUserFail(dispatch)
        }
      })
      .catch((error)=>console.log(error))
  };
};

const loginUserFail = (dispatch) => {
  dispatch({ type: LOGIN_USER_FAIL })
};


const loginUserSuccess = (dispatch, user) => {
  dispatch({type: LOGIN_USER_SUCCESS,
    payload: user})
    Actions.main();
}