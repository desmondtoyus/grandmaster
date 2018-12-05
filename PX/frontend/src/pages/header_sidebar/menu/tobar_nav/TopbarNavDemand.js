import React, { PureComponent } from 'react';
import classnames from 'classnames';
import DownIcon from 'mdi-react/ChevronDownIcon';
import { DropdownToggle, DropdownMenu, UncontrolledDropdown } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { checkIflight } from '../../../../redux/actions/flight.actions';
import { listCampaignAdvertisers } from '../../../../redux/actions/campaign.actions';
import { modalStateChange } from "../../../../redux/actions/modals.actions";
import { connect } from 'react-redux';
import { changeMenuState, resetActive } from "../../../../redux/actions/menu.actions";
import moment from 'moment';

class TopbarNavDemand extends PureComponent {

    resetActive = () => {
        this.props.resetActive();
        this.props.changeMenuState({ prop: 'activeItem', value: '' });
        this.props.changeMenuState({ prop: 'activeSubItem', value: '' });
        this.props.changeMenuState({ prop: 'activeSubSubItem', value: '' });

    };

    handleActive = (event) => {
        this.props.checkIflight(false, [], '');
        const {activeItem} =this.props;
        switch (event.currentTarget.id) {
            case "advertisers":
            case "campaigns":
             case   "flights": 
                this.props.changeMenuState({ prop: 'activeSubItem', value: event.currentTarget.id });
                break;
            case "demand":
                if (activeItem !=='demand') {
                    this.resetActive();
            }
                this.props.changeMenuState({ prop: 'activeItem', value: event.currentTarget.id });
                break;
        }
    };
    createAdvertiser = () => {
        const { history } = this.props;
        history.push(`/ui/advertisers`);
        this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
        this.props.modalStateChange({ prop: 'showAdvertiser', value: true });
    };

    createCampaign = () => {
        const { history } = this.props;

        history.push(`/ui/campaigns`);
        let master = this.props.activeUser.scope_account.is_zone_master;
        this.props.listCampaignAdvertisers(master);
        this.props.modalStateChange({ prop: 'startDate', value: moment().format('YYYY-MM-DD') });
        this.props.modalStateChange({ prop: 'startTime', value: moment().format('HH:mm') });
        this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
        this.props.modalStateChange({ prop: 'showCampaign', value: true });
    };
    render() {
        const { activeItem, activeSubItem, activeSubSubItem } = this.props;
        return (
            <UncontrolledDropdown className={classnames({ menuitem: activeItem == 'demand'})} >
                <DropdownToggle className='topbar__nav-dropdown-toggle ' onClick={this.handleActive} id='demand'>
                    <span> DEMAND</span>
                    {/* <DownIcon />  */}
                </DropdownToggle>

                <DropdownMenu className='topbar__nav-dropdown-menu dropdown__menu' style={{width:'20px'}}>
                <Link to='/ui/advertisers' onClick={this.handleActive} id='advertisers'>
                        <div className={classnames('topbar__link', { submenuitem: activeSubItem == 'advertisers' })}>
                            <span className={`topbar__link-icon `} />
                            <p className='topbar__link-title'>
                                Advertisers
                                <span onClick={this.createAdvertiser} > <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }}/></span>
                            </p>
                        </div>
                    </Link>
                    <Link to='/ui/campaigns'onClick={this.handleActive} id='campaigns'>
                        {/* <div className='topbar__link submenuitem'  id='campaigns' onClick={this.handleActive}> */}
                        <div className={classnames('topbar__link', { submenuitem: activeSubItem == 'campaigns' })}>
                            <span className={`topbar__link-icon `} />
                            <p className='topbar__link-title'>
                                Campaigns 
                                <span onClick={this.createCampaign}> <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }}/></span>
                            </p>
                        </div>
                    </Link>
                    <div onClick={this.handleActive} id='flights' className={classnames({ submenuitem: activeSubItem == 'flights' })}>
                    <Link to='/ui/flights'  style={{display: 'inline-block'}}>
                        <div className='topbar__link'>
                        <span className={`topbar__link-icon `} />
                            <span className='topbar__link-title'>
                                Flights
                              </span>
                        </div>
                    </Link>
                  <Link style={{display: 'inline-block'}} to='/ui/flight/create/new'> <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }}/></Link>
                    
                    </div>
                </DropdownMenu>
            </UncontrolledDropdown>
        )
    }
}

const mapStateToProps = state => {
    const {  activeItem, activeSubItem,activeSubSubItem } = state.menu;
    const { activeUser } = state.shared;
    return { activeUser, activeItem, activeSubItem, activeSubSubItem };
};
export default connect(mapStateToProps, { changeMenuState, resetActive, modalStateChange, listCampaignAdvertisers, checkIflight })(TopbarNavDemand);
