import React, {PureComponent} from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import {DropdownItem, DropdownToggle, DropdownMenu, UncontrolledDropdown} from 'reactstrap';
import { connect } from 'react-redux';
import { Dropdown } from "semantic-ui-react";
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import classnames from 'classnames';
import {Icon} from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { changeMenuState, resetActive } from "../../../redux/actions/menu.actions";
import { setUserTimezone } from '../../../redux/actions/user.actions';

// const Ava = '/images/ava.png';

 class TopbarProfile extends PureComponent {

  handleActive = (event) => {
        this.props.changeMenuState({ prop: 'activeItem', value: event.currentTarget.id });
  };

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

  resetActive = () => {
    this.props.resetActive();
    this.props.changeMenuState({ prop: 'activeItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubSubItem', value: '' });

  };

  handleSelect = (event, data) => {
    this.props.setUserTimezone(data.value);
  };
  switchAccount = (e) => {
    e.preventDefault();
    this.props.callback(`/ui/selectaccount`);
  };

  logout = (e) => {
    console.log('GOT TO THIS PLACE');
    e.preventDefault();
    this.props.callback('/');
    localStorage.removeItem('token');
  };

  render() {

    const {user,  activeUser, activeItem, activeSubItem, activeSubSubItem } =this.props;
    const { iconStyle} = styles;
    return (
      <UncontrolledDropdown className='topbar__profile' >
        <DropdownToggle className='topbar__avatar'>
          <p className='topbar__avatar-name'>{<Icon size="large" name="user" style={iconStyle} />}</p>
          <DownIcon className='topbar__avatar-icon'/>
        </DropdownToggle>
        <DropdownMenu className='topbar__menu dropdown__menu'>
          <DropdownItem>
            {/* <TopbarMenuLink title={`${user.first_name} ${user.last_name}`} icon='user' path='/account/profile' action='profile'/> */}
            <div className='topbar__link'>
          <span className={`topbar__link-icon lnr`} />
              <p className='topbar__link-title'>{user.first_name} {user.last_name}</p>
          </div>
          </DropdownItem>
          {!(this.props.user.role == '1024' || this.props.user.role == '512') ?    <DropdownItem onClick={this.switchAccount} >
          <div className='topbar__link'>
          <span className={`topbar__link-icon lnr`} />
              <p className='topbar__link-title'>Switch Account</p>
          </div>
           </DropdownItem>:null}
           {!(this.props.user.role == '1024' || this.props.user.role == '512') ?  <Dropdown text='  Exchange' pointing='right' style={{paddingLeft:'10px'}} className={classnames('topbar__link', { activeList: activeItem == 'exchange' })} onClick={this.handleActive} id='exchange'>
      <Dropdown.Menu>
      <Dropdown.Item ><Link to='/ui/integrations'> Integrations</Link></Dropdown.Item>
        <Dropdown.Item>MarketPlaces</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>:null}

            {!(this.props.user.role == '1024' || this.props.user.role == '512') ?   <Dropdown text='  Settings' pointing='right' style={{paddingLeft:'10px'}} className='topbar__link' className={classnames('topbar__link', { activeList: activeItem == 'settings' })} onClick={this.handleActive} id='settings'>
      <Dropdown.Menu>
        <Dropdown.Item><Link to='/ui/accounts' >Accounts</Link></Dropdown.Item>
        <Dropdown.Item><Link to='/ui/users'>Users</Link></Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item><Link to='/ui/lists'>Domain Lists</Link></Dropdown.Item>
        <Dropdown.Item><Link to='/ui/bundles'>Bundle Lists</Link></Dropdown.Item>
        <Dropdown.Item><Link to='/ui/apps'>App Lists</Link></Dropdown.Item>
        <Dropdown.Item> <Link to='/ui/ips'>IP Lists</Link></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>:null}

          <DropdownItem onClick={this.logout}>
          <div className='topbar__link'>
          <span className={`topbar__link-icon lnr`} />
              <p className='topbar__link-title'>Log Out</p>
          </div>
           </DropdownItem>

              <Dropdown text={this.getTimeZone(this.props.user.timezone)} pointing='right' style={{paddingLeft:'10px'}} className='topbar__link' onClick={this.handleActive} id='timezones'>
              <Dropdown.Menu>
                <Dropdown.Item value='US/Pacific' onClick={this.handleSelect} >PST</Dropdown.Item>
                <Dropdown.Item value="US/Eastern" onClick={this.handleSelect} >EST</Dropdown.Item>
                <Dropdown.Item value="UTC" onClick={this.handleSelect} >UTC</Dropdown.Item>
              </Dropdown.Menu>
              </Dropdown>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }
}

const styles = {
  iconStyle: {
    backgroundColor: "#597C94",
    margin: 0,
    height: "20px",
    width: "20px",
    lineHeight: "20px",
    padding: "5px",
    borderRadius: "100%",
    boxSizing: "content-box"
  }
};


const mapStateToProps = state => {
  const {  activeItem, activeSubItem, activeSubSubItem } = state.menu;
  const { activeUser } = state.shared;
  return { activeUser, activeItem, activeSubItem, activeSubSubItem };
};
export default connect(mapStateToProps, {setUserTimezone, changeMenuState, resetActive})(TopbarProfile);
