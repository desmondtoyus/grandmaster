import React, { Component } from 'react';
import { Button, Dimmer, Loader } from 'semantic-ui-react';
import { Breadcrumb, BreadcrumbItem, Alert, Card, CardBody, Col } from 'reactstrap';
import Collapse from '../../components/Collapse';
import { readFlight, cloneFlight, createFlight, updateFlight, resetFlightReducer, changeFlight, listOptions, resetFlightErrors } from '../../redux/actions/flight.actions';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { isAllowed } from '../../functions';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import ModalManager from '../../modals/modal.manager';

// DETAILS
import FlightDetails from './flight.details';

// TARGETING
import FlightTargetings from './flight.targetings';

// CREATIVES
import FlightDisplayCreatives from './flight.display.creatives';
import FlightVideoCreatives from './flight.video.creatives'

import API from "../../utils/API";


class Flight extends Component {
  componentWillMount() {
    // this.props.listFlightBeacons();
    const { campaignId, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    this.props.listOptions({ campaignId, master });
    if (match.params.id && !isNaN(Number(match.params.id)) && Number(match.params.id) > 0) {
      this.props.readFlight({ id: Number(match.params.id), callback: this.props.listOptions, master });
      // if (this.props.campaignId) { this.handleDate(this.props.campaignId) };

    }
  }


  componentDidUpdate() {
    let camTime = (this.props.campaignId);
    if (camTime) {
      this.handleDate(camTime)
    }


  }

  handleDate = (value) => {
    API.getDates(value)
      .then(res => {
        let endTime = moment.unix(res.data.end_time).format("YYYY-MM-DD");
        let startTime = moment.unix(res.data.start_time).format("YYYY-MM-DD");
        localStorage.setItem('endTime', endTime);
        localStorage.setItem('startTime', startTime);
      })
      .catch(err => console.log(err));
  }

  renderCreatives = () => {
    const { format } = this.props;

    if (format === "display") {
      return <FlightDisplayCreatives />;
    }
    else if (format === "video") {
      return <FlightVideoCreatives />;
    }
    else {
      return <div>PLEASE SELECT A FORMAT</div>;
    }
  };

  componentWillUnmount() {
    this.props.resetFlightReducer();
  }

  isInputValid = () => {
    let campaignStartDate = localStorage.startTime
    let campaignEndDate = localStorage.endTime;
    this.props.resetFlightErrors();
    let errorFree = true;

    const { party, rtbPlatform, width, height,  displaySize,  flight_type, maxVideoDuration, advertiserId, campaignId, name, startDate, endDate, channel, format, playerSize, videoValid, displayValid, cpm, cpc, dayInclude, totalInclude, dayGoal, totalGoal, dayGoalType, totalGoalType, pacing, cap, dayParting, notes, dealId, dealCpmFloor } = this.props;

    let arr = [];

    if (!advertiserId) {
      arr.push('Please select an advertiser');
      this.props.changeFlight({ prop: 'errorAdvertiserId', value: true });
    }

    if (!campaignId) {
      arr.push('Please select a campaign');
      this.props.changeFlight({ prop: 'errorCampaignId', value: true });
    }

    if (name.length < 6) {
      arr.push('Flight name shall contain at least 6 characters');
      this.props.changeFlight({ prop: 'errorName', value: true });
    }
    if (name.length > 100) {
      arr.push('Flight name shall contain at most 100 characters');
      this.props.changeFlight({ prop: 'errorName', value: true });
    }

    if (!(name.length > 100) && !(name.length < 6) && !isNaN(name)) {
      arr.push('Flight name cannot all be numbers');
      this.props.changeFlight({ prop: 'errorName', value: true });
    }

    if (pacing === "") {
      arr.push('Please select Caps Pacing');
      this.props.changeFlight({ prop: 'errorPacing', value: true });
    }

    if (notes.length > 500) {
      arr.push('Flight notes shall contain at most 500 characters');
      this.props.changeFlight({ prop: 'errorNotes', value: true });
    }

    if ((flight_type === "deal_id" || flight_type ==="rtb") && rtbPlatform=== ""){
      arr.push('Please select a Buyer');
      this.props.changeFlight({ prop: 'errorRTBPlatform', value: true });
  }

    if (!moment(startDate).isValid()) {
      arr.push('Please enter a valid start date');
      this.props.changeFlight({ prop: 'errorStartDate', value: true });
    }
    //Added
    if (moment(startDate).isAfter(campaignEndDate) || moment(startDate).isBefore(campaignStartDate)) {
      arr.push('Start date must be within the campaign date range.');
      // arr.push('Date must be within the campaign date range.', 'Start Date:' + campaignStartDate, 'End Date: ' + campaignEndDate);
      this.props.changeFlight({ prop: 'errorStartDate', value: true });
    }
    //
    if (moment(endDate).isAfter(campaignEndDate) || moment(endDate).isBefore(campaignStartDate)) {
      arr.push('End date must be within the campaign date range.');
      this.props.changeFlight({ prop: 'errorEndDate', value: true });
    }

    if (!moment(endDate).isValid()) {
      arr.push('Please enter a valid end date');
      this.props.changeFlight({ prop: 'errorEndDate', value: true });
    }

    if (moment(startDate).isValid() && moment(endDate).isValid() && moment(startDate).unix() > moment(endDate).unix()) {
      arr.push('Your flight end date cannot be earlier than the start date');
      this.props.changeFlight({ prop: 'errorStartDate', value: true });
      this.props.changeFlight({ prop: 'errorEndDate', value: true });
    }


    if (arr.length > 0) {
      this.props.changeFlight({ prop: 'detailsErrors', value: arr });
      errorFree = false;
    }

    arr = [];

    if (channel === "") {
      arr.push('Please select a channel');
      this.props.changeFlight({ prop: 'errorChannel', value: true });
    }

    if (format === "") {
      arr.push('Please select a format');
      this.props.changeFlight({ prop: 'errorFormat', value: true });
    }

    if (isNaN(dealCpmFloor)) {
      arr.push('Invalid CPM floor');
      this.props.changeFlight({ prop: 'errorDealCpmFloor', value: true });
    }
    if (dealId !== '') {
      var re = new RegExp("^([a-z0-9]{5,})$");
      if (re.test(dealId)) {
        arr.push('Invalid Deal ID');
        this.props.changeFlight({ prop: 'errorDealId', value: true });
      }

    }

    if (arr.length > 0) {
      this.props.changeFlight({ prop: 'typeErrors', value: arr });
      errorFree = false;
    }

    arr = [];

    // if (format === "video" && !videoValid) {
    //   arr.push('Please add a valid creative');
    // }
    // else if (format === "display" && !displayValid) {
    //   arr.push('Please add a valid creative');
    // }
    if (flight_type == "standard" && party===''){
      arr.push('Please select a party');
      this.props.changeFlight({ prop: 'errorParty', value: true });
    }
    if (flight_type == "standard" && format === "display") {
      if (displaySize === "") {
        arr.push('Please select a display size');
        this.props.changeFlight({ prop: 'errorDisplaySize', value: true });
      }
      else if (displaySize === "custom") {
        if (width === "" || isNaN(Number(width))) {
          arr.push('Please enter display width as a number of pixels');
          this.props.changeFlight({ prop: 'errorWidth', value: true });
        }
        if (height === "" || isNaN(Number(height))) {
          arr.push('Please enter display height as a number of pixels');
          this.props.changeFlight({ prop: 'errorHeight', value: true });
        }
      }
    }

    if (flight_type == "standard" &&  format === "video" && party === 'first_party' && !videoValid) {
      arr.push('Please add a valid creative');
    }
    else if (flight_type  == "standard" && format === "display" && party === 'first_party' && !displayValid) {
      arr.push('Please add a valid creative');
    }

    if (arr.length > 0) {
      if (format === "video" && flight_type==='standard') {
        this.props.changeFlight({ prop: 'videoErrors', value: arr });
        errorFree = false;
      }
      else if (format === "display" && flight_type==='standard') {
        this.props.changeFlight({ prop: 'displayErrors', value: arr });
        errorFree = false;
      }
    }

    arr = [];

    if (flight_type =='standard' && (cpm === "" || isNaN(Number(cpm)))) {
      arr.push('Please enter a valid CPM');
      this.props.changeFlight({ prop: 'errorCPM', value: true });
    }

//     "deal_id" || flight_type === "rtb" 
// flight_type =='standard' || flight_type === "rtb"
if (flight_type =='standard' && cpm < 1) {
  arr.push('Please enter a valid CPM');
  this.props.changeFlight({ prop: 'errorCPM', value: true });
}

if (flight_type =='deal_id' && dealCpmFloor < 1) {
  arr.push('Please enter a valid CPM');
  this.props.changeFlight({ prop: 'errorDealCpmFloor', value: true });
}

    if (isNaN(Number(cpc))) {
      arr.push('CPC shall be a number');
      this.props.changeFlight({ prop: 'errorCPC', value: true });
    }
    if (dayInclude) {
      if (dayGoal === "" || isNaN(Number(dayGoal)) || Number(dayGoal) <= 0) {
        arr.push('Daily goal shall be a number greater than 0');
        this.props.changeFlight({ prop: 'errorDayGoal', value: true });
      }
      if (dayGoalType === "") {
        arr.push('Please select a daily goal type');
        this.props.changeFlight({ prop: 'errorDayGoalType', value: true });
      }
    }
    if (totalInclude) {
      if (totalGoal === "" || isNaN(Number(totalGoal)) || Number(totalGoal) <= 0) {
        arr.push('Total goal shall be a number greater than 0');
        this.props.changeFlight({ prop: 'errorTotalGoal', value: true });
      }
      if (totalGoalType === "") {
        arr.push('Please select a daily goal type');
        this.props.changeFlight({ prop: 'errorTotalGoalType', value: true });
      }
    }

    if (arr.length > 0) {
      this.props.changeFlight({ prop: 'goalsErrors', value: arr });
      errorFree = false;
    }

    arr = [];

    if (format === "video" && playerSize.length === 0) {
      arr.push('Please select player sizes');
      this.props.changeFlight({ prop: 'errorPlayerSize', value: true });
    }

    if (format === "video" && !maxVideoDuration) {
      arr.push('Please select maximum video duration');
      this.props.changeFlight({ prop: 'errorMaxVideoDuration', value: true });
    }
    if (cap === "" || isNaN(Number(cap)) || Number(cap) <= 0) {
      arr.push('Daily impressions capping shall be a number greater than 0');
      this.props.changeFlight({ prop: 'errorCap', value: true });
    }
    let errors = [false, false, false, false];
    let day = [...dayParting];
    for (let i = 0; i < day.length; i++) {
      if (day[i].startDay !== "" || day[i].endDay !== "" || day[i].startTime !== "" || day[i].endTime !== "") {
        if (day[i].startDay === "") {
          if (!errors[0]) {
            arr.push('Please select Day Parting Start Day');
            errors[0] = true;
          }
          day[i].errorStartDay = true;
        }
        if (day[i].endDay === "") {
          if (!errors[1]) {
            arr.push('Please select Day Parting End Day');
            errors[1] = true;
          }
          day[i].errorEndDay = true;
        }
        if (day[i].startTime === "") {
          if (!errors[2]) {
            arr.push('Please select Day Parting Start Time');
            errors[2] = true;
          }
          day[i].errorStartTime = true;
        }
        if (day[i].endTime === "") {
          if (!errors[3]) {
            arr.push('Please select Day Parting End Time');
            errors[3] = true;
          }
          day[i].errorEndTime = true;
        }
      }
    }
    this.props.changeFlight({ prop: 'dayParting', value: day });

    if (arr.length > 0) {
      this.props.changeFlight({ prop: 'capsErrors', value: arr });
      errorFree = false;
    }

    return errorFree;
  };

  getStartTime = (timezone) => {
    const { startTime, startDate } = this.props;
    let date;
    if (startTime !== "") {
      date = `${startDate} ${startTime}`;
    }
    else {
      date = `${startDate} 00:00`;
    }

    if (timezone === "US/Pacific") {
      timezone = "America/Los_Angeles";
    }
    else if (timezone === "US/Eastern") {
      timezone = "America/New_York";
    }
    else {
      timezone = "UTC";
    }
    return moment.tz(date, timezone).unix();
  };

  getEndTime = (timezone) => {
    const { endTime, endDate } = this.props;

    let date;
    if (endTime !== "") {
      date = `${endDate} ${endTime}`;
    }
    else {
      date = `${endDate} 23:59`;
    }

    if (timezone === "US/Pacific") {
      timezone = "America/Los_Angeles";
    }
    else if (timezone === "US/Eastern") {
      timezone = "America/New_York";
    }
    else {
      timezone = "UTC";
    }
    return moment.tz(date, timezone).unix();
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.changeFlight({ prop: 'spinner', value: true });
    if (!this.isInputValid()) {
      this.props.changeFlight({ prop: 'spinner', value: false });
      return;
    }
    // this.props.changeFlight({ prop: 'spinner', value: true });
    const {match, flight_type, isRetargeted, campaignId, name, notes, timezone, status, cpm, cpc, isUnmutedOnly, isVisibleOnly, format, maxVideoDuration, channel, playerSize, isVastOnly, clickThroughUrl, clickTracker, impressionTracker, jsTag, platform, rtbPlatform, party, cap, pacing, browser, height, width, iabCategories, listId, listCategory, userAgent, creativeId, fileName, altText, contentType, bitrate, duration, companions, creativeName, creativeNotes, forensiq, dayParting, dayInclude, dayGoalType, dayGoal, totalInclude, totalGoalType, totalGoal, id, dayGoalId, totalGoalId, includedCountries, includedProvinces, includedDma, includedCities, includedPostalCodes, excludedCountries, excludedProvinces, excludedDma, excludedCities, excludedPostalCodes, rtbList, dealId, dealCpmFloor, is_skippable } = this.props;

    let payload = {};
    payload.flight = {
      id:id,
      campaignId: campaignId,
      name: name,
      notes: notes,
      flight_type:flight_type,
      cpm: flight_type === "deal_id" || flight_type === "rtb"  ? 0 : Math.round(Number(cpm) * 100),
      cpc: Math.round(Number(cpc) * 100),
      clickthrough_url: clickThroughUrl,
      is_skippable:is_skippable,
      deal_id: dealId,
      deal_cpmfloor: flight_type =='standard' || flight_type === "rtb" ? 0 : Math.round(Number(dealCpmFloor) * 100),
      impression_tracker: impressionTracker,
      click_tracker: clickTracker,
      is_retargeted:isRetargeted,
      wrapper_url: jsTag,
      wrapper_source_platform: platform,
      is_direct_deal: false,
      user_frequency_cap: Number(cap),
      is_muted_allowed: !isUnmutedOnly,
      is_visible_only: isVisibleOnly,
      start_time: this.getStartTime(timezone),
      end_time: this.getEndTime(timezone),
      demand_source_type: party,
      pacing_category: pacing,
      desktop_browser_targeting: channel === "desktop" ? (browser.length ? browser : ['ie/edge', 'chrome', 'firefox', 'safari', 'other']) : [],
      rtb_source: format === "video" ? (party === "rtb" ? rtbPlatform : 0) : (party === "rtb" ? rtbPlatform : 0),
      format: format,
      maxVideoDuration: maxVideoDuration,
      channel: channel,
      height: isNaN(Number(height)) ? 0 : Number(height),
      width: isNaN(Number(width)) ?  0 : Number(width),
      player_size: playerSize,
      is_vast_only: isVastOnly,
      iab_categories: iabCategories,
      domain_list_id: listId,
      domain_list_category: listCategory,
      status: status,
      timezone: timezone
    };

    if (channel === "mobile_app" || channel === "mobile_web") {
      if (userAgent.length) {
        payload.flight.user_agent = userAgent;
      }
      else {
        payload.flight.user_agent = ['ios', 'android', 'mobile_other', 'windows_mobile'];
      }
    }
    else if (channel === "desktop") {
      payload.flight.user_agent = ['desktop'];
    }
    else {
      payload.flight.user_agent = [];
    }

    if (format === "video" && party !== "rtb" && flight_type =='standard') {
      payload.video = {
        id: creativeId,
        name: creativeName,
        notes: creativeNotes,
        filename: fileName,
        alt_text: altText,
        party: party,
        js_tag: jsTag,
        height: isNaN(Number(height)) ? 0 : Number(height),
        width: isNaN(Number(width)) ?  0 : Number(width),
        content_type: contentType,
        bitrate: Number(bitrate),
        duration: Number(duration),
        companions: companions
      }
    }
    else if (format === "display" && party !== "rtb" && flight_type =='standard') {
      payload.display = {
        id: creativeId,
        name: creativeName,
        notes: creativeNotes,
        is_companion_creative: false,
        filename: fileName,
        alt_text: altText,
        party: party,
        js_tag: jsTag,
        width: width,
        height: height
      }
    }

    payload.brandSafety = [];
    payload.brandSafety.push({
      name: 'whiteops',
      is_active: forensiq
    });

    payload.dayParting = [];
    dayParting.forEach(item => {
      if (item.startDay !== "" && item.endDay !== "" && item.startTime !== "" && item.endTime !== "") {
        payload.dayParting.push({
          id: item.id,
          start_day: item.startDay,
          end_day: item.endDay,
          start_hour: item.startTime,
          end_hour: item.endTime
        })
      }
    });

    payload.targetGeo = [];
    includedCountries.forEach(item => {
      payload.targetGeo.push({
        is_include: true,
        type: 'country',
        value: item
      })
    });
    excludedCountries.forEach(item => {
      payload.targetGeo.push({
        is_include: false,
        type: 'country',
        value: item
      })
    });
    includedCities.forEach(item => {
      payload.targetGeo.push({
        is_include: true,
        type: 'city',
        value: item
      })
    });
    excludedCities.forEach(item => {
      payload.targetGeo.push({
        is_include: false,
        type: 'city',
        value: item
      })
    });
    includedProvinces.forEach(item => {
      payload.targetGeo.push({
        is_include: true,
        type: 'province',
        value: item
      })
    });
    excludedProvinces.forEach(item => {
      payload.targetGeo.push({
        is_include: false,
        type: 'province',
        value: item
      })
    });
    includedPostalCodes.forEach(item => {
      payload.targetGeo.push({
        is_include: true,
        type: 'postal_code',
        value: item
      })
    });
    excludedPostalCodes.forEach(item => {
      payload.targetGeo.push({
        is_include: false,
        type: 'postal_code',
        value: item
      })
    });
    includedDma.forEach(item => {
      payload.targetGeo.push({
        is_include: true,
        type: 'dma',
        value: item
      })
    });
    excludedDma.forEach(item => {
      payload.targetGeo.push({
        is_include: false,
        type: 'dma',
        value: item
      })
    });

    payload.goals = [];
    if (dayInclude) {
      payload.goals.push({
        impressions: dayGoalType === "impression" ? Number(dayGoal) : Math.round(Number(dayGoal) / Number(cpm)),
        interval: "day",
        is_budget: dayGoalType === "budget",
        id: dayGoalId
      })
    }
    if (totalInclude) {
      payload.goals.push({
        impressions: totalGoalType === "impression" ? Number(totalGoal) : Math.round(Number(totalGoal) / Number(cpm)),
        interval: "total",
        is_budget: totalGoalType === "budget",
        id: totalGoalId
      })
    }
    if (match.params.id === "new") {
      this.props.createFlight({ payload, callback: this.props.history.goBack });
    }
    else if (match.params.status === "update") {
      // payload.flight.id = id;
      this.props.updateFlight({ payload, callback: this.props.history.goBack });
    }
    else if (match.params.status === "create" && match.params.id !== 'new') {
      // payload.flight.id = id;
      this.props.cloneFlight({ payload, callback: this.props.history.goBack });
    }
  };

  cancelFlight = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  };
  handleDate = (value) => {
    API.getDates(value)
      .then(res => {
        let endTime = moment.unix(res.data.end_time).format("YYYY-MM-DD");
        let startTime = moment.unix(res.data.start_time).format("YYYY-MM-DD");
        localStorage.setItem('endTime', endTime);
        localStorage.setItem('startTime', startTime);
      })
      .catch(err => console.log('Error:', err));
  }

  handleClick = (event) => {
    let arr = [...this.props.activeIndex];
    arr[Number(event.currentTarget.id)] = !arr[Number(event.currentTarget.id)];
    this.props.changeFlight({ prop: 'activeIndex', value: arr });
  };

  render() {
    const { activeUser, spinner } = this.props;

    if (!activeUser || spinner) {
      return (
        <Dimmer active>
          <Loader size="huge" />
        </Dimmer>
      )
    }

    if (!isAllowed('Advertisers', activeUser.user)) {
      return (
        <div className={'sub-content'}>
          <Alert negative size="massive">You are not authorized to view this page</Alert>
        </div>
      )
    }

    const { match, flight_type, fail, message, detailsErrors, typeErrors, displayErrors, videoErrors, goalsErrors, capsErrors, activeIndex } = this.props;

    return (

      <div className="sub-content" style={{ marginTop: '10px' }}>
        <ModalManager currentModal={'ALERT'} update={() => { }} />

        <div>
          <Breadcrumb tag="nav">
            <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={`/ui/advertisers`} className='link-a'>Advertisers</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={`/ui/campaigns`} className='link-a'>Campaigns</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={`/ui/flights`} className='link-a'>Flights</Link></BreadcrumbItem>
            <BreadcrumbItem active tag="span" >{`${match.params.status === "update" ? "Update" : "Create"} Flight`}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Col md={12} lg={12}>
          <Card>
            <CardBody>
              {fail ? <Alert negative>{message}</Alert> : null}
              <Collapse title='Flight Details' open={true} errIcon={detailsErrors.length || typeErrors.length ||goalsErrors.length  ?'icon':null} className='boxed' active={activeIndex[0]}>
                <FlightDetails />
              </Collapse>
              <Collapse title='Targeting' open={true} errIcon={capsErrors.length ? 'icon' : null}  className='boxed' active={activeIndex[6]}>
              <FlightTargetings />
              </Collapse>
             {flight_type=='standard' ?  <Collapse title='Creatives' open={true} errIcon={displayErrors.length || videoErrors.length  ? 'icon' : null} className='boxed' active={activeIndex[2]}>
                {this.renderCreatives()}
              </Collapse>:null}
              <br />
              <Button color="blue" floated='left' onClick={this.handleSubmit}>{match.params.status === "update" ? "Save" : "Finish"}</Button>
              <Button color="blue" floated='left' onClick={this.cancelFlight}>Cancel</Button>
            </CardBody>
          </Card>
        </Col>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { advertiserId,  displaySize, flight_type, campaignId, name, notes, timezone, status, cpm, cpc, isUnmutedOnly, isVisibleOnly, format, channel, playerSize, isVastOnly, clickThroughUrl, clickTracker, impressionTracker, jsTag, platform, rtbPlatform, party, cap, pacing, browser, height, width, iabCategories, listId, listCategory, userAgent, creativeId, fileName, altText, contentType, bitrate, duration, companions, creativeName, creativeNotes, forensiq, dayParting, includedGeo, excludedGeo, dayInclude, dayGoalType, dayGoal, totalInclude, totalGoalType, totalGoal, id, activeIndex, error, success, fail, message, detailsErrors, typeErrors, displayErrors, videoErrors, goalsErrors, capsErrors, videoValid, displayValid, startTime, startDate, endTime, endDate, dayGoalId, totalGoalId, includedCountries, includedProvinces, includedDma, includedCities, includedPostalCodes, excludedCountries, excludedProvinces, excludedDma, excludedCities, excludedPostalCodes, rtbList, maxVideoDuration, dealId, dealCpmFloor, errorDealId, errorDealCpmFloor, isRetargeted, is_skippable } = state.flight;
  const { activeUser } = state.shared;

  return { activeUser,   advertiserId, displaySize , flight_type, campaignId, name, notes, timezone, status, cpm, cpc, isUnmutedOnly, isVisibleOnly, format, channel, playerSize, isVastOnly, clickThroughUrl, clickTracker, impressionTracker, jsTag, platform, rtbPlatform, party, cap, pacing, browser, height, width, iabCategories, listId, listCategory, userAgent, creativeId, fileName, altText, contentType, bitrate, duration, companions, creativeName, creativeNotes, forensiq, dayParting, includedGeo, excludedGeo, dayInclude, dayGoalType, dayGoal, totalInclude, totalGoalType, totalGoal, id, activeIndex, error, success, fail, message, detailsErrors, typeErrors, displayErrors, videoErrors, goalsErrors, capsErrors, videoValid, displayValid, startTime, startDate, endTime, endDate, dayGoalId, totalGoalId, includedCountries, includedProvinces, includedDma, includedCities, includedPostalCodes, excludedCountries, excludedProvinces, excludedDma, excludedCities, excludedPostalCodes, rtbList, maxVideoDuration, dealId, dealCpmFloor, errorDealId, errorDealCpmFloor, isRetargeted, is_skippable };
};

export default withRouter(connect(mapStateToProps, { listOptions, readFlight, resetFlightReducer, resetFlightErrors, changeFlight, createFlight, updateFlight, cloneFlight })(Flight));
