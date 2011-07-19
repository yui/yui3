YUI.add('panel', function(Y) {

/**
 * Provides a basic Overlay widget, with Standard Module content support. The Overlay widget
 * provides Page XY positioning support, alignment and centering support along with basic 
 * stackable support (z-index and shimming).
 *
 * @module overlay
 */

/**
 * A basic Overlay Widget, which can be positioned based on Page XY co-ordinates and is stackable (z-index support).
 * It also provides alignment and centering support and uses a standard module format for it's content, with header,
 * body and footer section support.
 *
 * @class Overlay
 * @constructor
 * @extends Widget
 * @uses WidgetStdMod
 * @uses WidgetPosition
 * @uses WidgetStack
 * @uses WidgetPositionAlign
 * @uses WidgetPositionConstrain
 * @param {Object} object The user configuration for the instance.
 */
Y.Panel = Y.Base.create("panel", Y.Widget, [Y.WidgetStdMod, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPositionConstrain, Y.WidgetModality, Y.WidgetAutohide]);


}, '@VERSION@' ,{requires:['widget', 'widget-stdmod', 'widget-position', 'widget-stack', 'widget-position-align', 'widget-position-constrain', 'widget-modality', 'widget-autohide']});
