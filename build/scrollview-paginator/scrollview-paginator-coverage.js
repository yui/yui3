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
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].code=["YUI.add('scrollview-paginator', function (Y, NAME) {","","/**"," * Provides a plugin that adds pagination support to ScrollView instances"," *"," * @module scrollview-paginator"," */","var getClassName = Y.ClassNameManager.getClassName,","    SCROLLVIEW = 'scrollview',","    CLASS_HIDDEN = getClassName(SCROLLVIEW, 'hidden'),","    CLASS_PAGED = getClassName(SCROLLVIEW, 'paged'),","    UI = (Y.ScrollView) ? Y.ScrollView.UI_SRC : 'ui',","    INDEX = 'index',","    SCROLL_X = 'scrollX',","    SCROLL_Y = 'scrollY',","    TOTAL = 'total',","    HOST = 'host',","    BOUNDING_BOX = 'boundingBox',","    CONTENT_BOX = 'contentBox',","    SELECTOR = 'selector',","    FLICK = 'flick',","    DRAG = 'drag',","    AXIS = 'axis',","    DIM_X = 'x',","    DIM_Y = 'y';","","/**"," * Scrollview plugin that adds support for paging"," *"," * @class ScrollViewPaginator"," * @namespace Plugin"," * @extends Plugin.Base"," * @constructor"," */","function PaginatorPlugin() {","    PaginatorPlugin.superclass.constructor.apply(this, arguments);","}","","Y.extend(PaginatorPlugin, Y.Plugin.Base, {","","    /**","     * Designated initializer","     *","     * @method initializer","     * @param {config} Configuration object for the plugin","     */","    initializer: function (config) {","        var paginator = this,","            host = paginator.get(HOST);","","        // Initialize & default","        paginator._pageDims = [];","        paginator._pageBuffer = 1;","        paginator._optimizeMemory = false;","","        // Cache some values","        paginator._host = host;","        paginator._bb = host._bb;","        paginator._cb = host._cb;","        paginator._cIndex = paginator.get(INDEX);","        paginator._cAxis = paginator.get(AXIS);","","        // Apply configs","        if (config._optimizeMemory) {","            paginator._optimizeMemory = config._optimizeMemory;","        }","","        if (config._pageBuffer) {","            paginator._pageBuffer = config._pageBuffer;","        }","","        // Attach event bindings","        paginator._bindAttrs();","    },","","    /**","     * ","     *","     * @method _bindAttrs","     * @private","     */","    _bindAttrs: function () {","        var paginator = this;","","        // Event listeners","        paginator.after({","            'indexChange': paginator._afterIndexChange,","            'axisChange': paginator._afterAxisChange","        });","","        // Host method listeners","        paginator.beforeHostMethod('scrollTo', paginator._beforeHostScrollTo);","        paginator.beforeHostMethod('_mousewheel', paginator._beforeHostMousewheel);","        paginator.beforeHostMethod('_flick', paginator._beforeHostFlick);","        paginator.afterHostMethod('_onGestureMoveEnd', paginator._afterHostGestureMoveEnd);","        paginator.afterHostMethod('_uiDimensionsChange', paginator._afterHostUIDimensionsChange);","        paginator.afterHostMethod('syncUI', paginator._afterHostSyncUI);","        ","        // Host event listeners","        paginator.afterHostEvent('render', paginator._afterHostRender);","        paginator.afterHostEvent('scrollEnd', paginator._afterHostScrollEnded);","    },","","    /**","     * After host render","     *","     * @method _afterHostRender","     * @param {Event.Facade}","     * @protected","     */","    _afterHostRender: function (e) {","        var paginator = this,","            bb = paginator._bb,","            host = paginator._host,","            index = paginator._cIndex,","            paginatorAxis = paginator._cAxis,","            pageNodes = paginator._getPageNodes(),","            size = pageNodes.size(),","            maxScrollX = paginator._pageDims[index].maxScrollX,","            maxScrollY = paginator._pageDims[index].maxScrollY;","","        if (paginatorAxis[DIM_Y]) {","            host._maxScrollX = maxScrollX;","        }","        else if (paginatorAxis[DIM_X]) {","            host._maxScrollY = maxScrollY;","        }","","        // Set the page count","        paginator.set(TOTAL, size);","","        // Jump to the index","        if (index !== 0) {","            paginator.scrollToIndex(index, 0);","        }","","        // Add the paginator class","        bb.addClass(CLASS_PAGED);","","        // Trigger the optimization process","        paginator._optimize();","    },","","    /**","     * After host syncUI","     *","     * @method _afterHostSyncUI","     * @param {Event.Facade}","     * @protected","     */","    _afterHostSyncUI: function (e) {","        var paginator = this,","            host = paginator._host,","            hostFlick = host.get(FLICK),","            pageNodes = paginator._getPageNodes(),","            size = pageNodes.size(),","            paginatorAxis;","","        // Set the page count","        paginator.set(TOTAL, size);","","        // If paginator's 'axis' property is to be automatically determined, inherit host's property","        if (paginator._cAxis === undefined) {","            paginator._set(AXIS, host.get(AXIS));","        }","    },","","    /**","     * After host _uiDimensionsChange","     *","     * @method _afterHostUIDimensionsChange","     * @param {Event.Facade}","     * @protected","     */","    _afterHostUIDimensionsChange: function (e) {","","        var paginator = this,","            host = paginator._host,","            dims = host._getScrollDims(),","            widgetWidth = dims.offsetWidth,","            widgetHeight = dims.offsetHeight,","            pageNodes = paginator._getPageNodes();","            ","        // Inefficient. Should not reinitialize every page every syncUI","        pageNodes.each(function (node, i) {","            var scrollWidth = node.get('scrollWidth'),","                scrollHeight = node.get('scrollHeight'),","                maxScrollX = Math.max(0, scrollWidth - widgetWidth), // Math.max to ensure we don't set it to a negative value","                maxScrollY = Math.max(0, scrollHeight - widgetHeight);","","            // Don't initialize any page _pageDims that already have been.","            if (!paginator._pageDims[i]) {","","                paginator._pageDims[i] = {","","                    // Current scrollX & scrollY positions (default to 0)","                    scrollX: 0,","                    scrollY: 0,","","                    // Minimum scrollable values","                    //@TODO What are these for?","                    _minScrollX: 0,","                    _minScrollY: 0,","","                    // Maximum scrollable values","                    maxScrollX: maxScrollX,","                    maxScrollY: maxScrollY,","","                    // Height & width of the page","                    width: scrollWidth,","                    height: scrollHeight","                };","","            } else {","                paginator._pageDims[i].maxScrollX = maxScrollX;","                paginator._pageDims[i].maxScrollY = maxScrollY;","            }","","        });","    },","","    /**","     * Executed before host.scrollTo","     *","     * @method _beforeHostScrollTo","     * @param x {Number} The x-position to scroll to. (null for no movement)","     * @param y {Number} The y-position to scroll to. (null for no movement)","     * @param {Number} [duration] Duration, in ms, of the scroll animation (default is 0)","     * @param {String} [easing] An easing equation if duration is set","     * @param {String} [node] The node to move","     * @protected","     */","    _beforeHostScrollTo: function (x, y, duration, easing, node) {","        var paginator = this,","            host = paginator._host,","            gesture = host._gesture,","            index = paginator._cIndex,","            paginatorAxis = paginator._cAxis,","            pageNodes = paginator._getPageNodes(),","            gestureAxis;","","        if (gesture) {","            gestureAxis = gesture.axis;","","            // Null the opposite axis so it won't be modified by host.scrollTo","            if (gestureAxis === DIM_Y) {","                x = null;","            } else {","                y = null;","            }","","            // If they are scrolling against the specified axis, pull out the page's node to have its own offset","            if (paginatorAxis[gestureAxis] === false) {","                node = pageNodes.item(index);","            }","","        }","","        // Return the modified argument list","        return new Y.Do.AlterArgs(\"new args\", [x, y, duration, easing, node]);","    },","","    /**","     * Executed after host._gestureMoveEnd","     * Determines if the gesture should page prev or next (if at all)","     *","     * @method _afterHostGestureMoveEnd","     * @param {Event.Facade}","     * @protected","     */","    _afterHostGestureMoveEnd: function (e) {","","        // This was a flick, so we don't need to do anything here","        if (this._host._gesture.flick) {","            return false;","        }","","        var paginator = this,","            host = paginator._host,","            gesture = host._gesture,","            index = paginator._cIndex,","            pageNodes = paginator._getPageNodes(),","            pageNode = pageNodes.item(index),","            paginatorAxis = paginator._cAxis,","            gestureAxis = gesture.axis,","            isHorizontal = (gestureAxis === DIM_X),","            delta = gesture[(gestureAxis === DIM_X ? 'deltaX' : 'deltaY')],","            isForward = (delta > 0),","            pageDims = paginator._pageDims[index],","            halfway = pageDims[(isHorizontal ? 'width' : 'height')] / 2,","            isHalfway = (Math.abs(delta) >= halfway),","            canScroll = paginatorAxis[gestureAxis],","            rtl = host.rtl;","","        if (canScroll) {","            if (isHalfway) { // TODO: This condition should probably be configurable","                // Fire next()/prev()","                paginator[rtl === isForward ? 'prev' : 'next']();","            }","            // Scrollback","            else {","                paginator.scrollToIndex(paginator.get(INDEX));","            }","        }","    },","","    /**","     * Executed before host._mousewheel","     * Prevents mousewheel events in some conditions","     *","     * @method _beforeHostMousewheel","     * @param {Event.Facade}","     * @protected","     */","    _beforeHostMousewheel: function (e) {","        var paginator = this,","            host = paginator._host,","            bb = host._bb,","            isForward = (e.wheelDelta < 0), // down (negative) is forward. @TODO Should revisit.","            paginatorAxis = paginator._cAxis;","","        // Set the axis for this event.","        // @TODO: This is hacky, it's not a gesture. Find a better way","        host._gesture = {","            axis: DIM_Y","        };","","        // Only if the mousewheel event occurred on a DOM node inside the BB","        if (bb.contains(e.target) && paginatorAxis[DIM_Y]) {","","            // Fire next()/prev()","            paginator[isForward ? 'next' : 'prev']();","","            // prevent browser default behavior on mousewheel","            e.preventDefault();","","            // Block host._mousewheel from running","            return new Y.Do.Prevent();","        }","    },","","    /**","     * Executed before host._flick","     * Prevents flick events in some conditions","     *","     * @method _beforeHostFlick","     * @param {Event.Facade}","     * @protected","     */","    _beforeHostFlick: function (e) {","","        // The drag was out of bounds, so do nothing (which will cause a snapback)","        if (this._host._isOutOfBounds()){","            return new Y.Do.Prevent();","        }","        ","        var paginator = this,","            host = paginator._host,","            gesture = host._gesture,","            index = paginator._cIndex,","            paginatorAxis = paginator.get(AXIS),","            flick = e.flick,","            velocity = flick.velocity,","            flickAxis = flick.axis,","            isForward = (velocity < 0),","            canScroll = paginatorAxis[flickAxis],","            rtl = host.rtl;","","        // Store the flick data in the this._host._gesture object so it knows this was a flick","        if (gesture) {","            gesture.flick = flick;","        }","","        // Can we scroll along this axis?","        if (canScroll) {","","            // Fire next()/prev()","            paginator[rtl === isForward ? 'prev' : 'next']();","","            // Prevent flick animations on the paginated axis.","            return new Y.Do.Prevent();","        }","    },","","    /**","     * Executes after host's 'scrollEnd' event","     * Runs cleanup operations","     *","     * @method _afterHostScrollEnded","     * @param {Event.Facade}","     * @protected","     */","    _afterHostScrollEnded: function (e) {","        var paginator = this,","            host = paginator._host,","            index = paginator._cIndex,","            scrollX = host.get(SCROLL_X),","            scrollY = host.get(SCROLL_Y),","            paginatorAxis = paginator._cAxis;","","        if (paginatorAxis[DIM_Y]) {","            paginator._pageDims[index].scrollX = scrollX;","        } else {","            paginator._pageDims[index].scrollY = scrollY;","        }","","        paginator._optimize();","    },","","    /**","     * index attr change handler","     *","     * @method _afterIndexChange","     * @param {Event.Facade}","     * @protected","     */","    _afterIndexChange: function (e) {","        var paginator = this,","            host = paginator._host,","            index = e.newVal,","            pageDims = paginator._pageDims[index],","            hostAxis = host._cAxis,","            paginatorAxis = paginator._cAxis;","","        // Cache the new index value","        paginator._cIndex = index;","","        // For dual-axis instances, we need to hack some host properties to the","        // current page's max height/width and current stored offset","        if (hostAxis[DIM_X] && hostAxis[DIM_Y]) {","            if (paginatorAxis[DIM_Y]) {","                host._maxScrollX = pageDims.maxScrollX;","                host.set(SCROLL_X, pageDims.scrollX, { src: UI });","            }","            else if (paginatorAxis[DIM_X]) {","                host._maxScrollY = pageDims.maxScrollY;","                host.set(SCROLL_Y, pageDims.scrollY, { src: UI });","            }","        }","","        if (e.src !== UI) {","            paginator.scrollToIndex(index);","        }","    },","","    /**","     * Optimization: Hides the pages not near the viewport","     *","     * @method _optimize","     * @protected","     */","    _optimize: function () {","","        if (!this._optimizeMemory) {","            return false;","        }","","        var paginator = this,","            currentIndex = paginator._cIndex,","            pageNodes = paginator._getStage(currentIndex);","","        // Show the pages in/near the viewport & hide the rest","        paginator._showNodes(pageNodes.visible);","        paginator._hideNodes(pageNodes.hidden);","    },","","    /**","     * Optimization: Determines which nodes should be visible, and which should be hidden.","     *","     * @method _getStage","     * @param index {Number} The page index # intended to be in focus.","     * @returns {object}","     * @protected","     */","    _getStage: function (index) {","        var paginator = this,","            pageBuffer = paginator._pageBuffer,","            pageCount = paginator.get(TOTAL),","            pageNodes = paginator._getPageNodes(),","            start = Math.max(0, index - pageBuffer),","            end = Math.min(pageCount, index + 1 + pageBuffer); // noninclusive","","        return {","            visible: pageNodes.splice(start, end - start),","            hidden: pageNodes","        };","    },","","    /**","     * A utility method to show node(s)","     *","     * @method _showNodes","     * @param nodeList {Object} The list of nodes to show","     * @protected","     */","    _showNodes: function (nodeList) {","        if (nodeList) {","            nodeList.removeClass(CLASS_HIDDEN).setStyle('visibility', '');","        }","    },","","    /**","     * A utility method to hide node(s)","     *","     * @method _hideNodes","     * @param nodeList {Object} The list of nodes to hide","     * @protected","     */","    _hideNodes: function (nodeList) {","        if (nodeList) {","            nodeList.addClass(CLASS_HIDDEN).setStyle('visibility', 'hidden');","        }","    },","","    /**","     * Gets a nodeList for the \"pages\"","     *","     * @method _getPageNodes","     * @protected","     * @returns {nodeList}","     */","    _getPageNodes: function () {","        var paginator = this,","            host = paginator._host,","            cb = host._cb,","            pageSelector = paginator.get(SELECTOR),","            pageNodes = pageSelector ? cb.all(pageSelector) : cb.get('children');","","        return pageNodes;","    },","","    /**","     * Scroll to the next page, with animation","     *","     * @method next","     */","    next: function () {","        var paginator = this,","            index = paginator._cIndex,","            target = index + 1,","            total = paginator.get(TOTAL);","","        if (target >= total) {","            return;","        }","","        // Update the index","        paginator.set(INDEX, target);","    },","","    /**","     * Scroll to the previous page, with animation","     *","     * @method prev","     */","    prev: function () {","        var paginator = this,","            index = paginator._cIndex,","            target = index - 1;","","        if (target < 0) {","            return;","        }","","        // Update the index","        paginator.set(INDEX, target);","    },","    ","    /** ","     * Deprecated for 3.7.0.","     * @deprecated","     */","    scrollTo: function () {","        return this.scrollToIndex.apply(this, arguments);","    },","","    /**","     * Scroll to a given page in the scrollview","     *","     * @method scrollToIndex","     * @param index {Number} The index of the page to scroll to","     * @param {Number} [duration] The number of ms the animation should last","     * @param {String} [easing] The timing function to use in the animation","     */","    scrollToIndex: function (index, duration, easing) {","        var paginator = this,","            host = paginator._host,","            pageNode = paginator._getPageNodes().item(index),","            scrollAxis = (paginator._cAxis[DIM_X] ? SCROLL_X : SCROLL_Y),","            scrollOffset = pageNode.get(scrollAxis === SCROLL_X ? 'offsetLeft' : 'offsetTop');","","        duration = (duration !== undefined) ? duration : PaginatorPlugin.TRANSITION.duration;","        easing = (easing !== undefined) ? duration : PaginatorPlugin.TRANSITION.easing;","","        // Set the index ATTR to the specified index value","        paginator.set(INDEX, index);","","        // Makes sure the viewport nodes are visible","        paginator._showNodes(pageNode);","","        // Scroll to the offset","        host.set(scrollAxis, scrollOffset, {","            duration: duration,","            easing: easing","        });","    },","","    /**","     * Setter for 'axis' attribute","     *","     * @method _axisSetter","     * @param val {Mixed} A string ('x', 'y', 'xy') to specify which axis/axes to allow scrolling on","     * @param name {String} The attribute name","     * @return {Object} An object to specify scrollability on the x & y axes","     * ","     * @protected","     */","    _axisSetter: function (val, name) {","","        // Turn a string into an axis object","        if (Y.Lang.isString(val)) {","            return {","                x: val.match(/x/i) ? true : false,","                y: val.match(/y/i) ? true : false","            };","        }","    },"," ","","    /**","     * After listener for the axis attribute","     *","     * @method _afterAxisChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterAxisChange: function (e) {","        this._cAxis = e.newVal;","    }","","    // End prototype properties","","}, {","    ","    // Static properties","","    /**","     * The identity of the plugin","     *","     * @property NAME","     * @type String","     * @default 'pluginScrollViewPaginator'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'pluginScrollViewPaginator',","","    /**","     * The namespace on which the plugin will reside","     *","     * @property NS","     * @type String","     * @default 'pages'","     * @static","     */","    NS: 'pages',","","    /**","     * The default attribute configuration for the plugin","     *","     * @property ATTRS","     * @type {Object}","     * @static","     */","    ATTRS: {","","        /**","         * Specifies ability to scroll on x, y, or x and y axis/axes. ","         * If unspecified, it inherits from the host instance.","         *","         * @attribute axis","         * @type String","         */","        axis: {","            setter: '_axisSetter',","            writeOnce: 'initOnly'","        },","","        /**","         * CSS selector for a page inside the scrollview. The scrollview","         * will snap to the closest page.","         *","         * @attribute selector","         * @type {String}","         * @default null","         */","        selector: {","            value: null","        },","","        /**","         * The active page number for a paged scrollview","         *","         * @attribute index","         * @type {Number}","         * @default 0","         */","        index: {","            value: 0,","            validator: function (val) {","                // TODO: Remove this?","                // return val >= 0 && val < this.get(TOTAL);","                return true;","            }","        },","","        /**","         * The total number of pages","         *","         * @attribute total","         * @type {Number}","         * @default 0","         */","        total: {","            value: 0","        }","    },","        ","    /**","     * The default snap to current duration and easing values used on scroll end.","     *","     * @property SNAP_TO_CURRENT","     * @static","     */","    TRANSITION: {","        duration: 300,","        easing: 'ease-out'","    }","","    // End static properties","","});","","Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;","","}, '@VERSION@', {\"requires\": [\"plugin\", \"classnamemanager\"]});"];
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].lines = {"1":0,"8":0,"35":0,"36":0,"39":0,"48":0,"52":0,"53":0,"54":0,"57":0,"58":0,"59":0,"60":0,"61":0,"64":0,"65":0,"68":0,"69":0,"73":0,"83":0,"86":0,"92":0,"93":0,"94":0,"95":0,"96":0,"97":0,"100":0,"101":0,"112":0,"122":0,"123":0,"125":0,"126":0,"130":0,"133":0,"134":0,"138":0,"141":0,"152":0,"160":0,"163":0,"164":0,"177":0,"185":0,"186":0,"192":0,"194":0,"215":0,"216":0,"234":0,"242":0,"243":0,"246":0,"247":0,"249":0,"253":0,"254":0,"260":0,"274":0,"275":0,"278":0,"295":0,"296":0,"298":0,"302":0,"316":0,"324":0,"329":0,"332":0,"335":0,"338":0,"353":0,"354":0,"357":0,"370":0,"371":0,"375":0,"378":0,"381":0,"394":0,"401":0,"402":0,"404":0,"407":0,"418":0,"426":0,"430":0,"431":0,"432":0,"433":0,"435":0,"436":0,"437":0,"441":0,"442":0,"454":0,"455":0,"458":0,"463":0,"464":0,"476":0,"483":0,"497":0,"498":0,"510":0,"511":0,"523":0,"529":0,"538":0,"543":0,"544":0,"548":0,"557":0,"561":0,"562":0,"566":0,"574":0,"586":0,"592":0,"593":0,"596":0,"599":0,"602":0,"621":0,"622":0,"638":0,"714":0,"745":0};
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].functions = {"PaginatorPlugin:35":0,"initializer:47":0,"_bindAttrs:82":0,"_afterHostRender:111":0,"_afterHostSyncUI:151":0,"(anonymous 2):185":0,"_afterHostUIDimensionsChange:175":0,"_beforeHostScrollTo:233":0,"_afterHostGestureMoveEnd:271":0,"_beforeHostMousewheel:315":0,"_beforeHostFlick:350":0,"_afterHostScrollEnded:393":0,"_afterIndexChange:417":0,"_optimize:452":0,"_getStage:475":0,"_showNodes:496":0,"_hideNodes:509":0,"_getPageNodes:522":0,"next:537":0,"prev:556":0,"scrollTo:573":0,"scrollToIndex:585":0,"_axisSetter:618":0,"_afterAxisChange:637":0,"validator:711":0,"(anonymous 1):1":0};
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].coveredLines = 129;
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
            host = paginator._host,
            hostFlick = host.get(FLICK),
            pageNodes = paginator._getPageNodes(),
            size = pageNodes.size(),
            paginatorAxis;

        // Set the page count
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 160);
paginator.set(TOTAL, size);

        // If paginator's 'axis' property is to be automatically determined, inherit host's property
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 163);
if (paginator._cAxis === undefined) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 164);
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

        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterHostUIDimensionsChange", 175);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 177);
var paginator = this,
            host = paginator._host,
            dims = host._getScrollDims(),
            widgetWidth = dims.offsetWidth,
            widgetHeight = dims.offsetHeight,
            pageNodes = paginator._getPageNodes();
            
        // Inefficient. Should not reinitialize every page every syncUI
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 185);
pageNodes.each(function (node, i) {
            _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "(anonymous 2)", 185);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 186);
var scrollWidth = node.get('scrollWidth'),
                scrollHeight = node.get('scrollHeight'),
                maxScrollX = Math.max(0, scrollWidth - widgetWidth), // Math.max to ensure we don't set it to a negative value
                maxScrollY = Math.max(0, scrollHeight - widgetHeight);

            // Don't initialize any page _pageDims that already have been.
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 192);
if (!paginator._pageDims[i]) {

                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 194);
paginator._pageDims[i] = {

                    // Current scrollX & scrollY positions (default to 0)
                    scrollX: 0,
                    scrollY: 0,

                    // Minimum scrollable values
                    //@TODO What are these for?
                    _minScrollX: 0,
                    _minScrollY: 0,

                    // Maximum scrollable values
                    maxScrollX: maxScrollX,
                    maxScrollY: maxScrollY,

                    // Height & width of the page
                    width: scrollWidth,
                    height: scrollHeight
                };

            } else {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 215);
paginator._pageDims[i].maxScrollX = maxScrollX;
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 216);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_beforeHostScrollTo", 233);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 234);
var paginator = this,
            host = paginator._host,
            gesture = host._gesture,
            index = paginator._cIndex,
            paginatorAxis = paginator._cAxis,
            pageNodes = paginator._getPageNodes(),
            gestureAxis;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 242);
if (gesture) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 243);
gestureAxis = gesture.axis;

            // Null the opposite axis so it won't be modified by host.scrollTo
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 246);
if (gestureAxis === DIM_Y) {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 247);
x = null;
            } else {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 249);
y = null;
            }

            // If they are scrolling against the specified axis, pull out the page's node to have its own offset
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 253);
if (paginatorAxis[gestureAxis] === false) {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 254);
node = pageNodes.item(index);
            }

        }

        // Return the modified argument list
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 260);
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

        // This was a flick, so we don't need to do anything here
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterHostGestureMoveEnd", 271);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 274);
if (this._host._gesture.flick) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 275);
return false;
        }

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 278);
var paginator = this,
            host = paginator._host,
            gesture = host._gesture,
            index = paginator._cIndex,
            pageNodes = paginator._getPageNodes(),
            pageNode = pageNodes.item(index),
            paginatorAxis = paginator._cAxis,
            gestureAxis = gesture.axis,
            isHorizontal = (gestureAxis === DIM_X),
            delta = gesture[(gestureAxis === DIM_X ? 'deltaX' : 'deltaY')],
            isForward = (delta > 0),
            pageDims = paginator._pageDims[index],
            halfway = pageDims[(isHorizontal ? 'width' : 'height')] / 2,
            isHalfway = (Math.abs(delta) >= halfway),
            canScroll = paginatorAxis[gestureAxis],
            rtl = host.rtl;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 295);
if (canScroll) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 296);
if (isHalfway) { // TODO: This condition should probably be configurable
                // Fire next()/prev()
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 298);
paginator[rtl === isForward ? 'prev' : 'next']();
            }
            // Scrollback
            else {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 302);
paginator.scrollToIndex(paginator.get(INDEX));
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_beforeHostMousewheel", 315);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 316);
var paginator = this,
            host = paginator._host,
            bb = host._bb,
            isForward = (e.wheelDelta < 0), // down (negative) is forward. @TODO Should revisit.
            paginatorAxis = paginator._cAxis;

        // Set the axis for this event.
        // @TODO: This is hacky, it's not a gesture. Find a better way
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 324);
host._gesture = {
            axis: DIM_Y
        };

        // Only if the mousewheel event occurred on a DOM node inside the BB
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 329);
if (bb.contains(e.target) && paginatorAxis[DIM_Y]) {

            // Fire next()/prev()
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 332);
paginator[isForward ? 'next' : 'prev']();

            // prevent browser default behavior on mousewheel
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 335);
e.preventDefault();

            // Block host._mousewheel from running
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 338);
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

        // The drag was out of bounds, so do nothing (which will cause a snapback)
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_beforeHostFlick", 350);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 353);
if (this._host._isOutOfBounds()){
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 354);
return new Y.Do.Prevent();
        }
        
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 357);
var paginator = this,
            host = paginator._host,
            gesture = host._gesture,
            index = paginator._cIndex,
            paginatorAxis = paginator.get(AXIS),
            flick = e.flick,
            velocity = flick.velocity,
            flickAxis = flick.axis,
            isForward = (velocity < 0),
            canScroll = paginatorAxis[flickAxis],
            rtl = host.rtl;

        // Store the flick data in the this._host._gesture object so it knows this was a flick
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 370);
if (gesture) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 371);
gesture.flick = flick;
        }

        // Can we scroll along this axis?
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 375);
if (canScroll) {

            // Fire next()/prev()
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 378);
paginator[rtl === isForward ? 'prev' : 'next']();

            // Prevent flick animations on the paginated axis.
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 381);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterHostScrollEnded", 393);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 394);
var paginator = this,
            host = paginator._host,
            index = paginator._cIndex,
            scrollX = host.get(SCROLL_X),
            scrollY = host.get(SCROLL_Y),
            paginatorAxis = paginator._cAxis;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 401);
if (paginatorAxis[DIM_Y]) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 402);
paginator._pageDims[index].scrollX = scrollX;
        } else {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 404);
paginator._pageDims[index].scrollY = scrollY;
        }

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 407);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterIndexChange", 417);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 418);
var paginator = this,
            host = paginator._host,
            index = e.newVal,
            pageDims = paginator._pageDims[index],
            hostAxis = host._cAxis,
            paginatorAxis = paginator._cAxis;

        // Cache the new index value
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 426);
paginator._cIndex = index;

        // For dual-axis instances, we need to hack some host properties to the
        // current page's max height/width and current stored offset
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 430);
if (hostAxis[DIM_X] && hostAxis[DIM_Y]) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 431);
if (paginatorAxis[DIM_Y]) {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 432);
host._maxScrollX = pageDims.maxScrollX;
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 433);
host.set(SCROLL_X, pageDims.scrollX, { src: UI });
            }
            else {_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 435);
if (paginatorAxis[DIM_X]) {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 436);
host._maxScrollY = pageDims.maxScrollY;
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 437);
host.set(SCROLL_Y, pageDims.scrollY, { src: UI });
            }}
        }

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 441);
if (e.src !== UI) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 442);
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

        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_optimize", 452);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 454);
if (!this._optimizeMemory) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 455);
return false;
        }

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 458);
var paginator = this,
            currentIndex = paginator._cIndex,
            pageNodes = paginator._getStage(currentIndex);

        // Show the pages in/near the viewport & hide the rest
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 463);
paginator._showNodes(pageNodes.visible);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 464);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_getStage", 475);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 476);
var paginator = this,
            pageBuffer = paginator._pageBuffer,
            pageCount = paginator.get(TOTAL),
            pageNodes = paginator._getPageNodes(),
            start = Math.max(0, index - pageBuffer),
            end = Math.min(pageCount, index + 1 + pageBuffer); // noninclusive

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 483);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_showNodes", 496);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 497);
if (nodeList) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 498);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_hideNodes", 509);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 510);
if (nodeList) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 511);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_getPageNodes", 522);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 523);
var paginator = this,
            host = paginator._host,
            cb = host._cb,
            pageSelector = paginator.get(SELECTOR),
            pageNodes = pageSelector ? cb.all(pageSelector) : cb.get('children');

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 529);
return pageNodes;
    },

    /**
     * Scroll to the next page, with animation
     *
     * @method next
     */
    next: function () {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "next", 537);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 538);
var paginator = this,
            index = paginator._cIndex,
            target = index + 1,
            total = paginator.get(TOTAL);

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 543);
if (target >= total) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 544);
return;
        }

        // Update the index
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 548);
paginator.set(INDEX, target);
    },

    /**
     * Scroll to the previous page, with animation
     *
     * @method prev
     */
    prev: function () {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "prev", 556);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 557);
var paginator = this,
            index = paginator._cIndex,
            target = index - 1;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 561);
if (target < 0) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 562);
return;
        }

        // Update the index
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 566);
paginator.set(INDEX, target);
    },
    
    /** 
     * Deprecated for 3.7.0.
     * @deprecated
     */
    scrollTo: function () {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "scrollTo", 573);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 574);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "scrollToIndex", 585);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 586);
var paginator = this,
            host = paginator._host,
            pageNode = paginator._getPageNodes().item(index),
            scrollAxis = (paginator._cAxis[DIM_X] ? SCROLL_X : SCROLL_Y),
            scrollOffset = pageNode.get(scrollAxis === SCROLL_X ? 'offsetLeft' : 'offsetTop');

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 592);
duration = (duration !== undefined) ? duration : PaginatorPlugin.TRANSITION.duration;
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 593);
easing = (easing !== undefined) ? duration : PaginatorPlugin.TRANSITION.easing;

        // Set the index ATTR to the specified index value
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 596);
paginator.set(INDEX, index);

        // Makes sure the viewport nodes are visible
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 599);
paginator._showNodes(pageNode);

        // Scroll to the offset
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 602);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_axisSetter", 618);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 621);
if (Y.Lang.isString(val)) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 622);
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
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterAxisChange", 637);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 638);
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
                _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "validator", 711);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 714);
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

_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 745);
Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;

}, '@VERSION@', {"requires": ["plugin", "classnamemanager"]});
