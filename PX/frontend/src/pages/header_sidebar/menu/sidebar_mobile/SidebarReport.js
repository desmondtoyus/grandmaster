import React, { PureComponent } from 'react';
import { Collapse } from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faCaretDown  } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { checkIflight } from '../../../../redux/actions/flight.actions';
import { listCampaignAdvertisers } from '../../../../redux/actions/campaign.actions';
import { modalStateChange } from "../../../../redux/actions/modals.actions";
import { connect } from 'react-redux';
import { changeMenuState, resetActive } from "../../../../redux/actions/menu.actions";

class SidebarReports extends PureComponent {
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
            case "analytics":
            case "rejections":
              this.props.changeMenuState({ prop: 'activeSubItem', value: event.currentTarget.id });
              break;
            case "reports":
              if (activeItem !== 'reports') {
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
          case "analytics":
          case "rejections":
            this.props.changeMenuState({ prop: 'activeSubItem', value: event.currentTarget.id });
            break;
          case "reports":
            if (activeItem !== 'reports') {
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
                <li className='sidebar__link sidebar__category' onClick={this.toggle} id='analytics'>
                    
                    <FontAwesomeIcon icon={faFolderOpen} /> 
                    <p className={classnames('sidebar__link-title', { sidebar__active: activeItem == 'reports' })}>Reports </p> 
                    <span className='sidebar__category-icon'> <FontAwesomeIcon icon={faCaretDown} /> </span>
                </li>
                <Collapse isOpen={this.state.collapse} className='sidebar__submenu-wrap '>
                    <ul className='sidebar__submenu'>
                        <div>
                        <li className='sidebar__link '  onClick={this.handleActive} id='analytics'>
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'analytics' })}>
                                    <Link  to='/ui/analytics' > Analytics &nbsp; </Link>
                                 </p>
                            </li>

                            <li className='sidebar__link' onClick={this.handleActive} id='rejections' >
                                <p className={classnames('sidebar__link-title', { sidebar__subactive: activeSubItem == 'rejections' })}>
                                    <Link  to='/ui/rejections' > Rejections &nbsp; </Link>
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
    const { reports, supplyMenu, activeItem, activeSubItem } = state.menu;
    const { activeUser } = state.shared;
    return { reports, supplyMenu, activeUser, activeItem, activeSubItem };
};
export default connect(mapStateToProps, { changeMenuState, resetActive, modalStateChange, listCampaignAdvertisers, checkIflight })(SidebarReports);