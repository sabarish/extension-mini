function focusOrCreateTab(url) {
  chrome.windows.getAll({"populate":true}, function(windows) {
    var existing_tab = null;
    for (var i in windows) {
      var tabs = windows[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j];
        if (tab.url == url) {
          existing_tab = tab;
          break;
        }
      }
    }
    if (existing_tab) {
      chrome.tabs.update(existing_tab.id, {"selected":true});
    } else {
      chrome.tabs.create({"url":url, "selected":true});
    }
  });
}

function getNotificationCount(){
  return "5";
}

function isUserLoggedin(){
  var np = new Promise(function (resolve, reject) {
    var loginstate = null;
    chrome.storage.sync.get("chronuslogin", function (result) {
      loginstate = result.chronuslogin;
      resolve(loginstate);
    });
  });
  np.then(function (loginstate) {
    return loginstate;
  });
}

function loginURL(){
  var p = new Promise(function (resolve, reject) {
    var url = null;
    chrome.storage.sync.get("chronusloginurl", function (result) {
      url = result.chronusloginurl;
      resolve(url);
    });
  });
  p.then(function (url) {
    return url;
  });
}

function setBrowserIcon(color){
  chrome.browserAction.setIcon({
    path : {
      "16": "images/chronus_"+color+"_16.png",
      "48": "images/chronus_"+color+"_48.png",
      "128": "images/chronus_"+color+"_128.png"
    }
  });
}

chrome.cookies.get({url: "https://onboarding.chronus.com", name:'session_active'}, function(cookie) {
  if (true) {    
    chrome.storage.sync.set({"chronusloginurl": "https://onboarding.chronus.com"}, function(){});
    chrome.storage.sync.set({"chronuslogin": true}, function(){});
    setBrowserIcon("color");
    loginURL();
    isUserLoggedin();
    chrome.browserAction.setBadgeBackgroundColor({ color: "#db4437" });
      chrome.browserAction.setBadgeText({text: getNotificationCount()});
  }
  else{    
    chrome.storage.sync.set({"chronuslogin": false});
    setBrowserIcon("grey");
    chrome.browserAction.setBadgeBackgroundColor({ color: "#db4437" });
    chrome.browserAction.setBadgeText({text: ''});
  }
});



// chrome.browserAction.onClicked.addListener(function(tab) {
  // var manager_url = chrome.extension.getURL("https://onboarding.chronus.com");
  // alert("hello");
  // focusOrCreateTab(manager_url);
// });

chrome.runtime.onInstalled.addListener(function() {
  if(loginURL() != null){
    if(isUserLoggedin() != null){
      $("#loginform").removeClass("hide");
      $("#notifications").addClass("hide");
    }    
  }
  else{
    $("#loginform").addClass("hide");
    $("#notifications").removeClass("hide");
    chrome.storage.sync.set({"chronuslogin": false}, function(){});
  }
  alert("hi");
});