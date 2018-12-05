

  var radarPrefix = getRadarPrefix();
  var radarHidden = getHiddenRadarProperty(radarPrefix);
  var radarVisibilityState = getRadarVisibilityStateProperty(radarPrefix);
  var radarVisibilityChangeEvent = getRadarVisibilityEvent(radarPrefix);

  window.onload = function (e) {
    activeRadar()
    document.addEventListener(radarVisibilityChangeEvent, function (e) {
      if (document[radarHidden]) {
        inActiveRadar()

      } else {
        activeRadar()
      }
    });

  }

  function getRadarPrefix() {
    if ('radarHidden' in document) {
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
  window.onbeforeunload = function (e) {
    inActiveRadar();
  };

  function getHiddenRadarProperty(radarPrefix) {
    if (radarPrefix) {
      return radarPrefix + 'Hidden';
    } else {
      return 'radarHidden';
    }
  }

  function getRadarVisibilityStateProperty(radarPrefix) {
    if (radarPrefix) {
      return radarPrefix + 'VisibilityState';
    } else {
      return 'visibilityState';
    }
  }

  function getRadarVisibilityEvent(radarPrefix) {
    if (radarPrefix) {
      return radarPrefix + 'visibilitychange';
    } else {
      return 'visibilitychange';
    }
  }

  function activeRadar() {
    console.log("Active");
    fetch("//adn.pilotx.tv/light?fid=${this.props.pixelTag.id}&daid=${this.props.pixelTag.account_id}&aid=${this.props.pixelTag.advertiser_id}&cid=${this.props.pixelTag.campaign_id}&zid=${this.props.pixelTag.zone_id}&conv=1&action=0&pageurl=" + encodeURIComponent(window.location.href)
    )
      .then(function (response) {
        console.log("Conversion Starts");
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  function inActiveRadar() {
    console.log("Inactive");
    fetch("//adn.pilotx.tv/light?fid=${this.props.pixelTag.id}&daid=${this.props.pixelTag.account_id}&aid=${this.props.pixelTag.advertiser_id}&cid=${this.props.pixelTag.campaign_id}&zid=${this.props.pixelTag.zone_id}&conv=1&action=1&pageurl=" + encodeURIComponent(window.location.href)
    )
      .then(function (response) {
        console.log('Conversion Ends');
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function trackingRadar() {
    fetch('//adn.pilotx.tv/light?fid=${this.props.pixelTag.id}&daid=${this.props.pixelTag.account_id}&aid=${this.props.pixelTag.advertiser_id}&cid=${this.props.pixelTag.campaign_id}&zid=${this.props.pixelTag.zone_id}&conv=0&action=0&pageurl=' + encodeURIComponent(window.location.href))
    .then(function(response) {
      console.log('T - Active');
    })
    .catch(function(err) {
      console.log("err");
    })
  }