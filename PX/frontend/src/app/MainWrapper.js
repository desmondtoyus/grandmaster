import React, {PureComponent} from 'react';

class MainWrapper extends PureComponent {
  render() {

    
    return (
      <div className="theme-light">
        <div className="wrapper wrapper--full-width top-navigation">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default MainWrapper;