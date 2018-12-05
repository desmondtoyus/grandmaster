import { connect } from 'react-redux';
import { fetchDashboardKPI } from '../../redux/actions/dashboard.actions';
import React, { Component } from 'react';
import Panel from '../../components/Panel';
import Table from '../../components/table/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown,  faExchangeAlt} from '@fortawesome/free-solid-svg-icons';


class DashboardKPI extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      daily: true
    };
  }

  componentWillMount() {
    const { activeUser } = this.props;
    const payload = {
      zone_id: activeUser.scope_account.zone.id,
      timezone: activeUser.user.timezone,
      'interval': "day"
    };
    this.props.fetchDashboardKPI(payload);
  }

  handleChange=()=> {
    const { activeUser } = this.props;
    let interval;
    if (!this.state.daily) {
      interval ='day'
    } else {
      interval = 'week'
    }
    const payload = {
      zone_id: activeUser.scope_account.zone.id,
      timezone: activeUser.user.timezone,
      'interval': interval
    };
    this.props.fetchDashboardKPI(payload);
    this.setState({ daily: !this.state.daily })
  };

  renderIcon = value => {
    if (Number(value) > 0) {
      return <FontAwesomeIcon icon={faArrowUp} style={{ color:'#4ce1b6'}} />;
    }
    else if (Number(value) < 0) {
      return <FontAwesomeIcon icon={faArrowDown} style={{ color: '#ff4861' }} />;
    }
    else {
      return <FontAwesomeIcon icon={faExchangeAlt} style={{ color: '#70bbfd' }} />;
    }
  };

  render() {
    const {kpi} = this.props;

    if (!kpi) {
      return (
        <div></div>
      )
    }

    return (
      <Panel md={4} title='KPI CHANGES' subhead=''>
        <label className='toggle-btn dashboard__sales-toggle'>
          <input className='toggle-btn__input' type='checkbox' name='sales' id='sales' onChange={this.handleChange}/>
          <span className='dashboard__sales-toggle-left'>Daily</span>
          <label className='toggle-btn__input-label' htmlFor='sales'>Toggle</label>
          <span className='dashboard__sales-toggle-right'> Weekly</span>
        </label>
        <Table responsive striped className='dashboard__table-orders'>
          <thead>
            <tr>
              <th> </th>
              <th colSpan={2} style={{ textAlign: 'center' }}>{this.state.daily ?'Today':'This Week'}</th>
              <th style={{ textAlign: 'right' }}>{this.state.daily ? 'Yesterday' : 'Last Week'} </th>
            </tr>
          </thead>
          <tbody>
              <tr key='1'>
                <td className='dashboard__table-orders-title'>
                  <div className='dashboard__table-orders-img-wrap'>
                    <div className='dashboard__table-orders-img'  />
                  </div>
               <b> Revenue</b>
                </td>
              <td style={{ textAlign: 'right' }}>
                {`$${kpi.current_interval_revenue} `}
               
              </td>
              <td style={{ textAlign: 'left' }}> {this.renderIcon(kpi.revenue_change)} {!isNaN((Number(kpi.current_interval_revenue) / Number(kpi.prior_interval_revenue) * 100).toFixed(2))? `${(Number(kpi.current_interval_revenue) / Number(kpi.prior_interval_revenue) * 100).toFixed(2)}%`:'0.00%'}</td>
              <td style={{ textAlign: 'right' }}>
                {kpi.prior_interval_revenue ? `$${kpi.prior_interval_revenue}`:'$0.00'}
                </td>

              </tr>

            {/* <tr key='7'>
              <td className='dashboard__table-orders-title'>
                <div className='dashboard__table-orders-img-wrap'>
                  <div className='dashboard__table-orders-img' />
                </div>
                <b>Profit</b>
              </td>
              <td style={{ textAlign: 'right' }}>
                {`$${(Number(kpi.current_interval_profit) * 100).toFixed(2)} `}

              </td>
              <td>{this.renderIcon(kpi.profit_change)}{!isNaN((Number(kpi.current_interval_profit) / Number(kpi.prior_interval_profit) * 100).toFixed(2))? `${(Number(kpi.current_interval_profit) / Number(kpi.prior_interval_profit) * 100).toFixed(2)}%`:'0.00%'}</td>
              <td style={{ textAlign: 'right' }}>
                {`$${(Number(kpi.prior_interval_profit) * 100).toFixed(2)}`}
              </td>
            </tr> */}

            <tr key='2'>
              <td className='dashboard__table-orders-title'>
                <div className='dashboard__table-orders-img-wrap'>
                  <div className='dashboard__table-orders-img' />
                </div>
                <b> OPPS </b>
                </td>
              <td style={{ textAlign: 'right' }}>
                {`${kpi.current_interval_opportunities ? kpi.current_interval_opportunities.toLocaleString():'0'}`}
                
              </td>
              <td style={{ textAlign: 'left' }}>{this.renderIcon(kpi.opportunities_change)} {!isNaN((kpi.current_interval_opportunities / kpi.prior_interval_opportunities * 100).toFixed(2))? `${(kpi.current_interval_opportunities / kpi.prior_interval_opportunities * 100).toFixed(2)}%` : '0.00%'}</td>
              <td style={{ textAlign: 'right' }}>
                {kpi.prior_interval_opportunities ? kpi.prior_interval_opportunities.toLocaleString():'0'}
                </td>
            </tr>

            <tr key='3'>
              <td className='dashboard__table-orders-title'>
                <div className='dashboard__table-orders-img-wrap'>
                  <div className='dashboard__table-orders-img' />
                </div>
               <b> IMPS</b>
                </td>
              <td style={{ textAlign: 'right' }}>
                {`${kpi.current_interval_impressions? kpi.current_interval_impressions.toLocaleString():'0'} `}
                
               
              </td>
              <td>{this.renderIcon(kpi.impressions_change)}{!isNaN((kpi.current_interval_impressions / kpi.prior_interval_impressions * 100).toFixed(2)) ? `${(kpi.current_interval_impressions / kpi.prior_interval_impressions * 100).toFixed(2)}%`:'0.00%'}</td>
              <td style={{ textAlign: 'right' }}>
                {kpi.prior_interval_impressions? kpi.prior_interval_impressions.toLocaleString():'0'}
                </td>

            </tr>


            <tr key='4'>
              <td className='dashboard__table-orders-title'>
                <div className='dashboard__table-orders-img-wrap'>
                  <div className='dashboard__table-orders-img' />
                </div>
              <b>ECPM</b>
                </td>
              <td style={{ textAlign: 'right' }}>
                {`$${(Number(kpi.current_interval_ecpm).toFixed(2))} `}
                
                
              </td>
              <td>{this.renderIcon(kpi.ecpm_change)}{!isNaN((Number(kpi.current_interval_ecpm) / Number(kpi.prior_interval_ecpm) * 100).toFixed(2)) ? `${(Number(kpi.current_interval_ecpm) / Number(kpi.prior_interval_ecpm) * 100).toFixed(2)}%`:'0.00%'}</td>
              <td style={{ textAlign: 'right' }}>
                {`$${(Number(kpi.prior_interval_ecpm).toFixed(2))}`}
                </td>

            </tr>

            <tr key='5'>
              <td className='dashboard__table-orders-title'>
                <div className='dashboard__table-orders-img-wrap'>
                  <div className='dashboard__table-orders-img' />
                </div>
                <b>Margin</b>
                </td>
              <td style={{ textAlign: 'right' }}>
                {`${(Number(kpi.current_interval_margin) * 100).toFixed(2)}% `}
                
               
              </td>
              <td>{this.renderIcon(kpi.margin_change)} {!isNaN((Number(kpi.current_interval_margin) / Number(kpi.prior_interval_margin) * 100).toFixed(2)) ? `${(Number(kpi.current_interval_margin) / Number(kpi.prior_interval_margin) * 100).toFixed(2)}%`:'0.00%'}</td>
              <td style={{ textAlign: 'right' }}>
                {`${(Number(kpi.prior_interval_margin) * 100).toFixed(2)}%`}
                </td>
            </tr>

            <tr key='6'>
              <td className='dashboard__table-orders-title'>
                <div className='dashboard__table-orders-img-wrap'>
                  <div className='dashboard__table-orders-img' />
                </div>
                <b>Fill</b>
                </td>
              <td style={{ textAlign: 'right' }}>
                {`${(Number(kpi.current_interval_fill_rate) * 100).toFixed(2)}% `}
                
              </td>
              <td>{this.renderIcon(kpi.fill_rate_change)}{!isNaN((Number(kpi.current_interval_fill_rate) / Number(kpi.prior_interval_fill_rate) * 100).toFixed(2)) ? `${(Number(kpi.current_interval_fill_rate) / Number(kpi.prior_interval_fill_rate) * 100).toFixed(2)}%`:'0.00%'}</td>
              <td style={{ textAlign: 'right' }}>
                {`${(Number(kpi.prior_interval_fill_rate) * 100).toFixed(2)}%`}
                </td>
            </tr>
        
          </tbody>
        </Table>
      </Panel>
    )
  }
}

const mapStateToProps = state => {
  const { activeUser } = state.shared;
  const { kpi } = state.dashboard;

  return { activeUser, kpi };
};

export default connect(mapStateToProps, { fetchDashboardKPI })(DashboardKPI);
