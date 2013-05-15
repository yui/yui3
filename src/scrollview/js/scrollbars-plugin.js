/**
 * Provides a plugin, which adds support for a scroll indicator to ScrollView instances
 *
 * @module scrollview
 * @submodule scrollview-scrollbars
 */

var getClassName = Y.ClassNameManager.getClassName,
    _classNames,

    Transition = Y.Transition,
    NATIVE_TRANSITIONS = Transition.useNative,
    SCROLLBAR = 'scrollbar',
    SCROLLVIEW = 'scrollview',

    VERTICAL_NODE = "verticalNode",
    HORIZONTAL_NODE = "horizontalNode",

    CHILD_CACHE = "childCache",

    TOP = "top",
    LEFT = "left",

    HORIZ_CACHE = "_sbh",
    VERT_CACHE = "_sbv",

    TRANSITION_PROPERTY = Y.ScrollView._TRANSITION.PROPERTY,
    TRANSFORM = "transform",

    TRANSLATE_X = "translateX(",
    TRANSLATE_Y = "translateY(",

    SCALE_X = "scaleX(",
    SCALE_Y = "scaleY(",

    SCROLL_X = "scrollX",
    SCROLL_Y = "scrollY",

    PX = "px",
    CLOSE = ")",
    PX_CLOSE = PX + CLOSE;

/**
 * ScrollView plugin that adds scroll indicators to ScrollView instances
 *
 * @class ScrollViewScrollbars
 * @namespace Plugin
 * @extends Plugin.Base
 * @constructor
 */
function ScrollbarsPlugin() {
    ScrollbarsPlugin.superclass.constructor.apply(this, arguments);
}

ScrollbarsPlugin.CLASS_NAMES = {
    showing: getClassName(SCROLLVIEW, SCROLLBAR, 'showing'),
    scrollbar: getClassName(SCROLLVIEW, SCROLLBAR),
    scrollbarV: getClassName(SCROLLVIEW, SCROLLBAR, 'vert'),
    scrollbarH: getClassName(SCROLLVIEW, SCROLLBAR, 'horiz'),
    scrollbarVB: getClassName(SCROLLVIEW, SCROLLBAR, 'vert', 'basic'),
    scrollbarHB: getClassName(SCROLLVIEW, SCROLLBAR, 'horiz', 'basic'),
    child: getClassName(SCROLLVIEW, 'child'),
    first: getClassName(SCROLLVIEW, 'first'),
    middle: getClassName(SCROLLVIEW, 'middle'),
    last: getClassName(SCROLLVIEW, 'last')
};

_classNames = ScrollbarsPlugin.CLASS_NAMES;

/**
 * The identity of the plugin
 *
 * @property NAME
 * @type String
 * @default 'pluginScrollViewScrollbars'
 * @static
 */
ScrollbarsPlugin.NAME = 'pluginScrollViewScrollbars';

/**
 * The namespace on which the plugin will reside.
 *
 * @property NS
 * @type String
 * @default 'scrollbars'
 * @static
 */
ScrollbarsPlugin.NS = 'scrollbars';

/**
 * HTML template for the scrollbar
 *
 * @property SCROLLBAR_TEMPLATE
 * @type Object
 * @static
 */
ScrollbarsPlugin.SCROLLBAR_TEMPLATE = [
    '<div>',
    '<span class="' + _classNames.child + ' ' + _classNames.first + '"></span>',
    '<span class="' + _classNames.child + ' ' + _classNames.middle + '"></span>',
    '<span class="' + _classNames.child + ' ' + _classNames.last + '"></span>',
    '</div>'
].join('');

/**
 * The default attribute configuration for the plugin
 *
 * @property ATTRS
 * @type Object
 * @static
 */
ScrollbarsPlugin.ATTRS = {

    /**
     * Vertical scrollbar node
     *
     * @attribute verticalNode
     * @type Y.Node
     */
    verticalNode: {
        setter: '_setNode',
        valueFn: '_defaultNode'
    },

    /**
     * Horizontal scrollbar node
     *
     * @attribute horizontalNode
     * @type Y.Node
     */
    horizontalNode: {
        setter: '_setNode',
        valueFn: '_defaultNode'
    }
};

Y.namespace("Plugin").ScrollViewScrollbars = Y.extend(ScrollbarsPlugin, Y.Plugin.Base, {

    /**
     * Designated initializer
     *
     * @method initializer
     */
    initializer: function() {
        this._host = this.get("host");

        this.afterHostEvent('scrollEnd', this._hostScrollEnd);
        this.afterHostMethod('scrollTo', this._update);
        this.afterHostMethod('_uiDimensionsChange', this._hostDimensionsChange);
    },

    /**
     * Set up the DOM nodes for the scrollbars. This method is invoked whenever the
     * host's _uiDimensionsChange fires, giving us the opportunity to remove un-needed
     * scrollbars, as well as add one if necessary.
     *
     * @method _hostDimensionsChange
     * @protected
     */
    _hostDimensionsChange: function() {
        var host = this._host,
            axis = host._cAxis,
            scrollX = host.get(SCROLL_X),
            scrollY = host.get(SCROLL_Y);

        this._dims = host._getScrollDims();

        if (axis && axis.y) {
            this._renderBar(this.get(VERTICAL_NODE), true, 'vert');
        }

        if (axis && axis.x) {
            this._renderBar(this.get(HORIZONTAL_NODE), true, 'horiz');
        }

        this._update(scrollX, scrollY);

        Y.later(500, this, 'flash', true);
    },

    /**
     * Handler for the scrollEnd event fired by the host. Default implementation flashes the scrollbar
     *
     * @method _hostScrollEnd
     * @param {Event.Facade} e The event facade.
     * @protected
     */
    _hostScrollEnd : function() {
        var host = this._host,
            scrollX = host.get(SCROLL_X),
            scrollY = host.get(SCROLL_Y);

        this.flash();

        this._update(scrollX, scrollY);
    },

    /**
     * Adds or removes a scrollbar node from the document.
     *
     * @method _renderBar
     * @private
     * @param {Node} bar The scrollbar node
     * @param {boolean} add true, to add the node, false to remove it
     */
    _renderBar: function(bar, add) {
        var inDoc = bar.inDoc(),
            bb = this._host._bb,
            className = bar.getData("isHoriz") ? _classNames.scrollbarHB : _classNames.scrollbarVB;

        if (add && !inDoc) {
            bb.append(bar);
            bar.toggleClass(className, this._basic);
            this._setChildCache(bar);
        }
        else if(!add && inDoc) {
            bar.remove();
            this._clearChildCache(bar);
        }
    },

    /**
     * Caches scrollbar child element information,
     * to optimize _update implementation
     *
     * @method _setChildCache
     * @private
     * @param {Node} node
     */
    _setChildCache : function(node) {
        var c = node.get("children"),
            fc = c.item(0),
            mc = c.item(1),
            lc = c.item(2),
            size = node.getData("isHoriz") ? "offsetWidth" : "offsetHeight";

        node.setStyle(TRANSITION_PROPERTY, TRANSFORM);
        mc.setStyle(TRANSITION_PROPERTY, TRANSFORM);
        lc.setStyle(TRANSITION_PROPERTY, TRANSFORM);

        node.setData(CHILD_CACHE, {
            fc : fc,
            lc : lc,
            mc : mc,
            fcSize : fc && fc.get(size),
            lcSize : lc && lc.get(size)
        });
    },

    /**
     * Clears child cache
     *
     * @method _clearChildCache
     * @private
     * @param {Node} node
     */
    _clearChildCache : function(node) {
        node.clearData(CHILD_CACHE);
    },

    /**
     * Utility method, to move/resize either vertical or horizontal scrollbars
     *
     * @method _updateBar
     * @private
     *
     * @param {Node} scrollbar The scrollbar node.
     * @param {Number} current The current scroll position.
     * @param {Number} duration The transition duration.
     * @param {boolean} horiz true if horizontal, false if vertical.
     */
    _updateBar : function(scrollbar, current, duration, horiz) {

        var host = this._host,
            basic = this._basic,

            scrollbarSize = 0,
            scrollbarPos = 1,

            childCache = scrollbar.getData(CHILD_CACHE),
            lastChild = childCache.lc,
            middleChild = childCache.mc,
            firstChildSize = childCache.fcSize,
            lastChildSize = childCache.lcSize,
            middleChildSize,
            lastChildPosition,

            dimCache,
            widgetSize,
            contentSize;

        if (horiz) {
            dimCache = HORIZ_CACHE;
            widgetSize = this._dims.offsetWidth;
            contentSize = this._dims.scrollWidth;
            current = (current !== undefined) ? current : host.get(SCROLL_X);
        }
        else {
            dimCache = VERT_CACHE;
            widgetSize = this._dims.offsetHeight;
            contentSize = this._dims.scrollHeight;
            current = (current !== undefined) ? current : host.get(SCROLL_Y);
        }

        // Calculate the scrollbar size, and constrain it to within the widget boundaries
        scrollbarSize = (widgetSize * (widgetSize/contentSize));
        scrollbarSize = Math.min(Math.max(scrollbarSize, 0), widgetSize);

        // Calculate the scrollbar position
        scrollbarPos = (current/(contentSize - widgetSize) * (widgetSize - scrollbarSize));

        // Dragged beyond the right boundary
        if (scrollbarPos > (widgetSize - scrollbarSize)) {
            scrollbarSize = scrollbarSize - (scrollbarPos - (widgetSize - scrollbarSize));
        }
        // Dragged beyond the left boundary
        else if (scrollbarPos < 0) {
            scrollbarSize = scrollbarPos + scrollbarSize;
        }

        // Constrain the scrollbar position to the widget boundaries
        scrollbarPos = Math.min(Math.max(scrollbarPos, 0), contentSize);

        // Calculate the middle child size, and ensure it is >= 0
        middleChildSize = (scrollbarSize - (firstChildSize + lastChildSize));
        middleChildSize = Math.max(middleChildSize, 0);

        // Dead code?
        if (middleChildSize === 0 && scrollbarPos !== 0) {
            scrollbarPos = widgetSize - (firstChildSize + lastChildSize) - 1;
        }

        // Floor the size & position
        scrollbarSize = Math.floor(scrollbarSize);
        scrollbarPos = Math.floor(scrollbarPos);

        // Scroll the container
        this._updateNode(scrollbar, scrollbarPos, duration, true, horiz);

        // Resize Scrollbar Middle Child
        if (this[dimCache] !== middleChildSize) {
            this[dimCache] = middleChildSize;

            if (middleChildSize > 0) {
                this._updateNode(middleChild, middleChildSize, duration, false, horiz);

                // Position Last Child
                if (!horiz || !basic) {
                    lastChildPosition = scrollbarSize - lastChildSize;
                    this._updateNode(lastChild, lastChildPosition, duration, true, horiz);
                }
            }
        }
    },

    _updateNode: function (node, modifierValue, duration, isTranslate, horiz) {
        var dimOffset = (horiz ? LEFT : TOP),
            translate = (horiz ? TRANSLATE_X : TRANSLATE_Y),
            scale = (horiz ? SCALE_X : SCALE_Y),
            modifierType = (isTranslate ? translate : scale),
            close = ((modifierType === translate) ? PX_CLOSE : CLOSE),
            transition;

        // Animate it
        if(duration !== 0) {
            transition = {
                duration : duration
            };

            if (NATIVE_TRANSITIONS) {
                transition.transform = modifierType + modifierValue + close;
            }
            else {
                transition[dimOffset] = modifierValue + ((modifierType === translate) ? '' : PX);
            }

            node.transition(transition);
        }

        // Move it
        else {
            if (NATIVE_TRANSITIONS) {
                node.setStyle(TRANSFORM, modifierType + modifierValue + close);
            }
            else {
                node.setStyle(dimOffset, modifierValue + PX);
            }
        }
    },

    /**
     * AOP method, invoked after the host's _uiScrollTo method,
     *  to position and resize the scroll bars
     *
     * @method _update
     * @param x {Number} The current scrollX value
     * @param y {Number} The current scrollY value
     * @param duration {Number} Number of ms of animation (optional) - used when snapping to bounds
     * @param easing {String} Optional easing equation to use during the animation, if duration is set
     * @protected
     */
    _update: function(x, y, duration) {
        var vNode = this.get(VERTICAL_NODE),
            hNode = this.get(HORIZONTAL_NODE),
            host = this._host,
            axis = host._cAxis;

        duration = (duration || 0)/1000;

        if (!this._showing) {
            this.show();
        }

        if (axis && axis.y && vNode && y !== null) {
            this._updateBar(vNode, y, duration, false);
        }

        if (axis && axis.x && hNode && x !== null) {
            this._updateBar(hNode, x, duration, true);
        }
    },

    /**
     * Show the scroll bar indicators
     *
     * @method show
     * @param animated {Boolean} Whether or not to animate the showing
     */
    show: function(animated) {
        this._show(true, animated);
    },

    /**
     * Hide the scroll bar indicators
     *
     * @method hide
     * @param animated {Boolean} Whether or not to animate the hiding
     */
    hide: function(animated) {
        this._show(false, animated);
    },

    /**
     * Internal hide/show implementation utility method
     *
     * @method _show
     * @param {boolean} show Whether to show or hide the scrollbar
     * @param {bolean} animated Whether or not to animate while showing/hide
     * @protected
     */
    _show : function(show, animated) {

        var verticalNode = this.get(VERTICAL_NODE),
            horizontalNode = this.get(HORIZONTAL_NODE),

            duration = (animated) ? 0.6 : 0,
            opacity = (show) ? 1 : 0,

            transition;

        this._showing = show;

        if (this._flashTimer) {
            this._flashTimer.cancel();
        }

        transition = {
            duration : duration,
            opacity : opacity
        };

        if (verticalNode && verticalNode._node) {
            verticalNode.transition(transition);
        }

        if (horizontalNode && horizontalNode._node) {
            horizontalNode.transition(transition);
        }
    },

    /**
     * Momentarily flash the scroll bars to indicate current scroll position
     *
     * @method flash
     */
    flash: function() {
        this.show(true);
        this._flashTimer = Y.later(800, this, 'hide', true);
    },

    /**
     * Setter for the verticalNode and horizontalNode attributes
     *
     * @method _setNode
     * @param node {Node} The Y.Node instance for the scrollbar
     * @param name {String} The attribute name
     * @return {Node} The Y.Node instance for the scrollbar
     *
     * @protected
     */
    _setNode: function(node, name) {
        var horiz = (name === HORIZONTAL_NODE);
            node = Y.one(node);

        if (node) {
            node.addClass(_classNames.scrollbar);
            node.addClass( (horiz) ? _classNames.scrollbarH : _classNames.scrollbarV );
            node.setData("isHoriz", horiz);
        }

        return node;
    },

    /**
     * Creates default node instances for scrollbars
     *
     * @method _defaultNode
     * @return {Node} The Y.Node instance for the scrollbar
     *
     * @protected
     */
    _defaultNode: function() {
        return Y.Node.create(ScrollbarsPlugin.SCROLLBAR_TEMPLATE);
    },

    _basic: Y.UA.ie && Y.UA.ie <= 8

});
