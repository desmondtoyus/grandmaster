import React, { Component } from 'react';
import { Popup, Icon, Button, Select, Input, Dimmer } from 'semantic-ui-react';
import Table from '../components/table/Table';
import { changeRejectionState, olapRejectionValidation, olapRejectionFilter, resetRejectionErrors, runReport, setRejectionSorting } from '../redux/actions/rejections.actions';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';
import { isAllowed } from '../functions';
import classNames from 'classnames';
import Collapse from '../components/Collapse';
import { Alert, Card, CardBody, Col } from 'reactstrap';

const moment = extendMoment(Moment);
import Paginator from '../app/paginator';

const dateRanges = [
  { text: "Month to Date", value: "Month to Date" },
  { text: "Today", value: "Today" },
  { text: "Yesterday", value: "Yesterday" },
  { text: "Last 7 Days", value: "Last 7 Days" },
  { text: "Last Month", value: "Last Month" },
  { text: "Custom", value: "Custom" }
];

const intervalFull = [
  { text: "Day", value: "day" },
  { text: "Hour", value: "hour" },
  { text: "Minute", value: "minute" },
  { text: "Cumulative", value: "overall" }
];

const intervals = [
  { text: "Day", value: "day" },
  { text: "Hour", value: "hour" },
  { text: "Cumulative", value: "overall" }
];

const timeZones = [
  { text: "UTC", value: "UTC" },
  { text: "US/Eastern", value: "US/Eastern" },
  { text: "US/Pacific", value: "US/Pacific" }
];

const formats = [
  { text: "Video", value: "video" },
  { text: "Display", value: "display" }
];

const binaries = [
  { text: "Yes", value: "yes" },
  { text: "No", value: "no" }
];

const players = [
  { text: "Small", value: "small" },
  { text: "Medium", value: "medium" },
  { text: "Large", value: "large" },
  { text: "Unknown", value: "unknown" }
];

const channels = [
  { text: "Desktop", value: "desktop" },
  { text: "Mobile Web", value: "mobile_web" },
  { text: "Mobile App", value: "mobile_app" },
  { text: "CTV", value: "ctv" }
];


class Rejections extends Component {

componentDidMount(){
  const { interval, timeZone, dateRange } = this.props;
  let start_time = this.getStartTime(dateRange);
  let end_time = this.getEndTime(dateRange);
  this.props.olapRejectionValidation(this.props.keys, interval, start_time, end_time, timeZone);
}

componentWillReceiveProps(prevProps){
  const { interval, timeZone, dateRange } = this.props;
  let start_time = this.getStartTime(dateRange);
  let end_time = this.getEndTime(dateRange);
  if(!this.arraysEqual(prevProps.disabledKeys, this.props.disabledKeys)){
  this.props.olapRejectionValidation(this.props.keys, interval, start_time, end_time, timeZone);
}
}

handleCustIllegalKeys=(event, data)=>{
  const { interval, timeZone, dateRange } = this.props;
  let start_time = this.getStartTime(dateRange);
  let end_time = this.getEndTime(dateRange);
    this.props.olapRejectionValidation(this.props.keys, interval, start_time, end_time, timeZone);
}


handleIllegalKeys=(event, data)=>{
  const { interval, timeZone, dateRange } = this.props;
  let start_time = this.getStartTime(dateRange);
  let end_time = this.getEndTime(dateRange);
  if(data.value !=='Custom'){
    this.props.olapRejectionValidation(this.props.keys, interval, start_time, end_time, timeZone);
  }
}

arraysEqual=(arr1, arr2) => {
  if(arr1.length !== arr2.length)
      return false;
  for(var i = arr1.length; i--;) {
      if(arr1[i] !== arr2[i])
          return false;
  }
  return true;
}

  getTotal = (item) => {
    switch (item) {
      case "Time":
      case "Date":
        return "Total";
      case "Opportunities":
        return this.props.report.aggregates.aggregate_opportunities.toLocaleString();
      case "Excluded Flight Geo":
        return this.props.report.aggregates.aggregate_excluded_flight_geo.toLocaleString();
      case "Excluded Placement Geo":
        return this.props.report.aggregates.aggregate_excluded_placement_geo.toLocaleString();
      case "Flight Blacklist":
        return this.props.report.aggregates.aggregate_flight_blacklist.toLocaleString();
      case "Flight Goal Exceeded":
        return this.props.report.aggregates.aggregate_flight_goal_exceeded.toLocaleString();
      case "Flight Not Found":
        return this.props.report.aggregates.aggregate_flight_not_found.toLocaleString();
      case "Flight Whitelist":
        return this.props.report.aggregates.aggregate_flight_whitelist.toLocaleString();
      case "Forensiq IVT Rejection":
        return this.props.report.aggregates.aggregate_forensiq_ivt_rejection.toLocaleString();
      case "Generic Flight":
      return this.props.report.aggregates.aggregate_generic_flight_error.toLocaleString()
      case "Generic Placement":
        return this.props.report.aggregates.aggregate_generic_placement_error.toLocaleString();
        case "Incorrect Flight Channel":
        return this.props.report.aggregates.aggregate_incorrect_flight_channel.toLocaleString();
      case "Incorrect Flight Size":
        return this.props.report.aggregates.aggregate_incorrect_flight_size.toLocaleString(); 
      case "Incorrect Placement Channel":
        return this.props.report.aggregates.aggregate_incorrect_placement_channel.toLocaleString();
      case "Incorrect Placement Size":
      return this.props.report.aggregates.aggregate_incorrect_placement_size.toLocaleString();
      case "Invalid Key Format":
      return this.props.report.aggregates.aggregate_invalid_key_format.toLocaleString();
      case "Invalid Param":
      return this.props.report.aggregates.aggregate_invalid_param.toLocaleString();
      case "Missing Required Params":
      return this.props.report.aggregates.aggregate_missing_required_param.toLocaleString();
      case "No Eligible Flight":
      return this.props.report.aggregates.aggregate_no_eligible_flights.toLocaleString();
      case "No Linked Flight":
      return this.props.report.aggregates.aggregate_no_linked_flights.toLocaleString();
      case "Placement Blacklist":
      return this.props.report.aggregates.aggregate_placement_blacklist.toLocaleString();
      case "Placement Cap Exceeded":
      return this.props.report.aggregates.aggregate_placement_cap_exceeded.toLocaleString();
      case "Placement Not Found":
      return this.props.report.aggregates.aggregate_placement_not_found.toLocaleString();
      case "Placement Whitelist":
      return this.props.report.aggregates.aggregate_placement_whitelist.toLocaleString();
      case "Rejections":
      return this.props.report.aggregates.aggregate_rejections.toLocaleString();
      case "Rtb Rejection":
      return this.props.report.aggregates.aggregate_rtb_rejection.toLocaleString();
      case "User Cap Exceeded":
      return this.props.report.aggregates.aggregate_user_cap_exceeded.toLocaleString();
      case "Not Retarget Eligible":
      return this.props.report.aggregates.aggregate_not_retarget_eligible.toLocaleString();
      default:
        return "";
    }
  };

  renderTotals = () => {
    const fontStyle = {
      fontWeight: "bold"
    };
    const { names } = this.sortColumns(this.props.report.columns);
    return names.map((item, index) => {
      return (
        <td key={index} >
          <span style={fontStyle}>{this.getTotal(item)}</span>
        </td>
      )
    })
  };


  formatItem = (obj, type) => {
    switch (type) {
      case 'hour_timestamp':
      case 'minute_timestamp':
      case 'day_timestamp':
        if (obj.hasOwnProperty('hour_timestamp')) {
          return moment(obj.hour_timestamp).format('MM/DD/YYYY h:mma');
        }
        else if (obj.hasOwnProperty('minute_timestamp')) {
          return moment(obj.minute_timestamp).format('MM/DD/YYYY h:mma');
        }
        else {
          return moment(obj.day_timestamp).format('MM/DD/YYYY');
        }

        case 'excluded_flight_geo':
        case 'excluded_placement_geo':
        case 'flight_blacklist':
        case 'flight_goal_exceeded':
        case 'flight_not_found':
        case 'flight_whitelist':
        case 'forensiq_ivt_rejection':
        case 'generic_flight_error':
        case 'generic_placement_error':
        case 'incorrect_flight_channel':
        case 'incorrect_flight_size':
        case 'incorrect_placement_channel':
        case 'incorrect_placement_size':
        case 'invalid_key_format':
        case 'invalid_param':
        case 'missing_required_param':
        case 'no_eligible_flights':
        case 'no_linked_flights':
        case 'opportunities':
        case 'placement_blacklist':
        case 'placement_cap_exceeded':
        case 'placement_not_found':
        case 'incorrect_placement_size':
        case 'placement_whitelist':
        case 'rejections':
        case 'rtb_rejection':
        case 'referring_domain':
        case 'user_cap_exceeded':
          return obj[type].toLocaleString();
      case 'placement_name':
        return <Popup
          trigger={<Link to={`/ui/placement/update/${obj.placement_id}`} target="_blank">
            {obj.placement_name}
          </Link>}
          content={obj.placement_name}
          flowing
        />
      case 'publisher_name':
        return <Popup
          trigger={<Link to={`/ui/publisher/${obj.publisher_id}`} target="_blank">
            {obj.publisher_name}
          </Link>}
          content={obj.publisher_name}
          flowing
        />
      default:
        return obj[type];
    }
  };

  renderRow = (obj) => {
    const { columns } = this.sortColumns(this.props.report.columns);

    return columns.map((item, index) => {
      return (
        <td key={index} >{this.formatItem(obj, item)}</td>
      )
    })
  };

  renderTableBody = () => {
    const { report } = this.props;

    return report.rows.map((item, index) => {
      // if (item.app_name == "") {
      //   item.app_name = "n/a"
      // }

      return (
        <tr key={index}>
          {this.renderRow(item)}
        </tr>
      )
    })
  };


  handleSorting = name => {
    const { sortDirection, pageChunk } = this.props;

    const payload = {
      currentPage: 1,
      sortBy: name,
      sortDirection: sortDirection === "asc" ? "desc" : "asc",
      pageChunk
    };

    this.props.changeRejectionState({ prop: 'currentPage', value: 1 });
    this.props.changeRejectionState({ prop: 'sortBy', value: name });
    this.props.changeRejectionState({ prop: 'sortDirection', value: payload.sortDirection });
    this.props.setRejectionSorting(name);

    this.runReport(payload, "JSON");
  };

  sortColumns = (columns) => {
    let names = [];
    let arr = [];
    const { interval } = this.props;

    switch (interval) {
      case 'day':
        names[0] = "Date";
        arr[0] = 'day_timestamp';
        break;
      case 'hour':
        names[0] = "Time";
        arr[0] = 'hour_timestamp';
        break;
      case 'minute':
        names[0] = "Time";
        arr[0] = 'minute_timestamp';
        break;
    }
    if (columns.includes('publisher_id')) {
      names.push('ID');
      names.push('Publisher');
      arr.push('publisher_id');
      arr.push('publisher_name');
    }
    if (columns.includes('placement_id')) {
      names.push('ID');
      names.push('Placement');
      arr.push('placement_id');
      arr.push('placement_name');
    }
    if (columns.includes('user_ipv4')) {
      names.push('IP Address');
      arr.push('user_ipv4');
    }

    if (columns.includes('referring_domain')) {
      names.push('Domain');
      arr.push('referring_domain');
    }
    if (columns.includes('is_revshare')) {
      names.push('Rev Share');
      arr.push('is_revshare');
    }

    if (columns.includes('user_geo_country')) {
      names.push('Country');
      arr.push('user_geo_country');
    }


    if (columns.includes('user_geo_province')) {
      names.push('Province');
      arr.push('user_geo_province');
    }
    if (columns.includes('user_geo_dma')) {
      names.push('DMA');
      arr.push('user_geo_dma');
    }
    if (columns.includes('user_geo_city')) {
      names.push('City');
      arr.push('user_geo_city');
    }
    if (columns.includes('channel')) {
      names.push('Channel');
      arr.push('channel');
    }
    if (columns.includes('format')) {
      names.push('Format');
      arr.push('format');
    }
    if (columns.includes('user_ipv4')) {
      names.push('IP Address');
      arr.push('user_ipv4');
    }
    if (columns.includes('user_device_model')) {
      names.push('Device Model');
      arr.push('user_device_model');
    }
    if (columns.includes('user_device_brand')) {
      names.push('Device Brand');
      arr.push('user_device_brand');
    }
    if (columns.includes('user_os_family')) {
      names.push('Operating System');
      arr.push('user_os_family');
    }
    if (columns.includes('user_browser_family')) {
      names.push('Browser');
      arr.push('user_browser_family');
    }
    if (columns.includes('placement_geo_rule_selected')) {
      names.push('Placement Geo');
      arr.push('placement_geo_rule_selected');
    }

    names.push('Excluded Flight Geo');
    arr.push('excluded_flight_geo');

    names.push('Excluded Placement Geo');
    arr.push('excluded_placement_geo');

    names.push('Flight Blacklist');
    arr.push('flight_blacklist');

    names.push('Flight Goal Exceeded');
    arr.push('flight_goal_exceeded');

    names.push('Flight Not Found');
    arr.push('flight_not_found');

    names.push('Flight Whitelist');
    arr.push('flight_whitelist');

    names.push('Forensiq IVT Rejection');
    arr.push('forensiq_ivt_rejection');

    names.push('Generic Flight');
    arr.push('generic_flight_error');

    names.push('Generic Placement');
    arr.push('generic_placement_error');

    names.push('Incorrect Flight Channel');
    arr.push('incorrect_flight_channel');

    names.push('Incorrect Flight Size');
    arr.push('incorrect_flight_size');

    names.push('Incorrect Placement Channel');
    arr.push('incorrect_placement_channel');

    names.push('Incorrect Placement Size');
    arr.push('incorrect_placement_size');

    names.push('Invalid Key Format');
    arr.push('invalid_key_format');

    names.push('Invalid Param');
    arr.push('invalid_param');

    names.push('Missing Required Params');
    arr.push('missing_required_param');

    names.push('No Eligible Flight');
    arr.push('no_eligible_flights');

    names.push('No Linked Flight');
    arr.push('no_linked_flights');


    names.push('Opportunities');
    arr.push('opportunities');

    names.push('Placement Blacklist');
    arr.push('placement_blacklist');

    names.push('Placement Cap Exceeded');
    arr.push('placement_cap_exceeded');

    names.push('Placement Not Found');
    arr.push('placement_not_found');

    names.push('Incorrect Placement Size');
    arr.push('incorrect_placement_size');

    names.push('Placement Whitelist');
    arr.push('placement_whitelist');

    names.push('Rejections');
    arr.push('rejections');

    names.push('Rtb Rejection');
    arr.push('rtb_rejection');

    names.push('User Cap Exceeded');
    arr.push('user_cap_exceeded');

    names.push('Not Retarget Eligible');
    arr.push('not_retarget_eligible');
    
    return {
      names,
      columns: arr
    };
  };

  renderTableHead = () => {
    const { report, keys } = this.props;
    let obj = this.sortColumns(report.columns);
    return obj.names.map((item, index) => {
      let name = obj.columns[index];
      if (name.includes('timestamp')) {
        name = 'record_time';
      }
      return (
        <th key={index}>
          {item}
          {keys.includes(obj.columns[index]) || item === "ID" || item === "Time" || item === "Date" ? <Icon style={{ cursor: 'pointer', marginLeft: 5 }} color={this.props[`${name}Sort`] === "sort" ? "black" : "blue"} name={this.props[`${name}Sort`]} id={obj.columns[index]} onClick={this.handleSorting.bind(null, name)} /> : null}
        </th>
      )
    })
  };

  getStartTime = (val) => {
    const month = moment().month();
    const year = moment().year();
    const day = moment().date();

    switch (val) {
      case "Month to Date":
        return moment([year, month, 1, 0, 0]).format('YYYY-MM-DD HH:mm');
      case "Today":
        return moment([year, month, day, 0, 0]).format('YYYY-MM-DD HH:mm');
      case "Yesterday":
        return moment([year, month, day, 0, 0]).subtract(1, 'days').format('YYYY-MM-DD HH:mm');
      case "Last 7 Days":
        return moment([year, month, day, 0, 0]).subtract(6, 'days').format('YYYY-MM-DD HH:mm');
      case "Last Month":
        return moment([year, month, 1, 0, 0]).subtract(1, 'months').format('YYYY-MM-DD HH:mm');
      case "Custom":
        const { interval, customStartDate, customStartTime } = this.props;
        if (interval !== "minute") {
          return `${customStartDate} 00:00`;
        }
        else if (customStartTime !== "") {
          return `${customStartDate} ${customStartTime}`
        }
        else {
          return `${customStartDate} 00:00`;
        }
    }
  };

  getEndTime = (val) => {
    const { timeZone } = this.props;

    const month = moment().month();
    const year = moment().year();
    const day = moment().date();
    switch (val) {
      case "Month to Date":
      case "Today":
      case "Last 7 Days":
        switch (timeZone) {
          case 'US/Pacific':
            return moment().tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm');
          case 'US/Eastern':
            return moment().tz('America/New_York').format('YYYY-MM-DD HH:mm');
          case 'UTC':
            return moment().tz('UTC').format('YYYY-MM-DD HH:mm');
        }
        break;
      case "Yesterday":
        return moment([year, month, day, 23, 59]).subtract(1, 'days').format('YYYY-MM-DD HH:mm');
      case "Last Month":
        return moment([year, month, 1, 0, 0]).subtract(1, 'minutes').format('YYYY-MM-DD HH:mm');
      case "Custom":
        const { interval, customEndDate, customEndTime } = this.props;
        if (interval !== "minute") {
          return `${customEndDate} 23:59`;
        }
        else if (customEndTime !== "") {
          return `${customEndDate} ${customEndTime}`;
        }
        else {
          return `${customEndDate} 23:59`;
        }
    }
  };


  runReport = (pagination, reportFormat) => {
    this.props.changeRejectionState({ prop: `loading${reportFormat}`, value: true });

    let payload = {};
    payload.pagination = {
      cur_page: pagination.currentPage,
      sort: pagination.sortBy,
      sort_dir: pagination.sortDirection,
      page_chunk: pagination.pageChunk
    };
    const {  placement_id, publisher_id, placement_geo_rule_selected, user_geo_city, user_geo_country, user_geo_province, user_geo_dma, user_geo_postal_code, format, referring_domain, user_browser_family, user_os_family, user_device_model, user_device_brand, channel,
      is_revshare, player_size, keys, metrics, interval, timeZone, dateRange } = this.props;

    payload.filters = {};
    if (placement_id.length) {
      payload.filters.placement_id = placement_id;
    }
    if (publisher_id.length) {
      payload.filters.publisher_id = publisher_id;
    }
  
    if (placement_geo_rule_selected.length) {
      payload.filters.placement_geo_rule_selected = placement_geo_rule_selected;
    }
   
    if (user_geo_city.length) {
      payload.filters.user_geo_city = user_geo_city;
    }
    if (user_geo_country.length) {
      payload.filters.user_geo_country = user_geo_country;
    }
    if (user_geo_province.length) {
      payload.filters.user_geo_province = user_geo_province;
    }

    if (user_geo_dma.length) {
      payload.filters.user_geo_dma = user_geo_dma;
    }
    if (referring_domain.length) {
      payload.filters.referring_domain = referring_domain;
    }

    if (is_revshare !== "") {
      payload.filters.is_revshare = is_revshare === "yes";
    }
 
    if (player_size.length) {
      payload.filters.player_size = player_size;
    }

    if (user_device_model.length) {
      payload.filters.user_device_model = user_device_model;
    }
    if (user_device_brand.length) {
      payload.filters.user_device_model = user_device_brand;
    }
    if (user_os_family.length) {
      payload.filters.user_os_family = user_os_family;
    }
    if (user_browser_family.length) {
      payload.filters.user_browser_family = user_browser_family;
    }
    if (channel !== "") {
      payload.filters.channel = channel;
    }
    if (format !== "") {
      payload.filters.format = format;
    }
    payload.keys = keys;
    payload.metrics = metrics;
    payload.interval = interval;
    payload.timezone = timeZone;
    payload.format = reportFormat;
    payload.start_time = this.getStartTime(dateRange);
    payload.end_time = this.getEndTime(dateRange);
    this.props.runReport(payload);
  };

  handleChange = (event) => {
    this.props.changeRejectionState({ prop: event.target.name, value: event.target.value });
  };

  validateDateInterval = (arr) => {
    const { interval, dateRange, customStartDate, customStartTime, customEndDate, customEndTime } = this.props;
    if (dateRange === "Custom") {
      const start = `${customStartDate} ${customStartTime}`;
      const end = `${customEndDate} ${customEndTime}`;
      if (moment(Date.parse(end)).isBefore(Date.parse(start))) {
        arr.push(`End Date can't be before Start Date`);
        this.props.changeRejectionState({ prop: 'errorStartDate', value: true });
        this.props.changeRejectionState({ prop: 'errorStartTime', value: true });
        this.props.changeRejectionState({ prop: 'errorEndDate', value: true });
        this.props.changeRejectionState({ prop: 'errorEndTime', value: true });
      }
      if (!moment(Date.parse(start)).isValid()) {
        arr.push(`Please enter a valid start date and time`);
        this.props.changeRejectionState({ prop: 'errorStartDate', value: true });
        this.props.changeRejectionState({ prop: 'errorStartTime', value: true });
      }
      if (!moment(Date.parse(end)).isValid()) {
        arr.push(`Please enter a valid end date and time`);
      }
    }

    return arr;
  };

  runValidation = (type) => {
    let arr = [];

    this.props.resetRejectionErrors();

    const { dateRange, interval, timeZone, keys, metrics } = this.props;

    if (dateRange === "") {
      arr.push('Please select a date range');
      this.props.changeRejectionState({ prop: 'errorDate', value: true });
    }
    if (interval === "") {
      arr.push('Please select an interval');
      this.props.changeRejectionState({ prop: 'errorInterval', value: true });
    }
    if (timeZone === "") {
      arr.push('Please select a time zone');
      this.props.changeRejectionState({ prop: 'errorTimeZone', value: true });
    }
    if (keys.length < 1) {
      arr.push('You must select at least one key');
    }
    arr = this.validateDateInterval(arr);

    if (arr.length > 0) {
      this.props.changeRejectionState({ prop: 'errorList', value: arr });
      return;
    }

    this.props.changeRejectionState({ prop: 'currentPage', value: 1 });
    this.props.changeRejectionState({ prop: 'sortBy', value: 'record_time' });

    const { sortDirection, pageChunk } = this.props;

    const pagination = {
      currentPage: 1,
      sortBy: 'record_time',
      sortDirection,
      pageChunk
    };

    this.runReport(pagination, type)
  };

  handleSelect = (event, data) => {
    this.props.changeRejectionState({ prop: data.name, value: data.value });
  };

  handlePagination = currentPage => {
    const { sortBy, sortDirection, pageChunk } = this.props;

    this.props.changeRejectionState({ prop: 'currentPage', value: currentPage });
    const payload = {
      currentPage,
      sortBy,
      sortDirection,
      pageChunk
    };

    this.runReport(payload, "JSON");
  };

  handleSearch = (filter, category, event, value) => {
    if (value) {
      this.props.olapRejectionFilter({
        filter,
        category,
        fragment: value
      })
    }
  };

  handleKeys = (event, data) => {
    const { interval, timeZone, dateRange } = this.props;
    let start_time = this.getStartTime(dateRange);
    let end_time = this.getEndTime(dateRange);
    let timezone = timeZone;
    this.props.changeRejectionState({ prop: 'keys', value: data.value });
    this.props.olapRejectionValidation(data.value, interval, start_time, end_time, timezone);
  };


  render() {
    const { activeUser, disabledKeys } = this.props;
    const keyOptions = [
      { text: "Placement", value: "placement_name", disabled: false },
      { text: "Publisher", value: "publisher_name", disabled: false },
      { text: "Country", value: "user_geo_country", disabled: false },
      { text: "City", value: "user_geo_city", disabled: disabledKeys.indexOf('user_geo_city') !== -1 ? true: false  },
      { text: "Province", value: "user_geo_province", disabled: false },
      { text: "DMA", value: "user_geo_dma", disabled: false },
      { text: "Placement Geo Rule", value: "placement_geo_rule_selected", disabled: false },
      { text: "Domain", value: "referring_domain", disabled: false },
      { text: "Player Size", value: "player_size", disabled: false },
      { text: "Channel", value: "channel", disabled: false },
      { text: "Format", value: "format", disabled: false },
      { text: "Rev Share", value: "is_revshare", disabled: false },
      { text: "IP Address", value: "user_ipv4", disabled: disabledKeys.indexOf('user_ipv4') !== -1 ? true: false   },
      { text: "Device Model", value: "user_device_model", disabled: disabledKeys.indexOf('user_device_model') !== -1 ? true: false   },
      { text: "Device Brand", value: "user_device_brand", disabled: disabledKeys.indexOf('user_device_brand') !== -1 ? true: false  },
      { text: "Operating System", value: "user_os_family", disabled: disabledKeys.indexOf('user_os_family') !== -1 ? true: false  },
      { text: "Browser", value: "user_browser_family", disabled:disabledKeys.indexOf('user_browser_family') !== -1 ? true: false } 
    ];

    if (!activeUser) {
      return (
        <div></div>
      )
    }

    if (!isAllowed('Analytics', activeUser.user)) {
      return (
        <Alert color='danger' >You are not authorized to view this page</Alert>
      )
    }

    const { user_geo_city_filters,
      user_geo_province_filters,
      user_geo_dma_filters, user_geo_country_filters, errorDate, dateRange, errorInterval, errorTimeZone, errorStartDate, interval, errorStartTime, errorEndDate, errorEndTime, timeZone, customStartDate, customStartTime, customEndDate, customEndTime, keys, metrics, placement_id, publisher_id, placements, publishers, user_geo_country, user_geo_province, user_geo_dma, user_geo_city, referring_domain, referring_domains, channel, format, player_size, user_device_model, user_device_models, user_device_brand, user_device_brands, is_revshare, user_os_family, user_os_familys, user_browser_family, user_browser_familys,
       errorList, loadingJSON, loadingCSV, report, pageChunk } = this.props;
    const {  dimmerStyle } = styles;
    return (

      <div className="sub-content" style={{ marginTop: '10px' }}>
        
        <Col md={12} lg={12}>
          <Card>
            {loadingJSON || loadingCSV ? <Dimmer active inverted style={dimmerStyle}><div className='loader' style={{top:"88%"}}> </div></Dimmer> : null} 
            <CardBody>
              <Collapse title='Rejections Report Settings' open={true} className='shadow'>
                <form className='form'>
                  <div className='form__three'>
                    <div className='float-container'>
                      <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Date Range</label>
                      <Select fluid className="bwa-select-label2 bwa-floated" label="Date Range" options={dateRanges} name="dateRange" placeholder="Date Range" value={dateRange} onChange={this.handleSelect} error={errorDate} onBlur={this.handleIllegalKeys} />
                    </div>
                  </div>
                  <div className='form__three'>
                    <div className='float-container'>
                      <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Interval</label>
                      <Select fluid className="bwa-select-label2 bwa-floated" label="Interval" options={dateRange === "Custom" ? intervalFull : intervals} name="interval" placeholder="Interval" value={interval} onChange={this.handleSelect} error={errorInterval} />
                    </div>
                  </div>

                  <div className='form__three'>
                    <div className='float-container'>
                      <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Time Zone</label>
                      <Select fluid className="bwa-select-label2 bwa-floated" label="Time Zone" options={timeZones} name="timeZone" placeholder="Time Zone" value={timeZone} onChange={this.handleSelect} error={errorTimeZone} />
                    </div>
                  </div>

                  {dateRange === "Custom" ? <div className={'form__inside_full_flex'}>
                    <div className={interval === "minute" ? 'form__four' : 'form__half2'}>
                      <div className='float-container'>
                        <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Start Date</label>
                        <Input fluid type="date" name="customStartDate" onChange={this.handleChange} error={errorStartDate} value={customStartDate} />
                      </div>
                    </div>
                    <div className='form__four'>
                      <div className='float-container'>
                        <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Start Time</label>
                        <Input fluid type="time" name="customStartTime" onChange={this.handleChange} error={errorStartTime} value={customStartTime} />

                      </div> </div>
                    <div className='form__four'>
                      <div className='float-container'>
                        <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >End Date</label>
                        <Input fluid type="date" name="customEndDate" onChange={this.handleChange} error={errorEndDate} value={customEndDate} onBlur={this.handleCustIllegalKeys} />

                      </div></div>

                    <div className='form__four'>
                      <div className='float-container'>
                        <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >End Time</label>
                        <Input fluid type="time" name="customEndTime" onChange={this.handleChange} error={errorEndTime} value={customEndTime} />

                      </div></div> 

                  </div> : null}

                </form>
              </Collapse>

              <Collapse title='Keys' open={true} className='shadow'>
                <form className='form'>
                  <div className='form__half2'>
                    <div className='float-container'>
                      {keys.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': keys.length })} >Keys</label> : <label></label>}
                      <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": keys.length })} placeholder="Keys" multiple options={keyOptions} onChange={this.handleKeys} value={keys} />
                    </div></div>
                </form>
              </Collapse>


              <Collapse title='Filters' className='shadow'>
                <form className='form'>
                  <div className='form__inside_full_flex'>
                    <div className='form__three'>
                      <div className='float-container'>
                        {placement_id.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': placement_id.length })} >Placements</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": placement_id.length })} placeholder="Placements" search multiple name="placement_id" value={placement_id} options={placements} onSearchChange={this.handleSearch.bind(null, 'placement_id', 'placements')} onChange={this.handleSelect} disabled={((this.props.disabledFilters.indexOf('placement_id') !== -1) ? (true) : (false))} />
                      </div>
                    </div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {publisher_id.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': publisher_id.length })} >Publisher</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": publisher_id.length })} placeholder="Publishers" search multiple name="publisher_id" value={publisher_id} options={publishers} onSearchChange={this.handleSearch.bind(null, 'publisher_id', 'publishers')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('publisher_id') !== -1) ? (true) : (false)} />
                      </div></div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {user_geo_city.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': user_geo_city.length })} >Cities</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": user_geo_city.length })} placeholder="Cities" search multiple options={user_geo_city_filters} name="user_geo_city" value={user_geo_city} onSearchChange={this.handleSearch.bind(null, 'user_geo_city', 'user_geo_city_filters')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('user_geo_city_id') !== -1) ? (true) : (false)} />
                      </div> </div>

                  </div>
                  <div className='form__inside_full_flex'>
                    <div className='form__three'>
                      <div className='float-container'>
                        {user_geo_country.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': user_geo_country.length })} >Countries</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": user_geo_country.length })} placeholder="Countries" search multiple name="user_geo_country" value={user_geo_country} options={user_geo_country_filters} onSearchChange={this.handleSearch.bind(null, 'user_geo_country', 'user_geo_country_filters')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('user_geo_country') !== -1) ? (true) : (false)} />
                      </div> </div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {user_geo_province.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': user_geo_province.length })} >Provinces</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": user_geo_province.length })} placeholder="Provinces" search multiple name="user_geo_province" value={user_geo_province} options={user_geo_province_filters} onSearchChange={this.handleSearch.bind(null, 'user_geo_province', 'user_geo_province_filters')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('user_geo_province') !== -1) ? (true) : (false)} />
                      </div></div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {user_geo_dma.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': user_geo_dma.length })} >DMA</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": user_geo_dma.length })} placeholder="DMA" search multiple name="user_geo_dma" value={user_geo_dma} options={user_geo_dma_filters} onSearchChange={this.handleSearch.bind(null, 'user_geo_dma', 'user_geo_dma_filters')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('user_geo_dma') !== -1) ? (true) : (false)} />
                      </div></div>
                  </div>
                  <div className='form__inside_full_flex'>
                    <div className='form__three'>
                      <div className='float-container'>
                        {referring_domain.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': referring_domain.length })} >Domains</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": referring_domain.length })} placeholder="Domains" search multiple name="referring_domain" value={referring_domain} options={referring_domains} onSearchChange={this.handleSearch.bind(null, 'referring_domain', 'referring_domains')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('referring_domain') !== -1) ? (true) : (false)} />
                      </div></div>

                        <div className='form__three'>
                      <div className='float-container'>
                        {user_device_model.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': user_device_model.length })} >Device Models</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": user_device_model.length })} placeholder="Device Models" search multiple name="user_device_model" value={user_device_model} options={user_device_models} onSearchChange={this.handleSearch.bind(null, 'user_device_model', 'user_device_models')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('user_device_model') !== -1) ? (true) : (false)} />
                      </div></div>
                      <div className='form__three'>
                      <div className='float-container'>
                        {user_device_brand.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': user_device_brand.length })} >Device Brands</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": user_device_brand.length })} placeholder="Device Brands" search multiple name="user_device_brand" value={user_device_brand} options={user_device_brands} onSearchChange={this.handleSearch.bind(null, 'user_device_brand', 'user_device_brands')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('user_device_brand') !== -1) ? (true) : (false)} />
                      </div></div>
                  </div>
                  <div className='form__inside_full_flex'>
                    <div className='form__three'>
                      <div className='float-container'>
                        {is_revshare.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': is_revshare.length })} >Rev Share</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": is_revshare.length })} placeholder="Rev Share" name="is_revshare" options={binaries} onChange={this.handleSelect} value={is_revshare} disabled={(this.props.disabledFilters.indexOf('is_revshare') !== -1) ? (true) : (false)} />
                      </div></div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {user_os_family.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': user_os_family.length })} >Operating Systems</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": user_os_family.length })} placeholder="Operating Systems" search multiple name="user_os_family" value={user_os_family} options={user_os_familys} onSearchChange={this.handleSearch.bind(null, 'user_os_family', 'user_os_familys')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('user_os_family') !== -1) ? (true) : (false)} />
                      </div></div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {user_browser_family.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': user_browser_family.length })} >Browsers</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": user_browser_family.length })} placeholder="Browsers" search multiple name="user_browser_family" value={user_browser_family} options={user_browser_familys} onSearchChange={this.handleSearch.bind(null, 'user_browser_family', 'user_browser_familys')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf("user_browser_family") !== -1) ? (true) : (false)} />
                      </div></div>
                  </div>

                  <div className='form__inside_full_flex'>
                  <div className='form__three'>
                    <div className='float-container'>
                        {player_size.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': player_size.length })} >Player Sizes</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": player_size.length })} multiple placeholder="Player Sizes" name="player_size" options={players} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('player_size') !== -1) ? (true) : (false)} />
                      </div></div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {format.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': format.length })} >Format</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": format.length })} placeholder="Format" name="format" options={formats} onChange={this.handleSelect} value={format} disabled={(this.props.disabledFilters.indexOf('format') !== -1) ? (true) : (false)} />
                      </div></div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {channel.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': channel.length })} >Channel</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": channel.length })} placeholder="Channel" name="channel" options={channels} onChange={this.handleSelect} value={channel} disabled={(this.props.disabledFilters.indexOf('channels') !== -1) ? (true) : (false)} />
                      </div></div>
                  </div>
                </form>
              </Collapse>
              <form>
                <div className='form__half'>
                  <div className='form__half2'>
                  {errorList.length ? <h5> There are some errors with your submission</h5> : null}
                  {errorList.length ? (errorList.map((err, index) => {
                    return <Alert key={index} color='danger'> {err}</Alert>
                  })) : (null)}

                  {this.props.report_err ? <Alert color='danger'>Query failed! Check your submission. {this.props.interval =='day'? 'Maximum of 31 days allowed on a per-day basis.' : this.props.interval =='hour'? 'Maximum of 168 hours (seven days) allowed on a per-hour basis.': this.props.interval =='minute'? 'Maximum of 1440 minutes (one day) allowed on a per-minute basis.':null } </Alert> : null}
                </div>
                </div>
              </form>
              <br/>
              <Button loading={loadingJSON} primary onClick={this.runValidation.bind(null, 'JSON')}>Run Report</Button>
              <Button loading={loadingCSV} primary onClick={this.runValidation.bind(null, 'CSV')}>Download CSV</Button> 
              <br />
              {report !== null  && !this.props.report_err && report.hasOwnProperty('columns') ? <div>
                {report.total_rows ? <Table responsive className='table--bordered dashboard__table-crypto'>
                <thead>
                  <tr>
                    {this.renderTableHead()}
                  </tr>
                </thead>
                <tbody>
                  {this.renderTableBody()}
                </tbody>
                <tfoot>
                  <tr>
                    {this.renderTotals()}
                  </tr>
                  <tr>
                    <th colSpan={report.columns.length}>
                    </th>
                  </tr>
                </tfoot>
              </Table>:<div> <br/><Alert> Query returned no rows</Alert></div>}
                {report.total_rows ? <Paginator pagination={{ currentPage: report.pagination.cur_page, limit: pageChunk, totalPages: report.pagination.total_pages }} handlePagination={this.handlePagination} />:null}
              </div> : null}
            </CardBody>
          </Card>
        </Col>
      </div>
    )
  }
}
const styles = {
  dimmerStyle: {
    height: "100%"
  }
}
const mapStateToProps = state => {
  const {
    errorDate,
    dateRange,
    errorInterval,
    errorTimeZone,
    errorStartDate,
    interval,
    errorStartTime,
    errorEndDate,
    errorEndTime,
    timeZone,
    customStartDate,
    customStartTime,
    customEndDate,
    customEndTime,
    keys,
   
    disabledKeys,
    disabledMetrics,
    disabledFilters,
    placement_id,
    
    publisher_id,
    placements,
    publishers,
    user_geo_country,
    user_geo_countrys,
    user_geo_province,
    user_geo_provinces,
    user_geo_dma,
    user_geo_dmas,
    user_geo_city,
    user_geo_citys,
    user_geo_postal_code,
    user_geo_postal_codes,
    referring_domain,
    referring_domains,
    channel,
    format,
    player_size,
    user_device_model,
    user_device_models,
    user_device_brand,
    user_device_brands,
    is_revshare,
    user_os_family,
    user_os_familys,
    user_browser_family,
    user_browser_familys,
    
    placement_geo_rule_selected,
    placement_geo_rule_selecteds,
s,
    errorList,
    loadingJSON,
    loadingCSV,
    report,
    sortedColumns,
    
    publisher_nameSort,
    channelSort,
    formatSort,
    player_sizeSort,
    placement_geo_rule_selectedSort,
    referring_domainSort,
    user_ipv4Sort,
    user_device_modelSort,
    user_device_brandSort,
    user_os_familySort,
    user_geo_countrySort,
    user_geo_citySort,
    user_geo_provinceSort,
    user_geo_dmaSort,
    advertiser_idSort,
    campaign_idSort,
    companion_creative_idSort,
    creative_idSort,
    flight_idSort,
    placement_idSort,
    publisher_idSort,
    record_timeSort,
    sortDirection,
    sortBy,
    currentPage,
    pageChunk,
    user_geo_city_filters,
    user_geo_country_filters,
    user_geo_province_filters,
    user_geo_postal_code_filters,
    user_geo_dma_filters,
    report_err
  } = state.rejections;
  const { activeUser } = state.shared;

  return {
    activeUser,
    errorDate,
    dateRange,
    errorInterval,
    errorTimeZone,
    errorStartDate,
    interval,
    errorStartTime,
    errorEndDate,
    errorEndTime,
    timeZone,
    customStartDate,
    customStartTime,
    customEndDate,
    customEndTime,
    keys,
   
    disabledKeys,
    disabledMetrics,
    disabledFilters,
    placement_id,
    
    publisher_id,
    placements,
    publishers,
    user_geo_country,
    user_geo_countrys,
    user_geo_province,
    user_geo_provinces,
    user_geo_dma,
    user_geo_dmas,
    user_geo_city,
    user_geo_citys,
    user_geo_postal_code,
    user_geo_postal_codes,
    referring_domain,
    referring_domains,
    channel,
    format,
    player_size,
    user_device_model,
    user_device_models,
    user_device_brand,
    user_device_brands,
    is_revshare,
    user_os_family,
    user_os_familys,
    user_browser_family,
    user_browser_familys,
    
    placement_geo_rule_selected,
    placement_geo_rule_selecteds,
s,
    errorList,
    loadingJSON,
    loadingCSV,
    report,
    sortedColumns,
    
    publisher_nameSort,
    channelSort,
    formatSort,
    player_sizeSort,
    placement_geo_rule_selectedSort,
    referring_domainSort,
    user_ipv4Sort,
    user_device_modelSort,
    user_device_brandSort,
    user_os_familySort,
    user_geo_countrySort,
    user_geo_citySort,
    user_geo_provinceSort,
    user_geo_dmaSort,
    advertiser_idSort,
    campaign_idSort,
    companion_creative_idSort,
    creative_idSort,
    flight_idSort,
    placement_idSort,
    publisher_idSort,
    record_timeSort,
    sortDirection,
    sortBy,
    currentPage,
    pageChunk,
    user_geo_city_filters,
    user_geo_country_filters,
    user_geo_province_filters,
    user_geo_postal_code_filters,
    user_geo_dma_filters,
    report_err
  };
};

export default connect(mapStateToProps, { changeRejectionState, olapRejectionValidation, olapRejectionFilter, resetRejectionErrors, runReport, setRejectionSorting })(Rejections);
