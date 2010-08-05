/**
 * Provides a plugin, which adds support for a scroll indicator to ScrollView instances
 *
 * @module scrollview-scrollbars
 */

var getClassName = Y.ClassNameManager.getClassName,
    NATIVE_TRANSITIONS = Y.Transition.useNative,
    _classNames,
    SCROLLBAR = 'scrollbar',
    SCROLLVIEW = 'scrollview';

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
 * @property ScrollViewScrollbars.NAME
 * @type String
 * @default 'scrollbars-plugin'
 * @static
 */
ScrollbarsPlugin.NAME = 'pluginScrollViewScrollbars';
    
/**
 * The namespace on which the plugin will reside.
 *
 * @property ScrollViewScrollbars.NS
 * @type String
 * @default 'scrollbars'
 * @static
 */
ScrollbarsPlugin.NS = 'scrollbars';

/**
 * HTML template for the scrollbar
 *
 * @property ScrollViewScrollbars.SCROLLBAR_TEMPLATE
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
 * @property ScrollViewScrollbars.ATTRS
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
        value: Y.Node.create(ScrollbarsPlugin.SCROLLBAR_TEMPLATE)
    },

    /**
     * Horizontal scrollbar node
     *
     * @attribute horizontalNode
     * @type Y.Node
     */
    horizontalNode: {
		setter: '_setNode',
        value: Y.Node.create(ScrollbarsPlugin.SCROLLBAR_TEMPLATE)
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

        this.afterHostMethod('_uiScrollY', this._update);
        this.afterHostMethod('_uiScrollX', this._update);
        this.afterHostMethod('_uiDimensionsChange', this._hostDimensionsChange);
        this.doAfter('scrollEnd', this.flash);
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
            boundingBox = host._bb,

            verticalNode = this.get('verticalNode'),
            horizontalNode = this.get('horizontalNode'),

            verticalNodeInDoc = verticalNode.inDoc(),
            horizontalNodeInDoc = horizontalNode.inDoc();

        if (host._scrollsVertical && !verticalNodeInDoc) {
            boundingBox.append(verticalNode);
            if (this._basic) {
                verticalNode.addClass(_classNames.scrollbarVB);
            }
            this._setChildCache(verticalNode);
        } else if(!host._scrollsVertical && verticalNodeInDoc) {
            verticalNode.remove();
            this._clearChildCache(verticalNode);
        }

        // Horizontal
        if (host._scrollsHorizontal && !horizontalNodeInDoc) {
            boundingBox.append(horizontalNode);
            if (this._basic) {
                horizontalNode.addClass(_classNames.scrollbarHB);
            }
            this._setChildCache(horizontalNode);

        } else if(!host._scrollsHorizontal && horizontalNodeInDoc) {
            horizontalNode.remove();
            this._clearChildCache(horizontalNode);
        }

        this._update();

        Y.later(500, this, 'flash', true);
    },

    /**
     * @method _setChildCache
     * @private
     * @param {Node} node
     */
    _setChildCache : function(node) {

        var c = node.get("children"),
            fc = c.item(0),
            mc = c.item(1),
            lc = c.item(2),
            size = node.getData("isHorizontal") ? "offsetWidth" : "offsetHeight";

        node.setData("childCache", {
            fc : fc,
            lc : lc,
            mc : mc,
            fcSize : fc && fc.get(size),
            lcSize : lc && lc.get(size)
        });
    },

    /**
     * @method _clearChildCache
     * @private
     * @param {Node} node
     */
    _clearChildCache : function(node) {
        node.clearData("childCache");
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
            cb = host._cb,
            scrollbarSize = 0,
            scrollbarPos = 1,
            transition,
            middleChildSize,
            lastChildPosition,
            transitionTransform,
            transitionProp,

            dim = (horiz) ? "width" : "height",
            dimOffset = (horiz) ? "left": "top",
            dimCache = (horiz) ? "_sbh": "_sbv",

            childCache = scrollbar.getData("childCache"),
            lastChild = childCache.lc,
            middleChild = childCache.mc,
            firstChildSize = childCache.fcSize,
            lastChildSize = childCache.lcSize,

            widgetSize = host.get(dim),
            contentSize = (horiz) ? host._scrollWidth || cb.get('scrollWidth') : host._scrollHeight || cb.get('scrollHeight');

        duration = duration/1000;

        scrollbarSize = Math.floor(widgetSize * (widgetSize/contentSize));
        scrollbarPos = Math.floor((current/(contentSize - widgetSize)) * (widgetSize - scrollbarSize)) * -1;

        if (scrollbarSize > widgetSize) {
            scrollbarSize = 1;
        }

        if (NATIVE_TRANSITIONS) {
            transitionTransform = (horiz) ? 'translateX('+scrollbarPos+'px)' : 'translateY('+scrollbarPos+'px)';
        } else {
            transitionProp = scrollbarPos;
        }

        if (scrollbarPos > (widgetSize - scrollbarSize)) {
            scrollbarSize = scrollbarSize - (scrollbarPos - (widgetSize - scrollbarSize));
        }

        if (scrollbarPos < 0) {
            if (NATIVE_TRANSITIONS) {
                transitionTransform = (horiz) ? 'translateX(0)' : 'translateY(0)';
            } else {
                transitionProp = 0;
            }
            scrollbarSize = scrollbarPos + scrollbarSize;
        }

        middleChildSize = (scrollbarSize - (firstChildSize + lastChildSize));

        if (this[dimCache] !== middleChildSize) {
            this[dimCache] = middleChildSize;

            transition = {
                duration : duration             
            };

            if(NATIVE_TRANSITIONS) {
                transition.transform = (horiz) ? 'scaleX('+ middleChildSize +')' : 'scaleY('+ middleChildSize +')';
            } else {
                transition[dim] = middleChildSize;
            }

            middleChild.transition(transition);
        }

        transition = {
            duration : duration
        };

        if (NATIVE_TRANSITIONS) {
            transition.transform = transitionTransform;
        } else {
            transition[dimOffset] = transitionProp;
        }

        scrollbar.transition(transition);

        if (!horiz || !basic) {

            transition = {
                duration : duration
            };
    
            lastChildPosition = scrollbarSize - firstChildSize;
    
            if (NATIVE_TRANSITIONS) {
                transition.transform = (horiz) ? 'translateX('+ lastChildPosition +'px)' : 'translateY('+ lastChildPosition +'px)'; 
            } else {
                transition[dimOffset] = lastChildPosition; 
            }

            lastChild.transition(transition);
        }
    },

    /**
     * Position and resize the scroll bars according to the content size
     *
     * @method _update
     * @param currentPos {Number} The current scrollX or scrollY value (not used here, but passed by default from _uiScrollX/_uiScrollY)
     * @param duration {Number} Number of ms of animation (optional) - used when snapping to bounds
     * @param easing {String} Optional easing equation to use during the animation, if duration is set
     * @protected
     */
    _update: function(currentPos, duration, easing) {
        var vNode = this.get('verticalNode'),
            hNode = this.get('horizontalNode'),
            host = this._host;

        duration = duration || 0;

        if (!this._showingScrollBars) {
            this.show();
        }

        if (host._scrollsVertical && vNode) {
            this._updateBar(vNode, currentPos * -1, duration, false);
        }

        if (host._scrollsHorizontal && hNode) {
            this._updateBar(hNode, currentPos * -1, duration, true);
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
     * @param {Object} show
     * @param {Object} animated
     * @protected
     */
    _show : function(show, animated) {

        var verticalNode = this.get('verticalNode'),
            horizontalNode = this.get('horizontalNode'),
            transition = {
                duration : (animated) ? 0.6 : 0,
                opacity : (show) ? 1 : 0
            };

        this._showingScrollBars = show;

        if(this._flashTimer) {
            this._flashTimer.cancel();
        }

        if(verticalNode) {
            verticalNode.transition(transition);
        }

        if(horizontalNode) {
            horizontalNode.transition(transition);
        }
    },

    /**
     * Momentarily flash the scroll bars to indicate current scroll position
     *
     * @method flash
     */
    flash: function() {
        var shouldFlash = false,
            host = this._host;

        if(host._scrollsVertical && (host._scrollHeight > host.get('height'))) {
            shouldFlash = true;
        }

        if(host._scrollsHorizontal && (host._scrollWidth > this.get('host').get('width'))) {
            shouldFlash = true;
        }
        
        if(shouldFlash) {
            this.show(true);
            this._flashTimer = Y.later(800, this, 'hide', true);
        }
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
        var horiz = (name == "horizontalNode");
        
        node = Y.one(node);

        if (node) {
            node.addClass(_classNames.scrollbar);
            node.addClass( (horiz) ? _classNames.scrollbarH : _classNames.scrollbarV );
            node.setData("isHorizontal", horiz);
        }

        return node;
    },

    _basic: Y.UA.ie && Y.UA.ie <= 8

});