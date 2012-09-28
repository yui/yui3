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
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].code=["YUI.add('scrollview-base', function (Y, NAME) {","","/**"," * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators"," *"," * @module scrollview"," * @submodule scrollview-base"," */",""," // Local vars","var getClassName = Y.ClassNameManager.getClassName,","    DOCUMENT = Y.config.doc,","    WINDOW = Y.config.win,","    IE = Y.UA.ie,","    NATIVE_TRANSITIONS = Y.Transition.useNative,","    SCROLLVIEW = 'scrollview',","    CLASS_NAMES = {","        vertical: getClassName(SCROLLVIEW, 'vert'),","        horizontal: getClassName(SCROLLVIEW, 'horiz')","    },","    EV_SCROLL_END = 'scrollEnd',","    FLICK = 'flick',","    DRAG = 'drag',","    MOUSEWHEEL = 'mousewheel',","    UI = 'ui',","    TOP = 'top',","    RIGHT = 'right',","    BOTTOM = 'bottom',","    LEFT = 'left',","    PX = 'px',","    AXIS = 'axis',","    SCROLL_Y = 'scrollY',","    SCROLL_X = 'scrollX',","    BOUNCE = 'bounce',","    DISABLED = 'disabled',","    DECELERATION = 'deceleration',","    DIM_X = 'x',","    DIM_Y = 'y',","    BOUNDING_BOX = 'boundingBox',","    CONTENT_BOX = 'contentBox',","    GESTURE_MOVE = 'gesturemove',","    START = 'start',","    END = 'end',","    EMPTY = '',","    ZERO = '0s',","    SNAP_DURATION = 'snapDuration',","    SNAP_EASING = 'snapEasing', ","    EASING = 'easing', ","    FRAME_DURATION = 'frameDuration', ","    BOUNCE_RANGE = 'bounceRange',","    _constrain = function (val, min, max) {","        return Math.min(Math.max(val, min), max);","    };","","/**"," * ScrollView provides a scrollable widget, supporting flick gestures,"," * across both touch and mouse based devices."," *"," * @class ScrollView"," * @param config {Object} Object literal with initial attribute values"," * @extends Widget"," * @constructor"," */","function ScrollView() {","    ScrollView.superclass.constructor.apply(this, arguments);","}","","Y.ScrollView = Y.extend(ScrollView, Y.Widget, {","","    // *** Y.ScrollView prototype","","    /**","     * Flag driving whether or not we should try and force H/W acceleration when transforming. Currently enabled by default for Webkit.","     * Used by the _transform method.","     *","     * @property _forceHWTransforms","     * @type boolean","     * @protected","     */","    _forceHWTransforms: Y.UA.webkit ? true : false,","","    /**","     * <p>Used to control whether or not ScrollView's internal","     * gesturemovestart, gesturemove and gesturemoveend","     * event listeners should preventDefault. The value is an","     * object, with \"start\", \"move\" and \"end\" properties used to","     * specify which events should preventDefault and which shouldn't:</p>","     *","     * <pre>","     * {","     *    start: false,","     *    move: true,","     *    end: false","     * }","     * </pre>","     *","     * <p>The default values are set up in order to prevent panning,","     * on touch devices, while allowing click listeners on elements inside","     * the ScrollView to be notified as expected.</p>","     *","     * @property _prevent","     * @type Object","     * @protected","     */","    _prevent: {","        start: false,","        move: true,","        end: false","    },","","    /**","     * Contains the distance (postive or negative) in pixels by which ","     * the scrollview was last scrolled. This is useful when setting up ","     * click listeners on the scrollview content, which on mouse based ","     * devices are always fired, even after a drag/flick. ","     * ","     * <p>Touch based devices don't currently fire a click event, ","     * if the finger has been moved (beyond a threshold) so this ","     * check isn't required, if working in a purely touch based environment</p>","     * ","     * @property lastScrolledAmt","     * @type Number","     * @public","     * @default 0","     */","    lastScrolledAmt: 0,","","    _gesture: false,","    _flick: false,","","    /**","     * Internal state, defines the minimum amount that the scrollview can be scrolled along the X axis","     *","     * @property _minScrollX","     * @type number","     * @protected","     */","    _minScrollX: null,","","    /**","     * Internal state, defines the maximum amount that the scrollview can be scrolled along the X axis","     *","     * @property _maxScrollX","     * @type number","     * @protected","     */","    _maxScrollX: null,","","    /**","     * Internal state, defines the minimum amount that the scrollview can be scrolled along the Y axis","     *","     * @property _minScrollY","     * @type number","     * @protected","     */","    _minScrollY: null,","","    /**","     * Internal state, defines the maximum amount that the scrollview can be scrolled along the Y axis","     *","     * @property _maxScrollY","     * @type number","     * @protected","     */","    _maxScrollY: null,","    ","    /**","     * Designated initializer","     *","     * @method initializer","     * @param {config} Configuration object for the plugin","     */","    initializer: function (config) {","        var sv = this;","","        // Cache these values, since they aren't going to change.","        sv._bb = sv.get(BOUNDING_BOX);","        sv._cb = sv.get(CONTENT_BOX);","","        // Cache some attributes","        sv._cAxis = sv.get(AXIS);","        sv._cBounce = sv.get(BOUNCE);","        sv._cBounceRange = sv.get(BOUNCE_RANGE);","        sv._cDeceleration = sv.get(DECELERATION);","        sv._cFrameDuration = sv.get(FRAME_DURATION);","    },","","    /**","     * bindUI implementation","     *","     * Hooks up events for the widget","     * @method bindUI","     */","    bindUI: function () {","        var sv = this;","","        // Bind interaction listers","        sv._bindFlick(sv.get(FLICK));","        sv._bindDrag(sv.get(DRAG));","        sv._bindMousewheel(true);","        ","        // Bind change events","        sv._bindAttrs();","","        // IE SELECT HACK. See if we can do this non-natively and in the gesture for a future release.","        if (IE) {","            sv._fixIESelect(sv._bb, sv._cb);","        }","","        // Set any deprecated static properties","        if (ScrollView.SNAP_DURATION) {","            sv.set(SNAP_DURATION, ScrollView.SNAP_DURATION);","        }","","        if (ScrollView.SNAP_EASING) {","            sv.set(SNAP_EASING, ScrollView.SNAP_EASING);","        }","","        if (ScrollView.EASING) {","            sv.set(EASING, ScrollView.EASING);","        }","","        if (ScrollView.FRAME_STEP) {","            sv.set(FRAME_DURATION, ScrollView.FRAME_STEP);","        }","","        if (ScrollView.BOUNCE_RANGE) {","            sv.set(BOUNCE_RANGE, ScrollView.BOUNCE_RANGE);","        }","","        // Recalculate dimension properties","        // TODO: This should be throttled.","        // Y.one(WINDOW).after('resize', sv._afterDimChange, sv);","    },","","    /**","     * Bind event listeners","     *","     * @method _bindAttrs","     * @private","     */","    _bindAttrs: function () {","        var sv = this,","            scrollChangeHandler = sv._afterScrollChange,","            dimChangeHandler = sv._afterDimChange;","","        // Bind any change event listeners","        sv.after({","            'scrollEnd': sv._afterScrollEnd,","            'disabledChange': sv._afterDisabledChange,","            'flickChange': sv._afterFlickChange,","            'dragChange': sv._afterDragChange,","            'axisChange': sv._afterAxisChange,","            'scrollYChange': scrollChangeHandler,","            'scrollXChange': scrollChangeHandler,","            'heightChange': dimChangeHandler,","            'widthChange': dimChangeHandler","        });","    },","","    /**","     * Bind (or unbind) gesture move listeners required for drag support","     *","     * @method _bindDrag","     * @param drag {boolean} If true, the method binds listener to enable drag (gesturemovestart). If false, the method unbinds gesturemove listeners for drag support.","     * @private","     */","    _bindDrag: function (drag) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'drag' listeners","        bb.detach(DRAG + '|*');","","        if (drag) {","            bb.on(DRAG + '|' + GESTURE_MOVE + START, Y.bind(sv._onGestureMoveStart, sv));","        }","    },","","    /**","     * Bind (or unbind) flick listeners.","     *","     * @method _bindFlick","     * @param flick {Object|boolean} If truthy, the method binds listeners for flick support. If false, the method unbinds flick listeners.","     * @private","     */","    _bindFlick: function (flick) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'flick' listeners","        bb.detach(FLICK + '|*');","","        if (flick) {","            bb.on(FLICK + '|' + FLICK, Y.bind(sv._onFlick, sv), flick);","","            // Rebind Drag, becuase _onGestureMoveEnd always has to fire -after- _flick","            sv._bindDrag(sv.get(DRAG));","        }","    },","","    /**","     * Bind (or unbind) mousewheel listeners.","     *","     * @method _bindMousewheel","     * @param mousewheel {Object|boolean} If truthy, the method binds listeners for mousewheel support. If false, the method unbinds mousewheel listeners.","     * @private","     */","    _bindMousewheel: function (mousewheel) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'mousewheel' listeners","        // TODO: This doesn't actually appear to work properly. Fix. #2532743","        bb.detach(MOUSEWHEEL + '|*');","","        // Only enable for vertical scrollviews","        if (mousewheel) {","            // Bound to document, because that's where mousewheel events fire off of.","            Y.one(DOCUMENT).on(MOUSEWHEEL, Y.bind(sv._onMousewheel, sv));","        }","    },","","    /**","     * syncUI implementation.","     *","     * Update the scroll position, based on the current value of scrollX/scrollY.","     *","     * @method syncUI","     */","    syncUI: function () {","        var sv = this,","            scrollDims = sv._getScrollDims(),","            width = scrollDims.offsetWidth,","            height = scrollDims.offsetHeight,","            scrollWidth = scrollDims.scrollWidth,","            scrollHeight = scrollDims.scrollHeight;","","        // If the axis is undefined, auto-calculate it","        if (sv._cAxis === undefined) {","            // This should only ever be run once (for now).","            // In the future SV might post-load axis changes","            sv._cAxis = {","                x: (scrollWidth > width),","                y: (scrollHeight > height)","            };","","            sv._set(AXIS, sv._cAxis);","        }","        ","        // get text direction on or inherited by scrollview node","        sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');","","        // Cache the disabled value","        sv._cDisabled = sv.get(DISABLED);","","        // Run this to set initial values","        sv._uiDimensionsChange();","","        // If we're out-of-bounds, snap back.","        if (sv._isOutOfBounds()) {","            sv._snapBack();","        }","    },","","    /**","     * Utility method to obtain widget dimensions","     * ","     * @method _getScrollDims","     * @returns {Object} The offsetWidth, offsetHeight, scrollWidth and scrollHeight as an array: [offsetWidth, offsetHeight, scrollWidth, scrollHeight]","     * @private","     */","    _getScrollDims: function () {","        var sv = this,","            cb = sv._cb,","            bb = sv._bb,","            TRANS = ScrollView._TRANSITION,","            // Ideally using CSSMatrix - don't think we have it normalized yet though.","            // origX = (new WebKitCSSMatrix(cb.getComputedStyle(\"transform\"))).e,","            // origY = (new WebKitCSSMatrix(cb.getComputedStyle(\"transform\"))).f,","            origX = sv.get(SCROLL_X),","            origY = sv.get(SCROLL_Y),","            origHWTransform,","            dims;","","        // TODO: Is this OK? Just in case it's called 'during' a transition.","        if (NATIVE_TRANSITIONS) {","            cb.setStyle(TRANS.DURATION, ZERO);","            cb.setStyle(TRANS.PROPERTY, EMPTY);","        }","","        origHWTransform = sv._forceHWTransforms;","        sv._forceHWTransforms = false; // the z translation was causing issues with picking up accurate scrollWidths in Chrome/Mac.","","        sv._moveTo(cb, 0, 0);","        dims = {","            'offsetWidth': bb.get('offsetWidth'),","            'offsetHeight': bb.get('offsetHeight'),","            'scrollWidth': bb.get('scrollWidth'),","            'scrollHeight': bb.get('scrollHeight')","        };","        sv._moveTo(cb, -(origX), -(origY));","","        sv._forceHWTransforms = origHWTransform;","","        return dims;","    },","","    /**","     * This method gets invoked whenever the height or width attributes change,","     * allowing us to determine which scrolling axes need to be enabled.","     *","     * @method _uiDimensionsChange","     * @protected","     */","    _uiDimensionsChange: function () {","        var sv = this,","            bb = sv._bb,","            scrollDims = sv._getScrollDims(),","            width = scrollDims.offsetWidth,","            height = scrollDims.offsetHeight,","            scrollWidth = scrollDims.scrollWidth,","            scrollHeight = scrollDims.scrollHeight,","            rtl = sv.rtl,","            svAxis = sv._cAxis;","            ","        if (svAxis && svAxis.x) {","            bb.addClass(CLASS_NAMES.horizontal);","        }","","        if (svAxis && svAxis.y) {","            bb.addClass(CLASS_NAMES.vertical);","        }","","        sv._minScrollX = (rtl) ? Math.min(0, -(scrollWidth - width)) : 0;","        sv._maxScrollX = (rtl) ? 0 : Math.max(0, scrollWidth - width);","        sv._minScrollY = 0;","        sv._maxScrollY = Math.max(0, scrollHeight - height);","    },","","    /**","     * Scroll the element to a given xy coordinate","     *","     * @method scrollTo","     * @param x {Number} The x-position to scroll to. (null for no movement)","     * @param y {Number} The y-position to scroll to. (null for no movement)","     * @param {Number} [duration] ms of the scroll animation. (default is 0)","     * @param {String} [easing] An easing equation if duration is set. (default is `easing` attribute)","     * @param {String} [node] The node to transform.  Setting this can be useful in dual-axis paginated instances. (default is the instance's contentBox)","     */","    scrollTo: function (x, y, duration, easing, node) {","        // Check to see if widget is disabled","        if (this._cDisabled) {","            return;","        }","","        var sv = this,","            cb = sv._cb,","            TRANS = ScrollView._TRANSITION,","            callback = Y.bind(sv._onTransEnd, sv), // @Todo : cache this","            newX = 0,","            newY = 0,","            transition = {},","            transform;","","        // default the optional arguments","        duration = duration || 0;","        easing = easing || sv.get(EASING); // @TODO: Cache this","        node = node || cb;","","        if (x !== null) {","            sv.set(SCROLL_X, x, {src:UI});","            newX = -(x);","        }","","        if (y !== null) {","            sv.set(SCROLL_Y, y, {src:UI});","            newY = -(y);","        }","","        transform = sv._transform(newX, newY);","","        if (NATIVE_TRANSITIONS) {","            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.","            node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);","        }","","        // Move","        if (duration === 0) {","            if (NATIVE_TRANSITIONS) {","                node.setStyle('transform', transform);","            }","            else {","                // TODO: If both set, batch them in the same update","                // Update: Nope, setStyles() just loops through each property and applies it.","                if (x !== null) {","                    node.setStyle(LEFT, newX + PX);","                }","                if (y !== null) {","                    node.setStyle(TOP, newY + PX);","                }","            }","        }","","        // Animate","        else {","            transition.easing = easing;","            transition.duration = duration / 1000;","","            if (NATIVE_TRANSITIONS) {","                transition.transform = transform;","            }","            else {","                transition.left = newX + PX;","                transition.top = newY + PX;","            }","","            node.transition(transition, callback);","        }","    },","","    /**","     * Utility method, to create the translate transform string with the","     * x, y translation amounts provided.","     *","     * @method _transform","     * @param {Number} x Number of pixels to translate along the x axis","     * @param {Number} y Number of pixels to translate along the y axis","     * @private","     */","    _transform: function (x, y) {","        // TODO: Would we be better off using a Matrix for this?","        var prop = 'translate(' + x + 'px, ' + y + 'px)';","","        if (this._forceHWTransforms) {","            prop += ' translateZ(0)';","        }","","        return prop;","    },","","    /**","    * Utility method, to move the given element to the given xy position","    *","    * @method _moveTo","    * @param node {Node} The node to move","    * @param x {Number} The x-position to move to","    * @param y {Number} The y-position to move to","    * @private","    */","    _moveTo : function(node, x, y) {","        if (NATIVE_TRANSITIONS) {","            node.setStyle('transform', this._transform(x, y));","        } else {","            node.setStyle(LEFT, x + PX);","            node.setStyle(TOP, y + PX);","        }","    },","","","    /**","     * Content box transition callback","     *","     * @method _onTransEnd","     * @param {Event.Facade} e The event facade","     * @private","     */","    _onTransEnd: function (e) {","        var sv = this;","","        /**","         * Notification event fired at the end of a scroll transition","         *","         * @event scrollEnd","         * @param e {EventFacade} The default event facade.","         */","        sv.fire(EV_SCROLL_END);","    },","","    /**","     * gesturemovestart event handler","     *","     * @method _onGestureMoveStart","     * @param e {Event.Facade} The gesturemovestart event facade","     * @private","     */","    _onGestureMoveStart: function (e) {","","        if (this._cDisabled) {","            return false;","        }","","        var sv = this,","            bb = sv._bb,","            gesture = sv._gesture,","            flick = sv._flick,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            clientX = e.clientX,","            clientY = e.clientY;","","        if (sv._prevent.start) {","            e.preventDefault();","        }","","        // if a flick animation is in progress, cancel it","        if (flick) {","            sv._cancelFlick();","            sv._onTransEnd();","        }","","        // TODO: Review if neccesary (#2530129)","        e.stopPropagation();","","        // Reset lastScrolledAmt","        sv.lastScrolledAmt = 0;","","        // Stores data for this gesture cycle.  Cleaned up later","        sv._gesture = {","","            // Will hold the axis value","            axis: null,","","            // The current attribute values","            startX: currentX,","            startY: currentY,","","            // The X/Y coordinates where the event began","            startClientX: clientX,","            startClientY: clientY,","","            // The X/Y coordinates where the event will end","            endClientX: null,","            endClientY: null,","","            // The current delta of the event","            deltaX: null,","            deltaY: null,","","            // Will be populated for flicks","            flick: null,","","            // Create some listeners for the rest of the gesture cycle","            onGestureMove: bb.on(DRAG + '|' + GESTURE_MOVE, Y.bind(sv._onGestureMove, sv)),","            ","            // @TODO: Don't bind gestureMoveEnd if it's a Flick?","            onGestureMoveEnd: bb.on(DRAG + '|' + GESTURE_MOVE + END, Y.bind(sv._onGestureMoveEnd, sv))","        };","    },","","    /**","     * gesturemove event handler","     *","     * @method _onGestureMove","     * @param e {Event.Facade} The gesturemove event facade","     * @private","     */","    _onGestureMove: function (e) {","        var sv = this,","            gesture = sv._gesture,","            svAxis = sv._cAxis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            startX = gesture.startX,","            startY = gesture.startY,","            startClientX = gesture.startClientX,","            startClientY = gesture.startClientY,","            clientX = e.clientX,","            clientY = e.clientY;","","        if (sv._prevent.move) {","            e.preventDefault();","        }","","        gesture.deltaX = startClientX - clientX;","        gesture.deltaY = startClientY - clientY;","","        // Determine if this is a vertical or horizontal movement","        // @TODO: This is crude, but it works.  Investigate more intelligent ways to detect intent","        if (gesture.axis === null) {","            gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;","        }","","        // Move X or Y.  @TODO: Move both if dualaxis.        ","        if (gesture.axis === DIM_X && svAxisX) {","            sv.set(SCROLL_X, startX + gesture.deltaX);","        }","        else if (gesture.axis === DIM_Y && svAxisY) {","            sv.set(SCROLL_Y, startY + gesture.deltaY);","        }","    },","","    /**","     * gesturemoveend event handler","     *","     * @method _onGestureMoveEnd","     * @param e {Event.Facade} The gesturemoveend event facade","     * @private","     */","    _onGestureMoveEnd: function (e) {","","        var sv = this,","            gesture = sv._gesture,","            flick = sv._flick,","            clientX = e.clientX,","            clientY = e.clientY;","","        if (sv._prevent.end) {","            e.preventDefault();","        }","","        // Store the end X/Y coordinates","        gesture.endClientX = clientX;","        gesture.endClientY = clientY;","","        // Cleanup the event handlers","        gesture.onGestureMove.detach();","        gesture.onGestureMoveEnd.detach();","","        // If this wasn't a flick, wrap up the gesture cycle","        if (!flick) {","            // @TODO: Be more intelligent about this. Look at the Flick attribute to see ","            // if it is safe to assume _flick did or didn't fire.  ","            // Then, the order _flick and _onGestureMoveEnd fire doesn't matter?","","            // If there was movement (_onGestureMove fired)","            if (gesture.deltaX !== null && gesture.deltaY !== null) {","","                // If we're out-out-bounds, then snapback","                if (sv._isOutOfBounds()) {","                    sv._snapBack();","                }","","                // Inbounds","                else {","                    // Don't fire scrollEnd on the gesture axis is the same as paginator's","                    // Not totally confident this is ideal to access a plugin's properties from a host, @TODO revisit","                    if (sv.pages && !sv.pages.get(AXIS)[gesture.axis]) {","                        sv._onTransEnd();","                    }","                }","            }","        }","    },","","    /**","     * Execute a flick at the end of a scroll action","     *","     * @method _flick","     * @param e {Event.Facade} The Flick event facade","     * @private","     */","    _onFlick: function (e) {","        if (this._cDisabled) {","            return;","        }","","        var sv = this,","            bounce = sv._cBounce,","            bounceRange = sv._cBounceRange,","            deceleration = sv._cDeceleration,","            frameDuration = sv._cFrameDuration,","            minSpeed = 0.15,","            svAxis = sv._cAxis,","            flick = e.flick,","            flickAxis = flick.axis,","            velocity = flick.velocity,","            isVertical = (flickAxis === DIM_Y),","            axisAttr = (isVertical ? SCROLL_Y : SCROLL_X),","            duration = Math.round(Math.log(minSpeed / Math.abs(velocity) ) / Math.log(deceleration)),","            distance = velocity * (1 - Math.pow(deceleration, duration + 1)) / (1 - deceleration),","            currPos = sv.get(axisAttr),","            position = currPos - distance,","            minScroll = (isVertical ? sv._minScrollY : sv._minScrollX),","            maxScroll = (isVertical ? sv._maxScrollY : sv._maxScrollX),","            minBounce = minScroll - bounceRange,","            maxBounce = maxScroll + bounceRange,","            scrollToArgs = [];","","        sv._flick = flick;","","        // Prevent unneccesary firing of _flickFrame if we can't scroll on the flick axis","        if (!svAxis[flickAxis]) {","            return false;","        }","","        // If the current position is outside an edge, then just snap back","        if ((currPos < minScroll) || (currPos > maxScroll)) {","            sv._onTransEnd();","            return;","        }","","        // Or, if current position is in bounds, but the target is out of bounds, contrain it to the bounce range","        else if ((position < minBounce) || (position > maxBounce)) {","            position = _constrain(position, minBounce, maxBounce);","        }","","        // Generate the array of args to pass to scrollTo()","        if (flickAxis === DIM_X) {","            scrollToArgs.push(position);","            scrollToArgs.push(null);","        }","        else {","            scrollToArgs.push(null);","            scrollToArgs.push(position);","        }","","        scrollToArgs.push(duration);","","        sv.scrollTo.apply(sv, scrollToArgs);","    },","","    /**","     * Cancel a flick animation","     *","     * @method _cancelFlick","     * @protected","     */","    _cancelFlick: function () {","        // Instead, use https://github.com/sdesai/yui3/blob/b75138257e5e3ab102da9d67ed22b2a42e75a58a/src/scrollview/js/scrollview-base.js","        var sv = this,","            cb = sv._cb,","            matrix = cb.getStyle('transform'),","            values = matrix.substring(7, (matrix.length-1)).split(','),","            x = (-1 * parseInt(values[4], 10).toFixed(0)),","            y = (-1 * parseInt(values[5], 10).toFixed(0));","","        sv.scrollTo(x, y, 0);","    },","","    /**","     * Handle mousewheel events on the widget","     *","     * @method _mousewheel","     * @param e {Event.Facade} The mousewheel event facade","     * @private","     */","    _onMousewheel: function (e) {","        var sv = this,","            scrollY = sv.get(SCROLL_Y),","            bb = sv._bb,","            scrollOffset = 10, // 10px","            isForward = (e.wheelDelta > 0),","            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);","","        scrollToY = _constrain(scrollToY, sv._minScrollY, sv._maxScrollY);","","        // Because Mousewheel events fire off 'document', every ScrollView widget will react","        // to any mousewheel anywhere on the page. This check will ensure that the mouse is currently","        // over this specific ScrollView.  Also, only allow mousewheel scrolling on Y-axis, ","        // becuase otherwise the 'prevent' will block page scrolling.","        if (bb.contains(e.target) && sv._cAxis[DIM_Y]) {","","            // Reset lastScrolledAmt","            sv.lastScrolledAmt = 0;","","            // Jump to the new offset","            sv.set(SCROLL_Y, scrollToY);","","            // if we have scrollbars plugin, update & set the flash timer on the scrollbar","            // @TODO: This probably shouldn't be in this module","            if (sv.scrollbars) {","                // @TODO: The scrollbars should handle this themselves","                sv.scrollbars._update();","                sv.scrollbars.flash();","                // or just this","                // sv.scrollbars._hostDimensionsChange();","            }","","            // Fire the 'scrollEnd' event","            sv._onTransEnd();","","            // prevent browser default behavior on mouse scroll","            e.preventDefault();","        }","    },","","    /**","     * Checks to see the current scrollX/scrollY position beyond the min/max boundary","     *","     * @method _isOutOfBounds","     * @param x {Number} [optional] The X position to check","     * @param y {Number} [optional] The Y position to check","     * @returns {boolen} Whether the current X/Y position is out of bounds (true) or not (false)","     * @private","     */","    _isOutOfBounds: function (x, y) {","        var sv = this,","            svAxis = sv._cAxis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            currentX = x || sv.get(SCROLL_X),","            currentY = y || sv.get(SCROLL_Y),","            minX = sv._minScrollX,","            minY = sv._minScrollY,","            maxX = sv._maxScrollX,","            maxY = sv._maxScrollY;","","        return (svAxisX && (currentX < minX || currentX > maxX)) || (svAxisY && (currentY < minY || currentY > maxY));","    },","","    /**","     * Bounces back","     * @TODO: Should be more generalized and support both X and Y detection","     *","     * @method _snapBack","     * @private","     */","    _snapBack: function () {","        var sv = this,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            minX = sv._minScrollX,","            minY = sv._minScrollY,","            maxX = sv._maxScrollX,","            maxY = sv._maxScrollY,","            newY = _constrain(currentY, minY, maxY),","            newX = _constrain(currentX, minX, maxX),","            duration = sv.get(SNAP_DURATION),","            easing = sv.get(SNAP_EASING);","","        if (newX !== currentX) {","            sv.set(SCROLL_X, newX, {duration:duration, easing:easing});","        }","        else if (newY !== currentY) {","            sv.set(SCROLL_Y, newY, {duration:duration, easing:easing});","        }","        else {","            // It shouldn't ever get here, but in case it does, fire scrollEnd","            sv._onTransEnd();","        }","    },","","    /**","     * After listener for changes to the scrollX or scrollY attribute","     *","     * @method _afterScrollChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterScrollChange: function (e) {","        if (e.src === ScrollView.UI_SRC) {","            return false;","        }","","        var sv = this,","            duration = e.duration,","            easing = e.easing,","            val = e.newVal,","            scrollToArgs = [];","","        // Set the scrolled value","        sv.lastScrolledAmt = sv.lastScrolledAmt + (e.newVal - e.prevVal);","","        // Generate the array of args to pass to scrollTo()","        if (e.attrName === SCROLL_X) {","            scrollToArgs.push(val);","            scrollToArgs.push(sv.get(SCROLL_Y));","        }","        else {","            scrollToArgs.push(sv.get(SCROLL_X));","            scrollToArgs.push(val);","        }","","        scrollToArgs.push(duration);","        scrollToArgs.push(easing);","","        sv.scrollTo.apply(sv, scrollToArgs);","    },","","    /**","     * After listener for changes to the flick attribute","     *","     * @method _afterFlickChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterFlickChange: function (e) {","        this._bindFlick(e.newVal);","    },","","    /**","     * After listener for changes to the disabled attribute","     *","     * @method _afterDisabledChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDisabledChange: function (e) {","        // Cache for performance - we check during move","        this._cDisabled = e.newVal;","    },","","    /**","     * After listener for the axis attribute","     *","     * @method _afterAxisChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterAxisChange: function (e) {","        this._cAxis = e.newVal;","    },","","    /**","     * After listener for changes to the drag attribute","     *","     * @method _afterDragChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDragChange: function (e) {","        this._bindDrag(e.newVal);","    },","","    /**","     * After listener for the height or width attribute","     *","     * @method _afterDimChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDimChange: function () {","        this._uiDimensionsChange();","    },","","    /**","     * After listener for scrollEnd, for cleanup","     *","     * @method _afterScrollEnd","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterScrollEnd: function (e) {","        var sv = this;","","        // If for some reason we're OOB, snapback","        if (sv._isOutOfBounds()) {","            sv._snapBack();","        }","","        // Ideally this should be removed, but doing so causing some JS errors with fast swiping ","        // because _gesture is being deleted after the previous one has been overwritten","        // sv._gesture = false;","","        sv._flick = false;","    },","","    /**","     * Setter for 'axis' attribute","     *","     * @method _axisSetter","     * @param val {Mixed} A string ('x', 'y', 'xy') to specify which axis/axes to allow scrolling on","     * @param name {String} The attribute name","     * @return {Object} An object to specify scrollability on the x & y axes","     * ","     * @protected","     */","    _axisSetter: function (val, name) {","","        // Turn a string into an axis object","        if (Y.Lang.isString(val)) {","            return {","                x: val.match(/x/i) ? true : false,","                y: val.match(/y/i) ? true : false","            };","        }","    },","    ","    /**","    * The scrollX, scrollY setter implementation","    *","    * @method _setScroll","    * @private","    * @param {Number} val","    * @param {String} dim","    *","    * @return {Number} The value","    */","    _setScroll : function(val, dim) {","","        // Just ensure the widget is not disabled","        if (this._cDisabled) {","            val = Y.Attribute.INVALID_VALUE;","        } ","","        return val;","    },","","    /**","    * Setter for the scrollX attribute","    *","    * @method _setScrollX","    * @param val {Number} The new scrollX value","    * @return {Number} The normalized value","    * @protected","    */","    _setScrollX: function(val) {","        var sv = this,","            min = sv._minScrollX,","            max = sv._maxScrollX;","","        return sv._setScroll(val, DIM_X);","    },","","    /**","    * Setter for the scrollY ATTR","    *","    * @method _setScrollY","    * @param val {Number} The new scrollY value","    * @return {Number} The normalized value","    * @protected","    */","    _setScrollY: function(val) {","        var sv = this,","            min = sv._minScrollY,","            max = sv._maxScrollY;","        ","        return sv._setScroll(val, DIM_Y);","    }","","    // End prototype properties","","}, {","","    // Static properties","","    /**","     * The identity of the widget.","     *","     * @property NAME","     * @type String","     * @default 'scrollview'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'scrollview',","","    /**","     * Static property used to define the default attribute configuration of","     * the Widget.","     *","     * @property ATTRS","     * @type {Object}","     * @protected","     * @static","     */","    ATTRS: {","","        /**","         * Specifies ability to scroll on x, y, or x and y axis/axes.","         *","         * @attribute axis","         * @type String","         */","        axis: {","            setter: '_axisSetter',","            writeOnce: 'initOnly'","        },","","        /**","         * The current scroll position in the x-axis","         *","         * @attribute scrollX","         * @type Number","         * @default 0","         */","        scrollX: {","            value: 0,","            setter: '_setScrollX'","        },","","        /**","         * The current scroll position in the y-axis","         *","         * @attribute scrollY","         * @type Number","         * @default 0","         */","        scrollY: {","            value: 0,","            setter: '_setScrollY'","        },","","        /**","         * Drag coefficent for inertial scrolling. The closer to 1 this","         * value is, the less friction during scrolling.","         *","         * @attribute deceleration","         * @default 0.994","         */","        deceleration: {","            value: 0.994","        },","","        /**","         * Drag coefficient for intertial scrolling at the upper","         * and lower boundaries of the scrollview. Set to 0 to","         * disable \"rubber-banding\".","         *","         * @attribute bounce","         * @type Number","         * @default 0.1","         */","        bounce: {","            value: 0.1","        },","","        /**","         * The minimum distance and/or velocity which define a flick. Can be set to false,","         * to disable flick support (note: drag support is enabled/disabled separately)","         *","         * @attribute flick","         * @type Object","         * @default Object with properties minDistance = 10, minVelocity = 0.3.","         */","        flick: {","            value: {","                minDistance: 10,","                minVelocity: 0.3","            }","        },","","        /**","         * Enable/Disable dragging the ScrollView content (note: flick support is enabled/disabled separately)","         * @attribute drag","         * @type boolean","         * @default true","         */","        drag: {","            value: true","        },","","        /**","         * The default duration to use when animating the bounce snap back.","         *","         * @attribute snapDuration","         * @type Number","         * @default 400","         */","        snapDuration: {","            value: 400","        },","","        /**","         * The default easing to use when animating the bounce snap back.","         *","         * @attribute snapEasing","         * @type String","         * @default 'ease-in'","         */","        snapEasing: {","            value: 'ease-in'","        },","","        /**","         * The default easing used when animating the flick","         *","         * @attribute easing","         * @type String","         * @default 'cubic-bezier(0, 0.1, 0, 1.0)'","         */","        easing: {","            value: 'cubic-bezier(0, 0.1, 0, 1.0)'","        },","","        /**","         * The interval (ms) used when animating the flick for JS-timer animations","         *","         * @attribute frameDuration","         * @type Number","         * @default 15","         */","        frameDuration: {","            value: 15","        },","","        /**","         * The default bounce distance in pixels","         *","         * @attribute bounceRange","         * @type Number","         * @default 20","         */","        bounceRange: {","            value: 20","        }","    },","","    /**","     * List of class names used in the scrollview's DOM","     *","     * @property CLASS_NAMES","     * @type Object","     * @static","     */","    CLASS_NAMES: CLASS_NAMES,","","    /**","     * Flag used to source property changes initiated from the DOM","     *","     * @property UI_SRC","     * @type String","     * @static","     * @default 'ui'","     */","    UI_SRC: UI,","","    /**","     * Object map of style property names used to set transition properties.","     * Defaults to the vendor prefix established by the Transition module.","     * The configured property names are `_TRANSITION.DURATION` (e.g. \"WebkitTransitionDuration\") and","     * `_TRANSITION.PROPERTY (e.g. \"WebkitTransitionProperty\").","     *","     * @property _TRANSITION","     * @private","     */","    _TRANSITION: {","        DURATION: Y.Transition._VENDOR_PREFIX + 'TransitionDuration',","        PROPERTY: Y.Transition._VENDOR_PREFIX + 'TransitionProperty'","    },","","    /**","     * The default bounce distance in pixels","     *","     * @property BOUNCE_RANGE","     * @type Number","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    BOUNCE_RANGE: false,","","    /**","     * The interval (ms) used when animating the flick","     *","     * @property FRAME_STEP","     * @type Number","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    FRAME_STEP: false,","","    /**","     * The default easing used when animating the flick","     *","     * @property EASING","     * @type String","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    EASING: false,","","    /**","     * The default easing to use when animating the bounce snap back.","     *","     * @property SNAP_EASING","     * @type String","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    SNAP_EASING: false,","","    /**","     * The default duration to use when animating the bounce snap back.","     *","     * @property SNAP_DURATION","     * @type Number","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    SNAP_DURATION: false","","    // End static properties","","});","","}, '@VERSION@', {\"requires\": [\"widget\", \"event-gestures\", \"event-mousewheel\", \"transition\"], \"skinnable\": true});"];
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].lines = {"1":0,"11":0,"52":0,"64":0,"65":0,"68":0,"174":0,"177":0,"178":0,"181":0,"182":0,"183":0,"184":0,"185":0,"195":0,"198":0,"199":0,"200":0,"203":0,"206":0,"207":0,"211":0,"212":0,"215":0,"216":0,"219":0,"220":0,"223":0,"224":0,"227":0,"228":0,"243":0,"248":0,"269":0,"273":0,"275":0,"276":0,"288":0,"292":0,"294":0,"295":0,"298":0,"310":0,"315":0,"318":0,"320":0,"332":0,"340":0,"343":0,"348":0,"352":0,"355":0,"358":0,"361":0,"362":0,"374":0,"387":0,"388":0,"389":0,"392":0,"393":0,"395":0,"396":0,"402":0,"404":0,"406":0,"417":0,"427":0,"428":0,"431":0,"432":0,"435":0,"436":0,"437":0,"438":0,"453":0,"454":0,"457":0,"467":0,"468":0,"469":0,"471":0,"472":0,"473":0,"476":0,"477":0,"478":0,"481":0,"483":0,"485":0,"489":0,"490":0,"491":0,"496":0,"497":0,"499":0,"500":0,"507":0,"508":0,"510":0,"511":0,"514":0,"515":0,"518":0,"533":0,"535":0,"536":0,"539":0,"552":0,"553":0,"555":0,"556":0,"569":0,"577":0,"589":0,"590":0,"593":0,"602":0,"603":0,"607":0,"608":0,"609":0,"613":0,"616":0,"619":0,"659":0,"671":0,"672":0,"675":0,"676":0,"680":0,"681":0,"685":0,"686":0,"688":0,"689":0,"702":0,"708":0,"709":0,"713":0,"714":0,"717":0,"718":0,"721":0,"727":0,"730":0,"731":0,"738":0,"739":0,"754":0,"755":0,"758":0,"780":0,"783":0,"784":0,"788":0,"789":0,"790":0,"794":0,"795":0,"799":0,"800":0,"801":0,"804":0,"805":0,"808":0,"810":0,"821":0,"828":0,"839":0,"846":0,"852":0,"855":0,"858":0,"862":0,"864":0,"865":0,"871":0,"874":0,"888":0,"899":0,"910":0,"922":0,"923":0,"925":0,"926":0,"930":0,"942":0,"943":0,"946":0,"953":0,"956":0,"957":0,"958":0,"961":0,"962":0,"965":0,"966":0,"968":0,"979":0,"991":0,"1002":0,"1013":0,"1024":0,"1035":0,"1038":0,"1039":0,"1046":0,"1062":0,"1063":0,"1083":0,"1084":0,"1087":0,"1099":0,"1103":0,"1115":0,"1119":0};
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].functions = {"_constrain:51":0,"ScrollView:64":0,"initializer:173":0,"bindUI:194":0,"_bindAttrs:242":0,"_bindDrag:268":0,"_bindFlick:287":0,"_bindMousewheel:309":0,"syncUI:331":0,"_getScrollDims:373":0,"_uiDimensionsChange:416":0,"scrollTo:451":0,"_transform:531":0,"_moveTo:551":0,"_onTransEnd:568":0,"_onGestureMoveStart:587":0,"_onGestureMove:658":0,"_onGestureMoveEnd:700":0,"_onFlick:753":0,"_cancelFlick:819":0,"_onMousewheel:838":0,"_isOutOfBounds:887":0,"_snapBack:909":0,"_afterScrollChange:941":0,"_afterFlickChange:978":0,"_afterDisabledChange:989":0,"_afterAxisChange:1001":0,"_afterDragChange:1012":0,"_afterDimChange:1023":0,"_afterScrollEnd:1034":0,"_axisSetter:1059":0,"_setScroll:1080":0,"_setScrollX:1098":0,"_setScrollY:1114":0,"(anonymous 1):1":0};
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].coveredLines = 217;
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].coveredFunctions = 35;
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1);
YUI.add('scrollview-base', function (Y, NAME) {

/**
 * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators
 *
 * @module scrollview
 * @submodule scrollview-base
 */

 // Local vars
_yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 11);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_constrain", 51);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 52);
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
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 64);
function ScrollView() {
    _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "ScrollView", 64);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 65);
ScrollView.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/scrollview-base/scrollview-base.js", 68);
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
     * @default 0
     */
    lastScrolledAmt: 0,

    _gesture: false,
    _flick: false,

    /**
     * Internal state, defines the minimum amount that the scrollview can be scrolled along the X axis
     *
     * @property _minScrollX
     * @type number
     * @protected
     */
    _minScrollX: null,

    /**
     * Internal state, defines the maximum amount that the scrollview can be scrolled along the X axis
     *
     * @property _maxScrollX
     * @type number
     * @protected
     */
    _maxScrollX: null,

    /**
     * Internal state, defines the minimum amount that the scrollview can be scrolled along the Y axis
     *
     * @property _minScrollY
     * @type number
     * @protected
     */
    _minScrollY: null,

    /**
     * Internal state, defines the maximum amount that the scrollview can be scrolled along the Y axis
     *
     * @property _maxScrollY
     * @type number
     * @protected
     */
    _maxScrollY: null,
    
    /**
     * Designated initializer
     *
     * @method initializer
     * @param {config} Configuration object for the plugin
     */
    initializer: function (config) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "initializer", 173);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 174);
var sv = this;

        // Cache these values, since they aren't going to change.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 177);
sv._bb = sv.get(BOUNDING_BOX);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 178);
sv._cb = sv.get(CONTENT_BOX);

        // Cache some attributes
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 181);
sv._cAxis = sv.get(AXIS);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 182);
sv._cBounce = sv.get(BOUNCE);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 183);
sv._cBounceRange = sv.get(BOUNCE_RANGE);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 184);
sv._cDeceleration = sv.get(DECELERATION);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 185);
sv._cFrameDuration = sv.get(FRAME_DURATION);
    },

    /**
     * bindUI implementation
     *
     * Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "bindUI", 194);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 195);
var sv = this;

        // Bind interaction listers
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 198);
sv._bindFlick(sv.get(FLICK));
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 199);
sv._bindDrag(sv.get(DRAG));
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 200);
sv._bindMousewheel(true);
        
        // Bind change events
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 203);
sv._bindAttrs();

        // IE SELECT HACK. See if we can do this non-natively and in the gesture for a future release.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 206);
if (IE) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 207);
sv._fixIESelect(sv._bb, sv._cb);
        }

        // Set any deprecated static properties
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 211);
if (ScrollView.SNAP_DURATION) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 212);
sv.set(SNAP_DURATION, ScrollView.SNAP_DURATION);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 215);
if (ScrollView.SNAP_EASING) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 216);
sv.set(SNAP_EASING, ScrollView.SNAP_EASING);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 219);
if (ScrollView.EASING) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 220);
sv.set(EASING, ScrollView.EASING);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 223);
if (ScrollView.FRAME_STEP) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 224);
sv.set(FRAME_DURATION, ScrollView.FRAME_STEP);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 227);
if (ScrollView.BOUNCE_RANGE) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 228);
sv.set(BOUNCE_RANGE, ScrollView.BOUNCE_RANGE);
        }

        // Recalculate dimension properties
        // TODO: This should be throttled.
        // Y.one(WINDOW).after('resize', sv._afterDimChange, sv);
    },

    /**
     * Bind event listeners
     *
     * @method _bindAttrs
     * @private
     */
    _bindAttrs: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindAttrs", 242);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 243);
var sv = this,
            scrollChangeHandler = sv._afterScrollChange,
            dimChangeHandler = sv._afterDimChange;

        // Bind any change event listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 248);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindDrag", 268);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 269);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'drag' listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 273);
bb.detach(DRAG + '|*');

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 275);
if (drag) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 276);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindFlick", 287);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 288);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'flick' listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 292);
bb.detach(FLICK + '|*');

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 294);
if (flick) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 295);
bb.on(FLICK + '|' + FLICK, Y.bind(sv._onFlick, sv), flick);

            // Rebind Drag, becuase _onGestureMoveEnd always has to fire -after- _flick
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 298);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindMousewheel", 309);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 310);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'mousewheel' listeners
        // TODO: This doesn't actually appear to work properly. Fix. #2532743
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 315);
bb.detach(MOUSEWHEEL + '|*');

        // Only enable for vertical scrollviews
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 318);
if (mousewheel) {
            // Bound to document, because that's where mousewheel events fire off of.
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 320);
Y.one(DOCUMENT).on(MOUSEWHEEL, Y.bind(sv._onMousewheel, sv));
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "syncUI", 331);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 332);
var sv = this,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight;

        // If the axis is undefined, auto-calculate it
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 340);
if (sv._cAxis === undefined) {
            // This should only ever be run once (for now).
            // In the future SV might post-load axis changes
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 343);
sv._cAxis = {
                x: (scrollWidth > width),
                y: (scrollHeight > height)
            };

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 348);
sv._set(AXIS, sv._cAxis);
        }
        
        // get text direction on or inherited by scrollview node
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 352);
sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');

        // Cache the disabled value
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 355);
sv._cDisabled = sv.get(DISABLED);

        // Run this to set initial values
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 358);
sv._uiDimensionsChange();

        // If we're out-of-bounds, snap back.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 361);
if (sv._isOutOfBounds()) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 362);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_getScrollDims", 373);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 374);
var sv = this,
            cb = sv._cb,
            bb = sv._bb,
            TRANS = ScrollView._TRANSITION,
            // Ideally using CSSMatrix - don't think we have it normalized yet though.
            // origX = (new WebKitCSSMatrix(cb.getComputedStyle("transform"))).e,
            // origY = (new WebKitCSSMatrix(cb.getComputedStyle("transform"))).f,
            origX = sv.get(SCROLL_X),
            origY = sv.get(SCROLL_Y),
            origHWTransform,
            dims;

        // TODO: Is this OK? Just in case it's called 'during' a transition.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 387);
if (NATIVE_TRANSITIONS) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 388);
cb.setStyle(TRANS.DURATION, ZERO);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 389);
cb.setStyle(TRANS.PROPERTY, EMPTY);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 392);
origHWTransform = sv._forceHWTransforms;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 393);
sv._forceHWTransforms = false; // the z translation was causing issues with picking up accurate scrollWidths in Chrome/Mac.

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 395);
sv._moveTo(cb, 0, 0);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 396);
dims = {
            'offsetWidth': bb.get('offsetWidth'),
            'offsetHeight': bb.get('offsetHeight'),
            'scrollWidth': bb.get('scrollWidth'),
            'scrollHeight': bb.get('scrollHeight')
        };
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 402);
sv._moveTo(cb, -(origX), -(origY));

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 404);
sv._forceHWTransforms = origHWTransform;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 406);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_uiDimensionsChange", 416);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 417);
var sv = this,
            bb = sv._bb,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight,
            rtl = sv.rtl,
            svAxis = sv._cAxis;
            
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 427);
if (svAxis && svAxis.x) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 428);
bb.addClass(CLASS_NAMES.horizontal);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 431);
if (svAxis && svAxis.y) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 432);
bb.addClass(CLASS_NAMES.vertical);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 435);
sv._minScrollX = (rtl) ? Math.min(0, -(scrollWidth - width)) : 0;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 436);
sv._maxScrollX = (rtl) ? 0 : Math.max(0, scrollWidth - width);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 437);
sv._minScrollY = 0;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 438);
sv._maxScrollY = Math.max(0, scrollHeight - height);
    },

    /**
     * Scroll the element to a given xy coordinate
     *
     * @method scrollTo
     * @param x {Number} The x-position to scroll to. (null for no movement)
     * @param y {Number} The y-position to scroll to. (null for no movement)
     * @param {Number} [duration] ms of the scroll animation. (default is 0)
     * @param {String} [easing] An easing equation if duration is set. (default is `easing` attribute)
     * @param {String} [node] The node to transform.  Setting this can be useful in dual-axis paginated instances. (default is the instance's contentBox)
     */
    scrollTo: function (x, y, duration, easing, node) {
        // Check to see if widget is disabled
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "scrollTo", 451);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 453);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 454);
return;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 457);
var sv = this,
            cb = sv._cb,
            TRANS = ScrollView._TRANSITION,
            callback = Y.bind(sv._onTransEnd, sv), // @Todo : cache this
            newX = 0,
            newY = 0,
            transition = {},
            transform;

        // default the optional arguments
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 467);
duration = duration || 0;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 468);
easing = easing || sv.get(EASING); // @TODO: Cache this
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 469);
node = node || cb;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 471);
if (x !== null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 472);
sv.set(SCROLL_X, x, {src:UI});
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 473);
newX = -(x);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 476);
if (y !== null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 477);
sv.set(SCROLL_Y, y, {src:UI});
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 478);
newY = -(y);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 481);
transform = sv._transform(newX, newY);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 483);
if (NATIVE_TRANSITIONS) {
            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 485);
node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);
        }

        // Move
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 489);
if (duration === 0) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 490);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 491);
node.setStyle('transform', transform);
            }
            else {
                // TODO: If both set, batch them in the same update
                // Update: Nope, setStyles() just loops through each property and applies it.
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 496);
if (x !== null) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 497);
node.setStyle(LEFT, newX + PX);
                }
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 499);
if (y !== null) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 500);
node.setStyle(TOP, newY + PX);
                }
            }
        }

        // Animate
        else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 507);
transition.easing = easing;
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 508);
transition.duration = duration / 1000;

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 510);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 511);
transition.transform = transform;
            }
            else {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 514);
transition.left = newX + PX;
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 515);
transition.top = newY + PX;
            }

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 518);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_transform", 531);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 533);
var prop = 'translate(' + x + 'px, ' + y + 'px)';

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 535);
if (this._forceHWTransforms) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 536);
prop += ' translateZ(0)';
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 539);
return prop;
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_moveTo", 551);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 552);
if (NATIVE_TRANSITIONS) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 553);
node.setStyle('transform', this._transform(x, y));
        } else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 555);
node.setStyle(LEFT, x + PX);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 556);
node.setStyle(TOP, y + PX);
        }
    },


    /**
     * Content box transition callback
     *
     * @method _onTransEnd
     * @param {Event.Facade} e The event facade
     * @private
     */
    _onTransEnd: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onTransEnd", 568);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 569);
var sv = this;

        /**
         * Notification event fired at the end of a scroll transition
         *
         * @event scrollEnd
         * @param e {EventFacade} The default event facade.
         */
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 577);
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

        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMoveStart", 587);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 589);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 590);
return false;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 593);
var sv = this,
            bb = sv._bb,
            gesture = sv._gesture,
            flick = sv._flick,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            clientX = e.clientX,
            clientY = e.clientY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 602);
if (sv._prevent.start) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 603);
e.preventDefault();
        }

        // if a flick animation is in progress, cancel it
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 607);
if (flick) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 608);
sv._cancelFlick();
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 609);
sv._onTransEnd();
        }

        // TODO: Review if neccesary (#2530129)
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 613);
e.stopPropagation();

        // Reset lastScrolledAmt
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 616);
sv.lastScrolledAmt = 0;

        // Stores data for this gesture cycle.  Cleaned up later
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 619);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMove", 658);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 659);
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

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 671);
if (sv._prevent.move) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 672);
e.preventDefault();
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 675);
gesture.deltaX = startClientX - clientX;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 676);
gesture.deltaY = startClientY - clientY;

        // Determine if this is a vertical or horizontal movement
        // @TODO: This is crude, but it works.  Investigate more intelligent ways to detect intent
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 680);
if (gesture.axis === null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 681);
gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;
        }

        // Move X or Y.  @TODO: Move both if dualaxis.        
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 685);
if (gesture.axis === DIM_X && svAxisX) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 686);
sv.set(SCROLL_X, startX + gesture.deltaX);
        }
        else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 688);
if (gesture.axis === DIM_Y && svAxisY) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 689);
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

        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMoveEnd", 700);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 702);
var sv = this,
            gesture = sv._gesture,
            flick = sv._flick,
            clientX = e.clientX,
            clientY = e.clientY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 708);
if (sv._prevent.end) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 709);
e.preventDefault();
        }

        // Store the end X/Y coordinates
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 713);
gesture.endClientX = clientX;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 714);
gesture.endClientY = clientY;

        // Cleanup the event handlers
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 717);
gesture.onGestureMove.detach();
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 718);
gesture.onGestureMoveEnd.detach();

        // If this wasn't a flick, wrap up the gesture cycle
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 721);
if (!flick) {
            // @TODO: Be more intelligent about this. Look at the Flick attribute to see 
            // if it is safe to assume _flick did or didn't fire.  
            // Then, the order _flick and _onGestureMoveEnd fire doesn't matter?

            // If there was movement (_onGestureMove fired)
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 727);
if (gesture.deltaX !== null && gesture.deltaY !== null) {

                // If we're out-out-bounds, then snapback
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 730);
if (sv._isOutOfBounds()) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 731);
sv._snapBack();
                }

                // Inbounds
                else {
                    // Don't fire scrollEnd on the gesture axis is the same as paginator's
                    // Not totally confident this is ideal to access a plugin's properties from a host, @TODO revisit
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 738);
if (sv.pages && !sv.pages.get(AXIS)[gesture.axis]) {
                        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 739);
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
    _onFlick: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onFlick", 753);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 754);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 755);
return;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 758);
var sv = this,
            bounce = sv._cBounce,
            bounceRange = sv._cBounceRange,
            deceleration = sv._cDeceleration,
            frameDuration = sv._cFrameDuration,
            minSpeed = 0.15,
            svAxis = sv._cAxis,
            flick = e.flick,
            flickAxis = flick.axis,
            velocity = flick.velocity,
            isVertical = (flickAxis === DIM_Y),
            axisAttr = (isVertical ? SCROLL_Y : SCROLL_X),
            duration = Math.round(Math.log(minSpeed / Math.abs(velocity) ) / Math.log(deceleration)),
            distance = velocity * (1 - Math.pow(deceleration, duration + 1)) / (1 - deceleration),
            currPos = sv.get(axisAttr),
            position = currPos - distance,
            minScroll = (isVertical ? sv._minScrollY : sv._minScrollX),
            maxScroll = (isVertical ? sv._maxScrollY : sv._maxScrollX),
            minBounce = minScroll - bounceRange,
            maxBounce = maxScroll + bounceRange,
            scrollToArgs = [];

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 780);
sv._flick = flick;

        // Prevent unneccesary firing of _flickFrame if we can't scroll on the flick axis
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 783);
if (!svAxis[flickAxis]) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 784);
return false;
        }

        // If the current position is outside an edge, then just snap back
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 788);
if ((currPos < minScroll) || (currPos > maxScroll)) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 789);
sv._onTransEnd();
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 790);
return;
        }

        // Or, if current position is in bounds, but the target is out of bounds, contrain it to the bounce range
        else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 794);
if ((position < minBounce) || (position > maxBounce)) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 795);
position = _constrain(position, minBounce, maxBounce);
        }}

        // Generate the array of args to pass to scrollTo()
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 799);
if (flickAxis === DIM_X) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 800);
scrollToArgs.push(position);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 801);
scrollToArgs.push(null);
        }
        else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 804);
scrollToArgs.push(null);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 805);
scrollToArgs.push(position);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 808);
scrollToArgs.push(duration);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 810);
sv.scrollTo.apply(sv, scrollToArgs);
    },

    /**
     * Cancel a flick animation
     *
     * @method _cancelFlick
     * @protected
     */
    _cancelFlick: function () {
        // Instead, use https://github.com/sdesai/yui3/blob/b75138257e5e3ab102da9d67ed22b2a42e75a58a/src/scrollview/js/scrollview-base.js
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_cancelFlick", 819);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 821);
var sv = this,
            cb = sv._cb,
            matrix = cb.getStyle('transform'),
            values = matrix.substring(7, (matrix.length-1)).split(','),
            x = (-1 * parseInt(values[4], 10).toFixed(0)),
            y = (-1 * parseInt(values[5], 10).toFixed(0));

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 828);
sv.scrollTo(x, y, 0);
    },

    /**
     * Handle mousewheel events on the widget
     *
     * @method _mousewheel
     * @param e {Event.Facade} The mousewheel event facade
     * @private
     */
    _onMousewheel: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onMousewheel", 838);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 839);
var sv = this,
            scrollY = sv.get(SCROLL_Y),
            bb = sv._bb,
            scrollOffset = 10, // 10px
            isForward = (e.wheelDelta > 0),
            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 846);
scrollToY = _constrain(scrollToY, sv._minScrollY, sv._maxScrollY);

        // Because Mousewheel events fire off 'document', every ScrollView widget will react
        // to any mousewheel anywhere on the page. This check will ensure that the mouse is currently
        // over this specific ScrollView.  Also, only allow mousewheel scrolling on Y-axis, 
        // becuase otherwise the 'prevent' will block page scrolling.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 852);
if (bb.contains(e.target) && sv._cAxis[DIM_Y]) {

            // Reset lastScrolledAmt
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 855);
sv.lastScrolledAmt = 0;

            // Jump to the new offset
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 858);
sv.set(SCROLL_Y, scrollToY);

            // if we have scrollbars plugin, update & set the flash timer on the scrollbar
            // @TODO: This probably shouldn't be in this module
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 862);
if (sv.scrollbars) {
                // @TODO: The scrollbars should handle this themselves
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 864);
sv.scrollbars._update();
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 865);
sv.scrollbars.flash();
                // or just this
                // sv.scrollbars._hostDimensionsChange();
            }

            // Fire the 'scrollEnd' event
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 871);
sv._onTransEnd();

            // prevent browser default behavior on mouse scroll
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 874);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_isOutOfBounds", 887);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 888);
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

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 899);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_snapBack", 909);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 910);
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

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 922);
if (newX !== currentX) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 923);
sv.set(SCROLL_X, newX, {duration:duration, easing:easing});
        }
        else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 925);
if (newY !== currentY) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 926);
sv.set(SCROLL_Y, newY, {duration:duration, easing:easing});
        }
        else {
            // It shouldn't ever get here, but in case it does, fire scrollEnd
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 930);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterScrollChange", 941);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 942);
if (e.src === ScrollView.UI_SRC) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 943);
return false;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 946);
var sv = this,
            duration = e.duration,
            easing = e.easing,
            val = e.newVal,
            scrollToArgs = [];

        // Set the scrolled value
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 953);
sv.lastScrolledAmt = sv.lastScrolledAmt + (e.newVal - e.prevVal);

        // Generate the array of args to pass to scrollTo()
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 956);
if (e.attrName === SCROLL_X) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 957);
scrollToArgs.push(val);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 958);
scrollToArgs.push(sv.get(SCROLL_Y));
        }
        else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 961);
scrollToArgs.push(sv.get(SCROLL_X));
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 962);
scrollToArgs.push(val);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 965);
scrollToArgs.push(duration);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 966);
scrollToArgs.push(easing);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 968);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterFlickChange", 978);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 979);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDisabledChange", 989);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 991);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterAxisChange", 1001);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1002);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDragChange", 1012);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1013);
this._bindDrag(e.newVal);
    },

    /**
     * After listener for the height or width attribute
     *
     * @method _afterDimChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDimChange: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDimChange", 1023);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1024);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterScrollEnd", 1034);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1035);
var sv = this;

        // If for some reason we're OOB, snapback
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1038);
if (sv._isOutOfBounds()) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1039);
sv._snapBack();
        }

        // Ideally this should be removed, but doing so causing some JS errors with fast swiping 
        // because _gesture is being deleted after the previous one has been overwritten
        // sv._gesture = false;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1046);
sv._flick = false;
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_axisSetter", 1059);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1062);
if (Y.Lang.isString(val)) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1063);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_setScroll", 1080);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1083);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1084);
val = Y.Attribute.INVALID_VALUE;
        } 

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1087);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_setScrollX", 1098);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1099);
var sv = this,
            min = sv._minScrollX,
            max = sv._maxScrollX;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1103);
return sv._setScroll(val, DIM_X);
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_setScrollY", 1114);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1115);
var sv = this,
            min = sv._minScrollY,
            max = sv._maxScrollY;
        
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1119);
return sv._setScroll(val, DIM_Y);
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
         * The current scroll position in the x-axis
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
         * The current scroll position in the y-axis
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
         * @default 0.994
         */
        deceleration: {
            value: 0.994
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
         * @default 'ease-in'
         */
        snapEasing: {
            value: 'ease-in'
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
         * @default 20
         */
        bounceRange: {
            value: 20
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
