import {
  LIST_DOMAIN_LISTS,
  LIST_DOMAIN_LISTS_ERROR,
  RESET_DOMAIN_LISTS_REDUCER,
  DOMAIN_LISTS_CHANGE,
  LIST_FLIGHT_DOMAIN_LISTS,
  LIST_PLACEMENT_DOMAIN_LISTS
} from '../actions/types';

const INITIAL_STATE = {
  searchTerm: "",
  loader: true,
  lists: [],
  listError: false,
  idSort: "sort descending",
  nameSort: "sort",
  pagination: null,
  currentPage: 1,
  sortBy: "id",
  sortDirection: "desc",
  pageChunk: 15,
  domainLists: []
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case LIST_DOMAIN_LISTS:
      return { ...state, lists: action.payload.rows, pagination: action.payload.pagination, loader: false, listError: false };
    case LIST_DOMAIN_LISTS_ERROR:
      return { ...state, lists: [], pagination: null, loader: false, listError: true };
    case RESET_DOMAIN_LISTS_REDUCER:
      return { ...INITIAL_STATE, lists: [], domainLists: [] };
    case DOMAIN_LISTS_CHANGE:
      return { ...state, [action.prop]: action.value };
    case LIST_FLIGHT_DOMAIN_LISTS:
    case LIST_PLACEMENT_DOMAIN_LISTS:
      return { ...state, domainLists: action.payload };
    default:
      return state;
  }
}