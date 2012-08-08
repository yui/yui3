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
_yuitest_coverage["/build/scrollview-base/scrollview-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/scrollview-base/scrollview-base.js",
    code: []
};
_yuitest_coverage["/build/scrollview-base/scrollview-base.js"].code=["YUI.add('scrollview-base', function(Y) {","","/**"," * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators"," *"," * @module scrollview-base"," */","","var getClassName = Y.ClassNameManager.getClassName,","    SCROLLVIEW = 'scrollview',","    CLASS_NAMES = {","        vertical: getClassName(SCROLLVIEW, 'vert'),","        horizontal: getClassName(SCROLLVIEW, 'horiz')","    },","    EV_SCROLL_END = 'scrollEnd',","    EV_SCROLL_FLICK = 'flick',","","    FLICK = EV_SCROLL_FLICK,","    DRAG = \"drag\",","    ","    MOUSEWHEEL_ENABLED = true,","","    UI = 'ui',","    ","    LEFT = \"left\",","    TOP = \"top\",","    ","    PX = \"px\",","","    SCROLL_Y = \"scrollY\",","    SCROLL_X = \"scrollX\",","    BOUNCE = \"bounce\",","    DISABLED = \"disabled\",","","    DIM_X = \"x\",","    DIM_Y = \"y\",","","    BOUNDING_BOX = \"boundingBox\",","    CONTENT_BOX = \"contentBox\",","","    EMPTY = \"\",","    ZERO = \"0s\",","","    IE = Y.UA.ie,","    ","    Transition = Y.Transition,","","    NATIVE_TRANSITIONS = Transition.useNative,","","    _constrain = function (val, min, max) { ","        return Math.min(Math.max(val, min), max);","    };","","/**"," * ScrollView provides a scrollable widget, supporting flick gestures, across both touch and mouse based devices. "," *"," * @class ScrollView"," * @param config {Object} Object literal with initial attribute values"," * @extends Widget"," * @constructor"," */","function ScrollView() {","    ScrollView.superclass.constructor.apply(this, arguments);","}","","Y.ScrollView = Y.extend(ScrollView, Y.Widget, {","    ","    // Y.ScrollView prototype","    ","    /**","     * Designated initializer","     *","     * @method initializer","     */","    initializer: function() {","        /**","         * Notification event fired at the end of a scroll transition","         * ","         * @event scrollEnd","         * @param e {EventFacade} The default event facade.","         */","","        /**","         * Notification event fired at the end of a flick gesture (the flick animation may still be in progress)","         * ","         * @event flick","         * @param e {EventFacade} The default event facade.","         */","        var sv = this;","        ","        // Cache - they're write once, and not going to change","        sv._cb = sv.get(CONTENT_BOX);","        sv._bb = sv.get(BOUNDING_BOX);","    },","","    /** ","     * Override the contentBox sizing method, since the contentBox height","     * should not be that of the boundingBox.","     *","     * @method _uiSizeCB","     * @protected","     */","    _uiSizeCB: function() {},","","    /**","     * Content box transition callback","     *","     * @method _onTransEnd","     * @param {Event.Facade} e The event facade","     * @private","     */","    _onTransEnd: function(e) {","        this.fire(EV_SCROLL_END);","    },","","    /**","     * bindUI implementation","     *","     * Hooks up events for the widget","     * @method bindUI","     */","    bindUI: function() {","        var sv = this;","","        sv._bindDrag(sv.get(DRAG));","        sv._bindFlick(sv.get(FLICK));","        // Note: You can find _bindMousewheel() inside syncUI(), becuase it depends on UI details","","        sv._bindAttrs();","","        // IE SELECT HACK. See if we can do this non-natively and in the gesture for a future release.","        if (IE) {","            sv._fixIESelect(sv._bb, sv._cb);","        }","    },","","    /**","     * @method _bindAttrs","     * @private ","     */","    _bindAttrs : function() {","","        var sv = this,","            scrollChangeHandler = sv._afterScrollChange,","            dimChangeHandler = sv._afterDimChange;","","        this.after({","            'disabledChange': sv._afterDisabledChange,","            'flickChange'   : sv._afterFlickChange,","            'dragChange'    : sv._afterDragChange,","            'scrollYChange' : scrollChangeHandler,","            'scrollXChange' : scrollChangeHandler,","            'heightChange'  : dimChangeHandler,","            'widthChange'   : dimChangeHandler","        });","","        // Helps avoid potential CSS race where in the styles from","        // scrollview-list-skin.css are applied after syncUI() fires.","        // Without a _uiDimensionChange() call, the scrollview only ","        // scrolls partially due to the fact that styles added in the CSS","        // altered the height/width of the bounding box.","        // TODO: Remove?","        if (!IE) {","            this.after('renderedChange', function(e) {","                //this._uiDimensionsChange();","            });","        }","    },","","    /**","     * Bind (or unbind) gesture move listeners required for drag support","     * ","     * @method _bindDrag","     * @param drag {boolean} If true, the method binds listener to enable drag (gesturemovestart). If false, the method unbinds gesturemove listeners for drag support.","     * @private ","     */","    _bindDrag : function(drag) {","        var bb = this._bb;","","        if (drag) {","            bb.on('drag|gesturemovestart', Y.bind(this._onGestureMoveStart, this));","        } else {","            bb.detach('drag|*');","        }","    },","","    /**","     * Bind (or unbind) flick listeners.","     * ","     * @method _bindFlick","     * @param flick {Object|boolean} If truthy, the method binds listeners for flick support. If false, the method unbinds flick listeners.  ","     * @private","     */","    _bindFlick : function(flick) {","        var cb = this._cb;","","        if (flick) {","            cb.on(\"flick|flick\", Y.bind(this._flick, this), flick);","        } else {","            cb.detach('flick|*');","        }","    },","    ","    /**","     * Bind (or unbind) mousewheel listeners.","     * ","     * @method _bindMousewheel","     * @param mousewheel {Object|boolean} If truthy, the method binds listeners for mousewheel support. If false, the method unbinds mousewheel listeners.  ","     * @private","     */","    _bindMousewheel : function(mousewheel) {","        var bb = this._bb;","","        // Only enable for vertical scrollviews","        if (this._scrollsVertical) {","            if (mousewheel) {","                Y.one(document).on(\"mousewheel\", Y.bind(this._mousewheel, this));","            } else {","                bb.detach('mousewheel|*');","            }","        }","    },","","    /**","     * syncUI implementation.","     *","     * Update the scroll position, based on the current value of scrollX/scrollY.","     *","     * @method syncUI","     */","    syncUI: function() {","        this._cDisabled = this.get(DISABLED);","        this._uiDimensionsChange();","        this._bindMousewheel(MOUSEWHEEL_ENABLED);","        this.scrollTo(this.get(SCROLL_X), this.get(SCROLL_Y));","    },","","    /**","     * Scroll the element to a given xy coordinate","     *","     * @method scrollTo","     * @param x {Number} The x-position to scroll to","     * @param y {Number} The y-position to scroll to","     * @param duration {Number} Duration, in ms, of the scroll animation (default is 0)","     * @param easing {String} An easing equation if duration is set","     */","    scrollTo: function(x, y, duration, easing) {","        // TODO: Figure out a better way to detect mousewheel events","        if (easing === undefined) {","            if ( y < this._minScrollY) {","                y = this._minScrollY;","            }","            else if ( y > this._maxScrollY) {","                y = this._maxScrollY;","            }","        }","        ","        if (!this._cDisabled) {","            var cb = this._cb,","                xSet = (x !== null),","                ySet = (y !== null),","                xMove = (xSet) ? x * -1 : 0,","                yMove = (ySet) ? y * -1 : 0,","                transition,","                TRANS = ScrollView._TRANSITION,","                callback = this._transEndCB;","    ","            duration = duration || 0;","            easing = easing || ScrollView.EASING;","    ","            if (xSet) {","                this.set(SCROLL_X, x, { src: UI });","            }","    ","            if (ySet) {","                this.set(SCROLL_Y, y, { src: UI });","            }","    ","            if (NATIVE_TRANSITIONS) {","                // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.","                cb.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);","            }","","            if (duration !== 0) {","                transition = {","                    easing : easing,","                    duration : duration/1000","                };","    ","                if (NATIVE_TRANSITIONS) {","                    transition.transform = this._transform(xMove, yMove);","                } else {","                    if (xSet) { transition.left = xMove + PX; }","                    if (ySet) { transition.top = yMove + PX; }","                }","    ","    ","                if (!callback) {","                    callback = this._transEndCB = Y.bind(this._onTransEnd, this);","                }","    ","                cb.transition(transition, callback);","            } else {","                if (NATIVE_TRANSITIONS) {","                    cb.setStyle('transform', this._transform(xMove, yMove));","                } else {","                    if (xSet) { cb.setStyle(LEFT, xMove + PX); }","                    if (ySet) { cb.setStyle(TOP, yMove + PX); }","                }","            }","        }","    },","","    /**","     * Utility method, to create the translate transform string with the","     * x, y translation amounts provided.","     *","     * @method _transform","     * @param {Number} x Number of pixels to translate along the x axis","     * @param {Number} y Number of pixels to translate along the y axis","     * @private","     */","    _transform : function(x, y) {","        // TODO: Would we be better off using a Matrix for this?","        return (this._forceHWTransforms) ? 'translate('+ x +'px,'+ y +'px) translateZ(0px)' : 'translate('+ x +'px,'+ y +'px)';","    },","","    /**","     * Utility method, to move the given element to the given xy position","     *","     * @method _moveTo","     * @param node {Node} The node to move","     * @param x {Number} The x-position to move to","     * @param y {Number} The y-position to move to","     * @private","     */","    _moveTo : function(node, x, y) {","        if (NATIVE_TRANSITIONS) {","            node.setStyle('transform', this._transform(x, y));","        } else {","            node.setStyle(LEFT, x + PX);","            node.setStyle(TOP, y + PX);","        }","    },","","    /**","     * Flag driving whether or not we should try and force H/W acceleration when transforming. Currently enabled by default for Webkit.","     * Used by the _transform method.","     *","     * @property _forceHWTransforms","     * @type boolean","     * @protected","     */","    _forceHWTransforms: Y.UA.webkit ? true : false,","","    /**","     * <p>Used to control whether or not ScrollView's internal","     * gesturemovestart, gesturemove and gesturemoveend","     * event listeners should preventDefault. The value is an","     * object, with \"start\", \"move\" and \"end\" properties used to ","     * specify which events should preventDefault and which shouldn't:</p>","     *","     * <pre>","     * {","     *    start : false,","     *    move : true,","     *    end : false","     * }","     * </pre>","     *","     * <p>The default values are set up in order to prevent panning,","     * on touch devices, while allowing click listeners on elements inside ","     * the ScrollView to be notified as expected.</p> ","     *","     * @property _prevent","     * @type Object","     * @protected","     */","    _prevent : {","        start : false,","        move : true,","        end : false","    },","","    /**","     * gesturemovestart event handler","     *","     * @method _onGestureMoveStart","     * @param e {Event.Facade} The gesturemovestart event facade","     * @private","     */","    _onGestureMoveStart: function(e) {","        ","        var sv = this,","            bb = sv._bb;","","        if (!sv._cDisabled) {","","            if (sv._prevent.start) {","                e.preventDefault();","            }","    ","            sv._killTimer();","    ","            sv._hm = bb.on('drag|gesturemove', Y.bind(sv._onGestureMove, sv));","            sv._hme = bb.on('drag|gesturemoveend', Y.bind(sv._onGestureMoveEnd, sv));","    ","            sv._startY = e.clientY + sv.get(SCROLL_Y);","            sv._startX = e.clientX + sv.get(SCROLL_X);","            sv._startClientY = sv._endClientY = e.clientY;","            sv._startClientX = sv._endClientX = e.clientX;","    ","            /**","             * Internal state, defines whether or not the scrollview is currently being dragged","             * ","             * @property _isDragging","             * @type boolean","             * @protected","             */","            sv._isDragging = false;","    ","            /**","             * Internal state, defines whether or not the scrollview is currently animating a flick","             * ","             * @property _flicking","             * @type boolean","             * @protected","             */","            sv._flicking = false;","    ","            /**","             * Internal state, defines whether or not the scrollview needs to snap to a boundary edge","             * ","             * @property _snapToEdge","             * @type boolean","             * @protected","             */","            sv._snapToEdge = false;","        }","    },    ","    ","    /**","     * gesturemove event handler","     *","     * @method _onGestureMove","     * @param e {Event.Facade} The gesturemove event facade","     * @private","     */","    _onGestureMove: function(e) {","","        var sv = this;","","        if (sv._prevent.move) {","            e.preventDefault();","        }","","        sv._isDragging = true;","        sv._endClientY = e.clientY;","        sv._endClientX = e.clientX;","","        if (sv._scrollsVertical) {","            sv.set(SCROLL_Y, -(e.clientY - sv._startY));","        }","","        if(sv._scrollsHorizontal) {","            sv.set(SCROLL_X, -(e.clientX - sv._startX));","        }","    },","","    /**","     * gestureend event handler","     *","     * @method _onGestureMoveEnd","     * @param e {Event.Facade} The gesturemoveend event facade","     * @private","     */","    _onGestureMoveEnd: function(e) {","","        if (this._prevent.end) {","            e.preventDefault();","        }","","        var sv = this, // kweight","            minY = sv._minScrollY,","            maxY = sv._maxScrollY,","            minX = sv._minScrollX,","            maxX = sv._maxScrollX,","            vert = sv._scrollsVertical,","            horiz = sv._scrollsHorizontal,","            startPoint =  vert ? sv._startClientY : sv._startClientX,","            endPoint = vert ? sv._endClientY : sv._endClientX,","            distance = startPoint - endPoint,","            absDistance = Math.abs(distance),","            bb = sv._bb,","            x, y, xOrig, yOrig;","","        sv._hm.detach();","        sv._hme.detach();","","        /**","         * Internal state, defines whether or not the scrollview has been scrolled half it's width/height","         * ","         * @property _scrolledHalfway","         * @type boolean","         * @protected","         */","        sv._scrolledHalfway = sv._snapToEdge = sv._isDragging = false;","","        /**","         * Contains the distance (postive or negative) in pixels by which the scrollview was last scrolled. This is useful when","         * setting up click listeners on the scrollview content, which on mouse based devices are always fired, even after a","         * drag/flick. ","         * ","         * <p>Touch based devices don't currently fire a click event, if the finger has been moved (beyond a threshold) so this check isn't required,","         * if working in a purely touch based environment</p>","         * ","         * @property lastScrolledAmt","         * @type Number","         * @public","         */","        sv.lastScrolledAmt = distance;","","        // Check for halfway","        if((horiz && absDistance > bb.get('offsetWidth')/2) || (vert && absDistance > bb.get('offsetHeight')/2)) {","            sv._scrolledHalfway = true;","","            /**","             * Internal state, defines whether or not the scrollview has been scrolled in the forward (distance > 0), or backward (distance < 0) direction","             * ","             * @property _scrolledForward","             * @type boolean","             * @protected","             */","            sv._scrolledForward = distance > 0;","        }","","        // Check for min/max","        if (vert) {","            yOrig = sv.get(SCROLL_Y);","            y = _constrain(yOrig, minY, maxY);","        }","","        if (horiz) {","            xOrig = sv.get(SCROLL_X);","            x = _constrain(xOrig, minX, maxX);","        }","","        if (x !== xOrig || y !== yOrig) {","            this._snapToEdge = true;","            if (vert) {","                sv.set(SCROLL_Y, y);","            }","            if (horiz) {","                sv.set(SCROLL_X, x);","            }","        }","","","        if(sv._snapToEdge) {","            return;","        }","","        sv.fire(EV_SCROLL_END, {","            onGestureMoveEnd: true","        });","","        return;","    },","","    /**","     * After listener for changes to the scrollX or scrollY attribute","     *","     * @method _afterScrollChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterScrollChange : function(e) {","        var duration = e.duration,","            easing = e.easing,","            val = e.newVal;","        if(e.src !== UI) {","            if (e.attrName == SCROLL_X) {","                this._uiScrollTo(val, null, duration, easing);","            } else {","                this._uiScrollTo(null, val, duration, easing);","            }","        }","    },","","    /**","     * After listener for changes to the flick attribute","     *","     * @method _afterFlickChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterFlickChange : function(e) {","        this._bindFlick(e.newVal);","    },","    ","    /**","     * After listener for changes to the disabled attribute","     *","     * @method _afterDisabledChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDisabledChange : function(e) {","        // Cache for performance - we check during move","        this._cDisabled = e.newVal;","    },","","    /**","     * After listener for changes to the drag attribute","     *","     * @method _afterDragChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDragChange : function(e) {","        this._bindDrag(e.newVal);","    },","","    /**","     * Used to move the ScrollView content","     *","     * @method _uiScrollTo","     * @param x {Number}","     * @param y {Number}","     * @param duration {Number}","     * @param easing {String}","     * @protected","     * ","     */","    _uiScrollTo : function(x, y, duration, easing) {","        // TODO: This doesn't seem right. This is not UI logic. ","        duration = duration || this._snapToEdge ? 400 : 0;","        easing = easing || this._snapToEdge ? ScrollView.SNAP_EASING : null;","","        this.scrollTo(x, y, duration, easing);","    },","","    /**","     * After listener for the height or width attribute","     *","     * @method _afterDimChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDimChange: function() {","        this._uiDimensionsChange();","    },","","    /**","    * Utility method to obtain scrollWidth, scrollHeight,","    * accounting for the impact of translate on scrollWidth, scrollHeight","    * @method _getScrollDims","    * @returns {Array} The offsetWidth, offsetHeight, scrollWidth and scrollHeight as an array: [offsetWidth, offsetHeight, scrollWidth, scrollHeight]","    * @private","    */","    _getScrollDims: function() {","        var dims,","","            // Ideally using CSSMatrix - don't think we have it normalized yet though.","            // origX = (new WebKitCSSMatrix(cb.getComputedStyle(\"transform\"))).e;","            // origY = (new WebKitCSSMatrix(cb.getComputedStyle(\"transform\"))).f;","","            origX = this.get(SCROLL_X),","            origY = this.get(SCROLL_Y),","","            cb = this.get(CONTENT_BOX),","            bb = this.get(BOUNDING_BOX),","","            HWTransform,","","            TRANS = ScrollView._TRANSITION;","","        // TODO: Is this OK? Just in case it's called 'during' a transition.","        if (NATIVE_TRANSITIONS) {","            cb.setStyle(TRANS.DURATION, ZERO);","            cb.setStyle(TRANS.PROPERTY, EMPTY);","        }","","        HWTransform = this._forceHWTransforms;","        this._forceHWTransforms = false;  // the z translation was causing issues with picking up accurate scrollWidths in Chrome/Mac.","","        this._moveTo(cb, 0, 0);","        dims = [bb.get(\"offsetWidth\"), bb.get(\"offsetHeight\"), bb.get('scrollWidth'), bb.get('scrollHeight')];","        this._moveTo(cb, -1*origX, -1*origY);","","        this._forceHWTransforms = HWTransform;","","        return dims;","    },","","    /**","     * This method gets invoked whenever the height or width attributes change,","     * allowing us to determine which scrolling axes need to be enabled.","     *","     * @method _uiDimensionsChange","     * @protected","     */","    _uiDimensionsChange: function() {","        var sv = this,","            bb = sv._bb,","            CLASS_NAMES = ScrollView.CLASS_NAMES,","","            scrollDims = this._getScrollDims(),","","            width = scrollDims[0],","            height = scrollDims[1],","            scrollWidth = scrollDims[2],","            scrollHeight = scrollDims[3];","","        if (height && scrollHeight > height) {","            sv._scrollsVertical = true;","            sv._maxScrollY = scrollHeight - height;","            sv._minScrollY = 0;","            sv._scrollHeight = scrollHeight;","            sv._height = height;","            bb.addClass(CLASS_NAMES.vertical);","        } else {","            sv._scrollsVertical = false;","            delete sv._maxScrollY;","            delete sv._minScrollY;","            delete sv._scrollHeight;","            delete sv._height;","            bb.removeClass(CLASS_NAMES.vertical);","        }","","        if (width && scrollWidth > width) {","            sv._scrollsHorizontal = true;","            sv._maxScrollX = scrollWidth - width;","            sv._minScrollX = 0;","            sv._scrollWidth = scrollWidth;","            sv._width = width;            ","            bb.addClass(CLASS_NAMES.horizontal);","        } else {","            sv._scrollsHorizontal = false;","            delete sv._maxScrollX;","            delete sv._minScrollX;","            delete sv._scrollWidth;","            delete sv._width;","            bb.removeClass(CLASS_NAMES.horizontal);","        }","","        /**","         * Internal state, defines whether or not the scrollview can scroll vertically ","         * ","         * @property _scrollsVertical","         * @type boolean","         * @protected","         */","        ","        /**","         * Internal state, defines the maximum amount that the scrollview can be scrolled along the Y axis ","         * ","         * @property _maxScrollY","         * @type number","         * @protected","         */","","        /**","         * Internal state, defines the minimum amount that the scrollview can be scrolled along the Y axis ","         * ","         * @property _minScrollY","         * @type number","         * @protected","         */","","        /**","         * Internal state, cached scrollHeight, for performance ","         * ","         * @property _scrollHeight","         * @type number","         * @protected","         */","","        /**","         * Internal state, defines whether or not the scrollview can scroll horizontally ","         * ","         * @property _scrollsHorizontal","         * @type boolean","         * @protected","         */","        ","        /**","         * Internal state, defines the maximum amount that the scrollview can be scrolled along the X axis ","         * ","         * @property _maxScrollX","         * @type number","         * @protected","         */","","        /**","         * Internal state, defines the minimum amount that the scrollview can be scrolled along the X axis ","         * ","         * @property _minScrollX","         * @type number","         * @protected","         */","","        /**","         * Internal state, cached scrollWidth, for performance ","         * ","         * @property _scrollWidth","         * @type number","         * @protected","         */","    },","","    /**","     * Execute a flick at the end of a scroll action","     *","     * @method _flick","     * @param distance {Number} The distance (in px) the user scrolled before the flick","     * @param time {Number} The number of ms the scroll event lasted before the flick","     * @protected","     */","    _flick: function(e) {","        ","        var flick = e.flick,","            sv = this;","        ","        if (!sv._cDisabled) {","    ","            /**","             * Internal state, currently calculated velocity from the flick ","             * ","             * @property _currentVelocity","             * @type number","             * @protected","             */","            sv._currentVelocity = flick.velocity;","            sv._flicking = true;","    ","            sv._cDecel = sv.get('deceleration');","            sv._cBounce = sv.get('bounce');","    ","            sv._pastYEdge = false;","            sv._pastXEdge = false;","    ","            sv._flickFrame();","    ","            sv.fire(EV_SCROLL_FLICK);","        }","    },","","    _mousewheel: function(e) {","        var scrollY = this.get('scrollY'),","            boundingBox = this._bb,","            contentBox = this._cb,","            scrollOffset = 10, // 10px","            scrollToY = scrollY - (e.wheelDelta * scrollOffset);","","        if (boundingBox.contains(e.target)){","            this.scrollTo(0, scrollToY);","            ","            // if we have scrollbars plugin, update & set the flash timer on the scrollbar","            if (this.scrollbars) {","                // TODO: The scrollbars should handle this themselves","                this.scrollbars._update();","                this.scrollbars.flash();","                // or just this","                // this.scrollbars._hostDimensionsChange();","            }","","            // prevent browser default behavior on mouse scroll","            e.preventDefault();","        }","    },","","    /**","     * Execute a single frame in the flick animation","     *","     * @method _flickFrame","     * @protected","     */","    _flickFrame: function() {","        var sv = this,","            newY,","            maxY,","            minY,","            newX,","            maxX,","            minX,","            scrollsVertical  = sv._scrollsVertical,","            scrollsHorizontal = sv._scrollsHorizontal,","            deceleration = sv._cDecel,","            bounce = sv._cBounce,","            vel = sv._currentVelocity,","            step = ScrollView.FRAME_STEP;","","        if (scrollsVertical) {","            maxY = sv._maxScrollY;","            minY = sv._minScrollY;","            newY = sv.get(SCROLL_Y) - (vel * step);","        }","","        if (scrollsHorizontal) {","            maxX = sv._maxScrollX;","            minX = sv._minScrollX;","            newX = sv.get(SCROLL_X) - (vel * step);","        }","        ","        vel = sv._currentVelocity = (vel * deceleration);","","        if(Math.abs(vel).toFixed(4) <= 0.015) {","            sv._flicking = false;","            sv._killTimer(!(sv._pastYEdge || sv._pastXEdge));","","            if(scrollsVertical) {","                if(newY < minY) {","                    sv._snapToEdge = true;","                    sv.set(SCROLL_Y, minY);","                } else if(newY > maxY) {","                    sv._snapToEdge = true;","                    sv.set(SCROLL_Y, maxY);","                }","            }","","            if(scrollsHorizontal) {","                if(newX < minX) {","                    sv._snapToEdge = true;","                    sv.set(SCROLL_X, minX);","                } else if(newX > maxX) {","                    sv._snapToEdge = true;","                    sv.set(SCROLL_X, maxX);","                }","            }","","            return;","        }","","        if (scrollsVertical) {","            if (newY < minY || newY > maxY) {","                sv._pastYEdge = true;","                sv._currentVelocity *= bounce;","            }","","            sv.set(SCROLL_Y, newY);","        }","","        if (scrollsHorizontal) {","            if (newX < minX || newX > maxX) {","                sv._pastXEdge = true;","                sv._currentVelocity *= bounce;","            }","","            sv.set(SCROLL_X, newX);","        }","","        if (!sv._flickTimer) {","            sv._flickTimer = Y.later(step, sv, '_flickFrame', null, true);","        }","    },","","    /**","     * Stop the animation timer","     *","     * @method _killTimer","     * @param fireEvent {Boolean} If true, fire the scrollEnd event","     * @protected","     */","    _killTimer: function(fireEvent) {","        var sv = this;","        if(sv._flickTimer) {","            sv._flickTimer.cancel();","            sv._flickTimer = null;","        }","","        if(fireEvent) {","            sv.fire(EV_SCROLL_END);","        }","    },","","    /**","     * The scrollX, scrollY setter implementation","     *","     * @method _setScroll","     * @private","     * @param {Number} val","     * @param {String} dim","     *","     * @return {Number} The constrained value, if it exceeds min/max range","     */","    _setScroll : function(val, dim) {","        if (this._cDisabled) {","            val = Y.Attribute.INVALID_VALUE;","        } else {","    ","            var bouncing = this._cachedBounce || this.get(BOUNCE),","                range = ScrollView.BOUNCE_RANGE,","    ","                maxScroll = (dim == DIM_X) ? this._maxScrollX : this._maxScrollY,","    ","                min = bouncing ? -range : 0,","                max = bouncing ? maxScroll + range : maxScroll;","    ","            if(!bouncing || !this._isDragging) {","                if(val < min) {","                    val = min;","                } else if(val > max) {","                    val = max;","                }            ","            }","        }","","        return val;","    },","","    /**","     * Setter for the scrollX attribute","     *","     * @method _setScrollX","     * @param val {Number} The new scrollX value","     * @return {Number} The normalized value","     * @protected","     */    ","    _setScrollX: function(val) {","        return this._setScroll(val, DIM_X);","    },","","    /**","     * Setter for the scrollY ATTR","     *","     * @method _setScrollY","     * @param val {Number} The new scrollY value","     * @return {Number} The normalized value ","     * @protected","     */","    _setScrollY: function(val) {","        return this._setScroll(val, DIM_Y);","    }","    ","}, {","   ","   // Y.ScrollView static properties","","   /**","    * The identity of the widget.","    *","    * @property NAME","    * @type String","    * @default 'scrollview'","    * @readOnly","    * @protected","    * @static","    */","   NAME: 'scrollview',","","   /**","    * Static property used to define the default attribute configuration of","    * the Widget.","    *","    * @property ATTRS","    * @type {Object}","    * @protected","    * @static","    */","    ATTRS: {","","        /**","         * The scroll position in the y-axis","         *","         * @attribute scrollY","         * @type Number","         * @default 0","         */","        scrollY: {","            value: 0,","            setter: '_setScrollY'","        },","","        /**","         * The scroll position in the x-axis","         *","         * @attribute scrollX","         * @type Number","         * @default 0","         */","        scrollX: {","            value: 0,","            setter: '_setScrollX'","        },","","        /**","         * Drag coefficent for inertial scrolling. The closer to 1 this","         * value is, the less friction during scrolling.","         *","         * @attribute deceleration","         * @default 0.93","         */","        deceleration: {","            value: 0.93","        },","","        /**","         * Drag coefficient for intertial scrolling at the upper","         * and lower boundaries of the scrollview. Set to 0 to ","         * disable \"rubber-banding\".","         *","         * @attribute bounce","         * @type Number","         * @default 0.1","         */","        bounce: {","            value: 0.1","        },","","        /**","         * The minimum distance and/or velocity which define a flick. Can be set to false,","         * to disable flick support (note: drag support is enabled/disabled separately)","         *","         * @attribute flick","         * @type Object","         * @default Object with properties minDistance = 10, minVelocity = 0.3.","         */","        flick: {","            value: {","                minDistance: 10,","                minVelocity: 0.3","            }","        },","","        /**","         * Enable/Disable dragging the ScrollView content (note: flick support is enabled/disabled separately)","         * @attribute drag","         * @type boolean","         * @default true","         */","        drag: {","            value: true","        }","    },","","    /**","     * List of class names used in the scrollview's DOM","     *","     * @property CLASS_NAMES","     * @type Object","     * @static","     */","    CLASS_NAMES: CLASS_NAMES,","","    /**","     * Flag used to source property changes initiated from the DOM","     *","     * @property UI_SRC","     * @type String","     * @static","     * @default \"ui\"","     */","    UI_SRC: UI,","","    /**","     * The default bounce distance in pixels","     *","     * @property BOUNCE_RANGE","     * @type Number","     * @static","     * @default 150","     */","    BOUNCE_RANGE : 150,","","    /**","     * The interval used when animating the flick","     *","     * @property FRAME_STEP","     * @type Number","     * @static","     * @default 30","     */","    FRAME_STEP : 30,","","    /**","     * The default easing used when animating the flick","     *","     * @property EASING","     * @type String","     * @static","     * @default 'cubic-bezier(0, 0.1, 0, 1.0)'","     */","    EASING : 'cubic-bezier(0, 0.1, 0, 1.0)',","","    /**","     * The default easing to use when animating the bounce snap back.","     *","     * @property SNAP_EASING","     * @type String","     * @static","     * @default 'ease-out'","     */","    SNAP_EASING : 'ease-out',","","    /**","     * Object map of style property names used to set transition properties.","     * Defaults to the vendor prefix established by the Transition module.  ","     * The configured property names are `_TRANSITION.DURATION` (e.g. \"WebkitTransitionDuration\") and","     * `_TRANSITION.PROPERTY (e.g. \"WebkitTransitionProperty\").","     *","     * @property _TRANSITION","     * @private","     */","    _TRANSITION : {","        DURATION : Transition._VENDOR_PREFIX + \"TransitionDuration\",","        PROPERTY : Transition._VENDOR_PREFIX + \"TransitionProperty\"","    }","});","","","}, '@VERSION@' ,{skinnable:true, requires:['widget', 'event-gestures', 'event-mousewheel', 'transition']});"];
_yuitest_coverage["/build/scrollview-base/scrollview-base.js"].lines = {"1":0,"9":0,"51":0,"62":0,"63":0,"66":0,"89":0,"92":0,"93":0,"113":0,"123":0,"125":0,"126":0,"129":0,"132":0,"133":0,"143":0,"147":0,"163":0,"164":0,"178":0,"180":0,"181":0,"183":0,"195":0,"197":0,"198":0,"200":0,"212":0,"215":0,"216":0,"217":0,"219":0,"232":0,"233":0,"234":0,"235":0,"249":0,"250":0,"251":0,"253":0,"254":0,"258":0,"259":0,"268":0,"269":0,"271":0,"272":0,"275":0,"276":0,"279":0,"281":0,"284":0,"285":0,"290":0,"291":0,"293":0,"294":0,"298":0,"299":0,"302":0,"304":0,"305":0,"307":0,"308":0,"325":0,"338":0,"339":0,"341":0,"342":0,"394":0,"397":0,"399":0,"400":0,"403":0,"405":0,"406":0,"408":0,"409":0,"410":0,"411":0,"420":0,"429":0,"438":0,"451":0,"453":0,"454":0,"457":0,"458":0,"459":0,"461":0,"462":0,"465":0,"466":0,"479":0,"480":0,"483":0,"497":0,"498":0,"507":0,"521":0,"524":0,"525":0,"534":0,"538":0,"539":0,"540":0,"543":0,"544":0,"545":0,"548":0,"549":0,"550":0,"551":0,"553":0,"554":0,"559":0,"560":0,"563":0,"567":0,"578":0,"581":0,"582":0,"583":0,"585":0,"598":0,"610":0,"621":0,"637":0,"638":0,"640":0,"651":0,"662":0,"679":0,"680":0,"681":0,"684":0,"685":0,"687":0,"688":0,"689":0,"691":0,"693":0,"704":0,"715":0,"716":0,"717":0,"718":0,"719":0,"720":0,"721":0,"723":0,"724":0,"725":0,"726":0,"727":0,"728":0,"731":0,"732":0,"733":0,"734":0,"735":0,"736":0,"737":0,"739":0,"740":0,"741":0,"742":0,"743":0,"744":0,"822":0,"825":0,"834":0,"835":0,"837":0,"838":0,"840":0,"841":0,"843":0,"845":0,"850":0,"856":0,"857":0,"860":0,"862":0,"863":0,"869":0,"880":0,"894":0,"895":0,"896":0,"897":0,"900":0,"901":0,"902":0,"903":0,"906":0,"908":0,"909":0,"910":0,"912":0,"913":0,"914":0,"915":0,"916":0,"917":0,"918":0,"922":0,"923":0,"924":0,"925":0,"926":0,"927":0,"928":0,"932":0,"935":0,"936":0,"937":0,"938":0,"941":0,"944":0,"945":0,"946":0,"947":0,"950":0,"953":0,"954":0,"966":0,"967":0,"968":0,"969":0,"972":0,"973":0,"988":0,"989":0,"992":0,"1000":0,"1001":0,"1002":0,"1003":0,"1004":0,"1009":0,"1021":0,"1033":0};
_yuitest_coverage["/build/scrollview-base/scrollview-base.js"].functions = {"_constrain:50":0,"ScrollView:62":0,"initializer:75":0,"_onTransEnd:112":0,"bindUI:122":0,"_bindAttrs:141":0,"_bindDrag:177":0,"_bindFlick:194":0,"_bindMousewheel:211":0,"syncUI:231":0,"scrollTo:247":0,"_transform:323":0,"_moveTo:337":0,"_onGestureMoveStart:392":0,"_onGestureMove:449":0,"_onGestureMoveEnd:477":0,"_afterScrollChange:577":0,"_afterFlickChange:597":0,"_afterDisabledChange:608":0,"_afterDragChange:620":0,"_uiScrollTo:635":0,"_afterDimChange:650":0,"_getScrollDims:661":0,"_uiDimensionsChange:703":0,"_flick:820":0,"_mousewheel:849":0,"_flickFrame:879":0,"_killTimer:965":0,"_setScroll:987":0,"_setScrollX:1020":0,"_setScrollY:1032":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/scrollview-base/scrollview-base.js"].coveredLines = 244;
_yuitest_coverage["/build/scrollview-base/scrollview-base.js"].coveredFunctions = 32;
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 1);
YUI.add('scrollview-base', function(Y) {

/**
 * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators
 *
 * @module scrollview-base
 */

_yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 9);
var getClassName = Y.ClassNameManager.getClassName,
    SCROLLVIEW = 'scrollview',
    CLASS_NAMES = {
        vertical: getClassName(SCROLLVIEW, 'vert'),
        horizontal: getClassName(SCROLLVIEW, 'horiz')
    },
    EV_SCROLL_END = 'scrollEnd',
    EV_SCROLL_FLICK = 'flick',

    FLICK = EV_SCROLL_FLICK,
    DRAG = "drag",
    
    MOUSEWHEEL_ENABLED = true,

    UI = 'ui',
    
    LEFT = "left",
    TOP = "top",
    
    PX = "px",

    SCROLL_Y = "scrollY",
    SCROLL_X = "scrollX",
    BOUNCE = "bounce",
    DISABLED = "disabled",

    DIM_X = "x",
    DIM_Y = "y",

    BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",

    EMPTY = "",
    ZERO = "0s",

    IE = Y.UA.ie,
    
    Transition = Y.Transition,

    NATIVE_TRANSITIONS = Transition.useNative,

    _constrain = function (val, min, max) { 
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_constrain", 50);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 51);
return Math.min(Math.max(val, min), max);
    };

/**
 * ScrollView provides a scrollable widget, supporting flick gestures, across both touch and mouse based devices. 
 *
 * @class ScrollView
 * @param config {Object} Object literal with initial attribute values
 * @extends Widget
 * @constructor
 */
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 62);
function ScrollView() {
    _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "ScrollView", 62);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 63);
ScrollView.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 66);
Y.ScrollView = Y.extend(ScrollView, Y.Widget, {
    
    // Y.ScrollView prototype
    
    /**
     * Designated initializer
     *
     * @method initializer
     */
    initializer: function() {
        /**
         * Notification event fired at the end of a scroll transition
         * 
         * @event scrollEnd
         * @param e {EventFacade} The default event facade.
         */

        /**
         * Notification event fired at the end of a flick gesture (the flick animation may still be in progress)
         * 
         * @event flick
         * @param e {EventFacade} The default event facade.
         */
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "initializer", 75);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 89);
var sv = this;
        
        // Cache - they're write once, and not going to change
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 92);
sv._cb = sv.get(CONTENT_BOX);
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 93);
sv._bb = sv.get(BOUNDING_BOX);
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
     * Content box transition callback
     *
     * @method _onTransEnd
     * @param {Event.Facade} e The event facade
     * @private
     */
    _onTransEnd: function(e) {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_onTransEnd", 112);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 113);
this.fire(EV_SCROLL_END);
    },

    /**
     * bindUI implementation
     *
     * Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function() {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "bindUI", 122);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 123);
var sv = this;

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 125);
sv._bindDrag(sv.get(DRAG));
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 126);
sv._bindFlick(sv.get(FLICK));
        // Note: You can find _bindMousewheel() inside syncUI(), becuase it depends on UI details

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 129);
sv._bindAttrs();

        // IE SELECT HACK. See if we can do this non-natively and in the gesture for a future release.
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 132);
if (IE) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 133);
sv._fixIESelect(sv._bb, sv._cb);
        }
    },

    /**
     * @method _bindAttrs
     * @private 
     */
    _bindAttrs : function() {

        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_bindAttrs", 141);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 143);
var sv = this,
            scrollChangeHandler = sv._afterScrollChange,
            dimChangeHandler = sv._afterDimChange;

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 147);
this.after({
            'disabledChange': sv._afterDisabledChange,
            'flickChange'   : sv._afterFlickChange,
            'dragChange'    : sv._afterDragChange,
            'scrollYChange' : scrollChangeHandler,
            'scrollXChange' : scrollChangeHandler,
            'heightChange'  : dimChangeHandler,
            'widthChange'   : dimChangeHandler
        });

        // Helps avoid potential CSS race where in the styles from
        // scrollview-list-skin.css are applied after syncUI() fires.
        // Without a _uiDimensionChange() call, the scrollview only 
        // scrolls partially due to the fact that styles added in the CSS
        // altered the height/width of the bounding box.
        // TODO: Remove?
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 163);
if (!IE) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 164);
this.after('renderedChange', function(e) {
                //this._uiDimensionsChange();
            });
        }
    },

    /**
     * Bind (or unbind) gesture move listeners required for drag support
     * 
     * @method _bindDrag
     * @param drag {boolean} If true, the method binds listener to enable drag (gesturemovestart). If false, the method unbinds gesturemove listeners for drag support.
     * @private 
     */
    _bindDrag : function(drag) {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_bindDrag", 177);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 178);
var bb = this._bb;

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 180);
if (drag) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 181);
bb.on('drag|gesturemovestart', Y.bind(this._onGestureMoveStart, this));
        } else {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 183);
bb.detach('drag|*');
        }
    },

    /**
     * Bind (or unbind) flick listeners.
     * 
     * @method _bindFlick
     * @param flick {Object|boolean} If truthy, the method binds listeners for flick support. If false, the method unbinds flick listeners.  
     * @private
     */
    _bindFlick : function(flick) {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_bindFlick", 194);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 195);
var cb = this._cb;

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 197);
if (flick) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 198);
cb.on("flick|flick", Y.bind(this._flick, this), flick);
        } else {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 200);
cb.detach('flick|*');
        }
    },
    
    /**
     * Bind (or unbind) mousewheel listeners.
     * 
     * @method _bindMousewheel
     * @param mousewheel {Object|boolean} If truthy, the method binds listeners for mousewheel support. If false, the method unbinds mousewheel listeners.  
     * @private
     */
    _bindMousewheel : function(mousewheel) {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_bindMousewheel", 211);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 212);
var bb = this._bb;

        // Only enable for vertical scrollviews
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 215);
if (this._scrollsVertical) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 216);
if (mousewheel) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 217);
Y.one(document).on("mousewheel", Y.bind(this._mousewheel, this));
            } else {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 219);
bb.detach('mousewheel|*');
            }
        }
    },

    /**
     * syncUI implementation.
     *
     * Update the scroll position, based on the current value of scrollX/scrollY.
     *
     * @method syncUI
     */
    syncUI: function() {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "syncUI", 231);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 232);
this._cDisabled = this.get(DISABLED);
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 233);
this._uiDimensionsChange();
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 234);
this._bindMousewheel(MOUSEWHEEL_ENABLED);
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 235);
this.scrollTo(this.get(SCROLL_X), this.get(SCROLL_Y));
    },

    /**
     * Scroll the element to a given xy coordinate
     *
     * @method scrollTo
     * @param x {Number} The x-position to scroll to
     * @param y {Number} The y-position to scroll to
     * @param duration {Number} Duration, in ms, of the scroll animation (default is 0)
     * @param easing {String} An easing equation if duration is set
     */
    scrollTo: function(x, y, duration, easing) {
        // TODO: Figure out a better way to detect mousewheel events
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "scrollTo", 247);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 249);
if (easing === undefined) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 250);
if ( y < this._minScrollY) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 251);
y = this._minScrollY;
            }
            else {_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 253);
if ( y > this._maxScrollY) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 254);
y = this._maxScrollY;
            }}
        }
        
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 258);
if (!this._cDisabled) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 259);
var cb = this._cb,
                xSet = (x !== null),
                ySet = (y !== null),
                xMove = (xSet) ? x * -1 : 0,
                yMove = (ySet) ? y * -1 : 0,
                transition,
                TRANS = ScrollView._TRANSITION,
                callback = this._transEndCB;
    
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 268);
duration = duration || 0;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 269);
easing = easing || ScrollView.EASING;
    
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 271);
if (xSet) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 272);
this.set(SCROLL_X, x, { src: UI });
            }
    
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 275);
if (ySet) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 276);
this.set(SCROLL_Y, y, { src: UI });
            }
    
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 279);
if (NATIVE_TRANSITIONS) {
                // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 281);
cb.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);
            }

            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 284);
if (duration !== 0) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 285);
transition = {
                    easing : easing,
                    duration : duration/1000
                };
    
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 290);
if (NATIVE_TRANSITIONS) {
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 291);
transition.transform = this._transform(xMove, yMove);
                } else {
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 293);
if (xSet) { transition.left = xMove + PX; }
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 294);
if (ySet) { transition.top = yMove + PX; }
                }
    
    
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 298);
if (!callback) {
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 299);
callback = this._transEndCB = Y.bind(this._onTransEnd, this);
                }
    
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 302);
cb.transition(transition, callback);
            } else {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 304);
if (NATIVE_TRANSITIONS) {
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 305);
cb.setStyle('transform', this._transform(xMove, yMove));
                } else {
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 307);
if (xSet) { cb.setStyle(LEFT, xMove + PX); }
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 308);
if (ySet) { cb.setStyle(TOP, yMove + PX); }
                }
            }
        }
    },

    /**
     * Utility method, to create the translate transform string with the
     * x, y translation amounts provided.
     *
     * @method _transform
     * @param {Number} x Number of pixels to translate along the x axis
     * @param {Number} y Number of pixels to translate along the y axis
     * @private
     */
    _transform : function(x, y) {
        // TODO: Would we be better off using a Matrix for this?
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_transform", 323);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 325);
return (this._forceHWTransforms) ? 'translate('+ x +'px,'+ y +'px) translateZ(0px)' : 'translate('+ x +'px,'+ y +'px)';
    },

    /**
     * Utility method, to move the given element to the given xy position
     *
     * @method _moveTo
     * @param node {Node} The node to move
     * @param x {Number} The x-position to move to
     * @param y {Number} The y-position to move to
     * @private
     */
    _moveTo : function(node, x, y) {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_moveTo", 337);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 338);
if (NATIVE_TRANSITIONS) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 339);
node.setStyle('transform', this._transform(x, y));
        } else {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 341);
node.setStyle(LEFT, x + PX);
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 342);
node.setStyle(TOP, y + PX);
        }
    },

    /**
     * Flag driving whether or not we should try and force H/W acceleration when transforming. Currently enabled by default for Webkit.
     * Used by the _transform method.
     *
     * @property _forceHWTransforms
     * @type boolean
     * @protected
     */
    _forceHWTransforms: Y.UA.webkit ? true : false,

    /**
     * <p>Used to control whether or not ScrollView's internal
     * gesturemovestart, gesturemove and gesturemoveend
     * event listeners should preventDefault. The value is an
     * object, with "start", "move" and "end" properties used to 
     * specify which events should preventDefault and which shouldn't:</p>
     *
     * <pre>
     * {
     *    start : false,
     *    move : true,
     *    end : false
     * }
     * </pre>
     *
     * <p>The default values are set up in order to prevent panning,
     * on touch devices, while allowing click listeners on elements inside 
     * the ScrollView to be notified as expected.</p> 
     *
     * @property _prevent
     * @type Object
     * @protected
     */
    _prevent : {
        start : false,
        move : true,
        end : false
    },

    /**
     * gesturemovestart event handler
     *
     * @method _onGestureMoveStart
     * @param e {Event.Facade} The gesturemovestart event facade
     * @private
     */
    _onGestureMoveStart: function(e) {
        
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_onGestureMoveStart", 392);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 394);
var sv = this,
            bb = sv._bb;

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 397);
if (!sv._cDisabled) {

            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 399);
if (sv._prevent.start) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 400);
e.preventDefault();
            }
    
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 403);
sv._killTimer();
    
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 405);
sv._hm = bb.on('drag|gesturemove', Y.bind(sv._onGestureMove, sv));
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 406);
sv._hme = bb.on('drag|gesturemoveend', Y.bind(sv._onGestureMoveEnd, sv));
    
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 408);
sv._startY = e.clientY + sv.get(SCROLL_Y);
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 409);
sv._startX = e.clientX + sv.get(SCROLL_X);
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 410);
sv._startClientY = sv._endClientY = e.clientY;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 411);
sv._startClientX = sv._endClientX = e.clientX;
    
            /**
             * Internal state, defines whether or not the scrollview is currently being dragged
             * 
             * @property _isDragging
             * @type boolean
             * @protected
             */
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 420);
sv._isDragging = false;
    
            /**
             * Internal state, defines whether or not the scrollview is currently animating a flick
             * 
             * @property _flicking
             * @type boolean
             * @protected
             */
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 429);
sv._flicking = false;
    
            /**
             * Internal state, defines whether or not the scrollview needs to snap to a boundary edge
             * 
             * @property _snapToEdge
             * @type boolean
             * @protected
             */
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 438);
sv._snapToEdge = false;
        }
    },    
    
    /**
     * gesturemove event handler
     *
     * @method _onGestureMove
     * @param e {Event.Facade} The gesturemove event facade
     * @private
     */
    _onGestureMove: function(e) {

        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_onGestureMove", 449);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 451);
var sv = this;

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 453);
if (sv._prevent.move) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 454);
e.preventDefault();
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 457);
sv._isDragging = true;
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 458);
sv._endClientY = e.clientY;
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 459);
sv._endClientX = e.clientX;

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 461);
if (sv._scrollsVertical) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 462);
sv.set(SCROLL_Y, -(e.clientY - sv._startY));
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 465);
if(sv._scrollsHorizontal) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 466);
sv.set(SCROLL_X, -(e.clientX - sv._startX));
        }
    },

    /**
     * gestureend event handler
     *
     * @method _onGestureMoveEnd
     * @param e {Event.Facade} The gesturemoveend event facade
     * @private
     */
    _onGestureMoveEnd: function(e) {

        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_onGestureMoveEnd", 477);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 479);
if (this._prevent.end) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 480);
e.preventDefault();
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 483);
var sv = this, // kweight
            minY = sv._minScrollY,
            maxY = sv._maxScrollY,
            minX = sv._minScrollX,
            maxX = sv._maxScrollX,
            vert = sv._scrollsVertical,
            horiz = sv._scrollsHorizontal,
            startPoint =  vert ? sv._startClientY : sv._startClientX,
            endPoint = vert ? sv._endClientY : sv._endClientX,
            distance = startPoint - endPoint,
            absDistance = Math.abs(distance),
            bb = sv._bb,
            x, y, xOrig, yOrig;

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 497);
sv._hm.detach();
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 498);
sv._hme.detach();

        /**
         * Internal state, defines whether or not the scrollview has been scrolled half it's width/height
         * 
         * @property _scrolledHalfway
         * @type boolean
         * @protected
         */
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 507);
sv._scrolledHalfway = sv._snapToEdge = sv._isDragging = false;

        /**
         * Contains the distance (postive or negative) in pixels by which the scrollview was last scrolled. This is useful when
         * setting up click listeners on the scrollview content, which on mouse based devices are always fired, even after a
         * drag/flick. 
         * 
         * <p>Touch based devices don't currently fire a click event, if the finger has been moved (beyond a threshold) so this check isn't required,
         * if working in a purely touch based environment</p>
         * 
         * @property lastScrolledAmt
         * @type Number
         * @public
         */
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 521);
sv.lastScrolledAmt = distance;

        // Check for halfway
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 524);
if((horiz && absDistance > bb.get('offsetWidth')/2) || (vert && absDistance > bb.get('offsetHeight')/2)) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 525);
sv._scrolledHalfway = true;

            /**
             * Internal state, defines whether or not the scrollview has been scrolled in the forward (distance > 0), or backward (distance < 0) direction
             * 
             * @property _scrolledForward
             * @type boolean
             * @protected
             */
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 534);
sv._scrolledForward = distance > 0;
        }

        // Check for min/max
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 538);
if (vert) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 539);
yOrig = sv.get(SCROLL_Y);
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 540);
y = _constrain(yOrig, minY, maxY);
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 543);
if (horiz) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 544);
xOrig = sv.get(SCROLL_X);
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 545);
x = _constrain(xOrig, minX, maxX);
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 548);
if (x !== xOrig || y !== yOrig) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 549);
this._snapToEdge = true;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 550);
if (vert) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 551);
sv.set(SCROLL_Y, y);
            }
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 553);
if (horiz) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 554);
sv.set(SCROLL_X, x);
            }
        }


        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 559);
if(sv._snapToEdge) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 560);
return;
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 563);
sv.fire(EV_SCROLL_END, {
            onGestureMoveEnd: true
        });

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 567);
return;
    },

    /**
     * After listener for changes to the scrollX or scrollY attribute
     *
     * @method _afterScrollChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterScrollChange : function(e) {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_afterScrollChange", 577);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 578);
var duration = e.duration,
            easing = e.easing,
            val = e.newVal;
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 581);
if(e.src !== UI) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 582);
if (e.attrName == SCROLL_X) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 583);
this._uiScrollTo(val, null, duration, easing);
            } else {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 585);
this._uiScrollTo(null, val, duration, easing);
            }
        }
    },

    /**
     * After listener for changes to the flick attribute
     *
     * @method _afterFlickChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterFlickChange : function(e) {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_afterFlickChange", 597);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 598);
this._bindFlick(e.newVal);
    },
    
    /**
     * After listener for changes to the disabled attribute
     *
     * @method _afterDisabledChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDisabledChange : function(e) {
        // Cache for performance - we check during move
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_afterDisabledChange", 608);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 610);
this._cDisabled = e.newVal;
    },

    /**
     * After listener for changes to the drag attribute
     *
     * @method _afterDragChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDragChange : function(e) {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_afterDragChange", 620);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 621);
this._bindDrag(e.newVal);
    },

    /**
     * Used to move the ScrollView content
     *
     * @method _uiScrollTo
     * @param x {Number}
     * @param y {Number}
     * @param duration {Number}
     * @param easing {String}
     * @protected
     * 
     */
    _uiScrollTo : function(x, y, duration, easing) {
        // TODO: This doesn't seem right. This is not UI logic. 
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_uiScrollTo", 635);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 637);
duration = duration || this._snapToEdge ? 400 : 0;
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 638);
easing = easing || this._snapToEdge ? ScrollView.SNAP_EASING : null;

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 640);
this.scrollTo(x, y, duration, easing);
    },

    /**
     * After listener for the height or width attribute
     *
     * @method _afterDimChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDimChange: function() {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_afterDimChange", 650);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 651);
this._uiDimensionsChange();
    },

    /**
    * Utility method to obtain scrollWidth, scrollHeight,
    * accounting for the impact of translate on scrollWidth, scrollHeight
    * @method _getScrollDims
    * @returns {Array} The offsetWidth, offsetHeight, scrollWidth and scrollHeight as an array: [offsetWidth, offsetHeight, scrollWidth, scrollHeight]
    * @private
    */
    _getScrollDims: function() {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_getScrollDims", 661);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 662);
var dims,

            // Ideally using CSSMatrix - don't think we have it normalized yet though.
            // origX = (new WebKitCSSMatrix(cb.getComputedStyle("transform"))).e;
            // origY = (new WebKitCSSMatrix(cb.getComputedStyle("transform"))).f;

            origX = this.get(SCROLL_X),
            origY = this.get(SCROLL_Y),

            cb = this.get(CONTENT_BOX),
            bb = this.get(BOUNDING_BOX),

            HWTransform,

            TRANS = ScrollView._TRANSITION;

        // TODO: Is this OK? Just in case it's called 'during' a transition.
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 679);
if (NATIVE_TRANSITIONS) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 680);
cb.setStyle(TRANS.DURATION, ZERO);
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 681);
cb.setStyle(TRANS.PROPERTY, EMPTY);
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 684);
HWTransform = this._forceHWTransforms;
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 685);
this._forceHWTransforms = false;  // the z translation was causing issues with picking up accurate scrollWidths in Chrome/Mac.

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 687);
this._moveTo(cb, 0, 0);
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 688);
dims = [bb.get("offsetWidth"), bb.get("offsetHeight"), bb.get('scrollWidth'), bb.get('scrollHeight')];
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 689);
this._moveTo(cb, -1*origX, -1*origY);

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 691);
this._forceHWTransforms = HWTransform;

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 693);
return dims;
    },

    /**
     * This method gets invoked whenever the height or width attributes change,
     * allowing us to determine which scrolling axes need to be enabled.
     *
     * @method _uiDimensionsChange
     * @protected
     */
    _uiDimensionsChange: function() {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_uiDimensionsChange", 703);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 704);
var sv = this,
            bb = sv._bb,
            CLASS_NAMES = ScrollView.CLASS_NAMES,

            scrollDims = this._getScrollDims(),

            width = scrollDims[0],
            height = scrollDims[1],
            scrollWidth = scrollDims[2],
            scrollHeight = scrollDims[3];

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 715);
if (height && scrollHeight > height) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 716);
sv._scrollsVertical = true;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 717);
sv._maxScrollY = scrollHeight - height;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 718);
sv._minScrollY = 0;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 719);
sv._scrollHeight = scrollHeight;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 720);
sv._height = height;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 721);
bb.addClass(CLASS_NAMES.vertical);
        } else {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 723);
sv._scrollsVertical = false;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 724);
delete sv._maxScrollY;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 725);
delete sv._minScrollY;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 726);
delete sv._scrollHeight;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 727);
delete sv._height;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 728);
bb.removeClass(CLASS_NAMES.vertical);
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 731);
if (width && scrollWidth > width) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 732);
sv._scrollsHorizontal = true;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 733);
sv._maxScrollX = scrollWidth - width;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 734);
sv._minScrollX = 0;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 735);
sv._scrollWidth = scrollWidth;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 736);
sv._width = width;            
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 737);
bb.addClass(CLASS_NAMES.horizontal);
        } else {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 739);
sv._scrollsHorizontal = false;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 740);
delete sv._maxScrollX;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 741);
delete sv._minScrollX;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 742);
delete sv._scrollWidth;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 743);
delete sv._width;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 744);
bb.removeClass(CLASS_NAMES.horizontal);
        }

        /**
         * Internal state, defines whether or not the scrollview can scroll vertically 
         * 
         * @property _scrollsVertical
         * @type boolean
         * @protected
         */
        
        /**
         * Internal state, defines the maximum amount that the scrollview can be scrolled along the Y axis 
         * 
         * @property _maxScrollY
         * @type number
         * @protected
         */

        /**
         * Internal state, defines the minimum amount that the scrollview can be scrolled along the Y axis 
         * 
         * @property _minScrollY
         * @type number
         * @protected
         */

        /**
         * Internal state, cached scrollHeight, for performance 
         * 
         * @property _scrollHeight
         * @type number
         * @protected
         */

        /**
         * Internal state, defines whether or not the scrollview can scroll horizontally 
         * 
         * @property _scrollsHorizontal
         * @type boolean
         * @protected
         */
        
        /**
         * Internal state, defines the maximum amount that the scrollview can be scrolled along the X axis 
         * 
         * @property _maxScrollX
         * @type number
         * @protected
         */

        /**
         * Internal state, defines the minimum amount that the scrollview can be scrolled along the X axis 
         * 
         * @property _minScrollX
         * @type number
         * @protected
         */

        /**
         * Internal state, cached scrollWidth, for performance 
         * 
         * @property _scrollWidth
         * @type number
         * @protected
         */
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
        
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_flick", 820);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 822);
var flick = e.flick,
            sv = this;
        
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 825);
if (!sv._cDisabled) {
    
            /**
             * Internal state, currently calculated velocity from the flick 
             * 
             * @property _currentVelocity
             * @type number
             * @protected
             */
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 834);
sv._currentVelocity = flick.velocity;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 835);
sv._flicking = true;
    
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 837);
sv._cDecel = sv.get('deceleration');
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 838);
sv._cBounce = sv.get('bounce');
    
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 840);
sv._pastYEdge = false;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 841);
sv._pastXEdge = false;
    
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 843);
sv._flickFrame();
    
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 845);
sv.fire(EV_SCROLL_FLICK);
        }
    },

    _mousewheel: function(e) {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_mousewheel", 849);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 850);
var scrollY = this.get('scrollY'),
            boundingBox = this._bb,
            contentBox = this._cb,
            scrollOffset = 10, // 10px
            scrollToY = scrollY - (e.wheelDelta * scrollOffset);

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 856);
if (boundingBox.contains(e.target)){
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 857);
this.scrollTo(0, scrollToY);
            
            // if we have scrollbars plugin, update & set the flash timer on the scrollbar
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 860);
if (this.scrollbars) {
                // TODO: The scrollbars should handle this themselves
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 862);
this.scrollbars._update();
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 863);
this.scrollbars.flash();
                // or just this
                // this.scrollbars._hostDimensionsChange();
            }

            // prevent browser default behavior on mouse scroll
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 869);
e.preventDefault();
        }
    },

    /**
     * Execute a single frame in the flick animation
     *
     * @method _flickFrame
     * @protected
     */
    _flickFrame: function() {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_flickFrame", 879);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 880);
var sv = this,
            newY,
            maxY,
            minY,
            newX,
            maxX,
            minX,
            scrollsVertical  = sv._scrollsVertical,
            scrollsHorizontal = sv._scrollsHorizontal,
            deceleration = sv._cDecel,
            bounce = sv._cBounce,
            vel = sv._currentVelocity,
            step = ScrollView.FRAME_STEP;

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 894);
if (scrollsVertical) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 895);
maxY = sv._maxScrollY;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 896);
minY = sv._minScrollY;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 897);
newY = sv.get(SCROLL_Y) - (vel * step);
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 900);
if (scrollsHorizontal) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 901);
maxX = sv._maxScrollX;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 902);
minX = sv._minScrollX;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 903);
newX = sv.get(SCROLL_X) - (vel * step);
        }
        
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 906);
vel = sv._currentVelocity = (vel * deceleration);

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 908);
if(Math.abs(vel).toFixed(4) <= 0.015) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 909);
sv._flicking = false;
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 910);
sv._killTimer(!(sv._pastYEdge || sv._pastXEdge));

            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 912);
if(scrollsVertical) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 913);
if(newY < minY) {
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 914);
sv._snapToEdge = true;
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 915);
sv.set(SCROLL_Y, minY);
                } else {_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 916);
if(newY > maxY) {
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 917);
sv._snapToEdge = true;
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 918);
sv.set(SCROLL_Y, maxY);
                }}
            }

            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 922);
if(scrollsHorizontal) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 923);
if(newX < minX) {
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 924);
sv._snapToEdge = true;
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 925);
sv.set(SCROLL_X, minX);
                } else {_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 926);
if(newX > maxX) {
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 927);
sv._snapToEdge = true;
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 928);
sv.set(SCROLL_X, maxX);
                }}
            }

            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 932);
return;
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 935);
if (scrollsVertical) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 936);
if (newY < minY || newY > maxY) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 937);
sv._pastYEdge = true;
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 938);
sv._currentVelocity *= bounce;
            }

            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 941);
sv.set(SCROLL_Y, newY);
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 944);
if (scrollsHorizontal) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 945);
if (newX < minX || newX > maxX) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 946);
sv._pastXEdge = true;
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 947);
sv._currentVelocity *= bounce;
            }

            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 950);
sv.set(SCROLL_X, newX);
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 953);
if (!sv._flickTimer) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 954);
sv._flickTimer = Y.later(step, sv, '_flickFrame', null, true);
        }
    },

    /**
     * Stop the animation timer
     *
     * @method _killTimer
     * @param fireEvent {Boolean} If true, fire the scrollEnd event
     * @protected
     */
    _killTimer: function(fireEvent) {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_killTimer", 965);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 966);
var sv = this;
        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 967);
if(sv._flickTimer) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 968);
sv._flickTimer.cancel();
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 969);
sv._flickTimer = null;
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 972);
if(fireEvent) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 973);
sv.fire(EV_SCROLL_END);
        }
    },

    /**
     * The scrollX, scrollY setter implementation
     *
     * @method _setScroll
     * @private
     * @param {Number} val
     * @param {String} dim
     *
     * @return {Number} The constrained value, if it exceeds min/max range
     */
    _setScroll : function(val, dim) {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_setScroll", 987);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 988);
if (this._cDisabled) {
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 989);
val = Y.Attribute.INVALID_VALUE;
        } else {
    
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 992);
var bouncing = this._cachedBounce || this.get(BOUNCE),
                range = ScrollView.BOUNCE_RANGE,
    
                maxScroll = (dim == DIM_X) ? this._maxScrollX : this._maxScrollY,
    
                min = bouncing ? -range : 0,
                max = bouncing ? maxScroll + range : maxScroll;
    
            _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 1000);
if(!bouncing || !this._isDragging) {
                _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 1001);
if(val < min) {
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 1002);
val = min;
                } else {_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 1003);
if(val > max) {
                    _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 1004);
val = max;
                }}            
            }
        }

        _yuitest_coverline("/build/scrollview-base/scrollview-base.js", 1009);
return val;
    },

    /**
     * Setter for the scrollX attribute
     *
     * @method _setScrollX
     * @param val {Number} The new scrollX value
     * @return {Number} The normalized value
     * @protected
     */    
    _setScrollX: function(val) {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_setScrollX", 1020);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 1021);
return this._setScroll(val, DIM_X);
    },

    /**
     * Setter for the scrollY ATTR
     *
     * @method _setScrollY
     * @param val {Number} The new scrollY value
     * @return {Number} The normalized value 
     * @protected
     */
    _setScrollY: function(val) {
        _yuitest_coverfunc("/build/scrollview-base/scrollview-base.js", "_setScrollY", 1032);
_yuitest_coverline("/build/scrollview-base/scrollview-base.js", 1033);
return this._setScroll(val, DIM_Y);
    }
    
}, {
   
   // Y.ScrollView static properties

   /**
    * The identity of the widget.
    *
    * @property NAME
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
    * @property ATTRS
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
         * @default 0.93
         */
        deceleration: {
            value: 0.93
        },

        /**
         * Drag coefficient for intertial scrolling at the upper
         * and lower boundaries of the scrollview. Set to 0 to 
         * disable "rubber-banding".
         *
         * @attribute bounce
         * @type Number
         * @default 0.1
         */
        bounce: {
            value: 0.1
        },

        /**
         * The minimum distance and/or velocity which define a flick. Can be set to false,
         * to disable flick support (note: drag support is enabled/disabled separately)
         *
         * @attribute flick
         * @type Object
         * @default Object with properties minDistance = 10, minVelocity = 0.3.
         */
        flick: {
            value: {
                minDistance: 10,
                minVelocity: 0.3
            }
        },

        /**
         * Enable/Disable dragging the ScrollView content (note: flick support is enabled/disabled separately)
         * @attribute drag
         * @type boolean
         * @default true
         */
        drag: {
            value: true
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
     * @default "ui"
     */
    UI_SRC: UI,

    /**
     * The default bounce distance in pixels
     *
     * @property BOUNCE_RANGE
     * @type Number
     * @static
     * @default 150
     */
    BOUNCE_RANGE : 150,

    /**
     * The interval used when animating the flick
     *
     * @property FRAME_STEP
     * @type Number
     * @static
     * @default 30
     */
    FRAME_STEP : 30,

    /**
     * The default easing used when animating the flick
     *
     * @property EASING
     * @type String
     * @static
     * @default 'cubic-bezier(0, 0.1, 0, 1.0)'
     */
    EASING : 'cubic-bezier(0, 0.1, 0, 1.0)',

    /**
     * The default easing to use when animating the bounce snap back.
     *
     * @property SNAP_EASING
     * @type String
     * @static
     * @default 'ease-out'
     */
    SNAP_EASING : 'ease-out',

    /**
     * Object map of style property names used to set transition properties.
     * Defaults to the vendor prefix established by the Transition module.  
     * The configured property names are `_TRANSITION.DURATION` (e.g. "WebkitTransitionDuration") and
     * `_TRANSITION.PROPERTY (e.g. "WebkitTransitionProperty").
     *
     * @property _TRANSITION
     * @private
     */
    _TRANSITION : {
        DURATION : Transition._VENDOR_PREFIX + "TransitionDuration",
        PROPERTY : Transition._VENDOR_PREFIX + "TransitionProperty"
    }
});


}, '@VERSION@' ,{skinnable:true, requires:['widget', 'event-gestures', 'event-mousewheel', 'transition']});
