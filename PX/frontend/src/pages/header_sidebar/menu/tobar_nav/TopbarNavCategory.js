import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

 class TopbarNavCategory extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  };
  
  render() {
    const {  activeSubSubItem } = this.props;
    return (

      <div className={classnames('topbar__category-wrap', { submenuitem: activeSubSubItem == 'ip_address' || activeSubSubItem == 'app_lists' || activeSubSubItem == 'bundle_lists' || activeSubSubItem == 'domain_lists' })} >

      {/* // <div className={classnames}'topbar__category-wrap submenuitem'> */}
        <div className='topbar__link topbar__category'>
          {this.props.icon ? <span className={`topbar__link-icon lnr lnr-${this.props.icon}`}/> : ''}
          <p className='topbar__link-title'>
            {this.props.title}
            <span className='topbar__category-icon lnr lnr-chevron-right'/>
          </p>
        </div>
        <div className='topbar__submenu'>
          {this.props.children}
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  const { activeSubSubItem } = state.menu;
  return {  activeSubSubItem };
};
export default connect(mapStateToProps, null)(TopbarNavCategory);