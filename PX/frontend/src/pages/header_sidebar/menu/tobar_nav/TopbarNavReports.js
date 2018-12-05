import React, {PureComponent} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faChartLine } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import DownIcon from 'mdi-react/ChevronDownIcon';
import { DropdownToggle, DropdownMenu, UncontrolledDropdown } from 'reactstrap';
import { Link } from 'react-router-dom';
import { checkIflight } from '../../../../redux/actions/flight.actions';
import { listCampaignAdvertisers } from '../../../../redux/actions/campaign.actions';
import { modalStateChange } from "../../../../redux/actions/modals.actions";
import { connect } from 'react-redux';
import { changeMenuState, resetActive } from "../../../../redux/actions/menu.actions";


class TopbarNavReports extends PureComponent {

  resetActive = () => {
    this.props.resetActive();
    this.props.changeMenuState({ prop: 'activeItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubItem', value: '' });
    this.props.changeMenuState({ prop: 'activeSubSubItem', value: '' });
  };

  handleActive = (event) => {
    this.props.checkIflight(false, [], '');
    const { activeItem} = this.props;
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
    const { activeItem, activeSubItem, activeSubSubItem } = this.props;
    return (

      <UncontrolledDropdown className={classnames('topbar__nav-dropdown', { menuitem: activeItem == 'reports' })} >
        <DropdownToggle className='topbar__nav-dropdown-toggle ' onClick={this.handleActive} id='reports'>
          <span> REPORTS</span>
          {/* <DownIcon /> */}
        </DropdownToggle>
        <DropdownMenu className='topbar__nav-dropdown-menu dropdown__menu'>
       

          <Link to='/ui/analytics'  onClick={this.handleActive} id='analytics'>
            <div className={classnames('topbar__link', { submenuitem: activeSubItem == 'analytics' })} >
            <span className={`topbar__link-icon `} />
              <p className='topbar__link-title'>Analytics</p>
            </div>
          </Link>

           <Link to='/ui/rejections'onClick={this.handleActive} id='rejections'>
            <div className={classnames('topbar__link', { submenuitem: activeSubItem == 'rejections' })} >
            <span className={`topbar__link-icon `} />
              <p className='topbar__link-title'>Rejections</p>
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
export default connect(mapStateToProps, { changeMenuState, resetActive, modalStateChange, listCampaignAdvertisers, checkIflight })(TopbarNavReports);
