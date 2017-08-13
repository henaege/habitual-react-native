import axiosReq from '../helpers/axiosRequest';
<<<<<<< HEAD
=======
import {Actions} from 'react-native-router-flux';
>>>>>>> 59bcce3a73c3e4256ee12237fe263bbcd851bc9e
import habitsAPI from '../habitsAPI';
import {GET_HABITS_LIST, GET_HABITS_SUCCESS, GET_HABITS_FAIL} from '../types';


export const getHabitsFromCategory = (categoryName)=>{
  var dataObj = {'categoryName': categoryName};
  return (dispatch) =>{
    axiosReq('POST', habitsAPI + 'habitslist', dataObj)
      .then((response)=>{
        var list = response.data.habitsList;
          listHabits(dispatch, list)
      })
      .catch(()=> {
        getHabitsFail(dispatch)
      })
  }
}

const getHabitsFail = (dispatch)=> {
  dispatch({type: GET_HABITS_FAIL 
  })
}

export const listHabits = (dispatch, list)=> {
  const Habits = []
  list.map((object)=> {
    Habits.push({'name': object.name.charAt(0).toUpperCase() + object.name.slice(1)})
  })
dispatch({
    type: GET_HABITS_SUCCESS,
    payload: Habits
  })
}