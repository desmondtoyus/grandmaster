import React, { Component } from 'react';
import { Container, Menu, Form, Segment, Table, Icon, Message, Dimmer, Loader, Breadcrumb } from 'semantic-ui-react';
import { listBeacons, deleteBeacon, resetBeaconsReducer, resetBeaconErrors, listDisabledBeacons } from '../actions/beacon';
import { connect } from 'react-redux';
import moment from 'moment';
import { readActiveUser, checkStatus } from '../actions/user';
import { REFRESH_RATE } from '../vars';
import { isAllowed, isURLValid, parseQuery } from '../functions';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Bar from '../components/bar';
import ModalManager from '../modals/modal.manager.js';
import ConfirmAction from '../modals/confirm.action';

let listInterval;

class Beacons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: {},
      searchterm: "",
      curpage: 1,
      sort: "id",
      sortdir: "desc",
      pagechunk: 15,
      errorAlert: "",
      activeItem: "BEACONS",
      listError: false,
      action: {
        error: false,
        success: false,
        message: ""
      },
      alert: {
        header: "",
        message: "",
        error: false,
        success: false
      },
      stopInterval: false
    };
  }

  componentWillMount() {
    this.setState({ query: parseQuery(this.props.location.search) });
    this.props.readActiveUser();
    this.props.checkStatus(this.props.history.push);
  }

  componentDidMount() {
    let userInterval = setInterval(() => {
      if (this.props.activeUser) {
        const payload = {
          searchterm: "",
          curpage: 1,
          sorting: "id",
          sortdir: "desc",
          pagechunk: 15,
          filteraccount: this.props.activeUser.scope.account_id
        };

        this.props.listBeacons(payload);
        clearInterval(userInterval);
      }
    });

    listInterval = setInterval(() => {
      const payload = {
        searchterm: this.state.searchterm,
        curpage: this.state.curpage,
        sort: this.state.sorting,
        sortdir: this.state.sortdir,
        pagechunk: this.state.pagechunk,
        filteraccount: this.props.activeUser.scope.account_id
      };

      if (!this.state.stopInterval) {
        this.props.listBeacons(payload);
      }
      this.props.checkStatus(this.props.history.push);
    }, REFRESH_RATE);
  }

  componentWillUnmount() {
    clearInterval(listInterval);
    this.props.resetBeaconsReducer();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ listError: nextProps.listError, action: nextProps.action, alert: nextProps.alert });
  }

  renderTableBody = () => {
    return this.props.beacons.map((item) => {
      return (
        <Table.Row key={item.id}>
          <Table.Cell>{item.id}</Table.Cell>
          <Table.Cell>{item.title}</Table.Cell>
          <Table.Cell>{item.flight === "" ? "Not assigned" : item.flight}</Table.Cell>
          <Table.Cell>{moment(moment.unix(item.createdat)).format('MM-DD-YYYY')}</Table.Cell>
          <Table.Cell>
            <ModalManager currentModal="DISPLAY_BEACON" id={item.id} />
            <ConfirmAction type="trash" header="Are you sure you want to delete this beacon?" message="The beacon deletion cannot be undone." actionFunction={this.deleteBeacon} id={item.id} popup="Delete Beacon" action={this.state.action} callback={this.resetAction.bind(this)} />
          </Table.Cell>
        </Table.Row>
      )
    })
  };

  resetAction = () => {
    this.props.resetBeaconErrors();
    this.setState({
      action: {
        message: "",
        error: false,
        success: false
      },
      stopInterval: false
    })
  };

  handlePagination = (event, data) => {
    let payload = {
      searchterm: this.state.searchterm,
      sort: this.state.sorting,
      sortdir: this.state.sortdir,
      pagechunk: this.state.pagechunk,
      filteraccount: this.props.activeUser.scope.account_id
    };

    if (data.id) {
      switch(data.id) {
        case "first":
          payload.curpage = 1;
          this.setState({ curpage: 1 });
          break;
        case "prev":
          if (this.state.curpage !== 1 && this.props.pagination.totalpages !== 1) {
            payload.curpage = this.state.curpage - 1;
            this.setState({ curpage: this.state.curpage - 1 });
          }
          break;
        case "next":
          if (this.state.curpage !== this.props.pagination.totalpages && this.props.pagination.totalpages !== 1) {
            payload.curpage = this.state.curpage + 1;
            this.setState({ curpage: this.state.curpage + 1 });
          }
          break;
        case "last":
          payload.curpage = this.props.pagination.totalpages;
          this.setState({ curpage: this.props.pagination.totalpages });
          break;
      }
    }
    else {
      payload.curpage = data.children;
      this.setState({ curpage: data.children });
    }

    if (this.state.activeItem === "BEACONS") {
      this.props.listBeacons(payload);
    }
    else if (this.state.activeItem === "DISABLED") {
      this.props.listDisabledBeacons(payload);
    }
  };

  getMidpageNumber = () => {
    switch(this.state.curpage) {
      case 1:
        return 2;
      case this.props.pagination.totalpages:
        return this.props.pagination.totalpages - 1;
      default:
        return this.state.curpage;
    }
  };

  renderPagination = () => {
    return (
      <Menu size="mini" floated="right" pagination>
        <Menu.Item id="first" onClick={this.handlePagination} as='a' icon>
          <Icon name="double angle left" />
        </Menu.Item>
        <Menu.Item id="prev" onClick={this.handlePagination} as='a' icon>
          <Icon name="angle left" />
        </Menu.Item>
        { this.props.pagination.totalpages === 1 ? <Menu.Item onClick={this.handlePagination} as='a' active={this.state.curpage === 1}>{this.state.curpage}</Menu.Item> : null }
        { this.props.pagination.totalpages === 2 ? <Menu.Item onClick={this.handlePagination} as='a' active={this.state.curpage === 1}>{1}</Menu.Item> : null }
        { this.props.pagination.totalpages > 2 ? <Menu.Item onClick={this.handlePagination} as='a' active={this.state.curpage === 1}>{this.state.curpage === 1 ? 1 : this.getMidpageNumber() - 1}</Menu.Item> : null }
        { this.props.pagination.totalpages === 2 ? <Menu.Item onClick={this.handlePagination} as='a' active={this.state.curpage === 2}>{2}</Menu.Item> : null }
        { this.props.pagination.totalpages > 2 ? <Menu.Item onClick={this.handlePagination} as="a" active={this.state.curpage !== 1 && this.state.curpage !== this.props.pagination.totalpages}>{this.getMidpageNumber()}</Menu.Item> : null }
        { this.props.pagination.totalpages > 2 ? <Menu.Item onClick={this.handlePagination} as='a' active={this.state.curpage === this.props.pagination.totalpages}>{this.getMidpageNumber() + 1}</Menu.Item> : null }
        <Menu.Item id="next" onClick={this.handlePagination} as='a' icon>
          <Icon name="angle right" />
        </Menu.Item>
        <Menu.Item id="last" onClick={this.handlePagination} as='a' icon>
          <Icon name="double angle right" />
        </Menu.Item>
      </Menu>
    )
  };

  handleSort = (event) => {
    const payload = {
      searchterm: this.state.searchterm,
      curpage: this.state.curpage,
      sort: event.target.id,
      sortdir: this.state.sortdir === 'asc' ? 'desc' : 'asc',
      pagechunk: this.state.pagechunk,
      filteraccount: this.props.activeUser.scope.account_id
    };

    this.setState({ sortdir: payload.sortdir, sorting: event.target.id });
    if (this.state.activeItem === "BEACONS") {
      this.props.listBeacons(payload);
    }
    else if (this.state.activeItem === "DISABLED") {
      this.props.listDisabledBeacons(payload);
    }
  };

  searchBeacons = (event) => {
    this.setState({ searchterm: event.target.value, curpage: 1 });
    const payload = {
      searchterm: event.target.value,
      curpage: 1,
      sort: this.state.sorting,
      sortdir: this.state.sortdir,
      pagechunk: this.state.pagechunk,
      filteraccount: this.props.activeUser.scope.account_id
    };

    if (this.state.activeItem === "BEACONS") {
      this.props.listBeacons(payload);
    }
    else if (this.state.activeItem === "DISABLED") {
      this.props.listDisabledBeacons(payload);
    }
  };

  deleteBeacon = (id) => {
    this.props.deleteBeacon(id);
  };

  handleTabs = (event, data) => {
    this.setState({ activeItem: data.name, curpage: 1 });
    clearInterval(listInterval);

    const payload = {
      searchterm: this.state.searchterm,
      curpage: 1,
      sort: this.state.sorting,
      sortdir: this.state.sortdir,
      pagechunk: this.state.pagechunk,
      filteraccount: this.props.activeUser.scope.account_id
    };

    if (data.name === "BEACONS") {
      this.props.listBeacons(payload);
    }
    else if (data.name === "DISABLED") {
      this.props.listDisabledBeacons(payload);
    }

    listInterval = setInterval(() => {
      const payload = {
        searchterm: this.state.searchterm,
        curpage: this.state.curpage,
        sort: this.state.sorting,
        sortdir: this.state.sortdir,
        pagechunk: this.state.pagechunk,
        filteraccount: this.props.activeUser.scope.account_id
      };

      if (data.name === "BEACONS") {
        this.props.listBeacons(payload);
      }
      else if (data.name === "DISABLED") {
        this.props.listDisabledBeacons(payload);
      }
      this.props.checkStatus(this.props.history.push);
    }, REFRESH_RATE)
  };

  render() {
    if (!isURLValid(this.state.query)) {
      return (
        <Container fluid>
          <Message negative size="massive">The URL you entered is not valid. Please <a href="/">click here</a> to go back to the log in page.</Message>
        </Container>
      )
    }

    if (this.props.activeUser === null) {
      return (
        <div></div>
      )
    }

    if (!isAllowed('Flights', this.props.activeUser.content)) {
      return (
        <Container fluid>
          <Message negative size="massive">You are not authorized to view this page</Message>
        </Container>
      )
    }

    const itemStyle = {
      paddingTop: "5px",
      paddingBottom: "5px",
      paddingRight: "0px"
    };

    const dimmerStyle = {
      height: "300px"
    };

    const cursorStyle = {
      cursor: "pointer"
    };

    return (
      <div className={classNames("content", {'menu-open': this.props.menu})}>
        <Container fluid>
          <Bar query={query} title={`${this.props.activeUser.scope.title} - (Primary: ${this.props.activeUser.scope.primary_account_title})`} user={this.props.activeUser} callback={this.props.history.push} />
          <div className="sub-content">
            <Breadcrumb size="tiny">
              <Breadcrumb.Section>
                <Link to={`/ui/home?aid=${this.state.query.aid}&cid=${this.state.query.cid}&fid=${this.state.query.fid}&fst=${this.state.query.fst}&pid=${this.state.query.pid}&plid=${this.state.query.plid}&pst=${this.state.query.pst}`}>HOME</Link>
              </Breadcrumb.Section>
              <Breadcrumb.Divider>/</Breadcrumb.Divider>
              <Breadcrumb.Section active>BEACONS</Breadcrumb.Section>
            </Breadcrumb>
            <Menu attached='top' pointing secondary>
              <Menu.Item name="BEACONS" active={this.state.activeItem === "BEACONS"} onClick={this.handleTabs}>BEACONS</Menu.Item>
              { this.props.activeUser.content.role_super_admin || this.props.activeUser.content.role_ops_admin ? <Menu.Item name="DISABLED" active={this.state.activeItem === "DISABLED"} onClick={this.handleTabs}>DISABLED</Menu.Item> : null }
              <ModalManager currentModal="CREATE_BEACON" source="list" />
              <Menu.Menu position='right'>
                <Menu.Item style={itemStyle}>
                  <Form.Input size="small" value={this.state.searchterm} placeholder="Search" onChange={this.searchBeacons.bind(this)}/>
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            { this.props.loader ? <Segment attached="bottom"><Dimmer active inverted style={dimmerStyle}><Loader size='large'>Loading</Loader></Dimmer></Segment> : null }
            { !this.props.loader && !this.props.beacons.length && !this.state.listError ? <Message size="massive">There are no beacons matching the criteria</Message> : null }
            { !this.props.loader && this.props.beacons.length ? <Table attached="bottom" singleLine selectable fixed>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>ID <Icon name="sort" id="id" onClick={this.handleSort} style={cursorStyle} /></Table.HeaderCell>
                  <Table.HeaderCell>Name <Icon name="sort" id="title" onClick={this.handleSort} style={cursorStyle}/></Table.HeaderCell>
                  <Table.HeaderCell>Flight</Table.HeaderCell>
                  <Table.HeaderCell>Created Date <Icon name="sort" id="createdat" onClick={this.handleSort} style={cursorStyle} /></Table.HeaderCell>
                  <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.renderTableBody()}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan={5}>
                    {this.renderPagination()}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table> : null }
            { this.state.listError ? <Message negative size="massive">Cannot display beacons at this time. Please try again later</Message> : null }
          </div>
        </Container>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { beacons: state.beacons.all, pagination: state.beacons.pagination, activeUser: state.users.activeUser, listError: state.beacons.listError, action: state.beacons.action, alert: state.beacons.alert, loader: state.beacons.loader };
}

export default connect(mapStateToProps, { listBeacons, deleteBeacon, listDisabledBeacons, resetBeaconErrors, resetBeaconsReducer, readActiveUser, checkStatus })(Beacons);
