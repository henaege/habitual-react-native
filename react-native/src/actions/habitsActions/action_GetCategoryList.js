import axiosReq from '../helpers/axiosRequest';
import {Actions} from 'react-native-router-flux';
import habitsAPI from '../habitsAPI';
import {GET_CATEGORIES_LIST,GET_CATEGORIES_LIST_SUCCESS,GET_CATEGORIES_LIST_FAIL} from '../types';

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