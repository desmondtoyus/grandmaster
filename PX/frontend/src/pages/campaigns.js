import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { resetCampaignsReducer } from '../redux/actions/campaign.actions';
import { isAllowed } from '../functions';
import { Link } from 'react-router-dom';
import CampaignsGrid from './grids/campaigns.grid';

class Campaigns extends Component {
  componentWillUnmount() {
    this.props.resetCampaignsReducer();
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
        <div className={'sub-content'}>
          <Alert color='danger'>You are not authorized to view this page</Alert>
        </div>
      )
    }

    return (
      <div>
        <Breadcrumb tag="nav">
          <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
          
          <BreadcrumbItem><Link to={`/ui/advertisers`} className='link-a'> Advertisers</Link></BreadcrumbItem>
          <BreadcrumbItem active tag="span" >Campaigns</BreadcrumbItem>
          <BreadcrumbItem ><Link to={`/ui/flights`} className='link-a'>Flights</Link></BreadcrumbItem>
        </Breadcrumb>

        <CampaignsGrid />
      </div>
    )
  }
}

const styles = {
  iconStyle: {
    marginLeft: "15px"
  },
  cursorStyle: {
    cursor: "pointer"
  },
  searchStyle: {
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingRight: "0px"
  },
  dimmerStyle: {
    height: "300px"
  }
};

const mapStateToProps = state => {
  const { activeUser } = state.shared;
  const { activeItem, flights, searchTerm, sortBy, sortDirection, currentPage, pageChunk, loader, idSort, nameSort, listError, channelSort, formatSort, statusSort, pagination, start_timeSort, end_timeSort } = state.flights;

  return { activeItem, flights, searchTerm, sortBy, sortDirection, currentPage, pageChunk, loader, idSort, nameSort, listError, channelSort, formatSort, statusSort, pagination, start_timeSort, end_timeSort, activeUser };
};

export default connect(mapStateToProps, { resetCampaignsReducer })(Campaigns);
