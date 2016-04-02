

// for every action, excute some javascript

var intent = "";
var params = "";
var intents = ["scroll_up", "scroll_down", "new_tab", "go_back", "go_forward"];

var scrollUp = function() {
	console.log("I'm trying to scroll up");
};

var scrollDown = function() {
	console.log("I'm trying to scroll down");
};

var clickLink = function(params) {
	console.log("I'm trying to scroll click link");
};

var newTab = function() {
	console.log("I'm trying to scroll new tab");
};


var goBack = function() {
	console.log("I'm trying to go back");
};

var goForward = function() {
	console.log("I'm trying to go forward");
};

var functions = [scrollUp, scrollDown, newTab, goBack, goForward];

//
function selectIntent(data) {
	console.log(data.result.action);
  for (var i = 0; i < intents.length; i++) {
    if (data.result.action == intents[i]) {
    	functions[i]();
    }
    else if (intent == "click link")
      clickLink(params);
  }
}