import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, Input, TextArea } from 'semantic-ui-react';
import { changePlacement } from '../../redux/actions/placement.actions';
import { Alert } from 'reactstrap';
import classNames from 'classnames';
import withRouter from "react-router-dom/es/withRouter";
import { IABCategories } from "../../vars";

class PlacementDetails extends Component {
  handleChange = event => {
    this.props.changePlacement({ prop: event.target.name, value: event.target.value });
  };

  handleSelect = (event, data) => {
    this.props.changePlacement({ prop: data.name, value: data.value });
  };

  render() {
    const { name,  errorName, notes, publisherId, errorPublisherId, placementPublishers, detailsErrors, iabCategory, errorIabCategory } = this.props;

    return (
      <form className='form'>


        <div className='form__half'>
          <div className='form__inside' >
             <div className='float-container'>
              {name ? <label className={classNames('bwa-floating-label', { 'bwa-floated': name })} >Placement Name</label> : <div style={{marginTop:'8px'}}> </div>}
              <Input fluid placeholder="Placement Name" type="text" name="name" value={name} onChange={this.handleChange} error={errorName} />
            </div>
          </div>


          <div className='form__inside' >
             <div className='float-container'>
              {notes ? <label className={classNames('bwa-floating-label', { 'bwa-floated': notes })}>Notes</label> : <div style={{marginTop:'8px'}}> </div>}
              <TextArea rows={5} placeholder='Notes' name="notes" rows='3' value={notes} onChange={this.handleChange} />
            </div>
          </div>

          <div className='form__inside' >
             <div className='float-container'>
              {publisherId ? <label className={classNames('bwa-floating-label', { 'bwa-floated': publisherId })} >Publisher Name</label> : <div style={{marginTop:'8px'}}> </div>}
              <Select search placeholder="Publisher Name" value={publisherId ? publisherId : ''} fluid name="publisherId" id="publisherId" options={placementPublishers} onChange={this.handleSelect} error={errorPublisherId} />
            </div>
          </div>

          <div className='form__inside' >
             <div className='float-container'>
              {iabCategory.length ? <label className={classNames('bwa-floating-label', { 'bwa-floated': iabCategory })} >IAB Category</label> : <div style={{marginTop:'8px'}}> </div>}
              <Select search placeholder="IAB Category" value={iabCategory.length ? iabCategory : []} selection multiple fluid name="iabCategory" options={IABCategories} onChange={this.handleSelect} error={errorIabCategory} />
            </div>
          </div>

        </div>
        <div className='form__half'>
          {detailsErrors.length ? <h5> There are some errors with your submission</h5> : null}
          {detailsErrors.length ? (detailsErrors.map((err, index) => {
            return <Alert key={index} color='danger'> {err}</Alert>
          })) : (null)}
        </div>
      </form>
    )
  }
}


const mapStateToProps = state => {
  const { name,  errorName, notes, publisherId, errorPublisherId, placementPublishers, detailsErrors, iabCategory, errorIabCategory } = state.placement;

  return { name,  errorName, notes, publisherId, errorPublisherId, placementPublishers, detailsErrors, iabCategory, errorIabCategory };
};

export default withRouter(connect(mapStateToProps, { changePlacement })(PlacementDetails));