jQuery(document).ready(function() {  
  chrome.storage.sync.get(['message_user_id', 'message_user_name'], function(result) {
    jQuery("#receiver_name").html(result.message_user_name);    
  });
});


jQuery(document).on("click", "#send_message_form", function(){
  chrome.storage.sync.get(['user_id', 'message_user_id', 'program_url'], function(result) {
    var user_id = result.message_user_id;
    var sender_id = result.user_id;
    var subject = jQuery("#subject").val();
    var content = jQuery("#content").val();
    var url = result.program_url;
    $.post(url+"/create_message.json",
    {
      user_id: user_id,
      sender_id: sender_id,
      subject: subject,
      content: content
    },
    function(data){      
    });
    window.location.href = "unconnected_user.html";    
    alert("Message Sent Succesfully!");
  }); 
});
