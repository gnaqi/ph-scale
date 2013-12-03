// Copyright 2002-2013, University of Colorado Boulder

/**
 * Colors used throughout this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Color = require( 'SCENERY/util/Color' );

  return {

    SCREEN_BACKGROUND: 'white',

    // pH range
    ACIDIC: new Color( 249, 106, 102 ),
    BASIC: new Color( 106, 126, 195 ),

    // atom colors
    OXYGEN: new Color( 255, 85, 0 ), // colorblind-friendly red
    HYDROGEN: new Color( 255, 255, 255 ),

    // water
    WATER: new Color( 224, 255, 255 ),

    // background on various features
    H2O_BACKGROUND: new Color( 20, 184, 238 ),

    // particles in 'ratio' view
    H3O_PARTICLES: new Color( 204, 0, 0 ),
    OH_PARTICLES: new Color( 0, 0, 255 )
  };
} );
