import {
  DOMAIN_LIST_CHANGE,
  DOMAIN_LIST_UPLOAD_SUCCESS,
  DOMAIN_LIST_UPLOAD_FAIL,
  DOMAIN_LIST_CREATE_FAIL,
  DOMAIN_LIST_CREATE_SUCCESS,
  RESET_DOMAIN_LIST_ERRORS,
  RESET_DOMAIN_LIST_REDUCER,
  READ_DOMAIN_LIST,
  DOMAIN_LIST_EDIT_FAIL,
  DOMAIN_LIST_UPDATE_SUCCESS,
  DOMAIN_LIST_UPDATE_FAIL
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  errorName: false,
  domains: '',
  uploadMessage: 'DROP LIST HERE OR CLICK TO UPLOAD. TXT FILES SUPPORTED',
  errorDomains: false,
  uploadedDomains: [],
  errors: false,
  errorList: [],
  success: false,
  fail: false,
  message: '',
  list: [],
  invalidArr:[],
  editStatus: 'append'
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case DOMAIN_LIST_CHANGE:
      return { ...state, [action.prop]: action.value };
    case DOMAIN_LIST_UPLOAD_SUCCESS:
      return { ...state, uploadMessage: action.payload.msg, uploadedDomains: action.payload.domains, invalidArr:action.payload.invalidArr  };
    case DOMAIN_LIST_UPLOAD_FAIL:
      return { ...state, uploadMessage: 'Could not upload the list at this time. Please try again later.' };
    case DOMAIN_LIST_CREATE_SUCCESS:
      return { ...state, success: true, fail: false, message: 'Domain list was created successfully' };
    case DOMAIN_LIST_UPDATE_SUCCESS:
      return { ...state, success: true, fail: false, message: 'Domain list was updated successfully' };
    case DOMAIN_LIST_CREATE_FAIL:
      return { ...state, success: false, fail: true, message: 'Failed to create a domain list. Please check your inputs or try again later.' };
    case DOMAIN_LIST_UPDATE_FAIL:
      return { ...state, success: false, fail: true, message: 'Failed to update the domain list. Please check your inputs or try again later.' };
    case RESET_DOMAIN_LIST_ERRORS:
      return { ...state, errorName: false, errorDomains: false, errors: false, errorList: [], invalidArr:[], success: false, fail: false, message: '' };
    case READ_DOMAIN_LIST:
      return { ...state, name: action.payload.name, list: action.payload.value };
    case RESET_DOMAIN_LIST_REDUCER:
      return { ...INITIAL_STATE, uploadedDomains: [], errorList: [], list: [], invalidArr:[] };
    case DOMAIN_LIST_EDIT_FAIL:
      return { ...state, success: false, fail: true, message: 'Cannot edit the domain list at this time. Please try again later.' };
    default:
      return state;
  }
}