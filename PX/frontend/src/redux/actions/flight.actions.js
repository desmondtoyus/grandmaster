import axios from 'axios';
import { ROOT_URL, ANALYTICS_URL } from "../../vars";
import {
  FLIGHTS_LIST_ERROR,
  READ_ACTIVE_CAMPAIGN,
  LIST_FLIGHTS,
  RESET_FLIGHTS_REDUCER,
  MODAL_SUCCESS,
  MODAL_ERROR,
  CHANGE_FLIGHTS,
  CHANGE_FLIGHT,
  LIST_FLIGHT_CAMPAIGNS,
  FLIGHT_ERROR,
  RESET_DISPLAY_ERRORS,
  RESET_DISPLAY_CREATIVE,
  UPLOAD_FLIGHT_DISPLAY_CREATIVE,
  RESET_VIDEO_ERRORS,
  RESET_VIDEO_CREATIVE,
  UPLOAD_FLIGHT_VIDEO_CREATIVE,
  UPLOAD_FLIGHT_COMPANION_CREATIVE,
  LIST_FLIGHT_OPTIONS,
  READ_FLIGHT,
  RESET_FLIGHT_REDUCER,
  RESET_FLIGHT_ERRORS,
  FLIGHT_SUCCESS,
  FLIGHT_FAIL,
  DISPLAY_FLIGHT,
  FLIGHT_GEO_SEARCH,
  FLIGHTS_PLACEMENT,
  SUPPLY_FAIL,
  LIST_SUPPLY,
  CHECK_IFLIGHT,
  PIXEL_TAG
} from './types';

export const listFlights = data => dispatch => {
  axios.post(`${ROOT_URL}/flight/list`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_FLIGHTS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: FLIGHTS_LIST_ERROR });
    })
};

export const checkIflight = (value, platform, rtb) => dispatch => {
  let payload = { value, platform, rtb}
  dispatch({ type: CHECK_IFLIGHT, payload: payload});
};

export const resetFlightsReducer = () => dispatch => {
  dispatch({ type: RESET_FLIGHTS_REDUCER });
};

export const listSupply = (id, searchTerm, master) => dispatch => {
  axios.post(`${ROOT_URL}/flight/list_supply`, { id, searchTerm, master }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_SUPPLY, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: SUPPLY_FAIL, payload: err.response.data.msg });
    })
};

export const updateSupplyList = ({ id, supplyIds, toRemove, toAdd }) => dispatch => {
  axios.post(`${ROOT_URL}/flight/update_supply`, { id, supplyIds, toRemove, toAdd }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: "Supply List was saved successfully" });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: "Cannot update List" });
    })
};

export const getSupplyList = (id, master) => dispatch => {
  axios.post(`${ROOT_URL}/flight/supply_list`, { id, master }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      let supplyId = [];
      let supplyList = [];
      response.data.map(obj => {
        supplyId.push(obj.id);
        supplyList.push({ id: obj.id, name: obj.name, cpm: obj.cpm, status: obj.status })
      })
      dispatch({ type: FLIGHTS_PLACEMENT, payload: { supplyId, supplyList } });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: SUPPLY_FAIL, payload: err.response.data.msg });
    })
};

export const readFlightTag = id => dispatch => {
  axios.post(`${ROOT_URL}/flight/tag`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: PIXEL_TAG, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: "Could not display the flight tag at this time. Please try again later." });
    })
};

export const deleteFlight = id => dispatch => {
  axios.post(`${ROOT_URL}/flight/delete`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'The flight was deleted successfully.' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const changeFlights = ({ prop, value }) => dispatch => {
  dispatch({ type: CHANGE_FLIGHTS, prop, value });
};

export const listActiveFlights = data => dispatch => {
  axios.post(`${ROOT_URL}/flight/list_active`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_FLIGHTS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: FLIGHTS_LIST_ERROR });
    })
};

//listPaused
// /flight/list_paused
export const listPausedFlights = data => dispatch => {
  axios.post(`${ROOT_URL}/flight/list_paused`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_FLIGHTS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: FLIGHTS_LIST_ERROR });
    })
};


export const listInactiveFlights = data => dispatch => {
  axios.post(`${ROOT_URL}/flight/list_inactive`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_FLIGHTS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: FLIGHTS_LIST_ERROR });
    })
};

export const listDisabledFlights = data => dispatch => {
  axios.post(`${ROOT_URL}/flight/list_disabled`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_FLIGHTS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: FLIGHTS_LIST_ERROR });
    })
};

export const activateFlight = id => dispatch => {
  axios.post(`${ROOT_URL}/flight/activate`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
};

export const deactivateFlight = id => dispatch => {
  axios.post(`${ROOT_URL}/flight/deactivate`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
};

export const pauseFlight = id => dispatch => {
  axios.post(`${ROOT_URL}/flight/pause`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
};

export const disableFlight = id => dispatch => {
  axios.post(`${ROOT_URL}/flight/disable`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
};

export const changeFlight = ({ prop, value }) => dispatch => {
  dispatch({ type: CHANGE_FLIGHT, prop, value });
};

export const listFlightCampaigns = id => dispatch => {
  axios.post(`${ROOT_URL}/flight/list_campaigns`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_FLIGHT_CAMPAIGNS, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: FLIGHT_ERROR });
    })
};

export const resetDisplayErrors = () => dispatch => {
  dispatch({ type: RESET_DISPLAY_ERRORS });
};

export const resetDisplayCreative = () => dispatch => {
  dispatch({ type: RESET_DISPLAY_CREATIVE });
};

export const uploadFlightDisplayCreative = data => dispatch => {
  axios.post(`${ROOT_URL}/flight/display_upload`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: UPLOAD_FLIGHT_DISPLAY_CREATIVE, payload: response.data, message: `File uploaded successfully.` });
    })
    .catch(err => {
      dispatch({ type: UPLOAD_FLIGHT_DISPLAY_CREATIVE, payload: null, message: `Cannot upload your file at this time. Please try again later or check that your file is valid.` });
    })
};

export const resetVideoErrors = () => dispatch => {
  dispatch({ type: RESET_VIDEO_ERRORS });
};

export const resetVideoCreative = () => dispatch => {
  dispatch({ type: RESET_VIDEO_CREATIVE });
};

export const uploadFlightVideoCreative = data => dispatch => {
  axios.post(`${ROOT_URL}/flight/video_upload`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: UPLOAD_FLIGHT_VIDEO_CREATIVE, payload: response.data, message: "File uploaded successfully." })
    })
    .catch(err => {
      dispatch({ type: UPLOAD_FLIGHT_VIDEO_CREATIVE, payload: null, message: `Cannot upload your file at this time. Please try again later or check that your file is valid.` })
    })
};

export const uploadFlightCompanionCreative = data => dispatch => {
  axios.post(`${ROOT_URL}/flight/displayupload`, data)
    .then(response => {
      if (response.data.success) {
        dispatch({ type: UPLOAD_FLIGHT_COMPANION_CREATIVE, payload: response.data, message: `File uploaded successfully` });
      }
      else {
        dispatch({ type: UPLOAD_FLIGHT_COMPANION_CREATIVE, payload: null, message: `Cannot upload your file at this time. Please try again later or check that your file is valid.` });
      }
    })
};

export const listOptions = id => dispatch => {
  axios.post(`${ROOT_URL}/flight/list_options`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_FLIGHT_OPTIONS, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: FLIGHT_FAIL, message: 'Cannot create flight at this time. Please try again later.' });
    })
};

export const readFlight = ({ id, callback, master }) => dispatch => {
  axios.post(`${ROOT_URL}/flight/read`, { id }, {

    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      let campaignId = response.data.campaign_id;
      callback({ campaignId, master });
      dispatch({ type: READ_FLIGHT, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: FLIGHT_ERROR });
    })
};

export const resetFlightReducer = () => dispatch => {
  dispatch({ type: RESET_FLIGHT_REDUCER });
};

export const resetFlightErrors = () => dispatch => {
  dispatch({ type: RESET_FLIGHT_ERRORS });
};

export const createFlight = ({ payload, callback }) => dispatch => {
  axios.post(`${ROOT_URL}/flight/create`, payload, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      callback();
      dispatch({ type: FLIGHT_SUCCESS, payload: 'Flight was created successfully' });
    })
    .catch(err => {
      dispatch({ type: FLIGHT_FAIL, payload: err.response.data.msg });
    })
};

export const updateFlight = ({ payload, callback }) => dispatch => {
  axios.post(`${ROOT_URL}/flight/update`, payload, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      callback();
      dispatch({ type: FLIGHT_SUCCESS, payload: 'Flight was updated successfully' });
    })
    .catch(err => {
      dispatch({ type: FLIGHT_FAIL, payload: err.response.data.msg });
    })
};

export const cloneFlight = ({ payload, callback }) => dispatch => {
  axios.post(`${ROOT_URL}/flight/clone`, payload, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      callback();
      dispatch({ type: FLIGHT_SUCCESS, payload: 'Flight was created successfully' });
    })
    .catch(err => {
      dispatch({ type: FLIGHT_FAIL, payload: err.response.data.msg });
    })
};

export const readDisplayFlight = id => dispatch => {
  axios.post(`${ROOT_URL}/flight/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: DISPLAY_FLIGHT, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: MODAL_ERROR, payload: "Could not display the placement at this time. Please try again later." });
    })
};

export const flightGeoSearch = ({ geoType, name, fragment, selection, category }) => dispatch => {
  if (fragment.length < 3) {
    dispatch({ type: FLIGHT_GEO_SEARCH, payload: [], selection, geoType, name });
  }
  else {
    axios.post(`${ANALYTICS_URL}/api/services/autocompletes/`, { category, fragment }, {
      headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
    })
      .then(response => {
        dispatch({ type: FLIGHT_GEO_SEARCH, payload: response.data.matches, selection, geoType, name })
      })
  }
};