import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  TextArea } from 'semantic-ui-react';
import { changePlacement } from '../../redux/actions/placement.actions';
import classNames from 'classnames';
import withRouter from "react-router-dom/es/withRouter";

class PlacementPassback extends Component {
  handleChange = event => {
    this.props.changePlacement({ prop: event.target.name, value: event.target.value });
  };


  handleSelect = (event, data) => {
    this.props.changePlacement({ prop: data.name, value: data.value });
  };

  render() {
    const {  passbackUrl} = this.props;

    return (
      <form className='form'>
        <div className='form__half'>
          <div className='form__inside' >
             <div className='float-container'>
              {passbackUrl ? <label className={classNames('bwa-floating-label', { 'bwa-floated': passbackUrl })}>Passback URL</label> : <label> </label>}
              <TextArea placeholder='Passback URL' name="passbackUrl" rows='3' value={passbackUrl} onChange={this.handleChange} />
            </div>
          </div>
        </div>
        <div className='form__half'>
          {/* {detailsErrors.length ? <h5> There are some errors with your submission</h5> : null}
          {detailsErrors.length ? (detailsErrors.map((err, index) => {
            return <Alert key={index} color='danger'> {err}</Alert>
          })) : (null)} */}
        </div>
      </form>
    )
  }
}

const mapStateToProps = state => {
    const { passbackUrl, errorName, notes, errorNotes, publisherId, errorPublisherId, placementPublishers, detailsErrors } = state.placement;

    return { passbackUrl, errorName, notes, errorNotes, publisherId, errorPublisherId, placementPublishers, detailsErrors };
};

export default withRouter(connect(mapStateToProps, { changePlacement })(PlacementPassback));