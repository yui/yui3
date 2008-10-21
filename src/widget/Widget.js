/**
 * Base class for Widget
 * @module widget
 */

// String constants
var _WIDGET = "widget",
    _CONTENT = "content",
    _VISIBLE = "visible",
    _HIDDEN = "hidden",
    _ENABLED = "enabled",
    _DISABLED = "disabled",
    _FOCUS = "focus",
    _BLUR = "blur",
    _HAS_FOCUS = "hasFocus",
    _WIDTH = "width",
    _HEIGHT = "height",
    _UI = "ui",
    _EMPTY = "",
    _HYPHEN = "-",
    _BOUNDING_BOX = "boundingBox",
    _CONTENT_BOX = "contentBox",
    _PARENT_NODE = "parentNode",
    _TAB_INDEX = "tabIndex",
    _LOCALE = "locale",
    _INIT_VALUE = "initValue",
    _ID = "id",

    _RENDER = "render",
    _RENDERED = "rendered",
    _DESTROYED = "destroyed",

    O = Y.Object;

// Widget nodeid-to-instance map for now, 1-to-1.
// Expand to nodeid-to-arrayofinstances if required.
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

    this.id = Y.guid(_WIDGET);
    this._strings = {};

    Widget.superclass.constructor.apply(this, arguments);
}

/**
 * Static property provides a string to identify the class.
 * Currently used to apply class identifiers to the bounding box 
 * and to classify events fired by the widget.
 *
 * @property Widget.NAME
 * @type {String}
 * @static
 */
Widget.NAME = _WIDGET;

/**
 * Static property used to define the default attribute 
 * configuration for the Widget.
 * 
 * @property Widget.ATTRS
 * @type {Object}
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
    * @type Boolean
    */
    hasFocus: {
        value: false
    },

    /**
    * @attribute disabled
    * @description Boolean indicating if the Widget should be disabled.  
    * (Disabled widgets will not respond to user input or fire events.)
    * @default false
    * @type Boolean
    */
    disabled: {
        value: false
    },

    /**
    * @attribute visible
    * @description Boolean indicating weather or not the Widget is visible.
    * @default true
    * @type Boolean
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
        // Default to not set on element style
        value: _EMPTY
    },

    /**
    * @attribute width
    * @description String or number representing the width of the Widget.
    * @default ""
    * @type {String | Number}
    */
    width: {
        // Default to not set on element style
        value: _EMPTY
    },

    /**
     * @attribute moveStyles
     * @description Flag defining whether or not style properties from the content box
     * should be moved to the bounding box when wrapped (as defined by the WRAP_STYLES property)
     * @default false
     * @type {boolean}
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
     * @type {String}
     */
    locale : {
        value: "en"
    },

    /**
     * @attribute strings
     * @description Collection of strings used to label elements of the Widget's UI.
     * @default null
     * @type {Object}
     */
    strings: {
        set: function(val) {
            return this._setStrings(val, this.get(_LOCALE));
        },

        get: function() {
            return this._getStrings(this.get(_LOCALE));
        }
    }
};

/**
 * Obtain Widget instances by bounding box id.
 *
 * @method Widget.getByNodeId
 * @param id {String} Id used to identify the widget uniquely.
 * @return {Widget} Widget instance
 */
Widget.getByNodeId = function(id) {
    return _instances[id];
};

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

        if (this.id) {
            _instances[this.id] = this;
        }

        this._className = this.get("classNamePrefix") + this.constructor.NAME.toLowerCase();

        var htmlConfig = this._parseHTML(this.get(_CONTENT_BOX));
        if (htmlConfig) {
            Y.mix(config, htmlConfig, false, null, 0, true);
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

        if (this.id) {
            delete _instances[this.id];
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
     * @chain
     * @final 
     * @param  parentNode {Object | String} Object representing a Node instance or a string 
     * representing a CSS selector used to retrieve a Node reference.
     */
    render: function(parentNode) {

        if (this.get(_DESTROYED)) {
            Y.log("Render failed; widget has been destroyed", "error", "widget");
            return;
        }

        if (!this.get(_RENDERED)) {
            this.publish(_RENDER, { queuable:false, defaultFn: this._defRenderFn});
            this.fire(_RENDER, null, parentNode);
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
            this._uiInitBox(parentNode);

            this._bindUI();
            this._syncUI();

            if (this.renderer) {
                this.renderer();
            }

            this._set(_RENDERED, true);
    },

    /** 
     * Creates DOM (or manipulates DOM for progressive enhancement)
     * This method is invoked by render() and is not chained 
     * automatically for the class hierarchy (like initializer, destructor) 
     * so it should be chained manually for subclasses if required.
     * 
     * @method renerer
     */
    renderer: function() {},

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
        return this.set(_VISIBLE, false);
    },

    /**
    * @method show
    * @description Shows the Module element by setting the "visible" attribute to "true".
    */
    show: function() {
        return this.set(_VISIBLE, true);
    },

    /**
    * @method focus
    * @description Causes the Widget to receive the focus by setting the "hasFocus" 
    * attribute to "true".
    */
    focus: function () {
        return this.set(_HAS_FOCUS, true);
    },

    /**
    * @method blur
    * @description Causes the Widget to lose focus by setting the "hasFocus" attribute 
    * to "false"
    */            
    blur: function () {
        return this.set(_HAS_FOCUS, false);
    },

    /**
    * @method enable
    * @description Set the Widget's "disabled" attribute to "false".
    */
    enable: function() {
        return this.set(_ENABLED, true);
    },

    /**
    * @method disabled
    * @description Set the Widget's "disabled" attribute to "true".
    */
    disable: function() {
        return this.set(_DISABLED, false);
    },

    /**
     * Returns an attribute of the Node instance specified as the Widget's bounding box.
     * 
     * @method getNodeAttr
     */
    getNodeAttr: function(attr) {
        if (this.get(_BOUNDING_BOX)) {
            return this.get(_BOUNDING_BOX).att(attr);
        }
        return undefined;
    },

    /**
     * Sets an attribute for the Node instance specified as the Widget's bounding box.
     * 
     * @method getNodeAttr
     * @chain             
     */
    setNodeAttr: function(attr, val) {
        if (this.get(_BOUNDING_BOX)) {
            this.get(_BOUNDING_BOX).att(attr, val);
        }
        return this;
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
            contentBox = this.get(_CONTENT_BOX),
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

        var contentBox = this.get(_CONTENT_BOX),
            boundingBox = this.get(_BOUNDING_BOX),
            body = Y.Node.get("body");

        // append to parent if provided, or to body if no parent and not in body
        parentNode = (parentNode) ? Y.Node.get(parentNode) : body;
        if (parentNode && !parentNode.contains(boundingBox)) {
            parentNode.appendChild(boundingBox);
        }

        if (!boundingBox.contains(contentBox)) {

            if (this.get('moveStyles')) {
                this._moveStyles(contentBox, boundingBox);
            }

            // If contentBox box is already in the document, have boundingBox box take it's place
            // TODO: Replace body test with _PARENT_NODE test, when supported
            if (body.contains(contentBox) /*contentBox.get(_PARENT_NODE)*/) {
                contentBox.get(_PARENT_NODE).replaceChild(boundingBox, contentBox);
            }

            boundingBox.appendChild(contentBox);
        }
    },

    /**
    * @private
    * @method _setBoundingBox
    * @description Setter for boundingBox config
    * @param Node/String
    * @return Node
    */
    _setBoundingBox: function(node) {
        return this._setBox(node, this.BOUNDING_TEMPLATE);
    },
    /**
    * @private
    * @method _setContentBox
    * @description Setter for contentBox config
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
        node = Y.Node.get(node);
        if (!node) {
            node = Y.Node.create(template);
        }

        var sid = Y.stamp(node);
        if (!node.get(_ID)) {
            node.set(_ID, sid);
        }
        return node;
    },

    /**
    * @private
    * @method _uiSetTabIndex
    * @description Setter for tabIndex config
    * @param Number
    */
    _uiSetTabIndex: function(index) {
        this.get(_BOUNDING_BOX).set(_TAB_INDEX, index);
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
        this.get(_BOUNDING_BOX).on(_FOCUS, Y.bind(this._onFocus, this));
        this.get(_BOUNDING_BOX).on(_BLUR, Y.bind(this._onBlur, this));
    },

    /**
     * Updates the widget UI to reflect the attribute state.
     *
     * @method _syncUI
     * @protected
     */
    _syncUI: function() {
        this._uiSetVisible(this.get(_VISIBLE));
        this._uiSetDisabled(this.get(_DISABLED));
        this._uiSetHeight(this.get(_HEIGHT));
        this._uiSetWidth(this.get(_WIDTH));
        this._uiSetHasFocus(this.get(_HAS_FOCUS));
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
        this.get(_BOUNDING_BOX).setStyle(_HEIGHT, val);
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
        this.get(_BOUNDING_BOX).setStyle(_WIDTH, val);
    },

    /**
     * Sets the visible state for the UI
     * 
     * @method _uiSetVisible
     * @protected
     * @param {boolean} val
     */
    _uiSetVisible: function(val) {

        var box = this.get(_BOUNDING_BOX), 
            sClassName = this.getClassName(_HIDDEN);

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

        var box = this.get(_BOUNDING_BOX), 
            sClassName = this.getClassName(_DISABLED);

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
        
        var box = this.get(_BOUNDING_BOX),
            sClassName = this.getClassName(_FOCUS);

        if (val === true) {
            box.addClass(sClassName);
            if (src !== _UI) {
                box.focus();
            }
        } else {
            box.removeClass(sClassName);
            if (src !== _UI) {
                box.blur();
            }
        }
    },

    /**
     * Initializes the UI state for the bounding box. Applies marker
     * classes to identify the widget.
     * 
     * @method _uiInitBox
     * @protected
     */
    _uiInitBox: function(parentNode) {

        this.get(_BOUNDING_BOX).addClass(this._className);
        this.get(_CONTENT_BOX).addClass(this._className + _HYPHEN + _CONTENT);

        this._renderBox(parentNode);

        this._uiSetTabIndex(this.get(_TAB_INDEX));
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
        this.set(_HAS_FOCUS, true, { src: _UI });
    },

    /**
     * blur event UI handler used to sync the state of the Widget with the DOM
     * 
     * @method _onBlur
     * @protected
     */			
    _onBlur: function () {
        this.set(_HAS_FOCUS, false, { src: _UI });
    },

    /**
     * Generic toString implementation for all widgets.
     * @method toString
     */
    toString: function() {
        return this.constructor.NAME + "[" + this.id + "]";
    },

    /**
     * Default unit to use for style values
     */
    DEF_UNIT : "px",

    /**
     * Static property outlining the markup template for content box.
     *
     * @property Widget.CONTENT_TEMPLATE
     * @type {String}
     * @static
     */
    CONTENT_TEMPLATE : "<div></div>",

    /**
     * Static property outlining the markup template for bounding box.
     *
     * @property Widget.BOUNDING_TEMPLATE
     * @type {String}
     * @static
     */
    BOUNDING_TEMPLATE : "<div></div>",

    /**
     * Static property listing the styles that are mimiced on the bounding box from the content box.
     *
     * @property Widget.WRAP_STYLES
     * @type {Object}
     * @static
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
     * @type {Object}
     * @static
     *
     * Object hash, defining how attribute values are to be parsed from
     * markup contained in the widget's content box. e.g.:
     * <pre>
     *   {
     *       labelEl: "span.title"             // Set Node references using selector syntax 
     *       labelEls: ["span.title"]          // Set NodeList references using selector syntax 
     *       
     *       label: function(contentBox) {    // Set other attribute types, using a parse function. Context is set to the widget instance
     *           return contentBox.query("span.title")[0].get("innerHTML");
     *       }
     *   }
     * </pre>
     */
    HTML_PARSER : null,

    /**
     * Sets strings for a particular locale, merging with any existing
     * strings which may already be defined for the locale.
     *
     * @method setStrings
     * @protected
     * @param {Object} strings
     * @param {Object} locale
     */
    _setStrings : function(strings, locale) {
        var strs = this._strings;
        if (!strs[locale]) {
            strs[locale] = {};
        }
        Y.mix(strs[locale], strings, true, null, 0);
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
        return this._strings[locale];
    },

    /**
     * Gets the entire strings hash for a particular locale, performing locale lookups.
     * <p>
     * If no values of the key are defined for a particular locale the value for the 
     * default locale (in initial locale set for the class) is returned.
     * </p>
     * @method getStrings
     * @param {String} locale
     */
    // TODO: Optimize/Cache. Clear cache on _setStrings call
    getStrings : function(locale) {

        locale = locale || this.get(_LOCALE);

        Y.log("getStrings: For " + locale, "info", "widget"); 

        var defLocale = this.getDefaultLocale(),
            defStrs = this._getStrings(defLocale),
            strs = (defStrs) ? Y.merge(defStrs) : {},
            localeSegments = locale.split(_HYPHEN);

        // If locale is different than the default, or needs lookup support
        if (locale !== defLocale || localeSegments.length > 1) {
            var lookup = "";
            for (var i = 0, l = localeSegments.length; i < l; ++i) {
                lookup += localeSegments[i];

                Y.log("getStrings: Merging in strings from: " + lookup, "info", "widget"); 

                var localeStrs = this._getStrings(lookup);
                if (localeStrs) {
                    Y.mix(strs, localeStrs, true, null, 0);
                }
                lookup += _HYPHEN;
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
     * @method getStrings
     * @param {String} locale
     */
    getString : function(key, locale) {
        locale = locale || this.get(_LOCALE);

        Y.log("getString: For " + locale, "info", "widget"); 

        var defLocale = this.getDefaultLocale(),
            strs = this._getStrings(defLocale) || {},
            str = strs[key],
            idx = locale.lastIndexOf(_HYPHEN);

        // If locale is different than the default, or needs lookup support
        if (locale !== defLocale || idx != -1) {
            do {
                Y.log("getString: Performing lookup for: " + locale, "info", "widget"); 

                strs = this._getStrings(locale);
                if (strs && key in strs) {
                    str = strs[key];
                    break;
                }
                idx = locale.lastIndexOf(_HYPHEN);
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
     * widget class).
     *
     * @method getDefaultLocale
     */
    getDefaultLocale : function() {
        return this._conf.get(_LOCALE, _INIT_VALUE);
    },

    _strings: null

});

/**
 * Static registration of default plugins for the class.
 * 
 * @property Y.Widget.PLUGINS
 * @static
 */
Widget.PLUGINS = [];

Y.augment(Widget, Y.PluginHost);
Y.augment(Widget, Y.ClassNameManager);
Y.aggregate(Widget, Y.ClassNameManager);

Y.Widget = Widget;
