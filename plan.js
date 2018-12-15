// Code goes here
$(document).ready(function() {
  chrome.storage.sync.get(['program_url', 'user_id'], function(result) {
    user_id = parseInt(result.user_id);
    url = result.program_url;
    if(user_id){ 
      $.ajax({
        type: "GET",
        data: { 'user_id': user_id },
        url: url + "/get_group_tasks.json",
        crossDomain: true,
        success: function(response){
          var content = "";
          for(var i=0; i < response.results.length; i++){
              content += '<a class="list-group-item list-group-item-action"><input type="checkbox"></input><span style="padding-left:10px">'+response.results[i].title+' <br/> <span> Due Date: '+ response.results[i].due_date +'</span></span></a>';
          }
          $('#group_events').append(content);
        }
      });
    }
  });
});