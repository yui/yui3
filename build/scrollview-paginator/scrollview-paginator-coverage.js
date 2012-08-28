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
_yuitest_coverage["scrollview-paginator"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "scrollview-paginator",
    code: []
};
_yuitest_coverage["scrollview-paginator"].code=["YUI.add('scrollview-paginator', function (Y, NAME) {","","/*global YUI,Y*/","","/**"," * Provides a plugin that adds pagination support to ScrollView instances"," *"," * @module scrollview-paginator"," */","var getClassName = Y.ClassNameManager.getClassName,","    SCROLLVIEW = 'scrollview',","    CLASS_HIDDEN = getClassName(SCROLLVIEW, 'hidden'),","    CLASS_PAGED = getClassName(SCROLLVIEW, 'paged'),","    UI = (Y.ScrollView) ? Y.ScrollView.UI_SRC : 'ui',","    INDEX = 'index',","    SCROLL_X = 'scrollX',","    SCROLL_Y = 'scrollY',","    TOTAL = 'total',","    HOST = 'host',","    BOUNDING_BOX = 'boundingBox',","    CONTENT_BOX = 'contentBox',","    SELECTOR = 'selector',","    FLICK = 'flick',","    DRAG = 'drag',","    DIM_X = 'x',","    DIM_Y = 'y';","","/**"," * Scrollview plugin that adds support for paging"," *"," * @class ScrollViewPaginator"," * @namespace Plugin"," * @extends Plugin.Base"," * @constructor"," */","function PaginatorPlugin() {","    PaginatorPlugin.superclass.constructor.apply(this, arguments);","}","","Y.extend(PaginatorPlugin, Y.Plugin.Base, {","","    /**","     * Designated initializer","     *","     * @method initializer","     * @param {config} Configuration object for the plugin","     */","    initializer: function (config) {","        var paginator = this,","            host = paginator.get(HOST),","            bb = host._bb,","            cb = host._cb,","            axis = 'auto';","","        // Default it to an empty object","        config = config || {};","","        if (config.axis) {","            switch (config.axis.toLowerCase()) {","                case \"x\":","                    axis = {","                        x: true,","                        y: false","                    };","                    break;","                case \"y\":","                    axis = {","                        x: false,","                        y: true","                    };","                    break;","            }","        }","","        /**","         * Contains an object that specifies if the widget will on a X or Y axis","         *","         * @property axis","         * @type Object","         * @public","         * @default auto","         */","        paginator.axis = axis;","","        // Initialize & default","        paginator.optimizeMemory = config.optimizeMemory || false;","        paginator.padding = config.padding || 1;","        paginator.cards = [];","","        // Cache some values","        paginator._bb = bb;","        paginator._cb = cb;","        paginator._host = host;","        paginator._cIndex = config.index || 0;","        paginator._prevent = new Y.Do.Prevent();","","        // Event listeners","        paginator.after('indexChange', paginator._afterIndexChange);","","        // Method listeners","        paginator.beforeHostMethod('scrollTo', paginator._beforeHostScrollTo);","        paginator.beforeHostMethod('_mousewheel', paginator._beforeHostMousewheel);","        paginator.afterHostMethod('_onGestureMoveEnd', paginator._afterHostGestureMoveEnd);","        paginator.afterHostMethod('_uiDimensionsChange', paginator._afterHostUIDimensionsChange);","        paginator.afterHostEvent('render', paginator._afterHostRender);","        paginator.afterHostEvent('scrollEnd', paginator._afterHostScrollEnded);","        paginator.afterHostMethod('syncUI', paginator._afterHostSyncUI);","    },","","    /**","     * After host render","     *","     * @method _afterHostRender","     * @param {Event.Facade}","     * @protected","     */","    _afterHostRender: function (e) {","        var paginator = this,","            bb = paginator._bb,","            host = paginator._host,","            index = paginator._cIndex,","            paginatorAxis = paginator.axis,","            pageNodes = paginator._getPageNodes(),","            size = pageNodes.size(),","            maxScrollX = paginator.cards[index].maxScrollX,","            maxScrollY = paginator.cards[index].maxScrollY;","","        if (paginatorAxis[DIM_Y]) {","            host._maxScrollX = maxScrollX;","        }","        else if (paginatorAxis[DIM_X]) {","            host._maxScrollY = maxScrollY;","        }","","        // Set the page count","        paginator.set(TOTAL, size);","","        // Jump to the index","        if (index !== 0) {","            paginator.scrollToIndex(index, 0);","        }","","        // Add the paginator class","        bb.addClass(CLASS_PAGED);","","        // paginator._optimize();","    },","","    /**","     * After host syncUI","     *","     * @method _afterHostSyncUI","     * @param {Event.Facade}","     * @protected","     */","    _afterHostSyncUI: function (e) {","        var paginator = this,","            host = paginator._host,","            hostFlick = host.get(FLICK);","","        // If paginator's 'axis' property is to be automatically determined, inherit host's property","        if (paginator.axis === 'auto') {","            paginator.axis = host.axis;","        }","","        // Don't allow flicks on the paginated axis","        if (paginator.axis[DIM_X]) {","            hostFlick.axis = DIM_Y;","            host.set(FLICK, hostFlick);","        }","        else if (paginator.axis[DIM_Y]) {","            hostFlick.axis = DIM_X;","            host.set(FLICK, hostFlick);","        }","    },","","    /**","     * After host _uiDimensionsChange","     *","     * @method _afterHostUIDimensionsChange","     * @param {Event.Facade}","     * @protected","     */","    _afterHostUIDimensionsChange: function (e) {","","        var paginator = this,","            host = paginator._host,","            bb = paginator._bb,","            widgetWidth = bb.get('offsetWidth'),","            widgetHeight = bb.get('offsetHeight'),","            pageNodes = paginator._getPageNodes(),","            size = pageNodes.size();","","        // Inefficient. Should not reinitialize every card every syncUI","        pageNodes.each(function (node, i) {","            var scrollWidth = node.get('scrollWidth'),","                scrollHeight = node.get('scrollHeight'),","                maxScrollX = Math.max(0, scrollWidth - widgetWidth),","                maxScrollY = Math.max(0, scrollHeight - widgetHeight);","","            // Don't initialize any cards that already have been.","            if (!paginator.cards[i]) {","                paginator.cards[i] = {","                    maxScrollX: maxScrollX,","                    maxScrollY: maxScrollY,","                    node: node,","                    scrollX: 0,","                    scrollY: 0","                };","            } else {","                paginator.cards[i].maxScrollX = maxScrollX;","                paginator.cards[i].maxScrollY = maxScrollY;","            }","","        });","    },","","    /**","     * Executed before host.scrollTo","     *","     * @method _beforeHostScrollTo","     * @param x {Number} The x-position to scroll to. (null for no movement)","     * @param y {Number} The y-position to scroll to. (null for no movement)","     * @param {Number} [duration] Duration, in ms, of the scroll animation (default is 0)","     * @param {String} [easing] An easing equation if duration is set","     * @param {String} [node] The node to move","     * @protected","     */","    _beforeHostScrollTo: function (x, y, duration, easing, node) {","        var paginator = this,","            host = paginator._host,","            gesture = host._gesture,","            index = paginator._cIndex,","            paginatorAxis = paginator.axis,","            gestureAxis;","","        if (gesture) {","            gestureAxis = gesture.axis;","","            // Null the opposite axis so it won't be modified by host.scrollTo","            if (gestureAxis === DIM_Y) {","                x = null;","            } else {","                y = null;","            }","","            // If they are scrolling against the specified axis, pull out the card as the node to have its own offset","            if (paginatorAxis[gestureAxis] === false) {","                node = paginator.cards[index].node;","            }","        }","","        // Return the modified argument list","        return new Y.Do.AlterArgs(\"new args\", [x, y, duration, easing, node]);","    },","","    /**","     * Executed after host._gestureMoveEnd","     * Determines if the gesture should page prev or next (if at all)","     *","     * @method _afterHostGestureMoveEnd","     * @param {Event.Facade}","     * @protected","     */","    _afterHostGestureMoveEnd: function (e) {","        var paginator = this,","            host = paginator._host,","            gesture = host._gesture,","            paginatorAxis = paginator.axis,","            gestureAxis = gesture && gesture.axis;","","        if (paginatorAxis[gestureAxis]) {","            if (gesture[(gestureAxis === DIM_X ? 'deltaX' : 'deltaY')] > 0) {","                paginator[host.rtl ? 'prev' : 'next']();","            } else {","                paginator[host.rtl ? 'next' : 'prev']();","            }","        }","    },","","    /**","     * Executed before host._mousewheel","     * Prevents mousewheel events in some conditions","     *","     * @method _beforeHostMousewheel","     * @param {Event.Facade}","     * @protected","     */","    _beforeHostMousewheel: function (e) {","        var paginator = this,","            host = paginator._host,","            bb = host._bb,","            isForward = e.wheelDelta < 0, // down (negative) is forward. @TODO Should revisit.","            paginatorAxis = paginator.axis;","","        // Set the axis for this event.","        // @TODO: This is hacky, it's not a gesture. Find a better way","        host._gesture = {","            axis: DIM_Y","        };","","        // Only if the mousewheel event occurred on a DOM node inside the BB","        if (bb.contains(e.target) && paginatorAxis[DIM_Y]) {","","            if (isForward) {","                paginator.next();","            } else {","                paginator.prev();","            }","","            // prevent browser default behavior on mousewheel","            e.preventDefault();","","            // Block host._mousewheel from running","            return paginator._prevent;","        }","    },","","    /**","     * Executes after host's 'scrollEnd' event","     * Runs cleanup operations","     *","     * @method _afterHostScrollEnded","     * @param {Event.Facade}","     * @protected","     */","    _afterHostScrollEnded: function (e) {","        var paginator = this,","            host = this._host,","            index = paginator._cIndex,","            scrollX = host.get(SCROLL_X),","            scrollY = host.get(SCROLL_Y),","            paginatorAxis = paginator.axis;","","        if (paginatorAxis[DIM_Y]) {","            paginator.cards[index].scrollX = scrollX;","        } else {","            paginator.cards[index].scrollY = scrollY;","        }","","        paginator._optimize();","    },","","    /**","     * index attr change handler","     *","     * @method _afterIndexChange","     * @param {Event.Facade}","     * @protected","     */","    _afterIndexChange: function (e) {","        var paginator = this,","            host = this._host,","            index = e.newVal,","            maxScrollX = paginator.cards[index].maxScrollX,","            maxScrollY = paginator.cards[index].maxScrollY,","            gesture = host._gesture,","            gestureAxis = gesture && gesture.axis;","","        if (gestureAxis === DIM_Y) {","            host._maxScrollX = maxScrollX;","            host.set(SCROLL_X, paginator.cards[index].scrollX, { src: UI });","        } else if (gestureAxis === DIM_X) {","            host._maxScrollY = maxScrollY;","            host.set(SCROLL_Y, paginator.cards[index].scrollY, { src: UI });","        }","","        // Cache the new index value","        paginator._cIndex = index;","","        if (e.src !== UI) {","            paginator.scrollToIndex(index);","        }","    },","","    /**","     * Hides page nodes not near the viewport","     *","     * @method _optimize","     * @protected","     */","    _optimize: function () {","","        if (!this.optimizeMemory) {","            return false;","        }","","        var paginator = this,","            host = paginator._host,","            optimizeMemory = paginator.optimizeMemory,","            currentIndex = paginator._cIndex,","            pageNodes;","","        // Show the pages in/near the viewport & hide the rest","        pageNodes = paginator._getStage(currentIndex);","        paginator._showNodes(pageNodes.visible);","        paginator._hideNodes(pageNodes.hidden);","    },","","    /**","     * Determines which nodes should be visible, and which should be hidden.","     *","     * @method _getStage","     * @param index {Number} The page index # intended to be in focus.","     * @returns {object}","     * @protected","     */","    _getStage: function (index) {","        var padding = this.padding,","            pageNodes = this._getPageNodes(),","            pageCount = this.get(TOTAL),","            start = Math.max(0, index - padding),","            end = Math.min(pageCount, index + 1 + padding); // noninclusive","","        return {","            visible: pageNodes.splice(start, end - start),","            hidden: pageNodes","        };","    },","","    /**","     * A utility method to show node(s)","     *","     * @method _showNodes","     * @param nodeList {Object} The list of nodes to show","     * @protected","     */","    _showNodes: function (nodeList) {","        if (nodeList) {","            nodeList.removeClass(CLASS_HIDDEN).setStyle('visibility', '');","        }","    },","","    /**","     * A utility method to hide node(s)","     *","     * @method _hideNodes","     * @param nodeList {Object} The list of nodes to hide","     * @protected","     */","    _hideNodes: function (nodeList) {","        if (nodeList) {","            nodeList.addClass(CLASS_HIDDEN).setStyle('visibility', 'hidden');","        }","    },","","    /**","     * Gets a nodeList for the \"pages\"","     *","     * @method _getPageNodes","     * @protected","     * @returns {nodeList}","     */","    _getPageNodes: function () {","        var paginator = this,","            host = paginator._host,","            cb = host._cb,","            pageSelector = paginator.get(SELECTOR),","            pageNodes = pageSelector ? cb.all(pageSelector) : cb.get('children');","","        return pageNodes;","    },","","    /**","     * Scroll to the next page in the scrollview, with animation","     *","     * @method next","     */","    next: function () {","        var paginator = this,","            index = paginator._cIndex,","            target = index + 1,","            total = this.get(TOTAL);","","        if (target >= total) {","            return;","        }","","        // Update the index","        paginator.set(INDEX, target);","    },","","    /**","     * Scroll to the previous page in the scrollview, with animation","     *","     * @method prev","     */","    prev: function () {","        var paginator = this,","            index = paginator._cIndex,","            target = index - 1;","","        if (target < 0) {","            return;","        }","","        // Update the index","        paginator.set(INDEX, target);","    },","    ","    /** ","     * @deprecated","     */","    scrollTo: function () {","        return this.scrollToIndex.apply(this, arguments);","    },","","    /**","     * Scroll to a given page in the scrollview","     *","     * @method scrollToIndex","     * @param index {Number} The index of the page to scroll to","     * @param {Number} [duration] The number of ms the animation should last","     * @param {String} [easing] The timing function to use in the animation","     */","    scrollToIndex: function (index, duration, easing) {","","        var paginator = this,","            host = paginator._host,","            pageNode = paginator._getPageNodes().item(index),","            scrollAxis = (paginator.axis[DIM_X] ? SCROLL_X : SCROLL_Y),","            scrollOffset = pageNode.get(scrollAxis === SCROLL_X ? 'offsetLeft' : 'offsetTop');","","        duration = (duration !== undefined) ? duration : PaginatorPlugin.TRANSITION.duration;","        easing = (easing !== undefined) ? duration : PaginatorPlugin.TRANSITION.easing;","","        // Set the index ATTR to the specified index value","        paginator.set(INDEX, index);","","        // Makes sure the viewport nodes are visible","        paginator._showNodes(pageNode);","","        // Scroll to the offset","        host.set(scrollAxis, scrollOffset, {","            duration: duration,","            easing: easing","        });","    }","    ","    // End prototype properties","","}, {","    ","    // Static properties","","    /**","     * The identity of the plugin","     *","     * @property NAME","     * @type String","     * @default 'pluginScrollViewPaginator'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'pluginScrollViewPaginator',","","    /**","     * The namespace on which the plugin will reside","     *","     * @property NS","     * @type String","     * @default 'pages'","     * @static","     */","    NS: 'pages',","","    /**","     * The default attribute configuration for the plugin","     *","     * @property ATTRS","     * @type {Object}","     * @static","     */","    ATTRS: {","","        /**","         * CSS selector for a page inside the scrollview. The scrollview","         * will snap to the closest page.","         *","         * @attribute selector","         * @type {String}","         * @default null","         */","        selector: {","            value: null","        },","","        /**","         * The active page number for a paged scrollview","         *","         * @attribute index","         * @type {Number}","         * @default 0","         */","        index: {","            value: 0,","            validator: function (val) {","                // TODO: Remove this?","                // return val >= 0 && val < this.get(TOTAL);","                return true;","            }","        },","","        /**","         * The total number of pages","         *","         * @attribute total","         * @type {Number}","         * @default 0","         */","        total: {","            value: 0","        }","    },","        ","    /**","     * The default snap to current duration and easing values used on scroll end.","     *","     * @property SNAP_TO_CURRENT","     * @static","     */","    TRANSITION: {","        duration: 300,","        easing: 'ease-out'","    }","","    // End static properties","","});","","Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;","","}, '@VERSION@', {\"requires\": [\"plugin\", \"classnamemanager\"]});"];
_yuitest_coverage["scrollview-paginator"].lines = {"1":0,"10":0,"36":0,"37":0,"40":0,"49":0,"56":0,"58":0,"59":0,"61":0,"65":0,"67":0,"71":0,"83":0,"86":0,"87":0,"88":0,"91":0,"92":0,"93":0,"94":0,"95":0,"98":0,"101":0,"102":0,"103":0,"104":0,"105":0,"106":0,"107":0,"118":0,"128":0,"129":0,"131":0,"132":0,"136":0,"139":0,"140":0,"144":0,"157":0,"162":0,"163":0,"167":0,"168":0,"169":0,"171":0,"172":0,"173":0,"186":0,"195":0,"196":0,"202":0,"203":0,"211":0,"212":0,"230":0,"237":0,"238":0,"241":0,"242":0,"244":0,"248":0,"249":0,"254":0,"266":0,"272":0,"273":0,"274":0,"276":0,"290":0,"298":0,"303":0,"305":0,"306":0,"308":0,"312":0,"315":0,"328":0,"335":0,"336":0,"338":0,"341":0,"352":0,"360":0,"361":0,"362":0,"363":0,"364":0,"365":0,"369":0,"371":0,"372":0,"384":0,"385":0,"388":0,"395":0,"396":0,"397":0,"409":0,"415":0,"429":0,"430":0,"442":0,"443":0,"455":0,"461":0,"470":0,"475":0,"476":0,"480":0,"489":0,"493":0,"494":0,"498":0,"505":0,"518":0,"524":0,"525":0,"528":0,"531":0,"534":0,"601":0,"632":0};
_yuitest_coverage["scrollview-paginator"].functions = {"PaginatorPlugin:36":0,"initializer:48":0,"_afterHostRender:117":0,"_afterHostSyncUI:156":0,"(anonymous 2):195":0,"_afterHostUIDimensionsChange:184":0,"_beforeHostScrollTo:229":0,"_afterHostGestureMoveEnd:265":0,"_beforeHostMousewheel:289":0,"_afterHostScrollEnded:327":0,"_afterIndexChange:351":0,"_optimize:382":0,"_getStage:408":0,"_showNodes:428":0,"_hideNodes:441":0,"_getPageNodes:454":0,"next:469":0,"prev:488":0,"scrollTo:504":0,"scrollToIndex:516":0,"validator:598":0,"(anonymous 1):1":0};
_yuitest_coverage["scrollview-paginator"].coveredLines = 123;
_yuitest_coverage["scrollview-paginator"].coveredFunctions = 22;
_yuitest_coverline("scrollview-paginator", 1);
YUI.add('scrollview-paginator', function (Y, NAME) {

/*global YUI,Y*/

/**
 * Provides a plugin that adds pagination support to ScrollView instances
 *
 * @module scrollview-paginator
 */
_yuitest_coverfunc("scrollview-paginator", "(anonymous 1)", 1);
_yuitest_coverline("scrollview-paginator", 10);
var getClassName = Y.ClassNameManager.getClassName,
    SCROLLVIEW = 'scrollview',
    CLASS_HIDDEN = getClassName(SCROLLVIEW, 'hidden'),
    CLASS_PAGED = getClassName(SCROLLVIEW, 'paged'),
    UI = (Y.ScrollView) ? Y.ScrollView.UI_SRC : 'ui',
    INDEX = 'index',
    SCROLL_X = 'scrollX',
    SCROLL_Y = 'scrollY',
    TOTAL = 'total',
    HOST = 'host',
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX = 'contentBox',
    SELECTOR = 'selector',
    FLICK = 'flick',
    DRAG = 'drag',
    DIM_X = 'x',
    DIM_Y = 'y';

/**
 * Scrollview plugin that adds support for paging
 *
 * @class ScrollViewPaginator
 * @namespace Plugin
 * @extends Plugin.Base
 * @constructor
 */
_yuitest_coverline("scrollview-paginator", 36);
function PaginatorPlugin() {
    _yuitest_coverfunc("scrollview-paginator", "PaginatorPlugin", 36);
_yuitest_coverline("scrollview-paginator", 37);
PaginatorPlugin.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("scrollview-paginator", 40);
Y.extend(PaginatorPlugin, Y.Plugin.Base, {

    /**
     * Designated initializer
     *
     * @method initializer
     * @param {config} Configuration object for the plugin
     */
    initializer: function (config) {
        _yuitest_coverfunc("scrollview-paginator", "initializer", 48);
_yuitest_coverline("scrollview-paginator", 49);
var paginator = this,
            host = paginator.get(HOST),
            bb = host._bb,
            cb = host._cb,
            axis = 'auto';

        // Default it to an empty object
        _yuitest_coverline("scrollview-paginator", 56);
config = config || {};

        _yuitest_coverline("scrollview-paginator", 58);
if (config.axis) {
            _yuitest_coverline("scrollview-paginator", 59);
switch (config.axis.toLowerCase()) {
                case "x":
                    _yuitest_coverline("scrollview-paginator", 61);
axis = {
                        x: true,
                        y: false
                    };
                    _yuitest_coverline("scrollview-paginator", 65);
break;
                case "y":
                    _yuitest_coverline("scrollview-paginator", 67);
axis = {
                        x: false,
                        y: true
                    };
                    _yuitest_coverline("scrollview-paginator", 71);
break;
            }
        }

        /**
         * Contains an object that specifies if the widget will on a X or Y axis
         *
         * @property axis
         * @type Object
         * @public
         * @default auto
         */
        _yuitest_coverline("scrollview-paginator", 83);
paginator.axis = axis;

        // Initialize & default
        _yuitest_coverline("scrollview-paginator", 86);
paginator.optimizeMemory = config.optimizeMemory || false;
        _yuitest_coverline("scrollview-paginator", 87);
paginator.padding = config.padding || 1;
        _yuitest_coverline("scrollview-paginator", 88);
paginator.cards = [];

        // Cache some values
        _yuitest_coverline("scrollview-paginator", 91);
paginator._bb = bb;
        _yuitest_coverline("scrollview-paginator", 92);
paginator._cb = cb;
        _yuitest_coverline("scrollview-paginator", 93);
paginator._host = host;
        _yuitest_coverline("scrollview-paginator", 94);
paginator._cIndex = config.index || 0;
        _yuitest_coverline("scrollview-paginator", 95);
paginator._prevent = new Y.Do.Prevent();

        // Event listeners
        _yuitest_coverline("scrollview-paginator", 98);
paginator.after('indexChange', paginator._afterIndexChange);

        // Method listeners
        _yuitest_coverline("scrollview-paginator", 101);
paginator.beforeHostMethod('scrollTo', paginator._beforeHostScrollTo);
        _yuitest_coverline("scrollview-paginator", 102);
paginator.beforeHostMethod('_mousewheel', paginator._beforeHostMousewheel);
        _yuitest_coverline("scrollview-paginator", 103);
paginator.afterHostMethod('_onGestureMoveEnd', paginator._afterHostGestureMoveEnd);
        _yuitest_coverline("scrollview-paginator", 104);
paginator.afterHostMethod('_uiDimensionsChange', paginator._afterHostUIDimensionsChange);
        _yuitest_coverline("scrollview-paginator", 105);
paginator.afterHostEvent('render', paginator._afterHostRender);
        _yuitest_coverline("scrollview-paginator", 106);
paginator.afterHostEvent('scrollEnd', paginator._afterHostScrollEnded);
        _yuitest_coverline("scrollview-paginator", 107);
paginator.afterHostMethod('syncUI', paginator._afterHostSyncUI);
    },

    /**
     * After host render
     *
     * @method _afterHostRender
     * @param {Event.Facade}
     * @protected
     */
    _afterHostRender: function (e) {
        _yuitest_coverfunc("scrollview-paginator", "_afterHostRender", 117);
_yuitest_coverline("scrollview-paginator", 118);
var paginator = this,
            bb = paginator._bb,
            host = paginator._host,
            index = paginator._cIndex,
            paginatorAxis = paginator.axis,
            pageNodes = paginator._getPageNodes(),
            size = pageNodes.size(),
            maxScrollX = paginator.cards[index].maxScrollX,
            maxScrollY = paginator.cards[index].maxScrollY;

        _yuitest_coverline("scrollview-paginator", 128);
if (paginatorAxis[DIM_Y]) {
            _yuitest_coverline("scrollview-paginator", 129);
host._maxScrollX = maxScrollX;
        }
        else {_yuitest_coverline("scrollview-paginator", 131);
if (paginatorAxis[DIM_X]) {
            _yuitest_coverline("scrollview-paginator", 132);
host._maxScrollY = maxScrollY;
        }}

        // Set the page count
        _yuitest_coverline("scrollview-paginator", 136);
paginator.set(TOTAL, size);

        // Jump to the index
        _yuitest_coverline("scrollview-paginator", 139);
if (index !== 0) {
            _yuitest_coverline("scrollview-paginator", 140);
paginator.scrollToIndex(index, 0);
        }

        // Add the paginator class
        _yuitest_coverline("scrollview-paginator", 144);
bb.addClass(CLASS_PAGED);

        // paginator._optimize();
    },

    /**
     * After host syncUI
     *
     * @method _afterHostSyncUI
     * @param {Event.Facade}
     * @protected
     */
    _afterHostSyncUI: function (e) {
        _yuitest_coverfunc("scrollview-paginator", "_afterHostSyncUI", 156);
_yuitest_coverline("scrollview-paginator", 157);
var paginator = this,
            host = paginator._host,
            hostFlick = host.get(FLICK);

        // If paginator's 'axis' property is to be automatically determined, inherit host's property
        _yuitest_coverline("scrollview-paginator", 162);
if (paginator.axis === 'auto') {
            _yuitest_coverline("scrollview-paginator", 163);
paginator.axis = host.axis;
        }

        // Don't allow flicks on the paginated axis
        _yuitest_coverline("scrollview-paginator", 167);
if (paginator.axis[DIM_X]) {
            _yuitest_coverline("scrollview-paginator", 168);
hostFlick.axis = DIM_Y;
            _yuitest_coverline("scrollview-paginator", 169);
host.set(FLICK, hostFlick);
        }
        else {_yuitest_coverline("scrollview-paginator", 171);
if (paginator.axis[DIM_Y]) {
            _yuitest_coverline("scrollview-paginator", 172);
hostFlick.axis = DIM_X;
            _yuitest_coverline("scrollview-paginator", 173);
host.set(FLICK, hostFlick);
        }}
    },

    /**
     * After host _uiDimensionsChange
     *
     * @method _afterHostUIDimensionsChange
     * @param {Event.Facade}
     * @protected
     */
    _afterHostUIDimensionsChange: function (e) {

        _yuitest_coverfunc("scrollview-paginator", "_afterHostUIDimensionsChange", 184);
_yuitest_coverline("scrollview-paginator", 186);
var paginator = this,
            host = paginator._host,
            bb = paginator._bb,
            widgetWidth = bb.get('offsetWidth'),
            widgetHeight = bb.get('offsetHeight'),
            pageNodes = paginator._getPageNodes(),
            size = pageNodes.size();

        // Inefficient. Should not reinitialize every card every syncUI
        _yuitest_coverline("scrollview-paginator", 195);
pageNodes.each(function (node, i) {
            _yuitest_coverfunc("scrollview-paginator", "(anonymous 2)", 195);
_yuitest_coverline("scrollview-paginator", 196);
var scrollWidth = node.get('scrollWidth'),
                scrollHeight = node.get('scrollHeight'),
                maxScrollX = Math.max(0, scrollWidth - widgetWidth),
                maxScrollY = Math.max(0, scrollHeight - widgetHeight);

            // Don't initialize any cards that already have been.
            _yuitest_coverline("scrollview-paginator", 202);
if (!paginator.cards[i]) {
                _yuitest_coverline("scrollview-paginator", 203);
paginator.cards[i] = {
                    maxScrollX: maxScrollX,
                    maxScrollY: maxScrollY,
                    node: node,
                    scrollX: 0,
                    scrollY: 0
                };
            } else {
                _yuitest_coverline("scrollview-paginator", 211);
paginator.cards[i].maxScrollX = maxScrollX;
                _yuitest_coverline("scrollview-paginator", 212);
paginator.cards[i].maxScrollY = maxScrollY;
            }

        });
    },

    /**
     * Executed before host.scrollTo
     *
     * @method _beforeHostScrollTo
     * @param x {Number} The x-position to scroll to. (null for no movement)
     * @param y {Number} The y-position to scroll to. (null for no movement)
     * @param {Number} [duration] Duration, in ms, of the scroll animation (default is 0)
     * @param {String} [easing] An easing equation if duration is set
     * @param {String} [node] The node to move
     * @protected
     */
    _beforeHostScrollTo: function (x, y, duration, easing, node) {
        _yuitest_coverfunc("scrollview-paginator", "_beforeHostScrollTo", 229);
_yuitest_coverline("scrollview-paginator", 230);
var paginator = this,
            host = paginator._host,
            gesture = host._gesture,
            index = paginator._cIndex,
            paginatorAxis = paginator.axis,
            gestureAxis;

        _yuitest_coverline("scrollview-paginator", 237);
if (gesture) {
            _yuitest_coverline("scrollview-paginator", 238);
gestureAxis = gesture.axis;

            // Null the opposite axis so it won't be modified by host.scrollTo
            _yuitest_coverline("scrollview-paginator", 241);
if (gestureAxis === DIM_Y) {
                _yuitest_coverline("scrollview-paginator", 242);
x = null;
            } else {
                _yuitest_coverline("scrollview-paginator", 244);
y = null;
            }

            // If they are scrolling against the specified axis, pull out the card as the node to have its own offset
            _yuitest_coverline("scrollview-paginator", 248);
if (paginatorAxis[gestureAxis] === false) {
                _yuitest_coverline("scrollview-paginator", 249);
node = paginator.cards[index].node;
            }
        }

        // Return the modified argument list
        _yuitest_coverline("scrollview-paginator", 254);
return new Y.Do.AlterArgs("new args", [x, y, duration, easing, node]);
    },

    /**
     * Executed after host._gestureMoveEnd
     * Determines if the gesture should page prev or next (if at all)
     *
     * @method _afterHostGestureMoveEnd
     * @param {Event.Facade}
     * @protected
     */
    _afterHostGestureMoveEnd: function (e) {
        _yuitest_coverfunc("scrollview-paginator", "_afterHostGestureMoveEnd", 265);
_yuitest_coverline("scrollview-paginator", 266);
var paginator = this,
            host = paginator._host,
            gesture = host._gesture,
            paginatorAxis = paginator.axis,
            gestureAxis = gesture && gesture.axis;

        _yuitest_coverline("scrollview-paginator", 272);
if (paginatorAxis[gestureAxis]) {
            _yuitest_coverline("scrollview-paginator", 273);
if (gesture[(gestureAxis === DIM_X ? 'deltaX' : 'deltaY')] > 0) {
                _yuitest_coverline("scrollview-paginator", 274);
paginator[host.rtl ? 'prev' : 'next']();
            } else {
                _yuitest_coverline("scrollview-paginator", 276);
paginator[host.rtl ? 'next' : 'prev']();
            }
        }
    },

    /**
     * Executed before host._mousewheel
     * Prevents mousewheel events in some conditions
     *
     * @method _beforeHostMousewheel
     * @param {Event.Facade}
     * @protected
     */
    _beforeHostMousewheel: function (e) {
        _yuitest_coverfunc("scrollview-paginator", "_beforeHostMousewheel", 289);
_yuitest_coverline("scrollview-paginator", 290);
var paginator = this,
            host = paginator._host,
            bb = host._bb,
            isForward = e.wheelDelta < 0, // down (negative) is forward. @TODO Should revisit.
            paginatorAxis = paginator.axis;

        // Set the axis for this event.
        // @TODO: This is hacky, it's not a gesture. Find a better way
        _yuitest_coverline("scrollview-paginator", 298);
host._gesture = {
            axis: DIM_Y
        };

        // Only if the mousewheel event occurred on a DOM node inside the BB
        _yuitest_coverline("scrollview-paginator", 303);
if (bb.contains(e.target) && paginatorAxis[DIM_Y]) {

            _yuitest_coverline("scrollview-paginator", 305);
if (isForward) {
                _yuitest_coverline("scrollview-paginator", 306);
paginator.next();
            } else {
                _yuitest_coverline("scrollview-paginator", 308);
paginator.prev();
            }

            // prevent browser default behavior on mousewheel
            _yuitest_coverline("scrollview-paginator", 312);
e.preventDefault();

            // Block host._mousewheel from running
            _yuitest_coverline("scrollview-paginator", 315);
return paginator._prevent;
        }
    },

    /**
     * Executes after host's 'scrollEnd' event
     * Runs cleanup operations
     *
     * @method _afterHostScrollEnded
     * @param {Event.Facade}
     * @protected
     */
    _afterHostScrollEnded: function (e) {
        _yuitest_coverfunc("scrollview-paginator", "_afterHostScrollEnded", 327);
_yuitest_coverline("scrollview-paginator", 328);
var paginator = this,
            host = this._host,
            index = paginator._cIndex,
            scrollX = host.get(SCROLL_X),
            scrollY = host.get(SCROLL_Y),
            paginatorAxis = paginator.axis;

        _yuitest_coverline("scrollview-paginator", 335);
if (paginatorAxis[DIM_Y]) {
            _yuitest_coverline("scrollview-paginator", 336);
paginator.cards[index].scrollX = scrollX;
        } else {
            _yuitest_coverline("scrollview-paginator", 338);
paginator.cards[index].scrollY = scrollY;
        }

        _yuitest_coverline("scrollview-paginator", 341);
paginator._optimize();
    },

    /**
     * index attr change handler
     *
     * @method _afterIndexChange
     * @param {Event.Facade}
     * @protected
     */
    _afterIndexChange: function (e) {
        _yuitest_coverfunc("scrollview-paginator", "_afterIndexChange", 351);
_yuitest_coverline("scrollview-paginator", 352);
var paginator = this,
            host = this._host,
            index = e.newVal,
            maxScrollX = paginator.cards[index].maxScrollX,
            maxScrollY = paginator.cards[index].maxScrollY,
            gesture = host._gesture,
            gestureAxis = gesture && gesture.axis;

        _yuitest_coverline("scrollview-paginator", 360);
if (gestureAxis === DIM_Y) {
            _yuitest_coverline("scrollview-paginator", 361);
host._maxScrollX = maxScrollX;
            _yuitest_coverline("scrollview-paginator", 362);
host.set(SCROLL_X, paginator.cards[index].scrollX, { src: UI });
        } else {_yuitest_coverline("scrollview-paginator", 363);
if (gestureAxis === DIM_X) {
            _yuitest_coverline("scrollview-paginator", 364);
host._maxScrollY = maxScrollY;
            _yuitest_coverline("scrollview-paginator", 365);
host.set(SCROLL_Y, paginator.cards[index].scrollY, { src: UI });
        }}

        // Cache the new index value
        _yuitest_coverline("scrollview-paginator", 369);
paginator._cIndex = index;

        _yuitest_coverline("scrollview-paginator", 371);
if (e.src !== UI) {
            _yuitest_coverline("scrollview-paginator", 372);
paginator.scrollToIndex(index);
        }
    },

    /**
     * Hides page nodes not near the viewport
     *
     * @method _optimize
     * @protected
     */
    _optimize: function () {

        _yuitest_coverfunc("scrollview-paginator", "_optimize", 382);
_yuitest_coverline("scrollview-paginator", 384);
if (!this.optimizeMemory) {
            _yuitest_coverline("scrollview-paginator", 385);
return false;
        }

        _yuitest_coverline("scrollview-paginator", 388);
var paginator = this,
            host = paginator._host,
            optimizeMemory = paginator.optimizeMemory,
            currentIndex = paginator._cIndex,
            pageNodes;

        // Show the pages in/near the viewport & hide the rest
        _yuitest_coverline("scrollview-paginator", 395);
pageNodes = paginator._getStage(currentIndex);
        _yuitest_coverline("scrollview-paginator", 396);
paginator._showNodes(pageNodes.visible);
        _yuitest_coverline("scrollview-paginator", 397);
paginator._hideNodes(pageNodes.hidden);
    },

    /**
     * Determines which nodes should be visible, and which should be hidden.
     *
     * @method _getStage
     * @param index {Number} The page index # intended to be in focus.
     * @returns {object}
     * @protected
     */
    _getStage: function (index) {
        _yuitest_coverfunc("scrollview-paginator", "_getStage", 408);
_yuitest_coverline("scrollview-paginator", 409);
var padding = this.padding,
            pageNodes = this._getPageNodes(),
            pageCount = this.get(TOTAL),
            start = Math.max(0, index - padding),
            end = Math.min(pageCount, index + 1 + padding); // noninclusive

        _yuitest_coverline("scrollview-paginator", 415);
return {
            visible: pageNodes.splice(start, end - start),
            hidden: pageNodes
        };
    },

    /**
     * A utility method to show node(s)
     *
     * @method _showNodes
     * @param nodeList {Object} The list of nodes to show
     * @protected
     */
    _showNodes: function (nodeList) {
        _yuitest_coverfunc("scrollview-paginator", "_showNodes", 428);
_yuitest_coverline("scrollview-paginator", 429);
if (nodeList) {
            _yuitest_coverline("scrollview-paginator", 430);
nodeList.removeClass(CLASS_HIDDEN).setStyle('visibility', '');
        }
    },

    /**
     * A utility method to hide node(s)
     *
     * @method _hideNodes
     * @param nodeList {Object} The list of nodes to hide
     * @protected
     */
    _hideNodes: function (nodeList) {
        _yuitest_coverfunc("scrollview-paginator", "_hideNodes", 441);
_yuitest_coverline("scrollview-paginator", 442);
if (nodeList) {
            _yuitest_coverline("scrollview-paginator", 443);
nodeList.addClass(CLASS_HIDDEN).setStyle('visibility', 'hidden');
        }
    },

    /**
     * Gets a nodeList for the "pages"
     *
     * @method _getPageNodes
     * @protected
     * @returns {nodeList}
     */
    _getPageNodes: function () {
        _yuitest_coverfunc("scrollview-paginator", "_getPageNodes", 454);
_yuitest_coverline("scrollview-paginator", 455);
var paginator = this,
            host = paginator._host,
            cb = host._cb,
            pageSelector = paginator.get(SELECTOR),
            pageNodes = pageSelector ? cb.all(pageSelector) : cb.get('children');

        _yuitest_coverline("scrollview-paginator", 461);
return pageNodes;
    },

    /**
     * Scroll to the next page in the scrollview, with animation
     *
     * @method next
     */
    next: function () {
        _yuitest_coverfunc("scrollview-paginator", "next", 469);
_yuitest_coverline("scrollview-paginator", 470);
var paginator = this,
            index = paginator._cIndex,
            target = index + 1,
            total = this.get(TOTAL);

        _yuitest_coverline("scrollview-paginator", 475);
if (target >= total) {
            _yuitest_coverline("scrollview-paginator", 476);
return;
        }

        // Update the index
        _yuitest_coverline("scrollview-paginator", 480);
paginator.set(INDEX, target);
    },

    /**
     * Scroll to the previous page in the scrollview, with animation
     *
     * @method prev
     */
    prev: function () {
        _yuitest_coverfunc("scrollview-paginator", "prev", 488);
_yuitest_coverline("scrollview-paginator", 489);
var paginator = this,
            index = paginator._cIndex,
            target = index - 1;

        _yuitest_coverline("scrollview-paginator", 493);
if (target < 0) {
            _yuitest_coverline("scrollview-paginator", 494);
return;
        }

        // Update the index
        _yuitest_coverline("scrollview-paginator", 498);
paginator.set(INDEX, target);
    },
    
    /** 
     * @deprecated
     */
    scrollTo: function () {
        _yuitest_coverfunc("scrollview-paginator", "scrollTo", 504);
_yuitest_coverline("scrollview-paginator", 505);
return this.scrollToIndex.apply(this, arguments);
    },

    /**
     * Scroll to a given page in the scrollview
     *
     * @method scrollToIndex
     * @param index {Number} The index of the page to scroll to
     * @param {Number} [duration] The number of ms the animation should last
     * @param {String} [easing] The timing function to use in the animation
     */
    scrollToIndex: function (index, duration, easing) {

        _yuitest_coverfunc("scrollview-paginator", "scrollToIndex", 516);
_yuitest_coverline("scrollview-paginator", 518);
var paginator = this,
            host = paginator._host,
            pageNode = paginator._getPageNodes().item(index),
            scrollAxis = (paginator.axis[DIM_X] ? SCROLL_X : SCROLL_Y),
            scrollOffset = pageNode.get(scrollAxis === SCROLL_X ? 'offsetLeft' : 'offsetTop');

        _yuitest_coverline("scrollview-paginator", 524);
duration = (duration !== undefined) ? duration : PaginatorPlugin.TRANSITION.duration;
        _yuitest_coverline("scrollview-paginator", 525);
easing = (easing !== undefined) ? duration : PaginatorPlugin.TRANSITION.easing;

        // Set the index ATTR to the specified index value
        _yuitest_coverline("scrollview-paginator", 528);
paginator.set(INDEX, index);

        // Makes sure the viewport nodes are visible
        _yuitest_coverline("scrollview-paginator", 531);
paginator._showNodes(pageNode);

        // Scroll to the offset
        _yuitest_coverline("scrollview-paginator", 534);
host.set(scrollAxis, scrollOffset, {
            duration: duration,
            easing: easing
        });
    }
    
    // End prototype properties

}, {
    
    // Static properties

    /**
     * The identity of the plugin
     *
     * @property NAME
     * @type String
     * @default 'pluginScrollViewPaginator'
     * @readOnly
     * @protected
     * @static
     */
    NAME: 'pluginScrollViewPaginator',

    /**
     * The namespace on which the plugin will reside
     *
     * @property NS
     * @type String
     * @default 'pages'
     * @static
     */
    NS: 'pages',

    /**
     * The default attribute configuration for the plugin
     *
     * @property ATTRS
     * @type {Object}
     * @static
     */
    ATTRS: {

        /**
         * CSS selector for a page inside the scrollview. The scrollview
         * will snap to the closest page.
         *
         * @attribute selector
         * @type {String}
         * @default null
         */
        selector: {
            value: null
        },

        /**
         * The active page number for a paged scrollview
         *
         * @attribute index
         * @type {Number}
         * @default 0
         */
        index: {
            value: 0,
            validator: function (val) {
                // TODO: Remove this?
                // return val >= 0 && val < this.get(TOTAL);
                _yuitest_coverfunc("scrollview-paginator", "validator", 598);
_yuitest_coverline("scrollview-paginator", 601);
return true;
            }
        },

        /**
         * The total number of pages
         *
         * @attribute total
         * @type {Number}
         * @default 0
         */
        total: {
            value: 0
        }
    },
        
    /**
     * The default snap to current duration and easing values used on scroll end.
     *
     * @property SNAP_TO_CURRENT
     * @static
     */
    TRANSITION: {
        duration: 300,
        easing: 'ease-out'
    }

    // End static properties

});

_yuitest_coverline("scrollview-paginator", 632);
Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;

}, '@VERSION@', {"requires": ["plugin", "classnamemanager"]});
