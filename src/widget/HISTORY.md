Widget Change History
=====================

3.10.3
------

* No changes.

3.10.2
------

  * Fixed contentBox remaining in Y.Node _instances cache, when
    widget hasn't been rendered, and `widget.destroy(true)` [deep destroy]
    is used.

3.10.1
------

* No changes.

3.10.0
------

  * Added custom prefix support to widget.getSkinName,
    derived https://github.com/yui/yui3/pull/327

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

  * No changes.

3.7.3
-----

  * No changes.

3.7.2
-----

  * No changes.

3.7.1
-----

  * No changes.

3.7.0
-----

 * Fixed regression in `Widget.getByNode()`, introduced in 3.5.0, where the
   Widget would not be found if the user changed the id of the boundingBox node,
   after the widget was rendered.

   We go back to using the Node's guid for caching instead of the DOM node id.

   The change was originally made to lay the groundwork for string based rendering,
   where a boundingBox node reference would not be present during initialization.

   This can still be achieved post-render by populating the instance map, after a
   Node reference has been established/added to the DOM (when we get there).

3.6.0
-----

 * Widget no longer runs html parser against the default `contentBox` created
   from `CONTENT_TEMPLATE`, so that html parser implementations don't need to
   check for `null` results for missing nodes.

3.5.1
-----

 * Cleaned up logic to detach document focus listener after last Widget is destroyed.
   The count was off by one, leaving one Widget in memory.

3.5.0
-----

 * Refactored some of the box stamping code, to avoid Node references
   until render. Changed caching mechanism for Y.Widget.getByNode to use node.get("id")

 * Patched after listeners in Widget with a if (e.target === this), so that homogenous
   bubbles don't end up changing state at both the source and the target. Broader
   fix needs to go into Event/EventTarget

 * Optimized focus handler registration, by only registering a single document focus
   listener and using Widget.getByNode to ship out handling to the specific widget
   instance.

 * Widget will now default to an empty object config, if one isn't passed in,
   so that HTML_PARSER can work with a static ATTRS srcNode definition.

   It's not possible to address this just at the HTML_PARSER level, since the config
   object gets used by reference, so we need to make sure everything is updating the
   config object which is passed to Base's initialization chain.

3.4.1
-----

  * No changes.

3.4.0
-----

  * Added workaround in destructor for single box widgets (contentBox === boundingBox)
    Also extracted DOM removal into separate method, which can be overridden
    if custom widgets don't want rendered DOM removed.

  * Fixed UI_EVENTS js exception when dealing with nested widgets rendered
    by different Y instances.

  * Fixed UI_EVENTS invoking nested widget listeners more than once (also
    fixed regression to Parent-Child as a result of this change).

  * Added support for destroy(true) to Widget, which will remove and
    destroy all child nodes (not just the boundingBox and contentBox)
    contained within the Widget's boundingBox in order to help control
    Node cache size over long-running applications.

    destroy() will maintain its current behavior due to the potentially
    high run-time cost of destroying all child nodes.

    Widget developers still need to continue with the best practice of
    destroying explicit node references they create, in their destructors
    to support the destroy() case.

3.3.0
-----

  * HTML_PARSER now return null instead of an empty node list, if no nodes
    are found, when using the [selector] syntax, so that the default value
    will be applied for the attribute.

  * UI_EVENTS support and skin util methods (only getSkinName currently)
    broken out of widget-base into separate submodules, widget-uievents and
    widget-skin.

  * widget-base-ie broken out as conditional module.

  * Fixed widget-locale support. Needed lazyAdd:false, for strings attribute

  * Changed widget UI_EVENTS type parsing, to use EventTarget.parseType and
    removed after() override, since everything ends up going through on()
    eventually.

3.2.0
-----

  * Minimized widget dependencies from the complete node, base rollups,
    to only the node and base submodules widget actually uses

  * Fixed issue in UI_EVENTS handling, where removing the last listener for
    a ui event, didn't clear out the _delegates hash even though the handler
    was detached (for example,  in tabview, if you remove all tabs, and then
    add a new tab, clicking on the new tab didn't work.)

3.1.1
-----

  * Fixed ticket #2528758 : using widget's DOM event facade ends with error during destroy
  * Fixed ticket #2528760 : _applyParsedConfig merges arrays, instead of letting user config win
  * "init, render and destroy listeners now called synchronously, if event already fired (see Event README)"

3.1.0
-----

  * "render" event now published with the defaultTargetOnly set to true.

  * Added support for MyWidget.CSS_PREFIX static property
    to let developers define their own CSS PREFIX instead of
    yui-<MyWidget.NAME>.

  * Changed default value for the tabIndex attribute to null, meaning by default
    a Widget's bounding box will not be a focusable element.

  * Widget now has built-in support for Progressive Enhancement.

    1. The document element (HTML) is now stamped with a class name
       (yui-js-enabled) indicating that JS is enabled allowing for the
       creation of JS-aware Widget CSS style rules for Progressive Enhancement.

    2. Widget has support for a class name representing the "loading"
       state that can be used in combination with the "yui-js-enabled" class name
       to create style rules for widgets that are in the process of loading.
       There is support for use of both a generic Widget and type-specific
       Widget class name by default (for example:  "yui-widget-loading" and
       "yui-tabview-loading").

    3. Widget's renderer will remove the "loading" class names from the
       bounding box allowing the fully rendered and functional widget to be
       revealed.

    Developer Usage / Requirements

    Developers can take advantage of the system by following two steps:

    1. Simply stamping the bounding box of their widgets with the
       corresponding "loading" state class name.  The idea being that the markup
       for this widget is already on the page, and the JS components required
       to transform/bring the widget to life are in the process of loading.

    2. Providing the definition of the loading style for the widget(s).

  * Removed parentNode.inDoc() check from render, to allow implementations
    to render to parentNodes which are document fragments. If rendering to
    a document fragment, the implementation is responsible for adding the
    document fragment to the document during the render lifecycle phase.

  * Split widget module into the following sub-modules

    1. widget-base : Core lifecycle and API support.
    2. widget-htmlparser : HTML parser support.

    The "widget" module, is a roll up of the widget-base and widget-htmlparser
    submodules.

    The widget-locale is a standalone module, which contains the deprecated
    Internationalization support and has been replaced by the Y.Intl language
    pack support, to allow strings to be defined separately from code.

  * Removed moveStyles support for 3.1. Can be re-added if required, but
    currently does not seem to be in use.

  * Made render event fireOnce (along with init and destroy in Base)

  * Widget will now fire user-generated events like DOM elements do (e.g.
    'click', 'mouseover').  Like all other Widget events, these events are
    prefixed with the Widget name (e.g. 'menuitem:click') and the default
    context of the event listener will be the Widget that fired the event.

    The goals/purpose of the Widget UI events are:

    1. Provide developers with the ability to listen for UI events as though the
       Widget is an atomic element, as opposed to DOM events that will bubble up
       through all of the elements that compose a Widget's UI.

    2. These are events that many Widget instances are going to want to publish
       and fire, so Widget does this by default to ensure that these events are
       fired in a performant, consistent way across Widget implementations.

    Additional info:

    1. Widget developers don't have to explicitly publish a given UI event in
       order for Widget consumers to listen for them.  By default UI events are
       only published and fired if someone is listening for them.

    2. Widget developers can choose to publish a given UI event in order to
       explicitly control some aspect of the event.  The most likely use case
       is the desire to provide the default implementation/handler for a given
       event.  For example: a developer might want to publish a click event
       for a Menu Widget with the goal of providing the default click
       implementation/function (what gets canceled if a listener calls
       the preventDefault() method.)

    3. The set of user-generated events published by widget is defined by the
       UI_EVENTS prototype property.  Widget developers can use this property
       to pair down or extend the number of events that are published and
       fired automatically.

    4. For performance, these events are only created when someone is
       listening, and the actual firing of these events is facilitated by a
       single, delegated DOM event listener.

  * content box now expands to fill bounding box. CSS is used for browsers
    which support box-sizing:border-box. Expansion is handled programmatically
    for others (currently IE6 & IE7). Maybe some edge cases which need
    resolution.

  * Added an "id" attribute.

  * Added support for auto-rendering of widgets at the end of construction,
    using the "render" attribute.

  * Added support for single-box widgets (contentBox and boundingBox can
    point to same node).

    Widget developers can set CONTENT_TEMPLATE to null if they have a
    widget which doesn't need dual-box support.

  * Added _bindAttrUI and _syncAttrUI sugar methods, to bind after listeners
    and sync methods, by attribute name.

  * The widget's bounding box is now removed from the DOM and destroyed
    when the widget it destroyed.

  * Added "srcNode" attribute, which acts as the root for HTML_PARSER.

    This allows widgets to support progressive enhancement, without having
    to put the burden on the user to create and point to bounding boxes,
    or content boxes.

  * Added protected _getSrcNode and _applyParsedConfig methods to allow for
    HTML_PARSER customization, by allowing Widget developers to customize
    the node passed into _parseNode on the input side, and the final merged
    configuration on the output side of the srcNode parsing process.

    The default Widget _getSrcNode implementation uses "srcNode" if set,
    otherwise falls back to "contentBox", for 3.0.0 compatibility.

    The default Widget _applyParsedConfig implementation aggregates the user
    configuration literal, with the configuration output from parsed node,
    with the user configuration taking precedence.

    NOTE: All HTML_PARSER related changes are backward compatible.

    Existing Widget implementations should still work. However HTML_PARSER
    implementations based on contentBox being the root node should be
    modified to work off of srcNode before the 3.1.0 release.

3.0.0
-----

  * No Changes

3.0.0 beta 1
------------

  * PluginHost moved down to Base.

  * Render event args added to event facade instead of being passed
    across separately (e.parentNode).

  * "hasFocus" attribute renamed to "focused"

  * "focused" attribute is read only

  * "focused" attribute is set via:
    1. user interaction
    2. the "focus" and "blur" methods

  * Only one DOM focus event handler is used now (two for WebKit) and it is
    bound to the widget's ownerDocument.  This allows modal widgets to maintain
    a reference to the element in the document that previously had focus and
    to be able to restore that focus when the modal widget is hidden.

  * "tabIndex" attribute was updated
    1. accepts a number or null
    2. more documentation

3.0.0PR2 - Initial release
--------------------------

