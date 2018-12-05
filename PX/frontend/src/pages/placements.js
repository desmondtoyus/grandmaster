
import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { isAllowed } from '../functions';
import { connect } from 'react-redux';
import { modalStateChange } from "../redux/actions/modals.actions";
import { resetPlacementsReducer } from "../redux/actions/placement.actions";
import { Link } from 'react-router-dom';
import PlacementsGrid from './grids/placements.grid';

class Placements extends Component {
  componentWillUnmount() {
    this.props.resetPlacementsReducer();
  }

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
          <Message negative size="massive">You are not authorized to view this page</Message>
        </div>
      )
    }

    return (
       <div>
        <Breadcrumb tag="nav">
          <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
          <BreadcrumbItem > <Link to={`/ui/publishers`} className='link-a'>Publishers</Link></BreadcrumbItem>
          <BreadcrumbItem active tag="span" >Placements</BreadcrumbItem>
        </Breadcrumb>
        <PlacementsGrid />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { activeUser } = state.shared;

  return { activeUser };
};

export default connect(mapStateToProps, { modalStateChange, resetPlacementsReducer })(Placements);
