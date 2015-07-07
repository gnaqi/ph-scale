// Copyright 2002-2013, University of Colorado Boulder

/**
 * The 'My Solution' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MySolutionModel = require( 'PH_SCALE/mysolution/model/MySolutionModel' );
  var MySolutionView = require( 'PH_SCALE/mysolution/view/MySolutionView' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenTitle = require( 'string!PH_SCALE/mySolution' );

  // images
  var homeIcon = require( 'image!PH_SCALE/MySolution-home-icon.png' );
  var navbarIcon = require( 'image!PH_SCALE/MySolution-navbar-icon.png' );

  function MySolutionScreen() {
    Screen.call( this,
      screenTitle,
      new Image( homeIcon ),
      function() { return new MySolutionModel(); },
      function( model ) { return new MySolutionView( model, ModelViewTransform2.createIdentity() ); },
      {
        backgroundColor: PHScaleColors.SCREEN_BACKGROUND,
        navigationBarIcon: new Image( navbarIcon )
      }
    );
  }

  return inherit( Screen, MySolutionScreen );
} );