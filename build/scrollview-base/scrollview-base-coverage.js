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
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].code=["YUI.add('scrollview-base', function (Y, NAME) {","","/**"," * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators"," *"," * @module scrollview"," * @submodule scrollview-base"," */","var getClassName = Y.ClassNameManager.getClassName,","    DOCUMENT = Y.config.doc,","    WINDOW = Y.config.win,","    IE = Y.UA.ie,","    NATIVE_TRANSITIONS = Y.Transition.useNative,","    SCROLLVIEW = 'scrollview',","    CLASS_NAMES = {","        vertical: getClassName(SCROLLVIEW, 'vert'),","        horizontal: getClassName(SCROLLVIEW, 'horiz')","    },","    EV_SCROLL_END = 'scrollEnd',","    FLICK = 'flick',","    DRAG = 'drag',","    MOUSEWHEEL = 'mousewheel',","    UI = 'ui',","    TOP = 'top',","    RIGHT = 'right',","    BOTTOM = 'bottom',","    LEFT = 'left',","    PX = 'px',","    AXIS = 'axis',","    SCROLL_Y = 'scrollY',","    SCROLL_X = 'scrollX',","    BOUNCE = 'bounce',","    DISABLED = 'disabled',","    DECELERATION = 'deceleration',","    DIM_X = 'x',","    DIM_Y = 'y',","    BOUNDING_BOX = 'boundingBox',","    CONTENT_BOX = 'contentBox',","    GESTURE_MOVE = 'gesturemove',","    START = 'start',","    END = 'end',","    EMPTY = '',","    ZERO = '0s',","","    _constrain = function (val, min, max) {","        return Math.min(Math.max(val, min), max);","    };","","/**"," * ScrollView provides a scrollable widget, supporting flick gestures,"," * across both touch and mouse based devices."," *"," * @class ScrollView"," * @param config {Object} Object literal with initial attribute values"," * @extends Widget"," * @constructor"," */","function ScrollView() {","    ScrollView.superclass.constructor.apply(this, arguments);","}","","Y.ScrollView = Y.extend(ScrollView, Y.Widget, {","","    // *** Y.ScrollView prototype","","    /**","     * Designated initializer","     *","     * @method initializer","     * @param {config} Configuration object for the plugin","     */","    initializer: function (config) {","        var sv = this;","","        // Cache these values, since they aren't going to change.","        sv._bb = sv.get(BOUNDING_BOX);","        sv._cb = sv.get(CONTENT_BOX);","        sv._axis = sv.get(AXIS);","    },","","    /**","     * bindUI implementation","     *","     * Hooks up events for the widget","     * @method bindUI","     */","    bindUI: function () {","        var sv = this;","","        sv._bindFlick(sv.get(FLICK));","        sv._bindDrag(sv.get(DRAG));","        sv._bindMousewheel(sv.get(MOUSEWHEEL));","        ","        sv._bindAttrs();","","        // IE SELECT HACK. See if we can do this non-natively and in the gesture for a future release.","        if (IE) {","            sv._fixIESelect(sv._bb, sv._cb);","        }","    },","","    /**","     * ","     *","     * @method _bindAttrs","     * @private","     */","    _bindAttrs: function () {","        var sv = this,","            scrollChangeHandler = sv._afterScrollChange,","            dimChangeHandler = sv._afterDimChange;","","        sv.after({","            'scrollEnd': sv._afterScrollEnd,","            'disabledChange': sv._afterDisabledChange,","            'flickChange': sv._afterFlickChange,","            'dragChange': sv._afterDragChange,","            'scrollYChange': scrollChangeHandler,","            'scrollXChange': scrollChangeHandler,","            'heightChange': dimChangeHandler,","            'widthChange': dimChangeHandler","        });","","        // TODO: This should be throttled.","        Y.one(WINDOW).after('resize', dimChangeHandler, sv);","    },","","    /**","     * Bind (or unbind) gesture move listeners required for drag support","     *","     * @method _bindDrag","     * @param drag {boolean} If true, the method binds listener to enable drag (gesturemovestart). If false, the method unbinds gesturemove listeners for drag support.","     * @private","     */","    _bindDrag: function (drag) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'drag' listeners","        bb.detach(DRAG + '|*');","","        if (drag) {","            bb.on(DRAG + '|' + GESTURE_MOVE + START, Y.bind(sv._onGestureMoveStart, sv));","        }","    },","","    /**","     * Bind (or unbind) flick listeners.","     *","     * @method _bindFlick","     * @param flick {Object|boolean} If truthy, the method binds listeners for flick support. If false, the method unbinds flick listeners.","     * @private","     */","    _bindFlick: function (flick) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'flick' listeners","        bb.detach(FLICK + '|*');","","        if (flick) {","            bb.on(FLICK + '|' + FLICK, Y.bind(sv._flick, sv), flick);","        }","    },","","    /**","     * Bind (or unbind) mousewheel listeners.","     *","     * @method _bindMousewheel","     * @param mousewheel {Object|boolean} If truthy, the method binds listeners for mousewheel support. If false, the method unbinds mousewheel listeners.","     * @private","     */","    _bindMousewheel: function (mousewheel) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'mousewheel' listeners","        bb.detach(MOUSEWHEEL + '|*');","","        // Only enable for vertical scrollviews","        if (mousewheel) {","            // Bound to document, because that's where mousewheel events fire off of.","            Y.one(DOCUMENT).on(MOUSEWHEEL, Y.bind(sv._mousewheel, sv));","        }","    },","","    /**","     * syncUI implementation.","     *","     * Update the scroll position, based on the current value of scrollX/scrollY.","     *","     * @method syncUI","     */","    syncUI: function () {","        var sv = this,","            axis = sv._axis,","            scrollDims = sv._getScrollDims(),","            width = scrollDims.offsetWidth,","            height = scrollDims.offsetHeight,","            scrollWidth = scrollDims.scrollWidth,","            scrollHeight = scrollDims.scrollHeight;","","        // If the axis is undefined, auto-calculate it","        if (axis === undefined) {","            axis = {","                x: (scrollWidth > width),","                y: (scrollHeight > height)","            };","","            sv._set(AXIS, axis);","            sv._axis = axis;","        }","","        // get text direction on or inherited by scrollview node","        sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');","","        // Cache the disabled value","        sv._cDisabled = sv.get(DISABLED);","","        // Run this to set initial values","        sv._uiDimensionsChange();","","        // If we're out-of-bounds, snap back.","        if (sv._isOOB()) {","            sv._snapBack();","        }","    },","","    /**","     * Utility method to obtain widget dimensions","     * ","     * @method _getScrollDims","     * @returns {Object} The offsetWidth, offsetHeight, scrollWidth and scrollHeight as an array: [offsetWidth, offsetHeight, scrollWidth, scrollHeight]","     * @private","     */","    _getScrollDims: function () {","        var sv = this,","            cb = sv._cb,","            bb = sv._bb,","            TRANS = ScrollView._TRANSITION,","            dims;","","        // TODO: Is this OK? Just in case it's called 'during' a transition.","        if (NATIVE_TRANSITIONS) {","            cb.setStyle(TRANS.DURATION, ZERO);","            cb.setStyle(TRANS.PROPERTY, EMPTY);","        }","","        dims = {","            'offsetWidth': bb.get('offsetWidth'),","            'offsetHeight': bb.get('offsetHeight'),","            'scrollWidth': bb.get('scrollWidth'),","            'scrollHeight': bb.get('scrollHeight')","        };","","        return dims;","    },","","    /**","     * This method gets invoked whenever the height or width attributes change,","     * allowing us to determine which scrolling axes need to be enabled.","     *","     * @method _uiDimensionsChange","     * @protected","     */","    _uiDimensionsChange: function () {","        var sv = this,","            bb = sv._bb,","            scrollDims = sv._getScrollDims(),","            width = scrollDims.offsetWidth,","            height = scrollDims.offsetHeight,","            scrollWidth = scrollDims.scrollWidth,","            scrollHeight = scrollDims.scrollHeight,","            rtl = sv.rtl,","            axis = sv._axis;","        ","        sv._minScrollX = (rtl) ? -(scrollWidth - width) : 0;","        sv._maxScrollX = (rtl) ? 0 : (scrollWidth - width);","        sv._minScrollY = 0;","        sv._maxScrollY = scrollHeight - height;","        sv._scrollWidth = scrollWidth;","        sv._scrollHeight = scrollHeight;","","        if (axis.x) {","            bb.addClass(CLASS_NAMES.horizontal);","        }","","        if (axis.y) {","            bb.addClass(CLASS_NAMES.vertical);","        }","","        /**","         * Internal state, defines the maximum amount that the scrollview can be scrolled along the Y axis","         *","         * @property _maxScrollY","         * @type number","         * @protected","         */","","        /**","         * Internal state, defines the minimum amount that the scrollview can be scrolled along the Y axis","         *","         * @property _minScrollY","         * @type number","         * @protected","         */","","        /**","         * Internal state, cached scrollHeight, for performance","         *","         * @property _scrollHeight","         * @type number","         * @protected","         */","","        /**","         * Internal state, defines the maximum amount that the scrollview can be scrolled along the X axis","         *","         * @property _maxScrollX","         * @type number","         * @protected","         */","","        /**","         * Internal state, defines the minimum amount that the scrollview can be scrolled along the X axis","         *","         * @property _minScrollX","         * @type number","         * @protected","         */","","        /**","         * Internal state, cached scrollWidth, for performance","         *","         * @property _scrollWidth","         * @type number","         * @protected","         */","    },","","    /**","     * Scroll the element to a given xy coordinate","     *","     * @method scrollTo","     * @param x {Number} The x-position to scroll to. (null for no movement)","     * @param y {Number} The y-position to scroll to. (null for no movement)","     * @param {Number} [duration] ms of the scroll animation. (default is 0)","     * @param {String} [easing] An easing equation if duration is set. (defaults to ScrollView.EASING)","     * @param {String} [node] The node to move.","     */","    scrollTo: function (x, y, duration, easing, node) {","        // Check to see if widget is disabled","        if (this._cDisabled) {","            return;","        }","","        var sv = this,","            cb = sv._cb,","            TRANS = ScrollView._TRANSITION,","            callback = Y.bind(sv._onTransEnd, sv), // @Todo : cache this","            newX = 0,","            newY = 0,","            transition = {},","            transform;","","        // default the optional arguments","        duration = duration || 0;","        easing = easing || ScrollView.EASING;","        node = node || cb;","","        if (x !== null) {","            sv.set(SCROLL_X, x, {src:UI});","            newX = -(x);","        }","","        if (y !== null) {","            sv.set(SCROLL_Y, y, {src:UI});","            newY = -(y);","        }","","        transform = sv._transform(newX, newY);","","        if (NATIVE_TRANSITIONS) {","            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.","            node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);","        }","","        // Move","        if (duration === 0) {","            if (NATIVE_TRANSITIONS) {","                node.setStyle('transform', transform);","            }","            else {","                // TODO: If both set, batch them in the same update","                // Update: Nope, setStyles() just loops through each property and applies it.","                if (x !== null) {","                    node.setStyle(LEFT, newX + PX);","                }","                if (y !== null) {","                    node.setStyle(TOP, newY + PX);","                }","            }","        }","","        // Animate","        else {","            transition.easing = easing;","            transition.duration = duration / 1000;","","            if (NATIVE_TRANSITIONS) {","                transition.transform = transform;","            }","            else {","                transition.left = newX + PX;","                transition.top = newY + PX;","            }","","            node.transition(transition, callback);","        }","    },","","    /**","     * Utility method, to create the translate transform string with the","     * x, y translation amounts provided.","     *","     * @method _transform","     * @param {Number} x Number of pixels to translate along the x axis","     * @param {Number} y Number of pixels to translate along the y axis","     * @private","     */","    _transform: function (x, y) {","        // TODO: Would we be better off using a Matrix for this?","        var prop = 'translate(' + x + 'px, ' + y + 'px)';","","        if (this._forceHWTransforms) {","            prop += ' translateZ(0)';","        }","","        return prop;","    },","","    /**","     * Content box transition callback","     *","     * @method _onTransEnd","     * @param {Event.Facade} e The event facade","     * @private","     */","    _onTransEnd: function (e) {","        var sv = this;","","        /**","         * Notification event fired at the end of a scroll transition","         *","         * @event scrollEnd","         * @param e {EventFacade} The default event facade.","         */","        sv.fire(EV_SCROLL_END);","    },","","    /**","     * Flag driving whether or not we should try and force H/W acceleration when transforming. Currently enabled by default for Webkit.","     * Used by the _transform method.","     *","     * @property _forceHWTransforms","     * @type boolean","     * @protected","     */","    _forceHWTransforms: Y.UA.webkit ? true : false,","","    /**","     * <p>Used to control whether or not ScrollView's internal","     * gesturemovestart, gesturemove and gesturemoveend","     * event listeners should preventDefault. The value is an","     * object, with \"start\", \"move\" and \"end\" properties used to","     * specify which events should preventDefault and which shouldn't:</p>","     *","     * <pre>","     * {","     *    start: false,","     *    move: true,","     *    end: false","     * }","     * </pre>","     *","     * <p>The default values are set up in order to prevent panning,","     * on touch devices, while allowing click listeners on elements inside","     * the ScrollView to be notified as expected.</p>","     *","     * @property _prevent","     * @type Object","     * @protected","     */","    _prevent: {","        start: false,","        move: true,","        end: false","    },","","    /**","     * gesturemovestart event handler","     *","     * @method _onGestureMoveStart","     * @param e {Event.Facade} The gesturemovestart event facade","     * @private","     */","    _onGestureMoveStart: function (e) {","        if (!this._cDisabled) {","            var sv = this,","                bb = sv._bb,","                currentX = sv.get(SCROLL_X),","                currentY = sv.get(SCROLL_Y);","","            // TODO: Review if neccesary (#2530129)","            e.stopPropagation();","","            if (sv._prevent.start) {","                e.preventDefault();","            }","","            // if a flick animation is in progress, cancel it","            if (sv._flickAnim) {","                sv._flickAnim.cancel();","            }","","            // Stores data for this gesture cycle.  Cleaned up later","            sv._gesture = {","","                // Will hold the axis value","                axis: null,","","                // The current attribute values","                startX: currentX,","                startY: currentY,","","                // The X/Y coordinates where the event began","                startClientX: e.clientX,","                startClientY: e.clientY,","","                // The X/Y coordinates where the event will end","                endClientX: null,","                endClientY: null,","","                // The current delta of the event","                deltaX: null,","                deltaY: null,","","                // Will be populated for flicks","                flick: null,","","                // Create some listeners for the rest of the gesture cycle","                onGestureMove: bb.on(DRAG + '|' + GESTURE_MOVE, Y.bind(sv._onGestureMove, sv)),","                onGestureMoveEnd: bb.on(DRAG + '|' + GESTURE_MOVE + END, Y.bind(sv._onGestureMoveEnd, sv))","            };","        }","    },","","    /**","     * gesturemove event handler","     *","     * @method _onGestureMove","     * @param e {Event.Facade} The gesturemove event facade","     * @private","     */","    _onGestureMove: function (e) {","        var sv = this,","            gesture = sv._gesture,","            svAxis = sv._axis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            startX = gesture.startX,","            startY = gesture.startY,","            startClientX = gesture.startClientX,","            startClientY = gesture.startClientY,","            clientX = e.clientX,","            clientY = e.clientY;","","        if (sv._prevent.move) {","            e.preventDefault();","        }","","        gesture.deltaX = startClientX - clientX;","        gesture.deltaY = startClientY - clientY;","","        if (gesture.axis === null) {","            gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;","        }","","        if (gesture.axis === DIM_X && svAxisX) {","            sv.set(SCROLL_X, startX + gesture.deltaX);","        }","","        if (gesture.axis === DIM_Y && svAxisY) {","            sv.set(SCROLL_Y, startY + gesture.deltaY);","        }","    },","","    /**","     * gesturemoveend event handler","     *","     * @method _onGestureMoveEnd","     * @param e {Event.Facade} The gesturemoveend event facade","     * @private","     */","    _onGestureMoveEnd: function (e) {","        var sv = this,","            gesture = sv._gesture,","            flick = gesture.flick,","            clientX = e.clientX,","            clientY = e.clientY,","            isOOB;","","        if (sv._prevent.end) {","            e.preventDefault();","        }","","        gesture.endClientX = clientX;","        gesture.endClientY = clientY;","","        // Only if this gesture wasn't a flick, and there was movement","        if (!flick && gesture.deltaX !== null && gesture.deltaY !== null) {","            if (sv._isOOB()) {","                sv._snapBack();","            }","            else {","                // Don't fire scrollEnd on the gesture axis is the same as paginator's","                // Not totally confident this is ideal to access a plugin's properties from a host, @TODO revisit","                if (sv.pages && !sv.pages.axis[gesture.axis]) {","                    sv._onTransEnd();","                }","            }","        }","    },","","    /**","     * Execute a flick at the end of a scroll action","     *","     * @method _flick","     * @param e {Event.Facade} The Flick event facade","     * @private","     */","    _flick: function (e) {","        var sv = this,","            gesture = sv._gesture,","            svAxis = sv._axis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            flick = e.flick,","            flickAxis;","","        if (!sv._cDisabled) {","            flickAxis = flick.axis;","","            // We can't scroll on this axis, so prevent unneccesary firing of _flickFrame","            if ((flickAxis === DIM_X && svAxisX) || (flickAxis === DIM_Y && svAxisY)) {","                gesture.flick = flick;","                sv._cDecel = sv.get(DECELERATION);","                sv._cBounce = sv.get(BOUNCE);","                sv._flickFrame(flick.velocity);","            }","        }","    },","","    /**","     * Execute a single frame in the flick animation","     *","     * @method _flickFrame","     * @param velocity {Number} The velocity of this animated frame","     * @protected","     */","    _flickFrame: function (velocity) {","","        var sv = this,","            gesture = sv._gesture,","            flickAxis = gesture.flick.axis,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            minX = sv._minScrollX,","            maxX = sv._maxScrollX,","            minY = sv._minScrollY,","            maxY = sv._maxScrollY,","            deceleration = sv._cDecel,","            bounce = sv._cBounce,","            svAxis = sv._axis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            step = ScrollView.FRAME_STEP,","            newX = currentX - (velocity * step),","            newY = currentY - (velocity * step);","","        velocity *= deceleration;","","        // If we are out of bounds","        if (sv._isOOB()) {","            // We're past an edge, now bounce back","            sv._snapBack();","        }","        ","        // If the velocity gets slow enough, just stop","        else if (Math.abs(velocity).toFixed(4) <= 0.015) {","            sv._onTransEnd();","        }","","        // Otherwise, animate to the next frame","        else {","            if (flickAxis === DIM_X && svAxisX) {","                if (newX < minX || newX > maxX) {","                    velocity *= bounce;","                }","                sv.set(SCROLL_X, newX);","            }","            else if (flickAxis === DIM_Y && svAxisY) {","                if (newY < minY || newY > maxY) {","                    velocity *= bounce;","                }","                sv.set(SCROLL_Y, newY);","            }","","            // TODO: maybe use requestAnimationFrame instead","            sv._flickAnim = Y.later(step, sv, '_flickFrame', [velocity]);","        }","    },","","    /**","     * Handle mousewheel events on the widget","     *","     * @method _mousewheel","     * @param e {Event.Facade} The mousewheel event facade","     * @private","     */","    _mousewheel: function (e) {","        var sv = this,","            scrollY = sv.get(SCROLL_Y),","            bb = sv._bb,","            scrollOffset = 10, // 10px","            isForward = (e.wheelDelta > 0),","            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);","","        scrollToY = _constrain(scrollToY, sv._minScrollY, sv._maxScrollY);","","        if (bb.contains(e.target)) {","            // Jump to the new offset","            sv.set(SCROLL_Y, scrollToY);","","            // if we have scrollbars plugin, update & set the flash timer on the scrollbar","            // TODO: This probably shouldn't be in this module","            if (sv.scrollbars) {","                // TODO: The scrollbars should handle this themselves","                sv.scrollbars._update();","                sv.scrollbars.flash();","                // or just this","                // sv.scrollbars._hostDimensionsChange();","            }","","            // Fire the 'scrollEnd' event","            sv._onTransEnd();","","            // prevent browser default behavior on mouse scroll","            e.preventDefault();","        }","    },","","    /**","     * Checks to see the current scrollX/scrollY position is out of bounds","     *","     * @method _isOOB","     * @returns {boolen} Whether the current X/Y position is out of bounds (true) or not (false)","     * @private","     */","    _isOOB: function () {","        var sv = this,","            svAxis = sv._axis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            minX = sv._minScrollX,","            minY = sv._minScrollY,","            maxX = sv._maxScrollX,","            maxY = sv._maxScrollY;","","        return (svAxisX && (currentX < minX || currentX > maxX)) || (svAxisY && (currentY < minY || currentY > maxY));","    },","","    /**","     * Bounces back","     * @TODO: Should be more generalized and support both X and Y detection","     *","     * @method _snapBack","     * @private","     */","    _snapBack: function () {","        var sv = this,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            minX = sv._minScrollX,","            minY = sv._minScrollY,","            maxX = sv._maxScrollX,","            maxY = sv._maxScrollY,","            newY = _constrain(currentY, minY, maxY),","            newX = _constrain(currentX, minX, maxX),","            duration = ScrollView.SNAP_DURATION;","","        if (newX !== currentX) {","            sv.set(SCROLL_X, newX, {duration:duration});","        }","        else if (newY !== currentY) {","            sv.set(SCROLL_Y, newY, {duration:duration});","        }","        else {","            // It shouldn't ever get here, but in case it does, fire scrollEnd","            sv._onTransEnd();","        }","    },","","    /**","     * After listener for changes to the scrollX or scrollY attribute","     *","     * @method _afterScrollChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterScrollChange: function (e) {","        var sv = this,","            duration = e.duration,","            easing = e.easing,","            val = e.newVal,","            scrollToArgs = [];","","        if (e.src !== ScrollView.UI_SRC) {","","            // Generate the array of args to pass to scrollTo()","            if (e.attrName === SCROLL_X) {","                scrollToArgs.push(val);","                scrollToArgs.push(sv.get(SCROLL_Y));","            }","            else {","                scrollToArgs.push(sv.get(SCROLL_X));","                scrollToArgs.push(val);","            }","","            scrollToArgs.push(duration);","            scrollToArgs.push(easing);","","            sv.scrollTo.apply(sv, scrollToArgs);","        }","    },","","    /**","     * After listener for changes to the flick attribute","     *","     * @method _afterFlickChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterFlickChange: function (e) {","        this._bindFlick(e.newVal);","    },","","    /**","     * After listener for changes to the disabled attribute","     *","     * @method _afterDisabledChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDisabledChange: function (e) {","        // Cache for performance - we check during move","        this._cDisabled = e.newVal;","    },","","    /**","     * After listener for changes to the drag attribute","     *","     * @method _afterDragChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDragChange: function (e) {","        this._bindDrag(e.newVal);","    },","","    /**","     * After listener for changes to the drag attribute","     *","     * @method _afterDragChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterMousewheelChange: function (e) {","        this._bindMousewheel(e.newVal);","    },","","    /**","     * After listener for the height or width attribute","     *","     * @method _afterDimChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDimChange: function () {","        this._uiDimensionsChange();","    },","","    /**","     * After listener for scrollEnd, for cleanup","     *","     * @method _afterScrollEnd","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterScrollEnd: function (e) {","        var sv = this,","            gesture = sv._gesture;","","        if (gesture && gesture.onGestureMove && gesture.onGestureMove.detach) {","            gesture.onGestureMove.detach();","        }","","        if (gesture && gesture.onGestureMoveEnd && gesture.onGestureMoveEnd.detach) {","            gesture.onGestureMoveEnd.detach();","        }","","        if (sv._flickAnim) {","            sv._flickAnim.cancel(); // Might as well?","        }","        ","        delete sv._flickAnim;","","        // Ideally this should be removed, but doing so causing some JS errors with fast swiping ","        // because _gesture is being deleted after the previous one has been overwritten","        // delete sv._gesture; // TODO: Move to sv.prevGesture?","    },","","    /**","     * Setter for 'axis' attribute","     *","     * @method _axisSetter","     * @param val {Mixed} A string ('x', 'y', 'xy') to specify which axis/axes to allow scrolling on","     * @param name {String} The attribute name","     * @return {Object} An object to specify scrollability on the x & y axes","     * ","     * @protected","     */","    _axisSetter: function (val, name) {","        // Turn the string into an axis object","        if (Y.Lang.isString(val)) {","            return {","                x: val.match(/x/i),","                y: val.match(/y/i)","            };","        }","    }","    ","    // End prototype properties","","}, {","","    // Static properties","","    /**","     * The identity of the widget.","     *","     * @property NAME","     * @type String","     * @default 'scrollview'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'scrollview',","","    /**","     * Static property used to define the default attribute configuration of","     * the Widget.","     *","     * @property ATTRS","     * @type {Object}","     * @protected","     * @static","     */","    ATTRS: {","","        /**","         * Specifies ability to scroll on x, y, or x and y axis/axes.","         *","         * @attribute axis","         * @type String","         */","        axis: {","            setter: '_axisSetter',","            writeOnce: 'initOnly'","        },","","        /**","         * The scroll position in the y-axis","         *","         * @attribute scrollY","         * @type Number","         * @default 0","         */","        scrollY: {","            value: 0","        },","","        /**","         * The scroll position in the x-axis","         *","         * @attribute scrollX","         * @type Number","         * @default 0","         */","        scrollX: {","            value: 0","        },","","        /**","         * Drag coefficent for inertial scrolling. The closer to 1 this","         * value is, the less friction during scrolling.","         *","         * @attribute deceleration","         * @default 0.93","         */","        deceleration: {","            value: 0.93","        },","","        /**","         * Drag coefficient for intertial scrolling at the upper","         * and lower boundaries of the scrollview. Set to 0 to","         * disable \"rubber-banding\".","         *","         * @attribute bounce","         * @type Number","         * @default 0.1","         */","        bounce: {","            value: 0.1","        },","","        /**","         * The minimum distance and/or velocity which define a flick. Can be set to false,","         * to disable flick support (note: drag support is enabled/disabled separately)","         *","         * @attribute flick","         * @type Object","         * @default Object with properties minDistance = 10, minVelocity = 0.3.","         */","        flick: {","            value: {","                minDistance: 10,","                minVelocity: 0.3","            }","        },","","        /**","         * Enable/Disable dragging the ScrollView content (note: flick support is enabled/disabled separately)","         * @attribute drag","         * @type boolean","         * @default true","         */","        drag: {","            value: true","        },","","        /**","         * Enable/Disable scrolling the ScrollView content via mousewheel","         * @attribute mousewheel","         * @type boolean","         * @default true","         */","        mousewheel: {","            value: true","        }","    },","","    /**","     * List of class names used in the scrollview's DOM","     *","     * @property CLASS_NAMES","     * @type Object","     * @static","     */","    CLASS_NAMES: CLASS_NAMES,","","    /**","     * Flag used to source property changes initiated from the DOM","     *","     * @property UI_SRC","     * @type String","     * @static","     * @default 'ui'","     */","    UI_SRC: UI,","","    /**","     * The default bounce distance in pixels","     *","     * @property BOUNCE_RANGE","     * @type Number","     * @static","     * @default 150","     */","    BOUNCE_RANGE: 150,","","    /**","     * The interval used when animating the flick","     *","     * @property FRAME_STEP","     * @type Number","     * @static","     * @default 16","     */","    FRAME_STEP: 16,","","    /**","     * The default easing used when animating the flick","     *","     * @property EASING","     * @type String","     * @static","     * @default 'cubic-bezier(0, 0.1, 0, 1.0)'","     */","    EASING: 'cubic-bezier(0, 0.1, 0, 1.0)',","","    /**","     * The default easing to use when animating the bounce snap back.","     *","     * @property SNAP_EASING","     * @type String","     * @static","     * @default 'ease-out'","     */","    SNAP_EASING: 'ease-out',","","    /**","     * The default duration to use when animating the bounce snap back.","     *","     * @property SNAP_DURATION","     * @type Number","     * @static","     * @default 400","     */","    SNAP_DURATION: 400,","","    /**","     * Object map of style property names used to set transition properties.","     * Defaults to the vendor prefix established by the Transition module.","     * The configured property names are `_TRANSITION.DURATION` (e.g. \"WebkitTransitionDuration\") and","     * `_TRANSITION.PROPERTY (e.g. \"WebkitTransitionProperty\").","     *","     * @property _TRANSITION","     * @private","     */","    _TRANSITION: {","        DURATION: Y.Transition._VENDOR_PREFIX + 'TransitionDuration',","        PROPERTY: Y.Transition._VENDOR_PREFIX + 'TransitionProperty'","    }","","    // End static properties","","});","","}, '@VERSION@', {\"requires\": [\"widget\", \"event-gestures\", \"event-mousewheel\", \"transition\"], \"skinnable\": true});"];
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].lines = {"1":0,"9":0,"46":0,"58":0,"59":0,"62":0,"73":0,"76":0,"77":0,"78":0,"88":0,"90":0,"91":0,"92":0,"94":0,"97":0,"98":0,"109":0,"113":0,"125":0,"136":0,"140":0,"142":0,"143":0,"155":0,"159":0,"161":0,"162":0,"174":0,"178":0,"181":0,"183":0,"195":0,"204":0,"205":0,"210":0,"211":0,"215":0,"218":0,"221":0,"224":0,"225":0,"237":0,"244":0,"245":0,"246":0,"249":0,"256":0,"267":0,"277":0,"278":0,"279":0,"280":0,"281":0,"282":0,"284":0,"285":0,"288":0,"289":0,"353":0,"354":0,"357":0,"367":0,"368":0,"369":0,"371":0,"372":0,"373":0,"376":0,"377":0,"378":0,"381":0,"383":0,"385":0,"389":0,"390":0,"391":0,"396":0,"397":0,"399":0,"400":0,"407":0,"408":0,"410":0,"411":0,"414":0,"415":0,"418":0,"433":0,"435":0,"436":0,"439":0,"450":0,"458":0,"508":0,"509":0,"515":0,"517":0,"518":0,"522":0,"523":0,"527":0,"566":0,"578":0,"579":0,"582":0,"583":0,"585":0,"586":0,"589":0,"590":0,"593":0,"594":0,"606":0,"613":0,"614":0,"617":0,"618":0,"621":0,"622":0,"623":0,"628":0,"629":0,"643":0,"651":0,"652":0,"655":0,"656":0,"657":0,"658":0,"659":0,"673":0,"691":0,"694":0,"696":0,"700":0,"701":0,"706":0,"707":0,"708":0,"710":0,"712":0,"713":0,"714":0,"716":0,"720":0,"732":0,"739":0,"741":0,"743":0,"747":0,"749":0,"750":0,"756":0,"759":0,"771":0,"782":0,"793":0,"804":0,"805":0,"807":0,"808":0,"812":0,"824":0,"830":0,"833":0,"834":0,"835":0,"838":0,"839":0,"842":0,"843":0,"845":0,"857":0,"869":0,"880":0,"891":0,"902":0,"913":0,"916":0,"917":0,"920":0,"921":0,"924":0,"925":0,"928":0,"947":0,"948":0};
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].functions = {"_constrain:45":0,"ScrollView:58":0,"initializer:72":0,"bindUI:87":0,"_bindAttrs:108":0,"_bindDrag:135":0,"_bindFlick:154":0,"_bindMousewheel:173":0,"syncUI:194":0,"_getScrollDims:236":0,"_uiDimensionsChange:266":0,"scrollTo:351":0,"_transform:431":0,"_onTransEnd:449":0,"_onGestureMoveStart:507":0,"_onGestureMove:565":0,"_onGestureMoveEnd:605":0,"_flick:642":0,"_flickFrame:671":0,"_mousewheel:731":0,"_isOOB:770":0,"_snapBack:792":0,"_afterScrollChange:823":0,"_afterFlickChange:856":0,"_afterDisabledChange:867":0,"_afterDragChange:879":0,"_afterMousewheelChange:890":0,"_afterDimChange:901":0,"_afterScrollEnd:912":0,"_axisSetter:945":0,"(anonymous 1):1":0};
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].coveredLines = 188;
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].coveredFunctions = 31;
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

    _constrain = function (val, min, max) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_constrain", 45);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 46);
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
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 58);
function ScrollView() {
    _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "ScrollView", 58);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 59);
ScrollView.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/scrollview-base/scrollview-base.js", 62);
Y.ScrollView = Y.extend(ScrollView, Y.Widget, {

    // *** Y.ScrollView prototype

    /**
     * Designated initializer
     *
     * @method initializer
     * @param {config} Configuration object for the plugin
     */
    initializer: function (config) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "initializer", 72);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 73);
var sv = this;

        // Cache these values, since they aren't going to change.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 76);
sv._bb = sv.get(BOUNDING_BOX);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 77);
sv._cb = sv.get(CONTENT_BOX);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 78);
sv._axis = sv.get(AXIS);
    },

    /**
     * bindUI implementation
     *
     * Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "bindUI", 87);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 88);
var sv = this;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 90);
sv._bindFlick(sv.get(FLICK));
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 91);
sv._bindDrag(sv.get(DRAG));
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 92);
sv._bindMousewheel(sv.get(MOUSEWHEEL));
        
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 94);
sv._bindAttrs();

        // IE SELECT HACK. See if we can do this non-natively and in the gesture for a future release.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 97);
if (IE) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 98);
sv._fixIESelect(sv._bb, sv._cb);
        }
    },

    /**
     * 
     *
     * @method _bindAttrs
     * @private
     */
    _bindAttrs: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindAttrs", 108);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 109);
var sv = this,
            scrollChangeHandler = sv._afterScrollChange,
            dimChangeHandler = sv._afterDimChange;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 113);
sv.after({
            'scrollEnd': sv._afterScrollEnd,
            'disabledChange': sv._afterDisabledChange,
            'flickChange': sv._afterFlickChange,
            'dragChange': sv._afterDragChange,
            'scrollYChange': scrollChangeHandler,
            'scrollXChange': scrollChangeHandler,
            'heightChange': dimChangeHandler,
            'widthChange': dimChangeHandler
        });

        // TODO: This should be throttled.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 125);
Y.one(WINDOW).after('resize', dimChangeHandler, sv);
    },

    /**
     * Bind (or unbind) gesture move listeners required for drag support
     *
     * @method _bindDrag
     * @param drag {boolean} If true, the method binds listener to enable drag (gesturemovestart). If false, the method unbinds gesturemove listeners for drag support.
     * @private
     */
    _bindDrag: function (drag) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindDrag", 135);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 136);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'drag' listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 140);
bb.detach(DRAG + '|*');

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 142);
if (drag) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 143);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindFlick", 154);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 155);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'flick' listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 159);
bb.detach(FLICK + '|*');

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 161);
if (flick) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 162);
bb.on(FLICK + '|' + FLICK, Y.bind(sv._flick, sv), flick);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindMousewheel", 173);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 174);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'mousewheel' listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 178);
bb.detach(MOUSEWHEEL + '|*');

        // Only enable for vertical scrollviews
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 181);
if (mousewheel) {
            // Bound to document, because that's where mousewheel events fire off of.
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 183);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "syncUI", 194);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 195);
var sv = this,
            axis = sv._axis,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight;

        // If the axis is undefined, auto-calculate it
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 204);
if (axis === undefined) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 205);
axis = {
                x: (scrollWidth > width),
                y: (scrollHeight > height)
            };

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 210);
sv._set(AXIS, axis);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 211);
sv._axis = axis;
        }

        // get text direction on or inherited by scrollview node
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 215);
sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');

        // Cache the disabled value
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 218);
sv._cDisabled = sv.get(DISABLED);

        // Run this to set initial values
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 221);
sv._uiDimensionsChange();

        // If we're out-of-bounds, snap back.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 224);
if (sv._isOOB()) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 225);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_getScrollDims", 236);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 237);
var sv = this,
            cb = sv._cb,
            bb = sv._bb,
            TRANS = ScrollView._TRANSITION,
            dims;

        // TODO: Is this OK? Just in case it's called 'during' a transition.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 244);
if (NATIVE_TRANSITIONS) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 245);
cb.setStyle(TRANS.DURATION, ZERO);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 246);
cb.setStyle(TRANS.PROPERTY, EMPTY);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 249);
dims = {
            'offsetWidth': bb.get('offsetWidth'),
            'offsetHeight': bb.get('offsetHeight'),
            'scrollWidth': bb.get('scrollWidth'),
            'scrollHeight': bb.get('scrollHeight')
        };

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 256);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_uiDimensionsChange", 266);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 267);
var sv = this,
            bb = sv._bb,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight,
            rtl = sv.rtl,
            axis = sv._axis;
        
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 277);
sv._minScrollX = (rtl) ? -(scrollWidth - width) : 0;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 278);
sv._maxScrollX = (rtl) ? 0 : (scrollWidth - width);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 279);
sv._minScrollY = 0;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 280);
sv._maxScrollY = scrollHeight - height;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 281);
sv._scrollWidth = scrollWidth;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 282);
sv._scrollHeight = scrollHeight;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 284);
if (axis.x) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 285);
bb.addClass(CLASS_NAMES.horizontal);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 288);
if (axis.y) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 289);
bb.addClass(CLASS_NAMES.vertical);
        }

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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "scrollTo", 351);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 353);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 354);
return;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 357);
var sv = this,
            cb = sv._cb,
            TRANS = ScrollView._TRANSITION,
            callback = Y.bind(sv._onTransEnd, sv), // @Todo : cache this
            newX = 0,
            newY = 0,
            transition = {},
            transform;

        // default the optional arguments
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 367);
duration = duration || 0;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 368);
easing = easing || ScrollView.EASING;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 369);
node = node || cb;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 371);
if (x !== null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 372);
sv.set(SCROLL_X, x, {src:UI});
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 373);
newX = -(x);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 376);
if (y !== null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 377);
sv.set(SCROLL_Y, y, {src:UI});
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 378);
newY = -(y);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 381);
transform = sv._transform(newX, newY);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 383);
if (NATIVE_TRANSITIONS) {
            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 385);
node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);
        }

        // Move
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 389);
if (duration === 0) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 390);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 391);
node.setStyle('transform', transform);
            }
            else {
                // TODO: If both set, batch them in the same update
                // Update: Nope, setStyles() just loops through each property and applies it.
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 396);
if (x !== null) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 397);
node.setStyle(LEFT, newX + PX);
                }
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 399);
if (y !== null) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 400);
node.setStyle(TOP, newY + PX);
                }
            }
        }

        // Animate
        else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 407);
transition.easing = easing;
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 408);
transition.duration = duration / 1000;

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 410);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 411);
transition.transform = transform;
            }
            else {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 414);
transition.left = newX + PX;
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 415);
transition.top = newY + PX;
            }

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 418);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_transform", 431);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 433);
var prop = 'translate(' + x + 'px, ' + y + 'px)';

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 435);
if (this._forceHWTransforms) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 436);
prop += ' translateZ(0)';
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 439);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onTransEnd", 449);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 450);
var sv = this;

        /**
         * Notification event fired at the end of a scroll transition
         *
         * @event scrollEnd
         * @param e {EventFacade} The default event facade.
         */
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 458);
sv.fire(EV_SCROLL_END);
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
     * gesturemovestart event handler
     *
     * @method _onGestureMoveStart
     * @param e {Event.Facade} The gesturemovestart event facade
     * @private
     */
    _onGestureMoveStart: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMoveStart", 507);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 508);
if (!this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 509);
var sv = this,
                bb = sv._bb,
                currentX = sv.get(SCROLL_X),
                currentY = sv.get(SCROLL_Y);

            // TODO: Review if neccesary (#2530129)
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 515);
e.stopPropagation();

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 517);
if (sv._prevent.start) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 518);
e.preventDefault();
            }

            // if a flick animation is in progress, cancel it
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 522);
if (sv._flickAnim) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 523);
sv._flickAnim.cancel();
            }

            // Stores data for this gesture cycle.  Cleaned up later
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 527);
sv._gesture = {

                // Will hold the axis value
                axis: null,

                // The current attribute values
                startX: currentX,
                startY: currentY,

                // The X/Y coordinates where the event began
                startClientX: e.clientX,
                startClientY: e.clientY,

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
                onGestureMoveEnd: bb.on(DRAG + '|' + GESTURE_MOVE + END, Y.bind(sv._onGestureMoveEnd, sv))
            };
        }
    },

    /**
     * gesturemove event handler
     *
     * @method _onGestureMove
     * @param e {Event.Facade} The gesturemove event facade
     * @private
     */
    _onGestureMove: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMove", 565);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 566);
var sv = this,
            gesture = sv._gesture,
            svAxis = sv._axis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            startX = gesture.startX,
            startY = gesture.startY,
            startClientX = gesture.startClientX,
            startClientY = gesture.startClientY,
            clientX = e.clientX,
            clientY = e.clientY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 578);
if (sv._prevent.move) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 579);
e.preventDefault();
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 582);
gesture.deltaX = startClientX - clientX;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 583);
gesture.deltaY = startClientY - clientY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 585);
if (gesture.axis === null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 586);
gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 589);
if (gesture.axis === DIM_X && svAxisX) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 590);
sv.set(SCROLL_X, startX + gesture.deltaX);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 593);
if (gesture.axis === DIM_Y && svAxisY) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 594);
sv.set(SCROLL_Y, startY + gesture.deltaY);
        }
    },

    /**
     * gesturemoveend event handler
     *
     * @method _onGestureMoveEnd
     * @param e {Event.Facade} The gesturemoveend event facade
     * @private
     */
    _onGestureMoveEnd: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMoveEnd", 605);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 606);
var sv = this,
            gesture = sv._gesture,
            flick = gesture.flick,
            clientX = e.clientX,
            clientY = e.clientY,
            isOOB;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 613);
if (sv._prevent.end) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 614);
e.preventDefault();
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 617);
gesture.endClientX = clientX;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 618);
gesture.endClientY = clientY;

        // Only if this gesture wasn't a flick, and there was movement
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 621);
if (!flick && gesture.deltaX !== null && gesture.deltaY !== null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 622);
if (sv._isOOB()) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 623);
sv._snapBack();
            }
            else {
                // Don't fire scrollEnd on the gesture axis is the same as paginator's
                // Not totally confident this is ideal to access a plugin's properties from a host, @TODO revisit
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 628);
if (sv.pages && !sv.pages.axis[gesture.axis]) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 629);
sv._onTransEnd();
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_flick", 642);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 643);
var sv = this,
            gesture = sv._gesture,
            svAxis = sv._axis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            flick = e.flick,
            flickAxis;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 651);
if (!sv._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 652);
flickAxis = flick.axis;

            // We can't scroll on this axis, so prevent unneccesary firing of _flickFrame
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 655);
if ((flickAxis === DIM_X && svAxisX) || (flickAxis === DIM_Y && svAxisY)) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 656);
gesture.flick = flick;
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 657);
sv._cDecel = sv.get(DECELERATION);
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 658);
sv._cBounce = sv.get(BOUNCE);
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 659);
sv._flickFrame(flick.velocity);
            }
        }
    },

    /**
     * Execute a single frame in the flick animation
     *
     * @method _flickFrame
     * @param velocity {Number} The velocity of this animated frame
     * @protected
     */
    _flickFrame: function (velocity) {

        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_flickFrame", 671);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 673);
var sv = this,
            gesture = sv._gesture,
            flickAxis = gesture.flick.axis,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            maxX = sv._maxScrollX,
            minY = sv._minScrollY,
            maxY = sv._maxScrollY,
            deceleration = sv._cDecel,
            bounce = sv._cBounce,
            svAxis = sv._axis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            step = ScrollView.FRAME_STEP,
            newX = currentX - (velocity * step),
            newY = currentY - (velocity * step);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 691);
velocity *= deceleration;

        // If we are out of bounds
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 694);
if (sv._isOOB()) {
            // We're past an edge, now bounce back
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 696);
sv._snapBack();
        }
        
        // If the velocity gets slow enough, just stop
        else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 700);
if (Math.abs(velocity).toFixed(4) <= 0.015) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 701);
sv._onTransEnd();
        }

        // Otherwise, animate to the next frame
        else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 706);
if (flickAxis === DIM_X && svAxisX) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 707);
if (newX < minX || newX > maxX) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 708);
velocity *= bounce;
                }
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 710);
sv.set(SCROLL_X, newX);
            }
            else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 712);
if (flickAxis === DIM_Y && svAxisY) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 713);
if (newY < minY || newY > maxY) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 714);
velocity *= bounce;
                }
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 716);
sv.set(SCROLL_Y, newY);
            }}

            // TODO: maybe use requestAnimationFrame instead
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 720);
sv._flickAnim = Y.later(step, sv, '_flickFrame', [velocity]);
        }}
    },

    /**
     * Handle mousewheel events on the widget
     *
     * @method _mousewheel
     * @param e {Event.Facade} The mousewheel event facade
     * @private
     */
    _mousewheel: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_mousewheel", 731);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 732);
var sv = this,
            scrollY = sv.get(SCROLL_Y),
            bb = sv._bb,
            scrollOffset = 10, // 10px
            isForward = (e.wheelDelta > 0),
            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 739);
scrollToY = _constrain(scrollToY, sv._minScrollY, sv._maxScrollY);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 741);
if (bb.contains(e.target)) {
            // Jump to the new offset
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 743);
sv.set(SCROLL_Y, scrollToY);

            // if we have scrollbars plugin, update & set the flash timer on the scrollbar
            // TODO: This probably shouldn't be in this module
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 747);
if (sv.scrollbars) {
                // TODO: The scrollbars should handle this themselves
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 749);
sv.scrollbars._update();
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 750);
sv.scrollbars.flash();
                // or just this
                // sv.scrollbars._hostDimensionsChange();
            }

            // Fire the 'scrollEnd' event
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 756);
sv._onTransEnd();

            // prevent browser default behavior on mouse scroll
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 759);
e.preventDefault();
        }
    },

    /**
     * Checks to see the current scrollX/scrollY position is out of bounds
     *
     * @method _isOOB
     * @returns {boolen} Whether the current X/Y position is out of bounds (true) or not (false)
     * @private
     */
    _isOOB: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_isOOB", 770);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 771);
var sv = this,
            svAxis = sv._axis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            minY = sv._minScrollY,
            maxX = sv._maxScrollX,
            maxY = sv._maxScrollY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 782);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_snapBack", 792);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 793);
var sv = this,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            minY = sv._minScrollY,
            maxX = sv._maxScrollX,
            maxY = sv._maxScrollY,
            newY = _constrain(currentY, minY, maxY),
            newX = _constrain(currentX, minX, maxX),
            duration = ScrollView.SNAP_DURATION;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 804);
if (newX !== currentX) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 805);
sv.set(SCROLL_X, newX, {duration:duration});
        }
        else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 807);
if (newY !== currentY) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 808);
sv.set(SCROLL_Y, newY, {duration:duration});
        }
        else {
            // It shouldn't ever get here, but in case it does, fire scrollEnd
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 812);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterScrollChange", 823);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 824);
var sv = this,
            duration = e.duration,
            easing = e.easing,
            val = e.newVal,
            scrollToArgs = [];

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 830);
if (e.src !== ScrollView.UI_SRC) {

            // Generate the array of args to pass to scrollTo()
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 833);
if (e.attrName === SCROLL_X) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 834);
scrollToArgs.push(val);
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 835);
scrollToArgs.push(sv.get(SCROLL_Y));
            }
            else {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 838);
scrollToArgs.push(sv.get(SCROLL_X));
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 839);
scrollToArgs.push(val);
            }

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 842);
scrollToArgs.push(duration);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 843);
scrollToArgs.push(easing);

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 845);
sv.scrollTo.apply(sv, scrollToArgs);
        }
    },

    /**
     * After listener for changes to the flick attribute
     *
     * @method _afterFlickChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterFlickChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterFlickChange", 856);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 857);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDisabledChange", 867);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 869);
this._cDisabled = e.newVal;
    },

    /**
     * After listener for changes to the drag attribute
     *
     * @method _afterDragChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDragChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDragChange", 879);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 880);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterMousewheelChange", 890);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 891);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDimChange", 901);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 902);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterScrollEnd", 912);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 913);
var sv = this,
            gesture = sv._gesture;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 916);
if (gesture && gesture.onGestureMove && gesture.onGestureMove.detach) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 917);
gesture.onGestureMove.detach();
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 920);
if (gesture && gesture.onGestureMoveEnd && gesture.onGestureMoveEnd.detach) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 921);
gesture.onGestureMoveEnd.detach();
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 924);
if (sv._flickAnim) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 925);
sv._flickAnim.cancel(); // Might as well?
        }
        
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 928);
delete sv._flickAnim;

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
        // Turn the string into an axis object
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_axisSetter", 945);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 947);
if (Y.Lang.isString(val)) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 948);
return {
                x: val.match(/x/i),
                y: val.match(/y/i)
            };
        }
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
         * The scroll position in the y-axis
         *
         * @attribute scrollY
         * @type Number
         * @default 0
         */
        scrollY: {
            value: 0
        },

        /**
         * The scroll position in the x-axis
         *
         * @attribute scrollX
         * @type Number
         * @default 0
         */
        scrollX: {
            value: 0
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
        },

        /**
         * Enable/Disable scrolling the ScrollView content via mousewheel
         * @attribute mousewheel
         * @type boolean
         * @default true
         */
        mousewheel: {
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
     * @default 'ui'
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
    BOUNCE_RANGE: 150,

    /**
     * The interval used when animating the flick
     *
     * @property FRAME_STEP
     * @type Number
     * @static
     * @default 16
     */
    FRAME_STEP: 16,

    /**
     * The default easing used when animating the flick
     *
     * @property EASING
     * @type String
     * @static
     * @default 'cubic-bezier(0, 0.1, 0, 1.0)'
     */
    EASING: 'cubic-bezier(0, 0.1, 0, 1.0)',

    /**
     * The default easing to use when animating the bounce snap back.
     *
     * @property SNAP_EASING
     * @type String
     * @static
     * @default 'ease-out'
     */
    SNAP_EASING: 'ease-out',

    /**
     * The default duration to use when animating the bounce snap back.
     *
     * @property SNAP_DURATION
     * @type Number
     * @static
     * @default 400
     */
    SNAP_DURATION: 400,

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
    }

    // End static properties

});

}, '@VERSION@', {"requires": ["widget", "event-gestures", "event-mousewheel", "transition"], "skinnable": true});
