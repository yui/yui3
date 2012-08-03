if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js",
    code: []
};
_yuitest_coverage["/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js"].code=["YUI.add('scrollview-scrollbars', function(Y) {","","/**"," * Provides a plugin, which adds support for a scroll indicator to ScrollView instances"," *"," * @module scrollview-scrollbars"," */","","var getClassName = Y.ClassNameManager.getClassName,","    _classNames,","","    Transition = Y.Transition,","    NATIVE_TRANSITIONS = Transition.useNative,    ","    SCROLLBAR = 'scrollbar',","    SCROLLVIEW = 'scrollview',","","    VERTICAL_NODE = \"verticalNode\",","    HORIZONTAL_NODE = \"horizontalNode\",","","    CHILD_CACHE = \"childCache\",","","    TOP = \"top\",","    LEFT = \"left\",","    WIDTH = \"width\",","    HEIGHT = \"height\",","    SCROLL_WIDTH = \"scrollWidth\",","    SCROLL_HEIGHT = \"scrollHeight\",","","    HORIZ_CACHE = \"_sbh\",","    VERT_CACHE = \"_sbv\",","","    TRANSITION_PROPERTY = Transition._VENDOR_PREFIX + \"TransitionProperty\",","    TRANSFORM = \"transform\",","","    TRANSLATE_X = \"translateX(\",","    TRANSLATE_Y = \"translateY(\",","","    SCALE_X = \"scaleX(\",","    SCALE_Y = \"scaleY(\",","    ","    SCROLL_X = \"scrollX\",","    SCROLL_Y = \"scrollY\",","","    PX = \"px\",","    CLOSE = \")\",","    PX_CLOSE = PX + CLOSE;","","/**"," * ScrollView plugin that adds scroll indicators to ScrollView instances"," *"," * @class ScrollViewScrollbars"," * @namespace Plugin"," * @extends Plugin.Base"," * @constructor"," */","function ScrollbarsPlugin() {","    ScrollbarsPlugin.superclass.constructor.apply(this, arguments);","}","","ScrollbarsPlugin.CLASS_NAMES = {","    showing: getClassName(SCROLLVIEW, SCROLLBAR, 'showing'),","    scrollbar: getClassName(SCROLLVIEW, SCROLLBAR),","    scrollbarV: getClassName(SCROLLVIEW, SCROLLBAR, 'vert'),","    scrollbarH: getClassName(SCROLLVIEW, SCROLLBAR, 'horiz'),","    scrollbarVB: getClassName(SCROLLVIEW, SCROLLBAR, 'vert', 'basic'),","    scrollbarHB: getClassName(SCROLLVIEW, SCROLLBAR, 'horiz', 'basic'),","    child: getClassName(SCROLLVIEW, 'child'),","    first: getClassName(SCROLLVIEW, 'first'),","    middle: getClassName(SCROLLVIEW, 'middle'),","    last: getClassName(SCROLLVIEW, 'last')","};","","_classNames = ScrollbarsPlugin.CLASS_NAMES;","","/**"," * The identity of the plugin"," *"," * @property NAME"," * @type String"," * @default 'pluginScrollViewScrollbars'"," * @static"," */","ScrollbarsPlugin.NAME = 'pluginScrollViewScrollbars';","    ","/**"," * The namespace on which the plugin will reside."," *"," * @property NS"," * @type String"," * @default 'scrollbars'"," * @static"," */","ScrollbarsPlugin.NS = 'scrollbars';","","/**"," * HTML template for the scrollbar"," *"," * @property SCROLLBAR_TEMPLATE"," * @type Object"," * @static"," */","ScrollbarsPlugin.SCROLLBAR_TEMPLATE = [","    '<div>',","    '<span class=\"' + _classNames.child + ' ' + _classNames.first + '\"></span>',","    '<span class=\"' + _classNames.child + ' ' + _classNames.middle + '\"></span>',","    '<span class=\"' + _classNames.child + ' ' + _classNames.last + '\"></span>',","    '</div>'","].join('');","","/**"," * The default attribute configuration for the plugin"," *"," * @property ATTRS"," * @type Object"," * @static"," */","ScrollbarsPlugin.ATTRS = {","    ","    /**","     * Vertical scrollbar node","     *","     * @attribute verticalNode","     * @type Y.Node","     */","    verticalNode: {","        setter: '_setNode',","        valueFn: '_defaultNode'","    },","","    /**","     * Horizontal scrollbar node","     *","     * @attribute horizontalNode","     * @type Y.Node","     */","    horizontalNode: {","        setter: '_setNode',","        valueFn: '_defaultNode'","    }","};","","Y.namespace(\"Plugin\").ScrollViewScrollbars = Y.extend(ScrollbarsPlugin, Y.Plugin.Base, {","","    /**","     * Designated initializer","     *","     * @method initializer","     */    ","    initializer: function() {","        this._host = this.get(\"host\");","","        this.afterHostEvent('scrollEnd', this._hostScrollEnd);","        this.afterHostMethod('_uiScrollTo', this._update);","        this.afterHostMethod('_uiDimensionsChange', this._hostDimensionsChange);","    },","","    /**","     * Set up the DOM nodes for the scrollbars. This method is invoked whenever the","     * host's _uiDimensionsChange fires, giving us the opportunity to remove un-needed","     * scrollbars, as well as add one if necessary.","     *","     * @method _hostDimensionsChange","     * @protected","     */    ","    _hostDimensionsChange: function() {","        var host = this._host;","","        this._renderBar(this.get(VERTICAL_NODE), host._scrollsVertical);","        this._renderBar(this.get(HORIZONTAL_NODE), host._scrollsHorizontal);","","        this._update();","","        Y.later(500, this, 'flash', true);","    },","","    /**","     * Handler for the scrollEnd event fired by the host. Default implementation flashes the scrollbar","     *","     * @method _hostScrollEnd","     * @param {Event.Facade} e The event facade.","     */","    _hostScrollEnd : function(e) {","        if (!this._host._flicking) {","            this.flash();","        }","    },","","    /**","     * Adds or removes a scrollbar node from the document.","     * ","     * @method _renderBar","     * @private","     * @param {Node} bar The scrollbar node","     * @param {boolean} add true, to add the node, false to remove it","     */","    _renderBar: function(bar, add) {","        var inDoc = bar.inDoc(),","            bb = this._host._bb,","            className = bar.getData(\"isHoriz\") ? _classNames.scrollbarHB : _classNames.scrollbarVB;","","        if (add && !inDoc) {","            bb.append(bar);","            bar.toggleClass(className, this._basic);","            this._setChildCache(bar);","        } else if(!add && inDoc) {","            bar.remove();","            this._clearChildCache(bar);","        }","    },","","    /**","     * Caches scrollbar child element information,","     * to optimize _update implementation ","     * ","     * @method _setChildCache","     * @private","     * @param {Node} node","     */","    _setChildCache : function(node) {","","        var c = node.get(\"children\"),","            fc = c.item(0),","            mc = c.item(1),","            lc = c.item(2),","            size = node.getData(\"isHoriz\") ? \"offsetWidth\" : \"offsetHeight\";","","        node.setStyle(TRANSITION_PROPERTY, TRANSFORM);","        mc.setStyle(TRANSITION_PROPERTY, TRANSFORM);","        lc.setStyle(TRANSITION_PROPERTY, TRANSFORM);","","        node.setData(CHILD_CACHE, {","            fc : fc,","            lc : lc,","            mc : mc,","            fcSize : fc && fc.get(size),","            lcSize : lc && lc.get(size)","        });","    },","","    /**","     * Clears child cache","     * ","     * @method _clearChildCache","     * @private","     * @param {Node} node","     */","    _clearChildCache : function(node) {","        node.clearData(CHILD_CACHE);","    },","","    /**","     * Utility method, to move/resize either vertical or horizontal scrollbars","     *","     * @method _updateBar","     * @private","     *","     * @param {Node} scrollbar The scrollbar node.","     * @param {Number} current The current scroll position.","     * @param {Number} duration The transition duration.","     * @param {boolean} horiz true if horizontal, false if vertical.","     */","    _updateBar : function(scrollbar, current, duration, horiz) {","","        var host = this._host,","            basic = this._basic,","            cb = host._cb,","","            scrollbarSize = 0,","            scrollbarPos = 1,","","            childCache = scrollbar.getData(CHILD_CACHE),","            lastChild = childCache.lc,","            middleChild = childCache.mc,","            firstChildSize = childCache.fcSize,","            lastChildSize = childCache.lcSize,","            middleChildSize,","            lastChildPosition,","","            transition,","            translate,","            scale,","","            dim,","            dimOffset,","            dimCache,","            widgetSize,","            contentSize;","","        if (horiz) {","            dim = WIDTH;","            dimOffset = LEFT;","            dimCache = HORIZ_CACHE;","            widgetSize = host._width;","            contentSize = host._scrollWidth;","            translate = TRANSLATE_X;","            scale = SCALE_X;","            current = (current !== undefined) ? current : host.get(SCROLL_X);","        } else {","            dim = HEIGHT;","            dimOffset = TOP;","            dimCache = VERT_CACHE;","            widgetSize = host._height;","            contentSize = host._scrollHeight;","            translate = TRANSLATE_Y;","            scale = SCALE_Y;","            current = (current !== undefined) ? current : host.get(SCROLL_Y);","        }","","        scrollbarSize = Math.floor(widgetSize * (widgetSize/contentSize));","        scrollbarPos = Math.floor((current/(contentSize - widgetSize)) * (widgetSize - scrollbarSize));","","        if (scrollbarSize > widgetSize) {","            scrollbarSize = 1;","        }","","        if (scrollbarPos > (widgetSize - scrollbarSize)) {","            scrollbarSize = scrollbarSize - (scrollbarPos - (widgetSize - scrollbarSize));","        } else if (scrollbarPos < 0) {","            scrollbarSize = scrollbarPos + scrollbarSize;","            scrollbarPos = 0;","        }","","        middleChildSize = (scrollbarSize - (firstChildSize + lastChildSize));","","        if (middleChildSize < 0) {","            middleChildSize = 0;","        }","","        if (middleChildSize === 0 && scrollbarPos !== 0) {","            scrollbarPos = widgetSize - (firstChildSize + lastChildSize) - 1;","        }","","        if (duration !== 0) {","            // Position Scrollbar","            transition = {","                duration : duration","            };","","            if (NATIVE_TRANSITIONS) {","                transition.transform = translate + scrollbarPos + PX_CLOSE;","            } else {","                transition[dimOffset] = scrollbarPos + PX;","            }","","            scrollbar.transition(transition);","","        } else {","            if (NATIVE_TRANSITIONS) {","                scrollbar.setStyle(TRANSFORM, translate + scrollbarPos + PX_CLOSE);","            } else {","                scrollbar.setStyle(dimOffset, scrollbarPos + PX);","            }","        }","","        // Resize Scrollbar Middle Child","        if (this[dimCache] !== middleChildSize) {","            this[dimCache] = middleChildSize;","","            if (middleChildSize > 0) {","","                if (duration !== 0) {","                    transition = {","                        duration : duration             ","                    };","","                    if(NATIVE_TRANSITIONS) {","                        transition.transform = scale + middleChildSize + CLOSE;","                    } else {","                        transition[dim] = middleChildSize + PX;","                    }","","                    middleChild.transition(transition);","                } else {","                    if (NATIVE_TRANSITIONS) {","                        middleChild.setStyle(TRANSFORM, scale + middleChildSize + CLOSE);","                    } else {","                        middleChild.setStyle(dim, middleChildSize + PX);","                    }","                }","    ","                // Position Last Child","                if (!horiz || !basic) {","","                    lastChildPosition = scrollbarSize - lastChildSize;","    ","                    if(duration !== 0) { ","                        transition = {","                            duration : duration","                        };","                ","                        if (NATIVE_TRANSITIONS) {","                            transition.transform = translate + lastChildPosition + PX_CLOSE; ","                        } else {","                            transition[dimOffset] = lastChildPosition; ","                        }","","                        lastChild.transition(transition);","                    } else {","                        if (NATIVE_TRANSITIONS) {","                            lastChild.setStyle(TRANSFORM, translate + lastChildPosition + PX_CLOSE); ","                        } else {","                            lastChild.setStyle(dimOffset, lastChildPosition + PX); ","                        }","                    }","                }","            }","        }","    },","","    /**","     * AOP method, invoked after the host's _uiScrollTo method, ","     * to position and resize the scroll bars","     *","     * @method _update","     * @param x {Number} The current scrollX value","     * @param y {Number} The current scrollY value","     * @param duration {Number} Number of ms of animation (optional) - used when snapping to bounds ","     * @param easing {String} Optional easing equation to use during the animation, if duration is set","     * @protected","     */","    _update: function(x, y, duration, easing) {","","        var vNode = this.get(VERTICAL_NODE),","            hNode = this.get(HORIZONTAL_NODE),","            host = this._host;","            ","        duration = (duration || 0)/1000;","","        if (!this._showing) {","            this.show();","        }","","        if (host._scrollsVertical && vNode) {","            this._updateBar(vNode, y, duration, false);","        }","","        if (host._scrollsHorizontal && hNode) {","            this._updateBar(hNode, x, duration, true);","        }","    },","","    /**","     * Show the scroll bar indicators","     *","     * @method show","     * @param animated {Boolean} Whether or not to animate the showing ","     */","    show: function(animated) {","        this._show(true, animated);","    },","","    /**","     * Hide the scroll bar indicators","     *","     * @method hide","     * @param animated {Boolean} Whether or not to animate the hiding","     */","    hide: function(animated) {","        this._show(false, animated);","    },","","    /**","     * Internal hide/show implementation utility method","     *","     * @method _show","     * @param {boolean} show Whether to show or hide the scrollbar ","     * @param {bolean} animated Whether or not to animate while showing/hide","     * @protected","     */","    _show : function(show, animated) {","","        var verticalNode = this.get(VERTICAL_NODE),","            horizontalNode = this.get(HORIZONTAL_NODE),","","            duration = (animated) ? 0.6 : 0,","            opacity = (show) ? 1 : 0,","","            transition;","","        this._showing = show;","","        if (this._flashTimer) {","            this._flashTimer.cancel();","        }","","        transition = {","            duration : duration,","            opacity : opacity","        };","","        if (verticalNode) {","            verticalNode.transition(transition);","        }","","        if (horizontalNode) {","            horizontalNode.transition(transition);","        }","    },","","    /**","     * Momentarily flash the scroll bars to indicate current scroll position","     *","     * @method flash","     */","    flash: function() {","        var host = this._host;","","        this.show(true);","        this._flashTimer = Y.later(800, this, 'hide', true);","    },","","    /**","     * Setter for the verticalNode and horizontalNode attributes","     *","     * @method _setNode","     * @param node {Node} The Y.Node instance for the scrollbar","     * @param name {String} The attribute name","     * @return {Node} The Y.Node instance for the scrollbar","     * ","     * @protected","     */","    _setNode: function(node, name) {","        var horiz = (name == HORIZONTAL_NODE);","","        node = Y.one(node);","","        if (node) {","            node.addClass(_classNames.scrollbar);","            node.addClass( (horiz) ? _classNames.scrollbarH : _classNames.scrollbarV );","            node.setData(\"isHoriz\", horiz);","        }","","        return node;","    },","","    /**","     * Creates default node instances for scrollbars","     *","     * @method _defaultNode","     * @return {Node} The Y.Node instance for the scrollbar","     * ","     * @protected","     */","    _defaultNode: function() {","        return Y.Node.create(ScrollbarsPlugin.SCROLLBAR_TEMPLATE);","    },    ","","    _basic: Y.UA.ie && Y.UA.ie <= 8","","});","","","}, '@VERSION@' ,{skinnable:true, requires:['classnamemanager', 'transition', 'plugin']});"];
_yuitest_coverage["/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js"].lines = {"1":0,"9":0,"56":0,"57":0,"60":0,"73":0,"83":0,"93":0,"102":0,"117":0,"142":0,"150":0,"152":0,"153":0,"154":0,"166":0,"168":0,"169":0,"171":0,"173":0,"183":0,"184":0,"197":0,"201":0,"202":0,"203":0,"204":0,"205":0,"206":0,"207":0,"221":0,"227":0,"228":0,"229":0,"231":0,"248":0,"264":0,"289":0,"290":0,"291":0,"292":0,"293":0,"294":0,"295":0,"296":0,"297":0,"299":0,"300":0,"301":0,"302":0,"303":0,"304":0,"305":0,"306":0,"309":0,"310":0,"312":0,"313":0,"316":0,"317":0,"318":0,"319":0,"320":0,"323":0,"325":0,"326":0,"329":0,"330":0,"333":0,"335":0,"339":0,"340":0,"342":0,"345":0,"348":0,"349":0,"351":0,"356":0,"357":0,"359":0,"361":0,"362":0,"366":0,"367":0,"369":0,"372":0,"374":0,"375":0,"377":0,"382":0,"384":0,"386":0,"387":0,"391":0,"392":0,"394":0,"397":0,"399":0,"400":0,"402":0,"423":0,"427":0,"429":0,"430":0,"433":0,"434":0,"437":0,"438":0,"449":0,"459":0,"472":0,"480":0,"482":0,"483":0,"486":0,"491":0,"492":0,"495":0,"496":0,"506":0,"508":0,"509":0,"523":0,"525":0,"527":0,"528":0,"529":0,"530":0,"533":0,"545":0};
_yuitest_coverage["/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js"].functions = {"ScrollbarsPlugin:56":0,"initializer:149":0,"_hostDimensionsChange:165":0,"_hostScrollEnd:182":0,"_renderBar:196":0,"_setChildCache:219":0,"_clearChildCache:247":0,"_updateBar:262":0,"_update:421":0,"show:448":0,"hide:458":0,"_show:470":0,"flash:505":0,"_setNode:522":0,"_defaultNode:544":0,"(anonymous 1):1":0};
_yuitest_coverage["/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js"].coveredLines = 130;
_yuitest_coverage["/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js"].coveredFunctions = 16;
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 1);
YUI.add('scrollview-scrollbars', function(Y) {

/**
 * Provides a plugin, which adds support for a scroll indicator to ScrollView instances
 *
 * @module scrollview-scrollbars
 */

_yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "(anonymous 1)", 1);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 9);
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
    WIDTH = "width",
    HEIGHT = "height",
    SCROLL_WIDTH = "scrollWidth",
    SCROLL_HEIGHT = "scrollHeight",

    HORIZ_CACHE = "_sbh",
    VERT_CACHE = "_sbv",

    TRANSITION_PROPERTY = Transition._VENDOR_PREFIX + "TransitionProperty",
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
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 56);
function ScrollbarsPlugin() {
    _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "ScrollbarsPlugin", 56);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 57);
ScrollbarsPlugin.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 60);
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

_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 73);
_classNames = ScrollbarsPlugin.CLASS_NAMES;

/**
 * The identity of the plugin
 *
 * @property NAME
 * @type String
 * @default 'pluginScrollViewScrollbars'
 * @static
 */
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 83);
ScrollbarsPlugin.NAME = 'pluginScrollViewScrollbars';
    
/**
 * The namespace on which the plugin will reside.
 *
 * @property NS
 * @type String
 * @default 'scrollbars'
 * @static
 */
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 93);
ScrollbarsPlugin.NS = 'scrollbars';

/**
 * HTML template for the scrollbar
 *
 * @property SCROLLBAR_TEMPLATE
 * @type Object
 * @static
 */
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 102);
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
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 117);
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

_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 142);
Y.namespace("Plugin").ScrollViewScrollbars = Y.extend(ScrollbarsPlugin, Y.Plugin.Base, {

    /**
     * Designated initializer
     *
     * @method initializer
     */    
    initializer: function() {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "initializer", 149);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 150);
this._host = this.get("host");

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 152);
this.afterHostEvent('scrollEnd', this._hostScrollEnd);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 153);
this.afterHostMethod('_uiScrollTo', this._update);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 154);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "_hostDimensionsChange", 165);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 166);
var host = this._host;

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 168);
this._renderBar(this.get(VERTICAL_NODE), host._scrollsVertical);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 169);
this._renderBar(this.get(HORIZONTAL_NODE), host._scrollsHorizontal);

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 171);
this._update();

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 173);
Y.later(500, this, 'flash', true);
    },

    /**
     * Handler for the scrollEnd event fired by the host. Default implementation flashes the scrollbar
     *
     * @method _hostScrollEnd
     * @param {Event.Facade} e The event facade.
     */
    _hostScrollEnd : function(e) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "_hostScrollEnd", 182);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 183);
if (!this._host._flicking) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 184);
this.flash();
        }
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "_renderBar", 196);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 197);
var inDoc = bar.inDoc(),
            bb = this._host._bb,
            className = bar.getData("isHoriz") ? _classNames.scrollbarHB : _classNames.scrollbarVB;

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 201);
if (add && !inDoc) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 202);
bb.append(bar);
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 203);
bar.toggleClass(className, this._basic);
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 204);
this._setChildCache(bar);
        } else {_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 205);
if(!add && inDoc) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 206);
bar.remove();
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 207);
this._clearChildCache(bar);
        }}
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

        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "_setChildCache", 219);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 221);
var c = node.get("children"),
            fc = c.item(0),
            mc = c.item(1),
            lc = c.item(2),
            size = node.getData("isHoriz") ? "offsetWidth" : "offsetHeight";

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 227);
node.setStyle(TRANSITION_PROPERTY, TRANSFORM);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 228);
mc.setStyle(TRANSITION_PROPERTY, TRANSFORM);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 229);
lc.setStyle(TRANSITION_PROPERTY, TRANSFORM);

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 231);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "_clearChildCache", 247);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 248);
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

        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "_updateBar", 262);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 264);
var host = this._host,
            basic = this._basic,
            cb = host._cb,

            scrollbarSize = 0,
            scrollbarPos = 1,

            childCache = scrollbar.getData(CHILD_CACHE),
            lastChild = childCache.lc,
            middleChild = childCache.mc,
            firstChildSize = childCache.fcSize,
            lastChildSize = childCache.lcSize,
            middleChildSize,
            lastChildPosition,

            transition,
            translate,
            scale,

            dim,
            dimOffset,
            dimCache,
            widgetSize,
            contentSize;

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 289);
if (horiz) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 290);
dim = WIDTH;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 291);
dimOffset = LEFT;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 292);
dimCache = HORIZ_CACHE;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 293);
widgetSize = host._width;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 294);
contentSize = host._scrollWidth;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 295);
translate = TRANSLATE_X;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 296);
scale = SCALE_X;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 297);
current = (current !== undefined) ? current : host.get(SCROLL_X);
        } else {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 299);
dim = HEIGHT;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 300);
dimOffset = TOP;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 301);
dimCache = VERT_CACHE;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 302);
widgetSize = host._height;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 303);
contentSize = host._scrollHeight;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 304);
translate = TRANSLATE_Y;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 305);
scale = SCALE_Y;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 306);
current = (current !== undefined) ? current : host.get(SCROLL_Y);
        }

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 309);
scrollbarSize = Math.floor(widgetSize * (widgetSize/contentSize));
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 310);
scrollbarPos = Math.floor((current/(contentSize - widgetSize)) * (widgetSize - scrollbarSize));

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 312);
if (scrollbarSize > widgetSize) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 313);
scrollbarSize = 1;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 316);
if (scrollbarPos > (widgetSize - scrollbarSize)) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 317);
scrollbarSize = scrollbarSize - (scrollbarPos - (widgetSize - scrollbarSize));
        } else {_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 318);
if (scrollbarPos < 0) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 319);
scrollbarSize = scrollbarPos + scrollbarSize;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 320);
scrollbarPos = 0;
        }}

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 323);
middleChildSize = (scrollbarSize - (firstChildSize + lastChildSize));

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 325);
if (middleChildSize < 0) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 326);
middleChildSize = 0;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 329);
if (middleChildSize === 0 && scrollbarPos !== 0) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 330);
scrollbarPos = widgetSize - (firstChildSize + lastChildSize) - 1;
        }

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 333);
if (duration !== 0) {
            // Position Scrollbar
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 335);
transition = {
                duration : duration
            };

            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 339);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 340);
transition.transform = translate + scrollbarPos + PX_CLOSE;
            } else {
                _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 342);
transition[dimOffset] = scrollbarPos + PX;
            }

            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 345);
scrollbar.transition(transition);

        } else {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 348);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 349);
scrollbar.setStyle(TRANSFORM, translate + scrollbarPos + PX_CLOSE);
            } else {
                _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 351);
scrollbar.setStyle(dimOffset, scrollbarPos + PX);
            }
        }

        // Resize Scrollbar Middle Child
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 356);
if (this[dimCache] !== middleChildSize) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 357);
this[dimCache] = middleChildSize;

            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 359);
if (middleChildSize > 0) {

                _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 361);
if (duration !== 0) {
                    _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 362);
transition = {
                        duration : duration             
                    };

                    _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 366);
if(NATIVE_TRANSITIONS) {
                        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 367);
transition.transform = scale + middleChildSize + CLOSE;
                    } else {
                        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 369);
transition[dim] = middleChildSize + PX;
                    }

                    _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 372);
middleChild.transition(transition);
                } else {
                    _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 374);
if (NATIVE_TRANSITIONS) {
                        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 375);
middleChild.setStyle(TRANSFORM, scale + middleChildSize + CLOSE);
                    } else {
                        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 377);
middleChild.setStyle(dim, middleChildSize + PX);
                    }
                }
    
                // Position Last Child
                _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 382);
if (!horiz || !basic) {

                    _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 384);
lastChildPosition = scrollbarSize - lastChildSize;
    
                    _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 386);
if(duration !== 0) { 
                        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 387);
transition = {
                            duration : duration
                        };
                
                        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 391);
if (NATIVE_TRANSITIONS) {
                            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 392);
transition.transform = translate + lastChildPosition + PX_CLOSE; 
                        } else {
                            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 394);
transition[dimOffset] = lastChildPosition; 
                        }

                        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 397);
lastChild.transition(transition);
                    } else {
                        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 399);
if (NATIVE_TRANSITIONS) {
                            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 400);
lastChild.setStyle(TRANSFORM, translate + lastChildPosition + PX_CLOSE); 
                        } else {
                            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 402);
lastChild.setStyle(dimOffset, lastChildPosition + PX); 
                        }
                    }
                }
            }
        }
    },

    /**
     * AOP method, invoked after the host's _uiScrollTo method, 
     * to position and resize the scroll bars
     *
     * @method _update
     * @param x {Number} The current scrollX value
     * @param y {Number} The current scrollY value
     * @param duration {Number} Number of ms of animation (optional) - used when snapping to bounds 
     * @param easing {String} Optional easing equation to use during the animation, if duration is set
     * @protected
     */
    _update: function(x, y, duration, easing) {

        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "_update", 421);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 423);
var vNode = this.get(VERTICAL_NODE),
            hNode = this.get(HORIZONTAL_NODE),
            host = this._host;
            
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 427);
duration = (duration || 0)/1000;

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 429);
if (!this._showing) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 430);
this.show();
        }

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 433);
if (host._scrollsVertical && vNode) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 434);
this._updateBar(vNode, y, duration, false);
        }

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 437);
if (host._scrollsHorizontal && hNode) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 438);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "show", 448);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 449);
this._show(true, animated);
    },

    /**
     * Hide the scroll bar indicators
     *
     * @method hide
     * @param animated {Boolean} Whether or not to animate the hiding
     */
    hide: function(animated) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "hide", 458);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 459);
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

        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "_show", 470);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 472);
var verticalNode = this.get(VERTICAL_NODE),
            horizontalNode = this.get(HORIZONTAL_NODE),

            duration = (animated) ? 0.6 : 0,
            opacity = (show) ? 1 : 0,

            transition;

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 480);
this._showing = show;

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 482);
if (this._flashTimer) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 483);
this._flashTimer.cancel();
        }

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 486);
transition = {
            duration : duration,
            opacity : opacity
        };

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 491);
if (verticalNode) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 492);
verticalNode.transition(transition);
        }

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 495);
if (horizontalNode) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 496);
horizontalNode.transition(transition);
        }
    },

    /**
     * Momentarily flash the scroll bars to indicate current scroll position
     *
     * @method flash
     */
    flash: function() {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "flash", 505);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 506);
var host = this._host;

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 508);
this.show(true);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 509);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "_setNode", 522);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 523);
var horiz = (name == HORIZONTAL_NODE);

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 525);
node = Y.one(node);

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 527);
if (node) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 528);
node.addClass(_classNames.scrollbar);
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 529);
node.addClass( (horiz) ? _classNames.scrollbarH : _classNames.scrollbarV );
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 530);
node.setData("isHoriz", horiz);
        }

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 533);
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
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", "_defaultNode", 544);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-scrollbars.js", 545);
return Y.Node.create(ScrollbarsPlugin.SCROLLBAR_TEMPLATE);
    },    

    _basic: Y.UA.ie && Y.UA.ie <= 8

});


}, '@VERSION@' ,{skinnable:true, requires:['classnamemanager', 'transition', 'plugin']});
