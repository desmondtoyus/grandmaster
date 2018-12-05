import React, { Component } from 'react';
import Alert from '../components/Alert'
import { Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Col } from 'reactstrap';
import { modalStateChange, resetModalReducer } from "../redux/actions/modals.actions";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {Popup, Input, TextArea, Button as Buttons } from 'semantic-ui-react';

class DisplayTag extends Component {

  close = () => {
    this.props.modalStateChange({ prop: 'showDisplayTag', value: false });
    this.props.resetModalReducer();
  };

  copyTag = (e) => {
    e.preventDefault();
    document.getElementById('tagClip').select();
    document.execCommand("Copy");
  };

  previewTag = () => {
    let tag = this.props.displayTag;
    let tagArr = tag.split('&');
    window.open(`/tagtester/?tag=${tagArr[0]}`, 'target_blank');
  };

  copyPlayerTag = () => {
    document.getElementById('playerTagClip').select();
    document.execCommand("Copy");
  };
   openPlayerTag = () => { 
      let tag = document.getElementById('playerTagClip').textContent;
     let playerTag = tag.split('<!-- VIDEO PLAYER -->');
     localStorage.pilotVideo = playerTag[1];
     this.props.modalStateChange({ prop: 'showDisplayTag', value: false });
     this.props.resetModalReducer();
    window.open('/playertest.html', 'target_blank');
    //  history.push('/ui/player')
    //  playerTab.focus();
    //  window.location.href ='/playertest.html';

    };

  render() {
    const { showDisplayTag, displayTag, errorMessage, error, playerDisplayTag } = this.props;

    if (!displayTag) {
      return (
        <Modal isOpen={showDisplayTag} toggle={this.toggle} >

        </Modal>
      )
    }

    if (error) {
      return (
        <Modal isOpen={showDisplayTag} toggle={this.toggle} >
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
      <Modal isOpen={showDisplayTag} toggle={this.toggle} className="modal-lg">
        <ModalHeader toggle={this.toggle}>Placement Tag</ModalHeader>
        <ModalBody>
          <Col md={12} lg={12}>
            <Card>
              <CardBody>
              
                    <Input action size={'large'} fluid value={displayTag} onChange={() => { }} >
                      <input id={'tagClip'} />
                  <Popup on={'click'} trigger={<Buttons basic icon={'tags'} onClick={this.copyTag} />} content={'Copied!'} size={'mini'} />
                      {!this.props.displayTag.includes('</script>') && <Popup trigger={<Buttons basic icon={'unhide'} onClick={this.previewTag} />} content={'Preview'} size={'mini'} />}
                    </Input>
       
              </CardBody>
            </Card>
          </Col>
        </ModalBody>
        <hr/>
        {playerDisplayTag &&<ModalHeader >Video Player Placement Tag</ModalHeader>}
        {playerDisplayTag && <ModalBody>
          <Col md={12} lg={12}>
            <Card>
              <CardBody>
                    <Input action size={'large'} fluid onChange={() => { }}>
                      <TextArea id={'playerTagClip'} value={playerDisplayTag} rows={6} style={{ width: '100%' }} />
                  <Popup on={'click'} trigger={<Buttons basic icon={'tags'} onClick={this.copyPlayerTag} />} content={'Copied!'} size={'mini'} />
                      <Buttons basic icon={'window maximize'} content={'Preview'} onClick={this.openPlayerTag} size={'mini'} />
                    </Input>
              </CardBody>
            </Card>
          </Col>
        </ModalBody>}
        <ModalFooter>
          <Button color="info" onClick={this.close}>Close</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  const { showDisplayTag, displayTag, error, errorMessage, playerDisplayTag } = state.modal;

  return { showDisplayTag, displayTag, error, errorMessage, playerDisplayTag };
};

export default withRouter (connect(mapStateToProps, { modalStateChange, resetModalReducer })(DisplayTag));

