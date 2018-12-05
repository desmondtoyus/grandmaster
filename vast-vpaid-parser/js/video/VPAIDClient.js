(function(_G) {
	var blank = '',
	$keys = Object.keys,
	$wwwRegex = /^www\./,
	$slice = Array.prototype.slice,
	$encode = _G.encodeURIComponent,
	$macrosRegex = /\{\{([A-Z]+?)\}\}/g,
	$has = Object.prototype.hasOwnProperty,
	$isUndefined = function(o) { return o === void 0; },
	$isNone = function(o) { return o == null || $isUndefined(o); },
	$isArray = Array.isArray || function(o) { return o instanceof Array; },
	cookieSyncEndpoints = [
//		'//p.adsymptotic.com/d/px?_pid=15438&_psign=a49a835759f645202954bb75d35daab8&_pu={{PAGEURL}}&_rand={{CB}}&_redirect={{SYNCURL}}'
	],
	$firstn = function(array) {
		return array && array.length ? array[0] : null; 
	},
	$rnd = function() {
		return '' + (Math.floor(Math.random() * 100000000));
	},
	$extract = function(obj, key, defaultValue) {
		var result = defaultValue;
		if(!$isNone(obj) && $has.call(obj, key)) {
			result = obj[key];
			delete obj[key];
		}
		return result;
	},
	
	$defaults = function(subject) {
		var idx = 0,
		others = $slice.call(arguments, 1),
		othersCount = others.length,
		result = $isNone(subject) ? {} : subject;
		for(; idx < othersCount; idx++) {
			var other = others[idx],
			otherKeys = $keys(other),
			keyCount = otherKeys.length;
			for(var k = 0; k < keyCount; k++) {
				var key = otherKeys[k];
				if(!$has.call(result, key)) {
					result[key] = other[key];
				}
			}
		}
		return result;
	},
	
	$clone = function(subject) {
		if($isArray(subject)) {
			return $slice.call(subject);
		} else {
			return $defaults({}, subject);
		}
	},
	
	$trimmedLeading = /^[\s\{][\s\{]*/g,
	$trimmedTrailing = /[\s\}][\s\}]*$/g,
	$pageUrlMatcher = /^https?:\/\/([^\/]+?)(?:\/.*)?$/,
	$cleanDomain = function(domain) {
		// Normalize domain to lowercase
		var res = domain.toLowerCase(),
		
		// Macro values for domain
		macro = '{DOMAIN}',
		macro2 = '{' + macro + '}';
		if(res === macro.toLowerCase() || res === macro2.toLowerCase()) {
			return macro;
		}
		
		// Check if the pageurl was incorrectly used
		res = res.replace($pageUrlMatcher, '$1');
		
		// Trim braces and trailing/leading whitespace
		res = res.replace($trimmedLeading, blank).replace($trimmedTrailing, blank);
		
		// Remove any www. prefix that's present.
		return res.replace($wwwRegex, blank);
	},
	$stripSlashesR = function(url) {
		// Strip trailing /
		while(url.substr(-1) === '/') {
			url = url.substr(0, url.length - 1);
		}
		return url;
	},
	
	/**
	 * 
	 * @param {HTMLElement} element
	 */
	$isDiv = function(element) {
		return element.nodeName.toUpperCase() === 'DIV';
	},
	
	$childElements = function(element, filter) {
		var results = [],
		childNodes = $slice.call(element.childNodes), len = childNodes.length,
		filterfn = arguments.length === 1 ? function(childNode) {
			return childNode.nodeType === 1;
		} : function(childNode) {
			return childNode.nodeType === 1 && filter(childNode);
		};
		
		for(var idx = 0; idx < len; idx++) {
			if(filterfn(childNodes[idx])) {
				results.push(childNodes[idx]);
			}
		}
		return childNodes;
	},
	$indexOf = $isNone(Array.prototype.indexOf) ? function(array, search) {
		var item, idx = 0, len = array.length;
		for(; idx < len; idx++) {
			item = array[idx];
			if(item === search) {
				return idx;
			}
		}
		return -1;
	} : function(array, search) {
		return array.indexOf(search);
	},
	/**
	 * Identify new items in the updated array that weren't in the original.
	 * @param {Array} original
	 * @param {Array} updated
	 */
	$orphans = function(original, updated) {
		var idx, ocopy = $clone(original), ucopy = $clone(updated), oitem = ocopy.shift();
		while(ocopy.length > 0 && ucopy.length > 0) {
			if(ucopy[0] === oitem) {
				ucopy.shift();
			} else {
				idx = $indexOf(ucopy, oitem);
				if(idx !== -1) {
					ucopy.splice(idx, 1);
				}
			}
			oitem = ocopy.shift();
		}
		return ucopy;
	},
	
	LinearAd = function LinearAd() {
		// The slot is the div element on the main page that the ad is supposed to occupy
		this._slot = null;
		// The video slot is the video object that the creative can use to render and video element it might have.
		this._videoSlot = null;
		
		this.eventsCallbacks = {};
		
		// List of gettable and settable attributes.
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
			volume: 0
		};
		
		// // Set of events to be reported.
		this.quartileEvents = [
			{ event: 'AdVideoStart', value: 0},
			{ event: 'AdVideoFirstQuartile', value: 25 },
			{ event: 'AdVideoMidpoint', value: 50 },
			{ event: 'AdVideoThirdQuartile', value: 75 },
			{ event: 'AdVideoComplete', value: 99 }
		];
		
		// Index into what quartile was last reported.
		this.lastQuartileIndex = 1;
		
		this.vw = -1;
		this.wfIndex = 0;
		this.adLoaded = false;
		this.imaLoaded = false;
		
		this.deferred = {};
		this.deferred.errors = [];
		
		var that = this;
		document.body.style.margin = 0;
		var el = document.createElement('script');
		el.setAttribute('type', 'application/javascript');
		el.setAttribute('src', '//imasdk.googleapis.com/js/sdkloader/ima3.js');
		el.onload = function() {
			console.log('IMA Loaded');
			that.imaLoaded = true;
		};
		(document.head || $slice.call(document.getElementsByTagName('head'))[0]).appendChild(el);
	};

	LinearAd.prototype.constructor = LinearAd;
	LinearAd.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
		if(!this.adLoaded) {
			this.adLoaded = true;
		} else {
			return;
		}
		// slot and videoSlot are passed as part of the environmentVars
		console.log('CREATIVE DATA=',creativeData )
		this.attributes.width = width;
		this.attributes.height = height;
		this._slot = environmentVars.slot;
		this._videoSlot = environmentVars.videoSlot;
		this.creativeData = creativeData;
		this.initParams = JSON.parse(creativeData.AdParameters);
		console.log('INIT PARAMETER=',this.initParams);
		this.adnHost = $stripSlashesR($extract(this.initParams, 'hostname'));
		this.rtbHost = $stripSlashesR($extract(this.initParams, 'exchange'));
		console.log('CREATIVE DATA=>', creativeData, 'ENVIRONMENT VARS=>', environmentVars)
		this.buildProps().callProps(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
	};
	
	
	LinearAd.prototype.buildProps = function() {
		var vw = -1,
		pageUrl = '',
		domain = '',
		adParams = $extract(this.initParams, 'params', {});
		
		try {
			var videoBorders = this._slot.getBoundingClientRect();
			var windowHeight = window.top.innerHeight;
			if(videoBorders.y >= 0) {
				var h = windowHeight - videoBorders.y;
				vw = h / videoBorders.height > 0.5 ? 1 : 0;
			} else if(videoBorders.y < 0) {
				vw = videoBorders.bottom / videoBorders.height > 0.5 ? 1 : 0;
			}
		} catch(e) {
			vw = -1;
		}
		
		try {
			var topLocation = window.top.location;
			pageUrl = topLocation.href;
			domain = topLocation.hostname;
		} catch(e) {
			if(window.location.hasOwnProperty('ancestorOrigins')) {
				var cidx, ancestorOrigins = window.location.ancestorOrigins;
				pageUrl = ancestorOrigins[ancestorOrigins.length - 1];
				cidx = pageUrl.indexOf(':');
				if(cidx !== -1 && pageUrl.substr(cidx, 3) === '://') {
					domain = pageUrl.substr(cidx + 3);
				} else {
					domain = pageUrl;
				}
			} else {
				pageUrl = this.initParams.pageurl;
				domain = this.initParams.domain;
			}
		}
		
		// Apply a set of fields to adParams
		adParams.vw = vw;
		adParams.pageurl = pageUrl;
		adParams.domain = $cleanDomain(domain);
		
		adParams.w = this._slot.offsetWidth;
		adParams.h = this._slot.offsetHeight;
		adParams.pid = $extract(this.initParams, 'pid');
		adParams.tid = $extract(this.initParams, 'tid');
		
		// Add the adParams and adnHost to our instance.
		this.adParams = adParams;
		this._impressionFired = false;
		this.uuid = $extract(this.initParams, 'uuid');
		this.syncParams = this.buildSyncParams();
		return this;
	};
	
	LinearAd.prototype.buildSyncParams = function() {
		return {
			'CB': $rnd(),
			'PAGEURL': this.adParams.pageurl,
			'DOMAIN': this.adParams.domain,
			'SYNCURL': this.adnHost + '/pixel.gif?lid=' + $encode(this.uuid) + '&rid=${UUID}'
		};
	};
	
	LinearAd.prototype.callProps = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
		var that = this,
		xhr = new XMLHttpRequest(),
		url = this.getAdserverURL('/op', { "json": "1" });
		xhr.open('GET', url);
		if(XMLHttpRequest.prototype.hasOwnProperty('withCredentials')) {
			xhr.withCredentials = true;
		}
		xhr.onload = function(data) {
			that.params = JSON.parse(data.target.response);
			that.adParams.tdata = that.params.tdata;
			if(that.params.brandsafety) {
				that.brandSafety = $extract(that.params, 'brandsafety');
			}
			if(that.params.serving) {
				if(!that.imaLoaded) {
					var imaInterval = setInterval(function() {
						if(!that.imaLoaded) {
							return;
						}
						clearInterval(imaInterval);
						that.runIMA(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
					}, 100);
				} else {
					that.runIMA(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
				}
			} else {
				that.callEvent('AdError');
			}
		};
		xhr.send();
		that.cookieSync(cookieSyncEndpoints, that.syncParams);
	};
	
	LinearAd.prototype.appendPixel = function(url) {
		var img = document.createElement('img');
		img.setAttribute('width', '1');
		img.setAttribute('height', '1');
		img.setAttribute('src', url);
		document.body.appendChild(img);
	};
	
	LinearAd.prototype.replaceSyncMacros = function(url) {
		var that = this;
		return url.replace($macrosRegex, function(match) {
			var len = match.length,
			key = match.substr(2, len - 4);
			return !!(that.syncParams[key]) ? $encode(that.syncParams[key]) : match; 
		});
	};
	
	LinearAd.prototype.cookieSync = function(urls, params) {
		var idx = 0, len = urls.length;
		for(; idx < len; idx++) {
			var url = this.replaceSyncMacros(urls[idx]);
			this.appendPixel(url);
		}
	};
	
	LinearAd.prototype.getEndpointURL = function(host, endpoint, params) {
		var idx,
		paramPairs = [],
		queryParams = $defaults(params, this.adParams),
		paramNames = $keys(queryParams), paramCount = paramNames.length;
		for(idx = 0; idx < paramCount; idx++) {
			var name = paramNames[idx];
			paramPairs.push($encode(name) + '=' + $encode(queryParams[name]));
		}
		
		return host + endpoint + '?' + paramPairs.join('&');
	};
	
	LinearAd.prototype.getAdserverURL = function(endpoint, params) {
		return this.getEndpointURL(this.adnHost, endpoint, params);
	};
	
	LinearAd.prototype.getExchangeURL = function(endpoint, params) {
		return this.getEndpointURL(this.rtbHost, endpoint, params);
	};
	
	LinearAd.prototype.getBrandSafetyURL = function(flightId) {
		var tid = this.adParams.tid,
		baseURL = this.brandSafety,
		fid = arguments.length === 0 ? this.getFID() : flightId;
		return (baseURL && fid) ? (baseURL + '&si=' + $encode(fid) + '&ti=' + $encode(tid)) : null;
	};
	
	LinearAd.prototype.fireBrandSafety = function() {
		var bsScript, bsURL = this.getBrandSafetyURL();
		if(bsURL == null) return;
		bsScript = document.createElement('script');
		bsScript.type = 'text/javascript';
		bsScript.async = true;
		bsScript.src = bsURL;
		document.body.appendChild(bsScript);
	};
	
	LinearAd.prototype.runIMA = function(width, height, desiredBitrate, creativeData, environmentVars) {
		console.log('Running IMA');
		var elements = $childElements(this._slot, $isDiv);
		google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);
		this.adDisplayContainer = new google.ima.AdDisplayContainer(this._slot, this._videoSlot);
		this.adDisplayContainer.initialize();
		this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);
		this.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onAdsManagerLoaded.bind(this), false);
		this.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError.bind(this), false);
		this.setupStylePatches(elements);
		this.runAdRequest(width, height);
	};
	
	LinearAd.prototype.setupStylePatches = function(elements) {
		this.patchIMAStyle(this.findIMAContainer(elements));
	};
	
	LinearAd.prototype.findIMAContainer = function(original) {
		var updated = $childElements(this._slot, $isDiv),
		added = $orphans(original, updated);
		return $firstn(added);
	};
	
	LinearAd.prototype.patchIMAStyle = function(imaContainer) {
		if(imaContainer) {
			imaContainer.style.zIndex = '1';
		}
	};
	
	LinearAd.prototype.isRTBFlight = function(flightData) {
		return flightData.hasOwnProperty('rtb') && (flightData.rtb + '') === '1';
	};
	
	/**
	 * When an rtb flight is next int he waterfall, we end up needing to extract the rest of the
	 * flights in that auction from the waterfall. In order to allow us to do this easily in a
	 * single operation, we traverse the remainder of the waterfall in reverse.
	 */
	LinearAd.prototype.extractRTBFlights = function() {
		var flights = [],
		wf = this.params.wf,
		idx = wf.length - 1,
		firstIndex = this.wfIndex,
		flightData = wf[idx];
		for(; idx >= firstIndex; flightData = wf[--idx]) {
			// check rtb
			if(!this.isRTBFlight(flightData)) { continue; }
			
			// remove flight from waterfall
			wf.splice(idx, 1);
			
			// client side targeting validation
			var code = this.verifyFlightData(flightData);
			if(code !== 0) {
				this.deferError({ "err": code, "fid": flightData.fid, "fdata": flightData.fdata });
			} else {
				flights.unshift(flightData);
			}
		}
		return flights;
	};
	
	LinearAd.prototype.runRTBAdRequest = function(flightData, width, height) {
		var flights = this.extractRTBFlights();
		if(flights.length === 0) {
			return this.playNextAd(width, height);
		}
		
		this.adsRequest = new google.ima.AdsRequest();
		this.adsRequest.linearAdSlotWidth = width;
		this.adsRequest.linearAdSlotHeight = height;
		this.adsRequest.adTagUrl = this.getExchangeURL('/auction', {
			"w": this._slot.offsetWidth,
			"h": this._slot.offsetHeight,
			"afids": flights.map(function(flightData) {
				return flightData.fid;
			}).join(','),
			"afdatas": flights.map(function(flightData) {
				return flightData.fdata;
			}).join(',')
		});
		this.requestAds();
	};
	
	LinearAd.prototype.runStandardAdRequest = function(flightData, width, height) {
		var fid = flightData.fid,
		fdata = flightData.fdata,
		errorCode = this.verifyFlightData(flightData),
		params = { "fid": fid, "fdata": fdata };
		
		// If an error was caught, we'll move onto the next ad and hit the error endpoint.
		if(errorCode !== 0) {
			params.err = errorCode;
			return this.deferError(params).playNextAd(width, height);
		}
		
		params.w = this._slot.offsetWidth;
		params.h = this._slot.offsetHeight;
		if(this.brandSafety) {
			params.bs_url = this.getBrandSafetyURL(fid);
		}
		
		this.adsRequest = new google.ima.AdsRequest();
		this.adsRequest.linearAdSlotWidth = width;
		this.adsRequest.linearAdSlotHeight = height;
		this.adsRequest.adTagUrl = this.getAdserverURL('/flight', params);
		this.requestAds();
	};
	
	LinearAd.prototype.runAdRequest = function(width, height) {
		var flightData = this.params.wf[this.wfIndex];
		if(this.isRTBFlight(flightData)) {
			this.runRTBAdRequest(flightData, width, height);
		} else {
			this.runStandardAdRequest(flightData, width, height);
		}
	};
	
	LinearAd.prototype.getFID = function() {
		if(this.params && this.params.wf && this.hasOwnProperty('wfIndex')) {
			return this.params.wf[this.wfIndex].fid;
		}
		return null;
	};
	
	
	LinearAd.prototype.processDeferredErrors = function() {
		var errorURL,
		errorURLs = this.deferred.errors;
		while(errorURLs.length !== 0) {
			try {
				errorURL = errorURLs.shift();
				if(errorURL) { this.callError(errorURL); }
			} catch(ex) {
				console.dir(ex);
			}
		}
	};
	
	LinearAd.prototype.deferError = function(params) {
		var errorURL = this.getAdserverURL('/err', params),
		needsCall = this.deferred.errors.length === 0;
		this.deferred.errors.push(errorURL);
		if(needsCall) {
			var self = this;
			setTimeout(function() {
				self.processDeferredErrors();
			}, 0);
		}
		return self;
	};
	
	LinearAd.prototype.callError = function(url) {
		var pixel = document.createElement('img');
		pixel.src = url;
		this._slot.appendChild(pixel);
	};
	
	LinearAd.prototype.playNextAd = function(width, height) {
		if(this.wfIndex >= this.params.wf.length) {
			this.callEvent('AdError');
		} else {
			console.log('Moving Index');
			this.wfIndex++;
			this.runAdRequest(width, height);
		}
	};
	
	LinearAd.prototype.matchAdSize = function(flightData) {
		var clientWidth = this._slot.offsetWidth;
		if(clientWidth < 350 && flightData.ps.indexOf('small') !== -1) {
			return true;
		} else if(clientWidth >= 350 && clientWidth < 500 && flightData.ps.indexOf('medium') !== -1) {
			return true;
		} else if(clientWidth >= 500 && flightData.ps.indexOf('large') !== -1) {
			return true;
		}
		return false;
	};
	
	LinearAd.prototype.matchAdVolume = function(flightData) {
		return true;
		return !(flightData.muted === 'true' || flightData.muted === true) || this._videoSlot.volume === 0;
	};
	
	
	LinearAd.prototype.matchAdViewable = function(flightData) {
		return !(flightData.vw === 'true' || flightData.vw === true) || this.isAdViewable();
	};
	
	LinearAd.prototype.isAdViewable = function() {
		return true;
		var videoBorders = this._slot.getBoundingClientRect();
		var windowHeight = window.top.innerHeight;
		if(videoBorders.y >= 0) {
			var height = windowHeight - videoBorders.y;
			return height / videoBorders.height > 0.5;
		} else if(videoBorders.y < 0) {
			return videoBorders.bottom / videoBorders.height > 0.5;
		}
	};
	
	LinearAd.prototype.verifyFlightData = function(flightData) {
		var errorCode = 0;
		if(!this.matchAdSize(flightData)) {
			errorCode = 201;
		} else if(!this.matchAdVolume(flightData)) {
			errorCode = 33554432;
		} else if(!this.matchAdViewable(flightData)) {
			errorCode = 16777216;
		}
		return errorCode;
	};
	
	LinearAd.prototype.onAdsManagerLoaded = function(adsManagerLoadedEvent) {
		this.adsRenderingSettings = new google.ima.AdsRenderingSettings();
		this.adsRenderingSettings.restoreCustomPlaybackOnAdBreakComplete = true;
		this.adsManager = adsManagerLoadedEvent.getAdsManager(this._videoSlot, this.adsRenderingSettings);
		this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError.bind(this));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.onContentPauseRequested.bind(this));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, this.onContentResumeRequested.bind(this));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, this.onAdProgress.bind(this, 'AdVideoStart'));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, this.onAdClickThru.bind(this));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, this.onAdProgress.bind(this, 'AdVideoComplete'));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.DURATION_CHANGE, this.onDurationChange.bind(this));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.FIRST_QUARTILE, this.onAdProgress.bind(this, 'AdVideoFirstQuartile'));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.IMPRESSION, this.onAdImpression.bind(this));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, this.onAdLoad.bind(this));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.MIDPOINT, this.onAdProgress.bind(this, 'AdVideoMidpoint'));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, this.onAdPause.bind(this));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED, this.onAdResume.bind(this));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, this.onAdSkip.bind(this));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.THIRD_QUARTILE, this.onAdProgress.bind(this, 'AdVideoThirdQuartile'));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.USER_CLOSE, this.onAdClose.bind(this));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_CHANGED, this.onVolumeChange.bind(this));
		this.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_MUTED, this.onVolumeMuted.bind(this));
		//the next 2 lines are added to accomodate for Yahoo's fullscreen requirements
		// this._videoSlot.nextSibling.nextSibling.style.cssText = "height: 100% !important; width: 100% !important";
		// this._videoSlot.nextSibling.nextSibling.firstChild.style.cssText = "z-index: 1";	
		try {
			this.adsManager.init(this.attributes.width, this.attributes.height, google.ima.ViewMode.NORMAL);
			this.adsManager.start();
		} catch(err) {
			console.log(err);
		}
	};
	
	LinearAd.prototype.onVolumeMuted = function() {
		console.log('IMA Volume Muted');
		this.callEvent('AdVolumeChange');
	};
	
	LinearAd.prototype.onVolumeChange = function() {
		console.log('IMA Volume Change');
		this.callEvent('AdVolumeChange');
	};
	
	LinearAd.prototype.onAdClose = function() {
		console.log('IMA Ad Close');
	};
	
	LinearAd.prototype.onAdResume = function() {
		console.log('IMA Ad Resume');
		this.callEvent('AdPlaying');
	};
	
	LinearAd.prototype.onAdSkip = function() {
		console.log('IMA AD Skip');
	};
	
	LinearAd.prototype.onAdPause = function() {
		console.log('IMA Ad Pause');
		this.callEvent('AdPaused');
	};
	
	LinearAd.prototype.onAdLoad = function() {
		console.log('IMA Ad Load');
		this.callEvent('AdLoaded');
	};
	
	LinearAd.prototype.onAdImpression = function() {
		console.log('IMA Impression');
		this.callEvent('AdImpression');
		if(this._impressionFired) return;
		this._impressionFired = true;
		this.fireBrandSafety();
	};
	
	LinearAd.prototype.onDurationChange = function() {
		// console.log('IMA Duration Change');
		this.callEvent('AdDurationChange');
		var that = this;
		var timeInterval = setInterval(function() {
			that.attributes.remainingTime = that.adsManager.getRemainingTime();
			if(that.attributes.remainingTime > that.attributes.duration) {
				that.attributes.duration = that.attributes.remainingTime + 1;
			}
			that.callEvent('AdDurationChange');
			that.callEvent('AdRemainingTimeChange');
			if(that.adsManager.getRemainingTime() < 1) {
				clearInterval(timeInterval);
			}
		}, 1000);
		
	};
	
	LinearAd.prototype.onAdProgress = function(ev) {
		console.log('IMA progress: ', ev);
		this.callEvent(ev);
		if(ev === 'AdVideoComplete') {
			this.callEvent('AdStopped');
		}
	};
	
	LinearAd.prototype.onAdClickThru = function() {
		this.callEvent('AdClickThru');
	};
	
	LinearAd.prototype.testImp = function() {
		console.log('IMA imp');
	};
	
	LinearAd.prototype.onContentPauseRequested = function() {
		// this._videoSlot.removeEventListener('ended', contentEndedListener);
		this._videoSlot.pause();
	};
	
	LinearAd.prototype.onContentResumeRequested = function() {
		// this._videoSlot.addEventListener('ended', contentEndedListener);
		this._videoSlot.play();
	};
	
	LinearAd.prototype.requestAds = function() {
		this.adsLoader.requestAds(this.adsRequest);
	};
	
	LinearAd.prototype.onAdError = function(adErrorEvent) {
		if(this.wfIndex >= this.params.wf.length - 1) {
			this.callEvent('AdError');
		} else {
			console.log('Moving Index');
			this.wfIndex++;
			this.runAdRequest(this.attributes.width, this.attributes.height);
		}
	};
	
	// LinearAd.prototype.callEvent = function(eventType) {
	// 	if(eventType !== 'AdDurationChange' && eventType !== 'AdRemainingTimeChange') {
	// 		console.log('Calling event', eventType);
	// 	}
	// 	if(eventType in this.eventsCallbacks) {
	// 		this.eventsCallbacks[eventType]();
	// 	}
	// };
	
	LinearAd.prototype.startAd = function() {
		console.log("Starting Ad");
		this.callEvent('AdStarted');
	};
	
	LinearAd.prototype.stopAd = function(e, p) {
		this.callEvent('AdStopped');
		console.log("Stopping ad");
	};
	
	LinearAd.prototype.setAdVolume = function(val) {
		console.log("setAdVolume");
		this.adsManager.setVolume(val);
	};
	
	LinearAd.prototype.getAdVolume = function() {
		console.log("getAdVolume");
	};
	
	LinearAd.prototype.resizeAd = function(width, height, viewMode) {
		console.log("resizeAd");
		this.callEvent('AdSizeChange');
	};
	
	LinearAd.prototype.pauseAd = function() {
		console.log("pauseAd");
		this.adsManager.pause();
	};
	
	LinearAd.prototype.resumeAd = function() {
		console.log("resumeAd");
		this.adsManager.resume();
	};
	
	LinearAd.prototype.expandAd = function() {
		console.log("expandAd");
	};
	
	LinearAd.prototype.getAdExpanded = function(val) {
		console.log("getAdExpanded");
	};
	
	LinearAd.prototype.getAdSkippableState = function(val) {
		console.log('getAdSkippableState');
	};
	
	LinearAd.prototype.collapseAd = function() {
		console.log('collapseAd');
	};
	
	LinearAd.prototype.skipAd = function() {
		console.log('skipAd');
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
	
	// Retrun true if the ad is linear.
	LinearAd.prototype.getAdLinear = function() {
		return this.attributes.linear;
	};
	
	getVPAIDAd = function() {
		return new LinearAd();
	};
})(window);
