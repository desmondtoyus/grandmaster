import React, { Component } from 'react';
import {  Icon, Button, Select, Input, Dimmer } from 'semantic-ui-react';
import Table from '../components/table/Table';
import { changeAnalyticsState, olapValidation, olapFilter, resetAnalyticsErrors, runReport, setAnalyticsSorting } from '../redux/actions/analytics.actions';
import { readActiveUser } from '../redux/actions/user.actions';
import { connect } from 'react-redux';
import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';
import { isAllowed } from '../functions';
import classNames from 'classnames';
import Collapse from '../components/Collapse';
import { Alert, Card, CardBody, Col } from 'reactstrap';

const moment = extendMoment(Moment);
import Paginator from '../app/paginator';

const dateRanges = [
    { text: "Month to Date", value: "Month to Date" },
    { text: "Today", value: "Today" },
    { text: "Yesterday", value: "Yesterday" },
    { text: "Last 7 Days", value: "Last 7 Days" },
    { text: "Last Month", value: "Last Month" },
    { text: "Custom", value: "Custom" }
];

const intervalFull = [
    { text: "Day", value: "day" },
    { text: "Hour", value: "hour" },
    { text: "Minute", value: "minute" },
    { text: "Cumulative", value: "overall" }
];

const intervals = [
    { text: "Day", value: "day" },
    { text: "Hour", value: "hour" },
    { text: "Cumulative", value: "overall" }
    
];

const timeZones = [
    { text: "UTC", value: "UTC" },
    { text: "US/Eastern", value: "US/Eastern" },
    { text: "US/Pacific", value: "US/Pacific" }
];




class ConversionAnalytics extends Component {

    componentWillMount() {
        this.props.readActiveUser();
    }



    getTotal = (item) => {
        switch (item) {
            case "Time":
            case "Date":
                return "Total";
            case "Opportunities":
                return this.props.report.aggregates.aggregate_opportunities.toLocaleString();
            case "Attempts":
                return this.props.report.aggregates.aggregate_attempts.toLocaleString();
            case "Imps":
                return this.props.report.aggregates.aggregate_impressions.toLocaleString();
            case "Ad Starts":
                return this.props.report.aggregates.aggregate_adstarts.toLocaleString();
            case "Ad Errors":
                return this.props.report.aggregates.aggregate_aderrors.toLocaleString();
            case "Clicks":
                return this.props.report.aggregates.aggregate_clicks.toLocaleString();
            case "RPM":
                return (Number(this.props.report.aggregates.aggregate_rpm) * 100).toFixed(1) + '%';
            case "Rejections":
                return this.props.report.aggregates.aggregate_rejections.toLocaleString();
            case "Usable %":
                return (Number(this.props.report.aggregates.aggregate_usable) * 100).toFixed(1) + '%';
            case "25% Completions":
                return this.props.report.aggregates.aggregate_quarter_completions.toLocaleString();
            case "50% Completions":
                return this.props.report.aggregates.aggregate_half_completions.toLocaleString();
            case "75% Completions":
                return this.props.report.aggregates.aggregate_three_quarter_completions.toLocaleString();
            case "100% Completions":
                return this.props.report.aggregates.aggregate_full_completions.toLocaleString();
            case "Spend":
                return '$' + Number(this.props.report.aggregates.aggregate_revenue).toFixed(2);
            case "Payout":
                return '$' + Number(this.props.report.aggregates.aggregate_payout).toFixed(2);
            case "eCPM":
                return '$' + Number(this.props.report.aggregates.aggregate_ecpm).toFixed(2);
            case "25% Completion Rate":
                return (Number(this.props.report.aggregates.aggregate_quarter_completion_rate) * 100).toFixed(1) + '%';
            case "50% Completion Rate":
                return (Number(this.props.report.aggregates.aggregate_half_completion_rate) * 100).toFixed(1) + '%';
            case "75% Completion Rate":
                return (Number(this.props.report.aggregates.aggregate_three_quarter_completion_rate) * 100).toFixed(1) + '%';
            case "Attempt Fill Rate":
                return (Number(this.props.report.aggregates.aggregate_attempt_fill_rate) * 100).toFixed(1) + '%';
            case "Fill Rate":
                return (Number(this.props.report.aggregates.aggregate_fill_rate) * 100).toFixed(1) + '%';
            case "100% Completion Rate":
                return (Number(this.props.report.aggregates.aggregate_full_completion_rate) * 100).toFixed(1) + '%';
            case "Clickthrough Rate":
                return (Number(this.props.report.aggregates.aggregate_click_through_rate) * 100).toFixed(1) + '%';
            default:
                return "";

        }
    };

    renderTotals = () => {
        const fontStyle = {
            fontWeight: "bold"
        };
        const { names } = this.sortColumns(this.props.report.columns);
        return names.map((item, index) => {
            return (
                <td key={index} >
                    <span style={fontStyle}>{this.getTotal(item)}</span>
                </td>
            )
        })
    };

    formatItem = (obj, type) => {
        switch (type) {
            case 'hour_timestamp':
            case 'minute_timestamp':
            case 'day_timestamp':
                if (obj.hasOwnProperty('hour_timestamp')) {
                    return moment(obj.hour_timestamp).format('MM/DD/YYYY h:mma');
                }
                else if (obj.hasOwnProperty('minute_timestamp')) {
                    return moment(obj.minute_timestamp).format('MM/DD/YYYY h:mma');
                }
                else {
                    return moment(obj.day_timestamp).format('MM/DD/YYYY');
                }

            default:
                return obj[type];
        }
    };

    renderRow = (obj) => {
        const { columns } = this.sortColumns(this.props.report.columns);

        return columns.map((item, index) => {
            return (
                <td key={index} >{this.formatItem(obj, item)}</td>
            )
        })
    };

    renderTableBody = () => {
        const { report } = this.props;

        return report.rows.map((item, index) => {
 
            return (
                <tr key={index}>
                    {this.renderRow(item)}
                </tr>
            )
        })
    };

    
    handleSorting = name => {
        const { sortDirection, pageChunk } = this.props;

        const payload = {
            currentPage: 1,
            sortBy: name,
            sortDirection: sortDirection === "asc" ? "desc" : "asc",
            pageChunk
        };

        this.props.changeAnalyticsState({ prop: 'currentPage', value: 1 });
        this.props.changeAnalyticsState({ prop: 'sortBy', value: name });
        this.props.changeAnalyticsState({ prop: 'sortDirection', value: payload.sortDirection });
        this.props.setAnalyticsSorting(name);

        this.runReport(payload, "JSON");
    };

    sortColumns = (columns) => {
        let names = [];
        let arr = [];
        const { interval } = this.props;

        switch (interval) {
            case 'day':
                names[0] = "Date";
                arr[0] = 'day_timestamp';
                break;
            case 'hour':
                names[0] = "Time";
                arr[0] = 'hour_timestamp';
                break;
            case 'minute':
                names[0] = "Time";
                arr[0] = 'minute_timestamp';
                break;
        }
    
        if (columns.includes('campaign_id')) {
            names.push('ID');
            names.push('Campaign');
            arr.push('campaign_id');
            arr.push('campaign_name');
        }
        return {
            names,
            columns: arr
        };
    };

    renderTableHead = () => {
        const { report, keys } = this.props;
        let obj = this.sortColumns(report.columns);
        return obj.names.map((item, index) => {
            let name = obj.columns[index];
            if (name.includes('timestamp')) {
                name = 'record_time';
            }
            return (
                <th key={index}>
                    {item.substring(0, 10)}
                    {keys.includes(obj.columns[index]) || item === "ID" || item === "Time" || item === "Date" ? <Icon style={{ cursor: 'pointer', marginLeft: 5 }} color={this.props[`${name}Sort`] === "sort" ? "black" : "blue"} name={this.props[`${name}Sort`]} id={obj.columns[index]} onClick={this.handleSorting.bind(null, name)} /> : null}
                </th>
            )
        })
    };

    getStartTime = (val) => {
        const month = moment().month();
        const year = moment().year();
        const day = moment().date();

        switch (val) {
            case "Month to Date":
                return moment([year, month, 1, 0, 0]).format('YYYY-MM-DD HH:mm');
            case "Today":
                return moment([year, month, day, 0, 0]).format('YYYY-MM-DD HH:mm');
            case "Yesterday":
                return moment([year, month, day, 0, 0]).subtract(1, 'days').format('YYYY-MM-DD HH:mm');
            case "Last 7 Days":
                return moment([year, month, day, 0, 0]).subtract(6, 'days').format('YYYY-MM-DD HH:mm');
            case "Last Month":
                return moment([year, month, 1, 0, 0]).subtract(1, 'months').format('YYYY-MM-DD HH:mm');
            case "Custom":
                const { interval, customStartDate, customStartTime } = this.props;
                if (interval !== "minute") {
                    return `${customStartDate} 00:00`;
                }
                else if (customStartTime !== "") {
                    return `${customStartDate} ${customStartTime}`
                }
                else {
                    return `${customStartDate} 00:00`;
                }
        }
    };

    getEndTime = (val) => {
        const { timeZone } = this.props;

        const month = moment().month();
        const year = moment().year();
        const day = moment().date();
        switch (val) {
            case "Month to Date":
            case "Today":
            case "Last 7 Days":
                switch (timeZone) {
                    case 'US/Pacific':
                        return moment().tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm');
                    case 'US/Eastern':
                        return moment().tz('America/New_York').format('YYYY-MM-DD HH:mm');
                    case 'UTC':
                        return moment().tz('UTC').format('YYYY-MM-DD HH:mm');
                }
                break;
            case "Yesterday":
                return moment([year, month, day, 23, 59]).subtract(1, 'days').format('YYYY-MM-DD HH:mm');
            case "Last Month":
                return moment([year, month, 1, 0, 0]).subtract(1, 'minutes').format('YYYY-MM-DD HH:mm');
            case "Custom":
                const { interval, customEndDate, customEndTime } = this.props;
                if (interval !== "minute") {
                    return `${customEndDate} 23:59`;
                }
                else if (customEndTime !== "") {
                    return `${customEndDate} ${customEndTime}`;
                }
                else {
                    return `${customEndDate} 23:59`;
                }
        }
    };


    runReport = (pagination, reportFormat) => {
        this.props.changeAnalyticsState({ prop: `loading${reportFormat}`, value: true });

        let payload = {};
        payload.pagination = {
            cur_page: pagination.currentPage,
            sort: pagination.sortBy,
            sort_dir: pagination.sortDirection,
            page_chunk: pagination.pageChunk
        };
        const {  campaign_id, timeZone, dateRange } = this.props;

        payload.filters = {};

        if (campaign_id.length) {
            payload.filters.campaign_id = campaign_id;
        }
  
        payload.keys = keys;
        payload.metrics = metrics;
        payload.interval = interval;
        payload.timezone = timeZone;
        payload.format = reportFormat;
        payload.start_time = this.getStartTime(dateRange);
        payload.end_time = this.getEndTime(dateRange);
        this.props.runReport(payload);
    };

    handleChange = (event) => {
        this.props.changeAnalyticsState({ prop: event.target.name, value: event.target.value });
    };

    validateDateInterval = (arr) => {
        const { interval, dateRange, customStartDate, customStartTime, customEndDate, customEndTime } = this.props;

        if (interval === "hour") {
            if (dateRange === "Month to Date" || dateRange === "Last Month") {
                arr.push(`Hour interval is incompatible with "${dateRange}" date range`);
                this.props.changeAnalyticsState({ prop: 'errorDate', value: true });
                this.props.changeAnalyticsState({ prop: 'errorInterval', value: true });
            }
        }
        if (interval === "minute") {
            if (dateRange === "Last 7 Days" || dateRange === "Month to Date" || dateRange === "Last Month") {
                arr.push(`Minute interval is incompatible with "${dateRange}" date range`);
                this.props.changeAnalyticsState({ prop: 'errorDate', value: true });
                this.props.changeAnalyticsState({ prop: 'errorInterval', value: true });
            }
        }
        if (dateRange === "Custom") {
            const start = `${customStartDate} ${customStartTime}`;
            const end = `${customEndDate} ${customEndTime}`;
            if (moment(Date.parse(end)).isBefore(Date.parse(start))) {
                arr.push(`End Date can't be before Start Date`);
                this.props.changeAnalyticsState({ prop: 'errorStartDate', value: true });
                this.props.changeAnalyticsState({ prop: 'errorStartTime', value: true });
                this.props.changeAnalyticsState({ prop: 'errorEndDate', value: true });
                this.props.changeAnalyticsState({ prop: 'errorEndTime', value: true });
            }
            if (!moment(Date.parse(start)).isValid()) {
                arr.push(`Please enter a valid start date and time`);
                this.props.changeAnalyticsState({ prop: 'errorStartDate', value: true });
                this.props.changeAnalyticsState({ prop: 'errorStartTime', value: true });
            }
            if (!moment(Date.parse(end)).isValid()) {
                arr.push(`Please enter a valid end date and time`);
            }
            if (moment(Date.parse(start)).isValid() && moment(Date.parse(end)).isValid()) {
                let dr = moment.range(moment(Date.parse(start)), moment(Date.parse(end)));
                if (interval === "minute" && dr.diff('minutes') > 1540) {
                    arr.push(`Maximum date range for Minute interval is 24 hours`);
                    this.props.changeAnalyticsState({ prop: 'errorStartDate', value: true });
                    this.props.changeAnalyticsState({ prop: 'errorStartTime', value: true });
                    this.props.changeAnalyticsState({ prop: 'errorEndDate', value: true });
                    this.props.changeAnalyticsState({ prop: 'errorEndTime', value: true });
                }
                if (interval === "hour" && dr.diff('hours') > 158) {
                    arr.push(`Maximum date range for Hour interval is 7 days`);
                    this.props.changeAnalyticsState({ prop: 'errorStartDate', value: true });
                    this.props.changeAnalyticsState({ prop: 'errorStartTime', value: true });
                    this.props.changeAnalyticsState({ prop: 'errorEndDate', value: true });
                    this.props.changeAnalyticsState({ prop: 'errorEndTime', value: true });
                }
                if (interval === "day" && dr.diff('days') > 30) {
                    arr.push(`Maximum date range for Day interval is 30 days`);
                    this.props.changeAnalyticsState({ prop: 'errorStartDate', value: true });
                    this.props.changeAnalyticsState({ prop: 'errorStartTime', value: true });
                    this.props.changeAnalyticsState({ prop: 'errorEndDate', value: true });
                    this.props.changeAnalyticsState({ prop: 'errorEndTime', value: true });
                }
            }
        }

        return arr;
    };

    runValidation = (type) => {
        let arr = [];

        this.props.resetAnalyticsErrors();

        const { dateRange, interval, timeZone} = this.props;

        if (dateRange === "") {
            arr.push('Please select a date range');
            this.props.changeAnalyticsState({ prop: 'errorDate', value: true });
        }
        if (interval === "") {
            arr.push('Please select an interval');
            this.props.changeAnalyticsState({ prop: 'errorInterval', value: true });
        }
        if (timeZone === "") {
            arr.push('Please select a time zone');
            this.props.changeAnalyticsState({ prop: 'errorTimeZone', value: true });
        }

        arr = this.validateDateInterval(arr);

        if (arr.length > 0) {
            this.props.changeAnalyticsState({ prop: 'errorList', value: arr });
            return;
        }

        this.props.changeAnalyticsState({ prop: 'currentPage', value: 1 });
        this.props.changeAnalyticsState({ prop: 'sortBy', value: 'record_time' });

        const { sortDirection, pageChunk } = this.props;

        const pagination = {
            currentPage: 1,
            sortBy: 'record_time',
            sortDirection,
            pageChunk
        };

        this.runReport(pagination, type)
    };

    handleSelect = (event, data) => {
        this.props.changeAnalyticsState({ prop: data.name, value: data.value });
    };

    handlePagination = currentPage => {
        const { sortBy, sortDirection, pageChunk } = this.props;

        this.props.changeAnalyticsState({ prop: 'currentPage', value: currentPage });
        const payload = {
            currentPage,
            sortBy,
            sortDirection,
            pageChunk
        };

        this.runReport(payload, "JSON");
    };

    handleSearch = (filter, category, event, value) => {
        if (value) {
            this.props.olapFilter({
                filter,
                category,
                fragment: value
            })
        }
    };

    handleKeys = (event, data) => {
        const { interval, timeZone, dateRange } = this.props;
        let start_time = this.getStartTime(dateRange);
        let end_time = this.getEndTime(dateRange);
        let timezone = timeZone;
        this.props.changeAnalyticsState({ prop: 'keys', value: data.value });
        this.props.olapValidation(data.value, this.props.metrics, interval, start_time, end_time, timezone);
    };


    render() {
        const { activeUser } = this.props;

        if (!activeUser) {
            return (
                <div></div>
            )
        }

        if (!isAllowed('Advertiser', activeUser.user)) {
            return (
                <Alert color='danger' >You are not authorized to view this page</Alert>
            )
        }

        const { errorDate, dateRange, errorInterval, errorTimeZone, errorStartDate, interval, errorStartTime, errorEndDate, 
            errorEndTime, timeZone, customStartDate, customStartTime, customEndDate, customEndTime,loadingCSV, loadingJSON, 
             campaign_id, referring_domain, keys, errorList } = this.props;

        const { dimmerStyle } = styles;
        return (

            <div className="sub-content" style={{ marginTop: '10px' }}>

                <Col md={12} lg={12}>
                    <Card>
                        {loadingJSON || loadingCSV ? <Dimmer active inverted style={dimmerStyle}><div className='loader'> </div></Dimmer> : null}
                        <CardBody>
                            <Collapse title='Report Settings' open={true} className='shadow'>
                                <form className='form'>
                                    <div className='form__three'>
                                        <div className='float-container'>
                                            <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Date Range</label>
                                            <Select fluid className="bwa-select-label2 bwa-floated" label="Date Range" options={dateRanges} name="dateRange" placeholder="Date Range" value={dateRange} onChange={this.handleSelect} error={errorDate} />
                                        </div>
                                    </div>
                                    <div className='form__three'>
                                        <div className='float-container'>
                                            <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Interval</label>
                                            <Select fluid className="bwa-select-label2 bwa-floated" label="Interval" options={dateRange === "Custom" ? intervalFull : intervals} name="interval" placeholder="Interval" value={interval} onChange={this.handleSelect} error={errorInterval} />
                                        </div>
                                    </div>
                                    <div className='form__three'>
                                        <div className='float-container'>
                                            <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Time Zone</label>
                                            <Select fluid className="bwa-select-label2 bwa-floated" label="Time Zone" options={timeZones} name="timeZone" placeholder="Time Zone" value={timeZone} onChange={this.handleSelect} error={errorTimeZone} />
                                        </div>
                                    </div>

                                    {dateRange === "Custom" ? <div className={'form__inside_full_flex'}>
                                        <div className={interval === "minute" ? 'form__four' : 'form__half2'}>
                                            <div className='float-container'>
                                                <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Start Date</label>
                                                <Input fluid type="date" name="customStartDate" onChange={this.handleChange} error={errorStartDate} value={customStartDate} />
                                            </div>
                                        </div>
                                        {interval === "minute" ? <div className='form__four'>
                                            <div className='float-container'>
                                                <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >Start Time</label>
                                                <Input fluid type="time" name="customStartTime" onChange={this.handleChange} error={errorStartTime} value={customStartTime} />

                                            </div> </div> : null}
                                        <div className={interval === "minute" ? 'form__four' : 'form__half2'}>
                                            <div className='float-container'>
                                                <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >End Date</label>
                                                <Input fluid type="date" name="customEndDate" onChange={this.handleChange} error={errorEndDate} value={customEndDate} />

                                            </div></div>

                                        {interval === "minute" ? <div className='form__four'>
                                            <div className='float-container'>
                                                <label className={classNames('bwa-select-label', { 'bwa-floated': 1 })} >End Time</label>
                                                <Input fluid type="time" name="customEndTime" onChange={this.handleChange} error={errorEndTime} value={customEndTime} />

                                            </div></div> : null}

                                    </div> : null}

                                </form>
                            </Collapse>

                            <Collapse title='Domain' className='shadow'>
                                <form className='form'>
                                    <div className='form__half2'>
                                        <div className='float-container'>
                                            {keys.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': keys.length })} >Keys</label> : <label></label>}
                                            <Select fluid search className={classNames("bwa-select-label2", { "bwa-floated": keys.length })} placeholder="Keys" multiple onChange={this.handleKeys} value={keys} />
                                        </div></div>
                                </form>
                            </Collapse>


                            <form>
                                <div className='form__half'>
                                    <div className='form__half2'>
                                        {errorList.length ? <h5> There are some errors with your submission</h5> : null}
                                        {errorList.length ? (errorList.map((err, index) => {
                                            return <Alert key={index} color='danger'> {err}</Alert>
                                        })) : (null)}

                                        {this.props.report_err ? <Alert color='danger'>Query failed! Check your submission</Alert> : null}
                                    </div>
                                </div>
                            </form>
                            <br />
                            <Button loading={loadingJSON} primary onClick={this.runValidation.bind(null, 'JSON')}>Run Report</Button>
                            <Button loading={loadingCSV} primary onClick={this.runValidation.bind(null, 'CSV')}>Download CSV</Button>


                            <br />

                            {/* {report !== null && !this.props.report_err && report.hasOwnProperty('columns') ? <div>
                            {report.total_rows ? <Table responsive className='table--bordered dashboard__table-crypto'>
                                <thead>
                                    <tr>
                                        {this.renderTableHead()}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTableBody()}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        {this.renderTotals()}
                                    </tr>
                                    <tr>
                                        <th colSpan={report.columns.length}>
                                        </th>
                                    </tr>
                                </tfoot>
                            </Table>: <div > <br/> <Alert color='info'>No rows found</Alert></div>}
                            {report.total_rows ? <Paginator pagination={{ currentPage: report.pagination.cur_page, limit: pageChunk, totalPages: report.pagination.total_pages }} handlePagination={this.handlePagination} /> :null}

                            </div> : null} */}
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
const mapStateToProps = state => {
    const {
        errorDate,
        dateRange,
        errorTimeZone,
        errorStartDate,
        interval,
        errorStartTime,
        errorEndDate,
        timeZone,
        customStartDate,
        customStartTime,
        customEndDate,
        customEndTime,
        campaign_id,
        errorList,
        loadingJSON,
        loadingCSV,
        report,
        sortDirection,
        sortBy,
        currentPage,
        pageChunk,
        report_err,
        errorInterval,
        errorEndTime,
        referring_domain,
        keys
    } = state.analytics;
    const { activeUser } = state.shared;

    return {
        errorDate,
        dateRange,
        errorTimeZone,
        errorStartDate,
        interval,
        errorStartTime,
        errorEndDate,
        timeZone,
        customStartDate,
        customStartTime,
        customEndDate,
        customEndTime,
        campaign_id,
        errorList,
        loadingJSON,
        loadingCSV,
        report,
        sortDirection,
        sortBy,
        currentPage,
        pageChunk,
        report_err,
        errorInterval,
        errorEndTime,
        referring_domain,
        keys,
        activeUser 
    };
};

export default connect(mapStateToProps, { changeAnalyticsState, readActiveUser, olapValidation, olapFilter, resetAnalyticsErrors, runReport, setAnalyticsSorting })(ConversionAnalytics);
