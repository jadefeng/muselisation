$(document).ready(function() {
	if (! window.AudioContext) {
	    if (! window.webkitAudioContext) {
	        alert('no audiocontext found');
	    }
	    window.AudioContext = window.webkitAudioContext;
	} else {
		console.log("All is good. Let's play!");
	}
});