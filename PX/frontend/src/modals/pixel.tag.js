import React, {Component} from "react";
import Alert from "../components/Alert";
import {
    Card,
    CardBody,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Col
} from "reactstrap";
import {modalStateChange, resetModalReducer} from "../redux/actions/modals.actions";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {
    Popup,
    Input,
    Checkbox,
    Select,
    TextArea,
    Button as Buttons
} from "semantic-ui-react";

const tagOptions = [
    {
        value: 0,
        text: "Select Type"
    }, {
        value: 1,
        text: "Conversion"
    }, {
        value: 2,
        text: "Re-targeted"
    }, {
        value: 3,
        text: "Re-targeted and Conversion"
    }
];

class PixelTag extends Component {
    state = {
        is_conversion_pixel: false,
        is_container_pixel: 0
    };
    componentWillMount() {
        console.log(" ENV = id ", process.env.NODE_ENV)
    }
    close = () => {
        this
            .props
            .modalStateChange({prop: "showPixelTag", value: false});
        this
            .props
            .resetModalReducer();
    };

    copyTag = e => {
        e.preventDefault();
        document
            .getElementById("tagClip")
            .select();
        document.execCommand("Copy");
    };

    copyConvTag = e => {
        e.preventDefault();
        document
            .getElementById("convTagClip")
            .select();
        document.execCommand("Copy");
    };

    copyContainerTag = e => {
        e.preventDefault();
        document
            .getElementById("containerTagClip")
            .select();
        document.execCommand("Copy");
    };
    convRetargetClip = e => {
        e.preventDefault();
        document
            .getElementById("convRetargetClip")
            .select();
        document.execCommand("Copy");
    };

    handleCheckbox = e => {
        e.preventDefault();
        this.setState({
            is_conversion_pixel: !this.state.is_conversion_pixel
        });
    };
    handleContainerTag = (e, data) => {
        e.preventDefault();
        console.log('VALUE = ', data.value)
        this.setState({is_container_pixel: data.value});

    };

    render() {
        const {showPixelTag, pixelTag, errorMessage, error} = this.props;

        if (!pixelTag) {
            return <Modal isOpen={showPixelTag} toggle={this.toggle}/>;
        }

        if (error) {
            return (
                <Modal isOpen={showPixelTag} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Error!</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" className="alert--neutral" icon>
                            {errorMessage}
                        </Alert>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.close}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            );
        }

        return (
            <Modal isOpen={showPixelTag} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>
                    {this.props.pixelTag.isCampaign
                        ? "Campaign "
                        : "Flight "}
                    Pixel Tag
                </ModalHeader>
                <ModalBody>
                    <Col md={12} lg={12}>
                        <Card>
                            <CardBody>
                                <div>
                                    {/* <Checkbox label='Get Container Script' onClick={this.handleContainerCheckbox} style={{margin:"10px"}}/> */}
                                    {this.props.pixelTag.isCampaign
                                        ? (
                                            <div>
                                                <h5>
                                                    Get Pixel Script
                                                </h5>
                                                <Select
                                                    fluid
                                                    options={tagOptions}
                                                    value={this.state.is_container_pixel}
                                                    onChange={this.handleContainerTag}/> {this.state.is_container_pixel
                                                    ? (
                                                        <div>
                                                            <hr/>
                                                            <h5>{this.state.is_container_pixel == 1
                                                                    ? 'CONVERSION PIXEL'
                                                                    : this.state.is_container_pixel == 2
                                                                        ? 'RE-TARGETING PIXEL'
                                                                        : 'CONVERSION AND RE-TARGETING PIXEL'}</h5>{" "}
                                                            <Input
                                                                action
                                                                size={"large"}
                                                                fluid
                                                                value={`<script id='pilotxradar' src='//tagmanager.pilotx.tv/radar.js?fid=${this.props.pixelTag.id}&daid=${this.props.pixelTag.account_id}&aid=${this.props.pixelTag.advertiser_id}&cid=${this.props.pixelTag.campaign_id}&zid=${this.props.pixelTag.zone_id}${this.state.is_container_pixel == 1 ?'&type=2': this.state.is_container_pixel == 2? '&type=1':'&type=3'}'></script>`}
                                                                onChange={() => {}}>
                                                                <input id={"convRetargetClip"}/>
                                                                <Popup
                                                                    on={"click"}
                                                                    trigger={< Buttons basic icon = {
                                                                    "tags"
                                                                }
                                                                onClick = {
                                                                    this.convRetargetClip
                                                                } />}
                                                                    content={"Copied!"}
                                                                    size={"mini"}/>
                                                            </Input>
                                                        </div>
                                                    )
                                                    : null}
                                            </div>
                                        )
                                        : null}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </ModalBody>

                <ModalFooter>
                    <Button color="info" onClick={this.close}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    const {showPixelTag, pixelTag, error, errorMessage} = state.modal;

    return {showPixelTag, pixelTag, error, errorMessage};
};

export default withRouter(connect(mapStateToProps, {modalStateChange, resetModalReducer})(PixelTag));
