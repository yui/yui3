/**
 * Adds pagination support for scrollview
 *
 * @module scrollview
 * @submodule paginator-plugin
 */
 
var BOUNCE_DECELERATION_CONST = 0.5,
    UI = Y.ScrollViewBase.UI_SRC;

/**
 * Scrollview plugin that adds support for paging
 *
 * @class PaginatorPlugin
 */
function PaginatorPlugin() {
    PaginatorPlugin.superclass.constructor.apply(this, arguments);
}

/**
 * The identity of the plugin
 *
 * @property PaginatorPlugin.NAME
 * @type String
 * @default 'paginator-plugin'
 * @readOnly
 * @protected
 * @static
 */
PaginatorPlugin.NAME = 'paginatorPlugin';
    
/**
 * The plugin namespace property
 *
 * @property PaginatorPlugin.NS
 * @type String
 * @default 'pages'
 * @readOnly
 * @protected
 * @static
 */
PaginatorPlugin.NS = 'pages';

/**
 * ATTRS for scrollbars plugin
 *
 * @property PaginatorPlugin.ATTRS
 * @type Object
 * @readOnly
 * @protected
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

    /**
     * Designated initializer
     *
     * @method initializer
     */    
    initializer: function() {
        var host = this.get('host');
        
        this.afterHostMethod('_uiDimensionsChange', this._calculatePageOffsets);
        this.afterHostMethod('_onTouchstart', this._setBoundaryPoints);
        this.afterHostMethod('_flick', this._afterFlick);
        this.afterHostEvent('scrollEnd', this._scrollEnded);
        this.after('indexChange', this._afterIndexChange);
        
        if(host.get('bounce') !== 0) {
            // Change bounce constant to increase friction
            this._originalHostBounce = host.get('bounce'); 
            host.set('bounce', BOUNCE_DECELERATION_CONST);
        }
    },
    
    /**
     * Destructor removes anything added by the plugin
     *
     * @method destroy
     */
    destroy: function() {
        var host = this.get('host');

        if(host.get('bounce') !== 0) {
            host.set('bounce', this._originalHostBounce);
        }
    },

    /**
     * Pre-calculate the min/max boundary points when the contentBox changes
     * 
     * @method _calculatePageOffsets
     * @protected
     */    
    _calculatePageOffsets: function() {
        var cb = this.get('host').get('contentBox'),
            pageSelector = this.get('selector'),
            pages,
            points = [];
            
        // Pre-calculate min/max values for each page
        pages = pageSelector ? cb.all(pageSelector) : cb.get('children');
        pages.each(function(node, i) {
            points.push(node.get('offsetLeft'));
        }, this);
        
        points.push(cb.get('scrollWidth') - this.get('host').get('width'));
        
        this._minPoints = points;

        this.set('total', pages.size());
    },
    
    /**
     * After host movestart handler, reset min/max scroll values on the host
     * based on the page elements
     *
     * @method _setBoundaryPoints
     * @param e {Event.Facade} The gesturemovestart event
     */
    _setBoundaryPoints: function(e) {
        var host = this.get('host'),
            pageIndex = this.get('index');
        
        // Set min/max points
        if(host._scrollsHorizontal) {
            if(Y.Lang.isNumber(this._minPoints[pageIndex-1])) {
                host._minScrollX = this._minPoints[pageIndex-1];
            } else {
                host._minScrollX = this._minPoints[pageIndex];
            }
            host._maxScrollX = this._minPoints[pageIndex+1];
        }
    },
    
    /**
     * Executed as soon as the flick event occurs. This is needed to
     * determine if the next or prev page should be activated.
     * 
     * @method _afterFlick
     * @protected
     */
    _afterFlick: function(e) {
        var velocity = this.get('host')._currentVelocity,
            positive = velocity > 0,
            speed = Math.abs(velocity),
            host = this.get('host'),
            pageIndex = this.get('index'),
            pageCount = this.get('total');
            
        // @TODO: find the right minimum velocity to turn the page.
        // Right now, hard-coding at 1.
        if(speed < 1) {
            host._currentVelocity = positive ? 1 : -1;
        }
    
        if(positive && pageIndex < pageCount-1) {
            this.set('index', pageIndex+1, { src: UI });
        } else if(!positive && pageIndex > 0){
            this.set('index', pageIndex-1, { src: UI });
        }
    },
    
    /**
     * scrollEnd handler detects if a page needs to change
     *
     * @method _scrollEnded
     * @param {Event.Facade}
     * @protected
     */
     _scrollEnded: function(e) {
         var host = this.get('host'),
             pageIndex = this.get('index'),
             pageCount = this.get('total');

         // Stale scroll - snap to current/next/prev page
         if(e.staleScroll) {
             if(host._scrolledHalfway) {
                 if(host._scrolledForward && pageIndex < pageCount-1) {
                     this.set('index', pageIndex+1);
                 } else if(pageIndex > 0) {
                     this.set('index', pageIndex-1);
                 } else {
                     this.snapToCurrent();
                 }
             } else {
                 this.snapToCurrent();
             }
         }
     },
    
    /**
     * index attr change handler
     *
     * @method _afterIndexChange
     * @protected
     */
    _afterIndexChange: function(e) {
        if(e.src !== UI) {
            this._uiIndex(e.newVal);
        }
    },
    
    /**
     * Update the UI based on the current page index
     *
     * @method _uiIndex
     * @protected
     */
    _uiIndex: function(index) {
        this.scrollTo(index, 350, 'ease-out');
    },
    
    /**
     * Scroll to the next page in the scrollview, with animation
     *
     * @method next
     * @param disableAnim {Boolean} If true, no animation is used
     */
    next: function(disableAnim) {
        var index = this.get('index');  
        if(index < this.get('total')-1) {
            this.set('index', index+1);
        }
    },
    
    /**
     * Scroll to the previous page in the scrollview, with animation
     *
     * @method prev
     * @param disableAnim {Boolean} If true, no animation is used
     */
    prev: function(disableAnim) {
        var index = this.get('index');
        if(index > 0) {
            this.set('index', index-1);
        }
    },
    
    /**
     * Scroll to a given page in the scrollview, with animation.
     *
     * @method scrollTo
     * @param index {Number} The index of the page to scroll to
     * @param duration {Number} The number of ms the animation should last
     * @param easing {String} The timing function to use in the animation
     */
    scrollTo: function(index, duration, easing) {
        var host = this.get('host'),
            x = host.get('scrollX');

        if(host._scrollsHorizontal) {
            x = this._minPoints[index];

            host.set('scrollX', x, {
                duration: duration,
                easing: easing
            });
        }
    },
    
    /**
     * Snaps the scrollview to the currently selected page
     *
     * @method snapToCurrent
     */
    snapToCurrent: function() {
        this.get('host').set('scrollX', this._minPoints[this.get('index')], {
            duration: 300,
            easing: 'ease-out'
        });
    }
    
});

Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;