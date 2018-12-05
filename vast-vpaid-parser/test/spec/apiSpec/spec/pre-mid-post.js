'use strict';

var ADTAG1 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';
var ADTAG2 = 'https://www.radiantmediaplayer.com/vast/tags/vpaid-2-js-linear.xml';
var ADTAG3 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';

describe('Test for pre-mid-post', function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = document.querySelector('.rmp-video');
  var params = {
    enableVpaid: true,
    vpaidSettings: {
      width: 640,
      height: 360,
      viewMode: 'normal',
      desiredBitrate: 500
    }
  };
  var rmpVast = new RmpVast(id, params);
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

  it('should load pre-mid-post', function (done) {
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
    container.addEventListener('adstarted', function (e) {
      if (env.isAndroid[0]) {
        rmpVast.resizeAd(320, 180, 'normal');
      }
      _incrementAndLog(e);
    });
    container.addEventListener('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adtagloaded', function (e) {
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
    var addestroyedCount = 0;
    var contentPlayer;
    var loadPostRoll = true;
    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      addestroyedCount++;
      if (!contentPlayer) {
        contentPlayer = rmpVast.getContentPlayer();
      }
      if (addestroyedCount === 1) {
        expect(validSteps).toBe(9);
        setTimeout(() => {
          contentPlayer.currentTime = 15;
        }, 1000);

        setTimeout(() => {
          rmpVast.loadAds(ADTAG2);
        }, 3000);
      }
      if (addestroyedCount === 2) {
        expect(validSteps).toBe(18);
        contentPlayer.addEventListener('ended', () => {
          if (loadPostRoll) {
            loadPostRoll = false;
            rmpVast.loadAds(ADTAG3);
          }
        });
        setTimeout(() => {
          contentPlayer.currentTime = 96;
        }, 1000);
      }
      if (addestroyedCount === 3) {
        expect(validSteps).toBe(27);
        if (validSteps === 27) {
          title.textContent = 'Test completed';
        }
        setTimeout(function () {
          done();
        }, 100);
      }
    });

    rmpVast.loadAds(ADTAG1);
  });


});
