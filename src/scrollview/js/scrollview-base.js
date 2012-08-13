/*jslint nomen:true sloppy:true*/
/*global YUI*/

/**
* The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators
*
* @module scrollview-base
*/

var getClassName = Y.ClassNameManager.getClassName,
    DOC = Y.config.doc,
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
    MOUSEWHEEL_ENABLED = true,
    UI = 'ui',
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFT = 'left',
    PX = 'px',
    AXIS_X = 'axisX',
    AXIS_Y = 'axisY',
    SCROLL_Y = 'scrollY',
    SCROLL_X = 'scrollX',
    BOUNCE = 'bounce',
    DISABLED = 'disabled',
    DECELERATION = 'deceleration',
    DIM_X = 'x',
    DIM_Y = 'y',
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX = 'contentBox',
    EMPTY = '',
    ZERO = '0s',

    _constrain = function (val, min, max) {
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
function ScrollView() {
    ScrollView.superclass.constructor.apply(this, arguments);
}

Y.ScrollView = Y.extend(ScrollView, Y.Widget, {

    // *** Y.ScrollView prototype

    /**
     * Designated initializer
     *
     * @method initializer
     */
    initializer: function () {
        var sv = this;
        sv._bb = sv.get(BOUNDING_BOX);
        sv._cb = sv.get(CONTENT_BOX);
    },

    /**
     * bindUI implementation
     *
     * Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function () {
        var sv = this;
        sv._bindFlick(sv.get(FLICK));
        sv._bindDrag(sv.get(DRAG));
        // Note: You can find _bindMousewheel() inside syncUI(), becuase it depends on UI details
        sv._bindAttrs();

        // get text direction on or inherited by scrollview node
        sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');
    },

    /**
     * @method _bindAttrs
     * @private
     */
    _bindAttrs: function () {
        var sv = this,
            scrollChangeHandler = sv._afterScrollChange,
            dimChangeHandler = sv._afterDimChange;

        this.after({
            'disabledChange': sv._afterDisabledChange,
            'flickChange': sv._afterFlickChange,
            'dragChange': sv._afterDragChange,
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
        var sv = this;
        if (drag) {
            sv._bb.on(DRAG + '|gesturemovestart', Y.bind(sv._onGestureMoveStart, sv));
        } else {
            sv._bb.detach(DRAG + '|*');
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
        var sv = this;
        if (flick) {
            sv._bb.on(FLICK + '|' + FLICK, Y.bind(sv._flick, sv), flick);
        } else {
            sv._bb.detach(FLICK + '|*');
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
        var sv = this,
            axisY = sv.get(AXIS_Y);

        // Only enable for vertical scrollviews
        if (mousewheel && axisY) {
            Y.one(DOC).on(MOUSEWHEEL, Y.bind(sv._mousewheel, sv));
        } else {
            sv._bb.detach(MOUSEWHEEL + '|*');
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
        var sv = this;
        sv._cDisabled = sv.get(DISABLED);
        sv._uiDimensionsChange();
        sv._bindMousewheel(MOUSEWHEEL_ENABLED);
        if (sv._isOOB()) {
            sv._afterOOB();
        }
    },

    /**
     * Utility method to obtain scrollWidth, scrollHeight,
     * accounting for the impact of translate on scrollWidth, scrollHeight
     * @method _getScrollDims
     * @returns {Array} The offsetWidth, offsetHeight, scrollWidth and scrollHeight as an array: [offsetWidth, offsetHeight, scrollWidth, scrollHeight]
     * @private
     */
    _getScrollDims: function () {
        var sv = this,
            cb = sv._cb,
            bb = sv._bb,
            TRANS = ScrollView._TRANSITION,
            dims;

        // TODO: Is this OK? Just in case it's called 'during' a transition.
        if (NATIVE_TRANSITIONS) {
            cb.setStyle(TRANS.DURATION, ZERO);
            cb.setStyle(TRANS.PROPERTY, EMPTY);
        }

        dims = {
            'offsetWidth': bb.get('offsetWidth'),
            'offsetHeight': bb.get('offsetHeight'),
            'scrollWidth': bb.get('scrollWidth'),
            'scrollHeight': bb.get('scrollHeight')
        };

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
        var sv = this,
            bb = sv._bb,
            scrollDims = this._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight,
            axisX = sv.get(AXIS_X),
            axisY = sv.get(AXIS_Y),
            rtl = sv.rtl;

        sv._minScrollX = (rtl) ? -(scrollWidth - width) : 0;
        sv._maxScrollX = (rtl) ? 0 : (scrollWidth - width);
        sv._minScrollY = 0;
        sv._maxScrollY = scrollHeight - height;
        sv._scrollWidth = scrollWidth;
        sv._scrollHeight = scrollHeight;

        if (axisX) {
            bb.addClass(CLASS_NAMES.horizontal);
        }

        if (axisY) {
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
     * Utility method, to move the given element to the given xy position
     *
     * @method _moveTo
     * @param node {Node} The node to move
     * @param x {Number} The x-position to move to
     * @param y {Number} The y-position to move to
     * @private
     */
    _moveTo: function (node, x, y) {
        if (NATIVE_TRANSITIONS) {
            node.setStyle('transform', this._transform(x, y));
        } else {
            node.setStyle(LEFT, x + PX);
            node.setStyle(TOP, y + PX);
        }
    },

    /**
     * Utility method, to animate the given element to the given xy position
     *
     * @method _animateTo
     * @param x {Number} The x-position to move to
     * @param y {Number} The y-position to move to
     * @param duration {Number} Duration, in ms, of the scroll animation (default is 0)
     * @param easing {String} An easing equation if duration is set
     * @param node {Node} The node to move
     * @private
     */
    _animateTo: function (x, y, duration, easing, node) {
        var sv = this;

        duration = duration || ScrollView.SNAP_DURATION;
        easing = easing || ScrollView.SNAP_EASING;
        node = node || sv._cb;

        sv.set(SCROLL_X, x, { src: 'ui' });
        sv.set(SCROLL_Y, y, { src: 'ui' });

        sv.scrollTo(x, y, duration, easing, node);
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
    scrollTo: function () {
        // Maps to a private method,this allows for easy overriding
        this._scrollTo.apply(this, arguments);
    },

    /**
     * Scroll the element to a given xy coordinate
     *
     * @method scrollTo
     * @param x {Number} The x-position to scroll to
     * @param y {Number} The y-position to scroll to
     * @param duration {Number} Duration, in ms, of the scroll animation (default is 0)
     * @param easing {String} An easing equation if duration is set
     * @param node {Object} The Y.Node instance to do the movement
     * @private
     */
    _scrollTo: function (x, y, duration, easing, node) {

        if (this._cDisabled) {
            return;
        }

        var sv = this,
            cb = sv._cb,
            xSet = (x !== null),
            ySet = (y !== null),
            xMove = (xSet) ? x * -1 : 0,
            yMove = (ySet) ? y * -1 : 0,
            TRANS = ScrollView._TRANSITION,
            callback = sv._boundScollEnded,
            transition;

        duration = duration || 0;
        easing = easing || ScrollView.EASING;
        node = node || cb;

        if (NATIVE_TRANSITIONS) {
            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.
            node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);
        }

        if (duration !== 0) {
            transition = {
                easing: easing,
                duration: duration / 1000
            };

            if (NATIVE_TRANSITIONS) {
                transition.transform = sv._transform(xMove, yMove);
            } else {
                if (xSet) { transition.left = xMove + PX; }
                if (ySet) { transition.top = yMove + PX; }
            }

            if (!callback) {
                callback = sv._boundScollEnded = Y.bind(sv._onTransEnd, sv);
            }

            node.transition(transition, callback);
        } else {
            sv._moveTo(node, xMove, yMove);
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
        var prop = 'translate(' + x + 'px, ' + y + 'px)';
        if (this._forceHWTransforms) {
            prop += ' translateZ(0)';
        }
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
        /**
         * Notification event fired at the end of a scroll transition
         *
         * @event scrollEnd
         * @param e {EventFacade} The default event facade.
         */
        this.fire(EV_SCROLL_END);
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

        if (!this._cDisabled) {
            var sv = this,
                bb = sv._bb,
                axisX = sv.get(AXIS_X),
                axisY = sv.get(AXIS_Y),
                currentX = sv.get(SCROLL_X),
                currentY = sv.get(SCROLL_Y);

            sv._cAxisX = axisX;
            sv._cAxisY = axisY;

            // TODO: Review if neccesary (#2530129)
            e.stopPropagation();

            if (sv._prevent.start) {
                e.preventDefault();
            }

            // if a flick animation is in progress, cancel it
            if (sv._flickAnim) {
                sv._flickAnim.cancel();
            }

            sv._gesture = {
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
                onGestureMove: bb.on(DRAG + '|gesturemove', Y.bind(sv._onGestureMove, sv)),
                onGestureMoveEnd: bb.on(DRAG + '|gesturemoveend', Y.bind(sv._onGestureMoveEnd, sv))
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
        var sv = this,
            gesture = sv._gesture,
            axisX = sv._cAxisX,
            axisY = sv._cAxisY,
            startX = gesture.startX,
            startY = gesture.startY,
            startClientX = gesture.startClientX,
            startClientY = gesture.startClientY,
            clientX = e.clientX,
            clientY = e.clientY;

        if (sv._prevent.move) {
            e.preventDefault();
        }

        gesture.deltaX = startClientX - clientX;
        gesture.deltaY = startClientY - clientY;

        if (gesture.axis === null) {
            gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;
        }

        if (gesture.axis === DIM_X && sv._cAxisX) {
            sv.set(SCROLL_X, startX + gesture.deltaX);
        }

        if (gesture.axis === DIM_Y && sv._cAxisY) {
            sv.set(SCROLL_Y, startY + gesture.deltaY);
        }
    },

    /**
     * gestureend event handler
     *
     * @method _onGestureMoveEnd
     * @param e {Event.Facade} The gesturemoveend event facade
     * @private
     */
    _onGestureMoveEnd: function (e) {
        var sv = this,
            gesture = sv._gesture,
            flick = gesture.flick,
            clientX = e.clientX,
            clientY = e.clientY,
            isOOB;

        if (sv._prevent.end) {
            e.preventDefault();
        }

        gesture.endClientX = clientX;
        gesture.endClientY = clientY;

        gesture.onGestureMove.detach();
        gesture.onGestureMoveEnd.detach();

        // Only if this gesture wasn't a flick, and there was movement
        if (!flick && gesture.deltaX !== null && gesture.deltaY !== null) {
            isOOB = sv._isOOB();
            if (isOOB) {
                sv._afterOOB();
            } else {
                // Don't fire scrollEnd on the gesture axis is the same as paginator's
                // Not totally confident this is a good idea
                if (sv.pages && sv.pages.get('axis') !== gesture.axis) {
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
        var sv = this,
            gesture = sv._gesture,
            axisX = sv._cAxisX,
            axisY = sv._cAxisY,
            flick = e.flick,
            axis;

        if (!sv._cDisabled) {
            axis = flick.axis;

            // We can't scroll on this axis, so prevent unneccesary firing of _flickFrame
            if ((axis === 'x' && axisX) || (axis === 'y' && axisY)) {
                gesture.flick = flick;
                sv._cDecel = sv.get(DECELERATION);
                sv._cBounce = sv.get(BOUNCE);
                sv._cAxisX = sv.get(AXIS_X);
                sv._cAxisY = sv.get(AXIS_Y);
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
        var sv = this,
            gesture = sv._gesture,
            axis = gesture.flick.axis,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            maxX = sv._maxScrollX,
            minY = sv._minScrollY,
            maxY = sv._maxScrollY,
            deceleration = sv._cDecel,
            bounce = sv._cBounce,
            axisX = sv._cAxisX,
            axisY = sv._cAxisY,
            step = ScrollView.FRAME_STEP,
            newX = currentX - (velocity * step),
            newY = currentY - (velocity * step);

        velocity *= deceleration;

        if (sv._isOOB()) {
            // If we're past an edge, bounce back
            sv._afterOOB();
        } else if (Math.abs(velocity).toFixed(4) <= 0.015) {
            // If the velocity gets slow enough, just stop
            sv._onTransEnd();
        } else {
            // Or, animate another frame
            if (axis === DIM_X && axisX) {
                if (newX < minX || newX > maxX) {
                    velocity *= bounce;
                }
                sv.set(SCROLL_X, newX);
            } else if (axis === DIM_Y && axisY) {
                if (newY < minY || newY > maxY) {
                    velocity *= bounce;
                }
                sv.set(SCROLL_Y, newY);
            }

            // TODO: maybe use requestAnimationFrame instead
            sv._flickAnim = Y.later(step, sv, '_flickFrame', [velocity]);
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
        var sv = this,
            scrollY = sv.get(SCROLL_Y),
            bb = sv._bb,
            scrollOffset = 10, // 10px
            isForward = (e.wheelDelta > 0),
            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);

        scrollToY = _constrain(scrollToY, sv._minScrollY, sv._maxScrollY);

        if (bb.contains(e.target)) {
            // Jump to the new offset
            sv.set(SCROLL_Y, scrollToY);

            // if we have scrollbars plugin, update & set the flash timer on the scrollbar
            // TODO: This probably shouldn't be in this module
            if (sv.scrollbars) {
                // TODO: The scrollbars should handle this themselves
                sv.scrollbars._update();
                sv.scrollbars.flash();
                // or just this
                // sv.scrollbars._hostDimensionsChange();
            }

            sv._onTransEnd();

            // prevent browser default behavior on mouse scroll
            e.preventDefault();
        }
    },

    // TODO
    _isOOB: function () {
        var sv = this,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            minY = sv._minScrollY,
            maxX = sv._maxScrollX,
            maxY = sv._maxScrollY;
        return currentX < minX || currentX > maxX || currentY < minY || currentY > maxY;
    },

    // TODO
    _afterOOB: function () {
        var sv = this,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            minY = sv._minScrollY,
            maxX = sv._maxScrollX,
            maxY = sv._maxScrollY,
            newY = _constrain(currentY, minY, maxY),
            newX = _constrain(currentX, minX, maxX);

        if (newX !== currentX || newY !== currentY) {
            sv._animateTo(newX, newY);
        } else {
            sv._onTransEnd();
        }
    },

    /**
     * After listener for changes to the scrollX or scrollY attribute
     *
     * @method _afterScrollChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterScrollChange: function (e) {
        var sv = this,
            duration = e.duration,
            easing = e.easing,
            val = e.newVal;

        if (e.src !== ScrollView.UI_SRC) {
            if (e.attrName === SCROLL_X) {
                sv.scrollTo(val, sv.get(SCROLL_Y), duration, easing);
            } else {
                sv.scrollTo(sv.get(SCROLL_X), val, duration, easing);
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
    _afterFlickChange: function (e) {
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
        this._uiDimensionsChange();
    }

}, {

    // *** Y.ScrollView static properties

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
         *
         *
         * @attribute axisX
         * @type String
         * @default true
         */
        axisX: {
            value: true
        },

        /**
         *
         *
         * @attribute axisY
         * @type String
         * @default true
         */
        axisY: {
            value: true
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
});