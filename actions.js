var data;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log(request.data);
      data = request.data;
      sendResponse({type: "test"});
      selectIntent(request.data);
});

// for every action, excute some javascript
var intents = ["scroll_up", "scroll_down", "new_tab", "go_back", "go_forward", "click_link", "close_tab", "navigate"];

var scrollUp = function() {
	console.log("I'm trying to scroll up");
};

var scrollDown = function() {
	console.log("I'm trying to scroll down");
};

var newTab = function() {
	console.log("I'm trying to scroll new tab");
  openinnewtab("http://www.google.com");
};

var goBack = function() {
	console.log("I'm trying to go back");
  window.history.back();
};

var goForward = function() {
	console.log("I'm trying to go forward");
  window.history.forward();
};

var clickLink = function(params) {
  console.log("I'm trying to click link");
};

var closeTab = function() {
  console.log("I'm trying to close tab");
};

var navigate = function() {
  console.log("I'm trying to navigate to a site")
};

var functions = [scrollUp, scrollDown, newTab, goBack, goForward, clickLink, closeTab, navigate];

function selectIntent(data) {
  console.log(data.result.action);
  for (var i = 0; i < intents.length; i++) {
    if (data.result.action == intents[i]) {
      functions[i]();
    }
  }
}