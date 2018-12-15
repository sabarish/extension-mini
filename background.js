function focusOrCreateTab(url) {
  chrome.windows.getAll({"populate":true}, function(windows) {
    var existing_tab = null;
    for (var i in windows) {
      var tabs = windows[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j];
        if (tab.url.includes(url)) {
          existing_tab = tab;
          break;
        }
      }
    }
    if (existing_tab) {
      chrome.tabs.update(existing_tab.id, {"selected":true});
    } else {
      chrome.tabs.create({"url":url+"/session/new", "selected":true});
    }
  });
}

function createNotification(details){
  var i;
  var old_count;
  chrome.storage.sync.get('noti_count', function(notifications){
    old_count = parseInt(notifications.noti_count) || 0;
    new_count = old_count + details.length
    new_count = new_count || ''
    if (new_count != old_count){ 
      chrome.browserAction.setBadgeText({text: new_count.toString() });
      chrome.storage.sync.set({'noti_count': new_count.toString()}, function(){}); }
  });

  for (i = 0; i < details.length; i++) {
    options = {
      type: "basic",
      iconUrl: "images/chronus_color_48.png",
      title: "Chronus Lite",
      message: details[i]["message"]
    }
    chrome.notifications.create('noti', options)
  }
}

function get_content_url(content, url){
  if(content["url"]!=null){
    page = content["url"]; }
  else if(content["title"] == "AbstractMessage"){
    page = url + "/messages"; }
  else if(content["title"] == "Scrap"){
    page = url + "/scraps"; }
  else{
    page = url; }
  return page;
}

function createNotificationList(list, url){
  var i;
  var notification_list = '';
  for (i = 0; i < list.length; i++) {
    open_url = get_content_url(list[i], url);
    notification_list += '<a href="'+ open_url +'" target="_blank" class="list-group-item list-group-item-action"><i class="glyphicon glyphicon-envelope"></i><span style="padding-left:10px">' + list[i]["message"] + '</span></a>';
  }
  chrome.runtime.sendMessage({listt: notification_list}, function(response){});
}

function store_details(user_details){
  chrome.storage.sync.set({'is_admin': user_details["is_admin"], 'is_connected': user_details["is_connected"], 'state': user_details["state"], 'roles': user_details["roles"] }, function(){});
}

function getNotifications(user_id, url){
  jQuery.ajax({
    type: "GET",
    data: { 'user_id': user_id, 'target': 'desktop' },
    url: url+"/get_notifications.json",
    success: function(response){
      console.log("hii"+user_id);
      createNotification(response);
      setTimeout(getNotifications(user_id, url), 3000);
    }
  });
}

function getNotificationsList(user_id, url){
  jQuery.ajax({
    type: "GET",
    data: { 'user_id': user_id, 'target': 'list' },
    url: url+"/get_notifications.json",
    success: function(response){
      createNotificationList(response, url);
      setTimeout(getNotificationsList(user_id, url), 10000);
    }
  });
}

function getUserDetails(user_id, url){
  jQuery.ajax({
    type: "GET",
    data: { 'user_id': user_id },
    url: url+"/get_user_details.json",
    success: function(response){
      store_details(response);
    }
  });
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

function updateCookies(program_url){
    chrome.cookies.get({url: program_url, name:'session_active'}, function(cookie) {
      if (cookie) {    
        // chrome.storage.sync.set({"chronusloginurl": "https://onboarding.chronus.com"}, function(){});
        // chrome.storage.sync.set({"chronuslogin": true}, function(){});
        setBrowserIcon("color");
        // loginURL();
        // isUserLoggedin();
        chrome.browserAction.setBadgeBackgroundColor({ color: "#db4437" });
        chrome.browserAction.setBadgeText({text: ''});
        chrome.browserAction.setPopup({popup: 'unconnected_user.html'}, function(){});
      }
      else{    
        // chrome.storage.sync.set({"chronuslogin": false});
        setBrowserIcon("grey");
        chrome.browserAction.setBadgeBackgroundColor({ color: "#db4437" });
        chrome.browserAction.setBadgeText({text: ''});
        chrome.storage.sync.remove('user_id', function(){});
        chrome.browserAction.setPopup({popup: 'unloggedin.html'}, function(){});
      }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.storage.sync.get(['program_url', 'from_extension'], function(result) {
    if (sender.url.includes(result.program_url)){
      UserId = parseInt(request.loginstatus)
      if (UserId){
        getUserDetails(UserId, result.program_url);        
        getNotifications(UserId, result.program_url);
        getNotificationsList(UserId, result.program_url);
        chrome.storage.sync.set({'user_id': request.loginstatus}, function() {});
        if (result.from_extension){
          chrome.tabs.remove(sender.tab.id);
          chrome.storage.sync.remove('from_extension', function(){});
        }
      }
      updateCookies(result.program_url);
    }
  });
});

jQuery(document).ready(function() {
  jQuery('#login_to_program').click(function() {
    var program_url = jQuery('#program_url').val();
    chrome.storage.sync.set({'program_url': program_url}, function() {});
    chrome.storage.sync.set({'from_extension': true}, function() {});
    focusOrCreateTab(program_url);
  });
});

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
});