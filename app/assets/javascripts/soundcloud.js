/* This uses the SoundCloud API (you can register your app and get your client id here: https://developers.soundcloud.com/).
The url entered in the input field gets back the song that is then analysed using the Web Audio API.

This helped a lot: http://www.michaelbromley.co.uk/blog/42/audio-visualization-with-web-audio-canvas-and-the-soundcloud-api
 https://github.com/michaelbromley/soundcloud-visualizer/blob/master/js/app.js
 */

var soundcloudOn;
var SoundCloud = {};
var array = [];
var boost = 0; 
var hexColour,
    canvasElement,
    context;

var SoundCloudAudioSource = function(player) {
    SoundCloud.soundcloudOn = true;
    SoundCloud.audioCtx = new (window.AudioContext || window.webkitAudioContext);
    SoundCloud.source = SoundCloud.audioCtx.createMediaElementSource(player);
  	SoundCloud.analyser = SoundCloud.audioCtx.createAnalyser();
    SoundCloud.source.connect(SoundCloud.analyser);
    SoundCloud.analyser.connect(SoundCloud.audioCtx.destination);

    var sampleAudioStream = function() {
    	sizeValue = parseInt($('#sizeInput').val());
    	array = new Uint8Array(SoundCloud.analyser.frequencyBinCount);

    	// BYTE FREQUENCY ARRAY! EUREKA!
        SoundCloud.analyser.getByteFrequencyData(array); 

        //Using this to influence the size of the shape when the slider is changed in the control panel.
        boost = 0;
        for(var i = 0; i < array.length; i++){
            boost += array[i];
        }
        
        boost = (boost / array.length) //* (sizeValue * 2);


        if (SoundCloud.soundcloudOn === true) {
          requestAnimationFrame(sampleAudioStream);
        }
        // Calls the kaleidoscope
          var kaleidoscope_music = function() {
            //console.log("going to move the tiles")
            move( ( boost * 5 ), (boost * 5) );
          };

          function move( x, y ) {
            if (x > 0 && y > 0) {
                $('.tile .image').css( 'background-position', [ ~~x + "px", ~~y + "px" ].join( ' ' ) );
            }
          }

          kaleidoscope_music();
    };

    requestAnimationFrame(sampleAudioStream);
    
    this.playStream = function(streamUrl) {
        // get the input stream from the audio element
        player.addEventListener('ended', function(){
            self.directStream('coasting');
        });
        player.setAttribute('src', streamUrl);
        player.play();
    };
};

/**
 * Makes a request to the Soundcloud API and returns the JSON data.
 */
var SoundcloudLoader = function(player) {
    var self = this;
    var client_id = "0f51b1e1e15add18752bc0cb4522134a";
    this.sound = {};
    this.streamUrl = "";
    this.errorMessage = "";
    this.player = player;

    /**
     * Loads the JSON stream data object from the URL of the track (as given in the location bar of the browser when browsing Soundcloud),
     * and on success it calls the callback passed to it (for example, used to then send the stream_url to the audiosource object).
     */

    this.loadStream = function(track_url, successCallback, errorCallback) {
        SC.initialize({
            client_id: client_id
        });
        SC.get('/resolve', { url: track_url }, function(sound) {
            if (sound.errors) {
                self.errorMessage = "";
                for (var i = 0; i < sound.errors.length; i++) {
                    self.errorMessage += sound.errors[i].error_message + '<br>';
                }
                self.errorMessage += 'Please make sure the URL has the right format: https://soundcloud.com/user/title-of-the-track';
                errorCallback();
            } else {
                if(sound.kind=="playlist"){
                    self.sound = sound;
                    self.streamPlaylistIndex = 0;
                    self.streamUrl = function(){
                        return sound.tracks[self.streamPlaylistIndex].stream_url + '?client_id=' + client_id;
                    }
                    successCallback();
                }else{
                    self.sound = sound;
                    self.streamUrl = function(){ return sound.stream_url + '?client_id=' + client_id; };
                    successCallback();
                }
            }
        });
    };

    this.directStream = function(direction){
        if(direction=='toggle'){
            if (this.player.paused) {
                this.player.play();
            } else {
                this.player.pause();
            }
        }
        else if(this.sound.kind=="playlist"){
            if(direction=='coasting') {
                this.streamPlaylistIndex++;
            }else if(direction=='forward') {
                if(this.streamPlaylistIndex>=this.sound.track_count-1) this.streamPlaylistIndex = 0;
                else this.streamPlaylistIndex++;
            }else{
                if(this.streamPlaylistIndex<=0) this.streamPlaylistIndex = this.sound.track_count-1;
                else this.streamPlaylistIndex--;
            }
            if(this.streamPlaylistIndex>=0 && this.streamPlaylistIndex<=this.sound.track_count-1) {
               this.player.setAttribute('src',this.streamUrl());
               this.player.play();
            }
        }
    };
};

function rgbToHex(r, g, b) {
    // console.log("converting");
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

window.onload = function init() {
    // handle the form submit event to load the new URL

    form.addEventListener('submit', function(e) {
        var player =  document.getElementById('player');
        var loader = new SoundcloudLoader(player);
        var audioSource = new SoundCloudAudioSource(player);
        var loadAndUpdate = function(trackUrl){

        loader.loadStream(trackUrl,
            function(){
                console.log("PLAYYYYY");
                audioSource.playStream(loader.streamUrl());
            });
        }        

        e.preventDefault();
        var trackUrl = document.getElementById('input').value;
        loadAndUpdate(trackUrl);

    });


    var changeImage = function() {
        var imageArray = ['http://socialgalleryplugin.com/v3/wp-content/uploads/2013/09/crazy-desktop-backgrounds2.jpg',
        'http://www.stlukesprimary.org.uk/wp-content/uploads/2014/09/Butterflies.jpg',
        'http://media02.hongkiat.com/colorfulwp/Rainbow_Ocean__by_Thelma1.jpg',
        'http://thumbs.media.smithsonianmag.com//filer/Vincent-van-Gogh-The-Starry-Night-631.jpg__800x600_q85_crop.jpg'];

        var image_counter = 0;

        var changing = function() {
            var image_source = 'url(' + imageArray[image_counter] + ')';
            $('.tile .image').css('background-image', image_source);
            image_counter++;
            console.log("changed the image");   
        };
        setInterval(changing(), 2500);
    };

    var changeTheme = function() {
        console.log("changing theme");
        var theme = $('.visual').val();
        $('.visualisation').empty();

        if (theme == "galaxy") {
            console.log("select galaxy");
            createGalaxy();
        } else {
            console.log("select kaleidoscope");
            $('.visualisation').html('<div class="kaleidoscope"></div>');
            createKaleidoscope();
            setInterval(changeImage(), 10000);
            console.log("looped back again");
        }
    };

    // If someone changes a theme 
    changeTheme();
    $('.visual').on('change', changeTheme);


};
