import React, { Component } from "react";
import {
  Icon,
  Button,
  Loader,
  Segment,
  Select,
  Input,
  TextArea,
  Checkbox
} from "semantic-ui-react";
import classNames from "classnames";
import Table from "../../components/table/Table";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import {
  uploadFlightVideoCreative,
  uploadFlightCompanionCreative,
  changeFlight,
  resetVideoErrors,
  resetVideoCreative
} from "../../redux/actions/flight.actions";
import { listIntegrationsDropdown } from "../../redux/actions/integration.actions";
import { Player, ControlBar, BigPlayButton } from "video-react";
import "../../../node_modules/video-react/dist/video-react.css";
import { MAX_UPLOAD_SIZE_DISPLAY, MAX_UPLOAD_SIZE_VIDEO } from "../../vars";
import { Alert } from "reactstrap";

// const creativeType = [
//   { text: "First Party", value: "first_party", disabled: this.props.iFlight },
//   { text: "Third Party", value: "third_party", disabled: this.props.iFlight},
//   { text: "RTB", value: "rtb" }
// ];

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
  { text: "AdX", value: "adx" },
  { text: "LKQD", value: "lkqd" },
  { text: "Other", value: "other" }
];

// const rtb = [
//   { text: "RTBiQ", value: "rtbiq" },
//   { text: "Smart.Bid", value: "smartbid" }
// ];

class FlightVideoCreatives extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      clickTracker:false,
      impTracker:false,
      mode: "",
      playerSource: "",
      player: "",
      ended: false,
      myTimer: 0,
      adsManager: null,
      tagFail: "",
      pathToPlay:'',
      creativeType: [
        {
          text: "Hosted",
          value: "first_party",
          disabled: this.props.iFlight
        },
        {
          text: "Third Party",
          value: "third_party",
          disabled: this.props.iFlight
        }
      ]
    };
  }

  componentDidMount() {
    if (
      window.location.href.indexOf("bwaserver") > -1 ||
      window.location.href.indexOf("localhost") > -1
    ) {
      console.log("DEVELOPMENT ENVIRONMENT = development");
      this.setState({ mode: "development" });
    } else {
      console.log("DEVELOPMENT ENVIRONMENT = production");
      this.setState({ mode: "production" });
    }
  }

  componentWillMount() {
    const loc = window.location.href.includes('/create/new') ? `/` : `${this.props.id}/`;
    this.setState({pathToPlay:loc});
    this.props.listIntegrationsDropdown();
  }
  // getBitset = () => {
  //   this.props.dspList.map((value, index) => {
  //     this.setState({ bitList: this.props.rtbPlatform & value })
  //   })
  // }

  componentDidUpdate(prevProps, prevState) {
    if (this.refs.player) {
      this.refs.player.subscribeToStateChange(
        this.handleStateChange.bind(this)
      );
    }
    if (this.state.playerSource !== this.props.fileName) {
      this.setState({ playerSource: this.props.fileName });
      this.setState({ ended: false });
      if (this.refs.player) {
        this.refs.player.load();
      }
    }
  }

  handleCheckbox =(event, data)=>{
    if (data.name == 'clickTracker') {
      this.setState({clickTracker:!this.state.clickTracker})
    } else {
      this.setState({impTracker:!this.state.impTracker})
    }
  }

  playThirdParty = (e) => {
    e.preventDefault();
    if (this.props.jsTag == "") {
      let arr = [];
      arr.push("Please enter a JS Tag");
      this.props.changeFlight({ prop: "errorJSTag", value: true });
      return;
    }
    this.setState({ myTimer: this.state.myTimer + 1 });
    let adsManager;
    let adsLoader;
    let adDisplayContainer;
    let playButton;
    let videoContent;
    let adsInitialized;
    let autoplayAllowed;
    let autoplayRequiresMuted;
    let intervalTimer;
    let responseTime = 0;
    let responseTimer;
    let self = this;

    videoContent = document.getElementById("content_video");
    function initAutoplay() {
      setUpIMA();
      // Check if autoplay is supported.
      checkAutoplaySupport();
    }

    function checkAutoplaySupport() {
      // Test for autoplay support with our content player.
      let playPromise = videoContent.play();
      if (playPromise !== undefined) {
        playPromise
          .then(onAutoplayWithSoundSuccess)
          .catch(onAutoplayWithSoundFail);
      }
    }

    function onAutoplayWithSoundSuccess() {
      // If we make it here, unmuted autoplay works.
      videoContent.pause();
      autoplayAllowed = true;
      autoplayRequiresMuted = false;
      autoplayChecksResolved();
    }

    function onAutoplayWithSoundFail() {
      // Unmuted autoplay failed. Now try muted autoplay.
      checkMutedAutoplaySupport();
    }

    function checkMutedAutoplaySupport() {
      videoContent.volume = 0;
      videoContent.muted = true;
      let playPromise = videoContent.play();
      if (playPromise !== undefined) {
        playPromise.then(onMutedAutoplaySuccess).catch(onMutedAutoplayFail);
      }
    }

    function onMutedAutoplaySuccess() {
      // If we make it here, muted autoplay works but unmuted autoplay does not.
      videoContent.pause();
      autoplayAllowed = true;
      autoplayRequiresMuted = true;
      autoplayChecksResolved();
    }

    function onMutedAutoplayFail() {
      // Both muted and unmuted autoplay failed. Fall back to click to play.
      videoContent.volume = 1;
      videoContent.muted = false;
      autoplayAllowed = false;
      autoplayRequiresMuted = false;
      autoplayChecksResolved();
    }

    function setUpIMA() {
      // Create the ad display container.
      createAdDisplayContainer();
      // Create ads loader.
      adsLoader = new google.ima.AdsLoader(adDisplayContainer);
      // Temp fix for chrome
      adsLoader
        .getSettings()
        .setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.INSECURE);
      // Listen and respond to ads loaded and error events.
      adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false
      );
      adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false
      );

      // An event listener to tell the SDK that our content video
      // is completed so the SDK can play any post-roll ads.
      videoContent.onended = contentEndedListener;
    }

    function contentEndedListener() {
      videoContent.onended = null;
      if (adsLoader) {
        adsLoader.contentComplete();
      }
    }

    function autoplayChecksResolved() {
      // Request video ads.
      let adsRequest = new google.ima.AdsRequest();
      adsRequest.adTagUrl = document.getElementById("jsTag").value;

      // Specify the linear and nonlinear slot sizes. This helps the SDK to
      // select the correct creative if multiple are returned.
      adsRequest.linearAdSlotWidth = 562;
      adsRequest.linearAdSlotHeight = 316;

      adsRequest.nonLinearAdSlotWidth = 562;
      adsRequest.nonLinearAdSlotHeight = 150;

      adsRequest.setAdWillAutoPlay(autoplayAllowed);
      adsRequest.setAdWillPlayMuted(autoplayRequiresMuted);
      adsLoader.requestAds(adsRequest);
    }

    function createAdDisplayContainer() {
      // We assume the adContainer is the DOM id of the element that will house
      // the ads.
      adDisplayContainer = new google.ima.AdDisplayContainer(
        document.getElementById("adContainer"),
        videoContent
      );
    }

    function playAds() {
      try {
        if (!adsInitialized) {
          adDisplayContainer.initialize();
          adsInitialized = true;
        }
        adsManager.init(562, 316, google.ima.ViewMode.NORMAL);
        adsManager.start();
      } catch (adError) {
        videoContent.play();
      }
    }

    function onAdsManagerLoaded(adsManagerLoadedEvent) {
      let adsRenderingSettings = new google.ima.AdsRenderingSettings();
      adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
      // videoContent should be set to the content video element.
      adsManager = adsManagerLoadedEvent.getAdsManager(
        videoContent,
        adsRenderingSettings
      );
      self.setState({ adsManager: adsManager });
      adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError
      );
      adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested
      );
      adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested
      );
      adsManager.addEventListener(
        google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        onAdEvent
      );
      adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, onAdEvent);
      adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, onAdEvent);
      adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdEvent);
      adsManager.addEventListener(
        google.ima.AdEvent.Type.FIRST_QUARTILE,
        onAdEvent
      );
      adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, onAdEvent);
      adsManager.addEventListener(google.ima.AdEvent.Type.MIDPOINT, onAdEvent);
      adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, onAdEvent);
      adsManager.addEventListener(
        google.ima.AdEvent.Type.THIRD_QUARTILE,
        onAdEvent
      );
      if (autoplayAllowed) {
        playAds();
      }
    }

    function onAdError(adErrorEvent) {
      console.log("AD FAILED");

      self.setState({ tagFail: "Ad failed to load!" });
      if (self.state.adsManager !== null) {
        self.state.adsManager.destroy();
        self.setState({ adsManager: null });
      }
    }

    function restart() {
      if (self.state.adsManager !== null) {
        self.state.adsManager.destroy();
      }
    }

    function onAdEvent(adEvent) {
      switch (adEvent.type) {
        case google.ima.AdEvent.Type.LOADED:
          self.setState({ tagFail: "" });
          break;
        case google.ima.AdEvent.Type.STARTED:
          break;
        case google.ima.AdEvent.Type.FIRST_QUARTILE:
          break;
        case google.ima.AdEvent.Type.CLICK:
          break;
        case google.ima.AdEvent.Type.MIDPOINT:
          break;
        case google.ima.AdEvent.Type.THIRD_QUARTILE:
          break;
        case google.ima.AdEvent.Type.COMPLETE:
          break;
        case google.ima.AdEvent.Type.PAUSED:
          break;
      }
    }

    function onContentPauseRequested() {
      videoContent.pause();
      videoContent.onended = null;
    }

    function onContentResumeRequested() {
      videoContent.play();
      videoContent.onended = contentEndedListener;
    }

    function playAds() {
      videoContent.load();
      adDisplayContainer.initialize();
      try {
        adsManager.init(562, 316, google.ima.ViewMode.NORMAL);
        adsManager.start();
      } catch (adError) {
        videoContent.play();
      }
    }

    if (this.state.myTimer >= 1) {
      restart();
      initAutoplay();
      playAds();
    } else {
      initAutoplay();
    }
  };

  refresh = e => {
    e.preventDefault();
    this.refs.player.load();
  };

  reDirect = () => {
    let location = this.props.clickThroughUrl;
    window.open(location, "target_blank");
  };

  handleChange = event => {
    if (event.target.name == "jsTag") {
      // let value = event.target.value.trim().replace(/\s/g, "");
      this.props.changeFlight({ prop: event.target.name, value: event.target.value });
    } else {
      this.props.changeFlight({
        prop: event.target.name,
        value: event.target.value
      });
    }
  };
  handleStateChange(state, prevState) {
    // copy player state to this component's state
    this.setState({
      player: state,
      ended: state.ended
    });
  }
  handleSelect = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: data.value });
    if (data.name === "rtbPlatform") {
      this.props.changeFlight({ prop: "videoValid", value: true });
    }
    if (data.name === "party") {
      this.props.changeFlight({ prop: "rtbPlatform", value: "" });
      this.props.changeFlight({ prop: "videoValid", value: false });
    }
  };

  onVideoDrop = (accepted, rejected) => {
    if (accepted[0].size > MAX_UPLOAD_SIZE_VIDEO) {
      this.props.changeFlight({
        prop: "videoMessage",
        value: "File is bigger than 99MB. Please upload a different file."
      });
      return;
    }
    this.setState({pathToPlay:'/'});
    this.props.changeFlight({ prop: "uploading", value: true });
    let payload = new FormData();
    payload.append("upload_file", accepted[0]);
    console.log('HERE = ', payload)

    this.props.uploadFlightVideoCreative(payload);
  };

  onCompanionDrop = (accepted, rejected) => {
    this.setState({ ended: true });
    this.setState({pathToPlay:'/'});
    console.log('GOT TO THIS POINT!');
    if (accepted[0].size > MAX_UPLOAD_SIZE_DISPLAY) {
      this.props.changeFlight({
        prop: "companionMessage",
        value: "File is bigger than 2MB. Please upload a different file."
      });
      return;
    }
    let payload = new FormData();
    payload.append("upload_file", accepted[0]);
    this.props.uploadFlightCompanionCreative(payload);
  };

  isValidURL = url => {
    const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return re.test(url.toLowerCase()) && url.toLowerCase().includes("http");
  };

  isVideoUploadValid = () => {
    this.props.resetVideoErrors();

    const {
      creativeName,
      creativeNotes,
      clickThroughUrl,
      impressionTracker,
      clickTracker,
      party,
      fileName,
      jsTag,
      platform
    } = this.props;

    let arr = [];
    if (creativeName === "") {
      arr.push("Please enter creative name");
      this.props.changeFlight({ prop: "errorCreativeName", value: true });
    }
    if (creativeName !== "" && creativeName.length < 6) {
      arr.push("Creative name shall be at least 6 characters long");
      this.props.changeFlight({ prop: "errorCreativeName", value: true });
    }
    if (creativeName.length > 100) {
      arr.push("Creative name shall be at most 100 characters long");
      this.props.changeFlight({ prop: "errorCreativeName", value: true });
    }
    if (creativeNotes.length > 500) {
      arr.push("Creative notes shall be at most 500 characters long");
      this.props.changeFlight({ prop: "errorCreativeNotes", value: true });
    }
    // if (party === "first_party" && !this.isValidURL(clickThroughUrl)) {
    //   arr.push('Please enter a full valid clickthrough URL');
    //   this.props.changeFlight({ prop: 'errorClickThroughURL', value: true });
    // }
    if (party === "") {
      arr.push("Please select a creative type");
      this.props.changeFlight({ prop: "errorParty", value: true });
    } else if (party === "first_party") {
      if (fileName === "") {
        arr.push("Please upload a creative");
      }
    } else if (party === "third_party") {
      if (jsTag === "") {
        arr.push("Please enter a JS Tag");
        this.props.changeFlight({ prop: "errorJSTag", value: true });
      } else if (jsTag.includes("http://")) {
        const httpsTag = jsTag.replace("http://", "https://");
        this.props.changeFlight({ prop: "jsTag", value: httpsTag });
      }
      if (platform === "") {
        arr.push("Please select a platform");
        this.props.changeFlight({ prop: "errorPlatform", value: true });
      }
    }

    if (arr.length > 0) {
      this.props.changeFlight({ prop: "videoErrors", value: arr });
      return false;
    }
    return true;
  };

  isCompanionUploadValid = () => {
    return true;
  };

  handleVideoUpload = event => {
    event.preventDefault();

    if (!this.isVideoUploadValid()) {
      return;
    }

    this.props.changeFlight({ prop: "videoValid", value: true });
  };

  handleCompanionUpload = event => {
    event.preventDefault();

    if (!this.isCompanionUploadValid()) {
      return;
    }

    // this.props.callback()
  };

  clearVideoUpload = (e) => {
    e.preventDefault();
    this.props.resetVideoCreative();
  };

  clearCompanionUpload = () => {};

  deleteVideoCreative = () => {
    this.props.resetVideoCreative();
  };

  deleteCompanionCreative = index => {};

  editVideoCreative = () => {
    this.props.changeFlight({ prop: "videoValid", value: false });
  };

  editCompanionCreative = () => {};

  render() {
    const { dropStyle, divStyle, bottomMargin } = styles;
    const {
      flight_type,
      videoValid,
      party,
      errorParty,
      rtbPlatform,
      errorRTBPlatform,
      creativeName,
      errorCreativeName,
      creativeNotes,
      errorCreativeNotes,
      clickThroughUrl,
      errorClickThroughURL,
      impressionTracker,
      errorImpressionTracker,
      clickTracker,
      errorClickTracker,
      videoMessage,
      jsTag,
      errorJSTag,
      platform,
      errorPlatform,
      altText,
      videoErrors,
      fileName,
      duration,
      bitrate,
      uploading,
      dspList,
      id
    } = this.props;

    return (
      <div>
        {!videoValid && flight_type !== "rtb" ? (
          <form className="form">
            <div className="form__half">
              {flight_type == "standard" ? (
                <div className="form__inside">
                  <div className="float-container">
                    {party ? (
                      <label
                        className={classNames("bwa-select-label", {
                          "bwa-floated": party
                        })}
                      >
                        Type
                      </label>
                    ) : (
                      <label> </label>
                    )}
                    <Select
                      placeholder="Type"
                      value={party ? party : ""}
                      selection
                      search
                      fluid
                      name="party"
                      options={this.state.creativeType}
                      onChange={this.handleSelect}
                      error={errorParty}
                    />
                  </div>
                </div>
              ) : null}
              {party !== "" && party !== "rtb" ? (
                <div className="form__inside">
                  <div className="float-container">
                    {creativeName ? (
                      <label
                        className={classNames("bwa-floating-label", {
                          "bwa-floated": creativeName
                        })}
                      >
                        Title/Name
                      </label>
                    ) : (
                      <label> </label>
                    )}
                    <Input
                      fluid
                      placeholder="Title/Name"
                      type="text"
                      name="creativeName"
                      value={creativeName}
                      onChange={this.handleChange}
                      error={errorCreativeName}
                    />
                  </div>
                </div>
              ) : null}

              {party !== "" && party !== "rtb" ? (
                <div className="form__inside" >
                  <div className="float-container">
                    {creativeNotes ? (
                      <label
                        className={classNames("bwa-floating-label", {
                          "bwa-floated": creativeNotes
                        })}
                      >
                        Notes
                      </label>
                    ) : (
                      <div style={{marginTop:'8px'}}> </div>
                    )}
                    <TextArea
                      rows={5}
                      placeholder="Notes"
                      name="creativeNotes"
                      rows="3"
                      value={creativeNotes}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              ) : null}

              {party === "first_party" ? (
                <div className="form__inside">
                  <div className="float-container">
                    {clickThroughUrl ? (
                      <label
                        className={classNames("bwa-floating-label", {
                          "bwa-floated": clickThroughUrl
                        })}
                      >
                        Clickthrough URL
                      </label>
                    ) : (
                      <label> </label>
                    )}
                    <Input
                      fluid
                      placeholder="Clickthrough URL"
                      type="text"
                      name="clickThroughUrl"
                      value={clickThroughUrl}
                      onChange={this.handleChange}
                      error={errorClickThroughURL}
                    />
                  </div>
                </div>
              ) : null}
              {party === "first_party" ? <Checkbox label="Click Tracker &nbsp;" name='clickTracker' onClick={this.handleCheckbox}/>:null}
              {party === "first_party" ? <Checkbox label="Impression Tracker" name='impTracker' onClick={this.handleCheckbox}/>:null}
              {this.state.clickTracker ? (
                <div className="form__inside">
                  <div className="float-container">
                    {clickTracker ? (
                      <label
                        className={classNames("bwa-floating-label", {
                          "bwa-floated": clickTracker
                        })}
                      >
                        Click Tracker
                      </label>
                    ) : (
                      <label> </label>
                    )}
                    <TextArea
                      rows={5}
                      placeholder="Click Tracker"
                      name="clickTracker"
                      rows="3"
                      value={clickTracker}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              ) : null}

              {this.state.impTracker ? (
                <div className="form__inside">
                  <div className="float-container">
                    {impressionTracker ? (
                      <label
                        className={classNames("bwa-floating-label", {
                          "bwa-floated": impressionTracker
                        })}
                      >
                        Impression Tracker
                      </label>
                    ) : (
                      <label> </label>
                    )}
                    <TextArea
                      rows={5}
                      placeholder="Impression Tracker"
                      name="impressionTracker"
                      rows="3"
                      value={impressionTracker}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              ) : null}

              {party === "first_party" ? (
                <div className="form__inside" style={bottomMargin}>
                  <Dropzone
                    onDrop={this.onVideoDrop.bind(this)}
                    style={dropStyle}
                  >
                    <div style={divStyle}>
                      {!uploading ? (
                        videoMessage
                      ) : (
                        <Loader size={"small"} active inline={"centered"}>
                        </Loader>
                                            )}
                    </div>
                  </Dropzone>
                </div>
              ) : null}

              {party === "third_party" ? (
                <div className="form__inside">
                  <div className="float-container">
                    {jsTag ? (
                      <label
                        className={classNames("bwa-floating-label", {
                          "bwa-floated": jsTag
                        })}
                      >
                        JS tag URL
                      </label>
                    ) : (
                      <div style={{marginTop:'8px'}}> </div>
                    )}
                    <TextArea
                      rows={5}
                      placeholder="JS tag URL"
                      name="jsTag"
                      id="jsTag"
                      rows="3"
                      value={jsTag}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              ) : null}
              {party === "third_party" ? (
                <div className="form__inside">
                  <div className="float-container">
                    {platform ? (
                      <label
                        className={classNames("bwa-select-label", {
                          "bwa-floated": platform
                        })}
                      >
                        Platform
                      </label>
                    ) : (
                      <div style={{marginTop:'8px'}}> </div>
                    )}
                    <Select
                      placeholder="Platform"
                      value={platform ? platform : ""}
                      selection
                      search
                      fluid
                      name="platform"
                      options={platforms}
                      onChange={this.handleSelect}
                      error={errorPlatform}
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="form__half">
              {videoErrors.length ? (
                <h5>There are some errors with your submission: </h5>
              ) : null}
              {videoErrors.length
                ? videoErrors.map((err, index) => {
                    return (
                      <Alert key={index} color="danger">
                        {" "}
                        {err}
                      </Alert>
                    );
                  })
                : null}

              {this.state.tagFail !== "" ? (
                <Alert color="danger"> Ad Preview failed </Alert>
              ) : null}
              {this.state.playerSource !== "" &&
                this.props.party == "first_party" && (
                  <div>
                    <Segment padded onClick={this.reDirect}>
                      {" "}
                      <Player ref="player" autoPlay>
                        <BigPlayButton position="center" />
                        {this.state.mode == "development" ? (
                          <source
                            src={`http://video.bwacdn.com/${this.state.pathToPlay}${
                              this.state.playerSource
                            }`}
                          />
                        ) : (
                          <source
                            src={`https://video.pilotx.tv/${
                              this.state.playerSource
                            }`}
                          />
                        )}

                        <ControlBar
                          autoHide={false}
                          disableDefaultControls={true}
                        />
                      </Player>
                    </Segment>
                    <div
                      className="ui two buttons"
                      style={{
                        marginLeft: "40%",
                        width: "20%",
                        textAlign: "center"
                      }}
                    >
                      <Button basic color="blue" onClick={this.refresh}>
                        Refresh
                      </Button>
                    </div>
                  </div>
                )}
              {this.props.party == "third_party" && (
                <div style={{width:'670px'}}> 
                  <Segment style={{ width: "670px" }}>
                    <div id="display-holder">
                      <video id="content_video">
                        <source
                          src="http://trade.pilotx.tv/tagtester/img/pilot.mp4"
                          type="video/mp4"
                        />
                      </video>
                    </div>
                    {/* <div id="adContainer" /> */}
                  </Segment>
                  <div
                    className="ui two buttons"
                    style={{
                      marginLeft: "40%",
                      width: "20%",
                      textAlign: "center"
                    }}
                  >
                    <Button
                      basic
                      color="blue"
                      id="playVid"
                      onClick={this.playThirdParty}
                    >
                      Play
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {party !== "" && party !== "rtb" ? (
              <div className="form__full">
                <Button floated="right" onClick={this.handleVideoUpload}>
                  Save
                </Button>
                <Button floated="right" onClick={this.clearVideoUpload}>
                  Clear
                </Button>
              </div>
            ) : null}
          </form>
        ) : null}
        {videoValid && party !== "" && party !== "rtb" ? (
          <Table responsive className="table--bordered dashboard__table-crypto">
            <thead>
              <tr>
                <th>Name</th>
                <th>File</th>
                <th>Duration</th>
                <th>Bitrate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{creativeName}</td>
                <td>
                  {party === "first_party"
                    ? fileName.substr(0, 70)
                    : jsTag.substr(0, 70)}
                </td>
                <td>{party === "first_party" ? `${duration} sec` : "N/A"}</td>
                <td>{party === "first_party" ? bitrate : "N/A"}</td>
                <td>
                  <Icon name="edit" onClick={this.editVideoCreative} />
                  <Icon name="trash" onClick={this.deleteVideoCreative} />
                </td>
              </tr>
            </tbody>
          </Table>
        ) : null}
      </div>
    );
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
  },
  dimmerStyle: {
    height: "100px"
  }
};

const mapStateToProps = state => {
  const {
    videoValid,
    flight_type,
    party,
    errorParty,
    rtbPlatform,
    errorRTBPlatform,
    creativeName,
    errorCreativeName,
    creativeNotes,
    errorCreativeNotes,
    clickThroughUrl,
    errorClickThroughURL,
    impressionTracker,
    errorImpressionTracker,
    clickTracker,
    errorClickTracker,
    videoMessage,
    jsTag,
    errorJSTag,
    platform,
    errorPlatform,
    width,
    height,
    errorWidth,
    errorHeight,
    altText,
    videoErrors,
    fileName,
    duration,
    bitrate,
    uploading,
    dspList,
    iFlight,
    rtbList,
    id
  } = state.flight;

  return {
    videoValid,
    flight_type,
    party,
    errorParty,
    rtbPlatform,
    errorRTBPlatform,
    creativeName,
    errorCreativeName,
    creativeNotes,
    errorCreativeNotes,
    clickThroughUrl,
    errorClickThroughURL,
    impressionTracker,
    errorImpressionTracker,
    clickTracker,
    errorClickTracker,
    videoMessage,
    jsTag,
    errorJSTag,
    platform,
    errorPlatform,
    width,
    height,
    errorWidth,
    errorHeight,
    altText,
    videoErrors,
    fileName,
    duration,
    bitrate,
    uploading,
    dspList,
    iFlight,
    rtbList,
    id
  };
};

export default connect(
  mapStateToProps,
  {
    uploadFlightVideoCreative,
    uploadFlightCompanionCreative,
    changeFlight,
    resetVideoErrors,
    resetVideoCreative,
    listIntegrationsDropdown
  }
)(FlightVideoCreatives);
