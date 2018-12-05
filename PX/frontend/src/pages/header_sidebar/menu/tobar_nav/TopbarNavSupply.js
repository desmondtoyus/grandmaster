import React, { PureComponent } from 'react';
import classnames from 'classnames';
import DownIcon from 'mdi-react/ChevronDownIcon';
import {  DropdownToggle, DropdownMenu, UncontrolledDropdown } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { checkIflight } from '../../../../redux/actions/flight.actions';
import { listCampaignAdvertisers } from '../../../../redux/actions/campaign.actions';
import { modalStateChange } from "../../../../redux/actions/modals.actions";
import { connect } from 'react-redux';
import { changeMenuState, resetActive } from "../../../../redux/actions/menu.actions";



class TopbarNavSupply extends PureComponent {
  resetActive = () => {
    this.props.resetActive();
    this.props.changeMenuState({ prop: 'activeItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubSubItem', value: '' });

  };



  createPublisher = () => {
    const { history } = this.props;
    history.push(`/ui/publishers`);
    this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
    this.props.modalStateChange({ prop: 'showPublisher', value: true });
  };

  handleActive = (event) => {
    this.props.checkIflight(false, [], '');
    const { activeItem} = this.props;
    switch (event.currentTarget.id) {
      case "publishers":
      case "placements":
        this.props.changeMenuState({ prop: 'activeSubItem', value: event.currentTarget.id });
        break;
      case "supply":
        if (activeItem !== 'supply') {
          this.resetActive();
        }
        this.props.changeMenuState({ prop: 'activeItem', value: event.currentTarget.id });
        break;
    }
  };

  render() {
    const { activeItem, activeSubItem} = this.props;
    return (
      <UncontrolledDropdown className={classnames('topbar__nav-dropdown', { menuitem: activeItem == 'supply' })} >
        <DropdownToggle className='topbar__nav-dropdown-toggle ' onClick={this.handleActive} id='supply'>
          <span> SUPPLY</span>
          {/* <DownIcon /> */}
        </DropdownToggle>

        <DropdownMenu className='topbar__nav-dropdown-menu dropdown__menu'>
          <Link to='/ui/publishers' onClick={this.handleActive} id='publishers'>
            {/* <div className='topbar__link submenuitem'  id='campaigns' onClick={this.handleActive}> */}
            <div className={classnames('topbar__link', { submenuitem: activeSubItem == 'publishers' })} >
              <span className={`topbar__link-icon lnr lnr-store`} />
              <p className='topbar__link-title'>
                Publishers
                <span onClick={this.createPublisher}> <FontAwesomeIcon icon={faPlusCircle} style={{ color:'rgb(89, 124, 148)'}}/></span>
              </p>
            </div>
          </Link>

  <div onClick={this.handleActive} id='placements' className={classnames({ submenuitem: activeSubItem == 'placements' })}>
          <Link to='/ui/placements' style={{display: 'inline-block'}}>
          <div className='topbar__link'>
              <span className={`topbar__link-icon lnr lnr-store`} />
              <span className='topbar__link-title'>
                 Placements
               </span>
            </div>
          </Link>
          <span style={{display: 'inline-block'}}><Link to={`/ui/placement/create/new`}> <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }}/></Link></span>
          </div>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }
}

const mapStateToProps = state => {
  const { activeItem, activeSubItem, activeSubSubItem } = state.menu;
  const { activeUser } = state.shared;
  return { activeUser, activeItem, activeSubItem, activeSubSubItem };
};
export default connect(mapStateToProps, { changeMenuState, resetActive, modalStateChange, listCampaignAdvertisers, checkIflight })(TopbarNavSupply);
