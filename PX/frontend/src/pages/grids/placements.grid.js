import React, { Component } from 'react';
import { connect } from 'react-redux';
import { listPlacements, deletePlacement, readPlacement, listPlacementPublishers, deactivatePlacement, activatePlacement, listActivePlacements, listDisabledPlacements, listInactivePlacements, changePlacements, readPlacementTag, readPlacementPlayerTag, listDemand, getDemandList, changePlacement } from "../../redux/actions/placement.actions";
import { withRouter } from 'react-router';
import { modalStateChange } from "../../redux/actions/modals.actions";
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Popup, Icon, Dimmer } from 'semantic-ui-react';
import ModalManager from '../../modals/modal.manager';
import Alert from '../../components/Alert'
import Table from '../../components/table/Table';
import Paginator from '../../app/paginator';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Input } from 'reactstrap';
import { ROLE_SUPERADMIN, ROLE_OPSADMIN } from "../../roles";
import { capitalize } from "../../functions";
import { readActiveUser } from '../../redux/actions/user.actions';
import classnames from 'classnames';

class PlacementsGrid extends Component {
  componentWillMount() {
    this.props.readActiveUser();
  }
  componentDidMount() {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.props.listPlacements(payload);
  }

  updateCallback = () => {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.renderPlacements(payload);
  };

  deletePlacement = (id) => {
    this.props.deletePlacement(id);
  };

  handleTabs = name => {
    this.props.changePlacements({ prop: 'activeItem', value: name });
    const { searchTerm, sortBy, sortDirection, pageChunk, match, activeUser} = this.props;
    let currentPage = 1;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { searchTerm, sortDirection, sortBy, currentPage, pageChunk, master };
    
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }

    switch(name) {
      case 'ALL':
        this.props.listPlacements(payload);
        break;
      case 'ACTIVE':
        this.props.listActivePlacements(payload);
        break;
      case 'INACTIVE':
        this.props.listInactivePlacements(payload);
        break;
      case 'DISABLED':
        this.props.listDisabledPlacements(payload);
        break;
    }
  };

  editPlacement = id => {
    this.props.history.push(`/ui/placement/update/${id}`);
  };

  showConfirmAction = (id, action) => {
    this.props.modalStateChange({ prop: 'id', value: id });
    this.props.modalStateChange({ prop: 'showConfirmAction', value: true });
    if (action === "delete") {
      this.props.modalStateChange({ prop: 'header', value: 'Are you sure you want to delete the placement?' });
      this.props.modalStateChange({ prop: 'message', value: 'Deleted placements cannot be recovered' });
      this.props.modalStateChange({ prop: 'callback', value: this.deletePlacement });
    }
  };

  showAlert = msg => {
    this.props.modalStateChange({ prop: 'showAlert', value: true });
    this.props.modalStateChange({ prop: 'error', value: true });
    this.props.modalStateChange({ prop: 'errorMessage', value: msg });
  };

  createPlacement = () => {
    const { activePublisher } = this.props;
    if (activePublisher) {
      this.props.changePlacement({ prop: 'publisherId', value: activePublisher.id });
    }
    this.props.history.push(`/ui/placement/create/new`);
  };

  clonePlacement = id => {
    this.props.history.push(`/ui/placement/create/${id}`);
  };

  renderTableBody = () => {
    const { iconStyle, cursorStyle } = styles;
    const { match, placements, activeItem } = this.props;

    return placements.map((item, index) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td >
            <Popup
              trigger={<Link to={`/ui/placement/update/${item.id}`}>
                {item.name}
              </Link>}
              content={item.name}
              flowing
            />
          </td>
          { !match.params.id ? <td >{item.publisher.id}</td> : null }
          { !match.params.id ? <td>
            <Popup
              trigger={<Link to={`/ui/publisher/${item.publisher.id}`}>
                {item.publisher.name}
              </Link>}
              content={item.publisher.name}
              flowing
            />
          </td> : null }
          <td>{this.getChannelIcon(item.channel)}</td>
          <td>{item.format === "display" ? <Icon style={iconStyle} name="picture" /> : <Icon name="video" style={iconStyle}/>}</td>
          <td>{item.format === "display" ? item.width + 'x' + item.height : this.renderPlayerSizes(item.player_size)}</td>
          <td>{(item.cpm / 100).toFixed(2)}</td>
          <td>{moment(moment.unix(item.created_at)).format('MM-DD-YYYY')}</td>
          { item.status === "active" ? <td><Popup trigger={<Icon style={cursorStyle} name="check circle" color="green" size="large" onClick={this.deactivatePlacement.bind(null, item.id, index)} />} size="mini" content="Deactivate placement" /></td> : null }
          { item.status === "inactive" ? <td><Popup trigger={<Icon style={cursorStyle} name="remove circle" color="red" size="large" onClick={this.activatePlacement.bind(null, item.id, index)} />} size="mini" content="Activate Placement" /></td> : null }
          { item.status === "complete" ? <td><Popup trigger={<Icon onClick={this.showAlert.bind(null, 'This placement reached its opportunity cap. To activate it again please update the placement with new caps.')} color="red" name="remove circle" size="large" />} size='mini' content="Activate Placement" /></td> : null }
          { activeItem !== 'DISABLED' ? <td>
            <Popup trigger={<Icon style={cursorStyle} name="edit" onClick={this.editPlacement.bind(null, item.id)} />} size='mini' content="Edit Placement" />
            <Popup trigger={<Icon style={cursorStyle} name="trash" onClick={this.showConfirmAction.bind(null, item.id, 'delete')} />} size='mini' content="Delete Placement" />
            <Popup trigger={<Icon style={cursorStyle} name={'tag'} onClick={this.showPlacementTag.bind(null, item.id)} />} size={'mini'} content={'Display Tag'} />
            <Popup trigger={<Icon style={cursorStyle} name={'clone'} onClick={this.clonePlacement.bind(null, item.id)} />} size={'mini'} content={'Clone Placement'} />
            <Popup trigger={<Icon style={cursorStyle} name={'arrow circle left'} onClick={this.addDemand.bind(null, item.id, item.name, item.demand_prioritization_type )} />} size={'mini'} content={'Demand'} />

          </td> : null }
        </tr>
      )
    })
  };

  renderPlayerSizes = players => {
    return players.map(item => {
      return capitalize(item);
    }).join(', ');
  };

  getChannelIcon = (channel) => {
    const { iconStyle, mobileIcon } = styles;

    switch(channel) {
      case "desktop":
        return <Icon name="desktop" style={iconStyle} />;
      case "mobile_web":
      case "mobile_app":
        return <Icon name="mobile" size='large' style={mobileIcon} />;
      case "ctv":
        return <Icon name="tv" style={iconStyle} />;
    }
  };

  activatePlacement = (id, index) => {
    const { placements } = this.props;
    let arr = [...placements];
    arr[index].status = 'active';
    this.props.changePlacements({ prop: 'placements', value: arr });
    this.props.activatePlacement(id);
  };

  deactivatePlacement = (id, index) => {
    const { placements } = this.props;
    let arr = [...placements];
    arr[index].status = 'inactive';
    this.props.changePlacements({ prop: 'placements', value: arr });
    this.props.deactivatePlacement(id);
  };

  renderPlacements = payload => {
    const { activeItem } = this.props;

    switch(activeItem) {
      case 'ALL':
        this.props.listPlacements(payload);
        break;
      case 'ACTIVE':
        this.props.listActivePlacements(payload);
        break;
      case 'INACTIVE':
        this.props.listInactivePlacements(payload);
        break;
      case 'DISABLED':
        this.props.listDisabledPlacements(payload);
        break;
    }
  };

  showPlacementTag = id => {
    this.props.readPlacementTag(id);
    this.props.readPlacementPlayerTag(id);
    this.props.modalStateChange({ prop: 'showDisplayTag', value: true });
  };

  showPlayerPlacementTag = id => {
    this.props.readPlacementPlayerTag(id);
    this.props.modalStateChange({ prop: 'showDisplayTag', value: true });
  };

  addDemand = (id, name, demandPrioritization) => {
    let master = this.props.activeUser.scope_account.is_zone_master;
    this.props.listDemand(id, '', master);
    this.props.getDemandList(id, master);
    this.props.modalStateChange({ prop: 'id', value: id });
    this.props.modalStateChange({ prop: 'name', value: name });
    this.props.modalStateChange({ prop: 'demand_prioritization_type', value: demandPrioritization});
    this.props.modalStateChange({ prop: 'activeItem', value: 'FLIGHTS' });
  };

  searchPlacements = event => {
    this.props.changePlacements({ prop: 'searchTerm', value: event.target.value });
    this.props.changePlacements({ prop: 'currentPage', value: 1 });
    const { sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { sortBy, master, sortDirection, pageChunk, searchTerm: event.target.value, currentPage: 1 };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.renderPlacements(payload);
  };

  handlePagination = currentPage => {
    const { searchTerm, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    this.props.changePlacements({ prop: 'currentPage', value: currentPage });
    let payload = { searchTerm, sortBy, sortDirection, pageChunk, currentPage, master };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.renderPlacements(payload);
  };

  handleSort = (event) => {
    const { searchTerm, currentPage, pageChunk, sortDirection, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { master, searchTerm, currentPage, pageChunk, sortBy: event.target.id, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.props.changePlacements({ prop: 'idSort', value: event.target.id === "id" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changePlacements({ prop: 'nameSort', value: event.target.id === "name" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changePlacements({ prop: 'created_atSort', value: event.target.id === "created_at" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changePlacements({ prop: 'channelSort', value: event.target.id === "channel" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changePlacements({ prop: 'formatSort', value: event.target.id === "format" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changePlacements({ prop: 'statusSort', value: event.target.id === "status" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changePlacements({ prop: 'sortBy', value: event.target.id });
    this.props.changePlacements({ prop: 'sortDirection', value: payload.sortDirection });

    this.renderPlacements(payload);
  };

  getColumnSpan = () => {
    const { activeItem, match } = this.props;

    let number = 11;
    if (activeItem === 'DISABLED') {
      number -= 2;
    }
    if (match.params.id) {
      number -= 2;
    }
    return number;
  };

  render() {
    const { searchStyle, cursorStyle, dimmerStyle, divStyle } = styles;
    const { activeItem, placements, searchTerm, loader, idSort, nameSort, listError, created_atSort, channelSort, formatSort, statusSort, pagination, activeUser, match } = this.props;

    return (
      <Col md={12} lg={12} xl={12}>
        <ModalManager currentModal={'CONFIRM_ACTION'} update={this.updateCallback} />
        <ModalManager currentModal={'ALERT'} update={this.updateCallback} />
        <ModalManager currentModal={'DISPLAY_TAG'} />
        <ModalManager currentModal={'ADD_DEMAND'} />
        <Card>
          {loader ? <Dimmer active inverted style={dimmerStyle}><div className='loader'> </div></Dimmer> : null}
          <CardBody>
            <div className='tabs tabs--bordered-bottom'>
              <div className='tabs__wrap'>

                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeItem === "ALL" })}
                      onClick={this.handleTabs.bind(null, 'ALL')}
                    >
                      All
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeItem === "ACTIVE" })}
                      onClick={this.handleTabs.bind(null, 'ACTIVE')}
                    >
                      Active
                    </NavLink>
                  </NavItem >
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeItem === "INACTIVE" })}
                      onClick={this.handleTabs.bind(null, 'INACTIVE')}
                    >
                      Inactive
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    {activeUser.user.role & ROLE_SUPERADMIN || activeUser.user.role & ROLE_OPSADMIN ?  <NavLink
                      className={classnames({ active: activeItem === "DISABLED" })}
                      onClick={this.handleTabs.bind(null, 'DISABLED')}
                    >
                      Disabled
                    </NavLink>:null}
                  </NavItem >
                  <NavItem style={{ backgroundColor: '#e3f1f9', borderRadius: '10px' }}>
                    <NavLink onClick={this.createPlacement}>
                      New Placements
                    </NavLink>
                  </NavItem>
                  <NavItem style={{ marginLeft: 'auto', marginRight: 0 }}> <Input value={searchTerm} placeholder="Search" onChange={this.searchPlacements} style={{ marginBottom: '3px' }} /></NavItem>
                </Nav>
                {!loader && placements.length  ? <div>
                  <Table responsive className='table--bordered dashboard__table-crypto'>
                    <thead>
                      <tr>
                        <th >ID <Icon color={idSort === "sort" ? "black" : "blue"} name={idSort} id="id" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th >Placement <Icon color={nameSort === "sort" ? "black" : "blue"} name={nameSort} id="name" onClick={this.handleSort} style={cursorStyle} /></th>
                        {!match.params.id ? <th  >ID</th> : null}
                        {!match.params.id ? <th >Publisher</th> : null}
                        <th >Channel <Icon color={channelSort === "sort" ? "black" : "blue"} name={channelSort} id="channel" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th >Format <Icon color={formatSort === "sort" ? "black" : "blue"} name={formatSort} id="format" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th >Size</th>
                        <th >CPM</th>
                        <th >Created Date <Icon color={created_atSort === "sort" ? "black" : "blue"} name={created_atSort} id="created_at" onClick={this.handleSort} style={cursorStyle} /></th>
                        {activeItem !== 'DISABLED' ? <th >Status <Icon color={statusSort === "sort" ? "black" : "blue"} name={statusSort} id="status" onClick={this.handleSort} style={cursorStyle} /></th> : null}
                        {activeItem !== 'DISABLED' ? <th >Action</th> : null}
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderTableBody()}
                    </tbody>
                  </Table>
                  <Paginator pagination={pagination} handlePagination={this.handlePagination} />
                </div> : <Alert color='info' className='alert--neutral' icon>
                    <p><span className='bold-text'>Information:</span> There are no placements matching the criteria</p>
                  </Alert>}
              </div>
            </div>
          </CardBody>
          {listError ? <Alert color='danger' className='alert--neutral' icon>
            <p><span className='bold-text'>Warning!</span> Cannot display placements at this time. Please try again later</p>
          </Alert> : null}
        </Card>
      </Col>
    )
  }
}

const styles = {
  iconStyle: {
    marginLeft: "15px"
  },
  mobileIcon: {
    marginLeft: '11px'
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
    height: "100%"
  },
  divStyle: {
    marginTop: 20
  }
};

const mapStateToProps = state => {
  const { placements, activeItem, searchTerm, sortBy, sortDirection, currentPage, pageChunk, idSort, nameSort, channelSort, formatSort, statusSort, created_atSort, loader, listError, pagination } = state.placements;
  const { activeUser } = state.shared;
  const { activePublisher } = state.publishers;

  return { placements, activeItem, searchTerm, sortBy, sortDirection, currentPage, pageChunk, idSort, nameSort, channelSort, formatSort, statusSort, created_atSort, loader, listError, pagination, activeUser, activePublisher };
};

export default withRouter(connect(mapStateToProps, { readActiveUser, listPlacements, deletePlacement, readPlacement, listPlacementPublishers, deactivatePlacement, activatePlacement, listActivePlacements, listDisabledPlacements, listInactivePlacements, changePlacements, readPlacementTag, readPlacementPlayerTag, listDemand, getDemandList, modalStateChange, changePlacement })(PlacementsGrid));
