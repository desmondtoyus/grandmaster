import React, { Component } from 'react';
import { connect } from 'react-redux';
import { listAccounts, changeAccounts, listPendingAccounts, listDisabledAccounts, readAccount, deleteAccount, readDisplayAccount, activateAccount, deactivateAccount } from '../../redux/actions/account.actions';
import { modalStateChange } from "../../redux/actions/modals.actions";
import moment from 'moment';
import { ROLE_OPSADMIN, ROLE_SUPERADMIN } from "../../roles";
import Paginator from "../../app/paginator";
import ModalManager from '../../modals/modal.manager.js';
import { Popup, Icon, Dimmer } from 'semantic-ui-react';
import Alert from '../../components/Alert'
import Table from '../../components/table/Table';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Popover, PopoverHeader, PopoverBody, Container, Row, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

class AccountsGrid extends Component {
  componentDidMount() {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master};
    this.props.listAccounts(payload);
  }

  updateCallback = () => {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master };
    this.renderAccounts(payload);
  };

  deleteAccount = (id) => {
    this.props.deleteAccount(id);
  };

  handleTabs = (name) => {
    this.props.changeAccounts({ prop: 'activeItem', value: name });
    const { searchTerm, sortBy,  sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    let currentPage = 1;
    const payload = { searchTerm, sortBy, currentPage, sortDirection, pageChunk, master };

    switch(name) {
      case 'ACCOUNTS':
        this.props.listAccounts(payload);
        break;
      case 'PENDING':
        this.props.listPendingAccounts(payload);
        break;
      case 'DISABLED':
        this.props.listDisabledAccounts(payload);
        break;
    }
  };

  editAccount = (id) => {
    this.props.readAccount(id);
    this.props.modalStateChange({ prop: 'modalStatus', value: 'edit' });
    this.props.modalStateChange({ prop: 'showAccount', value: true });
  };

  showConfirmAction = (id, action) => {
    this.props.modalStateChange({ prop: 'id', value: id });
    this.props.modalStateChange({ prop: 'showConfirmAction', value: true });
    if (action === "delete") {
      this.props.modalStateChange({ prop: 'header', value: 'Are you sure you want to delete the account?' });
      this.props.modalStateChange({ prop: 'message', value: 'Deleted accounts cannot be recovered' });
      this.props.modalStateChange({ prop: 'callback', value: this.deleteAccount });
    }
    if (action === 'deactivate') {
      this.props.modalStateChange({ prop: 'header', value: 'Are you sure you want to deactivate the account?' });
      this.props.modalStateChange({ prop: 'message', value: 'All users under this account will be deactivated. Users must be activated manually.' });
      this.props.modalStateChange({ prop: 'callback', value: this.deactivateAccount });
    }
  };

  activateAccount = (id, index) => {
    const { accounts } = this.props;

    let arr = [...accounts];
    arr[index].status = 'active';
    this.props.changeAccounts({ prop: 'accounts', value: arr });

    this.props.activateAccount(id);
  };

  deactivateAccount = (id) => {
    this.props.deactivateAccount(id);
  };

  showAlert = (msg) => {
    this.props.modalStateChange({ prop: 'showAlert', value: true });
    this.props.modalStateChange({ prop: 'error', value: true });
    this.props.modalStateChange({ prop: 'errorMessage', value: msg });
  };

  createAccount = () => {
    this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
    this.props.modalStateChange({ prop: 'showAccount', value: true });
  };

  renderTableBody = () => {
    const { cursorStyle } = styles;
    const { accounts, activeItem } = this.props;

    return accounts.map((item, index) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>
            <Popup
              trigger={<Link to={`/ui/account/${item.id}`}>{item.name}</Link>}
              content={item.name}
              flowing
            />
          </td>
          <td>{moment(moment.unix(item.created_at)).format('MM-DD-YYYY')}</td>
          { item.status === "active" ? <td><Popup trigger={<Icon name="check circle" color="green" size="large" style={cursorStyle} onClick={this.showConfirmAction.bind(null, item.id, 'deactivate')} />} size="mini" content="Deactivate Account" /></td> : null }
          { item.status === "inactive" || item.status === 'pending' ? <td><Popup trigger={<Icon name="remove circle" color="red" size="large" style={cursorStyle} onClick={this.activateAccount.bind(null, item.id, index)} />} size="mini" content="Activate Account" /></td> : null }
          { activeItem === 'ACCOUNTS' ? <td>
            <Popup trigger={<Icon style={cursorStyle} name="edit" onClick={this.editAccount.bind(null, item.id)} />} size='mini' content="Edit Account" />
            { !item.users.length && !item.is_zone_master ? <Popup trigger={<Icon style={cursorStyle} name="trash" onClick={this.showConfirmAction.bind(null, item.id, 'delete')} />} size='mini' content="Delete Account" /> : null }
            { item.users.length && !item.is_zone_master ? <Popup trigger={<Icon style={cursorStyle} name={'trash'} onClick={this.showAlert.bind(null, 'Account has users. Please delete all the users before deleting an account')} />} size={'mini'} content={'Delete Account'} /> : null }
            { item.is_zone_master ? <Popup trigger={<Icon style={cursorStyle} name={'trash'} onClick={this.showAlert.bind(null, 'Cannot delete a primary account.')} />} size={'mini'} content={'Delete Account'} /> : null }
          </td> : null }
        </tr>
      )
    })
  };

  renderAccounts = (payload) => {
    const { activeItem } = this.props;

    switch(activeItem) {
      case 'ACCOUNTS':
        this.props.listAccounts(payload);
        break;
      case 'PENDING':
        this.props.listPendingAccounts(payload);
        break;
      case 'DISABLED':
        this.props.listDisabledAccounts(payload);
        break;
    }
  };

  searchAccounts = (event) => {
    this.props.changeAccounts({ prop: 'searchTerm', value: event.target.value });
    this.props.changeAccounts({ prop: 'currentPage', value: 1 });
    const { sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { master, sortBy, sortDirection, pageChunk, searchTerm: event.target.value, currentPage: 1 };
    this.renderAccounts(payload);
  };

  handlePagination = (currentPage) => {
    const { searchTerm, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    this.props.changeAccounts({ prop: 'currentPage', value: currentPage });
    let payload = { searchTerm, master, sortBy, sortDirection, pageChunk, currentPage };
    this.renderAccounts(payload);
  };

  handleSort = (event) => {
    const { searchTerm, currentPage, pageChunk, sortDirection, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { master, searchTerm, currentPage, pageChunk, sortBy: event.target.id, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' };
    this.props.changeAccounts({ prop: 'idSort', value: event.target.id === "id" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeAccounts({ prop: 'nameSort', value: event.target.id === "name" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeAccounts({ prop: 'statusSort', value: event.target.id === "status" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeAccounts({ prop: 'created_atSort', value: event.target.id === "created_at" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeAccounts({ prop: 'sortBy', value: event.target.id });
    this.props.changeAccounts({ prop: 'sortDirection', value: payload.sortDirection });

    this.renderAccounts(payload);
  };


  render() {

    const { cursorStyle, dimmerStyle} = styles;
    const { activeItem, accounts, searchTerm, loader, idSort, nameSort, listError, created_atSort, statusSort, pagination, activeUser } = this.props;

    return (
      <Col md={12} lg={12} xl={12}>
        <ModalManager currentModal={'ACCOUNT'} update={this.updateCallback} />
        <ModalManager currentModal={'CONFIRM_ACTION'} update={this.updateCallback} />
        <ModalManager currentModal={'ALERT'} update={this.updateCallback} />
        <Card>
          {loader ? <Dimmer active inverted style={dimmerStyle}><div className='loader'> </div></Dimmer> : null}
          <CardBody>
            <div className='tabs tabs--bordered-bottom'>
              <div className='tabs__wrap'>

                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeItem === "ACCOUNTS" })}
                     name="ACCOUNTS"  active={activeItem === "ACCOUNTS"} onClick={this.handleTabs.bind(null, 'ACCOUNTS')}
                    >
                     Accounts
                    </NavLink>
                  </NavItem>
                  {activeUser.user.role & ROLE_SUPERADMIN || activeUser.user.role & ROLE_OPSADMIN ? <NavItem>
                    <NavLink
                      className={classnames({ active: activeItem === "PENDING" })}
                      name={'PENDING'} active={activeItem === 'PENDING'} onClick={this.handleTabs.bind(null, 'PENDING')}
                    >
                      Pending
                      </NavLink>
                  </NavItem > : null}

                      {activeUser.user.role & ROLE_SUPERADMIN || activeUser.user.role & ROLE_OPSADMIN ? <NavItem>
                    <NavLink
                      className={classnames({ active: activeItem === "DISABLED" })}
                      name={'DISABLED'} active={activeItem === 'DISABLED'} onClick={this.handleTabs.bind(null, 'DISABLED')}
                    >
                      Disabled
                      </NavLink>
                  </NavItem > : null}


                  {activeUser.user.role & ROLE_SUPERADMIN || activeUser.user.role & ROLE_OPSADMIN || activeUser.scope_account.is_zone_master ?  <NavItem style={{ backgroundColor: '#e3f1f9', borderRadius: '10px' }}>
                    <NavLink onClick={this.createAccount}>
                      New Account
                    </NavLink>
                  </NavItem>:null}
                  <NavItem style={{ marginLeft: 'auto', marginRight: 0 }}> <Input value={searchTerm} placeholder="Search" onChange={this.searchAccounts} style={{ marginBottom: '3px' }} /></NavItem>
                </Nav>
                {!loader && accounts.length ? <div>
                  <Table responsive className='table--bordered dashboard__table-crypto'>
                    <thead>
                      <tr>
                        <th>ID <Icon color={idSort === "sort" ? "black" : "blue"} name={idSort} id="id" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th>Account <Icon color={nameSort === "sort" ? "black" : "blue"} name={nameSort} id="name" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th>Created Date <Icon color={created_atSort === "sort" ? "black" : "blue"} name={created_atSort} id="created_at" onClick={this.handleSort} style={cursorStyle} /></th>
                        {activeItem === 'ACCOUNTS' ? <th>Status <Icon color={statusSort === "sort" ? "black" : "blue"} name={statusSort} id={'status'} onClick={this.handleSort} style={cursorStyle} /></th> : null}
                        {activeItem === 'ACCOUNTS' ? <th>Action</th> : null}
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderTableBody()}
                    </tbody>
                  </Table>
                  <Paginator pagination={pagination} handlePagination={this.handlePagination} />
                </div> : <Alert color='info' className='alert--neutral' icon>
                    <p><span className='bold-text'>Information:</span> There are no matching accounts.</p>
                  </Alert>}
              </div>
            </div>
          </CardBody>
          {listError ? <Alert color='danger' className='alert--neutral' icon>
            <p><span className='bold-text'>Error!</span> Cannot display accounts at this time. Please try again later</p>
          </Alert> : null}
        </Card>
      </Col>
    )

  }
}

const styles = {
  searchStyle: {
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingRight: "0px"
  },

  divStyle: {
    marginTop: 10
  }
};

const mapStateToProps = state => {
  const { activeUser } = state.shared;
  const { accounts, activeItem, searchTerm, sortBy, sortDirection, currentPage, pageChunk, idSort, nameSort, statusSort, created_atSort, loader, listError, pagination } = state.accounts;

  return { activeUser, accounts, activeItem, searchTerm, sortBy, sortDirection, currentPage, pageChunk, idSort, nameSort, statusSort, created_atSort, loader, listError, pagination };
};

export default connect(mapStateToProps, { listAccounts, modalStateChange, changeAccounts, listPendingAccounts, listDisabledAccounts, readAccount, deleteAccount, readDisplayAccount, activateAccount, deactivateAccount })(AccountsGrid);