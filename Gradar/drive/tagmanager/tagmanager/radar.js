// THIS IS FOR CONVERSION CONV =1

function getRadarTagParameter(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var radarScript = document.getElementById('pilotx-tag-manager');



var radarScriptURL = radarScript.src;
var radarfid= getRadarTagParameter('fid', radarScriptURL);
var radardaid= getRadarTagParameter('daid', radarScriptURL);
var radaraid= getRadarTagParameter('aid', radarScriptURL);
var radarcid= getRadarTagParameter('cid', radarScriptURL);
var radarzid= getRadarTagParameter('zid', radarScriptURL);
console.log('FID =', radarfid, 'DAID=', radardaid, 'AID=', radaraid, 'CID=',radarcid, 'ZID=',radarzid)

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
                                  console.log("INVIEW");
                                }
                              }
                              xhrRadar.open('GET', 'https://radar.pilotx.tv/light?fid='+radarfid+'&daid='+radardaid+'&aid='+radaraid+'&cid='+radarcid+'&zid='+radarzid+'&conv=1&action=0&pageurl=' + encodeURIComponent(window.location.href), true);
                              xhrRadar.send(null);
                            }
                          
                            function inActiveRadar() {
                              xhrRadar.onreadystatechange = function () {
                                if (xhrRadar.readyState == XMLHttpRequest.DONE) {
                                  console.log("OUT OF VIEW");
                                }
                              }
                              xhrRadar.open('GET', 'https://radar.pilotx.tv/light?fid='+radarfid+'&daid='+radardaid+'&aid='+radaraid+'&cid='+radarcid+'&zid='+radarzid+'&conv=1&action=1&pageurl=' + encodeURIComponent(window.location.href), true);
                              xhrRadar.send(null);
                            }


                            