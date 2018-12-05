
                            var xhrRadar = new XMLHttpRequest();
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
                                  console.log("Active");
                                }
                              }
                              xhrRadar.open('GET', '//radar.pilotx.tv/light?fid=38&daid=3969&aid=54&cid=38&zid=1&conv=1&action=0&pageurl=' + encodeURIComponent(window.location.href), true);
                              xhrRadar.send(null);
                            }
                          
                            function inActiveRadar() {
                              xhrRadar.onreadystatechange = function () {
                                if (xhrRadar.readyState == XMLHttpRequest.DONE) {
                                  console.log("Inactive");
                                }
                              }
                              xhrRadar.open('GET', '//radar.pilotx.tv/light?fid=38&daid=3969&aid=54&cid=38&zid=1&conv=1&action=1&pageurl=' + encodeURIComponent(window.location.href), true);
                              xhrRadar.send(null);
                            }



   var xhrRadar = new XMLHttpRequest();
   xhrRadar.onreadystatechange = function () {
      if (xhrRadar.readyState == XMLHttpRequest.DONE) {
        console.log("Active");
      }
    }
    xhrRadar.open('GET', 'https://adn.pilotx.tv/light?${this.props.pixelTag.id}&daid=${this.props.pixelTag.account_id}&aid=${this.props.pixelTag.advertiser_id}&cid=${this.props.pixelTag.campaign_id}&zid=${this.props.pixelTag.zone_id}&conv=0&action=0&pageurl=' + encodeURIComponent(window.location.href), true);
    xhrRadar.send(null);