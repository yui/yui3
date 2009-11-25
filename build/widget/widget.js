YUI.add('widget', function(Y) {

/**
 * Provides the base Widget class
 *
 * @module widget
 */

// Local Constants
var L = Y.Lang,
    O = Y.Object,
    Node = Y.Node,
    ClassNameManager = Y.ClassNameManager,

    CONTENT = "content",
    VISIBLE = "visible",
    HIDDEN = "hidden",
    DISABLED = "disabled",
    FOCUSED = "focused",
    WIDTH = "width",
    HEIGHT = "height",
    EMPTY = "",
    HYPHEN = "-",
    BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    PARENT_NODE = "parentNode",
    OWNER_DOCUMENT = "ownerDocument",
    SRC_NODE = "srcNode",
    BODY = "body",
	TAB_INDEX = "tabIndex",
    LOCALE = "locale",
    INIT_VALUE = "initValue",
    ID = "id",
    RENDER = "render",
    RENDERED = "rendered",
    DESTROYED = "destroyed",

    CHANGE = "Change",
    _AFTER = "_after",
    _UISET = "_uiSet",

    ContentUpdate = "contentUpdate",

    // Widget nodeguid-to-instance map.
    _instances = {},

    // Map used to keep track of delegated DOM event listeners used to fire
    // Custom Events of the same type/name (e.g. "click", "mouseover") for 
    // Widget instances.
    _delegates = {};
    

/**
 * A base class for widgets, providing:
 * <ul>
 *    <li>The render lifecycle method, in addition to the init and destroy 
 *        lifecycle methods provide by Base</li>
 *    <li>Abstract methods to support consistent MVC structure across 
 *        widgets: renderer, renderUI, bindUI, syncUI</li>
 *    <li>Support for common widget attributes, such as boundingBox, contentBox, visible, 
 *        disabled, focused, strings</li>
 * </ul>
 *
 * @param config {Object} Object literal specifying widget configuration 
 * properties.
 *
 * @class Widget
 * @constructor
 * @extends Base
 */
function Widget(config) {

    this._strings = {};

    Widget.superclass.constructor.apply(this, arguments);

    var render = this.get(RENDER), parentNode;
    if (render) {
        if (render !== true) {
            parentNode = render;
        }
        this.render(parentNode);
    }
}

/**
 * The build configuration for the Widget class.
 * <p>
 * Defines the static fields which need to be aggregated,
 * when this class is used as the main class passed to 
 * the <a href="Base.html#method_build">Base.build</a> method.
 * </p>
 * @property _buildCfg
 * @type Object
 * @static
 * @final
 * @private
 */
Widget._buildCfg = {
    aggregates : ["HTML_PARSER"]
};

/**
 * Static property provides a string to identify the class.
 * <p>
 * Currently used to apply class identifiers to the bounding box 
 * and to classify events fired by the widget.
 * </p>
 *
 * @property Widget.NAME
 * @type String
 * @static
 */
Widget.NAME = "widget";

/**
 * Constant used to identify state changes originating from
 * the DOM (as opposed to the JavaScript model).
 *
 * @property Widget.UI_SRC
 * @type String
 * @static
 * @final
 */
Widget.UI_SRC = "ui";

var UI = Widget.UI_SRC;

/**
 * Static property used to define the default attribute 
 * configuration for the Widget.
 * 
 * @property Widget.ATTRS
 * @type Object
 * @static
 */
Widget.ATTRS = {

    /**
     * @attribute id
     * @writeOnce
     * @default Generated using guid()
     * @type String
     */
    id: {
        valueFn: "_guid",
        writeOnce: true
    },

    /**
     * Flag indicating whether or not this Widget
     * has been through the render lifecycle phase.
     *
     * @attribute rendered
     * @readOnly
     * @default false
     * @type boolean
     */
    rendered: {
        value:false,
        readOnly: true
    },

    /**
    * @attribute boundingBox
    * @description The outermost DOM node for the Widget, used for sizing and positioning 
    * of a Widget as well as a containing element for any decorator elements used 
    * for skinning.
    * @type String | Node
    * @writeOnce
    */
    boundingBox: {
        value:null,
        setter: "_setBoundingBox",
        writeOnce: true
    },

    /**
    * @attribute contentBox
    * @description A DOM node that is a direct descendent of a Widget's bounding box that 
    * houses its content.
    * @type String | Node
    * @writeOnce
    */
    contentBox: {
        value:null,
        setter: "_setContentBox",
        writeOnce: true
    },

    /**
    * @attribute tabIndex
    * @description Number (between -32767 to 32767) indicating the widget's 
	* position in the default tab flow.  The value is used to set the 
	* "tabIndex" attribute on the widget's bounding box.  Negative values allow
	* the widget to receive DOM focus programmatically (by calling the focus
	* method), while being removed from the default tab flow.  A value of 
	* null removes the "tabIndex" attribute from the widget's bounding box.
    * @type Number
	* @default 0
    */
    tabIndex: {
		value: 0,
		validator: "_validTabIndex"
    },

    /**
    * @attribute focused
    * @description Boolean indicating if the Widget, or one of its descendants, 
	* has focus.
    * @readOnly
    * @default false
    * @type boolean
    */
    focused: {
        value: false,
        readOnly:true
    },

    /**
    * @attribute disabled
    * @description Boolean indicating if the Widget should be disabled. The disabled implementation
    * is left to the specific classes extending widget.
    * @default false
    * @type boolean
    */
    disabled: {
        value: false
    },

    /**
    * @attribute visible
    * @description Boolean indicating weather or not the Widget is visible.
    * @default true
    * @type boolean
    */
    visible: {
        value: true
    },

    /**
    * @attribute height
    * @description String with units, or number, representing the height of the Widget. If a number is provided,
    * the default unit, defined by the Widgets DEF_UNIT, property is used.
    * @default ""
    * @type {String | Number}
    */
    height: {
        value: EMPTY
    },

    /**
    * @attribute width
    * @description String with units, or number, representing the width of the Widget. If a number is provided,
    * the default unit, defined by the Widgets DEF_UNIT, property is used.
    * @default ""
    * @type {String | Number}
    */
    width: {
        value: EMPTY
    },

    /**
     * @attribute moveStyles
     * @description Flag defining whether or not style properties from the content box
     * should be moved to the bounding box when wrapped (as defined by the WRAP_STYLES property)
     * @default false
     * @type boolean
     */
    moveStyles: {
        value: false
    },

    /**
     * @attribute locale
     * @description
     * The default locale for the widget. NOTE: Using get/set on the "strings" attribute will
     * return/set strings for this locale.
     * @default "en"
     * @type String
     */
    locale : {
        value: "en"
    },

    /**
     * @attribute strings
     * @description Collection of strings used to label elements of the Widget's UI.
     * @default null
     * @type Object
     */
    strings: {
        setter: function(val) {
            return this._setStrings(val, this.get(LOCALE));
        },

        getter: function() {
            return this.getStrings(this.get(LOCALE));
        }
    },

    /**
     * Whether or not to render the widget automatically after init, and optionally, to which parent node.
     *
     * @attribute render
     * @type boolean | Node
     * @writeOnce
     */
    render: {
        value:false,
        writeOnce:true
    },

    /**
     * The DOM node to parse for configuration values, passed to the Widget's HTML_PARSER definition
     *
     * @attribute srcNode
     * @type String | Node
     * @writeOnce
     */
    srcNode: {
        value: null,
        setter: Y.Node.one,
        writeOnce: true
    }
};

/**
 * Cached lowercase version of Widget.NAME
 *
 * @property Widget._NAME_LOWERCASE
 * @private
 * @static
 */
Widget._NAME = Widget.NAME.toLowerCase();

/**
 * Generate a standard prefixed classname for the Widget, prefixed by the default prefix defined
 * by the <code>Y.config.classNamePrefix</code> attribute used by <code>ClassNameManager</code> and 
 * <code>Widget.NAME.toLowerCase()</code> (e.g. "yui-widget-xxxxx-yyyyy", based on default values for 
 * the prefix and widget class name).
 * <p>
 * The instance based version of this method can be used to generate standard prefixed classnames,
 * based on the instances NAME, as opposed to Widget.NAME. This method should be used when you
 * need to use a constant class name across different types instances.
 * </p>
 * @method getClassName
 * @param {String*} args* 0..n strings which should be concatenated, using the default separator defined by ClassNameManager, to create the class name
 */
Widget.getClassName = function() {
	var args = Y.Array(arguments, 0, true);
	args.splice(0, 0, this._NAME);
	return ClassNameManager.getClassName.apply(ClassNameManager, args);
};

/**
 * Returns the widget instance whose bounding box contains, or is, the given node. 
 * <p>
 * In the case of nested widgets, the nearest bounding box ancestor is used to
 * return the widget instance.
 * </p>
 * @method Widget.getByNode
 * @static
 * @param node {Node | String} The node for which to return a Widget instance. If a selector
 * string is passed in, which selects more than one node, the first node found is used.
 * @return {Widget} Widget instance, or null if not found.
 */
Widget.getByNode = function(node) {
    var widget,
        widgetMarker = Widget.getClassName();

    node = Node.one(node);
    if (node) {
        node = (node.hasClass(widgetMarker)) ? node : node.ancestor("." + widgetMarker);
        if (node) {
            widget = _instances[Y.stamp(node, true)];
        }
    }

    return widget || null;
};

/**
 * Object hash, defining how attribute values are to be parsed from
 * markup contained in the widget's content box. e.g.:
 * <pre>
 *   {
 *       // Set single Node references using selector syntax 
 *       // (selector is run through node.query)
 *       titleNode: "span.yui-title",
 *       // Set NodeList references using selector syntax 
 *       // (array indicates selector is to be run through node.queryAll)
 *       listNodes: ["li.yui-item"],
 *       // Set other attribute types, using a parse function. 
 *       // Context is set to the widget instance.
 *       label: function(contentBox) {
 *           return contentBox.query("span.title").get("innerHTML");
 *       }
 *   }
 * </pre>
 * 
 * @property Widget.HTML_PARSER
 * @type Object
 * @static
 */
Widget.HTML_PARSER = {};

Y.extend(Widget, Y.Base, {

    /*
    * Map of DOM events that should be fired as Custom Events by the  
    * Widget instance.
    * 
    * @property DOM_EVENTS
    * @type Object
    */
    DOM_EVENTS: {
        click: true,
        contextmenu: true,
        dblclick: true,
        keydown: true,
        keypress: true,
        keyup: true,
        mousedown: true,
        mousemove: true,
        mouseout: true, 
        mouseover: true, 
        mouseup: true,
        mouseenter: true,
        mouseleave: true
    },

    /*
    * Returns the outtermost DOM element for the Widget instance.
    * 
    * @method _getRootNode
    * @protected     
    */
    _getRootNode: function () {
        return this.get(BOUNDING_BOX);
    },

	/**
	 * Binds a delegated DOM event listener of the specified type to the 
	 * Widget's outtermost DOM element to facilitate the firing of a Custom
	 * Event of the same type for the Widget instance.  
	 *
	 * @method _createDelegate
	 * @param type {String} String representing the name of the event
	 */    
    _createDelegate: function (type) {

        var rootNode = this._getRootNode(),
            delegates,
            guid;

        if (rootNode) {

            guid = Y.stamp(rootNode, true);

            if (!_delegates[guid]) {
                _delegates[guid] = {};
            }

            delegates = _delegates[guid];


            if (!delegates[type]) {

                delegates[type] = rootNode.delegate(type, function (event) {

                    var widget = Y.Widget.getByNode(this);

                    if (widget) {
                        
                        //  Can lazy publish the event simply by firing it 
                        //  since at this point the default configuration 
                        //  has everything we need:
                        //  emitFacade is true (set by Attribute)
                        //  bubbles is true (EventTarget default)
                        //  preventable is true (EventTarget default)
                        //  queuable is false (EventTarget default)

                        widget.fire(event.type);                        

                    }


                }, ("." + Widget.getClassName()));
                
            }
            
        }
        
    },
    
    //  Override of on from Base to facilitate the firing of Widget events
    //  based on DOM events of the same name/type (e.g. "click", "mouseover").
    on: function (type) {

        var sType;

        if (L.isString(type)) {

            sType = type.replace(/(\w+):(\w+)/, "$2");

            if (this.DOM_EVENTS[sType]) {
        
                if (this.get(RENDERED)) {
                    this._createDelegate(sType);
                }
                else {
        
                    this.on(RENDER, function () {
        
                        this._createDelegate(sType);  
        
                    }, this);
        
                }
        
            }
            
        }
        
        return Widget.superclass.on.apply(this, arguments);

    },

	/**
	 * Returns a class name prefixed with the the value of the 
	 * <code>YUI.config.classNamePrefix</code> attribute + the instances <code>NAME</code> property.
	 * Uses <code>YUI.config.classNameDelimiter</code> attribute to delimit the provided strings.
	 * e.g. 
	 * <code>
	 * <pre>
	 *    // returns "yui-slider-foo-bar", for a slider instance
	 *    var scn = slider.getClassName('foo','bar');
	 *
	 *    // returns "yui-overlay-foo-bar", for an overlay instance
	 *    var ocn = overlay.getClassName('foo','bar');
	 * </pre>
	 * </code>
	 *
	 * @method getClassName
	 * @param {String}+ One or more classname bits to be joined and prefixed
	 */
	getClassName: function () {
		var args = Y.Array(arguments, 0, true);
		args.splice(0, 0, this._name);
		return ClassNameManager.getClassName.apply(ClassNameManager, args);
	},

    /**
     * Initializer lifecycle implementation for the Widget class. Registers the 
     * widget instance, and runs through the Widget's HTML_PARSER definition. 
     *
     * @method initializer
     * @protected
     * @param  config {Object} Configuration object literal for the widget
     */
    initializer: function(config) {
        var srcNode, parsedConfig;


        this._name = this.constructor.NAME.toLowerCase();

        _instances[Y.stamp(this.get(BOUNDING_BOX))] = this;

        /**
         * Notification event, which widget implementations can fire, when
         * they change the content of the widget. This event has no default
         * behavior and cannot be prevented, so the "on" or "after"
         * moments are effectively equivalent (with on listeners being invoked before 
         * after listeners).
         * 
         * @event widget:contentUpdate
         * @preventable false
         * @param {EventFacade} e The Event Facade
         */
        this.publish(ContentUpdate, { preventable:false });

        srcNode = this._getSrcNode();
        parsedConfig = this._parseNode(srcNode);
        config = this._applyParsedConfig(srcNode, config, parsedConfig);
    },

    /**
     * Descructor lifecycle implementation for the Widget class. Purges events attached
     * to the bounding box (and all child nodes) and removes the Widget from the 
     * list of registered widgets.
     *
     * @method destructor
     * @protected
     */
    destructor: function() {

        var boundingBox = this.get(BOUNDING_BOX);

        var guid = Y.stamp(boundingBox, true);
        if (guid && guid in _instances) {
            delete _instances[guid];
        }

        boundingBox.remove(true);


        //  Node's "remove" method will purge all of the delegated DOM event 
        //  listeners, the following cleans up references to detach handles
        //  for delegated event listeners.

        var rootNode = this._getRootNode();

        guid = Y.stamp(rootNode, true);
        
        if (_delegates[guid] && rootNode == boundingBox) {
            delete _delegates[guid];
        }

    },

    /**
     * Establishes the initial DOM for the widget. Invoking this
     * method will lead to the creating of all DOM elements for
     * the widget (or the manipulation of existing DOM elements 
     * for the progressive enhancement use case).
     * <p>
     * This method should only be invoked once for an initialized
     * widget.
     * </p>
     * <p>
     * It delegates to the widget specific renderer method to do
     * the actual work.
     * </p>
     *
     * @method render
     * @chainable
     * @final 
     * @param  parentNode {Object | String} Optional. The Node under which the 
     * Widget is to be rendered. This can be a Node instance or a CSS selector string. 
     * <p>
     * If the selector string returns more than one Node, the first node will be used 
     * as the parentNode. NOTE: This argument is required if both the boundingBox and contentBox
     * are not currently in the document. If it's not provided, the Widget will be rendered
     * to the body of the current document in this case.
     * </p>
     */
    render: function(parentNode) {

        if (this.get(DESTROYED)) {
            return;
        }

        if (!this.get(RENDERED)) {
             /**
             * Lifcyle event for the render phase, fired prior to rendering the UI 
             * for the widget (prior to invoking the widgets renderer method).
             * <p>
             * Subscribers to the "on" moment of this event, will be notified 
             * before the widget is rendered.
             * </p>
             * <p>
             * Subscribers to the "after" moment of this event, will be notified
             * after rendering is complete.
             * </p>
             *
             * @event widget:render
             * @preventable _defRenderFn
             * @param {EventFacade} e The Event Facade
             */
            this.publish(RENDER, {queuable:false, defaultFn: this._defRenderFn});

            parentNode = (parentNode) ? Node.one(parentNode) : null;
            if (parentNode && !parentNode.inDoc()) {
                parentNode = null;
            }

            this.fire(RENDER, {parentNode: parentNode});
        }

        return this;
    },

    /**
     * Default render handler
     *
     * @method _defRenderFn
     * @protected
     * @param {EventFacade} e The Event object
     * @param {Node} parentNode The parent node to render to, if passed in to the <code>render</code> method
     */
    _defRenderFn : function(e) {

        if (e.target === this) {

            this._renderUI(e.parentNode);
            this._bindUI();
            this._syncUI();

            this.renderer();

            this._set(RENDERED, true);
            
        }

    },

    /** 
     * Creates DOM (or manipulates DOM for progressive enhancement)
     * This method is invoked by render() and is not chained 
     * automatically for the class hierarchy (like initializer, destructor) 
     * so it should be chained manually for subclasses if required.
     * 
     * @method renderer
     * @protected
     */
    renderer: function() {
        this.renderUI();
        this.bindUI();
        this.syncUI();
    },

    /**
     * Configures/Sets up listeners to bind Widget State to UI/DOM
     * 
     * This method is not called by framework and is not chained 
     * automatically for the class hierarchy.
     * 
     * @method bindUI
     * @protected
     */
    bindUI: function() {},

    /**
     * Adds nodes to the DOM 
     * 
     * This method is not called by framework and is not chained 
     * automatically for the class hierarchy.
     * 
     * @method renderUI
     * @protected
     */
    renderUI: function() {},

    /**
     * Refreshes the rendered UI, based on Widget State
     * 
     * This method is not called by framework and is not chained
     * automatically for the class hierarchy.
     *
     * @method syncUI
     * 
     */
    syncUI: function() {},

    /**
    * @method hide
    * @description Hides the Widget by setting the "visible" attribute to "false".
    */
    hide: function() {
        return this.set(VISIBLE, false);
    },

    /**
    * @method show
    * @description Shows the Widget by setting the "visible" attribute to "true".
    */
    show: function() {
        return this.set(VISIBLE, true);
    },

    /**
    * @method focus
    * @description Causes the Widget to receive the focus by setting the "focused" 
    * attribute to "true".
    */
    focus: function () {
        return this._set(FOCUSED, true);
    },

    /**
    * @method blur
    * @description Causes the Widget to lose focus by setting the "focused" attribute 
    * to "false"
    */
    blur: function () {
        return this._set(FOCUSED, false);
    },

    /**
    * @method enable
    * @description Set the Widget's "disabled" attribute to "false".
    */
    enable: function() {
        return this.set(DISABLED, false);
    },

    /**
    * @method disable
    * @description Set the Widget's "disabled" attribute to "true".
    */
    disable: function() {
        return this.set(DISABLED, true);
    },

    /**
     * Utilitity method used to apply the <code>HTML_PARSER</code> configuration for the 
     * instance, to retrieve config data values.
     *
     * @method _parseNode
     * @private 
     * @param  node {Node} Root node to use to parse markup for configuration data
     * @return config {Object} configuration object, with values found in the HTML, populated
     */
    _parseNode : function(node) {
 
        var schema = this._getHtmlParser(),
            data,
            val;

        if (schema && node) {

            O.each(schema, function(v, k, o) {
                val = null;

                if (L.isFunction(v)) {
                    val = v.call(this, node);
                } else {
                    if (L.isArray(v)) {
                        val = node.all(v[0]);
                    } else {
                        val = node.one(v);
                    }
                }

                if (val !== null && val !== undefined) {
                    data = data || {};
                    data[k] = val;
                }

            }, this);
        }
        return data;
    },

    /**
     * @method _getSrcNode
     * @protected
     * @return {Node} The Node to apply HTML_PARSER to
     */
    _getSrcNode : function() {
        return this.get(SRC_NODE) || this.get(CONTENT_BOX);
    },

    /**
     * @method _applyParsedConfig
     * @protected
     * @return {Object} The merged configuration literal
     */
    _applyParsedConfig : function(node, cfg, parsedCfg) {
        return (parsedCfg) ? Y.aggregate(cfg, parsedCfg, false) : cfg;
    },

    /**
     * Moves a pre-defined set of style rules (WRAP_STYLES) from one node to another.
     *
     * @method _moveStyles
     * @private
     * @param {Node} nodeFrom The node to gather the styles from
     * @param {Node} nodeTo The node to apply the styles to
     */
    _moveStyles: function(nodeFrom, nodeTo) {

        var styles = this.WRAP_STYLES,
            pos = nodeFrom.getStyle('position'),
            contentBox = this.get(CONTENT_BOX),
            xy = [0,0],
            h, w;

        if (!this.get('height')) {
            h = contentBox.get('offsetHeight');
        }

        if (!this.get('width')) {
            w = contentBox.get('offsetWidth');
        }

        if (pos === 'absolute') {
            xy = nodeFrom.getXY();
            nodeTo.setStyles({
                right: 'auto',
                bottom: 'auto'
            });

            nodeFrom.setStyles({
                right: 'auto',
                bottom: 'auto'
            });
        }

        Y.each(styles, function(v, k) {
            var s = nodeFrom.getStyle(k);
            nodeTo.setStyle(k, s);
            if (v === false) {
                nodeFrom.setStyle(k, '');
            } else {
                nodeFrom.setStyle(k, v);
            }
        });

        if (pos === 'absolute') {
            nodeTo.setXY(xy);
        }

        if (h) {
            this.set('height', h);
        }

        if (w) {
            this.set('width', w);
        }
    },

    /**
     *
     * @method _uiExpandContentBox
     * @protected
     * @param {boolean} expand
     */

     // TODO: Currently only required for height, but could be easily mirrored for width if required. 
    _uiExpandContentBox : function(expand) {

        var bb = this.get(BOUNDING_BOX),
            cb = this.get(CONTENT_BOX),

            cbExpanded = Widget.getClassName("content", "expanded"),
            bbTempExpanding = Widget.getClassName("tmp", "forcesize"),

            borderBoxSupported = this._bbs,
            heightReallyMinHeight = Y.UA.ie && Y.UA.ie < 7;

        if (expand) {
            if (borderBoxSupported) {
                cb.addClass(cbExpanded);
            } else {
                if (heightReallyMinHeight) {
                    bb.addClass(bbTempExpanding);
                }

                cb.set("offsetHeight", bb.get("offsetHeight"));

                if (heightReallyMinHeight) {
                    bb.removeClass(bbTempExpanding);
                }
            }
        } else {
            if (!borderBoxSupported) {
                cb.removeClass(cbExpanded);
            } else {
                cb.setStyle("height", "");
            }
        }
    },

    /**
    * Helper method to collect the boundingBox and contentBox, set styles and append to the provided parentNode, if not
    * already a child. The owner document of the boundingBox, or the owner document of the contentBox will be used 
    * as the document into which the Widget is rendered if a parentNode is node is not provided. If both the boundingBox and
    * the contentBox are not currently in the document, and no parentNode is provided, the widget will be rendered 
    * to the current document's body.
    *
    * @method _renderBox
    * @private
    * @param {Node} parentNode The parentNode to render the widget to. If not provided, and both the boundingBox and
    * the contentBox are not currently in the document, the widget will be rendered to the current document's body.
    */
    _renderBox: function(parentNode) {

        // TODO: Performance Optimization [ More effective algo to reduce Node refs, compares, replaces? ]

        var contentBox = this.get(CONTENT_BOX),
            boundingBox = this.get(BOUNDING_BOX),
            srcNode = this.get(SRC_NODE),

            doc = (srcNode && srcNode.get(OWNER_DOCUMENT)) || boundingBox.get(OWNER_DOCUMENT) || contentBox.get(OWNER_DOCUMENT),
            body;

        // If srcNode (assume it's always in doc), have contentBox take its place (widget render responsible for re-use of srcNode contents)
        if (srcNode && !srcNode.compareTo(contentBox) && !contentBox.inDoc(doc)) {
            srcNode.replace(contentBox);
        }

        if (!boundingBox.compareTo(contentBox.get(PARENT_NODE)) && !boundingBox.compareTo(contentBox)) {
            if (this.get('moveStyles')) {
                this._moveStyles(contentBox, boundingBox);
            }

            // If contentBox box is already in the document, have boundingBox box take it's place
            if (contentBox.inDoc(doc)) {
                contentBox.replace(boundingBox);
            }
            boundingBox.appendChild(contentBox);
        }

        if (!boundingBox.inDoc(doc) && !parentNode) {
            // Special case when handling body as default (no parentNode), always try to insert.
            body = Node.one(BODY).insert(boundingBox, 0);
        } else {
            if (parentNode && !parentNode.compareTo(boundingBox.get(PARENT_NODE))) {
                parentNode.appendChild(boundingBox);
            }
        }

        this._bbs = !(Y.UA.ie && Y.UA.ie < 8 && doc.compatMode != "BackCompat");
    },

    /**
    * Setter for the boundingBox attribute
    *
    * @method _setBoundingBox
    * @private
    * @param Node/String
    * @return Node
    */
    _setBoundingBox: function(node) {
        return this._setBox(this.get(ID), node, this.BOUNDING_TEMPLATE);
    },

    /**
    * Setter for the contentBox attribute
    *
    * @method _setContentBox
    * @private
    * @param {Node|String} node
    * @return Node
    */
    _setContentBox: function(node) {
        if (this.CONTENT_TEMPLATE === null) {
            return this.get(BOUNDING_BOX);
        } else {
            return this._setBox(null, node, this.CONTENT_TEMPLATE);
        }
    },

    /**
     * Helper method to set the bounding/content box, or create it from
     * the provided template if not found.
     *
     * @method _setBox
     * @private
     *
     * @param {String} id The node's id attribute
     * @param {Node|String} node The node reference
     * @param {String} template HTML string template for the node
     * @return {Node} The node
     */
    _setBox : function(id, node, template) {
        node = Node.one(node) || Node.create(template);
        if (!node.get(ID)) {
            id = id || Y.guid();
            node.set(ID, id);
        }
        return node;
    },

    /**
     * Initializes the UI state for the Widget's bounding/content boxes.
     *
     * @method _renderUI
     * @protected
     * @param {Node} The parent node to rendering the widget into
     */
    _renderUI: function(parentNode) {
        this._renderBoxClassNames();
        this._renderBox(parentNode);
    },

    /**
      * Applies standard class names to the boundingBox and contentBox
      *
      * @method _renderBoxClassNames
      * @protected
      */
    _renderBoxClassNames : function() {
        var classes = this._getClasses(),
            boundingBox = this.get(BOUNDING_BOX),
            contentBox = this.get(CONTENT_BOX),
            name, i;

        boundingBox.addClass(Widget.getClassName());

        // Start from Widget Sub Class
        for (i = classes.length-3; i >= 0; i--) {
            name = classes[i].NAME;
            if (name) {
                boundingBox.addClass(ClassNameManager.getClassName(name.toLowerCase()));
            }
        }

        // Use instance based name for content box
        contentBox.addClass(this.getClassName(CONTENT));
    },

    /**
     * Sets up DOM and CustomEvent listeners for the widget.
     *
     * @method _bindUI
     * @protected
     */
    _bindUI: function() {
        this._bindAttrUI([VISIBLE, DISABLED, HEIGHT, WIDTH, FOCUSED]);
        this._bindDOMListeners();
    },

    /**
     * Sets up DOM listeners, on elements rendered by the widget.
     * 
     * @method _bindDOMListeners
     * @protected
     */
    _bindDOMListeners : function() {

		var oDocument = this.get(BOUNDING_BOX).get(OWNER_DOCUMENT);

        // TODO: Perf Optimization: Use Widget.getByNode delegation, to get by 
        // with just one _onFocus subscription per sandbox, instead of one per widget

		oDocument.on("focus", this._onFocus, this);

		//	Fix for Webkit:
		//	Document doesn't receive focus in Webkit when the user mouses 
		//	down on it, so the "focused" attribute won't get set to the 
		//	correct value.
		if (Y.UA.webkit) {
			oDocument.on("mousedown", this._onDocMouseDown, this);
		}

    },

    /**
     * Updates the widget UI to reflect the attribute state.
     *
     * @method _syncUI
     * @protected
     */
    _syncUI: function() {
        this._syncAttrUI([VISIBLE, DISABLED, HEIGHT, WIDTH, FOCUSED, TAB_INDEX]);
    },

    // TODO: Sugar method. Optimize Perf. Edge Case checks
    /**
     * @method _bindAttrUI
     * @protected
     * @param {Object} attrs
     */
    _bindAttrUI : function(attrs) {
        for (var i = 0, l = attrs.length; i < l; i++) {
            var attr = attrs[i];
            this.after(attr + CHANGE, this[_AFTER + attr.substring(0, 1).toUpperCase() + attr.substring(1) + CHANGE]);
        }
    },

    // TODO: Sugar method. Optimize Perf. Edge Case checks
    /**
     * @method _syncAttrUI
     * @protected
     * @param {Object} attrs
     */
    _syncAttrUI : function(attrs) {
        for (var i = 0, l = attrs.length; i < l; i++) {
            var attr = attrs[i];
            this[_UISET + attr.substring(0, 1).toUpperCase() + attr.substring(1)](this.get(attr));
        }
    },

    /**
     * Sets the height on the widget's bounding box element
     * 
     * @method _uiSetHeight
     * @protected
     * @param {String | Number} val
     */
    _uiSetHeight: function(val) {
        if (L.isNumber(val)) {
            val = val + this.DEF_UNIT;
        }
        this.get(BOUNDING_BOX).setStyle(HEIGHT, val);

        this._uiExpandContentBox((val !== "" && val !== "auto"));
    },

    /**
     * Sets the width on the widget's bounding box element
     *
     * @method _uiSetWidth
     * @protected
     * @param {String | Number} val
     */
    _uiSetWidth: function(val) {
        if (L.isNumber(val)) {
            val = val + this.DEF_UNIT;
        }
        this.get(BOUNDING_BOX).setStyle(WIDTH, val);
    },

    /**
     * Sets the visible state for the UI
     * 
     * @method _uiSetVisible
     * @protected
     * @param {boolean} val
     */
    _uiSetVisible: function(val) {

        var box = this.get(BOUNDING_BOX), 
            sClassName = this.getClassName(HIDDEN);

        if (val) { 
            box.removeClass(sClassName); 
        } else {
            box.addClass(sClassName); 
        }
    },

    /**
     * Sets the disabled state for the UI
     * 
     * @protected
     * @param {boolean} val
     */
    _uiSetDisabled: function(val) {

        var box = this.get(BOUNDING_BOX), 
            sClassName = this.getClassName(DISABLED);

        if (val) {
            box.addClass(sClassName);
        } else {
            box.removeClass(sClassName);
        }
    },

    /**
    * Set the tabIndex on the widget's rendered UI
    *
    * @method _uiSetTabIndex
    * @protected
    * @param Number
    */
    _uiSetTabIndex: function(index) {

		var boundingBox = this.get(BOUNDING_BOX);

		if (L.isNumber(index)) {
			boundingBox.set(TAB_INDEX, index);
		}
		else {
			boundingBox.removeAttribute(TAB_INDEX);
		}

    },

    /**
     * Sets the focused state for the UI
     *
     * @protected
     * @param {boolean} val
     * @param {string} src String representing the source that triggered an update to 
     * the UI.     
     */
    _uiSetFocused: function(val, src) {

        var box = this.get(BOUNDING_BOX),
            sClassName = this.getClassName(FOCUSED);

        if (val) {
            box.addClass(sClassName);
            if (src !== UI) {
                box.focus();
            }
        } else {
            box.removeClass(sClassName);
            if (src !== UI) {
                box.blur();
            }
        }
    },

    /**
     * Default visible attribute state change handler
     *
     * @method _afterVisibleChange
     * @protected
     * @param {EventFacade} evt The event facade for the attribute change
     */
    _afterVisibleChange: function(evt) {
        this._uiSetVisible(evt.newVal);
    },

    /**
     * Default disabled attribute state change handler
     * 
     * @method _afterDisabledChange
     * @protected
     * @param {EventFacade} evt The event facade for the attribute change
     */
    _afterDisabledChange: function(evt) {
        this._uiSetDisabled(evt.newVal);
    },

    /**
     * Default height attribute state change handler
     * 
     * @method _afterHeightChange
     * @protected
     * @param {EventFacade} evt The event facade for the attribute change
     */
    _afterHeightChange: function(evt) {
        this._uiSetHeight(evt.newVal);
    },

    /**
     * Default widget attribute state change handler
     * 
     * @method _afterWidthChange
     * @protected
     * @param {EventFacade} evt The event facade for the attribute change
     */
    _afterWidthChange: function(evt) {
        this._uiSetWidth(evt.newVal);
    },

    /**
     * Default focused attribute state change handler
     * 
     * @method _afterFocusedChange
     * @protected
     * @param {EventFacade} evt The event facade for the attribute change
     */
    _afterFocusedChange: function(evt) {
        this._uiSetFocused(evt.newVal, evt.src);
    },

	/**
	* @method _onDocMouseDown
	* @description "mousedown" event handler for the owner document of the 
	* widget's bounding box.
	* @protected
    * @param {EventFacade} evt The event facade for the DOM focus event
	*/
	_onDocMouseDown: function (evt) {
		if (this._hasDOMFocus) {
 			this._onFocus(evt);
		}
	},

    /**
     * DOM focus event handler, used to sync the state of the Widget with the DOM
     * 
     * @method _onFocus
     * @protected
     * @param {EventFacade} evt The event facade for the DOM focus event
     */
    _onFocus: function (evt) {

		var target = evt.target,
			boundingBox = this.get(BOUNDING_BOX),
			bFocused = (boundingBox.compareTo(target) || boundingBox.contains(target));

		this._hasDOMFocus = bFocused;
        this._set(FOCUSED, bFocused, { src: UI });

    },

    /**
     * Generic toString implementation for all widgets.
     *
     * @method toString
     * @return {String} The default string value for the widget [ displays the NAME of the instance, and the unique id ]
     */
    toString: function() {
        return this.constructor.NAME + "[" + this.get(ID) + "]";
    },

    /**
     * Default unit to use for dimension values
     * 
     * @property DEF_UNIT
     */
    DEF_UNIT : "px",

    /**
     * Property defining the markup template for content box. If your Widget doesn't
     * need the dual boundingBox/contentBox structure, set CONTENT_TEMPLATE to null,
     * and contentBox and boundingBox will both point to the same Node. 
     *
     * @property CONTENT_TEMPLATE
     * @type String
     */
    CONTENT_TEMPLATE : "<div></div>",

    /**
     * Property defining the markup template for bounding box.
     *
     * @property BOUNDING_TEMPLATE
     * @type String
     */
    BOUNDING_TEMPLATE : "<div></div>",

    /**
     * Static property listing the styles that are mimiced on the bounding box from the content box.
     *
     * @property WRAP_STYLES
     * @type Object
     */
    WRAP_STYLES : {
        height: '100%',
        width: '100%',
        zIndex: false,
        position: 'static',
        top: '0',
        left: '0',
        bottom: '',
        right: '',
        padding: '',
        margin: ''
    },

    /**
     * Sets strings for a particular locale, merging with any existing
     * strings which may already be defined for the locale.
     *
     * @method _setStrings
     * @protected
     * @param {Object} strings The hash of string key/values to set
     * @param {Object} locale The locale for the string values being set
     */
    _setStrings : function(strings, locale) {
        var strs = this._strings;
        locale = locale.toLowerCase();

        if (!strs[locale]) {
            strs[locale] = {};
        }

        Y.aggregate(strs[locale], strings, true);
        return strs[locale];
    },

    /**
     * Returns the strings key/value hash for a paricular locale, without locale lookup applied.
     *
     * @method _getStrings
     * @protected
     * @param {Object} locale
     */
    _getStrings : function(locale) {
        return this._strings[locale.toLowerCase()];
    },

    /**
     * Gets the entire strings hash for a particular locale, performing locale lookup.
     * <p>
     * If no values of the key are defined for a particular locale the value for the 
     * default locale (in initial locale set for the class) is returned.
     * </p>
     * @method getStrings
     * @param {String} locale (optional) The locale for which the string value is required. Defaults to the current locale, if not provided.
     */
    // TODO: Optimize/Cache. Clear cache on _setStrings call.
    getStrings : function(locale) {

        locale = (locale || this.get(LOCALE)).toLowerCase();


        var defLocale = this.getDefaultLocale().toLowerCase(),
            defStrs = this._getStrings(defLocale),
            strs = (defStrs) ? Y.merge(defStrs) : {},
            localeSegments = locale.split(HYPHEN);

        // If locale is different than the default, or needs lookup support
        if (locale !== defLocale || localeSegments.length > 1) {
            var lookup = "";
            for (var i = 0, l = localeSegments.length; i < l; ++i) {
                lookup += localeSegments[i];


                var localeStrs = this._getStrings(lookup);
                if (localeStrs) {
                    Y.aggregate(strs, localeStrs, true);
                }
                lookup += HYPHEN;
            }
        }

        return strs;
    },

    /**
     * Gets the string for a particular key, for a particular locale, performing locale lookup.
     * <p>
     * If no values if defined for the key, for the given locale, the value for the 
     * default locale (in initial locale set for the class) is returned.
     * </p>
     * @method getString
     * @param {String} key The key.
     * @param {String} locale (optional) The locale for which the string value is required. Defaults to the current locale, if not provided.
     */
    getString : function(key, locale) {

        locale = (locale || this.get(LOCALE)).toLowerCase();


        var defLocale = (this.getDefaultLocale()).toLowerCase(),
            strs = this._getStrings(defLocale) || {},
            str = strs[key],
            idx = locale.lastIndexOf(HYPHEN);

        // If locale is different than the default, or needs lookup support
        if (locale !== defLocale || idx != -1) {
            do {

                strs = this._getStrings(locale);
                if (strs && key in strs) {
                    str = strs[key];
                    break;
                }
                idx = locale.lastIndexOf(HYPHEN);
                // Chop of last locale segment
                if (idx != -1) {
                    locale = locale.substring(0, idx);
                }

            } while (idx != -1);
        }

        return str;
    },

    /**
     * Returns the default locale for the widget (the locale value defined by the
     * widget class, or provided by the user during construction).
     *
     * @method getDefaultLocale
     * @return {String} The default locale for the widget
     */
    getDefaultLocale : function() {
        return this._conf.get(LOCALE, INIT_VALUE);
    },

    /**
     * Private stings hash, used to store strings in locale specific buckets.
     *
     * @property _strings
     * @private
     * @type Object
     */
    _strings: null,

    /**
     * Gets the HTML_PARSER definition for this instance, by merging HTML_PARSER
     * definitions across the class hierarchy.
     *
     * @private
     * @method _getHtmlParser
     * @return {Object} HTML_PARSER definition for this instance
     */
    _getHtmlParser : function() {
        if (!this._HTML_PARSER) {
            var classes = this._getClasses(),
                parser = {},
                i, p;

            for (i = classes.length - 1; i >= 0; i--) {
                p = classes[i].HTML_PARSER;
                if (p) {
                    Y.mix(parser, p, true);
                }
            }

            this._HTML_PARSER = parser;
        }

        return this._HTML_PARSER;
    },

    /**
     * @method _guid
     * @protected
     */
    _guid : function() {
        return Y.guid();
    },

    /**
     * @method _validTabIndex
     * @protected
     * @param {Number} tabIndex
     */
    _validTabIndex : function (tabIndex) {
        return (L.isNumber(tabIndex) || L.isNull(tabIndex));
    }
});

Y.Widget = Widget;


}, '@VERSION@' ,{requires:['attribute', 'event-focus', 'base', 'node', 'classnamemanager']});
