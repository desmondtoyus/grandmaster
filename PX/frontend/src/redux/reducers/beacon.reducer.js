import {
  CREATE_BEACON,
  READ_BEACON,
  BEACON_CREATE_ERROR,
  BEACON_READ_DISPLAY_ERROR,
  RESET_BEACON_REDUCER
} from '../actions/types';

const INITIAL_STATE = {
  displayBeacon: null,
  error: false,
  success: false,
  readDisplayError: false,
  errorMessage: ""
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case CREATE_BEACON:
      return { ...state, success: true, errorMessage: "", error: false };
    case BEACON_READ_DISPLAY_ERROR:
      return { ...state, displayBeacon: {}, readDisplayError: true };
    case READ_BEACON:
      return { ...state, displayBeacon: action.payload, readDisplayError: false };
    case BEACON_CREATE_ERROR:
      return { ...state, error: false, errorMessage: action.message, success: false };
    case RESET_BEACON_REDUCER:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}
