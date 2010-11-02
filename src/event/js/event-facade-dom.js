/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event
 * @submodule event-base
 */

/**
 * Wraps a DOM event, properties requiring browser abstraction are
 * fixed here.  Provids a security layer when required.
 * @class DOMEventFacade
 * @param ev {Event} the DOM event
 * @param currentTarget {HTMLElement} the element the listener was attached to
 * @param wrapper {Event.Custom} the custom event wrapper for this DOM event
 */

    var ua = Y.UA,

    EMPTY = {},

    /**
     * webkit key remapping required for Safari < 3.1
     * @property webkitKeymap
     * @private
     */
    webkitKeymap = {
        63232: 38, // up
        63233: 40, // down
        63234: 37, // left
        63235: 39, // right
        63276: 33, // page up
        63277: 34, // page down
        25:     9, // SHIFT-TAB (Safari provides a different key code in
                   // this case, even though the shiftKey modifier is set)
        63272: 46, // delete
        63273: 36, // home
        63275: 35  // end
    },

    /**
     * Returns a wrapped node.  Intended to be used on event targets,
     * so it will return the node's parent if the target is a text
     * node.
     *
     * If accessing a property of the node throws an error, this is
     * probably the anonymous div wrapper Gecko adds inside text
     * nodes.  This likely will only occur when attempting to access
     * the relatedTarget.  In this case, we now return null because
     * the anonymous div is completely useless and we do not know
     * what the related target was because we can't even get to
     * the element's parent node.
     *
     * @method resolve
     * @private
     */
    resolve = function(n) {
        if (!n) {
            return n;
        }
        try {
            if (n && 3 == n.nodeType) {
                n = n.parentNode;
            }
        } catch(e) {
            return null;
        }

        return Y.one(n);
    },

    DOMEventFacade = function(ev, currentTarget, wrapper) {
        this._event = ev;
        this._currentTarget = currentTarget;
        this._wrapper = wrapper || EMPTY;

        // if not lazy init
        this.init();
    };

Y.extend(DOMEventFacade, Object, {

    init: function() {

        var e = this._event,
            overrides = this._wrapper.overrides,
            x = e.pageX,
            y = e.pageY,
            c,
            currentTarget = this._currentTarget;

        this.altKey   = e.altKey;
        this.ctrlKey  = e.ctrlKey;
        this.metaKey  = e.metaKey;
        this.shiftKey = e.shiftKey;
        this.type     = (overrides && overrides.type) || e.type;
        this.clientX  = e.clientX;
        this.clientY  = e.clientY;

        this.pageX = x;
        this.pageY = y;

        c = e.keyCode || e.charCode;

        if (ua.webkit && (c in webkitKeymap)) {
            c = webkitKeymap[c];
        }

        this.keyCode = c;
        this.charCode = c;
        this.which = e.which || e.charCode || c;
        // this.button = e.button;
        this.button = this.which;

        this.target = resolve(e.target);
        this.currentTarget = resolve(currentTarget);
        this.relatedTarget = resolve(e.relatedTarget);

        if (e.type == "mousewheel" || e.type == "DOMMouseScroll") {
            this.wheelDelta = (e.detail) ? (e.detail * -1) : Math.round(e.wheelDelta / 80) || ((e.wheelDelta < 0) ? -1 : 1);
        }

        if (this._touch) {
            this._touch(e, currentTarget, this._wrapper);
        }
    },

    stopPropagation: function() {
        this._event.stopPropagation();
        this._wrapper.stopped = 1;
        this.stopped = 1;
    },

    stopImmediatePropagation: function() {
        var e = this._event;
        if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
        } else {
            this.stopPropagation();
        }
        this._wrapper.stopped = 2;
        this.stopped = 2;
    },

    preventDefault: function(returnValue) {
        var e = this._event;
        e.preventDefault();
        e.returnValue = returnValue || false;
        this._wrapper.prevented = 1;
        this.prevented = 1;
    },

    halt: function(immediate) {
        if (immediate) {
            this.stopImmediatePropagation();
        } else {
            this.stopPropagation();
        }

        this.preventDefault();
    }

});

DOMEventFacade.resolve = resolve;
Y.DOM2EventFacade = DOMEventFacade;
Y.DOMEventFacade = DOMEventFacade;

    /**
     * The native event
     * @property _event
     */

    /**
     * The X location of the event on the page (including scroll)
     * @property pageX
     * @type int
     */

    /**
     * The Y location of the event on the page (including scroll)
     * @property pageY
     * @type int
     */

    /**
     * The keyCode for key events.  Uses charCode if keyCode is not available
     * @property keyCode
     * @type int
     */

    /**
     * The charCode for key events.  Same as keyCode
     * @property charCode
     * @type int
     */

    /**
     * The button that was pushed.
     * @property button
     * @type int
     */

    /**
     * The button that was pushed.  Same as button.
     * @property which
     * @type int
     */

    /**
     * Node reference for the targeted element
     * @propery target
     * @type Node
     */

    /**
     * Node reference for the element that the listener was attached to.
     * @propery currentTarget
     * @type Node
     */

    /**
     * Node reference to the relatedTarget
     * @propery relatedTarget
     * @type Node
     */

    /**
     * Number representing the direction and velocity of the movement of the mousewheel.
     * Negative is down, the higher the number, the faster.  Applies to the mousewheel event.
     * @property wheelDelta
     * @type int
     */

    /**
     * Stops the propagation to the next bubble target
     * @method stopPropagation
     */

    /**
     * Stops the propagation to the next bubble target and
     * prevents any additional listeners from being exectued
     * on the current target.
     * @method stopImmediatePropagation
     */

    /**
     * Prevents the event's default behavior
     * @method preventDefault
     * @param returnValue {string} sets the returnValue of the event to this value
     * (rather than the default false value).  This can be used to add a customized
     * confirmation query to the beforeunload event).
     */

    /**
     * Stops the event propagation and prevents the default
     * event behavior.
     * @method halt
     * @param immediate {boolean} if true additional listeners
     * on the current target will not be executed
     */
