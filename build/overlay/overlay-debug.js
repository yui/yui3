YUI.add('overlay', function(Y) {

Y.Overlay = Y.Widget.build(Y.Widget, [Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionExt, Y.WidgetStdMod], {dynamic:true});
Y.Overlay.NAME = "overlay";



}, '@VERSION@' ,{requires:['widget', 'widget-position', 'widget-stack', 'widget-position-ext', 'widget-stdmod']});
