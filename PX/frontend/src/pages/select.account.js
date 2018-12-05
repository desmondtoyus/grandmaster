import React, {PureComponent} from 'react';
import { Card, Container, CardBody, Col, Badge, Input, Row, Alert} from 'reactstrap';
import Table from '../components/table/Table';
import { resetAccountsReducer, changeAccounts, setUserScope, listScopeAccounts } from "../redux/actions/account.actions";
import { readActiveUser } from '../redux/actions/user.actions';
import { connect } from 'react-redux';
import { isAllowed } from '../functions';
import Paginator from '../app/paginator';
import { changeMenuState } from "../redux/actions/menu.actions";


class Accounts extends PureComponent {
  componentWillMount() {
    this.props.readActiveUser();
    this.props.changeMenuState({ prop: 'fullMenu', value: false });
  }

  componentDidMount() {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk } = this.props;
    const payload = { searchTerm, currentPage, sortBy, sortDirection, pageChunk };
    this.props.listScopeAccounts(payload);
  }

  componentWillUnmount() {
    this.props.resetAccountsReducer();
  }

  selectAccount = (event) => {
    this.props.setUserScope(event.target.id, this.props.history.push);
  };

  renderTableBody = () => {
    const { accounts } = this.props;

    return accounts.map((item, index) => {
      return (
        <tr key={index}>
          <td key={item.id} onClick={this.selectAccount}>{item.id}</td>
          <td id={item.id} onClick={this.selectAccount}>{item.name}</td>
          <td><Badge color='primary'>Active</Badge></td>
        </tr>
      )
    })
  };

  searchAccounts = (event) => {
    this.props.changeAccounts({ prop: 'searchTerm', value: event.target.value });
    this.props.changeAccounts({ prop: 'currentPage', value: 1 });
    const { sortBy, sortDirection, pageChunk } = this.props;
    const payload = { currentPage: 1, sortBy, sortDirection, pageChunk, searchTerm: event.target.value };
    this.props.listScopeAccounts(payload);
  };

  handleSort = (event) => {
    const { searchTerm, currentPage, pageChunk, sortDirection } = this.props;
    const payload = { searchTerm, currentPage, pageChunk, sortBy: event.target.id, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' };
    this.props.changeAccounts({ prop: 'idSort', value: event.target.id === "id" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeAccounts({ prop: 'nameSort', value: event.target.id === "name" ? `sort ${payload.sortDirection}ending` : 'sort' });
    this.props.changeAccounts({ prop: 'sortBy', value: event.target.id });
    this.props.changeAccounts({ prop: 'sortDirection', value: payload.sortDirection });

    this.props.listScopeAccounts(payload);
  };

  handlePagination = (currentPage) => {
    const { searchTerm, sortBy, sortDirection, pageChunk } = this.props;

    this.props.changeAccounts({ prop: 'currentPage', value: currentPage });
    let payload = { searchTerm, sortBy, sortDirection, pageChunk, currentPage };
    this.props.listScopeAccounts(payload);
  };
  render() {
    const { activeUser, activeUserError } = this.props;

    if (!activeUser && !activeUserError) {
      // setTimeout(() => {
      //   window.location.href = "/"
      // }, 3000)
      return (
        <Container style={{marginTop:'5%'}}>
          <Alert color='danger'>You are not authorized to view this page</Alert>
        </Container>
      )
    }

    if (!isAllowed('Accounts', activeUser.user)) {
      // setTimeout(() => {
      //   window.location.href = "/"
      // }, 3000)
      return (
        <Container>
          <Alert color='danger' style={{ marginTop: '5%' }}>User not authorized</Alert>
        </Container>
      )
    }
    const { searchStyle, cursorStyle, dimmerStyle } = styles;
    const { searchTerm, history, loader, accounts, listError, idSort, nameSort, pagination } = this.props;
    return (
      <div>
      <Col md={12} lg={12} >
          <Card >
          <CardBody>
            {!loader && accounts.length && !listError ?  <Row>
                <Col md="2">
                ACCOUNTS
                </Col>
              <Col md="8"><h4 className='subhead'>Please Select an Account</h4></Col>
              <Col md="2"><Input placeholder="Search" value={searchTerm} onChange={this.searchAccounts} style={{ marginBottom:'3px'}}/></Col>
            </Row>: null}
            {loader ? <div id="app" className="loader"></div> : null}
            {!loader && !accounts.length && !listError ? <Alert color="info">There are no matching accounts.</Alert> : null}
            {!loader && accounts.length && !listError ? <Table responsive className='table--bordered' hover responsive>
              <thead>
              <tr>
                    <th>ID <i className={this.props.sortDirection === 'asc' && this.props.sortBy=="id" ? "sort-by-asc " : "sort-by-desc" } name={idSort} id="id" onClick={this.handleSort}  /></th>
                    <th>Account Name <i className={this.props.sortDirection === 'asc' && this.props.sortBy == "name" ? "sort-by-asc" : "sort-by-desc"} name={nameSort} id="name" onClick={this.handleSort}  /></th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
                {this.renderTableBody()}
              </tbody>
            </Table> : null}
            {!loader && accounts.length && !listError ? <Paginator pagination={pagination} handlePagination={this.handlePagination} style={{ marginLeft: '100px' }} />: null}
            {listError ? <Alert color='danger'>Cannot display accounts at this time. Please try again later.</Alert> : null}
          </CardBody>
        </Card>
      </Col>
        </div>
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
  const { accounts, pagination, listError, loader, idSort, nameSort, searchTerm, sortBy, sortDirection, currentPage, pageChunk } = state.accounts;
  const { activeUser, activeUserError } = state.shared;

  return { accounts, pagination, listError, loader, activeUser, activeUserError, idSort, nameSort, searchTerm, sortBy, sortDirection, currentPage, pageChunk }
};

export default connect(mapStateToProps, {changeMenuState, listScopeAccounts, readActiveUser, setUserScope, resetAccountsReducer, changeAccounts })(Accounts);