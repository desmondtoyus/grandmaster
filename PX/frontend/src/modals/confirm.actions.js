import React, { Component } from 'react';
import Alert from '../components/Alert'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonToolbar} from 'reactstrap';
import { connect } from 'react-redux';
import { modalStateChange, clearModalErrors } from '../redux/actions/modals.actions';

class ConfirmActions extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      setTimeout(() => {
        this.close();
      }, 3000);
    }
  }

  close = () => {
    this.props.update();
    this.props.modalStateChange({ prop: 'showConfirmAction', value: false });
    this.props.clearModalErrors();
  };

  render() {
    const { showConfirmAction, error, errorMessage, success, successMessage, header, message, id } = this.props;

    if (error) {
      return (
        <Modal isOpen={showConfirmAction} toggle={this.toggle} >
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
        <Modal isOpen={showConfirmAction} toggle={this.toggle} >
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
      <Modal isOpen={showConfirmAction} toggle={this.toggle} >
        <ModalHeader>Success</ModalHeader>
        <ModalBody>
          <Alert color='info' className='alert--neutral' icon>
            {message}
          </Alert>
        </ModalBody>
        <ModalFooter>
          <ButtonToolbar className='form__button-toolbar'>
            <Button color='primary' onClick={this.close}  >No</Button>
            <Button type='button' onClick={this.props.callback.bind(null, id)}> Yes </Button>
          </ButtonToolbar>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  const { showConfirmAction, error, errorMessage, success, successMessage, id, header, message, callback } = state.modal;

  return { showConfirmAction, error, errorMessage, success, successMessage, id, header, message, callback };
};

export default connect(mapStateToProps, { modalStateChange, clearModalErrors })(ConfirmActions);
