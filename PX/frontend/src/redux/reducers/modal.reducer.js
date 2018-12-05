import moment from 'moment-timezone';
import {
  PIXEL_TAG,
  CAMPAIGN_PIXEL_TAG,
  MODAL_STATE_CHANGE,
  DISPLAY_DOMAIN_LIST,
  MODAL_ERROR,
  MODAL_SUCCESS,
  CLEAR_MODAL_ERRORS,
  RESET_MODAL_REDUCER,
  RESET_ACCOUNT_ERRORS,
  ACCOUNT_READ_ERROR,
  READ_ACCOUNT,
  DISPLAY_ACCOUNT,
  READ_USER,
  USER_READ_ERROR,
  DISPLAY_USER,
  RESET_USER_ERRORS,
  DISPLAY_PUBLISHER,
  RESET_PUBLISHER_ERRORS,
  RESET_INTEGRATION_ERRORS,
  READ_PUBLISHER,
  READ_INTEGRATION,
  DISPLAY_PLACEMENT,
  DISPLAY_CAMPAIGN,
  DISPLAY_TAG,
  PLAYER_DISPLAY_TAG,
  PLACEMENT_SUCCESS,
  PLACEMENT_FAIL,
  DISPLAY_ADVERTISER,
  READ_ADVERTISER,
  ADVERTISER_READ_ERROR,
  PUBLISHER_READ_ERROR,
  RESET_ADVERTISER_ERRORS,
  READ_CAMPAIGN,
  CAMPAIGN_READ_ERROR,
  RESET_CAMPAIGN_ERRORS,
  LIST_CAMPAIGN_ADVERTISERS,
  FLIGHT_SUCCESS,
  FLIGHT_FAIL,
  DISPLAY_FLIGHT,
  LIST_DEMAND,
  LIST_SUPPLY,
  SUPPLY_FAIL,
  PLACEMENT_FLIGHTS,
  FLIGHTS_PLACEMENT,
  DEMAND_FAIL
} from '../actions/types';

const INITIAL_STATE = {
  error: false,
  errorMessage: '',
  success: false,
  successMessage: '',
  showDisplayDomainList: false,
  showDisplayAccount: false,
  showDisplayUser: false,
  showDisplayPublisher: false,
  showDisplayAdvertiser: false,
  showDisplayPlacement: false,
  showDisplayCampaign: false,
  showDisplayTag: false,
  showPixelTag: false,
  showDisplayFlight: false,
  showAddDemand: false,
  showAddSupply: false,
  displayDomainList: null,
  displayAccount: null,
  displayUser: null,
  displayPublisher: null,
  displayAdvertiser: null,
  displayPlacement: null,
  displayFlight: null,
  displayCampaign: null,
  displayTag: null,
  pixelTag: null,
  playerDisplayTag: '',
  showConfirmAction: false,
  showAlert: false,
  errorList: [],
  id: 0,
  modalStatus: '',
  // Confirm
  message: '',
  callback: () => { },
  header: '',
  // Account
  showAccount: false,
  name: '',
 iabCategory:[],
   errorIabCategory:false,
  errorName: false,
  notes: '',
  account_id: 0,
  account_idError: false,
  errorNotes: false,
  status: '',
  // User
  showUser: false,
  first_name: '',
  errorFirstName: false,
  last_name: '',
  errorLastName: false,
  email: '',
  errorEmail: false,
  phone_number: '',
  account_id: '',
  errorPhoneNumber: false,
  password: '',
  errorPassword: false,
  verifyPassword: '',
  errorVerifyPassword: false,
  role: 0,
  timezone: 'US/Pacific',
  // Publisher
  showPublisher: false,
  showIntegration: false,
  // Advertiser
  showAdvertiser: false,
  // Campaign
  advertisers: [],
  advertiserId: 0,
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  showDayImpressionGoal: false,
  showTotalImpressionGoal: false,
  dayImpressionGoal: '',
  totalImpressionGoal: '',
  errorAdvertiserId: false,
  errorStartDate: false,
  errorStartTime: false,
  errorEndDate: false,
  errorEndTime: false,
  errorDayImpressionGoal: false,
  errorTotalImpressionGoal: false,
  // Demand
  demand: [],
  supply: [],
  searchTerm: '',
  activeItem: '',
  demandList: [],
  demandIds: [],
  supplyList: [],
  supplyIds: [],
  demand_prioritization_type: 'user_defined',
  dealIdCheck: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MODAL_STATE_CHANGE:
      return { ...state, [action.prop]: action.value };
    case DISPLAY_DOMAIN_LIST:
      return { ...state, displayDomainList: action.payload };
    case DISPLAY_ACCOUNT:
      return { ...state, displayAccount: action.payload };
    case DISPLAY_USER:
      return { ...state, displayUser: action.payload };
    case DISPLAY_PUBLISHER:
      return { ...state, displayPublisher: action.payload };
    case DISPLAY_ADVERTISER:
      return { ...state, displayAdvertiser: action.payload };
    case DISPLAY_PLACEMENT:
      return { ...state, displayPlacement: action.payload };
    case DISPLAY_FLIGHT:
      return { ...state, displayFlight: action.payload };
    case DISPLAY_CAMPAIGN:
      return { ...state, displayCampaign: action.payload.campaign };
    case DISPLAY_TAG:
      return { ...state, displayTag: action.payload };
      case PIXEL_TAG:
      case  CAMPAIGN_PIXEL_TAG:
      return { ...state, pixelTag: action.payload };
    case PLAYER_DISPLAY_TAG:
      return { ...state, playerDisplayTag: action.payload };
    case MODAL_ERROR:
      return { ...state, error: true, success: false, errorMessage: action.payload, successMessage: '' };
    case MODAL_SUCCESS:
      return { ...state, error: false, success: true, errorMessage: '', successMessage: action.payload };
    case CLEAR_MODAL_ERRORS:
      return { ...state, error: false, success: false, errorMessage: '', successMessage: '', errorList: [] };
    case RESET_MODAL_REDUCER:
      return { ...INITIAL_STATE, errorList: [] };
    case RESET_ACCOUNT_ERRORS:
    case RESET_PUBLISHER_ERRORS:
    case RESET_INTEGRATION_ERRORS:
    case RESET_ADVERTISER_ERRORS:
      return { ...state, errorList: [], errorName: false, errorIabCategory:false, errorNotes: false };
    case RESET_USER_ERRORS:
      return {
        ...state,
        errorList: [],
        errorPassword: false,
        errorVerifyPassword: false,
        errorEmail: false,
        errorFirstName: false,
        errorLastName: false,
        errorPhoneNumber: false
      };
    case RESET_CAMPAIGN_ERRORS:
      return {
        ...state,
        errorList: [],
        errorName: false,
        errorAdvertiserId: false,
        errorStartDate: false,
        errorStartTime: false,
        errorEndDate: false,
        errorEndTime: false,
        errorDayImpressionGoal: false,
        errorTotalImpressionGoal: false
      };
    case READ_ACCOUNT:
    case READ_INTEGRATION:
    case READ_ADVERTISER:
      return {
        ...state,
        name: action.payload.name,
        notes: action.payload.notes,
        account_id: action.payload.account_id,
        id: action.payload.id
      };
    case READ_PUBLISHER:
      return {
        ...state,
        name: action.payload.name,
        notes: action.payload.notes,
        iabCategory: action.payload.iab_categories,
        account_id: action.payload.account_id,
        id: action.payload.id
      };

    case READ_CAMPAIGN:
      return {
        ...state,
        advertiserId: action.payload.advertiser.id,
        name: action.payload.name,
        notes: action.payload.notes,
        startDate: moment(moment.unix(action.payload.start_time)).tz(getTimezone(action.timezone)).format('YYYY-MM-DD'),
        startTime: moment(moment.unix(action.payload.start_time)).tz(getTimezone(action.timezone)).format('HH:mm'),
        endDate: moment(moment.unix(action.payload.end_time)).tz(getTimezone(action.timezone)).format('YYYY-MM-DD'),
        endTime: moment(moment.unix(action.payload.end_time)).tz(getTimezone(action.timezone)).format('HH:mm'),
        id: action.payload.id,
        showDayImpressionGoal: Boolean(action.payload.day_impression_goal),
        dayImpressionGoal: action.payload.day_impression_goal,
        showTotalImpressionGoal: Boolean(action.payload.total_impression_goal),
        totalImpressionGoal: action.payload.total_impression_goal
      };
    case READ_USER:
      return {
        ...state,
        id: action.payload.id,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        email: action.payload.email,
        phone_number: action.payload.phone_number,
        account_id: action.payload.account_id,
        role: action.payload.role,
        status: action.payload.status,
        timezone: action.payload.timezone
      };
    case ACCOUNT_READ_ERROR:
      return { ...state, error: true, success: false, errorMessage: 'Cannot edit an account at this time. Please try again later', successMessage: '' };
    case USER_READ_ERROR:
      return { ...state, error: true, success: false, errorMessage: 'Cannot edit the user at this time. Please try again later', successMessage: '' };
    case ADVERTISER_READ_ERROR:
      return { ...state, error: true, success: false, errorMessage: 'Cannot edit the advertiser at this time. Please try again later', successMessage: '' };
    case PUBLISHER_READ_ERROR:
      return { ...state, error: true, success: false, errorMessage: 'Cannot edit the publisher at this time. Please try again later', successMessage: '' };
    case CAMPAIGN_READ_ERROR:
      return { ...state, error: true, success: false, errorMessage: 'Cannot edit the campaign at this time. Please try again later', successMessage: '' };
    case PLACEMENT_SUCCESS:
    case FLIGHT_SUCCESS:
      return { ...state, showAlert: true, error: false, success: true, errorMessage: '', successMessage: action.payload };
    case PLACEMENT_FAIL:
    case FLIGHT_FAIL:
      return { ...state, showAlert: true, error: true, success: false, errorMessage: action.payload, successMessage: '' };
    case LIST_CAMPAIGN_ADVERTISERS:
      return { ...state, advertisers: action.payload };
    case LIST_DEMAND:
      return { ...state, demand: action.payload};
    case LIST_SUPPLY:
      return { ...state, supply: action.payload };
    case FLIGHTS_PLACEMENT:
      return { ...state, supplyList: action.payload.supplyList, supplyIds: action.payload.supplyId, showAddSupply: true };
    case PLACEMENT_FLIGHTS:
      let dealIdChecker;
      action.payload.demandList.map((val, index) => {
        if (val.deal_id !== '') {
           dealIdChecker = val.id;
        }
      })
      return { ...state, demandList: action.payload.demandList, demandIds: action.payload.demandIds, showAddDemand: true, dealIdCheck: dealIdChecker };
    case SUPPLY_FAIL:
      return { ...state, error: true, success: false, errorMessage: action.payload, successMessage: '', showAddSupply: true };
    case DEMAND_FAIL:
      return { ...state, error: true, success: false, errorMessage: action.payload, successMessage: '', showAddDemand: true };
    default:
      return state;
  }
}

const getTimezone = timezone => {
  switch (timezone) {
    case 'US/Pacific':
      return 'America/Los_Angeles';
    case 'US/Eastern':
      return 'America/New_York';
    default:
      return timezone;
  }
};