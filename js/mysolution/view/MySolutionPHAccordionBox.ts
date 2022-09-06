// Copyright 2022, University of Colorado Boulder

/**
 * MySolutionPHAccordionBox is the pH accordion box for the 'My Solution' screen.
 * It allows the user to change the pH via a spinner.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PHMeterNodeAccordionBox, { PHMeterNodeAccordionBoxOptions } from '../../common/view/PHMeterNodeAccordionBox.js';
import phScale from '../../phScale.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Property from '../../../../axon/js/Property.js';
import { PHSpinnerNode } from './PHSpinnerNode.js';

type SelfOptions = EmptySelfOptions;

export type MySolutionPHAccordionBoxOptions = SelfOptions & PickRequired<PHMeterNodeAccordionBoxOptions, 'tandem'>;

export default class MySolutionPHAccordionBox extends PHMeterNodeAccordionBox {

  /**
   * @param pHProperty - pH of the solution
   * @param probeYOffset - distance from top of meter to tip of probe, in view coordinate frame
   * @param [providedOptions]
   */
  public constructor( pHProperty: Property<number>, probeYOffset: number, providedOptions: MySolutionPHAccordionBoxOptions ) {

    const contentNode = new PHSpinnerNode( pHProperty, {
      tandem: providedOptions.tandem.createTandem( 'spinner' )
    } );

    super( contentNode, probeYOffset, providedOptions );
  }
}

phScale.register( 'MySolutionPHAccordionBox', MySolutionPHAccordionBox );