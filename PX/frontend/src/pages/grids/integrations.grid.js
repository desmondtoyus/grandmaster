import React, { Component } from 'react';
import { connect } from 'react-redux';
import { listIntegrations, deleteIntegration, changeIntegration, readIntegration, listDisabledIntegrations } from "../../redux/actions/integration.actions";
import { modalStateChange } from "../../redux/actions/modals.actions";
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Popup, Icon, Dimmer } from 'semantic-ui-react';
import Alert from '../../components/Alert'
import Table from '../../components/table/Table';
import Paginator from '../../app/paginator';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Input } from 'reactstrap';
import ModalManager from '../../modals/modal.manager';
import { readActiveUser } from '../../redux/actions/user.actions';
import classnames from 'classnames';








class IntegrationGrid extends Component {
    state = {
        master: this.props.activeUser.scope_account.is_zone_master,
        count: 0
    }
    componentWillMount() {
        this.props.readActiveUser();
    }

    componentDidMount() {
        const { integrations, searchTerm, currentPage, sortBy, sortDirection, pageChunk, activeUser } = this.props;
        let master = activeUser.scope_account.is_zone_master;
        console.log('account is a master? ', master);
        const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master };
        this.props.listIntegrations(payload);


        // this.props.modalStateChange({ prop: 'showIntegration', value: this.props.showIntegration });
    }
    componentDidUpdate(nextProps) {
        if (nextProps.showIntegration !== this.props.showIntegration) {
            this.props.modalStateChange({ prop: 'showIntegration', value: this.props.showIntegration });
            console.log('SHOW = ', this.props.showIntegration)
        }
    }

    updateCallback = () => {
        const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, activeUser } = this.props;
        let master = activeUser.scope_account.is_zone_master;
        const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk, master };
        this.renderIntegrations(payload);
    };

    deleteIntegration = id => {
        this.props.deleteIntegration(id);
    };

    handleTabs = name => {
        this.props.changeIntegration({ prop: 'activeItem', value: name });

        const { searchTerm, sortBy, sortDirection, pageChunk, activeUser } = this.props;
        let master = activeUser.scope_account.is_zone_master;
        let currentPage = 1;
        const payload = { searchTerm, sortDirection, sortBy, currentPage, pageChunk, master };

        switch (name) {
            case 'INTEGRATIONS':
                this.props.listIntegrations(payload);
                break;
            case 'DISABLED':
                this.props.listDisabledIntegrations(payload);
                break;
        }
    };

    editIntegration = id => {
        this.props.readIntegration(id);
        this.props.modalStateChange({ prop: 'modalStatus', value: 'edit' });
        this.props.modalStateChange({ prop: 'showIntegration', value: true });
    };

    showConfirmAction = (id, action) => {
        this.props.modalStateChange({ prop: 'id', value: id });
        this.props.modalStateChange({ prop: 'showConfirmAction', value: true });
        if (action === "delete") {
            this.props.modalStateChange({ prop: 'header', value: 'Are you sure you want to delete the integrations?' });
            this.props.modalStateChange({ prop: 'message', value: 'Deleted integrations cannot be recovered' });
            this.props.modalStateChange({ prop: 'callback', value: this.deleteIntegration });
        }
    };

    showAlert = msg => {
        this.props.modalStateChange({ prop: 'showAlert', value: true });
        this.props.modalStateChange({ prop: 'error', value: true });
        this.props.modalStateChange({ prop: 'errorMessage', value: msg });
    };

    createIntegration = () => {
        this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
        this.props.modalStateChange({ prop: 'showIntegration', value: true });
    };

    renderTableBody = () => {
        const { cursorStyle } = styles;
        const { integrations, activeItem } = this.props;

        return integrations.map((item) => {
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td >
                        <Popup
                            trigger={<Link to={`/ui/iflights/${item.value}`}>
                                {item.name}
                            </Link>}
                            content={item.name}
                            flowing
                        />
                    </td>
                    <td>{moment(moment.unix(item.created_at)).format('MM-DD-YYYY')}</td>
                    {activeItem === 'INTEGRATIONS' ? <td>
                        <Popup trigger={<Icon style={cursorStyle} name="edit" onClick={this.editIntegration.bind(null, item.id)} />} size='mini' content="Edit Integration" />
                        <Popup trigger={<Icon style={cursorStyle} name="trash" onClick={this.showConfirmAction.bind(null, item.id, 'delete')} />} size='mini' content="Delete Integration" />
                    </td> : null}
                </tr>
            )
        })
    };

    renderIntegrations = payload => {
        const { activeItem } = this.props;

        switch (activeItem) {
            case 'INTEGRATIONS':
                this.props.listIntegrations(payload);
                break;
            case 'DISABLED':
                this.props.listDisabledIntegrations(payload);
                break;
        }
    };

    searchIntegrations = (event) => {
        this.props.changeIntegration({ prop: 'searchTerm', value: event.target.value });
        this.props.changeIntegration({ prop: 'currentPage', value: 1 });
        const { sortBy, sortDirection, pageChunk, activeUser } = this.props;
        let master = activeUser.scope_account.is_zone_master;
        const payload = { sortBy, sortDirection, pageChunk, searchTerm: event.target.value, master, currentPage: 1 };
        this.renderIntegrations(payload);
    };

    handlePagination = currentPage => {
        const { searchTerm, sortBy, sortDirection, pageChunk, activeUser } = this.props;
        let master = activeUser.scope_account.is_zone_master;
        this.props.changeIntegration({ prop: 'currentPage', value: currentPage });
        let payload = { searchTerm, sortBy, sortDirection, pageChunk, currentPage, master };
        this.renderIntegrations(payload);
    };

    handleSort = (event) => {

        const { searchTerm, currentPage, pageChunk, sortDirection, activeUser } = this.props;
        let master = activeUser.scope_account.is_zone_master;
        const payload = { searchTerm, master, currentPage, pageChunk, sortBy: event.target.id, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' };
        this.props.changeIntegration({ prop: 'idSort', value: event.target.id === "id" ? `sort ${payload.sortDirection}ending` : 'sort' });
        this.props.changeIntegration({ prop: 'nameSort', value: event.target.id === "name" ? `sort ${payload.sortDirection}ending` : 'sort' });
        this.props.changeIntegration({ prop: 'created_atSort', value: event.target.id === "created_at" ? `sort ${payload.sortDirection}ending` : 'sort' });
        this.props.changeIntegration({ prop: 'sortBy', value: event.target.id });
        this.props.changeIntegration({ prop: 'sortDirection', value: payload.sortDirection });

        this.renderIntegrations(payload);
    };

    render() {
        const { searchStyle, cursorStyle, dimmerStyle, divStyle } = styles;
        const { activeItem, integrations, searchTerm, loader, idSort, nameSort, listError, created_atSort, pagination, activeUser } = this.props;

        return (
            <Col md={12} lg={12} xl={12}>
                <ModalManager currentModal={'INTEGRATION'} update={this.updateCallback} />
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
                                                className={classnames({ active: activeItem === "INTEGRATIONS" })}
                                                onClick={this.handleTabs.bind(null, 'INTEGRATIONS')}
                                            >
                                                All
                    </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeItem === "ACTIVE" })}
                                                // onClick={this.handleTabs.bind(null, 'ACTIVE')}
                                            >
                                                Active
                    </NavLink>
                                        </NavItem >
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeItem === "INACTIVE" })}
                                                // onClick={this.handleTabs.bind(null, 'INACTIVE')}
                                            >
                                                Inactive
                    </NavLink>
                                        </NavItem>
   
            
                                        <NavItem style={{ backgroundColor: '#e3f1f9', borderRadius: '10px' }}>
                                        <NavLink onClick={this.createIntegration}>
                                                New Integrations
                    </NavLink>
                                        </NavItem>
                                        <NavItem style={{ marginLeft: 'auto', marginRight: 0 }}> <Input value={searchTerm} placeholder="Search" onChange={this.searchPlacements} style={{ marginBottom: '3px' }} /></NavItem>
                                    </Nav>
                                        {!loader && integrations.length ? <div>
                                        <Table responsive className='table--bordered dashboard__table-crypto'>
                                            <thead>
                                                <tr>
                                                        <th >ID <Icon color={idSort === "sort" ? "black" : "blue"} name={idSort} id="id" onClick={this.handleSort} style={cursorStyle} /></th>
                                                        <th >Integration <Icon color={nameSort === "sort" ? "black" : "blue"} name={nameSort} id="name" onClick={this.handleSort} style={cursorStyle} /></th>

                                                        <th >Created Date <Icon color={created_atSort === "sort" ? "black" : "blue"} name={created_atSort} id="created_at" onClick={this.handleSort} style={cursorStyle} /></th>
                                                    {activeItem !== 'DISABLED' ? <th >Action</th> : null}
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
                                <p><span className='bold-text'>Warning!</span> Cannot display integrations at this time. Please try again later</p>
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
    const {integrations, activeItem, searchTerm, sortBy, sortDirection, currentPage, pageChunk, idSort, nameSort, created_atSort, loader, listError, pagination } = state.integrations;
    const {activeUser} = state.shared;
    const {showIntegration} = state.modal;
    return {integrations, activeItem, searchTerm, sortBy, sortDirection, currentPage, pageChunk, idSort, nameSort, created_atSort, loader, listError, pagination, showIntegration, activeUser };
                };
                
export default connect(mapStateToProps, {readActiveUser, listIntegrations, deleteIntegration, changeIntegration, readIntegration, modalStateChange, listDisabledIntegrations })(IntegrationGrid);
                    
