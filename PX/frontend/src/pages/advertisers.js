import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { resetAdvertisersReducer } from '../redux/actions/advertiser.actions';
import { isAllowed } from '../functions';
import { Link } from 'react-router-dom';

import AdvertisersGrid from './grids/advertisers.grid';

class Advertisers extends Component {
  componentWillUnmount() {
    this.props.resetAdvertisersReducer();
  }

  render() {
    const { activeUser } = this.props;

    if (!activeUser) {
      return (
        <div></div>
      )
    }

    if (!isAllowed('Advertisers', activeUser.user)) {
      return (
        <div className="sub-content">
          <Alert color='danger'>You are not authorized to view this page</Alert>
        </div>
      )
    }
    return (
      <div>
        <Breadcrumb tag="nav">
          <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
          <BreadcrumbItem active tag="span" >Advertisers</BreadcrumbItem>
          <BreadcrumbItem><Link to={`/ui/campaigns`} className='link-a'>Campaigns</Link></BreadcrumbItem>
          <BreadcrumbItem ><Link to={`/ui/flights`} className='link-a'>Flights</Link></BreadcrumbItem>
        </Breadcrumb>

        <AdvertisersGrid />
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { activeUser } = state.shared;

  return { activeUser };
};

export default connect(mapStateToProps, { resetAdvertisersReducer })(Advertisers);