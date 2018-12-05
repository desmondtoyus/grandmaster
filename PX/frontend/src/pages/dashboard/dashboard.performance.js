import React, { Component } from 'react';
import {Bar,LineChart, Line, ComposedChart, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { connect } from 'react-redux';
import { fetchDashboardPerformance, fetchDashboardFinancials } from '../../redux/actions/dashboard.actions';
import Panel from '../../components/Panel';


class DashboardPerformance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }
  componentWillMount() {
    const { activeUser } = this.props;
    const payload = {
      zone_id: activeUser.scope_account.zone.id,
      timezone: activeUser.user.timezone
    };
    this.props.fetchDashboardPerformance(payload);
    this.props.fetchDashboardFinancials(payload);
  }

  render() {
    const { performance, performanceImps, performanceFill, financials } = this.props;

    if (!performance && !financials) {
      const { activeUser } = this.props;
      const payload = {
        zone_id: activeUser.scope_account.zone.id,
        timezone: activeUser.user.timezone
      };
      this.props.fetchDashboardFinancials(payload);
      return (
        <div>

        </div>
      )
    }
    return (
      <Panel md={12} title='IMPRESSIONS / OPPORTUNITIES'>
        <ResponsiveContainer height={250} className='dashboard__area'>
    <ComposedChart data={this.props.performance} margin={{top: 0, right: 0, left: 10, bottom: 0}}>
                <XAxis dataKey='categories'/>
                <YAxis/>
                <CartesianGrid strokeDasharray='3 3'/>
                <Tooltip/>
                <Legend/>
                <Bar name='Opportunity' barSize={20} type='monotone' dataKey='opp' fill='#44546A' stroke='#44546A' />
                <Line name='Impression' type='monotone' dataKey='imp' stroke='#70bbfd'/>
                <Line name='Revenue' type='monotone' dataKey='rev' stroke='#4ce1b6' />
              </ComposedChart>

        </ResponsiveContainer>
      </Panel>
    )
  }
}
const mapStateToProps = state => {
  const { activeUser } = state.shared;
  const { performance, financials, performanceImps, performanceFill } = state.dashboard;

  return { activeUser, performance, financials, performanceImps, performanceFill };
};

export default connect(mapStateToProps, { fetchDashboardPerformance, fetchDashboardFinancials })(DashboardPerformance);