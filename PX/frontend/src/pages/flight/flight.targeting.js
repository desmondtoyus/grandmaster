import React, { Component } from 'react';
import { Grid, Icon, Segment, Select, Checkbox, Accordion, Table, Input} from 'semantic-ui-react';
import { TAXONOMY } from '../../vars';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { changeFlight } from "../../redux/actions/flight.actions";

const isSkippableOption =[
  { text: "None", value: "none" },
  { text: "5 Seconds", value: "5 Seconds" },
  { text: "15 Seconds", value: "15 Seconds" }
]

class FlightTargeting extends Component {
  state={
    showMore:false,
    showSkipppable:false
  }

  handleRetarget=(event, data)=>{
event.preventDefault();
this.props.changeFlight({ prop: 'isRetargeted', value: !this.props.isRetargeted });
  }
  handleSelect = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: data.value });
  };

  handleShowMore =(event)=>{
    event.preventDefault();
    this.setState({showMore: !this.state.showMore})
  }
  handleCheckbox = (type, event, data) => {
    let arr = [...this.props[type]];
    const index = arr.indexOf(data.name);
    if (index === -1) {
      arr.push(data.name);
    }
    else {
      arr.splice(index, 1);
    }
    this.props.changeFlight({ prop: type, value: arr });
  };

  handleActive = (index, event) => {
    let iab = [...this.props.searchIAB];
    iab[index].active = !iab[index].active;
    this.props.changeFlight({ prop: 'searchIAB', value: iab });
  };

  handleChange = (event, data) => {
    event.preventDefault();
    this.props.changeFlight({ prop: data.name, value: data.value });
  };

  renderList = () => {
    const { checkStyle, accStyle, contentStyle } = styles;
    const { searchIAB, iabCategories } = this.props;

    return searchIAB.map((item, index) => {
      return (
        <Accordion styled key={index} style={accStyle}>
          <Accordion.Title active={item.active} onClick={this.handleActive.bind(this, index)}>
            <Checkbox label="" style={checkStyle} onClick={this.handleTaxonomy.bind(null, item.main.name, item.main.code)} checked={iabCategories.includes(item.main.code)} />
            <Icon name="dropdown" />
            {item.main.name}
          </Accordion.Title>
          <Accordion.Content style={contentStyle} active={item.active}>
            {this.renderSubList(item)}
          </Accordion.Content>
        </Accordion>
      )
    })
  };

  renderSubList = (item) => {
    const { listStyle } = styles;
    const { iabCategories } = this.props;

    return item.subs.map((sub, index) => {
      return (
        <Checkbox key={index} label={sub.name} style={listStyle} onClick={this.handleTaxonomy.bind(null, sub.name, sub.code)} checked={iabCategories.includes(sub.code)} />
      )
    })
  };

  renderSelected = () => {
    const { checkboxStyle, rightStyle } = styles;
    const { selectedIAB } = this.props;

    return selectedIAB.map((item, index) => {
      return (
        <Table.Row key={index}>
          <Table.Cell verticalAlign='top' style={rightStyle}>
            <Checkbox checked style={checkboxStyle} label={item.name} onClick={this.handleTaxonomy.bind(null, item.name, item.code)} />
          </Table.Cell>
        </Table.Row>
      )
    })
  };

  handleTaxonomy = (name, code, event, data) => {
    let iab = [...this.props.iabCategories];
    let selected = [...this.props.selectedIAB];
    const index = iab.indexOf(code);
    if (index === -1 && iab.length < 3) {
      iab.push(code);
      selected.push({ name, code });
    }
    else if (index !== -1) {
      iab.splice(index, 1);
      selected.splice(index, 1);
    }
    this.props.changeFlight({ prop: 'iabCategories', value: iab });
    this.props.changeFlight({ prop: 'selectedIAB', value: selected });
  };

  handleSearch = (event) => {
    if (event.target.value !== "") {
      let foundIAB = [];
      let str = new RegExp(event.target.value, "gi");
      for (let i = 0; i < TAXONOMY.length; i++) {
        if (TAXONOMY[i].main.name.match(str)) {
          let subs = [];
          for (let j = 0; j < TAXONOMY[i].subs.length; j++) {
            if (TAXONOMY[i].subs[j].name.match(str)) {
              subs.push(TAXONOMY[i].subs[j]);
            }
          }
          foundIAB.push({
            main: TAXONOMY[i].main,
            subs: subs,
            active: true
          })
        }
        else {
          let subs = [];
          for (let j = 0; j < TAXONOMY[i].subs.length; j++) {
            if (TAXONOMY[i].subs[j].name.match(str)) {
              subs.push(TAXONOMY[i].subs[j]);
            }
          }
          if (subs.length) {
            foundIAB.push({
              main: TAXONOMY[i].main,
              subs: subs,
              active: true
            })
          }
        }
      }
      this.props.changeFlight({ prop: 'searchIAB', value: foundIAB });
    }
    else {
      this.props.changeFlight({ prop: 'searchIAB', value: TAXONOMY });
    }
  };

  handleIsSkippable =()=>{
  this.setState({showSkipppable:!this.state.showSkipppable})
  }

  render() {
    const { segmentStyle, padStyle, renderCheckboxStyle } = styles;
    const { selectedIAB, isRetargeted, is_skippable, error_is_skippable, party} = this.props;

    return (
      <div className='form'>
      <div className='form__inside'>
      <Checkbox  label=" Pixel" checked={isRetargeted} onClick={this.handleRetarget} name="isRetargeted" />
<br/>
 <Checkbox  label="Additional Targeting" checked={this.state.showMore} onClick={this.handleShowMore} name="showMore" />
 <br/>
<Checkbox  label=" Skippable" checked={ is_skippable !== 'none'||this.state.showSkipppable} onClick={this.handleIsSkippable} name="isRetargeted" />
{this.state.showSkipppable ||is_skippable !== 'none'?
<form className='form'>
<div className='form__three'>
  <div className='float-container'>
    <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Skip Duration </label>
    <Select fluid className="bwa-select-label2 bwa-floated" label="Skip Duration" options={isSkippableOption} name="is_skippable" placeholder="Skip Duration" value={is_skippable} onChange={this.handleChange} error={error_is_skippable} />
  </div>
</div>
</form>
:null }
{this.state.showMore ? <div style={{marginLeft:"12px"}}>
 <Grid>
          <Grid.Row style={padStyle}>
            <Grid.Column width={8}>
                <Input  type="text" fluid placeholder="Start Typing" onChange={this.handleSearch} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <Segment style={segmentStyle}>
                {this.renderList()}
              </Segment>
            </Grid.Column>
            <Grid.Column width={8}>
              <Segment style={segmentStyle}>
                { selectedIAB.length ? <Table compact='very'>
                  <Table.Body>
                    {this.renderSelected()}
                  </Table.Body>
                </Table> : null }
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>:null}
      <br/>
    </div>
      </div>
    )
  }
}

const styles = {
  checkStyle: {
    paddingTop: "2px"
  },
  accStyle: {
    marginTop: "1px"
  },
  contentStyle: {
    paddingBottom: "10px",
    paddingLeft: "20px"
  },
  listStyle: {
    display: "block",
    marginLeft: "7px",
    marginBottom: "3px"
  },
  checkboxStyle: {
    paddingTop: "7px"
  },
  rightStyle: {
    paddingRight: "0"
  },
  segmentStyle: {
    overflowY: "scroll",
    height: "300px"
  },
  padStyle: {
    paddingBottom: "0"
  },
  renderCheckboxStyle: {
    paddingTop: "7px",
    marginRight: "6px",
    marginLeft: "13px"
  }
};

const mapStateToProps = state => {
  const {  selectedIAB, channel, userAgent, browser, searchIAB, iabCategories, isRetargeted, is_skippable, error_is_skippable, party} = state.flight;

  return {selectedIAB, channel, userAgent, browser, searchIAB, iabCategories, isRetargeted, is_skippable, error_is_skippable, party};
};

export default connect(mapStateToProps, { changeFlight })(FlightTargeting);
