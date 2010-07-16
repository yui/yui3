YUI.add('scrollview', function(Y) {

/**
 * ScrollView module
 *
 * @module scrollview
 * @submodule scrollview-base
 */

var getClassName = Y.ClassNameManager.getClassName,
    SCROLLVIEW = 'scrollview',
    FRAME_STEP = 10, // ms between animation frames
    BOUNCE_RANGE = 150,
    CLASS_NAMES = {
        scrollbar: getClassName(SCROLLVIEW, 'scrollbar'),
        vertical: getClassName(SCROLLVIEW, 'vertical'),
        horizontal: getClassName(SCROLLVIEW, 'horizontal'),
        child: getClassName(SCROLLVIEW, 'child'),
        b: getClassName(SCROLLVIEW, 'b'),
        middle: getClassName(SCROLLVIEW, 'middle'),
        showing: getClassName(SCROLLVIEW, 'showing')
    },
    EV_SCROLL_START = 'scrollStart',
    EV_SCROLL_CHANGE = 'scrollChange',
    EV_SCROLL_END = 'scrollEnd',
    EV_SCROLL_FLICK = 'flick',
    UI = 'ui';

/**
 * ScrollView provides a scrollable container for devices which do not 
 * support overflow: hidden
 *
 * @class ScrollViewBase
 * @param config {Object} Object literal specifying scrollview configuration properties.
 * @extends Widget
 * @constructor
 */
function ScrollViewBase() {
    ScrollViewBase.superclass.constructor.apply(this, arguments);
}

Y.ScrollViewBase = Y.extend(ScrollViewBase, Y.Widget, {
    
    // Y.ScrollViewBase prototype
    
    /**
     * Designated initializer
     *
     * @method initializer
     */
    initializer: function() {
        this._createEvents();
    },

    /** 
     * Publish events which occur during the scroll lifecycle
     *
     * @method _createEvents
     * @private
     */    
    _createEvents: function() {
        this.publish(EV_SCROLL_START);
        this.publish(EV_SCROLL_CHANGE);
        this.publish(EV_SCROLL_END);
        this.publish(EV_SCROLL_FLICK);
    },
    
    /** 
     * Override the contentBox sizing method, since the contentBox height
     * should not be that of the boundingBox.
     *
     * @method _uiSizeCB
     * @protected
     */
    _uiSizeCB: function() {},

    /**
     * TranstionEnd event handler
     *
     * @method _transitionEnded
     * @private
     */
    _transitionEnded: function() {
        this.fire(EV_SCROLL_END);
    },

    /**
     * bindUI implementation
     *
     * Hooks up events for touching the widget
     * @method bindUI
     */
    bindUI: function() {
        this.get('boundingBox').on('touchstart', this._onTouchstart, this);

        var cb = this.get('contentBox'); 

        // TODO: Integrate with transitions
        cb._node.addEventListener('webkitTransitionEnd', Y.bind(this._transitionEnded, this), false);
        cb._node.addEventListener('DOMSubtreeModified', Y.bind(this._uiDimensionsChange, this));

        cb.on("flick", Y.bind(this._flick, this), {
            minDistance:0
        });

        this.after('scrollYChange', this._afterScrollYChange);
        this.after('scrollXChange', this._afterScrollXChange);
        this.after('heightChange', this._afterHeightChange);
        this.after('widthChange', this._afterWidthChange);
        this.after('renderedChange', function() { Y.later(0, this, '_uiDimensionsChange'); });
    },
    
    /**
     * syncUI implementation
     *
     * Update the scroll position, based on the current value of scrollY
     * @method bindUI
     */
    syncUI: function() {
        this.scrollTo(this.get('scrollX'), this.get('scrollY'));
    },
    
    /**
     * Scroll the element to a given y coordinate
     *
     * @method scrollTo
     * @param x {Number} The x-position to scroll to
     * @param y {Number} The y-position to scroll to
     * @param duration {Number} Duration, in ms, of the scroll animation (default is 0)
     * @param easing {String} An easing equation if duration is set
     */
    scrollTo: function(x, y, duration, easing) {
        var cb = this.get('contentBox');
        
        if(x !== this.get('scrollX')) {
            this.set('scrollX', x, { src: UI });
        }
        
        if(y !== this.get('scrollY')) {
            this.set('scrollY', y, { src: UI });
        }
        
        if(duration) {
            easing = easing || 'cubic-bezier(0, 0.1, 0, 1.0)';
            cb.setStyle('-webkit-transition', duration+'ms -webkit-transform');
            cb.setStyle('-webkit-transition-timing-function', easing);
        } else {
            cb.setStyle('-webkit-transition', null);
            cb.setStyle('-webkit-transition-timing-function', null);
        }
        cb.setStyle('-webkit-transform', 'translate3d('+(x*-1)+'px,'+(y*-1)+'px,0)');
    },
        
    /**
     * touchstart event handler
     *
     * @method _onTouchstart
     * @param e {Event} The event
     * @private
     */
    _onTouchstart: function(e) {
        var touch;
        
        if(e.touches && e.touches.length === 1) {
            
            touch = e.touches[0];
            
            this._killTimer();
        
            this._touchmoveEvt = this.get('boundingBox').on('touchmove', this._onTouchmove, this);
            this._touchendEvt = this.get('boundingBox').on('touchend', this._onTouchend, this);
        
            this._touchstartY = e.touches[0].clientY + this.get('scrollY');
            this._touchstartX = e.touches[0].clientX + this.get('scrollX');
        
            this._touchStartTime = (new Date()).getTime();
            this._touchStartClientY = touch.clientY;
            this._touchStartClientX = touch.clientX;
            this._isDragging = false;
            this._snapToEdge = false;
    
        }
    },    
    
    /**
     * touchmove event handler
     *
     * @method _onTouchmove
     * @param e {Event} The event
     * @private
     */
    _onTouchmove: function(e) {
        var touch = e.touches[0];
        
        e.preventDefault();
        
        this._isDragging = true;
        this._touchEndClientY = touch.clientY;
        this._touchEndClientX = touch.clientX;
        this._lastMoved = (new Date()).getTime();
        
        if(this._scrollsVertical) {
            this.set('scrollY', -(e.touches[0].clientY - this._touchstartY));
        }
        
        if(this._scrollsHorizontal) {
            this.set('scrollX', -(e.touches[0].clientX - this._touchstartX));
        }
    },
    
    /**
     * touchend event handler
     *
     * @method _onTouchend
     * @param e {Event} The event
     * @private
     */
    _onTouchend: function(e) {
        var minY = this._minScrollY,
            maxY = this._maxScrollY,
            minX = this._minScrollX,
            maxX = this._maxScrollX,
            startPoint = this._scrollsVertical ? this._touchStartClientY : this._touchStartClientX,
            endPoint = this._scrollsVertical ? this._touchEndClientY : this._touchEndClientX,
            distance = startPoint - endPoint,
            time = +(new Date()) - this._touchStartTime;
        
        this._touchmoveEvt.detach();
        this._touchendEvt.detach();
        
        this._scrolledHalfway = false;
        this._snapToEdge = false;
        this._isDragging = false;

        if(this._scrollsHorizontal && Math.abs(distance) > (this.get('width')/2)) {
            this._scrolledHalfway = true;
            this._scrolledForward = distance > 0;
        }
        if(this._scrollsVertical && Math.abs(distance) > (this.get('height')/2)) {
            this._scrolledHalfway = true;
            this._scrolledForward = distance > 0;
        }

        // Check for minY
        if(this._scrollsVertical && this.get('scrollY') < minY) {
            this._snapToEdge = true;
            this.set('scrollY', minY);
        }
        
        // Check for minX
        if(this._scrollsHorizontal && this.get('scrollX') < minX) {
            this._snapToEdge = true;
            this.set('scrollX', minX);
        }
        
        // Check for maxY
        if(this.get('scrollY') > maxY) {
            this._snapToEdge = true;
            this.set('scrollY', maxY);
        }
        
        // Check for maxX
        if(this.get('scrollX') > maxX) {
            this._snapToEdge = true;
            this.set('scrollX', maxX);
        }
        
        if(this._snapToEdge) {
            return;
        }
        
        // Check for staleness
        if(+(new Date()) - this._touchStartTime > 100) {
            this.fire(EV_SCROLL_END, {
                staleScroll: true
            });
            return;
        }
    },
    
    /**
     * after listener for changes to the scrollY attr
     *
     * @method _afterScrollYChange
     * @param e {Event.Facade} The event
     * @protected
     */
    _afterScrollYChange : function(e) {
        if(e.src !== UI) {
            this._uiScrollY(e.newVal, e.duration, e.easing);
        }
    },
    
    /**
     * Update the UI when the scrollY attr changes
     *
     * @method _uiScrollY
     * @param val {Number} The scrollY value
     * @param duration {Number} The length (in ms) of the scroll animation
     * @param easing {String} An easing equation, if duration is defined
     * @protected
     */
    _uiScrollY : function(val, duration, easing) {
        duration = duration || this._snapToEdge ? 400 : 0;
        easing = easing || this._snapToEdge ? 'ease-out' : null;

        this.scrollTo(this.get('scrollX'), val, duration, easing);
    },
    
    /**
     * after listener for changes to the scrollX attr
     *
     * @method _afterScrollXChange
     * @param e {Event.Facade} The event
     * @protected
     */
    _afterScrollXChange : function(e) {
        if(e.src !== UI) {
            this._uiScrollX(e.newVal, e.duration, e.easing);
        }
    },
    
    /**
     * Update the UI when the scrollX attr changes
     *
     * @method _uiScrollX
     * @param val {Number} The scrollX value
     * @param duration {Number} The length (in ms) of the scroll animation
     * @param easing {String} An easing equation, if duration is defined
     * @protected
     */
    _uiScrollX : function(val, duration, easing) {
        duration = duration || this._snapToEdge ? 400 : 0;
        easing = easing || this._snapToEdge ? 'ease-out' : null;
            
        this.scrollTo(val, this.get('scrollY'), duration, easing);
    },
    
    /**
     * after listener for the height attribute
     *
     * @method _afterHeightChange
     * @param e {Event.Facade} The event
     * @protected
     */
    _afterHeightChange: function() {
        this._uiDimensionsChange();
    },
    
    /**
     * after listener for the width attribute
     *
     * @method _afterHeightChange
     * @param e {Event.Facade} The event
     * @protected
     */
    _afterWidthChange: function() {
        this._uiDimensionsChange();
    },
    
    /**
     * This method gets invoked whenever the height or width attrs change,
     * allowing us to determine which scrolling axes need to be enabled.
     *
     * @method _uiDimensionsChange
     * @protected
     */
    _uiDimensionsChange: function() {
        var cb = this.get('contentBox'),
            bb = this.get('boundingBox'),
            height = this.get('height'),
            width = this.get('width'),
            scrollHeight = cb.get('scrollHeight'),
            scrollWidth = cb.get('scrollWidth');
        
        if(height && scrollHeight > height) {
            this._scrollsVertical = true;
            this._maxScrollY = scrollHeight - height;
            this._minScrollY = 0;
            bb.setStyle('overflow-y', 'auto');
        }
        
        if(width && scrollWidth > width) {
            this._scrollsHorizontal = true;
            this._maxScrollX = scrollWidth - width;
            this._minScrollX = 0;
            bb.setStyle('overflow-x', 'auto');
        }
    },

    /**
     * Execute a flick at the end of a scroll action
     *
     * @method _flick
     * @param distance {Number} The distance (in px) the user scrolled before the flick
     * @param time {Number} The number of ms the scroll event lasted before the flick
     * @protected
     */
    _flick: function(e) {
        this._currentVelocity = e.flick.velocity * e.flick.direction; // px per ms
        this._flicking = true;
        this._flickFrame();

        this.fire(EV_SCROLL_FLICK);
    },

    /**
     * Execute a single frame in the flick animation
     *
     * @method _flickFrame
     * @protected
     */
    _flickFrame: function() {
        var newY = this.get('scrollY'),
            maxY = this._maxScrollY,
            minY = this._minScrollY,
            newX = this.get('scrollX'),
            maxX = this._maxScrollX,
            minX = this._minScrollX;
        
        this._currentVelocity = (this._currentVelocity*this.get('deceleration'));

        if(this._scrollsVertical) {
            newY = this.get('scrollY') - (this._currentVelocity * FRAME_STEP);
        }
        if(this._scrollsHorizontal) {
            newX = this.get('scrollX') - (this._currentVelocity * FRAME_STEP);
        }
        
        if(Math.abs(this._currentVelocity).toFixed(4) <= 0.015) {
            this._flicking = false;
            this._killTimer(!(this._exceededYBoundary || this._exceededXBoundary));

            if(this._scrollsVertical) {
                if(newY < minY) {
                    this._snapToEdge = true;
                    this.set('scrollY', minY);
                } else if(newY > maxY) {
                    this._snapToEdge = true;
                    this.set('scrollY', maxY);
                }
            }
            
            if(this._scrollsHorizontal) {
                if(newX < minX) {
                    this._snapToEdge = true;
                    this.set('scrollX', minX);
                } else if(newX > maxX) {
                    this._snapToEdge = true;
                    this.set('scrollX', maxX);
                }
            }
            
            return;
        }
        
        if(this._scrollsVertical && (newY < minY || newY > maxY)) {
            this._exceededYBoundary = true;
            this._currentVelocity *= this.get('bounce');
        }
        
        if(this._scrollsHorizontal && (newX < minX || newX > maxX)) {
            this._exceededXBoundary = true;
            this._currentVelocity *= this.get('bounce');
        }
        
        if(this._scrollsVertical) {
            this.set('scrollY', newY);
        }
        
        if(this._scrollsHorizontal) {
            this.set('scrollX', newX);
        }
        
        this._flickTimer = Y.later(FRAME_STEP, this, '_flickFrame');
    },
    
    /**
     * Stop the animation timer
     *
     * @method _killTimer
     * @param fireEvent {Boolean} If true, fire the scrollEnd event
     * @private
     */
    _killTimer: function(fireEvent) {
        if(this._flickTimer) {
            this._flickTimer.cancel();
        }
        
        if(fireEvent) {
            this.fire(EV_SCROLL_END);
        }
    },

    /**
     * Setter for the scrollX ATTR
     *
     * @method _setScrollX
     * @param val {Number} The new scrollX value
     * @protected
     */    
    _setScrollX: function(val) {
        var bouncing = this.get('bounce'),
            min = bouncing ? -BOUNCE_RANGE : 0,
            max = bouncing ? this._maxScrollX + BOUNCE_RANGE : this._maxScrollX;

        if(!bouncing || !this._isDragging) {
            if(val < min) {
                val = min;
            } else if(val > max) {
                val = max;
            }            
        }

        return val;
    },
    
    /**
     * Setter for the scrollY ATTR
     *
     * @method _setScrollY
     * @param val {Number} The new scrollY value
     * @protected
     */
    _setScrollY: function(val) {
        var bouncing = this.get('bounce'),
            min = bouncing ? -BOUNCE_RANGE : 0,
            max = bouncing ? this._maxScrollY + BOUNCE_RANGE : this._maxScrollY;

        if(!bouncing || !this._isDragging) {
            if(val < min) {
                val = min;
            } else if(val > max) {
                val = max;
            }            
        }

        return val;
    }
    
}, {
   
   // Y.ScrollViewBase static properties
   
   /**
    * The identity of the widget.
    *
    * @property ScrollViewBase.NAME
    * @type String
    * @default 'scrollview'
    * @readOnly
    * @protected
    * @static
    */
   NAME: 'scrollview',
   
   /**
    * Static property used to define the default attribute configuration of
    * the Widget.
    *
    * @property ScrollViewBase.ATTRS
    * @type {Object}
    * @protected
    * @static
    */
    ATTRS: {
        
        /**
         * The scroll position in the y-axis
         *
         * @attribute scrollY
         * @type Number
         * @default 0
         */
        scrollY: {
            value: 0,
            setter: '_setScrollY'
        },

        /**
         * The scroll position in the x-axis
         *
         * @attribute scrollX
         * @type Number
         * @default 0
         */
        scrollX: {
            value: 0,
            setter: '_setScrollX'
        },

        /**
         * Drag coefficent for inertial scrolling. The closer to 1 this
         * value is, the less friction during scrolling.
         *
         * @attribute deceleration
         * @default 0.98
         */
        deceleration: {
            value: 0.98
        },

        /**
         * Drag coefficient for intertial scrolling at the upper
         * and lower boundaries of the scrollview. Set to 0 to 
         * disable "rubber-banding".
         *
         * @attribute bounce
         * @type Number
         * @default 0.7
         */
        bounce: {
            value: 0.7
        }
        
    },
    
    /**
     * List of class names used in the scrollview's DOM
     *
     * @property CLASS_NAMES
     * @type Object
     * @static
     */
    CLASS_NAMES: CLASS_NAMES,
    
    /**
     * Flag used to source property changes initiated from the DOM
     *
     * @property UI_SRC
     * @type String
     * @static
     */
    UI_SRC: UI

});

Y.ScrollView = Y.ScrollViewBase;
/**
 * Adds support for scrollbars inside a scrollview
 *
 * @module scrollview
 * @submodule scrollbars-plugin
 */
 
var _classNames = Y.ScrollView.CLASS_NAMES;

/**
 * Scrollview plugin that adds scroll indicators to the scrollview
 *
 * @class ScrollbarsPlugin
 */
function ScrollbarsPlugin() {
    ScrollbarsPlugin.superclass.constructor.apply(this, arguments);
}

/**
 * The identity of the plugin
 *
 * @property ScrollbarsPlugin.NAME
 * @type String
 * @default 'scrollbars-plugin'
 * @readOnly
 * @protected
 * @static
 */
ScrollbarsPlugin.NAME = 'scrollbars-plugin';
    
/**
 * The plugin namespace property
 *
 * @property ScrollbarsPlugin.NS
 * @type String
 * @default 'scrollbars'
 * @readOnly
 * @protected
 * @static
 */
ScrollbarsPlugin.NS = 'scrollbars';

/**
 * Common HTML template for vertical/horizontal scrollbars
 *
 * @property ScrollbarsPlugin.SCROLLBAR_TEMPLATE
 * @type String
 * @static
 */
ScrollbarsPlugin.SCROLLBAR_TEMPLATE = [
    '<div>',
    '<b class="' + _classNames.child + ' ' + _classNames.b + '"></b>',
    '<span class="' + _classNames.child + ' ' + _classNames.middle + '"></span>',
    '<b class="' + _classNames.child + ' ' + _classNames.b + '"></b>',
    '</div>'
].join('');

/**
 * ATTRS for scrollbars plugin
 *
 * @property ScrollbarsPlugin.ATTRS
 * @type Object
 * @readOnly
 * @protected
 * @static
 */
ScrollbarsPlugin.ATTRS = {
    
    /**
     * Vertical scrollbar node
     *
     * @attribute verticalNode
     * @type Y.Node
     */
    verticalNode: {
		setter: '_setVerticalNode',
        value: Y.Node.create(ScrollbarsPlugin.SCROLLBAR_TEMPLATE)
    },

    /**
     * Horizontal scrollbar node
     *
     * @attribute horizontalNode
     * @type Y.Node
     */
    horizontalNode: {
		setter: '_setHorizontalNode',
        value: Y.Node.create(ScrollbarsPlugin.SCROLLBAR_TEMPLATE)
    }
};

Y.ScrollbarsPlugin = Y.extend(ScrollbarsPlugin, Y.Plugin.Base, {

    /**
     * Designated initializer
     *
     * @method initializer
     */    
    initializer: function() {
        this.afterHostMethod('_uiScrollY', this._update);
        this.afterHostMethod('_uiScrollX', this._update);
        this.afterHostMethod('_uiDimensionsChange', this._hostDimensionsChange);
        this.doAfter('scrollEnd', this.flash);
    },
    
    /**
     * Set up the DOM nodes for the scrollbars. This method is invoked whenver the
     * host's _uiDimensionsChange fires, giving us the opportunity to remove un-needed
     * scrollbars, as well as add one if necessary.
     *
     * @method _hostDimensionsChange
     * @protected
     */    
    _hostDimensionsChange: function() {
        var host = this.get('host'),
            boundingBox = this.get('host').get('boundingBox'),
            verticalNode = this.get('verticalNode'),
            horizontalNode = this.get('horizontalNode'),
            verticalNodeInDoc = verticalNode.inDoc(),
            horizontalNodeInDoc = horizontalNode.inDoc();

        // Vertical
        if(host._scrollsVertical && !verticalNodeInDoc) {
            boundingBox.append(verticalNode);
        } else if(!host._scrollsVertical && verticalNodeInDoc) {
            verticalNode.remove();
        }

        // Horizontal
        if(host._scrollsHorizontal && !horizontalNodeInDoc) {
            boundingBox.append(horizontalNode);
        } else if(!host._scrollsHorizontal && horizontalNodeInDoc) {
            horizontalNode.remove();
        }

        this._update();
        
        Y.later(500, this, 'flash', true);
    },
    
    /**
     * Position and resize the scroll bars according to the content size
     *
     * @method _update
     * @param currentPos {Number} The current scrollX or scrollY value (not used here, but passed by default from _uiScrollX/_uiScrollY)
     * @param duration {Number} Number of ms of animation (optional) - used when snapping to bounds
     * @param easing {String} Optional easing equation to use during the animation, if duration is set
     * @protected
     */
    _update: function(currentPos, duration, easing) {
        var cb = this.get('host').get('contentBox'),
            scrollSize = 0,
            scrollPos = 1,
            transform,
            height = this.get('host').get('height'),
            width = this.get('host').get('width'),
            scrollHeight = cb.get('scrollHeight'),
            scrollWidth = cb.get('scrollWidth'),
            verticalNode = this.get('verticalNode'),
            horizontalNode = this.get('horizontalNode'),
            currentX = this.get('host').get('scrollX') * -1,
            currentY = this.get('host').get('scrollY') * -1;

        if(!this._showingScrollBars) {
            this.show();
        }

        if(horizontalNode && scrollHeight <= height) {
            this.hide();
            return;
        }

        if(verticalNode) {
            scrollSize = Math.floor(height * (height/scrollHeight));
            scrollPos = Math.floor((currentY/(scrollHeight - height) ) * (height-scrollSize)) * -1;

            if(scrollSize > height) {
                scrollSize = 1;
            }

            transform = 'translate3d(0, '+scrollPos+'px, 0)';

            if(scrollPos > (height - scrollSize))
            {
                scrollSize = scrollSize - (scrollPos - (height - scrollSize));
            }

            if(scrollPos < 0)
            {
                transform = 'translate3d(0,0,0)';
                scrollSize = scrollSize + scrollPos;
            }

            duration = duration || 0;

            if(this.verticalScrollSize != (scrollSize-8))
            {
                this.verticalScrollSize = (scrollSize-8);
                verticalNode.get('children').item(1).setStyles({
                    '-webkit-transition-property': (duration > 0 ? '-webkit-transform' : null),                                
                    '-webkit-transform': 'translate3d(0,0,0) scaleY('+(scrollSize-8)+')',
                    '-webkit-transition-duration': (duration > 0 ? duration+'ms' : null)
                });
            }
            verticalNode.setStyles({
                '-webkit-transition-property': (duration > 0 ? '-webkit-transform' : null),        
                '-webkit-transform':  transform,
                '-webkit-transition-duration': (duration > 0 ? duration+'ms' : null)
            });
            verticalNode.get('children').item(2).setStyles({
                '-webkit-transition-property': (duration > 0 ? '-webkit-transform' : null),                
                '-webkit-transform': 'translate3d(0,'+(scrollSize-10)+'px,0)',
                '-webkit-transition-duration': (duration > 0 ? duration+'ms' : null)
            });

        }
        
        if(horizontalNode) {
            scrollSize = Math.floor(width * (width/scrollWidth));
            scrollPos = Math.floor((currentX/(scrollWidth - width) ) * (width-scrollSize)) * -1;

            if(scrollSize > width) {
                scrollSize = 1;
            }

            transform = 'translate3d('+scrollPos+'px, 0, 0)';

            if(scrollPos > (width - scrollSize)) {
                scrollSize = scrollSize - (scrollPos - (width - scrollSize));
            }

            if(scrollPos < 0) {
                transform = 'translate3d(0,0,0)';
                scrollSize = scrollSize + scrollPos;
            }

            duration = duration || 0;

            if(this.horizontalScrollSize != (scrollSize-16)) {
                this.horizontalScrollSize = (scrollSize-16);
                horizontalNode.get('children').item(1).setStyles({
                    '-webkit-transition-property': (duration > 0 ? '-webkit-transform' : null),                                
                    '-webkit-transform': 'translate3d(0,0,0) scaleX('+this.horizontalScrollSize+')',
                    '-webkit-transition-duration': (duration > 0 ? duration+'ms' : null)
                });
            }
            horizontalNode.setStyles({
                '-webkit-transition-property': (duration > 0 ? '-webkit-transform' : null),        
                '-webkit-transform':  transform,
                '-webkit-transition-duration': duration+'ms'
            });
            horizontalNode.get('children').item(2).setStyles({
                '-webkit-transition-property': (duration > 0 ? '-webkit-transform' : null),                
                '-webkit-transform': 'translate3d('+(scrollSize-12)+'px,0,0)',
                '-webkit-transition-duration': (duration > 0 ? duration+'ms' : null)
            });
        }
    },
    
    /**
     * Show the scroll bar indicators
     *
     * @method show
     * @param animated {Boolean} Whether or not to animate the showing 
     */
    show: function(animated) {    
        var verticalNode = this.get('verticalNode'),
            horizontalNode = this.get('horizontalNode');

        this._showingScrollBars = true;
        
        if(this._flashTimer) {
            this._flashTimer.cancel();
        }

        if(animated) {
            if(verticalNode) {
                verticalNode.setStyle('-webkit-transition', 'opacity .6s');
            }
            if(horizontalNode) {
                horizontalNode.setStyle('-webkit-transition', 'opacity .6s');
            }
        }

        if(verticalNode) {
            verticalNode.addClass(_classNames.showing);
        }
        if(horizontalNode) {
            horizontalNode.addClass(_classNames.showing);
        }
    },

    /**
     * Hide the scroll bar indicators
     *
     * @method hide
     * @param animated {Boolean} Whether or not to animate the hiding
     */
    hide: function(animated) {
        var verticalNode = this.get('verticalNode'),
            horizontalNode = this.get('horizontalNode');

        this._showingScrollBars = false;

        if(this._flashTimer) {
            this._flashTimer.cancel();
        }

        if(animated) {
            if(verticalNode) {
                verticalNode.setStyle('-webkit-transition', 'opacity .6s');
            }
            if(horizontalNode) {
                horizontalNode.setStyle('-webkit-transition', 'opacity .6s');
            }
        }

        if(verticalNode) {
            verticalNode.removeClass(_classNames.showing);
        }
        if(horizontalNode) {
            horizontalNode.removeClass(_classNames.showing);
        }
    },

    /**
     * Momentarily flash the scroll bars to indicate current scroll position
     *
     * @method flash
     */
    flash: function() {
        var shouldFlash = false;
        if(this.get('host')._scrollsVertical && this.get('host').get('contentBox').get('scrollHeight') > this.get('host').get('height')) {
            shouldFlash = true;
        }
        
        if(this.get('host')._scrollsHorizontal && this.get('host').get('contentBox').get('scrollWidth') > this.get('host').get('width')) {
            shouldFlash = true;
        }
        
        if(shouldFlash) {
            this.show(true);
            this._flashTimer = Y.later(800, this, 'hide', true);
        }
    },

    /**
     * Setter for the verticalNode ATTR
     *
     * @method _setVerticalNode
     * @param node {Y.Node} The Y.Node instance for the scrollbar
     * @protected
     */
    _setVerticalNode: function(node) {
        node = Y.one(node);
        if(node) {
            node.addClass(_classNames.scrollbar);
            node.addClass(_classNames.vertical);
        }
        return node;
    },

    /**
     * Setter for the horizontalNode ATTR
     *
     * @method _setHorizontalNode
     * @param node {Y.Node} The Y.Node instance for the scrollbar
     * @protected
     */
    _setHorizontalNode: function(node) {
        node = Y.one(node);
        if(node) {
            node.addClass(_classNames.scrollbar);
            node.addClass(_classNames.horizontal);
        }
        return node;
    }

});
/**
 * Create a scrollable container of fixed height or width for devices which
 * do not support overflow: hidden
 * 
 * @module scrollview
 */

/**
 * ScrollView provides a scrollable container for devices which do not 
 * support overflow: hidden
 *
 * @class ScrollView
 * @constructor
 * @extends ScrollViewBase
 * @uses Y.ScrollbarsPlugin
 * @param config {Object} Configuration object
 */ 
Y.Base.plug(Y.ScrollView, Y.ScrollbarsPlugin);


}, '@VERSION@' ,{requires:['scrollview-base', 'plugin', 'widget', 'event-touch']});
