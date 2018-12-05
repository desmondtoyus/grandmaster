import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { resetPublishersReducer } from '../redux/actions/publisher.actions';
import { modalStateChange } from "../redux/actions/modals.actions";
import { isAllowed } from '../functions';
import { Link } from 'react-router-dom';


class Markertplaces extends Component {



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

        if (!isAllowed('Marketplaces', activeUser.user)) {
            return (
                <div className="sub-content">
                    <Alert color='danger'>You are not authorized to view this page</Alert>
                </div>
            )
        }

        return (
            <div>
                <Breadcrumb tag="nav" >
                    <BreadcrumbItem style={{color:'#20C0E7'}}><Link to={`/ui/home`}>Home</Link></BreadcrumbItem>
                    <BreadcrumbItem active tag="span" >Markertplaces</BreadcrumbItem>
                </Breadcrumb>
                {/* <IntegrationGrid /> */}
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { activeUser } = state.shared;
    const { showIntegration } = state.modal;
    return { activeUser, showIntegration };
};

export default connect(mapStateToProps, { resetPublishersReducer, modalStateChange })(Markertplaces);
