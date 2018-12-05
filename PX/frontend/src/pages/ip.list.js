import React, {Component} from "react";
import {isAllowed} from "../functions";
import {
    Select,
    Input,
    TextArea,
    Button,
    Checkbox,
    Dimmer
} from "semantic-ui-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    Alert,
    Card,
    CardBody,
    Col,
    Row
} from "reactstrap";
import classNames from "classnames";
import {Link} from "react-router-dom";
import Dropzone from "react-dropzone";
import {connect} from "react-redux";
import {
    domainListChange,
    uploadIpList,
    createDomainList,
    resetDomainListErrors,
    resetDomainListReducer,
    readDomainList,
    updateDomainList,
    cloneDomainList
} from "../redux/actions/lists.actions";
import {withRouter} from "react-router";

class DomainList extends Component {
    state = {
        showListError: false
    }
    componentWillMount() {
        const {match} = this.props;

        if (match.params.id !== "new" && !isNaN(Number(match.params.id)) && Number(match.params.id) > 0) {
            this
                .props
                .readDomainList(Number(match.params.id));
        }
    }

    componentDidMount() {
        if (this.props.match.params.status !== "update") {
            this
                .props
                .resetDomainListReducer();
        }
    }

    componentWillUnmount() {
        this
            .props
            .resetDomainListReducer();
    }

    onListDrop = (accepted, rejected) => {
        console.log(accepted[0].type);
        // if (accepted[0].type !== "text/csv" || accepted[0].type !== "text/plain")
        if (accepted[0].type !== "text/plain") {
            this
                .props
                .domainListChange({prop: "uploadMessage", value: "File type not supported."});
        } else {
            let payload = new FormData();
            payload.append("list", accepted[0]);
            this
                .props
                .uploadIpList(payload);
        }
    };

    cancelAction = () => {
        this
            .props
            .resetDomainListReducer();
        this
            .props
            .history
            .push(`/ui/ips`);
    };
    handleShowError = (event, data) => {
        event.preventDefault();
        this.setState({
            showListError: !this.state.showListError
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.success) {
            setTimeout(() => {
                this
                    .props
                    .resetDomainListReducer();
                this
                    .props
                    .history
                    .push(`/ui/ips`);
            }, 3000);
        }
    }

    isInputValid = () => {
        this
            .props
            .resetDomainListErrors();

        const {name, domains, uploadedDomains, list} = this.props;
        const arr = [];

        if (name.length < 6) {
            arr.push("list name shall be at least 6 characters");
            this
                .props
                .domainListChange({prop: "errorName", value: true});
        }
        if (name.length > 100) {
            arr.push("list name shall be at most 100 characters");
            this
                .props
                .domainListChange({prop: "errorName", value: true});
        }

        if (!(name.length > 100) && !(name.length < 6) && !isNaN(name)) {
            arr.push("Name cannot all be numbers");
            this
                .props
                .domainListChange({prop: "errorName", value: true});
        }

        if (domains === "" && !uploadedDomains.length && !list.length) {
            arr.push("Please enter or upload IP Address");
            this
                .props
                .domainListChange({prop: "errorDomains", value: true});
        }

        if (arr.length) {
            this
                .props
                .domainListChange({prop: "errors", value: true});
            this
                .props
                .domainListChange({prop: "errorList", value: arr});
            return false;
        }
        return true;
    };

    handleSave = event => {
        event.preventDefault();

        if (!this.isInputValid()) {
            return;
        }

        const {
            name,
            domains,
            uploadedDomains,
            list,
            editStatus,
            match
        } = this.props;

        const payload = {
            name
        };
        if (uploadedDomains.length) {
            payload.uploadedDomains = uploadedDomains;
        } else {
            payload.uploadedDomains = [];
        }
        payload.typedDomains = domains;
        payload.listType = "ip_address";

        if (match.params.id === "new") {
            this
                .props
                .createDomainList(payload);
        } else if (match.params.status === "update") {
            payload.id = Number(match.params.id);
            payload.list = list;
            payload.editStatus = editStatus;
            this
                .props
                .updateDomainList(payload);
        } else if (match.params.status === "create") {
            payload.list = list;
            payload.editStatus = editStatus;
            this
                .props
                .cloneDomainList(payload);
        }
    };

    handleChange = event => {
        if (/[\\\^$*+?#@|~^<>()|[\]{}]/.test(event.target.value)) {
            return;
        }
        this
            .props
            .domainListChange({prop: event.target.name, value: event.target.value});
    };

    handleSelect = (event, data) => {
        this
            .props
            .domainListChange({prop: "list", value: data.value});
    };

    getOptions = () => {
        const arr = [];
        this
            .props
            .list
            .forEach(item => {
                arr.push({text: item, value: item});
            });
        return arr;
    };

    downloadList = event => {
        event.preventDefault();

        const {name, list} = this.props;

        const strList = list.join("\n");
        let link = document.createElement("a");
        link.download = `${name
            .split(" ")
            .join("_")}.txt`;
        let blob = new Blob([strList], {type: "text/plain"});
        link.href = window
            .URL
            .createObjectURL(blob);
        link.click();
    };

    clearList = event => {
        event.preventDefault();

        this
            .props
            .domainListChange({prop: "list", value: []});
    };

    render() {
        const {activeUser} = this.props;
        const {
            bottomMargin,
            dropStyle,
            divStyle,
            selectStyle,
            checkboxStyle,
            dimmerStyle
        } = styles;

        if (!isAllowed("Lists", activeUser.user)) {
            return (
                <div style={mainDivStyle}>
                    <Message negative size="massive">
                        You are not authorized to view this page
                    </Message>
                </div>
            );
        }

        const {
            match,
            name,
            invalidArr,
            errorName,
            domains,
            uploadMessage,
            errorDomains,
            list,
            editStatus,
            errorList,
            message,
            fail
        } = this.props;

        return (
            <div className={"sub-content"}>
                <Breadcrumb tag="nav">
                    <BreadcrumbItem>
                        <Link to={`/ui/home`} className='link-a'>Home</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <Link to={`/ui/ips`} className='link-a'>IP Address List</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active tag="span">
                        {match.params.status === "update"
                            ? "Update IP Address List"
                            : "Create IP Address List"}
                    </BreadcrumbItem>
                </Breadcrumb>

                <Col md={12} lg={12}>
                    <Card>
                        {match.params.id !== 'new' && !isNaN(Number(match.params.id)) && Number(match.params.id) > 0 && !list.length
                            ? <Dimmer active inverted style={dimmerStyle}>
                                    <div className='loader'></div>
                                </Dimmer>
                            : null}
                        <CardBody>
                            <form className="form">
                                <div className="form__half">
                                    <h5>IP Address List Details</h5>
                                    <div className="form__inside">
                                        <div>
                                            {name
                                                ? (
                                                    <label className={classNames("bwa-select-label", {"bwa-floated": name})}>
                                                        {" "}
                                                        IP Address List Name
                                                    </label>
                                                )
                                                : (<div
                                                    style={{
                                                    marginTop: "10px"
                                                }}/>)}
                                            <Input
                                                type="text"
                                                fluid
                                                placeholder="IP Address List Name"
                                                name="name"
                                                value={name}
                                                onChange={this.handleChange}
                                                error={errorName}/>
                                        </div>
                                    </div>

                                    {match.params.id !== "new"
                                        ? (
                                            <div className="form__inside">
                                                <div>
                                                    {list.length
                                                        ? (
                                                            <label className={classNames("bwa-select-label", {"bwa-floated": list})}>
                                                                {" "}
                                                                IP Address List
                                                            </label>
                                                        )
                                                        : (<div
                                                            style={{
                                                            marginTop: "10px"
                                                        }}/>)}
                                                    <Select
                                                        fluid
                                                        placeholder="IP Address List"
                                                        value={list
                                                        ? list
                                                        : [""]}
                                                        multiple
                                                        options={this.getOptions()}
                                                        className={classNames("bwa-select-label2", {"bwa-floated": list.length})}
                                                        onChange={this.handleSelect}/>
                                                </div>
                                                {match.params.id !== "new"
                                                    ? (
                                                        <Button
                                                            floated={"right"}
                                                            color={"blue"}
                                                            compact
                                                            onClick={this.downloadList}
                                                            size={"mini"}>
                                                            Download
                                                        </Button>
                                                    )
                                                    : null}
                                                {match.params.id !== "new"
                                                    ? (
                                                        <Button
                                                            floated={"right"}
                                                            color={"blue"}
                                                            compact
                                                            onClick={this.clearList}
                                                            size={"mini"}>
                                                            Clear List
                                                        </Button>
                                                    )
                                                    : null}
                                            </div>
                                        )
                                        : null}
                                    <br/>
                                    <div className="form__inside">
                                        {match.params.id === "new"
                                            ? (
                                                <h5>
                                                    <br/>Enter multiple IP Address List comma or newline separated
                                                </h5>
                                            )
                                            : (
                                                <h5>
                                                    Add new IP Address List comma or newline separated
                                                </h5>
                                            )}
                                        <div>
                                            {domains
                                                ? (
                                                    <label className={classNames("bwa-select-label", {"bwa-floated": name})}>
                                                        {" "}
                                                        Add new IP Address List
                                                    </label>
                                                )
                                                : (<div
                                                    style={{
                                                    marginTop: "10px"
                                                }}/>)}
                                            <TextArea
                                                placeholder="Add new IP Address List"
                                                name="domains"
                                                rows="6"
                                                value={domains}
                                                onChange={this.handleChange}/>
                                        </div>
                                    </div>

                                    <div className="form__inside">
                                        <h5>Upload IP Address List</h5>
                                        <div style={bottomMargin}>
                                            <Dropzone onDrop={this.onListDrop} style={dropStyle}>
                                                <div style={divStyle}>{uploadMessage}</div>
                                            </Dropzone>
                                            {invalidArr.length
                                                ? <Button
                                                        floated={'right'}
                                                        color={'red'}
                                                        compact
                                                        onClick={this.handleShowError}
                                                        size={'mini'}>{this.state.showListError
                                                            ? 'Clear Error'
                                                            : 'List'}</Button>
                                                : null}
                                        </div>
                                        {match.params.id !== "new"
                                            ? (<Checkbox
                                                style={checkboxStyle}
                                                label={"Append to list"}
                                                checked={editStatus === "append"}
                                                onClick={() => this.props.domainListChange({prop: "editStatus", value: "append"})}/>)
                                            : null}
                                        {match.params.id !== "new"
                                            ? (<Checkbox
                                                style={checkboxStyle}
                                                label={"Repalce list"}
                                                checked={editStatus === "replace"}
                                                onClick={() => this.props.domainListChange({prop: "editStatus", value: "replace"})}/>)
                                            : null}
                                    </div>
                                </div>

                                <div className="form__half">
                                    {errorList.length
                                        ? (
                                            <Alert color="danger">
                                                {" "}
                                                There are some errors with your submission
                                            </Alert>
                                        )
                                        : null}
                                    {errorList.length
                                        ? errorList
                                            .length
                                            .map((err, index) => {
                                                return (
                                                    <Alert key={index} color="danger">
                                                        {" "}
                                                        {err}
                                                    </Alert>
                                                );
                                            })
                                        : null}
                                    {this.state.showListError
                                        ? (invalidArr.map((err, index) => {
                                            return <Alert key={index} color='danger'>
                                                {err}</Alert>
                                        }))
                                        : (null)}
                                    {fail
                                        ? (
                                            <Alert color="danger">
                                                {" "}
                                                Failed to create a domain list. Please check your inputs or try again later
                                            </Alert>
                                        )
                                        : null}
                                </div>
                            </form>
                            <Button floated="right" color="blue" onClick={this.cancelAction}>
                                Cancel
                            </Button>
                            <Button floated="right" color="blue" onClick={this.handleSave}>
                                Save
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
            </div>
        );
    }
}

const styles = {
    bottomMargin: {
        marginBottom: "10px"
    },
    dropStyle: {
        width: "100%",
        height: "100px",
        border: "1px black dashed",
        marginBottom: "10px",
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "5px"
    },
    divStyle: {
        paddingTop: "40px",
        paddingLeft: "10px",
        paddingRight: "10px",
        overflowX: "hidden"
    },
    dimmerStyle: {
        height: "100%"
    },
    selectStyle: {
        height: "300px",
        overflowY: "auto"
    },
    checkboxStyle: {
        paddingTop: "7px",
        marginRight: "6px",
        marginLeft: "12px"
    },
    mainDivStyle: {
        marginTop: 10
    }
};

const mapStateToProps = state => {
    const {
        name,
        invalidArr,
        errorName,
        domains,
        uploadMessage,
        errorDomains,
        uploadedDomains,
        errors,
        errorList,
        success,
        fail,
        message,
        list,
        editStatus
    } = state.list;
    const {activeUser} = state.shared;

    return {
        name,
        invalidArr,
        errorName,
        domains,
        uploadMessage,
        errorDomains,
        uploadedDomains,
        errors,
        errorList,
        success,
        fail,
        message,
        list,
        editStatus,
        activeUser
    };
};

export default withRouter(connect(mapStateToProps, {
    domainListChange,
    uploadIpList,
    createDomainList,
    resetDomainListErrors,
    resetDomainListReducer,
    readDomainList,
    updateDomainList,
    cloneDomainList
})(DomainList));
