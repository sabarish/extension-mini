// Code goes here
$(document).ready(function() {
  chrome.storage.sync.get(['program_url', 'user_id', 'is_connected', 'roles'], function(result) {
   user_id = parseInt(result.user_id);
   url = result.program_url;
   if(result.is_connected){
     $('a.navbar-brand').attr('href', 'connected_user.html');
   }
   else{
     $('a.navbar-brand').attr('href', 'unconnected_user.html');
   }
   if(result.roles != undefined && result.roles.indexOf("Student") == -1){
      jQuery("#request_mentor").html("Offer Mentoring");
   } 
   if(user_id){ 
    $.ajax({
      type: "GET",
      data: { 'user_id': user_id },
      url: url + "/recommended_users.json",
      crossDomain: true,
      success: function(json){        
        var response = '',
              indicator = '';
          for(var i=0; i < json.results.length; i++){
            response += '<div class="item"><div style="display:none;" id="hidden_attr" uid="' + json.results[i].reco_user_id +'" uname="'+ json.results[i].user_name +'"></div><div><center><img alt="Profilepicture" title="" id="" width="20%" height="20%" class="table-bordered thick-border img-circle" src="' + json.results[i].picture_url + '" ></center></div><div class=""><center><h3>' + json.results[i].user_name + '</h3><p>' + json.results[i].profile_summary + '</p><h4><span class="label label-success">' +  json.results[i].match_score.toString() + '% match</span></h4></center></div></div>';
            indicator += '<li data-target="#myCarousel" data-slide-to="'+i+'"></li>';
          }
          $('#homepageItems').append(response);
          $('#indicators').append(indicator);
          $('.item').first().addClass('active');
          $('.carousel-indicators > li').first().addClass('active');
          $("#myCarousel").carousel();
      }
    });
  }});
});

jQuery(document).on("click", "#notification_tab", function(){
  chrome.storage.sync.set({'noti_count': ''}, function(){});
  chrome.browserAction.setBadgeText({text: '' });
});

jQuery(document).on("click", "#send_message", function(){
  var user_id = jQuery(".active #hidden_attr").attr("uid");
  var user_name = jQuery(".active #hidden_attr").attr("uname");  
  chrome.storage.sync.set({'message_user_id': user_id}, function(){});
  chrome.storage.sync.set({'message_user_name': user_name}, function(){});
});


jQuery(document).on("click", "#request_mentor", function(){
  var user_id = jQuery(".active #hidden_attr").attr("uid");
  var user_name = jQuery(".active #hidden_attr").attr("uname");  
  chrome.storage.sync.set({'message_user_id': user_id}, function(){});
  chrome.storage.sync.set({'message_user_name': user_name}, function(){});
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  jQuery('#notifications').html(request.listt);
});