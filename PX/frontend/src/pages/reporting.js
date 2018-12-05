import React, { Component } from 'react';
import { Icon, Button, Menu, Select, Input, Dimmer } from 'semantic-ui-react';
import Table from '../components/table/Table';
import Collapse from '../components/Collapse';
import Panel from '../components/Panel';
import { Alert, Card, CardBody, Col } from 'reactstrap';
import { readActiveUser } from '../redux/actions/user.actions';
import { connect } from 'react-redux';
import { isAllowed } from '../functions';
import { fetchAutocomplete, runReport, resetReportingReducer, fetchAllPid } from '../redux/actions/reporting';
import classNames from 'classnames';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

let listInterval;

// import Chart from '../components/chart';

const displayFormatOptions = [
  { text: "All", value: 'all' },
  { text: "Display", value: "display" },
  { text: "Video", value: "video" }
];

class Reporting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: "",
      endDate: "",
      pubID: "",
      displayFormat: "",
      pagechunk: 25,
      sorting: "",
      sortdir: "asc",
      curpage: 1,
      error: false,
      errors: false,
      errorList: [],
      errorStartDate: false,
      errorEndDate: false,
      chartUpdate: false,
      loadingIcon: false

    };
  }

  componentWillMount() {
    this.props.readActiveUser();
  }

  componentDidMount() {
    this.props.fetchAllPid();
    // this.datePicker('startDate');
    // this.datePicker('endDate');
  }

  datePicker = (name) => {
    var input = document.querySelector(`input[name="${name}"]`);
    input.style.height = '30px';
    input.style.width = '100%';
    var picker = datepicker(input);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ error: nextProps.error });
    this.setState({ loadingIcon: false });
  }

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleChange = (event) => {
    let update = {
      chartUpdate: false
    };
    update[event.target.name] = event.target.value;
    this.setState(update);
  };

  handleSelect = (event, data) => {
    let update = {
      chartUpdate: false
    };
    update[data.name] = data.value;
    this.setState(update);
  };

  handleAutocomplete = (event, data) => {
    this.setState({ chartUpdate: false });
    const payload = {
      fragment: data
    };
    this.props.fetchAutocomplete(payload);
  };


  runReport = (event) => {
    this.setState({
      errors: false,
      errorStartDate: false,
      errorEndDate: false,
      errorList: [],
      loadingIcon: false
    });

    let arr = [];
    if (this.state.startDate === "") {
      arr.push('Please enter a start date');
      this.setState({ errorStartDate: true });
    }
    if (this.state.endDate === "") {
      arr.push('Please enter an end date');
      this.setState({ errorEndDate: true });
    }
    if (this.state.startDate > this.state.endDate) {
      arr.push('End date must be after the start date');
      this.setState({ errorStartDate: true, errorEndDate: true });
    }

    if (arr.length > 0) {
      this.setState({ errors: true, errorList: arr });
      return;
    }
    this.setState({ loadingIcon: true });
    this.setState({ chartUpdate: true });
    let payload = {};

    payload.pagination = {
      cur_page: this.state.curpage,
      sort: this.state.sorting,
      sort_dir: this.state.sortdir,
      page_chunk: this.state.pagechunk
    };

    payload.start_date = this.state.startDate;
    payload.end_date = this.state.endDate;
    payload.placement_format = (this.state.displayFormat == 'all') ? ('') : (this.state.displayFormat);
    payload.name = (this.state.pubID == 'all') ? ('') : (this.state.pubID);
    payload.format = event.target.name;
    payload.geo = "";

    if (event.target.name == 'CSV') {
      setTimeout(() => {
        this.setState({ loadingIcon: false });
      }, 2000);
    }

    this.props.runReport(payload);

    this.setState({ curpage: 1 });
  };

  handleLoaded = () => {
    this.setState({ loadingIcon: false });
  }

  renderTableBody = () => {
    if (this.props.results !== null) {
      let prevPage = (this.state.curpage - 1) * this.state.pagechunk;
      let thisPage = prevPage + this.state.pagechunk;
      return this.props.results.map((item, i) => {
        if (i >= prevPage && i <= thisPage) {
          return (
            <tr key={`${item.name}-${item.record_date}`}>
              <td>{item.name}</td>
              <td>{item.record_date}</td>
              <td >{item.format.toUpperCase()}</td>
              <td >{item.adopportunities.toLocaleString()}</td>
              <td >{item.adattempts.toLocaleString()}</td>
              <td >{item.adimpressions.toLocaleString()}</td>
              <td >{`${item.clicks}`}</td>
              <td >{`$${parseFloat(item.ecpm.toLocaleString()).toFixed(2)}`}</td>
              <td >{`$${this.numberWithCommas(parseFloat(item.payout.toLocaleString()).toFixed(2))}`}</td>
            </tr>
          )
        }
      })
    }


  };


  getMidpageNumber = () => {
    switch (this.state.curpage) {
      case 1:
        return 2;
      case this.props.pagination.total_pages:
        return this.props.pagination.total_pages - 1;
      default:
        return this.state.curpage;
    }
  };

  renderPagination = () => {
    return (
      <Menu size="mini" floated="right" pagination>
        <Menu.Item id="first" onClick={this.handlePagination} as='a' icon>
          <Icon name="double angle left" />
        </Menu.Item>
        <Menu.Item id="prev" onClick={this.handlePagination} as='a' icon>
          <Icon name="angle left" />
        </Menu.Item>
        {this.props.pagination.total_pages === 1 ? <Menu.Item onClick={this.handlePagination} as='a' active={this.state.curpage === 1}>{this.state.curpage}</Menu.Item> : null}
        {this.props.pagination.total_pages === 2 ? <Menu.Item onClick={this.handlePagination} as='a' active={this.state.curpage === 1}>{1}</Menu.Item> : null}
        {this.props.pagination.total_pages > 2 ? <Menu.Item onClick={this.handlePagination} as='a' active={this.state.curpage === 1}>{this.state.curpage === 1 ? 1 : this.getMidpageNumber() - 1}</Menu.Item> : null}
        {this.props.pagination.total_pages === 2 ? <Menu.Item onClick={this.handlePagination} as='a' active={this.state.curpage === 2}>{2}</Menu.Item> : null}
        {this.props.pagination.total_pages > 2 ? <Menu.Item onClick={this.handlePagination} as="a" active={this.state.curpage !== 1 && this.state.curpage !== this.props.pagination.total_pages}>{this.getMidpageNumber()}</Menu.Item> : null}
        {this.props.pagination.total_pages > 2 ? <Menu.Item onClick={this.handlePagination} as='a' active={this.state.curpage === this.props.pagination.total_pages}>{this.getMidpageNumber() + 1}</Menu.Item> : null}
        <Menu.Item id="next" onClick={this.handlePagination} as='a' icon>
          <Icon name="angle right" />
        </Menu.Item>
        <Menu.Item id="last" onClick={this.handlePagination} as='a' icon>
          <Icon name="double angle right" />
        </Menu.Item>
      </Menu>
    )
  };

  handlePagination = (event, data) => {

    let payload = {};
    payload.pagination = {
      cur_page: this.state.curpage,
      sort: this.state.sorting,
      sort_dir: this.state.sortdir,
      page_chunk: this.state.pagechunk
    };
    payload.start_date = this.state.startDate;
    payload.end_date = this.state.endDate;
    payload.placement_format = this.state.displayFormat;
    payload.name = this.state.pubID;
    payload.format = "JSON";
    payload.geo = "";
    this.setState((prevState, prevProps) => {
      if (data.id) {
        switch (data.id) {
          case "first":
            payload.pagination.cur_page = 1;
            if (prevState.curpage !== 1) {
            }
            return { curpage: 1 };
            break;
          case "prev":
            if (prevState.curpage !== 1 && prevProps.pagination.total_pages !== 1) {
              payload.pagination.cur_page = prevState.curpage - 1;
              return { curpage: prevState.curpage - 1 };
            }
            break;
          case "next":
            if (prevState.curpage !== prevProps.pagination.total_pages && prevProps.pagination.total_pages !== 1) {
              payload.pagination.cur_page = prevState.curpage + 1;
              return { curpage: prevState.curpage + 1 };
            }
            break;
          case "last":
            payload.pagination.cur_page = this.props.pagination.total_pages;
            if (prevState.curpage !== prevProps.pagination.total_pages) {

            }
            return { curpage: prevProps.pagination.total_pages };
            break;
        }
      }
      else {
        payload.pagination.cur_page = data.children;
        if (data.children !== prevState.curpage) {
          // this.props.runReport(payload);
        }
        return { curpage: data.children };
      }
    });
  }

  render() {
    const { activeUser, activeUserError } = this.props;
    const { dimmerStyle } = styles
    if (!activeUser && !activeUserError) {
      return (
        <div></div>
      )
    }

    if (!isAllowed('Reporting', activeUser.user)) {
      return (
        <Alert color="danger">You are not authorized to view this page</Alert>
      )
    }

    const boldStyle = {
      fontWeight: "bold"
    };

    return (
      <div className="sub-content" style={{ marginTop: '10px' }}>
        <Col md={12} lg={12}>
          <Card>
            <CardBody>
              <Collapse title='Keys / Metrics' open={true} className='shadow'>
                <form className='form'>
                  <div className='form__four'>
                    <div className='float-container'>
                      <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Start Date</label>
                      <Input type='date' fluid name="startDate" onInput={this.handleChange} value={this.state.startDate} placeholder='Start Date ' />
                    </div></div>
                  <div className='form__four'>
                    <div className='float-container'>
                      <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >End Date</label>
                      <Input type='date' fluid name="endDate" value={this.state.endDate} onInput={this.handleChange} placeholder='End Date' />
                    </div></div>

                  <div className='form__four'>
                    <div className='float-container'>
                      <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Pub ID</label>
                      <Select fluid className="bwa-select-label2 bwa-floated" placeholder="Pub ID" search name="pubID" options={this.props.pubs} defaultValue="all" onChange={this.handleSelect} onSearchChange={this.handleAutocomplete.bind(this)} />
                    </div></div>
                  <div className='form__four'>
                    <div className='float-container'>
                      <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Format</label>
                      <Select fluid className="bwa-select-label2 bwa-floated" placeholder="Format" options={displayFormatOptions} name="displayFormat" defaultValue="all" onChange={this.handleSelect} />
                    </div></div>
                </form>
              </Collapse>
              <br />
              <Button primary name="JSON" onClick={this.runReport}>Run Report</Button>
              <Button primary name="CSV" onClick={this.runReport}>Download CSV</Button>



              {this.props.updateChart ? <Panel md={12} title='IMPRESSIONS / OPPORTUNITIES'>
                <ResponsiveContainer height={350} className='dashboard__area'>
                  <AreaChart data={this.props.chartResults} margin={{ top: 20, left: 20, bottom: 20 }}>
                    <XAxis dataKey='cateories' tickLine={false} />
                    <YAxis tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid />
                    <Area name='Opportunity' type='monotone' dataKey='opp' stroke='#4ce1b6' fillOpacity={0.2} />
                    <Area name='Impression' type='monotone' dataKey='imp' stroke='#70bbfd' fillOpacity={0.2} />
                    <Area name='Ad Attempt' type='monotone' dataKey='rev' stroke='#ffc658' fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Panel> : null}

              {this.state.loadingIcon && <Dimmer active inverted style={dimmerStyle}><div className='loader'> </div></Dimmer>}
              {this.state.errors ? <h5> There are some errors with your submission</h5> : null}
              {this.state.errorList.length ? (this.state.errorList.map((err, index) => {
                return <Alert key={index} color='danger'> {err}</Alert>
              })) : (null)}


              {this.props.results !== null && this.props.results.length == 0 && !this.state.loadingIcon ? <Alert color='info' > Search not found: Check your parameters </Alert> : null}
              {this.props.results !== null && this.props.pagination !== null && !this.props.results.length == 0 ? <div> <Table responsive className='table--bordered dashboard__table-crypto'>
                <thead>
                  <tr>
                    <th  >Pub ID</th>
                    <th style={{ width: '6%' }}>Date</th>
                    <th >Display Format</th>
                    <th >Opportunities</th>
                    <th >Attempts</th>
                    <th >Impressions</th>
                    <th >Clicks</th>
                    <th >eCPM</th>
                    <th >Payout</th>
                  </tr>
                </thead>
                <tbody >
                  {this.renderTableBody()}
                  <tr style={{ fontWeight: 'bold', backgroundColor: '#ececec' }}>
                    <td>Total</td>
                    <td></td>
                    <td ></td>
                    <td >{`${this.numberWithCommas(this.props.totals.adopportunities.toLocaleString())}`}</td>
                    <td >{`${this.numberWithCommas(this.props.totals.adattempts.toLocaleString())}`}</td>
                    <td >{`${this.numberWithCommas(this.props.totals.adimpressions.toLocaleString())}`}</td>
                    <td >{`${this.props.totals.clicks}`}</td>
                    <td >{`$${parseFloat(this.props.totals.ecpm.toLocaleString()).toFixed(2)}`}</td>
                    <td >{`$${this.numberWithCommas(parseFloat(this.props.totals.payout.toLocaleString()).toFixed(2))}`}</td>
                  </tr>
                </tbody>
              </Table>
                {this.renderPagination()}
              </div> : null}
            </CardBody>
          </Card>
        </Col>
      </div>
    )

  }

}

const styles = {
  dimmerStyle: {
    height: "100%"
  }
}

function mapStateToProps(state) {
  return { activeUser: state.shared.activeUser, activeUserError: state.shared.activeUserError, pubs: state.reporting.pubs, results: state.reporting.results, updateChart: state.reporting.updateChart, daily: state.reporting.daily, totals: state.reporting.totals, pagination: state.reporting.pagination, error: state.reporting.error, chartResults: state.reporting.chartResults };
  const { accounts, pagination, listError, loader, idSort, nameSort, searchTerm, sortBy, sortDirection, currentPage, pageChunk } = state.accounts;
  const { activeUser, activeUserError } = state.shared;

}

export default connect(mapStateToProps, { readActiveUser, fetchAutocomplete, runReport, resetReportingReducer, fetchAllPid })(Reporting);