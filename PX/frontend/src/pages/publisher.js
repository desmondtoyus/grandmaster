import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {Accordion, Header, Message, Icon, Popup } from 'semantic-ui-react';
import { Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { capitalize } from "../functions";
import PlacementsGrid from './grids/placements.grid';
import { withRouter } from 'react-router';
import { readActivePublisher, readPublisher, resetPublishersReducer } from "../redux/actions/publisher.actions";
import { modalStateChange } from "../redux/actions/modals.actions";
import ModalManager from '../modals/modal.manager';

class Publisher extends Component {
  componentWillMount() {
    const { match } = this.props;
    if (match.params.id && !isNaN(Number(match.params.id)) && Number(match.params.id) > 0) {
      this.props.readActivePublisher(Number(match.params.id));
    }
  }

  componentWillUnmount() {
    this.props.resetPublishersReducer();
  }

  updateCallback = () => {
    this.props.readActivePublisher(Number(this.props.match.params.id));
  };

  editPublisher = event => {
    event.stopPropagation();
    const { activePublisher } = this.props;
    this.props.readPublisher(activePublisher.id);
    this.props.modalStateChange({ prop: 'modalStatus', value: 'edit' });
    this.props.modalStateChange({ prop: 'showPublisher', value: true });
  };

  render() {
    const { match, activePublisher } = this.props;

    if (!match.params.id || isNaN(Number(match.params.id)) || Number(match.params.id) <= 0) {
      return (
        <div className={'sub-content'}>
          <Message negative size="massive">You selected an invalid publisher. Please <Link to="/ui/publishers">click here</Link> to go back to the publishers page.</Message>
        </div>
      )
    }

    if (!activePublisher) {
      return <div></div>;
    }

    const { header, divStyle, cursorStyle } = styles;

    return (
      <div className={'sub-content'}>
        <ModalManager currentModal={'PUBLISHER'} update={this.updateCallback} />
         <Breadcrumb tag="nav">
          <BreadcrumbItem ><Link to={`/ui/home`} className='link-a'>Home</Link></BreadcrumbItem>
          <BreadcrumbItem active tag="span" > <Link to={`/ui/publishers`} >Publishers</Link></BreadcrumbItem>
          <BreadcrumbItem ><Link to={`/ui/placements`} className='link-a'>Placements</Link></BreadcrumbItem>
        </Breadcrumb>


        <div style={divStyle}>
          <Accordion fluid styled >
            <Accordion.Title className={'bwa-accordion-title'}>
              <Icon name={'dropdown'} />
              {`${activePublisher.name} / ID: ${activePublisher.id} - Status: ${capitalize(activePublisher.status)}`}
              {' '}
              <Popup trigger={<Icon style={cursorStyle} name="edit" onClick={this.editPublisher} />} size='mini' content="Edit Publisher" />
            </Accordion.Title>
            <Accordion.Content className={'bwa-accordion-content'}>
              <Header as="h5">Notes: <Header.Subheader style={header}>{activePublisher.notes !== "" ? activePublisher.notes : "None"}</Header.Subheader></Header>
            </Accordion.Content>
          </Accordion>
        </div>
        <PlacementsGrid />
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
  const { activePublisher } = state.publishers;

  return { activePublisher };
};

export default withRouter(connect(mapStateToProps, { readActivePublisher, readPublisher, modalStateChange, resetPublishersReducer })(Publisher));