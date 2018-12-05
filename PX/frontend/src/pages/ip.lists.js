import React, { Component } from 'react';
import { isAllowed } from "../functions";
import { Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { resetDomainListsReducer } from '../redux/actions/lists.actions';
import { Link } from 'react-router-dom';
import IpListsGrid  from './grids/ip.lists.grid';

class IpLists extends Component {
    componentWillUnmount() {
        this.props.resetDomainListsReducer();
    }

    render() {
        const { activeUser } = this.props;

        if (!isAllowed('Lists', activeUser.user)) {
            return (
                <div className={'sub-content'}>
                    <Alert color='danger'>You are not authorized to view this page</Alert>
                </div>
            )
        }

        return (
            <div>
                <Breadcrumb tag="nav">
                    <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to={`/ui/lists`} className='link-a'> Lists</Link></BreadcrumbItem>
                    <BreadcrumbItem active tag="span" >IP Address Lists</BreadcrumbItem>
                </Breadcrumb>
                <IpListsGrid />
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { activeUser } = state.shared;

    return { activeUser };
};

export default connect(mapStateToProps, { resetDomainListsReducer })(IpLists);