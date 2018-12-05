import React, { Component } from 'react';
import { Grid, Form, Icon, Button, Message, Loader, Image, Segment, Card, Select, Input, TextArea, Checkbox  } from 'semantic-ui-react';
import { uploadFlightDisplayCreative, changeFlight, resetDisplayErrors, resetDisplayCreative } from '../../redux/actions/flight.actions';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import { listIntegrationsDropdown } from '../../redux/actions/integration.actions';
import { MAX_UPLOAD_SIZE_DISPLAY } from "../../vars";
import Table from '../../components/table/Table';
import { Alert } from "reactstrap";

// const creativeType = [
//   { text: "First Party", value: "first_party" },
//   { text: "Third Party", value: "third_party" },
//   { text: "RTB", value: "rtb" }
// ];

const displaySizes = [
  { text: "728x90", value: "728x90" },
  { text: "160x600", value: "160x600" },
  { text: "300x250", value: "300x250" },
  { text: "300x600", value: "300x600" },
  { text: "300x50", value: "300x50" },
  { text: "320x50", value: "320x50" },
  { text: "768x1024", value: "768x1024" },
  { text: "1024x768", value: "1024x768" },
  { text: "Custom", value: "custom" }
];

const platforms = [
  { text: "AOL One", value: "aolone" },
  { text: "SpotX", value: "spotx" },
  { text: "Double Click", value: "dfp" },
  { text: "Sticky Ads", value: "stickyads" },
  { text: "SpringServe", value: "springserv" },
  { text: "Pubmatic", value: "pubmatic" },
  { text: "OpenX", value: "openx" },
  { text: "Tremor", value: "tremor" },
  { text: "SMART Ad Server", value: "smartads" },
  { text: "AdX", value: "adx" }
];

// const rtb = [
//   { text: "RTBiQ", value: "rtbiq" },
//   { text: "Smart.Bid", value: "smartbid" }
// ];

class FlightDisplayCreatives extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      clickTracker:false,
      impTracker:false,
      mode: '',
      ended: false,
      mediaSource: '',
      pathToPlay:'',
      creativeType: [
        { text: "Hosted", value: "first_party", disabled: this.props.iFlight },
        { text: "Third Party", value: "third_party", disabled: this.props.iFlight }
      ]

    }
  }
  componentWillMount() {
    const loc = window.location.href.includes('/create/new') ? `/` : `${this.props.id}/`;
    this.setState({pathToPlay:loc});
    this.props.listIntegrationsDropdown();
  }
  componentDidMount() {
    if (window.location.href.indexOf('bwaserver') > -1 || window.location.href.indexOf('localhost') > -1) {
      console.log('DEVELOPMENT ENVIRONMENT = development');
      this.setState({ mode: 'development' })
    }
    else {
      console.log('DEVELOPMENT ENVIRONMENT = production');
      this.setState({ mode: 'production' })
    }
  }


  componentDidUpdate(prevProps, prevState) {
    if (this.state.mediaSource !== this.props.fileName) {
      this.setState({ mediaSource: this.props.fileName })
      this.setState({ ended: false });
    }
  }


  handleChange = (event) => {
    if (event.target.name == 'jsTag') {
      let value = event.target.value.trim().replace(/\s/g, '');
      this.props.changeFlight({ prop: event.target.name, value: value });
    }
    else {
      this.props.changeFlight({ prop: event.target.name, value: event.target.value });
    }

  };
  handleCheckbox =(event, data)=>{
    if (data.name == 'clickTracker') {
      this.setState({clickTracker:!this.state.clickTracker})
    } else {
      this.setState({impTracker:!this.state.impTracker})
    }
  }

  reDirect = () => {
    let location = this.props.clickThroughUrl;
    window.open(location, 'target_blank');
  }
  handleChange = (event) => {
    if (event.target.name == 'jsTag') {
      // let value = event.target.value.trim().replace(/\s/g, '');
      this.props.changeFlight({ prop: event.target.name, value: event.target.value });
    }
    else {
      this.props.changeFlight({ prop: event.target.name, value: event.target.value });
    }

  };

  handleSelect = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: data.value });
    if (data.name === "displaySize" && data.value !== "custom") {
      let sizes = data.value.split('x');
      this.props.changeFlight({ prop: 'width', value: Number(sizes[0]) });
      this.props.changeFlight({ prop: 'height', value: Number(sizes[1]) });
    }
    if (data.name === "rtbPlatform") {
      this.props.changeFlight({ prop: 'displayValid', value: true });
    }
    if (data.name === "party") {
      this.props.changeFlight({ prop: 'rtbPlatform', value: '' });
      this.props.changeFlight({ prop: 'displayValid', value: false });
    }
  };

  onDrop = (accepted, rejected) => {
    this.setState({ ended: true });
    this.setState({pathToPlay:'/'});
    if (accepted[0].size > MAX_UPLOAD_SIZE_DISPLAY) {
      this.props.changeFlight({ prop: 'displayMessage', value: "File is bigger than 2MB. Please upload a different file." });
      return;
    }
    this.props.changeFlight({ prop: 'uploading', value: true });
    let payload = new FormData();
    payload.append("upload_file", accepted[0]);

    this.props.uploadFlightDisplayCreative(payload);
  };

  isValidURL = (url) => {
    const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return re.test(url.toLowerCase()) && url.toLowerCase().includes('http');
  };

  isUploadValid = () => {
    this.props.resetDisplayErrors();

    const { creativeName, creativeNotes, clickThroughUrl, impressionTracker, clickTracker, party, fileName, displaySize, width, height, jsTag, platform } = this.props;

    let arr = [];
    if (creativeName === "") {
      arr.push('Please enter creative name');
      this.props.changeFlight({ prop: 'errorCreativeName', value: true });
    }
    if (creativeName !== "" && creativeName.length < 6) {
      arr.push('Creative name shall be at least 6 characters long');
      this.props.changeFlight({ prop: 'errorCreativeName', value: true });
    }
    if (creativeName.length > 100) {
      arr.push('Creative name shall be at most 100 characters long');
      this.props.changeFlight({ prop: 'errorCreativeName', value: true });
    }
    if (creativeNotes.length > 500) {
      arr.push('Creative notes shall be at most 500 characters long');
      this.props.changeFlight({ prop: 'errorCreativeNotes', value: true });
    }
    // if (party === "first_party" && !this.isValidURL(clickThroughUrl)) {
    //   arr.push('Please enter a full valid clickthrough URL');
    //   this.props.changeFlight({ prop: 'errorClickThroughUrl', value: true });
    // }
    if (party === "") {
      arr.push('Please select a creative type');
      this.props.changeFlight({ prop: 'errorParty', value: true });
    }
    else if (party === "first_party") {
      if (fileName === "") {
        arr.push('Please upload a creative');
      } if (displaySize === "") {
        arr.push('Please select a display size');
        this.props.changeFlight({ prop: 'errorDisplaySize', value: true });
      }
    }
    else if (party === "third_party") {
      if (displaySize === "") {
        arr.push('Please select a display size');
        this.props.changeFlight({ prop: 'errorDisplaySize', value: true });
      }
      else if (displaySize === "custom") {
        if (width === "" || isNaN(Number(width))) {
          arr.push('Please enter display width as a number of pixels');
          this.props.changeFlight({ prop: 'errorWidth', value: true });
        }
        if (height === "" || isNaN(Number(height))) {
          arr.push('Please enter display height as a number of pixels');
          this.props.changeFlight({ prop: 'errorHeight', value: true });
        }
      }
      if (jsTag === "") {
        arr.push('Please enter a JS Tag');
        this.props.changeFlight({ prop: 'errorJSTag', value: true });
      }
      if (platform === "") {
        arr.push('Please select a platform');
        this.props.changeFlight({ prop: 'errorPlatform', value: true });
      }
    }

    if (arr.length) {
      this.props.changeFlight({ prop: 'displayErrors', value: arr });
      return false;
    }
    return true;
  };

  handleUpload = (event) => {
    event.preventDefault();

    if (!this.isUploadValid()) {
      return;
    }

    this.props.changeFlight({ prop: 'displayValid', value: true });
  };

  clearUpload = (e) => {
    e.preventDefault();
    this.props.resetDisplayCreative();
  };

  deleteCreative = (event) => {
    this.props.resetDisplayCreative();
  };

  editCreative = (event) => {
    this.props.changeFlight({ prop: 'displayValid', value: false });
  };

  render() {
    const { dropStyle, divStyle, bottomMargin } = styles;
    const {id, displayValid, party, flight_type, errorParty, rtbPlatform, errorRTBPlatform, creativeName, errorCreativeName, creativeNotes, errorCreativeNotes, clickThroughUrl, errorClickThroughURL, errorClickTracker, errorImpressionTracker, clickTracker, impressionTracker, displayMessage, jsTag, errorJSTag, platform, errorPlatform, displaySize, errorDisplaySize, width, errorWidth, height, errorHeight, altText, displayErrors, fileName, uploading, dspList } = this.props;
    return (
      <div>
        {!displayValid && flight_type !== "rtb" ? <form className='form'>
          <div className='form__half'>
            <div className='form__inside' >
               <div className='float-container'>
                {party ? <label className={classNames('bwa-select-label', { 'bwa-floated': party })} >Type</label> : <div style={{marginTop:'8px'}}> </div>}
                <Select placeholder="Type" value={party ? party : ''} selection search fluid name="party" options={this.state.creativeType} onChange={this.handleSelect} error={errorParty} />
              </div>
            </div>

            {party !== "" && party !== "rtb" ? <div className='form__inside' >
               <div className='float-container'>
                {creativeName ? <label className={classNames('bwa-floating-label', { 'bwa-floated': creativeName })} >Title/Name</label> : <div style={{marginTop:'8px'}}> </div>}
                <Input fluid placeholder="Title/Name" type="text" name="creativeName" value={creativeName} onChange={this.handleChange} error={errorCreativeName} />
              </div>
            </div> : null}

            {party !== "" && party !== "rtb" ? <div className='form__inside' >
               <div className='float-container'>
                {creativeNotes ? <label className={classNames('bwa-floating-label', { 'bwa-floated': creativeNotes })}>Notes</label> : <div style={{marginTop:'8px'}}> </div>}
                <TextArea rows={5} placeholder='Notes' name="creativeNotes" rows='3' value={creativeNotes} onChange={this.handleChange} />
              </div>
            </div> : null}

            {party === "first_party" ? <div className='form__inside' >
               <div className='float-container'>
                {clickThroughUrl ? <label className={classNames('bwa-floating-label', { 'bwa-floated': clickThroughUrl })} >Clickthrough URL</label> : <div style={{marginTop:'8px'}}> </div>}
                <Input fluid placeholder="Clickthrough URL" type="text" name="clickThroughUrl" value={clickThroughUrl} onChange={this.handleChange} error={errorClickThroughURL} />
              </div>
            </div> : null}

             {party === "first_party" ? <Checkbox label="Click Tracker &nbsp;" name='clickTracker' onClick={this.handleCheckbox}/>:null}
              {party === "first_party" ? <Checkbox label="Impression Tracker" name='impTracker' onClick={this.handleCheckbox}/>:null}
           

            {this.state.impTracker ? <div className='form__inside' >
               <div className='float-container'>
                {impressionTracker ? <label className={classNames('bwa-floating-label', { 'bwa-floated': impressionTracker })}>Impression Tracker</label> : <div style={{marginTop:'8px'}}> </div>}
                <TextArea rows={5} placeholder='Impression Tracker' name="impressionTracker" rows='3' value={impressionTracker} onChange={this.handleChange} />
              </div>
            </div> : null}

            {this.state.clickTracker ? <div className='form__inside' >
               <div className='float-container'>
                {clickTracker ? <label className={classNames('bwa-floating-label', { 'bwa-floated': clickTracker })}>Click Tracker</label> : <div style={{marginTop:'8px'}}> </div>}
                <TextArea rows={5} placeholder='Click Tracker' name="clickTracker" rows='3' value={clickTracker} onChange={this.handleChange} />
              </div>
            </div> : null}

            {party === "first_party" ? <div className='form__inside' style={bottomMargin}>
              <Dropzone onDrop={this.onDrop.bind(this)} style={dropStyle}>
                <div style={divStyle}>{!uploading ? displayMessage : <Loader size={'small'} active inline={'centered'}></Loader>}</div>
              </Dropzone>
            </div> : null}

            {party === "third_party" ? <div className='form__inside' >
               <div className='float-container'>
                {jsTag.length ? <label className={classNames('bwa-floating-label', { 'bwa-floated': jsTag })}>JS tag URL</label> : <div style={{marginTop:'8px'}}> </div>}
                <TextArea rows={5} placeholder='JS tag URL' name="jsTag" id="jsTag" rows='3' value={jsTag} onChange={this.handleChange} />
              </div>
            </div> : null}
            {party === "third_party" ? <div className='form__inside' >
               <div className='float-container'>
                {platform ? <label className={classNames('bwa-select-label', { 'bwa-floated': platform })} >Platform</label> : <div style={{marginTop:'8px'}}> </div>}
                <Select placeholder="Platform" value={platform ? platform : ''} selection search fluid name="platform" options={platforms} onChange={this.handleSelect} error={errorPlatform} />
              </div>
            </div> : null}

            {party === "rtb" || party === "third_party" || party === "first_party" ? <div className='form__inside' >
               <div className='float-container'>
                {displaySize ? <label className={classNames('bwa-select-label', { 'bwa-floated': displaySize })} >Display Size</label> : <div style={{marginTop:'8px'}}> </div>}
                <Select placeholder="Display Size" value={displaySize ? displaySize : ''} selection search fluid name="displaySize" options={displaySizes} onChange={this.handleSelect} error={errorDisplaySize} />
              </div>
            </div> : null}
            {displaySize === "custom" ? <div className='form__inside' >
               <div className='float-container'>
                {width ? <label className={classNames('bwa-floating-label', { 'bwa-floated': width })} >Display width (pixels)</label> : <div style={{marginTop:'8px'}}> </div>}
                <Input fluid placeholder="Display width (pixels)" type="text" name="width" value={width} onChange={this.handleChange} error={errorWidth} />
              </div>
            </div> : null}
            {displaySize === "custom" ? <div className='form__inside' >
               <div className='float-container'>
                {height ? <label className={classNames('bwa-floating-label', { 'bwa-floated': height })} >Display height (pixels)</label> : <div style={{marginTop:'8px'}}> </div>}
                <Input fluid placeholder="Display height (pixels)" type="text" name="height" value={height} onChange={this.handleChange} error={errorHeight} />
              </div>
            </div> : null}
          </div>

            <div className='form__half'>
              {displayErrors.length ? <h5>There are some errors with your submission </h5> : null}
            {displayErrors.length ? (displayErrors.map((err, index) => {
                return <Alert key={index} color='danger'> {err}</Alert>
              })) : (null)}

              {this.state.mediaSource !== '' && !this.state.ended && <Card style={{ width: width }} >
                <Card.Content >
                </Card.Content>
                <Card.Content extra onClick={this.reDirect} style={{ width: width, height: height + 30 }}>
                  {(this.state.mode == 'development') ? (<Image floated='right' src={`http://display.bwacdn.com/${this.state.pathToPlay}${this.state.mediaSource}`} width={`${width}px`} height={`${height}px`} />) : (<Image floated='right' src={`https://display.pilotx.tv/${this.state.pathToPlay}${this.state.mediaSource}`} width={`${width}px`} height={`${height}px`} />)}
                </Card.Content>
              </Card>
              }
            </div>
         {party !== "" && party !== "rtb" ? <div className='form__full' >
            <Button floated='right' onClick={this.handleUpload}>Save</Button>
            <Button floated='right' onClick={this.clearUpload}>Clear</Button>
          </div>:null}
        </form> : null}




        {displayValid && party !== "" && party !== "rtb" ? <Table responsive className='table--bordered dashboard__table-crypto'>
          <thead>
            <tr>
              <th>Name</th>
              <th>File</th>
              <th>Size</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
            </thead>
          <tbody>
            <tr>
              <td>{creativeName}</td>
              <td>{party === "first_party" ? fileName.substr(0, 70) : jsTag.substr(0, 70)}</td>
              <td>{width + 'x' + height}</td>
              <td>{party === "first_party" ? "Hosted" : "Third Party"}</td>
              <td>
                <Icon name="edit" onClick={this.editCreative} />
                <Icon name="trash" onClick={this.deleteCreative} />
              </td>
            </tr>
          </tbody>
        </Table> : null}
      </div>
    )
  }
}

const styles = {
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
  bottomMargin: {
    marginBottom: "10px"
  }
};

const mapStateToProps = state => {
  const {id, displayValid,flight_type, party, errorParty, rtbPlatform, errorRTBPlatform, creativeName, errorCreativeName, creativeNotes, errorCreativeNotes, clickThroughUrl, errorClickThroughURL, impressionTracker, errorImpressionTracker, clickTracker, errorClickTracker, displayMessage, jsTag, errorJSTag, platform, errorPlatform, displaySize, errorDisplaySize, width, errorWidth, height, errorHeight, altText, displayErrors, fileName, uploading, dspList, iFlight } = state.flight;

  return { id, displayValid, party, flight_type, errorParty, rtbPlatform, errorRTBPlatform, creativeName, errorCreativeName, creativeNotes, errorCreativeNotes, clickThroughUrl, errorClickThroughURL, impressionTracker, errorImpressionTracker, clickTracker, errorClickTracker, displayMessage, jsTag, errorJSTag, platform, errorPlatform, displaySize, errorDisplaySize, width, errorWidth, height, errorHeight, altText, displayErrors, fileName, uploading, dspList, iFlight };
};

export default connect(mapStateToProps, { uploadFlightDisplayCreative, changeFlight, resetDisplayErrors, resetDisplayCreative, listIntegrationsDropdown })(FlightDisplayCreatives);
