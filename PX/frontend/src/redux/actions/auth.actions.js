import axios from 'axios';
import { isAllowed } from '../../functions';
import { ROOT_URL } from "../../vars";
import {
  AUTH_CHANGE,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  PASSWORD_RESET,
  RESET_AUTH_REDUCER,
  ACCOUNT_REQUEST_SUCCESS,
  ACCOUNT_REQUEST_ERROR
} from './types';

export const authChange = ({ prop, value }) => dispatch => {
  dispatch({type: AUTH_CHANGE, prop, value});
};

export const loginUser = ({ email, password, history }) => dispatch => {
  axios.post(`${ROOT_URL}/public/login`, { email, password })
    .then(response => {
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);

        if (isAllowed("Accounts", response.data)) {
          history.push(`/ui/selectaccount`);
        }
        else if (isAllowed("Home", response.data)) {
          history.push(`/ui/home`);
        }
        else if (isAllowed("Reporting", response.data)) {
          history.push(`/ui/reporting`);
          console.log("Zone User");
        }
        else if (isAllowed("Advertiser", response.data)) {
          history.push(`/ui/advertiserpage`);
          console.log("Advertiser User");
        }

        dispatch({type: LOGIN_SUCCESS});
      }
    })
    .catch(err => {
      dispatch({type: LOGIN_ERROR});
    });
};

export const recoverPassword = ({ email, reCaptcha }) => dispatch => {
  axios.post(`${ROOT_URL}/public/recover`, { email, reCaptcha })
    .then(response => {
      dispatch({type: PASSWORD_RESET});
    })
    .catch(err => {
      dispatch({type: PASSWORD_RESET});
    })
};

export const resetAuthReducer = () => dispatch => {
  dispatch({type: RESET_AUTH_REDUCER});
};

export const signupUser = (data) => dispatch => {
  axios.post(`${ROOT_URL}/public/register`, data)
    .then(response => {
      dispatch({type: ACCOUNT_REQUEST_SUCCESS});
    })
    .catch(err => {
      dispatch({type: ACCOUNT_REQUEST_ERROR, payload: err.response.data.msg});
    })
};