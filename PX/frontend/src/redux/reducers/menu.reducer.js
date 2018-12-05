import {
  MENU_RESET_ACTIVE,
  CHANGE_MENU_STATE
} from '../actions/types';

const INITIAL_STATE ={
  width: '60px',
  flexBasis: '60px',
  display: 'block-inline',
  home: "menu-item",
  analytics: "menu-item",
  help: "menu-item",
  demand: "menu-item",
  supply: "menu-item",
  exchange: "menu-item",
  settings: "menu-item",
  reports: "menu-item",
  demandMenu: "sub-menu demand-menu folded-sub-menu",
  supplyMenu: "sub-menu supply-menu folded-sub-menu",
  exchangeMenu: "sub-menu exchange-menu folded-sub-menu",
  settingsMenu: "sub-menu settings-menu folded-sub-menu",
  advertisers: "sub-menu-item",
  campaigns: "sub-menu-item",
  flights: "sub-menu-item",
  publishers: "sub-menu-item",
  integrations: "sub-menu-item",
  marketplace: "sub-menu-item",
  placements: "sub-menu-item",
  accounts: "sub-menu-item",
  users: "sub-menu-item",
  lists: "sub-menu-item",
  beacons: 'sub-menu-item',
  subActive: "",
  open: false,
  imgSrc: 'small-',
  activeItem:'',
 
activeSubItem:'',
 fullMenu:false
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case CHANGE_MENU_STATE:
      return { ...state, [action.prop]: action.value };
    case MENU_RESET_ACTIVE:
      return {
        ...state,
        display: 'block-inline',
        home: "menu-item",
        analytics: "menu-item",
        help: "menu-item",
        demand: "menu-item",
        exchange: "menu-item",
        supply: "menu-item",
        settings: "menu-item",
        reports: "menu-item",
        advertisers: "sub-menu-item",
        campaigns: "sub-menu-item",
        flights: "sub-menu-item",
        publishers: "sub-menu-item",
        integrations: "sub-menu-item",
        marketplace: "sub-menu-item",
        placements: "sub-menu-item",
        accounts: "sub-menu-item",
        users: "sub-menu-item",
        lists: "sub-menu-item",
        beacons: "sub-menu-item",
        // NEW
          activeItem: '',
        activeSubItem: '',
        activeSubSubItem:''
      };
    default:
      return state;
  }
}