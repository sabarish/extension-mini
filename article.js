jQuery(document).ready(function() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    jQuery("#share_url").val(url);
  });
});

jQuery(document).on("click", "#share_article_form", function(){
  chrome.storage.sync.get(['user_id', 'message_user_id', 'program_url'], function(result) {    
    var user_id = result.user_id;
    var title = jQuery("#title").val();
    var body = jQuery("#body").val();
    var content = jQuery("#share_url").val();
    var url = result.program_url;
    $.post(url+"/publish_article.json",
    {
      user_id: user_id,
      title: title,
      body: body,
      content: content
    },
    function(data){      
    });
    window.location.href = "unconnected_user.html";
    alert("Article Shared Succesfully!");
  }); 
});