import React, { Component } from 'react';
import { Select, Input, Checkbox } from 'semantic-ui-react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { changeFlight } from "../../redux/actions/flight.actions";

const pacings = [
  { text: "ASAP", value: "asap" },
  { text: "Even", value: "even" }
];

const goalType = [
  { text: "Impressions", value: "impression" },
  { text: "Budget", value: "budget" }
];

class FlightGoals extends Component {
  addDecimals = (event) => {
    this.props.changeFlight({ prop: event.target.name, value: Number(event.target.value).toFixed(2) });
  };

  toggleGoals = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: !data.checked });
  };

  handleChange = (event) => {
    this.props.changeFlight({ prop: event.target.name, value: event.target.value });
  };

  handleSelect = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: data.value });
  };

  render() {
    const { cpm, errorCPM, cpc, errorCPC, goalsErrors, pacing, errorPacing, cap, errorCap, dayInclude, dayGoal, errorDayGoal, capsErrors, dayGoalType, totalInclude, totalGoal, errorTotalGoal, totalGoalType, errorDayGoalType, errorTotalGoalType } = this.props;

    return (
  
        <div>
          <div className='form__inside' >
          <div className='form__inside_flex2'>
            <div className='form__dhalf2' >
              <div style={{marginTop:'20px'}}>
                <Checkbox label="Daily Goal" onClick={this.toggleGoals} name="dayInclude" checked={dayInclude} />
              </div>
            </div>

            {dayInclude ? 
               <div className='form__dhalf' ><div className='float-container'>
                {dayGoal ? <label style={{ marginTop: '0' }}  className={classNames('bwa-floating-label', { 'bwa-floated': dayGoal })} >Value</label> : <div style={{ marginTop: '8px' }}></div>}
                <Input fluid placeholder="Value" type="text" name="dayGoal" value={dayGoal} onChange={this.handleChange} error={errorDayGoal} />
              </div> </div> : null}
              {dayInclude ? 
                <div className='form__dhalf' style={{marginLeft:'5px'}}>
                 <div className='float-container'>
                 {dayGoalType ? <label style={{ marginTop: '0', marginLeft:'2px' }} className={classNames('bwa-select-label', { 'bwa-floated': dayGoalType })} >Goal Type</label> : <div style={{ marginTop: '8px' }}></div>}
                 <Select fluid placeholder="Goal Type" value={dayGoalType ? dayGoalType : ''}  options={goalType} name="dayGoalType" onChange={this.handleSelect} error={errorDayGoalType}/>
                </div> </div> : null}
          </div>
          </div>
          <div className='form__inside' >
          <div className='form__inside_flex2'>
            <div className='form__dhalf2' >
              <div style={{marginTop:'20px'}}>
                <Checkbox label="Total Goal" onClick={this.toggleGoals} name="totalInclude" checked={totalInclude} />
              </div>
            </div>

            {totalInclude ? 
               <div className='form__dhalf' ><div className='float-container'>
                {totalGoal ? <label className={classNames('bwa-floating-label', { 'bwa-floated': totalGoal })} >Value</label> : <div style={{marginTop:'8px'}}> </div>}
                <Input fluid placeholder="Value" type="text" name="totalGoal" value={totalGoal} onChange={this.handleChange} error={errorTotalGoal} />
              </div> </div> : null}
              {totalInclude ? 
                <div className='form__dhalf' style={{marginLeft:'5px'}}>
                 <div className='float-container'>
                 {totalGoalType ? <label className={classNames('bwa-select-label', { 'bwa-floated': totalGoalType })} >Goal Type</label> : <div style={{marginTop:'8px'}}> </div>}
                 <Select fluid placeholder="Goal Type" value={totalGoalType ? totalGoalType : ''} options={goalType} name="totalGoalType" onChange={this.handleSelect} error={errorTotalGoalType} />
                </div> </div> : null}
          </div>
          </div>
          
          <div className='form__inside' >
             <div className='float-container'>
              {pacing ? <label className={classNames('bwa-select-label', { 'bwa-floated': pacing })} >Pacing</label> : <label> </label>}
              <Select placeholder="Pacing" value={pacing ? pacing : ''} label="Pacing" fluid name="pacing" options={pacings} value={pacing} onChange={this.handleSelect} error={errorPacing} />
            </div>
          </div>
        </div>
    )
  }
}

const mapStateToProps = state => {
  const { cpm, errorCPM, cpc, errorCPC, pacing, errorPacing, goalsErrors, dayInclude, dayGoal, errorDayGoal, dayGoalType, totalInclude, totalGoal, cap, errorCap, capsErrors, errorTotalGoal, totalGoalType, errorDayGoalType, errorTotalGoalType } = state.flight;

  return { cpm, errorCPM, cpc, pacing, errorPacing, errorCPC, goalsErrors, dayInclude, dayGoal, errorDayGoal, dayGoalType, totalInclude, totalGoal, cap, errorCap, capsErrors, errorTotalGoal, totalGoalType, errorDayGoalType, errorTotalGoalType };
};

export default connect(mapStateToProps, { changeFlight })(FlightGoals);
