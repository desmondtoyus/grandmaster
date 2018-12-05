import React, { Component } from 'react';
import { Modal, Button, Icon, Form, Card, Message, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createBeacon, resetBeaconReducer } from '../redux/actions/beacon';
import { submitTicket } from '../redux/actions/user';
import classNames from 'classnames';

class CreateBeacon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      title: "",
      url: "",
      titleError: false,
      urlError: false,
      errorList: [],
      error: false,
      success: false,
      errorMessage: "",
      ticket: "",
      showTicket: false,
      ticketSubmitted: false,
      errors: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({ error: true });
    }
    if (nextProps.errorMessage.length) {
      this.setState({ errorMessage: nextProps.errorMessage });
    }
    if (nextProps.success) {
      this.setState({ success: true });

      setTimeout(() => {
        this.close();
      }, 3000);
    }
  }

  show = () => {
    this.setState({
      open: true,
      title: "",
      url: "",
      titleError: false,
      urlError: false,
      errorList: [],
      error: false,
      success: false,
      errorMessage: "",
      ticket: "",
      showTicket: false,
      ticketSubmitted: false,
      errors: false
    });
  };

  close = () => {
    this.props.resetBeaconReducer();
    this.setState({
      open: false,
      title: "",
      url: "",
      errorTitle: false,
      errorURL: false,
      errorList: [],
      error: false,
      success: false,
      errorMessage: "",
      ticket: "",
      showTicket: false,
      ticketSubmitted: false,
      errors: false
    });
  };

  isInputValid = () => {
    this.setState({ errors: false, errorTitle: false, errorMessage: "", errorURL: false });

    let arr = [];
    if (this.state.title.length < 6) {
      arr.push('Beacon Name shall contain at least 6 characters.');
      this.setState({ errorTitle: true });
    }
    if (this.state.title.length > 100) {
      arr.push('Beacon Name shall contain at most 100 characters.');
      this.setState({ errorTitle: true });
    }
    if (!this.isValidURL(this.state.url)) {
      arr.push('Please enter a full valid URL');
      this.setState({ errorURL: true });
    }

    if (arr.length > 0) {
      this.setState({ errors: true, errorList: arr });
      return false;
    }
    return true;
  };

  isValidURL = (url) => {
    const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return re.test(url.toLowerCase()) && url.toLowerCase().includes('http');
  };

  handleChange = (event) => {
    let update = {};
    update[event.target.name] = event.target.value;
    this.setState(update);
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.isInputValid()) {
      return;
    }

    const payload = JSON.stringify({
      title: this.state.title,
      url: this.state.url
    });
    this.props.createBeacon(payload);
  };

  openTicket = () => {
    this.setState({ showTicket: true });
  };

  closeTicket = () => {
    this.setState({ showTicket: false, ticket: "", ticketSubmitted: false });
  };

  submitTicket = () => {
    this.props.submitTicket(this.state.ticket);
    this.setState({ ticket: "", ticketSubmitted: true });
  };

  render() {
    return (
      <Modal open={this.state.open} size='small' trigger={this.props.source === 'list' ? <Menu.Item onClick={this.show}><span className="new-add-class">NEW BEACON</span></Menu.Item> : <Icon name="add" size="small" onClick={this.show} /> }>
        <Modal.Header>Create Beacon <Button floated="right" size="mini" compact color="blue" onClick={this.openTicket.bind(this)}>Need help? Click</Button></Modal.Header>
        <Modal.Content>
          { this.state.showTicket ? <Card raised fluid>
            <Card.Content>
              { !this.state.ticketSubmitted ? <Form size="tiny">
                <Form.TextArea type="textarea" placeholder="How can we help you?" name="ticket" value={this.state.ticket} onChange={this.handleChange} />
              </Form> : <Message info>Thank you for your feedback. We will address it shortly.</Message> }
            </Card.Content>
            <Card.Content>
              { !this.state.ticketSubmitted ? <Button floated="right" size="mini" color="blue" onClick={this.submitTicket.bind(this)}>Submit</Button> : null }
              <Button floated="right" size="mini" color="blue" onClick={this.closeTicket.bind(this)}>{ !this.state.ticketSubmitted ? "Cancel" : "Close"}</Button>
            </Card.Content>
          </Card> : null }
          { !this.state.error && !this.state.success ? <Form size="tiny">
            <Form.Input type="text" name="title" value={this.state.title} onChange={this.handleChange} error={this.state.errorTitle}>
              <label className={classNames("bwa-floating-label", {'bwa-floated': this.state.title})}>Beacon Name</label>
              <input />
            </Form.Input>
            <Form.Input type="text" name="url" value={this.state.url} onChange={this.handleChange} error={this.state.errorURL}>
              <label className={classNames("bwa-floating-label", {'bwa-floated': this.state.url})}>URL</label>
              <input />
            </Form.Input>
          </Form> : null }
          { this.state.error ? <Message negative>Cannot create a beacon at this time. Please try again later</Message> : null }
          { this.state.success ? <Message info>Beacon was created successfully</Message> : null }
          { this.state.errorMessage.length ? <Message negative>{this.state.errorMessage}</Message> : null }
          { this.state.errors ? <Message error header='There are some errors with your submission' list={this.state.errorList} /> : null }
        </Modal.Content>
        { !this.state.error && !this.state.success ? <Modal.Actions>
          <Button color='blue' onClick={this.close}>Cancel</Button>
          <Button color='blue' onClick={this.handleSubmit}>Submit</Button>
        </Modal.Actions> : null }
        { this.state.error ? <Modal.Actions>
          <Button color="red" onClick={this.close}>Close</Button>
        </Modal.Actions> : null }
        { this.state.success ? <Modal.Actions>{' '}</Modal.Actions> : null }
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return { error: state.beacon.error, success: state.beacon.success, errorMessage: state.beacon.errorMessage };
}

export default connect(mapStateToProps, { createBeacon, resetBeaconReducer, submitTicket })(CreateBeacon);
