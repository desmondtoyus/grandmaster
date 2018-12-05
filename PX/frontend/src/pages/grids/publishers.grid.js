import React, { Component } from 'react';
import { connect } from 'react-redux';
import { listPublishers, deletePublisher, changePublishers, readPublisher, listDisabledPublishers } from "../../redux/actions/publisher.actions";
import { modalStateChange } from "../../redux/actions/modals.actions";
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Popup, Icon, Dimmer } from 'semantic-ui-react';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Input } from 'reactstrap';
import ModalManager from '../../modals/modal.manager';
import Alert from '../../components/Alert'
import Table from '../../components/table/Table';
import Paginator from '../../app/paginator';
import { readActiveUser } from '../../redux/actions/user.actions';
import { ROLE_SUPERADMIN, ROLE_OPSADMIN } from "../../roles";
import classnames from 'classnames';

class PublishersGrid extends Component {
state={
  master: this.props.activeUser.scope_account.is_zone_master,
  count:0
}
componentWillMount(){
  this.props.readActiveUser();
}

  componentDidMount() {
    const { publishers, searchTerm, currentPage, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    console.log('account is a master? ', master);
    const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master };
    this.props.listPublishers(payload);
  }

  updateCallback = () => {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master };
    this.renderPublishers(payload);
  };

  deletePublisher = id => {
    this.props.deletePublisher(id);
  };

  handleTabs = name => {
    this.props.changePublishers({ prop: 'activeItem', value: name });
   
    const { searchTerm, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    let currentPage = 1;
    const payload = { searchTerm, sortDirection, sortBy, currentPage, pageChunk, master};

    switch(name) {
      case 'PUBLISHERS':
        this.props.listPublishers(payload);
        break;
      case 'DISABLED':
        this.props.listDisabledPublishers(payload);
        break;
    }
  };

  editPublisher = id => {
    this.props.readPublisher(id);
    this.props.modalStateChange({ prop: 'modalStatus', value: 'edit' });
    this.props.modalStateChange({ prop: 'showPublisher', value: true });
  };

  showConfirmAction = (id, action) => {
    this.props.modalStateChange({ prop: 'id', value: id });
    this.props.modalStateChange({ prop: 'showConfirmAction', value: true });
    if (action === "delete") {
      this.props.modalStateChange({ prop: 'header', value: 'Are you sure you want to delete the publisher?' });
      this.props.modalStateChange({ prop: 'message', value: 'Deleted publishers cannot be recovered' });
      this.props.modalStateChange({ prop: 'callback', value: this.deletePublisher });
    }
  };

  showAlert = msg => {
    this.props.modalStateChange({ prop: 'showAlert', value: true });
    this.props.modalStateChange({ prop: 'error', value: true });
    this.props.modalStateChange({ prop: 'errorMessage', value: msg });
  };

  createPublisher = () => {
    this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
    this.props.modalStateChange({ prop: 'showPublisher', value: true });
  };

  renderTableBody = () => {
    const { cursorStyle } = styles;
    const { publishers, activeItem } = this.props;

    return publishers.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td >
            <Popup
              trigger={<Link to={`/ui/publisher/${item.id}`}>
                {item.name}
              </Link>}
              content={item.name}
              flowing
            />
          </td>
          <td>{moment(moment.unix(item.created_at)).format('MM-DD-YYYY')}</td>
          { activeItem === 'PUBLISHERS' ? <td>
            <Popup trigger={<Icon style={cursorStyle} name="edit" onClick={this.editPublisher.bind(null, item.id)} />} size='mini' content="Edit Publisher" />
            { !item.placements.length ? <Popup trigger={<Icon style={cursorStyle} name="trash" onClick={this.showConfirmAction.bind(null, item.id, 'delete')} />} size='mini' content="Delete Publisher" /> : null }
            { item.placements.length ? <Popup trigger={<Icon style={cursorStyle} name={'trash'} onClick={this.showAlert.bind(null, 'Publisher has placements. Please delete all the placements before deleting the publisher')} />} size={'mini'} content={'Delete Publisher'} /> : null }
          </td> : null }
        </tr>
      )
    })
  };

  renderPublishers = payload => {
    const { activeItem } = this.props;

    switch(activeItem) {
      case 'PUBLISHERS':
        this.props.listPublishers(payload);
        break;
      case 'DISABLED':
        this.props.listDisabledPublishers(payload);
        break;
    }
  };

  searchPublishers = (event) => {
    this.props.changePublishers({ prop: 'searchTerm', value: event.target.value });
    this.props.changePublishers({ prop: 'currentPage', value: 1 });
    const { sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { sortBy, sortDirection, pageChunk, searchTerm: event.target.value, master, currentPage: 1 };
    this.renderPublishers(payload);
  };

  handlePagination = currentPage => {
    const { searchTerm, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    this.props.changePublishers({ prop: 'currentPage', value: currentPage });
    let payload = { searchTerm, sortBy, sortDirection, pageChunk, currentPage, master  };
    this.renderPublishers(payload);
  };

  handleSort = (event) => {
    
    const { searchTerm, currentPage, pageChunk, sortDirection, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { searchTerm, master, currentPage, pageChunk, sortBy: event.target.id, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' };
    this.props.changePublishers({ prop: 'idSort', value: event.target.id === "id" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changePublishers({ prop: 'nameSort', value: event.target.id === "name" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changePublishers({ prop: 'created_atSort', value: event.target.id === "created_at" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changePublishers({ prop: 'sortBy', value: event.target.id });
    this.props.changePublishers({ prop: 'sortDirection', value: payload.sortDirection });
   
    this.renderPublishers(payload);
  };

  render() {
    const { searchStyle, cursorStyle, dimmerStyle, divStyle } = styles;
    const { activeItem, publishers, searchTerm, loader, idSort, nameSort, listError, created_atSort, pagination, activeUser } = this.props;

    return (
      <Col md={12} lg={12} xl={12}>
        <ModalManager currentModal={'PUBLISHER'} update={this.updateCallback} />
        <ModalManager currentModal={'CONFIRM_ACTION'} update={this.updateCallback} />
        <ModalManager currentModal={'ALERT'} update={this.updateCallback} />
        <Card>
          {loader ? <Dimmer active inverted style={dimmerStyle}><div className='loader'> </div></Dimmer>  : null}
          <CardBody>
            <div className='tabs tabs--bordered-bottom'>
              <div className='tabs__wrap'>

                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeItem === "PUBLISHERS" })}
                      onClick={this.handleTabs.bind(null, 'PUBLISHERS')}
                      name='PUBLISHERS'
                    >
                      Publishers
                    </NavLink>
                  </NavItem>
                 
                  <NavItem>
                    {activeUser.user.role & ROLE_SUPERADMIN || activeUser.user.role & ROLE_OPSADMIN ? <NavLink
                      className={classnames({ active: activeItem === "DISABLED" })}
                      onClick={this.handleTabs.bind(null, 'DISABLED')}
                      name='DISABLED'
                    >
                      Disabled
                    </NavLink> : null}
                  </NavItem >
                  <NavItem style={{ backgroundColor: '#e3f1f9', borderRadius: '10px' }}>
                    <NavLink onClick={this.createPublisher}>
                      New Publisher
                    </NavLink>
                  </NavItem>
                  <NavItem style={{ marginLeft: 'auto', marginRight: 0 }}> <Input value={searchTerm} placeholder="Search" onChange={this.searchPublishers} style={{ marginBottom: '3px' }} /></NavItem>
                </Nav>
                {!loader && publishers.length ? <div>
                  <Table responsive className='table--bordered dashboard__table-crypto'>
                    <thead>
                      <tr>
                        <th style={{ width: '10%' }}>ID <Icon color={idSort === "sort" ? "black" : "blue"} name={idSort} id="id" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th >Publisher <Icon color={nameSort === "sort" ? "black" : "blue"} name={nameSort} id="name" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th style={{ width: '15%' }}>Created Date <Icon color={created_atSort === "sort" ? "black" : "blue"} name={created_atSort} id="created_at" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th style={{ width: '15%' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderTableBody()}
                    </tbody>
                  </Table>
                  <Paginator pagination={pagination} handlePagination={this.handlePagination} />
                </div> : <Alert color='info' className='alert--neutral' icon>
                    <p><span className='bold-text'>Information:</span>There are no publishers matching the criteria</p>
                  </Alert>}
              </div>
            </div>
          </CardBody>
          {listError ? <Alert color='danger' className='alert--neutral' icon>
            <p><span className='bold-text'>Warning!</span> Cannot display publishers at this time. Please try again later</p>
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
  const { publishers, activeItem, searchTerm, sortBy, sortDirection, currentPage, pageChunk, idSort, nameSort, created_atSort, loader, listError, pagination } = state.publishers;
  const { activeUser } = state.shared;

  return { publishers, activeItem, searchTerm, sortBy, sortDirection, currentPage, pageChunk, idSort, nameSort, created_atSort, loader, listError, pagination, activeUser };
};

export default connect(mapStateToProps, { readActiveUser,  listPublishers, deletePublisher, changePublishers, readPublisher, modalStateChange, listDisabledPublishers })(PublishersGrid);

