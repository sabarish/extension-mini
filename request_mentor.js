jQuery(document).ready(function() {  
  chrome.storage.sync.get(['message_user_id', 'message_user_name'], function(result) {
    jQuery("#receiver_name").html(result.message_user_name);    
  });
});

