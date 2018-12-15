// Code goes here
$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "https://iitm.localhost.com:3000/p/p1/get_user_groups.json",
    crossDomain: true,
    success: function(response){
      var content = "";
      for(var i=0; i < response.results.length; i++){
          content += '<a href="group.html" class="list-group-item list-group-item-action"><img src="images/glyphicons-group.png" height="30px" width="30px"></img><span style="padding-left:10px">'+response.results[i].name+' ( '+ response.results[i].status +' )</span></a>';
      }
      $('#user_groups').append(content);
    }
  });
});