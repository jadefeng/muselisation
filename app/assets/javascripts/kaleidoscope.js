var createKaleidoscope = function(){ 
  var parameters = ( function ( src ) {
    var params = {}, qryStr = src.split( '?' )[ 1 ];
    if( qryStr ) {
      $.each( qryStr.split( '&' ), function ( i, p ) {
        var ps = p.replace( /\/$/, '' ).split( '=' );
        var k = ps[ 0 ].replace( /^\?/, '' );
        params[ k ] = ps[ 1 ] || true;
      });
    }
    return params;
  })( location.search );

  var x = 0;
  var y = 0;

  var auto;
  var auto_x = 0;
  var auto_y = 0;
  var auto_throttle;

  // PARAMETER: *s* is the speed of the automatic timeout animation.
  var s = parameters.s || 3;

  // PARAMETER: *n* is the number of segments.
  var n = ~~parameters.n || 7;
  var tiles = '';
  if ( n ) {
    for ( var i = 0; i <= n * 2; i++ ) {
      tiles += [ '<div class="tile t', i, '"><div class="image"></div></div>' ].join( '' );
    }
  }

  var $kaleidescope = $( '.kaleidoscope' )
    .addClass( 'n' + n )
    .append( tiles );

  var $image = $kaleidescope.find( '.image' );

  var $fullscreen = $( '#fullscreen' );
  var k = $kaleidescope[ 0 ];

  // PARAMETER: *src* is the URL for an alternate image.
  var src = parameters.src;
  if ( src ) {
    console.log(parameters);
    console.log($image)
    $image.css( 'background-image', [ 'url(', decodeURIComponent( src ), ')' ].join( '' ) );
    console.log($image)
  }

  // PARAMETER: *clean* hides the Github and fullscreen links.
  var clean = parameters.clean;
  if ( clean ) {
    $( 'body' ).addClass('clean');
  }

  // PARAMETER: *opacity* sets opacity (0.0 -> 1.0).
  var opacity = parseFloat( parameters.opacity );
  if ( opacity ) {
    $kaleidescope.css('opacity', 0).fadeTo( 3000, opacity );
  }


  // PARAMETER (undocumented): *mode* changes the animation style.
  var mode = ~~parameters.mode || 2;

  // Project changes in cursor (x, y) onto the image background position.
  $kaleidescope.mousemove( function ( e ) {
    // console.log("Boost ", boost)
    x++;
    y++;

    var nx = e.pageX, ny = e.pageY;
    switch ( mode ) {
      case 1:
        nx = -x;
        ny = e.pageY;
        break;
      case 2:
        nx = e.pageX;
        ny = -y;
        break;
      case 3:
        nx = x;
        ny = e.pageY;
        break;
      case 4:
        nx = e.pageX;
        ny = y;
        break;
      case 5:
        nx = x;
        ny = y;
        break;
    }

    move( nx, ny );
    auto = auto_throttle = false;
  });


  // Animate all the things!
  window.requestAnimFrame = ( function( window ) {
    var suffix = "equestAnimationFrame",
      rAF = [ "r", "webkitR", "mozR" ].filter( function( val ) {
        return val + suffix in window;
      })[ 0 ] + suffix;

    return window[ rAF ]  || function( callback ) {
      window.setTimeout( function() {
        callback( +new Date() );
      }, 1000 / 60 );
    };
  })( window );

  function animate() {
    var time = new Date().getTime() * [ '.0000', s ].join( '' );
    auto_x = Math.sin( time ) * document.body.clientWidth;
    auto_y++;

    move( auto_x, auto_y );
    if ( auto ) requestAnimFrame( animate );
  }

  function move( x, y ) {
    $image.css( 'background-position', [ x + "px", y + "px" ].join( ' ' ) );
  }

  // Timer to check for inactivity
  false && (function timer() {
      setTimeout( function() {
        timer();
        if( auto && !auto_throttle ) {
          animate();
          auto_throttle = true;
        } else {
          auto = true;
        }
      }, 5000 );
  })();

};
