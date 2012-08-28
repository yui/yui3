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
_yuitest_coverage["scrollview-base"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "scrollview-base",
    code: []
};
_yuitest_coverage["scrollview-base"].code=["YUI.add('scrollview-base', function (Y, NAME) {","","/*global YUI,Y*/","","/**"," * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators"," *"," * @module scrollview-base"," */","var getClassName = Y.ClassNameManager.getClassName,","    DOCUMENT = Y.config.doc,","    WINDOW = Y.config.win,","    IE = Y.UA.ie,","    NATIVE_TRANSITIONS = Y.Transition.useNative,","    SCROLLVIEW = 'scrollview',","    CLASS_NAMES = {","        vertical: getClassName(SCROLLVIEW, 'vert'),","        horizontal: getClassName(SCROLLVIEW, 'horiz')","    },","    EV_SCROLL_END = 'scrollEnd',","    FLICK = 'flick',","    DRAG = 'drag',","    MOUSEWHEEL = 'mousewheel',","    UI = 'ui',","    TOP = 'top',","    RIGHT = 'right',","    BOTTOM = 'bottom',","    LEFT = 'left',","    PX = 'px',","    AXIS = 'axis',","    SCROLL_Y = 'scrollY',","    SCROLL_X = 'scrollX',","    BOUNCE = 'bounce',","    DISABLED = 'disabled',","    DECELERATION = 'deceleration',","    DIM_X = 'x',","    DIM_Y = 'y',","    BOUNDING_BOX = 'boundingBox',","    CONTENT_BOX = 'contentBox',","    GESTURE_MOVE = 'gesturemove',","    START = 'start',","    END = 'end',","    EMPTY = '',","    ZERO = '0s',","","    _constrain = function (val, min, max) {","        return Math.min(Math.max(val, min), max);","    };","","/**"," * ScrollView provides a scrollable widget, supporting flick gestures,"," * across both touch and mouse based devices."," *"," * @class ScrollView"," * @param config {Object} Object literal with initial attribute values"," * @extends Widget"," * @constructor"," */","function ScrollView() {","    ScrollView.superclass.constructor.apply(this, arguments);","}","","Y.ScrollView = Y.extend(ScrollView, Y.Widget, {","","    // *** Y.ScrollView prototype","","    /**","     * Designated initializer","     *","     * @method initializer","     * @param {config} Configuration object for the plugin","     */","    initializer: function (config) {","        var sv = this,","            axis = 'auto'; // Default axis to 'auto' and let the calculation happen in syncUI","","        // Cache these values, since they aren't going to change.","        sv._bb = sv.get(BOUNDING_BOX);","        sv._cb = sv.get(CONTENT_BOX);","","        // Determine the axis settings if a value was passed in","        if (config.axis) {","            config.axis = config.axis.toLowerCase();","            switch (config.axis) {","                case \"x\":","                    axis = {","                        x: true,","                        y: false","                    };","                    break;","                ","                case \"y\":","                    axis = {","                        x: false,","                        y: true","                    };","                    break;","","                // Unsupported ATM.  For future development purposes.","                case \"xy\":","                case \"yx\":","                    if (config._multiaxis) {","                        axis = {","                            x: true,","                            y: true","                        };","                    }","                    break;","            }","        }","","        /**","         * Contains an object that specifies if the widget can scroll on a X and/or Y axis","         *","         * @property axis","         * @type Object","         * @public","         */","        sv.axis = axis;","    },","","    /**","     * bindUI implementation","     *","     * Hooks up events for the widget","     * @method bindUI","     */","    bindUI: function () {","        var sv = this;","","        sv._bindFlick(sv.get(FLICK));","        sv._bindDrag(sv.get(DRAG));","        sv._bindMousewheel(sv.get(MOUSEWHEEL));","        ","        sv._bindAttrs();","    },","","    /**","     * ","     *","     * @method _bindAttrs","     * @private","     */","    _bindAttrs: function () {","        var sv = this,","            scrollChangeHandler = sv._afterScrollChange,","            dimChangeHandler = sv._afterDimChange;","","        sv.after({","            'scrollEnd': sv._afterScrollEnd,","            'disabledChange': sv._afterDisabledChange,","            'flickChange': sv._afterFlickChange,","            'dragChange': sv._afterDragChange,","            'scrollYChange': scrollChangeHandler,","            'scrollXChange': scrollChangeHandler,","            'heightChange': dimChangeHandler,","            'widthChange': dimChangeHandler","        });","","        // TODO: This should be throttled.","        Y.one(WINDOW).after('resize', dimChangeHandler, sv);","    },","","    /**","     * Bind (or unbind) gesture move listeners required for drag support","     *","     * @method _bindDrag","     * @param drag {boolean} If true, the method binds listener to enable drag (gesturemovestart). If false, the method unbinds gesturemove listeners for drag support.","     * @private","     */","    _bindDrag: function (drag) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'drag' listeners","        bb.detach(DRAG + '|*');","","        if (drag) {","            bb.on(DRAG + '|' + GESTURE_MOVE + START, Y.bind(sv._onGestureMoveStart, sv));","        }","    },","","    /**","     * Bind (or unbind) flick listeners.","     *","     * @method _bindFlick","     * @param flick {Object|boolean} If truthy, the method binds listeners for flick support. If false, the method unbinds flick listeners.","     * @private","     */","    _bindFlick: function (flick) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'flick' listeners","        bb.detach(FLICK + '|*');","","        if (flick) {","            bb.on(FLICK + '|' + FLICK, Y.bind(sv._flick, sv), flick);","        }","    },","","    /**","     * Bind (or unbind) mousewheel listeners.","     *","     * @method _bindMousewheel","     * @param mousewheel {Object|boolean} If truthy, the method binds listeners for mousewheel support. If false, the method unbinds mousewheel listeners.","     * @private","     */","    _bindMousewheel: function (mousewheel) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'mousewheel' listeners","        bb.detach(MOUSEWHEEL + '|*');","","        // Only enable for vertical scrollviews","        if (mousewheel) {","            // Bound to document, because that's where mousewheel events fire off of.","            Y.one(DOCUMENT).on(MOUSEWHEEL, Y.bind(sv._mousewheel, sv));","        }","    },","","    /**","     * syncUI implementation.","     *","     * Update the scroll position, based on the current value of scrollX/scrollY.","     *","     * @method syncUI","     */","    syncUI: function () {","        var sv = this,","            axis = sv.axis,","            scrollDims = sv._getScrollDims(),","            width = scrollDims.offsetWidth,","            height = scrollDims.offsetHeight,","            scrollWidth = scrollDims.scrollWidth,","            scrollHeight = scrollDims.scrollHeight;","","        // If the axis should be auto-calculated, do it.","        if (axis === \"auto\") {","            axis = {","                x: (scrollWidth > width),","                y: (scrollHeight > height)","            };","            sv.axis = axis;","        }","","        // get text direction on or inherited by scrollview node","        sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');","","        // Cache the disabled value","        sv._cDisabled = sv.get(DISABLED);","","        // Run this to set initial values","        sv._uiDimensionsChange();","","        // If we're out-of-bounds, snap back.","        if (sv._isOOB()) {","            sv._snapBack();","        }","    },","","    /**","     * Utility method to obtain widget dimensions","     * ","     * @method _getScrollDims","     * @returns {Object} The offsetWidth, offsetHeight, scrollWidth and scrollHeight as an array: [offsetWidth, offsetHeight, scrollWidth, scrollHeight]","     * @private","     */","    _getScrollDims: function () {","        var sv = this,","            cb = sv._cb,","            bb = sv._bb,","            TRANS = ScrollView._TRANSITION,","            dims;","","        // TODO: Is this OK? Just in case it's called 'during' a transition.","        if (NATIVE_TRANSITIONS) {","            cb.setStyle(TRANS.DURATION, ZERO);","            cb.setStyle(TRANS.PROPERTY, EMPTY);","        }","","        dims = {","            'offsetWidth': bb.get('offsetWidth'),","            'offsetHeight': bb.get('offsetHeight'),","            'scrollWidth': bb.get('scrollWidth'),","            'scrollHeight': bb.get('scrollHeight')","        };","","        return dims;","    },","","    /**","     * This method gets invoked whenever the height or width attributes change,","     * allowing us to determine which scrolling axes need to be enabled.","     *","     * @method _uiDimensionsChange","     * @protected","     */","    _uiDimensionsChange: function () {","        var sv = this,","            bb = sv._bb,","            scrollDims = sv._getScrollDims(),","            width = scrollDims.offsetWidth,","            height = scrollDims.offsetHeight,","            scrollWidth = scrollDims.scrollWidth,","            scrollHeight = scrollDims.scrollHeight,","            rtl = sv.rtl,","            axis = sv.axis;","        ","        sv._minScrollX = (rtl) ? -(scrollWidth - width) : 0;","        sv._maxScrollX = (rtl) ? 0 : (scrollWidth - width);","        sv._minScrollY = 0;","        sv._maxScrollY = scrollHeight - height;","        sv._scrollWidth = scrollWidth;","        sv._scrollHeight = scrollHeight;","","        if (axis.x) {","            bb.addClass(CLASS_NAMES.horizontal);","        }","","        if (axis.y) {","            bb.addClass(CLASS_NAMES.vertical);","        }","","        /**","         * Internal state, defines the maximum amount that the scrollview can be scrolled along the Y axis","         *","         * @property _maxScrollY","         * @type number","         * @protected","         */","","        /**","         * Internal state, defines the minimum amount that the scrollview can be scrolled along the Y axis","         *","         * @property _minScrollY","         * @type number","         * @protected","         */","","        /**","         * Internal state, cached scrollHeight, for performance","         *","         * @property _scrollHeight","         * @type number","         * @protected","         */","","        /**","         * Internal state, defines the maximum amount that the scrollview can be scrolled along the X axis","         *","         * @property _maxScrollX","         * @type number","         * @protected","         */","","        /**","         * Internal state, defines the minimum amount that the scrollview can be scrolled along the X axis","         *","         * @property _minScrollX","         * @type number","         * @protected","         */","","        /**","         * Internal state, cached scrollWidth, for performance","         *","         * @property _scrollWidth","         * @type number","         * @protected","         */","    },","","    /**","     * Scroll the element to a given xy coordinate","     *","     * @method scrollTo","     * @param x {Number} The x-position to scroll to","     * @param y {Number} The y-position to scroll to","     * @param duration {Number} Duration, in ms, of the scroll animation (default is 0)","     * @param easing {String} An easing equation if duration is set","     * @param node {String} The node to move","     */","    scrollTo: function (x, y, duration, easing, node) {","","        // Check to see if widget is disabled","        if (this._cDisabled) {","            return;","        }","","        var sv = this,","            cb = sv._cb,","            TRANS = ScrollView._TRANSITION,","            callback = Y.bind(sv._onTransEnd, sv), // @Todo : cache this","            newX = 0,","            newY = 0,","            transition = {},","            transform;","","        // default the optional arguments","        duration = duration || 0;","        easing = easing || ScrollView.EASING;","        node = node || cb;","","        if (x !== null) {","            sv.set(SCROLL_X, x, {src:UI});","            newX = -(x);","        }","","        if (y !== null) {","            sv.set(SCROLL_Y, y, {src:UI});","            newY = -(y);","        }","","        transform = sv._transform(newX, newY);","","        if (NATIVE_TRANSITIONS) {","            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.","            node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);","        }","","        // Move","        if (duration === 0) {","            if (NATIVE_TRANSITIONS) {","                node.setStyle('transform', transform);","            }","            else {","                // TODO: If both set, batch them in the same update","                // Update: Nope, setStyles() just loops through each property and applies it.","                if (x !== null) {","                    node.setStyle(LEFT, newX + PX);","                }","                if (y !== null) {","                    node.setStyle(TOP, newY + PX);","                }","            }","        }","","        // Animate","        else {","            transition.easing = easing;","            transition.duration = duration / 1000;","","            if (NATIVE_TRANSITIONS) {","                transition.transform = transform;","            }","            else {","                transition.left = newX + PX;","                transition.top = newY + PX;","            }","","            node.transition(transition, callback);","        }","    },","","    /**","     * Utility method, to create the translate transform string with the","     * x, y translation amounts provided.","     *","     * @method _transform","     * @param {Number} x Number of pixels to translate along the x axis","     * @param {Number} y Number of pixels to translate along the y axis","     * @private","     */","    _transform: function (x, y) {","        // TODO: Would we be better off using a Matrix for this?","        var prop = 'translate(' + x + 'px, ' + y + 'px)';","","        if (this._forceHWTransforms) {","            prop += ' translateZ(0)';","        }","","        return prop;","    },","","    /**","     * Content box transition callback","     *","     * @method _onTransEnd","     * @param {Event.Facade} e The event facade","     * @private","     */","    _onTransEnd: function (e) {","        var sv = this;","","        /**","         * Notification event fired at the end of a scroll transition","         *","         * @event scrollEnd","         * @param e {EventFacade} The default event facade.","         */","        sv.fire(EV_SCROLL_END);","    },","","    /**","     * Flag driving whether or not we should try and force H/W acceleration when transforming. Currently enabled by default for Webkit.","     * Used by the _transform method.","     *","     * @property _forceHWTransforms","     * @type boolean","     * @protected","     */","    _forceHWTransforms: Y.UA.webkit ? true : false,","","    /**","     * <p>Used to control whether or not ScrollView's internal","     * gesturemovestart, gesturemove and gesturemoveend","     * event listeners should preventDefault. The value is an","     * object, with \"start\", \"move\" and \"end\" properties used to","     * specify which events should preventDefault and which shouldn't:</p>","     *","     * <pre>","     * {","     *    start: false,","     *    move: true,","     *    end: false","     * }","     * </pre>","     *","     * <p>The default values are set up in order to prevent panning,","     * on touch devices, while allowing click listeners on elements inside","     * the ScrollView to be notified as expected.</p>","     *","     * @property _prevent","     * @type Object","     * @protected","     */","    _prevent: {","        start: false,","        move: true,","        end: false","    },","","    /**","     * gesturemovestart event handler","     *","     * @method _onGestureMoveStart","     * @param e {Event.Facade} The gesturemovestart event facade","     * @private","     */","    _onGestureMoveStart: function (e) {","        if (!this._cDisabled) {","            var sv = this,","                bb = sv._bb,","                currentX = sv.get(SCROLL_X),","                currentY = sv.get(SCROLL_Y);","","            // TODO: Review if neccesary (#2530129)","            e.stopPropagation();","","            if (sv._prevent.start) {","                e.preventDefault();","            }","","            // if a flick animation is in progress, cancel it","            if (sv._flickAnim) {","                sv._flickAnim.cancel();","            }","","            // Stores data for this gesture cycle.  Cleaned up later","            sv._gesture = {","","                // Will hold the axis value","                axis: null,","","                // The current attribute values","                startX: currentX,","                startY: currentY,","","                // The X/Y coordinates where the event began","                startClientX: e.clientX,","                startClientY: e.clientY,","","                // The X/Y coordinates where the event will end","                endClientX: null,","                endClientY: null,","","                // The current delta of the event","                deltaX: null,","                deltaY: null,","","                // Will be populated for flicks","                flick: null,","","                // Create some listeners for the rest of the gesture cycle","                onGestureMove: bb.on(DRAG + '|' + GESTURE_MOVE, Y.bind(sv._onGestureMove, sv)),","                onGestureMoveEnd: bb.on(DRAG + '|' + GESTURE_MOVE + END, Y.bind(sv._onGestureMoveEnd, sv))","            };","        }","    },","","    /**","     * gesturemove event handler","     *","     * @method _onGestureMove","     * @param e {Event.Facade} The gesturemove event facade","     * @private","     */","    _onGestureMove: function (e) {","        var sv = this,","            gesture = sv._gesture,","            svAxis = sv.axis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            startX = gesture.startX,","            startY = gesture.startY,","            startClientX = gesture.startClientX,","            startClientY = gesture.startClientY,","            clientX = e.clientX,","            clientY = e.clientY;","","        if (sv._prevent.move) {","            e.preventDefault();","        }","","        gesture.deltaX = startClientX - clientX;","        gesture.deltaY = startClientY - clientY;","","        if (gesture.axis === null) {","            gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;","        }","","        if (gesture.axis === DIM_X && svAxisX) {","            sv.set(SCROLL_X, startX + gesture.deltaX);","        }","","        if (gesture.axis === DIM_Y && svAxisY) {","            sv.set(SCROLL_Y, startY + gesture.deltaY);","        }","    },","","    /**","     * gesturemoveend event handler","     *","     * @method _onGestureMoveEnd","     * @param e {Event.Facade} The gesturemoveend event facade","     * @private","     */","    _onGestureMoveEnd: function (e) {","        var sv = this,","            gesture = sv._gesture,","            flick = gesture.flick,","            clientX = e.clientX,","            clientY = e.clientY,","            isOOB;","","        if (sv._prevent.end) {","            e.preventDefault();","        }","","        gesture.endClientX = clientX;","        gesture.endClientY = clientY;","","        // Only if this gesture wasn't a flick, and there was movement","        if (!flick && gesture.deltaX !== null && gesture.deltaY !== null) {","            if (sv._isOOB()) {","                sv._snapBack();","            }","            else {","                // Don't fire scrollEnd on the gesture axis is the same as paginator's","                // Not totally confident this is a good idea","                if (sv.pages && sv.pages.get('axis') !== gesture.axis) {","                    sv._onTransEnd();","                }","            }","        }","    },","","    /**","     * Execute a flick at the end of a scroll action","     *","     * @method _flick","     * @param e {Event.Facade} The Flick event facade","     * @private","     */","    _flick: function (e) {","        var sv = this,","            gesture = sv._gesture,","            svAxis = sv.axis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            flick = e.flick,","            flickAxis;","","        if (!sv._cDisabled) {","            flickAxis = flick.axis;","","            // We can't scroll on this axis, so prevent unneccesary firing of _flickFrame","            if ((flickAxis === DIM_X && svAxisX) || (flickAxis === DIM_Y && svAxisY)) {","                gesture.flick = flick;","                sv._cDecel = sv.get(DECELERATION);","                sv._cBounce = sv.get(BOUNCE);","                sv._flickFrame(flick.velocity);","            }","        }","    },","","    /**","     * Execute a single frame in the flick animation","     *","     * @method _flickFrame","     * @param velocity {Number} The velocity of this animated frame","     * @protected","     */","    _flickFrame: function (velocity) {","","        var sv = this,","            gesture = sv._gesture,","            flickAxis = gesture.flick.axis,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            minX = sv._minScrollX,","            maxX = sv._maxScrollX,","            minY = sv._minScrollY,","            maxY = sv._maxScrollY,","            deceleration = sv._cDecel,","            bounce = sv._cBounce,","            svAxis = sv.axis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            step = ScrollView.FRAME_STEP,","            newX = currentX - (velocity * step),","            newY = currentY - (velocity * step);","","        velocity *= deceleration;","","        // If we are out of bounds","        if (sv._isOOB()) {","            // We're past an edge, now bounce back","            sv._snapBack();","        }","        ","        // If the velocity gets slow enough, just stop","        else if (Math.abs(velocity).toFixed(4) <= 0.015) {","            sv._onTransEnd();","        }","","        // Otherwise, animate to the next frame","        else {","            if (flickAxis === DIM_X && svAxisX) {","                if (newX < minX || newX > maxX) {","                    velocity *= bounce;","                }","                sv.set(SCROLL_X, newX);","            }","            else if (flickAxis === DIM_Y && svAxisY) {","                if (newY < minY || newY > maxY) {","                    velocity *= bounce;","                }","                sv.set(SCROLL_Y, newY);","            }","","            // TODO: maybe use requestAnimationFrame instead","            sv._flickAnim = Y.later(step, sv, '_flickFrame', [velocity]);","        }","    },","","    /**","     * Handle mousewheel events on the widget","     *","     * @method _mousewheel","     * @param e {Event.Facade} The mousewheel event facade","     * @private","     */","    _mousewheel: function (e) {","        var sv = this,","            scrollY = sv.get(SCROLL_Y),","            bb = sv._bb,","            scrollOffset = 10, // 10px","            isForward = (e.wheelDelta > 0),","            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);","","        scrollToY = _constrain(scrollToY, sv._minScrollY, sv._maxScrollY);","","        if (bb.contains(e.target)) {","            // Jump to the new offset","            sv.set(SCROLL_Y, scrollToY);","","            // if we have scrollbars plugin, update & set the flash timer on the scrollbar","            // TODO: This probably shouldn't be in this module","            if (sv.scrollbars) {","                // TODO: The scrollbars should handle this themselves","                sv.scrollbars._update();","                sv.scrollbars.flash();","                // or just this","                // sv.scrollbars._hostDimensionsChange();","            }","","            // Fire the 'scrollEnd' event","            sv._onTransEnd();","","            // prevent browser default behavior on mouse scroll","            e.preventDefault();","        }","    },","","    /**","     * Checks to see the current scrollX/scrollY position is out of bounds","     *","     * @method _isOOB","     * @returns {boolen} Whether the current X/Y position is out of bounds (true) or not (false)","     * @private","     */","    _isOOB: function () {","        var sv = this,","            svAxis = sv.axis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            minX = sv._minScrollX,","            minY = sv._minScrollY,","            maxX = sv._maxScrollX,","            maxY = sv._maxScrollY;","","        return (svAxisX && (currentX < minX || currentX > maxX)) || (svAxisY && (currentY < minY || currentY > maxY));","    },","","    /**","     * Bounces back","     * @TODO: Should be more generalized and support both X and Y detection","     *","     * @method _snapBack","     * @private","     */","    _snapBack: function () {","        var sv = this,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            minX = sv._minScrollX,","            minY = sv._minScrollY,","            maxX = sv._maxScrollX,","            maxY = sv._maxScrollY,","            newY = _constrain(currentY, minY, maxY),","            newX = _constrain(currentX, minX, maxX),","            duration = ScrollView.SNAP_DURATION;","","        if (newX !== currentX) {","            sv.set(SCROLL_X, newX, {duration:duration});","        }","        else if (newY !== currentY) {","            sv.set(SCROLL_Y, newY, {duration:duration});","        }","        else {","            // It shouldn't ever get here, but in case it does, fire scrollEnd","            sv._onTransEnd();","        }","    },","","    /**","     * After listener for changes to the scrollX or scrollY attribute","     *","     * @method _afterScrollChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterScrollChange: function (e) {","        var sv = this,","            duration = e.duration,","            easing = e.easing,","            val = e.newVal,","            scrollToArgs = [];","","        if (e.src !== ScrollView.UI_SRC) {","","            // Generate the array of args to pass to scrollTo()","            if (e.attrName === SCROLL_X) {","                scrollToArgs.push(val);","                scrollToArgs.push(sv.get(SCROLL_Y));","            }","            else {","                scrollToArgs.push(sv.get(SCROLL_X));","                scrollToArgs.push(val);","            }","","            scrollToArgs.push(duration);","            scrollToArgs.push(easing);","","            sv.scrollTo.apply(sv, scrollToArgs);","        }","    },","","    /**","     * After listener for changes to the flick attribute","     *","     * @method _afterFlickChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterFlickChange: function (e) {","        this._bindFlick(e.newVal);","    },","","    /**","     * After listener for changes to the disabled attribute","     *","     * @method _afterDisabledChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDisabledChange: function (e) {","        // Cache for performance - we check during move","        this._cDisabled = e.newVal;","    },","","    /**","     * After listener for changes to the drag attribute","     *","     * @method _afterDragChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDragChange: function (e) {","        this._bindDrag(e.newVal);","    },","","    /**","     * After listener for changes to the drag attribute","     *","     * @method _afterDragChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterMousewheelChange: function (e) {","        this._bindMousewheel(e.newVal);","    },","","    /**","     * After listener for the height or width attribute","     *","     * @method _afterDimChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDimChange: function () {","        this._uiDimensionsChange();","    },","","    /**","     * After listener for scrollEnd, for cleanup","     *","     * @method _afterScrollEnd","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterScrollEnd: function (e) {","        var sv = this,","            gesture = sv._gesture;","","        if (gesture && gesture.onGestureMove && gesture.onGestureMove.detach) {","            gesture.onGestureMove.detach();","        }","","        if (gesture && gesture.onGestureMoveEnd && gesture.onGestureMoveEnd.detach) {","            gesture.onGestureMoveEnd.detach();","        }","","        if (sv._flickAnim) {","            sv._flickAnim.cancel(); // Might as well?","        }","        ","        delete sv._flickAnim;","","        // Ideally this should be removed, but doing so causing some JS errors with fast swiping ","        // because _gesture is being deleted after the previous one has been overwritten","        // delete sv._gesture; // TODO: Move to sv.prevGesture?","    }","    ","    // End prototype properties","","}, {","","    // Static properties","","    /**","     * The identity of the widget.","     *","     * @property NAME","     * @type String","     * @default 'scrollview'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'scrollview',","","    /**","     * Static property used to define the default attribute configuration of","     * the Widget.","     *","     * @property ATTRS","     * @type {Object}","     * @protected","     * @static","     */","    ATTRS: {","","        /**","         * The scroll position in the y-axis","         *","         * @attribute scrollY","         * @type Number","         * @default 0","         */","        scrollY: {","            value: 0","        },","","        /**","         * The scroll position in the x-axis","         *","         * @attribute scrollX","         * @type Number","         * @default 0","         */","        scrollX: {","            value: 0","        },","","        /**","         * Drag coefficent for inertial scrolling. The closer to 1 this","         * value is, the less friction during scrolling.","         *","         * @attribute deceleration","         * @default 0.93","         */","        deceleration: {","            value: 0.93","        },","","        /**","         * Drag coefficient for intertial scrolling at the upper","         * and lower boundaries of the scrollview. Set to 0 to","         * disable \"rubber-banding\".","         *","         * @attribute bounce","         * @type Number","         * @default 0.1","         */","        bounce: {","            value: 0.1","        },","","        /**","         * The minimum distance and/or velocity which define a flick. Can be set to false,","         * to disable flick support (note: drag support is enabled/disabled separately)","         *","         * @attribute flick","         * @type Object","         * @default Object with properties minDistance = 10, minVelocity = 0.3.","         */","        flick: {","            value: {","                minDistance: 10,","                minVelocity: 0.3","            }","        },","","        /**","         * Enable/Disable dragging the ScrollView content (note: flick support is enabled/disabled separately)","         * @attribute drag","         * @type boolean","         * @default true","         */","        drag: {","            value: true","        },","","        /**","         * Enable/Disable scrolling the ScrollView content via mousewheel","         * @attribute mousewheel","         * @type boolean","         * @default true","         */","        mousewheel: {","            value: true","        }","    },","","    /**","     * List of class names used in the scrollview's DOM","     *","     * @property CLASS_NAMES","     * @type Object","     * @static","     */","    CLASS_NAMES: CLASS_NAMES,","","    /**","     * Flag used to source property changes initiated from the DOM","     *","     * @property UI_SRC","     * @type String","     * @static","     * @default 'ui'","     */","    UI_SRC: UI,","","    /**","     * The default bounce distance in pixels","     *","     * @property BOUNCE_RANGE","     * @type Number","     * @static","     * @default 150","     */","    BOUNCE_RANGE: 150,","","    /**","     * The interval used when animating the flick","     *","     * @property FRAME_STEP","     * @type Number","     * @static","     * @default 16","     */","    FRAME_STEP: 16,","","    /**","     * The default easing used when animating the flick","     *","     * @property EASING","     * @type String","     * @static","     * @default 'cubic-bezier(0, 0.1, 0, 1.0)'","     */","    EASING: 'cubic-bezier(0, 0.1, 0, 1.0)',","","    /**","     * The default easing to use when animating the bounce snap back.","     *","     * @property SNAP_EASING","     * @type String","     * @static","     * @default 'ease-out'","     */","    SNAP_EASING: 'ease-out',","","    /**","     * The default duration to use when animating the bounce snap back.","     *","     * @property SNAP_DURATION","     * @type Number","     * @static","     * @default 400","     */","    SNAP_DURATION: 400,","","    /**","     * Object map of style property names used to set transition properties.","     * Defaults to the vendor prefix established by the Transition module.","     * The configured property names are `_TRANSITION.DURATION` (e.g. \"WebkitTransitionDuration\") and","     * `_TRANSITION.PROPERTY (e.g. \"WebkitTransitionProperty\").","     *","     * @property _TRANSITION","     * @private","     */","    _TRANSITION: {","        DURATION: Y.Transition._VENDOR_PREFIX + 'TransitionDuration',","        PROPERTY: Y.Transition._VENDOR_PREFIX + 'TransitionProperty'","    }","","    // End static properties","","});","","}, '@VERSION@', {\"requires\": [\"widget\", \"event-gestures\", \"event-mousewheel\", \"transition\"], \"skinnable\": true});"];
_yuitest_coverage["scrollview-base"].lines = {"1":0,"10":0,"47":0,"59":0,"60":0,"63":0,"74":0,"78":0,"79":0,"82":0,"83":0,"84":0,"86":0,"90":0,"93":0,"97":0,"102":0,"103":0,"108":0,"119":0,"129":0,"131":0,"132":0,"133":0,"135":0,"145":0,"149":0,"161":0,"172":0,"176":0,"178":0,"179":0,"191":0,"195":0,"197":0,"198":0,"210":0,"214":0,"217":0,"219":0,"231":0,"240":0,"241":0,"245":0,"249":0,"252":0,"255":0,"258":0,"259":0,"271":0,"278":0,"279":0,"280":0,"283":0,"290":0,"301":0,"311":0,"312":0,"313":0,"314":0,"315":0,"316":0,"318":0,"319":0,"322":0,"323":0,"388":0,"389":0,"392":0,"402":0,"403":0,"404":0,"406":0,"407":0,"408":0,"411":0,"412":0,"413":0,"416":0,"418":0,"420":0,"424":0,"425":0,"426":0,"431":0,"432":0,"434":0,"435":0,"442":0,"443":0,"445":0,"446":0,"449":0,"450":0,"453":0,"468":0,"470":0,"471":0,"474":0,"485":0,"493":0,"543":0,"544":0,"550":0,"552":0,"553":0,"557":0,"558":0,"562":0,"601":0,"613":0,"614":0,"617":0,"618":0,"620":0,"621":0,"624":0,"625":0,"628":0,"629":0,"641":0,"648":0,"649":0,"652":0,"653":0,"656":0,"657":0,"658":0,"663":0,"664":0,"678":0,"686":0,"687":0,"690":0,"691":0,"692":0,"693":0,"694":0,"708":0,"726":0,"729":0,"731":0,"735":0,"736":0,"741":0,"742":0,"743":0,"745":0,"747":0,"748":0,"749":0,"751":0,"755":0,"767":0,"774":0,"776":0,"778":0,"782":0,"784":0,"785":0,"791":0,"794":0,"806":0,"817":0,"828":0,"839":0,"840":0,"842":0,"843":0,"847":0,"859":0,"865":0,"868":0,"869":0,"870":0,"873":0,"874":0,"877":0,"878":0,"880":0,"892":0,"904":0,"915":0,"926":0,"937":0,"948":0,"951":0,"952":0,"955":0,"956":0,"959":0,"960":0,"963":0};
_yuitest_coverage["scrollview-base"].functions = {"_constrain:46":0,"ScrollView:59":0,"initializer:73":0,"bindUI:128":0,"_bindAttrs:144":0,"_bindDrag:171":0,"_bindFlick:190":0,"_bindMousewheel:209":0,"syncUI:230":0,"_getScrollDims:270":0,"_uiDimensionsChange:300":0,"scrollTo:385":0,"_transform:466":0,"_onTransEnd:484":0,"_onGestureMoveStart:542":0,"_onGestureMove:600":0,"_onGestureMoveEnd:640":0,"_flick:677":0,"_flickFrame:706":0,"_mousewheel:766":0,"_isOOB:805":0,"_snapBack:827":0,"_afterScrollChange:858":0,"_afterFlickChange:891":0,"_afterDisabledChange:902":0,"_afterDragChange:914":0,"_afterMousewheelChange:925":0,"_afterDimChange:936":0,"_afterScrollEnd:947":0,"(anonymous 1):1":0};
_yuitest_coverage["scrollview-base"].coveredLines = 193;
_yuitest_coverage["scrollview-base"].coveredFunctions = 30;
_yuitest_coverline("scrollview-base", 1);
YUI.add('scrollview-base', function (Y, NAME) {

/*global YUI,Y*/

/**
 * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators
 *
 * @module scrollview-base
 */
_yuitest_coverfunc("scrollview-base", "(anonymous 1)", 1);
_yuitest_coverline("scrollview-base", 10);
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
        _yuitest_coverfunc("scrollview-base", "_constrain", 46);
_yuitest_coverline("scrollview-base", 47);
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
_yuitest_coverline("scrollview-base", 59);
function ScrollView() {
    _yuitest_coverfunc("scrollview-base", "ScrollView", 59);
_yuitest_coverline("scrollview-base", 60);
ScrollView.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("scrollview-base", 63);
Y.ScrollView = Y.extend(ScrollView, Y.Widget, {

    // *** Y.ScrollView prototype

    /**
     * Designated initializer
     *
     * @method initializer
     * @param {config} Configuration object for the plugin
     */
    initializer: function (config) {
        _yuitest_coverfunc("scrollview-base", "initializer", 73);
_yuitest_coverline("scrollview-base", 74);
var sv = this,
            axis = 'auto'; // Default axis to 'auto' and let the calculation happen in syncUI

        // Cache these values, since they aren't going to change.
        _yuitest_coverline("scrollview-base", 78);
sv._bb = sv.get(BOUNDING_BOX);
        _yuitest_coverline("scrollview-base", 79);
sv._cb = sv.get(CONTENT_BOX);

        // Determine the axis settings if a value was passed in
        _yuitest_coverline("scrollview-base", 82);
if (config.axis) {
            _yuitest_coverline("scrollview-base", 83);
config.axis = config.axis.toLowerCase();
            _yuitest_coverline("scrollview-base", 84);
switch (config.axis) {
                case "x":
                    _yuitest_coverline("scrollview-base", 86);
axis = {
                        x: true,
                        y: false
                    };
                    _yuitest_coverline("scrollview-base", 90);
break;
                
                case "y":
                    _yuitest_coverline("scrollview-base", 93);
axis = {
                        x: false,
                        y: true
                    };
                    _yuitest_coverline("scrollview-base", 97);
break;

                // Unsupported ATM.  For future development purposes.
                case "xy":
                case "yx":
                    _yuitest_coverline("scrollview-base", 102);
if (config._multiaxis) {
                        _yuitest_coverline("scrollview-base", 103);
axis = {
                            x: true,
                            y: true
                        };
                    }
                    _yuitest_coverline("scrollview-base", 108);
break;
            }
        }

        /**
         * Contains an object that specifies if the widget can scroll on a X and/or Y axis
         *
         * @property axis
         * @type Object
         * @public
         */
        _yuitest_coverline("scrollview-base", 119);
sv.axis = axis;
    },

    /**
     * bindUI implementation
     *
     * Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function () {
        _yuitest_coverfunc("scrollview-base", "bindUI", 128);
_yuitest_coverline("scrollview-base", 129);
var sv = this;

        _yuitest_coverline("scrollview-base", 131);
sv._bindFlick(sv.get(FLICK));
        _yuitest_coverline("scrollview-base", 132);
sv._bindDrag(sv.get(DRAG));
        _yuitest_coverline("scrollview-base", 133);
sv._bindMousewheel(sv.get(MOUSEWHEEL));
        
        _yuitest_coverline("scrollview-base", 135);
sv._bindAttrs();
    },

    /**
     * 
     *
     * @method _bindAttrs
     * @private
     */
    _bindAttrs: function () {
        _yuitest_coverfunc("scrollview-base", "_bindAttrs", 144);
_yuitest_coverline("scrollview-base", 145);
var sv = this,
            scrollChangeHandler = sv._afterScrollChange,
            dimChangeHandler = sv._afterDimChange;

        _yuitest_coverline("scrollview-base", 149);
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
        _yuitest_coverline("scrollview-base", 161);
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
        _yuitest_coverfunc("scrollview-base", "_bindDrag", 171);
_yuitest_coverline("scrollview-base", 172);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'drag' listeners
        _yuitest_coverline("scrollview-base", 176);
bb.detach(DRAG + '|*');

        _yuitest_coverline("scrollview-base", 178);
if (drag) {
            _yuitest_coverline("scrollview-base", 179);
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
        _yuitest_coverfunc("scrollview-base", "_bindFlick", 190);
_yuitest_coverline("scrollview-base", 191);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'flick' listeners
        _yuitest_coverline("scrollview-base", 195);
bb.detach(FLICK + '|*');

        _yuitest_coverline("scrollview-base", 197);
if (flick) {
            _yuitest_coverline("scrollview-base", 198);
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
        _yuitest_coverfunc("scrollview-base", "_bindMousewheel", 209);
_yuitest_coverline("scrollview-base", 210);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'mousewheel' listeners
        _yuitest_coverline("scrollview-base", 214);
bb.detach(MOUSEWHEEL + '|*');

        // Only enable for vertical scrollviews
        _yuitest_coverline("scrollview-base", 217);
if (mousewheel) {
            // Bound to document, because that's where mousewheel events fire off of.
            _yuitest_coverline("scrollview-base", 219);
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
        _yuitest_coverfunc("scrollview-base", "syncUI", 230);
_yuitest_coverline("scrollview-base", 231);
var sv = this,
            axis = sv.axis,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight;

        // If the axis should be auto-calculated, do it.
        _yuitest_coverline("scrollview-base", 240);
if (axis === "auto") {
            _yuitest_coverline("scrollview-base", 241);
axis = {
                x: (scrollWidth > width),
                y: (scrollHeight > height)
            };
            _yuitest_coverline("scrollview-base", 245);
sv.axis = axis;
        }

        // get text direction on or inherited by scrollview node
        _yuitest_coverline("scrollview-base", 249);
sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');

        // Cache the disabled value
        _yuitest_coverline("scrollview-base", 252);
sv._cDisabled = sv.get(DISABLED);

        // Run this to set initial values
        _yuitest_coverline("scrollview-base", 255);
sv._uiDimensionsChange();

        // If we're out-of-bounds, snap back.
        _yuitest_coverline("scrollview-base", 258);
if (sv._isOOB()) {
            _yuitest_coverline("scrollview-base", 259);
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
        _yuitest_coverfunc("scrollview-base", "_getScrollDims", 270);
_yuitest_coverline("scrollview-base", 271);
var sv = this,
            cb = sv._cb,
            bb = sv._bb,
            TRANS = ScrollView._TRANSITION,
            dims;

        // TODO: Is this OK? Just in case it's called 'during' a transition.
        _yuitest_coverline("scrollview-base", 278);
if (NATIVE_TRANSITIONS) {
            _yuitest_coverline("scrollview-base", 279);
cb.setStyle(TRANS.DURATION, ZERO);
            _yuitest_coverline("scrollview-base", 280);
cb.setStyle(TRANS.PROPERTY, EMPTY);
        }

        _yuitest_coverline("scrollview-base", 283);
dims = {
            'offsetWidth': bb.get('offsetWidth'),
            'offsetHeight': bb.get('offsetHeight'),
            'scrollWidth': bb.get('scrollWidth'),
            'scrollHeight': bb.get('scrollHeight')
        };

        _yuitest_coverline("scrollview-base", 290);
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
        _yuitest_coverfunc("scrollview-base", "_uiDimensionsChange", 300);
_yuitest_coverline("scrollview-base", 301);
var sv = this,
            bb = sv._bb,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight,
            rtl = sv.rtl,
            axis = sv.axis;
        
        _yuitest_coverline("scrollview-base", 311);
sv._minScrollX = (rtl) ? -(scrollWidth - width) : 0;
        _yuitest_coverline("scrollview-base", 312);
sv._maxScrollX = (rtl) ? 0 : (scrollWidth - width);
        _yuitest_coverline("scrollview-base", 313);
sv._minScrollY = 0;
        _yuitest_coverline("scrollview-base", 314);
sv._maxScrollY = scrollHeight - height;
        _yuitest_coverline("scrollview-base", 315);
sv._scrollWidth = scrollWidth;
        _yuitest_coverline("scrollview-base", 316);
sv._scrollHeight = scrollHeight;

        _yuitest_coverline("scrollview-base", 318);
if (axis.x) {
            _yuitest_coverline("scrollview-base", 319);
bb.addClass(CLASS_NAMES.horizontal);
        }

        _yuitest_coverline("scrollview-base", 322);
if (axis.y) {
            _yuitest_coverline("scrollview-base", 323);
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
     * @param x {Number} The x-position to scroll to
     * @param y {Number} The y-position to scroll to
     * @param duration {Number} Duration, in ms, of the scroll animation (default is 0)
     * @param easing {String} An easing equation if duration is set
     * @param node {String} The node to move
     */
    scrollTo: function (x, y, duration, easing, node) {

        // Check to see if widget is disabled
        _yuitest_coverfunc("scrollview-base", "scrollTo", 385);
_yuitest_coverline("scrollview-base", 388);
if (this._cDisabled) {
            _yuitest_coverline("scrollview-base", 389);
return;
        }

        _yuitest_coverline("scrollview-base", 392);
var sv = this,
            cb = sv._cb,
            TRANS = ScrollView._TRANSITION,
            callback = Y.bind(sv._onTransEnd, sv), // @Todo : cache this
            newX = 0,
            newY = 0,
            transition = {},
            transform;

        // default the optional arguments
        _yuitest_coverline("scrollview-base", 402);
duration = duration || 0;
        _yuitest_coverline("scrollview-base", 403);
easing = easing || ScrollView.EASING;
        _yuitest_coverline("scrollview-base", 404);
node = node || cb;

        _yuitest_coverline("scrollview-base", 406);
if (x !== null) {
            _yuitest_coverline("scrollview-base", 407);
sv.set(SCROLL_X, x, {src:UI});
            _yuitest_coverline("scrollview-base", 408);
newX = -(x);
        }

        _yuitest_coverline("scrollview-base", 411);
if (y !== null) {
            _yuitest_coverline("scrollview-base", 412);
sv.set(SCROLL_Y, y, {src:UI});
            _yuitest_coverline("scrollview-base", 413);
newY = -(y);
        }

        _yuitest_coverline("scrollview-base", 416);
transform = sv._transform(newX, newY);

        _yuitest_coverline("scrollview-base", 418);
if (NATIVE_TRANSITIONS) {
            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.
            _yuitest_coverline("scrollview-base", 420);
node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);
        }

        // Move
        _yuitest_coverline("scrollview-base", 424);
if (duration === 0) {
            _yuitest_coverline("scrollview-base", 425);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("scrollview-base", 426);
node.setStyle('transform', transform);
            }
            else {
                // TODO: If both set, batch them in the same update
                // Update: Nope, setStyles() just loops through each property and applies it.
                _yuitest_coverline("scrollview-base", 431);
if (x !== null) {
                    _yuitest_coverline("scrollview-base", 432);
node.setStyle(LEFT, newX + PX);
                }
                _yuitest_coverline("scrollview-base", 434);
if (y !== null) {
                    _yuitest_coverline("scrollview-base", 435);
node.setStyle(TOP, newY + PX);
                }
            }
        }

        // Animate
        else {
            _yuitest_coverline("scrollview-base", 442);
transition.easing = easing;
            _yuitest_coverline("scrollview-base", 443);
transition.duration = duration / 1000;

            _yuitest_coverline("scrollview-base", 445);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("scrollview-base", 446);
transition.transform = transform;
            }
            else {
                _yuitest_coverline("scrollview-base", 449);
transition.left = newX + PX;
                _yuitest_coverline("scrollview-base", 450);
transition.top = newY + PX;
            }

            _yuitest_coverline("scrollview-base", 453);
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
        _yuitest_coverfunc("scrollview-base", "_transform", 466);
_yuitest_coverline("scrollview-base", 468);
var prop = 'translate(' + x + 'px, ' + y + 'px)';

        _yuitest_coverline("scrollview-base", 470);
if (this._forceHWTransforms) {
            _yuitest_coverline("scrollview-base", 471);
prop += ' translateZ(0)';
        }

        _yuitest_coverline("scrollview-base", 474);
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
        _yuitest_coverfunc("scrollview-base", "_onTransEnd", 484);
_yuitest_coverline("scrollview-base", 485);
var sv = this;

        /**
         * Notification event fired at the end of a scroll transition
         *
         * @event scrollEnd
         * @param e {EventFacade} The default event facade.
         */
        _yuitest_coverline("scrollview-base", 493);
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
        _yuitest_coverfunc("scrollview-base", "_onGestureMoveStart", 542);
_yuitest_coverline("scrollview-base", 543);
if (!this._cDisabled) {
            _yuitest_coverline("scrollview-base", 544);
var sv = this,
                bb = sv._bb,
                currentX = sv.get(SCROLL_X),
                currentY = sv.get(SCROLL_Y);

            // TODO: Review if neccesary (#2530129)
            _yuitest_coverline("scrollview-base", 550);
e.stopPropagation();

            _yuitest_coverline("scrollview-base", 552);
if (sv._prevent.start) {
                _yuitest_coverline("scrollview-base", 553);
e.preventDefault();
            }

            // if a flick animation is in progress, cancel it
            _yuitest_coverline("scrollview-base", 557);
if (sv._flickAnim) {
                _yuitest_coverline("scrollview-base", 558);
sv._flickAnim.cancel();
            }

            // Stores data for this gesture cycle.  Cleaned up later
            _yuitest_coverline("scrollview-base", 562);
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
        _yuitest_coverfunc("scrollview-base", "_onGestureMove", 600);
_yuitest_coverline("scrollview-base", 601);
var sv = this,
            gesture = sv._gesture,
            svAxis = sv.axis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            startX = gesture.startX,
            startY = gesture.startY,
            startClientX = gesture.startClientX,
            startClientY = gesture.startClientY,
            clientX = e.clientX,
            clientY = e.clientY;

        _yuitest_coverline("scrollview-base", 613);
if (sv._prevent.move) {
            _yuitest_coverline("scrollview-base", 614);
e.preventDefault();
        }

        _yuitest_coverline("scrollview-base", 617);
gesture.deltaX = startClientX - clientX;
        _yuitest_coverline("scrollview-base", 618);
gesture.deltaY = startClientY - clientY;

        _yuitest_coverline("scrollview-base", 620);
if (gesture.axis === null) {
            _yuitest_coverline("scrollview-base", 621);
gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;
        }

        _yuitest_coverline("scrollview-base", 624);
if (gesture.axis === DIM_X && svAxisX) {
            _yuitest_coverline("scrollview-base", 625);
sv.set(SCROLL_X, startX + gesture.deltaX);
        }

        _yuitest_coverline("scrollview-base", 628);
if (gesture.axis === DIM_Y && svAxisY) {
            _yuitest_coverline("scrollview-base", 629);
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
        _yuitest_coverfunc("scrollview-base", "_onGestureMoveEnd", 640);
_yuitest_coverline("scrollview-base", 641);
var sv = this,
            gesture = sv._gesture,
            flick = gesture.flick,
            clientX = e.clientX,
            clientY = e.clientY,
            isOOB;

        _yuitest_coverline("scrollview-base", 648);
if (sv._prevent.end) {
            _yuitest_coverline("scrollview-base", 649);
e.preventDefault();
        }

        _yuitest_coverline("scrollview-base", 652);
gesture.endClientX = clientX;
        _yuitest_coverline("scrollview-base", 653);
gesture.endClientY = clientY;

        // Only if this gesture wasn't a flick, and there was movement
        _yuitest_coverline("scrollview-base", 656);
if (!flick && gesture.deltaX !== null && gesture.deltaY !== null) {
            _yuitest_coverline("scrollview-base", 657);
if (sv._isOOB()) {
                _yuitest_coverline("scrollview-base", 658);
sv._snapBack();
            }
            else {
                // Don't fire scrollEnd on the gesture axis is the same as paginator's
                // Not totally confident this is a good idea
                _yuitest_coverline("scrollview-base", 663);
if (sv.pages && sv.pages.get('axis') !== gesture.axis) {
                    _yuitest_coverline("scrollview-base", 664);
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
        _yuitest_coverfunc("scrollview-base", "_flick", 677);
_yuitest_coverline("scrollview-base", 678);
var sv = this,
            gesture = sv._gesture,
            svAxis = sv.axis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            flick = e.flick,
            flickAxis;

        _yuitest_coverline("scrollview-base", 686);
if (!sv._cDisabled) {
            _yuitest_coverline("scrollview-base", 687);
flickAxis = flick.axis;

            // We can't scroll on this axis, so prevent unneccesary firing of _flickFrame
            _yuitest_coverline("scrollview-base", 690);
if ((flickAxis === DIM_X && svAxisX) || (flickAxis === DIM_Y && svAxisY)) {
                _yuitest_coverline("scrollview-base", 691);
gesture.flick = flick;
                _yuitest_coverline("scrollview-base", 692);
sv._cDecel = sv.get(DECELERATION);
                _yuitest_coverline("scrollview-base", 693);
sv._cBounce = sv.get(BOUNCE);
                _yuitest_coverline("scrollview-base", 694);
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

        _yuitest_coverfunc("scrollview-base", "_flickFrame", 706);
_yuitest_coverline("scrollview-base", 708);
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
            svAxis = sv.axis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            step = ScrollView.FRAME_STEP,
            newX = currentX - (velocity * step),
            newY = currentY - (velocity * step);

        _yuitest_coverline("scrollview-base", 726);
velocity *= deceleration;

        // If we are out of bounds
        _yuitest_coverline("scrollview-base", 729);
if (sv._isOOB()) {
            // We're past an edge, now bounce back
            _yuitest_coverline("scrollview-base", 731);
sv._snapBack();
        }
        
        // If the velocity gets slow enough, just stop
        else {_yuitest_coverline("scrollview-base", 735);
if (Math.abs(velocity).toFixed(4) <= 0.015) {
            _yuitest_coverline("scrollview-base", 736);
sv._onTransEnd();
        }

        // Otherwise, animate to the next frame
        else {
            _yuitest_coverline("scrollview-base", 741);
if (flickAxis === DIM_X && svAxisX) {
                _yuitest_coverline("scrollview-base", 742);
if (newX < minX || newX > maxX) {
                    _yuitest_coverline("scrollview-base", 743);
velocity *= bounce;
                }
                _yuitest_coverline("scrollview-base", 745);
sv.set(SCROLL_X, newX);
            }
            else {_yuitest_coverline("scrollview-base", 747);
if (flickAxis === DIM_Y && svAxisY) {
                _yuitest_coverline("scrollview-base", 748);
if (newY < minY || newY > maxY) {
                    _yuitest_coverline("scrollview-base", 749);
velocity *= bounce;
                }
                _yuitest_coverline("scrollview-base", 751);
sv.set(SCROLL_Y, newY);
            }}

            // TODO: maybe use requestAnimationFrame instead
            _yuitest_coverline("scrollview-base", 755);
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
        _yuitest_coverfunc("scrollview-base", "_mousewheel", 766);
_yuitest_coverline("scrollview-base", 767);
var sv = this,
            scrollY = sv.get(SCROLL_Y),
            bb = sv._bb,
            scrollOffset = 10, // 10px
            isForward = (e.wheelDelta > 0),
            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);

        _yuitest_coverline("scrollview-base", 774);
scrollToY = _constrain(scrollToY, sv._minScrollY, sv._maxScrollY);

        _yuitest_coverline("scrollview-base", 776);
if (bb.contains(e.target)) {
            // Jump to the new offset
            _yuitest_coverline("scrollview-base", 778);
sv.set(SCROLL_Y, scrollToY);

            // if we have scrollbars plugin, update & set the flash timer on the scrollbar
            // TODO: This probably shouldn't be in this module
            _yuitest_coverline("scrollview-base", 782);
if (sv.scrollbars) {
                // TODO: The scrollbars should handle this themselves
                _yuitest_coverline("scrollview-base", 784);
sv.scrollbars._update();
                _yuitest_coverline("scrollview-base", 785);
sv.scrollbars.flash();
                // or just this
                // sv.scrollbars._hostDimensionsChange();
            }

            // Fire the 'scrollEnd' event
            _yuitest_coverline("scrollview-base", 791);
sv._onTransEnd();

            // prevent browser default behavior on mouse scroll
            _yuitest_coverline("scrollview-base", 794);
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
        _yuitest_coverfunc("scrollview-base", "_isOOB", 805);
_yuitest_coverline("scrollview-base", 806);
var sv = this,
            svAxis = sv.axis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            minY = sv._minScrollY,
            maxX = sv._maxScrollX,
            maxY = sv._maxScrollY;

        _yuitest_coverline("scrollview-base", 817);
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
        _yuitest_coverfunc("scrollview-base", "_snapBack", 827);
_yuitest_coverline("scrollview-base", 828);
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

        _yuitest_coverline("scrollview-base", 839);
if (newX !== currentX) {
            _yuitest_coverline("scrollview-base", 840);
sv.set(SCROLL_X, newX, {duration:duration});
        }
        else {_yuitest_coverline("scrollview-base", 842);
if (newY !== currentY) {
            _yuitest_coverline("scrollview-base", 843);
sv.set(SCROLL_Y, newY, {duration:duration});
        }
        else {
            // It shouldn't ever get here, but in case it does, fire scrollEnd
            _yuitest_coverline("scrollview-base", 847);
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
        _yuitest_coverfunc("scrollview-base", "_afterScrollChange", 858);
_yuitest_coverline("scrollview-base", 859);
var sv = this,
            duration = e.duration,
            easing = e.easing,
            val = e.newVal,
            scrollToArgs = [];

        _yuitest_coverline("scrollview-base", 865);
if (e.src !== ScrollView.UI_SRC) {

            // Generate the array of args to pass to scrollTo()
            _yuitest_coverline("scrollview-base", 868);
if (e.attrName === SCROLL_X) {
                _yuitest_coverline("scrollview-base", 869);
scrollToArgs.push(val);
                _yuitest_coverline("scrollview-base", 870);
scrollToArgs.push(sv.get(SCROLL_Y));
            }
            else {
                _yuitest_coverline("scrollview-base", 873);
scrollToArgs.push(sv.get(SCROLL_X));
                _yuitest_coverline("scrollview-base", 874);
scrollToArgs.push(val);
            }

            _yuitest_coverline("scrollview-base", 877);
scrollToArgs.push(duration);
            _yuitest_coverline("scrollview-base", 878);
scrollToArgs.push(easing);

            _yuitest_coverline("scrollview-base", 880);
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
        _yuitest_coverfunc("scrollview-base", "_afterFlickChange", 891);
_yuitest_coverline("scrollview-base", 892);
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
        _yuitest_coverfunc("scrollview-base", "_afterDisabledChange", 902);
_yuitest_coverline("scrollview-base", 904);
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
        _yuitest_coverfunc("scrollview-base", "_afterDragChange", 914);
_yuitest_coverline("scrollview-base", 915);
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
        _yuitest_coverfunc("scrollview-base", "_afterMousewheelChange", 925);
_yuitest_coverline("scrollview-base", 926);
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
        _yuitest_coverfunc("scrollview-base", "_afterDimChange", 936);
_yuitest_coverline("scrollview-base", 937);
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
        _yuitest_coverfunc("scrollview-base", "_afterScrollEnd", 947);
_yuitest_coverline("scrollview-base", 948);
var sv = this,
            gesture = sv._gesture;

        _yuitest_coverline("scrollview-base", 951);
if (gesture && gesture.onGestureMove && gesture.onGestureMove.detach) {
            _yuitest_coverline("scrollview-base", 952);
gesture.onGestureMove.detach();
        }

        _yuitest_coverline("scrollview-base", 955);
if (gesture && gesture.onGestureMoveEnd && gesture.onGestureMoveEnd.detach) {
            _yuitest_coverline("scrollview-base", 956);
gesture.onGestureMoveEnd.detach();
        }

        _yuitest_coverline("scrollview-base", 959);
if (sv._flickAnim) {
            _yuitest_coverline("scrollview-base", 960);
sv._flickAnim.cancel(); // Might as well?
        }
        
        _yuitest_coverline("scrollview-base", 963);
delete sv._flickAnim;

        // Ideally this should be removed, but doing so causing some JS errors with fast swiping 
        // because _gesture is being deleted after the previous one has been overwritten
        // delete sv._gesture; // TODO: Move to sv.prevGesture?
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
