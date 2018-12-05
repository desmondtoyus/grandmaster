import axios from 'axios';
import { ANALYTICS_URL, ROOT_URL } from "../../vars";
import {
  READ_ACTIVE_PUBLISHER,
  PLACEMENTS_LIST_ERROR,
  LIST_PLACEMENTS,
  RESET_PLACEMENTS_REDUCER,
  MODAL_SUCCESS,
  MODAL_ERROR,
  CHANGE_PLACEMENTS,
  DISPLAY_PLACEMENT,
  DISPLAY_TAG,
  PLAYER_DISPLAY_TAG,
  CHANGE_PLACEMENT,
  LIST_PLACEMENT_PUBLISHERS,
  PLACEMENT_ERROR,
  READ_PLACEMENT,
  RESET_PLACEMENT_REDUCER,
  LIST_PLACEMENT_DOMAIN_LISTS,
  RESET_PLACEMENT_ERRORS,
  PLACEMENT_SUCCESS,
  PLACEMENT_FAIL,
  LIST_DEMAND,
  PLACEMENT_FLIGHTS,
  DEMAND_FAIL,
  PLACEMENT_GEO_SEARCH,
  READ_OPPORTUNITY_COUNT,
  OPPORTUNITY_COUNT_ERROR,
  LIST_DOMAIN_TYPE
} from './types';

export const listPlacements = data => dispatch => {
  axios.post(`${ROOT_URL}/placement/list`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_PLACEMENTS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: PLACEMENTS_LIST_ERROR });
    })
};

export const listActivePlacements = data => dispatch => {
  axios.post(`${ROOT_URL}/placement/list_active`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_PLACEMENTS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: PLACEMENTS_LIST_ERROR });
    })
};

export const listInactivePlacements = data => dispatch => {
  axios.post(`${ROOT_URL}/placement/list_inactive`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_PLACEMENTS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: PLACEMENTS_LIST_ERROR });
    })
};

export const listDisabledPlacements = data => dispatch => {
  axios.post(`${ROOT_URL}/placement/list_disabled`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_PLACEMENTS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: PLACEMENTS_LIST_ERROR });
    })
};

export const resetPlacementsReducer = () => dispatch => {
  dispatch({ type: RESET_PLACEMENTS_REDUCER });
};

export const resetPlacementReducer = () => dispatch => {
  dispatch({ type: RESET_PLACEMENT_REDUCER });
};

export const deletePlacement = id => dispatch => {
  axios.post(`${ROOT_URL}/placement/delete`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'The placement was deleted successfully.' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const changePlacements = ({ prop, value }) => dispatch => {
  dispatch({type: CHANGE_PLACEMENTS, prop, value});
};

export const changePlacement = ({ prop, value }) => dispatch => {
  dispatch({type: CHANGE_PLACEMENT, prop, value});
};

export const activatePlacement = id => dispatch => {
  axios.post(`${ROOT_URL}/placement/activate`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
};

export const deactivatePlacement = id => dispatch => {
  axios.post(`${ROOT_URL}/placement/deactivate`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
};

export const readPlacementTag = id => dispatch => {
  axios.post(`${ROOT_URL}/placement/tag`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: DISPLAY_TAG, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: "Could not display the placement tag at this time. Please try again later." });
    })
};

//added
export const readPlacementPlayerTag = id => dispatch => {
  axios.post(`${ROOT_URL}/placement/video_tag`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: PLAYER_DISPLAY_TAG, payload: response.data });
    })
    .catch(err=>console.log('Cannot get Video Player Tag'));
};

export const readDisplayPlacement = id => dispatch => {
  axios.post(`${ROOT_URL}/placement/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: DISPLAY_PLACEMENT, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: MODAL_ERROR, payload: "Could not display the placement at this time. Please try again later." });
    })
};

export const listPlacementPublishers = (master) => dispatch => {
  axios.get(`${ROOT_URL}/publisher/list/${master}`, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_PLACEMENT_PUBLISHERS, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: PLACEMENT_ERROR });
    })
};

export const readOpportunityCount = id => dispatch => {
  axios.post(`${ROOT_URL}/placement/read_opportunity_count`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: READ_OPPORTUNITY_COUNT, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: OPPORTUNITY_COUNT_ERROR });
    })
};

export const readPlacement = id => dispatch => {
  axios.post(`${ROOT_URL}/placement/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: READ_PLACEMENT, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: PLACEMENT_ERROR });
    })
};

export const listPlacementDomainLists = (id) => dispatch => {
  axios.get(`${ROOT_URL}/lists/list/${id}`, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_PLACEMENT_DOMAIN_LISTS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
    })
};

export const getCurrentDomain = (id) => dispatch => {
  axios.post(`${ROOT_URL}/lists/type`, { id },{
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_DOMAIN_TYPE, payload: response.data });
    })
    .catch(err => {
      console.log(err);
    })
};

export const resetPlacementErrors = () => dispatch => {
  dispatch({ type: RESET_PLACEMENT_ERRORS });
};

export const createPlacement = ({ payload, callback }) => dispatch => {
  axios.post(`${ROOT_URL}/placement/create`, payload, {
   
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      callback();
      dispatch({ type: PLACEMENT_SUCCESS, payload: 'Placement was created successfully' });
    })
    .catch(err => {
      dispatch({ type: PLACEMENT_FAIL, payload: err.response.data.msg });
    })
};

export const updatePlacement = ({ payload, callback }) => dispatch => {
  axios.post(`${ROOT_URL}/placement/update`, payload, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      callback();
      dispatch({ type: PLACEMENT_SUCCESS, payload: 'Placement was updated successfully' });
    })
    .catch(err => {
      dispatch({ type: PLACEMENT_FAIL, payload: err.response.data.msg });
    })
};

export const listDemand = (id, searchTerm, master) => dispatch => {
  axios.post(`${ROOT_URL}/placement/list_demand`, { id, searchTerm, master }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_DEMAND, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: DEMAND_FAIL, payload: err.response.data.msg });
    })
};

export const getDemandList = (id, master) => dispatch => {
  axios.post(`${ROOT_URL}/placement/demand_list`, { id, master}, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: PLACEMENT_FLIGHTS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: DEMAND_FAIL, payload: err.response.data.msg });
    })
};

export const updateDemandList = ({ id, demandIds, demandPrioritization }) => dispatch => {
  axios.post(`${ROOT_URL}/placement/update_demand`, { id, demandIds, demandPrioritization }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: "Demand List was saved successfully" });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const placementGeoSearch = ({ geoType, name, fragment, selection, category }) => dispatch => {
  if (fragment.length < 3) {
    dispatch({ type: PLACEMENT_GEO_SEARCH, payload: [], selection, geoType, name });
  }
  else {
    axios.post(`${ANALYTICS_URL}/api/services/autocompletes/`, { category, fragment }, {
      headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
    })
      .then(response => {
        dispatch({ type: PLACEMENT_GEO_SEARCH, payload: response.data.matches, selection, geoType, name })
      })
  }
};
