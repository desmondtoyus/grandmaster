import axios from 'axios';
import { PUB_REPORT_URL, PUBID_URL, PUB_CSV_URL, PUB_ALL_PID } from '../../vars';
import {
  FETCH_AUTOCOMPLETE,
  RUN_PUB_REPORT,
  RESET_REPORTING_REDUCER,
  PUB_REPORT_ERROR,
  FETCH_ALL_PID_ERR,
  FETCH_ALL_PID
} from '../actions/types';

export function resetReportingReducer() {
  return function(dispatch) {
    dispatch({type: RESET_REPORTING_REDUCER});
  }
}

export function runReport(data) {
  return function(dispatch) {
    axios.post(PUB_REPORT_URL, data, {
       // headers: { Authorization: getCookie('bwajwt') }
      //  headers: { authorization: localStorage.getItem('token') }
      headers: { authorization: 'JWT ' + localStorage.getItem('token') } 
      // headers: { authorization: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTQ2NjI1MzcsImlkIjoxNCwiem9uZV9pZCI6MSwiYWNjb3VudF9pZCI6NywiZW1haWwiOiJSYW5IQFNla2luZG8uY29tIn0.O-PaonFmzk0WvOcVBqtCQHSfZIBniMH56nGlkvYmbYU' }
    })
      .then(response => {
        // console.log('Checking for Response type', data.format);
        if (data.format === "JSON") {
          // console.log('Checking for Response JSON', response);
          dispatch({ type: RUN_PUB_REPORT, results: response.data.results.rows, chartResults: getChartResults(response.data.results.daily_sums), daily: response.data.results.daily_sums, totals: response.data.results.totals, pagination: response.data.results.pagination });
          // console.log('Checking for Response', response);
        }
        else{
          window.location.href = `${PUB_CSV_URL}${response.data.results.param}`;
        }
       
      })
      .catch(error => {
        dispatch({ type: PUB_REPORT_ERROR });
      })
  }
}

export function fetchAutocomplete(data) {
  return function(dispatch) {
    axios.post(PUBID_URL, data, {
      // headers: { Authorization: getCookie('bwajwt') }
      headers: { authorization: 'JWT ' + localStorage.getItem('token') } 
      // headers: { authorization: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTQ2NjI1MzcsImlkIjoxNCwiem9uZV9pZCI6MSwiYWNjb3VudF9pZCI6NywiZW1haWwiOiJSYW5IQFNla2luZG8uY29tIn0.O-PaonFmzk0WvOcVBqtCQHSfZIBniMH56nGlkvYmbYU' }

    })
      .then(response => {
        // console.log("user Nmaes",response)
        dispatch({type: FETCH_AUTOCOMPLETE, payload: getPubs(response.data.matches)});
      })
      .catch(error => {
        dispatch({type: FETCH_AUTOCOMPLETE, payload: []});
      })
  }
}

export function fetchAllPid() {
  return function (dispatch) {
    axios.get(PUB_ALL_PID, {
      // headers: { Authorization: getCookie('bwajwt') }
      headers: { authorization: 'JWT ' + localStorage.getItem('token') }
      // headers: { authorization: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTQ2NjI1MzcsImlkIjoxNCwiem9uZV9pZCI6MSwiYWNjb3VudF9pZCI6NywiZW1haWwiOiJSYW5IQFNla2luZG8uY29tIn0.O-PaonFmzk0WvOcVBqtCQHSfZIBniMH56nGlkvYmbYU' }
    })
      .then(response => {
        let matches = response.data.matches;
        matches.unshift({ text: "All", value: "all" });
        dispatch({ type: FETCH_ALL_PID, payload: matches });
      })
      .catch(error => {
        dispatch({ type: FETCH_ALL_PID_ERR, payload: [] });
      })
  }
}



// function getCookie(cname) {
//   let name = cname + "=";
//   let decodedCookie = decodeURIComponent(document.cookie);
//   let ca = decodedCookie.split(';');
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) == ' ') {
//       c = c.substring(1);
//     }
//     if (c.indexOf(name) == 0) {
//       return "JWT " + c.substring(name.length, c.length);
//     }
//   }
//   return "";
// }

function getPubs(data) {
  let arr = [];
  data.forEach((item) => {
    arr.push({
      value: item.value,
      text: item.value
    })
  });

  return arr;
}

function getChartResults(data) {
  let payload =[];
  let obj;
  for (let index = 0; index < data.length; index++) {
    obj = {
      cateories: data[index].record_date,
      opp: Number(data[index].adimpressions),
      imp: Number(data[index].adopportunities),
      attempt: Number(data[index].adattempts),
    }
    payload.push(obj);
  }
  return payload;
}