function changePage(url) {
    window.history.pushState("info", "info" , "https://ally-tool.sys11.stytex.cloud" + url); 
    location.hash = ' ';

    setTimeout(function () {
        location.hash = '';
    }, 100)
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.action) {
            case "execute_script": {
                // your code here
                console.log('got message from worker', sender, sendResponse);
                document.execCommand("selectAll"); document.execCommand("copy");
                window.getSelection().removeAllRanges();
                var ta = document.createElement('textarea');
                document.body.appendChild(ta);
                ta.focus();
                document.execCommand('paste');
                sendResponse(ta.value);
                document.body.removeChild(ta);
                break;
            }
            case "send_to_am": {
                console.log('got a call from GW', request.dataType);
                if (location.href.includes('ally-tool')) {
                    switch (request.dataType) {
                        case "highscore":
                            changePage("/import");
                            setTimeout(function () {
                                document.querySelector('body > jhi-main > div.container-fluid > div > jhi-stat-import > div > form > textarea').focus();
                                document.execCommand('paste');
                                document.querySelector('body > jhi-main > div.container-fluid > div > jhi-stat-import > div > form > button').click();
                            }, 100);
                            break;
                        case "info":
                            changePage("/internal/player-info-import");
                            setTimeout(function () {
                                document.querySelector('body > jhi-main > div.container-fluid > div > jhi-player-info-import > div > form > textarea').focus();
                                document.execCommand('paste');
                                // document.querySelector('body > jhi-main > div.container-fluid > div > jhi-player-info-import > div > form > button').click();
                            }, 100);
                    }
                }
                sendResponse();
            }
        }
    });
