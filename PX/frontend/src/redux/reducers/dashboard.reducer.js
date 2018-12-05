import {
  CHANGE_DASHBOARD_STATE,
  DASHBOARD_TABLE,
  DASHBOARD_KPI,
  DASHBOARD_SUMMARY, DASHBOARD_PERFORMANCE, DASHBOARD_FINANCIALS, DASHBOARD_DOMAINS, DASHBOARD_REACH, DASHBOARD_TRAFFIC,
  DASHBOARD_TOP_ADVERTISER, DASHBOARD_TABLE_TOP_PUBLISHER
} from '../actions/types';

const INITIAL_STATE = {
  activeItem: "TOP ADVERTISERS",
  dashboardTableData: [],
  dashboardTopAdvertiser:[],
  dashboardTopPublisher:[],
  kpi: null,
  summary: null,
  performance: null,
  performanceImps: 0,
  performanceFill: '',
  financials: null,
  cost: null,
  margin: null,
  domains: null,
  reach: null,
  traffic: null
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case CHANGE_DASHBOARD_STATE:
      return { ...state, [action.prop]: action.value };
    case DASHBOARD_TABLE:
    return { ...state, dashboardTableData: action.payload };
    case DASHBOARD_TABLE_TOP_PUBLISHER:
      return { ...state, dashboardTopPublisher: action.payload };
      case DASHBOARD_TOP_ADVERTISER:
      return { ...state, dashboardTopAdvertiser: action.payload };
    case DASHBOARD_KPI:
      return { ...state, kpi: action.payload };
    case DASHBOARD_SUMMARY:
      return { ...state, summary: action.payload };
    case DASHBOARD_PERFORMANCE:
      return  { ...state, performance: action.payload};
    case DASHBOARD_FINANCIALS:
      return { ...state, financials: action.payload.options, cost: action.payload.costOptions, margin: action.payload.marginOptions };
    case DASHBOARD_DOMAINS:
      return { ...state, domains: action.payload };
    case DASHBOARD_REACH:
      return { ...state, reach: action.payload };
    case DASHBOARD_TRAFFIC:
      return { ...state, traffic: action.payload };
    default:
      return state;
  }
}