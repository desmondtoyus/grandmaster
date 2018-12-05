import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench, faPlusCircle, faCaretDown  } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { checkIflight } from '../../../../redux/actions/flight.actions';
import { listCampaignAdvertisers } from '../../../../redux/actions/campaign.actions';
import { modalStateChange } from "../../../../redux/actions/modals.actions";
import { connect } from 'react-redux';
import { changeMenuState, resetActive } from "../../../../redux/actions/menu.actions";
import { Collapse } from 'reactstrap';


class SidebarSetting extends PureComponent {

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
            case "settings":
                if (activeItem !== 'settings') {
                    this.resetActive();
                }
                this.props.changeMenuState({ prop: 'activeItem', value: event.currentTarget.id });
                break;
        }
    }

    resetActive = () => {
        const { demandMenu, supplyMenu, settingsMenu, exchangeMenu } = this.props;
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
        const { activeItem } = this.props;
        switch (event.currentTarget.id) {
            case "accounts":
            case "users":
            case "domain_lists":
            case "bundle_lists":
            case "app_lists":
            case "ip_address":
                this.props.changeMenuState({ prop: 'activeSubItem', value: event.currentTarget.id });
                break;
            case "settings":
                if (activeItem !== 'settings') {
                    this.resetActive();
                }
                this.props.changeMenuState({ prop: 'activeItem', value: event.currentTarget.id });
                break;
        }
    };



    render() {
        const { activeItem, activeSubItem } = this.props;
        return (
            <div className={`sidebar__category-wrap${this.state.collapse ? ' sidebar__category-wrap--open' : ''}`}>
                <li className='sidebar__link sidebar__category' onClick={this.toggle} id='settings'>
                    <FontAwesomeIcon icon={faWrench} />
                    <p className={classnames('sidebar__link-title', { sidebar__active: activeItem == 'settings' })}> Settings</p>
                    <span className='sidebar__category-icon'> <FontAwesomeIcon icon={faCaretDown} /> </span>
                </li>
                <Collapse isOpen={this.state.collapse} className='sidebar__submenu-wrap '>
                    <ul className='sidebar__submenu'>
                        <div>
                            <li className='sidebar__link ' onClick={this.handleActive} id='accounts'>
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'accounts' })} >
                                    <Link className='sidebar__link-title' to='/ui/accounts' className='menus '> Accounts &nbsp; </Link>
                                    <span onClick={this.createAccount} >  <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></span>
                                </p>
                            </li>

                            <li className='sidebar__link' onClick={this.handleActive} id='users'>
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'users' })} >
                                    <Link className='sidebar__link-title' to='/ui/campaigns' className='menus '> Users &nbsp; </Link>
                                    <span onClick={this.createUser}> <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></span>
                                </p>
                            </li>


                            <li className='sidebar__link' onClick={this.handleActive} id='domain_lists'>
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'domain_lists' })} >
                                    <Link className='sidebar__link-title' to='/ui/lists' className='menus '> Domain Lists &nbsp; </Link>
                                    <span> <Link to={`/ui/list/create/new`}><FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></Link></span>
                                </p>
                            </li>

                            <li className='sidebar__link' onClick={this.handleActive} id='bundle_lists'>
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'bundle_lists' })} >
                                    <Link className='sidebar__link-title' to='/ui/bundles' className='menus '> Bundle Lists  &nbsp; </Link>
                                    <span> <Link to={`/ui/bundle/create/new`}><FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></Link></span>
                                </p>
                            </li>

                            <li className='sidebar__link' onClick={this.handleActive} id='app_lists'>
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'app_lists' })} >
                                    <Link className='sidebar__link-title' to='/ui/apps' className='menus '> App Lists  &nbsp; </Link>
                                    <span> <Link to={`/ui/app/create/new`}><FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></Link></span>
                                </p>
                            </li>

                            <li className='sidebar__link' onClick={this.handleActive} id='ip_address'>
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'ip_address' })} >
                                    <Link className='sidebar__link-title' to='/ui/ips' className='menus '> IP Lists  &nbsp; </Link>
                                    <span> <Link to={`/ui/ip/create/new`}><FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></Link></span>
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
    const { settings, settingsMenu, activeItem, activeSubItem } = state.menu;
    const { activeUser } = state.shared;
    return { settings, settingsMenu, activeUser, activeItem, activeSubItem };
};
export default connect(mapStateToProps, { changeMenuState, resetActive, modalStateChange, listCampaignAdvertisers, checkIflight })(SidebarSetting);