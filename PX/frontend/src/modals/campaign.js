import React, { Component } from 'react';
import Alert from '../components/Alert'
import { Input as InputR, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonToolbar, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { createCampaign, updateCampaign, listCampaignAdvertisers } from '../redux/actions/campaign.actions';
import { modalStateChange, resetModalReducer, resetCampaignErrors } from "../redux/actions/modals.actions";
import { readActiveUser } from '../redux/actions/user.actions';
import moment from 'moment-timezone';
import classNames from 'classnames';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';
// import Select from 'muicss/lib/react/select';
import Option from 'muicss/lib/react/option';
import Divider from 'muicss/lib/react/divider';
import Checkbox from 'muicss/lib/react/checkbox';
import { Select } from "semantic-ui-react";


class Campaign extends Component {

  componentWillMount() {
    this.props.readActiveUser();
  }

  componentDidMount() {
    // listCampaignAdvertisers
    let master = this.props.activeUser.scope_account.is_zone_master;
    this.props.listCampaignAdvertisers(master);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      setTimeout(() => {
        this.close();
      }, 3000);
    }
  }

  close = () => {
    this.props.update();
    this.props.modalStateChange({ prop: 'showCampaign', value: false });
    this.props.resetModalReducer();
  };

  handleChange = (event) => {
    this.props.modalStateChange({ prop: event.target.name, value: event.target.value });
  };

  handleSelect = (event, data) => {
    this.props.modalStateChange({ prop: data.name, value: data.value });
    };

  toggleGoals = (event, data) => {
    this.props.modalStateChange({ prop: event.target.name, value: event.target.checked });
  };

  isInputValid = () => {
    let presentDay = moment(new Date()).format("YYYY/MM/DD");



    this.props.resetCampaignErrors();
    const { name, notes, startDate, endDate, showDayImpressionGoal, showTotalImpressionGoal, dayImpressionGoal, totalImpressionGoal, advertiserId } = this.props;

    let arr = [];
    if (name.length < 6) {
      arr.push('Campaign Name shall contain at least 6 characters.');
      this.props.modalStateChange({ prop: 'errorName', value: true });
    }
    if (name.length > 100) {
      arr.push('Campaign Name shall contain at most 100 characters.');
      this.props.modalStateChange({ prop: 'errorName', value: true });
    }
    if (!(name.length > 100) && !(name.length < 6) && !isNaN(name)) {
      arr.push('Campaign name cannot all be numbers');
      this.props.modalStateChange({ prop: 'errorName', value: true });
    }
    if (notes.length > 500) {
      arr.push('Notes shall contain at most 500 characters.');
      this.props.modalStateChange({ prop: 'errorName', value: true });
    }
    if (!advertiserId) {
      arr.push('Please select an advertiser');
      this.props.modalStateChange({ prop: 'errorAdvertiserId', value: true });
    }
    if (!moment(startDate).isValid() || moment(startDate).isBefore(presentDay)) {
      arr.push('Please enter a valid start date');
      this.props.modalStateChange({ prop: 'errorStartDate', value: true });
    }
    if (!moment(endDate).isValid() || moment(endDate).isBefore(presentDay)) {
      console.log(startDate);
      arr.push('Please enter a valid end date');
      this.props.modalStateChange({ prop: 'errorEndDate', value: true });
    }
    if (!moment(startDate).isBefore(endDate)) {
      arr.push("Start date must be earlier than end date");
      this.setState({ errorStartDate: true, errorEndDate: true });
    }
    if (showDayImpressionGoal) {
      if (isNaN(Number(dayImpressionGoal))) {
        arr.push("Daily impression goal must be a number");
        this.props.modalStateChange({ prop: 'errorDayImpressionGoal', value: true });
      }
      else if (Number(dayImpressionGoal) < 0) {
        arr.push("Daily impression goal must be higher than 0");
        this.props.modalStateChange({ prop: 'errorDayImpressionGoal', value: true });
      }
    }
    if (showTotalImpressionGoal) {
      if (isNaN(Number(totalImpressionGoal))) {
        arr.push("Total impression goal must be a number");
        this.props.modalStateChange({ prop: 'errorTotalImpressionGoal', value: true });
      }
      else if (Number(totalImpressionGoal) < 0) {
        arr.push("Total impression goal must be higher than 0");
        this.props.modalStateChange({ prop: 'errorTotalImpressionGoal', value: true });
      }
    }

    if (arr.length > 0) {
      this.props.modalStateChange({ prop: 'errorList', value: arr });
      return false;
    }
    return true;
  };

  getStartTime = (date, time) => {
    const { timezone } = this.props.activeUser.user;
    if (time === "") {
      time = '00:00';
    }

    switch (timezone) {
      case 'US/Pacific':
        return moment.tz(`${date} ${time}`, 'America/Los_Angeles').unix();
      case 'US/Eastern':
        return moment.tz(`${date} ${time}`, 'America/New_York').unix();
      case 'UTC':
        return moment.tz(`${date} ${time}`, 'UTC').unix();
    }
  };

  getEndTime = (date, time) => {
    const { timezone } = this.props.activeUser.user;
    if (time === "") {
      time = '23:59';
    }

    switch (timezone) {
      case 'US/Pacific':
        return moment.tz(`${date} ${time}`, 'America/Los_Angeles').unix();
      case 'US/Eastern':
        return moment.tz(`${date} ${time}`, 'America/New_York').unix();
      case 'UTC':
        return moment.tz(`${date} ${time}`, 'UTC').unix();
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.isInputValid()) {
      return;
    }

    const { name, advertiserId, notes, startDate, endDate, startTime, endTime, dayImpressionGoal, totalImpressionGoal, showDayImpressionGoal, showTotalImpressionGoal, modalStatus, id } = this.props;

    const payload = {
      name,
      advertiserId: Number(advertiserId),
      notes,
      startTime: this.getStartTime(startDate, startTime),
      endTime: this.getEndTime(endDate, endTime),
      dayImpressionGoal: showDayImpressionGoal ? Number(dayImpressionGoal) : 0,
      totalImpressionGoal: showTotalImpressionGoal ? Number(totalImpressionGoal) : 0,
      status:'active'
    };

    if (modalStatus === "create") {
      this.props.createCampaign(payload);
    }
    else if (modalStatus === "edit") {
      payload.id = id;
      this.props.updateCampaign(payload);
    }

  };

  render() {
    const { showCampaign, error, errorMessage, success, successMessage, name, errorName, notes, errorNotes, advertiserId, errorAdvertiserId, startDate, errorStartDate, endDate, errorEndDate, startTime, endTime, showDayImpressionGoal, showTotalImpressionGoal, dayImpressionGoal, totalImpressionGoal, errorDayImpressionGoal, errorTotalImpressionGoal, modalStatus, advertisers, errorList, errorStartTime, errorEndTime } = this.props;
    if (error) {
      return (
        <Modal isOpen={showCampaign} toggle={this.toggle} >
          <ModalHeader toggle={this.toggle}>Error!</ModalHeader>
          <ModalBody>
            <Alert color='danger' className='alert--neutral' icon>
              {errorMessage}
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.close}>Close</Button>
          </ModalFooter>
        </Modal>
      )
    }

    if (success) {
      return (
        <Modal isOpen={showCampaign} toggle={this.toggle} >
          <ModalHeader>Success</ModalHeader>
          <ModalBody>
            <Alert color='success' className='alert--neutral' icon>
              {successMessage}
            </Alert>
          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </Modal>
      )
    }

    return (
      <Modal isOpen={showCampaign} toggle={this.toggle} className='modal-lg' >
        <ModalHeader toggle={this.toggle}>{modalStatus === 'edit' ? 'Edit Campaign' : 'Create Campaign'}</ModalHeader>
        <ModalBody style={{ paddingTop: '0' }}>
          <Card>
            <CardBody>
              <Form>
                <Input label="Campaign Name" floatingLabel={true} value={name} name="name" onChange={this.handleChange} className={classNames({ 'floatinginp': name }, { 'errorinp': errorName })} />
               <label className={classNames('bwa-floating-label2', { 'bwa-floated': 1 })} >Advertiser Name</label>
                <Select search name="input" style={{border:'none'}} fluid options={advertisers}  placeholder="Advertiser Name" value={advertiserId} name="advertiserId" onChange={this.handleSelect} error={errorAdvertiserId}/>
                <hr/>
                <Textarea label="Notes" floatingLabel={true} name="notes" value={notes} onChange={this.handleChange} className={classNames({ 'floatinginp': notes })} className={classNames({ 'floatinginp': notes }, { 'errorinp': errorNotes })} />
              </Form>
              <Row>
                <Col className={classNames({ 'errorinp': errorStartDate })}>
                  <span style={{ marginLeft: '10px'}} className='link-a' >Start Date <InputR type='date' style={{ width: '100%', border: 'none' }} name="startDate" value={startDate} onChange={this.handleChange} className={classNames({ 'errorinp': errorStartDate })} /></span>
                </Col>
                <Col className={classNames({ 'errorinp': errorStartTime })}>
                  <span style={{ marginLeft: '10px'}} className='link-a'>Start Time   <InputR type='time' style={{ width: '100%', border: 'none' }} name="startTime" value={startTime} onChange={this.handleChange}  /></span>
                </Col>
                <Col className={classNames({ 'errorinp': errorEndDate })}>
                  <span style={{ marginLeft: '10px' }} className='link-a'>End Date <InputR type='date' style={{ width: '100%', border: 'none' }} name="endDate" value={endDate} onChange={this.handleChange}  /></span>
                </Col>
                <Col className={classNames({ 'errorinp': errorEndTime })}>
                  <span style={{ marginLeft: '10px'}} className='link-a'> End Time<InputR type='time' name="endTime" value={endTime?endTime:'23:59'} onChange={this.handleChange} style={{ width: '100%', border: 'none' }}  /></span>
                </Col>
              </Row>
              <Divider />
              <Form inline={true}>
                <Checkbox label="&nbsp; &nbsp; &nbsp;Daily Impressions" onClick={this.toggleGoals} name="showDayImpressionGoal" checked={showDayImpressionGoal} style={{ margin: "10px" }} />
                {showDayImpressionGoal ? <Input label="Impressions" name="dayImpressionGoal" value={dayImpressionGoal} onChange={this.handleChange} floatingLabel={true} className={classNames({ 'floatinginp': dayImpressionGoal }, { 'errorinp': errorDayImpressionGoal })} /> : null}
              </Form>

              <Form inline={true}>
                <Checkbox label="&nbsp; &nbsp; &nbsp;Total Impressions" onClick={this.toggleGoals} name="showTotalImpressionGoal" checked={showTotalImpressionGoal} style={{ margin: "10px" }} />
                {showTotalImpressionGoal ? <Input label="Impressions" name="totalImpressionGoal" value={totalImpressionGoal} onChange={this.handleChange} floatingLabel={true} className={classNames({ 'floatinginp': totalImpressionGoal }, { 'errorinp': errorTotalImpressionGoal })} /> : null}
              </Form>

              {errorList.length ? errorList.map((val, index) => {
                return <Alert key={index} color='danger'> {val} </Alert>
              })
              :null}

            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <ButtonToolbar className='form__button-toolbar'>
            <Button color='primary' onClick={this.handleSubmit} >Submit</Button>
            <Button type='button' onClick={this.close}> Cancel </Button>
          </ButtonToolbar>
        </ModalFooter>
      </Modal>
    )
  }
}

const widthStyle = {
  width: "100% !important"
};

const mapStateToProps = state => {
  const { showCampaign, error, errorMessage, success, successMessage, name, errorName, notes, errorNotes, advertiserId, errorAdvertiserId, startDate, errorStartDate, endDate, errorEndDate, showDayImpressionGoal, showTotalImpressionGoal, dayImpressionGoal, totalImpressionGoal, errorDayImpressionGoal, errorTotalImpressionGoal, modalStatus, advertisers, errorList, startTime, endTime, errorStartTime, errorEndTime, id } = state.modal;
  const { activeUser } = state.shared;

  return { showCampaign, error, errorMessage, success, successMessage, name, errorName, notes, errorNotes, advertiserId, errorAdvertiserId, startDate, errorStartDate, endDate, errorEndDate, showDayImpressionGoal, showTotalImpressionGoal, dayImpressionGoal, totalImpressionGoal, errorDayImpressionGoal, errorTotalImpressionGoal, modalStatus, advertisers, errorList, startTime, endTime, errorStartTime, errorEndTime, activeUser, id };
};

export default connect(mapStateToProps, { readActiveUser, listCampaignAdvertisers, createCampaign, updateCampaign, modalStateChange, resetModalReducer, resetCampaignErrors })(Campaign);
