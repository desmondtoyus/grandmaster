import React, { Component } from 'react';
import { Grid, Icon, Button, Form } from 'semantic-ui-react';
import classNames from 'classnames';

const events = [
  { text: "Click", value: "click" },
  { text: "Impression", value: "impression" },
  { text: "VAST Event", value: "event" }
];

const vast = [
  { text: "creativeView", value: "creativeView" },
  { text: "start", value: "start" },
  { text: "midpoint", value: "midpoint" },
  { text: "firstQuartile", value: "firstQuartile" },
  { text: "thirdQuartile", value: "thirdQuartile" },
  { text: "complete", value: "complete" },
  { text: "mute", value: "mute" },
  { text: "unmute", value: "unmute" },
  { text: "pause", value: "pause" },
  { text: "rewind", value: "rewind" },
  { text: "resume", value: "resume" },
  { text: "fullscreen", value: "fullscreen" },
  { text: "expand", value: "expand" },
  { text: "collapse", value: "collapse" },
  { text: "acceptInvitation", value: "acceptInvitation" },
  { text: "close", value: "close" }
];

class FlightEventTracking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flight: "",
      beacons: []
    };
  };

  componentWillMount() {
    this.setState({ flight: this.props.flight, beacons: this.props.beacons });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ flight: nextProps.flight, beacons: nextProps.beacons });
  }

  renderTrackers = () => {
    return this.state.flight.event_tracking.map((item) => {
      return (
        <Form size='tiny' key={item.key}>
          <Form.Group inline>
            <Form.Select className={classNames("bwa-select-label", {'bwa-floated': item.url})} label="Beacon" options={this.state.beacons} name={item.key + " url"} value={item.url} onChange={this.handleTrackerSelect} />
            <Form.Select className={classNames("bwa-select-label", {'bwa-floated': item.eventtype})} label="Event Type" options={events} name={item.key + " eventtype"} value={item.eventtype} onChange={this.handleTrackerSelect} />
            { item.eventtype === "event" ?
              <Form.Select className={classNames("bwa-select-label", {'bwa-floated': item.value})} label="VAST Event" options={vast} name={item.key + " value"} value={item.value} onChange={this.handleTrackerSelect} /> : null }
            <Button basic icon="minus" size="mini" onClick={this.removeTrackerRow} name={item.key} />
          </Form.Group>
        </Form>
      )
    })
  };

  handleTrackerSelect = (event, data) => {
    let name = data.name.split(" ");
    let flight = this.state.flight;
    for (let i = 0; i < flight.event_tracking.length; i++) {
      if (flight.event_tracking[i].key === Number(name[0])) {
        flight.event_tracking[i][name[1]] = data.value;
        this.props.callback('event_tracking', flight.event_tracking);
        this.setState({ flight });
        return;
      }
    }
  };

  removeTrackerRow = (event) => {
    event.preventDefault();
    let flight = this.state.flight;
    if (flight.event_tracking.length === 1) {
      flight.event_tracking = [{
        key: 0,
        id: "",
        eventtype: "",
        url: "",
        value: ""
      }];
      this.props.callback('event_tracking', flight.event_tracking);
      this.setState({ flight });
      return;
    }
    let key = Number(event.currentTarget.getAttribute('name'));
    for (let i = flight.event_tracking.length - 1; i >= 0; i--) {
      if (flight.event_tracking[i].key === key) {
        flight.event_tracking.splice(i, 1);
        break;
      }
    }
    this.props.callback('event_tracking', flight.event_tracking);
    this.setState({ flight });
  };

  addTrackerRow = () => {
    let flight = this.state.flight;
    let obj = {
      key: flight.event_tracking[flight.event_tracking.length - 1].key + 1,
      id: "",
      eventtype: "",
      url: "",
      value: ""
    };
    flight.event_tracking.push(obj);
    this.props.callback('event_tracking', flight.event_tracking);
    this.setState({ flight });
  };

  render() {
    return (
      <div>
        <h4>Flight Trackers <Icon name='plus square outline' size='large' onClick={this.addTrackerRow} /></h4>
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              {this.renderTrackers()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default FlightEventTracking;
