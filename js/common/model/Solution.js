// Copyright 2002-2013, University of Colorado Boulder

/**
 * Solution model. Solvent (water) is constant, solute (in stock solution form) is variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var log10 = require( 'DOT/Util' ).log10;
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Util = require( 'DOT/Util' );

  // constants
  var AVOGADROS_NUMBER = 6.023E23;

  /**
   * @param {Property<Solute>} soluteProperty
   * @param {number} soluteVolume liters
   * @param {Water} water
   * @param {number} waterVolume liters
   * @param {number} maxVolume liters
   */
  function Solution( soluteProperty, soluteVolume, water, waterVolume, maxVolume ) {
    assert && assert( soluteVolume + waterVolume <= maxVolume );

    var thisSolution = this;

    thisSolution.soluteProperty = soluteProperty;
    thisSolution.soluteVolumeProperty = new Property( soluteVolume );
    thisSolution.water = water;
    thisSolution.waterVolumeProperty = new Property( waterVolume );
    thisSolution.maxVolume = maxVolume;

    // volume
    thisSolution.volumeProperty = new DerivedProperty( [ thisSolution.soluteVolumeProperty, thisSolution.waterVolumeProperty ],
      function( soluteVolume, waterVolume ) {
        return soluteVolume + waterVolume;
      }
    );

    // pH, null if no value
    thisSolution.pHProperty = new DerivedProperty( [ thisSolution.soluteProperty, thisSolution.soluteVolumeProperty, thisSolution.waterVolumeProperty ],
      this.computePH.bind( this ) );

    // color
    thisSolution.colorProperty = new DerivedProperty( [ thisSolution.soluteProperty, thisSolution.pHProperty ],
      thisSolution.computeColor.bind( this ) );

    // solute
    thisSolution.soluteProperty.link( function() {
      thisSolution.waterVolumeProperty.set( 0 );
      thisSolution.soluteVolumeProperty.set( 0 );
    } );
  }

  Solution.prototype = {

    // @override
    reset: function() {
      this.soluteProperty.reset();
      this.soluteVolumeProperty.reset();
      this.waterVolumeProperty.reset();
    },

    //----------------------------------------------------------------------------
    // Volume (Liters)
    //----------------------------------------------------------------------------

    isEmpty: function() { return this.volumeProperty.get() === 0; },

    isFull: function() { return this.volumeProperty.get() === this.maxVolume; },

    // Returns the amount of volume that is available to fill.
    getFreeVolume: function() { return this.maxVolume - this.volumeProperty.get(); },

    //----------------------------------------------------------------------------
    // Concentration (moles/L)
    //----------------------------------------------------------------------------

    setConcentrationH3O: function( c ) {
      this.soluteProperty.get().pHProperty.set( -log10( c ) );
    },

    getConcentrationH3O: function( pH ) {
      pH = pH || this.pHProperty.get();
      return ( pH === null ) ? 0 : Math.pow( 10, -pH );
    },

    setConcentrationOH: function( c ) {
      this.soluteProperty.get().pHProperty.set( 14 - ( -log10( c ) ) );
    },

    getConcentrationOH: function( pH ) {
      pH = pH || this.pHProperty.get();
      return ( pH === null ) ? 0 : Math.pow( 10, -( 14 - pH ) );
    },

    getConcentrationH2O: function() {
      return ( this.isEmpty() ? 0 : 55 );
    },

    //----------------------------------------------------------------------------
    // Number of molecules
    //----------------------------------------------------------------------------

    getMoleculesH3O: function() {
      return Solution.computeMolecules( this.getConcentrationH3O(), this.volumeProperty.get() );
    },

    getMoleculesOH: function() {
      return Solution.computeMolecules( this.getConcentrationOH(), this.volumeProperty.get() );
    },

    getMoleculesH2O: function() {
      return Solution.computeMolecules( this.getConcentrationH2O(), this.volumeProperty.get() );
    },

    //----------------------------------------------------------------------------
    // Number of moles
    //----------------------------------------------------------------------------

    setMolesH3O: function( m ) {
      this.soluteProperty.get().pHProperty.set( -log10( m / this.volumeProperty.get() ) );
    },

    getMolesH3O: function() {
      return Solution.computeMoles( this.volumeProperty.get(), this.getConcentrationH3O() );
    },

    setMolesOH: function( m ) {
      this.soluteProperty.get().pHProperty.set( 14 - ( -log10( m / this.volumeProperty.get() ) ) );
    },

    getMolesOH: function() {
      return Solution.computeMoles( this.volumeProperty.get(), this.getConcentrationOH() );
    },

    getMolesH2O: function() {
      return Solution.computeMoles( this.volumeProperty.get(), this.getConcentrationH2O() );
    },

    //----------------------------------------------------------------------------
    // private
    //----------------------------------------------------------------------------

    // Computes the solution's pH.
    computePH: function() {

      var solutePH = this.soluteProperty.get().pHProperty.get();
      var soluteVolume = this.soluteVolumeProperty.get();
      var waterPH = this.water.pH;
      var waterVolume = this.waterVolumeProperty.get();

      var pH;
      if ( soluteVolume + waterVolume === 0 ) {
        pH = null;
      }
      else if ( solutePH < 7 ) {
        pH = -log10( ( Math.pow( 10, -solutePH ) * soluteVolume + Math.pow( 10, -waterPH ) * waterVolume ) / ( soluteVolume + waterVolume ) );
      }
      else {
        pH = 14 + log10( ( Math.pow( 10, solutePH - 14 ) * soluteVolume + Math.pow( 10, waterPH - 14 ) * waterVolume ) / ( soluteVolume + waterVolume ) );
      }
      return pH;
    },

    // Computes the solution's color.
    computeColor: function() {
      var color;
      if ( this.volumeProperty.get() === 0 || this.soluteVolumeProperty.get() === 0 || this.isEquivalentToWater() ) {
        color = this.water.color;
      }
      else {
        var solute = this.soluteProperty.get();
        var ratio = this.soluteVolumeProperty.get() / this.volumeProperty.get();
        if ( solute.midpointColor ) {
          // solute has an optional midpoint color
          if ( ratio > 0.5 ) {
            color = Color.interpolateRBGA( solute.midpointColor, solute.color, ( 2 * ratio ) - 1 );
          }
          else {
            color = Color.interpolateRBGA( solute.dilutedColor, solute.midpointColor, ( 2 * ratio ) );
          }
        }
        else {
          color = Color.interpolateRBGA( solute.dilutedColor, solute.color, ratio );
        }
      }
      return color;
    },

    /*
     * True if the value displayed by the pH meter has precision that makes it equivalent to the pH of water.
     * Eg, the value displayed to the user is '7.00'.
     */
    isEquivalentToWater: function() {
      var pHString = Util.toFixed( this.pHProperty.get(), PHScaleConstants.PH_METER_DECIMAL_PLACES );
      return ( parseFloat( pHString ) === this.water.pH ) && ( this.waterVolumeProperty.get() > 0 );
    }
  };

  /**
   * Computes the number of molecules in solution.
   * @param {number} concentration moles/L
   * @param {number} volume L
   * @returns {number} moles
   */
  Solution.computeMolecules = function( concentration, volume ) {
    return concentration * AVOGADROS_NUMBER * volume;
  };

  /**
   * Computes moles in solution.
   * @param {number} volume L
   * @param {number} concentration moles/L
   * @returns {number} moles
   */
  Solution.computeMoles = function( volume, concentration ) {
    return volume * concentration;
  };

  return Solution;
} );