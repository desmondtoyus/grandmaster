import React, { Component } from 'react';
import { connect } from 'react-redux';
import { listUsers, changeUsers, listDisabledUsers, readUser, deleteUser, readDisplayUser, activateUser, deactivateUser } from '../../redux/actions/user.actions';
import { modalStateChange } from "../../redux/actions/modals.actions";
import { Icon, Popup, Dimmer } from 'semantic-ui-react';
import moment from 'moment';
import ModalManager from '../../modals/modal.manager';
import Alert from '../../components/Alert'
import Table from '../../components/table/Table';
import Paginator from '../../app/paginator';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Input } from 'reactstrap';

import { ROLE_OPSADMIN, ROLE_SUPERADMIN } from "../../roles";
import { withRouter } from 'react-router';
import classnames from 'classnames';

class UsersGrid extends Component {
  componentDidMount() {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.props.listUsers(payload);
  }

  updateCallback = () => {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.renderUsers(payload);
  };

  deleteUser = (id) => {
    this.props.deleteUser(id);
  };

  handleTabs = (name) => {
    this.props.changeUsers({ prop: 'activeItem', value: name });
    const { searchTerm, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    let currentPage = 1;
    const payload = { searchTerm, sortBy, currentPage, sortDirection, pageChunk, master };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }

    switch (name) {
      case 'USERS':
        this.props.listUsers(payload);
        break;
      case 'DISABLED':
        this.props.listDisabledUsers(payload);
        break;
    }
  };

  displayUser = (id) => {
    this.props.readDisplayUser(id);
    this.props.modalStateChange({ prop: 'showDisplayUser', value: true });
  };

  editUser = (id) => {
    this.props.readUser(id);
    this.props.modalStateChange({ prop: 'modalStatus', value: 'edit' });
    this.props.modalStateChange({ prop: 'showUser', value: true });
  };

  showConfirmAction = (id, action) => {
    this.props.modalStateChange({ prop: 'id', value: id });
    this.props.modalStateChange({ prop: 'showConfirmAction', value: true });
    if (action === "delete") {
      this.props.modalStateChange({ prop: 'header', value: 'Are you sure you want to delete the user?' });
      this.props.modalStateChange({ prop: 'message', value: 'Deleted users cannot be recovered' });
      this.props.modalStateChange({ prop: 'callback', value: this.deleteUser });
    }
  };

  activateUser = (id, index) => {
    const { users } = this.props;

    let arr = [...users];
    arr[index].status = 'active';
    this.props.changeUsers({ prop: 'users', value: arr });

    this.props.activateUser(id);
  };

  deactivateUser = (id, index) => {
    const { users } = this.props;

    let arr = [...users];
    arr[index].status = 'inactive';
    this.props.changeUsers({ prop: 'users', value: arr });

    this.props.deactivateUser(id);
  };

  showAlert = (msg) => {
    this.props.modalStateChange({ prop: 'showAlert', value: true });
    this.props.modalStateChange({ prop: 'error', value: true });
    this.props.modalStateChange({ prop: 'errorMessage', value: msg });
  };

  createUser = () => {
    this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
    this.props.modalStateChange({ prop: 'showUser', value: true });
  };

  renderTableBody = () => {
    const { cursorStyle } = styles;
    const { users, activeItem, activeUser } = this.props;

    return users.map((item, index) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.first_name}</td>
          <td>{item.last_name}</td>
          <td>{item.email}</td>
          <td>{item.phone_number}</td>
          <td>{moment(moment.unix(item.created_at)).format('MM-DD-YYYY')}</td>
          {item.status === "active" && activeUser.user.id !== item.id ? <td><Popup trigger={<Icon name="check circle" color="green" size="large" style={cursorStyle} onClick={this.deactivateUser.bind(null, item.id, index)} />} size="mini" content="Deactivate User" /></td> : null}
          {item.status === "inactive" ? <td><Popup trigger={<Icon name="remove circle" color="red" size="large" style={cursorStyle} onClick={this.activateUser.bind(null, item.id, index)} />} size="mini" content="Activate User" /></td> : null}
          {activeUser.user.id === item.id ? <td>
            <Popup trigger={<Icon name={'check circle'} color={'green'} size={'large'} style={cursorStyle} onClick={this.showAlert.bind(null, 'You cannot deactivate your own user. Please contact support if you would like to delete your user.')} />} size='mini' content={'Deactivate User'} />
          </td> : null}
          {activeItem === 'USERS' ? <td>
            <Popup trigger={<Icon style={cursorStyle} onClick={this.displayUser.bind(null, item.id)} name="file text outline" />} size="mini" content="Display User" />
            <Popup trigger={<Icon style={cursorStyle} name="edit" onClick={this.editUser.bind(null, item.id)} />} size='mini' content="Edit User" />
            {activeUser.user.id !== item.id ? <Popup trigger={<Icon style={cursorStyle} name="trash" onClick={this.showConfirmAction.bind(null, item.id, 'delete')} />} size='mini' content="Delete User" /> : null}
            {activeUser.user.id === item.id ? <Popup trigger={<Icon style={cursorStyle} name={'trash'} onClick={this.showAlert.bind(null, 'Cannot delete your own user')} />} size={'mini'} content={'Delete User'} /> : null}
          </td> : null}
          {item.status === 'disabled' ? <td>
            <Popup trigger={<Icon style={cursorStyle} onClick={this.displayUser.bind(null, item.id)} name="file text outline" />} size="mini" content="Display User" />
          </td> : null}
        </tr>
      )
    })
  };

  renderUsers = (payload) => {
    const { activeItem, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;

    switch (activeItem) {
      case 'USERS':
        this.props.listUsers(payload);
        break;
      case 'DISABLED':
        this.props.listDisabledUsers(payload);
        break;
    }
  };

  searchUsers = (event) => {
    this.props.changeUsers({ prop: 'searchTerm', value: event.target.value });
    this.props.changeUsers({ prop: 'currentPage', value: 1 });
    const { sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { master, sortBy, sortDirection, pageChunk, searchTerm: event.target.value, currentPage: 1 };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.renderUsers(payload);
  };

  handlePagination = (currentPage) => {
    const { searchTerm, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    this.props.changeUsers({ prop: 'currentPage', value: currentPage });
    let payload = { master, searchTerm, sortBy, sortDirection, pageChunk, currentPage };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.renderUsers(payload);
  };

  handleSort = (event) => {
    const { searchTerm, currentPage, pageChunk, sortDirection, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { master, searchTerm, currentPage, pageChunk, sortBy: event.target.id, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.props.changeUsers({ prop: 'idSort', value: event.target.id === "id" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeUsers({ prop: 'nameSort', value: event.target.id === "name" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeUsers({ prop: 'statusSort', value: event.target.id === "status" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeUsers({ prop: 'created_atSort', value: event.target.id === "created_at" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeUsers({ prop: 'sortBy', value: event.target.id });
    this.props.changeUsers({ prop: 'sortDirection', value: payload.sortDirection });

    this.renderUsers(payload);
  };


  render() {
    const { searchStyle, cursorStyle, dimmerStyle, divStyle } = styles;
    const { activeUser, activeItem, users, searchTerm, loader, idSort, first_nameSort, last_nameSort, emailSort, statusSort, created_atSort, listError, pagination } = this.props;

    return (
      <Col md={12} lg={12} xl={12}>
        <ModalManager currentModal={'USER'} activeUser={activeUser} update={this.updateCallback} />
        <ModalManager currentModal={'CONFIRM_ACTION'} update={this.updateCallback} />
        <ModalManager currentModal={'ALERT'} update={this.updateCallback} />
        <ModalManager currentModal={'DISPLAY_USER'} />
        <Card>
          {loader ? <Dimmer active inverted style={dimmerStyle}><div className='loader'> </div></Dimmer> : null}
          <CardBody>
            <div className='tabs tabs--bordered-bottom'>
              <div className='tabs__wrap'>

                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeItem === "USERS" })}
                      // onClick={this.handleTabs.bind(null, 'INTEGRATIONS')}
                      name="Users" active={activeItem === "USERS"} onClick={this.handleTabs.bind(null, 'USERS')}
                    >
                      Users
                    </NavLink>
                  </NavItem>
                  {activeUser.user.role & ROLE_SUPERADMIN || activeUser.user.role & ROLE_OPSADMIN ? <NavItem>
                    <NavLink
                      className={classnames({ active: activeItem === "DISABLED" })}
                      name={'DISABLED'} active={activeItem === 'DISABLED'} onClick={this.handleTabs.bind(null, 'DISABLED')}
                    >
                      Disabled
                      </NavLink>
                  </NavItem > : null}

                  <NavItem style={{ backgroundColor: '#e3f1f9', borderRadius: '10px' }}>
                    <NavLink onClick={this.createUser}>
                      New User
                    </NavLink>
                  </NavItem>
                  <NavItem style={{ marginLeft: 'auto', marginRight: 0 }}> <Input value={searchTerm} placeholder="Search" onChange={this.searchUsers} style={{ marginBottom: '3px' }} /></NavItem>
                </Nav>
                {!loader && users.length ? <div>
                  <Table responsive className='table--bordered dashboard__table-crypto'>
                    <thead>
                      <tr>
                        <th>ID <Icon color={idSort === "sort" ? "black" : "blue"} name={idSort} id="id" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th>First Name <Icon color={first_nameSort === "sort" ? "black" : "blue"} name={first_nameSort} id="first_name" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th>Last Name <Icon color={last_nameSort === "sort" ? "black" : "blue"} name={last_nameSort} id="last_name" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th>Email <Icon color={emailSort === "sort" ? "black" : "blue"} name={emailSort} id="email" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th>Phone</th>
                        <th>Created Date <Icon color={created_atSort === "sort" ? "black" : "blue"} name={created_atSort} id="created_at" onClick={this.handleSort} style={cursorStyle} /></th>
                        {activeItem === "USERS" ? <th>Status <Icon color={statusSort === "sort" ? "black" : "blue"} name={statusSort} id={'status'} onClick={this.handleSort} style={cursorStyle} /></th> : null}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderTableBody()}
                    </tbody>
                  </Table>
                  <Paginator pagination={pagination} handlePagination={this.handlePagination} />
                </div> : <Alert color='info' className='alert--neutral' icon>
                    <p><span className='bold-text'>Information:</span> There are no integrations matching the criteria</p>
                  </Alert>}
              </div>
            </div>
          </CardBody>
          {listError ? <Alert color='danger' className='alert--neutral' icon>
            <p><span className='bold-text'>Warning!</span> Cannot display users at this time. Please try again later.</p>
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
  cursorStyle: {
    cursor: "pointer"
  },
  dimmerStyle: {
    height: "100%"
  },
  divStyle: {
    marginTop: 10
  }
};

const mapStateToProps = state => {
  const { users, activeItem, searchTerm, sortBy, sortDirection, currentPage, pageChunk, idSort, first_nameSort, last_nameSort, emailSort, statusSort, created_atSort, loader, listError, pagination } = state.users;
  const { activeUser } = state.shared;

  return { users, activeItem, searchTerm, sortBy, sortDirection, currentPage, pageChunk, idSort, first_nameSort, last_nameSort, emailSort, statusSort, created_atSort, loader, listError, pagination, activeUser };
};

export default withRouter(connect(mapStateToProps, { listUsers, changeUsers, listDisabledUsers, readUser, deleteUser, readDisplayUser, activateUser, deactivateUser, modalStateChange })(UsersGrid));