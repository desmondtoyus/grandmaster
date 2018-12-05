import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { resetUsersReducer } from "../redux/actions/user.actions";
import { connect } from 'react-redux';
import { isAllowed } from '../functions';
import { Link } from 'react-router-dom';

import UsersGrid from './grids/users.grid';

class Users extends Component {
  componentWillUnmount() {
    this.props.resetUsersReducer();
  }

  render() {
    const { activeUser } = this.props;

    if (!activeUser) {
      return (
        <div></div>
      )
    }

    if (!isAllowed('Users', activeUser.user)) {
      return (
        <div className={'sub-content'}>
          <Alert color='danger'>You are not authorized to view this page</Alert>
        </div>
      )
    }

    return (
      <div>
        <Breadcrumb tag="nav">
          <BreadcrumbItem ><Link to={`/ui/home`}>Home</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to={`/ui/accounts`}> Accounts</Link></BreadcrumbItem>
          <BreadcrumbItem active tag="span" >Users</BreadcrumbItem>
        </Breadcrumb>
        <UsersGrid />
      </div>


    )
  }
}

const mapStateToProps = state => {
  const { activeUser } = state.shared;

  return { activeUser };
};

export default connect(mapStateToProps, { resetUsersReducer })(Users);
