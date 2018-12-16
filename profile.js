$(document).ready(function() {
  chrome.storage.sync.get(['program_url', 'user_picture_url', 'roles', 'state', 'member_id'], function(result) {
  	jQuery("#profile_image").attr("src", result.user_picture_url);
    jQuery("#profile_url").attr("href", result.program_url+"/members/"+result.member_id);
    jQuery("#program_url").attr("href", result.program_url);
    jQuery("#roles").html("Role: " +result.roles);
    jQuery("#status").html("Status: " +result.state);
    if(result.roles.indexOf("Mentor") == -1){
      jQuery("#share_page").addClass("hide");
    }    
  });
});
