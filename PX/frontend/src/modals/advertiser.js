import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createAdvertiser, updateAdvertiser } from '../redux/actions/advertiser.actions';
import { modalStateChange, resetModalReducer, resetAdvertiserErrors } from "../redux/actions/modals.actions";
import classNames from 'classnames';
import { masterListAccounts } from '../redux/actions/account.actions';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';
// import Select from 'muicss/lib/react/select';
import { Select } from "semantic-ui-react";
import Alert from '../components/Alert';

import {Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonToolbar,FormGroup, Label,  FormFeedback, FormText, Col } from 'reactstrap';
class Advertiser extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      setTimeout(() => {
        this.close();
      }, 3000);
    }
  }

  componentWillMount() {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { master, searchTerm, currentPage, sortBy, sortDirection, pageChunk };
    this.props.masterListAccounts(payload);
  }

  close = () => {
    this.props.update();
    this.props.modalStateChange({ prop: 'showAdvertiser', value: false });
    this.props.resetModalReducer();
  };

  isInputValid = () => {
    this.props.resetAdvertiserErrors();
    const { name, notes, account_id } = this.props;

    let arr = [];
    if (name.length < 6) {
      arr.push('Advertiser Name shall contain at least 6 characters.');
      this.props.modalStateChange({ prop: 'errorName', value: true });
    }
    if (name.length > 100) {
      arr.push('Advertiser Name shall contain at most 100 characters.');
      this.props.modalStateChange({ prop: 'errorName', value: true });
    }
    if (!(name.length > 100) && !(name.length < 6) && !isNaN(name)) {
      arr.push('Advertiser name cannot all be numbers');
      this.props.modalStateChange({ prop: 'errorName', value: true });
    }
    if (notes.length > 500) {
      arr.push('Notes shall contain at most 500 characters.');
      this.props.modalStateChange({ prop: 'errorNotes', value: true });
    }
    if (this.props.activeUser.scope_account.is_zone_master) {
      if (!account_id) {
        arr.push('Select an account.');
        this.props.modalStateChange({ prop: 'account_idError', value: true });
      }

    }

    if (arr.length > 0) {
      this.props.modalStateChange({ prop: 'errorList', value: arr });
      return false;
    }
    return true;
  };

  handleChange = event => {
    this.props.modalStateChange({ prop: event.target.name, value: event.target.value });
  };

  handleSelect = (event, data) => {
    this.props.modalStateChange({ prop: data.name, value: data.value });
    };

  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.isInputValid()) {
      return;
    }

    const { id, account_id, name, notes, modalStatus } = this.props;

    if (modalStatus === "create") {
      this.props.createAdvertiser({ name, account_id, notes });
    }
    else if (modalStatus === 'edit') {
      this.props.updateAdvertiser({ id, name, account_id, notes });
    }
  };


  render() {
    const { activeUser, account_id, account_idError, showAdvertiser, error, errorMessage, success, successMessage, name, notes, errorName, errorNotes, modalStatus, errorList, accounts } = this.props;
    if (error) {
      return (
        <Modal isOpen={showAdvertiser} toggle={this.toggle} >
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
        <Modal isOpen={showAdvertiser} toggle={this.toggle} >
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
      <Modal isOpen={showAdvertiser} toggle={this.toggle} className="modal-lg">
        <ModalHeader toggle={this.toggle}>{modalStatus === 'edit' ? 'Edit Advertiser' : 'Create New Advertiser'}</ModalHeader>
        <ModalBody>
          <Col md={12} lg={12}>
            <Card>
              <CardBody>
                <Form>
                {activeUser.scope_account.is_zone_master && <div>{account_id? <label className={classNames('bwa-floating-label2', { 'bwa-floated': account_id })} >Account Name</label>:<label></label>} <Select style={{border:'none', margin:0, padding:0}} placeholder='Account Name'  selection search fluid name="account_id" value={account_id} options={this.props.zone_accounts}  onChange={this.handleSelect} error={account_idError} /></div>}
                <hr/>
                  <Input label="Advertiser Name"  floatingLabel={true} value={name} name="name" onChange={this.handleChange} className={classNames({ 'floatinginp': name }, { 'errorinp': errorName })} />
                  <Textarea label="Notes" floatingLabel={true} name="notes" value={notes} onChange={this.handleChange} className={classNames({ 'floatinginp': notes }, { 'errorinp': errorNotes })} />
              </Form>
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
    );
  }
}


const mapStateToProps = state => {
  const { id, name, account_id, account_idError, errorName, notes, errorNotes, errorList, errorMessage, error, success, successMessage, modalStatus, showAdvertiser } = state.modal;
  const { activeUser } = state.shared;
  const { accounts, zone_accounts } = state.accounts;
  return { zone_accounts, activeUser, id, account_id, account_idError, name, errorName, notes, errorNotes, errorList, errorMessage, error, success, successMessage, modalStatus, showAdvertiser, accounts };
};

export default connect(mapStateToProps, { masterListAccounts, createAdvertiser, updateAdvertiser, modalStateChange, resetModalReducer, resetAdvertiserErrors })(Advertiser);
