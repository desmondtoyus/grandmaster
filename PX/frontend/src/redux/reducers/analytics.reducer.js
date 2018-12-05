import {
  CHANGE_ANALYTICS_STATE,
  OLAP_VALIDATION,
  OLAP_FILTER,
  RESET_ANALYTICS_ERRORS,
  RUN_REPORT,
  SET_ANALYTICS_SORTING,
  RUN_REPORT_CSV,
  RUN_REPORT_ERR,
  RUN_SORT_REPORT
} from '../actions/types';

const INITIAL_STATE = {
  errorDate: false,
  dateRange: "Month to Date",
  errorInterval: false,
  errorTimeZone: false,
  errorStartDate: false,
  interval: "day",
  errorStartTime: false,
  errorEndDate:false,
  errorEndTime: false,
  timeZone: "UTC",
  customStartDate: "",
  customStartTime: "",
  customEndDate: "",
  customEndTime: "",
  keys: [],
  metrics: [],
  disabledKeys: [],
  disabledMetrics: [],
  disabledFilters: [],
  placement_id: [],
  publisher_id: [],
  flight_id: [],
  placements: [],
  publishers: [],
  flights: [],
  advertiser_id: [],
  campaign_id: [],
  creative_id: [],
  advertisers: [],
  campaigns: [],
  creatives: [],
  companion_creative_id: [],
  companion_creatives: [],
  user_geo_country: [],
  user_geo_countrys: [],
  user_geo_country_filters:[],
  user_geo_province: [],
  user_geo_province_filters: [],
  user_geo_provinces: [],
  user_geo_dma: [],
  user_geo_dmas: [],
  user_geo_dma_filters: [],
  user_geo_city: [],
  user_geo_city_filters: [],
  user_geo_citys: [],
  user_geo_postal_code: [],
  user_geo_postal_codes: [],
  user_geo_postal_code_filters: [],
  referring_domain: [],
  referring_domains: [],
  channel: "",
  format: "",
  player_size: "",
  user_device_model: [],
  user_device_models: [],
  user_device_brand: [],
  user_device_brands: [],
  is_revshare: "",
  user_os_family: [],
  user_os_familys: [],
  user_browser_family: [],
  user_browser_familys: [],
  is_visible: "",
  is_viewable: "",
  rtb_source:"",
  demand_source_type:"",
  is_above_the_fold: "",
  placement_geo_rule_selected: [],
  placement_geo_rule_selecteds: [],
  flight_geo_rule_selected: [],
  flight_geo_rule_selecteds: [],
  errorList: [],
  loadingJSON: false,
  loadingCSV: false,
  currentPage: 1,
  sortBy: 'record_time',
  sortDirection: 'asc',
  pageChunk: 25,
  report: null,
  sortedColumns: [],
  advertiser_nameSort: 'sort',
  campaign_nameSort: 'sort',
  creative_nameSort: 'sort',
  companion_creative_nameSort: 'sort',
  flight_nameSort: 'sort',
  placement_nameSort: 'sort',
  publisher_nameSort: 'sort',
  channelSort: 'sort',
  flight_geo_rule_selectedSort: 'sort',
  formatSort: 'sort',
  player_sizeSort: 'sort',
  placement_geo_rule_selectedSort: 'sort',
  referring_domainSort: 'sort',
  user_ipv4Sort: 'sort',
  user_device_modelSort: 'sort',
  user_device_brandSort: 'sort',
  user_os_familySort: 'sort',
  user_browser_familySort: 'sort',
  user_geo_countrySort: 'sort',
  user_geo_citySort: 'sort',
  user_geo_provinceSort: 'sort',
  user_geo_dmaSort: 'sort',
  advertiser_idSort: 'sort',
  campaign_idSort: 'sort',
  companion_creative_idSort: 'sort',
  creative_idSort: 'sort',
  flight_idSort: 'sort',
  placement_idSort: 'sort',
  publisher_idSort: 'sort',
  record_timeSort: 'sort ascending',
  report_err: false
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case CHANGE_ANALYTICS_STATE:
      return { ...state, [action.prop]: action.value };
    case OLAP_VALIDATION:
      return { ...state, disabledKeys: action.payload.illegal_keys, disabledMetrics: action.payload.illegal_metrics, disabledFilters: action.payload.illegal_filters };
    case RUN_REPORT_ERR:
      return { ...state, report_err: true, loadingJSON:false,  loadingCSV: false};
      case OLAP_FILTER:
      return { ...state, [action.category]: addItems(action.payload, state[action.filter], state[action.category]) };
    case RESET_ANALYTICS_ERRORS:
      return {
        ...state,
        errorList: [],
        errorInterval: false,
        errorTimeZone: false,
        errorStartDate: false,
        errorStartTime: false,
        errorEndDate:false,
        errorEndTime: false,
      };
    case RUN_REPORT:
      return { ...state, report: action.payload, loadingCSV: false, loadingJSON: false, report_err: false};
    case RUN_REPORT_CSV:
      return { ...state, loadingCSV: false, loadingJSON: false, report_err: false };
    case SET_ANALYTICS_SORTING:
      return {
        ...state,
        advertiser_nameSort: 'sort',
        campaign_nameSort: 'sort',
        creative_nameSort: 'sort',
        companion_creative_nameSort: 'sort',
        flight_nameSort: 'sort',
        placement_nameSort: 'sort',
        publisher_nameSort: 'sort',
        channelSort: 'sort',
        flight_geo_rule_selectedSort: 'sort',
        formatSort: 'sort',
        player_sizeSort: 'sort',
        placement_geo_rule_selectedSort: 'sort',
        referring_domainSort: 'sort',
        user_ipv4Sort: 'sort',
        user_device_modelSort: 'sort',
        user_device_brandSort: 'sort',
        user_os_familySort: 'sort',
        user_browser_familySort: 'sort',
        user_geo_countrySort: 'sort',
        user_geo_citySort: 'sort',
        user_geo_provinceSort: 'sort',
        user_geo_dmaSort: 'sort',
        advertiser_idSort: 'sort',
        campaign_idSort: 'sort',
        companion_creative_idSort: 'sort',
        creative_idSort: 'sort',
        flight_idSort: 'sort',
        placement_idSort: 'sort',
        publisher_idSort: 'sort',
        record_timeSort: 'sort',
        [`${action.payload}Sort`]: `sort ${state.sortDirection}ending`
      };
    default:
      return state;
  }
}

function addItems(matches, existing, current) {
  let arr = [];
  current.forEach(item => {
    if (existing.includes(item.value)) {
      arr.push(item);
    }
  });
  matches.forEach(item => {
    if (!existing.includes(item.value)) {
      arr.push(item);
    }
  });
  return arr;
}