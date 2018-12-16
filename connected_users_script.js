// Code goes here
$(document).ready(function() {  
  chrome.storage.sync.get(['program_url', 'user_id'], function(result) {
    user_id = parseInt(result.user_id);
    url = result.program_url;
    if(user_id){
      $.ajax({
        type: "GET",
        data: { 'user_id': user_id },
        url: url + "/get_user_groups.json",
        crossDomain: true,
        success: function(response){
          var content = "";
          if(response.results != undefined){
            for(var i=0; i < response.results.length; i++){
                content += '<a href="group.html" class="list-group-item list-group-item-action"><img src="images/glyphicons-group.png" height="30px" width="30px"></img><span style="padding-left:10px">'+response.results[i].name+' ( '+ response.results[i].status +' )</span></a>';
            }
            $('#user_groups').append(content);
          }
        }
      });
    }
  });
});


jQuery(document).on("click", "#notification_tab", function(){
  chrome.storage.sync.set({'noti_count': ''}, function(){});
  chrome.browserAction.setBadgeText({text: '' });
});