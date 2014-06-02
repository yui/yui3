Drag and Drop Change History
============================

3.17.2
------

* No changes.

3.17.1
------

* No changes.

3.17.0
------

* [#1778][] Filter mousedown events to check that they belong to a valid drop target. (Andrew Nicols)

[#1778]: https://github.com/yui/yui3/pull/1778

3.16.0
------

* [#1721][] Move preventDefault to gesturemovestart (Andrew Nicols)
* [#1761][] Prevent default on gesturemovestart after movement has started. (Andrew Nicols)
* [#1663][] DDProxy will reset radio inputs when cloneNode==true ([#1666][]: Chema Balsas)
* Remove name attribute radio inputs inside cloned nodes by dd-proxy. [Chema Balsas]

[#1721]: https://github.com/yui/yui3/pull/1721
[#1761]: https://github.com/yui/yui3/pull/1761
[#1666]: https://github.com/yui/yui3/pull/1666
[#1663]: https://github.com/yui/yui3/issues/1663

3.15.0
------

* Fix a bug that doesn't fire `drop:hit` event. ([#1573][]: @hacklschorsch)
* Prevent the default page action when starting a `gesturemove` event. This
  fixes browsers that select the text when dragging. ([#1557][]: @andrewnicols)

[#1573]: https://github.com/yui/yui3/issues/1573
[#1557]: https://github.com/yui/yui3/issues/1557

3.14.1
------

* No changes.

3.14.0
------

* No changes.

3.13.0
------

* No changes.

3.12.0
------

* No changes.

3.11.0
------

* No changes.

3.10.3
------

* No changes.

3.10.2
------

* No changes.

3.10.1
------

* No changes.

3.10.0
------

* Make DD use EventTarget's public `getTargets()` method.

3.9.1
-----

* No changes.

3.9.0
-----

* No changes.

3.8.1
-----

* No changes.

3.8.0
-----

* 2532824 - Performance tweaks
* Pull Req: 309 - Fixed Safari scrolling issue

3.7.3
-----

* 2532718 don't stop gesture start, but prevent gesture move to allow clicks
* 2532837 Unreg gesturemoveend on _unprep
* Switched DD over to Y.UA.touchEnabled
* DD should completely pass lint now

3.7.2
-----

* No changes.

3.7.1
-----

* No changes.

3.7.0
-----

* No changes.

3.6.0
-----

* 2531340 DDConstrained broken when using DDNodeScroll plugin
* 2532009 Drag examples could use some Jeff polish
* 2532106 Drag handles aren't well explained in the example.
* 2532216 DDConstrained does not remove event listeners on destroy properly
* 2532291 DD Delegate ignores dragNode configuration option
* 2532500 Y.Plugin.Drag interferes with browser's native handling of dragged links, even when those links aren...


3.5.1
-----

  * No changes.

3.5.0
-----

* 2530257 Avoid interference of Drag and Nodes Event Handles
* 2531377 shim is not created if dd-ddm is loaded after the first drag is activated
* 2531674 Issue with drag and drop and drop:hit event


3.4.1
-----

* No changes.

3.4.0
-----

* #2529889 Example for Delegate Drag and Drop has wrong parameters
* #2529905 Using DDNodeScroll with DDDelegate causes JS error in Safari
* #2530050 Incorrect documentation
* #2530451 DragDrop enhancement - ability to use dd with non-node objects.
* #2530576 change notest needed in history file


3.3.0
-----

* #2529382 DD Delegate breaks when a draggable is nested and uses a handle
* #2529407 Add tickAlignX and tickAlignY events to Y.Plugin.DDConstrained
* #2529409 [Pull Request] - #2529407 Add tickAlignX and tickAlignY events to Y.Plugin.DDConstrained
* #2529463 Screen goes red in some YUI 3 D&D examples in IE=8 doc mode
* #2529469 Reset _lastTickYFired/_lastTickXFired on drag end
* #2529470 [Pull Request] - #2529469 Reset _lastTickYFired/_lastTickXFired on drag end
* #2529484 DD example not working when run from local directory or hosted on YUIbuild
* #2529577 Slider thumb frozen on mousedown+mousemove in IE9


3.2.0
-----

**IMPORTANT** dd-plugin and dd-plugin-drop are no longer bundled with the dd module. They are
now official plugins and need to be "used" on their own.

Moved to new Gesture support. DD now works off both mouse events and touch events natively with
the "drag-gestures" plugin that is conditionally loaded when touch events are found on the page.

* #2528693 3.1.0PR1 DD Examples fail in Opera 10.5
* #2528765 DD uses window references
* #2528797 Drag and drop breaks input text select()
* #2528959 Mouseenter event bubbles up when using both modules dd-plugin and dd-constrain
* #2529070 Drop destroy is throwing errors when the node is removed with .remove(true) using dd delegate
* #2529094 DD hard codes CSS prefix


3.1.0
-----

* #2527964 DD constrain2node cached position causes misalignment when that node is moved
* #2528229 Configuration to override region caching in Constrain plugin
* #2528395 Add a DD.Drag delegate class
* #2528457 Add invalid selector check to Delegate
* #2528488 Delegate errors without Drop plugin
* #2528509 Drag and drop slow on linux ff3.5.6
* #2528539 drag:start should fire before drag:enter
* #2528540 DDConstrained using cacheRegion set to false throws js errors when drag starts
* #2528560 drag:over event is not firing when useShim is false
* #2528578 DDConstrained has no default constraining config
* #2528585 drag:dropmiss being fired on simple click
* #2528592 Add throttle support to DD mousemove
* #2528596 Support Node instances as handles in Drag
* #2528607 Drop events not firing when attached to a Drag target
* #2528608 Default Drag throttleTime should be -1
* #2528613 dragNode XY not sync with the mouse if it has its dimensions changed on drag:start


3.0.0
-----

* #2528096 Updated initialization routine so plugins load before DD attachs to the node.
* #2528119 Added SELECT selector to invalidHandles.
* #2528124 Fixed issue with creating more than one DD instance on a node.
* #2528149 Fixed _noShim use case


3.0.0 Beta1
-----------

Added a plugin to support Window and Node based scrolling

    var dd = new Y.DD.Drag({
        node: '#drag'
    }).plug(Y.plugin.DDWinScroll);

    var dd = new Y.DD.Drag({
        node: '#drag'
    }).plug(Y.plugin.DDNodeScroll, {
        node: '#some-parent-with-scroll'
    });

Proxy and Constrained were moved to the plugin modal, there are some syntax changes:

PR2 - Proxy:

    var dd = new Y.DD.Drag({
        node: '#drag',
        proxy: true,
        moveOnEnd: false
    });

Current - Proxy:

    var dd = new Y.DD.Drag({
        node: '#drag'
    }).plug(Y.plugin.DDProxy, {
        moveOnEnd: false
    });

PR2 - Constrained:

    var dd = new Y.DD.Drag({
        node: '#drag',
        constrain2node: '#wrap'
    });

Current - Constrained:

    var dd = new Y.DD.Drag({
        node: '#drag'
    }).plug(Y.plugin.DDConstrained, {
        constrain2node: '#wrap'
    });

Converted Everything to use setXY now that FF2 is not supported.
Performance tweaks to dragging over a target.

3.0.0 PR2
---------

Added bubbles config option to help with extending later.
Updated _checkRegion to perform Bottom, Top, Left, Right validation instead of Top, Bottom, Left, Right

3.0.0 PR1
---------

Known Issues:

* Firefox 2.x:
    Proxy Drags with handles inside an element with overflow: hidden will not target properly.

* All:
    Scrolling Module not available as of this release.

