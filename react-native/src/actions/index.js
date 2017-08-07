import axiosReq from '../helpers/axiosRequest';
import {Actions} from 'react-native-router-flux'
import {EMAIL_CHANGED, NAME_CHANGED, PASSWORD_CHANGED, CONFIRM_PASSWORD_CHANGED, LOGIN_USER_SUCCESS, LOGIN_USER, LOGIN_USER_FAIL, REGISTER_USER, REGISTER_USER_SUCCESS, REGISTER_USER_FAIL,GET_CATEGORIES_LIST,GET_CATEGORIES_LIST_SUCCESS,GET_CATEGORIES_LIST_FAIL, GET_HABITS_LIST, GET_HABITS_SUCCESS, GET_HABITS_FAIL, GET_USER_HABITS_LIST, GET_USER_HABITS_LIST_SUCCESS, GET_USER_HABITS_LIST_FAIL, JOIN_HABIT, JOIN_HABIT_SUCCESS, JOIN_HABIT_FAIL, HABIT_CHECK_IN, HABIT_CHECK_IN_SUCCESS, HABIT_CHECK_IN_FAIL, LEAVE_HABIT, LEAVE_HABIT_FAIL, LEAVE_HABIT_SUCCESS} from './types'

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
  console.log('login');
  return (dispatch) => {
    dispatch({type: LOGIN_USER})
    const dataObj = {'email': email, 'password': password};
    axiosReq('POST', habitsAPI + 'mobileLogin', dataObj)
      .then((response)=>{
        console.log(response.data);
        if(response.data.msg === 'loginSuccess'){
          loginUserSuccess(dispatch, response)
        }else{
          loginUserFail(dispatch)
        }
      })
      .catch(()=>console.log('loginfail'))
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

export const getUserHabits = (token)=> {
  const usertoken = {'token': token}
  // console.log(usertoken)
  return(dispatch)=> {
    axiosReq('POST', habitsAPI + 'getMyHabitList', usertoken)
      .then((response)=>{
        var list = response.data.results;
        console.log(response.data)
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

export const getHabitsFromCategory = (categoryName)=>{
  console.log(categoryName);
  var dataObj = {'categoryName': categoryName};
  return (dispatch) =>{
    axiosReq('POST', habitsAPI + 'habitslist', dataObj)
      .then((response)=>{
        console.log(response);
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

const getUserHabitsFail = (dispatch) =>{
  dispatch({type: GET_USER_HABITS_LIST_FAIL 
  })
}
export const getCategoryList = ()=> {
  return (dispatch)=> {
    dispatch({
      type: GET_CATEGORIES_LIST
    })
    axiosReq('GET', habitsAPI + 'categorylist')
      .then((response)=> {
        console.log(response);
        getCategorySuccess(dispatch, response)
      })
      .catch(()=> getCategoryFail(dispatch))
  }
}


export const listUserHabits = (dispatch, list)=> {
  console.log(list)
  const userHabits = []
  list.map((object)=> {
    userHabits.push(object.name.charAt(0).toUpperCase() + object.name.slice(1))
    // console.log(userHabits)
  })
  // console.log(userHabits);
dispatch({
    type: GET_USER_HABITS_SUCCESS,
    payload: userHabits
  })
}

export const listHabits = (dispatch, list)=> {
  console.log(list)
  const Habits = []
  list.map((object)=> {
    Habits.push(object.name.charAt(0).toUpperCase() + object.name.slice(1))
    // console.log(userHabits)
  })
  // console.log(userHabits);
dispatch({
    type: GET_HABITS_SUCCESS,
    payload: Habits
  })
}

const getCategorySuccess = (dispatch, response)=>{
  const categorylist = []
    response.data.categories.map((category)=> {
      categorylist.push(category.categoryName.charAt(0).toUpperCase() + category.categoryName.slice(1))
    })
dispatch({
      type: GET_CATEGORIES_LIST_SUCCESS,
      payload: categorylist
    })
}

const getCategoryFail = (dispatch)=> {
  dispatch({type: GET_CATEGORIES_LIST_FAIL})
}

export const checkInMyHabit = (token, habitName)=>{
  const dataObj = {'token': token, 'habitName': habitName}
  return(dispatch)=> {
    dispatch({
      type: HABIT_CHECK_IN
    })
    axiosReq('POST', habitsAPI + 'checkinMyHabit', dataObj )
      .then((response)=>{
        if(response.data.error !== undefined){
          dispatch({
            type:HABIT_CHECK_IN_FAIL,
          })
        }
        else{
          dispatch({
            type: HABIT_CHECK_IN_SUCCESS,
            payload: response.data.rank
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

export const joinAHabit = (token, habitName)=>{
  habitName = habitName.toLowerCase();
  var dataObj = {'token': token, 'habitName': habitName}
  return (dispatch)=>{
    dispatch({
      type: JOIN_HABIT
    })
    axiosReq('POST', habitsAPI + 'joinAHabit', dataObj)
    .then((response)=>{
      console.log(response.data)
      if(response.data === 'existedUserHabit'){
        dispatch({type: JOIN_HABIT_FAIL, payload: `You already joined ${habitName}`})
      }else{
        dispatch({type: JOIN_HABIT_SUCCESS, payload: {'rank':response.data.rank, 'msg': `You successfully joined ${habitName}`}})
      }
    })
    .catch(()=>{
      dispatch({type: JOIN_HABIT_FAIL, payload: `You failed joinning ${habitName}`})
    })
  }
}

export const leaveHabit = (token, habitName)=>{
  habitName = habitName.toLowerCase();
  const dataObj = {'token': token, 'habitName': habitName}
  return(dispatch)=> {
    dispatch({
      type: LEAVE_HABIT
    })
    axiosReq('POST', habitsAPI + 'leaveHabit', dataObj)
      .then((response)=>{
        console.log(response);
        if(response.data.error === undefined){
          dispatch({
            type:LEAVE_HABIT_SUCCESS
          })
        }
        else{
          dispatch({
            type: LEAVE_HABIT_FAIL
          })
        }
      })
      .catch((error)=> {
        console.log(error);
        dispatch({
          type:LEAVE_HABIT_FAIL,
        })
      })

  }
}
