import axiosReq from '../helpers/axiosRequest';
import {Actions} from 'react-native-router-flux';
import habitsAPI from '../habitsAPI';
import {HABIT_CHECK_IN,HABIT_CHECK_IN_SUCCESS,HABIT_CHECK_IN_FAIL} from '../types';

export const checkInMyHabit = (token, habitName)=>{
  console.log(habitName);
  const dataObj = {'token': token, 'habitName': habitName}
  return(dispatch)=> {
    dispatch({
      type: HABIT_CHECK_IN
    })
    axiosReq('POST', habitsAPI + 'checkinMyHabit', dataObj )
      .then((response)=>{
        console.log(response.data);
        if(response.data.error !== undefined){
          dispatch({
            type:HABIT_CHECK_IN_FAIL,
          })
        }
        else{
          dispatch({
            type: HABIT_CHECK_IN_SUCCESS,
            payload: response.data.userHabits
          })
        }
      })
      .catch((error)=> {
        console.log(error);
        dispatch({
          type:HABIT_CHECK_IN_FAIL,
        })
      })

  }
}