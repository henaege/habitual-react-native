import axiosReq from '../helpers/axiosRequest';
import {Actions} from 'react-native-router-flux';
import habitsAPI from '../habitsAPI';
import {REGISTER_USER, REGISTER_USER_SUCCESS, REGISTER_USER_FAIL} from '../types';


export const registerUser = ({email, password, name}) => {
  // console.log(password);
  return (dispatch) => {
    dispatch({type: REGISTER_USER})
    const dataObj = {'email': email, 'password': password, 'userName': name};
    axiosReq('POST', habitsAPI + 'mobileRegister', dataObj)
      .then((response)=>{
        // console.log(response);
        if(response.data.msg === 'userInserted' || response.data.msg === 'userPasswordUpdatedForMobile'){
          registerUserSuccess(dispatch, response)
        }else{
          registerUserFail(dispatch)
        }
      })
      .catch(()=>registerUserFail(dispatch))
  }
}

export const registerUserFail = (dispatch) =>{
    dispatch({type: REGISTER_USER_FAIL});
}

const registerUserSuccess = (dispatch, user) => {
  dispatch({
    type: REGISTER_USER_SUCCESS,
    payload: user
  })
  Actions.main()
}