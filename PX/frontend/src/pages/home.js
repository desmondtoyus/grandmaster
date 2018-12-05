import React, { Component } from 'react';
import { Col, Container, Row, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { } from '../redux/actions/analytics.actions';
import { isAllowed, isURLValid, parseQuery } from '../functions';
import DashboardTable from './dashboard/dashboard.table';
import DashboardKPI from './dashboard/dashboard.kpi';
import DashboardSummary from './dashboard/dashboard.summary';
import DashboardPerformance from './dashboard/dashboard.performance';
import DashboardReach from './dashboard/dashboard.reach';
import DashboardTraffic from './dashboard/dashboard.traffic';
import DashboardDomains from './dashboard/dashboard.domains';
import DashboardTopAdvertiser from './dashboard/dashboard.topadveriser';
import DashboardTopPublisher from './dashboard/dashboard.toppublisher';
import { readActiveUser } from '../redux/actions/user.actions';



import { changeMenuState} from "../redux/actions/menu.actions";


class Home extends Component {
  componentWillUnmount() {
    // this.props.resetDashboardReducer();
  
    
  }
  componentWillMount() {
      this.props.changeMenuState({ prop: 'fullMenu', value: true });
    this.props.readActiveUser();
  }

  componentDidMount() {
    this.props.changeMenuState({ prop: 'activeItem', value: 'home' });
   
  }

  render() {
    const { activeUser } = this.props;

    if (!isAllowed('Home', activeUser.user)) {
      return (
        <Container fluid>
          <Alert color='danger'>You are not authorized to view this page</Alert>
        </Container>
      )
    }

    return (
      <Container className='dashboard'>
        <Row style={{ marginRight: '5px', marginLeft: '5px' }}>
            <DashboardSummary />
        </Row>
        <Row style={{  marginRight: '5px', marginLeft: '5px' }}>
            <DashboardPerformance />
          {/* < DashboardDomains/> */}
        </Row>
        <Row style={{  marginRight: '5px', marginLeft: '5px' }}>
          <DashboardReach />
        <DashboardTraffic />
        < DashboardDomains/>
          {/* <DashboardKPI /> */}
        </Row>
        <Row style={{  marginRight: '5px', marginLeft: '5px' }}>
          <DashboardTopAdvertiser/>
          <DashboardTopPublisher />
          </Row>
        <Row style={{  marginRight: '5px', marginLeft: '5px' }}>
          <DashboardTable/>
          </Row>
          <Row>
            </Row>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  const { open } = state.menu;
  const { activeItem } = state.dashboard;
  const { activeUser } = state.shared;

  return { open, activeItem, activeUser };
};

export default connect(mapStateToProps, { readActiveUser, changeMenuState })(Home);
