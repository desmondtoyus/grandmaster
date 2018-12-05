import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Popup , Dimmer } from 'semantic-ui-react';
import { listDomainLists, domainListsChange, readDisplayDomainList, deleteDomainList } from '../../redux/actions/lists.actions';
import { modalStateChange } from "../../redux/actions/modals.actions";
import { Card, CardBody, Col, Nav, NavItem, NavLink, Input } from 'reactstrap';
import Alert from '../../components/Alert'
import Table from '../../components/table/Table';
import Paginator from '../../app/paginator';
import ModalManager from '../../modals/modal.manager';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

class DomainListsGrid extends Component {
    componentDidMount() {
        const { searchTerm, currentPage, sortBy, sortDirection, pageChunk } = this.props;
        const payload = { listType: 'app_name', searchTerm, currentPage, sortBy, sortDirection, pageChunk };
        this.props.listDomainLists(payload);
    }

    createDomainList = () => {
        this.props.history.push(`/ui/app/create/new`);
    };

    searchDomainLists = (event) => {
        const { sortBy, sortDirection, pageChunk } = this.props;

        this.props.domainListsChange({ prop: 'searchTerm', value: event.target.value });
        this.props.domainListsChange({ prop: 'currentPage', value: 1 });
        const payload = { listType: 'app_name', sortBy, sortDirection, pageChunk, searchTerm: event.target.value, currentPage: 1 };
        this.props.listDomainLists(payload);
    };

    handleSort = (event) => {
        const { searchTerm, currentPage, sortBy, sortDirection, pageChunk } = this.props;

        this.props.domainListsChange({ prop: 'sortBy', value: event.target.id });
        this.props.domainListsChange({ prop: 'sortDirection', value: sortDirection === 'asc' ? 'desc' : 'asc' });
        this.props.domainListsChange({ prop: 'idSort', value: event.target.id === 'id' ? `sort ${sortDirection === 'asc' ? 'desc' : 'asc'}ending` : 'sort' });
        this.props.domainListsChange({ prop: 'nameSort', value: event.target.id === 'name' ? `sort ${sortDirection === 'asc' ? 'desc' : 'asc'}ending` : 'sort' });

        const payload = { listType: 'app_name', searchTerm, currentPage, pageChunk, sortBy: event.target.id, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' };
        this.props.listDomainLists(payload);
    };

    editDomainList = (id) => {
        this.props.history.push(`/ui/app/update/${id}`);
    };

    cloneDomainList = (id) => {
        this.props.history.push(`/ui/app/create/${id}`);
    };

    deleteDomainList = (id) => {
        this.props.deleteDomainList(id);
    };


    showConfirmAction = (id, action) => {
        this.props.modalStateChange({ prop: 'id', value: id });
        this.props.modalStateChange({ prop: 'showConfirmAction', value: true });

        this.props.modalStateChange({ prop: 'header', value: 'Are you sure you want to delete this list?' });
        this.props.modalStateChange({ prop: 'message', value: 'Deleted lists cannot be restored' });
        this.props.modalStateChange({ prop: 'callback', value: this.deleteDomainList });
    };
    updateCallback = () => {
        const { searchTerm, currentPage, sortBy, sortDirection, pageChunk } = this.props;
        const payload = { listType: 'app_name', searchTerm, currentPage, sortBy, sortDirection, pageChunk };
        this.props.listDomainLists(payload);
    };

    downloadDomainList = (obj) => {
        const strList = obj.value.join('\n');
        let link = document.createElement('a');
        link.download = `${obj.name.split(' ').join('_')}.txt`;
        let blob = new Blob([strList], { type: 'text/plain' });
        link.href = window.URL.createObjectURL(blob);
        link.click();
    };

    handlePagination = (currentPage) => {
        const { searchTerm, sortBy, sortDirection, pageChunk } = this.props;

        this.props.domainListsChange({ prop: 'currentPage', value: currentPage });
        let payload = { listType: 'app_name', searchTerm, sortBy, sortDirection, pageChunk, currentPage };
        this.props.listDomainLists(payload);
    };

    renderList = (address) => {
        this.props.history.push(address);
    }

    renderTableBody = () => {
        const { lists } = this.props;
        const { cursorStyle } = styles;

        return lists.map(item => {
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                        <Popup
                            trigger={<Link to={`/ui/app/update/${item.id}`}>{item.name}</Link>}
                            content={item.name}
                            flowing
                        />
                    </td>
                    <td>{item.value.length.toLocaleString()}</td>
                    <td>
                        <Popup trigger={<Icon style={cursorStyle} name="edit" onClick={this.editDomainList.bind(null, item.id)} />} size='mini' content="Edit List" />
                        <Popup trigger={<Icon style={cursorStyle} name="trash" onClick={this.showConfirmAction.bind(null, item.id, 'delete')} />} size='mini' content="Delete List" />
                        <Popup trigger={<Icon style={cursorStyle} name="clone" onClick={this.cloneDomainList.bind(null, item.id)} />} size='mini' content="Clone List" />
                        <Popup trigger={<Icon style={cursorStyle} name="download" onClick={this.downloadDomainList.bind(null, item)} />} size='mini' content="Download List" />
                    </td>
                </tr>
            )
        })
    };

    render() {
        const {
            searchTerm,
            loader,
            lists,
            listError,
            idSort,
            nameSort,
            pagination
        } = this.props;
        const { dimmerStyle, cursorStyle} = styles;

        return (
            <Col md={12} lg={12} xl={12}>
                <ModalManager currentModal={'CONFIRM_ACTION'} update={this.updateCallback} />
                <Card>
                    {loader ? <Dimmer active inverted style={dimmerStyle}><div className='loader'> </div></Dimmer>  : null}
                    <CardBody>
                        <div className='tabs tabs--bordered-bottom'>
                            <div className='tabs__wrap'>

                                <Nav tabs>

                                    <NavItem>
                                        <NavLink
                                            onClick={this.renderList.bind(null, '/ui/lists')}>
                                            Domain Lists
                    </NavLink>
                                    </NavItem>

                                    <NavItem>
                                        <NavLink onClick={this.renderList.bind(null, '/ui/ips')}>
                                            IP Address Lists
                    </NavLink>
                                    </NavItem>

                                    <NavItem>
                                        <NavLink onClick={this.renderList.bind(null, '/ui/bundles')}>
                                            Bundle Lists
                    </NavLink>
                                    </NavItem>

                                    <NavItem>
                                        <NavLink className='active'>
                                            APP Lists
                    </NavLink>
                                    </NavItem>

                                    <NavItem style={{ backgroundColor: '#e3f1f9', borderRadius: '10px' }}>
                                        <NavLink onClick={this.createDomainList}>
                                            New APP Lists
                    </NavLink>
                                    </NavItem>
                                    <NavItem style={{ marginLeft: 'auto', marginRight: 0 }}> <Input value={searchTerm} placeholder="Search" onChange={this.searchDomainLists} style={{ marginBottom: '3px' }} /></NavItem>
                                </Nav>
                                {!loader && lists.length ? <div>
                                    <Table responsive className='table--bordered dashboard__table-crypto'>
                                        <thead>
                                            <tr>
                                                <th>ID <Icon color={idSort === "sort" ? "black" : "blue"} name={idSort} id="id" onClick={this.handleSort} style={cursorStyle} /></th>
                                                <th>Name<Icon color={nameSort === "sort" ? "black" : "blue"} name={nameSort} id={'name'} onClick={this.handleSort} style={cursorStyle} /></th>
                                                <th>Domains</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderTableBody()}
                                        </tbody>
                                    </Table>
                                    <Paginator pagination={pagination} handlePagination={this.handlePagination} />
                                </div> : <Alert color='info' className='alert--neutral' icon>
                                        <p><span className='bold-text'>Information:</span> There are no matching domain lists</p>
                                    </Alert>}
                            </div>
                        </div>
                    </CardBody>
                    {listError ? <Alert color='danger' className='alert--neutral' icon>
                        <p><span className='bold-text'>Error!</span> Cannot display domain lists at this time. Please try again later..</p>
                    </Alert> : null}
                </Card>
            </Col>
        )
    }
}

const styles = {
    dimmerStyle: {
        height: "100%"
    },
    cursorStyle: {
        cursor: "pointer"
    }
};

const mapStateToProps = state => {
    const {
        searchTerm,
        loader,
        lists,
        listError,
        idSort,
        nameSort,
        pagination,
        currentPage,
        sortBy,
        sortDirection,
        pageChunk
    } = state.lists;
    const { activeUser } = state.shared;

    return { searchTerm, loader, lists, listError, idSort, nameSort, pagination, currentPage, sortBy, sortDirection, pageChunk, activeUser };
};

export default withRouter(connect(mapStateToProps, { listDomainLists, domainListsChange, modalStateChange, readDisplayDomainList, deleteDomainList })(DomainListsGrid));