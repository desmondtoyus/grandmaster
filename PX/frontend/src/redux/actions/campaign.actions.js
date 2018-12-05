import axios from 'axios';
import { ROOT_URL} from "../../vars";
import {
  CAMPAIGNS_LIST_ERROR,
  CAMPAIGN_PIXEL_TAG,
  LIST_CAMPAIGNS,
  RESET_CAMPAIGNS_REDUCER,
  MODAL_SUCCESS,
  MODAL_ERROR,
  CHANGE_CAMPAIGNS,
  DISPLAY_CAMPAIGN,
  READ_CAMPAIGN,
  CAMPAIGN_READ_ERROR,
  LIST_CAMPAIGN_ADVERTISERS,
  READ_ACTIVE_CAMPAIGN
} from './types';

export const readActiveCampaign = id => dispatch => {
  axios.post(`${ROOT_URL}/campaign/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: READ_ACTIVE_CAMPAIGN, payload: response.data.campaign })
      
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: FLIGHTS_LIST_ERROR });
    })
};

export const listActiveCampaigns = data => dispatch => {
  axios.post(`${ROOT_URL}/campaign/list_active`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_CAMPAIGNS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: CAMPAIGNS_LIST_ERROR });
    })
};

export const listInactiveCampaigns = data => dispatch => {
  axios.post(`${ROOT_URL}/campaign/list_inactive`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_CAMPAIGNS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: CAMPAIGNS_LIST_ERROR });
    })
};

export const listDisabledCampaigns = data => dispatch => {
  axios.post(`${ROOT_URL}/campaign/list_disabled`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_CAMPAIGNS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: CAMPAIGNS_LIST_ERROR });
    })
};

export const listCampaigns = data => dispatch => {
  axios.post(`${ROOT_URL}/campaign/list`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_CAMPAIGNS, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: CAMPAIGNS_LIST_ERROR });
    })
};

export const resetCampaignsReducer = () => dispatch => {
  dispatch({ type: RESET_CAMPAIGNS_REDUCER });
};

export const deleteCampaign = id => dispatch => {
  axios.post(`${ROOT_URL}/campaign/delete`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'The campaign was deleted successfully.' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const changeCampaigns = ({ prop, value }) => dispatch => {
  dispatch({type: CHANGE_CAMPAIGNS, prop, value});
};

export const readDisplayCampaign = id => dispatch => {
  axios.post(`${ROOT_URL}/campaign/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: DISPLAY_CAMPAIGN, payload: response.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: MODAL_ERROR, payload: "Could not display the campaign at this time. Please try again later." });
    })
};

export const readCampaign = id =>  dispatch => {
  axios.post(`${ROOT_URL}/campaign/read`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: READ_CAMPAIGN, payload: response.data.campaign, timezone: response.data.timezone });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: CAMPAIGN_READ_ERROR });
    })
};

export const activateCampaign = id => dispatch => {
  axios.post(`${ROOT_URL}/campaign/activate`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
};

export const deactivateCampaign = id => dispatch => {
  axios.post(`${ROOT_URL}/campaign/deactivate`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
};

export const createCampaign = data => dispatch => {
  axios.post(`${ROOT_URL}/campaign/create`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'Campaign was created successfully' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const updateCampaign = data => dispatch => {
  axios.post(`${ROOT_URL}/campaign/update`, data, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: MODAL_SUCCESS, payload: 'Campaign was updated successfully' });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};
export const listCampaignAdvertisers = (master) => dispatch => {
  axios.get(`${ROOT_URL}/campaign/list_advertisers/${master}`, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: LIST_CAMPAIGN_ADVERTISERS, payload: response.data });
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
    })
};

export const readCampaignTag = id => dispatch => {
  axios.post(`${ROOT_URL}/campaign/tag`, { id }, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then(response => {
      dispatch({ type: CAMPAIGN_PIXEL_TAG, payload: response.data});
    })
    .catch(err => {
      dispatch({ type: MODAL_ERROR, payload: "Could not display the Campaign tag at this time. Please try again later." });
    })
};