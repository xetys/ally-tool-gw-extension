
let allyToolTabId = -1;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if(changeInfo.status === "complete") {
    console.log('i am running on ' + tab.url);
    if (tab.url.indexOf('ally-tool.sys11') > -1) {
        allyToolTabId = tab.id;
    }
    if (tab.url.indexOf('gigrawars.de/game_highscore') > -1) {
        chrome.tabs.sendMessage(tab.id, { action: "execute_script"}, function (r) {
            if (allyToolTabId > -1) {
                chrome.tabs.sendMessage(allyToolTabId, { 
                    action: "send_to_am", 
                    dataType: "highscore", 
                    data: r
                }, function() {});
            }
        });
    }

    if (tab.url.indexOf('gigrawars.de/game_player') > -1) {
        chrome.tabs.sendMessage(tab.id, { action: "execute_script"}, function (r) {
            if (allyToolTabId > -1) {
                chrome.tabs.sendMessage(allyToolTabId, { 
                    action: "send_to_am", 
                    dataType: "info", 
                    data: r
                }, function() {});
            }
        });
    }
  }
});