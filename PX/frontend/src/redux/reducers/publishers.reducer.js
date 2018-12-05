import {
  LIST_PUBLISHERS,
  PUBLISHERS_LIST_ERROR,
  RESET_PUBLISHERS_REDUCER,
  CHANGE_PUBLISHERS,
  READ_ACTIVE_PUBLISHER
} from '../actions/types';

const INITIAL_STATE = {
  activePublisher: null,
  loader: true,
  idSort: 'sort descending',
  nameSort: 'sort',
  created_atSort: 'sort',
  publishers: [],
  searchTerm: '',
  sortDirection: 'desc',
  sortBy: 'id',
  currentPage: 1,
  pageChunk: 15,
  listError: false,
  pagination: null,
  activeItem: 'PUBLISHERS'
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case READ_ACTIVE_PUBLISHER:
      return { ...state, activePublisher: action.payload };
    case LIST_PUBLISHERS:
      return { ...state, publishers: action.payload.rows, pagination: action.payload.pagination, listError: false, loader: false };
    case PUBLISHERS_LIST_ERROR:
      return { ...state, listError: true, publishers: [], loader: false, pagination: null };
    case RESET_PUBLISHERS_REDUCER:
      return { ...INITIAL_STATE, publishers: [] };
    case CHANGE_PUBLISHERS:
      return { ...state, [action.prop]: action.value };
    default:
      return state;
  }
}