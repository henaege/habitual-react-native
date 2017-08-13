import axiosReq from '../helpers/axiosRequest';
<<<<<<< HEAD
=======
import {Actions} from 'react-native-router-flux';
>>>>>>> 59bcce3a73c3e4256ee12237fe263bbcd851bc9e
import {EMAIL_CHANGED, NAME_CHANGED, PASSWORD_CHANGED, CONFIRM_PASSWORD_CHANGED} from '../types'


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



