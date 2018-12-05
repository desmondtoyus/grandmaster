import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, Input, Checkbox } from 'semantic-ui-react';
import { changePlacement } from "../../redux/actions/placement.actions";
import classNames from 'classnames';

const caps = [
  { text: "Uncapped", value: "uncapped" },
  { text: "Capped", value: "capped" }
];

class PlacementCaps extends Component {
  handleSelect = (event, data) => {
    this.props.changePlacement({ prop: data.name, value: data.value });
  };

  handleChange = event => {
    this.props.changePlacement({ prop: event.target.name, value: event.target.value });
  };

  toggleCaps = (event, data) => {
    this.props.changePlacement({ prop: data.name, value: !data.checked });
  };


  render() {
    const { opportunityCount, capped, errorCapped, showDayCapping, dayCapping, errorDayCapping, showTotalCapping, totalCapping, errorTotalCapping, capStart, errorCapStart, capEnd, errorCapEnd} = this.props;
    return (
      <form className='form'>
        <div className='form__half'>
          <div className='form__inside' >

             <div className='float-container'>
              {capped ? <label className={classNames('bwa-select-label', { 'bwa-floated': capped })} >Opportunity Caps</label> : <label> </label>}
              <Select placeholder="Opportunity Caps" value={capped ? capped : ''} selection search fluid name="capped" options={caps} onChange={this.handleSelect} error={errorCapped} />
            </div>
          </div>

          {window.location.href.includes('placement/update') && <div className='form__inside' >
             <div className='float-container'>
              <label className={classNames('bwa-floating-label', { 'bwa-floated': 1 })} >Current Opportunity Count</label>
              <Input fluid readOnly type="text" name="opportunityCount" value={opportunityCount} />
            </div>
          </div>}

          {capped === "capped" ? <div>
            <div className='form__inside_flex' >
              <div className='form__four' >
                <div style={{ marginTop: '20px' }}>
                  <Checkbox label="Daily Capping" onClick={this.toggleCaps} name="showDayCapping" checked={showDayCapping} />
                </div>
              </div>

              <div className='form__four' >
                <div >
                  {dayCapping ? <label style={{ marginTop: '0' }} className={classNames('bwa-floating-label', { 'bwa-floated': dayCapping })} >Opportunities</label> : <div style={{ marginTop: '20px' }}></div>}
                  <Input disabled={!showDayCapping} fluid placeholder="Opportunities" type="text" name="dayCapping" value={dayCapping} onChange={this.handleChange} error={errorDayCapping} />
                </div>
              </div>
              <div className='form__four' >
                <div style={{ marginTop: '20px' }}>
                  <Checkbox label="Total Capping" onClick={this.toggleCaps} name="showTotalCapping" checked={showTotalCapping} />
                </div>
              </div>
              <div className='form__four' >
                <div >
                  {totalCapping ? <label style={{ marginTop: '0' }} className={classNames('bwa-floating-label', { 'bwa-floated': totalCapping })} >Opportunities</label> : <div style={{ marginTop: '20px' }}></div>}
                  <Input disabled={!showTotalCapping} type="text" placeholder="Opportunities" name="totalCapping" value={totalCapping} onChange={this.handleChange} error={errorTotalCapping} />
                </div>
              </div>
            </div>
          </div> : null}
          {capped === "capped" ? <div>
            <div className='form__inside_full' >
              <br />
              <h5><b>Capping date range (optional)</b></h5>
              <p>If dates are selected placement will be live during the date range period only.</p>
            </div>
            <div className='form__inside_flex' >
              <div className='form__half' >
                 <div className='float-container'>
                  <label className='bwa-floating-label bwa-floated'>Start Date</label>
                  <Input fluid type="date" placeholder="mm/dd/yyyy" name="capStart" value={capStart} onChange={this.handleChange} error={errorCapStart} />
                </div>
              </div>

              <div className='form__half' >
                 <div className='float-container'>
                  <label className='bwa-floating-label bwa-floated'>End Date</label>
                  <Input fluid type="date" placeholder="mm/dd/yyyy" label="to" name="capEnd" value={capEnd} onChange={this.handleChange} error={errorCapEnd} />
                </div>
              </div>
            </div>
          </div> : null}
        </div>
      </form>
    )
  }
}

const mapStateToProps = state => {
  const { capped, opportunityCount, errorCapped, showDayCapping, dayCapping, errorDayCapping, showTotalCapping, totalCapping, errorTotalCapping, capStart, errorCapStart, capEnd, errorCapEnd, capsErrors } = state.placement;

  return { capped, opportunityCount, errorCapped, showDayCapping, dayCapping, errorDayCapping, showTotalCapping, totalCapping, errorTotalCapping, capStart, errorCapStart, capEnd, errorCapEnd, capsErrors };
};

export default connect(mapStateToProps, { changePlacement })(PlacementCaps);