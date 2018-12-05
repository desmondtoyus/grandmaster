import axios from 'axios';
import { ROOT_URL} from "../../vars";
import {
  LIST_ADVERTISERS,
  ADVERTISERS_LIST_ERROR,
  RESET_ADVERTISERS_REDUCER,
  MODAL_SUCCESS,
  MODAL_ERROR,
  CHANGE_ADVERTISERS,
  DISPLAY_ADVERTISER,
  READ_ADVERTISER,
  ADVERTISER_READ_ERROR,
  READ_ACTIVE_ADVERTISER
} from './types';

export const readActiveAdvertiser = id => dispatch => {
  axios.post(`${ROOT_URL}/advertiser/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: READ_ACTIVE_ADVERTISER, payload: response.data })
    })
    .catch(err => {
      console.log(err);
      // dispatch({ type: CAMPAIGNS_LIST_ERROR });
    })
};

export const listAdvertisers = data => dispatch => {
  axios.post(`${ROOT_URL}/advertiser/list`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_ADVERTISERS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: ADVERTISERS_LIST_ERROR });
    })
};

export const resetAdvertisersReducer = () => dispatch => {
  dispatch({ type: RESET_ADVERTISERS_REDUCER });
};

export const deleteAdvertiser = id => dispatch => {
  axios.post(`${ROOT_URL}/advertiser/delete`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'The advertiser was deleted successfully.' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const changeAdvertisers = ({ prop, value }) => dispatch => {
  dispatch({ type: CHANGE_ADVERTISERS, prop, value });
};

export const listDisabledAdvertisers = data => dispatch => {
  axios.post(`${ROOT_URL}/advertiser/list_disabled`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_ADVERTISERS, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: ADVERTISERS_LIST_ERROR });
    })
};

export const readDisplayAdvertiser = id => dispatch => {
  axios.post(`${ROOT_URL}/advertiser/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: DISPLAY_ADVERTISER, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: MODAL_ERROR, payload: "Could not display the publisher at this time. Please try again later." });
    })
};

export const readAdvertiser = id => dispatch => {
  axios.post(`${ROOT_URL}/advertiser/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: READ_ADVERTISER, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: ADVERTISER_READ_ERROR });
    })
};

export const createAdvertiser = data => dispatch => {
  axios.post(`${ROOT_URL}/advertiser/create`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'Advertiser was created successfully' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const updateAdvertiser = data => dispatch => {
  axios.post(`${ROOT_URL}/advertiser/update`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'Advertiser was updated successfully' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};