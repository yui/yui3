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
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/scrollview-paginator/scrollview-paginator.js",
    code: []
};
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].code=["YUI.add('scrollview-paginator', function (Y, NAME) {","","/**"," * Provides a plugin that adds pagination support to ScrollView instances"," *"," * @module scrollview-paginator"," */","var getClassName = Y.ClassNameManager.getClassName,","    SCROLLVIEW = 'scrollview',","    CLASS_HIDDEN = getClassName(SCROLLVIEW, 'hidden'),","    CLASS_PAGED = getClassName(SCROLLVIEW, 'paged'),","    UI = (Y.ScrollView) ? Y.ScrollView.UI_SRC : 'ui',","    INDEX = 'index',","    SCROLL_X = 'scrollX',","    SCROLL_Y = 'scrollY',","    TOTAL = 'total',","    HOST = 'host',","    BOUNDING_BOX = 'boundingBox',","    CONTENT_BOX = 'contentBox',","    SELECTOR = 'selector',","    FLICK = 'flick',","    DRAG = 'drag',","    AXIS = 'axis',","    DIM_X = 'x',","    DIM_Y = 'y';","","/**"," * Scrollview plugin that adds support for paging"," *"," * @class ScrollViewPaginator"," * @namespace Plugin"," * @extends Plugin.Base"," * @constructor"," */","function PaginatorPlugin() {","    PaginatorPlugin.superclass.constructor.apply(this, arguments);","}","","Y.extend(PaginatorPlugin, Y.Plugin.Base, {","","    /**","     * Designated initializer","     *","     * @method initializer","     * @param {config} Configuration object for the plugin","     */","    initializer: function (config) {","        var paginator = this,","            host = paginator.get(HOST);","","        // Initialize & default","        paginator._pageDims = [];","        paginator._pageBuffer = 1;","        paginator._optimizeMemory = false;","","        // Cache some values","        paginator._host = host;","        paginator._bb = host._bb;","        paginator._cb = host._cb;","        paginator._cIndex = paginator.get(INDEX);","        paginator._cAxis = paginator.get(AXIS);","","        // Apply configs","        if (config._optimizeMemory) {","            paginator._optimizeMemory = config._optimizeMemory;","        }","","        if (config._pageBuffer) {","            paginator._pageBuffer = config._pageBuffer;","        }","","        // Attach event bindings","        paginator._bindAttrs();","    },","","    /**","     * ","     *","     * @method _bindAttrs","     * @private","     */","    _bindAttrs: function () {","        var paginator = this;","","        // Event listeners","        paginator.after({","            'indexChange': paginator._afterIndexChange,","            'axisChange': paginator._afterAxisChange","        });","","        // Host method listeners","        paginator.beforeHostMethod('scrollTo', paginator._beforeHostScrollTo);","        paginator.beforeHostMethod('_mousewheel', paginator._beforeHostMousewheel);","        paginator.beforeHostMethod('_flick', paginator._beforeHostFlick);","        paginator.afterHostMethod('_onGestureMoveEnd', paginator._afterHostGestureMoveEnd);","        paginator.afterHostMethod('_uiDimensionsChange', paginator._afterHostUIDimensionsChange);","        paginator.afterHostMethod('syncUI', paginator._afterHostSyncUI);","        ","        // Host event listeners","        paginator.afterHostEvent('render', paginator._afterHostRender);","        paginator.afterHostEvent('scrollEnd', paginator._afterHostScrollEnded);","    },","","    /**","     * After host render","     *","     * @method _afterHostRender","     * @param {Event.Facade}","     * @protected","     */","    _afterHostRender: function (e) {","        var paginator = this,","            bb = paginator._bb,","            host = paginator._host,","            index = paginator._cIndex,","            paginatorAxis = paginator._cAxis,","            pageNodes = paginator._getPageNodes(),","            size = pageNodes.size(),","            maxScrollX = paginator._pageDims[index].maxScrollX,","            maxScrollY = paginator._pageDims[index].maxScrollY;","","        if (paginatorAxis[DIM_Y]) {","            host._maxScrollX = maxScrollX;","        }","        else if (paginatorAxis[DIM_X]) {","            host._maxScrollY = maxScrollY;","        }","","        // Set the page count","        paginator.set(TOTAL, size);","","        // Jump to the index","        if (index !== 0) {","            paginator.scrollToIndex(index, 0);","        }","","        // Add the paginator class","        bb.addClass(CLASS_PAGED);","","        // Trigger the optimization process","        paginator._optimize();","    },","","    /**","     * After host syncUI","     *","     * @method _afterHostSyncUI","     * @param {Event.Facade}","     * @protected","     */","    _afterHostSyncUI: function (e) {","        var paginator = this,","            host = paginator._host;","","        // If paginator's 'axis' property is to be automatically determined, inherit host's property","        if (paginator._cAxis === undefined) {","            paginator._set(AXIS, host.get(AXIS));","        }","    },","","    /**","     * After host _uiDimensionsChange","     *","     * @method _afterHostUIDimensionsChange","     * @param {Event.Facade}","     * @protected","     */","    _afterHostUIDimensionsChange: function (e) {","","        var paginator = this,","            host = paginator._host,","            bb = paginator._bb,","            widgetWidth = bb.get('offsetWidth'),","            widgetHeight = bb.get('offsetHeight'),","            pageNodes = paginator._getPageNodes();","            ","        // Inefficient. Should not reinitialize every page every syncUI","        pageNodes.each(function (node, i) {","            var scrollWidth = node.get('scrollWidth'),","                scrollHeight = node.get('scrollHeight'),","                maxScrollX = Math.max(0, scrollWidth - widgetWidth), // Math.max to ensure we don't set it to a negative value","                maxScrollY = Math.max(0, scrollHeight - widgetHeight);","","            // Don't initialize any page _pageDims that already have been.","            if (!paginator._pageDims[i]) {","","                paginator._pageDims[i] = {","","                    // Current scrollX & scrollY positions (default to 0)","                    scrollX: 0,","                    scrollY: 0,","","                    // Minimum scrollable values","                    _minScrollX: 0,","                    _minScrollY: 0,","","                    // Maximum scrollable values","                    maxScrollX: maxScrollX,","                    maxScrollY: maxScrollY","                };","","            } else {","                paginator._pageDims[i].maxScrollX = maxScrollX;","                paginator._pageDims[i].maxScrollY = maxScrollY;","            }","","        });","    },","","    /**","     * Executed before host.scrollTo","     *","     * @method _beforeHostScrollTo","     * @param x {Number} The x-position to scroll to. (null for no movement)","     * @param y {Number} The y-position to scroll to. (null for no movement)","     * @param {Number} [duration] Duration, in ms, of the scroll animation (default is 0)","     * @param {String} [easing] An easing equation if duration is set","     * @param {String} [node] The node to move","     * @protected","     */","    _beforeHostScrollTo: function (x, y, duration, easing, node) {","        var paginator = this,","            host = paginator._host,","            gesture = host._gesture,","            index = paginator._cIndex,","            paginatorAxis = paginator._cAxis,","            pageNodes = this._getPageNodes(),","            gestureAxis;","","        if (gesture) {","            gestureAxis = gesture.axis;","","            // Null the opposite axis so it won't be modified by host.scrollTo","            if (gestureAxis === DIM_Y) {","                x = null;","            } else {","                y = null;","            }","","            // If they are scrolling against the specified axis, pull out the page's node to have its own offset","            if (paginatorAxis[gestureAxis] === false) {","                node = pageNodes.item(index);","            }","","        }","","        // Return the modified argument list","        return new Y.Do.AlterArgs(\"new args\", [x, y, duration, easing, node]);","    },","","    /**","     * Executed after host._gestureMoveEnd","     * Determines if the gesture should page prev or next (if at all)","     *","     * @method _afterHostGestureMoveEnd","     * @param {Event.Facade}","     * @protected","     */","    _afterHostGestureMoveEnd: function (e) {","        var paginator = this,","            host = paginator._host,","            gesture = host._gesture,","            paginatorAxis = paginator._cAxis,","            gestureAxis = gesture && gesture.axis;","","        if (paginatorAxis[gestureAxis]) {","            if (gesture[(gestureAxis === DIM_X ? 'deltaX' : 'deltaY')] > 0) {","                paginator[host.rtl ? 'prev' : 'next']();","            } else {","                paginator[host.rtl ? 'next' : 'prev']();","            }","        }","    },","","    /**","     * Executed before host._mousewheel","     * Prevents mousewheel events in some conditions","     *","     * @method _beforeHostMousewheel","     * @param {Event.Facade}","     * @protected","     */","    _beforeHostMousewheel: function (e) {","        var paginator = this,","            host = paginator._host,","            bb = host._bb,","            isForward = e.wheelDelta < 0, // down (negative) is forward. @TODO Should revisit.","            paginatorAxis = paginator._cAxis;","","        // Set the axis for this event.","        // @TODO: This is hacky, it's not a gesture. Find a better way","        host._gesture = {","            axis: DIM_Y","        };","","        // Only if the mousewheel event occurred on a DOM node inside the BB","        if (bb.contains(e.target) && paginatorAxis[DIM_Y]) {","","            if (isForward) {","                paginator.next();","            } else {","                paginator.prev();","            }","","            // prevent browser default behavior on mousewheel","            e.preventDefault();","","            // Block host._mousewheel from running","            return new Y.Do.Prevent();","        }","    },","","    /**","     * Executed before host._flick","     * Prevents flick events in some conditions","     *","     * @method _beforeHostFlick","     * @param {Event.Facade}","     * @protected","     */","    _beforeHostFlick: function (e) {","        var paginator = this,","            paginatorAxis = paginator.get(AXIS),","            flickAxis = e.flick.axis || false;","","        // Prevent flicks on the paginated axis","        if (paginatorAxis[flickAxis]) {","            return new Y.Do.Prevent();","        }","    },","","    /**","     * Executes after host's 'scrollEnd' event","     * Runs cleanup operations","     *","     * @method _afterHostScrollEnded","     * @param {Event.Facade}","     * @protected","     */","    _afterHostScrollEnded: function (e) {","        var paginator = this,","            host = paginator._host,","            index = paginator._cIndex,","            scrollX = host.get(SCROLL_X),","            scrollY = host.get(SCROLL_Y),","            paginatorAxis = paginator._cAxis;","","        if (paginatorAxis[DIM_Y]) {","            paginator._pageDims[index].scrollX = scrollX;","        } else {","            paginator._pageDims[index].scrollY = scrollY;","        }","","        paginator._optimize();","    },","","    /**","     * index attr change handler","     *","     * @method _afterIndexChange","     * @param {Event.Facade}","     * @protected","     */","    _afterIndexChange: function (e) {","        var paginator = this,","            host = this._host,","            index = e.newVal,","            maxScrollX = paginator._pageDims[index].maxScrollX,","            maxScrollY = paginator._pageDims[index].maxScrollY,","            gesture = host._gesture,","            gestureAxis = gesture && gesture.axis;","","        // Cache the new index value","        paginator._cIndex = index;","","        if (gestureAxis === DIM_Y) {","            host._maxScrollX = maxScrollX;","            host.set(SCROLL_X, paginator._pageDims[index].scrollX, { src: UI });","        } else if (gestureAxis === DIM_X) {","            host._maxScrollY = maxScrollY;","            host.set(SCROLL_Y, paginator._pageDims[index].scrollY, { src: UI });","        }","","        if (e.src !== UI) {","            paginator.scrollToIndex(index);","        }","    },","","    /**","     * Optimization: Hides the pages not near the viewport","     *","     * @method _optimize","     * @protected","     */","    _optimize: function () {","","        if (!this._optimizeMemory) {","            return false;","        }","","        var paginator = this,","            currentIndex = paginator._cIndex,","            pageNodes = paginator._getStage(currentIndex);","","        // Show the pages in/near the viewport & hide the rest","        paginator._showNodes(pageNodes.visible);","        paginator._hideNodes(pageNodes.hidden);","    },","","    /**","     * Optimization: Determines which nodes should be visible, and which should be hidden.","     *","     * @method _getStage","     * @param index {Number} The page index # intended to be in focus.","     * @returns {object}","     * @protected","     */","    _getStage: function (index) {","        var _pageBuffer = this._pageBuffer,","            pageCount = this.get(TOTAL),","            pageNodes = this._getPageNodes(),","            start = Math.max(0, index - _pageBuffer),","            end = Math.min(pageCount, index + 1 + _pageBuffer); // noninclusive","","        return {","            visible: pageNodes.splice(start, end - start),","            hidden: pageNodes","        };","    },","","    /**","     * A utility method to show node(s)","     *","     * @method _showNodes","     * @param nodeList {Object} The list of nodes to show","     * @protected","     */","    _showNodes: function (nodeList) {","        if (nodeList) {","            nodeList.removeClass(CLASS_HIDDEN).setStyle('visibility', '');","        }","    },","","    /**","     * A utility method to hide node(s)","     *","     * @method _hideNodes","     * @param nodeList {Object} The list of nodes to hide","     * @protected","     */","    _hideNodes: function (nodeList) {","        if (nodeList) {","            nodeList.addClass(CLASS_HIDDEN).setStyle('visibility', 'hidden');","        }","    },","","    /**","     * Gets a nodeList for the \"pages\"","     *","     * @method _getPageNodes","     * @protected","     * @returns {nodeList}","     */","    _getPageNodes: function () {","        var paginator = this,","            host = paginator._host,","            cb = host._cb,","            pageSelector = paginator.get(SELECTOR),","            pageNodes = pageSelector ? cb.all(pageSelector) : cb.get('children');","","        return pageNodes;","    },","","    /**","     * Scroll to the next page, with animation","     *","     * @method next","     */","    next: function () {","        var paginator = this,","            index = paginator._cIndex,","            target = index + 1,","            total = this.get(TOTAL);","","        if (target >= total) {","            return;","        }","","        // Update the index","        paginator.set(INDEX, target);","    },","","    /**","     * Scroll to the previous page, with animation","     *","     * @method prev","     */","    prev: function () {","        var paginator = this,","            index = paginator._cIndex,","            target = index - 1;","","        if (target < 0) {","            return;","        }","","        // Update the index","        paginator.set(INDEX, target);","    },","    ","    /** ","     * Deprecated for 3.7.0.","     * @deprecated","     */","    scrollTo: function () {","        return this.scrollToIndex.apply(this, arguments);","    },","","    /**","     * Scroll to a given page in the scrollview","     *","     * @method scrollToIndex","     * @param index {Number} The index of the page to scroll to","     * @param {Number} [duration] The number of ms the animation should last","     * @param {String} [easing] The timing function to use in the animation","     */","    scrollToIndex: function (index, duration, easing) {","        var paginator = this,","            host = paginator._host,","            pageNode = paginator._getPageNodes().item(index),","            scrollAxis = (paginator._cAxis[DIM_X] ? SCROLL_X : SCROLL_Y),","            scrollOffset = pageNode.get(scrollAxis === SCROLL_X ? 'offsetLeft' : 'offsetTop');","","        duration = (duration !== undefined) ? duration : PaginatorPlugin.TRANSITION.duration;","        easing = (easing !== undefined) ? duration : PaginatorPlugin.TRANSITION.easing;","","        // Set the index ATTR to the specified index value","        paginator.set(INDEX, index);","","        // Makes sure the viewport nodes are visible","        paginator._showNodes(pageNode);","","        // Scroll to the offset","        host.set(scrollAxis, scrollOffset, {","            duration: duration,","            easing: easing","        });","    },","","    /**","     * Setter for 'axis' attribute","     *","     * @method _axisSetter","     * @param val {Mixed} A string ('x', 'y', 'xy') to specify which axis/axes to allow scrolling on","     * @param name {String} The attribute name","     * @return {Object} An object to specify scrollability on the x & y axes","     * ","     * @protected","     */","    _axisSetter: function (val, name) {","","        // Turn a string into an axis object","        if (Y.Lang.isString(val)) {","            return {","                x: val.match(/x/i) ? true : false,","                y: val.match(/y/i) ? true : false","            };","        }","    },"," ","","    /**","     * After listener for the axis attribute","     *","     * @method _afterAxisChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterAxisChange: function (e) {","        this._cAxis = e.newVal;","    }","","    // End prototype properties","","}, {","    ","    // Static properties","","    /**","     * The identity of the plugin","     *","     * @property NAME","     * @type String","     * @default 'pluginScrollViewPaginator'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'pluginScrollViewPaginator',","","    /**","     * The namespace on which the plugin will reside","     *","     * @property NS","     * @type String","     * @default 'pages'","     * @static","     */","    NS: 'pages',","","    /**","     * The default attribute configuration for the plugin","     *","     * @property ATTRS","     * @type {Object}","     * @static","     */","    ATTRS: {","","        /**","         * Specifies ability to scroll on x, y, or x and y axis/axes. ","         * If unspecified, it inherits from the host instance.","         *","         * @attribute axis","         * @type String","         */","        axis: {","            setter: '_axisSetter',","            writeOnce: 'initOnly'","        },","","        /**","         * CSS selector for a page inside the scrollview. The scrollview","         * will snap to the closest page.","         *","         * @attribute selector","         * @type {String}","         * @default null","         */","        selector: {","            value: null","        },","","        /**","         * The active page number for a paged scrollview","         *","         * @attribute index","         * @type {Number}","         * @default 0","         */","        index: {","            value: 0,","            validator: function (val) {","                // TODO: Remove this?","                // return val >= 0 && val < this.get(TOTAL);","                return true;","            }","        },","","        /**","         * The total number of pages","         *","         * @attribute total","         * @type {Number}","         * @default 0","         */","        total: {","            value: 0","        }","    },","        ","    /**","     * The default snap to current duration and easing values used on scroll end.","     *","     * @property SNAP_TO_CURRENT","     * @static","     */","    TRANSITION: {","        duration: 300,","        easing: 'ease-out'","    }","","    // End static properties","","});","","Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;","","}, '@VERSION@', {\"requires\": [\"plugin\", \"classnamemanager\"]});"];
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].lines = {"1":0,"8":0,"35":0,"36":0,"39":0,"48":0,"52":0,"53":0,"54":0,"57":0,"58":0,"59":0,"60":0,"61":0,"64":0,"65":0,"68":0,"69":0,"73":0,"83":0,"86":0,"92":0,"93":0,"94":0,"95":0,"96":0,"97":0,"100":0,"101":0,"112":0,"122":0,"123":0,"125":0,"126":0,"130":0,"133":0,"134":0,"138":0,"141":0,"152":0,"156":0,"157":0,"170":0,"178":0,"179":0,"185":0,"187":0,"203":0,"204":0,"222":0,"230":0,"231":0,"234":0,"235":0,"237":0,"241":0,"242":0,"248":0,"260":0,"266":0,"267":0,"268":0,"270":0,"284":0,"292":0,"297":0,"299":0,"300":0,"302":0,"306":0,"309":0,"322":0,"327":0,"328":0,"341":0,"348":0,"349":0,"351":0,"354":0,"365":0,"374":0,"376":0,"377":0,"378":0,"379":0,"380":0,"381":0,"384":0,"385":0,"397":0,"398":0,"401":0,"406":0,"407":0,"419":0,"425":0,"439":0,"440":0,"452":0,"453":0,"465":0,"471":0,"480":0,"485":0,"486":0,"490":0,"499":0,"503":0,"504":0,"508":0,"516":0,"528":0,"534":0,"535":0,"538":0,"541":0,"544":0,"563":0,"564":0,"580":0,"656":0,"687":0};
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].functions = {"PaginatorPlugin:35":0,"initializer:47":0,"_bindAttrs:82":0,"_afterHostRender:111":0,"_afterHostSyncUI:151":0,"(anonymous 2):178":0,"_afterHostUIDimensionsChange:168":0,"_beforeHostScrollTo:221":0,"_afterHostGestureMoveEnd:259":0,"_beforeHostMousewheel:283":0,"_beforeHostFlick:321":0,"_afterHostScrollEnded:340":0,"_afterIndexChange:364":0,"_optimize:395":0,"_getStage:418":0,"_showNodes:438":0,"_hideNodes:451":0,"_getPageNodes:464":0,"next:479":0,"prev:498":0,"scrollTo:515":0,"scrollToIndex:527":0,"_axisSetter:560":0,"_afterAxisChange:579":0,"validator:653":0,"(anonymous 1):1":0};
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].coveredLines = 122;
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].coveredFunctions = 26;
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 1);
YUI.add('scrollview-paginator', function (Y, NAME) {

/**
 * Provides a plugin that adds pagination support to ScrollView instances
 *
 * @module scrollview-paginator
 */
_yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "(anonymous 1)", 1);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 8);
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
    AXIS = 'axis',
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
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 35);
function PaginatorPlugin() {
    _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "PaginatorPlugin", 35);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 36);
PaginatorPlugin.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 39);
Y.extend(PaginatorPlugin, Y.Plugin.Base, {

    /**
     * Designated initializer
     *
     * @method initializer
     * @param {config} Configuration object for the plugin
     */
    initializer: function (config) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "initializer", 47);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 48);
var paginator = this,
            host = paginator.get(HOST);

        // Initialize & default
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 52);
paginator._pageDims = [];
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 53);
paginator._pageBuffer = 1;
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 54);
paginator._optimizeMemory = false;

        // Cache some values
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 57);
paginator._host = host;
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 58);
paginator._bb = host._bb;
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 59);
paginator._cb = host._cb;
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 60);
paginator._cIndex = paginator.get(INDEX);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 61);
paginator._cAxis = paginator.get(AXIS);

        // Apply configs
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 64);
if (config._optimizeMemory) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 65);
paginator._optimizeMemory = config._optimizeMemory;
        }

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 68);
if (config._pageBuffer) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 69);
paginator._pageBuffer = config._pageBuffer;
        }

        // Attach event bindings
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 73);
paginator._bindAttrs();
    },

    /**
     * 
     *
     * @method _bindAttrs
     * @private
     */
    _bindAttrs: function () {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_bindAttrs", 82);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 83);
var paginator = this;

        // Event listeners
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 86);
paginator.after({
            'indexChange': paginator._afterIndexChange,
            'axisChange': paginator._afterAxisChange
        });

        // Host method listeners
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 92);
paginator.beforeHostMethod('scrollTo', paginator._beforeHostScrollTo);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 93);
paginator.beforeHostMethod('_mousewheel', paginator._beforeHostMousewheel);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 94);
paginator.beforeHostMethod('_flick', paginator._beforeHostFlick);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 95);
paginator.afterHostMethod('_onGestureMoveEnd', paginator._afterHostGestureMoveEnd);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 96);
paginator.afterHostMethod('_uiDimensionsChange', paginator._afterHostUIDimensionsChange);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 97);
paginator.afterHostMethod('syncUI', paginator._afterHostSyncUI);
        
        // Host event listeners
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 100);
paginator.afterHostEvent('render', paginator._afterHostRender);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 101);
paginator.afterHostEvent('scrollEnd', paginator._afterHostScrollEnded);
    },

    /**
     * After host render
     *
     * @method _afterHostRender
     * @param {Event.Facade}
     * @protected
     */
    _afterHostRender: function (e) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterHostRender", 111);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 112);
var paginator = this,
            bb = paginator._bb,
            host = paginator._host,
            index = paginator._cIndex,
            paginatorAxis = paginator._cAxis,
            pageNodes = paginator._getPageNodes(),
            size = pageNodes.size(),
            maxScrollX = paginator._pageDims[index].maxScrollX,
            maxScrollY = paginator._pageDims[index].maxScrollY;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 122);
if (paginatorAxis[DIM_Y]) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 123);
host._maxScrollX = maxScrollX;
        }
        else {_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 125);
if (paginatorAxis[DIM_X]) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 126);
host._maxScrollY = maxScrollY;
        }}

        // Set the page count
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 130);
paginator.set(TOTAL, size);

        // Jump to the index
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 133);
if (index !== 0) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 134);
paginator.scrollToIndex(index, 0);
        }

        // Add the paginator class
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 138);
bb.addClass(CLASS_PAGED);

        // Trigger the optimization process
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 141);
paginator._optimize();
    },

    /**
     * After host syncUI
     *
     * @method _afterHostSyncUI
     * @param {Event.Facade}
     * @protected
     */
    _afterHostSyncUI: function (e) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterHostSyncUI", 151);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 152);
var paginator = this,
            host = paginator._host;

        // If paginator's 'axis' property is to be automatically determined, inherit host's property
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 156);
if (paginator._cAxis === undefined) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 157);
paginator._set(AXIS, host.get(AXIS));
        }
    },

    /**
     * After host _uiDimensionsChange
     *
     * @method _afterHostUIDimensionsChange
     * @param {Event.Facade}
     * @protected
     */
    _afterHostUIDimensionsChange: function (e) {

        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterHostUIDimensionsChange", 168);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 170);
var paginator = this,
            host = paginator._host,
            bb = paginator._bb,
            widgetWidth = bb.get('offsetWidth'),
            widgetHeight = bb.get('offsetHeight'),
            pageNodes = paginator._getPageNodes();
            
        // Inefficient. Should not reinitialize every page every syncUI
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 178);
pageNodes.each(function (node, i) {
            _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "(anonymous 2)", 178);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 179);
var scrollWidth = node.get('scrollWidth'),
                scrollHeight = node.get('scrollHeight'),
                maxScrollX = Math.max(0, scrollWidth - widgetWidth), // Math.max to ensure we don't set it to a negative value
                maxScrollY = Math.max(0, scrollHeight - widgetHeight);

            // Don't initialize any page _pageDims that already have been.
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 185);
if (!paginator._pageDims[i]) {

                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 187);
paginator._pageDims[i] = {

                    // Current scrollX & scrollY positions (default to 0)
                    scrollX: 0,
                    scrollY: 0,

                    // Minimum scrollable values
                    _minScrollX: 0,
                    _minScrollY: 0,

                    // Maximum scrollable values
                    maxScrollX: maxScrollX,
                    maxScrollY: maxScrollY
                };

            } else {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 203);
paginator._pageDims[i].maxScrollX = maxScrollX;
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 204);
paginator._pageDims[i].maxScrollY = maxScrollY;
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_beforeHostScrollTo", 221);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 222);
var paginator = this,
            host = paginator._host,
            gesture = host._gesture,
            index = paginator._cIndex,
            paginatorAxis = paginator._cAxis,
            pageNodes = this._getPageNodes(),
            gestureAxis;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 230);
if (gesture) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 231);
gestureAxis = gesture.axis;

            // Null the opposite axis so it won't be modified by host.scrollTo
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 234);
if (gestureAxis === DIM_Y) {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 235);
x = null;
            } else {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 237);
y = null;
            }

            // If they are scrolling against the specified axis, pull out the page's node to have its own offset
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 241);
if (paginatorAxis[gestureAxis] === false) {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 242);
node = pageNodes.item(index);
            }

        }

        // Return the modified argument list
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 248);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterHostGestureMoveEnd", 259);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 260);
var paginator = this,
            host = paginator._host,
            gesture = host._gesture,
            paginatorAxis = paginator._cAxis,
            gestureAxis = gesture && gesture.axis;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 266);
if (paginatorAxis[gestureAxis]) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 267);
if (gesture[(gestureAxis === DIM_X ? 'deltaX' : 'deltaY')] > 0) {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 268);
paginator[host.rtl ? 'prev' : 'next']();
            } else {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 270);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_beforeHostMousewheel", 283);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 284);
var paginator = this,
            host = paginator._host,
            bb = host._bb,
            isForward = e.wheelDelta < 0, // down (negative) is forward. @TODO Should revisit.
            paginatorAxis = paginator._cAxis;

        // Set the axis for this event.
        // @TODO: This is hacky, it's not a gesture. Find a better way
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 292);
host._gesture = {
            axis: DIM_Y
        };

        // Only if the mousewheel event occurred on a DOM node inside the BB
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 297);
if (bb.contains(e.target) && paginatorAxis[DIM_Y]) {

            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 299);
if (isForward) {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 300);
paginator.next();
            } else {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 302);
paginator.prev();
            }

            // prevent browser default behavior on mousewheel
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 306);
e.preventDefault();

            // Block host._mousewheel from running
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 309);
return new Y.Do.Prevent();
        }
    },

    /**
     * Executed before host._flick
     * Prevents flick events in some conditions
     *
     * @method _beforeHostFlick
     * @param {Event.Facade}
     * @protected
     */
    _beforeHostFlick: function (e) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_beforeHostFlick", 321);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 322);
var paginator = this,
            paginatorAxis = paginator.get(AXIS),
            flickAxis = e.flick.axis || false;

        // Prevent flicks on the paginated axis
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 327);
if (paginatorAxis[flickAxis]) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 328);
return new Y.Do.Prevent();
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterHostScrollEnded", 340);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 341);
var paginator = this,
            host = paginator._host,
            index = paginator._cIndex,
            scrollX = host.get(SCROLL_X),
            scrollY = host.get(SCROLL_Y),
            paginatorAxis = paginator._cAxis;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 348);
if (paginatorAxis[DIM_Y]) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 349);
paginator._pageDims[index].scrollX = scrollX;
        } else {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 351);
paginator._pageDims[index].scrollY = scrollY;
        }

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 354);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterIndexChange", 364);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 365);
var paginator = this,
            host = this._host,
            index = e.newVal,
            maxScrollX = paginator._pageDims[index].maxScrollX,
            maxScrollY = paginator._pageDims[index].maxScrollY,
            gesture = host._gesture,
            gestureAxis = gesture && gesture.axis;

        // Cache the new index value
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 374);
paginator._cIndex = index;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 376);
if (gestureAxis === DIM_Y) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 377);
host._maxScrollX = maxScrollX;
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 378);
host.set(SCROLL_X, paginator._pageDims[index].scrollX, { src: UI });
        } else {_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 379);
if (gestureAxis === DIM_X) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 380);
host._maxScrollY = maxScrollY;
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 381);
host.set(SCROLL_Y, paginator._pageDims[index].scrollY, { src: UI });
        }}

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 384);
if (e.src !== UI) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 385);
paginator.scrollToIndex(index);
        }
    },

    /**
     * Optimization: Hides the pages not near the viewport
     *
     * @method _optimize
     * @protected
     */
    _optimize: function () {

        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_optimize", 395);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 397);
if (!this._optimizeMemory) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 398);
return false;
        }

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 401);
var paginator = this,
            currentIndex = paginator._cIndex,
            pageNodes = paginator._getStage(currentIndex);

        // Show the pages in/near the viewport & hide the rest
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 406);
paginator._showNodes(pageNodes.visible);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 407);
paginator._hideNodes(pageNodes.hidden);
    },

    /**
     * Optimization: Determines which nodes should be visible, and which should be hidden.
     *
     * @method _getStage
     * @param index {Number} The page index # intended to be in focus.
     * @returns {object}
     * @protected
     */
    _getStage: function (index) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_getStage", 418);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 419);
var _pageBuffer = this._pageBuffer,
            pageCount = this.get(TOTAL),
            pageNodes = this._getPageNodes(),
            start = Math.max(0, index - _pageBuffer),
            end = Math.min(pageCount, index + 1 + _pageBuffer); // noninclusive

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 425);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_showNodes", 438);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 439);
if (nodeList) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 440);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_hideNodes", 451);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 452);
if (nodeList) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 453);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_getPageNodes", 464);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 465);
var paginator = this,
            host = paginator._host,
            cb = host._cb,
            pageSelector = paginator.get(SELECTOR),
            pageNodes = pageSelector ? cb.all(pageSelector) : cb.get('children');

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 471);
return pageNodes;
    },

    /**
     * Scroll to the next page, with animation
     *
     * @method next
     */
    next: function () {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "next", 479);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 480);
var paginator = this,
            index = paginator._cIndex,
            target = index + 1,
            total = this.get(TOTAL);

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 485);
if (target >= total) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 486);
return;
        }

        // Update the index
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 490);
paginator.set(INDEX, target);
    },

    /**
     * Scroll to the previous page, with animation
     *
     * @method prev
     */
    prev: function () {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "prev", 498);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 499);
var paginator = this,
            index = paginator._cIndex,
            target = index - 1;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 503);
if (target < 0) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 504);
return;
        }

        // Update the index
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 508);
paginator.set(INDEX, target);
    },
    
    /** 
     * Deprecated for 3.7.0.
     * @deprecated
     */
    scrollTo: function () {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "scrollTo", 515);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 516);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "scrollToIndex", 527);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 528);
var paginator = this,
            host = paginator._host,
            pageNode = paginator._getPageNodes().item(index),
            scrollAxis = (paginator._cAxis[DIM_X] ? SCROLL_X : SCROLL_Y),
            scrollOffset = pageNode.get(scrollAxis === SCROLL_X ? 'offsetLeft' : 'offsetTop');

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 534);
duration = (duration !== undefined) ? duration : PaginatorPlugin.TRANSITION.duration;
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 535);
easing = (easing !== undefined) ? duration : PaginatorPlugin.TRANSITION.easing;

        // Set the index ATTR to the specified index value
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 538);
paginator.set(INDEX, index);

        // Makes sure the viewport nodes are visible
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 541);
paginator._showNodes(pageNode);

        // Scroll to the offset
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 544);
host.set(scrollAxis, scrollOffset, {
            duration: duration,
            easing: easing
        });
    },

    /**
     * Setter for 'axis' attribute
     *
     * @method _axisSetter
     * @param val {Mixed} A string ('x', 'y', 'xy') to specify which axis/axes to allow scrolling on
     * @param name {String} The attribute name
     * @return {Object} An object to specify scrollability on the x & y axes
     * 
     * @protected
     */
    _axisSetter: function (val, name) {

        // Turn a string into an axis object
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_axisSetter", 560);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 563);
if (Y.Lang.isString(val)) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 564);
return {
                x: val.match(/x/i) ? true : false,
                y: val.match(/y/i) ? true : false
            };
        }
    },
 

    /**
     * After listener for the axis attribute
     *
     * @method _afterAxisChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterAxisChange: function (e) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterAxisChange", 579);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 580);
this._cAxis = e.newVal;
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
         * Specifies ability to scroll on x, y, or x and y axis/axes. 
         * If unspecified, it inherits from the host instance.
         *
         * @attribute axis
         * @type String
         */
        axis: {
            setter: '_axisSetter',
            writeOnce: 'initOnly'
        },

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
                _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "validator", 653);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 656);
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

_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 687);
Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;

}, '@VERSION@', {"requires": ["plugin", "classnamemanager"]});
