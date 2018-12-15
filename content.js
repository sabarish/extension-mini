var LoginStatus = 0
if (jQuery('.cjs_signout_link').length > 0) {
	LoginStatus = jQuery('.cjs_signout_link').attr('id');
}

chrome.runtime.sendMessage({loginstatus: LoginStatus}, function(response){});