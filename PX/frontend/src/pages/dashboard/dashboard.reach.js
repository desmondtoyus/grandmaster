import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDashboardReach } from '../../redux/actions/dashboard.actions';
import Paginator from '../../components/paginator';
import Panel from '../../components/Panel';
import Table from '../../components/table/Table';
import { Progress } from 'reactstrap';

import countriesList from '../../countries.js'



class DashboardReach extends Component {
  componentWillMount() {
    const { activeUser } = this.props;
    const payload = {
      zone_id: activeUser.scope_account.zone.id,
      timezone: activeUser.user.timezone
    };
    this.props.fetchDashboardReach(payload);
  }

   renderCountries =()=> this.props.reach.map((item, index) => {
    let rate = (Number((item.value * 100)) / Number(item.totalImp)).toFixed(2);
    if(index < 5){
    return (<tr key={index}>
      <td><img className='dashboard__table-flag' src={`/flags/${item.code.toLowerCase()}.svg`} alt='flag' />{countriesList[item.code]}</td>
      <td>{item.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
      <td>
        <div className='progress-wrap progress-wrap--blue'>
          <Progress value={rate}>{`${rate}%`}</Progress>
        </div>
      </td>
    </tr>)
    }
  })
  render() {
    const { reach } = this.props;

  

    if (!reach) {
      return <div></div>;
    }
    return (



      <Panel md={4} title='Opportunities By Country' style={{ paddingBottom: '0px'}}>
        <Table responsive className='table--bordered dashboard__audience-table'>
          <thead>
            <tr>
              <th>Country</th>
              <th>Opportunities</th>
              <th>Rate %</th>
            </tr>
          </thead>
          <tbody>
            {this.renderCountries()}
          </tbody>
        </Table>
      </Panel>
    );
  }
}


const mapStateToProps = state => {
  const { activeUser } = state.shared;
  const { reach } = state.dashboard;

  return { activeUser, reach };
};

export default connect(mapStateToProps, { fetchDashboardReach })(DashboardReach);
