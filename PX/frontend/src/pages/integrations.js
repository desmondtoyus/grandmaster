import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { resetPublishersReducer } from '../redux/actions/publisher.actions';
import { modalStateChange } from "../redux/actions/modals.actions";
import { isAllowed } from '../functions';
import { Link } from 'react-router-dom';
import IntegrationGrid from './grids/integrations.grid';


class Integrations extends Component {
    


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

    if (!isAllowed('Integrations', activeUser.user)) {
      return (
        <div className="sub-content">
          <Alert color='danger'>You are not authorized to view this page</Alert>
        </div>
      )
    }

    return (
      <div>
        <Breadcrumb tag="nav">
          <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
          <BreadcrumbItem active tag="span" >Integrations</BreadcrumbItem>
        </Breadcrumb>
        <IntegrationGrid />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { activeUser } = state.shared;
  const {showIntegration } = state.modal;
  return { activeUser, showIntegration };
};

export default connect(mapStateToProps, { resetPublishersReducer, modalStateChange })(Integrations);
