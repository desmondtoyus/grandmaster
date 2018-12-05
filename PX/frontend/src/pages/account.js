import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Accordion, Header, Icon, Popup } from 'semantic-ui-react';
import { capitalize, isAllowed } from "../functions";
import ModalManager from "../modals/modal.manager";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import UsersGrid from './grids/users.grid';
import { readActiveAccount, readAccount, resetAccountsReducer } from '../redux/actions/account.actions';
import { modalStateChange } from "../redux/actions/modals.actions";
import { Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';

class Account extends Component {
  componentWillMount() {
    const { match } = this.props;
    if (match.params.id && !isNaN(Number(match.params.id)) && Number(match.params.id) > 0) {
      this.props.readActiveAccount(Number(match.params.id));
    }
  }

  componentWillUnmount() {
    this.props.resetAccountsReducer();
  }

  updateCallback = () => {
    this.props.readActiveAccount(Number(this.props.match.params.id));
  };

  editAccount = event => {
    event.stopPropagation();
    const { activeAccount } = this.props;
    this.props.readAccount(activeAccount.id);
    this.props.modalStateChange({ prop: 'modalStatus', value: 'edit' });
    this.props.modalStateChange({ prop: 'showAccount', value: true });
  };

  render() {
    const { match, activeAccount, activeUser } = this.props;

    if (!match.params.id || isNaN(Number(match.params.id)) || Number(match.params.id) <= 0) {
      return (
        <div className={'sub-content'}>
          <Alert color='info'>You selected an invalid account. Please <Link to="/ui/accounts">click here</Link> to go back to the accounts page.</Alert>
        </div>
      )
    }

    if (!activeAccount) {
      return (
        <div></div>
      )
    }

    if (!isAllowed('Accounts', activeUser.user)) {
      return (
        <div className={'sub-content'}>
          <Alert color='danger'>You are not authorized to view this page</Alert>
        </div>
      )
    }

    const { header, divStyle, cursorStyle } = styles;

    return (
      <div className={'sub-content'}>
        <ModalManager currentModal={'ACCOUNT'} update={this.updateCallback} />
        <Breadcrumb tag="nav">
          <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
          <BreadcrumbItem> <Link to={`/ui/accounts`}>Accounts</Link></BreadcrumbItem>
          <BreadcrumbItem ><Link to={`/ui/users`}>Users</Link></BreadcrumbItem>
        </Breadcrumb>

        <div style={divStyle}>
          <Accordion fluid styled>
            <Accordion.Title className={'bwa-accordion-title'}>
              <Icon name={'dropdown'} />
              {`${activeAccount.name} / ID: ${activeAccount.id} - Status: ${capitalize(activeAccount.status)}`}
              {' '}
              <Popup trigger={<Icon style={cursorStyle} name={'edit'} onClick={this.editAccount} />} size={'mini'} content={'Edit Account'} />
            </Accordion.Title>
            <Accordion.Content className={'bwa-accordion-content'}>
              <Header as="h5">Notes: <Header.Subheader style={header}>{activeAccount.notes !== "" ? activeAccount.notes : "None"}</Header.Subheader></Header>
            </Accordion.Content>
          </Accordion>
        </div>
        <UsersGrid />
      </div>
    )
  }
}

const styles = {
  header: {
    display: "inline-block",
    fontSize: "0.9em"
  },
  divStyle: {
    marginTop: 10
  },
  cursorStyle: {
    cursor: 'pointer'
  }
};

const mapStateToProps = state => {
  const { activeUser } = state.shared;
  const { activeAccount } = state.accounts;


  return { activeUser, activeAccount };
};

export default withRouter(connect(mapStateToProps, { readActiveAccount, readAccount, modalStateChange, resetAccountsReducer })(Account));