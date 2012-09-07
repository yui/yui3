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
_yuitest_coverage["build/scrollview-base/scrollview-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/scrollview-base/scrollview-base.js",
    code: []
};
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].code=["YUI.add('scrollview-base', function (Y, NAME) {","","/**"," * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators"," *"," * @module scrollview"," * @submodule scrollview-base"," */","var getClassName = Y.ClassNameManager.getClassName,","    DOCUMENT = Y.config.doc,","    WINDOW = Y.config.win,","    IE = Y.UA.ie,","    NATIVE_TRANSITIONS = Y.Transition.useNative,","    SCROLLVIEW = 'scrollview',","    CLASS_NAMES = {","        vertical: getClassName(SCROLLVIEW, 'vert'),","        horizontal: getClassName(SCROLLVIEW, 'horiz')","    },","    EV_SCROLL_END = 'scrollEnd',","    FLICK = 'flick',","    DRAG = 'drag',","    MOUSEWHEEL = 'mousewheel',","    UI = 'ui',","    TOP = 'top',","    RIGHT = 'right',","    BOTTOM = 'bottom',","    LEFT = 'left',","    PX = 'px',","    AXIS = 'axis',","    SCROLL_Y = 'scrollY',","    SCROLL_X = 'scrollX',","    BOUNCE = 'bounce',","    DISABLED = 'disabled',","    DECELERATION = 'deceleration',","    DIM_X = 'x',","    DIM_Y = 'y',","    BOUNDING_BOX = 'boundingBox',","    CONTENT_BOX = 'contentBox',","    GESTURE_MOVE = 'gesturemove',","    START = 'start',","    END = 'end',","    EMPTY = '',","    ZERO = '0s',","    SNAP_DURATION = 'snapDuration',","    SNAP_EASING = 'snapEasing', ","    EASING = 'easing', ","    FRAME_DURATION = 'frameDuration', ","    BOUNCE_RANGE = 'bounceRange',","    ","    _constrain = function (val, min, max) {","        return Math.min(Math.max(val, min), max);","    };","","/**"," * ScrollView provides a scrollable widget, supporting flick gestures,"," * across both touch and mouse based devices."," *"," * @class ScrollView"," * @param config {Object} Object literal with initial attribute values"," * @extends Widget"," * @constructor"," */","function ScrollView() {","    ScrollView.superclass.constructor.apply(this, arguments);","}","","Y.ScrollView = Y.extend(ScrollView, Y.Widget, {","","    // *** Y.ScrollView prototype","","    /**","     * Flag driving whether or not we should try and force H/W acceleration when transforming. Currently enabled by default for Webkit.","     * Used by the _transform method.","     *","     * @property _forceHWTransforms","     * @type boolean","     * @protected","     */","    _forceHWTransforms: Y.UA.webkit ? true : false,","","    /**","     * <p>Used to control whether or not ScrollView's internal","     * gesturemovestart, gesturemove and gesturemoveend","     * event listeners should preventDefault. The value is an","     * object, with \"start\", \"move\" and \"end\" properties used to","     * specify which events should preventDefault and which shouldn't:</p>","     *","     * <pre>","     * {","     *    start: false,","     *    move: true,","     *    end: false","     * }","     * </pre>","     *","     * <p>The default values are set up in order to prevent panning,","     * on touch devices, while allowing click listeners on elements inside","     * the ScrollView to be notified as expected.</p>","     *","     * @property _prevent","     * @type Object","     * @protected","     */","    _prevent: {","        start: false,","        move: true,","        end: false","    },","","    /**","     * Contains the distance (postive or negative) in pixels by which ","     * the scrollview was last scrolled. This is useful when setting up ","     * click listeners on the scrollview content, which on mouse based ","     * devices are always fired, even after a drag/flick. ","     * ","     * <p>Touch based devices don't currently fire a click event, ","     * if the finger has been moved (beyond a threshold) so this ","     * check isn't required, if working in a purely touch based environment</p>","     * ","     * @property lastScrolledAmt","     * @type Number","     * @public","     */","    lastScrolledAmt: null,","","    /**","     * Designated initializer","     *","     * @method initializer","     * @param {config} Configuration object for the plugin","     */","    initializer: function (config) {","        var sv = this;","","        // Cache these values, since they aren't going to change.","        sv._bb = sv.get(BOUNDING_BOX);","        sv._cb = sv.get(CONTENT_BOX);","","        // Cache some attributes","        sv._cAxis = sv.get(AXIS);","        sv._cBounce = sv.get(BOUNCE);","        sv._cBounceRange = sv.get(BOUNCE_RANGE);","        sv._cDeceleration = sv.get(DECELERATION);","        sv._cFrameDuration = sv.get(FRAME_DURATION);","    },","","    /**","     * bindUI implementation","     *","     * Hooks up events for the widget","     * @method bindUI","     */","    bindUI: function () {","        var sv = this;","","        // Bind interaction listers","        sv._bindFlick(sv.get(FLICK));","        sv._bindDrag(sv.get(DRAG));","        sv._bindMousewheel(ScrollView.MOUSEWHEEL);","        ","        // Bind change events","        sv._bindAttrs();","","        // IE SELECT HACK. See if we can do this non-natively and in the gesture for a future release.","        if (IE) {","            sv._fixIESelect(sv._bb, sv._cb);","        }","","        // Recalculate dimension properties","        // TODO: This should be throttled.","        Y.one(WINDOW).after('resize', sv._afterDimChange, sv);","    },","","    /**","     * ","     *","     * @method _bindAttrs","     * @private","     */","    _bindAttrs: function () {","        var sv = this,","            scrollChangeHandler = sv._afterScrollChange,","            dimChangeHandler = sv._afterDimChange;","","        // Set any deprecated static properties","        if (ScrollView.SNAP_DURATION) {","            sv.set(SNAP_DURATION, ScrollView.SNAP_DURATION);","        }","","        if (ScrollView.SNAP_EASING) {","            sv.set(SNAP_EASING, ScrollView.SNAP_EASING);","        }","","        if (ScrollView.EASING) {","            sv.set(EASING, ScrollView.EASING);","        }","","        if (ScrollView.FRAME_STEP) {","            sv.set(FRAME_DURATION, ScrollView.FRAME_STEP);","        }","","        if (ScrollView.BOUNCE_RANGE) {","            sv.set(BOUNCE_RANGE, ScrollView.BOUNCE_RANGE);","        }","","        // Bind any change event listeners","        sv.after({","            'scrollEnd': sv._afterScrollEnd,","            'disabledChange': sv._afterDisabledChange,","            'flickChange': sv._afterFlickChange,","            'dragChange': sv._afterDragChange,","            'axisChange': sv._afterAxisChange,","            'scrollYChange': scrollChangeHandler,","            'scrollXChange': scrollChangeHandler,","            'heightChange': dimChangeHandler,","            'widthChange': dimChangeHandler","        });","    },","","    /**","     * Bind (or unbind) gesture move listeners required for drag support","     *","     * @method _bindDrag","     * @param drag {boolean} If true, the method binds listener to enable drag (gesturemovestart). If false, the method unbinds gesturemove listeners for drag support.","     * @private","     */","    _bindDrag: function (drag) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'drag' listeners","        bb.detach(DRAG + '|*');","","        if (drag) {","            bb.on(DRAG + '|' + GESTURE_MOVE + START, Y.bind(sv._onGestureMoveStart, sv));","        }","    },","","    /**","     * Bind (or unbind) flick listeners.","     *","     * @method _bindFlick","     * @param flick {Object|boolean} If truthy, the method binds listeners for flick support. If false, the method unbinds flick listeners.","     * @private","     */","    _bindFlick: function (flick) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'flick' listeners","        bb.detach(FLICK + '|*');","","        if (flick) {","            bb.on(FLICK + '|' + FLICK, Y.bind(sv._flick, sv), flick);","","            // Rebind Drag, becuase _onGestureMoveEnd always has to fire -after- _flick","            sv._bindDrag(sv.get(DRAG));","        }","    },","","    /**","     * Bind (or unbind) mousewheel listeners.","     *","     * @method _bindMousewheel","     * @param mousewheel {Object|boolean} If truthy, the method binds listeners for mousewheel support. If false, the method unbinds mousewheel listeners.","     * @private","     */","    _bindMousewheel: function (mousewheel) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'mousewheel' listeners","        bb.detach(MOUSEWHEEL + '|*');","","        // Only enable for vertical scrollviews","        if (mousewheel) {","            // Bound to document, because that's where mousewheel events fire off of.","            Y.one(DOCUMENT).on(MOUSEWHEEL, Y.bind(sv._mousewheel, sv));","        }","    },","","    /**","     * syncUI implementation.","     *","     * Update the scroll position, based on the current value of scrollX/scrollY.","     *","     * @method syncUI","     */","    syncUI: function () {","        var sv = this,","            scrollDims = sv._getScrollDims(),","            width = scrollDims.offsetWidth,","            height = scrollDims.offsetHeight,","            scrollWidth = scrollDims.scrollWidth,","            scrollHeight = scrollDims.scrollHeight;","","        // If the axis is undefined, auto-calculate it","        if (sv._cAxis === undefined) {","            // This should only ever be run once (for now).","            // In the future SV might post-loaded axis changes","            sv._set(AXIS, {","                x: (scrollWidth > width),","                y: (scrollHeight > height)","            });","        }","","        // get text direction on or inherited by scrollview node","        sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');","","        // Cache the disabled value","        sv._cDisabled = sv.get(DISABLED);","","        // Run this to set initial values","        sv._uiDimensionsChange();","","        // If we're out-of-bounds, snap back.","        if (sv._isOutOfBounds()) {","            sv._snapBack();","        }","    },","","    /**","     * Utility method to obtain widget dimensions","     * ","     * @method _getScrollDims","     * @returns {Object} The offsetWidth, offsetHeight, scrollWidth and scrollHeight as an array: [offsetWidth, offsetHeight, scrollWidth, scrollHeight]","     * @private","     */","    _getScrollDims: function () {","        var sv = this,","            cb = sv._cb,","            bb = sv._bb,","            TRANS = ScrollView._TRANSITION,","            dims;","","        // TODO: Is this OK? Just in case it's called 'during' a transition.","        if (NATIVE_TRANSITIONS) {","            cb.setStyle(TRANS.DURATION, ZERO);","            cb.setStyle(TRANS.PROPERTY, EMPTY);","        }","","        dims = {","            'offsetWidth': bb.get('offsetWidth'),","            'offsetHeight': bb.get('offsetHeight'),","            'scrollWidth': bb.get('scrollWidth'),","            'scrollHeight': bb.get('scrollHeight')","        };","","        return dims;","    },","","    /**","     * This method gets invoked whenever the height or width attributes change,","     * allowing us to determine which scrolling axes need to be enabled.","     *","     * @method _uiDimensionsChange","     * @protected","     */","    _uiDimensionsChange: function () {","        var sv = this,","            bb = sv._bb,","            scrollDims = sv._getScrollDims(),","            width = scrollDims.offsetWidth,","            height = scrollDims.offsetHeight,","            scrollWidth = scrollDims.scrollWidth,","            scrollHeight = scrollDims.scrollHeight,","            rtl = sv.rtl,","            svAxis = sv._cAxis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y;","","        if (svAxisX) {","            bb.addClass(CLASS_NAMES.horizontal);","        }","","        if (svAxisY) {","            bb.addClass(CLASS_NAMES.vertical);","        }","","        /**","         * Internal state, defines the minimum amount that the scrollview can be scrolled along the X axis","         *","         * @property _minScrollX","         * @type number","         * @protected","         */","        sv._minScrollX = (rtl) ? Math.min(0, -(scrollWidth - width)) : 0;","","        /**","         * Internal state, defines the maximum amount that the scrollview can be scrolled along the X axis","         *","         * @property _maxScrollX","         * @type number","         * @protected","         */","        sv._maxScrollX = (rtl) ? 0 : Math.max(0, scrollWidth - width);","","        /**","         * Internal state, defines the minimum amount that the scrollview can be scrolled along the Y axis","         *","         * @property _minScrollY","         * @type number","         * @protected","         */","        sv._minScrollY = 0;","","        /**","         * Internal state, defines the maximum amount that the scrollview can be scrolled along the Y axis","         *","         * @property _maxScrollY","         * @type number","         * @protected","         */","        sv._maxScrollY = Math.max(0, scrollHeight - height);","    },","","    /**","     * Scroll the element to a given xy coordinate","     *","     * @method scrollTo","     * @param x {Number} The x-position to scroll to. (null for no movement)","     * @param y {Number} The y-position to scroll to. (null for no movement)","     * @param {Number} [duration] ms of the scroll animation. (default is 0)","     * @param {String} [easing] An easing equation if duration is set. (defaults to ScrollView.EASING)","     * @param {String} [node] The node to move.","     */","    scrollTo: function (x, y, duration, easing, node) {","        // Check to see if widget is disabled","        if (this._cDisabled) {","            return;","        }","","        var sv = this,","            cb = sv._cb,","            TRANS = ScrollView._TRANSITION,","            callback = Y.bind(sv._onTransEnd, sv), // @Todo : cache this","            newX = 0,","            newY = 0,","            transition = {},","            transform;","","        // default the optional arguments","        duration = duration || 0;","        easing = easing || sv.get(EASING); // @TODO: Cache this","        node = node || cb;","","        if (x !== null) {","            sv.set(SCROLL_X, x, {src:UI});","            newX = -(x);","        }","","        if (y !== null) {","            sv.set(SCROLL_Y, y, {src:UI});","            newY = -(y);","        }","","        transform = sv._transform(newX, newY);","","        if (NATIVE_TRANSITIONS) {","            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.","            node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);","        }","","        // Move","        if (duration === 0) {","            if (NATIVE_TRANSITIONS) {","                node.setStyle('transform', transform);","            }","            else {","                // TODO: If both set, batch them in the same update","                // Update: Nope, setStyles() just loops through each property and applies it.","                if (x !== null) {","                    node.setStyle(LEFT, newX + PX);","                }","                if (y !== null) {","                    node.setStyle(TOP, newY + PX);","                }","            }","        }","","        // Animate","        else {","            transition.easing = easing;","            transition.duration = duration / 1000;","","            if (NATIVE_TRANSITIONS) {","                transition.transform = transform;","            }","            else {","                transition.left = newX + PX;","                transition.top = newY + PX;","            }","","            node.transition(transition, callback);","        }","    },","","    /**","     * Utility method, to create the translate transform string with the","     * x, y translation amounts provided.","     *","     * @method _transform","     * @param {Number} x Number of pixels to translate along the x axis","     * @param {Number} y Number of pixels to translate along the y axis","     * @private","     */","    _transform: function (x, y) {","        // TODO: Would we be better off using a Matrix for this?","        var prop = 'translate(' + x + 'px, ' + y + 'px)';","","        if (this._forceHWTransforms) {","            prop += ' translateZ(0)';","        }","","        return prop;","    },","","    /**","     * Content box transition callback","     *","     * @method _onTransEnd","     * @param {Event.Facade} e The event facade","     * @private","     */","    _onTransEnd: function (e) {","        var sv = this;","","        /**","         * Notification event fired at the end of a scroll transition","         *","         * @event scrollEnd","         * @param e {EventFacade} The default event facade.","         */","        sv.fire(EV_SCROLL_END);","    },","","    /**","     * gesturemovestart event handler","     *","     * @method _onGestureMoveStart","     * @param e {Event.Facade} The gesturemovestart event facade","     * @private","     */","    _onGestureMoveStart: function (e) {","","        if (this._cDisabled) {","            return false;","        }","","        var sv = this,","            bb = sv._bb,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            clientX = e.clientX,","            clientY = e.clientY;","","        if (sv._prevent.start) {","            e.preventDefault();","        }","","        // if a flick animation is in progress, cancel it","        if (sv._flickAnim) {","            // Cancel and delete sv._flickAnim","            sv._flickAnim.cancel();","            delete sv._flickAnim;","            sv._onTransEnd();","        }","","        // TODO: Review if neccesary (#2530129)","        e.stopPropagation();","","        // Reset lastScrolledAmt","        sv.lastScrolledAmt = 0;","","        // Stores data for this gesture cycle.  Cleaned up later","        sv._gesture = {","","            // Will hold the axis value","            axis: null,","","            // The current attribute values","            startX: currentX,","            startY: currentY,","","            // The X/Y coordinates where the event began","            startClientX: clientX,","            startClientY: clientY,","","            // The X/Y coordinates where the event will end","            endClientX: null,","            endClientY: null,","","            // The current delta of the event","            deltaX: null,","            deltaY: null,","","            // Will be populated for flicks","            flick: null,","","            // Create some listeners for the rest of the gesture cycle","            onGestureMove: bb.on(DRAG + '|' + GESTURE_MOVE, Y.bind(sv._onGestureMove, sv)),","            ","            // @TODO: Don't bind gestureMoveEnd if it's a Flick?","            onGestureMoveEnd: bb.on(DRAG + '|' + GESTURE_MOVE + END, Y.bind(sv._onGestureMoveEnd, sv))","        };","    },","","    /**","     * gesturemove event handler","     *","     * @method _onGestureMove","     * @param e {Event.Facade} The gesturemove event facade","     * @private","     */","    _onGestureMove: function (e) {","        var sv = this,","            gesture = sv._gesture,","            svAxis = sv._cAxis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            startX = gesture.startX,","            startY = gesture.startY,","            startClientX = gesture.startClientX,","            startClientY = gesture.startClientY,","            clientX = e.clientX,","            clientY = e.clientY;","","        if (sv._prevent.move) {","            e.preventDefault();","        }","","        gesture.deltaX = startClientX - clientX;","        gesture.deltaY = startClientY - clientY;","","        // Determine if this is a vertical or horizontal movement","        // @TODO: This is crude, but it works.  Investigate more intelligent ways to detect intent","        if (gesture.axis === null) {","            gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;","        }","","        // Move X or Y.  @TODO: Move both if dualaxis.        ","        if (gesture.axis === DIM_X && svAxisX) {","            sv.set(SCROLL_X, startX + gesture.deltaX);","        }","        else if (gesture.axis === DIM_Y && svAxisY) {","            sv.set(SCROLL_Y, startY + gesture.deltaY);","        }","    },","","    /**","     * gesturemoveend event handler","     *","     * @method _onGestureMoveEnd","     * @param e {Event.Facade} The gesturemoveend event facade","     * @private","     */","    _onGestureMoveEnd: function (e) {","        var sv = this,","            gesture = sv._gesture,","            flick = gesture.flick,","            clientX = e.clientX,","            clientY = e.clientY;","","        if (sv._prevent.end) {","            e.preventDefault();","        }","","        // Store the end X/Y coordinates","        gesture.endClientX = clientX;","        gesture.endClientY = clientY;","","        // Cleanup the event handlers","        gesture.onGestureMove.detach();","        gesture.onGestureMoveEnd.detach();","","        // If this wasn't a flick, wrap up the gesture cycle","        if (!flick) {","            // @TODO: Be more intelligent about this. Look at the Flick attribute to see ","            // if it is safe to assume _flick did or didn't fire.  ","            // Then, the order _flick and _onGestureMoveEnd fire doesn't matter?","","            // If there was movement (_onGestureMove fired)","            if (gesture.deltaX !== null && gesture.deltaY !== null) {","","                // If we're out-out-bounds, then snapback","                if (sv._isOutOfBounds()) {","                    sv._snapBack();","                }","","                // Inbounds","                else {","                    // Don't fire scrollEnd on the gesture axis is the same as paginator's","                    // Not totally confident this is ideal to access a plugin's properties from a host, @TODO revisit","                    if (sv.pages && !sv.pages.get(AXIS)[gesture.axis]) {","                        sv._onTransEnd();","                    }","                }","            }","        }","    },","","    /**","     * Execute a flick at the end of a scroll action","     *","     * @method _flick","     * @param e {Event.Facade} The Flick event facade","     * @private","     */","    _flick: function (e) {","        if (this._cDisabled) {","            return false;","        }","","        var sv = this,","            gesture = sv._gesture,","            svAxis = sv._cAxis,","            flick = e.flick,","            flickAxis = flick.axis,","            flickVelocity = flick.velocity,","            axisAttr = flickAxis === DIM_X ? SCROLL_X : SCROLL_Y,","            startPosition = sv.get(axisAttr);","","        gesture.flick = flick;","        // Prevent unneccesary firing of _flickFrame if we can't scroll on the flick axis","        if (svAxis[flickAxis]) {","            sv._flickFrame(flickVelocity, flickAxis, startPosition);","        }","    },","","    /**","     * Execute a single frame in the flick animation","     *","     * @method _flickFrame","     * @param velocity {Number} The velocity of this animated frame","     * @param flickAxis {String} The axis on which to animate","     * @param startPosition {Number} The starting X/Y point to flick from","     * @protected","     */","    _flickFrame: function (velocity, flickAxis, startPosition) {","","        var sv = this,","            axisAttr = flickAxis === DIM_X ? SCROLL_X : SCROLL_Y,","","            // Localize cached values","            bounce = sv._cBounce,","            bounceRange = sv._cBounceRange,","            deceleration = sv._cDeceleration,","            frameDuration = sv._cFrameDuration,","","            // Calculate","            velocity = velocity * deceleration,","            newPosition = startPosition - (frameDuration * velocity),","","            // Some convinience conditions","            min = flickAxis === DIM_X ? sv._minScrollX : sv._minScrollY,","            max = flickAxis === DIM_X ? sv._maxScrollX : sv._maxScrollY,","            belowMin       = (newPosition < min),","            belowMax       = (newPosition < max),","            aboveMin       = (newPosition > min),","            aboveMax       = (newPosition > max),","            belowMinRange  = (newPosition < (min - bounceRange)),","            belowMaxRange  = (newPosition < (max + bounceRange)),","            withinMinRange = (belowMin && (newPosition > (min - bounceRange))),","            withinMaxRange = (aboveMax && (newPosition < (max + bounceRange))),","            aboveMinRange  = (newPosition > (min - bounceRange)),","            aboveMaxRange  = (newPosition > (max + bounceRange)),","            tooSlow;","","        // If we're within the range but outside min/max, dampen the velocity","        if (withinMinRange || withinMaxRange) {","            velocity *= bounce;","        }","","        // Is the velocity too slow to bother?","        tooslow = (Math.abs(velocity).toFixed(4) < 0.015);","","        // If the velocity is too slow or we're outside the range","        if (tooslow || belowMinRange || aboveMaxRange) {","            // Cancel and delete sv._flickAnim","            sv._flickAnim && sv._flickAnim.cancel();","            delete sv._flickAnim;","","            // If we're inside the scroll area, just end","            if (aboveMin && belowMax) {","                sv._onTransEnd();","            }","","            // We're outside the scroll area, so we need to snap back","            else {","                sv._snapBack();","            }","        }","","        // Otherwise, animate to the next frame","        else {","            // @TODO: maybe use requestAnimationFrame instead","            sv._flickAnim = Y.later(frameDuration, sv, '_flickFrame', [velocity, flickAxis, newPosition]);","            sv.set(axisAttr, newPosition);","        }","    },","","    /**","     * Handle mousewheel events on the widget","     *","     * @method _mousewheel","     * @param e {Event.Facade} The mousewheel event facade","     * @private","     */","    _mousewheel: function (e) {","        var sv = this,","            scrollY = sv.get(SCROLL_Y),","            bb = sv._bb,","            scrollOffset = 10, // 10px","            isForward = (e.wheelDelta > 0),","            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);","","        scrollToY = _constrain(scrollToY, sv._minScrollY, sv._maxScrollY);","","        if (bb.contains(e.target)) {","        ","            // Reset lastScrolledAmt","            sv.lastScrolledAmt = 0;","","            // Jump to the new offset","            sv.set(SCROLL_Y, scrollToY);","","            // if we have scrollbars plugin, update & set the flash timer on the scrollbar","            // @TODO: This probably shouldn't be in this module","            if (sv.scrollbars) {","                // @TODO: The scrollbars should handle this themselves","                sv.scrollbars._update();","                sv.scrollbars.flash();","                // or just this","                // sv.scrollbars._hostDimensionsChange();","            }","","            // Fire the 'scrollEnd' event","            sv._onTransEnd();","","            // prevent browser default behavior on mouse scroll","            e.preventDefault();","        }","    },","","    /**","     * Checks to see the current scrollX/scrollY position beyond the min/max boundary","     *","     * @method _isOutOfBounds","     * @param x {Number} [optional] The X position to check","     * @param y {Number} [optional] The Y position to check","     * @returns {boolen} Whether the current X/Y position is out of bounds (true) or not (false)","     * @private","     */","    _isOutOfBounds: function (x, y) {","        var sv = this,","            svAxis = sv._cAxis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            currentX = x || sv.get(SCROLL_X),","            currentY = y || sv.get(SCROLL_Y),","            minX = sv._minScrollX,","            minY = sv._minScrollY,","            maxX = sv._maxScrollX,","            maxY = sv._maxScrollY;","","        return (svAxisX && (currentX < minX || currentX > maxX)) || (svAxisY && (currentY < minY || currentY > maxY));","    },","","    /**","     * Bounces back","     * @TODO: Should be more generalized and support both X and Y detection","     *","     * @method _snapBack","     * @private","     */","    _snapBack: function () {","        var sv = this,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            minX = sv._minScrollX,","            minY = sv._minScrollY,","            maxX = sv._maxScrollX,","            maxY = sv._maxScrollY,","            newY = _constrain(currentY, minY, maxY),","            newX = _constrain(currentX, minX, maxX),","            duration = sv.get(SNAP_DURATION),","            easing = sv.get(SNAP_EASING);","","        if (newX !== currentX) {","            sv.set(SCROLL_X, newX, {duration:duration, easing:easing});","        }","        else if (newY !== currentY) {","            sv.set(SCROLL_Y, newY, {duration:duration, easing:easing});","        }","        else {","            // It shouldn't ever get here, but in case it does, fire scrollEnd","            sv._onTransEnd();","        }","    },","","    /**","     * After listener for changes to the scrollX or scrollY attribute","     *","     * @method _afterScrollChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterScrollChange: function (e) {","","        if (e.src === ScrollView.UI_SRC) {","            return false;","        }","","        var sv = this,","            duration = e.duration,","            easing = e.easing,","            val = e.newVal,","            scrollToArgs = [];","","        // Set the scrolled value","        sv.lastScrolledAmt = sv.lastScrolledAmt + (e.newVal - e.prevVal);","","        // Generate the array of args to pass to scrollTo()","        if (e.attrName === SCROLL_X) {","            scrollToArgs.push(val);","            scrollToArgs.push(sv.get(SCROLL_Y));","        }","        else {","            scrollToArgs.push(sv.get(SCROLL_X));","            scrollToArgs.push(val);","        }","","        scrollToArgs.push(duration);","        scrollToArgs.push(easing);","","        sv.scrollTo.apply(sv, scrollToArgs);","    },","","    /**","     * After listener for changes to the flick attribute","     *","     * @method _afterFlickChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterFlickChange: function (e) {","        this._bindFlick(e.newVal);","    },","","    /**","     * After listener for changes to the disabled attribute","     *","     * @method _afterDisabledChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDisabledChange: function (e) {","        // Cache for performance - we check during move","        this._cDisabled = e.newVal;","    },","","    /**","     * After listener for the axis attribute","     *","     * @method _afterAxisChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterAxisChange: function (e) {","        this._cAxis = e.newVal;","    },","","    /**","     * After listener for changes to the drag attribute","     *","     * @method _afterDragChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDragChange: function (e) {","        this._bindDrag(e.newVal);","    },","","    /**","     * After listener for changes to the drag attribute","     *","     * @method _afterDragChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterMousewheelChange: function (e) {","        this._bindMousewheel(e.newVal);","    },","","    /**","     * After listener for the height or width attribute","     *","     * @method _afterDimChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDimChange: function () {","        this._uiDimensionsChange();","    },","","    /**","     * After listener for scrollEnd, for cleanup","     *","     * @method _afterScrollEnd","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterScrollEnd: function (e) {","        var sv = this;","","        // Cancel the flick (if it exists)","        // @TODO: Move to sv._cancelFlick()","        sv._flickAnim && sv._flickAnim.cancel();","","        // Also delete it, otherwise _onGestureMoveStart will think we're still flicking","        delete sv._flickAnim;","","        // If for some reason we're OOB, snapback","        if (sv._isOutOfBounds()) {","            sv._snapBack();","        }","","        // Ideally this should be removed, but doing so causing some JS errors with fast swiping ","        // because _gesture is being deleted after the previous one has been overwritten","        // delete sv._gesture; // TODO: Move to sv.prevGesture?","    },","","    /**","     * Setter for 'axis' attribute","     *","     * @method _axisSetter","     * @param val {Mixed} A string ('x', 'y', 'xy') to specify which axis/axes to allow scrolling on","     * @param name {String} The attribute name","     * @return {Object} An object to specify scrollability on the x & y axes","     * ","     * @protected","     */","    _axisSetter: function (val, name) {","","        // Turn a string into an axis object","        if (Y.Lang.isString(val)) {","            return {","                x: val.match(/x/i) ? true : false,","                y: val.match(/y/i) ? true : false","            };","        }","    },","    ","    /**","    * The scrollX, scrollY setter implementation","    *","    * @method _setScroll","    * @private","    * @param {Number} val","    * @param {String} dim","    *","    * @return {Number} The value","    */","    _setScroll : function(val, dim) {","","        // Just ensure the widget is not disabled","        if (this._cDisabled) {","            val = Y.Attribute.INVALID_VALUE;","        } ","","        return val;","    },","","    /**","    * Setter for the scrollX attribute","    *","    * @method _setScrollX","    * @param val {Number} The new scrollX value","    * @return {Number} The normalized value","    * @protected","    */","    _setScrollX: function(val) {","        return this._setScroll(val, DIM_X);","    },","","    /**","    * Setter for the scrollY ATTR","    *","    * @method _setScrollY","    * @param val {Number} The new scrollY value","    * @return {Number} The normalized value","    * @protected","    */","    _setScrollY: function(val) {","        return this._setScroll(val, DIM_Y);","    }","","    // End prototype properties","","}, {","","    // Static properties","","    /**","     * The identity of the widget.","     *","     * @property NAME","     * @type String","     * @default 'scrollview'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'scrollview',","","    /**","     * Static property used to define the default attribute configuration of","     * the Widget.","     *","     * @property ATTRS","     * @type {Object}","     * @protected","     * @static","     */","    ATTRS: {","","        /**","         * Specifies ability to scroll on x, y, or x and y axis/axes.","         *","         * @attribute axis","         * @type String","         */","        axis: {","            setter: '_axisSetter',","            writeOnce: 'initOnly'","        },","","        /**","         * The scroll position in the x-axis","         *","         * @attribute scrollX","         * @type Number","         * @default 0","         */","        scrollX: {","            value: 0,","            setter: '_setScrollX'","        },","","        /**","         * The scroll position in the y-axis","         *","         * @attribute scrollY","         * @type Number","         * @default 0","         */","        scrollY: {","            value: 0,","            setter: '_setScrollY'","        },","","        /**","         * Drag coefficent for inertial scrolling. The closer to 1 this","         * value is, the less friction during scrolling.","         *","         * @attribute deceleration","         * @default 0.93","         */","        deceleration: {","            value: 0.93","        },","","        /**","         * Drag coefficient for intertial scrolling at the upper","         * and lower boundaries of the scrollview. Set to 0 to","         * disable \"rubber-banding\".","         *","         * @attribute bounce","         * @type Number","         * @default 0.1","         */","        bounce: {","            value: .1","        },","","        /**","         * The minimum distance and/or velocity which define a flick. Can be set to false,","         * to disable flick support (note: drag support is enabled/disabled separately)","         *","         * @attribute flick","         * @type Object","         * @default Object with properties minDistance = 10, minVelocity = 0.3.","         */","        flick: {","            value: {","                minDistance: 10,","                minVelocity: 0.3","            }","        },","","        /**","         * Enable/Disable dragging the ScrollView content (note: flick support is enabled/disabled separately)","         * @attribute drag","         * @type boolean","         * @default true","         */","        drag: {","            value: true","        },","","        /**","         * The default duration to use when animating the bounce snap back.","         *","         * @attribute snapDuration","         * @type Number","         * @default 400","         */","        snapDuration: {","            value: 400","        },","","        /**","         * The default easing to use when animating the bounce snap back.","         *","         * @attribute snapEasing","         * @type String","         * @default 'ease-out'","         */","        snapEasing: {","            value: 'ease-out'","        },","","        /**","         * The default easing used when animating the flick","         *","         * @attribute easing","         * @type String","         * @default 'cubic-bezier(0, 0.1, 0, 1.0)'","         */","        easing: {","            value: 'cubic-bezier(0, 0.1, 0, 1.0)'","        },","","        /**","         * The interval (ms) used when animating the flick for JS-timer animations","         *","         * @attribute frameDuration","         * @type Number","         * @default 15","         */","        frameDuration: {","            value: 15","        },","","        /**","         * The default bounce distance in pixels","         *","         * @attribute bounceRange","         * @type Number","         * @default 150","         */","        bounceRange: {","            value: 150","        }","    },","","    /**","     * List of class names used in the scrollview's DOM","     *","     * @property CLASS_NAMES","     * @type Object","     * @static","     */","    CLASS_NAMES: CLASS_NAMES,","","    /**","     * Flag used to source property changes initiated from the DOM","     *","     * @property UI_SRC","     * @type String","     * @static","     * @default 'ui'","     */","    UI_SRC: UI,","","    /**","     * Object map of style property names used to set transition properties.","     * Defaults to the vendor prefix established by the Transition module.","     * The configured property names are `_TRANSITION.DURATION` (e.g. \"WebkitTransitionDuration\") and","     * `_TRANSITION.PROPERTY (e.g. \"WebkitTransitionProperty\").","     *","     * @property _TRANSITION","     * @private","     */","    _TRANSITION: {","        DURATION: Y.Transition._VENDOR_PREFIX + 'TransitionDuration',","        PROPERTY: Y.Transition._VENDOR_PREFIX + 'TransitionProperty'","    },","","    /**","     * Enable/Disable scrolling content via mousewheel","     * @property mousewheel","     * @type boolean","     * @static","     * @default true","     */","    MOUSEWHEEL: true,","","    /**","     * The default bounce distance in pixels","     *","     * @property BOUNCE_RANGE","     * @type Number","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    BOUNCE_RANGE: false,","","    /**","     * The interval (ms) used when animating the flick","     *","     * @property FRAME_STEP","     * @type Number","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    FRAME_STEP: false,","","    /**","     * The default easing used when animating the flick","     *","     * @property EASING","     * @type String","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    EASING: false,","","    /**","     * The default easing to use when animating the bounce snap back.","     *","     * @property SNAP_EASING","     * @type String","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    SNAP_EASING: false,","","    /**","     * The default duration to use when animating the bounce snap back.","     *","     * @property SNAP_DURATION","     * @type Number","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    SNAP_DURATION: false","","    // End static properties","","});","","}, '@VERSION@', {\"requires\": [\"widget\", \"event-gestures\", \"event-mousewheel\", \"transition\"], \"skinnable\": true});"];
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].lines = {"1":0,"9":0,"51":0,"63":0,"64":0,"67":0,"133":0,"136":0,"137":0,"140":0,"141":0,"142":0,"143":0,"144":0,"154":0,"157":0,"158":0,"159":0,"162":0,"165":0,"166":0,"171":0,"181":0,"186":0,"187":0,"190":0,"191":0,"194":0,"195":0,"198":0,"199":0,"202":0,"203":0,"207":0,"228":0,"232":0,"234":0,"235":0,"247":0,"251":0,"253":0,"254":0,"257":0,"269":0,"273":0,"276":0,"278":0,"290":0,"298":0,"301":0,"308":0,"311":0,"314":0,"317":0,"318":0,"330":0,"337":0,"338":0,"339":0,"342":0,"349":0,"360":0,"372":0,"373":0,"376":0,"377":0,"387":0,"396":0,"405":0,"414":0,"429":0,"430":0,"433":0,"443":0,"444":0,"445":0,"447":0,"448":0,"449":0,"452":0,"453":0,"454":0,"457":0,"459":0,"461":0,"465":0,"466":0,"467":0,"472":0,"473":0,"475":0,"476":0,"483":0,"484":0,"486":0,"487":0,"490":0,"491":0,"494":0,"509":0,"511":0,"512":0,"515":0,"526":0,"534":0,"546":0,"547":0,"550":0,"557":0,"558":0,"562":0,"564":0,"565":0,"566":0,"570":0,"573":0,"576":0,"616":0,"628":0,"629":0,"632":0,"633":0,"637":0,"638":0,"642":0,"643":0,"645":0,"646":0,"658":0,"664":0,"665":0,"669":0,"670":0,"673":0,"674":0,"677":0,"683":0,"686":0,"687":0,"694":0,"695":0,"710":0,"711":0,"714":0,"723":0,"725":0,"726":0,"741":0,"770":0,"771":0,"775":0,"778":0,"780":0,"781":0,"784":0,"785":0,"790":0,"797":0,"798":0,"810":0,"817":0,"819":0,"822":0,"825":0,"829":0,"831":0,"832":0,"838":0,"841":0,"855":0,"866":0,"877":0,"889":0,"890":0,"892":0,"893":0,"897":0,"910":0,"911":0,"914":0,"921":0,"924":0,"925":0,"926":0,"929":0,"930":0,"933":0,"934":0,"936":0,"947":0,"959":0,"970":0,"981":0,"992":0,"1003":0,"1014":0,"1018":0,"1021":0,"1024":0,"1025":0,"1046":0,"1047":0,"1067":0,"1068":0,"1071":0,"1083":0,"1095":0};
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].functions = {"_constrain:50":0,"ScrollView:63":0,"initializer:132":0,"bindUI:153":0,"_bindAttrs:180":0,"_bindDrag:227":0,"_bindFlick:246":0,"_bindMousewheel:268":0,"syncUI:289":0,"_getScrollDims:329":0,"_uiDimensionsChange:359":0,"scrollTo:427":0,"_transform:507":0,"_onTransEnd:525":0,"_onGestureMoveStart:544":0,"_onGestureMove:615":0,"_onGestureMoveEnd:657":0,"_flick:709":0,"_flickFrame:739":0,"_mousewheel:809":0,"_isOutOfBounds:854":0,"_snapBack:876":0,"_afterScrollChange:908":0,"_afterFlickChange:946":0,"_afterDisabledChange:957":0,"_afterAxisChange:969":0,"_afterDragChange:980":0,"_afterMousewheelChange:991":0,"_afterDimChange:1002":0,"_afterScrollEnd:1013":0,"_axisSetter:1043":0,"_setScroll:1064":0,"_setScrollX:1082":0,"_setScrollY:1094":0,"(anonymous 1):1":0};
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].coveredLines = 207;
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].coveredFunctions = 35;
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1);
YUI.add('scrollview-base', function (Y, NAME) {

/**
 * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators
 *
 * @module scrollview
 * @submodule scrollview-base
 */
_yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 9);
var getClassName = Y.ClassNameManager.getClassName,
    DOCUMENT = Y.config.doc,
    WINDOW = Y.config.win,
    IE = Y.UA.ie,
    NATIVE_TRANSITIONS = Y.Transition.useNative,
    SCROLLVIEW = 'scrollview',
    CLASS_NAMES = {
        vertical: getClassName(SCROLLVIEW, 'vert'),
        horizontal: getClassName(SCROLLVIEW, 'horiz')
    },
    EV_SCROLL_END = 'scrollEnd',
    FLICK = 'flick',
    DRAG = 'drag',
    MOUSEWHEEL = 'mousewheel',
    UI = 'ui',
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFT = 'left',
    PX = 'px',
    AXIS = 'axis',
    SCROLL_Y = 'scrollY',
    SCROLL_X = 'scrollX',
    BOUNCE = 'bounce',
    DISABLED = 'disabled',
    DECELERATION = 'deceleration',
    DIM_X = 'x',
    DIM_Y = 'y',
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX = 'contentBox',
    GESTURE_MOVE = 'gesturemove',
    START = 'start',
    END = 'end',
    EMPTY = '',
    ZERO = '0s',
    SNAP_DURATION = 'snapDuration',
    SNAP_EASING = 'snapEasing', 
    EASING = 'easing', 
    FRAME_DURATION = 'frameDuration', 
    BOUNCE_RANGE = 'bounceRange',
    
    _constrain = function (val, min, max) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_constrain", 50);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 51);
return Math.min(Math.max(val, min), max);
    };

/**
 * ScrollView provides a scrollable widget, supporting flick gestures,
 * across both touch and mouse based devices.
 *
 * @class ScrollView
 * @param config {Object} Object literal with initial attribute values
 * @extends Widget
 * @constructor
 */
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 63);
function ScrollView() {
    _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "ScrollView", 63);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 64);
ScrollView.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/scrollview-base/scrollview-base.js", 67);
Y.ScrollView = Y.extend(ScrollView, Y.Widget, {

    // *** Y.ScrollView prototype

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
     *    start: false,
     *    move: true,
     *    end: false
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
    _prevent: {
        start: false,
        move: true,
        end: false
    },

    /**
     * Contains the distance (postive or negative) in pixels by which 
     * the scrollview was last scrolled. This is useful when setting up 
     * click listeners on the scrollview content, which on mouse based 
     * devices are always fired, even after a drag/flick. 
     * 
     * <p>Touch based devices don't currently fire a click event, 
     * if the finger has been moved (beyond a threshold) so this 
     * check isn't required, if working in a purely touch based environment</p>
     * 
     * @property lastScrolledAmt
     * @type Number
     * @public
     */
    lastScrolledAmt: null,

    /**
     * Designated initializer
     *
     * @method initializer
     * @param {config} Configuration object for the plugin
     */
    initializer: function (config) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "initializer", 132);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 133);
var sv = this;

        // Cache these values, since they aren't going to change.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 136);
sv._bb = sv.get(BOUNDING_BOX);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 137);
sv._cb = sv.get(CONTENT_BOX);

        // Cache some attributes
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 140);
sv._cAxis = sv.get(AXIS);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 141);
sv._cBounce = sv.get(BOUNCE);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 142);
sv._cBounceRange = sv.get(BOUNCE_RANGE);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 143);
sv._cDeceleration = sv.get(DECELERATION);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 144);
sv._cFrameDuration = sv.get(FRAME_DURATION);
    },

    /**
     * bindUI implementation
     *
     * Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "bindUI", 153);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 154);
var sv = this;

        // Bind interaction listers
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 157);
sv._bindFlick(sv.get(FLICK));
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 158);
sv._bindDrag(sv.get(DRAG));
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 159);
sv._bindMousewheel(ScrollView.MOUSEWHEEL);
        
        // Bind change events
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 162);
sv._bindAttrs();

        // IE SELECT HACK. See if we can do this non-natively and in the gesture for a future release.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 165);
if (IE) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 166);
sv._fixIESelect(sv._bb, sv._cb);
        }

        // Recalculate dimension properties
        // TODO: This should be throttled.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 171);
Y.one(WINDOW).after('resize', sv._afterDimChange, sv);
    },

    /**
     * 
     *
     * @method _bindAttrs
     * @private
     */
    _bindAttrs: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindAttrs", 180);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 181);
var sv = this,
            scrollChangeHandler = sv._afterScrollChange,
            dimChangeHandler = sv._afterDimChange;

        // Set any deprecated static properties
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 186);
if (ScrollView.SNAP_DURATION) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 187);
sv.set(SNAP_DURATION, ScrollView.SNAP_DURATION);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 190);
if (ScrollView.SNAP_EASING) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 191);
sv.set(SNAP_EASING, ScrollView.SNAP_EASING);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 194);
if (ScrollView.EASING) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 195);
sv.set(EASING, ScrollView.EASING);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 198);
if (ScrollView.FRAME_STEP) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 199);
sv.set(FRAME_DURATION, ScrollView.FRAME_STEP);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 202);
if (ScrollView.BOUNCE_RANGE) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 203);
sv.set(BOUNCE_RANGE, ScrollView.BOUNCE_RANGE);
        }

        // Bind any change event listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 207);
sv.after({
            'scrollEnd': sv._afterScrollEnd,
            'disabledChange': sv._afterDisabledChange,
            'flickChange': sv._afterFlickChange,
            'dragChange': sv._afterDragChange,
            'axisChange': sv._afterAxisChange,
            'scrollYChange': scrollChangeHandler,
            'scrollXChange': scrollChangeHandler,
            'heightChange': dimChangeHandler,
            'widthChange': dimChangeHandler
        });
    },

    /**
     * Bind (or unbind) gesture move listeners required for drag support
     *
     * @method _bindDrag
     * @param drag {boolean} If true, the method binds listener to enable drag (gesturemovestart). If false, the method unbinds gesturemove listeners for drag support.
     * @private
     */
    _bindDrag: function (drag) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindDrag", 227);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 228);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'drag' listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 232);
bb.detach(DRAG + '|*');

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 234);
if (drag) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 235);
bb.on(DRAG + '|' + GESTURE_MOVE + START, Y.bind(sv._onGestureMoveStart, sv));
        }
    },

    /**
     * Bind (or unbind) flick listeners.
     *
     * @method _bindFlick
     * @param flick {Object|boolean} If truthy, the method binds listeners for flick support. If false, the method unbinds flick listeners.
     * @private
     */
    _bindFlick: function (flick) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindFlick", 246);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 247);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'flick' listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 251);
bb.detach(FLICK + '|*');

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 253);
if (flick) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 254);
bb.on(FLICK + '|' + FLICK, Y.bind(sv._flick, sv), flick);

            // Rebind Drag, becuase _onGestureMoveEnd always has to fire -after- _flick
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 257);
sv._bindDrag(sv.get(DRAG));
        }
    },

    /**
     * Bind (or unbind) mousewheel listeners.
     *
     * @method _bindMousewheel
     * @param mousewheel {Object|boolean} If truthy, the method binds listeners for mousewheel support. If false, the method unbinds mousewheel listeners.
     * @private
     */
    _bindMousewheel: function (mousewheel) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindMousewheel", 268);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 269);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'mousewheel' listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 273);
bb.detach(MOUSEWHEEL + '|*');

        // Only enable for vertical scrollviews
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 276);
if (mousewheel) {
            // Bound to document, because that's where mousewheel events fire off of.
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 278);
Y.one(DOCUMENT).on(MOUSEWHEEL, Y.bind(sv._mousewheel, sv));
        }
    },

    /**
     * syncUI implementation.
     *
     * Update the scroll position, based on the current value of scrollX/scrollY.
     *
     * @method syncUI
     */
    syncUI: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "syncUI", 289);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 290);
var sv = this,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight;

        // If the axis is undefined, auto-calculate it
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 298);
if (sv._cAxis === undefined) {
            // This should only ever be run once (for now).
            // In the future SV might post-loaded axis changes
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 301);
sv._set(AXIS, {
                x: (scrollWidth > width),
                y: (scrollHeight > height)
            });
        }

        // get text direction on or inherited by scrollview node
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 308);
sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');

        // Cache the disabled value
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 311);
sv._cDisabled = sv.get(DISABLED);

        // Run this to set initial values
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 314);
sv._uiDimensionsChange();

        // If we're out-of-bounds, snap back.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 317);
if (sv._isOutOfBounds()) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 318);
sv._snapBack();
        }
    },

    /**
     * Utility method to obtain widget dimensions
     * 
     * @method _getScrollDims
     * @returns {Object} The offsetWidth, offsetHeight, scrollWidth and scrollHeight as an array: [offsetWidth, offsetHeight, scrollWidth, scrollHeight]
     * @private
     */
    _getScrollDims: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_getScrollDims", 329);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 330);
var sv = this,
            cb = sv._cb,
            bb = sv._bb,
            TRANS = ScrollView._TRANSITION,
            dims;

        // TODO: Is this OK? Just in case it's called 'during' a transition.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 337);
if (NATIVE_TRANSITIONS) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 338);
cb.setStyle(TRANS.DURATION, ZERO);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 339);
cb.setStyle(TRANS.PROPERTY, EMPTY);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 342);
dims = {
            'offsetWidth': bb.get('offsetWidth'),
            'offsetHeight': bb.get('offsetHeight'),
            'scrollWidth': bb.get('scrollWidth'),
            'scrollHeight': bb.get('scrollHeight')
        };

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 349);
return dims;
    },

    /**
     * This method gets invoked whenever the height or width attributes change,
     * allowing us to determine which scrolling axes need to be enabled.
     *
     * @method _uiDimensionsChange
     * @protected
     */
    _uiDimensionsChange: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_uiDimensionsChange", 359);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 360);
var sv = this,
            bb = sv._bb,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight,
            rtl = sv.rtl,
            svAxis = sv._cAxis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 372);
if (svAxisX) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 373);
bb.addClass(CLASS_NAMES.horizontal);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 376);
if (svAxisY) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 377);
bb.addClass(CLASS_NAMES.vertical);
        }

        /**
         * Internal state, defines the minimum amount that the scrollview can be scrolled along the X axis
         *
         * @property _minScrollX
         * @type number
         * @protected
         */
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 387);
sv._minScrollX = (rtl) ? Math.min(0, -(scrollWidth - width)) : 0;

        /**
         * Internal state, defines the maximum amount that the scrollview can be scrolled along the X axis
         *
         * @property _maxScrollX
         * @type number
         * @protected
         */
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 396);
sv._maxScrollX = (rtl) ? 0 : Math.max(0, scrollWidth - width);

        /**
         * Internal state, defines the minimum amount that the scrollview can be scrolled along the Y axis
         *
         * @property _minScrollY
         * @type number
         * @protected
         */
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 405);
sv._minScrollY = 0;

        /**
         * Internal state, defines the maximum amount that the scrollview can be scrolled along the Y axis
         *
         * @property _maxScrollY
         * @type number
         * @protected
         */
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 414);
sv._maxScrollY = Math.max(0, scrollHeight - height);
    },

    /**
     * Scroll the element to a given xy coordinate
     *
     * @method scrollTo
     * @param x {Number} The x-position to scroll to. (null for no movement)
     * @param y {Number} The y-position to scroll to. (null for no movement)
     * @param {Number} [duration] ms of the scroll animation. (default is 0)
     * @param {String} [easing] An easing equation if duration is set. (defaults to ScrollView.EASING)
     * @param {String} [node] The node to move.
     */
    scrollTo: function (x, y, duration, easing, node) {
        // Check to see if widget is disabled
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "scrollTo", 427);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 429);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 430);
return;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 433);
var sv = this,
            cb = sv._cb,
            TRANS = ScrollView._TRANSITION,
            callback = Y.bind(sv._onTransEnd, sv), // @Todo : cache this
            newX = 0,
            newY = 0,
            transition = {},
            transform;

        // default the optional arguments
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 443);
duration = duration || 0;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 444);
easing = easing || sv.get(EASING); // @TODO: Cache this
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 445);
node = node || cb;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 447);
if (x !== null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 448);
sv.set(SCROLL_X, x, {src:UI});
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 449);
newX = -(x);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 452);
if (y !== null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 453);
sv.set(SCROLL_Y, y, {src:UI});
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 454);
newY = -(y);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 457);
transform = sv._transform(newX, newY);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 459);
if (NATIVE_TRANSITIONS) {
            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 461);
node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);
        }

        // Move
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 465);
if (duration === 0) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 466);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 467);
node.setStyle('transform', transform);
            }
            else {
                // TODO: If both set, batch them in the same update
                // Update: Nope, setStyles() just loops through each property and applies it.
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 472);
if (x !== null) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 473);
node.setStyle(LEFT, newX + PX);
                }
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 475);
if (y !== null) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 476);
node.setStyle(TOP, newY + PX);
                }
            }
        }

        // Animate
        else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 483);
transition.easing = easing;
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 484);
transition.duration = duration / 1000;

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 486);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 487);
transition.transform = transform;
            }
            else {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 490);
transition.left = newX + PX;
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 491);
transition.top = newY + PX;
            }

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 494);
node.transition(transition, callback);
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
    _transform: function (x, y) {
        // TODO: Would we be better off using a Matrix for this?
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_transform", 507);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 509);
var prop = 'translate(' + x + 'px, ' + y + 'px)';

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 511);
if (this._forceHWTransforms) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 512);
prop += ' translateZ(0)';
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 515);
return prop;
    },

    /**
     * Content box transition callback
     *
     * @method _onTransEnd
     * @param {Event.Facade} e The event facade
     * @private
     */
    _onTransEnd: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onTransEnd", 525);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 526);
var sv = this;

        /**
         * Notification event fired at the end of a scroll transition
         *
         * @event scrollEnd
         * @param e {EventFacade} The default event facade.
         */
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 534);
sv.fire(EV_SCROLL_END);
    },

    /**
     * gesturemovestart event handler
     *
     * @method _onGestureMoveStart
     * @param e {Event.Facade} The gesturemovestart event facade
     * @private
     */
    _onGestureMoveStart: function (e) {

        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMoveStart", 544);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 546);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 547);
return false;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 550);
var sv = this,
            bb = sv._bb,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            clientX = e.clientX,
            clientY = e.clientY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 557);
if (sv._prevent.start) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 558);
e.preventDefault();
        }

        // if a flick animation is in progress, cancel it
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 562);
if (sv._flickAnim) {
            // Cancel and delete sv._flickAnim
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 564);
sv._flickAnim.cancel();
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 565);
delete sv._flickAnim;
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 566);
sv._onTransEnd();
        }

        // TODO: Review if neccesary (#2530129)
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 570);
e.stopPropagation();

        // Reset lastScrolledAmt
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 573);
sv.lastScrolledAmt = 0;

        // Stores data for this gesture cycle.  Cleaned up later
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 576);
sv._gesture = {

            // Will hold the axis value
            axis: null,

            // The current attribute values
            startX: currentX,
            startY: currentY,

            // The X/Y coordinates where the event began
            startClientX: clientX,
            startClientY: clientY,

            // The X/Y coordinates where the event will end
            endClientX: null,
            endClientY: null,

            // The current delta of the event
            deltaX: null,
            deltaY: null,

            // Will be populated for flicks
            flick: null,

            // Create some listeners for the rest of the gesture cycle
            onGestureMove: bb.on(DRAG + '|' + GESTURE_MOVE, Y.bind(sv._onGestureMove, sv)),
            
            // @TODO: Don't bind gestureMoveEnd if it's a Flick?
            onGestureMoveEnd: bb.on(DRAG + '|' + GESTURE_MOVE + END, Y.bind(sv._onGestureMoveEnd, sv))
        };
    },

    /**
     * gesturemove event handler
     *
     * @method _onGestureMove
     * @param e {Event.Facade} The gesturemove event facade
     * @private
     */
    _onGestureMove: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMove", 615);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 616);
var sv = this,
            gesture = sv._gesture,
            svAxis = sv._cAxis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            startX = gesture.startX,
            startY = gesture.startY,
            startClientX = gesture.startClientX,
            startClientY = gesture.startClientY,
            clientX = e.clientX,
            clientY = e.clientY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 628);
if (sv._prevent.move) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 629);
e.preventDefault();
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 632);
gesture.deltaX = startClientX - clientX;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 633);
gesture.deltaY = startClientY - clientY;

        // Determine if this is a vertical or horizontal movement
        // @TODO: This is crude, but it works.  Investigate more intelligent ways to detect intent
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 637);
if (gesture.axis === null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 638);
gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;
        }

        // Move X or Y.  @TODO: Move both if dualaxis.        
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 642);
if (gesture.axis === DIM_X && svAxisX) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 643);
sv.set(SCROLL_X, startX + gesture.deltaX);
        }
        else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 645);
if (gesture.axis === DIM_Y && svAxisY) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 646);
sv.set(SCROLL_Y, startY + gesture.deltaY);
        }}
    },

    /**
     * gesturemoveend event handler
     *
     * @method _onGestureMoveEnd
     * @param e {Event.Facade} The gesturemoveend event facade
     * @private
     */
    _onGestureMoveEnd: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMoveEnd", 657);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 658);
var sv = this,
            gesture = sv._gesture,
            flick = gesture.flick,
            clientX = e.clientX,
            clientY = e.clientY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 664);
if (sv._prevent.end) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 665);
e.preventDefault();
        }

        // Store the end X/Y coordinates
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 669);
gesture.endClientX = clientX;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 670);
gesture.endClientY = clientY;

        // Cleanup the event handlers
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 673);
gesture.onGestureMove.detach();
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 674);
gesture.onGestureMoveEnd.detach();

        // If this wasn't a flick, wrap up the gesture cycle
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 677);
if (!flick) {
            // @TODO: Be more intelligent about this. Look at the Flick attribute to see 
            // if it is safe to assume _flick did or didn't fire.  
            // Then, the order _flick and _onGestureMoveEnd fire doesn't matter?

            // If there was movement (_onGestureMove fired)
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 683);
if (gesture.deltaX !== null && gesture.deltaY !== null) {

                // If we're out-out-bounds, then snapback
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 686);
if (sv._isOutOfBounds()) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 687);
sv._snapBack();
                }

                // Inbounds
                else {
                    // Don't fire scrollEnd on the gesture axis is the same as paginator's
                    // Not totally confident this is ideal to access a plugin's properties from a host, @TODO revisit
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 694);
if (sv.pages && !sv.pages.get(AXIS)[gesture.axis]) {
                        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 695);
sv._onTransEnd();
                    }
                }
            }
        }
    },

    /**
     * Execute a flick at the end of a scroll action
     *
     * @method _flick
     * @param e {Event.Facade} The Flick event facade
     * @private
     */
    _flick: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_flick", 709);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 710);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 711);
return false;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 714);
var sv = this,
            gesture = sv._gesture,
            svAxis = sv._cAxis,
            flick = e.flick,
            flickAxis = flick.axis,
            flickVelocity = flick.velocity,
            axisAttr = flickAxis === DIM_X ? SCROLL_X : SCROLL_Y,
            startPosition = sv.get(axisAttr);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 723);
gesture.flick = flick;
        // Prevent unneccesary firing of _flickFrame if we can't scroll on the flick axis
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 725);
if (svAxis[flickAxis]) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 726);
sv._flickFrame(flickVelocity, flickAxis, startPosition);
        }
    },

    /**
     * Execute a single frame in the flick animation
     *
     * @method _flickFrame
     * @param velocity {Number} The velocity of this animated frame
     * @param flickAxis {String} The axis on which to animate
     * @param startPosition {Number} The starting X/Y point to flick from
     * @protected
     */
    _flickFrame: function (velocity, flickAxis, startPosition) {

        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_flickFrame", 739);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 741);
var sv = this,
            axisAttr = flickAxis === DIM_X ? SCROLL_X : SCROLL_Y,

            // Localize cached values
            bounce = sv._cBounce,
            bounceRange = sv._cBounceRange,
            deceleration = sv._cDeceleration,
            frameDuration = sv._cFrameDuration,

            // Calculate
            velocity = velocity * deceleration,
            newPosition = startPosition - (frameDuration * velocity),

            // Some convinience conditions
            min = flickAxis === DIM_X ? sv._minScrollX : sv._minScrollY,
            max = flickAxis === DIM_X ? sv._maxScrollX : sv._maxScrollY,
            belowMin       = (newPosition < min),
            belowMax       = (newPosition < max),
            aboveMin       = (newPosition > min),
            aboveMax       = (newPosition > max),
            belowMinRange  = (newPosition < (min - bounceRange)),
            belowMaxRange  = (newPosition < (max + bounceRange)),
            withinMinRange = (belowMin && (newPosition > (min - bounceRange))),
            withinMaxRange = (aboveMax && (newPosition < (max + bounceRange))),
            aboveMinRange  = (newPosition > (min - bounceRange)),
            aboveMaxRange  = (newPosition > (max + bounceRange)),
            tooSlow;

        // If we're within the range but outside min/max, dampen the velocity
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 770);
if (withinMinRange || withinMaxRange) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 771);
velocity *= bounce;
        }

        // Is the velocity too slow to bother?
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 775);
tooslow = (Math.abs(velocity).toFixed(4) < 0.015);

        // If the velocity is too slow or we're outside the range
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 778);
if (tooslow || belowMinRange || aboveMaxRange) {
            // Cancel and delete sv._flickAnim
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 780);
sv._flickAnim && sv._flickAnim.cancel();
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 781);
delete sv._flickAnim;

            // If we're inside the scroll area, just end
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 784);
if (aboveMin && belowMax) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 785);
sv._onTransEnd();
            }

            // We're outside the scroll area, so we need to snap back
            else {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 790);
sv._snapBack();
            }
        }

        // Otherwise, animate to the next frame
        else {
            // @TODO: maybe use requestAnimationFrame instead
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 797);
sv._flickAnim = Y.later(frameDuration, sv, '_flickFrame', [velocity, flickAxis, newPosition]);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 798);
sv.set(axisAttr, newPosition);
        }
    },

    /**
     * Handle mousewheel events on the widget
     *
     * @method _mousewheel
     * @param e {Event.Facade} The mousewheel event facade
     * @private
     */
    _mousewheel: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_mousewheel", 809);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 810);
var sv = this,
            scrollY = sv.get(SCROLL_Y),
            bb = sv._bb,
            scrollOffset = 10, // 10px
            isForward = (e.wheelDelta > 0),
            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 817);
scrollToY = _constrain(scrollToY, sv._minScrollY, sv._maxScrollY);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 819);
if (bb.contains(e.target)) {
        
            // Reset lastScrolledAmt
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 822);
sv.lastScrolledAmt = 0;

            // Jump to the new offset
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 825);
sv.set(SCROLL_Y, scrollToY);

            // if we have scrollbars plugin, update & set the flash timer on the scrollbar
            // @TODO: This probably shouldn't be in this module
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 829);
if (sv.scrollbars) {
                // @TODO: The scrollbars should handle this themselves
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 831);
sv.scrollbars._update();
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 832);
sv.scrollbars.flash();
                // or just this
                // sv.scrollbars._hostDimensionsChange();
            }

            // Fire the 'scrollEnd' event
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 838);
sv._onTransEnd();

            // prevent browser default behavior on mouse scroll
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 841);
e.preventDefault();
        }
    },

    /**
     * Checks to see the current scrollX/scrollY position beyond the min/max boundary
     *
     * @method _isOutOfBounds
     * @param x {Number} [optional] The X position to check
     * @param y {Number} [optional] The Y position to check
     * @returns {boolen} Whether the current X/Y position is out of bounds (true) or not (false)
     * @private
     */
    _isOutOfBounds: function (x, y) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_isOutOfBounds", 854);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 855);
var sv = this,
            svAxis = sv._cAxis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            currentX = x || sv.get(SCROLL_X),
            currentY = y || sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            minY = sv._minScrollY,
            maxX = sv._maxScrollX,
            maxY = sv._maxScrollY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 866);
return (svAxisX && (currentX < minX || currentX > maxX)) || (svAxisY && (currentY < minY || currentY > maxY));
    },

    /**
     * Bounces back
     * @TODO: Should be more generalized and support both X and Y detection
     *
     * @method _snapBack
     * @private
     */
    _snapBack: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_snapBack", 876);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 877);
var sv = this,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            minY = sv._minScrollY,
            maxX = sv._maxScrollX,
            maxY = sv._maxScrollY,
            newY = _constrain(currentY, minY, maxY),
            newX = _constrain(currentX, minX, maxX),
            duration = sv.get(SNAP_DURATION),
            easing = sv.get(SNAP_EASING);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 889);
if (newX !== currentX) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 890);
sv.set(SCROLL_X, newX, {duration:duration, easing:easing});
        }
        else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 892);
if (newY !== currentY) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 893);
sv.set(SCROLL_Y, newY, {duration:duration, easing:easing});
        }
        else {
            // It shouldn't ever get here, but in case it does, fire scrollEnd
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 897);
sv._onTransEnd();
        }}
    },

    /**
     * After listener for changes to the scrollX or scrollY attribute
     *
     * @method _afterScrollChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterScrollChange: function (e) {

        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterScrollChange", 908);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 910);
if (e.src === ScrollView.UI_SRC) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 911);
return false;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 914);
var sv = this,
            duration = e.duration,
            easing = e.easing,
            val = e.newVal,
            scrollToArgs = [];

        // Set the scrolled value
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 921);
sv.lastScrolledAmt = sv.lastScrolledAmt + (e.newVal - e.prevVal);

        // Generate the array of args to pass to scrollTo()
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 924);
if (e.attrName === SCROLL_X) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 925);
scrollToArgs.push(val);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 926);
scrollToArgs.push(sv.get(SCROLL_Y));
        }
        else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 929);
scrollToArgs.push(sv.get(SCROLL_X));
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 930);
scrollToArgs.push(val);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 933);
scrollToArgs.push(duration);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 934);
scrollToArgs.push(easing);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 936);
sv.scrollTo.apply(sv, scrollToArgs);
    },

    /**
     * After listener for changes to the flick attribute
     *
     * @method _afterFlickChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterFlickChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterFlickChange", 946);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 947);
this._bindFlick(e.newVal);
    },

    /**
     * After listener for changes to the disabled attribute
     *
     * @method _afterDisabledChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDisabledChange: function (e) {
        // Cache for performance - we check during move
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDisabledChange", 957);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 959);
this._cDisabled = e.newVal;
    },

    /**
     * After listener for the axis attribute
     *
     * @method _afterAxisChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterAxisChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterAxisChange", 969);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 970);
this._cAxis = e.newVal;
    },

    /**
     * After listener for changes to the drag attribute
     *
     * @method _afterDragChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDragChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDragChange", 980);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 981);
this._bindDrag(e.newVal);
    },

    /**
     * After listener for changes to the drag attribute
     *
     * @method _afterDragChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterMousewheelChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterMousewheelChange", 991);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 992);
this._bindMousewheel(e.newVal);
    },

    /**
     * After listener for the height or width attribute
     *
     * @method _afterDimChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDimChange: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDimChange", 1002);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1003);
this._uiDimensionsChange();
    },

    /**
     * After listener for scrollEnd, for cleanup
     *
     * @method _afterScrollEnd
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterScrollEnd: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterScrollEnd", 1013);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1014);
var sv = this;

        // Cancel the flick (if it exists)
        // @TODO: Move to sv._cancelFlick()
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1018);
sv._flickAnim && sv._flickAnim.cancel();

        // Also delete it, otherwise _onGestureMoveStart will think we're still flicking
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1021);
delete sv._flickAnim;

        // If for some reason we're OOB, snapback
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1024);
if (sv._isOutOfBounds()) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1025);
sv._snapBack();
        }

        // Ideally this should be removed, but doing so causing some JS errors with fast swiping 
        // because _gesture is being deleted after the previous one has been overwritten
        // delete sv._gesture; // TODO: Move to sv.prevGesture?
    },

    /**
     * Setter for 'axis' attribute
     *
     * @method _axisSetter
     * @param val {Mixed} A string ('x', 'y', 'xy') to specify which axis/axes to allow scrolling on
     * @param name {String} The attribute name
     * @return {Object} An object to specify scrollability on the x & y axes
     * 
     * @protected
     */
    _axisSetter: function (val, name) {

        // Turn a string into an axis object
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_axisSetter", 1043);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1046);
if (Y.Lang.isString(val)) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1047);
return {
                x: val.match(/x/i) ? true : false,
                y: val.match(/y/i) ? true : false
            };
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
    * @return {Number} The value
    */
    _setScroll : function(val, dim) {

        // Just ensure the widget is not disabled
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_setScroll", 1064);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1067);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1068);
val = Y.Attribute.INVALID_VALUE;
        } 

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1071);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_setScrollX", 1082);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1083);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_setScrollY", 1094);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1095);
return this._setScroll(val, DIM_Y);
    }

    // End prototype properties

}, {

    // Static properties

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
         * Specifies ability to scroll on x, y, or x and y axis/axes.
         *
         * @attribute axis
         * @type String
         */
        axis: {
            setter: '_axisSetter',
            writeOnce: 'initOnly'
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
            value: .1
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
        },

        /**
         * The default duration to use when animating the bounce snap back.
         *
         * @attribute snapDuration
         * @type Number
         * @default 400
         */
        snapDuration: {
            value: 400
        },

        /**
         * The default easing to use when animating the bounce snap back.
         *
         * @attribute snapEasing
         * @type String
         * @default 'ease-out'
         */
        snapEasing: {
            value: 'ease-out'
        },

        /**
         * The default easing used when animating the flick
         *
         * @attribute easing
         * @type String
         * @default 'cubic-bezier(0, 0.1, 0, 1.0)'
         */
        easing: {
            value: 'cubic-bezier(0, 0.1, 0, 1.0)'
        },

        /**
         * The interval (ms) used when animating the flick for JS-timer animations
         *
         * @attribute frameDuration
         * @type Number
         * @default 15
         */
        frameDuration: {
            value: 15
        },

        /**
         * The default bounce distance in pixels
         *
         * @attribute bounceRange
         * @type Number
         * @default 150
         */
        bounceRange: {
            value: 150
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
     * @default 'ui'
     */
    UI_SRC: UI,

    /**
     * Object map of style property names used to set transition properties.
     * Defaults to the vendor prefix established by the Transition module.
     * The configured property names are `_TRANSITION.DURATION` (e.g. "WebkitTransitionDuration") and
     * `_TRANSITION.PROPERTY (e.g. "WebkitTransitionProperty").
     *
     * @property _TRANSITION
     * @private
     */
    _TRANSITION: {
        DURATION: Y.Transition._VENDOR_PREFIX + 'TransitionDuration',
        PROPERTY: Y.Transition._VENDOR_PREFIX + 'TransitionProperty'
    },

    /**
     * Enable/Disable scrolling content via mousewheel
     * @property mousewheel
     * @type boolean
     * @static
     * @default true
     */
    MOUSEWHEEL: true,

    /**
     * The default bounce distance in pixels
     *
     * @property BOUNCE_RANGE
     * @type Number
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    BOUNCE_RANGE: false,

    /**
     * The interval (ms) used when animating the flick
     *
     * @property FRAME_STEP
     * @type Number
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    FRAME_STEP: false,

    /**
     * The default easing used when animating the flick
     *
     * @property EASING
     * @type String
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    EASING: false,

    /**
     * The default easing to use when animating the bounce snap back.
     *
     * @property SNAP_EASING
     * @type String
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    SNAP_EASING: false,

    /**
     * The default duration to use when animating the bounce snap back.
     *
     * @property SNAP_DURATION
     * @type Number
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    SNAP_DURATION: false

    // End static properties

});

}, '@VERSION@', {"requires": ["widget", "event-gestures", "event-mousewheel", "transition"], "skinnable": true});
