import axiosReq from '../helpers/axiosRequest';
import {Actions} from 'react-native-router-flux';
import habitsAPI from '../habitsAPI';
import {GET_USER_HABITS_LIST, GET_USER_HABITS_LIST_SUCCESS, GET_USER_HABITS_LIST_FAIL} from '../types';

export const getUserHabits = (token)=> {
  const usertoken = {'token': token}
  return(dispatch)=> {
    axiosReq('POST', habitsAPI + 'getMyHabitList', usertoken)
      .then((response)=>{
        var list = response.data.results;
        if (response.data.msg === 'NoHabitJoined'){
          getUserHabitsFail(dispatch)
        } else {
            listUserHabits(dispatch, list)
        }
      })
      .catch(()=> {
        getUserHabitsFail(dispatch)
      }) 
  }
}


const getUserHabitsFail = (dispatch) =>{
  dispatch({type: GET_USER_HABITS_LIST_FAIL 
  })
}



export const listUserHabits = (dispatch, list)=> {
  var userHabits = []

  list.map((object)=> {

    object.name = object.name.charAt(0).toUpperCase() + object.name.slice(1)
  })
  
dispatch({
    type: GET_USER_HABITS_LIST_SUCCESS,
    payload: list
  })
}
