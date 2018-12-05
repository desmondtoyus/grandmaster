import {
  LIST_USERS,
  READ_ACTIVE_USER,
  RESET_USER_ERRORS,
  USERS_LIST_ERROR,
  ACTIVE_USER_READ_ERROR,
  USER_ACTION,
  RESET_USERS_REDUCER,
  SET_USER_TIMEZONE,
  CHANGE_USERS
} from '../actions/types';

const INITIAL_STATE = {
  loader: true,
  idSort: 'sort descending',
  first_nameSort: 'sort',
  last_nameSort: 'sort',
  statusSort: 'sort',
  emailSort: 'sort',
  created_atSort: 'sort',
  users: [],
  searchTerm: '',
  sortDirection: 'desc',
  sortBy: 'id',
  currentPage: 1,
  pageChunk: 15,
  listError: false,
  pagination: null,
  activeItem: 'USERS'
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case RESET_USERS_REDUCER:
      return { ...INITIAL_STATE, users: [] };
    case LIST_USERS:
      return { ...state, users: action.payload.rows, pagination: action.payload.pagination, listError: false, loader: false };
    case USERS_LIST_ERROR:
      return { ...state, listError: true, users: [], pagination: null, loader: false };
    case CHANGE_USERS:
      return { ...state, [action.prop]: action.value };
    default:
      return state;
  }
}