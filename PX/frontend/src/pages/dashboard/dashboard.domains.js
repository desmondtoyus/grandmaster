import React, { Component } from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import Panel from '../../components/Panel';
import { connect } from 'react-redux';
import { fetchDashboardDomains } from '../../redux/actions/dashboard.actions';

class DashboardDomains extends Component {
  constructor(){
    super();
    this.state={
      data:[]
    }
  }
  componentWillMount() {
    const { activeUser } = this.props;
    const payload = {
      zone_id: activeUser.scope_account.zone.id,
      timezone: activeUser.user.timezone
    };
    this.props.fetchDashboardDomains(payload);
  }


  render() {
    const { domains } = this.props;
    if (!domains) {
      return <div></div>;
    }
    return (
      <Panel  md={5} title='TOP PERFORMING DOMAINS' subhead=''>
        <ResponsiveContainer height={260}>

          <BarChart data={domains} margin={{ top: 20, left: -25 }}>
            <XAxis dataKey='name' tickLine={false} />
            <YAxis tickLine={false} />
            <Tooltip />
            <CartesianGrid vertical={false} />
            <Bar dataKey='uv' name='Fill Rate (%)' fill="#44546A" barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    )
  }
}

const mapStateToProps = state => {
  const { activeUser } = state.shared;
  const { domains } = state.dashboard;

  return { activeUser, domains };
};

export default connect(mapStateToProps, { fetchDashboardDomains })(DashboardDomains);