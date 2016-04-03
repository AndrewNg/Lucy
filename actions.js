chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log(request.data);
      sendResponse({type: "test"});
      selectIntent(request.data);
});

// for every action, excute some javascript
var intents = ["scroll_up", "scroll_down", "new_tab", "go_back", "go_forward", "click_link"];

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
  console.log("I'm trying to scroll click link");
};

function openinnewtab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

var functions = [scrollUp, scrollDown, newTab, goBack, goForward, clickLink];

function selectIntent(data) {
  console.log(data.result.action);
  for (var i = 0; i < intents.length; i++) {
    if (data.result.action == intents[i]) {
      functions[i]();
    }
  }
}