import React from 'react';
import Account from './account';
import Alerts from './alert';
import ConfirmActions from './confirm.actions';
import User from './user';
import DisplayUser from './display.user';
import CreatePublisher from './publisher';
import Integration from './integration';
import DisplayTag from './display.tag';
import Advertiser from './advertiser';
import Campaign from './campaign';
import AddDemand from './add.demand';
import AddSupply from './add.supply';
import PixelTag from './pixel.tag';

const ModalManager = props => {
  switch(props.currentModal) {
    case 'ACCOUNT':
      return <Account update={props.update}/>;
    case 'ALERT':
      return <Alerts update={props.update} />;
    case 'CONFIRM_ACTION':
      return <ConfirmActions update={props.update} />;
    case 'USER':
      return <User activeUser={props.activeUser} update={props.update} />;
    case 'DISPLAY_USER':
      return <DisplayUser />;
    case 'PUBLISHER':
      return <CreatePublisher activeUser={props.activeUser} update={props.update} />;
      case 'INTEGRATION':
      return <Integration activeUser={props.activeUser} update={props.update} />;
    case 'DISPLAY_TAG':
      return <DisplayTag update={props.update} />;
      case 'PIXEL_TAG':
      return <PixelTag update={props.update} />;
    case 'ADVERTISER':
      return <Advertiser update={props.update} />;
    case 'CAMPAIGN':
      return <Campaign update={props.update} />;
    case 'ADD_DEMAND':
      return <AddDemand update={props.update} />;
    case 'ADD_SUPPLY':
      return <AddSupply update={props.update} />;
    default:
      return null;
  }
};

export default ModalManager;
