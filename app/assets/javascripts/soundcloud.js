// Soundcloud API
$(document).ready(function() {
	var SoundCloudAudioSource = function(audioElement) {
	    var player = document.getElementById(audioElement);
	    var self = this;
	    var analyser;
	    var audioCtx = new (window.AudioContext || window.webkitAudioContext); // this is because it's not been standardised accross browsers yet.
	    analyser = audioCtx.createAnalyser();
	    analyser.fftSize = 256; // see - there is that 'fft' thing. 
	    var source = audioCtx.createMediaElementSource(player); // this is where we hook up the <audio> element
	    source.connect(analyser);
	    analyser.connect(audioCtx.destination);
	    var sampleAudioStream = function() {
	        // This closure is where the magic happens. Because it gets called with setInterval below, it continuously samples the audio data
	        // and updates the streamData and volume properties. This the SoundCouldAudioSource function can be passed to a visualization routine and 
	        // continue to give real-time data on the audio stream.
	        analyser.getByteFrequencyData(self.streamData);
	        // calculate an overall volume value
	        var total = 0;
	        for (var i = 0; i < 80; i++) { // get the volume from the first 80 bins, else it gets too loud with treble
	            total += self.streamData[i];
	        }
	        self.volume = total;
	        console.log(self.volume)
	    };
	    setInterval(sampleAudioStream, 20); 
	    // debugger;
	    // public properties and methods
	    this.volume = 0;
	    this.streamData = new Uint8Array(128); // This just means we will have 128 "bins" (always half the analyzer.fftsize value), each containing a number between 0 and 255. 
	    
	    this.playStream = function(streamUrl) {
	        // get the input stream from the audio element
	        player.setAttribute('src', streamUrl);
	        player.play();
	        console.log("going to play!");
	    };
	};

	// Pulling out from soundcloud and drawing onto canvas
	var audioSource = new SoundCloudAudioSource('player');
	var canvasElement = document.getElementById('canvas');
	var context = canvasElement.getContext("2d");

	var draw = function() {
	    // you can then access all the frequency and volume data
	    // and use it to draw whatever you like on your canvas
	    for(bin = 0; bin < audioSource.streamData.length; bin ++) {
	        // do something with each value. Here's a simple example
	        var val = audioSource.streamData[bin];
	        var red = val;
	        var green = 255 - val;
	        var blue = val / 2; 
	        context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
	        context.fillRect(bin * 2, 0, 2, 200);
	        // use lines and shapes to draw to the canvas is various ways. Use your imagination!
	    }
	    requestAnimationFrame(draw);
	};

	audioSource.playStream('https://api.soundcloud.com/tracks/31164607/stream?client_id=b75a0eb7b3780e9bd6c44ae72edec9bd');
	console.log("going to draw")
	draw();
	console.log("drew this stuff")

});