// Copyright 2013-2019, University of Colorado Boulder

/**
 * Model for the 'Micro' screen.
 * This is essentially the 'Macro' model with a different user-interface on it.
 * The 'Macro' model also has a pHMeter model element, which we'll simply ignore.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MacroModel = require( 'PH_SCALE/macro/model/MacroModel' );
  const phScale = require( 'PH_SCALE/phScale' );

  /**
   * @constructor
   */
  function MicroModel() {

    MacroModel.call( this );

    // adjust the drag bounds of the dropper to account for different user-interface constraints
    const yDropper = this.dropper.locationProperty.get().y;
    this.dropper.dragBounds = new Bounds2( this.beaker.left + 120, yDropper, this.beaker.right - 170, yDropper );
  }

  phScale.register( 'MicroModel', MicroModel );

  return inherit( MacroModel, MicroModel );
} );
