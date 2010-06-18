YUI.add('scrollbars-plugin', function(Y) {

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
function ScrollbarsPlugin(config) {
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
     * @attribute verticalScrollbarNode
     * @type Y.Node
     */
    verticalScrollbarNode: {
		setter: '_setVerticalScrollbarNode',
        value: Y.Node.create(ScrollbarsPlugin.SCROLLBAR_TEMPLATE)
    },

    /**
     * Horizontal scrollbar node
     *
     * @attribute horizontalScrollbarNode
     * @type Y.Node
     */
    horizontalScrollbarNode: {
		setter: '_setHorizontalScrollbarNode',
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
        this.afterHostMethod('renderUI', this._renderScrollbars);
        this.afterHostMethod('_uiSizeCB', this._renderScrollbars);
        this.afterHostMethod('_uiScrollY', this._updateScrollbars);
        this.afterHostMethod('_uiScrollX', this._updateScrollbars);
        this.doAfter('scroll:end', this.flashScrollbars);
    },
    
    /**
     * Set up the DOM nodes for the scrollbars
     *
     * @method _renderScrollbars
     * @param contentBox {Y.Node} The contentBox for the widget
     * @protected
     */    
    _renderScrollbars: function(contentBox) {
        var boundingBox = this.get('host').get('boundingBox'),
            verticalNode = this.get('verticalScrollbarNode'),
            horizontalNode = this.get('horizontalScrollbarNode'),
            updatedScrollbars = true;

        // Vertical
        if(this.get('host')._scrollsVertical && !verticalNode.inDoc()) {
            boundingBox.append(verticalNode);
            updatedScrollbars = false;
        }

        // Horizontal
        if(this.get('host')._scrollsHorizontal && !horizontalNode.inDoc()) {
            boundingBox.append(horizontalNode);
            updatedScrollbars = false;
        }
        
        if(!updatedScrollbars) {
            this._updateScrollbars();
        }

        Y.later(500, this, 'flashScrollbars', true);
    },
    
    /**
     * Position and resize the scroll bars according to the content size
     *
     * @method _updateScrollbars
     * @param scrollPos {Number} The current scrollX or scrollY value (not used here, but passed by default from _uiScrollX/_uiScrollY)
     * @param duration {Number} Number of ms of animation (optional) - used when snapping to bounds
     * @param easing {String} Optional easing equation to use during the animation, if duration is set
     * @protected
     */
    _updateScrollbars: function(scrollPos, duration, easing) {
        var cb = this.get('host').get('contentBox'),
            scrollSize = 0,
            scrollPos = 1,
            transform,
            height = this.get('host').get('height'),
            width = this.get('host').get('width'),
            scrollHeight = cb.get('scrollHeight'),
            scrollWidth = cb.get('scrollWidth'),
            verticalNode = this.get('verticalScrollbarNode'),
            horizontalNode = this.get('horizontalScrollbarNode'),
            currentX = this.get('host').get('scrollX') * -1,
            currentY = this.get('host').get('scrollY') * -1;

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
        if(this.get('host')._scrollsVertical && this.get('host').get('contentBox').get('scrollHeight') > this.get('host').get('height')) {
            shouldFlash = true;
        }
        
        if(this.get('host')._scrollsHorizontal && this.get('host').get('contentBox').get('scrollWidth') > this.get('host').get('width')) {
            shouldFlash = true;
        }
        
        if(shouldFlash) {
            this.showScrollbars(true);
            this._flashTimer = Y.later(800, this, 'hideScrollbars', true);
        }
    },

    /**
     * Setter for the verticalScrollbarNode ATTR
     *
     * @method _setVerticalScrollbarNode
     * @param node {Y.Node} The Y.Node instance for the scrollbar
     * @protected
     */
    _setVerticalScrollbarNode: function(node) {
        node = Y.one(node);
        if(node) {
            node.addClass(_classNames.scrollbar);
            node.addClass(_classNames.vertical);
        }
        return node;
    },

    /**
     * Setter for the horizontalScrollbarNode ATTR
     *
     * @method _setHorizontalScrollbarNode
     * @param node {Y.Node} The Y.Node instance for the scrollbar
     * @protected
     */
    _setHorizontalScrollbarNode: function(node) {
        node = Y.one(node);
        if(node) {
            node.addClass(_classNames.scrollbar);
            node.addClass(_classNames.horizontal);
        }
        return node;
    }

});


}, '@VERSION@' ,{requires:['plugin']});
