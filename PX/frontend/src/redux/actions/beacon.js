import axios from 'axios';
import qs from 'qs';
import { ROOT_URL } from '../../vars';
import {
  LIST_BEACONS,
  CREATE_BEACON,
  LIST_DISABLED_BEACONS,
  READ_BEACON,
  BEACON_CREATE_ERROR,
  RESET_BEACON_ERRORS,
  BEACONS_LIST_ERROR,
  BEACON_READ_DISPLAY_ERROR,
  BEACON_ACTION,
  RESET_BEACON_REDUCER,
  RESET_BEACONS_REDUCER
} from './types'

export function readDisplayBeacon(id) {
  return function(dispatch) {
    let payload = {};
    payload.publisher_id = id;

    const qsPayload = qs.stringify(payload);

    axios.post(`${ROOT_URL}/beacon/read`, qsPayload)
      .then(response => {
        if (response.data.success) {
          dispatch({type: READ_BEACON, payload: response.data.content});
        }
        else {
          dispatch({type: BEACON_READ_DISPLAY_ERROR});
        }
      })
  }
}

export function resetBeaconErrors() {
  return function(dispatch) {
    dispatch({type: RESET_BEACON_ERRORS});
  }
}

export function resetBeaconsReducer() {
  return function(dispatch) {
    dispatch({type: RESET_BEACONS_REDUCER});
  }
}

export function resetBeaconReducer() {
  return function(dispatch) {
    dispatch({type: RESET_BEACON_REDUCER});
  }
}

export function createBeacon(data) {
  return function(dispatch) {
    let payload = {};
    payload.new_beacon = data;

    const qsPayload = qs.stringify(payload);

    axios.post(`${ROOT_URL}/beacon/create`, qsPayload)
      .then(response => {
        if (response.data.success) {
          dispatch({type: CREATE_BEACON});
        }
        else {
          dispatch({type: BEACON_CREATE_ERROR, message: response.data.message});
        }
      })
  }
}

export function listBeacons(data) {
  return function(dispatch) {
    const qsPayload = qs.stringify(data);

    axios.post(`${ROOT_URL}/beacon/list`, qsPayload)
      .then(response => {
        if (response.data.success) {
          dispatch({type: LIST_BEACONS, payload: response});
        }
        else {
          dispatch({type: BEACONS_LIST_ERROR});
        }
      })
  }
}

export function listDisabledBeacons(data) {
  return function(dispatch) {
    const qsPayload = qs.stringify(data);

    axios.post(`${ROOT_URL}/beacon/list_disabled`, qsPayload)
      .then(response => {
        if (response.data.success) {
          dispatch({type: LIST_DISABLED_BEACONS, payload: response});
        }
        else {
          dispatch({type: BEACONS_LIST_ERROR});
        }
      })
  }
}

export function deleteBeacon(data) {
  return function(dispatch) {
    let payload = {};
    payload.beacon_id = data;

    const qsPayload = qs.stringify(payload);

    axios.post(`${ROOT_URL}/beacon/delete`, qsPayload)
      .then(response => {
        if (response.data.success) {
          dispatch({type: BEACON_ACTION, payload: {error: false, success: true, message: `Beacon was deleted successfully.`}});
        }
        else {
          dispatch({type: BEACON_ACTION, payload: {error: true, success: false, message: `Could not delete the beacon at this time. Please try again later.`}});
        }
      })
  }
}
