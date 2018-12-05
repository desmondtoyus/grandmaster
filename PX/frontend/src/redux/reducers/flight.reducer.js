import {
  CHANGE_FLIGHT,
  LIST_FLIGHT_CAMPAIGNS,
  RESET_DISPLAY_ERRORS,
  RESET_DISPLAY_CREATIVE,
  UPLOAD_FLIGHT_DISPLAY_CREATIVE,
  RESET_VIDEO_ERRORS,
  RESET_VIDEO_CREATIVE,
  UPLOAD_FLIGHT_VIDEO_CREATIVE,
  UPLOAD_FLIGHT_COMPANION_CREATIVE,
  LIST_FLIGHT_OPTIONS,
  READ_FLIGHT,
  RESET_FLIGHT_REDUCER,
  RESET_FLIGHT_ERRORS, FLIGHT_GEO_SEARCH,
  LIST_DOMAIN_TYPE,
  LIST_INTEGRATIONS_DROPDOWN,
  LIST_INTEGRATIONS_DROPDOWN_ERROR,
  CHECK_IFLIGHT
} from '../actions/types';
import { TAXONOMY } from '../../vars';
import moment from 'moment-timezone';
import { capitalize } from "../../functions";

const INITIAL_STATE = {
  name: '',
  notes: '',
  flight_type:'standard',
  advertiserId: 0,
  advertisers: [],
  campaignId: 0,
  campaigns: [],
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  status: 'inactive',
  timezone: '',
  detailsErrors: [],
  errorName: false,
  errorNotes: false,
  errorStartDate: false,
  errorStartTime: false,
  errorEndDate: false,
  errorEndTIme: false,
  errorAdvertiserId: false,
  errorCampaignId: false,
  channel: "",
  format: "",
  playerSize: [],
  isVastOnly: false,
  isVisibleOnly: false,
  isUnmutedOnly: false,
  typeErrors: [],
  errorChannel: false,
  errorFormat: false,
  errorPlayerSize: false,
  displayValid: false,
  displayErrors: [],
  creativeId: 0,
  creativeName: '',
  creativeNotes: '',
  isCompanionCreative: false,
  fileName: '',
  altText: '',
  party: '',
  jsTag: '',
  width: '',
  height: '',
  displaySize: '',
  clickThroughUrl: '',
  dealId:'',
  dealCpmFloor:'',  
  errorDealId: false,
  errorDealCpmFloor: false, 
  impressionTracker: '',
  clickTracker: '',
  platform: '',
  rtbPlatform: '',
  errorCreativeName: false,
  errorCreativeNotes: false,
  errorClickThroughURL: false,
  errorImpressionTracker: false,
  errorClickTracker: false,
  errorParty: false,
  errorJSTag: false,
  errorDisplaySize: false,
  errorHeight: false,
  errorWidth: false,
  errorFile: false,
  errorPlatform: false,
  errorRTBPlatform: false,
  displayMessage: `DROP CREATIVE HERE OR CLICK TO UPLOAD. 2MB LIMIT.`,
  videoValid: false,
  videoErrors: [],
  contentType: '',
  bitrate: '',
  duration: '',
  companions: [],
  videoMessage: `DROP CREATIVE HERE OR CLICK TO UPLOAD. 99MB LIMIT.`,
  companionMessage: `DROP CREATIVE HERE OR CLICK TO UPLOAD. 2MB LIMIT.`,
  goalsErrors: [],
  cpm: "",
  cpc: "",
  dayGoal: "",
  totalGoal: "",
  dayInclude: false,
  totalInclude: false,
  dayGoalType: "",
  totalGoalType: "",
  dayGoalId: 0,
  totalGoalId: 0,
  errorCPM: false,
  errorCPC: false,
  errorDayGoal: false,
  errorTotalGoal: false,
  errorDayGoalType: false,
  errorTotalGoalType: false,
  capsErrors: [],
  cap: "",
  pacing: "",
  dayParting: [{
    id: 0,
    startDay: "",
    startTime: "",
    endDay: "",
    endTime: "",
    errorStartDay: false,
    errorStartTime: false,
    errorEndDay: false,
    errorEndTime: false
  }],
  errorCap: false,
  errorPacing: false,
  errorCapsStartDay: false,
  errorCapsEndDay: false,
  errorCapsStartTime: false,
  errorCapsEndTime: false,
  includedGeo: [{
    id: 0,
    isInclude: true,
    country: "",
    province: "",
    city: "",
    dma: "",
    postalCode: ""
  }],
  excludedGeo: [{
    id: 0,
    isInclude: false,
    country: "",
    province: "",
    city: "",
    dma: "",
    postalCode: ""
  }],
  userAgent: [],
  browser: [],
  iabCategories: [],
  searchIAB: TAXONOMY,
  selectedIAB: [],
  forensiq: false,
  listId: 0,
  listCategory: "none",
  spinner: false,
  activeIndex: [true, false, false, false, false, false, false, false, false],
  error: false,
  success: false,
  fail: false,
  message: '',
  uploading: false,
  includedCountries: [],
  excludedCountries: [],
  includedProvinces: [],
  excludedProvinces: [],
  includedDma: [],
  excludedDma: [],
  includedPostalCodes: [],
  excludedPostalCodes: [],
  includedCities: [],
  excludedCities: [],
  includedGeoCountries: [],
  excludedGeoCountries: [],
  includedGeoProvinces: [],
  excludedGeoProvinces: [],
  includedGeoDma: [],
  excludedGeoDma: [],
  includedGeoPostalCodes: [],
  excludedGeoPostalCodes: [],
  includedGeoCities: [],
  excludedGeoCities: [],
  domain_type: '',
  list_option: [],
  dspList: [],
  iFlight: false,
  rtbList:[],
  maxVideoDuration:0,
  errorMaxVideoDuration: false,
  isRetargeted:false,
  is_skippable:'none',
  error_is_skippable:false
};

const desktopListTypes = [
  { text: "Domain Lists", value: "domain" },
  { text: "IP List", value: "ip_address" },
  { text: "DeviceID Lists", value: "device_list", disabled: true }
];
const mobileWebListTypes = [
  { text: "Domain Lists", value: "domain" },
  { text: "IP List", value: "ip_address" },
  { text: "DeviceID Lists", value: "device_list", disabled: true }
];
const mobileAppListTypes = [
  { text: "App Lists", value: "app_name" },
  { text: "BundleID Lists", value: "bundle_id" },
  { text: "IP List", value: "ip_address" },
  { text: "DeviceID Lists", value: "device_list", disabled: true }
];
const ctvListTypes = [
  { text: "App Lists", value: "app_name" },
  { text: "BundleID Lists", value: "bundle_id" },
  { text: "IP List", value: "ip_address"},
  { text: "DeviceID Lists", value: "device_list", disabled: true }
];

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_FLIGHT:
      let listTypes
      if (action.value == 'desktop') {
        listTypes = desktopListTypes
        return { ...state, [action.prop]: action.value, list_option: listTypes };
      }
      if (action.value == 'mobile_web') {
        listTypes = mobileWebListTypes
        return { ...state, [action.prop]: action.value, list_option: listTypes };
      }
      if (action.value == 'mobile_app') {
        listTypes = mobileAppListTypes
        return { ...state, [action.prop]: action.value, list_option: listTypes };
      }
      if (action.value == 'ctv') {
        listTypes = ctvListTypes
        return { ...state, [action.prop]: action.value, list_option: listTypes };
      }
      return { ...state, [action.prop]: action.value };
    case LIST_FLIGHT_CAMPAIGNS:
      return { ...state, campaigns: action.payload };
    case LIST_DOMAIN_TYPE:
      return { ...state, domain_type: action.payload };
    case RESET_DISPLAY_ERRORS:
      return {
        ...state,
        displayErrors: [],
        errorCreativeName: false,
        errorCreativeNotes: false,
        errorClickThroughURL: false,
        errorDealId: false,
        errorDealCpmFloor: false, 
        errorImpressionTracker: false,
        errorClickTracker: false,
        errorParty: false,
        errorJSTag: false,
        errorDisplaySize: false,
        errorHeight: false,
        errorWidth: false,
        errorFile: false,
        errorPlatform: false,
        errorRTBPlatform: false,
        errorMaxVideoDuration: false
      };
    case RESET_VIDEO_ERRORS:
      return {
        ...state,
        videoErrors: [],
        errorCreativeName: false,
        errorCreativeNotes: false,
        errorClickThroughURL: false,
        errorDealId: false,
        errorDealCpmFloor: false, 
        errorImpressionTracker: false,
        errorClickTracker: false,
        errorParty: false,
        errorJSTag: false,
        errorDisplaySize: false,
        errorHeight: false,
        errorWidth: false,
        errorFile: false,
        errorPlatform: false,
        errorRTBPlatform: false,
        errorMaxVideoDuration: false
      };
    case RESET_DISPLAY_CREATIVE:
      return {
        ...state,
        displayValid: false,
        displayErrors: [],
        creativeId: 0,
        creativeName: '',
        creativeNotes: '',
        isCompanionCreative: false,
        fileName: '',
        altText: '',
        // party: '',
        jsTag: '',
        width: '',
        height: '',
        displaySize: '',
        clickThroughUrl: '',
        is_skippable:'',
        impressionTracker: '',
        clickTracker: '',
        platform: '',
        dealId: '',
        dealCpmFloor: '',
        // rtbPlatform: '',
        errorCreativeName: false,
        errorCreativeNotes: false,
        errorClickThroughURL: false,
        errorDealId: false,
        errorDealCpmFloor: false, 
        errorImpressionTracker: false,
        errorClickTracker: false,
        errorParty: false,
        errorJSTag: false,
        errorDisplaySize: false,
        errorHeight: false,
        errorWidth: false,
        errorFile: false,
        errorPlatform: false,
        errorRTBPlatform: false,
        errorMaxVideoDuration: false,
        displayMessage: `DROP CREATIVE HERE OR CLICK TO UPLOAD. 2MB LIMIT.`
      };
    case UPLOAD_FLIGHT_DISPLAY_CREATIVE:
      return {
        ...state,
        displayMessage: action.message,
        uploading: false,
        fileName: action.payload.fileName,
        width: action.payload.width,
        height: action.payload.height
      };
    case UPLOAD_FLIGHT_VIDEO_CREATIVE:
      return {
        ...state,
        videoMessage: action.message,
        uploading: false,
        bitrate: action.payload.bitrate,
        contentType: action.payload.contentType,
        duration: action.payload.duration,
        fileName: action.payload.fileName,
        height: action.payload.height,
        width: action.payload.width
      };
    case UPLOAD_FLIGHT_COMPANION_CREATIVE:
      return { ...state, companionMessage: action.message };
    case RESET_VIDEO_CREATIVE:
      return {
        ...state,
        videoValid: false,
        videoErrors: [],
        creativeId: 0,
        creativeName: '',
        creativeNotes: '',
        isCompanionCreative: false,
        fileName: '',
        altText: '',
        // party: '',
        jsTag: '',
        width: '',
        height: '',
        displaySize: '',
        clickThroughUrl: '',
        impressionTracker: '',
        clickTracker: '',
        platform: '',
        dealId: '',
        dealCpmFloor: '',
        errorDealId: false,
        errorDealCpmFloor: false, 
        // rtbPlatform: '',
        errorCreativeName: false,
        errorCreativeNotes: false,
        errorClickThroughURL: false,
        errorImpressionTracker: false,
        errorClickTracker: false,
        errorParty: false,
        errorJSTag: false,
        errorDisplaySize: false,
        errorHeight: false,
        errorWidth: false,
        errorFile: false,
        errorPlatform: false,
        errorRTBPlatform: false,
        errorMaxVideoDuration: false,
        contentType: '',
        bitrate: '',
        duration: '',
        companions: [],
        videoMessage: `DROP CREATIVE HERE OR CLICK TO UPLOAD. 99MB LIMIT.`,
        companionMessage: `DROP CREATIVE HERE OR CLICK TO UPLOAD. 2MB LIMIT.`
      };

    case LIST_INTEGRATIONS_DROPDOWN:
      return { ...state, dspList: action.payload};
    case CHECK_IFLIGHT:
      return { ...state, iFlight: action.payload.value, party: action.payload.rtb, rtbPlatform: action.payload.platform };
    case LIST_INTEGRATIONS_DROPDOWN_ERROR:
      return { ...state, dspList: []  };
    case LIST_FLIGHT_OPTIONS:
      return { ...state, advertisers: action.payload.advertisers, campaigns: action.payload.campaigns, advertiserId: action.payload.advertiserId, campaignId: action.payload.campaignId };
    case READ_FLIGHT:
      let list_Types = [];
      if (action.payload.channel == 'desktop') {
        list_Types = desktopListTypes;
      }
      if (action.payload.channel == 'mobile_web') {
        list_Types = mobileWebListTypes;
      }
      if (action.payload.channel == 'mobile_app') {
        list_Types = mobileAppListTypes;
      }
      if (action.payload.channel == 'ctv') {
        list_Types = ctvListTypes;
      }
      return {
        ...state,
        id: action.payload.id,
        list_option: list_Types,
        advertiserId: action.payload.advertiser.id,
        campaignId: action.payload.campaign.id,
        name: action.payload.name,
        notes: action.payload.notes,
        flight_type:action.payload.flight_type,
        startDate: moment(moment.unix(action.payload.start_time)).tz(getTimezone(action.payload.timezone)).format('YYYY-MM-DD'),
        startTime: moment(moment.unix(action.payload.start_time)).tz(getTimezone(action.payload.timezone)).format('HH:mm'),
        endDate: moment(moment.unix(action.payload.end_time)).tz(getTimezone(action.payload.timezone)).format('YYYY-MM-DD'),
        endTime: moment(moment.unix(action.payload.end_time)).tz(getTimezone(action.payload.timezone)).format('HH:mm'),
        timezone: action.payload.timezone,
        status: action.payload.status,
        channel: action.payload.channel,
        maxVideoDuration: action.payload.max_video_duration,
        format: action.payload.format,
        playerSize: action.payload.player_size,
        isVastOnly: action.payload.is_vast_only,
        isRetargeted:action.payload.is_retargeted,
        isVisibleOnly: action.payload.is_visible_only,
        isUnmutedOnly: !action.payload.is_muted_allowed,
        party: action.payload.demand_source_type,
        cpm: (action.payload.cpm / 100).toFixed(2),
        cpc: (action.payload.cpc / 100).toFixed(2),
        dayGoalId: getGoalId(action.payload.flight_goals, 'day'),
        totalGoalId: getGoalId(action.payload.flight_goals, 'total'),
        dayInclude: showGoals(action.payload.flight_goals, 'day'),
        totalInclude: showGoals(action.payload.flight_goals, 'total'),
        dayGoalType: getGoalType(action.payload.flight_goals, 'day'),
        totalGoalType: getGoalType(action.payload.flight_goals, 'total'),
        dayGoal: getGoal(action.payload.flight_goals, 'day', action.payload.cpm),
        totalGoal: getGoal(action.payload.flight_goals, 'total', action.payload.cpm),
        pacing: action.payload.pacing_category,
        cap: action.payload.user_frequency_cap,
        dayParting: getDayParting(action.payload.flight_day_partings),
        iabCategories: action.payload.iab_categories,
        selectedIAB: getIAB(action.payload.iab_categories),
        platform: action.payload.wrapper_source_platform,
        clickThroughUrl: action.payload.clickthrough_url,
        is_skippable:action.payload.is_skippable,

        dealId: action.payload.deal_id,
        dealCpmFloor: (action.payload.deal_cpmfloor / 100).toFixed(2),

        impressionTracker: action.payload.impression_tracker,
        clickTracker: action.payload.click_tracker,
        forensiq: getBrandSafety(action.payload.flight_brand_safety_providers, 'whiteops'),
        listCategory: action.payload.domain_list_category,
        listId: action.payload.domain_list_id,
        browser: action.payload.desktop_browser_targeting,
        videoValid: action.payload.format === "video",
        displayValid: action.payload.format === "display",
        rtbPlatform: action.payload.rtb_source,
        creativeName: action.payload.demand_source_type !== 'rtb' ? (action.payload.format === 'video' ? action.payload.video_creatives[0].name : action.payload.display_creatives[0].name) : '',
        creativeNotes: action.payload.demand_source_type !== 'rtb' ? (action.payload.format === 'video' ? action.payload.video_creatives[0].notes : action.payload.display_creatives[0].notes) : '',
        creativeId: action.payload.demand_source_type !== 'rtb' ? (action.payload.format === 'video' ? action.payload.video_creatives[0].id : action.payload.display_creatives[0].id) : 0,
        fileName: action.payload.demand_source_type !== 'rtb' ? (action.payload.format === 'video' ? action.payload.video_creatives[0].filename : action.payload.display_creatives[0].filename) : '',
        altText: action.payload.demand_source_type !== 'rtb' ? (action.payload.format === 'video' ? action.payload.video_creatives[0].alt_text : action.payload.display_creatives[0].alt_text) : '',
        jsTag: action.payload.demand_source_type !== 'rtb' ? (action.payload.format === 'video' ? action.payload.video_creatives[0].js_tag : action.payload.display_creatives[0].js_tag) : '',
        width: action.payload.width,
        height: action.payload.height,
        contentType: action.payload.demand_source_type !== 'rtb' ? (action.payload.format === 'video' ? action.payload.video_creatives[0].content_type : '') : '',
        bitrate: action.payload.demand_source_type !== 'rtb' ? (action.payload.format === 'video' ? action.payload.video_creatives[0].bitrate : '') : '',
        duration: action.payload.demand_source_type !== 'rtb' ? (action.payload.format === 'video' ? action.payload.video_creatives[0].duration : '') : '',
        displaySize: action.payload.demand_source_type !== '' ? (action.payload.format === 'display' ? getDisplaySize(action.payload.width, action.payload.height) : '') : '',
        includedGeoCountries: getGeoSelection(true, action.payload.flight_geo_targets, 'country'),
        excludedGeoCountries: getGeoSelection(false, action.payload.flight_geo_targets, 'country'),
        includedGeoCities: getGeoSelection(true, action.payload.flight_geo_targets, 'city'),
        excludedGeoCities: getGeoSelection(false, action.payload.flight_geo_targets, 'city'),
        includedGeoProvinces: getGeoSelection(true, action.payload.flight_geo_targets, 'province'),
        excludedGeoProvinces: getGeoSelection(false, action.payload.flight_geo_targets, 'province'),
        includedGeoDma: getGeoSelection(true, action.payload.flight_geo_targets, 'dma'),
        excludedGeoDma: getGeoSelection(false, action.payload.flight_geo_targets, 'dma'),
        includedGeoPostalCodes: getGeoSelection(true, action.payload.flight_geo_targets, 'postal_code'),
        excludedGeoPostalCodes: getGeoSelection(false, action.payload.flight_geo_targets, 'postal_code'),
        includedCountries: getGeoTargets(true, action.payload.flight_geo_targets, 'country'),
        excludedCountries: getGeoTargets(false, action.payload.flight_geo_targets, 'country'),
        includedCities: getGeoTargets(true, action.payload.flight_geo_targets, 'city'),
        excludedCities: getGeoTargets(false, action.payload.flight_geo_targets, 'city'),
        includedProvinces: getGeoTargets(true, action.payload.flight_geo_targets, 'province'),
        excludedProvinces: getGeoTargets(false, action.payload.flight_geo_targets, 'province'),
        includedDma: getGeoTargets(true, action.payload.flight_geo_targets, 'dma'),
        excludedDma: getGeoTargets(false, action.payload.flight_geo_targets, 'dma'),
        includedPostalCodes: getGeoTargets(true, action.payload.flight_geo_targets, 'postal_code'),
        excludedPostalCodes: getGeoTargets(false, action.payload.flight_geo_targets, 'postal_code'),
      };
    case RESET_FLIGHT_REDUCER:
      return {
        ...INITIAL_STATE,
        advertisers: [],
        iFlight:false,
        campaigns: [],
        detailsErrors: [],
        playerSize: [],
        typeErrors: [],
        displayErrors: [],
        videoErrors: [],
        companions: [],
        goalsErrors: [],
        capsErrors: [],
        dayParting: [{
          id: 0,
          startDay: "",
          startTime: "",
          endDay: "",
          endTime: "",
          errorStartDay: false,
          errorStartTime: false,
          errorEndDay: false,
          errorEndTime: false
        }],
        includedGeo: [{
          id: 0,
          isInclude: true,
          country: "",
          province: "",
          city: "",
          dma: "",
          postalCode: ""
        }],
        excludedGeo: [{
          id: 0,
          isInclude: false,
          country: "",
          province: "",
          city: "",
          dma: "",
          postalCode: ""
        }],
        userAgent: [],
        browser: [],
        iabCategories: [],
        searchIAB: TAXONOMY,
        selectedIAB: [],
        activeIndex: [true, false, false, false, false, false, false, false, false],
      };
    case RESET_FLIGHT_ERRORS:
      return {
        ...state,
        detailsErrors: [],
        errorName: false,
        errorNotes: false,
        errorStartDate: false,
        errorStartTime: false,
        errorEndDate: false,
        errorEndTIme: false,
        errorAdvertiserId: false,
        errorCampaignId: false,
        typeErrors: [],
        errorChannel: false,
        errorFormat: false,
        errorPlayerSize: false,
        displayErrors: [],
        errorCreativeName: false,
        errorCreativeNotes: false,
        errorClickThroughURL: false,
        errorDealId: false,
        errorDealCpmFloor: false, 
        errorImpressionTracker: false,
        errorClickTracker: false,


        errorParty: false,
        errorJSTag: false,
        errorDisplaySize: false,
        errorHeight: false,
        errorWidth: false,
        errorFile: false,
        errorPlatform: false,
        errorRTBPlatform: false,
        videoErrors: [],
        goalsErrors: [],
        errorCPM: false,
        errorCPC: false,
        errorDayGoal: false,
        errorTotalGoal: false,
        errorDayGoalType: false,
        errorTotalGoalType: false,
        capsErrors: [],
        dayParting: clearDayParting(state.dayParting),
        errorCap: false,
        errorPacing: false,
        errorCapsStartDay: false,
        errorCapsEndDay: false,
        errorCapsStartTime: false,
        errorCapsEndTime: false,
      };
    case FLIGHT_GEO_SEARCH:
      return { ...state, [`${action.geoType}Geo${capitalize(action.name)}`]: addItems(action.payload, action.selection) };
    default:
      return state;
  }
}

const clearDayParting = dayParting => {
  let arr = [...dayParting];

  for (let i = 0; i < arr.length; i++) {
    arr[i].errorStartDay = false;
    arr[i].errorStartTime = false;
    arr[i].errorEndDay = false;
    arr[i].errorEndTime = false;
  }

  return arr;
};

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

const getGoalId = (goals, type) => {
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].interval === type) {
      return goals[i].id;
    }
  }
  return 0;
};

const showGoals = (goals, type) => {
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].interval === type) {
      return true;
    }
  }
  return false;
};

const getGoalType = (goals, type) => {
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].interval === type) {
      if (goals[i].is_budget) {
        return 'budget';
      }
      else {
        return 'impression'
      }
    }
  }
  return '';
};

const getGoal = (goals, type, cpm) => {
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].interval === type) {
      if (!goals[i].is_budget) {
        return goals[i].impressions;
      }
      else {
        return Math.round(goals[i].impressions * cpm / 100);
      }
    }
  }
  return '';
};

const getDayParting = (partings) => {
  let arr = [];

  partings.forEach(item => {
    arr.push({
      id: item.id,
      startDay: item.start_day,
      startTime: item.start_hour,
      endDay: item.end_day,
      endTime: item.end_hour,
      errorStartDay: false,
      errorStartTime: false,
      errorEndDay: false,
      errorEndTime: false
    })
  });

  if (!arr.length) {
    arr = [{
      id: 0,
      startDay: "",
      startTime: "",
      endDay: "",
      endTime: "",
      errorStartDay: false,
      errorStartTime: false,
      errorEndDay: false,
      errorEndTime: false
    }]
  }

  return arr;
};

const getIAB = iab => {
  let arr = [];

  iab.forEach(item => {
    if (!item.includes('-')) {
      const index = Number(item.substr(3)) - 1;
      arr.push(TAXONOMY[index].main)
    }
    else {
      const index = Number(item.split('-')[0].substr(3)) - 1;
      const subIndex = Number(item.split('-')[1]) - 1;
      arr.push(TAXONOMY[index].subs[subIndex]);
    }
  });

  return arr;
};

const getBrandSafety = (brands, name) => {
  for (let i = 0; i < brands.length; i++) {
    if (brands[i].name === name) {
      return brands[i].is_active;
    }
  }
};

const getDisplaySize = (width, height) => {
  const size = `${width}x${height}`;
  const sizes = ["728x90", "160x600", "350x250", "300x250", "300x600", "300x50", "320x50", "768x1024", "1024x768"];

  if (sizes.includes(size)) {
    return size;
  }
  else {
    return 'custom';
  }
};

function getGeoTargets(included, geo, geoType) {
  let arr = [];
  geo.forEach(item => {
    if (item.is_include === included && item[geoType] !== '') {
      arr.push(item[geoType]);
    }
  });
  return arr;
}

function getGeoSelection(included, geo, geoType) {
  let arr = [];
  geo.forEach(item => {
    if (item.is_include === included && item[geoType] !== '') {
      arr.push({
        value: item[geoType],
        text: item[geoType]
      });
    }
  });
  return arr;
}

function addItems(list, current) {
  let arr = [];
  list.forEach(item => {
    if (!current.includes(item.value)) {
      arr.push(item);
    }
  });
  current.forEach(item => {
    arr.push({
      value: item,
      text: item
    })
  });

  return arr;
}
