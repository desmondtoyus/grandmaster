import {combineReducers, createStore} from 'redux';
import {reducer as reduxFormReducer} from 'redux-form';
import {
  sidebarReducer,
  themeReducer,
  customizerReducer,
  FlightsReducer,
  FlightReducer,
  BeaconReducer,
  BeaconsReducer,
  UsersReducer,
  AccountsReducer,
  AdvertisersReducer,
  PublishersReducer,
  IntegrationsReducer,
  CampaignsReducer,
  PlacementReducer,
  PlacementsReducer,
  AnalyticsReducer,
  RejectionsReducer,
  ReportingReducer,
  ListsReducer,
  ListReducer,
  ModalReducer,
  AuthReducer,
  SharedReducer,
  MenuReducer,
  DashboardReducer
} from '../redux/reducers/index';

const rootReducer = combineReducers({
  theme: themeReducer,
  sidebar: sidebarReducer,
  customizer: customizerReducer,

  flights: FlightsReducer,
  flight: FlightReducer,
  beacon: BeaconReducer,
  beacons: BeaconsReducer,
  users: UsersReducer,
  accounts: AccountsReducer,
  advertisers: AdvertisersReducer,
  publishers: PublishersReducer,
  integrations: IntegrationsReducer,
  campaigns: CampaignsReducer,
  placement: PlacementReducer,
  placements: PlacementsReducer,
  analytics: AnalyticsReducer,
  rejections:RejectionsReducer,
  reporting: ReportingReducer,
  lists: ListsReducer,
  list: ListReducer,
  modal: ModalReducer,
  auth: AuthReducer,
  shared: SharedReducer,
  menu: MenuReducer,
  dashboard: DashboardReducer
});


export default rootReducer;
