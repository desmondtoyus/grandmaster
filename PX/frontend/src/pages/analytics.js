import React, { Component } from 'react';
import { Popup, Container, Grid, Accordion, Icon, Form, Button, Menu, Message, Select, Input, TextArea, Dimmer } from 'semantic-ui-react';
import Table from '../components/table/Table';
import { changeAnalyticsState, olapValidation, olapFilter, resetAnalyticsErrors, runReport, setAnalyticsSorting, runSortReport } from '../redux/actions/analytics.actions';
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
  { text: "Cumulative", value: "overall"},
  {text:"Month", value:"month"}
];

const intervals = [
  { text: "Day", value: "day" },
  { text: "Hour", value: "hour" },
  { text: "Cumulative", value: "overall" },
  {text:"Month", value:"month"}
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

const keyOptions = [
  { text: "Placement", value: "placement_name", disabled: false },
  { text: "Publisher", value: "publisher_name", disabled: false },
  { text: "Flight", value: "flight_name", disabled: false },
  { text: "Campaign", value: "campaign_name", disabled: false },
  { text: "Creative", value: "creative_name", disabled: false },
  { text: "Advertiser", value: "advertiser_name", disabled: false },
  { text: "Companion Creative", value: "companion_creative_name", disabled: false },
  { text: "Country", value: "user_geo_country", disabled: false },
  { text: "City", value: "user_geo_city", disabled: false },
  { text: "Province", value: "user_geo_province", disabled: false },
  { text: "DMA", value: "user_geo_dma", disabled: false },
  { text: "Placement Geo Rule", value: "placement_geo_rule_selected", disabled: false },
  { text: "Flight Geo Rule", value: "flight_geo_rule_selected", disabled: false },
  { text: "Domain", value: "referring_domain", disabled: false },
  { text: "Player Size", value: "player_size", disabled: false },
  { text: "Channel", value: "channel", disabled: false },
  { text: "Format", value: "format", disabled: false },
  { text: "Rev Share", value: "is_revshare", disabled: false },
  { text: "IP Address", value: "user_ipv4", disabled: false },
  { text: "Device Model", value: "user_device_model", disabled: false },
  { text: "Device Brand", value: "user_device_brand", disabled: false },
  { text: "Operating System", value: "user_os_family", disabled: false },
  { text: "Browser", value: "user_browser_family", disabled: false },
  { text: "Demand Source Type", value: "demand_source_type", disabled: false },
  { text: "RTB Source", value: "rtb_source", disabled: false },
  { text: "App Name", value: "app_name", disabled: false },
  { text: "Bundle ID", value: "bundle_id", disabled: false },

  { text: "RTB Adomain", value: "rtb_adomain", disabled: false },
  { text: "RTB Campaign ID", value: "rtb_campaign_id", disabled: false }
];

const metricOptions = [
  { text: "Impressions", value: "impressions", disabled: false },
  { text: "Attempts", value: "attempts", disabled: false },
  { text: "Ad Errors", value: "aderrors", disabled: false },
  { text: "Opportunities", value: "opportunities", disabled: false },
  { text: "Rejections", value: "rejections", disabled: false },
  { text: "Clicks", value: "clicks", disabled: false },
  { text: "Ad Starts", value: "adstarts", disabled: false },
  { text: "25% Completions", value: "quarter_completions", disabled: false },
  { text: "50% Completions", value: "half_completions", disabled: false },
  { text: "75% Completions", value: "three_quarter_completions", disabled: false },
  { text: "100% Completions", value: "full_completions", disabled: false },
  { text: "Revenue", value: "revenue", disabled: false },
  { text: "Payout", value: "payout", disabled: false },
  { text: "RPM", value: "rpm", disabled: false },
  { text: "eCPM", value: "ecpm", disabled: false },
  { text: "Fill Rate", value: "fill_rate", disabled: false },
  { text: "25% Completion Rate", value: "quarter_completion_rate", disabled: false },
  { text: "50% Completion Rate", value: "half_completion_rate", disabled: false },
  { text: "75% Completion Rate", value: "three_quarter_completion_rate", disabled: false },
  { text: "100% Completion Rate", value: "full_completion_rate", disabled: false },
  { text: "Usable %", value: "usable", disabled: false },
  { text: "Clickthrough Rate", value: "click_through_rate", disabled: false },
  { text: "Attempt Fill Rate", value: "attempt_fill_rate", disabled: false },
  { text: "Profit", value: "profit", disabled: false },
  { text: "Margin", value: "margin", disabled: false },
  { text: "Demand ECPM", value: "demand_ecpm", disabled: false },
  { text: "Supply ECPM", value: "supply_ecpm", disabled: false }
];


// 
const rtbSource = [
  { text: "RTBiQ", value: "rtb_iq", disabled: false },
  { text: "Smart.Bid", value: "smartbids", disabled: false },
];

const demandSourceType = [
  { text: "First Party", value: "first_party", disabled: false },
  { text: "Third Party", value: "third_party", disabled: false },
  { text: "RTB", value: "rtb", disabled: false },
];


class Analytics extends Component {
state ={
  Imps:false,
Attempts:false,
Ad_Errors:false,
Opportunities:false,
Rejections:false,
Clicks:false,
Ad_Starts:false,
Completions25:false,
Completions50:false,
Completions75:false,
Completions100:false,
Revenue:false,
Payout:false,
RPM:false,
eCPM:false,
Fill_Rate:false,
Completion_Rate25:false,
Completion_Rate50:false,
Completion_Rate75:false,
Completion_Rate:false,
Usable:false,
Clickthrough_Rate:false,
Attempt_Fill_Rate:false,
Profit:false,
Margin:false,
Attempts_type:null,
Ad_Errors_type:null,
Opportunities_type:null,
Rejections_type:null,
Clicks_type:null,
Ad_Starts_type:null,
Completions25_type:null,
Completions50_type:null,
Completions75_type:null,
Completions100_type:null,
Revenue_type:null,
Payout_type:null,
RPM_type:null,
eCPM_type:null,
Fill_Rate_type:null,
Completion_Rate25_type:null,
Completion_Rate50_type:null,
Completion_Rate75_type:null,
Completion_Rate_type:null,
Usable_type:null,
Clickthrough_Rate_type:null,
Attempt_Fill_Rate_type:null,
Profit_type:null,
Margin_type:null,
Demand_ECPM:null,
Supply_ECPM:null,
Demand_ECPM_type:null,
Supply_ECPM_type:null
}
  componentWillReceiveProps(nextProps) {
    keyOptions.forEach(item => {
      item.disabled = nextProps.disabledKeys.includes(item.value);
    });
    metricOptions.forEach(item => {
      item.disabled = nextProps.disabledMetrics.includes(item.value);
    })

  }


  getTotal = (item) => {
    switch (item) {
      case "Time":
      case "Date":
        return "Total";
      case "Opportunities":
        return this.props.report.aggregates.aggregate_opportunities.toLocaleString();
      case "Attempts":
        return this.props.report.aggregates.aggregate_attempts.toLocaleString();
      case "Imps":
        return this.props.report.aggregates.aggregate_impressions.toLocaleString();
      case "Ad Starts":
        return this.props.report.aggregates.aggregate_adstarts.toLocaleString();
      case "Ad Errors":
        return this.props.report.aggregates.aggregate_aderrors.toLocaleString();
      case "Clicks":
        return this.props.report.aggregates.aggregate_clicks.toLocaleString();
      case "RPM":
        return (Number(this.props.report.aggregates.aggregate_rpm) * 100).toFixed(1) + '%';
      case "Rejections":
        return this.props.report.aggregates.aggregate_rejections.toLocaleString();
      case "Usable %":
        return (Number(this.props.report.aggregates.aggregate_usable) * 100).toFixed(1) + '%';
      case "25% Completions":
        return this.props.report.aggregates.aggregate_quarter_completions.toLocaleString();
      case "50% Completions":
        return this.props.report.aggregates.aggregate_half_completions.toLocaleString();
      case "75% Completions":
        return this.props.report.aggregates.aggregate_three_quarter_completions.toLocaleString();
      case "100% Completions":
        return this.props.report.aggregates.aggregate_full_completions.toLocaleString();
      case "Revenue":
        return '$' + Number(this.props.report.aggregates.aggregate_revenue).toFixed(2);
      case "Payout":
        return '$' + Number(this.props.report.aggregates.aggregate_payout).toFixed(2);
      case "eCPM":
        return '$' + Number(this.props.report.aggregates.aggregate_ecpm).toFixed(2);
      case "25% Completion Rate":
        return (Number(this.props.report.aggregates.aggregate_quarter_completion_rate) * 100).toFixed(1) + '%';
      case "50% Completion Rate":
        return (Number(this.props.report.aggregates.aggregate_half_completion_rate) * 100).toFixed(1) + '%';
      case "75% Completion Rate":
        return (Number(this.props.report.aggregates.aggregate_three_quarter_completion_rate) * 100).toFixed(1) + '%';
      case "Attempt Fill Rate":
        return (Number(this.props.report.aggregates.aggregate_attempt_fill_rate) * 100).toFixed(1) + '%';
      case "Fill Rate":
        return (Number(this.props.report.aggregates.aggregate_fill_rate) * 100).toFixed(1) + '%';
      case "100% Completion Rate":
        return (Number(this.props.report.aggregates.aggregate_full_completion_rate) * 100).toFixed(1) + '%';
      case "Clickthrough Rate":
        return (Number(this.props.report.aggregates.aggregate_click_through_rate) * 100).toFixed(1) + '%';
      case "Profit":
        return '$' + Number(this.props.report.aggregates.aggregate_profit).toFixed(2);
      case "Demand ECPM":
        return '$' +Number(this.props.report.aggregates.aggregate_demand_ecpm).toFixed(2);
        case "Supply ECPM":
        return '$' +Number(this.props.report.aggregates.aggregate_supply_ecpm).toFixed(2);
        case "Margin":
        return Number(this.props.report.aggregates.aggregate_margin).toFixed(2);
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
      case 'margin':
      case 'profit':
      case 'revenue':
      case 'payout':
      case 'ecpm':
      case 'partner_cpmfloor':
        return '$' + Number(obj[type]).toFixed(2).toLocaleString();
      case 'rpm':
      case 'usable':
      case 'quarter_completion_rate':
      case 'half_completion_rate':
      case 'three_quarter_completion_rate':
      case 'full_completion_rate':
      case 'fill_rate':
      case 'attempt_fill_rate':
      case 'click_through_rate':
        return (Number(obj[type]) * 100).toFixed(1) + '%';
      case 'impressions':
      case 'attempts':
      case 'opportunities':
      case 'adstarts':
      case 'aderrors':
      case 'clicks':
      case 'quarter_completions':
      case 'half_completions':
      case 'three_quarter_completions':
      case 'full_completions':
      case 'placement_name':
        return obj[type].toLocaleString();
      case 'campaign_name':
        return <Popup
          trigger={<Link to={`/ui/campaign/${obj.campaign_id}`} target="_blank">
            {obj.campaign_name}
          </Link>}
          content={obj.campaign_name}
          flowing
        />
      case 'flight_name':
        return <Popup
          trigger={<Link to={`/ui/flight/update/${obj.flight_id}`} target="_blank">
            {obj.flight_name}
          </Link>}
          content={obj.flight_name}
          flowing
        />

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

      case 'advertiser_name':
        return <Popup
          trigger={<Link to={`/ui/advertiser/${obj.advertiser_id}`} target="_blank">
            {obj.advertiser_name}
          </Link>}
          content={obj.advertiser_name}
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
      if (item.app_name == "") {
        item.app_name = "n/a"
      }
      if (item.demand_source_type == "") {
        item.demand_source_type = "n/a"
      }
      if (item.rtb_source == "") {
        item.rtb_source = "n/a"
      }
      if (item.bundle_id == "") {
        item.bundle_id = "n/a"
      }
      if (item.rtb_adomain == "") {
        item.rtb_adomain = "n/a"
      }
      if (item.rtb_campaign_id == "") {
        item.rtb_campaign_id = "n/a"
      }
      return (
        <tr key={index}>
          {this.renderRow(item)}
        </tr>
      )
    })
  };

  textAlign = (item) => {
    switch (item.toLowerCase()) {
      case 'placement_name':
      case 'placement':
      case 'publisher_name':
      case 'publisher':
      case 'flight_name':
      case 'flight':
      case 'campaign_name':
      case 'campaign':
      case 'creative_name':
      case 'creative':
      case 'advertiser_name':
      case 'advertiser':
      case 'companion_creative_name':
      case 'companion creative':
      case 'country':
      case 'user_geo_country':
      case 'city':
      case 'user_geo_city':
      case 'province':
      case 'user_geo_province':
      case 'dma':
      case 'user_geo_dma':
      case 'placement_geo_rule_selected':
      case 'flight_geo_rule_selected':
      case 'placement geo':
      case 'flight geo':
      case 'domain':
      case 'referring_domain':
      case 'player_size':
      case 'player size':
      case 'day_timestamp':
      case 'hour_timestamp':
      case 'minute_timestamp':
      case 'time':
      case 'date':
      case 'user_device_model':
      case 'device model':
      case 'user_device_brand':
      case 'device brand':
      case 'user_os_family':
      case 'operating system':
      case 'user_browser_family':
      case 'browser':
      case 'channel':
      case 'format':
        return 'left';
      case 'impressions':
      case 'imps':
      case 'attempts':
      case 'aderrors':
      case 'ad errors':
      case 'opportunities':
      case 'clicks':
      case 'adstarts':
      case 'ad starts':
      case 'quarter_completions':
      case '25% completions':
      case 'half_completions':
      case '50% completions':
      case 'full_completions':
      case '100% completions':
      case 'three_quarter_completions':
      case '75% completions':
      case 'revenue':
      case 'payout':
      case 'rpm':
      case 'ecpm':
      case 'full_completion_rate':
      case '100% completion rate':
      case 'fill_rate':
      case 'fill rate':
      case 'quarter_completion_rate':
      case '25% completion rate':
      case 'half_completion_rate':
      case '50% completion rate':
      case 'usable':
      case 'usable %':
      case 'three_quarter_completion_rate':
      case '75% completion rate':
      case 'click_through_rate':
      case 'clickthrough rate':
      case 'placement_id':
      case 'publisher_id':
      case 'flight_id':
      case 'campaign_id':
      case 'creative_id':
      case 'advertiser_id':
      case 'companion_creative_id':
      case 'id':
        return 'right';
    }
    return 'center';
  };

  handleSorting = name => {
    const { sortDirection, pageChunk } = this.props;

    const payload = {
      currentPage: 1,
      sortBy: name,
      sortDirection: sortDirection === "asc" ? "desc" : "asc",
      pageChunk
    };

    this.props.changeAnalyticsState({ prop: 'currentPage', value: 1 });
    this.props.changeAnalyticsState({ prop: 'sortBy', value: name });
    this.props.changeAnalyticsState({ prop: 'sortDirection', value: payload.sortDirection });
    this.props.setAnalyticsSorting(name);

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
    if (columns.includes('advertiser_id')) {
      names.push('ID');
      names.push('Advertiser');
      arr.push('advertiser_id');
      arr.push('advertiser_name');
    }
    if (columns.includes('campaign_id')) {
      names.push('ID');
      names.push('Campaign');
      arr.push('campaign_id');
      arr.push('campaign_name');
    }
    if (columns.includes('flight_id')) {
      names.push('ID');
      names.push('Flight');
      arr.push('flight_id');
      arr.push('flight_name');
    }
    if (columns.includes('creative_id')) {
      names.push('ID');
      names.push('Creative');
      arr.push('creative_id');
      arr.push('creative_name');
    }
    if (columns.includes('companion_creative_id')) {
      names.push('ID');
      names.push('Companion Creative');
      arr.push('companion_creative_id');
      arr.push('companion_creative_name');
    }
    if (columns.includes('channel')) {
      names.push('Channel');
      arr.push('channel');
    }
    if (columns.includes('format')) {
      names.push('Format');
      arr.push('format');
    }

    if (columns.includes("rtb_source")) {
      names.push("RTB Source");
      arr.push("rtb_source");
    }
    if (columns.includes('user_ipv4')) {
      names.push('IP Address');
      arr.push('user_ipv4');
    }
    if (columns.includes('referring_domain')) {
      names.push('Domain');
      arr.push('referring_domain');
    }
    if (columns.includes('rejections')) {
      names.push('Rejections');
      arr.push('rejections');
    }
    if (columns.includes('demand_source_type')) {
      names.push('Demand Source Type');
      arr.push('demand_source_type');
    }

    if (columns.includes('app_name')) {
      names.push('App Name');
      arr.push('app_name');
    }
    if (columns.includes('bundle_id')) {
      names.push('Bundle ID');
      arr.push('bundle_id');
    }

    if (columns.includes('rtb_adomain')) {
      names.push('RTB Adomain');
      arr.push('rtb_adomain');
    }

    if (columns.includes('rtb_campaign_id')) {
      names.push('RTB Campaign ID');
      arr.push('rtb_campaign_id');
    }
    if (columns.includes('placement_geo_rule_selected')) {
      names.push('Placement Geo');
      arr.push('placement_geo_rule_selected');
    }
    if (columns.includes('flight_geo_rule_selected')) {
      names.push('Flight Geo');
      arr.push('flight_geo_rule_selected');
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
    if (columns.includes('user_geo_postal_code')) {
      names.push('Postal Code');
      arr.push('user_geo_postal_code');
    }
    if (columns.includes('revenue')) {
      names.push('Revenue');
      arr.push('revenue');
    }
    if (columns.includes('payout')) {
      names.push('Payout');
      arr.push('payout');
    }
    if (columns.includes('ecpm')) {
      names.push('eCPM');
      arr.push('ecpm');
    }
    if (columns.includes('opportunities')) {
      names.push('Opportunities');
      arr.push('opportunities');
    }
    if (columns.includes('attempts')) {
      names.push('Attempts');
      arr.push('attempts');
    }
    if (columns.includes('impressions')) {
      names.push('Imps');
      arr.push('impressions');
    }
    if (columns.includes('player_size')) {
      names.push('Player Size');
      arr.push('player_size');
    }
    if (columns.includes('adstarts')) {
      names.push('Ad Starts');
      arr.push('adstarts');
    }
    if (columns.includes('aderrors')) {
      names.push('Ad Errors');
      arr.push('aderrors');
    }
    if (columns.includes('fill_rate')) {
      names.push('Fill Rate');
      arr.push('fill_rate');
    }
    if (columns.includes('attempt_fill_rate')) {
      names.push('Attempt Fill Rate');
      arr.push('attempt_fill_rate');
    }
    if (columns.includes('click_through_rate')) {
      names.push('Clickthrough Rate');
      arr.push('click_through_rate');
    }
    if (columns.includes('clicks')) {
      names.push('Clicks');
      arr.push('clicks');
    }
    if (columns.includes('rpm')) {
      names.push('RPM');
      arr.push('rpm');
    }
    if (columns.includes('usable')) {
      names.push('Usable %');
      arr.push('usable');
    }
    if (columns.includes('quarter_completions')) {
      names.push('25% Completions');
      arr.push('quarter_completions');
    }
    if (columns.includes('half_completions')) {
      names.push('50% Completions');
      arr.push('half_completions');
    }
    if (columns.includes('three_quarter_completions')) {
      names.push('75% Completions');
      arr.push('three_quarter_completions');
    }
    if (columns.includes('full_completions')) {
      names.push('100% Completions');
      arr.push('full_completions');
    }
    if (columns.includes('quarter_completion_rate')) {
      names.push('25% Completion Rate');
      arr.push('quarter_completion_rate');
    }
    if (columns.includes('half_completion_rate')) {
      names.push('50% Completion Rate');
      arr.push('half_completion_rate');
    }
    if (columns.includes('three_quarter_completion_rate')) {
      names.push('75% Completion Rate');
      arr.push('three_quarter_completion_rate');
    }
    if (columns.includes('full_completion_rate')) {
      names.push('100% Completion Rate');
      arr.push('full_completion_rate');
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
    if (columns.includes('profit')) {
      names.push('Profit');
      arr.push('profit');
    }

    if (columns.includes('demand_ecpm')) {
      names.push('Demand ECPM');
      arr.push('demand_ecpm');
    }

    if (columns.includes('supply_ecpm')) {
      names.push('Supply ECPM');
      arr.push('supply_ecpm');
    }


    if (columns.includes('margin')) {
      names.push('Margin');
      arr.push('margin');
    }
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
      switch (item) {
 
          case "Imps"  :
          return (
            <th key={index}>
              {item }
              {<Icon color= {this.state.Imps_type ? 'blue': 'black'} name={this.state.Imps_type ? this.state.Imps_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
            </th>
          )
          case "Attempts" :
          return (
            <th key={index}>
              {item }
              {<Icon color= {this.state.Attempts_type ? 'blue': 'black'} name={this.state.Attempts_type ? this.state.Attempts_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
            </th>
          )
         case "Ad Errors" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Ad_Errors_type ? 'blue': 'black'} name={this.state.Ad_Errors_type ? this.state.Ad_Errors_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
         case "Opportunities" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Opportunities_type ? 'blue': 'black'} name={this.state.Opportunities_type ? this.state.Opportunities_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
          case "Rejections" :
          return (
            <th key={index}>
              {item }
              {<Icon color= {this.state.Rejections_type ? 'blue': 'black'} name={this.state.Rejections_type ? this.state.Rejections_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
            </th>
          )
          case "Clicks" :
          return (
            <th key={index}>
              {item }
              {<Icon color= {this.state.Clicks_type ? 'blue': 'black'} name={this.state.Clicks_type ? this.state.Clicks_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
            </th>
          )
         case "Ad Starts" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Ad_Starts_type ? 'blue': 'black'} name={this.state.Ad_Starts_type ? this.state.Ad_Starts_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
         case "25% Completions" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Completions25_type ? 'blue': 'black'} name={this.state.Completions25_type ? this.state.Completions25_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
         case "50% Completions" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Completions50_type ? 'blue': 'black'} name={this.state.Completions50_type ? this.state.Completions50_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
          case "75% Completions" :
          return (
            <th key={index}>
              {item }
              {<Icon color= {this.state.Completions75_type ? 'blue': 'black'} name={this.state.Completions75_type ? this.state.Completions75_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
            </th>
          )
         case "100% Completions" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Completions100_type ? 'blue': 'black'} name={this.state.Completions100_type ? this.state.Completions100_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
         case "Revenue" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Revenue_type ? 'blue': 'black'} name={this.state.Revenue_type ? this.state.Revenue_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
         case "Payout" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Payout_type ? 'blue': 'black'} name={this.state.Payout_type ? this.state.Payout_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
           case "RPM" :
           return (
            <th key={index}>
              {item }
              {<Icon color= {this.state.RPM_type ? 'blue': 'black'} name={this.state.RPM_type ? this.state.RPM_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
            </th>
          )
         case "eCPM" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.eCPM_type ? 'blue': 'black'} name={this.state.eCPM_type ? this.state.eCPM_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
         case "Fill Rate" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Fill_Rate_type ? 'blue': 'black'} name={this.state.Fill_Rate_type ? this.state.Imps_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
         case "25% Completion Rate" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Completion_Rate25_type ? 'blue': 'black'} name={this.state.Completion_Rate25_type ? this.state.Completion_Rate25_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
           case "50% Completion Rate" :
           return (
            <th key={index}>
              {item }
              {<Icon color= {this.state.Completion_Rate50_type ? 'blue': 'black'} name={this.state.Completion_Rate50_type ? this.state.Completion_Rate50_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
            </th>
          )
          case "75% Completion Rate" :
          return (
            <th key={index}>
              {item }
              {<Icon color= {this.state.Completion_Rate75_type ? 'blue': 'black'} name={this.state.Completion_Rate75_type ? this.state.Completion_Rate75_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
            </th>
          )
         case "100% Completion Rate" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Completion_Rate_type ? 'blue': 'black'} name={this.state.Completion_Rate_type ? this.state.Completion_Rate_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
           case "Usable %" :
           return (
            <th key={index}>
              {item }
              {<Icon color= {this.state.Usable_type ? 'blue': 'black'} name={this.state.Usable_type ? this.state.Usable_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
            </th>
          )
         case "Clickthrough Rate" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Clickthrough_Rate_type ? 'blue': 'black'} name={this.state.Clickthrough_Rate_type ? this.state.Clickthrough_Rate_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
         case "Attempt Fill Rate" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Attempt_Fill_Rate_type ? 'blue': 'black'} name={this.state.Attempt_Fill_Rate_type ? this.state.Attempt_Fill_Rate_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
         case "Profit" :
         return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Profit_type ? 'blue': 'black'} name={this.state.Profit_type ? this.state.Profit_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )
        case "Demand ECPM" :
        return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Demand_ECPM_type ? 'blue': 'black'} name={this.state.Demand_ECPM_type ? this.state.Demand_ECPM_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )

        case "Supply ECPM" :
        return (
          <th key={index}>
            {item }
            {<Icon color= {this.state.Supply_ECPM_type ? 'blue': 'black'} name={this.state.Supply_ECPM_type ? this.state.Supply_ECPM_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
          </th>
        )

          case "Margin" :
          return (
            <th key={index}>
              {item }
              {<Icon color= {this.state.Margin_type ? 'blue': 'black'} name={this.state.Margin_type ? this.state.Margin_type =='up' ?'caret up':'caret down':'sort'}   onClick={this.handleFrontendSorting.bind(null, item)} /> }
            </th>
          )
      
        default:
        return (
          <th key={index}>
            {item}
            {keys.includes(obj.columns[index]) || item === "ID" || item === "Time" || item === "Date" ? <Icon style={{ cursor: 'pointer', marginLeft: 5 }} color={this.props[`${name}Sort`] === "sort" ? "black" : "blue"} name={this.props[`${name}Sort`]} id={obj.columns[index]} onClick={this.handleSorting.bind(null, name)} /> : null}
          </th>
        )
      }
})
  }

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
    this.props.changeAnalyticsState({ prop: `loading${reportFormat}`, value: true });

    let payload = {};
    payload.pagination = {
      cur_page: pagination.currentPage,
      sort: pagination.sortBy,
      sort_dir: pagination.sortDirection,
      page_chunk: pagination.pageChunk
    };
    const { advertiser_id, campaign_id, companion_creative_id, creative_id, flight_id, placement_id, publisher_id, placement_geo_rule_selected, flight_geo_rule_selected, user_geo_city, user_geo_country, user_geo_province, user_geo_dma, user_geo_postal_code, format, referring_domain, user_browser_family, user_os_family, user_device_model, user_device_brand, channel, is_visible, is_viewable, rtb_source,
      demand_source_type, is_above_the_fold, is_revshare, player_size, keys, metrics, interval, timeZone, dateRange } = this.props;

    payload.filters = {};
    if (placement_id.length) {
      payload.filters.placement_id = placement_id;
    }
    if (publisher_id.length) {
      payload.filters.publisher_id = publisher_id;
    }
    if (flight_id.length) {
      payload.filters.flight_id = flight_id;
    }
    if (campaign_id.length) {
      payload.filters.campaign_id = campaign_id;
    }
    if (advertiser_id.length) {
      payload.filters.advertiser_id = advertiser_id;
    }
    if (creative_id.length) {
      payload.filters.creative_id = creative_id;
    }
    if (companion_creative_id.length) {
      payload.filters.companion_creative_id = companion_creative_id;
    }
    if (placement_geo_rule_selected.length) {
      payload.filters.placement_geo_rule_selected = placement_geo_rule_selected;
    }
    if (flight_geo_rule_selected.length) {
      payload.filters.flight_geo_rule_selected = flight_geo_rule_selected;
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
    if (user_geo_postal_code.length) {
      payload.filters.user_geo_postal_code = user_geo_postal_code;
    }
    if (user_geo_dma.length) {
      payload.filters.user_geo_dma = user_geo_dma;
    }
    if (referring_domain.length) {
      payload.filters.referring_domain = referring_domain;
    }
    if (is_visible !== "") {
      payload.filters.is_visible = is_visible === "yes";
    }
    if (is_revshare !== "") {
      payload.filters.is_revshare = is_revshare === "yes";
    }
    if (is_viewable !== "") {
      payload.filters.is_viewable = is_viewable === "yes";
    }
    if (is_above_the_fold !== "") {
      payload.filters.is_above_the_fold = is_above_the_fold === "yes";
    }
    if (player_size.length) {
      payload.filters.player_size = player_size;
    }

    if (rtb_source.length) {
      payload.filters.rtb_source = rtb_source;
    }
    if (demand_source_type.length) {
      payload.filters.demand_source_type = demand_source_type;
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
    this.props.changeAnalyticsState({ prop: event.target.name, value: event.target.value });
  };

  validateDateInterval = (arr) => {
    const { interval, dateRange, customStartDate, customStartTime, customEndDate, customEndTime } = this.props;

    if (interval === "hour") {
      if (dateRange === "Month to Date" || dateRange === "Last Month") {
        arr.push(`Hour interval is incompatible with "${dateRange}" date range`);
        this.props.changeAnalyticsState({ prop: 'errorDate', value: true });
        this.props.changeAnalyticsState({ prop: 'errorInterval', value: true });
      }
    }
    if (interval === "minute") {
      if (dateRange === "Last 7 Days" || dateRange === "Month to Date" || dateRange === "Last Month") {
        arr.push(`Minute interval is incompatible with "${dateRange}" date range`);
        this.props.changeAnalyticsState({ prop: 'errorDate', value: true });
        this.props.changeAnalyticsState({ prop: 'errorInterval', value: true });
      }
    }
    if (dateRange === "Custom") {
      const start = `${customStartDate} ${customStartTime}`;
      const end = `${customEndDate} ${customEndTime}`;
      if (moment(Date.parse(end)).isBefore(Date.parse(start))) {
        arr.push(`End Date can't be before Start Date`);
        this.props.changeAnalyticsState({ prop: 'errorStartDate', value: true });
        this.props.changeAnalyticsState({ prop: 'errorStartTime', value: true });
        this.props.changeAnalyticsState({ prop: 'errorEndDate', value: true });
        this.props.changeAnalyticsState({ prop: 'errorEndTime', value: true });
      }
      if (!moment(Date.parse(start)).isValid()) {
        arr.push(`Please enter a valid start date and time`);
        this.props.changeAnalyticsState({ prop: 'errorStartDate', value: true });
        this.props.changeAnalyticsState({ prop: 'errorStartTime', value: true });
      }
      if (!moment(Date.parse(end)).isValid()) {
        arr.push(`Please enter a valid end date and time`);
      }
      if (moment(Date.parse(start)).isValid() && moment(Date.parse(end)).isValid()) {
        let dr = moment.range(moment(Date.parse(start)), moment(Date.parse(end)));
        if (interval === "minute" && dr.diff('minutes') > 1540) {
          arr.push(`Maximum date range for Minute interval is 24 hours`);
          this.props.changeAnalyticsState({ prop: 'errorStartDate', value: true });
          this.props.changeAnalyticsState({ prop: 'errorStartTime', value: true });
          this.props.changeAnalyticsState({ prop: 'errorEndDate', value: true });
          this.props.changeAnalyticsState({ prop: 'errorEndTime', value: true });
        }
        if (interval === "hour" && dr.diff('hours') > 158) {
          arr.push(`Maximum date range for Hour interval is 7 days`);
          this.props.changeAnalyticsState({ prop: 'errorStartDate', value: true });
          this.props.changeAnalyticsState({ prop: 'errorStartTime', value: true });
          this.props.changeAnalyticsState({ prop: 'errorEndDate', value: true });
          this.props.changeAnalyticsState({ prop: 'errorEndTime', value: true });
        }
        if (interval === "day" && dr.diff('days') > 30) {
          arr.push(`Maximum date range for Day interval is 30 days`);
          this.props.changeAnalyticsState({ prop: 'errorStartDate', value: true });
          this.props.changeAnalyticsState({ prop: 'errorStartTime', value: true });
          this.props.changeAnalyticsState({ prop: 'errorEndDate', value: true });
          this.props.changeAnalyticsState({ prop: 'errorEndTime', value: true });
        }
      }
    }

    return arr;
  };

  runValidation = (type) => {
    let arr = [];

    this.props.resetAnalyticsErrors();

    const { dateRange, interval, timeZone, keys, metrics } = this.props;

    if (dateRange === "") {
      arr.push('Please select a date range');
      this.props.changeAnalyticsState({ prop: 'errorDate', value: true });
    }
    if (interval === "") {
      arr.push('Please select an interval');
      this.props.changeAnalyticsState({ prop: 'errorInterval', value: true });
    }
    if (timeZone === "") {
      arr.push('Please select a time zone');
      this.props.changeAnalyticsState({ prop: 'errorTimeZone', value: true });
    }
    if (keys.length < 1) {
      arr.push('You must select at least one key');
    }
    if (metrics.length < 1) {
      arr.push('You must select at least one metric');
    }
    arr = this.validateDateInterval(arr);

    if (arr.length > 0) {
      this.props.changeAnalyticsState({ prop: 'errorList', value: arr });
      return;
    }

    this.props.changeAnalyticsState({ prop: 'currentPage', value: 1 });
    this.props.changeAnalyticsState({ prop: 'sortBy', value: 'record_time' });

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
    this.props.changeAnalyticsState({ prop: data.name, value: data.value });
  };

  handlePagination = currentPage => {
    const { sortBy, sortDirection, pageChunk } = this.props;

    this.props.changeAnalyticsState({ prop: 'currentPage', value: currentPage });
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
      this.props.olapFilter({
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
    this.props.changeAnalyticsState({ prop: 'keys', value: data.value });
    this.props.olapValidation(data.value, this.props.metrics, interval, start_time, end_time, timezone);
  };

  handleMetrics = (event, data) => {
    if (data.value.length <= 10) {
      const { interval, timeZone, dateRange } = this.props;
      let start_time = this.getStartTime(dateRange);
      let end_time = this.getEndTime(dateRange);
      let timezone = timeZone;
      this.props.changeAnalyticsState({ prop: 'metrics', value: data.value });
      this.props.olapValidation(this.props.keys, data.value, interval, start_time, end_time, timezone);
    }
  };
  handleFrontendSorting = (value, event) =>{
    event.preventDefault();
    let data = this.props.report;
      switch (value) {
        case "Imps"  :
        if (!this.state.Imps) {
          data.rows.sort((a, b) => parseFloat(a.impressions) - parseFloat(b.impressions));
          this.setState({Imps:!this.state.Imps, Imps_type:'up'})
        } else {
          data.rows.sort((a, b) => parseFloat(b.impressions) - parseFloat(a.impressions));
          this.setState({Imps:!this.state.Imps, Imps_type:'down'})
        }
          break;
          case "Attempts" :
          if (!this.state.Attempts) {
            data.rows.sort((a, b) => parseFloat(a.attempts) - parseFloat(b.attempts));
            this.setState({Attempts:!this.state.Attempts, Attempts_type:'up'})
          } else {
            data.rows.sort((a, b) => parseFloat(b.attempts) - parseFloat(a.attempts));
            this.setState({Attempts:!this.state.Attempts, Attempts_type:'down'})
          }
          break;
          case "Ad Errors" :
          if (!this.state.Ad_Errors) {
            data.rows.sort((a, b) => parseFloat(a.aderrors) - parseFloat(b.aderrors));
            this.setState({Ad_Errors:!this.state.Ad_Errors, Ad_Errors_type:'up'})
          } else {
            data.rows.sort((a, b) => parseFloat(b.aderrors) - parseFloat(a.aderrors));
            this.setState({Ad_Errors:!this.state.Ad_Errors, Ad_Errors_type:'down'})
          }
          break;
          case "Opportunities" :
          if (!this.state.Opportunities) {
            data.rows.sort((a, b) => parseFloat(a.opportunities) - parseFloat(b.opportunities));
            this.setState({Opportunities:!this.state.Opportunities, Opportunities_type:'up'})
          } else {
            data.rows.sort((a, b) => parseFloat(b.opportunities) - parseFloat(a.opportunities) );
            this.setState({Opportunities:!this.state.Opportunities, Opportunities_type:'down'})
          }
          break;
          case "Rejections" :
          if (!this.state.Rejections) {
            data.rows.sort((a, b) => parseFloat(a.rejections) - parseFloat(b.rejections));
            this.setState({Rejections:!this.state.Rejections, Rejections_type:'up'});
          } else {
            data.rows.sort((a, b) => parseFloat(b.rejections) - parseFloat(a.rejections));
            this.setState({Rejections:!this.state.Rejections, Rejections_type:'down'})
          }
          break;
          case "Clicks" :
          if (!this.state.Clicks) {
            data.rows.sort((a, b) => parseFloat(a.clicks) - parseFloat(b.clicks));
            this.setState({Clicks:!this.state.Clicks, Clicks_type:'up'})
          } else {
            data.rows.sort((a, b) => parseFloat(b.clicks) -  parseFloat(a.clicks));
            this.setState({Clicks:!this.state.Clicks, licks_type:'down'})
          }
          break;
          case "Ad Starts" :
          if (!this.state.Ad_Starts) {
            data.rows.sort((a, b) => parseFloat(a.adstarts) - parseFloat(b.adstarts));
            this.setState({Ad_Starts:!this.state.Ad_Starts, Ad_Starts_type:'up'})
          } else {
            data.rows.sort((a, b) => parseFloat(b.adstarts) - parseFloat(a.adstarts));
            this.setState({Ad_Starts:!this.state.Ad_Starts, Ad_Starts_type:'down'})
          }
          break;
          case "25% Completions" :
          if (!this.state.Completions25) {
            data.rows.sort((a, b) => parseFloat(a.quarter_completions) - parseFloat(b.quarter_completions));
            this.setState({Completions25:!this.state.Completions25, Completions25_type:'up'})
          } else {
            data.rows.sort((a, b) =>  parseFloat(b.quarter_completions) - parseFloat(a.quarter_completions) );
            this.setState({Completions25:!this.state.Completions25, Completions25_type:'down'})
          }
          break;
          case "50% Completions" :
           if (!this.state.Completions50) {
              data.rows.sort((a, b) => parseFloat(a.half_completions) - parseFloat(b.half_completions));
            this.setState({Completions50:!this.state.Completions50, Completions50_type:'up'});
          } else {
            data.rows.sort((a, b) =>  parseFloat(b.half_completions) - parseFloat(a.half_completions));
            this.setState({Completions50:!this.state.Completions50, Completions50_type:'down'})
          }
          break;
          case "75% Completions" :
          if (!this.state.Completions75) {
            data.rows.sort((a, b) => parseFloat(a.three_quarter_completions) - parseFloat(b.three_quarter_completions));
          this.setState({Completions75:!this.state.Completions75, Completions75_type:'up'})
        } else {
          data.rows.sort((a, b) => parseFloat(b.three_quarter_completions) - parseFloat(a.three_quarter_completions) );
          this.setState({Completions75:!this.state.Completions75, Completions75_type:'down'})
        }
          break;
          case "100% Completions" :
          if (!this.state.Completions100) {
            data.rows.sort((a, b) => parseFloat(a.full_completions) - parseFloat(b.full_completions));
          this.setState({Completions100:!this.state.Completions100, Completions100_type:'up'})
        } else {
          data.rows.sort((a, b) => parseFloat(b.full_completions) - parseFloat(a.full_completions) );
          this.setState({Completions100:!this.state.Completions100, Completions100_type:'down'})
        }
          break;
          case "Revenue" :
          if (!this.state.Revenue) {
            data.rows.sort((a, b) => parseFloat(a.revenue) - parseFloat(b.revenue));
          this.setState({Revenue:!this.state.Revenue, Revenue_type:'up'})
        } else {
          data.rows.sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue));
          this.setState({Revenue:!this.state.Revenue, Revenue_type:'down'})
        }
          break;
          case "Payout" :
          if (!this.state.Payout) {
            data.rows.sort((a, b) => parseFloat(a.payout) - parseFloat(b.payout));
          this.setState({Payout:!this.state.Payout, Payout_type:'up'})
        } else {
          data.rows.sort((a, b) => parseFloat(b.payout) - parseFloat(a.payout));
          this.setState({Payout:!this.state.Payout, Payout_type:'down'})
        }
          break;
          case "RPM" :
          if (!this.state.RPM) {
            data.rows.sort((a, b) => parseFloat(a.rpm) - parseFloat(b.rpm));
          this.setState({RPM:!this.state.RPM, RPM_type:'up'})
        } else {
          data.rows.sort((a, b) => parseFloat(b.rpm) - parseFloat(a.rpm) );
          this.setState({RPM:!this.state.RPM, RPM_type:'down'})
        }
          break;
          case "eCPM" :
          if (!this.state.eCPM) {
            data.rows.sort((a, b) => parseFloat(a.ecpm) - parseFloat(b.ecpm));
          this.setState({eCPM:!this.state.eCPM, eCPM_type:'up'})
        } else {
          data.rows.sort((a, b) => parseFloat(b.ecpm) - parseFloat(a.ecpm));
          this.setState({eCPM:!this.state.eCPM, eCPM_type:'down'})
        }
          break;
          case "Fill Rate" :
          if (!this.state.Fill_Rate) {
            data.rows.sort((a, b) => parseFloat(a.fill_rate) - parseFloat(b.fill_rate));
          this.setState({Fill_Rate:!this.state.Fill_Rate, Fill_Rate_type:'up'})
        } else {
          data.rows.sort((a, b) => parseFloat(b.fill_rate) - parseFloat(a.fill_rate) );
          this.setState({Fill_Rate:!this.state.Fill_Rate, Fill_Rate_type:'down'})
        }
          break;
          case "25% Completion Rate" :
          if (!this.state.Completion_Rate25) {
            data.rows.sort((a, b) => parseFloat(a.quarter_completion_rate) - parseFloat(b.quarter_completion_rate));
          this.setState({Completion_Rate25:!this.state.Completion_Rate25, Completion_Rate25_type:'up'})
        } else {
          data.rows.sort((a, b) => parseFloat(b.quarter_completion_rate) - parseFloat(a.quarter_completion_rate));
          this.setState({Completion_Rate25:!this.state.Completion_Rate25, Completion_Rate25_type:'down'})
        }
          break;
          case "50% Completion Rate" :
          if (!this.state.Completion_Rate50) {
            data.rows.sort((a, b) => parseFloat(a.half_completion_rate) - parseFloat(b.half_completion_rate));
          this.setState({Completion_Rate50:!this.state.Completion_Rate50, Completion_Rate50_type:'up'})
        } else {
          data.rows.sort((a, b) =>parseFloat(b.half_completion_rate) - parseFloat(a.half_completion_rate) );
          this.setState({Completion_Rate50:!this.state.Completion_Rate50, Completion_Rate50_type:'down'})
        }
          break;
          case "75% Completion Rate" :
          if (!this.state.Completion_Rate75) {
            data.rows.sort((a, b) => parseFloat(a.three_quarter_completion_rate) - parseFloat(b.three_quarter_completion_rate));
          this.setState({Completion_Rate75:!this.state.Completion_Rate75, Completion_Rate75_type:'up'})
        } else {
          data.rows.sort((a, b) =>  parseFloat(b.three_quarter_completion_rate) - parseFloat(a.three_quarter_completion_rate));
          this.setState({Completion_Rate75:!this.state.Completion_Rate75, Completion_Rate75_type:'up'})
        }
          break;
          case "100% Completion Rate" :
          if (!this.state.Completion_Rate) {
            data.rows.sort((a, b) => parseFloat(a.full_completion_rate) - parseFloat(b.full_completion_rate));
          this.setState({Completion_Rate:!this.state.Completion_Rate, Completion_Rate_type:'up'})
        } else {
          data.rows.sort((a, b) =>parseFloat(b.full_completion_rate) - parseFloat(a.full_completion_rate));
          this.setState({Completion_Rate:!this.state.Completion_Rate, Completion_Rate_type:'down'})
        }
          break;
          case "Usable %" :
          if (!this.state.Usable) {
            data.rows.sort((a, b) => parseFloat(a.usable) - parseFloat(b.usable));
          this.setState({Usable:!this.state.Usable, Usable_type:'up'})
        } else {
          data.rows.sort((a, b) =>parseFloat(b.usable) - parseFloat(a.usable) );
          this.setState({Usable:!this.state.Usable, Usable_type:'down'})
        }  
          break;
          case "Clickthrough Rate" :
          if (!this.state.Clickthrough_Rate) {
            data.rows.sort((a, b) => parseFloat(a.click_through_rate) - parseFloat(b.click_through_rate));
          this.setState({Clickthrough_Rate:!this.state.Clickthrough_Rate, lickthrough_Rate_type:'up'})
        } else {
          data.rows.sort((a, b) => parseFloat(b.click_through_rate) - parseFloat(a.click_through_rate) );
          this.setState({Clickthrough_Rate:!this.state.Clickthrough_Rate, Clickthrough_Rate_type:'down'})
        }
          break;
          case "Attempt Fill Rate" :
          if (!this.state.Attempt_Fill_Rate) {
            data.rows.sort((a, b) => parseFloat(a.attempt_fill_rate) - parseFloat(b.attempt_fill_rate));
          this.setState({Attempt_Fill_Rate:!this.state.Attempt_Fill_Rate, Attempt_Fill_Rate_type:'up'})
        } else {
          data.rows.sort((a, b) =>  parseFloat(b.attempt_fill_rate) - parseFloat(a.attempt_fill_rate));
          this.setState({Attempt_Fill_Rate:!this.state.Attempt_Fill_Rate, Attempt_Fill_Rate_type:'down'})
        }
          break;
          case "Profit" :
          if (!this.state.Profit) {
            data.rows.sort((a, b) => parseFloat(a.profit) - parseFloat(b.profit));
          this.setState({Profit:!this.state.Profit, Profit_type:'up'})
        } else {
          data.rows.sort((a, b) => parseFloat(b.profit) - parseFloat(a.profit));
          this.setState({Profit:!this.state.Profit, Profit_type:'down'})
        }
          break;
          case "Margin" :
          if (!this.state.Margin) {
            data.rows.sort((a, b) => parseFloat(a.margin) - parseFloat(b.margin));
          this.setState({Margin:!this.state.Margin, Margin_type:'up'})
        } else {
          data.rows.sort((a, b) =>  parseFloat(b.margin) - parseFloat(a.margin));
          this.setState({Margin:!this.state.Margin, Margin_type:'down'})
        }
          break;

          case "Demand ECPM" :
        if (!this.state.Demand_ECPM) {
            data.rows.sort((a, b) => parseFloat(a.demand_ecpm) - parseFloat(b.demand_ecpm));
          this.setState({Demand_ECPM:!this.state.Margin, Demand_ECPM_type:'up'})
        } else {
          data.rows.sort((a, b) =>  parseFloat(b.demand_ecpm) - parseFloat(a.demand_ecpm));
          this.setState({Demand_ECPM:!this.state.Demand_ECPM, Demand_ECPM_type:'down'})
        }
          break;

          case "Supply ECPM" :
          if (!this.state.Supply_ECPM) {
              data.rows.sort((a, b) => parseFloat(a.supply_ecpm) - parseFloat(b.supply_ecpm));
            this.setState({Supply_ECPM:!this.state.Margin, Supply_ECPM_type:'up'})
          } else {
            data.rows.sort((a, b) =>  parseFloat(b.supply_ecpm) - parseFloat(a.supply_ecpm));
            this.setState({Supply_ECPM:!this.state.Supply_ECPM, Supply_ECPM_type:'down'})
          }
            break;


        default:
          break;
      }
      console.log('DATA = ', data);
    this.props.runSortReport(data);


  }

  render() {
    const { activeUser } = this.props;

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
      user_geo_postal_code_filters,
      user_geo_dma_filters, user_geo_country_filters, errorDate, dateRange, errorInterval, errorTimeZone, errorStartDate, interval, errorStartTime, errorEndDate, errorEndTime, timeZone, customStartDate, customStartTime, customEndDate, customEndTime, keys, metrics, placement_id, publisher_id, flight_id, placements, publishers, flights, advertiser_id, campaign_id, creative_id, advertisers, campaigns, creatives, companion_creative_id, companion_creatives, user_geo_country, user_geo_countrys, user_geo_province, user_geo_provinces, user_geo_dma, user_geo_dmas, user_geo_city, user_geo_citys, user_geo_postal_code, user_geo_postal_codes, referring_domain, referring_domains, channel, format, player_size, user_device_model, user_device_models, user_device_brand, user_device_brands, is_revshare, user_os_family, user_os_familys, user_browser_family, user_browser_familys, is_visible, is_viewable, rtb_source,
      demand_source_type, disabledFilters, is_above_the_fold, placement_geo_rule_selected, placement_geo_rule_selecteds, flight_geo_rule_selected, flight_geo_rule_selecteds, errorList, loadingJSON, loadingCSV, report, pageChunk } = this.props;
    const {  dimmerStyle } = styles;
    return (

      <div className="sub-content" style={{ marginTop: '10px' }}>
        
        <Col md={12} lg={12}>
          <Card>
            {loadingJSON || loadingCSV ? <Dimmer active inverted style={dimmerStyle}><div className='loader' style={{top:"88%"}}> </div></Dimmer> : null} 
            <CardBody>
              <Collapse title='Report Settings' open={true} className='shadow'>
                <form className='form'>
                  <div className='form__three'>
                    <div className='float-container'>
                      <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Date Range</label>
                      <Select fluid className="bwa-select-label2 bwa-floated" label="Date Range" options={dateRanges} name="dateRange" placeholder="Date Range" value={dateRange} onChange={this.handleSelect} error={errorDate} />
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
                    <div className={interval === "minute" || interval === "hour" ? 'form__four' : 'form__half2'}>
                      <div className='float-container'>
                        <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Start Date</label>
                        <Input fluid type="date" name="customStartDate" onChange={this.handleChange} error={errorStartDate} value={customStartDate} />
                      </div>
                    </div>
                    {interval === "minute" || interval === "hour"  ? <div className='form__four'>
                      <div className='float-container'>
                        <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Start Time</label>
                        <Input fluid type="time" name="customStartTime" onChange={this.handleChange} error={errorStartTime} value={customStartTime} />

                      </div> </div> : null}
                    <div className={interval === "minute" || interval === "hour"  ? 'form__four' : 'form__half2'}>
                      <div className='float-container'>
                        <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >End Date</label>
                        <Input fluid type="date" name="customEndDate" onChange={this.handleChange} error={errorEndDate} value={customEndDate} />

                      </div></div>

                    {interval === "minute" || interval === "hour"  ? <div className='form__four'>
                      <div className='float-container'>
                        <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >End Time</label>
                        <Input fluid type="time" name="customEndTime" onChange={this.handleChange} error={errorEndTime} value={customEndTime} />

                      </div></div> : null}

                  </div> : null}

                </form>
              </Collapse>

              <Collapse title='Keys / Metrics' open={true} className='shadow'>
                <form className='form'>
                  <div className='form__half2'>
                    <div className='float-container'>
                      {keys.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': keys.length })} >Keys</label> : <label></label>}
                      <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": keys.length })} placeholder="Keys" multiple options={keyOptions} onChange={this.handleKeys} value={keys} />
                    </div></div>
                  <div className='form__half2x'>
                    <div className='float-container'>
                      {metrics.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': metrics.length })} >Metrics (Max. 10)</label> : <label></label>}
                      <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": metrics.length })} placeholder="Metrics (Max. 10)" multiple options={metricOptions} onChange={this.handleMetrics} value={metrics} />
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
                        {flight_id.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': flight_id.length })} >Flights</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": flight_id.length })} placeholder="Flights" search multiple name="flight_id" value={flight_id} options={flights} onSearchChange={this.handleSearch.bind(null, 'flight_id', 'flights')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('flight_id') !== -1) ? (true) : (false)} />
                      </div></div>

                  </div>
                  <div className='form__inside_full_flex'>
                    <div className='form__three'>
                      <div className='float-container'>
                        {campaign_id.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': campaign_id.length })} >Campaigns</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": campaign_id.length })} placeholder="Campaigns" search multiple name="campaign_id" value={campaign_id} options={campaigns} onSearchChange={this.handleSearch.bind(null, 'campaign_id', 'campaigns')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('campaign_id') !== -1) ? (true) : (false)} />
                      </div></div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {advertiser_id.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': advertiser_id.length })} >Advertisers</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": advertiser_id.length })} placeholder="Advertisers" search multiple name="advertiser_id" value={advertiser_id} options={advertisers} onSearchChange={this.handleSearch.bind(null, 'advertiser_id', 'advertisers')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('advertiser_id') !== -1) ? (true) : (false)} />
                      </div></div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {creative_id.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': creative_id.length })} >Creatives</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": creative_id.length })} placeholder="Creatives" search multiple name="creative_id" value={creative_id} options={creatives} onSearchChange={this.handleSearch.bind(null, 'creative_id', 'creatives')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('creative_id') !== -1) ? (true) : (false)} />
                      </div></div>
                  </div>


                  <div className='form__inside_full_flex'>
                    <div className='form__three'>
                      <div className='float-container'>
                        {companion_creative_id.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': companion_creative_id.length })} >Companion Creatives</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": companion_creative_id.length })} placeholder="Companion Creatives" search multiple name="companion_creative_id" value={companion_creative_id} options={companion_creatives} onSearchChange={this.handleSearch.bind(null, 'companion_creative_id', 'companion_creatives')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('companion_creative_id') !== -1) ? (true) : (false)} />
                      </div></div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {placement_geo_rule_selected.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': placement_geo_rule_selected.length })} >Placement Geo</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": placement_geo_rule_selected.length })} placeholder="Placement Geo" search multiple name="placement_geo_rule_selected" value={placement_geo_rule_selected} options={placement_geo_rule_selecteds} onSearchChange={this.handleSearch.bind(null, 'placement_geo_rule_selected', 'placement_geo_rule_selecteds')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('placement_geo_rule_selected') !== -1) ? (true) : (false)} />
                      </div></div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {flight_geo_rule_selected.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': flight_geo_rule_selected.length })} >Flight Geo</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": flight_geo_rule_selected.length })} placeholder="Flight Geo" search multiple name="placement_geo_rule_selected" value={flight_geo_rule_selected} options={flight_geo_rule_selecteds} onSearchChange={this.handleSearch.bind(null, 'flight_geo_rule_selected', 'flight_geo_rule_selecteds')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('flight_geo_rule_selected') !== -1) ? (true) : (false)} />
                      </div></div>
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
                        {user_geo_city.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': user_geo_city.length })} >Cities</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": user_geo_city.length })} placeholder="Cities" search multiple options={user_geo_city_filters} name="user_geo_city" value={user_geo_city} onSearchChange={this.handleSearch.bind(null, 'user_geo_city', 'user_geo_city_filters')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('user_geo_city_id') !== -1) ? (true) : (false)} />
                      </div> </div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {user_geo_postal_code.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': user_geo_postal_code.length })} >Postal Codes</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": user_geo_postal_code.length })} placeholder="Postal Codes" search multiple options={user_geo_postal_code_filters} name="user_geo_postal_code" value={user_geo_postal_code} onSearchChange={this.handleSearch.bind(null, 'user_geo_postal_code', 'user_geo_postal_code_filters')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('user_geo_postal_code_id') !== -1) ? (true) : (false)} />
                      </div> </div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {demand_source_type.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': demand_source_type.length })} >Demand Source Type</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": demand_source_type.length })} placeholder="Demand Source Type" options={demandSourceType} name="demand_source_type" value={demand_source_type} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('demand_source_type') !== -1) ? (true) : (false)} />
                      </div> </div>
                  </div>

                  <div className='form__inside_full_flex'>
                    <div className='form__three'>
                      <div className='float-container'>
                        {referring_domain.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': referring_domain.length })} >Domains</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": referring_domain.length })} placeholder="Domains" search multiple name="referring_domain" value={referring_domain} options={referring_domains} onSearchChange={this.handleSearch.bind(null, 'referring_domain', 'referring_domains')} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('referring_domain') !== -1) ? (true) : (false)} />
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

                  <div className='form__inside_full_flex'>
                    <div className='form__three'>
                      <div className='float-container'>
                        {player_size.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': player_size.length })} >Player Sizes</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": player_size.length })} multiple placeholder="Player Sizes" name="player_size" options={players} onChange={this.handleSelect} disabled={(this.props.disabledFilters.indexOf('player_size') !== -1) ? (true) : (false)} />
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
                        {is_visible.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': is_visible.length })} >Visible</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": is_visible.length })} placeholder="Visible" name="is_visible" options={binaries} onChange={this.handleSelect} value={is_visible} disabled={(this.props.disabledFilters.indexOf('is_visible') !== -1) ? (true) : (false)} />
                      </div> </div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {is_above_the_fold.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': is_above_the_fold.length })} >Above The Fold</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": is_above_the_fold.length })} placeholder="Above The Fold" name="is_above_the_fold" options={binaries} onChange={this.handleSelect} value={is_above_the_fold} disabled={(this.props.disabledFilters.indexOf('is_above_the_fold') !== -1) ? (true) : (false)} />
                      </div> </div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {is_viewable.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': is_viewable.length })} >Viewable</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": is_viewable.length })} placeholder="Viewable" name="is_viewable" options={binaries} onChange={this.handleSelect} value={is_viewable} disabled={(this.props.disabledFilters.indexOf('is_viewable') !== -1) ? (true) : (false)} />
                      </div></div>
                  </div>

                  <div className='form__inside_full_flex'>
                    <div className='form__three'>
                      {/* <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": is_visible.length })} label="Visible" name="is_visible" options={binaries} onChange={this.handleSelect} value={is_visible} disabled={(this.props.disabledFilters.indexOf('is_visible') !== -1) ? (true) : (false)} /> */}
                    </div>

                    <div className='form__three'>
                      <div className='float-container'>
                        {rtb_source.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': rtb_source.length })} >RTB Source</label> : <label></label>}
                        <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": rtb_source.length })} placeholder="RTB Source" name="rtb_source" options={rtbSource} onChange={this.handleSelect} value={rtb_source} disabled={(this.props.disabledFilters.indexOf('rtb_source') !== -1) ? (true) : (false)} />
                      </div></div>

                    <div className='form__three'>
                      {/* <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": is_viewable.length })} label="Viewable" name="is_viewable" options={binaries} onChange={this.handleSelect} value={is_viewable} disabled={(this.props.disabledFilters.indexOf('is_viewable') !== -1) ? (true) : (false)} /> */}
                    </div>
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

                  {this.props.report_err ? <Alert color='danger'>Query failed! Check your submission. Some keys cannot be queried for longer than a single day's timeframe.</Alert> : null}
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
    metrics,
    disabledKeys,
    disabledMetrics,
    disabledFilters,
    placement_id,
    flight_id,
    publisher_id,
    placements,
    publishers,
    flights,
    advertiser_id,
    campaign_id,
    creative_id,
    advertisers,
    campaigns,
    creatives,
    companion_creative_id,
    companion_creatives,
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
    is_visible,
    is_viewable,
    rtb_source,
    demand_source_type,
    is_above_the_fold,
    placement_geo_rule_selected,
    placement_geo_rule_selecteds,
    flight_geo_rule_selected,
    flight_geo_rule_selecteds,
    errorList,
    loadingJSON,
    loadingCSV,
    report,
    sortedColumns,
    advertiser_nameSort,
    campaign_nameSort,
    creative_nameSort,
    companion_creative_nameSort,
    flight_nameSort,
    placement_nameSort,
    publisher_nameSort,
    channelSort,
    flight_geo_rule_selectedSort,
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
  } = state.analytics;
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
    metrics,
    disabledKeys,
    disabledMetrics,
    disabledFilters,
    placement_id,
    flight_id,
    publisher_id,
    placements,
    publishers,
    flights,
    advertiser_id,
    campaign_id,
    creative_id,
    advertisers,
    campaigns,
    creatives,
    companion_creative_id,
    companion_creatives,
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
    is_visible,
    is_viewable,
    rtb_source,
    demand_source_type,
    is_above_the_fold,
    placement_geo_rule_selected,
    placement_geo_rule_selecteds,
    flight_geo_rule_selected,
    flight_geo_rule_selecteds,
    errorList,
    loadingJSON,
    loadingCSV,
    report,
    sortedColumns,
    advertiser_nameSort,
    campaign_nameSort,
    creative_nameSort,
    companion_creative_nameSort,
    flight_nameSort,
    placement_nameSort,
    publisher_nameSort,
    channelSort,
    flight_geo_rule_selectedSort,
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

export default connect(mapStateToProps, { runSortReport, changeAnalyticsState, olapValidation, olapFilter, resetAnalyticsErrors, runReport, setAnalyticsSorting })(Analytics);
