import {
  AUTH_CHANGE,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  RESET_AUTH_REDUCER,
  PASSWORD_RESET,
  ACCOUNT_REQUEST_SUCCESS,
  ACCOUNT_REQUEST_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  errorMessage: '',
  reCaptcha: '',
  passwordSent: false,
  company: '',
  firstName: '',
  lastName: '',
  verifyEmail: '',
  phone: '',
  verifyPassword: '',
  signupErrors: [],
  accountSubmitted: false
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case AUTH_CHANGE:
      return { ...state, [action.prop]: action.value };
    case LOGIN_ERROR:
      return { ...state, password: '', errorMessage: 'Wrong login information' };
    case LOGIN_SUCCESS:
    case RESET_AUTH_REDUCER:
      return { ...INITIAL_STATE, signupErrors: [] };
    case PASSWORD_RESET:
      return { ...state, passwordSent: true };
    case ACCOUNT_REQUEST_SUCCESS:
      return { ...INITIAL_STATE, accountSubmitted: true };
    case ACCOUNT_REQUEST_ERROR:
      return { ...state, password: '', verifyPassword: '', signupErrors: [action.payload] };
    default:
      return state;
  }
}