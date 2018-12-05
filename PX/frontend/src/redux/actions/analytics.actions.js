import { ANALYTICS_URL, CSV_URL } from '../../vars';
import axios from 'axios';

import {
  CHANGE_ANALYTICS_STATE,
  OLAP_VALIDATION,
  OLAP_FILTER,
  RESET_ANALYTICS_ERRORS,
  RUN_REPORT,
  SET_ANALYTICS_SORTING,
  RUN_REPORT_CSV,
  RUN_REPORT_ERR,
} from './types';

export const changeAnalyticsState = ({ prop, value }) => dispatch => {
  dispatch({ type: CHANGE_ANALYTICS_STATE, prop, value });
};

export const olapValidation = (keys, metrics, interval, start_time, end_time, timezone) => dispatch => {
  const payload = {
    keys,
    metrics,
    interval,
    start_time,
     end_time, 
    timezone
  };
  axios.post(`${ANALYTICS_URL}/api/reports/validate_olap/`, payload, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      dispatch({ type: OLAP_VALIDATION, payload: response.data.results });
    })
    
};
export const olapFilter = ({ category, fragment, filter }) => dispatch => {
  // if (fragment.length < 3) {
  // } else {
    axios.post(`${ANALYTICS_URL}/api/services/autocompletes/`, { category, fragment }, {
      headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
    })
      .then(response => {
        dispatch({ type: OLAP_FILTER, payload: response.data.matches, filter, category });
      })
  // }
};

export const resetAnalyticsErrors = () => dispatch => {
  dispatch({ type: RESET_ANALYTICS_ERRORS });
};

export const runReport = data => dispatch => {
  axios.post(`${ANALYTICS_URL}/api/reports/olap/`, data, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      if (data.format === 'JSON') {
        dispatch({ type: RUN_REPORT, payload: response.data.results });
      }
      else if (data.format === 'CSV') {
        window.open(`${CSV_URL}${response.data.results.param}`);
        dispatch({ type: RUN_REPORT_CSV });
      }
    })
    // .catch(err => console.log(err));
    .catch(err => {
      dispatch({ type: RUN_REPORT_ERR, payload: err });
    })
};

export const setAnalyticsSorting = name => dispatch => {
  dispatch({ type: SET_ANALYTICS_SORTING, payload: name });
};

export const runSortReport = data => dispatch => {
  dispatch({ type: RUN_REPORT, payload: data });
};