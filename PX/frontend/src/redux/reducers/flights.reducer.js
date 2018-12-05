import {
  FLIGHTS_LIST_ERROR,
  LIST_FLIGHTS,
  RESET_FLIGHTS_REDUCER,
  CHANGE_FLIGHTS,
  FLIGHTS_PLACEMENT,
  SUPPLY_FAIL,
  CHANGE_MENU_STATE
} from '../actions/types';

const INITIAL_STATE = {
  listError: false,
  flights: [],
  flights_placement: [],
  flights_placement_error: false,
  loader: true,
  pagination: null,
  idSort: 'sort descending',
  nameSort: 'sort',
  channelSort: 'sort',
  formatSort: 'sort',
  statusSort: 'sort',
  start_timeSort: 'sort',
  end_timeSort: 'sort',
  searchTerm: '',
  sortDirection: 'desc',
  sortBy: 'id',
  currentPage: 1,
  pageChunk: 15,
  activeItem: 'ALL',
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FLIGHTS_LIST_ERROR:
      return { ...state, listError: true, flights: [], loader: false, pagination: null };
    case FLIGHTS_PLACEMENT:
      return { ...state, flights_placement: action.payload.supplyList, listError: false, loader: false };
    case SUPPLY_FAIL:
      return { ...state, flights_placement_error: true, loader: false };
    case LIST_FLIGHTS:
      return { ...state, flights: action.payload.rows, pagination: action.payload.pagination, listError: false, loader: false };
    case RESET_FLIGHTS_REDUCER:
      return {
        ...state, listError: false,
        flights: [],
        flights_placement: [],
        flights_placement_error: false,
        loader: true,
        pagination: null,
        idSort: 'sort descending',
        nameSort: 'sort',
        channelSort: 'sort',
        formatSort: 'sort',
        statusSort: 'sort',
        start_timeSort: 'sort',
        end_timeSort: 'sort',
        searchTerm: '',
        sortDirection: 'desc',
        sortBy: 'id',
        pageChunk: 15,
        activeItem: 'ALL',
        iFlight: false,
      };
    case CHANGE_FLIGHTS:
      return { ...state, [action.prop]: action.value };
    case CHANGE_MENU_STATE:
      return { ...state, currentPage: 1 };
    default:
      return state;
  }
}












