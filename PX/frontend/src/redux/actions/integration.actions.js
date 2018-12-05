import axios from 'axios';
import { ROOT_URL } from "../../vars";
import {
    LIST_INTEGRATIONS,
    LIST_INTEGRATIONS_DROPDOWN,
    INTEGRATIONS_LIST_ERROR,
    RESET_INTEGRATIONS_REDUCER,
    MODAL_SUCCESS,
    MODAL_ERROR,
    CHANGE_INTEGRATIONS,
    DISPLAY_INTEGRATION,
    INTEGRATION_READ_ERROR,
    READ_INTEGRATION,
    READ_ACTIVE_INTEGRATION,
    LIST_INTEGRATIONS_DROPDOWN_ERROR
} from './types';

export const readActiveIntegration = id => dispatch => {
    axios.post(`${ROOT_URL}/integration/read`, { id }, {
        headers: { authorization: localStorage.getItem('token') }
    })
        .then(response => {
            dispatch({ type: READ_ACTIVE_INTEGRATION, payload: response.data })
        })
        .catch(err => {
            console.log(err);
            // dispatch({ type: PLACEMENTS_LIST_ERROR });
        })
};

export const listIntegrations = data => dispatch => {
    axios.post(`${ROOT_URL}/integration/list`, data, {
        headers: { authorization: localStorage.getItem('token') }
    })
        .then(response => {
            dispatch({ type: LIST_INTEGRATIONS, payload: response.data });
        })
        .catch(err => {
            console.log(err);
            dispatch({ type: INTEGRATIONS_LIST_ERROR });
        })
};

export const listIntegrationsDropdown = () => dispatch => {
    axios.get(`${ROOT_URL}/integration/list`, {
        headers: { authorization: localStorage.getItem('token') }
    })
        .then(response => {
            dispatch({ type: LIST_INTEGRATIONS_DROPDOWN, payload: response.data });
        })
        .catch(err => {
            dispatch({ type: LIST_INTEGRATIONS_DROPDOWN_ERROR });
        })
};

export const resetIntegrationReducer = () => dispatch => {
    dispatch({ type: RESET_INTEGRATIONS_REDUCER })
};

export const deleteIntegration = id => dispatch => {
    axios.post(`${ROOT_URL}/integration/delete`, { id }, {
        headers: { authorization: localStorage.getItem('token') }
    })
        .then(response => {
            dispatch({ type: MODAL_SUCCESS, payload: 'The integration was deleted successfully.' });
        })
        .catch(err => {
            dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
        })
};

export const changeIntegration = ({ prop, value }) => dispatch => {
    dispatch({ type: CHANGE_INTEGRATIONS, prop, value });
};

export const listDisabledIntegrations = data => dispatch => {
    axios.post(`${ROOT_URL}/integration/list_disabled`, data, {
        headers: { authorization: localStorage.getItem('token') }
    })
        .then(response => {
            dispatch({ type: LIST_INTEGRATIONS, payload: response.data });
        })
        .catch(err => {
            dispatch({ type: INTEGRATIONS_LIST_ERROR });
        })
};

export const readDisplayIntegration = id => dispatch => {
    axios.post(`${ROOT_URL}/integration/read`, { id }, {
        headers: { authorization: localStorage.getItem('token') }
    })
        .then(response => {
            dispatch({ type: DISPLAY_INTEGRATION, payload: response.data });
        })
        .catch(err => {
            console.log(err);
            dispatch({ type: MODAL_ERROR, payload: "Could not display the integration at this time. Please try again later." });
        })
};

export const readIntegration = id => dispatch => {
    axios.post(`${ROOT_URL}/integration/read`, { id }, {
        headers: { authorization: localStorage.getItem('token') }
    })
        .then(response => {
            dispatch({ type: READ_INTEGRATION, payload: response.data });
        })
        .catch(err => {
            dispatch({ type: INTEGRATIONS_READ_ERROR });
        })
};

export const createIntegration = data => dispatch => {
    axios.post(`${ROOT_URL}/integration/create`, data, {
        headers: { authorization: localStorage.getItem('token') }
    })
        .then(response => {
            dispatch({ type: MODAL_SUCCESS, payload: 'integration was created successfully' });
        })
        .catch(err => {
            dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
        })
};

export const updateIntegration = data => dispatch => {
    axios.post(`${ROOT_URL}/integration/update`, data, {
        headers: { authorization: localStorage.getItem('token') }
    })
        .then(response => {
            dispatch({ type: MODAL_SUCCESS, payload: 'integration was updated successfully' });
        })
        .catch(err => {
            dispatch({ type: MODAL_ERROR, payload: err.response.data.msg });
        })
};

