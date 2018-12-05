import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { modalStateChange } from "../redux/actions/modals.actions";
import { resetFlightsReducer } from "../redux/actions/flight.actions";
import { isAllowed } from '../functions';
import { Link } from 'react-router-dom';
import IFlightsGrid from './grids/iflights.grid';

class Flights extends Component {
    componentWillUnmount() {
        this.props.resetFlightsReducer();
    }

    render() {
        const { activeUser } = this.props;

        if (!activeUser) {
            return (
                <div></div>
            )
        }

        if (!isAllowed('Advertisers', this.props.activeUser.user)) {
            return (
                <div className={'sub-content'}>
                    <Alert negative size="massive">You are not authorized to view this page</Alert>
                </div>
            )
        }

        return (
            <div>
                <Breadcrumb tag="nav">
                    <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to={`/ui/integrations`} className='link-a'>Integrations</Link></BreadcrumbItem>
                    <BreadcrumbItem active tag="span" >IFlights</BreadcrumbItem>
                </Breadcrumb>
                <IFlightsGrid />
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { activeUser } = state.shared;

    return { activeUser };
};

export default connect(mapStateToProps, { modalStateChange, resetFlightsReducer })(Flights);
