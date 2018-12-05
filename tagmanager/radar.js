var prefix = getPrefix();
var hidden = getHiddenProperty(prefix);
var visibilityState = getVisibilityStateProperty(prefix);
var visibilityChangeEvent = getVisibilityEvent(prefix);

window.onload = function(e) {
convRadarStart() 
document.addEventListener(visibilityChangeEvent, function(e) {
  if (document[hidden]) {
    convRadarStop() 
      
  } else {
convRadarStart()
  }
});

}
window.onbeforeunload = function(e) {
  convRadarStop();
  };

function getPrefix() {
if ('hidden' in document) {
  return null;
}

var prefixes = ['moz', 'ms', 'o', 'webkit'];

for (var i = 0; i < prefixes.length; i++) {
  var testPrefix = prefixes[i] + 'Hidden';
  if (testPrefix in document) {
    return prefixes[i];
  }
}
return null;
}

function getHiddenProperty(prefix) {
if (prefix) {
  return prefix + 'Hidden';
} else {
  return 'hidden';
}
}

function getVisibilityStateProperty(prefix) {
if (prefix) {
  return prefix + 'VisibilityState';
} else {
  return 'visibilityState';
}
}

function getVisibilityEvent(prefix) {
if (prefix) {
  return prefix + 'visibilitychange';
} else {
  return 'visibilitychange';
}
}

function convRadarStart() {
console.log("Active");
fetch("//adn.pilotx.tv/light?fid=365&daid=1&aid=1&cid=1&zid=1&conv=1&action=0&pageurl="+encodeURIComponent(window.location.href)
)
  .then(function(response) {
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });
}
function convRadarStop() {
console.log("Inactive");
fetch("//adn.pilotx.tv/light?fid=365&daid=1&aid=1&cid=1&zid=1&conv=1&action=1&pageurl="+encodeURIComponent(window.location.href)
)
  .then(function(response) {
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  })
}

function trackingRadar() {
  fetch('//adn.pilotx.tv/light?${this.props.pixelTag.id}&daid=${this.props.pixelTag.account_id}&aid=${this.props.pixelTag.advertiser_id}&cid=${this.props.pixelTag.campaign_id}&zid=${this.props.pixelTag.zone_id}&conv=0&action=0&pageurl=' + encodeURIComponent(window.location.href))
  .then(function(response) {
    console.log('Success');
  })
  .catch(function(err) {
    console.log("err");
  })
}


