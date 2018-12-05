(function (window) {
  'use strict';
  function getRadarTagParameter(name, url) {
    if (!url)
      url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results)
      return null;
    if (!results[2])
      return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  var radarScript = document.getElementById('pilotxradar');
  if (!radarScript) {
    console.log('Error: Can not find Radar tag on web page');
    return;
  }
    var radarScriptURL = radarScript.src,
    radarfid = getRadarTagParameter('fid', radarScriptURL),
    radardaid = getRadarTagParameter('daid', radarScriptURL),
    radaraid = getRadarTagParameter('aid', radarScriptURL),
    radarcid = getRadarTagParameter('cid', radarScriptURL),
    radarzid = getRadarTagParameter('zid', radarScriptURL),
    radarType = getRadarTagParameter('type', radarScriptURL),
    xhrRadar = new XMLHttpRequest(),
    xhrRadar2 = new XMLHttpRequest(),
    radarPrefix = getRadarPrefix(),
    radarHidden = getHiddenRadarProperty(radarPrefix),
    radarVisibilityState = getRadarVisibilityStateProperty(radarPrefix),
    radarVisibilityChangeEvent = getRadarVisibilityEvent(radarPrefix);

    if(!radarType || !radarzid || !radarcid || !radaraid || !radardaid|| !radarfid)
    {
      console.log('Error: Radar tag no properly formed');
      return;
    }


  window.onload = function (e) {
    //  1 = targeting
    if (radarType == '1') {
      radarTargeting();
    } 
    // 2 = conversion
    else if (radarType == '2') {
      activeRadar()
      document.addEventListener(radarVisibilityChangeEvent, function (e) {
        if (document[radarHidden]) {
          inActiveRadar();

        } else {
          activeRadar();
        }
      });
    } 
    // conversion and targeting
    else {
      radarTargeting();
      activeRadar();
      document.addEventListener(radarVisibilityChangeEvent, function (e) {
        if (document[radarHidden]) {
          inActiveRadar();

        } else {
          activeRadar();
        }
      });
    }
  }

  function getRadarPrefix() {
    if ('radarHidden' in document) {
      return null;
    }

    var prefixesRadar = ['moz', 'ms', 'o', 'webkit'];

    for (var i = 0; i < prefixesRadar.length; i++) {
      var testPrefix = prefixesRadar[i] + 'Hidden';
      if (testPrefix in document) {
        return prefixesRadar[i];
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
    xhrRadar.onreadystatechange = function () {
      if (xhrRadar.readyState == XMLHttpRequest.DONE) {
        console.log("INVIEW");
      }
    }
    xhrRadar.open('GET', '//radar.pilotx.tv/light?fid=' + radarfid + '&daid=' + radardaid + '&aid=' + radaraid + '&cid=' + radarcid + '&zid=' + radarzid + '&conv=1&action=0&pageurl=' + encodeURIComponent(window.location.href), true);
    xhrRadar.send(null);
  }

  function inActiveRadar() {
    xhrRadar.onreadystatechange = function () {
      if (xhrRadar.readyState == XMLHttpRequest.DONE) {
        console.log("OUT OF VIEW");
      }
    }
    xhrRadar.open('GET', '//radar.pilotx.tv/light?fid=' + radarfid + '&daid=' + radardaid + '&aid=' + radaraid + '&cid=' + radarcid + '&zid=' + radarzid + '&conv=1&action=1&pageurl=' + encodeURIComponent(window.location.href), true);
    xhrRadar.send(null);
  }

  function radarTargeting() {
    xhrRadar2.onreadystatechange = function () {
      if (xhrRadar2.readyState == XMLHttpRequest.DONE) {
        console.log("Re-targetted");
      }
    }
    xhrRadar2.open('GET', '//radar.pilotx.tv/light?fid=' + radarfid + '&daid=' + radardaid + '&aid=' + radaraid + '&cid=' + radarcid + '&zid=' + radarzid + '&conv=0&action=0&pageurl=' + encodeURIComponent(window.location.href), true);
    xhrRadar2.send(null);
  }

}(window));