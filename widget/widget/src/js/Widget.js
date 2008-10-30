/**
 * Base class for Widget
 * @module widget
 */

// Local Constants
var WIDGET = "widget",
    CONTENT = "content",
    VISIBLE = "visible",
    HIDDEN = "hidden",
    ENABLED = "enabled",
    DISABLED = "disabled",
    FOCUS = "focus",
    BLUR = "blur",
    HAS_FOCUS = "hasFocus",
    WIDTH = "width",
    HEIGHT = "height",
    EMPTY = "",
    HYPHEN = "-",
    BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    PARENT_NODE = "parentNode",
    TAB_INDEX = "tabIndex",
    LOCALE = "locale",
    INIT_VALUE = "initValue",
    ID = "id",
    RENDER = "render",
    RENDERED = "rendered",
    DESTROYED = "destroyed",

    O = Y.Object,
    Node = Y.Node;

// Widget nodeid-to-instance map for now, 1-to-1.
var _instances = {};

/**
 * A base class for widgets, providing:
 * <ul>
 *    <li>The render lifecycle method, in addition to the init and destroy 
 *        lifecycle methods provide by Base</li>
 *    <li>Abstract methods to support consistent MVC structure across 
 *        widgets: renderer, initUI, syncUI</li>
 *    <li>Support for common widget attributes, such as id, node, visible, 
 *        disabled, strings</li>
 *    <li>Plugin registration and activation support</li>
 * </ul>
 *
 * @param config {Object} Object literal specifying widget configuration 
 * properties (may container both attribute and non attribute configuration).
 * 
 * @class Widget
 * @extends Base
 */
function Widget(config) {
    Y.log('constructor called', 'life', 'widget');

    this._yuid = Y.guid(WIDGET);
    this._strings = {};

    Widget.superclass.constructor.apply(this, arguments);
}

/**
 * Static property provides a string to identify the class.
 * Currently used to apply class identifiers to the bounding box 
 * and to classify events fired by the widget.
 *
 * @property Widget.NAME
 * @type String
 * @static
 */
Widget.NAME = WIDGET;

Widget.UI_SRC = "ui";

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
     * Flag indicating whether or not this object
     * has been through the render lifecycle phase.
     *
     * @attribute rendered
     * @readOnly
     * @default false
     * @type boolean
     */
    rendered: {
        value:false,
        readOnly:true
    },

    /**
    * @attribute boundingBox
    * @description The outermost DOM node for the Widget, used for sizing and positioning 
    * of a Widget as well as a containing element for any decorator elements used 
    * for skinning.
    * @type Node
    */
    boundingBox: {
        value:null,
        set: function(node) {
            return this._setBoundingBox(node);
        },
        writeOnce: true
    },

    /**
    * @attribute contentBox
    * @description A DOM node that is a direct descendent of a Widget's bounding box that 
    * houses its content.
    * @type Node
    */
    contentBox: {
        value:null,
        set: function(node) {
            return this._setContentBox(node);
        },
        writeOnce: true
    },

    /**
    * @attribute tabIndex
    * @description The tabIndex that should be given to the bounding box
    * @type Number
    */
    tabIndex: {
        value: 0
    },

    /**
    * @attribute hasFocus
    * @description Boolean indicating if the Widget has focus.
    * @default false
    * @type boolean
    */
    hasFocus: {
        value: false
    },

    /**
    * @attribute disabled
    * @description Boolean indicating if the Widget should be disabled.  
    * (Disabled widgets will not respond to user input or fire events.)
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
    * @description String or number representing the height of the Widget.
    * @default ""
    * @type {String | Number}
    */
    height: {
        value: EMPTY
    },

    /**
    * @attribute width
    * @description String or number representing the width of the Widget.
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
     * 
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
        set: function(val) {
            return this._setStrings(val, this.get(LOCALE));
        },

        get: function() {
            return this.getStrings(this.get(LOCALE));
        }
    }
};

/**
 * @private
 * @static
 * @property _CLASSNAME
 * 
 * Used to mark the bounding box of any widget, regardless of 
 * instance specific variations (e.g. instance based classNamePrefix settings)
 *
 */
Widget._CLASSNAME = Y.config.classNamePrefix + Widget.NAME;

/**
 * Returns the widget instance whose bounding box contains, or is, the given node. 
 *
 * In the case of nested widgets, the nearest bounding box ancestor is used to
 * return the widget instance.
 *
 * @method Widget.getByNode
 * @static
 * @param node {Node | String} The node for which a Widget instance is required.
 * @return {Widget} Widget instance, or null if not found.
 */
Widget.getByNode = function(node) {
    var widget,
        bbMarker = Widget._CLASSNAME;
        
    node = Node.get(node);
    if (node) {
        node = (node.hasClass(bbMarker)) ? node : node.ancestor("." + bbMarker);
        if (node) {
            widget = _instances[node.get(ID)];
        }
    }

    return widget || null;
};

var UI = Widget.UI_SRC;

Y.extend(Widget, Y.Base, {

    /**
     * Initializer lifecycle implementation for the Widget class.
     *
     * Base.init will invoke all prototype.initializer methods, for the
     * class hierarchy (starting from Base), after all attributes have 
     * been configured.
     *
     * @param  config {Object} Configuration object literal for the widget
     */
    initializer: function(config) {
        Y.log('initializer called', 'life', 'widget');

        this._className = this.get("classNamePrefix") + this.constructor.NAME.toLowerCase();

        var nodeId = this.get(BOUNDING_BOX).get(ID);
        if (nodeId) {
            _instances[nodeId] = this;
        }

        var htmlConfig = this._parseHTML(this.get(CONTENT_BOX));
        if (htmlConfig) {
            Y.aggregate(config, htmlConfig, false);
        }

        Y.PluginHost.call(this, config);
    },

    /**
     * Descructor lifecycle implementation for the Widget class.
     *
     * Base.destroy will invoke all prototype.destructor methods, for the
     * class hierarchy (starting from the lowest sub-class).
     *
     */
    destructor: function() {
        Y.log('destructor called', 'life', 'widget');

        var boundingBox = this.get(BOUNDING_BOX);
        
        Y.Event.purgeElement(boundingBox, true);

        var nodeId = boundingBox.get(ID);
        if (nodeId && nodeId in _instances) {
            delete _instances[nodeId];
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
     * @public
     * @chainable
     * @final 
     * @param  parentNode {Object | String} Object representing a Node instance or a string 
     * representing a CSS selector used to retrieve a Node reference.
     */
    render: function(parentNode) {

        if (this.get(DESTROYED)) {
            Y.log("Render failed; widget has been destroyed", "error", "widget");
            return;
        }

        if (!this.get(RENDERED)) {
            this.publish(RENDER, { queuable:false, defaultFn: this._defRenderFn});
            this.fire(RENDER, null, parentNode);
        }

        return this;
    },

    /**
     * Default render handler
     *
     * @method _defRenderFn
     * @protected
     * @param {Event.Facade} e The Event object
     * @param {Node} parentNode The parent node to render to, if passed in
     */
    _defRenderFn : function(e, parentNode) {

            this._renderUI(parentNode);
            this._syncUI();
            this._bindUI();

            this.renderer();

            this._set(RENDERED, true);
    },

    /** 
     * Creates DOM (or manipulates DOM for progressive enhancement)
     * This method is invoked by render() and is not chained 
     * automatically for the class hierarchy (like initializer, destructor) 
     * so it should be chained manually for subclasses if required.
     * 
     * @method renderer
     */
    renderer: function() {
        this.renderUI();
        this.syncUI();
        this.bindUI();
    },

    /**
     * Configures/Sets up listeners to bind Widget State to UI/DOM
     * 
     * This method is not called by framework and is not chained 
     * automatically for the class hierarchy.
     * 
     * @method bindUI
     */
    bindUI: function() {},

    /**
     * Adds nodes to the DOM 
     * 
     * This method is not called by framework and is not chained 
     * automatically for the class hierarchy.
     * 
     * @method renderUI
     */
    renderUI: function() {},

    /**
     * Refreshes the rendered UI, based on Widget State
     * 
     * This method is not called by framework and is not chained
     * automatically for the class hierarchy.
     *
     * @method syncUI
     */
    syncUI: function(){},

    /**
    * @method hide
    * @description Shows the Module element by setting the "visible" attribute to "false".
    */
    hide: function() {
        return this.set(VISIBLE, false);
    },

    /**
    * @method show
    * @description Shows the Module element by setting the "visible" attribute to "true".
    */
    show: function() {
        return this.set(VISIBLE, true);
    },

    /**
    * @method focus
    * @description Causes the Widget to receive the focus by setting the "hasFocus" 
    * attribute to "true".
    */
    focus: function () {
        return this.set(HAS_FOCUS, true);
    },

    /**
    * @method blur
    * @description Causes the Widget to lose focus by setting the "hasFocus" attribute 
    * to "false"
    */            
    blur: function () {
        return this.set(HAS_FOCUS, false);
    },

    /**
    * @method enable
    * @description Set the Widget's "disabled" attribute to "false".
    */
    enable: function() {
        return this.set(ENABLED, true);
    },

    /**
    * @method disabled
    * @description Set the Widget's "disabled" attribute to "true".
    */
    disable: function() {
        return this.set(DISABLED, false);
    },

    /**
     * @method _parseHTML
     * @private 
     * @param  node {Node} Root node to use to parse markup for configuration data
     * @return config {Object} configuration object
     */
    _parseHTML : function(node) {
 
        var schema = this.HTML_PARSER,
            data,
            val;

        if (schema && node && node.hasChildNodes()) {

            O.each(schema, function(v, k, o) {
                val = null;

                if (L.isFunction(v)) {
                    val = v.call(this, node);
                } else {
                    if (L.isArray(v)) {
                        var found = node.queryAll(v[0]);
                        if (found.size() > 0) {
                            val = found;
                        }
                    } else {
                        val = node.query(v);
                    }
                }

                if (val !== null && val !== undefined) {
                    data = data || {};
                    data[k] = val;
                }
            });
        }

        return data;
    },
    
    /**
    * @private
    * @method _moveStyles
    * @description Moves a pre-defined set of style rules (WRAP_STYLES) from one node to another.
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
    * @private
    * @method _renderBox
    * @description Helper method to collect the boundingBox and contentBox, set styles and append to parentNode
    * @param {Node} parentNode The parentNode to render the widget to.
    */
    _renderBox: function(parentNode) {

        var contentBox = this.get(CONTENT_BOX),
            boundingBox = this.get(BOUNDING_BOX),
            body = Node.get("body");

        // append to parent if provided, or to body if no parent and not in body
        var appendTo = (parentNode) ? Node.get(parentNode) : body;

        if (appendTo && !appendTo.contains(boundingBox)) {
            if (appendTo === body && !parentNode && appendTo.get("firstChild")) {
                // Special case when handling body as default (no parentNode), always insert.
                appendTo.insertBefore(boundingBox, appendTo.get("firstChild"));
            } else {
                appendTo.appendChild(boundingBox);
            }
        }

        if (!boundingBox.contains(contentBox)) {

            if (this.get('moveStyles')) {
                this._moveStyles(contentBox, boundingBox);
            }

            // If contentBox box is already in the document, have boundingBox box take it's place
            // TODO: Replace body test with PARENT_NODE test, when supported
            if (body.contains(contentBox)) {
                contentBox.get(PARENT_NODE).replaceChild(boundingBox, contentBox);
            }

            boundingBox.appendChild(contentBox);
        }
    },

    /**
    * @private
    * @method _setBoundingBox
    * Setter for the boundingBox attribute
    * @param Node/String
    * @return Node
    */
    _setBoundingBox: function(node) {
        return this._setBox(node, this.BOUNDING_TEMPLATE);
    },

    /**
    * @private
    * @method _setContentBox
    * Setter for the contentBox attribute
    * @param {Node|String} node
    * @return Node
    */
    _setContentBox: function(node) {
        return this._setBox(node, this.CONTENT_TEMPLATE);
    },

    /**
     * @private
     * @method _setBox
     * @param node
     * @param template
     */
    _setBox : function(node, template) {
        node = Node.get(node);
        if (!node) {
            node = Node.create(template);
        }

        var sid = Y.stamp(node);
        if (!node.get(ID)) {
            node.set(ID, sid);
        }
        return node;
    },

    /**
     * Initializes the UI state for the bounding box. Applies marker
     * classes to identify the widget.
     * 
     * @method __renderUI
     * @protected
     */
    _renderUI: function(parentNode) {

        // TODO: Classname chaining?
        this.get(BOUNDING_BOX).addClass(Widget._CLASSNAME);
        this.get(BOUNDING_BOX).addClass(this._className);
        this.get(CONTENT_BOX).addClass(this._className + HYPHEN + CONTENT);

        this._renderBox(parentNode);
    },

    /**
     * Sets up listeners to synchronize UI state to attribute
     * state.
     *
     * @method _bindUI
     * @protected
     */
    _bindUI: function() {
        this.after('visibleChange', this._onVisibleChange);
        this.after('disabledChange', this._onDisabledChange);
        this.after('heightChange', this._onHeightChange);
        this.after('widthChange', this._onWidthChange);
        this.after('hasFocusChange', this._onHasFocusChange);

        this._bindDOMListeners();
    },

    /**
     * @method _bindDOMListeners
     * @protected
     */
    _bindDOMListeners : function() {
        this.get(BOUNDING_BOX).on(FOCUS, Y.bind(this._onFocus, this));
        this.get(BOUNDING_BOX).on(BLUR, Y.bind(this._onBlur, this));
    },

    /**
     * Updates the widget UI to reflect the attribute state.
     *
     * @method _syncUI
     * @protected
     */
    _syncUI: function() {
        this._uiSetVisible(this.get(VISIBLE));
        this._uiSetDisabled(this.get(DISABLED));
        this._uiSetHeight(this.get(HEIGHT));
        this._uiSetWidth(this.get(WIDTH));
        this._uiSetHasFocus(this.get(HAS_FOCUS));
        this._uiSetTabIndex(this.get(TAB_INDEX));
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

        if (val === true) { 
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

        if (val === true) {
            box.addClass(sClassName);
        } else {
            box.removeClass(sClassName);
        }
    },

    /**
     * Sets the hasFocus state for the UI
     * 
     * @protected
     * @param {boolean} val
     * @param {string} src String representing the source that triggered an update to 
     * the UI.     
     */
    _uiSetHasFocus: function(val, src) {
    
        var box = this.get(BOUNDING_BOX),
            sClassName = this.getClassName(FOCUS);

        if (val === true) {
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
    * Tabindex UI application
    *
    * @method _uiSetTabIndex
    * @protected
    * @param Number
    */
    _uiSetTabIndex: function(index) {
        this.get(BOUNDING_BOX).set(TAB_INDEX, index);
    },

    /**
     * Visible attribute UI handler
     * 
     * @method _onVisibleChange
     * @protected
     * @param {Object} evt Event object literal passed by AttributeProvider
     */
    _onVisibleChange: function(evt) {
        this._uiSetVisible(evt.newVal);
    },

    /**
     * Disabled attribute UI handler
     * 
     * @method _onDisabledChange
     * @protected
     * @param {Object} evt Event object literal passed by AttributeProvider
     */
    _onDisabledChange: function(evt) {
        this._uiSetDisabled(evt.newVal);
    },

    /**
     * Height attribute UI handler
     * 
     * @method _onHeightChange
     * @protected
     * @param {Object} evt Event object literal passed by AttributeProvider
     */
    _onHeightChange: function(evt) {
        this._uiSetHeight(evt.newVal);
    },

    /**
     * Width attribute UI handler
     * 
     * @method _onWidthChange
     * @protected
     * @param {Object} evt Event object literal passed by AttributeProvider
     */
    _onWidthChange: function(evt) {
        this._uiSetWidth(evt.newVal);
    },

    /**
     * hasFocus attribute UI handler
     * 
     * @method _onHasFocusChange
     * @protected
     * @param {Object} evt Event object literal passed by AttributeProvider
     */
    _onHasFocusChange: function(evt) {
        this._uiSetHasFocus(evt.newVal, evt.src);
    },

    /**
     * focus event UI handler used to sync the state of the Widget with the DOM
     * 
     * @method _onFocus
     * @protected
     */
    _onFocus: function () {
        this.set(HAS_FOCUS, true, { src: UI });
    },

    /**
     * blur event UI handler used to sync the state of the Widget with the DOM
     * 
     * @method _onBlur
     * @protected
     */			
    _onBlur: function () {
        this.set(HAS_FOCUS, false, { src: UI });
    },

    /**
     * Generic toString implementation for all widgets.
     * @method toString
     */
    toString: function() {
        return this.constructor.NAME + "[" + this._yuid + "]";
    },

    /**
     * @property DEF_UNIT
     * Default unit to use for style values
     */
    DEF_UNIT : "px",

    /**
     * Static property defining the markup template for content box.
     *
     * @property CONTENT_TEMPLATE
     * @type String
     */
    CONTENT_TEMPLATE : "<div></div>",

    /**
     * Static property defining the markup template for bounding box.
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
     * @property HTML_PARSER
     * @type Object
     *
     * Object hash, defining how attribute values are to be parsed from
     * markup contained in the widget's content box. e.g.:
     * <pre>
     *   {
     *       titleNode: "span.yui-title"             // Set Node references using selector syntax 
     *       listNodes: ["li.yui-listitem"]          // Set NodeList references using selector syntax 
     *
     *       label: function(contentBox) {    // Set other attribute types, using a parse function. Context is set to the widget instance
     *           return contentBox.query("span.title").get("innerHTML");
     *       }
     *   }
     * </pre>
     */
    HTML_PARSER : null,

    /**
     * Sets strings for a particular locale, merging with any existing
     * strings which may already be defined for the locale.
     *
     * @method _setStrings
     * @protected
     * @param {Object} strings
     * @param {Object} locale
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
     * Returns strings for a paricular locale, without locale lookup applied.
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

        Y.log("getStrings: For " + locale, "info", "widget"); 

        var defLocale = this.getDefaultLocale().toLowerCase(),
            defStrs = this._getStrings(defLocale),
            strs = (defStrs) ? Y.merge(defStrs) : {},
            localeSegments = locale.split(HYPHEN);

        // If locale is different than the default, or needs lookup support
        if (locale !== defLocale || localeSegments.length > 1) {
            var lookup = "";
            for (var i = 0, l = localeSegments.length; i < l; ++i) {
                lookup += localeSegments[i];

                Y.log("getStrings: Merging in strings from: " + lookup, "info", "widget"); 

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

        Y.log("getString: For " + locale, "info", "widget"); 

        var defLocale = (this.getDefaultLocale()).toLowerCase(),
            strs = this._getStrings(defLocale) || {},
            str = strs[key],
            idx = locale.lastIndexOf(HYPHEN);

        // If locale is different than the default, or needs lookup support
        if (locale !== defLocale || idx != -1) {
            do {
                Y.log("getString: Performing lookup for: " + locale, "info", "widget"); 

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
     */
    getDefaultLocale : function() {
        return this._conf.get(LOCALE, INIT_VALUE);
    },

    /**
     * Private stings hash, used to store strings in locale specific buckets.
     *
     * @property _strings
     * @private
     */
    _strings: null
});

/**
 * Static registration of default plugins for the class.
 * 
 * @property Widget.PLUGINS
 * @static
 */
Widget.PLUGINS = [];

Y.mix(Widget, Y.PluginHost, false, null, 1); // straightup augment, no wrapper functions

Y.augment(Widget, Y.ClassNameManager);
Y.aggregate(Widget, Y.ClassNameManager);

Y.Widget = Widget;