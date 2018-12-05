import React, { Component } from 'react';
import Alert from '../components/Alert'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { connect } from 'react-redux';
import { modalStateChange, clearModalErrors } from "../redux/actions/modals.actions";

class Alerts extends Component {
  componentDidMount() {
    if (this.props.success) {
      setTimeout(() => {
        this.close();
      }, 3000);
    }
  }

  close = () => {
    this.props.update();
    this.props.modalStateChange({ prop: 'showAlert', value: false });
    this.props.clearModalErrors();
  };

  render() {
    const { showAlert, error, errorMessage, success, successMessage } = this.props;

    if (error) {
      return (
        <Modal isOpen={showAlert} toggle={this.toggle} >
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
        <Modal isOpen={showAlert} toggle={this.toggle} >
          <ModalHeader>Success</ModalHeader>
          <ModalBody>
            <Alert color='success' className='alert--neutral' icon>
              {successMessage}
            </Alert>
          </ModalBody>
          <ModalFooter>
          <Button onClick={this.close}>Close</Button>
          </ModalFooter>
        </Modal>
      )
    }

    return (
      <Modal isOpen={showAlert} toggle={this.toggle} >
 <ModalHeader>Server Error</ModalHeader>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  const { showAlert, error, errorMessage, success, successMessage } = state.modal;

  return { showAlert, error, errorMessage, successMessage, success };
};

export default connect(mapStateToProps, { modalStateChange, clearModalErrors })(Alerts);
