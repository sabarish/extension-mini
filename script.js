// Code goes here
$(document).ready(function() {
  chrome.storage.sync.get(['program_url', 'user_id'], function(result) {
   user_id = parseInt(result.user_id)
   url = result.program_url
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
            response += '<div class="item"><div><center><img alt="Profilepicture" title="New Hire" id="" width="20%" height="20%" class="table-bordered thick-border img-circle" src="' + json.results[i].picture_url + '" ></center></div><div class=""><center><h3>' + json.results[i].user_name + '</h3><p>' + json.results[i].profile_summary + '</p><h5>' +  json.results[i].match_score.toString() + '% match</h5></center></div></div>';
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
  chrome.browserAction.setBadgeText({text: '' });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  jQuery('#notifications').html(request.listt);
});