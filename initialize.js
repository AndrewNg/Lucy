navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
if (navigator.getUserMedia) {
	navigator.getUserMedia(
	{
		video:false,
		audio:true
	},
	// success callback if user approves
	function(stream) { 
		// set local storage variable that records state of getUserMedia
		localStorage.setItem('isGetUserMediaInitialized', "true");

		// reset dispaly of options page
		$("#info_blocked").hide();
		$("#prevPageRedirectButton").hide();

		// redirect tp previous page
		goToPrevPage()
	},
	// failure callback if user denies
	function(error) { 
		
		// set local storage variable that records state of getUserMedia
		localStorage.setItem('isGetUserMediaInitialized', "false");

		// alert the user that they must approve getUserMedia for Lucy to function
		$("#info_blocked").show();
		$("#prevPageRedirectButton").show();
	});
}
else {
	alert('Sorry, the browser you are using doesn\'t support getUserMedia');
}

// redirect to previous page using URL stored in local storage
function goToPrevPage() {
	// get URL of previous page. if none, set default value to google.com
	var currentURL = localStorage.getItem('currentURL') || "https://www.google.com/";

	// redirect to previous URL so user can continue web browsing
	chrome.tabs.update({
		url: currentURL
	});	
}