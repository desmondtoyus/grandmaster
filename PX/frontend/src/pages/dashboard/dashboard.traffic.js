import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDashboardTraffic } from '../../redux/actions/dashboard.actions';
import Panel from '../../components/Panel';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const style = {
  left: 0,
  width: 150,
  lineHeight: '24px'
};

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <ul className='dashboard__chart-legend'>
      {
        payload.map((entry, index) => (
          <li key={`item-${index}`}><span style={{ backgroundColor: entry.color }} />{entry.value}</li>
        ))
      }
    </ul>
  );
};

class DashboardTraffic extends Component {

  componentWillMount() {
    const { activeUser } = this.props;
    const payload = {
      zone_id: activeUser.scope_account.zone.id,
      timezone: activeUser.user.timezone
    };
    this.props.fetchDashboardTraffic(payload);
  }

  render() {
    const { traffic } = this.props;

    if (!traffic) {
      return <div></div>;
    }
    return (
      <Panel md={3} title='Traffic Channels'>
        <div className='dashboard__visitors-chart'>
                  <ResponsiveContainer className='dashboard__chart-pie' width='100%' height={220}>
            <PieChart className='dashboard__chart-pie-container'>
              <Tooltip />
              <Pie data={this.props.traffic.data} dataKey='value' cy={110} innerRadius={70} outerRadius={100} />
              <Legend layout='vertical' verticalAlign='bottom' wrapperStyle={style} content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
          <br/>
          <p className='dashboard__visitors-chart-title center' style={{fontSize: '14px', fontWeight: 'bold', marginLeft:'40%', marginRight:'auto', marginBottom:0 }}>Total traffic</p>
          <p className='dashboard__visitors-chart-number center' style={{ fontSize: '18px', fontWeight: 'bold', marginLeft:'40%', marginRight:'auto' }}>{this.props.traffic.total ? this.props.traffic.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):'0'}</p>

        </div>
      </Panel>
    )
  }
}

const mapStateToProps = state => {
  const { activeUser } = state.shared;
  const { traffic } = state.dashboard;

  return { activeUser, traffic };
};

export default connect(mapStateToProps, { fetchDashboardTraffic })(DashboardTraffic);
