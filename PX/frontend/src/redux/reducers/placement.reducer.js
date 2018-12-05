import moment from 'moment-timezone';
import {
  CHANGE_PLACEMENT,
  LIST_PLACEMENT_PUBLISHERS,
  PLACEMENT_ERROR,
  READ_PLACEMENT,
  RESET_PLACEMENT_REDUCER,
  LIST_PLACEMENT_DOMAIN_LISTS,
  RESET_PLACEMENT_ERRORS, PLACEMENT_GEO_SEARCH,
  READ_OPPORTUNITY_COUNT,
  OPPORTUNITY_COUNT_ERROR,
  LIST_DOMAIN_TYPE
} from '../actions/types';
import { capitalize } from "../../functions";

const INITIAL_STATE = {
  activeIndex: [true, false, false, false, false, false],
  publisherId: 0,
  placementPublishers: [],
  error: false,
  detailsErrors: [],
  pricingErrors: [],
  typeErrors: [],
  capsErrors: [],
  name: '',
  passbackUrl: '',
  errorName: false,
  notes: '',
  status: '',
  errorNotes: false,
  errorPublisherId: false,
  pricingModel: '',
  errorPricingModel: false,
  cpm: '',
  errorCPM: false,
  cpc: '',
  errorCPC: false,
  bwaCPM: '',
  errorBWACPM: false,
  revShare: '',
  errorRevShare: false,
  channel: '',
  errorChannel: false,
  errorFormat: false,
  format: '',
  optimizer: 'order',
  displaySize: '',
  errorDisplaySize: false,
  width: '',
  errorWidth: false,
  height: '',
  volume: 0,
  playerType: 'standard',
  errorHeight: false,
  errorPlayerType: false,
  playerSize: '',
  errorPlayerSize: false,
  errorIabCategory: false,
  isVastOnly: false,
  isPilotPlayer: false,
  forensiq: false,
  listCategory: 'none',
  listId: 0,
  placementDomainLists: [],
  excludedGeoTarget: [{
    id: 0,
    country: "",
    province: "",
    dma: "",
    city: "",
    postalCode: ""
  }],
  includedGeoTarget: [{
    id: 0,
    country: "",
    province: "",
    dma: "",
    city: "",
    postalCode: ""
  }],
  capped: '',
  errorCapped: false,
  showDayCapping: false,
  dayCapping: '',
  errorDayCapping: false,
  showTotalCapping: false,
  totalCapping: '',
  errorTotalCapping: false,
  capStart: '',
  errorCapStart: false,
  capEnd: '',
  errorCapEnd: false,
  demandList: [],
  dayCapId: 0,
  totalCapId: 0,
  id: 0,
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
  opportunityCount: 0,
  domain_type: '',
  list_option: [],
  iabCategory:[],
  maxVideoDuration:0,
  errorMaxVideoDuration: false,
  appStoreUrl:'',
  errorAppStoreUrl:false,
  defaultDomain:'',
  errorDefaultDomain: false,
  defaultAppName:'',
  errorDefaultAppName: false,
  defaultBundleId:'',
  errorDefaultBundleId:false,
  defaultCtvChannel:'',
  errorDefaultCtvChannel:false
};

const desktopListTypes = [
  { text: "Domain Lists", value: "domain" },
  { text: "IP List", value: "ip_address"},
  { text: "DeviceID Lists", value: "device_list", disabled: true }
];
const mobileWebListTypes = [
  { text: "Domain Lists", value: "domain" },
  { text: "IP List", value: "ip_address"},
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
  { text: "IP List", value: "ip_address" },
  { text: "DeviceID Lists", value: "device_list", disabled:true }
];

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_PLACEMENT:
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
    case LIST_PLACEMENT_PUBLISHERS:
      return { ...state, placementPublishers: action.payload, error: false };
    case PLACEMENT_ERROR:
      return { ...state, error: true };
    case READ_OPPORTUNITY_COUNT:
      return { ...state, opportunityCount: action.payload };
    case OPPORTUNITY_COUNT_ERROR:
      return { ...state, opportunityCount: 0 };
    case READ_PLACEMENT: 
      let list_Types=[];
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
        name: action.payload.name,
        list_option: list_Types,
        passbackUrl: action.payload.passback_url,
        publisherId: action.payload.publisher.id,
        notes: action.payload.notes,
        pricingModel: action.payload.pricing_model,
        cpm: (action.payload.cpm / 100).toFixed(2),
        cpc: (action.payload.cpc / 100).toFixed(2),
        bwaCPM: (action.payload.bwa_cpm / 100).toFixed(2),
        revShare: action.payload.publisher_revenue_share,
        channel: action.payload.channel,
        maxVideoDuration: action.payload.max_video_duration,

        defaultDomain: action.payload.default_domain,
        defaultAppName: action.payload.default_app_name,
        defaultBundleId: action.payload.default_bundle_id,
        defaultCtvChannel: action.payload.default_ctv_channel,
       
        appStoreUrl: action.payload.app_store_url,
        format: action.payload.format,
        displaySize: action.payload.format === "display" || action.payload.has_bwa_video_player ? getDisplaySize(action.payload.width, action.payload.height) : '',
        width: action.payload.width,
        height: action.payload.height,
        status: action.payload.status,
        playerSize: action.payload.player_size,
        iabCategory: action.payload.iab_categories,
        isVastOnly: action.payload.is_vast_only,
        isPilotPlayer: action.payload.has_bwa_video_player,
        volume: action.payload.bwa_video_player_volume,
        playerType: action.payload.bwa_player_type,
        forensiq: getBrandSafety(action.payload.placement_brand_safety_providers, 'whiteops'),
        listCategory: action.payload.domain_list_category,
        listId: action.payload.domain_list_id,
        includedGeoCountries: getGeoSelection(true, action.payload.placement_geo_targets, 'country'),
        excludedGeoCountries: getGeoSelection(false, action.payload.placement_geo_targets, 'country'),
        includedGeoCities: getGeoSelection(true, action.payload.placement_geo_targets, 'city'),
        excludedGeoCities: getGeoSelection(false, action.payload.placement_geo_targets, 'city'),
        includedGeoProvinces: getGeoSelection(true, action.payload.placement_geo_targets, 'province'),
        excludedGeoProvinces: getGeoSelection(false, action.payload.placement_geo_targets, 'province'),
        includedGeoDma: getGeoSelection(true, action.payload.placement_geo_targets, 'dma'),
        excludedGeoDma: getGeoSelection(false, action.payload.placement_geo_targets, 'dma'),
        includedGeoPostalCodes: getGeoSelection(true, action.payload.placement_geo_targets, 'postal_code'),
        excludedGeoPostalCodes: getGeoSelection(false, action.payload.placement_geo_targets, 'postal_code'),
        includedCountries: getGeoTargets(true, action.payload.placement_geo_targets, 'country'),
        excludedCountries: getGeoTargets(false, action.payload.placement_geo_targets, 'country'),
        includedCities: getGeoTargets(true, action.payload.placement_geo_targets, 'city'),
        excludedCities: getGeoTargets(false, action.payload.placement_geo_targets, 'city'),
        includedProvinces: getGeoTargets(true, action.payload.placement_geo_targets, 'province'),
        excludedProvinces: getGeoTargets(false, action.payload.placement_geo_targets, 'province'),
        includedDma: getGeoTargets(true, action.payload.placement_geo_targets, 'dma'),
        excludedDma: getGeoTargets(false, action.payload.placement_geo_targets, 'dma'),
        includedPostalCodes: getGeoTargets(true, action.payload.placement_geo_targets, 'postal_code'),
        excludedPostalCodes: getGeoTargets(false, action.payload.placement_geo_targets, 'postal_code'),
        capped: action.payload.placement_caps.length ? 'capped' : 'uncapped',
        showDayCapping: getCapping('day', action.payload.placement_caps),
        dayCapping: getCaps('day', action.payload.placement_caps),
        showTotalCapping: getCapping('total', action.payload.placement_caps),
        totalCapping: getCaps('total', action.payload.placement_caps),
        capStart: action.payload.placement_caps.length && action.payload.placement_caps[0].start_time !== "" && action.payload.placement_caps[0].start_time !== 0 ? moment.tz(moment.unix(action.payload.placement_caps[0].start_time), 'UTC').format('YYYY-MM-DD') : "",
        capEnd: action.payload.placement_caps.length && action.payload.placement_caps[0].end_time !== "" && action.payload.placement_caps[0].end_time !== 2147483647 ? moment.tz(moment.unix(action.payload.placement_caps[0].end_time), 'UTC').format('YYYY-MM-DD') : "",
        demandList: action.payload.demand_list,
        dayCapId: getCapId('day', action.payload.placement_caps),
        totalCapId: getCapId('total', action.payload.placement_caps),
        id: action.payload.id
      };
    case RESET_PLACEMENT_REDUCER:
      return { ...INITIAL_STATE, activeIndex: [true, false, false, false, false, false], placementPublishers: [] };
    case LIST_PLACEMENT_DOMAIN_LISTS:
      return { ...state, placementDomainLists: action.payload };
    case LIST_DOMAIN_TYPE:
      return { ...state, domain_type: action.payload };

    case RESET_PLACEMENT_ERRORS:
      return {
        ...state,
        detailsErrors: [],
        pricingErrors: [],
        typeErrors: [],
        capsErrors: [],
        opportunityCount: [],
        errorName: false,
        errorNotes: false,
        errorPublisherId: false,
        errorPricingModel: false,
        errorCPM: false,
        errorCPC: false,
        errorBWACPM: false,
        errorRevShare: false,
        errorChannel: false,
        errorFormat: false,
        errorDisplaySize: false,
        errorWidth: false,
        errorHeight: false,
        errorPlayerType: false,
        errorPlayerSize: false,
        errorIabCategory:false,
        errorCapped: false,
        errorDayCapping: false,
        errorTotalCapping: false,
        errorCapStart: false,
        errorCapEnd: false,
        errorMaxVideoDuration: false,
        errorAppStoreUrl: false,
        errorDefaultDomain: false,
        errorDefaultAppName: false,
        errorDefaultBundleId: false,
        errorDefaultCtvChannel: false
      };
    case PLACEMENT_GEO_SEARCH:
      return { ...state, [`${action.geoType}Geo${capitalize(action.name)}`]: addItems(action.payload, action.selection) };
    default:
      return state;
  }
}

function getDisplaySize(width, height) {
  const sizes = ["728x90", "160x600", "350x250", "300x600", "300x50", "320x50", "768x1024", "1024x768"];
  const size = `${width}x${height}`;

  if (sizes.includes(size)) {
    return size;
  }
  else {
    return 'custom';
  }
}

function getBrandSafety(providers, name) {
  for (let i = 0; i < providers.length; i++) {
    if (providers[i].name === name) {
      return providers[i].is_active;
    }
  }
}

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

function getCapping(type, caps) {
  for (let i = 0; i < caps.length; i++) {
    if (caps[i].interval === type) {
      return true;
    }
  }
  return false;
}

function getCaps(type, caps) {
  for (let i = 0; i < caps.length; i++) {
    if (caps[i].interval === type) {
      return caps[i].opportunities;
    }
  }
  return '';
}

function getCapId(type, caps) {
  for (let i = 0; i < caps.length; i++) {
    if (caps[i].interval === type) {
      return caps[i].id;
    }
  }
  return 0;
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


