import React, {PureComponent} from 'react';
import {CardBody, Card} from 'reactstrap';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

export default class Navigation extends PureComponent {
  static propTypes = {
    active: PropTypes.string,
    stick: PropTypes.bool
  };
  
  render() {
    return (
        <Card className='card--not-full-height documentation__nav-wrap' style={{...this.props.style, marginTop: this.props.stick ? '90px' : '0'}}>
          <CardBody style={{width:'150px'}}>
            <Link to='/'
                  className={`documentation__nav-link${this.props.active === 'introduction' ? ' documentation__nav--active' : ''}`}>
              Home
            </Link>
          </CardBody>
        </Card>
    )
  }
}