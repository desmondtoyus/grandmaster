import React, {PureComponent} from 'react';
// import TopbarNavExchange from './TopbarNavExchange';
// import TopbarNavSettings from './TopbarNavSettings';
import TopbarNavDemand from './TopbarNavDemand';
import TopbarNavReports from './TopbarNavReports';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { setUserTimezone } from '../../../../redux/actions/user.actions';
import TopbarNavSupply from './TopbarNavSupply';
import { changeMenuState, resetActive } from "../../../../redux/actions/menu.actions";
let timeInterval;



class TopbarNav extends PureComponent{
  state = {
    time: '',
    popoverOpen: false,
  };
  componentWillMount() {
    this.props.changeMenuState({ prop: 'fullMenu', value: !window.location.href.indexOf('/ui/selectaccount') > -1 });
    this.getTime();
    timeInterval = setInterval(() => {
      this.getTime();
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(timeInterval);
  }

  handleActive = (event) => {
    this.resetActive();
    switch (event.currentTarget.id) {
      case "home":
      case "analytics":
        this.props.changeMenuState({ prop: 'activeItem', value: event.currentTarget.id });
        break;
    }
  };
  resetActive = () => {
    this.props.resetActive();
    this.props.changeMenuState({ prop: 'activeItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubSubItem', value: '' });

  };

  getTime = () => {
    switch (this.props.activeUser.user.timezone) {
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
    this.props.setUserTimezone(data.value);
  };

  logout = () => {
    this.props.callback('/');
    localStorage.removeItem('token');
  };

  switchAccount = () => {
    this.props.callback(`/ui/selectaccount`);
  };
  toggle =() => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }



  render() {
    const { user, title } = this.props;
    return(
      <nav className='topbar__nav'>
        {!(this.props.activeUser.user.role == '1024' || this.props.activeUser.user.role == '512') && this.props.fullMenu ? <TopbarNavReports history={this.props.history} /> : null}
        {!(this.props.activeUser.user.role == '1024' || this.props.activeUser.user.role == '512')  && this.props.fullMenu ?     <TopbarNavDemand history={this.props.history}/> :null}
        {!(this.props.activeUser.user.role == '1024' || this.props.activeUser.user.role == '512')  && this.props.fullMenu ?  <TopbarNavSupply history={this.props.history}/> :null}
      </nav>
    )
  }
}


const mapStateToProps = state => {
  const { activeUser } = state.shared;
  const { activeItem, fullMenu} = state.menu;
  return { activeUser, activeItem, fullMenu }
};


export default connect(mapStateToProps, { setUserTimezone, changeMenuState, resetActive})(TopbarNav);
