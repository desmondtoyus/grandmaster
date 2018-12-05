import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';
import LoadingIcon from 'mdi-react/LoadingIcon';

export default class Expand extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    outline: PropTypes.bool,
    color: PropTypes.string
  };
  
  constructor(props) {
    super(props);
    this.state = {
      load: false
    };
    
    this.onLoad = this.onLoad.bind(this);
  }
  
  request() {
    // your async logic here
    setTimeout(() => this.setState({load: false}), 5000);
  }
  
  onLoad() {
    this.setState({
      load: true
    });
    this.request()
  }
  
  render() {
    return (
      <Button onClick={this.onLoad} className={`icon expand ${this.state.load ? 'load' : ''}`} color={this.props.color}
              outline={this.props.outline}>
        <p><LoadingIcon/> {this.props.title}</p>
      </Button>
    )
  }
}