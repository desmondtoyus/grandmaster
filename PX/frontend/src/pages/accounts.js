import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { resetAccountsReducer } from '../redux/actions/account.actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AccountsGrid from './grids/accounts.grid';

class Accounts extends Component {
  componentWillUnmount() {
    this.props.resetAccountsReducer();
  }

  render() {
    const { activeUser } = this.props;

    // if (!activeUser) {
    //   return (
    //     <div>HERE</div>
    //   )
    // }

    // if (!isAllowed('Accounts', activeUser.user)) {
    //   return (
    //     <div className={'sub-content'}>
    //       <Message negative size="massive">You are not authorized to view this page</Message>
    //     </div>
    //   )
    // }

    return (
       <div>
        <Breadcrumb tag="nav">
          <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
          <BreadcrumbItem active tag="span"> Accounts</BreadcrumbItem>
          <BreadcrumbItem ><Link to={`/ui/users`} className='link-a'>Users</Link></BreadcrumbItem>
        </Breadcrumb>
        <AccountsGrid />
      </div>
    )
  }
}



const mapStateToProps = state => {
  const { activeUser } = state.shared;

  return { activeUser };
};

export default connect(mapStateToProps, { resetAccountsReducer })(Accounts);
