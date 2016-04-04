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
}
else {
  alert('Sorry, the browser you are using doesn\'t support getUserMedia');
}