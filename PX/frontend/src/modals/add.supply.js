import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popup, Icon, Checkbox} from 'semantic-ui-react';
import { Card, CardBody, Modal, Button, ModalHeader, ModalBody, ModalFooter, ButtonToolbar, Nav, NavItem, NavLink, Col, Input } from 'reactstrap';
import { modalStateChange, resetModalReducer } from "../redux/actions/modals.actions";
import { listSupply, updateSupplyList } from "../redux/actions/flight.actions";
import { ROOT_URL } from "../vars";
import Alert from '../components/Alert'
import Table from '../components/table/Table';

class AddSupply extends Component {
    state = {
        initialSupply: [],
        uncheckAll: false,
        checkAll: false,
        control:false
    }

    componentDidMount() {
        this.setState({ initialSupply: [] });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.success) {
                this.setState({ initialSupply: [] });
            this.setState({ uncheckAll: false });
            this.setState({ checkAll: false });
            this.setState({ control: false });
            setTimeout(() => {
                this.close();
            }, 3000);
        }
    }

    union_arrays(x, y) {
        var obj = {};
        for (var i = x.length - 1; i >= 0; --i)
            obj[x[i]] = x[i];
        for (var i = y.length - 1; i >= 0; --i)
            obj[y[i]] = y[i];
        var res = []
        for (var k in obj) {
            if (obj.hasOwnProperty(k))
                res.push(obj[k]);
        }
        return res;
    }

    close = () => {
        this.setState({ initialSupply: [] });
        this.setState({ uncheckAll: false });
        this.setState({ checkAll: false });
        this.setState({ control: false });
        this.props.modalStateChange({ prop: 'showAddSupply', value: false });
        this.props.resetModalReducer();
    };

    handleChange = event => {
        this.props.modalStateChange({ prop: event.target.name, value: event.target.value });
    };

    handleSave = event => {
        event.preventDefault();
        const { id, supplyIds } = this.props;
        let toRemove = [];
        let toAdd = [];
        let union = this.union_arrays(supplyIds, this.state.initialSupply);
        union.filter((el) => {
            if (!supplyIds.includes(el)) {
                toRemove.push(el)
            }
            else {
                toAdd.push(el)
            }
        });
        toAdd = toAdd.filter((el) => !this.state.initialSupply.includes(el));
        // console.log('id=', id);
        // console.log('supplyIds=', supplyIds);
        // console.log('toRemove=', toRemove);
        // console.log('toAdd=', toAdd);
        // console.log('this.state.initialSupply=', this.state.initialSupply);
        this.props.updateSupplyList({ id, supplyIds, toRemove, toAdd });
    };

    handleTabs = name => {
        if (name == 'ADD SUPPLY') {
            if (!this.state.control) {
                this.setState({ initialSupply: this.props.supplyIds });
                this.setState({ control: true });
            }
        }
        this.props.modalStateChange({ prop: 'activeItem', value: name });
    };

    moveUp = index => {
        if (index === 0) {
            return;
        }
        let list = [...this.props.supplyList];
        let ids = [...this.props.supplyIds];
        let item = list[index];
        let id = ids[index];
        list[index] = list[index - 1];
        ids[index] = ids[index - 1];
        list[index - 1] = item;
        ids[index - 1] = id;
        this.props.modalStateChange({ prop: 'supplyList', value: list });
        this.props.modalStateChange({ prop: 'supplyIds', value: ids });
    };

    moveDown = index => {
        let list = [...this.props.supplyList];
        if (index === list.length - 1) {
            return;
        }
        let ids = [...this.props.supplyIds];
        let item = list[index];
        let id = ids[index];
        list[index] = list[index + 1];
        ids[index] = ids[index + 1];
        list[index + 1] = item;
        ids[index + 1] = id;
        this.props.modalStateChange({ prop: 'supplyList', value: list });
        this.props.modalStateChange({ prop: 'supplyIds', value: ids });
    };

    removeFlight = toRemove => {
        if (this.state.initialSupply.length < 1) {
            this.setState({ initialSupply: this.props.supplyIds });
        }
        let list = [...this.props.supplyList];
        let ids = [...this.props.supplyIds];
        const index = ids.indexOf(toRemove);
        list.splice(index, 1);
        ids.splice(index, 1);
        this.props.modalStateChange({ prop: 'supplyList', value: list });
        this.props.modalStateChange({ prop: 'supplyIds', value: ids });
    };

    searchSupply = event => {
        const { id } = this.props;
        let master = this.props.activeUser.scope_account.is_zone_master;
        this.props.modalStateChange({ prop: 'searchTerm', value: event.target.value });
        this.props.listSupply(id, event.target.value, master);
    };

    renderPlacements = () => {
        const { supplyList } = this.props;
        const { cursorStyle } = styles;

        return supplyList.map((item, index) => {
            return (
                <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.id}</td>
                    <td><a href={`${ROOT_URL}/ui/placement/update/${item.id}`} target={'_blank'}>{item.name}</a></td>
                    <td>{`$${(item.cpm / 100).toFixed(2)}`}</td>
                    <td>{item.status}</td>
                    <td>
                        <Popup trigger={<Icon name={'arrow up'} style={cursorStyle} onClick={this.moveUp.bind(null, index)} />} size={'mini'} content={'Move Up'} />
                        <Popup trigger={<Icon name={'arrow down'} style={cursorStyle} onClick={this.moveDown.bind(null, index)} />} size={'mini'} content={'Move Down'} />
                        <Popup trigger={<Icon name={'remove'} style={cursorStyle} onClick={this.removeFlight.bind(null, item.id)} />} size={'mini'} content={'Remove Flight'} />
                    </td>
                </tr>
            )
        })
    };

    uncheckAll = () => {
        // if (this.state.initialSupply.length < 1) {
        //     this.setState({ initialSupply: this.props.supplyIds });
        // }
        this.setState({ checkAll: false });
        this.setState({ uncheckAll: true });
        let ids = [];
        let list = [];
        this.props.modalStateChange({ prop: 'supplyIds', value: ids });
        this.props.modalStateChange({ prop: 'supplyList', value: list });
    };

    checkAll = () => {
        // if (this.state.initialSupply.length < 1) {
        //     this.setState({ initialSupply: this.props.supplyIds });
        // }
        this.setState({ uncheckAll: false });
        this.setState({ checkAll: true });
        let list = [];
        let ids = [];
        this.props.supply.map((item, id) => {
            ids.push(item.id);
            list.push({ id: item.id, cpm: item.cpm, name: item.name, status: item.status })

        })
        this.props.modalStateChange({ prop: 'supplyIds', value: ids });
        this.props.modalStateChange({ prop: 'supplyList', value: list });
    };


    updateSupply = (item, event, data) => {
        this.setState({ uncheckAll: false });
        this.setState({ checkAll: false });
        let list = [...this.props.supplyList];
        let ids = [...this.props.supplyIds];
        if (!data.checked) {
            list.push({
                id: item.id,
                cpm: item.cpm,
                name: item.name,
                status: item.status
            });
            ids.push(item.id);
        }
        else if (data.checked) {
            const index = ids.indexOf(item.id);
            list.splice(index, 1);
            ids.splice(index, 1);
        }
        this.props.modalStateChange({ prop: 'supplyList', value: list });
        this.props.modalStateChange({ prop: 'supplyIds', value: ids });
    };

    renderSupply = () => {
        const { supply, supplyIds, flights } = this.props;
        //checking if the placement is a desktop and display

        return supply.map((item, index) => {
            return (
                <tr key={item.id}>
                    <td><Checkbox onClick={this.updateSupply.bind(null, item)} checked={supplyIds.includes(item.id)} /></td>
                    <td>{item.id}</td>
                    <td><a href={`${ROOT_URL}/ui/placement/update/${item.id}`} target={'_blank'}>{item.name}</a></td>
                    {item.format == 'display' ? <td>{`${item.width} x ${item.height}`} </td> : <td> </td>}
                    <td>{`$${(item.cpm / 100).toFixed(2)}`}</td>
                    <td>{`$${(item.cpc / 100).toFixed(2)}`}</td>
                    {item.status === 'inactive' ? <td><Icon name="remove circle" color="red" size="large" /></td> : <td><Icon name={'check circle'} color={'green'} size={'large'} /></td>}
                </tr>
            )
        })
    };

    render() {
        const { showAddSupply, searchTerm, error, success, errorMessage, successMessage, name, id, activeItem, supplyList, supply } = this.props;
        const { searchStyle } = styles;

        if (error) {
            return (
                <Modal isOpen={showAddSupply} toggle={this.toggle} >
                <ModalHeader toggle={this.toggle}>Error!</ModalHeader>
                <ModalBody>
                  <Alert color='danger' className='alert--neutral' icon>
                    {errorMessage}
                  </Alert>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onClick={this.close}>Close</Button>
                </ModalFooter>
              </Modal>
            )
        }

        if (success) {
            return (
                <Modal isOpen={showAddSupply} toggle={this.toggle} >
                <ModalHeader>Success</ModalHeader>
                <ModalBody>
                  <Alert color='success' className='alert--neutral' icon>
                    {successMessage}
                  </Alert>
                </ModalBody>
                <ModalFooter>
      
                </ModalFooter>
              </Modal>
            )
        }

        return (
            <Modal isOpen={showAddSupply} toggle={this.toggle} className='modal-xl'>
              <ModalHeader toggle={this.toggle}>{`${name} / ID: ${id} - Supply`}</ModalHeader>
              <ModalBody>
                <Col md={12} lg={12}>
                  <Card>
                    <CardBody>
                      <div className='tabs tabs--bordered-bottom'>
                        <div className='tabs__wrap'>
                          <Nav tabs>
      
                            <NavItem>
                              <NavLink name={'PLACEMENTS'} active={activeItem === 'PLACEMENTS'} onClick={this.handleTabs.bind(null, 'PLACEMENTS')}>
                                Placements
                          </NavLink>
                            </NavItem>
      
                            <NavItem >
                              <NavLink name={'ADD SUPPLY'} active={activeItem == 'ADD SUPPLY'} onClick={this.handleTabs.bind(null, 'ADD SUPPLY')}>
                                Add Supply
                          </NavLink>
                            </NavItem>
                            <NavItem >
                            </NavItem>
      
      
                            {activeItem === "ADD SUPPLY" ? <NavItem style={{ marginLeft: '10%' }}>
                              <NavLink>
                                <Input type="checkbox" onClick={this.checkAll.bind()} checked={this.state.checkAll} />Check All
      
                              </NavLink>
                            </NavItem> : null}
                            {activeItem === "ADD SUPPLY" ? <NavItem >
                              <NavLink>
      
                                <Input type="checkbox" onClick={this.uncheckAll.bind()} checked={this.state.uncheckAll} /> Uncheck All
                              </NavLink>
                            </NavItem> : null}
      
                            {activeItem === "ADD SUPPLY" ? <NavItem style={{ marginLeft: 'auto', marginRight: 0 }}> <Input value={searchTerm} placeholder="Search" onChange={this.searchSupply} style={{ marginBottom: '3px' }} />
                            </NavItem> : <span> </span>
                            }
                          </Nav>
      
                          {activeItem === 'PLACEMENTS' && supplyList.length ? <Table responsive className='table--bordered dashboard__table-crypto'>
                            <thead>
                              <tr>
                                <th >Order</th>
                                <th  >ID</th>
                                <th >Name</th>
                                <th >CPM</th>
                                <th >Status</th>
                                <th >Action</th>
                              </tr>
                            </thead>
                            <tbody>
                            {this.renderPlacements()}
                            </tbody>
                          </Table> : null}
                          {activeItem === 'PLACEMENTS' && !supplyList.length ? <Alert className='alert--bordered' icon color='info'>
                          There are no placements on your list
                </Alert> : null}
      
                          {activeItem === 'ADD SUPPLY' && supply.length ? <Table responsive className='table--bordered dashboard__table-crypto'>
                            <thead>
                              <tr>
                                <th >Select</th>
                                <th >ID</th>
                                <th >Name</th>
                                <th >Display Size</th>
                                <th >CPM</th>
                                <th >CPC</th>
                                <th >Status</th>
                              </tr>
                            </thead>
                            <tbody>
                            {this.renderSupply()}
                            </tbody>
                          </Table> : null}
                        </div>
                      </div>
      
      
                    </CardBody>
                    {activeItem === 'ADD SUPPLY' && !supply.length ? <Alert color='info' className='alert--bordered' icon style={{ marginTop: 10 }}>
                    There are no placements matching the criteria
                  </Alert> : null}
                  </Card>
      
                </Col>
              </ModalBody>
              <ModalFooter>
                <ButtonToolbar className='form__button-toolbar'>
                {supply.length ? <Button color='primary' onClick={this.handleSave} >Submit</Button>: null}
                  <Button type='button' onClick={this.close}> Cancel </Button>
                </ButtonToolbar>
              </ModalFooter>
      
            </Modal>
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
        height: "300px"
    }
};

const mapStateToProps = state => {
    const { supply, id, searchTerm, error, success, errorMessage, successMessage, showAddSupply, name, activeItem, supplyList, supplyIds } = state.modal;
    const { flights } = state.flights;
    const { activeUser } = state.shared;
    return { activeUser, supply, id, searchTerm, error, success, errorMessage, successMessage, showAddSupply, name, activeItem, supplyList, supplyIds };
};

export default connect(mapStateToProps, { modalStateChange, resetModalReducer, listSupply, updateSupplyList })(AddSupply);