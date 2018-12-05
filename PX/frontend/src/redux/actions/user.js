import axios from 'axios';
import qs from 'qs';
import { ROOT_URL } from '../../vars';
import {
  LIST_USERS,
  UPDATE_USER,
  CREATE_USER,
  READ_USER,
  READ_ACTIVE_USER,
  READ_DISPLAY_USER,
  RESET_USER_ERRORS,
  USER_CREATE_ERROR,
  USER_UPDATE_ERROR,
  USERS_LIST_ERROR,
  USER_READ_DISPLAY_ERROR,
  USER_READ_ERROR,
  ACTIVE_USER_READ_ERROR,
  USER_ACTION,
  RESET_USER_REDUCER,
  RESET_USERS_REDUCER
} from './types';

export function resetUsersReducer() {
  return function(dispatch) {
    dispatch({type: RESET_USERS_REDUCER});
  }
}

export function resetUserReducer() {
  return function(dispatch) {
    dispatch({type: RESET_USER_REDUCER});
  }
}

export function submitTicket(value) {
  return function(dispatch) {
    let payload = {};
    payload.ticket = value;

    const qsPayload = qs.stringify(payload);

    axios.post(`${ROOT_URL}/user/ticket`, qsPayload);
  }
}

export function resetUserErrors() {
  return function(dispatch) {
    dispatch({type: RESET_USER_ERRORS});
  }
}

export function readDisplayUser(id) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/user/read`, { id }, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({type: READ_DISPLAY_USER, payload: response.data});
      })
      .catch(err => {
        dispatch({type: USER_READ_DISPLAY_ERROR});
      })
  }
}

export function listUsers(data) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/user/list`, data, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({type: LIST_USERS, payload: response});
      })
      .catch(err => {
        console.log(err);
        dispatch({type: USERS_LIST_ERROR});
      })
  }
}

export function updateUser(data) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/user/update`, data, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({type: UPDATE_USER});
      })
      .catch(err => {
        dispatch({type: USER_UPDATE_ERROR, message: response.data.message});
      })
  }
}

export function createUser(data) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/user/create`, data, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({type: CREATE_USER});
      })
      .catch(err => {
        dispatch({type: USER_CREATE_ERROR, message: err.response.data.message});
      })
  }
}

export function deleteUser(id) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/user/delete`, { id }, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({type: USER_ACTION, payload: {error: false, success: true, message: `User was deleted successfully.`}});
      })
      .catch(err => {
        dispatch({type: USER_ACTION, payload: {error: true, success: false, message: err.response.data.message || `Could not delete the user at this time. Please try again later.`}});
      })
  }
}

export function readActiveUser() {
  return function(dispatch) {
    axios.get(`${ROOT_URL}/user/read`, {
            headers: { authorization: localStorage.getItem('token') }
          })
      .then(response => {
        dispatch({type: READ_ACTIVE_USER, payload: response.data});
        console.log("user/read");
      })
      .catch(err => {
        dispatch({type: ACTIVE_USER_READ_ERROR});
        console.log("user/read--error");
      })
  }
}
// export function checkStatus() {
//   console.log(query);
//   return function (dispatch) {
//     axios.get(`${ROOT_URL}/user/s`)
//       .then(response => {
//         if (!response.data.success) {
//           browserHistory.push('/');
//         }
//       })
//       .catch(err=>console.log(err))
//   }
// }

export function readUser(id) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/user/read`, { id }, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({type: READ_USER, payload: response.data});
      })
      .catch(err => {
        console.log(err);
        dispatch({type: USER_READ_ERROR});
      })
  }
}

export function readLoggedInUser() {
  return function(dispatch) {
    axios.get(`${ROOT_URL}/user/read`, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({type: READ_USER, payload: response.data});
      })
      .catch(err => {
        console.log(err);
        dispatch({type: USER_READ_ERROR});
      })
  }
}
