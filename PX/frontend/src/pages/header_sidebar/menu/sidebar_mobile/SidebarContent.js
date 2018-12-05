import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import SidebarDemand from "./SidebarDemand";
import SidebarSupply from "./SidebarSupply";
import SidebarExchange from "./SidebarExchange";
import SidebarSetting from "./SidebarSetting";
import SidebarReports from "./SidebarReport";
import { Link } from 'react-router-dom';
import { changeMenuState, resetActive } from "../../../../redux/actions/menu.actions";
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons';

class SidebarContent extends PureComponent {

  
  
  hideSidebar = () => {
    this.props.onClick();
  };
  
  handleActive = (event) => {
    this.resetActive();
    switch (event.currentTarget.id) {
      case "home":
      case "analytics":
        this.props.changeMenuState({ prop: 'activeItem', value: event.currentTarget.id });
        break;
    }
  };
  resetActive = () => {
    this.props.resetActive();
    this.props.changeMenuState({ prop: 'activeItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubSubItem', value: '' });

  };

  render() {
    const { activeItem } = this.props;
    return (
      <div className='sidebar__content'>
        <ul className='sidebar__block'>

          <Link to='/ui/home' 

            id='home'
            onClick={this.handleActive}
            >
            <li className='sidebar__link'>
              <span className='sidebar__link-icon'> <FontAwesomeIcon icon={faHome} /> </span>
              <p className={classnames('sidebar__link-title', { sidebar__active: activeItem == 'home' })} >
                Home
           
              </p>
            </li>
          </Link>
          < SidebarReports history={this.props.history}/>
          < SidebarDemand history={this.props.history}/>
          < SidebarSupply history={this.props.history}/>
          < SidebarExchange history={this.props.history}/>
          < SidebarSetting history={this.props.history}/>
     
        </ul>
      </div>
    )
  }
}


const mapStateToProps = state => {
  const { supply, supplyMenu, activeItem } = state.menu;
  const { activeUser } = state.shared;
  return { supply, supplyMenu, activeUser, activeItem };
};

export default connect(mapStateToProps, { changeMenuState, resetActive })(SidebarContent);

