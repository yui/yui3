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
_yuitest_coverage["/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js",
    code: []
};
_yuitest_coverage["/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js"].code=["YUI.add('scrollview-paginator', function(Y) {","","/*jslint nomen:true sloppy:true white:true*/","/*global Y*/","","/**"," * Provides a plugin, which adds pagination support to ScrollView instances"," *"," * @module scrollview-paginator"," */","var getClassName = Y.ClassNameManager.getClassName,","    SCROLLVIEW = 'scrollview',","    CLASS_HIDDEN = getClassName(SCROLLVIEW, 'hidden'),","    CLASS_PAGED = getClassName(SCROLLVIEW, 'paged'),","    UI = (Y.ScrollView) ? Y.ScrollView.UI_SRC : \"ui\",","    INDEX = \"index\",","    SCROLL_X = \"scrollX\",","    SCROLL_Y = \"scrollY\",","    TOTAL = \"total\",","    HOST = \"host\",","    BOUNDING_BOX = \"boundingBox\",","    CONTENT_BOX = \"contentBox\",","    SELECTOR = \"selector\",","    FLICK = \"flick\",","    DRAG = \"drag\";","","/**"," * Scrollview plugin that adds support for paging"," *"," * @class ScrollViewPaginator"," * @namespace Plugin"," * @extends Plugin.Base "," * @constructor"," */","function PaginatorPlugin() {","    PaginatorPlugin.superclass.constructor.apply(this, arguments);","}","","/**"," * The identity of the plugin"," *"," * @property NAME"," * @type String"," * @default 'paginatorPlugin'"," * @static"," */","PaginatorPlugin.NAME = 'pluginScrollViewPaginator';","","/**"," * The namespace on which the plugin will reside"," *"," * @property NS"," * @type String"," * @default 'pages'"," * @static"," */","PaginatorPlugin.NS = 'pages';","","/**"," * The default attribute configuration for the plugin"," *"," * @property ATTRS"," * @type Object"," * @static"," */","PaginatorPlugin.ATTRS = {","","    /**","     * CSS selector for a page inside the scrollview. The scrollview","     * will snap to the closest page.","     *","     * @attribute selector","     * @type {String}","     */","    selector: {","        value: null","    },","    ","    /**","     * The active page number for a paged scrollview","     *","     * @attribute index","     * @type {Number}","     * @default 0","     */","    index: {","        value: 0,","        validator: function(val) {","            return val >= 0 && val < this.get(TOTAL);","        }","    },","    ","    /**","     * The total number of pages","     *","     * @attribute total","     * @type {Number}","     * @default 0","     */","    total: {","        value: 0","    }","};","","Y.extend(PaginatorPlugin, Y.Plugin.Base, {","    ","    optimizeMemory: false,","    padding: 1,","    _uiEnabled: true,","    _prevent: new Y.Do.Prevent(),","    ","    /**","     * Designated initializer","     *","     * @method initializer","     */","    initializer: function (config) {","        var paginator = this,","            host = paginator.get(HOST),","            optimizeMemory = config.optimizeMemory || paginator.optimizeMemory,","            padding = config.padding || paginator.padding;","            ","        paginator.padding = padding;","        paginator.optimizeMemory = optimizeMemory;","        paginator._host = host;","        paginator._hostOriginalFlick = host.get(FLICK);","        paginator._hostOriginalDrag = host.get(DRAG);","        ","        paginator.beforeHostMethod('_mousewheel', paginator._mousewheel);","        paginator.beforeHostMethod('_flickFrame', paginator._flickFrame);","        paginator.beforeHostMethod('_onGestureMoveEnd', paginator._onGestureMoveEnd);","        paginator.afterHostMethod('_uiDimensionsChange', paginator._afterHostUIDimensionsChange);","        paginator.afterHostEvent('render', paginator._afterHostRender);","        paginator.afterHostEvent('scrollEnd', paginator._scrollEnded);","        paginator.after('indexChange', paginator._afterIndexChange);","    },","    ","    /**","     * After host render handler","     *","     * @method _afterHostRender","     * @param {Event.Facade}","     * @protected","     */","    _afterHostRender: function (e) {","        var paginator = this,","            host = paginator._host,","            pageNodes = paginator._getPageNodes(),","            size = pageNodes.size(),","            bb = host.get(BOUNDING_BOX);","            ","        bb.addClass(CLASS_PAGED);","        paginator.set(TOTAL, size);","        paginator._optimize();","    },","    ","    /**","     * After host _uiDimensionsChange","     *","     * @method _afterHostUIDimensionsChange","     * @param {Event.Facade}","     * @protected","     */","    _afterHostUIDimensionsChange: function(e) {","        var paginator = this;","        paginator.set(TOTAL, paginator._getPageNodes().size());","    },","     ","    /**","     * Over-rides the host _onGestureMoveEnd method","     * Executed on flicks at end of strip, or low velocity flicks that are not enough to advance the page.","     *","     * @method _onGestureMoveEnd","     * @protected","     */","    _onGestureMoveEnd: function (e) {","        var paginator = this,","            currentIndex = paginator.get(INDEX);","        ","        paginator.scrollTo(currentIndex);","    },","    ","    /**","     * Executed to respond to the flick event, by over-riding the default flickFrame animation. ","     * This is needed to determine if the next or prev page should be activated.","     *","     * @method _flickFrame","     * @protected","     */","    _flickFrame: function () {","        var paginator = this,","            host = paginator._host,","            velocity = host._currentVelocity,","            isForward = velocity < 0;","            ","        if (velocity) {","            if (isForward) {","                paginator.next();","            }","            else {","                paginator.prev();","            }","        }","","        return paginator._prevent;","    },","    ","    /**","     * Executed to respond to the mousewheel event, by over-riding the default mousewheel method.","     *","     * @method _mousewheel","     * @param {Event.Facade}","     * @protected","     */","    _mousewheel: function (e) {","        var paginator = this,","            host = paginator._host,","            isForward = e.wheelDelta < 0, // down (negative) is forward.  @TODO Should revisit.","            cb = host.get(CONTENT_BOX);","        ","        // Only if the mousewheel event occurred on a DOM node inside the CB","        if (cb.contains(e.target)){","            if (isForward) {","                paginator.next();","            }","            else {","                paginator.prev();","            }","            ","            // prevent browser default behavior on mousewheel","            e.preventDefault();","            ","            // Block host._mousewheel from running","            return paginator._prevent;","        }","    },","","    /**","     * scrollEnd handler to run some cleanup operations","     *","     * @method _scrollEnded","     * @param {Event.Facade}","     * @protected","     */","     _scrollEnded: function (e) {","        var paginator = this,","            currentIndex = paginator.get(INDEX);","        ","        paginator._optimize();","        this._uiEnable();","     },","","    /**","     * index attr change handler","     *","     * @method _afterIndexChange","     * @param {Event.Facade}","     * @protected","     */","    _afterIndexChange: function (e) {","        var paginator = this,","            index = e.newVal;","        ","        if(e.src !== UI) {","            paginator.scrollTo(index);","        }","    },","    ","    /**","     * Improves performance by hiding page nodes not near the viewport","     *","     * @method _optimize","     * @protected","     */","    _optimize: function() {","        var paginator = this,","            host = paginator._host,","            optimizeMemory = paginator.optimizeMemory,","            isVert = host._scrollsVertical,","            currentIndex = paginator.get(INDEX),","            pageNodes;","        ","        if (!optimizeMemory) {","            return false;","        }","        ","        // Show the pages in/near the viewport & hide the rest","        pageNodes = paginator._getStage(currentIndex);","        paginator._showNodes(pageNodes.visible);","        paginator._hideNodes(pageNodes.hidden);","        ","        paginator.scrollTo(currentIndex, 0);","    },","    ","    /**","     * Determines which nodes should be visible, and which should be hidden.","     *","     * @method _getStage","     * @param index {Number} The page index # intended to be in focus.","     * @returns {object} ","     * @protected","     */","    _getStage : function (index) {","        var paginator = this,","            host = paginator._host,","            padding = paginator.padding,","            visibleCount = padding + 1 + padding, // Before viewport | viewport | after viewport","            pageNodes = paginator._getPageNodes(),","            pageCount = paginator.get(TOTAL),","            start, visible, hidden;","        ","        // Somehow this works.  @TODO cleanup","        start = Math.max(index-padding, 0);","        if (start+visibleCount > pageCount) {","            start = start-(start+visibleCount-pageCount);","        }","        ","        visible = pageNodes.splice(start, visibleCount);","        hidden = pageNodes; // everything leftover","        ","        return {","            visible: visible,","            hidden: hidden","        };","    },","    ","    /**","     * A utility method to show node(s)","     *","     * @method _showNodes","     * @param nodeList {nodeList}","     * @protected","     */","    _showNodes : function (nodeList) {","        var host = this._host,","            cb = host.get(CONTENT_BOX);","            ","        if (nodeList) {","            nodeList.removeClass(CLASS_HIDDEN).setStyle('display', '');","        }","    },","    ","    /**","     * A utility method to hide node(s)","     *","     * @method _hideNodes","     * @param nodeList {nodeList}","     * @protected","     */","    _hideNodes : function (nodeList) {","        var host = this._host;","        ","        if (nodeList) {","            nodeList.addClass(CLASS_HIDDEN).setStyle('display', 'none');","        }","    },","    ","    /**","     * Enable UI interaction with the widget","     *","     * @method _uiEnable","     * @protected","     */","    _uiEnable: function () {","        var paginator = this,","            host = paginator._host,","            disabled = !paginator._uiEnabled;","        ","        if (disabled) {","            paginator._uiEnabled = true;","            host.set(FLICK, paginator._hostOriginalFlick);","            host.set(DRAG, paginator._hostOriginalDrag);   ","        }","    },","    ","    /**","     * Disable UI interaction with the widget","     *","     * @method _uiDisable","     * @protected","     */","    _uiDisable: function () {","        var paginator = this,","            host = paginator._host;","        ","        paginator._uiEnabled = false;","        host.set(FLICK, false);","        host.set(DRAG, false);","    },","    ","    /**","     * Gets a nodeList for the \"pages\"","     *","     * @method _getPageNodes","     * @protected","     * @returns {nodeList}","     */","    _getPageNodes: function() {","        var paginator = this,","            host = paginator._host,","            cb = host.get(CONTENT_BOX),","            pageSelector = paginator.get(SELECTOR),","            pageNodes = pageSelector ? cb.all(pageSelector) : cb.get(\"children\");","        ","        return pageNodes;","    },","","    /**","     * Scroll to the next page in the scrollview, with animation","     *","     * @method next","     */","    next: function () {","        var paginator = this,","            index = paginator.get(INDEX),","            target = index + 1;","            ","        if(paginator._uiEnabled) {","            paginator.set(INDEX, target);","        }","    },","","    /**","     * Scroll to the previous page in the scrollview, with animation","     *","     * @method prev","     */","    prev: function () {","        var paginator = this,","            index = paginator.get(INDEX),","            target = index - 1;","            ","        if(paginator._uiEnabled) {","            paginator.set(INDEX, target);","        }","    },","    ","    /**","     * Scroll to a given page in the scrollview","     *","     * @method scrollTo","     * @param index {Number} The index of the page to scroll to","     * @param duration {Number} The number of ms the animation should last","     * @param easing {String} The timing function to use in the animation","     */","    scrollTo: function (index, duration, easing) {","        var paginator = this,","            host = paginator._host,","            isVert = host._scrollsVertical,","            scrollAxis = (isVert) ? SCROLL_Y : SCROLL_X,","            pageNodes = paginator._getPageNodes(),","            startPoint = isVert ? host._startClientY : host._startClientX,","            endPoint = isVert ? host._endClientY : host._endClientX,","            delta = startPoint - endPoint,","            duration = (duration !== undefined) ? duration : PaginatorPlugin.TRANSITION.duration,","            easing = (easing !== undefined) ? duration : PaginatorPlugin.TRANSITION.easing,","            scrollVal;","        ","        // If the delta is 0 (a no-movement mouseclick)","        if (delta === 0) {","            return false;","        }","        ","        // Disable the UI while animating","        if (duration > 0) {","            paginator._uiDisable();","        }","        ","        // Make sure the target node is visible","        paginator._showNodes(pageNodes.item(index));","        ","        // Determine where to scroll to","        scrollVal = pageNodes.item(index).get(isVert ? \"offsetTop\" : \"offsetLeft\");","","        host.set(scrollAxis, scrollVal, {","            duration: duration,","            easing: easing","        });","    }","});","","/**"," * The default snap to current duration and easing values used on scroll end. "," * "," * @property SNAP_TO_CURRENT"," * @static"," */","PaginatorPlugin.TRANSITION = {","    duration : 300,","    easing : 'ease-out'","};","","Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;","","","}, '@VERSION@' ,{requires:['plugin', 'classnamemanager']});"];
_yuitest_coverage["/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js"].lines = {"1":0,"11":0,"35":0,"36":0,"47":0,"57":0,"66":0,"89":0,"105":0,"118":0,"123":0,"124":0,"125":0,"126":0,"127":0,"129":0,"130":0,"131":0,"132":0,"133":0,"134":0,"135":0,"146":0,"152":0,"153":0,"154":0,"165":0,"166":0,"177":0,"180":0,"191":0,"196":0,"197":0,"198":0,"201":0,"205":0,"216":0,"222":0,"223":0,"224":0,"227":0,"231":0,"234":0,"246":0,"249":0,"250":0,"261":0,"264":0,"265":0,"276":0,"283":0,"284":0,"288":0,"289":0,"290":0,"292":0,"304":0,"313":0,"314":0,"315":0,"318":0,"319":0,"321":0,"335":0,"338":0,"339":0,"351":0,"353":0,"354":0,"365":0,"369":0,"370":0,"371":0,"372":0,"383":0,"386":0,"387":0,"388":0,"399":0,"405":0,"414":0,"418":0,"419":0,"429":0,"433":0,"434":0,"447":0,"460":0,"461":0,"465":0,"466":0,"470":0,"473":0,"475":0,"488":0,"493":0};
_yuitest_coverage["/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js"].functions = {"PaginatorPlugin:35":0,"validator:88":0,"initializer:117":0,"_afterHostRender:145":0,"_afterHostUIDimensionsChange:164":0,"_onGestureMoveEnd:176":0,"_flickFrame:190":0,"_mousewheel:215":0,"_scrollEnded:245":0,"_afterIndexChange:260":0,"_optimize:275":0,"_getStage:303":0,"_showNodes:334":0,"_hideNodes:350":0,"_uiEnable:364":0,"_uiDisable:382":0,"_getPageNodes:398":0,"next:413":0,"prev:428":0,"scrollTo:446":0,"(anonymous 1):1":0};
_yuitest_coverage["/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js"].coveredLines = 96;
_yuitest_coverage["/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js"].coveredFunctions = 21;
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 1);
YUI.add('scrollview-paginator', function(Y) {

/*jslint nomen:true sloppy:true white:true*/
/*global Y*/

/**
 * Provides a plugin, which adds pagination support to ScrollView instances
 *
 * @module scrollview-paginator
 */
_yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "(anonymous 1)", 1);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 11);
var getClassName = Y.ClassNameManager.getClassName,
    SCROLLVIEW = 'scrollview',
    CLASS_HIDDEN = getClassName(SCROLLVIEW, 'hidden'),
    CLASS_PAGED = getClassName(SCROLLVIEW, 'paged'),
    UI = (Y.ScrollView) ? Y.ScrollView.UI_SRC : "ui",
    INDEX = "index",
    SCROLL_X = "scrollX",
    SCROLL_Y = "scrollY",
    TOTAL = "total",
    HOST = "host",
    BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    SELECTOR = "selector",
    FLICK = "flick",
    DRAG = "drag";

/**
 * Scrollview plugin that adds support for paging
 *
 * @class ScrollViewPaginator
 * @namespace Plugin
 * @extends Plugin.Base 
 * @constructor
 */
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 35);
function PaginatorPlugin() {
    _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "PaginatorPlugin", 35);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 36);
PaginatorPlugin.superclass.constructor.apply(this, arguments);
}

/**
 * The identity of the plugin
 *
 * @property NAME
 * @type String
 * @default 'paginatorPlugin'
 * @static
 */
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 47);
PaginatorPlugin.NAME = 'pluginScrollViewPaginator';

/**
 * The namespace on which the plugin will reside
 *
 * @property NS
 * @type String
 * @default 'pages'
 * @static
 */
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 57);
PaginatorPlugin.NS = 'pages';

/**
 * The default attribute configuration for the plugin
 *
 * @property ATTRS
 * @type Object
 * @static
 */
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 66);
PaginatorPlugin.ATTRS = {

    /**
     * CSS selector for a page inside the scrollview. The scrollview
     * will snap to the closest page.
     *
     * @attribute selector
     * @type {String}
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
        validator: function(val) {
            _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "validator", 88);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 89);
return val >= 0 && val < this.get(TOTAL);
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
};

_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 105);
Y.extend(PaginatorPlugin, Y.Plugin.Base, {
    
    optimizeMemory: false,
    padding: 1,
    _uiEnabled: true,
    _prevent: new Y.Do.Prevent(),
    
    /**
     * Designated initializer
     *
     * @method initializer
     */
    initializer: function (config) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "initializer", 117);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 118);
var paginator = this,
            host = paginator.get(HOST),
            optimizeMemory = config.optimizeMemory || paginator.optimizeMemory,
            padding = config.padding || paginator.padding;
            
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 123);
paginator.padding = padding;
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 124);
paginator.optimizeMemory = optimizeMemory;
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 125);
paginator._host = host;
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 126);
paginator._hostOriginalFlick = host.get(FLICK);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 127);
paginator._hostOriginalDrag = host.get(DRAG);
        
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 129);
paginator.beforeHostMethod('_mousewheel', paginator._mousewheel);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 130);
paginator.beforeHostMethod('_flickFrame', paginator._flickFrame);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 131);
paginator.beforeHostMethod('_onGestureMoveEnd', paginator._onGestureMoveEnd);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 132);
paginator.afterHostMethod('_uiDimensionsChange', paginator._afterHostUIDimensionsChange);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 133);
paginator.afterHostEvent('render', paginator._afterHostRender);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 134);
paginator.afterHostEvent('scrollEnd', paginator._scrollEnded);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 135);
paginator.after('indexChange', paginator._afterIndexChange);
    },
    
    /**
     * After host render handler
     *
     * @method _afterHostRender
     * @param {Event.Facade}
     * @protected
     */
    _afterHostRender: function (e) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_afterHostRender", 145);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 146);
var paginator = this,
            host = paginator._host,
            pageNodes = paginator._getPageNodes(),
            size = pageNodes.size(),
            bb = host.get(BOUNDING_BOX);
            
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 152);
bb.addClass(CLASS_PAGED);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 153);
paginator.set(TOTAL, size);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 154);
paginator._optimize();
    },
    
    /**
     * After host _uiDimensionsChange
     *
     * @method _afterHostUIDimensionsChange
     * @param {Event.Facade}
     * @protected
     */
    _afterHostUIDimensionsChange: function(e) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_afterHostUIDimensionsChange", 164);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 165);
var paginator = this;
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 166);
paginator.set(TOTAL, paginator._getPageNodes().size());
    },
     
    /**
     * Over-rides the host _onGestureMoveEnd method
     * Executed on flicks at end of strip, or low velocity flicks that are not enough to advance the page.
     *
     * @method _onGestureMoveEnd
     * @protected
     */
    _onGestureMoveEnd: function (e) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_onGestureMoveEnd", 176);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 177);
var paginator = this,
            currentIndex = paginator.get(INDEX);
        
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 180);
paginator.scrollTo(currentIndex);
    },
    
    /**
     * Executed to respond to the flick event, by over-riding the default flickFrame animation. 
     * This is needed to determine if the next or prev page should be activated.
     *
     * @method _flickFrame
     * @protected
     */
    _flickFrame: function () {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_flickFrame", 190);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 191);
var paginator = this,
            host = paginator._host,
            velocity = host._currentVelocity,
            isForward = velocity < 0;
            
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 196);
if (velocity) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 197);
if (isForward) {
                _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 198);
paginator.next();
            }
            else {
                _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 201);
paginator.prev();
            }
        }

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 205);
return paginator._prevent;
    },
    
    /**
     * Executed to respond to the mousewheel event, by over-riding the default mousewheel method.
     *
     * @method _mousewheel
     * @param {Event.Facade}
     * @protected
     */
    _mousewheel: function (e) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_mousewheel", 215);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 216);
var paginator = this,
            host = paginator._host,
            isForward = e.wheelDelta < 0, // down (negative) is forward.  @TODO Should revisit.
            cb = host.get(CONTENT_BOX);
        
        // Only if the mousewheel event occurred on a DOM node inside the CB
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 222);
if (cb.contains(e.target)){
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 223);
if (isForward) {
                _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 224);
paginator.next();
            }
            else {
                _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 227);
paginator.prev();
            }
            
            // prevent browser default behavior on mousewheel
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 231);
e.preventDefault();
            
            // Block host._mousewheel from running
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 234);
return paginator._prevent;
        }
    },

    /**
     * scrollEnd handler to run some cleanup operations
     *
     * @method _scrollEnded
     * @param {Event.Facade}
     * @protected
     */
     _scrollEnded: function (e) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_scrollEnded", 245);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 246);
var paginator = this,
            currentIndex = paginator.get(INDEX);
        
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 249);
paginator._optimize();
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 250);
this._uiEnable();
     },

    /**
     * index attr change handler
     *
     * @method _afterIndexChange
     * @param {Event.Facade}
     * @protected
     */
    _afterIndexChange: function (e) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_afterIndexChange", 260);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 261);
var paginator = this,
            index = e.newVal;
        
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 264);
if(e.src !== UI) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 265);
paginator.scrollTo(index);
        }
    },
    
    /**
     * Improves performance by hiding page nodes not near the viewport
     *
     * @method _optimize
     * @protected
     */
    _optimize: function() {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_optimize", 275);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 276);
var paginator = this,
            host = paginator._host,
            optimizeMemory = paginator.optimizeMemory,
            isVert = host._scrollsVertical,
            currentIndex = paginator.get(INDEX),
            pageNodes;
        
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 283);
if (!optimizeMemory) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 284);
return false;
        }
        
        // Show the pages in/near the viewport & hide the rest
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 288);
pageNodes = paginator._getStage(currentIndex);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 289);
paginator._showNodes(pageNodes.visible);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 290);
paginator._hideNodes(pageNodes.hidden);
        
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 292);
paginator.scrollTo(currentIndex, 0);
    },
    
    /**
     * Determines which nodes should be visible, and which should be hidden.
     *
     * @method _getStage
     * @param index {Number} The page index # intended to be in focus.
     * @returns {object} 
     * @protected
     */
    _getStage : function (index) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_getStage", 303);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 304);
var paginator = this,
            host = paginator._host,
            padding = paginator.padding,
            visibleCount = padding + 1 + padding, // Before viewport | viewport | after viewport
            pageNodes = paginator._getPageNodes(),
            pageCount = paginator.get(TOTAL),
            start, visible, hidden;
        
        // Somehow this works.  @TODO cleanup
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 313);
start = Math.max(index-padding, 0);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 314);
if (start+visibleCount > pageCount) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 315);
start = start-(start+visibleCount-pageCount);
        }
        
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 318);
visible = pageNodes.splice(start, visibleCount);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 319);
hidden = pageNodes; // everything leftover
        
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 321);
return {
            visible: visible,
            hidden: hidden
        };
    },
    
    /**
     * A utility method to show node(s)
     *
     * @method _showNodes
     * @param nodeList {nodeList}
     * @protected
     */
    _showNodes : function (nodeList) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_showNodes", 334);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 335);
var host = this._host,
            cb = host.get(CONTENT_BOX);
            
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 338);
if (nodeList) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 339);
nodeList.removeClass(CLASS_HIDDEN).setStyle('display', '');
        }
    },
    
    /**
     * A utility method to hide node(s)
     *
     * @method _hideNodes
     * @param nodeList {nodeList}
     * @protected
     */
    _hideNodes : function (nodeList) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_hideNodes", 350);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 351);
var host = this._host;
        
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 353);
if (nodeList) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 354);
nodeList.addClass(CLASS_HIDDEN).setStyle('display', 'none');
        }
    },
    
    /**
     * Enable UI interaction with the widget
     *
     * @method _uiEnable
     * @protected
     */
    _uiEnable: function () {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_uiEnable", 364);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 365);
var paginator = this,
            host = paginator._host,
            disabled = !paginator._uiEnabled;
        
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 369);
if (disabled) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 370);
paginator._uiEnabled = true;
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 371);
host.set(FLICK, paginator._hostOriginalFlick);
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 372);
host.set(DRAG, paginator._hostOriginalDrag);   
        }
    },
    
    /**
     * Disable UI interaction with the widget
     *
     * @method _uiDisable
     * @protected
     */
    _uiDisable: function () {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_uiDisable", 382);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 383);
var paginator = this,
            host = paginator._host;
        
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 386);
paginator._uiEnabled = false;
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 387);
host.set(FLICK, false);
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 388);
host.set(DRAG, false);
    },
    
    /**
     * Gets a nodeList for the "pages"
     *
     * @method _getPageNodes
     * @protected
     * @returns {nodeList}
     */
    _getPageNodes: function() {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "_getPageNodes", 398);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 399);
var paginator = this,
            host = paginator._host,
            cb = host.get(CONTENT_BOX),
            pageSelector = paginator.get(SELECTOR),
            pageNodes = pageSelector ? cb.all(pageSelector) : cb.get("children");
        
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 405);
return pageNodes;
    },

    /**
     * Scroll to the next page in the scrollview, with animation
     *
     * @method next
     */
    next: function () {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "next", 413);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 414);
var paginator = this,
            index = paginator.get(INDEX),
            target = index + 1;
            
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 418);
if(paginator._uiEnabled) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 419);
paginator.set(INDEX, target);
        }
    },

    /**
     * Scroll to the previous page in the scrollview, with animation
     *
     * @method prev
     */
    prev: function () {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "prev", 428);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 429);
var paginator = this,
            index = paginator.get(INDEX),
            target = index - 1;
            
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 433);
if(paginator._uiEnabled) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 434);
paginator.set(INDEX, target);
        }
    },
    
    /**
     * Scroll to a given page in the scrollview
     *
     * @method scrollTo
     * @param index {Number} The index of the page to scroll to
     * @param duration {Number} The number of ms the animation should last
     * @param easing {String} The timing function to use in the animation
     */
    scrollTo: function (index, duration, easing) {
        _yuitest_coverfunc("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", "scrollTo", 446);
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 447);
var paginator = this,
            host = paginator._host,
            isVert = host._scrollsVertical,
            scrollAxis = (isVert) ? SCROLL_Y : SCROLL_X,
            pageNodes = paginator._getPageNodes(),
            startPoint = isVert ? host._startClientY : host._startClientX,
            endPoint = isVert ? host._endClientY : host._endClientX,
            delta = startPoint - endPoint,
            duration = (duration !== undefined) ? duration : PaginatorPlugin.TRANSITION.duration,
            easing = (easing !== undefined) ? duration : PaginatorPlugin.TRANSITION.easing,
            scrollVal;
        
        // If the delta is 0 (a no-movement mouseclick)
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 460);
if (delta === 0) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 461);
return false;
        }
        
        // Disable the UI while animating
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 465);
if (duration > 0) {
            _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 466);
paginator._uiDisable();
        }
        
        // Make sure the target node is visible
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 470);
paginator._showNodes(pageNodes.item(index));
        
        // Determine where to scroll to
        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 473);
scrollVal = pageNodes.item(index).get(isVert ? "offsetTop" : "offsetLeft");

        _yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 475);
host.set(scrollAxis, scrollVal, {
            duration: duration,
            easing: easing
        });
    }
});

/**
 * The default snap to current duration and easing values used on scroll end. 
 * 
 * @property SNAP_TO_CURRENT
 * @static
 */
_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 488);
PaginatorPlugin.TRANSITION = {
    duration : 300,
    easing : 'ease-out'
};

_yuitest_coverline("/home/yui/src/yui3/src/scrollview/build_tmp/scrollview-paginator.js", 493);
Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;


}, '@VERSION@' ,{requires:['plugin', 'classnamemanager']});
