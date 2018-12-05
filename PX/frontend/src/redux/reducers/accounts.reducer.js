import {
  RESET_ACCOUNTS_REDUCER,
  CHANGE_ACCOUNTS,
  LIST_ACCOUNTS,
  LIST_MASTER_ACCOUNTS,
  ACCOUNTS_LIST_ERROR, READ_ACTIVE_ACCOUNT
} from '../actions/types';

const INITIAL_STATE = {
  loader: true,
  idSort: "sort ascending",
  nameSort: 'sort',
  statusSort: 'sort',
  created_atSort: 'sort',
  accounts: [],
  searchTerm: '',
  sortDirection: 'asc',
  sortBy: 'id',
  currentPage: 1,
  pageChunk: 15,
  listError: false,
  pagination: null,
  activeItem: "ACCOUNTS",
  activeAccount: null,
  zone_accounts:[]
};
// LIST_MASTER_ACCOUNTS


export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case CHANGE_ACCOUNTS:
      return { ...state, [action.prop]: action.value };
    case LIST_ACCOUNTS:
      return { ...state, accounts: action.payload.rows, pagination: action.payload.pagination, listError: false, loader: false };
    case LIST_MASTER_ACCOUNTS:
      return { ...state, zone_accounts: action.payload };
    case ACCOUNTS_LIST_ERROR:
      return { ...state, listError: true, accounts: [], loader: false, pagination: null };
    case RESET_ACCOUNTS_REDUCER:
      return { ...INITIAL_STATE, accounts: [] };
    case READ_ACTIVE_ACCOUNT:
      return { ...state, activeAccount: action.payload };
    default:
      return state;
  }
}