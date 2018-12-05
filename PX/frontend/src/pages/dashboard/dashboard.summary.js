import React, { Component } from 'react';
import Slider from 'react-slick';
import Panel from '../../components/Panel';
import { connect } from 'react-redux';
import { fetchDashboardSummary, fetchDashboardKPI  } from '../../redux/actions/dashboard.actions';
import {Icon} from 'semantic-ui-react';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  autoplay: false,
  swipeToSlide: true,
  slidesToShow: 7,
  slidesToScroll: 1,
  responsive: [
    {breakpoint: 500, settings: {slidesToShow: 1}},
    {breakpoint: 700, settings: {slidesToShow: 2}},
    {breakpoint: 900, settings: {slidesToShow: 3}},
    {breakpoint: 1150, settings: {slidesToShow: 4}},
    {breakpoint: 1300, settings: {slidesToShow: 5}},
    {breakpoint: 1500, settings: {slidesToShow: 6}},

  ]
};

class DashboardSummary extends Component {
  componentWillMount() {
    const { activeUser } = this.props;
    const payload = {
      zone_id: activeUser.scope_account.zone.id,
      timezone: activeUser.user.timezone
    };
    this.props.fetchDashboardSummary(payload);

  }



  renderIcon = value => {
    if (Number(value) > 0) {
      return <Icon name={'arrow up'} style={{ color: '#4ce1b6' }} />;
    }
    else if (Number(value) < 0) {
      return <Icon name={'arrow down'} style={{ color: '#ff4861' }}  />;
    }
    else {
      return <Icon name={'exchange'} style={{color:'#70bbfd'}} />;
    }
  };


  render() {
    const { summary} = this.props;

    if (!summary) {
      return (
        <div></div>
      )
    }
    return (
      <Panel md={12} lg={12} xl={12} sm={12} xs={12} title='Activities' height= '500px'> 
        <Slider {...settings} className='dashboard__carousel'>
          <div>
            <div className='dashboard__carousel-slide dashboard__carousel-slide dashboard__carousel-slide--pilot'>
              <p className='dashboard__carousel-title' >Opportunities</p>
              <div className='dashboard__carousel-title2' >{(summary.today_opportunities ? summary.today_opportunities.toLocaleString(): 0)}</div>
              <span> {this.renderIcon(summary.opportunities_change)} {summary.opportunities_change > 0 && summary.yesterday_opportunities > 0 ?  `${(Number(summary.opportunities_change) / Number(summary.yesterday_opportunities) * 100).toFixed(2)}%`:'N/A'}</span>
            </div>
          </div>
          <div>
            <div className='dashboard__carousel-slide dashboard__carousel-slide--pilot'>
              <p className='dashboard__carousel-title' >Impressions</p>
              <div className='dashboard__carousel-title2' >{(summary.today_impressions ? summary.today_impressions.toLocaleString():0)}</div>
              <span> {this.renderIcon(summary.impressions_change)} {summary.impressions_change > 0 && summary.yesterday_impressions > 0 ?  `${(Number(summary.impressions_change) / Number(summary.yesterday_impressions) * 100).toFixed(2)}%`:'N/A'}</span>
            </div>
          </div>
          <div>
            <div className='dashboard__carousel-slide dashboard__carousel-slide--pilot'>
              <p className='dashboard__carousel-title' >Fill Rate</p>
              <div className='dashboard__carousel-title2' >{`${(Number(summary.today_fill_rate) * 100).toFixed(2)}%`}</div>
              <span> {this.renderIcon(summary.fill_rate_change)} {summary.fill_rate_change > 0 && summary.yesterday_fill_rate > 0 ?  `${(Number(summary.fill_rate_change) / Number(summary.yesterday_fill_rate) * 100).toFixed(2)}%`:'N/A'}</span>

            </div>
          </div>

          <div>
            <div className='dashboard__carousel-slide dashboard__carousel-slide--pilot'>
              <p className='dashboard__carousel-title' >Profit margin</p>
              <div className='dashboard__carousel-title2' >{`$${Number(summary.today_margin).toFixed(2)}`}</div>
            <span> {this.renderIcon(summary.margin_change)} {summary.margin_change > 0 && summary.yesterday_margin > 0 ?  `${(Number(summary.margin_change) / Number(summary.yesterday_margin) * 100).toFixed(2)}%`:'N/A'}</span>
            </div>
          </div>
        
        <div>
            <div className='dashboard__carousel-slide dashboard__carousel-slide--pilot'>
              <p className='dashboard__carousel-title' >Payout</p>
              <div className='dashboard__carousel-title2' >{`$${Number(summary.today_payout).toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</div>
              <span> {this.renderIcon(summary.payout_change)} {summary.payout_change > 0 && summary.yesterday_payout > 0 ?  `${(Number(summary.payout_change) / Number(summary.yesterday_payout) * 100).toFixed(2)}%`:'N/A'}</span>
            </div>
          </div>

          <div>
            <div className='dashboard__carousel-slide dashboard__carousel-slide--pilot'>
              <p className='dashboard__carousel-title' >ECPM</p>
              <div className='dashboard__carousel-title2' >{`$${Number(summary.today_ecpm).toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</div>
              <span> {this.renderIcon(summary.ecpm_change)} {summary.ecpm_change > 0 && summary.yesterday_ecpm > 0 ?  `${(Number(summary.ecpm_change) / Number(summary.yesterday_ecpm) * 100).toFixed(2)}%`:'N/A'}</span>
            </div>
          </div>


          <div>
            <div className='dashboard__carousel-slide dashboard__carousel-slide--pilot'>
              <p className='dashboard__carousel-title' >Revenue</p>
              <div className='dashboard__carousel-title2' >{`$${Number(summary.today_revenue).toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</div>
              <span> {this.renderIcon(summary.revenue_change)} {summary.revenue_change > 0 && summary.yesterday_revenue > 0 ?  `${(Number(summary.revenue_change) / Number(summary.yesterday_revenue) * 100).toFixed(2)}%`:'N/A'}</span>
            </div>
          </div>
          
        </Slider>
        <br/>
        <br/>
      </Panel>
    )
  }
}
const mapStateToProps = state => {
  const { activeUser } = state.shared;
  const { summary} = state.dashboard;

  return { activeUser, summary};
};

export default connect(mapStateToProps, { fetchDashboardSummary, fetchDashboardKPI})(DashboardSummary);