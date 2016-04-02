// for every action, excute some javascript

var intent = "";
var params = "";
var intents = ["scroll up", "scroll down", "new tab", "go back", "go forward"];
var functions = [scrollUp, scrollDown, newTab, goBack, goForward];

//
function selectIntent() {
  for (var i = 0; i < intents.length; i++) {
    if (intent == intents[i])
      functions[i];
    else if (intent == "click link")
      clickLink(params);
  }
}

var scrollUp = function() {

}

var scrollDown = function() {

}

var clickLink = function(params) {

}

var newTab = function() {

}


var goBack = function() {

}

var goForward = function() {

}