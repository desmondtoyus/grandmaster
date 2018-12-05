import React, { PureComponent } from 'react';
import classnames from 'classnames';
import DownIcon from 'mdi-react/ChevronDownIcon';
import { DropdownItem, DropdownToggle, DropdownMenu, UncontrolledDropdown } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faRandom } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { checkIflight } from '../../../../redux/actions/flight.actions';
import { listCampaignAdvertisers } from '../../../../redux/actions/campaign.actions';
import { modalStateChange } from "../../../../redux/actions/modals.actions";
import { connect } from 'react-redux';
import { changeMenuState, resetActive } from "../../../../redux/actions/menu.actions";



class TopbarNavExchange extends PureComponent {
  resetActive = () => {
    const { demandMenu, supplyMenu, settingsMenu, exchangeMenu } = this.props;

    this.props.resetActive();
    this.props.changeMenuState({ prop: 'activeItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubSubItem', value: '' });

  };



  createIntergration = () => {
    const { history } = this.props;
    history.push(`/ui/integrations`);
    this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
    this.props.modalStateChange({ prop: 'showIntegration', value: true });
  };

  handleActive = (event) => {
    this.props.checkIflight(false, [], '');
    const { activeItem} = this.props;
    switch (event.currentTarget.id) {
      case "integrations":
      case "marketplaces":
        this.props.changeMenuState({ prop: 'activeSubItem', value: event.currentTarget.id });
        break;
      case "exchange":
        if (activeItem !== 'exchange') {
          this.resetActive();
        }
        this.props.changeMenuState({ prop: 'activeItem', value: event.currentTarget.id });
        break;
    }
  };

  render() {
    const { activeItem, activeSubItem} = this.props;
    return (
      <UncontrolledDropdown className={classnames('topbar__nav-dropdown', { menuitem: activeItem == 'exchange' })} >
        <DropdownToggle className='topbar__nav-dropdown-toggle ' onClick={this.handleActive} id='exchange'>
          <span> <FontAwesomeIcon icon={faRandom} /> Exchange</span>
          <DownIcon />
        </DropdownToggle>

        <DropdownMenu className='topbar__nav-dropdown-menu dropdown__menu'>
        <Link to='/ui/integrations' onClick={this.handleActive} id='integrations'>
            {/* <div className='topbar__link submenuitem'  id='campaigns' onClick={this.handleActive}> */}
            <div className={classnames('topbar__link', { submenuitem: activeSubItem == 'integrations' })} >
              <span className={`topbar__link-icon lnr lnr-store`} />
              <p className='topbar__link-title'>
                 Integrations
                <span onClick={this.createIntergration}> <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></span>
              </p>
            </div>
          </Link>


          <Link to='/ui/marketplaces'onClick={this.handleActive} id='marketplaces'>
            <div className={classnames('topbar__link', { submenuitem: activeSubItem == 'marketplaces' })} >
              <span className={`topbar__link-icon lnr lnr-store`} />
              <p className='topbar__link-title'>
                 MarketPlaces
                <span><FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></span>
              </p>
            </div>
          </Link>
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
export default connect(mapStateToProps, { changeMenuState, resetActive, modalStateChange, listCampaignAdvertisers, checkIflight })(TopbarNavExchange);