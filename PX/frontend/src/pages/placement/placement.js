import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { Breadcrumb, BreadcrumbItem, Alert, Card, CardBody, Col } from 'reactstrap';
import Collapse from '../../components/Collapse';
import { connect } from 'react-redux';
import { changePlacement, readOpportunityCount, listPlacementPublishers, readPlacement, resetPlacementReducer, resetPlacementErrors, createPlacement, updatePlacement } from '../../redux/actions/placement.actions';
import moment from 'moment';
import { isAllowed } from '../../functions';
import { Link } from 'react-router-dom';
import PlacementDetails from './placement.details';
import PlacementPricing from './placement.pricing';
import PlacementType from './placement.type';
import PlacementCompliance from './placement.compliance';
import PlacementGeo from './placement.geo';
import PlacementCaps from './placement.caps';
import PlacementPassback from './placement.passback';
import withRouter from "react-router-dom/es/withRouter";

class Placement extends Component {
  constructor(props) {

    super(props)
    this.state = {
      intervalId: ''
    }
  }
  //
  componentWillMount() {
    const { match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    this.props.listPlacementPublishers(master);
    if (match.params.id && !isNaN(Number(match.params.id)) && Number(match.params.id) > 0) {
      this.props.readPlacement(Number(match.params.id));
      this.handleOppCount();
      // let intervalId = setInterval(this.handleOppCount, (1000 * 20));
      // this.setState({ intervalId: intervalId })
    }
  }
  //home

  componentWillUnmount() {
    this.props.resetPlacementReducer();
    clearInterval(this.state.intervalId)
  }

  clearPlacement = () => {
    this.props.resetPlacementReducer();
  };

  closePlacement = (event) => {
    event.preventDefault();
    this.clearPlacement();
    this.props.history.goBack();
  };
  is_url = (str) => {
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
      return true;
    }
    else {
      return false;
    }
  }

  handleOppCount = () => {
    const { match } = this.props;
    this.props.readOpportunityCount(Number(match.params.id));
  }

  isInputValid = () => {
    let presentDay = moment(new Date()).format("YYYY-MM-DD");
    this.props.resetPlacementErrors();
    let errorsFound = false;

    const { name, notes, passbackUrl, publisherId, cpm, cpc, bwaCPM, pricingModel, revShare, channel, format, maxVideoDuration, appStoreUrl, displaySize, height, width, playerSize, capped, showDayCapping, showTotalCapping, dayCapping, totalCapping, capStart, capEnd, isPilotPlayer, volume, playerType, iabCategory } = this.props;

    let arr = [];
    if (name.length < 6) {
      arr.push('Placement name shall contain at least 6 characters.');
      this.props.changePlacement({ prop: 'errorName', value: true });
      // return
    }
    if (name.length > 100) {
      arr.push('Placement name shall contain at most 100 characters.');
      this.props.changePlacement({ prop: 'errorName', value: true });
    }
    if (!(name.length > 100) && !(name.length < 6) && !isNaN(name)) {
      arr.push('Placement name cannot all be numbers');
      this.props.changePlacement({ prop: 'errorName', value: true });
    }



    if (notes.length > 500) {
      arr.push('Placements notes shall contain at most 500 characters.');
      this.props.changePlacement({ prop: 'errorNotes', value: true });
    }

    if (iabCategory.length < 1) {
      arr.push('Please, select atleast one IAB Category.');
      this.props.changePlacement({ prop: 'errorIabCategory', value: true });
    }

    if (!publisherId) {
      arr.push('Please select a publisher');
      this.props.changePlacement({ prop: 'errorPublisherId', value: true });
    }

    if (arr.length) {
      this.props.changePlacement({ prop: 'detailsErrors', value: arr });
    }
    if (arr.length > 0) {
      return
    }

    arr = [];
    if (pricingModel === '') {
      arr.push('Please select a pricing model');
      this.props.changePlacement({ prop: 'errorPricingModel', value: true });
    }
    else if (pricingModel === 'cpm') {
      if (isNaN(Number(cpm))) {
        arr.push('CPM shall be a number');
        this.props.changePlacement({ prop: 'errorCPM', value: true });
      }

      if (!isNaN(Number(cpm)) && Number(cpm <= 0)) {
        arr.push('CPM shall be greater than 0');
        this.props.changePlacement({ prop: 'errorCPM', value: true });
      }
      if (isNaN(Number(bwaCPM))) {
        arr.push('BWA CPM shall be a number');
        this.props.changePlacement({ prop: 'errorBWACPM', value: true });
      }
      if (!isNaN(Number(bwaCPM)) && Number(bwaCPM) < 1) {
        arr.push('BWA CPM shall be greater than 0');
        this.props.changePlacement({ prop: 'errorBWACPM', value: true });
      }
    }
    else if (pricingModel === 'cpc') {
      if (isNaN(Number(cpc))) {
        arr.push('CPC shall be a number');
        this.props.changePlacement({ prop: 'errorCPC', value: true });
      }

      if (!isNaN(Number(cpc)) && Number(cpc) < 0) {
        arr.push('CPC shall be greater than 0');
        this.props.changePlacement({ prop: 'errorCPC', value: true });
      }
    }
    else if (pricingModel === 'revshare') {
      if (isNaN(Number(revShare)) || Math.floor(Number(revShare)) !== Number(revShare)) {
        arr.push('Rev share percentage shall be a whole number');
        this.props.changePlacement({ prop: 'errorRevShare', value: true });
      }
      if (!isNaN(Number(revShare)) && (Number(revShare) < 0 || Number(revShare) > 100)) {
        arr.push('Rev share shall be percentage between 0 and 100');
        this.props.changePlacement({ prop: 'errorRevShare', value: true });
      }
    }
    if (arr.length) {
      this.props.changePlacement({ prop: 'pricingErrors', value: arr });
      errorsFound = true;
    }

    arr = [];
    if (channel === "") {
      arr.push('Please select a channel');
      this.props.changePlacement({ prop: 'errorChannel', value: true });
    }

    if (appStoreUrl !== '') {
      if (!this.is_url(appStoreUrl)) {
        arr.push('Invalid App Store URL.');
        this.props.changePlacement({ prop: 'errorAppStoreUrl', value: true });
      }

    }

    if (format === "") {
      arr.push('Please select a format');
      this.props.changePlacement({ prop: 'errorFormat', value: true });
    }
    if (format === "display" || isPilotPlayer) {
      if (displaySize === "") {
        arr.push('Please select a display size');
        this.props.changePlacement({ prop: 'errorDisplaySize', value: true });
      }
      else if (displaySize === "custom") {
        if (isNaN(width) || (!isNaN(Number(width)) && Number(width) <= 0)) {
          arr.push('Placement width shall be a number higher than 0');
          this.props.changePlacement({ prop: 'errorWidth', value: true });
        }
        if (isNaN(height) || (!isNaN(Number(height)) && Number(height) <= 0)) {
          arr.push('Placement height shall be a number higher than 0');
          this.props.changePlacement({ prop: 'errorHeight', value: true });
        }
      }
    }
    if (isPilotPlayer) {
      if (!playerType) {
        arr.push('Select a player type');
        this.props.changePlacement({ prop: 'errorPlayerType', value: true });
      }
    }
    // errorPlayerType

    if (format === "video") {
      if (playerSize === "" || !playerSize.length) {
        arr.push('Please select a player size');
        this.props.changePlacement({ prop: 'errorPlayerSize', value: true });
      }
      if (!maxVideoDuration) {
        arr.push('Please select maximum video duration');
        this.props.changePlacement({ prop: 'errorMaxVideoDuration', value: true });
      }
    }

    if (arr.length) {
      this.props.changePlacement({ prop: 'typeErrors', value: arr });
      errorsFound = true;
    }

    arr = [];
    if (capped === "") {
      arr.push('Please select opportunity caps');
      this.props.changePlacement({ prop: 'errorCapped', value: true });
    }
    else if (capped === "capped") {
      if (!showTotalCapping && !showDayCapping) {
        arr.push('Please select at least one opportunity capping option');
      }
      if (showDayCapping && (dayCapping === "" || isNaN(Number(dayCapping)) || Number(dayCapping) <= 0)) {
        arr.push('Day opportunity capping shall be a number greater than 0');
        this.props.changePlacement({ prop: 'errorDayCapping', value: true });
      }
      if (showTotalCapping && (totalCapping === "" || isNaN(Number(totalCapping)) || Number(totalCapping) <= 0)) {
        arr.push('Total opportunity capping shall be a number greater than 0');
        this.props.changePlacement({ prop: 'errorTotalCapping', value: true });
      }
      if (capStart || capEnd) {
        if (!moment(capStart).isValid() || moment(capStart).isBefore(presentDay)) {
          arr.push('Please enter a valid capping start date');
          this.props.changePlacement({ prop: 'errorCapStart', value: true });
        }

        if (!moment(capStart).isBefore(capEnd)) {
          arr.push("Start date must be earlier than end date");
          this.props.changePlacement({ prop: 'errorCapEnd', value: true });
        }


        if (!moment(capEnd).isValid() || moment(capEnd).isBefore(presentDay)) {
          arr.push('Please enter a valid capping end date');
          this.props.changePlacement({ prop: 'errorCapEnd', value: true });
        }
      }
    }
    if (arr.length) {
      this.props.changePlacement({ prop: 'capsErrors', value: arr });
      errorsFound = true;
    }

    return !errorsFound;
  };

  handleClick = index => {
    const { activeIndex } = this.props;
    let arr = [...activeIndex];
    arr[index] = !arr[index];
    this.props.changePlacement({ prop: 'activeIndex', value: arr });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.isInputValid()) {
      return;
    }

    const { name, status, notes, cpm, bwaCPM, cpc, format, maxVideoDuration, defaultDomain, defaultAppName, defaultBundleId, defaultCtvChannel, appStoreUrl, passbackUrl, channel, optimizer, revShare, publisherId, displaySize, width, height, playerSize, isVastOnly, isPilotPlayer, volume, playerType, forensiq, listCategory, listId, capped, dayCapping, totalCapping, capStart, capEnd, demandList, pricingModel, showDayCapping, showTotalCapping, dayCapId, totalCapId, id, match, history, includedCountries, includedProvinces, includedDma, includedCities, includedPostalCodes, excludedCountries, excludedProvinces, excludedDma, excludedCities, excludedPostalCodes, iabCategory } = this.props;

    const payload = {
      name,
      status,
      notes,
      format,
      maxVideoDuration,
      defaultDomain,
      defaultAppName,
      defaultBundleId,
      defaultCtvChannel,
      appStoreUrl,
      passbackUrl,
      channel,
      optimizer,
      isVastOnly,
      isPilotPlayer,
      volume,
      playerType,
      publisherId,
      demandList,
      listCategory,
      listId,
      pricingModel,
      iabCategory
    };

    if (pricingModel === 'cpm') {
      payload.cpm = Math.round(Number(cpm) * 100);
      payload.bwaCPM = Math.round(Number(bwaCPM) * 100);
      payload.cpc = 0;
      payload.revShare = 0;
      payload.isRevshare = false;
    }
    else if (pricingModel === 'cpc') {
      payload.cpc = Math.round(Number(cpc) * 100);
      payload.cpm = 0;
      payload.bwaCPM = 0;
      payload.isRevshare = false;
      payload.revShare = 0;
    }
    else if (pricingModel === 'revshare') {
      payload.isRevshare = true;
      payload.revShare = Number(revShare);
      payload.cpm = 0;
      payload.bwaCPM = 0;
      payload.cpc = 0;
    }


    if (channel === "mobile_app" || channel === "ctv") {
      payload.defaultDomain = '';
    }
    if (channel === "mobile_web" || channel === "desktop") {
      payload.defaultAppName = '';
      payload.defaultBundleId = '';
      payload.defaultCtvChannel = '';
    }

    if (format === "display") {
      if (displaySize !== "custom") {
        const size = displaySize.split('x');
        payload.width = Number(size[0]);
        payload.height = Number(size[1]);
      }
      else {
        payload.width = Number(width);
        payload.height = Number(height);
      }
      payload.playerSize = 'n/a';
    }


    if (isPilotPlayer) {
      if (displaySize !== "custom") {
        const size = displaySize.split('x');
        payload.width = Number(size[0]);
        payload.height = Number(size[1]);
      }
      else {
        payload.width = Number(width);
        payload.height = Number(height);
      }
      payload.playerSize = playerSize;
    }



    else if (format === "video" && !isPilotPlayer) {
      payload.playerSize = playerSize;
      payload.height = 0;
      payload.width = 0;
    }

    payload.brandSafety = [];
    payload.brandSafety.push({
      name: 'whiteops',
      isActive: forensiq
    });

    payload.caps = [];
    if (capped === "capped") {
      if (showDayCapping) {
        payload.caps.push({
          id: dayCapId,
          opportunities: Number(dayCapping),
          interval: "day",
          startTime: capStart,
          endTime: capEnd
        })
      }
      if (showTotalCapping) {
        payload.caps.push({
          id: totalCapId,
          opportunities: Number(totalCapping),
          interval: "total",
          startTime: capStart,
          endTime: capEnd
        })
      }
    }

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
    if (match.params.status === 'create') {
      this.props.createPlacement({ payload, callback: history.goBack });
    }
    else if (match.params.status === 'update') {
      payload.id = id;
      this.props.updatePlacement({ payload, callback: history.goBack });
    }
  };

  render() {
    const { activeUser } = this.props;

    if (!activeUser) {
      return (
        <div></div>
      )
    }

    if (!isAllowed('Publishers', activeUser.user)) {
      return (
        <div className={'sub-content'}>
          <Alert color="danger">You are not authorized to view this page</Alert>
        </div>
      )
    }

    const { match, activeIndex, detailsErrors, pricingErrors, typeErrors, capsErrors } = this.props;
    return (
      <div className="sub-content" style={{ marginTop: '10px' }}>
        <div>
          <Breadcrumb tag="nav">
            <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={`/ui/publishers`} className='link-a'>Publishers</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={`/ui/placements`} className='link-a'>Placements</Link></BreadcrumbItem>
            <BreadcrumbItem active tag="span" >{`${match.params.status === "update" ? "Update" : "Create"} Placement`}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Col md={12} lg={12}>
          <Card>
            <CardBody>
              <Collapse title='Placement Details' open={true} errIcon={detailsErrors.length ? 'icon' : null} className='shadow' active={activeIndex[0]}>
                <PlacementDetails />
              </Collapse>
              <Collapse title='Placement Pricing' open={true} errIcon={pricingErrors.length ? 'icon' : null} className='shadow' active={activeIndex[1]}>
                <PlacementPricing />
              </Collapse>
              <Collapse title='Placement Type' open={true} errIcon={typeErrors.length ? 'icon' : null} className='shadow' active={activeIndex[2]}>
                 <PlacementType />
              </Collapse>
              <Collapse title='Compliance' open={true} className='shadow' active={activeIndex[3]}>
                 <PlacementCompliance />
              </Collapse>
              <Collapse title='Geo Targeting' open={true} className='shadow' active={activeIndex[4]}>
                <PlacementGeo />
              </Collapse>
              <Collapse title='Publisher Opportunity Caps' open={true} errIcon={capsErrors.length ? 'icon' : null} className='shadow' active={activeIndex[5]}>
               <PlacementCaps />
              </Collapse>
              <Collapse title='Passback URL' open={true} errIcon={typeErrors.length ? 'icon' : null} className='shadow' active={activeIndex[6]}>
                <PlacementPassback />
              </Collapse>
              <br />
              <Button floated='right' color='blue' onClick={this.closePlacement}>Close</Button>
              <Button floated='right' color='blue' onClick={this.clearPlacement}>Clear</Button>
              <Button floated='right' color='blue' onClick={this.handleSubmit}>Save</Button>
            </CardBody>
          </Card>
        </Col>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { opportunityCount, status, detailsErrors, pricingErrors, typeErrors, capsErrors, name, passbackUrl, notes, cpm, bwaCPM, cpc, format, maxVideoDuration, errorMaxVideoDuration, appStoreUrl, channel, optimizer, revShare, publisherId, displaySize, width, height, playerSize, isVastOnly, isPilotPlayer, forensiq, listCategory, listId, excludedGeoTarget, includedGeoTarget, capped, dayCapping, totalCapping, capStart, capEnd, demandList, pricingModel, showDayCapping, showTotalCapping, dayCapId, totalCapId, activeIndex, id, includedCountries, includedProvinces, includedDma, includedCities, includedPostalCodes, excludedCountries, excludedProvinces, excludedDma, excludedCities, excludedPostalCodes, volume, playerType, iabCategory, defaultDomain, defaultAppName, defaultBundleId, defaultCtvChannel } = state.placement;
  const { activeUser } = state.shared;

  return { opportunityCount, status, detailsErrors, pricingErrors, typeErrors, capsErrors, name, passbackUrl, notes, cpm, bwaCPM, cpc, format, maxVideoDuration, errorMaxVideoDuration, appStoreUrl, channel, optimizer, revShare, publisherId, displaySize, width, height, playerSize, isVastOnly, isPilotPlayer, forensiq, listCategory, listId, excludedGeoTarget, includedGeoTarget, capped, dayCapping, totalCapping, capStart, capEnd, demandList, pricingModel, showDayCapping, showTotalCapping, dayCapId, totalCapId, activeIndex, id, activeUser, includedCountries, includedProvinces, includedDma, includedCities, includedPostalCodes, excludedCountries, excludedProvinces, excludedDma, excludedCities, excludedPostalCodes, volume, playerType, iabCategory, defaultDomain, defaultAppName, defaultBundleId, defaultCtvChannel };
};

export default withRouter(connect(mapStateToProps, { readOpportunityCount, changePlacement, listPlacementPublishers, readPlacement, resetPlacementReducer, resetPlacementErrors, createPlacement, updatePlacement })(Placement));
