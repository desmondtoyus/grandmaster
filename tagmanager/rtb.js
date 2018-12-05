var data = {
  "tagType": "<'init', 'event', OR 'timer'>",
  "key": "<NEEDED FOR 'event' AND 'timer'>",
  "pingInterval": "<NEEDED FOR 'timer'>",
  "maxPings": "<NEEDED FOR 'timer'>",
  "buildAudience": "<OPTIONAL>",
  "visitKey": "<ONLY NEEDED IF buildAudience>"
}
var getQueryParam = function(name) {
    var safeName = name["replace"](/[\[]/, "\\[")["replace"](/[\]]/, "\\]");
    var regex  = new RegExp("[\\?&]" + safeName + "=([^&#]*)");
    var results = regex["exec"](location["search"]);
    return results === null ? "" : decodeURIComponent(results[1]["replace"](/\+/g,  " "));
};
var sendEvent = function(data, tr){
    console.log("Send Event", data);
  	var key = data["key"];
    if (data["tagType"] == "timer") {
        if (typeof(window["pingCount"]) == "undefined") {
            window["pingCount"] = 0;
        }
        var elapsed = parseInt(window["pingCount"]*data["pingInterval"], 10);
        key += ("-" + elapsed);
    }
    var params = {"tr": tr, "ev": key};
    var url = "//platform.rtbiq.com/events/";
    var args = Object["keys"](params)["map"](function(key) { return key+"="+params[key]; });
    var queryString = "?"+args["join"]("&");

    var xmlhttp = new XMLHttpRequest();
    xmlhttp["open"]("GET", url+queryString, true);
    xmlhttp["send"]();
    if (data["tagType"] == "timer") {
        window["pingCount"] += 1;
        if (window["pingCount"] < data["maxPings"]) {
            setTimeout(sendEvent, data["pingInterval"]*1000, data, tr);
        }
    }
}
var optiq = function(data) {
  	console.log("[[OPTiQ]]", data);
    if (getQueryParam("tr")) {
        var tr = getQueryParam("tr");
        sessionStorage["setItem"]("tr", tr);
        document["cookie"] = "tr=" + tr + "; path=/";
        if (data["tagType"] == "init") {
            return;
        }
    } else if (sessionStorage["getItem"]("tr")) {
        var tr = sessionStorage["getItem"]("tr");
    } else {
        var tr = null;
        cookies = document["cookie"]["split"](";");
        for(var i = 0; i < cookies["length"]; i++) {
            var c = cookies[i];
            while (c["charAt"](0)==" ") {
                c = c["substring"](1);
            };
            if (c["indexOf"]("tr=") == 0) {
                tr = c["substring"](3, c["length"]);
            }
        }
    };

    if (!tr) {
        if (data["buildAudience"]) {
            var cid = null
            cookies = document["cookie"]["split"](";");
            for(var i = 0; i < cookies["length"]; i++) {
                var c = cookies[i];
                while (c["charAt"](0)==" ") {
                    c = c["substring"](1);
                };
                if (c["indexOf"]("cid=") == 0) {
                    cid = c["substring"](4, c["length"]);
                }
            }
            if (!cid){
                cid = Math.floor(Math.random()*Math.pow(10, 8));
                document["cookie"] = "cid=" + cid + "; path=/";
            }
            var key = data["visitKey"];
            var url = "//platform.rtbiq.com/events?ev=" + key + "&c=" + cid;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp["open"]("GET", url, true);
            xmlhttp["send"]();
        };
        return;
    };
    if (data["tagType"] != 'init'){
        sendEvent(data, tr);
    }
}
optiq(data);
