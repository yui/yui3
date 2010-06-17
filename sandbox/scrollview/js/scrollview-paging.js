/**
 * Adds support for paging inside a scrollview
 *
 * @module scrollview
 * @submodule scrollview-paging
 */
 
var _classNames = Y.ScrollView.CLASS_NAMES,
    _extensions = [],
    BOUNCE_DECELERATION_CONST = .5,
    UI = Y.ScrollViewBase.UI_SRC;

/**
 * Scrollview extension that adds support for paged elements
 *
 * @class ScrollViewPaging
 */
function ScrollViewPaging() {
    Y.after(this._afterFlick, this, '_flick');
}

Y.ScrollViewPaging = Y.mix(ScrollViewPaging, {

    // Prototype methods added to host class
    prototype: {
        
        /**
         * Apply a method from the base class, based on which modules
         * are loaded
         *
         * @method _applyBaseFn
         * @param fn {String} The name of the method in the base class
         * @param args {Arguments} The arguments to pass to the base method
         * @private
         */        
        _applyBaseFn: function(fn, args) {
            if(Y.ScrollViewScrollbars && Y.ScrollViewScrollbars.prototype[fn]) {
                Y.ScrollViewScrollbars.prototype[fn].apply(this, args);
            } else {
                Y.ScrollViewBase.prototype[fn].apply(this, args);
            }
        },
        
        /**
         * Designated initializer
         *
         * @method initializer
         */
        initializer: function() {
            // ScrollViewBase implementation
            this._applyBaseFn('initializer', arguments);
            
            if(this.get('pagingEnabled') && this.get('bounce') !== 0) {
                // Change bounce constant to increase friction 
                this.set('bounce', BOUNCE_DECELERATION_CONST);
            }
        },
        
        /**
         * Override the bindUI method to hook up pagination events
         *
         * @method bindUI
         */
        bindUI: function() {
            // ScrollViewBase implementation
            this._applyBaseFn('bindUI', arguments);
            
            this.after("pageIndexChange", this._afterPageIndexChange);
        },
        
        /**
         * pageIndex attr change handler
         *
         * @method _afterPageIndexChange
         * @protected
         */
        _afterPageIndexChange: function(e) {
            if(e.src !== UI) {
                this._uiPageIndex(e.newVal);
            }
        },
        
        /**
         * Update the UI based on the current page index
         *
         * @method _uiPageIndex
         * @protected
         */
        _uiPageIndex: function(index) {
            this.scrollToPage(index, 350, 'ease-out');
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
            var x = this.get('scrollX'),
                y = this.get('scrollY');
                
            if(this._scrollsHorizontal) {
                x = this._minPoints[index];

                this.set('scrollX', x, {
                    duration: duration,
                    easing: easing
                });
            }
        },
        
        /**
         * Scroll to the next page in the scrollview, with animation
         *
         * @method nextPage
         * @param disableAnim {Boolean} If true, no animation is used
         */
        nextPage: function(disableAnim) {
            var index = this.get('pageIndex');
            if(index < this.get('pageCount')-1) {
                this.set('pageIndex', index+1);
            }
        },
        
        /**
         * Scroll to the previous page in the scrollview, with animation
         *
         * @method prevPage
         * @param disableAnim {Boolean} If true, no animation is used
         */
        prevPage: function(disableAnim) {
            var index = this.get('pageIndex');
            if(index > 0) {
                this.set('pageIndex', index-1);
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
            var positive = this._currentVelocity > 0,
                speed = Math.abs(this._currentVelocity),
                pageIndex = this.get('pageIndex'),
                pageCount = this.get('pageCount');
             
            if(this.get('pagingEnabled')) {   
                
                // @TODO: find the right minimum velocity to turn the page.
                // Right now, hard-coding at 1.
                if(speed < 1) {
                    this._currentVelocity = positive ? 1 : -1;
                }
            
                if(positive && pageIndex < pageCount-1) {
                    this.set('pageIndex', pageIndex+1, { src: UI });
                } else if(!positive && pageIndex > 0){
                    this.set('pageIndex', pageIndex-1, { src: UI });
                }
            }
        },
        
        /**
         * Override the _uiSizeCB method in order to pre-calculate the min/max points
         * for each page
         *
         * @method _uiSizeCB
         * @protected
         */
        _uiSizeCB: function() {
            var cb = this.get('contentBox'),
                pageSelector = this.get('pageSelector'),
                pages,
                points = [];
            
            // ScrollViewBase implementation
            this._applyBaseFn('_uiSizeCB', arguments);
            
            if(this.get('pagingEnabled')) {
                
                // Pre-calculate min/max values for each page
                pages = pageSelector ? cb.all(pageSelector) : cb.get('children');
                pages.each(function(node, i) {
                    points.push(node.get('offsetLeft'));
                }, this);
                
                points.push(cb.get('scrollWidth') - this.get('width'));
                
                this._minPoints = points;

                this.set('pageCount', pages.size());
            }
        },
        
        /**
         * Override the default touchstart handler to reset
         * the min/max scroll values based on the page elements
         *
         * @method _touchesBegan
         * @param e {Event.Facade} The touchstart event
         */
        _touchesBegan: function(e) {
            var pageIndex = this.get('pageIndex');
            
            // ScrollViewBase implementation
            this._applyBaseFn('_touchesBegan', arguments);
            
            // Set min/max points
            if(this._scrollsHorizontal) {
                if(Y.Lang.isNumber(this._minPoints[pageIndex-1])) {
                    this._minScrollX = this._minPoints[pageIndex-1];
                } else {
                    this._minScrollX = this._minPoints[pageIndex];
                }
                this._maxScrollX = this._minPoints[pageIndex+1];
            }
        },
        
        /**
         * Default scroll:end handler
         *
         * @method _defScrollEndFn
         * @param {Event.Facade}
         * @protected
         */
         _defScrollEndFn: function(e) {
             var pageIndex = this.get('pageIndex'),
                 pageCount = this.get('pageCount');

             // ScrollViewBase implementation
             this._applyBaseFn('_defScrollEndFn', arguments);

             // See if we need to snap to a page
             if(this.get('pagingEnabled')) {
                 
                 // Stale scroll - snap to current/next/prev page
                 if(e.staleScroll) {
                     if(this._scrolledHalfway) {
                         if(this._scrolledForward && pageIndex < pageCount-1) {
                             this.set('pageIndex', pageIndex+1);
                         } else if(pageIndex > 0) {
                             this.set('pageIndex', pageIndex-1);
                         } else {
                             this.snapToCurrentPage();
                         }
                     } else {
                         this.snapToCurrentPage();
                     }
                 }
             }
         },
        
        /**
         * Snaps the scrollview to the currently selected page
         *
         * @method snapToCurrentPage
         */
        snapToCurrentPage: function() {
            this.set('scrollX', this._minPoints[this.get('pageIndex')], {
                duration: 300,
                easing: 'ease-out'
            });
        }
        
    },

    // Static properties added onto host class
    ATTRS: {
        
        /**
         * Enable or disable paging
         *
         * @attribute pagingEnabled
         * @type {Boolean}
         * @default true
         */
        pagingEnabled: {
            value: false,
            validator: Y.Lang.isBoolean
        },
        
        /**
         * CSS selector for a page inside the scrollview. The scrollview
         * will snap to the closest page.
         *
         * @attribute pageSelector
         * @type {String}
         */
        pageSelector: {
            validator: Y.Lang.isString
        },
        
        /**
         * The active page number for a paged scrollview
         *
         * @attribute pageIndex
         * @type {Number}
         * @default 0
         */
        pageIndex: {
            value: 0,
            validator: Y.Lang.isNumber
        },
        
        /**
         * The total number of pages
         *
         * @attribute pageCount
         * @type {Number}
         * @default 0
         */
        pageCount: {
            value: 0,
            validator: Y.Lang.isNumber
        }
    }

}, true);

// If scrollview-scrollbars is included, add it to extension classes
if(!Y.Lang.isUndefined(Y.ScrollViewScrollbars)) {
    _extensions.push(Y.ScrollViewScrollbars);
}
// Add scrollview-paging to extension classes
_extensions.push(Y.ScrollViewPaging);

// Augment Y.Scrollview with the extension classes
Y.ScrollView = Y.Base.create('scrollview', Y.ScrollView, _extensions);