import React, { Component } from 'react';
import { Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonToolbar, Col} from 'reactstrap';
import { Form, Checkbox} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createUser, updateUser } from '../redux/actions/user.actions';
import { modalStateChange, resetModalReducer, resetUserErrors } from "../redux/actions/modals.actions";
import classNames from 'classnames';
import { masterListAccounts } from '../redux/actions/account.actions';
import Alert from '../components/Alert'
import Input from 'muicss/lib/react/input';
// import Select from 'muicss/lib/react/select';
import { Select } from "semantic-ui-react";
import Option from 'muicss/lib/react/option';

import {
  ROLE_SUPERADMIN,
  ROLE_OPSADMIN,
  ROLE_OPSPOLICY,
  ROLE_ZONEADMIN,
  ROLE_ZONEOPS,
  ROLE_ACCOUNTADMIN,
  ROLE_ACCOUNTOPS,
  ROLE_ACCOUNTMANAGED
} from '../roles';

class User extends Component {
  state = {
    zoneAccounts: [],
    check: true
  }

  componentWillMount() {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    // let zone = activeUser.scope_account.zone.id;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { master, searchTerm, currentPage, sortBy, sortDirection, pageChunk };
    this.props.masterListAccounts(payload);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      setTimeout(() => {
        this.close();
      }, 3000)
    }
  }

  close = () => {
    this.props.update();
    this.props.modalStateChange({ prop: 'showUser', value: false });
    this.props.resetModalReducer();
  };

  handleChange = (event) => {
    this.props.modalStateChange({ prop: event.target.name, value: event.target.value });
  };

  handleSelect = (event, data) => {
    this.props.modalStateChange({ prop: data.name, value: data.value });
    };

  isInputValid = () => {
    this.props.resetUserErrors();
    const { first_name, last_name, email, password, verifyPassword, phone_number, role, modalStatus, account_id } = this.props;

    let arr = [];
    if (first_name.length < 3) {
      arr.push('First Name shall contain at least 3 characters.');
      this.props.modalStateChange({ prop: 'errorFirstName', value: true });
    }
    if (first_name.length > 100) {
      arr.push('First Name shall contain at most 100 characters.');
      this.props.modalStateChange({ prop: 'errorFirstName', value: true });
    }

    if (this.props.activeUser.scope_account.is_zone_master) {
      if (!account_id) {
        arr.push('Select an account.');
        this.props.modalStateChange({ prop: 'account_idError', value: true });
      }

    }

    if (last_name.length < 3) {
      arr.push('Last Name shall contain at least 3 characters.');
      this.props.modalStateChange({ prop: 'errorLastName', value: true });
    }
    if (last_name.length > 100) {
      arr.push('Last Name shall contain at most 100 characters.');
      this.props.modalStateChange({ prop: 'errorLastName', value: true });
    }

    if (!this.emailValid(email) || email.length > 100) {
      arr.push('Please enter a valid email address.');
      this.props.modalStateChange({ prop: 'errorEmail', value: true });
    }

    if (phone_number !== "" && (phone_number.length < 10 || phone_number.length > 15)) {
      arr.push('Please enter a valid phoneNumber number.');
      this.props.modalStateChange({ prop: 'errorPhoneNumber', value: true });
    }

    if (modalStatus !== "edit" || password.length || verifyPassword.length) {
      let re = /[0-9]/;
      if (!re.test(password)) {
        arr.push('Password must contain at least one number');
        this.props.modalStateChange({ prop: 'errorPassword', value: true });
      }
      re = /[a-z]/;
      if (!re.test(password)) {
        arr.push('Password must contain at least one lowercase letter');
        this.props.modalStateChange({ prop: 'errorPassword', value: true });
      }
      re = /[A-Z]/;
      if (!re.test(password)) {
        arr.push('Password must contain at least one uppercase letter');
        this.props.modalStateChange({ prop: 'errorPassword', value: true });
      }
      if (password.length < 6) {
        arr.push('Password must be at least 6 characters long');
        this.props.modalStateChange({ prop: 'errorPassword', value: true });
      }
      if (password.length > 20) {
        arr.push('Password must be at most 20 characters long');
        this.props.modalStateChange({ prop: 'errorPassword', value: true });
      }
      if (password !== verifyPassword) {
        arr.push('Passwords do not match');
        this.props.modalStateChange({ prop: 'errorPassword', value: true });
        this.props.modalStateChange({ prop: 'errorVerifyPassword', value: true });
      }
    }

    if (!role) {
      arr.push('Please select role(s)');
    }

    if (role > 512 && role < 1024 || role > 1024) {
      arr.push('Publisher / Advertiser Role cannot be combined with other roles');
    }

    if (arr.length > 0) {
      this.props.modalStateChange({ prop: 'errorList', value: arr });
      this.props.modalStateChange({ prop: 'password', value: '' });
      this.props.modalStateChange({ prop: 'verifyPassword', value: '' });
      return false;
    }
    return true;
  };

  emailValid = (email) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.isInputValid()) {
      return;
    }

    const { id, password, email, first_name, last_name, phone_number, role, modalStatus, account_id } = this.props;

    if (modalStatus === "create") {
      this.props.createUser({ password, email, first_name, last_name, phone_number, role, account_id });
    }
    else if (modalStatus === "edit") {
      this.props.updateUser({ id, password, first_name, last_name, phone_number, role, account_id });
    }
  };

  handleRole = (event, data) => {
    let role = this.props.role;

    if (!data.checked) {
      role += Number(data.value);
    }
    else if (data.checked) {
      role -= Number(data.value);
    }

    this.props.modalStateChange({ prop: 'role', value: role });
  };


  renderRole = (newRole, user) => {
    const { role } = this.props;

    switch (newRole) {
      case true:
        return (
          <Form.Field>
            <Checkbox label="Advertiser" value="1024" checked={Boolean(role & 1024)} name="advertiser_managed" onClick={this.handleRole} />
          </Form.Field>
        )

      case 1:
        if ((user.user.role & ROLE_SUPERADMIN) && user.user.account.id === user.scope_account.id) {
          return (
            <Form.Field>
              <Checkbox label="Super Admin" value="1" checked={Boolean(role & 1)} name="super_admin" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else {
          return null;
        }
      case 2:
        if (((user.user.role & ROLE_SUPERADMIN) || (user.user.role & ROLE_OPSADMIN)) && user.user.account.id === user.scope_account.id) {
          return (
            <Form.Field>
              <Checkbox label="BWA Admin" value="2" checked={Boolean(role & 2)} name="ops_admin" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else {
          return null;
        }
      case 8:
        if (((user.user.role & ROLE_SUPERADMIN) || (user.user.role & ROLE_OPSADMIN)) && user.user.account.id === user.scope_account.id) {
          return (
            <Form.Field>
              <Checkbox label="BWA Policy" value="8" checked={Boolean(role & 8)} name="ops_policy" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else {
          return null;
        }
      case 16:
        if (((user.user.role & ROLE_SUPERADMIN) || (user.user.role & ROLE_OPSADMIN)) && this.props.activeUser.scope_account.is_zone_master) {
          return (
            <Form.Field>
              <Checkbox label="Zone Admin" value="16" checked={Boolean(role & 16)} name="zone_admin" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else if ((user.user.role & ROLE_ZONEADMIN) && user.user.account.id === user.scope_account.id && this.props.activeUser.scope_account.is_zone_master) {
          return (
            <Form.Field>
              <Checkbox label="Zone Admin" value="16" checked={Boolean(role & 16)} name="zone_admin" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else {
          return null;
        }
      case 32:
        if (((user.user.role & ROLE_SUPERADMIN) || (user.user.role & ROLE_OPSADMIN)) && user.user.zone_id !== user.scope_account.zone.id && this.props.activeUser.scope_account.is_zone_master) {
          return (
            <Form.Field>
              <Checkbox label="Zone Operations" value="32" checked={Boolean(role & 32)} name="zone_ops" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else if (((user.user.role & ROLE_ZONEADMIN) || (user.user.role & ROLE_ZONEOPS)) && user.user.account.id === user.scope_account.id && this.props.activeUser.scope_account.is_zone_master) {
          return (
            <Form.Field>
              <Checkbox label="Zone Operations" value="32" checked={Boolean(role & 32)} name="zone_ops" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else {
          return null;
        }
      case 64:
        if (((user.user.role & ROLE_SUPERADMIN) || (user.user.role & ROLE_OPSADMIN)) && user.user.zone_id !== user.scope_account.zone.id) {
          return (
            <Form.Field>
              <Checkbox label="Account Admin" value="64" checked={Boolean(role & 64)} name="account_admin" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else if (((user.user.role & ROLE_ZONEADMIN) || (user.user.role & ROLE_ZONEOPS)) && user.user.zone_id === user.scope_account.zone.id) {
          return (
            <Form.Field>
              <Checkbox label="Account Admin" value="64" checked={Boolean(role & 64)} name="account_admin" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else if ((user.user.role & ROLE_ACCOUNTADMIN) && user.user.account.id === user.scope_account.id) {
          return (
            <Form.Field>
              <Checkbox label="Account Admin" value="64" checked={Boolean(role & 64)} name="account_admin" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else {
          return null;
        }
      case 128:
        if (((user.user.role & ROLE_SUPERADMIN) || (user.user.role & ROLE_OPSADMIN)) && user.user.zone_id !== user.scope_account.zone.id) {
          return (
            <Form.Field>
              <Checkbox label="Account Operations" value="128" checked={Boolean(role & 128)} name="account_ops" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else if (((user.user.role & ROLE_ZONEADMIN) || (user.user.role & ROLE_ZONEOPS)) && user.user.zone_id === user.scope_account.zone.id) {
          return (
            <Form.Field>
              <Checkbox label="Account Operations" value="128" checked={Boolean(role & 128)} name="account_ops" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else if ((user.user.role & ROLE_ACCOUNTADMIN) && user.user.account.id === user.scope_account.id) {
          return (
            <Form.Field>
              <Checkbox label="Account Operations" value="128" checked={Boolean(role & 128)} name="account_ops" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else {
          return null;
        }
      case 512:
        if (((user.user.role & ROLE_SUPERADMIN) || (user.user.role & ROLE_OPSADMIN)) || this.props.activeUser.scope_account.is_zone_master) {
          return (
            <Form.Field>
              <Checkbox label="Publisher" value="512" checked={Boolean(role & 512)} name="account_managed" onClick={this.handleRole} />
            </Form.Field>
          )
        }
        else {
          return null;
        }


    }

  };

  render() {
    const { account_id, zone_accounts, account_idError, showUser, error, errorMessage, success, successMessage, password, verifyPassword, email, first_name, last_name, phone_number, role, modalStatus, errorList, activeUser, errorFirstName, errorLastName, errorEmail, errorPhoneNumber, errorPassword, errorVerifyPassword } = this.props;
    const { dropdownStyle } = styles;


    if (error) {
      return (
        <Modal isOpen={showUser} toggle={this.toggle} >
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
        <Modal isOpen={showUser} toggle={this.toggle} >
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
      <Modal isOpen={showUser} toggle={this.toggle} >
        <ModalHeader toggle={this.toggle}>{status === 'edit' ? 'Edit Publisher' : 'Create Publisher'}</ModalHeader>
        <ModalBody>
          <Col md={12} lg={12}>
            <Card>
              <CardBody>
                <form>
                {activeUser.scope_account.is_zone_master && <div>{account_id? <label className={classNames('bwa-floating-label2', { 'bwa-floated': account_id })} >Account Name</label>:<label></label>} <Select style={{border:'none', margin:0, padding:0}} placeholder='Account Name'  selection search fluid name="account_id" value={account_id} options={this.props.zone_accounts}  onChange={this.handleSelect} error={account_idError} /></div>}
                <hr/>

                  <Input label="First Name" floatingLabel={true} value={first_name} onChange={this.handleChange} name="first_name" className={classNames({ 'floatinginp': first_name }, { 'errorinp': errorFirstName })} />

                  <Input label="Last Name" floatingLabel={true} value={last_name} onChange={this.handleChange} name="last_name" className={classNames({ 'floatinginp': last_name }, { 'errorinp': errorLastName })} />
                  
                  <Input type="email" label="Email" floatingLabel={true} value={email} onChange={this.handleChange} name="email" className={classNames({ 'floatinginp': email }, { 'errorinp': errorEmail })} />

                  <Input label="Phone Number" floatingLabel={true} value={phone_number} onChange={this.handleChange} name="phone_number" className={classNames({ 'floatinginp': phone_number }, { 'errorinp': errorPhoneNumber })} />

                  <Input type="password" label="Password" floatingLabel={true} value={password} onChange={this.handleChange} name="password" className={classNames({ 'floatinginp': password }, { 'errorinp': errorPassword })} />

                  <Input type="password" label="Confirm Password" floatingLabel={true} value={verifyPassword} onChange={this.handleChange} name="verifyPassword" className={classNames({ 'floatinginp': verifyPassword }, { 'errorinp': errorVerifyPassword })} />
                </form>

                <h5> Select Roles </h5>
                {this.renderRole(1, activeUser)}
                {this.renderRole(2, activeUser)}
                {this.renderRole(8, activeUser)}
                {this.renderRole(16, activeUser)}
                {this.renderRole(32, activeUser)}
                {this.renderRole(64, activeUser)}
                {this.renderRole(128, activeUser)}
                {this.renderRole(512, activeUser)}
                {this.renderRole(this.props.activeUser.scope_account.is_zone_master, activeUser)}

                {errorList.length ? errorList.map((val, index) => {
                  return <Alert key={index} color='danger'> {val} </Alert>
                })
                  : null}

              </CardBody>
            </Card>

          </Col>
        </ModalBody>
        <ModalFooter>
          <ButtonToolbar className='form__button-toolbar'>
            <Button color='primary' onClick={this.handleSubmit} >Submit</Button>
            <Button type='button' onClick={this.close}> Cancel </Button>
          </ButtonToolbar>
        </ModalFooter>

      </Modal>
    )
  }
}

const styles = {
  dropdownStyle: {
    marginBottom: "10px"
  }
};

const mapStateToProps = state => {
  const { showUser, account_id, account_idError, error, errorMessage, success, successMessage, password, verifyPassword, email, first_name, last_name, phone_number, role, modalStatus, errorList, errorFirstName, errorLastName, errorEmail, errorPhoneNumber, errorPassword, errorVerifyPassword, id } = state.modal;
  const { activeUser } = state.shared;
  const { accounts, zone_accounts } = state.accounts;

  return { zone_accounts, accounts, showUser, account_id, account_idError, error, errorMessage, success, successMessage, password, verifyPassword, email, first_name, last_name, phone_number, role, modalStatus, errorList, errorFirstName, errorLastName, errorEmail, errorPhoneNumber, errorPassword, errorVerifyPassword, id, activeUser };
};

export default connect(mapStateToProps, { masterListAccounts, createUser, updateUser, modalStateChange, resetModalReducer, resetUserErrors })(User);
