import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  fetchDashboardTopPublisher  } from '../../redux/actions/dashboard.actions';
import Panel from '../../components/Panel';
import Table from '../../components/table/Table';

class DashboardTopPublisher extends Component {
  componentWillMount() {
    const { activeUser } = this.props;
    // payload.category = 'publisher';
    const payload = {
      category: 'publisher',
      zone_id: activeUser.scope_account.zone.id,
      timezone: activeUser.user.timezone
    };
    this.props.fetchDashboardTopPublisher (payload);
  }
  renderChange=(today, yesterday) =>{
    let revChange = today - yesterday;
        let perRevChange = ((100 * (Math.abs(today - yesterday)))/(yesterday)).toFixed(0);
        let option={}
        if (revChange > 0) {
          option.styleColor ='#4ce1b6';
          option.revValue = '+'+perRevChange.toLocaleString();
        }
        else if(revChange < 0){
          option.styleColor ='#ff4861';
          option.revValue= '-'+perRevChange.toLocaleString()+'%';
        }
        else if(revChange = 0){
          option.styleColor ='#21cbe6';
          option.revValue = '+'+perRevChange.toLocaleString()+'%';
        }
        else{
          option.styleColor ='#21cbe6';
          option.revValue = '0%';
        }
        return option;
        
  
  }

  renderTableBody = () => {
    const { dashboardTopPublisher } = this.props;

    return dashboardTopPublisher.map((item, index) => {
        if(index <= 9){
            let revenue = this.renderChange(item.today_revenue, item.yesterday_revenue);
            let imp = this.renderChange(item.today_impressions, item.yesterday_impressions);
            let fill = this.renderChange(item.today_attempt_fill_rate, item.yesterday_attempt_fill_rate);
      return (
        <tr key={index}>
          <td>{item.advertiser_id || item.flight_id || item.publisher_id || item.placement_id}</td>
          <td><p className='dashboard__ste'>{item.name}</p></td> 
            <td >{item.today_impressions.toLocaleString()}<span style={{color:revenue.styleColor, fontSize:'10px'}}> {revenue.revValue}</span></td>
            <td >{`$${item.today_revenue.toLocaleString()}`} <span style={{color:imp.styleColor, fontSize:'10px'}}> {imp.revValue}</span></td>
            <td >{`${(Number(item.today_attempt_fill_rate || item.today_fill_rate) * 100).toFixed(2)}%`} <span style={{color:fill.styleColor, fontSize:'10px'}}> {fill.revValue}</span></td>
          {/* <td >{item.yesterday_impressions.toLocaleString()}</td>
          <td >{`$${item.yesterday_revenue.toLocaleString()}`}</td>
          <td >{`${(Number(item.yesterday_attempt_fill_rate || item.yesterday_fill_rate) * 100).toFixed(2)}%`}</td> */}
          {/* <td >{item.last_week_impressions.toLocaleString()}</td>
          <td >{`$${item.last_week_revenue.toLocaleString()}`}</td>
          <td >{`${(Number(item.last_week_attempt_fill_rate || item.last_week_fill_rate) * 100).toFixed(2)}%`}</td> */}
        </tr>
      )
    }
    })
  };

  render() {
    return (
      <Panel md={6} title='Top Publishers'>
        <Table striped responsive className='table--bordered dashboard__table-crypto'>
          <thead>
            <tr>
              <th style={{ borderBottom: 'none', paddingTop: '0', paddingBottom: '0' }}>ID</th>
              <th style={{ borderBottom: 'none', paddingBottom: '0' }}>Name</th>
              <th colSpan={3} style={{textAlign:'center'}}>Today</th>
              {/* <th colSpan={3} style={{ textAlign: 'center' }}>Yesterday</th>
              <th colSpan={3} style={{ textAlign: 'center' }}>Last 7 Days</th> */}
              </tr>
            <tr>
              <th style={{ borderTop: 'none', padding: '0' }}></th>
              <th style={{ borderTop: 'none', padding: '0' }}></th>
              <th>Imps</th>
              <th>Revenue</th>
              <th>Fill Rate</th>
              {/* <th>Imps</th>
              <th>Revenue</th>
              <th>Fill Rate</th>
              <th>Imps</th>
              <th>Revenue</th>
              <th>Fill Rate</th> */}
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
  const { dashboardTopPublisher } = state.dashboard;
  const { activeUser } = state.shared;

  return {  dashboardTopPublisher, activeUser };
};

export default connect(mapStateToProps, {  fetchDashboardTopPublisher  })(DashboardTopPublisher);