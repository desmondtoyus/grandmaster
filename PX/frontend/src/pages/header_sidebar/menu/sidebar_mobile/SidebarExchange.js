import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faRandom, faCaretDown  } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { checkIflight } from '../../../../redux/actions/flight.actions';
import { listCampaignAdvertisers } from '../../../../redux/actions/campaign.actions';
import { modalStateChange } from "../../../../redux/actions/modals.actions";
import { connect } from 'react-redux';
import { changeMenuState, resetActive } from "../../../../redux/actions/menu.actions";
import { Collapse } from 'reactstrap';


class SidebarExchange extends PureComponent {

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
            case "exchange":
                if (activeItem !== 'exchange') {
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



    createIntergration = () => {
        const { history } = this.props;
        history.push(`/ui/integrations`);
        this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
        this.props.modalStateChange({ prop: 'showIntegration', value: true });
    };

    handleActive = (event) => {
        this.props.checkIflight(false, [], '');
        const { activeItem } = this.props;
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
        const { activeItem, activeSubItem } = this.props;
        return (
            <div className={`sidebar__category-wrap${this.state.collapse ? ' sidebar__category-wrap--open' : ''}`}>
                <li className='sidebar__link sidebar__category' onClick={this.toggle} id='exchange'>
                    <FontAwesomeIcon icon={faRandom} />
                    <p className={classnames('sidebar__link-title', { sidebar__active: activeItem == 'exchange' })}>Exchange</p>
                    <span className='sidebar__category-icon'> <FontAwesomeIcon icon={faCaretDown} /> </span>
                </li>
                <Collapse isOpen={this.state.collapse} className='sidebar__submenu-wrap '>
                    <ul className='sidebar__submenu'>
                        <div>
                            <li className='sidebar__link '  onClick={this.handleActive} id='integrations'>
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'integrations' })} >
                                    <Link to='/ui/integrations' className='menus '>  Integrations &nbsp; </Link>
                                    <span onClick={this.createIntergration}> <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></span>
                                </p>
                            </li>


                            <li className='sidebar__link ' onClick={this.handleActive} id='marketplaces'>
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'marketplaces' })}>
                                    <Link  to='/ui/marketplaces' className='menus '> MarketPlaces &nbsp; </Link>
                                    <span> <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></span>
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
    const { supply, supplyMenu, activeItem, activeSubItem } = state.menu;
    const { activeUser } = state.shared;
    return { supply, supplyMenu, activeUser, activeItem , activeSubItem};
};
export default connect(mapStateToProps, { changeMenuState, resetActive, modalStateChange, listCampaignAdvertisers, checkIflight })(SidebarExchange);