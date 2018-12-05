import {
    LIST_INTEGRATIONS,
    INTEGRATIONS_LIST_ERROR,
    RESET_INTEGRATIONS_REDUCER,
    CHANGE_INTEGRATIONS,
    READ_ACTIVE_INTEGRATION
} from '../actions/types';

const INITIAL_STATE = {
    activeIntegration: null,
    loader: true,
    idSort: 'sort descending',
    nameSort: 'sort',
    created_atSort: 'sort',
    integrations: [],
    searchTerm: '',
    sortDirection: 'desc',
    sortBy: 'id',
    currentPage: 1,
    pageChunk: 15,
    listError: false,
    pagination: null,
    activeItem: 'INTEGRATIONS'
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case READ_ACTIVE_INTEGRATION:
            return { ...state, activeIntegration: action.payload };
        case LIST_INTEGRATIONS:
            return { ...state, integrations: action.payload.rows, pagination: action.payload.pagination, listError: false, loader: false };
        case INTEGRATIONS_LIST_ERROR:
            return { ...state, listError: true, integrations: [], loader: false, pagination: null };
        case RESET_INTEGRATIONS_REDUCER:
            return { ...INITIAL_STATE, integrations: [] };
        case CHANGE_INTEGRATIONS:
            return { ...state, [action.prop]: action.value };
        default:
            return state;
    }
}