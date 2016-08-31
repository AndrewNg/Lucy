// global variable for API.AI data containing intent and original query
var data;

//global variable for timer
var timer;

// triggered by background task after Lucy has determined an intent for the query
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // print the JSON object received from API.AI
        console.log(request.data);

        // rename the API.AI data
        data = request.data;

        // ensure the intent is on the predefined list
        selectIntent(data);

        // // give a success callback - never used
        sendResponse({
            type: "success"
        });
    }
);

// call function mapping to each of predefined intent
function selectIntent(data) {
    // for every action, excute some javascript
    var intents = ["scroll_up", "scroll_down", "stop", "new_tab", "go_back", "go_forward", "click_link", "close_tab", "navigate", "look_up"];
    var functions = [scrollUp, scrollDown, stop, newTab, goBack, goForward, clickLink, closeTab, navigate, lookUp];

    var foundLucyFunction = false;
    console.log(data.result.action);
    for (var i = 0; i < intents.length; i++) {
        if (data.result.action == intents[i]) {
            foundLucyFunction = true;
            functions[i]();
        }
    }

    // if query doesn't have one of the predefined intents, issue a verbal warning
    if (!foundLucyFunction) {
        speak("Sorry, I don't understand that request.");
    }
}

// start uniform scrolling of page upwards
function scrollUp() {
    stop();
    console.log("I'm trying to scroll up");
    timer = setInterval(function() {
        window.scrollBy(0, -1)
    }, 8);
};

// start uniform scrolling of page downwards
function scrollDown() {
    stop();
    console.log("I'm trying to scroll down");
    timer = setInterval(function() {
        window.scrollBy(0, 1)
    }, 8);
};

// stop the page from scrolling
function stop() {
    clearInterval(timer);
}

// open a new tab
function newTab() {
    console.log("I'm trying to scroll new tab");
    var homepage = "http://www.google.com";
    var win = window.open(homepage, '_blank');
    win.focus();
};

// close the current tab
function closeTab() {
    console.log("I'm trying to close tab");
    window.close();
};

// go back a  page in browsing history
function goBack() {
    console.log("I'm trying to go back");
    window.history.back();
};

// go forward a page in browsing history
function goForward() {
    console.log("I'm trying to go forward");
    window.history.forward();
};

// navigate to a specific site
// For example, if you ask the browser, "click on the clinton endoresement article",
// and there are multiple articles about Hillary Clinton, it will find the 
// link that is most relevant to the keyword "endorsement"
function clickLink() {
    console.log("I'm trying to click link");
    var query = "";
    if (data.result.resolvedQuery.indexOf(" about ") != -1) {
        console.log(data.result.resolvedQuery.split(" about ")[1]);
        organizeArray(data.result.resolvedQuery.split(" about ")[1]);
    } else if (data.result.resolvedQuery.indexOf(" on ") != -1) {
        organizeArray(data.result.resolvedQuery.split(" on ")[1])
    } else if (data.result.resolvedQuery.indexOf(" the ") != -1) {
        organizeArray(data.result.resolvedQuery.split(" the ")[1])
    } else if (data.result.resolvedQuery.indexOf(" where ") != -1) {
        organizeArray(data.result.resolvedQuery.split(" where ")[1])
    } else {
        console.log(data.result.resolvedQuery);
        organizeArray(data.result.resolvedQuery);
    }
};

// navigate to a specific site
// works for 50 most common sites listed in parse.js
function navigate() {
    console.log("I'm trying to navigate to a site")
    if (data.result.parameters.url.length > 0) {
        openWebsite(data.result.parameters.url);
    } else {
        openWebsite(data.result.parameters.any);
    }
};

// run a google search to look up a specific topic
function lookUp() {
    console.log("trying to look up");
    for (var term in data.result.parameters) {
        if (data.result.parameters[term].length > 0) {
            console.log(data.result.parameters[term]);
            window.location.href = "http://google.com/search?q=" + data.result.parameters[term];
        } else {
            // depending on the type of phrase's preposition, get the exact topic from the query
            if (data.result.resolvedQuery.indexOf(" for ") != -1)
                window.location.href = "http://google.com/search?q=" + data.result.resolvedQuery.split(" for ")[1];
            else if (data.result.resolvedQuery.indexOf(" about ") != -1)
                window.location.href = "http://google.com/search?q=" + data.result.resolvedQuery.split(" about ")[1];
            else if (data.result.resolvedQuery.indexOf(" search ") != -1)
                window.location.href = "http://google.com/search?q=" + data.result.resolvedQuery.split(" search ")[1];
            else if (data.result.resolvedQuery.indexOf(" look up ") != -1)
                window.location.href = "http://google.com/search?q=" + data.result.resolvedQuery.split(" look up ")[1];
        }
    }
}

// text-to-voice using the SpeechSynthesis library
function speak(phrase) {
    // create new Utterance
    var utterance = new SpeechSynthesisUtterance(phrase);

    // change the voice to UK English Female
    var voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.filter(function(voice) { return voice.name == 'Google UK English Female'; })[0];

    // speak the voice outloud
    window.speechSynthesis.speak(utterance);
}

