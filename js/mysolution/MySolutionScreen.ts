// Copyright 2013-2022, University of Colorado Boulder

/**
 * The 'My Solution' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import { Image } from '../../../scenery/js/imports.js';
import mySolutionHomeScreenIcon_png from '../../images/mySolutionHomeScreenIcon_png.js';
import mySolutionNavbarIcon_png from '../../images/mySolutionNavbarIcon_png.js';
import PHScaleColors from '../common/PHScaleColors.js';
import phScale from '../phScale.js';
import phScaleStrings from '../phScaleStrings.js';
import MySolutionModel from './model/MySolutionModel.js';
import MySolutionScreenView from './view/MySolutionScreenView.js';

type SelfOptions = EmptySelfOptions;

type MySolutionScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class MySolutionScreen extends Screen {

  public constructor( providedOptions: MySolutionScreenOptions ) {

    const options = optionize<MySolutionScreenOptions, SelfOptions, ScreenOptions>()( {

      // ScreenOptions
      name: phScaleStrings.screen.mySolutionStringProperty,
      backgroundColorProperty: new Property( PHScaleColors.SCREEN_BACKGROUND ),
      homeScreenIcon: new ScreenIcon( new Image( mySolutionHomeScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( mySolutionNavbarIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    }, providedOptions );

    super(
      () => new MySolutionModel( {
        tandem: options.tandem.createTandem( 'model' )
      } ),
      model => new MySolutionScreenView( model, ModelViewTransform2.createIdentity(), {
        tandem: options.tandem.createTandem( 'view' )
      } ),
      options
    );
  }
}

phScale.register( 'MySolutionScreen', MySolutionScreen );