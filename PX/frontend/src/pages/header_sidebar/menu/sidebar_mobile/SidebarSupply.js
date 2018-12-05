import React, { PureComponent } from 'react';
import { Collapse } from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faStrikethrough, faCaretDown  } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { checkIflight } from '../../../../redux/actions/flight.actions';
import { listCampaignAdvertisers } from '../../../../redux/actions/campaign.actions';
import { modalStateChange } from "../../../../redux/actions/modals.actions";
import { connect } from 'react-redux';
import { changeMenuState, resetActive } from "../../../../redux/actions/menu.actions";



class SidebarSupply extends PureComponent {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            collapse: false
        };
    }

    toggle=(event)=> {
        this.setState({ collapse: !this.state.collapse });
        const { activeItem } = this.props;
        switch (event.currentTarget.id) {
            case "supply":
                if (activeItem !== 'supply') {
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



    createPublisher = () => {
        const { history } = this.props;
        history.push(`/ui/publishers`);
        this.props.modalStateChange({ prop: 'modalStatus', value: 'create' });
        this.props.modalStateChange({ prop: 'showPublisher', value: true });
    };

    handleActive = (event) => {
        this.props.checkIflight(false, [], '');
        const { activeItem } = this.props;
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
        const { activeItem, activeSubItem } = this.props;
        return (
            <div className={`sidebar__category-wrap${this.state.collapse ? ' sidebar__category-wrap--open' : ''}`}>
                <li className='sidebar__link sidebar__category' onClick={this.toggle} id='supply'>
                    
                    <FontAwesomeIcon icon={faStrikethrough} />
                    <p className={classnames('sidebar__link-title', { sidebar__active: activeItem == 'supply' })}>Supply </p> 
                    <span className='sidebar__category-icon'> <FontAwesomeIcon icon={faCaretDown} /> </span>
                </li>
                <Collapse isOpen={this.state.collapse} className='sidebar__submenu-wrap '>
                    <ul className='sidebar__submenu'>
                        <div>
                            <li className='sidebar__link' onClick={this.handleActive} id='publishers' >
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'publishers' })}>
                                    <Link  to='/ui/publishers' > Publishers &nbsp; </Link>
                                    <span onClick={this.createPublisher}>  <FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></span>
                                </p>
                            </li>
                          
                          
                            <li className='sidebar__link '  onClick={this.handleActive} id='placements'>
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'placements' })}>
                                    <Link  to='/ui/placements' > Placements &nbsp; </Link>
                                    <span> <Link to={`/ui/placement/create/new`}><FontAwesomeIcon icon={faPlusCircle} style={{ color: 'rgb(89, 124, 148)' }} /></Link></span>
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
    const { activeSubItem, activeItem } = state.menu;
    const { activeUser } = state.shared;
    return { activeSubItem, activeUser, activeItem };
};
export default connect(mapStateToProps, { changeMenuState, resetActive, modalStateChange, listCampaignAdvertisers, checkIflight })(SidebarSupply);