// (function() {
//     var context, soundSource, soundBuffer, url = 'http://thelab.thingsinjars.com/web-audio-tutorial/hello.mp3';

//     // Step 1 - Initialise the Audio Context
//     // There can be only one!


//     function init() {
//         if (typeof AudioContext !== "undefined") {
//             context = new AudioContext();
//         } else if (typeof webkitAudioContext !== "undefined") {
//             context = new webkitAudioContext();
//         } else {
//             throw new Error('AudioContext not supported. :(');
//         }
//     }

//     // Step 2: Load our Sound using XHR


//     function startSound() {
//         // Note: this loads asynchronously
//         var request = new XMLHttpRequest();
//         request.open("GET", url, true);
//         request.responseType = "arraybuffer";

//         // Our asynchronous callback
//         request.onload = function() {
//             var audioData = request.response;

//             audioGraph(audioData);


//         };

//         request.send();
//     }

//     // Finally: tell the source when to start


//     function playSound() {
//         // play the source now
//         soundSource.noteOn(context.currentTime);
//     }

//     function stopSound() {
//         // stop the source now
//         soundSource.noteOff(context.currentTime);
//     }

//     // Events for the play/stop bottons
//     document.querySelector('.play').addEventListener('click', startSound);
//     document.querySelector('.stop').addEventListener('click', stopSound);


//     // This is the code we are interested in


//     function audioGraph(audioData) {
//         var volumeNode, lowPassFilter;
//         // Same setup as before
//         soundSource = context.createBufferSource();
//         soundBuffer = context.createBuffer(audioData, true);
//         soundSource.buffer = soundBuffer;
//         volumeNode = context.createGainNode();
//         volumeNode.gain.value = 1;

//         // Create our filter
//         lowPassFilter = context.createBiquadFilter();
//         lowPassFilter.type = 0; // (Low-pass)

//         // Specify parameters for the low-pass filter.
//         lowPassFilter.frequency.value = 220; // Cut off above 220 Hz

//         // Wiring
//         soundSource.connect(volumeNode);
//         volumeNode.connect(lowPassFilter);
//         lowPassFilter.connect(context.destination);

//         // Finally
//         playSound(soundSource);
//     }


//     init();


// }());