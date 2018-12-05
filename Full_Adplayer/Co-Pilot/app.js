 function include(file, scriptType) {
    if (scriptType == 'css') {
      let head = document.head;
       let link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = file;
        head.appendChild(link);
    } else {
        let jsScript = document.createElement('script');
        jsScript.src = file;
        // script.type = 'text/javascript';
        document.body.appendChild(jsScript );     
    }

}

include('https://player.pilotxcdn.com/player.js', 'js');
include('https://imasdk.googleapis.com/js/sdkloader/ima3.js', 'js');
include('https://player.pilotxcdn.com/player.css', 'css');