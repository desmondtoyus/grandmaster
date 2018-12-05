import {
  PLACEMENTS_LIST_ERROR,
  LIST_PLACEMENTS,
  RESET_PLACEMENTS_REDUCER,
  CHANGE_PLACEMENTS,
  CHANGE_MENU_STATE
} from '../actions/types';

const INITIAL_STATE = {
  listError: false,
  placements: [],
  loader: true,
  pagination: null,
  idSort: 'sort descending',
  nameSort: 'sort',
  channelSort: 'sort',
  formatSort: 'sort',
  statusSort: 'sort',
  created_atSort: 'sort',
  searchTerm: '',
  sortDirection: 'desc',
  sortBy: 'id',
  currentPage: 1,
  pageChunk: 15,
  activeItem: 'ALL'
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case PLACEMENTS_LIST_ERROR:
      return { ...state, listError: true, placements: [], loader: false, pagination: null };
    case LIST_PLACEMENTS:
      return { ...state, placements: action.payload.rows, pagination: action.payload.pagination, listError: false, loader: false };
    case RESET_PLACEMENTS_REDUCER:
      return {
        ...state, listError: false,
        placements: [],
        loader: true,
        pagination: null,
        idSort: 'sort descending',
        nameSort: 'sort',
        channelSort: 'sort',
        formatSort: 'sort',
        statusSort: 'sort',
        created_atSort: 'sort',
        searchTerm: '',
        sortDirection: 'desc',
        sortBy: 'id',
        pageChunk: 15,
        activeItem: 'ALL' ,
        placements: [] };
    case CHANGE_MENU_STATE:
      return { ...state, currentPage: 1 };
    case CHANGE_PLACEMENTS:
      return { ...state, [action.prop]: action.value };
    default:
      return state;
  }
}