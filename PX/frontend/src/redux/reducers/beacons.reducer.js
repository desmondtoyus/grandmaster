import {
  LIST_BEACONS,
  LIST_DISABLED_BEACONS,
  RESET_BEACONS_REDUCER,
  RESET_BEACON_ERRORS,
  BEACON_ACTION,
  BEACONS_LIST_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  all: [],
  pagination: null,
  listError: false,
  action: {
    error: false,
    success: false,
    message: ""
  },
  loader: true
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case LIST_BEACONS:
    case LIST_DISABLED_BEACONS:
      return { ...state, all: action.payload.data.content.rows, pagination: action.payload.data.content.pagination, listError: false, loader: false };
    case BEACONS_LIST_ERROR:
      return { ...state, lsitError: true, all: [], loader: false };
    case RESET_BEACON_ERRORS:
      return { ...state, listError: false, action: { error: false, success: false, message: ""}};
    case BEACON_ACTION:
      return { ...state, action: action.payload };
    case RESET_BEACONS_REDUCER:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}