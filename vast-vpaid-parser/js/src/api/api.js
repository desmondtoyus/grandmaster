import FW from '../fw/fw';
import ENV from '../fw/env';
import VASTPLAYER from '../players/vast-player';
import CONTENTPLAYER from '../players/content-player';
import VPAID from '../players/vpaid';
var blank = '',
	$keys = Object.keys,
	$wwwRegex = /^www\./,
	$slice = Array.prototype.slice,
	$encode = window.encodeURIComponent,
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
  }
  
const API = {};

API.attach = function(Vast) {

  Vast.prototype.buildProps = function() {

    console.log('INITIAL PARAMETER2 =>', this.initParams);
  
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
  
  Vast.prototype.buildSyncParams = function() {
    return {
      'CB': $rnd(),
      'PAGEURL': this.adParams.pageurl,
      'DOMAIN': this.adParams.domain,
      'SYNCURL': this.adnHost + '/pixel.gif?lid=' + $encode(this.uuid) + '&rid=${UUID}'
    };
  };
  
  Vast.prototype.callProps = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
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
        this.vpaidCreative.initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
        // that.runIMA(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
      } else {
        // that.callEvent('AdError');
        PING.error.call(this, 901);
        VASTERRORS.process.call(this, 901);
      }
    };
    xhr.send();
    that.cookieSync(cookieSyncEndpoints, that.syncParams);
  };
  
  Vast.prototype.appendPixel = function(url) {
    var img = document.createElement('img');
    img.setAttribute('width', '1');
    img.setAttribute('height', '1');
    img.setAttribute('src', url);
    document.body.appendChild(img);
  };
  
  Vast.prototype.replaceSyncMacros = function(url) {
    var that = this;
    return url.replace($macrosRegex, function(match) {
      var len = match.length,
      key = match.substr(2, len - 4);
      return !!(that.syncParams[key]) ? $encode(that.syncParams[key]) : match; 
    });
  };
  
  Vast.prototype.cookieSync = function(urls, params) {
    var idx = 0, len = urls.length;
    for(; idx < len; idx++) {
      var url = this.replaceSyncMacros(urls[idx]);
      this.appendPixel(url);
    }
  };
  
  Vast.prototype.getEndpointURL = function(host, endpoint, params) {
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
  
  Vast.prototype.getAdserverURL = function(endpoint, params) {
    return this.getEndpointURL(this.adnHost, endpoint, params);
  };
  
  Vast.prototype.getExchangeURL = function(endpoint, params) {
    return this.getEndpointURL(this.rtbHost, endpoint, params);
  };
  
  Vast.prototype.getBrandSafetyURL = function(flightId) {
    var tid = this.adParams.tid,
    baseURL = this.brandSafety,
    fid = arguments.length === 0 ? this.getFID() : flightId;
    return (baseURL && fid) ? (baseURL + '&si=' + $encode(fid) + '&ti=' + $encode(tid)) : null;
  };
  
  Vast.prototype.fireBrandSafety = function() {
    var bsScript, bsURL = this.getBrandSafetyURL();
    if(bsURL == null) return;
    bsScript = document.createElement('script');
    bsScript.type = 'text/javascript';
    bsScript.async = true;
    bsScript.src = bsURL;
    document.body.appendChild(bsScript);
  };

  // Copied functions end

  Vast.prototype.play = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        VPAID.resumeAd.call(this);
      } else {
        VASTPLAYER.play.call(this);
      }
    } else {
      CONTENTPLAYER.play.call(this);
    }
  };
  
  Vast.prototype.pause = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        VPAID.pauseAd.call(this);
      } else {
        VASTPLAYER.pause.call(this);
      }
    } else {
      CONTENTPLAYER.pause.call(this);
    }
  }; 
  
  Vast.prototype.getAdPaused = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        return VPAID.getAdPaused.call(this);
      } else {
        return this.vastPlayerPaused;
      }
    }
    return false;
  }; 
  
  Vast.prototype.setVolume = function (level) {
    if (!FW.isNumber(level)) {
      return;
    }
    let validatedLevel = 0;
    if (level < 0) {
      validatedLevel = 0;
    } else if (level > 1) {
      validatedLevel = 1;
    } else {
      validatedLevel = level;
    }
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        VPAID.setAdVolume.call(this, validatedLevel);
      }
      VASTPLAYER.setVolume.call(this, validatedLevel);
    }
    CONTENTPLAYER.setVolume.call(this, validatedLevel);
  };
  
  Vast.prototype.getVolume = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        return VPAID.getAdVolume.call(this);
      } else {
        return VASTPLAYER.getVolume.call(this);
      }
    }
    return CONTENTPLAYER.getVolume.call(this);
  };
  
  Vast.prototype.setMute = function (muted) {
    if (typeof muted !== 'boolean') {
      return;
    }
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        if (muted) {
          VPAID.setAdVolume.call(this, 0);
        } else {
          VPAID.setAdVolume.call(this, 1);
        }
      } else {
        VASTPLAYER.setMute.call(this, muted);
      }
    }
    CONTENTPLAYER.setMute.call(this, muted);
  };
  
  Vast.prototype.getMute = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        if (VPAID.getAdVolume.call(this) === 0) {
          return true;
        }
        return false;
      } else {
        return VASTPLAYER.getMute.call(this);
      }
    }
    return CONTENTPLAYER.getMute.call(this);
  };
  
  Vast.prototype.stopAds = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        VPAID.stopAd.call(this);
      } else {
        // this will destroy ad
        VASTPLAYER.resumeContent.call(this);
      }
    }
  };
  
  Vast.prototype.getAdTagUrl = function () {
    return this.adTagUrl;
  };
  
  Vast.prototype.getAdMediaUrl = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return VPAID.getCreativeUrl.call(this);
      } else {
        return this.adMediaUrl;
      }
    }
    return null;
  };
  
  Vast.prototype.getAdLinear = function () {
    return this.adIsLinear;
  };
  
  Vast.prototype.getAdSystem = function () {
    return this.adSystem;
  };
  
  Vast.prototype.getAdContentType = function () {
    if (this.adOnStage) {
      if (this.adIsLinear || this.isVPAID) {
        return this.adContentType;
      } else {
        return this.nonLinearContentType;
      }
    }
    return '';
  };
  
  Vast.prototype.getAdTitle = function () {
    return this.adTitle;
  };
  
  Vast.prototype.getAdDescription = function () {
    return this.adDescription;
  };
  
  Vast.prototype.getAdDuration = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        let duration = VPAID.getAdDuration.call(this);
        if (duration > 0) {
          duration = duration * 1000;
        }
        return duration;
      } else {
        return VASTPLAYER.getDuration.call(this);
      }
    }
    return -1;
  };
  
  Vast.prototype.getAdCurrentTime = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        const remainingTime = VPAID.getAdRemainingTime.call(this);
        const duration = VPAID.getAdDuration.call(this);
        if (remainingTime === -1 || duration === -1 || remainingTime > duration) {
          return -1;
        }
        return (duration - remainingTime) * 1000;
      } else {
        return VASTPLAYER.getCurrentTime.call(this);
      }
    }
    return -1;
  };
  
  Vast.prototype.getAdRemainingTime = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        return VPAID.getAdRemainingTime.call(this);
      } else {
        const currentTime = VASTPLAYER.getCurrentTime.call(this);
        const duration = VASTPLAYER.getDuration.call(this);
        if (currentTime === -1 || duration === -1 || currentTime > duration) {
          return -1;
        }
        return (duration - currentTime) * 1000;
      }
    }
    return -1;
  };
  
  Vast.prototype.getAdOnStage = function () {
    return this.adOnStage;
  };
  
  Vast.prototype.getAdMediaWidth = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return VPAID.getAdWidth.call(this);
      } else if (this.adIsLinear) {
        return this.adMediaWidth;
      } else {
        return this.nonLinearCreativeWidth;
      }
    }
    return -1;
  };
  
  Vast.prototype.getAdMediaHeight = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return VPAID.getAdHeight.call(this);
      } else if (this.adIsLinear) {
        return this.adMediaHeight;
      } else {
        return this.nonLinearCreativeHeight;
      }
    }
    return -1;
  };
  
  Vast.prototype.getClickThroughUrl = function () {
    return this.clickThroughUrl;
  };
  
  Vast.prototype.getIsSkippableAd = function () {
    return this.isSkippableAd;
  };
  
  Vast.prototype.getContentPlayerCompleted = function () {
    return this.contentPlayerCompleted;
  };
   
  Vast.prototype.setContentPlayerCompleted = function (value) {
    if (typeof value === 'boolean') {
      this.contentPlayerCompleted = value;
    }
  };
  
  Vast.prototype.getAdErrorMessage = function () {
    return this.vastErrorMessage;
  };
  
  Vast.prototype.getAdVastErrorCode = function () {
    return this.vastErrorCode;
  };
  
  Vast.prototype.getAdErrorType = function () {
    return this.adErrorType;
  };
  
  Vast.prototype.getEnvironment = function () {
    return ENV;
  };
  
  Vast.prototype.getFramework = function () {
    return FW;
  };
  
  Vast.prototype.getVastPlayer = function () {
    return this.vastPlayer;
  };
  
  Vast.prototype.getContentPlayer = function () {
    return this.contentPlayer;
  };
  
  Vast.prototype.getVpaidCreative = function () {
    if (this.adOnStage && this.isVPAID) {
      // starting here!!s
      console.log('start suspended!!')
      // return VPAID.getVpaidCreative.call(this);
    }
    return null;
  };
  
  Vast.prototype.getIsUsingContentPlayerForAds = function () {
    return this.useContentPlayerForAds;
  };
  
  Vast.prototype.initialize = function () {
    if (this.PilotxVastInitialized) {
      if (DEBUG) {
        FW.log('pilotx-vast already initialized');
      } 
    } else {
      if (DEBUG) {
        FW.log('on user interaction - player needs to be initialized');
      }
      console.log('GET THIS => ', this)


      
      VASTPLAYER.init.call(this);
    }
  };
  
  Vast.prototype.getInitialized = function () {
    return this.PilotxVastInitialized;
  };
  
  // adpod 
  Vast.prototype.getAdPodInfo = function () {
    if (this.adPodApiInfo.length > 0) {
      const result = {};
      result.adPodCurrentIndex = this.adPodCurrentIndex;
      result.adPodLength = this.adPodApiInfo.length;
      return result;
    }
    return null;
  };
  
  // VPAID methods
  Vast.prototype.resizeAd = function (width, height, viewMode) {
    if (this.adOnStage && this.isVPAID) {
      VPAID.resizeAd.call(this, width, height, viewMode);
    }
  };
  
  Vast.prototype.expandAd = function () {
    if (this.adOnStage && this.isVPAID) {
      VPAID.expandAd.call(this);
    }
  };
  
  Vast.prototype.collapseAd = function () {
    if (this.adOnStage && this.isVPAID) {
      VPAID.collapseAd.call(this);
    }
  };
  
  Vast.prototype.skipAd = function () {
    if (this.adOnStage && this.isVPAID) {
      VPAID.skipAd.call(this);
    }
  };
  
  Vast.prototype.getAdExpanded = function () {
    if (this.adOnStage && this.isVPAID) {
      VPAID.getAdExpanded.call(this);
    }
    return false;
  };
  
  Vast.prototype.getAdSkippableState = function () {
    if (this.adOnStage && this.isVPAID) {
      VPAID.getAdSkippableState.call(this);
    }
    return false;
  };
  
  Vast.prototype.getAdCompanions = function () {
    if (this.adOnStage && this.isVPAID) {
      VPAID.getAdCompanions.call(this);
    }
    return '';
  };
};

export default API;
