/**
 * Adds pagination support for scrollview
 *
 * @module scrollview
 * @submodule paginator-plugin
 */
 
var _classNames = Y.ScrollView.CLASS_NAMES,
    BOUNCE_DECELERATION_CONST = .5,
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
 * @default 'paginator'
 * @readOnly
 * @protected
 * @static
 */
PaginatorPlugin.NS = 'paginator';

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
     * @attribute pageSelector
     * @type {String}
     */
    pageSelector: {
        value: null
    },
    
    /**
     * The active page number for a paged scrollview
     *
     * @attribute selectedIndex
     * @type {Number}
     * @default 0
     */
    selectedIndex: {
        value: 0
    },
    
    /**
     * The total number of pages
     *
     * @attribute totalPages
     * @type {Number}
     * @default 0
     */
    totalPages: {
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
        
        this.afterHostMethod('_uiSizeCB', this._calculatePageOffsets);
        this.afterHostMethod('_touchesBegan', this._setBoundaryPoints);
        this.afterHostMethod('_flick', this._afterFlick);
        this.afterHostEvent('scroll:end', this._scrollEnded);
        this.after('selectedIndexChange', this._afterSelectedIndexChange);
        
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
            pageSelector = this.get('pageSelector'),
            pages,
            points = [];
            
        // Pre-calculate min/max values for each page
        pages = pageSelector ? cb.all(pageSelector) : cb.get('children');
        pages.each(function(node, i) {
            points.push(node.get('offsetLeft'));
        }, this);
        
        points.push(cb.get('scrollWidth') - this.get('host').get('width'));
        
        this._minPoints = points;

        this.set('totalPages', pages.size());
    },
    
    /**
     * After host touchstart handler, reset min/max scroll values on the host
     * based on the page elements
     *
     * @method _setBoundaryPoints
     * @param e {Event.Facade} The touchstart event
     */
    _setBoundaryPoints: function(e) {
        var host = this.get('host'),
            pageIndex = this.get('selectedIndex');
        
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
            pageIndex = this.get('selectedIndex'),
            pageCount = this.get('totalPages');
            
        // @TODO: find the right minimum velocity to turn the page.
        // Right now, hard-coding at 1.
        if(speed < 1) {
            host._currentVelocity = positive ? 1 : -1;
        }
    
        if(positive && pageIndex < pageCount-1) {
            this.set('selectedIndex', pageIndex+1, { src: UI });
        } else if(!positive && pageIndex > 0){
            this.set('selectedIndex', pageIndex-1, { src: UI });
        }
    },
    
    /**
     * scroll:end handler detects if a page needs to change
     *
     * @method _scrollEnded
     * @param {Event.Facade}
     * @protected
     */
     _scrollEnded: function(e) {
         var host = this.get('host'),
             pageIndex = this.get('selectedIndex'),
             pageCount = this.get('totalPages');

         // Stale scroll - snap to current/next/prev page
         if(e.staleScroll) {
             if(host._scrolledHalfway) {
                 if(host._scrolledForward && pageIndex < pageCount-1) {
                     this.set('selectedIndex', pageIndex+1);
                 } else if(pageIndex > 0) {
                     this.set('selectedIndex', pageIndex-1);
                 } else {
                     this.snapToCurrentPage();
                 }
             } else {
                 this.snapToCurrentPage();
             }
         }
     },
    
    /**
     * selectedIndex attr change handler
     *
     * @method _afterSelectedIndexChange
     * @protected
     */
    _afterSelectedIndexChange: function(e) {
        if(e.src !== UI) {
            this._uiSelectedIndex(e.newVal);
        }
    },
    
    /**
     * Update the UI based on the current page index
     *
     * @method _uiSelectedIndex
     * @protected
     */
    _uiSelectedIndex: function(index) {
        this.scrollToPage(index, 350, 'ease-out');
    },
    
    /**
     * Scroll to the next page in the scrollview, with animation
     *
     * @method nextPage
     * @param disableAnim {Boolean} If true, no animation is used
     */
    nextPage: function(disableAnim) {
        var index = this.get('selectedIndex');  
        if(index < this.get('totalPages')-1) {
            this.set('selectedIndex', index+1);
        }
    },
    
    /**
     * Scroll to the previous page in the scrollview, with animation
     *
     * @method prevPage
     * @param disableAnim {Boolean} If true, no animation is used
     */
    prevPage: function(disableAnim) {
        var index = this.get('selectedIndex');
        if(index > 0) {
            this.set('selectedIndex', index-1);
        }
    },
    
    /**
     * Scroll to a given page in the scrollview, with animation.
     *
     * @method scrollToPage
     * @param index {Number} The index of the page to scroll to
     * @param duration {Number} The number of ms the animation should last
     * @param easing {String} The timing function to use in the animation
     */
    scrollToPage: function(index, duration, easing) {
        var host = this.get('host'),
            x = host.get('scrollX'),
            y = host.get('scrollY');

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
     * @method snapToCurrentPage
     */
    snapToCurrentPage: function() {
        this.get('host').set('scrollX', this._minPoints[this.get('selectedIndex')], {
            duration: 300,
            easing: 'ease-out'
        });
    }
    
});

Y.namespace('Plugin');
Y.Plugin.PaginatorPlugin = PaginatorPlugin;