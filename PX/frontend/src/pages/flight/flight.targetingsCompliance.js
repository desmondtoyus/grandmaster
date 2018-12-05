import React, { Component } from 'react';
import { Form, Grid, Icon, Button, Checkbox } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { listFlightDomainLists } from '../../redux/actions/lists.actions';
import { changeFlight } from "../../redux/actions/flight.actions";
import { getCurrentDomain } from "../../redux/actions/placement.actions";
import classNames from 'classnames';




class FlightCompliance extends Component {
  state = {
    err: null,
    showDomainList:false
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listId !== this.props.listId) {
      this.props.getCurrentDomain(this.props.listId);
      setTimeout(() => {
        this.props.listFlightDomainLists(this.props.domain_type);
      }, 1000);
    }
    if (prevProps.domain_type !== this.props.domain_type) {
      this.setState({ err: null })
      this.props.listFlightDomainLists(this.props.domain_type);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.channel !== this.props.channel) {
      let aList = false;
      nextProps.list_option.map((item, index) => {
        if (item.value == nextProps.domain_type) {
          aList = true;
        }
      })
      if (!aList) {
        this.props.changeFlight({ prop: 'domain_type', value: nextProps.list_option[0].value });
      }
    }
  }

  
  

  handleWhiteList = () => {
    this.setState({ err: null });
    let msg = '';
    if (!this.props.domain_type) {

      if (this.props.channel == '') {
        msg = 'You will need to select a channel first.'
      }
      this.setState({ err: `Select a list type.  ${msg}` });
      return;
    }
    this.setState({ err: null });
    this.props.changeFlight({ prop: 'listCategory', value: 'whitelist' })
  }
  handleCheckbox = (event, data) => {
    // console.log(data.name);
    this.props.changeFlight({ prop: data.name, value: !data.checked });
  };

  handleBlackList = () => {
    this.setState({ err: null });
    let msg = '';
    if (!this.props.domain_type) {

      if (this.props.channel == "") {
        msg = 'You will need to select a channel first.'
      }
      this.setState({ err: `Select a list type.  ${msg}` });
      return;
    }
    this.setState({ err: null });
    this.props.changeFlight({ prop: 'listCategory', value: 'blacklist' })
  }

  handleCheckbox = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: !data.checked });
  };

  handleSelect = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: data.value });
  };
  showDomainList = ()=>{
    this.setState({showDomainList:!this.state.showDomainList})
  }

  render() {
    const { domainLists, forensiq, listCategory, listId, domain_type, list_option } = this.props;
const {padStyle} = styles;
    return (
      <div style={{marginLeft:"17px"}}>  
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              <Form size="tiny">
                <Form.Checkbox label="Brand Safety (White Ops)" onClick={this.handleCheckbox} name="forensiq" checked={forensiq} />
              </Form>
              {this.state.err && <h5 style={{color:'red'}}> {this.state.err}</h5>}
              <Checkbox style={styles.checkboxStyle} label={'List Type'} onClick={this.showDomainList} checked={listCategory === "whitelist" || listCategory === "blacklist" }/>
              {this.state.showDomainList || listCategory === "whitelist" || listCategory === "blacklist" ?<div> <h5> <Form.Select className={classNames("bwa-select-label2", { "bwa-floated": true })} label="List Type" options={list_option} value={domain_type} onChange={this.handleSelect} name="domain_type" /></h5>
              <Form size={'tiny'}>
                <Checkbox style={styles.checkboxStyle} label={'None'} checked={listCategory === "none"} onClick={() => this.props.changeFlight({ prop: 'listCategory', value: 'none' })} />
                <Checkbox style={styles.checkboxStyle} label={'White List'} checked={listCategory === "whitelist"} onClick={this.handleWhiteList} />
                <Checkbox style={styles.checkboxStyle} label={'Black List'} checked={listCategory === "blacklist"} onClick={this.handleBlackList} />
                { listCategory !== "none" ? <Form.Select name={'listId'} search className={classNames("bwa-select-label2", {'bwa-floated': listId})} label="List" options={domainLists} value={listId} onChange={this.handleSelect} /> : null }
              </Form>  </div>:null}
            </Grid.Column>
          </Grid.Row>
        </Grid>          
      </div>
    )
  }
}

const styles = {

  padStyle: {
    paddingBottom: "0"
  },
  checkboxStyle: {
    paddingTop: "7px",
    marginRight: "12px",
    marginBottom: '10px'
  }
};

const mapStateToProps = state => {
  const { domainLists } = state.lists;
  const { forensiq, listCategory, listId, domain_type, list_option, channel, dayParting  } = state.flight;

  return { domainLists, forensiq, listCategory, listId, domain_type, list_option, channel, dayParting  };
};

export default connect(mapStateToProps, { listFlightDomainLists, changeFlight, getCurrentDomain })(FlightCompliance);
