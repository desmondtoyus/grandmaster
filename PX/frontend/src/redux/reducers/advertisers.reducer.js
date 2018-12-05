import {
  ADVERTISERS_LIST_ERROR,
  LIST_ADVERTISERS,
  RESET_ADVERTISERS_REDUCER,
  CHANGE_ADVERTISERS, READ_ACTIVE_ADVERTISER
} from '../actions/types';

const INITIAL_STATE = {
  loader: true,
  idSort: 'sort descending',
  nameSort: 'sort',
  created_atSort: 'sort',
  advertisers: [],
  searchTerm: '',
  sortDirection: 'desc',
  sortBy: 'id',
  currentPage: 1,
  pageChunk: 15,
  listError: false,
  pagination: null,
  activeItem: 'ADVERTISERS',
  activeAdvertiser: null
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case LIST_ADVERTISERS:
      return { ...state, advertisers: action.payload.rows, pagination: action.payload.pagination, listError: false, loader: false };
    case ADVERTISERS_LIST_ERROR:
      return { ...state, listError: true, advertisers: [], pagination: null };
    case RESET_ADVERTISERS_REDUCER:
      return { ...INITIAL_STATE, advertisers: [] };
    case CHANGE_ADVERTISERS:
      return { ...state, [action.prop]: action.value };
    case READ_ACTIVE_ADVERTISER:
      return { ...state, activeAdvertiser: action.payload };
    default:
      return state;
  }
}
