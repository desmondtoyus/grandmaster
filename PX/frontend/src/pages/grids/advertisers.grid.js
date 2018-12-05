import React, { Component } from 'react';
import { Input, Card, CardBody, Col, Nav, NavItem, NavLink, Popover, PopoverBody} from 'reactstrap';
import classnames from 'classnames';
import Table from '../../components/table/Table';
import { connect } from 'react-redux';
import { listAdvertisers, deleteAdvertiser, changeAdvertisers, readAdvertiser, listDisabledAdvertisers } from "../../redux/actions/advertiser.actions";
import { modalStateChange } from "../../redux/actions/modals.actions";
import moment from 'moment';
import { Link } from 'react-router-dom';
import ModalManager from '../../modals/modal.manager';
import Paginator from '../../app/paginator';
import { readActiveUser } from '../../redux/actions/user.actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import Alert from '../../components/Alert'
import { Popup, Icon, Dimmer  } from 'semantic-ui-react';

class AdvertisersGrid extends Component {
  state = {
    popoverOpenEdit: false,
    popoverOpenDelete: false
  };

  componentWillMount() {
    this.props.readActiveUser();
  }

  componentDidMount() {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master };
    this.props.listAdvertisers(payload);
  }
  toggleEdit = () => {

    this.setState({
      popoverOpenEdit: !this.state.popoverOpenEdit, popoverOpenDelete: false
    });
  }

  toggleDelete = () => {
    this.setState({
      popoverOpenDelete: !this.state.popoverOpenDelete, popoverOpenEdit: false
    });
  }

  updateCallback = () => {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master };
    this.renderAdvertisers(payload);
  };

  deleteAdvertiser = id => {
    this.props.deleteAdvertiser(id);
  };

  handleTabs = name => {
    this.props.changeAdvertisers({ prop: 'activeItem', value: name });
    const { searchTerm, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    let currentPage = 1;
    const payload = { searchTerm, sortDirection, sortBy, currentPage, pageChunk, master };

    switch (name) {
      case 'ADVERTISERS':
        this.props.listAdvertisers(payload);
        break;
      case 'DISABLED':
        this.props.listDisabledAdvertisers(payload);
        break;
    }
  };

  editAdvertiser = id => {
    this.props.readAdvertiser(id);
    this.props.modalStateChange({ prop: 'modalStatus', value: 'edit' });
    this.props.modalStateChange({ prop: 'showAdvertiser', value: true });
  };

  showConfirmAction = (id, action) => {
    this.props.modalStateChange({ prop: 'id', value: id });
    this.props.modalStateChange({ prop: 'showConfirmAction', value: true });
    if (action === "delete") {
      this.props.modalStateChange({ prop: 'header', value: 'Are you sure you want to delete the advertiser?' });
      this.props.modalStateChange({ prop: 'message', value: 'Deleted advertisers cannot be recovered' });
      this.props.modalStateChange({ prop: 'callback', value: this.deleteAdvertiser });
    }
  };

  showAlert = msg => {
    this.props.modalStateChange({ prop: 'showAlert', value: true });
    this.props.modalStateChange({ prop: 'error', value: true });
    this.props.modalStateChange({ prop: 'errorMessage', value: msg });
  };

  createAdvertiser = () => {
    this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
    this.props.modalStateChange({ prop: 'showAdvertiser', value: true });
  };

  renderTableBody = () => {
    const { advertisers, activeItem } = this.props;

    return advertisers.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>
            <Popup
              trigger={<Link to={`/ui/advertiser/${item.id}`}>
                {item.name}
              </Link>}
              flowing
              content={item.name}
            />
          </td>
          <td>{moment(moment.unix(item.created_at)).format('MM-DD-YYYY')}</td>
          {activeItem === 'ADVERTISERS' ? <td >
            <Popover placement="top" isOpen={this.state.popoverOpenEdit} target="edit" toggle={this.toggleEdit}>
              <PopoverBody>Edit</PopoverBody>
            </Popover>

            <Popover placement="bottom" isOpen={this.state.popoverOpenDelete} target="delete" toggle={this.toggleDelete}>
              <PopoverBody>Delete</PopoverBody>
            </Popover>
            <FontAwesomeIcon icon={faEdit} style={{ marginRight: '10px' }} id="edit" onMouseOver={this.toggleEdit} onClick={this.editAdvertiser.bind(null, item.id)} />
            {!item.campaigns.length ? <FontAwesomeIcon icon={faTrashAlt} id="delete" onMouseOver={this.toggleDelete} onClick={this.showConfirmAction.bind(null, item.id, 'delete')} /> : null}
            {item.campaigns.length ? <FontAwesomeIcon icon={faTrashAlt} id="delete" onMouseOver={this.toggleDelete} onClick={this.showAlert.bind(null, 'Advertiser has campaigns. Please delete all the campaigns before deleting the advertiser')} /> : null}
          </td> : null}
        </tr>
      )
    })
  };

  renderAdvertisers = payload => {
    const { activeItem } = this.props;

    switch (activeItem) {
      case 'ADVERTISERS':
        this.props.listAdvertisers(payload);
        break;
      case 'DISABLED':
        this.props.listDisabledAdvertisers(payload);
        break;
    }
  };

  searchAdvertisers = (event) => {
    this.props.changeAdvertisers({ prop: 'searchTerm', value: event.target.value });
    this.props.changeAdvertisers({ prop: 'currentPage', value: 1 });
    const { sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { sortBy, sortDirection, master, pageChunk, searchTerm: event.target.value, currentPage: 1 };
    this.renderAdvertisers(payload);
  };

  handlePagination = currentPage => {
    const { searchTerm, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    this.props.changeAdvertisers({ prop: 'currentPage', value: currentPage });
    let payload = { searchTerm, sortBy, sortDirection, pageChunk, currentPage, master };
    this.renderAdvertisers(payload);
  };

  handleSort = (event) => {
    const { searchTerm, currentPage, pageChunk, sortDirection, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { master, searchTerm, currentPage, pageChunk, sortBy: event.target.id, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' };
    this.props.changeAdvertisers({ prop: 'idSort', value: event.target.id === "id" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeAdvertisers({ prop: 'nameSort', value: event.target.id === "name" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeAdvertisers({ prop: 'created_atSort', value: event.target.id === "created_at" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeAdvertisers({ prop: 'sortBy', value: event.target.id });
    this.props.changeAdvertisers({ prop: 'sortDirection', value: payload.sortDirection });

    this.renderAdvertisers(payload);
  };

  render() {
    const { cursorStyle, dimmerStyle } = styles;
    const { activeItem, advertisers, searchTerm, loader, idSort, nameSort, listError, created_atSort, pagination, activeUser } = this.props;
    return (
      <Col md={12} lg={12} xl={12}>
        <ModalManager currentModal={'ADVERTISER'} update={this.updateCallback} />
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
                      className={classnames({ active: activeItem === "ADVERTISERS" })}
                      onClick={this.handleTabs.bind(null, 'ADVERTISERS')}
                    >
                      Advertisers
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeItem === "DISABLED" })}
                      onClick={this.handleTabs.bind(null, 'DISABLED')}
                    >
                      Disabled
                    </NavLink>
                  </NavItem >
                  <NavItem style={{ backgroundColor: '#e3f1f9', borderRadius: '10px' }}>
                    <NavLink onClick={this.createAdvertiser}>
                      New Advertiser
                    </NavLink>
                  </NavItem>
                  <NavItem style={{ marginLeft: 'auto', marginRight: 0 }}> <Input value={searchTerm} placeholder="Search" onChange={this.searchAdvertisers} style={{ marginBottom: '3px' }} /></NavItem>
                </Nav>
                {!loader && advertisers.length ? <div>
                  <Table responsive className='table--bordered dashboard__table-crypto'>
                    <thead>
                      <tr>
                        <th >ID <Icon color={idSort === "sort" ? "black" : "blue"} name={idSort} id="id" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th >Advertisers <Icon color={nameSort === "sort" ? "black" : "blue"} name={nameSort} id="name" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th>Created Date <Icon color={created_atSort === "sort" ? "black" : "blue"} name={created_atSort} id="created_at" onClick={this.handleSort} style={cursorStyle} /></th>
                        {activeItem === 'ADVERTISERS' ? <th>Action</th> : null}
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderTableBody()}
                    </tbody>
                  </Table>
                  <Paginator pagination={pagination} handlePagination={this.handlePagination} />
                </div> : <Alert color='info' className='alert--neutral' icon>
                    <p><span className='bold-text'>Information:</span> There are no matching advertisers</p>
                  </Alert>}
              </div>
            </div>
          </CardBody>
          {listError ? <Alert color='danger' className='alert--neutral' icon>
            <p><span className='bold-text'>Warning!</span> Cannot display advertisers at this time. Please try again later.</p>
          </Alert> : null}
        </Card>
      </Col>
    )
  }
}

const styles = {
  cursorStyle: {
    cursor: "pointer"
  },
  dimmerStyle: {
    height: "100%"
  }
};

const mapStateToProps = state => {
  const { advertisers, activeItem, searchTerm, sortBy, sortDirection, currentPage, pageChunk, idSort, nameSort, created_atSort, loader, listError, pagination } = state.advertisers;
  const { activeUser } = state.shared;

  return { advertisers, activeItem, searchTerm, sortBy, sortDirection, currentPage, pageChunk, idSort, nameSort, created_atSort, loader, listError, pagination, activeUser };
};

export default connect(mapStateToProps, { readActiveUser, listAdvertisers, deleteAdvertiser, changeAdvertisers, readAdvertiser, modalStateChange, listDisabledAdvertisers })(AdvertisersGrid);