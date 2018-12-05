import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, Input} from 'semantic-ui-react';
import { Alert } from 'reactstrap';
import { ROLE_SUPERADMIN, ROLE_OPSADMIN } from "../../roles";
import { changePlacement } from "../../redux/actions/placement.actions";
import classNames from 'classnames';

const pricingModels = [
  { text: 'CPM', value: 'cpm' },
  { text: 'CPC', value: 'cpc' },
  { text: 'Rev Share', value: 'revshare' }
];

class PlacementPricing extends Component {
  handleChange = event => {
    this.props.changePlacement({ prop: event.target.name, value: event.target.value });
  };

  handleSelect = (event, data) => {
    this.props.changePlacement({ prop: data.name, value: data.value });
  };

  addDecimals = (event) => {
    this.props.changePlacement({ prop: event.target.name, value: Number(event.target.value).toFixed(2) });
  };

  render() {
    const { pricingModel, errorPricingModel, cpm, errorCPM, cpc, errorCPC, bwaCPM, revShare, errorRevShare, errorBWACPM, activeUser, pricingErrors } = this.props;

    return (
      <form className='form'>
        <div className='form__half'>
          <div className='form__inside' >
             <div className='float-container'>
              {pricingModel ? <label className={classNames('bwa-select-label', { 'bwa-floated': pricingModel })} >Pricing Model</label> : <label> </label>}
              <Select placeholder="Pricing Model" value={pricingModel ? pricingModel : ''} fluid name="pricingModel" id="pricingModel" options={pricingModels} onChange={this.handleSelect} error={errorPricingModel} />
            </div>
          </div>
          {pricingModel === "cpm" ?   <div className='form__inside' >
             <div className='float-container'>
              {cpm ? <label className={classNames('bwa-floating-label', { 'bwa-floated': cpm })} >CPM</label> : <label> </label>}
              <Input fluid placeholder="CPM" type="text" name="cpm" value={cpm} onChange={this.handleChange} onBlur={this.addDecimals}  error={errorCPM} />
            </div>
          </div>:null}

          {pricingModel === "cpc" ? <div className='form__inside' >
             <div className='float-container'>
              {cpc ? <label className={classNames('bwa-floating-label', { 'bwa-floated': cpc })} >CPC</label> : <label> </label>}
              <Input fluid placeholder="CPC" type="text" name="cpc" value={cpc} onChange={this.handleChange} onBlur={this.addDecimals} error={errorCPC} />
            </div>
          </div> : null}

          {pricingModel === "cpm" && (activeUser.user.role & ROLE_SUPERADMIN || activeUser.user.role & ROLE_OPSADMIN) ?  <div className='form__inside' >
             <div className='float-container'>
              {bwaCPM ? <label className={classNames('bwa-floating-label', { 'bwa-floated': bwaCPM })} >CPM Floor</label> : <label> </label>}
              <Input fluid placeholder="CPM Floor" type="text" name="bwaCPM" value={bwaCPM} onChange={this.handleChange} onBlur={this.addDecimals} error={errorBWACPM} />
            </div>
          </div> : null}

          {pricingModel === "revshare" ? <div className='form__inside' >
             <div className='float-container'>
              {revShare ? <label className={classNames('bwa-floating-label', { 'bwa-floated': cpc })} >CPC</label> : <label> </label>}
              <Input fluid placeholder="CPC" type="text" name="revShare" value={revShare} onChange={this.handleChange} onBlur={this.addDecimals} error={errorRevShare} /> <label>%</label>
            </div>
          </div> : null}

        </div>
        <div className='form__half'>
          {pricingErrors.length ? <h5> There are some errors with your submission</h5> : null}
          {pricingErrors.length ? (pricingErrors.map((err, index) => {
            return <Alert key={index} color='danger'> {err}</Alert>
          })) : (null)}
        </div>
      </form>
    )
  }
}

export const mapStateToProps = state => {
  const { pricingModel, errorPricingModel, cpm, errorCPM, cpc, errorCPC, bwaCPM, revShare, errorRevShare, errorBWACPM, pricingErrors } = state.placement;
  const { activeUser } = state.shared;

  return { pricingModel, errorPricingModel, cpm, errorCPM, cpc, errorCPC, bwaCPM, revShare, errorRevShare, errorBWACPM, activeUser, pricingErrors };
};

export default connect(mapStateToProps, { changePlacement })(PlacementPricing);









