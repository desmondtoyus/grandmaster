'use strict';

var ADTAG = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=' + Date.now();


describe('Test for ImaInlineLinearSpec', function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = document.querySelector('.rmp-video');
  var rmpVast = new RmpVast(id);
  var fw = rmpVast.getFramework();
  var env = rmpVast.getEnvironment();
  var ua = window.navigator.userAgent;
  var regExp = /(edge\/|firefox\/)/i;
  if (!regExp.test(ua)) {
    video.muted = true;
  }
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  var title = document.getElementsByTagName('title')[0];

  it('should load adTag and play it', function (done) {
    var validSteps = 0;

    var _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        fw.log(event.type);
      }
    };

    container.addEventListener('adloaded', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('addurationchange', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adimpression', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adstarted', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adpaused', function (e) {
      // adpaused fires also just before adcomplete
      _incrementAndLog(e);
    });
    container.addEventListener('adresumed', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adcomplete', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adfirstquartile', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('admidpoint', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adthirdquartile', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      var timeupdateCount = 0;
      video.addEventListener('timeupdate', function (e) {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          if (validSteps === 13) {
            expect(validSteps).toBe(13);
            title.textContent = 'Test completed';
            done();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);
  });


});
