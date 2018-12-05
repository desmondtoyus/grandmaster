import React, { Component } from 'react';
import Alert from '../components/Alert'
import { Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonToolbar, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { createAccount, updateAccount } from '../redux/actions/account.actions';
import { modalStateChange, resetModalReducer, resetAccountErrors } from "../redux/actions/modals.actions";
import classNames from 'classnames';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';

class Account extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      setTimeout(() => {
        this.close();
      }, 3000);
    }
  }

  close = () => {
    this.props.update();
    this.props.modalStateChange({ prop: 'showAccount', value: false });
    this.props.resetModalReducer();
  };

  handleChange = (event) => {
    this.props.modalStateChange({ prop: event.target.name, value: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.isInputValid()) {
      return;
    }

    const { id, name, notes, modalStatus } = this.props;

    if (modalStatus === "create") {
      this.props.createAccount({ name, notes });
    }
    else if (modalStatus === "edit") {
      this.props.updateAccount({ id, name, notes });
    }

  };

  isInputValid = () => {
    this.props.resetAccountErrors();
    const { name, notes } = this.props;

    let arr = [];
    if (name.length < 6) {
      arr.push('Account Name shall contain at least 6 characters.');
      this.props.modalStateChange({ prop: 'errorName', value: true });
    }
    if (name.length > 200) {
      arr.push('Account Name shall contain at most 200 characters.');
      this.props.modalStateChange({ prop: 'errorName', value: true });
    }
    if (!(name.length > 100) && !(name.length < 6) && !isNaN(name)) {
      arr.push('Account name cannot all be numbers');
      this.props.modalStateChange({ prop: 'errorName', value: true });
    }
    if (notes.length > 500) {
      arr.push('Account Notes shall contain at most 500 characters.');
      this.props.modalStateChange({ prop: 'errorNotes', value: true });
    }

    if (arr.length > 0) {
      this.props.modalStateChange({ prop: 'errorList', value: arr });
      return false;
    }
    return true;
  };

  render() {
    const { showAccount, error, errorMessage, success, successMessage, name, notes, errorName, errorNotes, modalStatus, errorList } = this.props;

    if (error) {
      return (
      <Modal isOpen={showAccount}toggle={this.toggle} >
          <ModalHeader toggle={this.toggle}>Error!</ModalHeader>
          <ModalBody>
            <Alert color='success' className='alert--neutral' icon>
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
        <Modal isOpen={showAccount} toggle={this.toggle} >
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
      (!this.props.activeUser.scope_account.is_zone_master && this.props.modalStatus === "create") ? (null) : (<Modal isOpen={showAccount} toggle={this.toggle} className="modal-lg">
        <ModalHeader toggle={this.toggle}>{modalStatus === 'edit' ? 'Edit Account' : 'Create Account'}</ModalHeader>
        <ModalBody>
          <Col md={12} lg={12}>
            <Card>
              <CardBody>
                <Form>
                  <Input label="Account Name" floatingLabel={true} value={name} name="name" onChange={this.handleChange} className={classNames({ 'floatinginp': name }, { 'errorinp': errorName })} />                
                  <Textarea label="Notes" floatingLabel={true} name="notes" value={notes} onChange={this.handleChange} className={classNames({ 'floatinginp': notes })} className={classNames({ 'floatinginp': notes }, { 'errorinp': errorNotes })} />
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
      </Modal>)



    )
  }
}

const mapStateToProps = state => {
  const { id, name, errorName, notes, errorNotes, errorList, errorMessage, error, success, successMessage, modalStatus, showAccount } = state.modal;
  const { activeUser } = state.shared;
  return { activeUser, id, name, errorName, notes, errorNotes, errorList, errorMessage, error, success, successMessage, modalStatus, showAccount };
};

export default connect(mapStateToProps, { createAccount, resetModalReducer, modalStateChange, resetAccountErrors, updateAccount })(Account);
