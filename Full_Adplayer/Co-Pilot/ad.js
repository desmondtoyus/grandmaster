/**
 * Copyright 2014 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 *
 */
// document.write('<scr' + 'ipt type="text/javascript" src="https://imasdk.googleapis.com/js/sdkloader/ima3.js" ></scr' + 'ipt>');
// import google from 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
let playList = [];
let playArr = [];
function inPicture(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;
    // Only completely visible elements return true:
    // var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
};



let addclose = document.getElementsByClassName('pilot-video');
for (let index = 0; index < addclose.length; index++) {
    let c = document.getElementsByClassName('pilot-video')[index];
    let id = c.childNodes[1].id;
    let closeBtn = document.createElement('div');
    closeBtn.innerHTML = '&#10006;'
    closeBtn.id = 'close-' + id;
    closeBtn.classList.add('pilot-closeBtn');
    closeBtn.addEventListener("click", function (e) {
        videojs(id).ima.getAdsManager().setVolume(0);
        document.getElementById(id).parentNode.style.display = 'none';
    });
    let cont = document.createElement('span');
    cont.appendChild(closeBtn);
    // addclose[index].appendChild(closeBtn);
    addclose[index].insertBefore(cont, addclose[index].firstChild);
}


function pilotSlider(id) {
    let stopPosition = 20;
    if (parseInt(document.getElementById(id).parentNode.style.right) < stopPosition) {
        document.getElementById(id).parentNode.style.right = parseInt(document.getElementById(id).parentNode.style.right) + 10 + "px";
        setTimeout(() => {
            pilotSlider(id)
        }, 0.5);

    }
}

function pilotSlideOut(id) {
    let stopPosition = -750;
    if (parseInt(document.getElementById(id).parentNode.style.right) > stopPosition) {
        document.getElementById(id).parentNode.style.right = parseInt(document.getElementById(id).parentNode.style.right) - 10 + "px";
        setTimeout(() => {
            pilotSlideOut(id)
        }, 0.5);

    }
    else {
        let closePlayer = document.getElementById(id);
        closePlayer.style.visibility = 'hidden';
        closePlayer.getElementsByClassName('vjs-control-bar')[0].style.visibility = 'hidden';
        closePlayer.parentNode.style.visibility = 'hidden'
    }
}

// SLIDING VIDEOconta

if (document.getElementsByClassName('slider')) {
    let slidingTotal = document.getElementsByClassName('pilot-video slider');
    for (let index = 0; index < slidingTotal.length; index++) {
        document.getElementsByClassName('pilot-video slider')[index].style.display = 'block';
        document.getElementsByClassName('pilot-video slider')[index].style.right = '-650px';
    }
}


function fadeIn(ele) {
    if (parseFloat(ele.style.opacity) < 1) {
        ele.style.opacity = parseFloat(ele.style.opacity) + 0.005;
        setTimeout(() => {
            fadeIn(ele)
        }, 0.5);
    }

};


function expand(ele, playerHeight) {
    let style = window.getComputedStyle(ele);
    let eleHeight = style.getPropertyValue('height');
    if (parseInt(eleHeight) <= parseInt(playerHeight) + 20) {
        ele.style.height = parseInt(eleHeight) + 10 + 'px';
        setTimeout(() => {
            expand(ele, playerHeight);
        }, 20);
    }

};

function collapse(ele) {
    let style = window.getComputedStyle(ele);
    let eleHeight = style.getPropertyValue('height');
    if (parseInt(eleHeight) >= 10) {
        ele.style.height = parseInt(eleHeight) - 10 + 'px';
        setTimeout(() => {
            collapse(ele);
        }, 20);
    }

};

function fadeOut(ele) {
    if (parseFloat(ele.style.opacity) >= 0) {
        ele.style.opacity = parseFloat(ele.style.opacity) - 0.05;
        setTimeout(() => {
            fadeOut(ele)
        }, 0.5);
    }

};

function pause(id) {
    var player = videojs(id);
    player.ima.pauseAd();
}

function play(id) {
    let childDiv = document.getElementById(id);
    let parent = document.getElementById(id).parentNode;
    if (playArr.indexOf(id) == -1 && (parent.classList.contains('in_article') || parent.classList.contains('in_article_fixed'))) {
        playArr.push(id);
        let divStyle = window.getComputedStyle(childDiv);
        let playHeight = divStyle.getPropertyValue('height');
        var player = videojs(id);
        player.ima.resumeAd();
        expand(parent, playHeight)

    } else {
        var player = videojs(id);
        player.ima.resumeAd();
    }
}

var Player = function (id, vastTag, inArticle) {
    this.id = id;
    this.inArticle = inArticle;
    this.console = document.getElementById('ima-sample-console');
    this.playerz = videojs(id);
    this.init = function () {
        var player = videojs(this.id, {
            children: {
                controlBar: {
                    children: {
                        volumeControl: false
                    }
                }
            }
        });

        var options = {
            id: id,
            adTagUrl: vastTag,
            adsManagerLoadedCallback: this.adsManagerLoadedCallback.bind(this),
            preload: 'auto',
            adLabel: 'p',
            // FIX FOR CHROME BUG. NOW NOT SHOWING CONTROL
            vpaidMode: google.ima.ImaSdkSettings.VpaidMode.INSECURE
            // showControlsForJSAds: false
        };
        player.ima(options);

        // Remove controls from the player on iPad to stop native controls from stealing
        // our click
        var contentPlayer = document.getElementById(id);
        if ((navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/Android/i)) &&
            contentPlayer.hasAttribute('controls')) {
            contentPlayer.removeAttribute('controls');
        }

        // Initialize the ad container when the video player is clicked, but only the
        // first time it's clicked.
        var startEvent = 'click';
        if (navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/Android/i)) {
            startEvent = 'touchend';
        }
        player.on('adserror', function () {
            console.log('Error Occured at', id);
            document.getElementById(id).parentNode.style.display = 'none';
        });

        player.one(startEvent, function () {
            player.ima.initializeAdDisplayContainer();
        });
    }
}
Player.prototype.adsManagerLoadedCallback = function () {
    var events = [
        google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        google.ima.AdEvent.Type.CLICK,
        google.ima.AdEvent.Type.COMPLETE,
        google.ima.AdEvent.Type.FIRST_QUARTILE,
        google.ima.AdEvent.Type.LOADED,
        google.ima.AdEvent.Type.MIDPOINT,
        google.ima.AdEvent.Type.PAUSED,
        google.ima.AdEvent.Type.STARTED,
        google.ima.AdEvent.Type.THIRD_QUARTILE
    ];

    for (var index = 0; index < events.length; index++) {
        this.playerz.ima.addEventListener(
            events[index],
            this.onAdEvent.bind(this));
    }
};

Player.prototype.onAdEvent = function (event) {
    let endingPlay = document.getElementById(this.id);
    let logoDiv = document.createElement('div');
    logoDiv.classList.add("logostyle");
    let logoImg = document.createElement('img');
    logoImg.src = 'https://player.pilotxcdn.com/CoPilot.png';
    logoDiv.appendChild(logoImg);
    let controlDiv = this.id + '_ima-controls-div';
    let dataView = endingPlay.getAttribute('data-view');
    if (endingPlay.parentNode.classList.contains('in_article') && !document.getElementById('placeholder' + this.id)) {
        let placeholder = document.createElement('div');
        placeholder.id = 'placeholder' + this.id;
        endingPlay.parentNode.parentNode.insertBefore(placeholder, endingPlay.parentNode);
    }
    // ADDING LOGO TO PLAYER
    if (dataView !== 'mobile_web') {
        document.getElementById(controlDiv).appendChild(logoDiv);
    }

    if (event.type == 'loaded') {
        endingPlay.parentNode.id = 'pilot-' + this.id;
        if (endingPlay.hasAttribute("muted")) {
            videojs(this.id).ima.getAdsManager().setVolume(0);
        }

        if (dataView == 'mobile_web') {
            // document.getElementById(this.id + '_ima-play-pause-div').style.left = '35%';
            // document.getElementById(this.id + '_ima-mute-div').style.left = '45%';
            document.getElementById(this.id + '_ima-play-pause-div').style.left = '75%';
            document.getElementById(this.id + '_ima-mute-div').style.left = '85%'
            document.getElementById(this.id + '_ima-countdown-div').style.fontSize = '0';
        }
    }
    console.log("EVENT", event.type);
    if (event.type == 'start') {
        if (endingPlay.parentNode.classList.contains('standard')) {
            endingPlay.parentNode.style.visibility = 'visible';
            endingPlay.parentNode.style.opacity = 0;
            endingPlay.style.visibility = 'visible';
            pause(this.id);
            playList.push(this.id);
            fadeIn(endingPlay.parentNode);
            console.log('PAUSED');
            if (this.inArticle.indexOf('article') >= 0) {
                endingPlay.getElementsByClassName('vjs-control-bar')[0].style.height = '0px';
            }
        }
        if (endingPlay.parentNode.classList.contains('slider')) {
            endingPlay.parentNode.style.visibility = 'visible';
            endingPlay.style.visibility = 'visible';
            pilotSlider(this.id);

            let style = window.getComputedStyle(endingPlay);
            let playerHeight = style.getPropertyValue('height');
            let parentHeight = parseInt(playerHeight) +20;
            endingPlay.parentNode.style.height = parentHeight+'px';

        }
        if (endingPlay.parentNode.classList.contains('in_article') || endingPlay.parentNode.classList.contains('in_article_fixed')) {
            endingPlay.parentNode.style.visibility = 'visible';
            endingPlay.style.visibility = 'visible';
            pause(this.id);
            let divInView = inPicture(document.getElementById('pilot-' + this.id));
            if (divInView) {
                let style = window.getComputedStyle(endingPlay);
                let playerHeight = style.getPropertyValue('height');
                expand(endingPlay.parentNode, playerHeight);
                playList.push(this.id);
                playArr.push(this.id);
            }
            else {
                checkScroll();
            }
        }
    }
    if (event.type == 'pause') {
        checkScroll();
    }

    if (event.type == 'complete') {
        if (this.inArticle.indexOf('article') >= 0) {
            pause(this.id);
            collapse(endingPlay.parentNode);
        }
        else if (endingPlay.parentNode.classList.contains('slider')) {
            pilotSlideOut(this.id);

        }
        else {
            endingPlay.style.visibility = 'hidden';
            fadeOut(endingPlay.parentNode);
            endingPlay.getElementsByClassName('vjs-control-bar')[0].style.visibility = 'hidden';
            endingPlay.parentNode.style.visibility = 'hidden';
        }
    }
};

var obj = document.getElementsByClassName("pilot-player");
var realHeight = [];
var realWidth = [];
for (let index = 0; index < obj.length; index++) {

    realHeight[index] = document.getElementsByClassName('pilot-player')[index].height;
    realWidth[index] = document.getElementsByClassName('pilot-player')[index].width;
    let id = obj[index].getAttribute('id');
    let vastTag = obj[index].getAttribute("value");
    let inArticle = '';
    if (document.getElementsByClassName('pilot-video')[index].classList.contains('in_article') || document.getElementsByClassName('pilot-video')[index].classList.contains('in_article_fixed')) {
        inArticle = 'in_article'
    }
    console.log('CHECKER', inArticle);
    console.log(id);
    console.log(vastTag);
    console.log('=============================');
    var player1 = new Player(id, vastTag, inArticle);
    player1.init();
}
var videos = document.getElementsByClassName("pilot-player");
var fraction = 0.6;
let count = []

function checkScroll() {
    if (document.getElementsByClassName("pilot-player")[0]) {
        for (let i = 0; i < videos.length; i++) {
            var playVideo = videos[i];
            let playId = videos[i].getAttribute('id');
            var x = playVideo.offsetLeft, y = playVideo.offsetTop, w = playVideo.offsetWidth, h = playVideo.offsetHeight, r = x + w, //right
                b = y + h, //bottom
                visibleX, visibleY, visible;
            visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - x, r - window.pageXOffset));
            visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - y, b - window.pageYOffset));
            visible = visibleX * visibleY / (w * h);

            if (document.getElementById(playId).parentNode.classList.contains('stuck') && inPicture(document.getElementById('placeholder' + playId) )) {
                document.getElementById(playId).parentNode.classList.remove("stuck");
            }
            if (visible > fraction) {
                let indexOfPlayer = playList.indexOf(playId);
                if (!(document.getElementById(playId).parentNode.classList.contains('pilot-checker')) && !(document.getElementById(playId).parentNode.classList.contains('stuck')) && playId && indexOfPlayer > -1) {
                    play(playId);
                    playList.splice(indexOfPlayer, 1);
                    console.log('PLAY');
                }
                if ((!document.getElementById(playId).classList.contains('pilot-checker')) && (document.getElementById(playId).parentNode.classList.contains('stuck')) && inPicture(document.getElementById('placeholder' + playId))) {
                    document.getElementById(playId).parentNode.classList.remove('stuck');
                }
                playVideo.style.offsetHeight = realHeight[i] + "px";
                playVideo.style.width = realWidth[i] + "px";
                document.getElementById(playId).classList.add("pilot-checker");
                if (document.getElementById(playId).parentNode.classList.contains('stuck') && inPicture(document.getElementById('placeholder' + playId))) {
                    document.getElementById(playId).parentNode.classList.remove("stuck");
                    document.getElementsByClassName('in_article')[i].style.offsetHeight = realHeight[i] + "px";
                }
            } else {
                if (!document.getElementById(playId).parentNode.classList.contains('in_article') || playList.indexOf(playId) == -1) {
                    playList.push(playId);
                }
                if ((document.getElementById(playId).classList.contains('pilot-checker')) && (document.getElementById(playId).parentNode.classList.contains('in_article')) && !inPicture(document.getElementById('placeholder' + playId))) {
                    document.getElementById(playId).parentNode.classList.add("stuck");
                    document.getElementById(playId).parentNode.classList.remove("pilot-checker");
                }
                if (document.getElementById(playId).parentNode.classList.contains('in_article_fixed') || document.getElementById(playId).parentNode.classList.contains('standard')) {
                    document.getElementById(playId).classList.remove("pilot-checker");
                    pause(playId);
                }
            }

        }
    }
}
window.addEventListener('scroll', checkScroll, false);