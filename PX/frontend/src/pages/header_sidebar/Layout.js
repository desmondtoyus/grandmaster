import React, {PureComponent} from 'react';
import Topbar from './menu/Topbar';
import SidebarMobile from './menu/sidebar_mobile/SidebarMobile';


class Layout extends PureComponent {
  render() {
    return (
      <div>
        <Topbar query={this.props.query} history={this.props.history} title={this.props.title} user={this.props.user} callback={this.props.callback} /> 
        <SidebarMobile query={this.props.query} history={this.props.history} title={this.props.title} user={this.props.user} callback={this.props.callback}/> 
      </div>
    )
  }
}

export default Layout;