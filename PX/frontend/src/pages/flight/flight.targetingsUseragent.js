import React, { Component } from 'react';
import { Grid, Icon, Segment, Checkbox} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { changeFlight } from "../../redux/actions/flight.actions";


class FlightUserAgent extends Component {
  state={
    showDesktop:false,
    showMobile:false
  }

  handleShow=(event, data)=>{
    let id = data.id;
    if (id =='desktop') {
      this.setState({
        showDesktop:!this.state.showDesktop
      })
    } else {
      this.setState({
        showMobile:!this.state.showMobile
      })
    }

  }

  handleSelect = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: data.value });
  };

  handleShowMore =(event)=>{
    event.preventDefault();
    this.setState({showMore: !this.state.showMore})
  }
  handleCheckbox = (type, event, data) => {
    let arr = [...this.props[type]];
    const index = arr.indexOf(data.name);
    if (index === -1) {
      arr.push(data.name);
    }
    else {
      arr.splice(index, 1);
    }
    this.props.changeFlight({ prop: type, value: arr });
  };

  

  render() {
    const { renderCheckboxStyle } = styles;
    const { channel, userAgent, browser,} = this.props;

    return (
      <div>
        { channel === "mobile_web" || channel === "mobile_app" ? <Checkbox style={renderCheckboxStyle} onClick={this.handleShow} label="User Agent" id='mobile' /> : null }
      {this.state.showMobile? <div>
        { channel === "mobile_web" || channel === "mobile_app" ? <div>
          <Checkbox style={renderCheckboxStyle} label="" checked={userAgent.includes('ios')} onClick={this.handleCheckbox.bind(null, 'userAgent')} name="ios" />
          <Icon name="apple" size="large" />
          <Checkbox style={renderCheckboxStyle} label="" checked={userAgent.includes('android')} onClick={this.handleCheckbox.bind(null, 'userAgent')} name="android" />
          <Icon name="android" size='large' />
          <Checkbox style={renderCheckboxStyle} label="" checked={userAgent.includes('windows_mobile')} onClick={this.handleCheckbox.bind(null, 'userAgent')} name="windows_mobile" />
          <Icon name="windows" size="large" />
          <Checkbox style={renderCheckboxStyle} label="" checked={userAgent.includes('mobile_other')} onClick={this.handleCheckbox.bind(null, 'userAgent')} name="mobile_other" />
          <Icon name="mobile" size='large' />
        </div> : null }
        </div> :null}
        <div>
        { channel === "desktop" ? <Checkbox style={renderCheckboxStyle} onClick={this.handleShow} label="Browser Targeting" id= 'desktop'/> : null }
        { channel === "desktop" && this.state.showDesktop ? <div>
          <Checkbox style={renderCheckboxStyle} label="" checked={browser.includes('ie/edge')} onClick={this.handleCheckbox.bind(null, 'browser')} name="ie/edge" />
          <Icon name="internet explorer" size="large" />
          <Checkbox style={renderCheckboxStyle} label="" checked={browser.includes('chrome')} onClick={this.handleCheckbox.bind(null, 'browser')} name="chrome" />
          <Icon name="chrome" size="large" />
          <Checkbox style={renderCheckboxStyle} label="" checked={browser.includes('firefox')} onClick={this.handleCheckbox.bind(null, 'browser')} name="firefox" />
          <Icon name="firefox" size="large" />
          <Checkbox style={renderCheckboxStyle} label="" checked={browser.includes('safari')} onClick={this.handleCheckbox.bind(null, 'browser')} name="safari" />
          <Icon name="safari" size="large" />
          <Checkbox style={renderCheckboxStyle} label="" checked={browser.includes('other')} onClick={this.handleCheckbox.bind(null, 'browser')} name="other" />
          <Icon name="browser" size="large" />
        </div> : null }
      </div>
      </div>
    )
  }
}

const styles = {
  checkStyle: {
    paddingTop: "2px"
  },
  accStyle: {
    marginTop: "1px"
  },
  contentStyle: {
    paddingBottom: "10px",
    paddingLeft: "20px"
  },
  listStyle: {
    display: "block",
    marginLeft: "7px",
    marginBottom: "3px"
  },
  checkboxStyle: {
    paddingTop: "7px"
  },
  rightStyle: {
    paddingRight: "0"
  },
  segmentStyle: {
    overflowY: "scroll",
    height: "300px"
  },
  padStyle: {
    paddingBottom: "0"
  },
  renderCheckboxStyle: {
    paddingTop: "7px",
    marginRight: "6px",
    marginLeft: "3px"
  }
};

const mapStateToProps = state => {
  const {  selectedIAB, channel, userAgent, browser, searchIAB, iabCategories, isRetargeted} = state.flight;

  return {selectedIAB, channel, userAgent, browser, searchIAB, iabCategories, isRetargeted};
};

export default connect(mapStateToProps, { changeFlight })(FlightUserAgent);
