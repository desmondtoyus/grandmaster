import React, { Component } from 'react';
import { connect } from 'react-redux';
import { listFlights, listPausedFlights, deleteFlight, listActiveFlights, listInactiveFlights, listDisabledFlights, activateFlight, deactivateFlight, pauseFlight, disableFlight, changeFlights, changeFlight, getSupplyList, listSupply, checkIflight } from '../../redux/actions/flight.actions';
import { Link } from 'react-router-dom';
import { Popup, Icon, Dimmer } from 'semantic-ui-react';
import Table from '../../components/table/Table';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Input } from 'reactstrap';
import moment from 'moment';
import { withRouter } from 'react-router';
import ModalManager from '../../modals/modal.manager';
import Paginator from '../../app/paginator';
import { ROLE_SUPERADMIN, ROLE_OPSADMIN } from "../../roles";
import { modalStateChange } from "../../redux/actions/modals.actions";
import { readActiveUser } from '../../redux/actions/user.actions';
import classnames from 'classnames';
import Alert from '../../components/Alert'

class IFlightsGrid extends Component {
    state = {
        tab: '',
        dsp:''
    }
    componentWillMount() {
        this.props.readActiveUser();
        this.setState({ dsp: this.getDspName().toLowerCase()})
        this.props.checkIflight(true, this.getDspName().toLowerCase(), 'rtb');
    }

    componentDidMount() {
        const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
        let master = activeUser.scope_account.is_zone_master;
        let dsp = this.state.dsp;
        const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master, dsp };
        if (match.params.id) {
            payload.id = Number(match.params.id);
        }
        
        this.props.listFlights(payload);
    }

    getDspName = () => {
   let link = window.location.href;
   let linkArr = link.split('/');
   return linkArr[linkArr.length -1];
    }

    updateCallback = () => {
        const { searchTerm, currentPage, pagination, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
        let master = activeUser.scope_account.is_zone_master;
        let dsp = this.state.dsp;
        const payload = { master, searchTerm, currentPage, sortBy, sortDirection, pageChunk, dsp };
        if (match.params.id) {
            payload.id = Number(match.params.id);
        }
        this.renderFlights(payload);
    };

    deleteFlight = id => {
        this.props.deleteFlight(id);
    };

    editFlight = id => {
        this.props.history.push(`/ui/flight/update/${id}`);
    };

    showConfirmAction = (id, action) => {
        this.props.modalStateChange({ prop: 'id', value: id });
        this.props.modalStateChange({ prop: 'showConfirmAction', value: true });
        if (action === "delete") {
            this.props.modalStateChange({ prop: 'header', value: 'Are you sure you want to delete the flight?' });
            this.props.modalStateChange({ prop: 'message', value: 'Deleted flights cannot be recovered' });
            this.props.modalStateChange({ prop: 'callback', value: this.deleteFlight });
        }
    };

    showAlert = msg => {
        this.props.modalStateChange({ prop: 'showAlert', value: true });
        this.props.modalStateChange({ prop: 'error', value: true });
        this.props.modalStateChange({ prop: 'errorMessage', value: msg });
    };

    handleTabs = name => {
        this.props.changeFlights({ prop: 'activeItem', value: name });
        const currentPage = 1;
        const { searchTerm, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
        let master = activeUser.scope_account.is_zone_master;
        let dsp = this.state.dsp;
        const payload = { master, searchTerm, sortBy, currentPage, sortDirection, pageChunk, dsp };
        if (match.params.id) {
            payload.id = Number(match.params.id);
        }
        switch (name) {
            case 'ALL':
                this.setState({ tab: "ALL" })
                this.props.listFlights(payload);
                break;
            case 'ACTIVE':
                this.setState({ tab: 'ACTIVE' })
                this.props.listActiveFlights(payload);
                break;
            case 'INACTIVE':
                this.setState({ tab: 'INACTIVE' })
                this.props.listInactiveFlights(payload);
                break;
            case 'DISABLED':
                this.setState({ tab: 'DISABLED' })
                this.props.listDisabledFlights(payload);
                break;
            case 'PAUSED':
                this.setState({ tab: 'PAUSED' })
                this.props.listPausedFlights(payload);
                break;


        }
    };

    createFlight = () => {
        const { activeCampaign } = this.props;
        if (activeCampaign) {
            this.props.changeFlight({ prop: 'campaignId', value: activeCampaign.id });
        }
        this.props.history.push(`/ui/flight/create/new`);
    };

    cloneFlight = id => {
        this.props.history.push(`/ui/flight/create/${id}`);
    };

    activateFlight = (id, index) => {
        const { flights } = this.props;
        let arr = [...flights];
        arr[index].status = 'active';
        this.props.changeFlights({ prop: 'flights', value: arr });
        this.props.activateFlight(id);
    };

    deactivateFlight = (id, index) => {
        const { flights } = this.props;
        let arr = [...flights];
        arr[index].status = 'inactive';
        this.props.changeFlights({ prop: 'flights', value: arr });
        this.props.deactivateFlight(id);
    };

    pauseFlight = (id, index) => {
        const { flights } = this.props;
        let arr = [...flights];
        arr[index].status = 'paused';
        this.props.changeFlights({ prop: 'flights', value: arr });
        this.props.pauseFlight(id);
    };

    disableFlight = (id, index) => {
        const { flights } = this.props;
        let arr = [...flights];
        arr[index].status = 'disabled';
        this.props.changeFlights({ prop: 'flights', value: arr });
        this.props.disableFlight(id);
        // console.log(this.state.tab);
    };

    addSupply = (id, name) => {
        let master = this.props.activeUser.scope_account.is_zone_master;
        this.props.listSupply(id, '', master);
        this.props.getSupplyList(id, master);
        this.props.modalStateChange({ prop: 'id', value: id });
        this.props.modalStateChange({ prop: 'name', value: name });
        this.props.modalStateChange({ prop: 'activeItem', value: 'PLACEMENTS' });
        this.props.modalStateChange({ prop: 'showAddSupply', value: true });
    };
    getChannelIcon = (channel) => {
        const { iconStyle, mobileIcon } = styles;

        switch (channel) {
            case "desktop":
                return <Icon name="desktop" style={iconStyle} />;
            case "mobile_web":
            case "mobile_app":
                return <Icon name="mobile" size='large' style={mobileIcon} />;
            case "ctv":
                return <Icon name="tv" style={iconStyle} />;
        }
    };

    renderTableBody = () => {
        const { iconStyle, cursorStyle } = styles;
        const { flights, activeItem, match } = this.props;

        return flights.map((item, index) => {
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td >
                        <Popup
                            trigger={<Link to={`/ui/flight/update/${item.id}`}>
                                {item.name}
                            </Link>}
                            content={item.name}
                            flowing
                        />
                    </td>
                    {!match.params.id ? <td >{item.advertiser.id}</td> : null}
                    {!match.params.id ? <td >
                        <Popup
                            trigger={<Link to={`/ui/advertiser/${item.advertiser.id}`}>
                                {item.advertiser.name}
                            </Link>}
                            content={item.advertiser.name}
                            flowing
                        />
                    </td> : null}
                    {!match.params.id ? <td >{item.campaign.id}</td> : null}
                    {!match.params.id ? <td >
                        <Popup
                            trigger={<Link to={`/ui/campaign/${item.campaign.id}`}>
                                {item.campaign.name}
                            </Link>}
                            content={item.campaign.name}
                            flowing
                        />
                    </td> : null}
                    <td>{this.getChannelIcon(item.channel)}</td>
                    <td>{item.format === "display" ? <Icon style={iconStyle} name="picture" /> : <Icon name="video" style={iconStyle} />}</td>
                    <td>{moment(moment.unix(item.start_time)).format('MM-DD-YYYY')}</td>
                    <td>{moment(moment.unix(item.end_time)).format('MM-DD-YYYY')}</td>
                    <td>{item.status[0].toUpperCase() + item.status.substring(1)} </td>
                    {item.status === "active" ? <td ><Popup trigger={<Icon style={cursorStyle} name="pause circle" color="green" size="large" onClick={this.pauseFlight.bind(null, item.id, index)} />} size="mini" content="Pause Flight" /><Popup trigger={<Icon style={cursorStyle} name="remove circle" color="yellow" size="large" onClick={this.deactivateFlight.bind(null, item.id, index)} />} size="mini" content="Deactivate Flight" /><Popup trigger={<Icon style={cursorStyle} name="ban" color="red" size="large" onClick={this.disableFlight.bind(null, item.id, index)} />} size="mini" content="Disable Flight" /></td> : null}

                    {/* TEMPORARY WORKAROUND*/}
                    {item.status === "inactive" ? <td ><Popup trigger={<Icon style={cursorStyle} name="refresh" color="green" size="large" onClick={this.activateFlight.bind(null, item.id, index)} />} size="mini" content="Reactivate Flight" /><Popup trigger={<Icon style={cursorStyle} onClick={this.showAlert.bind(null, 'The flight has been deactivated.')} style={{ 'color': '#e1e1e1' }} name="remove circle" size="large" />} size='mini' content="Deactivate Flight" /><Popup trigger={<Icon style={cursorStyle} name="ban" style={{ 'color': '#e1e1e1' }} size="large" onClick={this.showAlert.bind(null, 'The flight has been deactivated.')} />} size="mini" content="Disable Flight" /></td> : null}
                    {item.status === "disabled" ? <td ><Popup trigger={<Icon style={cursorStyle} name="refresh" color="green" size="large" onClick={this.activateFlight.bind(null, item.id, index)} />} size="mini" content="Reactivate Flight" /><Popup trigger={<Icon style={cursorStyle} onClick={this.showAlert.bind(null, 'The flight has been disabled.')} style={{ 'color': '#e1e1e1' }} name="remove circle" size="large" />} size='mini' content="Deactivate Flight" /><Popup trigger={<Icon style={cursorStyle} name="ban" style={{ 'color': '#e1e1e1' }} size="large" onClick={this.showAlert.bind(null, 'The flight has been disabled.')} />} size="mini" content="Disable Flight" /></td> : null}

                    {/*TEMPORARY WORKAROUND*/}
                    {item.status === "paused" ? <td ><Popup trigger={<Icon style={cursorStyle} name="video play" color="green" size="large" onClick={this.activateFlight.bind(null, item.id, index)} />} size="mini" content="Restart Flight" /><Popup trigger={<Icon style={cursorStyle} name="remove circle" color="yellow" size="large" onClick={this.deactivateFlight.bind(null, item.id, index)} />} size="mini" content="Deactivate Flight" /><Popup trigger={<Icon style={cursorStyle} name="ban" color="red" size="large" onClick={this.disableFlight.bind(null, item.id, index)} />} size="mini" content="Disable Flight" /></td> : null}
                    {/*          { item.status === "inactive" ? <td ><Popup trigger={<Icon style={cursorStyle} name="remove circle" color="red" size="large" onClick={this.activateFlight.bind(null, item.id, index)} />} size="mini" content="Activate Flight" /></td> : null }*/}
                    {item.status === "capped" ? <td ><Popup trigger={<Icon style={cursorStyle} onClick={this.showAlert.bind(null, 'The flight reached its set cap. To restart the flight please edit the capping section.')} name="refresh" size="large" color="green" />} size='mini' content="Activate Flight" /><Popup trigger={<Icon style={cursorStyle} onClick={this.showAlert.bind(null, 'The flight reached its set cap. To restart the flight please edit the capping section')} style={{ 'color': '#e1e1e1' }} name="remove circle" size="large" />} size='mini' content="Deactivate Flight" /><Popup trigger={<Icon style={cursorStyle} name="ban" style={{ 'color': '#e1e1e1' }} size="large" onClick={this.showAlert.bind(null, 'The flight reached its set cap.To restart the flight please edit the capping section')} />} size="mini" content="Disable Flight" /></td> : null}
                    {item.status === "complete" ? <td ><Popup trigger={<Icon style={cursorStyle} onClick={this.showAlert.bind(null, 'The flight end date has passed. To restart the flight please set new end date.')} color="green" name="refresh" size="large" />} size='mini' content="Activate Flight" /><Popup trigger={<Icon style={cursorStyle} onClick={this.showAlert.bind(null, 'The flight end date has passed. To restart the flight please set new end date.')} style={{ 'color': '#e1e1e1' }} name="remove circle" size="large" />} size='mini' content="Activate Flight" /><Popup trigger={<Icon style={cursorStyle} name="ban" style={{ 'color': '#e1e1e1' }} size="large" onClick={this.showAlert.bind(null, 'The flight end date has passed. To restart the flight please set new end date.')} />} size="mini" content="Disable Flight" /></td> : null}
                    {activeItem !== 'DISABLED' ? <td>
                        <Popup trigger={<Icon style={cursorStyle} name="edit" onClick={this.editFlight.bind(null, item.id)} />} size='mini' content="Edit Flight" />
                        <Popup trigger={<Icon style={cursorStyle} name="trash" onClick={this.showConfirmAction.bind(null, item.id, 'delete')} />} size='mini' content="Delete Flight" />
                        <Popup trigger={<Icon style={cursorStyle} name="clone" onClick={this.cloneFlight.bind(null, item.id)} />} size='mini' content="Clone Flight" />
                        <Popup trigger={<Icon style={cursorStyle} name={'arrow left'} onClick={this.addSupply.bind(null, item.id, item.name)} />} size={'mini'} content={'Placement'} />
                    </td> : null}
                </tr>
            )
        })
    };

    renderFlights = payload => {
        const { activeItem } = this.props;

        switch (activeItem) {
            case 'ALL':
                this.props.listFlights(payload);
                break;
            case 'ACTIVE':
                this.props.listActiveFlights(payload);
                break;
            case 'INACTIVE':
                this.props.listInactiveFlights(payload);
                break;
            case 'DISABLED':
                this.props.listDisabledFlights(payload);
                break;
            case 'PAUSED':
                this.props.listPausedFlights(payload);
                break;
        }
    };

    searchFlights = event => {
        this.props.changeFlights({ prop: 'searchTerm', value: event.target.value });
        this.props.changeFlights({ prop: 'currentPage', value: 1 });
        const { sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
        let master = activeUser.scope_account.is_zone_master;
        let dsp = this.state.dsp;
        const payload = { master, dsp, sortBy, sortDirection, pageChunk, searchTerm: event.target.value, currentPage: 1 };
        if (match.params.id) {
            payload.id = Number(match.params.id);
        }
        this.renderFlights(payload);
    };

    handlePagination = currentPage => {
        const { searchTerm, sortBy, sortDirection, pageChunk, match, activeUser } = this.props;
        let master = activeUser.scope_account.is_zone_master;
        let dsp = this.state.dsp;
        this.props.changeFlights({ prop: 'currentPage', value: currentPage });
        let payload = { master, dsp, searchTerm, sortBy, sortDirection, pageChunk, currentPage };
        if (match.params.id) {
            payload.id = Number(match.params.id);
        }
        this.renderFlights(payload);
    };

    handleSort = (event) => {
        const { searchTerm, currentPage, pageChunk, sortDirection, match, activeUser } = this.props;
        let master = activeUser.scope_account.is_zone_master;
        let dsp = this.state.dsp;
        const payload = { master, dsp, searchTerm, currentPage, pageChunk, sortBy: event.target.id, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' };
        if (match.params.id) {
            payload.id = Number(match.params.id);
        }
        this.props.changeFlights({ prop: 'idSort', value: event.target.id === "id" ? `sort ${payload.sortDirection}ending` : 'sort' });
        this.props.changeFlights({ prop: 'nameSort', value: event.target.id === "name" ? `sort ${payload.sortDirection}ending` : 'sort' });
        this.props.changeFlights({ prop: 'start_timeSort', value: event.target.id === "start_time" ? `sort ${payload.sortDirection}ending` : 'sort' });
        this.props.changeFlights({ prop: 'end_timeSort', value: event.target.id === "end_time" ? `sort ${payload.sortDirection}ending` : 'sort' });
        this.props.changeFlights({ prop: 'channelSort', value: event.target.id === "channel" ? `sort ${payload.sortDirection}ending` : 'sort' });
        this.props.changeFlights({ prop: 'formatSort', value: event.target.id === "format" ? `sort ${payload.sortDirection}ending` : 'sort' });
        this.props.changeFlights({ prop: 'statusSort', value: event.target.id === "status" ? `sort ${payload.sortDirection}ending` : 'sort' });
        this.props.changeFlights({ prop: 'sortBy', value: event.target.id });
        this.props.changeFlights({ prop: 'sortDirection', value: payload.sortDirection });

        this.renderFlights(payload);
    };

    getColumnSpan = () => {
        const { match, activeItem } = this.props;

        let number = 13;
        if (activeItem === 'DISABLED') {
            number -= 1;
        }
        if (match.params.id) {
            number -= 4;
        }

        return number;
    };

    render() {
        const { divStyle, searchStyle, dimmerStyle, cursorStyle } = styles;
        const { loader, flights, activeItem, idSort, channelSort, formatSort, start_timeSort, end_timeSort, statusSort, nameSort, activeUser, pagination, searchTerm, listError, match } = this.props;

        return (
            <Col md={12} lg={12} xl={12}>
                <ModalManager currentModal={'CONFIRM_ACTION'} update={this.updateCallback} />
                <ModalManager currentModal={'ALERT'} update={this.updateCallback} />
                <ModalManager currentModal={'ADD_SUPPLY'} />
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
                                            name='ALL'
                                        >
                                            All
                    </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeItem === "ACTIVE" })}
                                            onClick={this.handleTabs.bind(null, 'ACTIVE')}
                                            name='ACTIVE'
                                        >
                                            Active
                    </NavLink>
                                    </NavItem >

                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeItem === "INACTIVE" })}
                                            onClick={this.handleTabs.bind(null, 'INACTIVE')}
                                            name='INACTIVE'
                                        >
                                            Inactive
                    </NavLink>
                                    </NavItem>

                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeItem === "PAUSED" })}
                                            onClick={this.handleTabs.bind(null, 'PAUSED')}
                                            name='PAUSED'
                                        >
                                            Paused
                    </NavLink>
                                    </NavItem >

                                    {activeUser.user.role & ROLE_SUPERADMIN || activeUser.user.role & ROLE_OPSADMIN ? <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeItem === "DISABLED" })}
                                            onClick={this.handleTabs.bind(null, 'DISABLED')}
                                            name="DISABLED"
                                        >
                                            Disabled
                    </NavLink>
                                    </NavItem > : null}

                                    <NavItem style={{ backgroundColor: '#e3f1f9', borderRadius: '10px' }}>
                                        <NavLink onClick={this.createFlight}>
                                            New Iflight
                    </NavLink>
                                    </NavItem>
                                    <NavItem style={{ marginLeft: 'auto', marginRight: 0 }}> <Input value={searchTerm} placeholder="Search" onChange={this.searchFlights} style={{ marginBottom: '3px' }} /></NavItem>
                                </Nav>
                                {!loader && flights.length ? <div>
                                    <Table responsive className='table--bordered dashboard__table-crypto'>
                                        <thead>
                                            <tr>
                                                <th >ID <Icon color={idSort === "sort" ? "black" : "blue"} name={idSort} id="id" onClick={this.handleSort} style={cursorStyle} /></th>
                                                <th >IFlight <Icon color={nameSort === "sort" ? "black" : "blue"} name={nameSort} id="name" onClick={this.handleSort} style={cursorStyle} /></th>
                                                {!match.params.id ? <th  >ID</th> : null}
                                                {!match.params.id ? <th >Advertiser</th> : null}
                                                {!match.params.id ? <th  >ID</th> : null}
                                                {!match.params.id ? <th >Campaign</th> : null}
                                                <th>Channel <Icon color={channelSort === "sort" ? "black" : "blue"} name={channelSort} id="channel" onClick={this.handleSort} style={cursorStyle} /></th>
                                                <th >Format <Icon color={formatSort === "sort" ? "black" : "blue"} name={formatSort} id="format" onClick={this.handleSort} style={cursorStyle} /></th>
                                                <th>Start Date <Icon color={start_timeSort === "sort" ? "black" : "blue"} name={start_timeSort} id="start_time" onClick={this.handleSort} style={cursorStyle} /></th>
                                                <th>End Date <Icon color={end_timeSort === "sort" ? "black" : "blue"} name={end_timeSort} id="end_time" onClick={this.handleSort} style={cursorStyle} /></th>



                                                <th >Status <Icon color={statusSort === "sort" ? "black" : "blue"} name={statusSort} id="status" onClick={this.handleSort} style={cursorStyle} /></th>
                                                {(this.props.activeItem == 'DISABLED') ? (<th colSpan={1} >Operations</th>) : (<th colSpan={2} >Operations</th>)}

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderTableBody()}
                                        </tbody>
                                    </Table>
                                    <Paginator pagination={pagination} handlePagination={this.handlePagination} />
                                </div> : <Alert color='info' className='alert--neutral' icon>
                                        <p><span className='bold-text'>Information:</span> There are no flights matching the criteria</p>
                                    </Alert>}
                            </div>
                        </div>
                    </CardBody>
                    {listError ? <Alert color='danger' className='alert--neutral' icon>
                        <p><span className='bold-text'>Warning!</span> Cannot display flights at this time. Please try again later.</p>
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
    const { activeUser } = state.shared;
    const { activeItem, flights, searchTerm, sortBy, sortDirection, currentPage, pageChunk, loader, idSort, nameSort, listError, channelSort, formatSort, statusSort, pagination, start_timeSort, end_timeSort } = state.flights;
    const { activeCampaign } = state.campaigns;

    return { activeItem, flights, searchTerm, sortBy, sortDirection, currentPage, pageChunk, loader, idSort, nameSort, listError, channelSort, formatSort, statusSort, pagination, start_timeSort, end_timeSort, activeUser, activeCampaign };
};

export default withRouter(connect(mapStateToProps, { listSupply, readActiveUser, listFlights, deleteFlight, listPausedFlights, listActiveFlights, listInactiveFlights, listDisabledFlights, activateFlight, deactivateFlight, pauseFlight, disableFlight, changeFlights, changeFlight, modalStateChange, getSupplyList, checkIflight })(IFlightsGrid));
