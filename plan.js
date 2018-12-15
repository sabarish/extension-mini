// Code goes here
$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "https://iitm.localhost.com:3000/p/p1/get_group_tasks.json",
    crossDomain: true,
    success: function(response){
      var content = "";
      for(var i=0; i < response.results.length; i++){
          content += '<a class="list-group-item list-group-item-action"><input type="checkbox"></input><span style="padding-left:10px">'+response.results[i].title+' <br/> <span> Due Date: '+ response.results[i].due_date +'</span></span></a>';
      }
      $('#group_events').append(content);
    }
  });
});