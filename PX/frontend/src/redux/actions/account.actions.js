import axios from 'axios';
import { ROOT_URL } from "../../vars";
import {
  RESET_ACCOUNTS_REDUCER,
  CHANGE_ACCOUNTS,
  LIST_ACCOUNTS,
  LIST_MASTER_ACCOUNTS,
  ACCOUNTS_LIST_ERROR,
  MODAL_SUCCESS,
  MODAL_ERROR,
  READ_ACCOUNT,
  ACCOUNT_READ_ERROR,
  DISPLAY_ACCOUNT,
  READ_ACTIVE_ACCOUNT
} from './types';

export const readActiveAccount = id => dispatch => {
  axios.post(`${ROOT_URL}/account/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: READ_ACTIVE_ACCOUNT, payload: response.data });
    })
    .catch(err => {
      console.log(err);
    })
};

export const resetAccountsReducer = () => dispatch => {
  dispatch({type: RESET_ACCOUNTS_REDUCER});
};

export const changeAccounts = ({ prop, value }) => dispatch => {
  dispatch({type: CHANGE_ACCOUNTS, prop, value});
};

export const setUserScope = (id, callback) => dispatch => {
  axios.post(`${ROOT_URL}/user/scope`, { id: Number(id) }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      callback(`/ui/home`);
    })
    .catch(err => {
      console.log(err);
      // callback('/');
    })
};

export const listScopeAccounts = data => dispatch => {
  axios.post(`${ROOT_URL}/account/scope_list`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: LIST_ACCOUNTS, payload: response.data});
    })
    .catch(err => {
      dispatch({type: ACCOUNTS_LIST_ERROR});
    })
};

export const listAccounts = data => dispatch => {
  axios.post(`${ROOT_URL}/account/list`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_ACCOUNTS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: ACCOUNTS_LIST_ERROR});
    })
};

export const masterListAccounts = data => dispatch => {
  axios.post(`${ROOT_URL}/account/master_list`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      let accountArr = [];
      if (response.data.rows.length) {
       
        for (let i = 0; i < response.data.rows.length; i++) {
          var newObj = {
            text: response.data.rows[i]['name'],
            value: response.data.rows[i]['id']
          }
          accountArr.push(newObj);
        }
      }
      dispatch({ type: LIST_MASTER_ACCOUNTS, payload: accountArr});
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: ACCOUNTS_LIST_ERROR });
    })
};

export const listPendingAccounts = data => dispatch => {
  axios.post(`${ROOT_URL}/account/list_pending`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_ACCOUNTS, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: ACCOUNTS_LIST_ERROR });
    })
};

export const listDisabledAccounts = data => dispatch => {
  axios.post(`${ROOT_URL}/account/list_disabled`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_ACCOUNTS, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: ACCOUNTS_LIST_ERROR });
    })
};

export const createAccount = data => dispatch => {
  axios.post(`${ROOT_URL}/account/create`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'Account was created successfully' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const readAccount = id =>  dispatch => {
  axios.post(`${ROOT_URL}/account/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: READ_ACCOUNT, payload: response.data });
    })
    .catch(err => {
      dispatch({type: ACCOUNT_READ_ERROR});
    })
};

export const updateAccount = data => dispatch => {
  axios.post(`${ROOT_URL}/account/update`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'Account was updated successfully' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const deleteAccount = id => dispatch => {
  axios.post(`${ROOT_URL}/account/delete`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'The account was deleted successfully.' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const readDisplayAccount = id => dispatch => {
  axios.post(`${ROOT_URL}/account/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: DISPLAY_ACCOUNT, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: MODAL_ERROR, payload: "Could not display the account at this time. Please try again later." });
    })
};

export const activateAccount = id => dispatch => {
  axios.post(`${ROOT_URL}/account/activate`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {

    })
    .catch(err => {

    })
};

export const deactivateAccount = id => dispatch => {
  axios.post(`${ROOT_URL}/account/deactivate`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'Account was deactivated successfully' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};