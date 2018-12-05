import axios from 'axios';
import { ROOT_URL } from "../../vars";
import {
  LIST_PUBLISHERS,
  PUBLISHERS_LIST_ERROR,
  RESET_PUBLISHERS_REDUCER,
  MODAL_SUCCESS,
  MODAL_ERROR,
  CHANGE_PUBLISHERS,
  DISPLAY_PUBLISHER,
  PUBLISHER_READ_ERROR,
  READ_PUBLISHER,
  READ_ACTIVE_PUBLISHER
} from './types';

export const readActivePublisher = id => dispatch => {
  axios.post(`${ROOT_URL}/publisher/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: READ_ACTIVE_PUBLISHER, payload: response.data })
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: PLACEMENTS_LIST_ERROR });
    })
};

export const listPublishers = data => dispatch => {
  axios.post(`${ROOT_URL}/publisher/list`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_PUBLISHERS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: PUBLISHERS_LIST_ERROR });
    })
};

export const resetPublishersReducer = () => dispatch => {
  dispatch({ type: RESET_PUBLISHERS_REDUCER })
};

export const deletePublisher = id => dispatch => {
  axios.post(`${ROOT_URL}/publisher/delete`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'The publisher was deleted successfully.' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const changePublishers = ({ prop, value }) => dispatch => {
  dispatch({type: CHANGE_PUBLISHERS, prop, value});
};

export const listDisabledPublishers = data => dispatch => {
  axios.post(`${ROOT_URL}/publisher/list_disabled`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_PUBLISHERS, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: PUBLISHERS_LIST_ERROR });
    })
};

export const readDisplayPublisher = id => dispatch => {
  axios.post(`${ROOT_URL}/publisher/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: DISPLAY_PUBLISHER, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: MODAL_ERROR, payload: "Could not display the publisher at this time. Please try again later." });
    })
};

export const readPublisher = id => dispatch => {
  axios.post(`${ROOT_URL}/publisher/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: READ_PUBLISHER, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: PUBLISHER_READ_ERROR });
    })
};

export const createPublisher = data => dispatch => {
  axios.post(`${ROOT_URL}/publisher/create`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'Publisher was created successfully' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const updatePublisher = data => dispatch => {
  axios.post(`${ROOT_URL}/publisher/update`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'Publisher was updated successfully' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};