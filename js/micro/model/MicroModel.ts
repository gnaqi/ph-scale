// Copyright 2013-2020, University of Colorado Boulder

/**
 * MicroModel is the model for the 'Micro' screen.  It extends the MacroModel, substituting a different solution
 * model, and omitting the pH meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MacroModel, { MacroModelOptions } from '../../macro/model/MacroModel.js';
import phScale from '../../phScale.js';
import MicroSolution from './MicroSolution.js';

type SelfOptions = EmptySelfOptions;

export type MicroModelOptions = SelfOptions & PickRequired<MacroModelOptions, 'tandem'>;

export default class MicroModel extends MacroModel {

  public constructor( providedOptions: MicroModelOptions ) {

    const options = optionize<MicroModelOptions, SelfOptions, MacroModelOptions>()( {

      // Creates the solution needed by the Micro screen
      createSolution: ( solutionProperty, options ) => new MicroSolution( solutionProperty, options ),

      // pHMeter is not needed in the Micro screen, because it has no moving parts and it's always measuring the
      // pH of the solution. See https://github.com/phetsims/ph-scale/issues/137
      includePHMeter: false
    }, providedOptions );

    super( options );

    // adjust the drag bounds of the dropper to account for different user-interface constraints
    const yDropper = this.dropper.positionProperty.get().y;
    this.dropper.dragBounds = new Bounds2( this.beaker.left + 120, yDropper, this.beaker.right - 170, yDropper );
  }
}

phScale.register( 'MicroModel', MicroModel );