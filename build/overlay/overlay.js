YUI.add('overlay', function(Y) {

/**
 * @module overlay
 */

/**
 * @class Overlay
 * @extends Widget
 * @uses WidgetPosition, WidgetStack, WidgetPositionExt, WidgetStdMod
 */
Y.Overlay = Y.Widget.build(Y.Widget, [Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionExt, Y.WidgetStdMod], {dynamic:true});
Y.Overlay.NAME = "overlay";



}, '@VERSION@' ,{requires:['widget', 'widget-position', 'widget-stack', 'widget-position-ext', 'widget-stdmod']});
