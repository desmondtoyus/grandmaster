import { ANALYTICS_URL, CSV_URL } from '../../vars';
import axios from 'axios';

import {
    CHANGE_REJECTIONS_STATE,
    OLAP_REJECTIONS_VALIDATION,
    OLAP_REJECTIONS_FILTER,
    RESET_REJECTIONS_ERRORS,
    RUN_REJECTIONS_REPORT,
    SET_REJECTIONS_SORTING,
    RUN_REJECTIONS_REPORT_CSV,
    RUN_REJECTIONS_REPORT_ERROR
} from './types';

export const changeRejectionState = ({ prop, value }) => dispatch => {
  dispatch({ type: CHANGE_REJECTIONS_STATE, prop, value });
};

export const olapRejectionValidation = (keys,  interval, start_time, end_time, timezone) => dispatch => {
  const payload = {
    keys,
    interval,
    start_time,
     end_time, 
    timezone
  };
  axios.post(`${ANALYTICS_URL}/api/reports/validate_rejections/`, payload, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      dispatch({ type: OLAP_REJECTIONS_VALIDATION, payload: response.data.results });
    })
    
};
export const olapRejectionFilter = ({ category, fragment, filter }) => dispatch => {
  // if (fragment.length < 3) {
  // } else {
    axios.post(`${ANALYTICS_URL}/api/services/autocompletes/`, { category, fragment }, {
      headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
    })
      .then(response => {
        dispatch({ type: OLAP_REJECTIONS_FILTER, payload: response.data.matches, filter, category });
      })
  // }
};

export const resetRejectionErrors = () => dispatch => {
  dispatch({ type: RESET_REJECTIONS_ERRORS });
};

export const runReport = data => dispatch => {
  axios.post(`${ANALYTICS_URL}/api/reports/rejections/`, data, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      if (data.format === 'JSON') {
        dispatch({ type: RUN_REJECTIONS_REPORT, payload: response.data.results });
      }
      else if (data.format === 'CSV') {
        window.open(`${CSV_URL}${response.data.results.param}`);
        dispatch({ type: RUN_REJECTIONS_REPORT_CSV });
      }
    })
    // .catch(err => console.log(err));
    .catch(err => {
      dispatch({ type: RUN_REJECTIONS_REPORT_ERROR, payload: err });
    })
};

export const setRejectionSorting = name => dispatch => {
  dispatch({ type: SET_REJECTIONS_SORTING, payload: name });
};
