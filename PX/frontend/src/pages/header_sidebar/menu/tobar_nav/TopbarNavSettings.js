import React, {PureComponent} from 'react';
import TopbarNavCategory from './TopbarNavCategory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import DownIcon from 'mdi-react/ChevronDownIcon';
import { DropdownItem, DropdownToggle, DropdownMenu, UncontrolledDropdown } from 'reactstrap';
import { Link } from 'react-router-dom';
import { checkIflight } from '../../../../redux/actions/flight.actions';
import { listCampaignAdvertisers } from '../../../../redux/actions/campaign.actions';
import { modalStateChange } from "../../../../redux/actions/modals.actions";
import { connect } from 'react-redux';
import { changeMenuState, resetActive } from "../../../../redux/actions/menu.actions";


class TopbarNavSettings extends PureComponent {

  resetActive = () => {
    this.props.resetActive();
    this.props.changeMenuState({ prop: 'activeItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubSubItem', value: '' });
    

  };

  createAccount = () => {
    const { history } = this.props;
    history.push(`/ui/accounts`);
    this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
    this.props.modalStateChange({ prop: 'showAccount', value: true });
  };

  createUser = () => {
    const { history } = this.props;
    history.push(`/ui/users`);
    this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
    this.props.modalStateChange({ prop: 'showUser', value: true });
  };

  handleActive = (event) => {
    this.props.checkIflight(false, [], '');
    const { activeItem} = this.props;
    switch (event.currentTarget.id) {
      case "accounts":
      case "users":
        this.props.changeMenuState({ prop: 'activeSubSubItem', value: ''});
        this.props.changeMenuState({ prop: 'activeSubItem', value: event.currentTarget.id });
        break;
      case "settings":
        if (activeItem !== 'settings') {
          this.resetActive();
        }
        this.props.changeMenuState({ prop: 'activeItem', value: event.currentTarget.id });
        break;
      case "domain_lists":
      case "bundle_lists":
      case "app_lists":
      case "ip_address":
        this.props.changeMenuState({ prop: 'activeSubSubItem', value: event.currentTarget.id });
        this.props.changeMenuState({ prop: 'activeSubItem', value: ''});
    }
  };



  render() {
    const { activeItem, activeSubItem, activeSubSubItem } = this.props;
    return (

      <UncontrolledDropdown className={classnames('topbar__nav-dropdown', { menuitem: activeItem == 'settings' })} >
        <DropdownToggle className='topbar__nav-dropdown-toggle ' onClick={this.handleActive} id='settings'>
          <span> <FontAwesomeIcon icon={faCog} /> Settings</span>
          <DownIcon />
        </DropdownToggle>
        <DropdownMenu className='topbar__nav-dropdown-menu dropdown__menu'>
        <Link to='/ui/accounts' onClick={this.handleActive} id='accounts'>
            <div className={classnames('topbar__link', { submenuitem: activeSubItem == 'accounts' })} >
              <span className={`topbar__link-icon lnr lnr-store`} />
              <p className='topbar__link-title'>
                 Accounts
                <span onClick={this.createAccount}> <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></span>
              </p>
            </div>

          </Link>

          <Link to='/ui/users' onClick={this.handleActive} id='users'>
            <div className={classnames('topbar__link', { submenuitem: activeSubItem == 'users' })} >
              <span className={`topbar__link-icon lnr lnr-store`} />
              <p className='topbar__link-title'>
                Users
                <span onClick={this.createUser}> <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></span>
              </p>
            </div>
          </Link>

          <DropdownItem>
            <TopbarNavCategory title='Lists' icon='file-empty'>
           <div onClick={this.handleActive} id='domain_lists' className={classnames({ submenuitem: activeSubSubItem == 'domain_lists' })}>
          <Link to='/ui/lists'  style={{display: 'inline-block'}}>
          <div className='topbar__link'>
              <span className={`topbar__link-icon lnr lnr-store`} />
              <span className='topbar__link-title'>
              Domain Lists
               </span>
            </div>
          </Link>
          <span style={{display: 'inline-block'}}><Link to={`/ui/list/create/new`}>  <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }}/></Link></span>
          </div>

          <div onClick={this.handleActive} id='bundle_lists' className={classnames({ submenuitem: activeSubSubItem == 'bundle_lists' })}>
          <Link to='/ui/bundles'  style={{display: 'inline-block'}}>
          <div className='topbar__link'>
              <span className={`topbar__link-icon lnr lnr-store`} />
              <span className='topbar__link-title'>
              Bundle Lists 
               </span>
            </div>
          </Link>
          <span style={{display: 'inline-block'}}><Link to={`/ui/bundle/create/new`}>  <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }}/></Link></span>
          </div>

          <div onClick={this.handleActive} id='app_lists' className={classnames({ submenuitem: activeSubSubItem == 'app_lists' })}>
          <Link to='/ui/apps'  style={{display: 'inline-block'}}>
          <div className='topbar__link'>
              <span className={`topbar__link-icon lnr lnr-store`} />
            
              App Lists
              
            </div>
          </Link>
          <Link to={`/ui/app/create/new`} style={{display: 'inline-block'}}>  <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }}/></Link>
          </div>


        <div onClick={this.handleActive} id='ip_address' className={classnames({ submenuitem: activeSubSubItem == 'ip_address' })}>
          <Link to='/ui/ips'  style={{display: 'inline-block'}}>
          <div className='topbar__link'>
              <span className={`topbar__link-icon lnr lnr-store`} />
              <span className='topbar__link-title'>
              IP Lists
               </span>
            </div>
          </Link>
          <span style={{display: 'inline-block'}}><Link to={`/ui/ip/create/new`}>  <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }}/></Link></span>
          </div>

            </TopbarNavCategory>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }
}

const mapStateToProps = state => {
  const {  activeItem, activeSubItem, activeSubSubItem } = state.menu;
  const { activeUser } = state.shared;
  return { activeUser, activeItem, activeSubItem, activeSubSubItem };
};
export default connect(mapStateToProps, { changeMenuState, resetActive, modalStateChange, listCampaignAdvertisers, checkIflight })(TopbarNavSettings);