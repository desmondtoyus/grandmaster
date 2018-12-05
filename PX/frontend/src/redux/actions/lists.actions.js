import axios from 'axios';
import { ROOT_URL } from '../../vars';
import {
  LIST_DOMAIN_LISTS,
  LIST_DOMAIN_LISTS_ERROR,
  RESET_DOMAIN_LISTS_REDUCER,
  DOMAIN_LISTS_CHANGE,
  DOMAIN_LIST_CHANGE,
  DOMAIN_LIST_UPLOAD_SUCCESS,
  DOMAIN_LIST_UPLOAD_FAIL,
  DOMAIN_LIST_CREATE_SUCCESS,
  DOMAIN_LIST_CREATE_FAIL,
  RESET_DOMAIN_LIST_ERRORS,
  RESET_DOMAIN_LIST_REDUCER,
  DISPLAY_DOMAIN_LIST,
  MODAL_ERROR,
  DOMAIN_LIST_EDIT_FAIL,
  READ_DOMAIN_LIST,
  DOMAIN_LIST_UPDATE_SUCCESS,
  DOMAIN_LIST_UPDATE_FAIL,
  MODAL_SUCCESS,
  LIST_FLIGHT_DOMAIN_LISTS,
  LIST_PLACEMENT_DOMAIN_LISTS
} from '../actions/types';

export const listDomainLists = (payload) => dispatch => {
  axios.post(`${ROOT_URL}/lists/list`, payload, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: LIST_DOMAIN_LISTS, payload: response.data});
    })
    .catch(err => {
      console.log(err);
      dispatch({type: LIST_DOMAIN_LISTS_ERROR});
    })
};

export const resetDomainListsReducer = () => dispatch => {
  dispatch({type: RESET_DOMAIN_LISTS_REDUCER});
};

export const domainListsChange = ({ prop, value }) => dispatch => {
  dispatch({ type: DOMAIN_LISTS_CHANGE, prop, value });
};

export const domainListChange = ({ prop, value }) => dispatch => {
  dispatch({ type: DOMAIN_LIST_CHANGE, prop, value });
};

export const uploadList = (payload) => dispatch => {
  axios.post(`${ROOT_URL}/lists/upload`, payload, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: DOMAIN_LIST_UPLOAD_SUCCESS, payload: response.data });
    })
    .catch(err => {
      dispatch({type: DOMAIN_LIST_UPLOAD_FAIL});
    })
};

export const uploadAppList = (payload) => dispatch => {
  axios.post(`${ROOT_URL}/lists/uploadapp`, payload, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: DOMAIN_LIST_UPLOAD_SUCCESS, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: DOMAIN_LIST_UPLOAD_FAIL });
    })
};

export const uploadIpList = (payload) => dispatch => {
  axios.post(`${ROOT_URL}/lists/uploadip`, payload, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: DOMAIN_LIST_UPLOAD_SUCCESS, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: DOMAIN_LIST_UPLOAD_FAIL });
    })
};

export const uploadBundleList = (payload) => dispatch => {
  axios.post(`${ROOT_URL}/lists/uploadbundle`, payload, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: DOMAIN_LIST_UPLOAD_SUCCESS, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: DOMAIN_LIST_UPLOAD_FAIL });
    })
};

export const createDomainList = (payload) => dispatch => {
  axios.post(`${ROOT_URL}/lists/create`, payload, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: DOMAIN_LIST_CREATE_SUCCESS});
    })
    .catch(err => {
      dispatch({type: DOMAIN_LIST_CREATE_FAIL});
    })
};

export const resetDomainListErrors = () => dispatch => {
  dispatch({type: RESET_DOMAIN_LIST_ERRORS})
};

export const resetDomainListReducer = () => dispatch => {
  dispatch({type: RESET_DOMAIN_LIST_REDUCER});
};

export const readDisplayDomainList = (id) => dispatch => {
  axios.post(`${ROOT_URL}/lists/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: DISPLAY_DOMAIN_LIST, payload: response.data })
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: MODAL_ERROR, payload: "Could not display the list at this time. Please try again later." });
    })
};

export const readDomainList = (id) => dispatch => {
  axios.post(`${ROOT_URL}/lists/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: READ_DOMAIN_LIST, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: DOMAIN_LIST_EDIT_FAIL });
    })
};

export const updateDomainList = (payload) => dispatch => {
  axios.post(`${ROOT_URL}/lists/update`, payload, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: DOMAIN_LIST_UPDATE_SUCCESS});
    })
    .catch(err => {
      dispatch({type: DOMAIN_LIST_UPDATE_FAIL});
    })
};

export const deleteDomainList = id => dispatch => {
  axios.post(`${ROOT_URL}/lists/delete`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: MODAL_SUCCESS, payload: 'The list deleted successfully.'});
    })
    .catch(err => {
      dispatch({type: MODAL_ERROR, payload: 'Could not delete the list at this time. Please try again later.'});
    })
};

export const cloneDomainList = payload => dispatch => {
  axios.post(`${ROOT_URL}/lists/clone`, payload, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: DOMAIN_LIST_CREATE_SUCCESS});
    })
    .catch(err => {
      dispatch({type: DOMAIN_LIST_CREATE_FAIL});
    })
};

export const listFlightDomainLists = (id) => dispatch => {
  axios.get(`${ROOT_URL}/lists/list/${id}`, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: LIST_FLIGHT_DOMAIN_LISTS, payload: response.data });
    })
    .catch(err => {

    })
};

export const listPlacementDomainLists = (id) => dispatch => {
  axios.get(`${ROOT_URL}/lists/list/${id}`, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({type: LIST_PLACEMENT_DOMAIN_LISTS, payload: response.data });
    })
    .catch(err => {

    })
};
