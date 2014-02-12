// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet that drains solution from the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function DrainFaucetNode( faucet, mvt ) {

    var scale = 0.6;

    var horizontalPipeLength = Math.abs( mvt.modelToViewX( faucet.location.x - faucet.pipeMinX ) ) / scale;
    FaucetNode.call( this, faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, {
      horizontalPipeLength: horizontalPipeLength,
      verticalPipeLength: 5,
      tapToDispenseFlowRate: PHScaleConstants.TAP_TO_DISPENSE_FLOW_RATE,
      tapToDispenseInterval: PHScaleConstants.TAP_TO_DISPENSE_INTERVAL
    } );
    this.translation = mvt.modelToViewPosition( faucet.location );
    this.setScaleMagnitude( -scale, scale ); // reflect
  }

  return inherit( FaucetNode, DrainFaucetNode );
} );