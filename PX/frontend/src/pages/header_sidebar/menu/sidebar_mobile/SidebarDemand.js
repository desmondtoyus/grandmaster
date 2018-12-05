import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandHoldingUsd, faPlusCircle, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { checkIflight } from '../../../../redux/actions/flight.actions';
import { listCampaignAdvertisers } from '../../../../redux/actions/campaign.actions';
import { modalStateChange } from "../../../../redux/actions/modals.actions";
import { connect } from 'react-redux';
import { changeMenuState, resetActive } from "../../../../redux/actions/menu.actions";
import moment from 'moment';
import { Collapse } from 'reactstrap';


 class SidebarDemand extends PureComponent {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            collapse: false
        };
    }

     toggle = (event) => {
         this.setState({ collapse: !this.state.collapse });
         const { activeItem } = this.props;
         switch (event.currentTarget.id) {
             case "demand":
                 if (activeItem !== 'demand') {
                     this.resetActive();
                 }
                 this.props.changeMenuState({ prop: 'activeItem', value: event.currentTarget.id });
                 break;
         }
     }
     resetActive = () => {
         this.props.resetActive();
         this.props.changeMenuState({ prop: 'activeItem', value: '' });
         this.props.changeMenuState({ prop: 'activeSubItem', value: '' });
         this.props.changeMenuState({ prop: 'activeSubSubItem', value: '' });

     };

     handleActive = (event) => {
         this.props.checkIflight(false, [], '');
         const { activeItem } = this.props;
         switch (event.currentTarget.id) {
             case "advertisers":
             case "campaigns":
             case "flights":
                 this.props.changeMenuState({ prop: 'activeSubItem', value: event.currentTarget.id });
                 break;
             case "demand":
                 if (activeItem !== 'demand') {
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
        const { activeItem, activeSubItem } = this.props;
        return (
            <div className={`sidebar__category-wrap${this.state.collapse ? ' sidebar__category-wrap--open' : ''}`}>
                <li className='sidebar__link sidebar__category' onClick={this.toggle} id='demand' >
                    <FontAwesomeIcon icon={faHandHoldingUsd} /> 
                    <p className={classnames('sidebar__link-title', { sidebar__active: activeItem == 'demand' })}><span>  Demand</span></p>
                    <span className='sidebar__category-icon'> <FontAwesomeIcon icon={faCaretDown} /> </span>
                </li>
                <Collapse isOpen={this.state.collapse} className='sidebar__submenu-wrap '>
                    <ul className='sidebar__submenu'>
                        <div>
                            <li className='sidebar__link ' onClick={this.handleActive} id='advertisers'  >
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'advertisers' })} >
                                    <Link  to='/ui/advertisers' className='menus '> Advertisers  &nbsp; </Link>
                                    <span onClick={this.createAdvertiser} >  <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></span>
                                </p>
                            </li>

                            <li className='sidebar__link ' onClick={this.handleActive} id='campaigns' >
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'campaigns' })} >
                                    <Link to='/ui/campaigns' className='menus '> Campaigns  &nbsp; </Link>
                                    <span onClick={this.createCampaign}> <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></span>
                                </p>
                            </li>


                            <li className='sidebar__link ' onClick={this.handleActive} id='flights'>
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'flights' })}>
                                    <Link  to='/ui/flights' className='menus '> Flights  &nbsp; </Link>
                                    <span> <Link to={`/ui/flight/create/new`}><FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></Link></span>
                                </p>
                            </li>
                        </div>
                    </ul>
                </Collapse>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { activeItem, activeSubItem } = state.menu;
    const { activeUser } = state.shared;
    return { activeUser, activeItem, activeSubItem };
};
export default connect(mapStateToProps, { changeMenuState, resetActive, modalStateChange, listCampaignAdvertisers, checkIflight })(SidebarDemand);
