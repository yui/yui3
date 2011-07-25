Panel
=====

Panel is a widget that simulates the behavior of an OS window.
It is positionable, stackable, and provides support for the standard 
module format layout, with a header, body and footer section. 
The header and footer sections can support buttons with specific callback
functions. The panel can be modal, and can be auto-focussed or hidden when
certain UI interactions occur.

The panel is built by extending Widget and adding the WidgetPosition, 
WidgetStack, WidgetPositionAlign, WidgetPositionConstrain, WidgetStdMod,
WidgetModality, WidgetAutohide, and WidgetButtons extensions.
