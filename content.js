let titleAnimation = null;
function changePage(url) {
    window.history.pushState("info", "info" , "https://ally-tool.sys11.stytex.cloud" + url); 
    location.hash = ' ';

    setTimeout(function () {
        location.hash = '';
    }, 100)
}

function animateTitle() {
    if (!titleAnimation) { 
        const currentTitle = document.title;
        document.title = "tik tok";


        titleAnimation = setTimeout(function () {
            titleAnimation = null;
            document.title = currentTitle;
        }, 499)
    }
}

function postData(url, input) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        var token = localStorage.getItem('jhi-authenticationtoken').replaceAll(/["]/g, "");

        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.statusText);
                }
            }
        };
        var data = JSON.stringify({text: input});
        xhr.send(data);
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('got message from worker', sender, request);
        switch (request.action) {
            case "execute_script": {
                // your code here
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
                            // changePage("/import");
                            // setTimeout(function () {
                            //     document.querySelector('body > jhi-main > div.container-fluid > div > jhi-stat-import > div > form > textarea').focus();
                            //     document.execCommand('paste');
                            //     document.querySelector('body > jhi-main > div.container-fluid > div > jhi-stat-import > div > form > button').click();
                            // }, 100);
                            postData("https://ally-tool.sys11.stytex.cloud/api/v1/import", request.data)
                                .then(response => {
                                    console.log("highscore import succeeded");
                                    animateTitle();
                                    sendResponse(response);
                                }).catch(e => {
                                    console.error('an error occured', e);
                                    sendResponse(e);
                                });
                            break;
                        case "info":
                            postData("https://ally-tool.sys11.stytex.cloud/api/v1/player-info/import", request.data)
                                .then(response => {
                                    console.log("player info import succeeded");
                                    animateTitle();
                                    sendResponse(response);
                                }).catch(e => {
                                    console.error('an error occured', e);
                                    sendResponse(e);
                                });
                            // changePage("/internal/player-info-import");
                            // setTimeout(function () {
                            //     document.querySelector('body > jhi-main > div.container-fluid > div > jhi-player-info-import > div > form > textarea').focus();
                            //     document.execCommand('paste');
                            //     // document.querySelector('body > jhi-main > div.container-fluid > div > jhi-player-info-import > div > form > button').click();
                            // }, 100);
                    }
                }
                sendResponse();
            }
        }
    });
