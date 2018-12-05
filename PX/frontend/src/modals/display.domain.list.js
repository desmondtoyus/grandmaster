import React, { Component } from 'react';
import Alert from '../components/Alert'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { connect } from 'react-redux';
import { modalStateChange, clearModalErrors } from '../redux/actions/modals.actions';

class DisplayDomainList extends Component {
  close = () => {
    this.props.modalStateChange({ prop: 'showDisplayDomainList', value: false });
    this.props.clearModalErrors();
  };

  render() {
    const { showDisplayDomainList, displayDomainList, errorMessage, error } = this.props;

    if (!displayDomainList) {
      return (
        <Modal open={showDisplayDomainList} size={'small'}>

        </Modal>
      )
    }

    if (error) {
      return (
        <Modal isOpen={showDisplayDomainList} toggle={this.toggle} >
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

    return (
      <Modal isOpen={showDisplayDomainList} toggle={this.toggle} >
        <ModalHeader toggle={this.toggle}>{displayDomainList.name}</ModalHeader>
        <ModalBody>
          <h5>Domains:  </h5>
          <h7 style={{
            display: "inline-block",
            fontSize: "0.9em"
          }}>{displayDomainList.value.join(', ')} </h7>
        </ModalBody>
        <ModalFooter>
          <Button color="info" onClick={this.close}>Close</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  const { showDisplayDomainList, displayDomainList, error, errorMessage } = state.modal;

  return { showDisplayDomainList, displayDomainList, error, errorMessage };
};

export default connect(mapStateToProps, { modalStateChange, clearModalErrors })(DisplayDomainList);