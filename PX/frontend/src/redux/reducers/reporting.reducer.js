import {
  FETCH_AUTOCOMPLETE,
  RUN_PUB_REPORT,
  RESET_REPORTING_REDUCER,
  PUB_REPORT_ERROR,
  FETCH_ALL_PID,
  FETCH_ALL_PID_ERR
} from '../actions/types';

const INITIAL_STATE = {
  pubs: [{ text: "All", value: "all" }],
  results: null,
  daily: null,
  totals: null,
  pagination: null,
  error: false,
  chartResults: null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ALL_PID:
      return { ...state, pubs: action.payload };
    case FETCH_ALL_PID_ERR:
      return { ...state, pubs: [{ text: "All", value: "all" }] };
    case FETCH_AUTOCOMPLETE:
      return { ...state, pubs: action.payload };
    case RUN_PUB_REPORT:
      return { ...state, results: action.results, daily: action.daily, totals: action.totals, pagination: action.pagination, error: false, chartResults: action.chartResults, updateChart: true };
    case PUB_REPORT_ERROR:
      return { ...state, error: true, results: null, daily: null, totals: null, pagination: null };
    case RESET_REPORTING_REDUCER:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}