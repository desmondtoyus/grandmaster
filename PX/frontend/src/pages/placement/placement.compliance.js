import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Form, Checkbox } from 'semantic-ui-react';
import { changePlacement, listPlacementDomainLists, getCurrentDomain } from "../../redux/actions/placement.actions";
import classNames from 'classnames';


class PlacementCompliance extends Component {
  state = {
    err: null
  }

  // componentDidMount(){
  //   this.props.getCurrentDomain(this.props.listId);
  //   this.props.listPlacementDomainLists(this.props.domain_type);
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.listId !== this.props.listId) {
      this.props.getCurrentDomain(this.props.listId);
      setTimeout(() => {
        this.props.listPlacementDomainLists(this.props.domain_type);
      }, 1000);
    }
    if (prevProps.domain_type !== this.props.domain_type && this.props.domain_type) {
      this.setState({ err: null })
      this.props.listPlacementDomainLists(this.props.domain_type);
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.channel !== this.props.channel) {
      let aList = false;
      nextProps.list_option.map((item, index)=>{
        if (item.value == nextProps.domain_type) {
          aList = true;
        }
      })
      if (!aList) {
        this.props.changePlacement({ prop: 'domain_type', value: nextProps.list_option[0] ? nextProps.list_option[0].value:0});
      }
    }
  }



  handleSelect = (event, data) => {
    this.props.changePlacement({ prop: data.name, value: data.value });
  };

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
    this.props.changePlacement({ prop: 'listCategory', value: 'whitelist' })
  }
  handleCheckbox = (event, data) => {
    this.props.changePlacement({ prop: data.name, value: !data.checked });
  };

  handleBlackList = () => {
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
    this.props.changePlacement({ prop: 'listCategory', value: 'blacklist' })
  }
  handleCheckbox = (event, data) => {
    this.props.changePlacement({ prop: data.name, value: !data.checked });
  };

  render() {
    const { forensiq, listCategory, listId, placementDomainLists, domain_type, list_option } = this.props;
    const { checkboxStyle } = styles;

    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              <h5>Brand Safety</h5>
              <Form size="tiny">
                <Form.Checkbox label="White Ops" onClick={this.handleCheckbox} name="forensiq" checked={forensiq} />
              </Form>
              {this.state.err && <h5 style={{ color: 'red' }}> {this.state.err}</h5>}
              <h5> <Form.Select className={classNames("bwa-select-label2", { "bwa-floated": true })} label="List Type" options={list_option} value={domain_type} onChange={this.handleSelect} name="domain_type" /></h5>
              <Form size={'tiny'}>
                <Checkbox style={checkboxStyle} label={'None'} checked={listCategory === "none"} onClick={() => this.props.changePlacement({ prop: 'listCategory', value: 'none' })} />
                <Checkbox style={checkboxStyle} label={'White List'} checked={listCategory === "whitelist"} onClick={this.handleWhiteList} />
                <Checkbox style={checkboxStyle} label={'Black List'} checked={listCategory === "blacklist"} onClick={this.handleBlackList} />
                {listCategory !== "none" ? <Form.Select search className={classNames("bwa-select-label2", { 'bwa-floated': listId })} label= "List" options={placementDomainLists} value={listId} onChange={(e, d) => this.props.changePlacement({ prop: 'listId', value: d.value })} /> : null}
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

const styles = {
  checkboxStyle: {
    paddingTop: "7px",
    marginRight: "12px",
    marginBottom: '10px'
  }
};

export const mapStateToProps = state => {
  const { forensiq, listCategory, listId, placementDomainLists, domain_type, list_option, channel } = state.placement;

  return { forensiq, listCategory, listId, placementDomainLists, domain_type, list_option, channel };
};

export default connect(mapStateToProps, { changePlacement, listPlacementDomainLists, getCurrentDomain })(PlacementCompliance);