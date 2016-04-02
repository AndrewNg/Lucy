chrome.browserAction.onClicked.addListener(function() {
  console.log("hello world");
  // permissions
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  if (navigator.getUserMedia) {
    navigator.getUserMedia(
       {
          video:false,
          audio:true
       },
       function(stream) { /* do something */ },
       function(error) { /* do something */ }
    );
  } else {
    alert('Sorry, the browser you are using doesn\'t support getUserMedia');
  }
  
  var audio = new Audio('ding.mp3');
  var recognition = new webkitSpeechRecognition();
  if ('webkitSpeechRecognition' in window) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en";
    var final_transcript = '';
    var interim_transcript = '';
    recognition.start();

    recognition.onstart = function() {
      console.log('Starting Session!');
    };

    recognition.onaudiostart = function(event) {
      console.log("First Audio Heard!");
      // start_timestamp = event.timeStamp;
    };

    recognition.onsoundstart = function() {
      console.log("Sound start");
    };

    recognition.onsoundend = function() {
      console.log("Sound end");
    };

    recognition.onresult = function (event) {
      var final = "";
      var interim = "";
      for (var i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          console.log(event.results[i][0].transcript);

          if(event.results[i][0].transcript == "Lucy"){
            console.log("Lucy Was Called!");
            audio.play();
          }

          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
    };

    recognition.onend = function() {
      console.log('Ending Session!');
      console.log(final_transcript);
      recognition.start();
    };

    recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        console.log('info_no_speech');
      }
      if (event.error == 'audio-capture') {
        console.log('info_no_microphone');
      }
      if (event.error == 'not-allowed') {
        console.log("errr...");

        if (event.timeStamp - start_timestamp < 100) {
          console.log('info_blocked');
        } else {
          console.log('info_denied');
        }
      }
    };
  }
});