jQuery(function() {
  chrome.runtime.sendMessage({method:"testlogin"},function(response){
  	if (response.status=="loggedin"){
  		jQuery('#loginform').addClass('hide');
  		jQuery('#notifications').removeClass('hide');}
  	else{
  		jQuery('#loginform').removeClass('hide');
  		jQuery('#notifications').addClass('hide');
  	}	
  });
});