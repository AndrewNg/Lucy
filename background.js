// global default state of whether user has getUserMedia permission for audio stream is false 
localStorage.setItem("isGetUserMediaInitialized", "false");

// global default state of whether Google Vocie API's Voice-To-Text is working
var recognizing = false;

// global default state of whether Lucy has been called
var isListeningForQueryActivated = false;

// times how long since Lucy has been activated
var timeSinceLucyActivatedTimer;

// global variables for keeping track of the animated Lucy icon
var minLucyIconFrame = 0;
var maxLucyIconFrame = 5;
var currentLucyIconFrame = minLucyIconFrame;
var keepAnimatingLucyIcon = false;

// toggle Lucy on/off by clicking Chrome icon
chrome.browserAction.onClicked.addListener(function() {
    // turn on Lucy
    if (!recognizing){
        // initialize getUserMedia if not yet approved by user
        if (!JSON.parse(localStorage.getItem("isGetUserMediaInitialized"))) {
            initializeGetUserMedia();
        }
        
        // if getUserMedia initialization successful, turn on voice-to-text
        if (JSON.parse(localStorage.getItem("isGetUserMediaInitialized"))) {
            startVoiceToText();
        }

    } else { //turn off  
        // turn on voice-to-text
        stopVoiceToText();        
    }
});

// initialize Google Web Speech API
if ('webkitSpeechRecognition' in window) {
    // main Google Web Speech API object for listening to audio stream
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en";

    // initialize timer variable;
    var start_timestamp

    // Google Web Speech APIenent handler for the start of speech
    recognition.onspeechstart = function(event) {
        if (recognizing){
            // start timer for error debugging purposes
            start_timestamp = event.timeStamp;
        }

    };

    // Google Web Speech APIenent handler on end of audio-processing
    recognition.onresult = function(event) {
        if (recognizing) {
            for (var i = 0; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    var latestString = event.results[i][0].transcript;
                    console.log(latestString);

                    // check if latest string includes call to "Okay Lucy"
                    if (isOkayLucyCalled(latestString)) {
                        startListeningForQuery();
                    } else if (isListeningForQueryActivated) { // if listening for query
                        // listen for new queries without "Hello Lucy" prompt for 10 seconds
                        clearTimeout(timeSinceLucyActivatedTimer);
                        timeSinceLucyActivatedTimer = setTimeout(stopListeningForQuery, 10000);

                        // if a non-null string exists for the query, get the intent
                        if (latestString) {
                            getIntent(latestString)
                        }
                    } 
                }
            }
        }
    };

    // Google Web Speech API enent handler for end of listening
    recognition.onend = function() {
        if (recognizing) {
            recognition.start();
        }
    };

    // Google Web Speech API enent handler for error
    recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
            console.log('info_no_speech');
        }
        if (event.error == 'audio-capture') {
            console.log('info_no_microphone');
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                console.log('info_blocked');
            } else {
                console.log('info_denied');
            }
        }
    };
}

// prompt user for getUserMedia permission via the 
// background page and redirect user to original page
function initializeGetUserMedia() {
    // save current link in local storage so that the
    // options page is able to navigate back to this
    // page after user approves getUserMedia permissions
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var currentURL = tabs[0].url;

        // regex for: chrome-extension://
        var reg1 = /chrome\-extension:\/\//;

        // regex for: .html
        var reg2 = /initialize\.html/;

        // if current URL has reg1 and reg2, it is the option page.
        // if and only if the current page is not the options page,
        // store the current URL for future
        // refernce in order to return to this page
        if (! ( (reg1.test(currentURL)) && (reg2.test(currentURL)) )) {
            localStorage.setItem('currentURL', currentURL);
        }
    });

    // go to options page to get getUserMedia permissions for audio stream
    chrome.tabs.update({
        url: "initialize.html"
    });
}

// check latestString if "Okay Lucy" call exists
function isOkayLucyCalled(latestString) {
    // possible variations of "Okay Lucy" and cooresponding regex
    // regex note: "i" tag allows for case invariant search
    okayLucyVariation = [
        /Okay Lucy/i, 
        /Okay we'll see/i,
        /Okay Google/i,
        /Okay Lissie/i,
        /OKC/i,
        /KFC/i,
        /Tennessee/i,
        /Heresy/i,
        /It\'s okay Lucy/i,
        /Okay Lucie/i,
        /Okay Lucy\'s/i,
        /Okay The sea/i,
    ]

    // check if "Okay Lucy" or a similar variation called
    for (var i = 0; i < okayLucyVariation.length; i++) {
        if(okayLucyVariation[i].test(latestString)) {
            // "Okay Lucy" called
            return true;
        }
    }

    // "Okay Lucy" and its variation not found
    return false;
}

// Given that "Okay Lucy" has been called, start listening for query
function startListeningForQuery() {
    // Okay Lucy has been called!
    isListeningForQueryActivated = true;

    // trigger audio since Lucy called
    var beepOn = new Audio('beep_short_on.wav');
    beepOn.play();

    // start animating Lucy icon to indiate
    keepAnimatingLucyIcon = true;
    animateLucyIcon();

    // after 6 seconds, lucy will be deactivated unless a user says a query
    clearTimeout(timeSinceLucyActivatedTimer);
    timeSinceLucyActivatedTimer = setTimeout(stopListeningForQuery, 6000);
}

// animate the Lucy icon frame by frame
function animateLucyIcon() {
  if (keepAnimatingLucyIcon) {
    chrome.browserAction.setIcon({path:"mic-animated-" + currentLucyIconFrame + ".png"});
    if (currentLucyIconFrame++ >= maxLucyIconFrame) {
      currentLucyIconFrame = minLucyIconFrame;
    }

    // switch to next frame of icon every .2 seconds
    window.setTimeout(animateLucyIcon, 200);
  }
}

// Stop listening for query
function stopListeningForQuery() {
    // deactvate query listening state
    isListeningForQueryActivated = false;

    // trigger audio to indicate Lucy no longer registering the query
    var beepOff = new Audio('beep_short_off.wav');
    beepOff.play();   

    // trigger the icon indicating Lucy is listening
    keepAnimatingLucyIcon = false;
    chrome.browserAction.setIcon({path: 'mic.png'})
}

// enable Google Web Speech API's Voice-To-Text functionality
function startVoiceToText() {
    // if still listening from last Voice-To-Text session, turn it off
    // in order to restart
    if (recognizing) {
        recognition.stop();
        return;
    }

    // enable Lucy to start listening
    recognition.start();

    // set global variable tracking whether VoceToText is working
    recognizing = true; 

    // trigger the icon indicating Lucy is listening
    keepAnimatingLucyIcon = false;
    chrome.browserAction.setIcon({path: 'mic.png'})
}

// turn off Voice-To-Text, along with Lucy
function stopVoiceToText() {
    // set global variable tracking whether VoceToText is working
    recognizing = false;

    // trigger the icon indicating Lucy is not listening
    keepAnimatingLucyIcon = false;
    chrome.browserAction.setIcon({path: 'mic-slash.png'})

    // stop listening for query and reset query timer
    clearTimeout(timeSinceLucyActivatedTimer);
    isListeningForQueryActivated = false;

    // stop the Voice-To-Text functionality
    recognition.stop();
}

// call API.AI to get the intent of the query
function getIntent(query) {
    // API.AI request variables - UPDATE 
    var accessToken = "cfa415db33e24195927987711addac1c";
    var subscriptionKey = "d0426b7da80d43b49c635e746ebd80df";
    var baseUrl = "https://api.api.ai/v1/";

    // asynchronously query the API.AI api server
    $.ajax({
        type: "POST",
        url: baseUrl + "query/",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
        "Authorization": "Bearer " + accessToken,
        "ocp-apim-subscription-key": subscriptionKey
        },
        data: JSON.stringify({ q: query, lang: "en" }),

        // on success, the api answer is captured in the data variable
        // execute functions in action.js depending on the intent
        success: function(data) {
            console.log(data);
            // act if an intent returned
            if (data.result.action) {
                // get the active tab's ID
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    // inject the active tab with the content script (actions.js),
                    // passing the JSON response from API.AI as an argument
                    chrome.tabs.sendMessage(tabs[0].id, {data: data}, function(response) {
                        // add code here...
                    });
                });
            }
        },
        error: function() {
            return("Internal Server Error");
        }
    });
}