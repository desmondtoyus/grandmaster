import {
  MODAL_STATE_CHANGE,
  CLEAR_MODAL_ERRORS,
  RESET_MODAL_REDUCER,
  RESET_ACCOUNT_ERRORS,
  RESET_USER_ERRORS,
  RESET_PUBLISHER_ERRORS,
  RESET_ADVERTISER_ERRORS,
  RESET_INTEGRATION_ERRORS,
  RESET_CAMPAIGN_ERRORS
} from './types';

export const modalStateChange = ({ prop, value }) => dispatch => {
  dispatch({ type: MODAL_STATE_CHANGE, prop, value });
};

export const clearModalErrors = () => dispatch => {
  dispatch({ type: CLEAR_MODAL_ERRORS });
};

export const resetModalReducer = () => dispatch => {
  dispatch({ type: RESET_MODAL_REDUCER });
};

export const resetAccountErrors = () => dispatch => {
  dispatch({ type: RESET_ACCOUNT_ERRORS });
};

export const resetUserErrors = () => dispatch =>{
  dispatch({ type: RESET_USER_ERRORS });
};

export const resetPublisherErrors = () => dispatch => {
  dispatch({ type: RESET_PUBLISHER_ERRORS });
};

export const resetAdvertiserErrors = () => dispatch => {
  dispatch({ type: RESET_ADVERTISER_ERRORS });
};

export const resetIntegrationErrors= () => dispatch => {
  dispatch({ type: RESET_INTEGRATION_ERRORS });
};


export const resetCampaignErrors = () => dispatch => {
  dispatch({ type: RESET_CAMPAIGN_ERRORS });
};