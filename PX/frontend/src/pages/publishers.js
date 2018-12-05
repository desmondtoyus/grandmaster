import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem} from 'reactstrap';
import { isAllowed } from '../functions';
import { connect } from 'react-redux';
import { resetPublishersReducer } from "../redux/actions/publisher.actions";
import { Link } from 'react-router-dom';
import PublishersGrid from './grids/publishers.grid';

class Publishers extends Component {
  componentWillUnmount() {
    this.props.resetPublishersReducer();
  }

  render() {
    const { activeUser } = this.props;

    if (!activeUser) {
      return (
        <div></div>
      )
    }

    if (!isAllowed('Publishers', activeUser.user)) {
      return (
        <div className="sub-content">
          <Message negative size="massive">You are not authorized to view this page</Message>
        </div>
      )
    }

    return (
      <div>
        <Breadcrumb tag="nav">
          <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
          <BreadcrumbItem active tag="span" >Publishers</BreadcrumbItem>
          <BreadcrumbItem ><Link to={`/ui/placements`} className='link-a'>Placements</Link></BreadcrumbItem>
        </Breadcrumb>
        <PublishersGrid />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { activeUser } = state.shared;

  return { activeUser };
};

export default connect(mapStateToProps, { resetPublishersReducer })(Publishers);
