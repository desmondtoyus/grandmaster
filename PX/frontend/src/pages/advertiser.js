import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Accordion, Header, Icon, Popup } from 'semantic-ui-react';
import { Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { capitalize } from "../functions";
import CampaignsGrid from './grids/campaigns.grid';
import { withRouter } from 'react-router';
import { readActiveAdvertiser, readAdvertiser, resetAdvertisersReducer } from "../redux/actions/advertiser.actions";
import { modalStateChange } from "../redux/actions/modals.actions";
import ModalManager from '../modals/modal.manager';

class Advertiser extends Component {
  componentWillMount() {
    const { match } = this.props;
    if (match.params.id && !isNaN(Number(match.params.id)) && Number(match.params.id) > 0) {
      this.props.readActiveAdvertiser(Number(match.params.id));
    }
  }

  componentWillUnmount() {
    this.props.resetAdvertisersReducer();
  }

  updateCallback = () => {
    this.props.readActiveAdvertiser(Number(this.props.match.params.id));
  };

  editAdvertiser = event => {
    event.stopPropagation();
    const { activeAdvertiser } = this.props;
    this.props.readAdvertiser(activeAdvertiser.id);
    this.props.modalStateChange({ prop: 'modalStatus', value: 'edit' });
    this.props.modalStateChange({ prop: 'showAdvertiser', value: true });
  };

  render() {
    const { match, activeAdvertiser } = this.props;

    if (!match.params.id || isNaN(Number(match.params.id)) || Number(match.params.id) <= 0) {
      return (
        <div className={'sub-content'}>
          <Alert color='info'>You selected an invalid advertiser. Please <Link to="/ui/advertisers">click here</Link> to go back to the advertisers page.</Alert>
        </div>
      )
    }

    if (!activeAdvertiser) {
      return <div></div>;
    }

    const { header, divStyle, cursorStyle } = styles;

    return (
      <div className={'sub-content'}>
        <ModalManager currentModal={'ADVERTISER'} update={this.updateCallback} />
         <Breadcrumb tag="nav">
          <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
          <BreadcrumbItem  > <Link to={`/ui/advertisers`} className='link-a'>Advertiser</Link></BreadcrumbItem>
          <BreadcrumbItem ><Link to={`/ui/campaigns`} className='link-a'>Campaigns</Link></BreadcrumbItem>
          <BreadcrumbItem ><Link to={`/ui/flights`} className='link-a'>Flights</Link></BreadcrumbItem>
        </Breadcrumb>


        <div style={divStyle}>
          <Accordion fluid styled >
            <Accordion.Title className={'bwa-accordion-title'}>
              <Icon name={'dropdown'} />
              {`${activeAdvertiser.name} / ID: ${activeAdvertiser.id} - Status: ${capitalize(activeAdvertiser.status)}`}
              {' '}
              <Popup trigger={<Icon style={cursorStyle} name="edit" onClick={this.editAdvertiser} />} size='mini' content="Edit Advertiser" />
            </Accordion.Title>
            <Accordion.Content className={'bwa-accordion-content'}>
              <Header as="h5">Notes: <Header.Subheader style={header}>{activeAdvertiser.notes !== "" ? activeAdvertiser.notes : "None"}</Header.Subheader></Header>
            </Accordion.Content>
          </Accordion>
        </div>
        <CampaignsGrid />
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
  const { activeAdvertiser } = state.advertisers;

  return { activeAdvertiser };
};

export default withRouter(connect(mapStateToProps, { readActiveAdvertiser, readAdvertiser, modalStateChange, resetAdvertisersReducer })(Advertiser));