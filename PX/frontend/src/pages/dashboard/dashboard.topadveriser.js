import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  fetchDashboardTopAdvertiser } from '../../redux/actions/dashboard.actions';
import Panel from '../../components/Panel';
import Table from '../../components/table/Table';
import classNames from 'classnames';


class DashboardTopAdvertiser extends Component {
  componentWillMount() {
    const { activeUser } = this.props;
    // payload.category = 'publisher';
    const payload = {
      category: 'advertiser',
      zone_id: activeUser.scope_account.zone.id,
      timezone: activeUser.user.timezone
    };
    this.props.fetchDashboardTopAdvertiser(payload);
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
    const { dashboardTopAdvertiser } = this.props;

    return dashboardTopAdvertiser.map((item, index) => {
      let revenue = this.renderChange(item.today_revenue, item.yesterday_revenue);
      let imp = this.renderChange(item.today_impressions, item.yesterday_impressions);
      let fill = this.renderChange(item.today_attempt_fill_rate, item.yesterday_attempt_fill_rate);
      
      if(index <= 9){
        return (
          <tr key={index}>
            <td>{item.advertiser_id || item.flight_id || item.publisher_id || item.placement_id}</td>
            <td><p className='dashboard__ste'>{item.name}</p></td> 
            <td >{item.today_impressions.toLocaleString()}<span style={{color:revenue.styleColor, fontSize:'10px'}}> {revenue.revValue}</span></td>
            <td >{`$${item.today_revenue.toLocaleString()}`} <span style={{color:imp.styleColor, fontSize:'10px'}}> {imp.revValue}</span></td>
            <td >{`${(Number(item.today_attempt_fill_rate || item.today_fill_rate) * 100).toFixed(2)}%`} <span style={{color:fill.styleColor, fontSize:'10px'}}> {fill.revValue}</span></td>
          </tr>
        )
      }
   
    })
  };

  render() {
    return (
      <Panel md={6} title='Top Advertisers'>
      <Table striped responsive className='table--bordered dashboard__table-crypto'>
        <thead>
          <tr>
            <th style={{ borderBottom: 'none', paddingTop: '0', paddingBottom: '0' }}>ID</th>
            <th style={{ borderBottom: 'none', paddingBottom: '0' }}>Name</th>
            <th colSpan={3} style={{textAlign:'center'}}>Today</th>
            </tr>
          <tr>
            <th style={{ borderTop: 'none', padding: '0' }}></th>
            <th style={{ borderTop: 'none', padding: '0' }}></th>
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
  const { dashboardTopAdvertiser } = state.dashboard;
  const { activeUser } = state.shared;

  return {dashboardTopAdvertiser, activeUser };
};

export default connect(mapStateToProps, {  fetchDashboardTopAdvertiser })(DashboardTopAdvertiser);