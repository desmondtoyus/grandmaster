import {
  READ_ACTIVE_USER,
  ACTIVE_USER_READ_ERROR,
  SET_USER_TIMEZONE
} from '../actions/types';

const INITIAL_STATE = {
  activeUser: null,
  activeUserError: false
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case READ_ACTIVE_USER:
    case SET_USER_TIMEZONE:
      return { activeUser: action.payload, activeUserError: false };
    case ACTIVE_USER_READ_ERROR:
      return { activeUser: null, activeUserError: true };
    default:
      return state;
  }
}