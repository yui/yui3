/**
 * Provides a plugin, which adds pagination support to ScrollView instances
 *
 * @module scrollview-paginator
 */

var UI = (Y.ScrollView) ? Y.ScrollView.UI_SRC : "ui",
    INDEX = "index",
    SCROLL_X = "scrollX",
    SCROLL_Y = "scrollY",
    TOTAL = "total",
    HOST = "host",
    BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    SELECTOR = "selector",
    FLICK = "flick",
    DRAG = "drag",
    CLASS_HIDDEN, // Set in Initializer
    CLASS_PAGED, // Set in Initializer
    _constrain = function (val, min, max) { 
        return Math.min(Math.max(val, min), max);
    };

/**
 * Scrollview plugin that adds support for paging
 *
 * @class ScrollViewPaginator
 * @namespace Plugin
 * @extends Plugin.Base 
 * @constructor
 */
function PaginatorPlugin() {
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
PaginatorPlugin.NAME = 'pluginScrollViewPaginator';

/**
 * The namespace on which the plugin will reside
 *
 * @property NS
 * @type String
 * @default 'pages'
 * @static
 */
PaginatorPlugin.NS = 'pages';

/**
 * The default attribute configuration for the plugin
 *
 * @property ATTRS
 * @type Object
 * @static
 */
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

Y.extend(PaginatorPlugin, Y.Plugin.Base, {
    
    optimizeMemory: false,
    _pageOffsets: null,
    _uiEnabled: true,
    _prevIndex: 0,    
    _prevent: new Y.Do.Prevent(),
    
    /**
     * Designated initializer
     *
     * @method initializer
     */
    initializer: function (config) {
        var paginator = this,
            host = paginator.get(HOST),
            optimizeMemory = config.optimizeMemory || paginator.optimizeMemory;
            
        // Set some static classes
        CLASS_HIDDEN = host.getClassName('hidden');
        CLASS_PAGED = host.getClassName("paged");
        
        paginator._host = host;
        paginator._hostOriginalFlick = host.get(FLICK);
        paginator._hostOriginalDrag = host.get(DRAG);
        paginator.optimizeMemory = optimizeMemory;
        
        paginator.beforeHostMethod('_mousewheel', paginator._mousewheel);
        paginator.beforeHostMethod('_flickFrame', paginator._flickFrame);
        paginator.beforeHostMethod('_onGestureMoveEnd', paginator._onGestureMoveEnd);
        paginator.afterHostMethod('_uiDimensionsChange', paginator._calcOffsets);
        paginator.afterHostEvent('render', paginator._afterHostRender);
        paginator.afterHostEvent('scrollEnd', paginator._scrollEnded);
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
        var paginator = this,
            host = paginator._host,
            bb = host.get(BOUNDING_BOX);
            
        bb.addClass(CLASS_PAGED); // @TODO Is this correct?
        paginator._optimize();
    },
    
    /**
     * Calculate the page boundary offsets
     * 
     * @method _calcOffsets
     * @protected
     */
     _calcOffsets : function () {
         var paginator = this,
             host = paginator._host,
             isVert = host._scrollsVertical,
             pages = paginator._getPageNodes();

         // Determine the offsets
         paginator._pageOffsets = pages.get((isVert) ? "offsetTop" : "offsetLeft");
     },
     
    /**
     * Over-rides the host _onGestureMoveEnd method
     * Executed on flicks at end of strip, or low velocity flicks that are not enough to advance the page.
     *
     * @method _onGestureMoveEnd
     * @protected
     */
    _onGestureMoveEnd: function () {
        var paginator = this,
            currentIndex = paginator.get(INDEX);
            
        paginator.scrollTo(currentIndex);
        
        return paginator._prevent;
    },
    
    /**
     * Executed to respond to the flick event, by over-riding the default flickFrame animation. 
     * This is needed to determine if the next or prev page should be activated.
     *
     * @method _flickFrame
     * @protected
     */
    _flickFrame: function () {
        var paginator = this,
            host = paginator._host,
            velocity = host._currentVelocity,
            isForward = velocity < 0;
            
        if (velocity) {
            if (isForward) {
                paginator.next();
            }
            else {
                paginator.prev();
            }
        }

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
        var paginator = this,
            host = paginator._host,
            isForward = e.wheelDelta < 0, // down (negative) is forward.  @TODO Should revisit.
            cb = host.get(CONTENT_BOX);
        
        // Only if the mousewheel event occurred on a DOM node inside the CB
        if (cb.contains(e.target)){
            if (isForward) {    
                paginator.next();
            }
            else {
                paginator.prev();
            }
            
            // prevent browser default behavior on mousewheel
            e.preventDefault();
            
            // Block host._mousewheel from running
            return paginator._prevent;
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
        var paginator = this,
            host = paginator._host,
            isVert = host._scrollsVertical,
            scrollAxis = (isVert) ? SCROLL_Y : SCROLL_X,
            pageNodes = paginator._getPageNodes(),
            scrollVal;
            
        // Disable the UI until scrolling is complete
        paginator._uiDisable();
            
        // Make sure it is visible
        paginator._showNodes(pageNodes.item(index));
        paginator._calcOffsets(); // @todo probably move somewhere else
        
        scrollVal = paginator._getIndexOffset(index);
        
        host.set(scrollAxis, scrollVal, {
            duration: duration || PaginatorPlugin.SNAP_TO_CURRENT.duration,
            easing: easing || PaginatorPlugin.SNAP_TO_CURRENT.easing
        });
    },
    
    /**
     * Return the offset value where scrollview should scroll to.
     * Neccesary because index # doesn't nessecarily map up to location in the DOM because of this.optimizeMemory
     *
     * @method _getIndexOffset
     * @param index {Number}
     * @returns {Number}
     * @protected
     */
    _getIndexOffset: function (index) {
        var paginator = this,
            previous = paginator._prevIndex,
            pageCount = paginator.get(TOTAL),
            
            // Some logic helpers
            isFirst = index === 0,
            isSecond = index === 1,
            isBackward = index < previous,
            isSame = index === previous,
            isForward = index > previous,
            isLast = index === pageCount-1,
            // end
            
            pageOffsets = paginator._pageOffsets,
            optimizeMemory = paginator.optimizeMemory,
            offset, 
            offsetModifier;
            
        if (optimizeMemory) {
            if (isBackward || isFirst) {  // If going backwards or index 0
                offsetModifier = 0;
            }
            else if (isSame || isSecond) { // If on index 1, scrolling "forward" from the last index, or a small gesture that should be snapped back
                offsetModifier = 1;
            }    
            else { // if scrolling forward from index > 0
                offsetModifier = 2;
            }
            
            offset = pageOffsets[index] - pageOffsets[Math.max(index-offsetModifier, 0)];
        }
        else {
            offset = pageOffsets[index];
        }
        
        return offset;
    },
    
    /**
     * scrollEnd handler to run some cleanup operations
     *
     * @method _scrollEnded
     * @param {Event.Facade}
     * @protected
     */
     _scrollEnded: function (e) {
        var paginator = this,
            currentIndex = paginator.get(INDEX);
            
        paginator._optimize();
        paginator._uiEnable();
        paginator._prevIndex = currentIndex;
     },

    /**
     * index attr change handler
     *
     * @method _afterIndexChange
     * @param {Event.Facade}
     * @protected
     */
    _afterIndexChange: function (e) {
        var paginator = this,
            index = e.newVal;
        
        if(e.src !== UI) {
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
        var paginator = this,
            host = paginator._host,
            optimizeMemory = paginator.optimizeMemory,
            isVert = host._scrollsVertical,
            count = 3,
            pageNodes,
            start,
            currentIndex,
            cb,
            pageCount,
            pageNodesDirty;
            
        if (!optimizeMemory) {
            return false;
        }
        
        pageNodes = paginator._getPageNodes();
        pageCount = paginator.get(TOTAL);
        currentIndex = paginator.get(INDEX);
        start = _constrain(currentIndex-1, 0, pageCount); // Make sure the number is between 0 & {pageCount}
        
        // If we're focusing the first or last page, only show 2
        if (currentIndex === 0 || currentIndex === pageCount) {
            count = 2;
        }
        
        // Show the pages in/near the viewport & hide the rest
        paginator._showNodes(pageNodes.splice(start, count));
        paginator._hideNodes(pageNodes);
        
        // Since we modified the layout, recalc
        paginator._calcOffsets();
        
        // We modified the previous pageNodes object, get a fresh copy
        pageNodes = paginator._getPageNodes();
        
        // @TODO: Should probably be directed at this.scrollTo(), but with a '0' duration.
        host.set((isVert ? SCROLL_Y : SCROLL_X), pageNodes.item(currentIndex).get(isVert ? "offsetTop" : "offsetLeft")); // Center
    },
    
    /**
     * A utility method to hide node(s)
     *
     * @method _hideNodes
     * @param nodeList {nodeList}
     * @protected
     */
    _hideNodes : function (nodeList) {
        var host = this._host;
        
        if (nodeList) {
            nodeList.addClass(CLASS_HIDDEN).setStyle('display', 'none');
        }
    },
    
    /**
     * A utility method to show node(s)
     *
     * @method _showNodes
     * @param nodeList {nodeList}
     * @protected
     */
    _showNodes : function (nodeList) {
         var host = this._host;
         
         if (nodeList) {
             nodeList.removeClass(CLASS_HIDDEN).setStyle('display', '');
         }
    },
    
    /**
     * Enable UI interaction with the widget
     *
     * @method _uiEnable
     * @protected
     */
    _uiEnable: function () {
        var paginator = this,
            host = paginator._host;
            
        paginator._uiEnabled = true;
        host.set(FLICK, paginator._hostOriginalFlick);
        host.set(DRAG, paginator._hostOriginalDrag);
    },
    
    /**
     * Disable UI interaction with the widget
     *
     * @method _uiDisable
     * @protected
     */
    _uiDisable: function () {
        var paginator = this,
            host = paginator._host;
            
        paginator._uiEnabled = false;
        host.set(FLICK, false);
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
        var paginator = this,
            host = paginator._host,
            cb = host.get(CONTENT_BOX),
            pageSelector = paginator.get(SELECTOR),
            pageNodes = pageSelector ? cb.all(pageSelector) : cb.get("children"),
            size = pageNodes.size();
        
        // @TODO This seems like it should be elsewhere
        paginator.set(TOTAL, size);
        
        return pageNodes;
    },

    /**
     * Scroll to the next page in the scrollview, with animation
     *
     * @method next
     */
    next: function () {
        var paginator = this,
            index = paginator.get(INDEX),
            target = index + 1;
            
        if(paginator._uiEnabled) {
            paginator.set(INDEX, target);
        }
    },

    /**
     * Scroll to the previous page in the scrollview, with animation
     *
     * @method prev
     */
    prev: function () {
        var paginator = this,
            index = paginator.get(INDEX),
            target = index - 1;
            
        if(paginator._uiEnabled) {
            paginator.set(INDEX, target);
        }
    }
});

/**
 * The default snap to current duration and easing values used on scroll end. 
 * 
 * @property SNAP_TO_CURRENT
 * @static
 */
PaginatorPlugin.SNAP_TO_CURRENT = {
    duration : 300,
    easing : 'ease-out'
};

Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;
