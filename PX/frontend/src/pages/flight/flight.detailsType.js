import React, { Component } from 'react';
import { Select, Input, Checkbox } from 'semantic-ui-react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { changeFlight } from '../../redux/actions/flight.actions';
import { listIntegrationsDropdown } from '../../redux/actions/integration.actions';

class FlightType extends Component {
  state ={
    creativeType: [
      { text: "First Party", value: "first_party", disabled: this.props.iFlight },
      { text: "Third Party", value: "third_party", disabled: this.props.iFlight },
      { text: "RTB", value: "rtb" }]
  }
  componentWillMount() {
    this.props.listIntegrationsDropdown();
  }


  addDecimals = (event) => {
    this.props.changeFlight({ prop: event.target.name, value: Number(event.target.value).toFixed(2) });
  };

  handleSelect = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: data.value });
  };

  handleCheckbox = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: !data.checked });
    if (data.name === "isVastOnly" && !data.checked) {
      this.props.changeFlight({ prop: 'isUnmutedOnly', value: false });
      this.props.changeFlight({ prop: 'isVisibleOnly', value: false });
    }
  };
  handleChange = (event) => {
    this.props.changeFlight({ prop: event.target.name, value: event.target.value });
  };

  render() {
    const {dspList, errorCPM, cpm, party, errorParty, rtbPlatform, errorRTBPlatform, channel, flight_type, errorChannel, format, errorFormat, playerSize, errorPlayerSize, isVastOnly, activeUser, isVisibleOnly, isUnmutedOnly, typeErrors, errorMaxVideoDuration, maxVideoDuration, dealId, dealCpmFloor, errorDealId, errorDealCpmFloor } = this.props;

    return (
        <div>
       {flight_type =='standard'  ? <div className='form__inside' >
            <div className='float-container'>
            {cpm ? <label className={classNames('bwa-floating-label', { 'bwa-floated': cpm })} >Flight CPM</label> : <label> </label>}
            <Input fluid placeholder="Flight CPM" type="text" name="cpm" value={cpm} onChange={this.handleChange} onBlur={this.addDecimals} error={errorCPM} />
          </div>
          </div> : flight_type === "deal_id" ?
 <div className='form__inside' >
            <div className='float-container'>
            {cpm ? <label className={classNames('bwa-floating-label', { 'bwa-floated': cpm })} >Deal CPM Floor (Fixed) </label> : <label> </label>}
            <Input fluid placeholder="Deal CPM Floor (Fixed) " type="text" name="dealCpmFloor" value={dealCpmFloor} onChange={this.handleChange} onBlur={this.addDecimals} error={errorDealCpmFloor} />
          </div>
          </div> 

: null}
        {flight_type === "deal_id" ? <div className='form__inside' >
            <div className='float-container'>
            {dealId ? <label className={classNames('bwa-floating-label', { 'bwa-floated': dealId })}>Deal ID</label> : <label> </label>}
            <Input fluid placeholder="Deal ID" type="text" name="dealId" value={dealId} onChange={this.handleChange} error={errorDealId} />
          </div>
        </div>:null}

          {flight_type === "deal_id" || flight_type === "rtb"  ? <div className='form__inside' >
               <div className='float-container'>
                {rtbPlatform ? <label className={classNames('bwa-select-label', { 'bwa-floated': rtbPlatform })} >{flight_type === "deal_id"? 'DEAL ID BUYER':'RTB BUYER'}</label> : <label> </label>}
                <Select placeholder={flight_type === "deal_id"? 'DEAL ID BUYER':'RTB BUYER'} value={rtbPlatform ? rtbPlatform : ''} selection search fluid name="rtbPlatform" options={dspList} onChange={this.handleSelect} error={errorRTBPlatform} />
              </div>
            </div> : null}
         </div>

    )
  }
}

const checkboxStyle = {
  marginBottom: "10px"
};

export const mapStateToProps = state => {
  const {dspList, party, errorCPM, cpm, errorParty, rtbPlatform, errorRTBPlatform, flight_type, channel, errorChannel, format, errorFormat, playerSize, errorPlayerSize, isVastOnly, isVisibleOnly, isUnmutedOnly, typeErrors, maxVideoDuration, errorMaxVideoDuration, dealId, dealCpmFloor, errorDealId, errorDealCpmFloor } = state.flight;
  const { activeUser } = state.shared;

  return { dspList, party, errorCPM, cpm, errorParty, rtbPlatform, errorRTBPlatform, channel, flight_type, errorChannel, format, errorFormat, playerSize, errorPlayerSize, isVastOnly, activeUser, isVisibleOnly, isUnmutedOnly, typeErrors, maxVideoDuration, errorMaxVideoDuration, dealId, dealCpmFloor, errorDealId, errorDealCpmFloor };
};

export default connect(mapStateToProps, { changeFlight, listIntegrationsDropdown })(FlightType);
