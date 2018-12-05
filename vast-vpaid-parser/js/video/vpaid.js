var LinearAd = function() {
	this._slot = null;
	this._videoSlot = null;
	
	this.eventsCallbacks = {};
	
	this.attributes = {
		companions: '',
		desiredBitrate: 256,
		duration: 0,
		expanded: false,
		height: 0,
		icons: '',
		linear: true,
		remainingTime: 0,
		skippableState: true,
		viewMode: 'normal',
		width: 0,
		volume: 1.0
	};
	
	this.quartileEvents = [
		{event: 'AdVideoStart', value: 0},
		{event: 'AdVideoFirstQuartile', value: 25},
		{event: 'AdVideoMidpoint', value: 50},
		{event: 'AdVideoThirdQuartile', value: 75},
		{event: 'AdVideoComplete', value: 100}
	];
	
	this.adSuccess = false;
	
	// Index into what quartile was last reported.
	this.lastQuartileIndex = 1;
	
};

LinearAd.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
	this._slot = environmentVars.slot;
	this._videoSlot = environmentVars.videoSlot;
	this.attributes.height = height;
	this.attributes.width = width;
	
	this.params = JSON.parse(creativeData.AdParameters);
	
	this.attributes.viewMode = viewMode;
	this.attributes.desiredBitrate = +this.params.vid.bitrate;
	this.attributes.duration = +this.params.vid.duration;
	this.attributes.remainingTime = +this.params.vid.duration;
	this._videoSlot.src = this.params.vid.url;
	this._videoSlot.addEventListener('error', this.onError.bind(this), false);
	this._videoSlot.addEventListener('loadeddata', this.onLoad.bind(this));
	this._videoSlot.addEventListener('timeupdate', this.timeUpdateHandler.bind(this), false);
	this._videoSlot.addEventListener('ended', this.stopAd.bind(this), false);
	this._slot.addEventListener('click', this.onAdClickThru.bind(this), false);
	this.callEvent('AdLoaded');
};

LinearAd.prototype.onError = function() {
	console.log('ERRORED!');
	this.callEvent('AdError');
	this.stopAd();
};

LinearAd.prototype.onLoad = function() {
	this.adSuccess = true;
	console.log('AD LOADED');
};

LinearAd.prototype.onAdClickThru = function() {
	this.callEvent('AdClickThru');
};

LinearAd.prototype.onAdStart = function() {
	console.log('Ad Started');
	this.callEvent('AdVideoStart');
};

LinearAd.prototype.timeUpdateHandler = function() {
	if(this.lastQuartileIndex >= this.quartileEvents.length) return;
	
	if(this._videoSlot.duration === -1) {
		return;
	}
	
	if(this.adSuccess) {
		this.callEvent('AdStarted');
		this.callEvent('AdVideoStart');
		this.callEvent('AdImpression');
		this.callEvent('AdDurationChange');
		this.adSuccess = false;
	}
	
	var percentPlayed = this._videoSlot.currentTime * 100.0 / this._videoSlot.duration;
	this.attributes.remainingTime = this._videoSlot.duration - this._videoSlot.currentTime;
	this.callEvent('AdDurationChange');
	this.callEvent('AdRemainingTimeChange');
	
	if(percentPlayed >= this.quartileEvents[this.lastQuartileIndex].value) {
		var lastQuartileEvent = this.quartileEvents[this.lastQuartileIndex].event;
		
		this.callEvent(lastQuartileEvent);
		this.lastQuartileIndex += 1;
	}
};

LinearAd.prototype.callEvent = function(eventType) {
	if(eventType !== 'AdDurationChange' && eventType !== 'AdRemainingTimeChange') {
		console.log('VPAID Calling event', eventType);
	}
	if(eventType === "AdClickThru") {
		this.eventsCallbacks[eventType](undefined, 0, true);
		return;
	}
	if(eventType in this.eventsCallbacks) {
		this.eventsCallbacks[eventType]();
	}
};

LinearAd.prototype.startAd = function() {
	console.log("Starting Ad");
	console.log("Playing Ad");
	this._videoSlot.play();
	
};

LinearAd.prototype.stopAd = function(e, p) {
	this.callEvent('AdStopped');
	console.log("Stopping ad");
};

LinearAd.prototype.setAdVolume = function(val) {
	console.log("setAdVolume");
	console.log(val);
	this.attributes.volume = val;
	this.callEvent('AdVolumeChange');
};

LinearAd.prototype.getAdVolume = function() {
	console.log("getAdVolume");
	return this.attributes.volume;
};

LinearAd.prototype.resizeAd = function(width, height, viewMode) {
	console.log("resizeAd");
};

LinearAd.prototype.pauseAd = function() {
	console.log("pauseAd");
	this._videoSlot.pause();
	this.callEvent('AdPaused');
};

LinearAd.prototype.resumeAd = function() {
	console.log("resumeAd");
	this._videoSlot.play();
	this.callEvent('AdPlaying');
};

LinearAd.prototype.expandAd = function() {
	console.log("expandAd");
};

LinearAd.prototype.getAdExpanded = function(val) {
	console.log("getAdExpanded");
};

LinearAd.prototype.getAdSkippableState = function(val) {
	console.log("getAdSkippableState");
};

LinearAd.prototype.collapseAd = function() {
	console.log("collapseAd");
};

LinearAd.prototype.skipAd = function() {
	console.log("skipAd");
};

LinearAd.prototype.subscribe = function(aCallback, eventName, aContext) {
	console.log('Subscribing to', eventName);
	
	this.eventsCallbacks[eventName] = aCallback.bind(aContext);
};

// Callbacks are removed based on the eventName
LinearAd.prototype.unsubscribe = function(eventName) {
	console.log("Unsubscribing from", eventName);
};

LinearAd.prototype.handshakeVersion = function(version) {
	return ('2.0');
};

// Return true if the ad is linear.
LinearAd.prototype.getAdLinear = function() {
	return this.attributes.linear;
};

// Return the ad width.
LinearAd.prototype.getAdWidth = function() {
	return this.attributes.width;
};

// Return the ad height.
LinearAd.prototype.getAdHeight = function() {
	return this.attributes.height;
};

// Return the time remaining in the ad.
LinearAd.prototype.getRemainingTime = function() {
	return this.attributes.remainingTime;
};

LinearAd.prototype.getAdRemainingTime = function() {
	return this.attributes.remainingTime;
};

// Return the duration of the ad.
LinearAd.prototype.getAdDuration = function() {
	return this.attributes.duration;
};

// Return the list of companions in vast xml.
LinearAd.prototype.getAdCompanions = function() {
	return this.attributes.companions;
};

// Return the list of icons.
LinearAd.prototype.getAdIcons = function() {
	return this.attributes.icons;
};

// Return true if the ad is linear.
LinearAd.prototype.getAdLinear = function() {
	return this.attributes.linear;
};

getVPAIDAd = function() {
	return new LinearAd();
};
