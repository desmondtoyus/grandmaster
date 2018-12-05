import React, { Component } from 'react';
import { Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonToolbar, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { createIntegration, updateIntegration } from '../redux/actions/integration.actions';
import { modalStateChange, resetModalReducer, resetIntegrationErrors } from "../redux/actions/modals.actions";
import { masterListAccounts } from '../redux/actions/account.actions';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';
import Alert from '../components/Alert';

import classNames from 'classnames';

class Integration extends Component {

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
            // window.location.href='/ui/Integrations';
        }

    }


    close = () => {
        this.props.update();
        this.props.modalStateChange({ prop: 'showIntegration', value: false });
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

        const { id, account_id, name, notes, modalStatus } = this.props;

        if (modalStatus === "create") {
            this.props.createIntegration({ account_id, name, notes });
        }
        else if (modalStatus === 'edit') {
            this.props.updateIntegration({ id, account_id, name, notes });
        }
    };

    isInputValid = () => {
        this.props.resetIntegrationErrors();
        const { name, notes, account_id } = this.props;

        let arr = [];
        if (name.length < 2) {
            arr.push('Integrations Name shall contain at least 2 characters.');
            this.props.modalStateChange({ prop: 'errorName', value: true });
        }
        if (name.length > 100) {
            arr.push('Integrations Name shall contain at most 100 characters.');
            this.props.modalStateChange({ prop: 'errorName', value: true });
        }
        if (!(name.length > 100) && !(name.length < 2) && !isNaN(name)) {
            arr.push('Integrations name cannot all be numbers');
            this.props.modalStateChange({ prop: 'errorName', value: true });
        }

        if (notes.length > 500) {
            arr.push('Notes shall contain at most 500 characters.');
            this.props.modalStateChange({ prop: 'errorNotes', value: true });
        }
        // if (this.props.activeUser.scope_account.is_zone_master) {
        //     if (!account_id) {
        //         arr.push('Select an account');
        //         this.props.modalStateChange({ prop: 'account_idError', value: true });
        //     }
        // }
        if (arr.length > 0) {
            this.props.modalStateChange({ prop: 'errorList', value: arr });
            return false;
        }
        return true;
    };

    render() {
        const { activeUser, showIntegration, error, errorMessage, success, successMessage, name, notes, account_id, account_idError, errorName, errorNotes, modalStatus, errorList, accounts } = this.props;
        const { dropdownStyle } = styles;
        if (error) {
            return (
                <Modal isOpen={showIntegration} toggle={this.toggle} >
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
                <Modal isOpen={showIntegration} toggle={this.toggle} >
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
            <Modal isOpen={showIntegration} toggle={this.toggle} className="modal-lg">
                <ModalHeader>{modalStatus === 'edit' ? 'Edit Integrations' : 'Create Integrations'}</ModalHeader>
                <ModalBody>
                    <Col md={12} lg={12}>
                        <Card>
                            <CardBody>
                                <Form>
                                    <Input label="Integration Name" floatingLabel={true} value={name} name="name" onChange={this.handleChange} className={classNames({ 'floatinginp': name }, { 'errorinp': errorName })} />
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
    const { id, name, errorName, notes, account_id, account_idError, errorNotes, errorList, errorMessage, error, success, successMessage, modalStatus, showIntegration, } = state.modal;
    const { accounts, zone_accounts } = state.accounts;
    const { activeUser } = state.shared;
    return { activeUser, zone_accounts, id, name, errorName, notes, account_id, account_idError, errorNotes, errorList, errorMessage, error, success, successMessage, modalStatus, showIntegration, accounts };
};

export default connect(mapStateToProps, { masterListAccounts, createIntegration, updateIntegration, modalStateChange, resetModalReducer, resetIntegrationErrors })(Integration);
