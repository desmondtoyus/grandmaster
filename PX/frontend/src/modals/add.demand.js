import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popup, Icon, Checkbox, Dropdown } from 'semantic-ui-react';
import { Card, CardBody, Modal, Button, ModalHeader, ModalBody, ModalFooter, ButtonToolbar, Nav, NavItem, NavLink, Col, Input } from 'reactstrap';
import { modalStateChange, resetModalReducer } from "../redux/actions/modals.actions";
import { listDemand, updateDemandList, changePlacement } from "../redux/actions/placement.actions";
import { ROOT_URL } from "../vars";
import Alert from '../components/Alert'
import Table from '../components/table/Table';

const options = [
  { key: 'edit', icon: 'edit', text: 'User Defined', value: 'user_defined' },
  { key: 'dollar', icon: 'dollar', text: 'Price', value: 'price' },
  { key: 'random', icon: 'random', text: 'Random', value: 'random' },
]

class AddDemand extends Component {
  state = {
    initialSupply: [],
    uncheckAll: false,
    checkAll: false,
    control: false,
    sortParameter: 'user_defined'
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      this.setState({ uncheckAll: false });
      this.setState({ checkAll: false });
      setTimeout(() => {
        this.close();
      }, 3000);
    }
  }

  close = () => {
    this.setState({ uncheckAll: false });
    this.setState({ checkAll: false });
    this.setState({ sortParameter: 'user_defined' });
    this.props.modalStateChange({ prop: 'showAddDemand', value: false });
    this.props.resetModalReducer();
  };

  handleChange = event => {
    this.props.modalStateChange({ prop: event.target.name, value: event.target.value });
  };

  handleSave = event => {
    event.preventDefault();
    this.setState({ sortParameter: 'user_defined' });
    const { id, demandIds, demand_prioritization_type } = this.props;
    this.props.updateDemandList({ id, demandIds, demandPrioritization:demand_prioritization_type });
  };

  // handleSave = event => {
  //   event.preventDefault();
  //   this.setState({ sortParameter: 'user_defined' });
  //   const { id, demandIds, demand_prioritization_type } = this.props;
  //   this.props.updateDemandList({ id, demandIds, demandPrioritization: demand_prioritization_type });
  // };

  handleTabs = name => {
    this.props.modalStateChange({ prop: 'activeItem', value: name });
  };

  moveUp = index => {
    if (index === 0) {
      return;
    }
    this.props.modalStateChange({ prop: 'demand_prioritization_type', value: 'user_defined' });
    let list = [...this.props.demandList];
    let ids = [...this.props.demandIds];
    let item = list[index];
    let id = ids[index];
    list[index] = list[index - 1];
    ids[index] = ids[index - 1];
    list[index - 1] = item;
    ids[index - 1] = id;
    this.props.modalStateChange({ prop: 'demandList', value: list });
    this.props.modalStateChange({ prop: 'demandIds', value: ids });
  };

  handleSelect = (event, data) => {
    this.props.modalStateChange({ prop: data.name, value: data.value });
    switch (data.value) {
      case 'price':
        this.orderByPrice();
        break;
      case 'user_defined':
        console.log('Ordering by User defined');
        break;
      case 'random':
        this.orderRandom();
        break;

      default:
        break;
    }
  };

  orderRandom = () => {
    let list = [...this.props.demandList];
    let currentIndex = list.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = list[currentIndex];
      list[currentIndex] = list[randomIndex];
      list[randomIndex] = temporaryValue;
    }
    // return list;
    let ids = list.map((item, index) => {
      return item.id;
    })
    this.props.modalStateChange({ prop: 'demandList', value: list });
    this.props.modalStateChange({ prop: 'demandIds', value: ids });
  }

  orderByPrice = () => {
    let list = [...this.props.demandList];
    let ids = [...this.props.demandIds];
    let newList;
    let newListId;

    newList = list.sort(function (a, b) {
      return (b.cpm - a.cpm);
    });

    newListId = newList.map((item, index) => {
      return item.id;
    })


    this.props.modalStateChange({ prop: 'demandList', value: newList });
    this.props.modalStateChange({ prop: 'demandIds', value: newListId });
  };

  orderUserDefined = () => {
    let list = [...this.props.demandList];
    let ids = [...this.props.demandIds];
    let newList;
    let newListId;

    this.props.modalStateChange({ prop: 'demandList', value: newList });
    this.props.modalStateChange({ prop: 'demandIds', value: newListId });
  };


  moveDown = index => {
    let list = [...this.props.demandList];
    if (index === list.length - 1) {
      return;
    }
    this.props.modalStateChange({ prop: 'demand_prioritization_type', value: 'user_defined' });
    let ids = [...this.props.demandIds];
    let item = list[index];
    let id = ids[index];
    list[index] = list[index + 1];
    ids[index] = ids[index + 1];
    list[index + 1] = item;
    ids[index + 1] = id;
    this.props.modalStateChange({ prop: 'demandList', value: list });
    this.props.modalStateChange({ prop: 'demandIds', value: ids });
  };

  removeFlight = index => {
    let list = [...this.props.demandList];
    let ids = [...this.props.demandIds];
    list.splice(index, 1);
    ids.splice(index, 1);
    this.props.modalStateChange({ prop: 'demandList', value: list });
    this.props.modalStateChange({ prop: 'demandIds', value: ids });
  };

  searchDemand = event => {
    const { id } = this.props;
    let master = this.props.activeUser.scope_account.is_zone_master;
    this.props.modalStateChange({ prop: 'searchTerm', value: event.target.value });
    this.props.listDemand(id, event.target.value, master);
  };

  renderFlights = () => {
    const { demandList } = this.props;
    const { cursorStyle } = styles;

    return demandList.map((item, index) => {
      return (
        <tr key={item.id}>
          <td>{index + 1}</td>
          <td>{item.id}</td>
          <td><a href={`${ROOT_URL}/ui/flight/update/${item.id}`} target={'_blank'}>{item.name}</a></td>
          <td>{`$${(item.cpm / 100).toFixed(2)}`}</td>
          <td>Status</td>
          <td>
            <Popup trigger={<Icon name={'arrow up'} style={cursorStyle} onClick={this.moveUp.bind(null, index)} />} size={'mini'} content={'Move Up'} />
            <Popup trigger={<Icon name={'arrow down'} style={cursorStyle} onClick={this.moveDown.bind(null, index)} />} size={'mini'} content={'Move Down'} />
            <Popup trigger={<Icon name={'remove'} style={cursorStyle} onClick={this.removeFlight.bind(null, index)} />} size={'mini'} content={'Remove Flight'} />
          </td>
        </tr>
      )
    })
  };
  uncheckAll = () => {
    this.setState({ checkAll: false });
    this.setState({ uncheckAll: true });
    let ids = [];
    let list = [];
    this.props.modalStateChange({ prop: 'demandList', value: list });
    this.props.modalStateChange({ prop: 'demandIds', value: ids });
  };

  checkAll = () => {
    this.setState({ uncheckAll: false });
    this.setState({ checkAll: true });
    let list = [];
    let ids = [];
    this.props.demand.map((item, id) => {
      ids.push(item.id);
      list.push({ id: item.id, cpm: item.cpm, name: item.name, status: item.status })

    })
    this.props.modalStateChange({ prop: 'demandList', value: list });
    this.props.modalStateChange({ prop: 'demandIds', value: ids });
  };

  updateDemand = (item, event, data) => {
    this.setState({ uncheckAll: false });
    this.setState({ checkAll: false });
    let list = [...this.props.demandList];
    let ids = [...this.props.demandIds];

    if (!data.checked) {
      list.push({
        id: item.id,
        cpm: item.cpm,
        name: item.name,
        status: item.status,
      });
      ids.push(item.id);
      if (item.deal_id !== '') {
        this.props.modalStateChange({ prop: 'dealIdCheck', value: item.id });
      }

    }
    else if (data.checked) {
      const index = ids.indexOf(item.id);
      list.splice(index, 1);
      ids.splice(index, 1);
      if (item.deal_id !== '') {
        this.props.modalStateChange({ prop: 'dealIdCheck', value: 0 });
      }
    }


    this.props.modalStateChange({ prop: 'demandList', value: list });
    this.props.modalStateChange({ prop: 'demandIds', value: ids });
  };

  renderDemand = () => {
    const { demand, demandIds, placements, dealIdCheck } = this.props;

    return demand.map((item, index) => {
      return (
        <tr key={item.id}>
          <td><Checkbox onClick={this.updateDemand.bind(null, item)} checked={demandIds.includes(item.id)} disabled={!((dealIdCheck == item.id || item.deal_id == '' || !dealIdCheck))} /></td>
          <td>{item.id}</td>
          <td><a href={`${ROOT_URL}/ui/flight/update/${item.id}`} target={'_blank'}>{item.name}</a></td>
          {item.format == 'display' ? <td>{`${item.width} x ${item.height}`} </td> : <td> </td>}
          <td>{`$${(item.cpm / 100).toFixed(2)}`}</td>
          <td>{`$${(item.cpc / 100).toFixed(2)}`}</td>
          {item.status === 'inactive' ? <td><Icon name="remove circle" color="red" size="large" /></td> : <td><Icon name={'check circle'} color={'green'} size={'large'} /></td>}
        </tr>
      )
    })
  };

  render() {
    const { demand_prioritization_type, showAddDemand, searchTerm, error, success, errorMessage, successMessage, name, id, activeItem, demandList, demand, dealIdCheck } = this.props;
    const { searchStyle } = styles;

    if (error) {
      return (
        <Modal isOpen={showAddDemand} toggle={this.toggle} >
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
        <Modal isOpen={showAddDemand} toggle={this.toggle} >
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
      <Modal isOpen={showAddDemand} toggle={this.toggle} className='modal-xl'>
        <ModalHeader toggle={this.toggle}>{`${name} / ID: ${id} - Demand`} </ModalHeader>
        <ModalBody>
          <Col md={12} lg={12}>
            <Card>
              <CardBody>
                <div className='tabs tabs--bordered-bottom'>
                  <div className='tabs__wrap'>
                    <Nav tabs>

                      <NavItem>
                        <NavLink name={'FLIGHTS'} active={activeItem === 'FLIGHTS'} onClick={this.handleTabs.bind(null, 'FLIGHTS')}>
                          Flights
                    </NavLink>
                      </NavItem>

                      <NavItem >
                        <NavLink name={'ADD DEMAND'} active={activeItem == 'ADD DEMAND'} onClick={this.handleTabs.bind(null, 'ADD DEMAND')}>
                          Add Demand
                    </NavLink>
                      </NavItem>
                      <NavItem >
                      </NavItem>


                      {activeItem === "ADD DEMAND" ? <NavItem style={{ marginLeft: '10%' }}>
                        <NavLink>
                          <Input type="checkbox" onClick={this.checkAll.bind()} checked={this.state.checkAll} />Check All

                        </NavLink>
                      </NavItem> : null}
                      {activeItem === "ADD DEMAND" ? <NavItem >
                        <NavLink>

                          <Input type="checkbox" onClick={this.uncheckAll.bind()} checked={this.state.uncheckAll} /> Uncheck All
                        </NavLink>
                      </NavItem> : null}

                      {activeItem === "ADD DEMAND" ? <NavItem style={{ marginLeft: 'auto', marginRight: 0 }}> <Input value={searchTerm} placeholder="Search" onChange={this.searchDemand} style={{ marginBottom: '3px' }} />
                      </NavItem> : <span style={{ marginBottom: '3px', marginLeft: 'auto', marginRight: '30px' }}> Order by: <Dropdown options={options} floating button className='icon' value={demand_prioritization_type} onChange={this.handleSelect} name='demand_prioritization_type' /></span>
                      }
                    </Nav>

                    {activeItem === 'FLIGHTS' && demandList.length ? <Table responsive className='table--bordered dashboard__table-crypto'>
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
                        {this.renderFlights()}
                      </tbody>
                    </Table> : null}
                    {activeItem === 'FLIGHTS' && !demandList.length ? <Alert className='alert--bordered' icon color='info'>
                      There are no flights on your list
          </Alert> : null}

                    {activeItem === 'ADD DEMAND' && demand.length ? <Table responsive className='table--bordered dashboard__table-crypto'>
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
                        {this.renderDemand()}
                      </tbody>
                    </Table> : null}
                  </div>
                </div>


              </CardBody>
              {activeItem === 'ADD DEMAND' && !demand.length ? <Alert color='info' className='alert--bordered' icon style={{ marginTop: 10 }}>
                There are no flights matching the criteria
            </Alert> : null}
            </Card>

          </Col>
        </ModalBody>
        <ModalFooter>
          <ButtonToolbar className='form__button-toolbar'>
            <Button color='primary' onClick={this.handleSave} >Submit</Button>
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
  const { demand_prioritization_type, demand, id, searchTerm, error, success, errorMessage, successMessage, showAddDemand, name, activeItem, demandList, demandIds, dealIdCheck } = state.modal;
  const { placements } = state.placements;
  const { activeUser } = state.shared;
  return { activeUser, demand, id, searchTerm, error, success, errorMessage, successMessage, showAddDemand, name, activeItem, demandList, demandIds, placements, demand_prioritization_type, dealIdCheck };
};

export default connect(mapStateToProps, { modalStateChange, resetModalReducer, listDemand, updateDemandList, changePlacement })(AddDemand);