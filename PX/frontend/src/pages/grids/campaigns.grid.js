import React, { Component } from 'react';
import { connect } from 'react-redux';
import { listCampaigns, deleteCampaign,readCampaignTag, readCampaign, listCampaignAdvertisers, deactivateCampaign, activateCampaign, listActiveCampaigns, listDisabledCampaigns, listInactiveCampaigns, changeCampaigns } from "../../redux/actions/campaign.actions";
import { withRouter } from 'react-router';
import { modalStateChange } from "../../redux/actions/modals.actions";
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Input } from 'reactstrap';
import Alert from '../../components/Alert'
import Table from '../../components/table/Table';
import ModalManager from '../../modals/modal.manager';
import Paginator from '../../app/paginator';
import { readActiveUser } from '../../redux/actions/user.actions';
import { Popup, Icon, Dimmer } from 'semantic-ui-react';
import classnames from 'classnames';


class CampaignsGrid extends Component {
  state = {
    popoverOpenEdit: false,
    popoverOpenDelete: false
  };
  componentWillMount() {
    this.props.readActiveUser();
  }

  componentDidMount() {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { searchTerm, master, currentPage, sortBy, sortDirection, pageChunk };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.props.listCampaigns(payload);
  }

  updateCallback = () => {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.renderCampaigns(payload);
  };
  showPixelTag =(id)=> {
    this.props.readCampaignTag(id);
    this.props.modalStateChange({ prop: 'showPixelTag', value: true });
  }
  deleteCampaign = id => {
    this.props.deleteCampaign(id);
  };

  handleTabs = name => {
    this.props.changeCampaigns({ prop: 'activeItem', value: name });
    const { searchTerm, sortBy, sortDirection, pageChunk, match,
      activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    let currentPage = 1;
    const payload = { master, searchTerm, sortDirection, sortBy, currentPage, pageChunk };
   
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }

    switch(name) {
      case 'ALL':
        this.props.listCampaigns(payload);
        break;
      case 'ACTIVE':
        this.props.listActiveCampaigns(payload);
        break;
      case 'INACTIVE':
        this.props.listInactiveCampaigns(payload);
        break;
      case 'DISABLED':
        this.props.listDisabledCampaigns(payload);
        break;
    }
  };

  editCampaign = id => {
    this.props.readCampaign(id);
    let master = this.props.activeUser.scope_account.is_zone_master;
    this.props.listCampaignAdvertisers(master);
    this.props.modalStateChange({ prop: 'modalStatus', value: 'edit' });
    this.props.modalStateChange({ prop: 'showCampaign', value: true });
  };

  showConfirmAction = (id, action) => {
    this.props.modalStateChange({ prop: 'id', value: id });
    this.props.modalStateChange({ prop: 'showConfirmAction', value: true });
    if (action === "delete") {
      this.props.modalStateChange({ prop: 'header', value: 'Are you sure you want to delete the campaign?' });
      this.props.modalStateChange({ prop: 'message', value: 'Deleted campaigns cannot be recovered' });
      this.props.modalStateChange({ prop: 'callback', value: this.deleteCampaign });
    }
  };

  showAlert = msg => {
    this.props.modalStateChange({ prop: 'showAlert', value: true });
    this.props.modalStateChange({ prop: 'error', value: true });
    this.props.modalStateChange({ prop: 'errorMessage', value: msg });
  };

  createCampaign = () => {
    let master = this.props.activeUser.scope_account.is_zone_master;
    this.props.listCampaignAdvertisers(master);
    if (this.props.match.params.id) {
      this.props.modalStateChange({ prop: 'advertiserId', value: Number(this.props.match.params.id) });
    }
    this.props.modalStateChange({ prop: 'startDate', value: moment().format('YYYY-MM-DD') });
    this.props.modalStateChange({ prop: 'startTime', value: moment().format('HH:mm') });
    this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
    this.props.modalStateChange({ prop: 'showCampaign', value: true });
  };

  renderTableBody = () => {
    const { cursorStyle } = styles;
    const { campaigns, activeItem, match } = this.props;

    return campaigns.map((item, index) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td >
            <Popup
              trigger={<Link to={`/ui/campaign/${item.id}`}>
                {item.name}
              </Link>}
              content={item.name}
              flowing
            />
          </td>
          { !match.params.id ? <td>{item.advertiser.id}</td> : null }
          { !match.params.id ? <td >
            <Popup
              trigger={<Link to={`/ui/advertiser/${item.advertiser.id}`}>
                {item.advertiser.name}
              </Link>}
              content={item.advertiser.name}
              flowing
            />
          </td> : null }
          <td>{moment(moment.unix(item.start_time)).format('MM-DD-YYYY')}</td>
          <td>{moment(moment.unix(item.end_time)).format('MM-DD-YYYY')}</td>
          { item.status === 'active' && !item.flights.length ? <td>
            <Popup trigger={<Icon style={cursorStyle} name="check circle" color="green" size="large" onClick={this.deactivateCampaign.bind(null, item.id, index)} />} size="mini" content="Deactivate Campaign" />
          </td> : null }
          { item.status === 'active' && item.flights.length ? <td>
            <Popup trigger={<Icon style={cursorStyle} name="check circle" size={'large'} color={'green'} onClick={this.showConfirmAction.bind(null, item.id, 'deactivate')} />} size='mini' content="Deactivate Campaign" />
          </td> : null }
          { item.status === 'inactive' ? <td>
            <Popup trigger={<Icon style={cursorStyle} name="remove circle" size={'large'} color={'red'} onClick={this.activateCampaign.bind(null, item.id, index)} />} size='mini' content="Activate Campaign" />
          </td> : null }
          { item.status === 'complete' ? <td>
            <Popup trigger={<Icon style={cursorStyle} name="remove circle" size={'large'} color={'red'} onClick={this.editCampaign.bind(null, item.id)} />} size='mini' content="Activate Campaign" />
          </td> : null }
          { activeItem !== 'DISABLED' ? <td>
            <Popup trigger={<Icon style={cursorStyle} name="edit" onClick={this.editCampaign.bind(null, item.id)} />} size='mini' content="Edit Campaign" />
            <Popup trigger={<Icon style={cursorStyle} name={'tag'} onClick={this.showPixelTag.bind(null, item.id)} />} size={'mini'} content={'Pixel Tag'} />
            { !item.flights.length ? <Popup trigger={<Icon style={cursorStyle} name="trash" onClick={this.showConfirmAction.bind(null, item.id, 'delete')} />} size='mini' content="Delete Campaign" /> : null }
            { item.flights.length ? <Popup trigger={<Icon style={cursorStyle} name={'trash'} onClick={this.showAlert.bind(null, 'Campaign has flights. Please delete all the flights before deleting the campaign')} />} size={'mini'} content={'Delete Campaign'} /> : null }
          </td> : null }
        </tr>
      )
    })
  };

  deactivateCampaign = (id, index) => {
    const { campaigns } = this.props;
    let arr = [...campaigns];
    arr[index].status = 'inactive';
    this.props.changeCampaigns({ prop: 'campaigns', value: arr });
    this.props.deactivateCampaign(id);
  };

  activateCampaign = (id, index) => {
    const { campaigns } = this.props;
    let arr = [...campaigns];
    arr[index].status = 'active';
    this.props.changeCampaigns({ prop: 'campaigns', value: arr });
    this.props.activateCampaign(id);
  };

  renderCampaigns = payload => {
    const { activeItem } = this.props;

    switch(activeItem) {
      case 'ALL':
        this.props.listCampaigns(payload);
        break;
      case 'ACTIVE':
        this.props.listActiveCampaigns(payload);
        break;
      case 'INACTIVE':
        this.props.listInactiveCampaigns(payload);
        break;
      case 'DISABLED':
        this.props.listDisabledCampaigns(payload);
        break;
    }
  };

  searchCampaigns = event => {
    this.props.changeCampaigns({ prop: 'searchTerm', value: event.target.value });
    this.props.changeCampaigns({ prop: 'currentPage', value: 1 });
    const { sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;

    const payload = { master, sortBy, sortDirection, pageChunk, searchTerm: event.target.value, currentPage: 1 };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.renderCampaigns(payload);
  };

  handlePagination = currentPage => {
    const { searchTerm, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    this.props.changeCampaigns({ prop: 'currentPage', value: currentPage });
    let payload = { master, searchTerm, sortBy, sortDirection, pageChunk, currentPage };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.renderCampaigns(payload);
  };

  handleSort = (event) => {
    const { searchTerm, currentPage, pageChunk, sortDirection, match, activeUser} = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { master, searchTerm, currentPage, pageChunk, sortBy: event.target.id, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' };
    if (match.params.id) {
      payload.id = Number(match.params.id);
    }
    this.props.changeCampaigns({ prop: 'idSort', value: event.target.id === "id" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeCampaigns({ prop: 'nameSort', value: event.target.id === "name" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeCampaigns({ prop: 'start_timeSort', value: event.target.id === "start_time" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeCampaigns({ prop: 'end_timeSort', value: event.target.id === "end_time" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeCampaigns({ prop: 'statusSort', value: event.target.id === "status" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeCampaigns({ prop: 'sortBy', value: event.target.id });
    this.props.changeCampaigns({ prop: 'sortDirection', value: payload.sortDirection });

    this.renderCampaigns(payload);
  };

  getColumnSpan = () => {
    const { activeItem, match } = this.props;

    let number = 8;
    if (activeItem === 'DISABLED') {
      number--;
    }
    if (match.params.id) {
      number -= 2;
    }
    return number;
  };

  render() {
    const { match, activeUser, activeItem, campaigns, searchTerm, loader, idSort, nameSort, listError, start_timeSort, end_timeSort, statusSort, pagination } = this.props;
    const { cursorStyle, dimmerStyle } = styles;
    return (
      <Col md={12} lg={12} xl={12}>
        <ModalManager currentModal={'CAMPAIGN'} update={this.updateCallback} />
        <ModalManager currentModal={'CONFIRM_ACTION'} update={this.updateCallback} />
        <ModalManager currentModal={'ALERT'} update={this.updateCallback} />
        <ModalManager currentModal={'PIXEL_TAG'} />
        <Card>
          {loader ? <Dimmer active inverted style={dimmerStyle}><div className='loader'> </div></Dimmer>  : null}
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
                    <NavLink
                      className={classnames({ active: activeItem === "DISABLED" })}
                      onClick={this.handleTabs.bind(null, 'DISABLED')}
                    >
                      Disabled
                    </NavLink>
                  </NavItem >
                  <NavItem style={{ backgroundColor: '#e3f1f9', borderRadius: '10px' }}>
                    <NavLink onClick={this.createCampaign}>
                      New Campaign
                    </NavLink>
                  </NavItem>
                  <NavItem style={{ marginLeft: 'auto', marginRight: 0 }}> <Input value={searchTerm} placeholder="Search" onChange={this.searchCampaigns} style={{ marginBottom: '3px' }} /></NavItem>
                </Nav>
                {!loader && campaigns.length ? <div>
                  <Table responsive className='table--bordered dashboard__table-crypto'>
                    <thead>
                      <tr>
                        <th >ID <Icon color={idSort === "sort" ? "black" : "blue"} name={idSort} id="id" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th >Campaign <Icon color={nameSort === "sort" ? "black" : "blue"} name={nameSort} id="name" onClick={this.handleSort} style={cursorStyle} /></th>
                        { !match.params.id ?  <th>ID</th> :null}
                       { !match.params.id ?  <th>Advertiser</th>:null}
                        <th >Start Date <Icon color={start_timeSort === "sort" ? "black" : "blue"} name={start_timeSort} id="start_time" onClick={this.handleSort} style={cursorStyle} /></th>
                        <th >End Date <Icon color={end_timeSort === "sort" ? "black" : "blue"} name={end_timeSort} id="end_time" onClick={this.handleSort} style={cursorStyle} /></th>
                        {activeItem !== 'DISABLED' ? <th>Status </th> : null}
                        {activeItem !== 'DISABLED' ? <th>Action</th> : null}
                 
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderTableBody()}
                    </tbody>
                  </Table>
                  <Paginator pagination={pagination} handlePagination={this.handlePagination} />
                </div> : <Alert color='info' className='alert--neutral' icon>
                    <p><span className='bold-text'>Information:</span> There are no campaigns matching the criteria</p>
                  </Alert>}
              </div>
            </div>
          </CardBody>
          {listError ? <Alert color='danger' className='alert--neutral' icon>
            <p><span className='bold-text'>Warning!</span> Cannot display campaigns at this time. Please try again later</p>
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
  const { activeUser } = state.shared;
  const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, activeItem, campaigns, loader, idSort, nameSort, listError, start_timeSort, end_timeSort, statusSort, pagination } = state.campaigns;

  return { activeUser, searchTerm, currentPage, sortBy, sortDirection, pageChunk, activeItem, campaigns, loader, idSort, nameSort, listError, start_timeSort, end_timeSort, statusSort, pagination };
};

export default withRouter(connect(mapStateToProps, { readActiveUser, readCampaignTag, listCampaigns, deleteCampaign, readCampaign, listCampaignAdvertisers, modalStateChange, deactivateCampaign, activateCampaign, listActiveCampaigns, listDisabledCampaigns, listInactiveCampaigns, changeCampaigns })(CampaignsGrid));