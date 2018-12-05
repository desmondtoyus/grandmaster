import axios from 'axios';
import { ROOT_URL} from "../../vars";
import {
  SET_USER_TIMEZONE,
  READ_ACTIVE_USER,
  ACTIVE_USER_READ_ERROR,
  RESET_USERS_REDUCER,
  USERS_LIST_ERROR,
  CHANGE_USERS,
  LIST_USERS,
  USER_READ_ERROR,
  READ_USER,
  MODAL_SUCCESS,
  MODAL_ERROR,
  DISPLAY_USER
} from './types';

export const setUserTimezone = timezone => dispatch => {
  axios.post(`${ROOT_URL}/user/timezone`, { timezone }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: SET_USER_TIMEZONE, payload: response.data});
    })
};

export const readActiveUser = () => dispatch => {
  axios.get(`${ROOT_URL}/user/read`, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: READ_ACTIVE_USER, payload: response.data});
    })
    .catch(err => {
      if (!window.location.href.includes('localhost')){
        window.location.href='/';
      }
      else{
        console.log(err);
      }
      // window.location.href='/'
      // dispatch({type: ACTIVE_USER_READ_ERROR});
    })
};

export const resetUsersReducer = () => dispatch => {
  dispatch({ type: RESET_USERS_REDUCER });
};

export const listUsers = data => dispatch => {
  axios.post(`${ROOT_URL}/user/list`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_USERS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: USERS_LIST_ERROR });
    })
};

export const changeUsers = ({ prop, value }) => dispatch => {
  dispatch({ type: CHANGE_USERS, prop, value });
};

export const listDisabledUsers = data => dispatch => {
  axios.post(`${ROOT_URL}/user/list_disabled`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_USERS, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: USERS_LIST_ERROR });
    })
};

export const readUser = id => dispatch => {
  axios.post(`${ROOT_URL}/user/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: READ_USER, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: USER_READ_ERROR });
    })
};

export const deleteUser = id => dispatch => {
  axios.post(`${ROOT_URL}/user/delete`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'The user was deleted successfully.' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const readDisplayUser = id => dispatch => {
  axios.post(`${ROOT_URL}/user/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: DISPLAY_USER, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: MODAL_ERROR, payload: "Could not display the user at this time. Please try again later." });
    })
};

export const activateUser = id => dispatch => {
  axios.post(`${ROOT_URL}/user/activate`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {

    })
    .catch(err => {

    })
};

export const deactivateUser = id => dispatch => {
  axios.post(`${ROOT_URL}/user/deactivate`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {

    })
    .catch(err => {

    })
};

export const createUser = data => dispatch => {
  axios.post(`${ROOT_URL}/user/create`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'User was created successfully' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const updateUser = data => dispatch => {
  axios.post(`${ROOT_URL}/user/update`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'User was updated successfully' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};