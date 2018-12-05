import {
  CAMPAIGNS_LIST_ERROR,
  LIST_CAMPAIGNS,
  RESET_CAMPAIGNS_REDUCER,
  CHANGE_CAMPAIGNS,
  READ_ACTIVE_CAMPAIGN
} from '../actions/types';

const INITIAL_STATE = {
  activeCampaign: null,
  listError: false,
  campaigns: [],
  loader: true,
  pagination: null,
  idSort: 'sort descending',
  nameSort: 'sort',
  start_timeSort: 'sort',
  end_timeSort: 'sort',
  statusSort: 'sort',
  searchTerm: '',
  sortDirection: 'desc',
  sortBy: 'id',
  currentPage: 1,
  pageChunk: 15,
  activeItem: 'ALL'
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case READ_ACTIVE_CAMPAIGN:
      return { ...state, activeCampaign: action.payload };
    case CAMPAIGNS_LIST_ERROR:
      return { ...state, listError: true, campaigns: [], loader: false, pagination: null };
    case LIST_CAMPAIGNS:
      return { ...state, campaigns: action.payload.rows, pagination: action.payload.pagination, listError: false, loader: false };
    case RESET_CAMPAIGNS_REDUCER:
      return { ...INITIAL_STATE, campaigns: [] };
    case CHANGE_CAMPAIGNS:
      return { ...state, [action.prop]: action.value };
    default:
      return state;
  }
}

