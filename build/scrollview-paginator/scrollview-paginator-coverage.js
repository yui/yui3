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
_yuitest_coverage["scrollview-paginator"].code=["YUI.add('scrollview-paginator', function (Y, NAME) {","","/*global YUI,Y*/","","/**"," * Provides a plugin that adds pagination support to ScrollView instances"," *"," * @module scrollview-paginator"," */","var getClassName = Y.ClassNameManager.getClassName,","    SCROLLVIEW = 'scrollview',","    CLASS_HIDDEN = getClassName(SCROLLVIEW, 'hidden'),","    CLASS_PAGED = getClassName(SCROLLVIEW, 'paged'),","    UI = (Y.ScrollView) ? Y.ScrollView.UI_SRC : 'ui',","    INDEX = 'index',","    SCROLL_X = 'scrollX',","    SCROLL_Y = 'scrollY',","    TOTAL = 'total',","    HOST = 'host',","    BOUNDING_BOX = 'boundingBox',","    CONTENT_BOX = 'contentBox',","    SELECTOR = 'selector',","    FLICK = 'flick',","    DRAG = 'drag',","    DIM_X = 'x',","    DIM_Y = 'y';","","/**"," * Scrollview plugin that adds support for paging"," *"," * @class ScrollViewPaginator"," * @namespace Plugin"," * @extends Plugin.Base"," * @constructor"," */","function PaginatorPlugin() {","    PaginatorPlugin.superclass.constructor.apply(this, arguments);","}","","Y.extend(PaginatorPlugin, Y.Plugin.Base, {","","    /**","     * Designated initializer","     *","     * @method initializer","     * @param {config} Configuration object for the plugin","     */","    initializer: function (config) {","        var paginator = this,","            host = paginator.get(HOST),","            bb = host._bb,","            cb = host._cb,","            axis = 'auto';","","        // Default it to an empty object","        config = config || {};","","        if (config.axis) {","            switch (config.axis.toLowerCase()) {","                case \"x\":","                    axis = {","                        x: true,","                        y: false","                    };","                    break;","                case \"y\":","                    axis = {","                        x: false,","                        y: true","                    };","                    break;","            }","        }","","        paginator.axis = axis;","","        // Initialize & default","        paginator.optimizeMemory = config.optimizeMemory || false;","        paginator.padding = config.padding || 1;","        paginator.cards = [];","","        // Cache some values","        paginator._bb = bb;","        paginator._cb = cb;","        paginator._host = host;","        paginator._cIndex = config.index || 0;","        paginator._prevent = new Y.Do.Prevent();","","        // Event listeners","        paginator.after('indexChange', paginator._afterIndexChange);","","        // Method listeners","        paginator.beforeHostMethod('scrollTo', paginator._beforeHostScrollTo);","        paginator.beforeHostMethod('_mousewheel', paginator._beforeHostMousewheel);","        paginator.afterHostMethod('_onGestureMoveEnd', paginator._afterHostGestureMoveEnd);","        paginator.afterHostMethod('_uiDimensionsChange', paginator._afterHostUIDimensionsChange);","        paginator.afterHostEvent('render', paginator._afterHostRender);","        paginator.afterHostEvent('scrollEnd', paginator._afterHostScrollEnded);","        paginator.afterHostMethod('syncUI', paginator._afterHostSyncUI);","    },","","    /**","     * After host render","     *","     * @method _afterHostRender","     * @param {Event.Facade}","     * @protected","     */","    _afterHostRender: function (e) {","        var paginator = this,","            bb = paginator._bb,","            host = paginator._host,","            index = paginator._cIndex,","            paginatorAxis = paginator.axis,","            pageNodes = paginator._getPageNodes(),","            size = pageNodes.size(),","            maxScrollX = paginator.cards[index].maxScrollX,","            maxScrollY = paginator.cards[index].maxScrollY;","","        if (paginatorAxis[DIM_Y]) {","            host._maxScrollX = maxScrollX;","        }","        else if (paginatorAxis[DIM_X]) {","            host._maxScrollY = maxScrollY;","        }","","        // Set the page count","        paginator.set(TOTAL, size);","","        // Jump to the index","        if (index !== 0) {","            paginator.scrollToIndex(index, 0);","        }","","        // Add the paginator class","        bb.addClass(CLASS_PAGED);","","        // paginator._optimize();","    },","","    /**","     * After host syncUI","     *","     * @method _afterHostSyncUI","     * @param {Event.Facade}","     * @protected","     */","    _afterHostSyncUI: function (e) {","        var paginator = this,","            host = paginator._host,","            hostFlick = host.get(FLICK);","","        // If paginator's 'axis' property is to be automatically determined, inherit host's property","        if (paginator.axis === 'auto') {","            paginator.axis = host.axis;","        }","","        // Don't allow flicks on the paginated axis","        if (paginator.axis[DIM_X]) {","            hostFlick.axis = DIM_Y;","            host.set(FLICK, hostFlick);","        }","        else if (paginator.axis[DIM_Y]) {","            hostFlick.axis = DIM_X;","            host.set(FLICK, hostFlick);","        }","    },","","    /**","     * After host _uiDimensionsChange","     *","     * @method _afterHostUIDimensionsChange","     * @param {Event.Facade}","     * @protected","     */","    _afterHostUIDimensionsChange: function (e) {","","        var paginator = this,","            host = paginator._host,","            bb = paginator._bb,","            widgetWidth = bb.get('offsetWidth'),","            widgetHeight = bb.get('offsetHeight'),","            pageNodes = paginator._getPageNodes(),","            size = pageNodes.size();","","        // Inefficient. Should not reinitialize every card every syncUI","        pageNodes.each(function (node, i) {","            var scrollWidth = node.get('scrollWidth'),","                scrollHeight = node.get('scrollHeight'),","                maxScrollX = Math.max(0, scrollWidth - widgetWidth),","                maxScrollY = Math.max(0, scrollHeight - widgetHeight);","","            // Don't initialize any cards that already have been.","            if (!paginator.cards[i]) {","                paginator.cards[i] = {","                    maxScrollX: maxScrollX,","                    maxScrollY: maxScrollY,","                    node: node,","                    scrollX: 0,","                    scrollY: 0","                };","            } else {","                paginator.cards[i].maxScrollX = maxScrollX;","                paginator.cards[i].maxScrollY = maxScrollY;","            }","","        });","    },","","    /**","     * Executed before host.scrollTo","     *","     * @method _beforeHostScrollTo","     * @param x {Number} The x-position to scroll to","     * @param y {Number} The y-position to scroll to","     * @param duration {Number} Duration, in ms, of the scroll animation (default is 0)","     * @param easing {String} An easing equation if duration is set","     * @param node {String} The node to move","     */","    _beforeHostScrollTo: function (x, y, duration, easing, node) {","        var paginator = this,","            host = paginator._host,","            gesture = host._gesture,","            index = paginator._cIndex,","            paginatorAxis = paginator.axis,","            gestureAxis;","","        if (gesture) {","            gestureAxis = gesture.axis;","","            // Null the opposite axis so it won't be modified by host.scrollTo","            if (gestureAxis === DIM_Y) {","                x = null;","            } else {","                y = null;","            }","","            // If they are scrolling against the specified axis, pull out the card as the node to have its own offset","            if (paginatorAxis[gestureAxis] === false) {","                node = paginator.cards[index].node;","            }","        }","","        // Return the modified argument list","        return new Y.Do.AlterArgs(\"new args\", [x, y, duration, easing, node]);","    },","","    /**","     * Executed after host._gestureMoveEnd","     * Determines if the gesture should page prev or next (if at all)","     *","     * @method _afterHostGestureMoveEnd","     * @param {Event.Facade}","     * @protected","     */","    _afterHostGestureMoveEnd: function (e) {","        var paginator = this,","            host = paginator._host,","            gesture = host._gesture,","            paginatorAxis = paginator.axis,","            gestureAxis = gesture && gesture.axis;","","        if (paginatorAxis[gestureAxis]) {","            if (gesture[(gestureAxis === DIM_X ? 'deltaX' : 'deltaY')] > 0) {","                paginator[host.rtl ? 'prev' : 'next']();","            } else {","                paginator[host.rtl ? 'next' : 'prev']();","            }","        }","    },","","    /**","     * Executed before host._mousewheel","     * Prevents mousewheel events in some conditions","     *","     * @method _beforeHostMousewheel","     * @param {Event.Facade}","     * @protected","     */","    _beforeHostMousewheel: function (e) {","        var paginator = this,","            host = paginator._host,","            bb = host._bb,","            isForward = e.wheelDelta < 0, // down (negative) is forward. @TODO Should revisit.","            paginatorAxis = paginator.axis;","","        // Set the axis for this event.","        // @TODO: This is hacky, it's not a gesture. Find a better way","        host._gesture = {","            axis: DIM_Y","        };","","        // Only if the mousewheel event occurred on a DOM node inside the BB","        if (bb.contains(e.target) && paginatorAxis[DIM_Y]) {","","            if (isForward) {","                paginator.next();","            } else {","                paginator.prev();","            }","","            // prevent browser default behavior on mousewheel","            e.preventDefault();","","            // Block host._mousewheel from running","            return paginator._prevent;","        }","    },","","    /**","     * Executes after host's 'scrollEnd' event","     * Runs cleanup operations","     *","     * @method _afterHostScrollEnded","     * @param {Event.Facade}","     * @protected","     */","    _afterHostScrollEnded: function (e) {","        var paginator = this,","            host = this._host,","            index = paginator._cIndex,","            scrollX = host.get(SCROLL_X),","            scrollY = host.get(SCROLL_Y),","            paginatorAxis = paginator.axis;","","        if (paginatorAxis[DIM_Y]) {","            paginator.cards[index].scrollX = scrollX;","        } else {","            paginator.cards[index].scrollY = scrollY;","        }","","        paginator._optimize();","    },","","    /**","     * index attr change handler","     *","     * @method _afterIndexChange","     * @param {Event.Facade}","     * @protected","     */","    _afterIndexChange: function (e) {","        var paginator = this,","            host = this._host,","            index = e.newVal,","            maxScrollX = paginator.cards[index].maxScrollX,","            maxScrollY = paginator.cards[index].maxScrollY,","            gesture = host._gesture,","            gestureAxis = gesture && gesture.axis;","","        if (gestureAxis === DIM_Y) {","            host._maxScrollX = maxScrollX;","            host.set(SCROLL_X, paginator.cards[index].scrollX, { src: UI });","        } else if (gestureAxis === DIM_X) {","            host._maxScrollY = maxScrollY;","            host.set(SCROLL_Y, paginator.cards[index].scrollY, { src: UI });","        }","","        // Cache the new index value","        paginator._cIndex = index;","","        if (e.src !== UI) {","            paginator.scrollToIndex(index);","        }","    },","","    /**","     * Hides page nodes not near the viewport","     *","     * @method _optimize","     * @protected","     */","    _optimize: function () {","","        if (!this.optimizeMemory) {","            return false;","        }","","        var paginator = this,","            host = paginator._host,","            optimizeMemory = paginator.optimizeMemory,","            currentIndex = paginator._cIndex,","            pageNodes;","","        // Show the pages in/near the viewport & hide the rest","        pageNodes = paginator._getStage(currentIndex);","        paginator._showNodes(pageNodes.visible);","        paginator._hideNodes(pageNodes.hidden);","    },","","    /**","     * Determines which nodes should be visible, and which should be hidden.","     *","     * @method _getStage","     * @param index {Number} The page index # intended to be in focus.","     * @returns {object}","     * @protected","     */","    _getStage: function (index) {","        var padding = this.padding,","            pageNodes = this._getPageNodes(),","            pageCount = this.get(TOTAL),","            start = Math.max(0, index - padding),","            end = Math.min(pageCount, index + 1 + padding); // noninclusive","","        return {","            visible: pageNodes.splice(start, end - start),","            hidden: pageNodes","        };","    },","","    /**","     * A utility method to show node(s)","     *","     * @method _showNodes","     * @param nodeList {Object} The list of nodes to show","     * @protected","     */","    _showNodes: function (nodeList) {","        if (nodeList) {","            nodeList.removeClass(CLASS_HIDDEN).setStyle('visibility', '');","        }","    },","","    /**","     * A utility method to hide node(s)","     *","     * @method _hideNodes","     * @param nodeList {Object} The list of nodes to hide","     * @protected","     */","    _hideNodes: function (nodeList) {","        if (nodeList) {","            nodeList.addClass(CLASS_HIDDEN).setStyle('visibility', 'hidden');","        }","    },","","    /**","     * Gets a nodeList for the \"pages\"","     *","     * @method _getPageNodes","     * @protected","     * @returns {nodeList}","     */","    _getPageNodes: function () {","        var paginator = this,","            host = paginator._host,","            cb = host._cb,","            pageSelector = paginator.get(SELECTOR),","            pageNodes = pageSelector ? cb.all(pageSelector) : cb.get('children');","","        return pageNodes;","    },","","    /**","     * Scroll to the next page in the scrollview, with animation","     *","     * @method next","     */","    next: function () {","        var paginator = this,","            index = paginator._cIndex,","            target = index + 1,","            total = this.get(TOTAL);","","        if (target >= total) {","            return;","        }","","        // Update the index","        paginator.set(INDEX, target);","    },","","    /**","     * Scroll to the previous page in the scrollview, with animation","     *","     * @method prev","     */","    prev: function () {","        var paginator = this,","            index = paginator._cIndex,","            target = index - 1;","","        if (target < 0) {","            return;","        }","","        // Update the index","        paginator.set(INDEX, target);","    },","    ","    /** ","     * @deprecated","     */","    scrollTo: function () {","        return this.scrollToIndex.apply(this, arguments);","    },","","    /**","     * Scroll to a given page in the scrollview","     *","     * @method scrollToIndex","     * @param index {Number} The index of the page to scroll to","     * @param duration {Number} The number of ms the animation should last","     * @param easing {String} The timing function to use in the animation","     */","    scrollToIndex: function (index, duration, easing) {","","        var paginator = this,","            host = paginator._host,","            pageNode = paginator._getPageNodes().item(index),","            scrollAxis = (paginator.axis[DIM_X] ? SCROLL_X : SCROLL_Y),","            scrollOffset = pageNode.get(scrollAxis === SCROLL_X ? 'offsetLeft' : 'offsetTop');","","        duration = (duration !== undefined) ? duration : PaginatorPlugin.TRANSITION.duration;","        easing = (easing !== undefined) ? duration : PaginatorPlugin.TRANSITION.easing;","","        // Set the index ATTR to the specified index value","        paginator.set(INDEX, index);","","        // Makes sure the viewport nodes are visible","        paginator._showNodes(pageNode);","","        // Scroll to the offset","        host.set(scrollAxis, scrollOffset, {","            duration: duration,","            easing: easing","        });","    }","    ","    // End prototype properties","","}, {","    ","    // Static properties","","    /**","     * The identity of the plugin","     *","     * @property NAME","     * @type String","     * @default 'pluginScrollViewPaginator'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'pluginScrollViewPaginator',","","    /**","     * The namespace on which the plugin will reside","     *","     * @property NS","     * @type String","     * @default 'pages'","     * @static","     */","    NS: 'pages',","","    /**","     * The default attribute configuration for the plugin","     *","     * @property ATTRS","     * @type {Object}","     * @static","     */","    ATTRS: {","","        /**","         * CSS selector for a page inside the scrollview. The scrollview","         * will snap to the closest page.","         *","         * @attribute selector","         * @type {String}","         * @default null","         */","        selector: {","            value: null","        },","","        /**","         * The active page number for a paged scrollview","         *","         * @attribute index","         * @type {Number}","         * @default 0","         */","        index: {","            value: 0,","            validator: function (val) {","                // TODO: Remove this?","                // return val >= 0 && val < this.get(TOTAL);","                return true;","            }","        },","","        /**","         * The total number of pages","         *","         * @attribute total","         * @type {Number}","         * @default 0","         */","        total: {","            value: 0","        },","","        /**","         * The axis on which to paginate","         *","         * @attribute axis","         * @type {String}","         * @default 'x'","         */","        axis: {","            value: DIM_X","        }","    },","        ","    /**","     * The default snap to current duration and easing values used on scroll end.","     *","     * @property SNAP_TO_CURRENT","     * @static","     */","    TRANSITION: {","        duration: 300,","        easing: 'ease-out'","    }","","    // End static properties","","});","","Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;","","}, '@VERSION@', {\"requires\": [\"plugin\", \"classnamemanager\"]});"];
_yuitest_coverage["scrollview-paginator"].lines = {"1":0,"10":0,"36":0,"37":0,"40":0,"49":0,"56":0,"58":0,"59":0,"61":0,"65":0,"67":0,"71":0,"75":0,"78":0,"79":0,"80":0,"83":0,"84":0,"85":0,"86":0,"87":0,"90":0,"93":0,"94":0,"95":0,"96":0,"97":0,"98":0,"99":0,"110":0,"120":0,"121":0,"123":0,"124":0,"128":0,"131":0,"132":0,"136":0,"149":0,"154":0,"155":0,"159":0,"160":0,"161":0,"163":0,"164":0,"165":0,"178":0,"187":0,"188":0,"194":0,"195":0,"203":0,"204":0,"221":0,"228":0,"229":0,"232":0,"233":0,"235":0,"239":0,"240":0,"245":0,"257":0,"263":0,"264":0,"265":0,"267":0,"281":0,"289":0,"294":0,"296":0,"297":0,"299":0,"303":0,"306":0,"319":0,"326":0,"327":0,"329":0,"332":0,"343":0,"351":0,"352":0,"353":0,"354":0,"355":0,"356":0,"360":0,"362":0,"363":0,"375":0,"376":0,"379":0,"386":0,"387":0,"388":0,"400":0,"406":0,"420":0,"421":0,"433":0,"434":0,"446":0,"452":0,"461":0,"466":0,"467":0,"471":0,"480":0,"484":0,"485":0,"489":0,"496":0,"509":0,"515":0,"516":0,"519":0,"522":0,"525":0,"592":0,"634":0};
_yuitest_coverage["scrollview-paginator"].functions = {"PaginatorPlugin:36":0,"initializer:48":0,"_afterHostRender:109":0,"_afterHostSyncUI:148":0,"(anonymous 2):187":0,"_afterHostUIDimensionsChange:176":0,"_beforeHostScrollTo:220":0,"_afterHostGestureMoveEnd:256":0,"_beforeHostMousewheel:280":0,"_afterHostScrollEnded:318":0,"_afterIndexChange:342":0,"_optimize:373":0,"_getStage:399":0,"_showNodes:419":0,"_hideNodes:432":0,"_getPageNodes:445":0,"next:460":0,"prev:479":0,"scrollTo:495":0,"scrollToIndex:507":0,"validator:589":0,"(anonymous 1):1":0};
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

        _yuitest_coverline("scrollview-paginator", 75);
paginator.axis = axis;

        // Initialize & default
        _yuitest_coverline("scrollview-paginator", 78);
paginator.optimizeMemory = config.optimizeMemory || false;
        _yuitest_coverline("scrollview-paginator", 79);
paginator.padding = config.padding || 1;
        _yuitest_coverline("scrollview-paginator", 80);
paginator.cards = [];

        // Cache some values
        _yuitest_coverline("scrollview-paginator", 83);
paginator._bb = bb;
        _yuitest_coverline("scrollview-paginator", 84);
paginator._cb = cb;
        _yuitest_coverline("scrollview-paginator", 85);
paginator._host = host;
        _yuitest_coverline("scrollview-paginator", 86);
paginator._cIndex = config.index || 0;
        _yuitest_coverline("scrollview-paginator", 87);
paginator._prevent = new Y.Do.Prevent();

        // Event listeners
        _yuitest_coverline("scrollview-paginator", 90);
paginator.after('indexChange', paginator._afterIndexChange);

        // Method listeners
        _yuitest_coverline("scrollview-paginator", 93);
paginator.beforeHostMethod('scrollTo', paginator._beforeHostScrollTo);
        _yuitest_coverline("scrollview-paginator", 94);
paginator.beforeHostMethod('_mousewheel', paginator._beforeHostMousewheel);
        _yuitest_coverline("scrollview-paginator", 95);
paginator.afterHostMethod('_onGestureMoveEnd', paginator._afterHostGestureMoveEnd);
        _yuitest_coverline("scrollview-paginator", 96);
paginator.afterHostMethod('_uiDimensionsChange', paginator._afterHostUIDimensionsChange);
        _yuitest_coverline("scrollview-paginator", 97);
paginator.afterHostEvent('render', paginator._afterHostRender);
        _yuitest_coverline("scrollview-paginator", 98);
paginator.afterHostEvent('scrollEnd', paginator._afterHostScrollEnded);
        _yuitest_coverline("scrollview-paginator", 99);
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
        _yuitest_coverfunc("scrollview-paginator", "_afterHostRender", 109);
_yuitest_coverline("scrollview-paginator", 110);
var paginator = this,
            bb = paginator._bb,
            host = paginator._host,
            index = paginator._cIndex,
            paginatorAxis = paginator.axis,
            pageNodes = paginator._getPageNodes(),
            size = pageNodes.size(),
            maxScrollX = paginator.cards[index].maxScrollX,
            maxScrollY = paginator.cards[index].maxScrollY;

        _yuitest_coverline("scrollview-paginator", 120);
if (paginatorAxis[DIM_Y]) {
            _yuitest_coverline("scrollview-paginator", 121);
host._maxScrollX = maxScrollX;
        }
        else {_yuitest_coverline("scrollview-paginator", 123);
if (paginatorAxis[DIM_X]) {
            _yuitest_coverline("scrollview-paginator", 124);
host._maxScrollY = maxScrollY;
        }}

        // Set the page count
        _yuitest_coverline("scrollview-paginator", 128);
paginator.set(TOTAL, size);

        // Jump to the index
        _yuitest_coverline("scrollview-paginator", 131);
if (index !== 0) {
            _yuitest_coverline("scrollview-paginator", 132);
paginator.scrollToIndex(index, 0);
        }

        // Add the paginator class
        _yuitest_coverline("scrollview-paginator", 136);
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
        _yuitest_coverfunc("scrollview-paginator", "_afterHostSyncUI", 148);
_yuitest_coverline("scrollview-paginator", 149);
var paginator = this,
            host = paginator._host,
            hostFlick = host.get(FLICK);

        // If paginator's 'axis' property is to be automatically determined, inherit host's property
        _yuitest_coverline("scrollview-paginator", 154);
if (paginator.axis === 'auto') {
            _yuitest_coverline("scrollview-paginator", 155);
paginator.axis = host.axis;
        }

        // Don't allow flicks on the paginated axis
        _yuitest_coverline("scrollview-paginator", 159);
if (paginator.axis[DIM_X]) {
            _yuitest_coverline("scrollview-paginator", 160);
hostFlick.axis = DIM_Y;
            _yuitest_coverline("scrollview-paginator", 161);
host.set(FLICK, hostFlick);
        }
        else {_yuitest_coverline("scrollview-paginator", 163);
if (paginator.axis[DIM_Y]) {
            _yuitest_coverline("scrollview-paginator", 164);
hostFlick.axis = DIM_X;
            _yuitest_coverline("scrollview-paginator", 165);
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

        _yuitest_coverfunc("scrollview-paginator", "_afterHostUIDimensionsChange", 176);
_yuitest_coverline("scrollview-paginator", 178);
var paginator = this,
            host = paginator._host,
            bb = paginator._bb,
            widgetWidth = bb.get('offsetWidth'),
            widgetHeight = bb.get('offsetHeight'),
            pageNodes = paginator._getPageNodes(),
            size = pageNodes.size();

        // Inefficient. Should not reinitialize every card every syncUI
        _yuitest_coverline("scrollview-paginator", 187);
pageNodes.each(function (node, i) {
            _yuitest_coverfunc("scrollview-paginator", "(anonymous 2)", 187);
_yuitest_coverline("scrollview-paginator", 188);
var scrollWidth = node.get('scrollWidth'),
                scrollHeight = node.get('scrollHeight'),
                maxScrollX = Math.max(0, scrollWidth - widgetWidth),
                maxScrollY = Math.max(0, scrollHeight - widgetHeight);

            // Don't initialize any cards that already have been.
            _yuitest_coverline("scrollview-paginator", 194);
if (!paginator.cards[i]) {
                _yuitest_coverline("scrollview-paginator", 195);
paginator.cards[i] = {
                    maxScrollX: maxScrollX,
                    maxScrollY: maxScrollY,
                    node: node,
                    scrollX: 0,
                    scrollY: 0
                };
            } else {
                _yuitest_coverline("scrollview-paginator", 203);
paginator.cards[i].maxScrollX = maxScrollX;
                _yuitest_coverline("scrollview-paginator", 204);
paginator.cards[i].maxScrollY = maxScrollY;
            }

        });
    },

    /**
     * Executed before host.scrollTo
     *
     * @method _beforeHostScrollTo
     * @param x {Number} The x-position to scroll to
     * @param y {Number} The y-position to scroll to
     * @param duration {Number} Duration, in ms, of the scroll animation (default is 0)
     * @param easing {String} An easing equation if duration is set
     * @param node {String} The node to move
     */
    _beforeHostScrollTo: function (x, y, duration, easing, node) {
        _yuitest_coverfunc("scrollview-paginator", "_beforeHostScrollTo", 220);
_yuitest_coverline("scrollview-paginator", 221);
var paginator = this,
            host = paginator._host,
            gesture = host._gesture,
            index = paginator._cIndex,
            paginatorAxis = paginator.axis,
            gestureAxis;

        _yuitest_coverline("scrollview-paginator", 228);
if (gesture) {
            _yuitest_coverline("scrollview-paginator", 229);
gestureAxis = gesture.axis;

            // Null the opposite axis so it won't be modified by host.scrollTo
            _yuitest_coverline("scrollview-paginator", 232);
if (gestureAxis === DIM_Y) {
                _yuitest_coverline("scrollview-paginator", 233);
x = null;
            } else {
                _yuitest_coverline("scrollview-paginator", 235);
y = null;
            }

            // If they are scrolling against the specified axis, pull out the card as the node to have its own offset
            _yuitest_coverline("scrollview-paginator", 239);
if (paginatorAxis[gestureAxis] === false) {
                _yuitest_coverline("scrollview-paginator", 240);
node = paginator.cards[index].node;
            }
        }

        // Return the modified argument list
        _yuitest_coverline("scrollview-paginator", 245);
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
        _yuitest_coverfunc("scrollview-paginator", "_afterHostGestureMoveEnd", 256);
_yuitest_coverline("scrollview-paginator", 257);
var paginator = this,
            host = paginator._host,
            gesture = host._gesture,
            paginatorAxis = paginator.axis,
            gestureAxis = gesture && gesture.axis;

        _yuitest_coverline("scrollview-paginator", 263);
if (paginatorAxis[gestureAxis]) {
            _yuitest_coverline("scrollview-paginator", 264);
if (gesture[(gestureAxis === DIM_X ? 'deltaX' : 'deltaY')] > 0) {
                _yuitest_coverline("scrollview-paginator", 265);
paginator[host.rtl ? 'prev' : 'next']();
            } else {
                _yuitest_coverline("scrollview-paginator", 267);
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
        _yuitest_coverfunc("scrollview-paginator", "_beforeHostMousewheel", 280);
_yuitest_coverline("scrollview-paginator", 281);
var paginator = this,
            host = paginator._host,
            bb = host._bb,
            isForward = e.wheelDelta < 0, // down (negative) is forward. @TODO Should revisit.
            paginatorAxis = paginator.axis;

        // Set the axis for this event.
        // @TODO: This is hacky, it's not a gesture. Find a better way
        _yuitest_coverline("scrollview-paginator", 289);
host._gesture = {
            axis: DIM_Y
        };

        // Only if the mousewheel event occurred on a DOM node inside the BB
        _yuitest_coverline("scrollview-paginator", 294);
if (bb.contains(e.target) && paginatorAxis[DIM_Y]) {

            _yuitest_coverline("scrollview-paginator", 296);
if (isForward) {
                _yuitest_coverline("scrollview-paginator", 297);
paginator.next();
            } else {
                _yuitest_coverline("scrollview-paginator", 299);
paginator.prev();
            }

            // prevent browser default behavior on mousewheel
            _yuitest_coverline("scrollview-paginator", 303);
e.preventDefault();

            // Block host._mousewheel from running
            _yuitest_coverline("scrollview-paginator", 306);
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
        _yuitest_coverfunc("scrollview-paginator", "_afterHostScrollEnded", 318);
_yuitest_coverline("scrollview-paginator", 319);
var paginator = this,
            host = this._host,
            index = paginator._cIndex,
            scrollX = host.get(SCROLL_X),
            scrollY = host.get(SCROLL_Y),
            paginatorAxis = paginator.axis;

        _yuitest_coverline("scrollview-paginator", 326);
if (paginatorAxis[DIM_Y]) {
            _yuitest_coverline("scrollview-paginator", 327);
paginator.cards[index].scrollX = scrollX;
        } else {
            _yuitest_coverline("scrollview-paginator", 329);
paginator.cards[index].scrollY = scrollY;
        }

        _yuitest_coverline("scrollview-paginator", 332);
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
        _yuitest_coverfunc("scrollview-paginator", "_afterIndexChange", 342);
_yuitest_coverline("scrollview-paginator", 343);
var paginator = this,
            host = this._host,
            index = e.newVal,
            maxScrollX = paginator.cards[index].maxScrollX,
            maxScrollY = paginator.cards[index].maxScrollY,
            gesture = host._gesture,
            gestureAxis = gesture && gesture.axis;

        _yuitest_coverline("scrollview-paginator", 351);
if (gestureAxis === DIM_Y) {
            _yuitest_coverline("scrollview-paginator", 352);
host._maxScrollX = maxScrollX;
            _yuitest_coverline("scrollview-paginator", 353);
host.set(SCROLL_X, paginator.cards[index].scrollX, { src: UI });
        } else {_yuitest_coverline("scrollview-paginator", 354);
if (gestureAxis === DIM_X) {
            _yuitest_coverline("scrollview-paginator", 355);
host._maxScrollY = maxScrollY;
            _yuitest_coverline("scrollview-paginator", 356);
host.set(SCROLL_Y, paginator.cards[index].scrollY, { src: UI });
        }}

        // Cache the new index value
        _yuitest_coverline("scrollview-paginator", 360);
paginator._cIndex = index;

        _yuitest_coverline("scrollview-paginator", 362);
if (e.src !== UI) {
            _yuitest_coverline("scrollview-paginator", 363);
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

        _yuitest_coverfunc("scrollview-paginator", "_optimize", 373);
_yuitest_coverline("scrollview-paginator", 375);
if (!this.optimizeMemory) {
            _yuitest_coverline("scrollview-paginator", 376);
return false;
        }

        _yuitest_coverline("scrollview-paginator", 379);
var paginator = this,
            host = paginator._host,
            optimizeMemory = paginator.optimizeMemory,
            currentIndex = paginator._cIndex,
            pageNodes;

        // Show the pages in/near the viewport & hide the rest
        _yuitest_coverline("scrollview-paginator", 386);
pageNodes = paginator._getStage(currentIndex);
        _yuitest_coverline("scrollview-paginator", 387);
paginator._showNodes(pageNodes.visible);
        _yuitest_coverline("scrollview-paginator", 388);
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
        _yuitest_coverfunc("scrollview-paginator", "_getStage", 399);
_yuitest_coverline("scrollview-paginator", 400);
var padding = this.padding,
            pageNodes = this._getPageNodes(),
            pageCount = this.get(TOTAL),
            start = Math.max(0, index - padding),
            end = Math.min(pageCount, index + 1 + padding); // noninclusive

        _yuitest_coverline("scrollview-paginator", 406);
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
        _yuitest_coverfunc("scrollview-paginator", "_showNodes", 419);
_yuitest_coverline("scrollview-paginator", 420);
if (nodeList) {
            _yuitest_coverline("scrollview-paginator", 421);
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
        _yuitest_coverfunc("scrollview-paginator", "_hideNodes", 432);
_yuitest_coverline("scrollview-paginator", 433);
if (nodeList) {
            _yuitest_coverline("scrollview-paginator", 434);
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
        _yuitest_coverfunc("scrollview-paginator", "_getPageNodes", 445);
_yuitest_coverline("scrollview-paginator", 446);
var paginator = this,
            host = paginator._host,
            cb = host._cb,
            pageSelector = paginator.get(SELECTOR),
            pageNodes = pageSelector ? cb.all(pageSelector) : cb.get('children');

        _yuitest_coverline("scrollview-paginator", 452);
return pageNodes;
    },

    /**
     * Scroll to the next page in the scrollview, with animation
     *
     * @method next
     */
    next: function () {
        _yuitest_coverfunc("scrollview-paginator", "next", 460);
_yuitest_coverline("scrollview-paginator", 461);
var paginator = this,
            index = paginator._cIndex,
            target = index + 1,
            total = this.get(TOTAL);

        _yuitest_coverline("scrollview-paginator", 466);
if (target >= total) {
            _yuitest_coverline("scrollview-paginator", 467);
return;
        }

        // Update the index
        _yuitest_coverline("scrollview-paginator", 471);
paginator.set(INDEX, target);
    },

    /**
     * Scroll to the previous page in the scrollview, with animation
     *
     * @method prev
     */
    prev: function () {
        _yuitest_coverfunc("scrollview-paginator", "prev", 479);
_yuitest_coverline("scrollview-paginator", 480);
var paginator = this,
            index = paginator._cIndex,
            target = index - 1;

        _yuitest_coverline("scrollview-paginator", 484);
if (target < 0) {
            _yuitest_coverline("scrollview-paginator", 485);
return;
        }

        // Update the index
        _yuitest_coverline("scrollview-paginator", 489);
paginator.set(INDEX, target);
    },
    
    /** 
     * @deprecated
     */
    scrollTo: function () {
        _yuitest_coverfunc("scrollview-paginator", "scrollTo", 495);
_yuitest_coverline("scrollview-paginator", 496);
return this.scrollToIndex.apply(this, arguments);
    },

    /**
     * Scroll to a given page in the scrollview
     *
     * @method scrollToIndex
     * @param index {Number} The index of the page to scroll to
     * @param duration {Number} The number of ms the animation should last
     * @param easing {String} The timing function to use in the animation
     */
    scrollToIndex: function (index, duration, easing) {

        _yuitest_coverfunc("scrollview-paginator", "scrollToIndex", 507);
_yuitest_coverline("scrollview-paginator", 509);
var paginator = this,
            host = paginator._host,
            pageNode = paginator._getPageNodes().item(index),
            scrollAxis = (paginator.axis[DIM_X] ? SCROLL_X : SCROLL_Y),
            scrollOffset = pageNode.get(scrollAxis === SCROLL_X ? 'offsetLeft' : 'offsetTop');

        _yuitest_coverline("scrollview-paginator", 515);
duration = (duration !== undefined) ? duration : PaginatorPlugin.TRANSITION.duration;
        _yuitest_coverline("scrollview-paginator", 516);
easing = (easing !== undefined) ? duration : PaginatorPlugin.TRANSITION.easing;

        // Set the index ATTR to the specified index value
        _yuitest_coverline("scrollview-paginator", 519);
paginator.set(INDEX, index);

        // Makes sure the viewport nodes are visible
        _yuitest_coverline("scrollview-paginator", 522);
paginator._showNodes(pageNode);

        // Scroll to the offset
        _yuitest_coverline("scrollview-paginator", 525);
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
                _yuitest_coverfunc("scrollview-paginator", "validator", 589);
_yuitest_coverline("scrollview-paginator", 592);
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
        },

        /**
         * The axis on which to paginate
         *
         * @attribute axis
         * @type {String}
         * @default 'x'
         */
        axis: {
            value: DIM_X
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

_yuitest_coverline("scrollview-paginator", 634);
Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;

}, '@VERSION@', {"requires": ["plugin", "classnamemanager"]});
