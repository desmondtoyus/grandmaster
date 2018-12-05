import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, Input, TextArea, Checkbox } from 'semantic-ui-react';
import { Alert } from 'reactstrap';
import { ROLE_OPSADMIN, ROLE_SUPERADMIN } from "../../roles";
import { changePlacement } from "../../redux/actions/placement.actions";
import classNames from 'classnames';


const channels = [
  { text: "Desktop", value: "desktop" },
  { text: "Mobile Web", value: "mobile_web" },
  { text: "Mobile App", value: "mobile_app" },
  { text: "CTV", value: "ctv" }
];

const videoDuration = [
  { text: "0 Seconds", value: 0 },
  { text: "15 Seconds", value: 15 },
  { text: "30 Seconds", value: 30 },
  { text: "60 Seconds", value: 60 },
  { text: "90 Seconds", value: 90 },
  { text: "120+ Seconds", value: 120 }
];

const formats = [
  { text: "Video", value: "video" },
  { text: "Display", value: "display" }
];

const optimizers = [
  { text: "Optimize Order", value: "order" },
  { text: "Optimize Price", value: "cpm" }
];

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

const playerTypes = [
  { text: "Standard", value: "standard" },
  { text: "Slider", value: "slider" },
  { text: "In Article", value: "in_article" },
  { text: "In Article Fixed", value: "in_article_fixed" }
];

const videoPlayerSizes = [
  { text: "Custom", value: "custom" }
];

const playerSizes = [
  { text: "Small", value: "small" },
  { text: "Medium", value: "medium" },
  { text: "Large", value: "large" }
];

class PlacementType extends Component {
  state = {
    pilotPlayer: false
  }

  componentDidUpdate(prevProp) {
    if (prevProp.format !== this.props.format) {
      if (this.props.playerSize[0] == 'n/a' || this.props.playerSize[0] == '') {
        let newValue = [];
        this.props.changePlacement({ prop: 'playerSize', value: newValue });
      }
    }

  }
  handleVolChange = event => {
    this.props.changePlacement({ prop: event.target.name, value: parseInt(event.target.value) });
  }
  handleChange = event => {
    this.props.changePlacement({ prop: event.target.name, value: event.target.value });
  };

  handleSelect = (event, data) => {
    this.props.changePlacement({ prop: data.name, value: data.value });
  };

  handleCheckBox = (event, data) => {
    if (data.name == 'isPilotPlayer') {
      this.setState({ pilotPlayer: !data.checked });
      this.props.changePlacement({ prop: data.name, value: !data.checked });
      return;
    }

    this.props.changePlacement({ prop: data.name, value: !data.checked });
  };

  render() {
    const { channel, errorChannel, errorAppStoreUrl, errorFormat, format, optimizer, displaySize, playerType, errorDisplaySize, width, errorWidth, height, errorHeight, errorPlayerType, playerSize, errorPlayerSize, activeUser, isVastOnly, isPilotPlayer, typeErrors, volume, maxVideoDuration, errorMaxVideoDuration, appStoreUrl, defaultDomain, errorDefaultDomain, defaultAppName, errorDefaultAppName, defaultBundleId, errorDefaultBundleId, defaultCtvChannel, errorDefaultCtvChannel } = this.props;
    return (
      <form className='form'>


        <div className='form__half'>
          <div className='form__inside' >
             <div className='float-container'>
              {channel ? <label className={classNames('bwa-floating-label', { 'bwa-floated': channel })} >Channel</label> : <label> </label>}
              <Select placeholder="Channel" value={channel ? channel : ''} selection search fluid name="channel" options={channels} onChange={this.handleSelect} error={errorChannel} />
            </div>
          </div>
          <div className='form__inside' >
             <div className='float-container'>
              {format ? <label className={classNames('bwa-floating-label', { 'bwa-floated': format })} >Format</label> : <label> </label>}
              <Select placeholder="Format" value={format ? format : ''} fluid name="format" id="format" options={formats} onChange={this.handleSelect} error={errorFormat} />
            </div>
          </div>
          <div className='form__inside' >
             <div className='float-container'>
          <label className={classNames('bwa-floating-label', { 'bwa-floated': 1 })} >Format</label>
            <Select value={optimizer} fluid name="optimizer" id="optimizer" options={optimizers} onChange={this.handleSelect} />
          </div>
          </div>

          {format === "display" ? <div className='form__inside' >
             <div className='float-container'>
              {displaySize.length ? <label className={classNames('bwa-floating-label', { 'bwa-floated': displaySize.length })} >Display Size</label> : <label> </label>}
              <Select placeholder="Display Size" value={displaySize ? displaySize : ''} fluid options={displaySizes} name="displaySize" value={displaySize} onChange={this.handleSelect} error={errorPlayerSize} />
            </div>
          </div> : null}
          {format === "display" && displaySize === "custom" ?
            <div className='form__inside' >
               <div className='float-container'>
                {width ? <label className={classNames('bwa-floating-label', { 'bwa-floated': width })} >Width (pixels)</label> : <label> </label>}
                <Input fluid placeholder="Width (pixels)" type="text" name="width" value={width} onChange={this.handleChange} error={errorWidth} />
              </div>
            </div> : null}

          {format === "display" && displaySize === "custom" ?
            <div className='form__inside' >
               <div className='float-container'>
                {height ? <label className={classNames('bwa-floating-label', { 'bwa-floated': height })} >Height (pixels)</label> : <label> </label>}
                <Input fluid placeholder="Height (pixels)" type="text" name="height" value={height} onChange={this.handleChange} error={errorHeight} />
              </div>
            </div> : null}
          {format === "video" ? <div>
            <div className='form__inside' >
               <div className='float-container'>
                {playerSize.length ? <label className={classNames('bwa-floating-label', { 'bwa-floated': playerSize.length })} >Player Size</label> : <label> </label>}
                <Select multiple placeholder="Player Size" value={playerSize ? playerSize : ['']} fluid options={playerSizes} name="playerSize" value={playerSize} onChange={this.handleSelect} error={errorPlayerSize} />
              </div>
            </div>

            <div className='form__inside' >
               <div className='float-container'>
                <label className='bwa-floating-label bwa-floated' >Max. Video Duration</label>
                <Select placeholder="Max. Video Duration" value={maxVideoDuration ? maxVideoDuration : 0} fluid options={videoDuration} name="maxVideoDuration" onChange={this.handleSelect} error={errorMaxVideoDuration} />
              </div>
            </div> </div> : null}

          {channel === "mobile_app" ? <div className='form__inside' >
             <div className='float-container'>
              {appStoreUrl ? <label className={classNames('bwa-floating-label', { 'bwa-floated': appStoreUrl })}>APP Store URL</label> : <label> </label>}
              <TextArea placeholder='APP Store URL' name="appStoreUrl" rows='3' value={appStoreUrl} onChange={this.handleChange} />
            </div>
          </div> : null}

          {channel === "mobile_web" || channel === "desktop" ? <div className='form__inside' >
             <div className='float-container'>
              {defaultDomain ? <label className={classNames('bwa-floating-label', { 'bwa-floated': defaultDomain })} >Domain Name</label> : <label> </label>}
              <Input fluid placeholder="Domain Name" type="text" name="defaultDomain" value={defaultDomain} onChange={this.handleChange} error={errorDefaultDomain} />
            </div>
          </div> : null}

          {channel === "mobile_app" || channel === "ctv" ? <div className='form__inside' >
             <div className='float-container'>
              {defaultAppName ? <label className={classNames('bwa-floating-label', { 'bwa-floated': defaultAppName })} >App Name</label> : <label> </label>}
              <Input fluid placeholder="App Name" type="text" name="defaultAppName" value={defaultAppName} onChange={this.handleChange} error={errorDefaultAppName} />
            </div>
          </div> : null}

          {channel === "mobile_app" || channel === "ctv" ? <div className='form__inside' >
             <div className='float-container'>
              {defaultBundleId ? <label className={classNames('bwa-floating-label', { 'bwa-floated': defaultBundleId })} >Bundle ID</label> : <label> </label>}
              <Input fluid placeholder="Bundle ID" type="text" name="defaultBundleId" value={defaultBundleId} onChange={this.handleChange} error={errorDefaultBundleId} />
            </div>
          </div> : null}

          {channel === "mobile_app" || channel === "ctv" ? <div className='form__inside' >
             <div className='float-container'>
              {defaultCtvChannel ? <label className={classNames('bwa-floating-label', { 'bwa-floated': defaultCtvChannel })} >CTV Name</label> : <label> </label>}
              <Input fluid placeholder="CTV Name" type="text" name="defaultCtvChannel" value={defaultCtvChannel} onChange={this.handleChange} error={errorDefaultCtvChannel} />
            </div>
          </div> : null}

          {format === "video" && (activeUser.user.role & ROLE_SUPERADMIN || activeUser.user.role & ROLE_OPSADMIN) ? <div className='form__inside' > <Checkbox checked={isVastOnly} label="VAST only" name="isVastOnly" onClick={this.handleCheckBox} /></div> : null}
          {format === "video" && (activeUser.user.role & ROLE_SUPERADMIN || activeUser.user.role & ROLE_OPSADMIN) ? <div><Checkbox name="isPilotPlayer" label="PILOT Player" checked={isPilotPlayer} onClick={this.handleCheckBox} /> </div> : null}
          {isPilotPlayer || this.state.pilotPlayer ? <div className='form__inside' >
             <div className='float-container'>
              {playerSize ? <label className={classNames('bwa-floating-label', { 'bwa-floated': playerSize })} >Player Size</label> : <label> </label>}
              <Select placeholder="Player Size" value={displaySize ? displaySize : ''} fluid options={videoPlayerSizes} name="displaySize" value={displaySize} onChange={this.handleSelect} error={errorDisplaySize} />
            </div>
          </div> : null}
          {(displaySize === "custom" && isPilotPlayer) || (displaySize === "custom" && this.state.pilotPlayer) || (displaySize === "custom" && isPilotPlayer) ? <div className='form__inside' >
             <div className='float-container'>
              {width ? <label className={classNames('bwa-floating-label', { 'bwa-floated': width })} >Width (pixels)</label> : <label> </label>}
              <Input fluid placeholder="Width (pixels)" type="text" name="width" value={width} onChange={this.handleChange} error={errorWidth} />
            </div>
          </div> : null}
          {(displaySize === "custom" && isPilotPlayer) || (displaySize === "custom" && this.state.pilotPlayer) || (displaySize === "custom" && isPilotPlayer) ? <div className='form__inside' >
             <div className='float-container'>
              {height ? <label className={classNames('bwa-floating-label', { 'bwa-floated': height })} >Height (pixels)</label> : <label> </label>}
              <Input fluid placeholder="Height (pixels)" type="text" name="height" value={height} onChange={this.handleChange} error={errorHeight} />
            </div>
          </div> : null}

          {isPilotPlayer || this.state.pilotPlayer ? <div className='form__inside' >
            <div>Volume: {volume === 0 || volume == '' || volume == 'undefined' ? ('Mute') : (`${volume}%`)}</div>
            <input type='range' name='volume' min={0} max={100} value={(volume === 0 || volume == '' || volume == 'undefined') ? (0) : (volume)} onChange={this.handleVolChange} />
            <br />
          </div> : null}
          {isPilotPlayer || this.state.pilotPlayer ? <div className='form__inside' >
             <div className='float-container'>
              {playerType ? <label className={classNames('bwa-floating-label', { 'bwa-floated': playerType })} >Video Player Type</label> : <label> </label>}
              <Select placeholder="Player Size" value={playerType ? playerType : ''} fluid options={playerTypes} name="playerType" value={playerType} onChange={this.handleSelect} error={errorPlayerType} />
            </div>
          </div> : null}


        </div>



        <div className='form__half'>
          {typeErrors.length ? <h5> There are some errors with your submission</h5> : null}
          {typeErrors.length ? (typeErrors.map((err, index) => {
            return <Alert key={index} color='danger'> {err}</Alert>
          })) : (null)}
        </div>
      </form >
    )
  }
}

const mapStateToProps = state => {
  const { channel, errorChannel, errorFormat, format, optimizer, displaySize, playerType, errorDisplaySize, width, errorWidth, height, errorHeight, errorPlayerType, playerSize, maxVideoDuration, errorMaxVideoDuration, appStoreUrl, errorAppStoreUrl, errorPlayerSize, isVastOnly, isPilotPlayer, typeErrors, volume, defaultDomain, errorDefaultDomain, defaultAppName, errorDefaultAppName, defaultBundleId, errorDefaultBundleId, defaultCtvChannel, errorDefaultCtvChannel } = state.placement;
  const { activeUser } = state.shared;

  return { channel, errorChannel, errorFormat, format, optimizer, displaySize, playerType, errorDisplaySize, width, errorWidth, height, errorHeight, errorPlayerType, playerSize, errorPlayerSize, maxVideoDuration, errorMaxVideoDuration, appStoreUrl, errorAppStoreUrl, activeUser, isVastOnly, isPilotPlayer, typeErrors, volume, defaultDomain, errorDefaultDomain, defaultAppName, errorDefaultAppName, defaultBundleId, errorDefaultBundleId, defaultCtvChannel, errorDefaultCtvChannel };
};

export default connect(mapStateToProps, { changePlacement })(PlacementType)
