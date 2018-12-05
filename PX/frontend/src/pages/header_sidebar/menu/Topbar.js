import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';
import { DropdownItem, DropdownToggle, DropdownMenu, UncontrolledDropdown, Container, Row, Col } from 'reactstrap';
import TopbarNav from './tobar_nav/TopbarNav';
import DownIcon from 'mdi-react/ChevronDownIcon';
import moment from 'moment-timezone';
import { setUserTimezone } from '../../../redux/actions/user.actions';
import { Icon, Popup } from 'semantic-ui-react';
let esc;


let timeInterval;
const timezones = [
  { text: "PST", value: "US/Pacific" },
  { text: 'EST', value: "US/Eastern" },
  { text: 'UTC', value: 'UTC' }
];

class Topbar extends PureComponent {
  state = {
    time: '',
    fullscreen: false
  };

  componentDidMount() {
    window.addEventListener('onkeydown', this.handleResize)
  }

  componentWillMount() {
    window.removeEventListener('onkeydown', this.handleResize)
    this.getTime();
    timeInterval = setInterval(() => {
      this.getTime();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(timeInterval);
  }
  getTimeZone = (time) => {
    switch (time) {
      case "US/Pacific":
        return "PST"
        break;
      case "US/Eastern":
        return "EST"
        break;
      case "UTC":
        return "UTC"
        break;
      default:
        break;
    }
  }

  toggleFullScreen = () => {
    this.setState({ fullscreen: true })
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      this.setState({ fullscreen: false })
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
     
    }
  }

  getTime = () => {
    switch (this.props.user.timezone) {
      case "US/Pacific":
        this.setState({ time: moment().tz('America/Los_Angeles').format('MMMM D, YYYY / h:mma') });
        break;
      case "US/Eastern":
        this.setState({ time: moment().tz('America/New_York').format('MMMM D, YYYY / h:mma') });
        break;
      case "UTC":
        this.setState({ time: moment().tz('UTC').format('MMMM D, YYYY / h:mma') });
        break;
    }
  };

  handleSelect = (event, data) => {
    this.props.setUserTimezone(event.target.value);
  };

  render() {
    const { cursorStyle } = styles;
    return (

      <div className='topbar topbar--navigation'>
        <div className='topbar__wrapper'>
          <div className='topbar__left'>
            {!(this.props.activeUser.user.role == '1024' || this.props.activeUser.user.role == '512') ? <TopbarSidebarButton /> : null}
            <Link className='topbar__logo' to={this.props.activeUser.user.role == '1024' ? '/ui/advertiserpage': this.props.activeUser.user.role == '512'? '/ui/reporting' :'/ui/home'} />
          </div>
          <TopbarNav query={this.props.query} history={this.props.history} title={this.props.title} user={this.props.user} callback={this.props.callback} />
          <div className='topbar__right'>
            <TopbarProfile query={this.props.query} history={this.props.history} title={this.props.title} user={this.props.user} callback={this.props.callback} />
          </div>
        </div>
      </div>
    )
  }
}

const styles = {

  cursorStyle: {
    cursor: "pointer",
    marginTop: '20px',
    marginBottom: 'auto'
  }
};

const mapStateToProps = state => {
  const { activeUser } = state.shared;
  return { activeUser }
};


export default connect(mapStateToProps, { setUserTimezone })(Topbar);