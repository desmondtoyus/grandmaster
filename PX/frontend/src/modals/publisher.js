import React, { Component } from 'react';
// import Select  from 'react-select';
import Alert from '../components/Alert'
import { Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonToolbar, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { createPublisher, updatePublisher } from '../redux/actions/publisher.actions';
import { modalStateChange, resetModalReducer, resetPublisherErrors } from "../redux/actions/modals.actions";
import { masterListAccounts } from '../redux/actions/account.actions';
import classNames from 'classnames';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';
// import Select from 'muicss/lib/react/select';
import { Select } from "semantic-ui-react";
import {IABCategories} from "../vars";




class CreatePublisher extends Component {

  componentWillMount() {
    const { searchTerm, currentPage, sortBy, sortDirection, pageChunk, activeUser } = this.props;
    let master = activeUser.scope_account.is_zone_master;
    const payload = { master, searchTerm, currentPage, sortBy, sortDirection, pageChunk };
    this.props.masterListAccounts(payload);
  }
 
  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      setTimeout(() => {
        this.close();
      }, 2000);
    }
    
  }


  close = () => {
    this.props.update();
    this.props.modalStateChange({ prop: 'showPublisher', value: false });
    this.props.resetModalReducer();
  };


  handleChange = event => {
    // console.log(this.props.accounts);
    this.props.modalStateChange({ prop: event.target.name, value: event.target.value });
  };
  handleSelect = (event, data) => {
    this.props.modalStateChange({ prop: data.name, value: data.value });
    };

  handleSubmit = event => {
    event.preventDefault();

    if (!this.isInputValid()) {
      return;
    }

    const { id, account_id, name, notes, modalStatus, iabCategory, errorIabCategory } = this.props;

    if (modalStatus === "create") {
      this.props.createPublisher({ account_id, name, notes, iabCategory });
    }
    else if (modalStatus === 'edit') {
      this.props.updatePublisher({ id, account_id, name, notes, iabCategory });
    }
  };

  isInputValid = () => {
    this.props.resetPublisherErrors();
    const { name, notes, account_id, iabCategory, errorIabCategory } = this.props;

    let arr = [];
    if (name.length < 6) {
      arr.push('Publisher Name shall contain at least 6 characters.');
      this.props.modalStateChange({ prop: 'errorName', value: true });
    }
    if (name.length > 100) {
      arr.push('Publisher Name shall contain at most 100 characters.');
      this.props.modalStateChange({ prop: 'errorName', value: true });
    }
    if (!(name.length > 100) && !(name.length < 6) && !isNaN(name)) {
      arr.push('Publisher name cannot all be numbers');
      this.props.modalStateChange({ prop: 'errorName', value: true });
    }
 
    if (iabCategory.length < 1) {
      arr.push('Select atleast one AIB Category.');
      this.props.modalStateChange({ prop: 'errorIabCategory', value: true });
    }

    if (notes.length > 500) {
      arr.push('Notes shall contain at most 500 characters.');
      this.props.modalStateChange({ prop: 'errorNotes', value: true });
    }
    if (this.props.activeUser.scope_account.is_zone_master) {
      if (!account_id) {
        arr.push('Select an account');
        this.props.modalStateChange({ prop: 'account_idError', value: true });
      }
    }
    if (arr.length > 0) {
      this.props.modalStateChange({ prop: 'errorList', value: arr });
      return false;
    }
    return true;
  };

  render() {
    const { activeUser, showPublisher, error, errorMessage, success, successMessage, name, notes, account_id, account_idError, errorName, errorNotes, status, errorList, accounts, iabCategory, errorIabCategory } = this.props;
    const { dropdownStyle } = styles;
    if (error) {
      return (
        <Modal isOpen={showPublisher} toggle={this.toggle} >
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
        <Modal isOpen={showPublisher} toggle={this.toggle} >
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
      <Modal isOpen={showPublisher} toggle={this.toggle} className="modal-lg">
        <ModalHeader toggle={this.toggle}>{status === 'edit' ? 'Edit Publisher' : 'Create Publisher'}</ModalHeader>
        <ModalBody>
          <Col md={12} lg={12}>
            <Card>
              <CardBody>
                <Form>
                {activeUser.scope_account.is_zone_master && <div>{account_id? <label className={classNames('bwa-floating-label2', { 'bwa-floated': account_id })} >Account Name</label>:<label></label>} <Select style={{border:'none', margin:0, padding:0}} placeholder='Account Name'  selection search fluid name="account_id" value={account_id} options={this.props.zone_accounts}  onChange={this.handleSelect} error={account_idError} /></div>}
                <hr/>

                  <Input label="Publisher Name" floatingLabel={true} value={name} name="name"  onChange={this.handleChange} className={classNames({ 'floatinginp': name }, { 'errorinp': errorName })} />
                  {iabCategory.length ?<label className={classNames('bwa-floating-label2', { 'bwa-floated': iabCategory.length  })} >IAB Category</label>:<label></label>}
                <Select style={{border:'none', margin:0, padding:0}}  fluid multiple search placeholder="IAB Category" options={IABCategories} name="iabCategory" value={iabCategory} onChange={this.handleSelect} error={errorIabCategory}/>
                <hr/>

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
    )
  }
}
const styles = {
  dropdownStyle: {
    marginBottom: "10px"
  }
};

const mapStateToProps = state => {
  const { id, name, errorName, notes, account_id, account_idError, errorNotes, errorList, errorMessage, error, success, successMessage, modalStatus, showPublisher, iabCategory, errorIabCategory } = state.modal;
  const { accounts, zone_accounts} = state.accounts;
  const { activeUser } = state.shared;
  return { activeUser, zone_accounts, id, name, errorName, notes, account_id, account_idError, errorNotes, errorList, errorMessage, error, success, successMessage, modalStatus, showPublisher, accounts, iabCategory, errorIabCategory };
};

export default connect(mapStateToProps, {  masterListAccounts, createPublisher, updatePublisher, modalStateChange, resetModalReducer, resetPublisherErrors })(CreatePublisher);
