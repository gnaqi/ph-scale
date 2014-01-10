// Copyright 2002-2013, University of Colorado Boulder

/**
 * pH meter for the 'Solutions' screen.
 * Origin is at top left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Dimension2 = require( 'DOT/Dimension2' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var PHScaleNode = require( 'PH_SCALE/common/view/PHScaleNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var pHString = require( 'string!PH_SCALE/pH' );
  var stringNoValue = '-';

  // constants
  var SCALE_SIZE = new Dimension2( 55, 450 );
  var ENABLED_COLOR = 'rgb(135,19,70)';
  var DISABLED_COLOR = 'rgb(178,178,178)';

  /**
   * Value is displayed inside of this, which sits above the scale.
   * Has an expand/collapse button for controlling visibility of the entire meter.
   * What is a bit odd is that button is only visible while the meter is expanded,
   * and a totally separate expand/collapse bar is shown when the meter is collapsed.
   * But hey, that's what they wanted.
   *
   * @param {Property<Number>} pHProperty
   * @param {Property<Boolean>} visibleProperty
   * @param {Property<Boolean>} enabledProperty optional
   * @constructor
   */
  function ValueNode( pHProperty, visibleProperty, enabledProperty ) {

    var thisNode = this;
    Node.call( thisNode );

    // pH value
    var valueNode = new Text( Util.toFixed( PHScaleConstants.PH_RANGE.max, PHScaleConstants.PH_METER_DECIMAL_PLACES ),
      { fill: 'black', font: new PhetFont( 28 ) } );

    // rectangle that the value is displayed in
    var valueXMargin = 8;
    var valueYMargin = 5;
    var cornerRadius = 12;
    var valueRectangle = new Rectangle( 0, 0, valueNode.width + ( 2 * valueXMargin ), valueNode.height + ( 2 * valueYMargin ), cornerRadius, cornerRadius,
      { fill: 'white' } );

    // label above the value
    var labelNode = new Text( pHString,
      { fill: 'white', font: new PhetFont( { size: 28, weight: 'bold' } ) } );

    // background
    var backgroundXMargin = 14;
    var backgroundYMargin = 10;
    var backgroundYSpacing = 6;
    var backgroundWidth = Math.max( labelNode.width, valueRectangle.width ) + ( 2 * backgroundXMargin );
    var backgroundHeight = labelNode.height + valueRectangle.height + backgroundYSpacing + ( 2 * backgroundYMargin );
    var backgroundRectangle = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: ENABLED_COLOR } );

    // expand/collapse button
    var expandCollapseButton = new ExpandCollapseButton( 0.85 * labelNode.height, visibleProperty );

    // rendering order
    thisNode.addChild( backgroundRectangle );
    thisNode.addChild( valueRectangle );
    thisNode.addChild( labelNode );
    thisNode.addChild( expandCollapseButton );
    thisNode.addChild( valueNode );

    // layout
    labelNode.top = backgroundRectangle.top + backgroundYMargin;
    valueRectangle.centerX = backgroundRectangle.centerX;
    labelNode.left = valueRectangle.left;
    valueRectangle.top = labelNode.bottom + backgroundYSpacing;
    valueNode.right = valueRectangle.right - valueXMargin; // right justified
    valueNode.centerY = valueRectangle.centerY;
    expandCollapseButton.centerY = labelNode.centerY;
    expandCollapseButton.right = valueRectangle.right;

    // pH value
    pHProperty.link( function( pH ) {
      if ( pH === null ) {
        valueNode.text = stringNoValue;
        valueNode.centerX = valueRectangle.centerX; // center justified
      }
      else {
        valueNode.text = Util.toFixed( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES );
        valueNode.right = valueRectangle.right - valueXMargin; // right justified
      }
    } );

    if ( enabledProperty ) {
      enabledProperty.link( function( enabled ) {
        backgroundRectangle.fill = enabled ? ENABLED_COLOR : DISABLED_COLOR;
      } );
    }
  }

  inherit( Node, ValueNode );

  /**
   * Arrow and dashed line that points to a value on the pH scale.
   * @param {Property<Number>} scaleWidth
   * @constructor
   */
  function PointerNode( scaleWidth ) {

    var thisNode = this;
    Node.call( thisNode );

    // dashed line that extends across the scale
    var lineNode = new Line( 0, 0, scaleWidth, 0, {
      stroke: 'black',
      lineDash: [ 5, 5 ],
      lineWidth: 2
    } );

    // arrow head pointing at the scale
    var arrowSize = new Dimension2( 21, 28 );
    var arrowNode = new Path( new Shape()
      .moveTo( 0, 0 )
      .lineTo( arrowSize.width, -arrowSize.height / 2 )
      .lineTo( arrowSize.width, arrowSize.height / 2 )
      .close(),
      { fill: 'black' } );

    // rendering order
    thisNode.addChild( arrowNode );
    thisNode.addChild( lineNode );

    // layout, origin at arrow tip
    lineNode.left = 0;
    lineNode.centerY = 0;
    arrowNode.left = lineNode.right;
    arrowNode.centerY = lineNode.centerY;
  }

  inherit( Node, PointerNode );

  /**
   * @param {Property<Number>} pHProperty
   * @param {Property<Boolean>} visibleProperty is this node visible?
   * @constructor
   */
  function SolutionsPHMeterNode( pHProperty, visibleProperty ) {

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var valueNode = new ValueNode( pHProperty, visibleProperty );
    var verticalLineNode = new Line( 0, 0, 0, 25, { stroke: 'black', lineWidth: 5 } );
    var scaleNode = new PHScaleNode( { size: SCALE_SIZE } );
    var pointerNode = new PointerNode( SCALE_SIZE.width );

    // rendering order
    thisNode.addChild( verticalLineNode );
    thisNode.addChild( valueNode );
    thisNode.addChild( scaleNode );
    thisNode.addChild( pointerNode );

    // layout
    verticalLineNode.centerX = scaleNode.right - ( SCALE_SIZE.width / 2 );
    verticalLineNode.bottom = scaleNode.top + 1;
    valueNode.centerX = verticalLineNode.centerX;
    valueNode.bottom = verticalLineNode.top + 1;
    pointerNode.x = scaleNode.right - SCALE_SIZE.width;
    // pointerNode.centerY is set dynamically

    // move the pointer to the pH value
    pHProperty.link( function( value ) {
      pointerNode.visible = ( value !== null );
      pointerNode.centerY = scaleNode.top + ( scaleNode.getBackgroundStrokeWidth() / 2 ) +
                            Util.linear( PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max, SCALE_SIZE.height, 0, value || 7 );
    } );
  }

  return inherit( Node, SolutionsPHMeterNode );
} );
