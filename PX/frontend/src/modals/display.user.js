import React, { Component } from 'react';
import Alert from '../components/Alert'
import { Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonToolbar, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { modalStateChange, resetModalReducer } from "../redux/actions/modals.actions";
import { capitalize } from "../functions";
import {
  ROLE_ACCOUNTADMIN,
  ROLE_ACCOUNTMANAGED,
  ROLE_ACCOUNTOPS,
  ROLE_OPSADMIN,
  ROLE_OPSPOLICY,
  ROLE_SUPERADMIN,
  ROLE_ZONEADMIN,
  ROLE_ZONEOPS
} from "../roles";

class DisplayUser extends Component {
  close = () => {
    this.props.modalStateChange({ prop: 'showDisplayUser', value: false });
    this.props.resetModalReducer();
  };

  getRoles = () => {
    const { role } = this.props.displayUser;

    let arr = [];
    if (role & ROLE_SUPERADMIN) {
      arr.push('Super Admin');
    }
    if (role & ROLE_OPSADMIN) {
      arr.push('BWA Admin');
    }
    if (role & ROLE_OPSPOLICY) {
      arr.push('BWA Policy');
    }
    if (role & ROLE_ZONEADMIN) {
      arr.push('Zone Admin');
    }
    if (role & ROLE_ZONEOPS) {
      arr.push('Zone Operations');
    }
    if (role & ROLE_ACCOUNTADMIN) {
      arr.push('Account Admin');
    }
    if (role & ROLE_ACCOUNTOPS) {
      arr.push('Account Operations');
    }
    if (role & ROLE_ACCOUNTMANAGED) {
      arr.push('External Publisher');
    }

    return arr.join(', ');
  };

  render() {
    const { showDisplayUser, displayUser, errorMessage, error } = this.props;

    if (!displayUser) {
      return (
        <Modal open={showDisplayUser} size={'small'}>

        </Modal>
      )
    }

    if (error) {
      return (
        <Modal isOpen={showDisplayUser} toggle={this.toggle} >
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

    return (
      <Modal isOpen={showDisplayUser} toggle={this.toggle} >
        <ModalHeader toggle={this.toggle}>{`User / ID: ${displayUser.id} - Status: ${capitalize(displayUser.status)}`}</ModalHeader>
        <ModalBody>
          <Col md={12} lg={12}>
            <Card>
              <CardBody>
                <div ><span style={style}> Name: </span>{`${displayUser.first_name} ${displayUser.last_name}`}</div>
                <div><span style={style}> Email: </span>{displayUser.email}</div>
                <div><span style={style}> Phone: </span> {displayUser.phone_number !== "" ? this.props.displayUser.phone_number : "None"}</div>
                <div><span style={style}> Account: </span>{displayUser.account.name}</div>
                <div><span style={style}> Roles: </span>{this.getRoles()}</div>
              </CardBody>
            </Card>
          </Col>
        </ModalBody>
        <ModalFooter>
          <ButtonToolbar className='form__button-toolbar'>
            <Button color='primary' onClick={this.close}> Cancel </Button>
          </ButtonToolbar>
        </ModalFooter>
      </Modal >
    )
  }
}


const style = {
 fontWeight:'bolder',
 margin:'5px'
};

const mapStateToProps = state => {
  const { showDisplayUser, displayUser, error, errorMessage } = state.modal;

  return { showDisplayUser, displayUser, error, errorMessage };
};

export default connect(mapStateToProps, { modalStateChange, resetModalReducer })(DisplayUser);