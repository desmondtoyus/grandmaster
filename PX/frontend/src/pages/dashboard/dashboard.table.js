import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';
import { changeDashboardState, fetchDashboardTableData } from '../../redux/actions/dashboard.actions';
import Panel from '../../components/Panel';
import Table from '../../components/table/Table';


class DashboardTable extends Component {
  componentWillMount() {
    const { activeUser } = this.props;
    const payload = {
      category: 'publisher',
      zone_id: activeUser.scope_account.zone.id,
      timezone: activeUser.user.timezone
    };
    this.props.fetchDashboardTableData(payload);
  }
  componentDidMount(){
    this.props.changeDashboardState({ prop: 'activeItem', value: 'TOP PUBLISHER TAGS' });
  }

  handleTabs = name => {
    const { activeUser } = this.props;
    this.props.changeDashboardState({ prop: 'activeItem', value: name });
    const payload = {
      zone_id: activeUser.scope_account.zone.id,
      timezone: activeUser.user.timezone
    };
    switch (name) {
      case 'TOP ADVERTISERS':
        payload.category = 'advertiser';
        break;
      case 'TOP ADVERTISER TAGS':
        payload.category = 'flight';
        break;
      case 'TOP PUBLISHERS':
        payload.category = 'publisher';
        break;
      case 'TOP PUBLISHER TAGS':
        payload.category = 'placement';
        break;
    }
    this.props.fetchDashboardTableData(payload);
  };

  renderTableBody = () => {
    const { dashboardTableData } = this.props;

    return dashboardTableData.map((item, index) => {
      if(index <= 9){
      return (
        <tr key={index}>
          <td>{item.advertiser_id || item.flight_id || item.publisher_id || item.placement_id}</td>
          <td><p className='dashboard__ste'>{item.name}</p></td>
          <td >{item.today_impressions.toLocaleString()}</td>
          <td >{`$${item.today_revenue.toLocaleString()}`}</td>
          <td >{`${(Number(item.today_attempt_fill_rate || item.today_fill_rate) * 100).toFixed(2)}%`}</td>
          <td >{item.yesterday_impressions.toLocaleString()}</td>
          <td >{`$${item.yesterday_revenue.toLocaleString()}`}</td>
          <td >{`${(Number(item.yesterday_attempt_fill_rate || item.yesterday_fill_rate) * 100).toFixed(2)}%`}</td>
          <td >{item.last_week_impressions.toLocaleString()}</td>
          <td >{`$${item.last_week_revenue.toLocaleString()}`}</td>
          <td >{`${(Number(item.last_week_attempt_fill_rate || item.last_week_fill_rate) * 100).toFixed(2)}%`}</td>
        </tr>
      )
    }
    })
  };

  render() {
    const { activeItem } = this.props;
    return (
      <Panel lg={12} title=''>
        <Nav tabs>
        <NavItem>
            <NavLink
              className={classnames({ active: activeItem === "TOP PUBLISHER TAGS"})}
              onClick={this.handleTabs.bind(null, 'TOP PUBLISHER TAGS')}
            >
              Top Publishers Tags
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeItem === "TOP ADVERTISER TAGS" })}
              onClick={this.handleTabs.bind(null, 'TOP ADVERTISER TAGS')}
            >
              Top Advertiser Tags
            </NavLink>
          </NavItem>       
        </Nav>
        <Table striped responsive className='table--bordered dashboard__table-crypto'>
          <thead>
            <tr>
              <th style={{ borderBottom: 'none', paddingTop: '0', paddingBottom: '0' }}>ID</th>
              <th style={{ borderBottom: 'none', paddingBottom: '0' }}>Name</th>
              <th colSpan={3} style={{textAlign:'center'}}>Today</th>
              <th colSpan={3} style={{ textAlign: 'center' }}>Yesterday</th>
              <th colSpan={3} style={{ textAlign: 'center' }}>Last 7 Days</th>
              </tr>
            <tr>
              <th style={{ borderTop: 'none', padding: '0' }}></th>
              <th style={{ borderTop: 'none', padding: '0' }}></th>
              <th>Imps</th>
              <th>Revenue</th>
              <th>Fill Rate</th>
              <th>Imps</th>
              <th>Revenue</th>
              <th>Fill Rate</th>
              <th>Imps</th>
              <th>Revenue</th>
              <th>Fill Rate</th>
            </tr>
          </thead>
          <tbody>
            {this.renderTableBody()}
          </tbody>
        </Table>
      </Panel>
    )
  }
}

const mapStateToProps = state => {
  const { activeItem, dashboardTableData } = state.dashboard;
  const { activeUser } = state.shared;

  return { activeItem, dashboardTableData, activeUser };
};

export default connect(mapStateToProps, { changeDashboardState, fetchDashboardTableData })(DashboardTable);