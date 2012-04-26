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
    BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    FLICK = "flick",
    DRAG = "drag",
    CLASS_HIDDEN,
    CLASS_PAGED;

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
        value: 0
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
    _pageNodes: null,
    _uiEnabled: true,
    _prevIndex: 0,
    
    /**
     * Designated initializer
     *
     * @method initializer
     */
    initializer: function (config) { 
        var paginator = this,
            host = paginator.get('host'),
            cb = host.get(CONTENT_BOX),
            pageSelector = paginator.get("selector"),
            optimizeMemory = config.optimizeMemory || paginator.optimizeMemory;

        CLASS_HIDDEN = host.getClassName('hidden');
        CLASS_PAGED = host.getClassName("paged");
        
        paginator._host = host;
        paginator.optimizeMemory = optimizeMemory;
        paginator._pageNodes = pageSelector ? cb.all(pageSelector) : cb.get("children");
        paginator._hostOriginalFlick = host.get(FLICK);
        paginator._hostOriginalDrag = host.get(DRAG);
        
        paginator.beforeHostMethod('_mousewheel', paginator._mousewheel);
        paginator.beforeHostMethod('_flickFrame', paginator._flickFrame);
        paginator.afterHostMethod('_uiDimensionsChange', paginator._calcOffsets);
        paginator.afterHostEvent('render', paginator._afterRender);
        paginator.afterHostEvent('scrollEnd', paginator._scrollEnded);
        paginator.after('indexChange', paginator._afterIndexChange);
    },
    
    /**
     * After host render handler
     *
     * @method _afterRender
     * @param {Event.Facade}
     * @protected
     */
    _afterRender: function (e) {
        var host = this._host;
        
        host.get("boundingBox").addClass(CLASS_PAGED);
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
             cb = host.get(CONTENT_BOX),
             vert = host._scrollsVertical,
             optimizeMemory = paginator.optimizeMemory,
             pages = paginator._pageNodes;
         
         //Set the total # of pages
         paginator.set(TOTAL, pages.size());

         // Determine the offsets
         paginator._pageOffsets = pages.get((vert) ? "offsetTop" : "offsetLeft");
         
         // Now that we have the offsets of each page, hide what we don't need.
         if (optimizeMemory) {
             paginator._hideNodes(pages.slice(2));
         }
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
            index = index || paginator.get(INDEX),
            previous = paginator._prevIndex,
            isForward = (index > previous) ? true : false,
            pageOffsets = paginator._pageOffsets,
            optimizeMemory = paginator.optimizeMemory,
            offset, 
            offsetModifier;
            
        if (optimizeMemory) {    
            if (!isForward) {
                offsetModifier = 0;
            }
            else if (index === 1) {
                offsetModifier = 1;
            }    
            else {
                offsetModifier = 2;
            }
            
            // @TODO: Should probably do (currentOffset - previousoffset) instead of assuming they're all the same width
            offset = offsetModifier * pageOffsets[1];
        }
        else {
            offset = pageOffsets[index];
        }
        
        return offset;
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
            inc = velocity < 0,
            pageIndex = paginator.get(INDEX),
            pageCount = paginator.get(TOTAL);
            
        if (velocity) {
            if (inc && pageIndex < pageCount - 1) {
                paginator.next();
            }
            else if (!inc && pageIndex > 0) {
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
            isForward = e.wheelDelta < 0 // down (negative) is forward.  @TODO Should revisit.
            currentIndex = paginator.get(INDEX),
            pageCount = paginator.get(TOTAL);
            
        if (isForward && currentIndex < pageCount - 1) {    
            paginator.next();
        }
        else if (!isForward && currentIndex > 0) {
            paginator.prev();
        }

        // prevent browser default behavior on mouse scroll
        e.preventDefault();

        return paginator._prevent;
    },
    
    /**
     * scrollEnd handler detects if a page needs to change
     *
     * @method _scrollEnded
     * @param {Event.Facade}
     * @protected
     */
     _scrollEnded: function (e) {
        var paginator = this,
            host = paginator._host,
            vert = host._scrollsVertical,
            trans = PaginatorPlugin.SNAP_TO_CURRENT,
            optimizeMemory = paginator.optimizeMemory,
            currentIndex = paginator.get(INDEX),
            previousIndex = paginator._prevIndex,
            isForward = (previousIndex < currentIndex) ? true : false,
            pageNodes = paginator._pageNodes;
        
        if (optimizeMemory) {
            paginator._showNodes(pageNodes.item(currentIndex + (isForward ? 1 : -1)));
            paginator._hideNodes(pageNodes.item(currentIndex + (isForward ? -2 : 2)));
            
            // @TODO: Should probably be directed at this.scrollTo(), but with a '0' duration.
            host.set((vert ? SCROLL_Y : SCROLL_X), pageNodes.item(currentIndex).get(vert ? "offsetTop" : "offsetLeft")); // Center
        }
        
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
        var target = e.newVal,
            duration = PaginatorPlugin.SNAP_TO_CURRENT.duration,
            easing = PaginatorPlugin.SNAP_TO_CURRENT.easing;
            
        if(e.src !== UI) {
            this.scrollTo(target, duration, easing);
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
     * @method _uiEnable
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
     * Scroll to the next page in the scrollview, with animation
     *
     * @method next
     */
    next: function () {
        var paginator = this,
            index = paginator.get(INDEX),
            total = paginator.get(TOTAL);
            
        if(index < total - 1 && paginator._uiEnabled) {
            paginator.set(INDEX, index+1);
        }
    },

    /**
     * Scroll to the previous page in the scrollview, with animation
     *
     * @method prev
     */
    prev: function () {
        var paginator = this,
            index = paginator.get(INDEX);
            
        if(index > 0 && paginator._uiEnabled) {
            paginator.set(INDEX, index - 1);
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
            vert = host._scrollsVertical,
            scrollAxis = (vert) ? SCROLL_Y : SCROLL_X, 
            scrollVal = paginator._getIndexOffset(index);
            
        paginator._uiDisable();
        host.set(scrollAxis, scrollVal, {
            duration: duration,
            easing: easing
        });
    },
    
    _prevent: new Y.Do.Prevent()
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
