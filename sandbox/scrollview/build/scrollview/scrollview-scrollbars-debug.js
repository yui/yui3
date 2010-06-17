YUI.add('scrollview-scrollbars', function(Y) {

/**
 * Adds support for scrollbars inside a scrollview
 *
 * @module scrollview
 * @submodule scrollview-scrollbars
 */
 
var _classNames = Y.ScrollView.CLASS_NAMES;

/**
 * Scrollview extension that adds scroll indicators to the scrollview
 *
 * @class ScrollViewScrollbars
 */
function ScrollViewScrollbars() {}

/**
 * Common HTML template for vertical/horizontal scrollbars
 *
 * @property ScrollView.SCROLLBAR_TEMPLATE
 * @type String
 * @static
 */
ScrollViewScrollbars.SCROLLBAR_TEMPLATE = [
    '<div>',
    '<b class="' + _classNames.child + ' ' + _classNames.b + '"></b>',
    '<span class="' + _classNames.child + ' ' + _classNames.middle + '"></span>',
    '<b class="' + _classNames.child + ' ' + _classNames.b + '"></b>',
    '</div>'
].join('');

Y.ScrollViewScrollbars = Y.mix(ScrollViewScrollbars, {

    // Prototype methods added to host class
    prototype: {
        
        /**
         * renderUI implementation
         *
         * If scrollbars are enabled, this method sets up the DOM nodes for them
         * @method renderUI
         */    
        renderUI: function() {
            if(this.get('scrollbarsEnabled')) {
                this._renderScrollbars();
                Y.later(500, this, 'flashScrollbars', true);
            }
        },
        
        /** 
         * Override the contentBox sizing method, since the contentBox height
         *
         * should not be that of the boundingBox.
         * @method _uiSizeCB
         * @protected
         */
        _uiSizeCB: function() {
            Y.ScrollViewBase.prototype._uiSizeCB.apply(this, arguments);

            this._renderScrollbars();
        },
        
        /**
         * Update the UI when the scrollY attr changes. In addition to the 
         * defualt _uiScrollY in ScrollViewBase, this method must also update
         * the scrollbars
         *
         * @method _uiScrollY
         * @param val {Number} The scrollY value
         * @param duration {Number} The length (in ms) of the scroll animation
         * @param easing {String} An easing equation, if duration is defined
         * @protected
         */
         _uiScrollY : function(val, duration, easing) {
            Y.ScrollViewBase.prototype._uiScrollY.apply(this, arguments);
            
            this.updateScrollbars(duration, easing);
        },
        
        /**
         * Update the UI when the scrollY attr changes. In addition to the 
         * defualt _uiScrollX in ScrollViewBase, this method must also update
         * the scrollbars
         *
         * @method _uiScrollX
         * @param val {Number} The scrollX value
         * @param duration {Number} The length (in ms) of the scroll animation
         * @param easing {String} An easing equation, if duration is defined
         * @protected
         */
         _uiScrollX : function(val, duration, easing) {
            Y.ScrollViewBase.prototype._uiScrollX.apply(this, arguments);
            
            this.updateScrollbars(duration, easing);
        },
        
        /**
         * Set up the DOM nodes for the scrollbars
         *
         * @method _renderScrollbars
         * @param contentBox {Y.Node} The contentBox for the widget
         * @protected
         */    
        _renderScrollbars: function(contentBox) {
            var boundingBox = this.get('boundingBox'),
                verticalNode = this.get('verticalScrollbarNode'),
                horizontalNode = this.get('horizontalScrollbarNode'),
                updatedScrollbars = true;

            // Vertical
            if(this._scrollsVertical && !verticalNode.inDoc()) {
                boundingBox.append(verticalNode);
                updatedScrollbars = false;
            }

            // Horizontal
            if(this._scrollsHorizontal && !horizontalNode.inDoc()) {
                boundingBox.append(horizontalNode);
                updatedScrollbars = false;
            }
            
            if(!updatedScrollbars) {
                this.updateScrollbars();
            }
        },
        
        /**
         * Position and resize the scroll bars according to the content size
         *
         * @method updateScrollbars
         * @method duration {Number} Number of ms of animation (optional) - used when snapping to bounds
         * @method easing {String} Optional easing equation to use during the animation, if duration is set
         */
        updateScrollbars: function(duration, easing) {
            var cb = this.get('contentBox'),
                scrollSize = 0,
                scrollPos = 1,
                transform,
                height = this.get('height'),
                width = this.get('width'),
                scrollHeight = cb.get('scrollHeight'),
                scrollWidth = cb.get('scrollWidth'),
                verticalNode = this.get('verticalScrollbarNode'),
                horizontalNode = this.get('horizontalScrollbarNode'),
                currentX = this.get('scrollX') * -1,
                currentY = this.get('scrollY') * -1;

            if(!this._showingScrollBars) {
                this.showScrollbars();
            }

            if(horizontalNode && scrollHeight <= height) {
                this.hideScrollbars();
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
         * @method showScrollbars
         * @param animated {Boolean} Whether or not to animate the showing 
         */
        showScrollbars: function(animated) {    
            var verticalNode = this.get('verticalScrollbarNode'),
                horizontalNode = this.get('horizontalScrollbarNode');

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
         * @method hideScrollbars
         * @param animated {Boolean} Whether or not to animate the hiding
         */
        hideScrollbars: function(animated) {
            var verticalNode = this.get('verticalScrollbarNode'),
                horizontalNode = this.get('horizontalScrollbarNode');

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
         * @method flashScrollbars
         */
        flashScrollbars: function() {
            var shouldFlash = false;
            if(this._scrollsVertical && this.get('contentBox').get('scrollHeight') > this.get('height')) {
                shouldFlash = true;
            }
            
            if(this._scrollsHorizontal && this.get('contentBox').get('scrollWidth') > this.get('width')) {
                shouldFlash = true;
            }
            
            if(shouldFlash) {
                this.showScrollbars(true);
                //setTimeout(Y.bind(this.hideScrollbars, this, true), 800);
                this._flashTimer = Y.later(800, this, 'hideScrollbars', true);
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
            this.flashScrollbars();
        }
        
    },

    // Static properties added onto host class
    ATTRS: {
        
        /**
         * Enable or disable scrollbars
         *
         * @attribute scrollbarsEnabled
         * @type {Boolean}
         * @default true
         */
        scrollbarsEnabled: {
            value: true,
            validator: Y.Lang.isBoolean
        },
        
        /**
         * Vertical scrollbar node
         *
         * @attribute verticalScrollbarNode
         * @type Y.Node
         */
        verticalScrollbarNode: {
            setter: function(node) {
                node = Y.one(node);
                if(node) {
                    node.addClass(_classNames.scrollbar);
                    node.addClass(_classNames.vertical);
                }
                return node;
            },

            value: Y.Node.create(ScrollViewScrollbars.SCROLLBAR_TEMPLATE)
        },

        /**
         * Horizontal scrollbar node
         *
         * @attribute horizontalScrollbarNode
         * @type Y.Node
         */
        horizontalScrollbarNode: {
            setter: function(node) {
                node = Y.one(node);
                if(node) {
                    node.addClass(_classNames.scrollbar);
                    node.addClass(_classNames.horizontal);
                }
                return node;
            },

            value: Y.Node.create(ScrollViewScrollbars.SCROLLBAR_TEMPLATE)
        }
    }

}, true);


}, '@VERSION@' ,{requires:['scrollview-base']});
