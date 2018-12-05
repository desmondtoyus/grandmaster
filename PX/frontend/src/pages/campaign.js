import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Accordion, Header, Message, Icon, Popup } from 'semantic-ui-react';
import { Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { capitalize } from "../functions";
import FlightsGrid from './grids/flights.grid';
import { withRouter } from 'react-router';
import { readActiveCampaign, readCampaign, resetCampaignsReducer } from "../redux/actions/campaign.actions";
import { modalStateChange } from "../redux/actions/modals.actions";
import ModalManager from '../modals/modal.manager';
import moment from 'moment-timezone';

class Campaign extends Component {
  componentWillMount() {
    const { match } = this.props;
    if (match.params.id && !isNaN(Number(match.params.id)) && Number(match.params.id) > 0) {
      this.props.readActiveCampaign(Number(match.params.id));
    }
  }

  componentWillUnmount() {
    this.props.resetCampaignsReducer();
  }

  updateCallback = () => {
    this.props.readActiveCampaign(Number(this.props.match.params.id));
  };

  editCampaign = event => {
    event.stopPropagation();
    const { activeCampaign } = this.props;
    this.props.readCampaign(activeCampaign.id);
    this.props.modalStateChange({ prop: 'modalStatus', value: 'edit' });
    this.props.modalStateChange({ prop: 'showCampaign', value: true });
  };

  getTime = time => {
    const { timezone } = this.props.activeUser.user;

    let tz = 'UTC';
    switch(timezone) {
      case 'US/Pacific':
        tz = 'America/Los_Angeles';
        break;
      case 'US/Eastern':
        tz = 'America/New_York';
        break;
    }

    return moment(moment.unix(time)).tz(tz).format('MM-DD-YY hh:mma z')
  };

  render() {
    const { match, activeCampaign } = this.props;

    if (!match.params.id || isNaN(Number(match.params.id)) || Number(match.params.id) <= 0) {
      return (
        <div className={'sub-content'}>
          <Alert negative size="massive">You selected an invalid campaign. Please <Link to="/ui/campaigns">click here</Link> to go back to the campaigns page.</Alert>
        </div>
      )
    }

    if (!activeCampaign) {
      return <div></div>;
    }

    const { header, divStyle, cursorStyle } = styles;

    return (
      <div className={'sub-content'}>
        <ModalManager currentModal={'CAMPAIGN'} update={this.updateCallback} />
        <Breadcrumb tag="nav">
          <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
          <BreadcrumbItem > <Link to={`/ui/advertisers`} className='link-a'>Advertisers</Link></BreadcrumbItem>
          <BreadcrumbItem ><Link to={`/ui/campaigns`} className='link-a'>Campaigns</Link></BreadcrumbItem>
          <BreadcrumbItem ><Link to={`/ui/flights`} className='link-a'>Flights</Link></BreadcrumbItem>
        </Breadcrumb>

        <div style={divStyle}>
          <Accordion fluid styled >
            <Accordion.Title className={'bwa-accordion-title'}>
              <Icon name={'dropdown'} />
              {`${activeCampaign.name} / ID: ${activeCampaign.id} - Status: ${capitalize(activeCampaign.status)}`}
              {' '}
              <Popup trigger={<Icon style={cursorStyle} name="edit" onClick={this.editCampaign} />} size='mini' content="Edit Campaign" />
            </Accordion.Title>
            <Accordion.Content className={'bwa-accordion-content'}>
              <Header as="h5">Advertiser: <Header.Subheader style={header}>{activeCampaign.advertiser.name}</Header.Subheader></Header>
              <Header as="h5">Notes: <Header.Subheader style={header}>{activeCampaign.notes.length ? activeCampaign.notes: 'None'}</Header.Subheader></Header>
              <Header as="h5">Campaign Start: <Header.Subheader style={header}>{this.getTime(activeCampaign.start_time)}</Header.Subheader></Header>
              <Header as="h5">Campaign End: <Header.Subheader style={header}>{this.getTime(activeCampaign.end_time)}</Header.Subheader></Header>
              <Header as="h5">Daily Impression Goal: <Header.Subheader style={header}>{activeCampaign.dayImpressionGoal ? activeCampaign.dayImpressionGoal : 'None'}</Header.Subheader></Header>
              <Header as="h5">Total Impression Goal: <Header.Subheader style={header}>{activeCampaign.totalImpressionGoal ? activeCampaign.totalImpressionGoal : 'None'}</Header.Subheader></Header>
            </Accordion.Content>
          </Accordion>
        </div>
        <FlightsGrid />
      </div>
    )
  }
}

const styles = {
  header: {
    display: "inline-block",
    fontSize: "0.9em"
  },
  divStyle: {
    marginTop: 10
  },
  cursorStyle: {
    cursor: 'pointer'
  }
};

const mapStateToProps = state => {
  const { activeCampaign } = state.campaigns;
  const { activeUser } = state.shared;

  return { activeCampaign, activeUser };
};

export default withRouter(connect(mapStateToProps, { readActiveCampaign, readCampaign, modalStateChange, resetCampaignsReducer })(Campaign));