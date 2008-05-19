YUI.add("event-facade", function(Y) {

    /*

    var whitelist = {
        "altKey"          : 1,
        "button"          : 1, // we supply
        "bubbles"         : 1,
        "cancelable"      : 1,
        "charCode"        : 1, // we supply
        "cancelBubble"    : 1,
        "currentTarget"   : 1,
        "ctrlKey"         : 1,
        "clientX"         : 1,
        "clientY"         : 1,
        "detail"          : 1, // not fully implemented
        // "fromElement"     : 1,
        "keyCode"         : 1,
        "height"          : 1,
        "initEvent"       : 1, // need the init events?
        "initMouseEvent"  : 1,
        "initUIEvent"     : 1,
        "layerX"          : 1,
        "layerY"          : 1,
        "metaKey"         : 1,
        "modifiers"       : 1,
        "offsetX"         : 1,
        "offsetY"         : 1,
        "preventDefault"  : 1, // we supply
        // "reason"          : 1, // IE proprietary
        // "relatedTarget"   : 1,
        "returnValue"     : 1,
        "shiftKey"        : 1,
        // "srcUrn"          : 1, // IE proprietary
        // "srcElement"      : 1,
        // "srcFilter"       : 1, IE proprietary
        "stopPropagation" : 1, // we supply
        // "target"          : 1,
        "timeStamp"       : 1,
        // "toElement"       : 1,
        "type"            : 1,
        // "view"            : 1,
        "which"           : 1, // we supply
        "width"           : 1,
        "x"               : 1,
        "y"               : 1
    };

    */
    var ua = Y.ua,

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
            25: 9      // SHIFT-TAB (Safari provides a different key code in
                       // this case, even though the shiftKey modifier is set)
        },

        /**
         * Wraps an element in a Node facade
         * @method wrapNode
         * @private
         */
        wrapNode = function(n) {
            return (n) ? Y.Node.get(n) : n;
        },

        // resolve = (ua.webkit) ? function(n) {
        //     try {
        //         if (ua.webkit && n && 3 == n.nodeType) {
        //             n = n.parentNode;
        //         } 
        //     } catch(ex) { }
        //     return wrapNode(n);
        // } : function(n) {
        //     return wrapNode(n);
        // };

        /**
         * Returns a wrapped node.  Intended to be used on event targets,
         * so it will return the node's parent if the target is a text
         * node
         * @method resolve
         * @private
         */
        resolve = function(n) {
            try {
                if (ua.webkit && n && 3 == n.nodeType) {
                    n = n.parentNode;
                } 
            } catch(ex) { }

            return wrapNode(n);
        };


    // provide a single event with browser abstractions resolved
    //
    // include all properties for both browers?
    // include only DOM2 spec properties?
    // provide browser-specific facade?

    /**
     * Wraps a DOM event, properties requiring browser abstraction are
     * fixed here.  Provids a security layer when required.
     * @class Event.Facade
     * @param ev {Event} the DOM event
     * @param origTarg {HTMLElement} the element the listener was attached to
     * @param wrapper {Event.Custom} the custom event wrapper for this DOM event
     */
    Y.Event.Facade = function(ev, origTarg, wrapper, details) {

        // @TODO the document should be the target's owner document

        var e = ev, ot = origTarg, d = document, b = d.body,
            x = e.pageX, y = e.pageY;

        // copy all primitives
        for (var i in e) {
            if (!Y.lang.isObject(e[i])) {
                this[i] = e[i];
            }
        }

        //////////////////////////////////////////////////////

        if (!x && 0 !== x) {
            x = e.clientX || 0;
            y = e.clientY || 0;

            if (ua.ie) {
                x += b.scrollLeft;
                y += b.scrollTop;
            }
        }

        /**
         * The X location of the event on the page (including scroll)
         * @property pageX
         * @type int
         */
        this.pageX = x;

        /**
         * The Y location of the event on the page (including scroll)
         * @property pageY
         * @type int
         */
        this.pageY = y;

        //////////////////////////////////////////////////////

        /**
         * The keyCode for key events.  Uses charCode if keyCode is not available
         * @property keyCode
         * @type int
         */
        var c = e.keyCode || e.charCode || 0;

        if (ua.webkit && (c in webkitKeymap)) {
            c = webkitKeymap[c];
        }

        /**
         * The keyCode for key events.  Uses charCode if keyCode is not available
         * @property keyCode
         * @type int
         */
        this.keyCode = c;

        /**
         * The charCode for key events.  Same as keyCode
         * @property charCode
         * @type int
         */
        this.charCode = c;

        //////////////////////////////////////////////////////

        /**
         * The button that was pushed.  Same as button.
         * @property which
         * @type int
         */
        this.which = e.which || e.button;

        /**
         * The event details.  Currently supported for Custom
         * Events only, where it contains the arguments that
         * were passed to fire().
         * @property details
         * @type Array
         */
        this.details = details;

        //////////////////////////////////////////////////////

        /**
         * Timestamp for the event
         * @property time
         * @type Date
         */
        this.time = e.time || new Date().getTime();

        //////////////////////////////////////////////////////
        
        /**
         * Node reference for the targeted element
         * @propery target
         * @type Node
         */
        this.target = resolve(e.target || e.srcElement);

        /**
         * Node reference for the element that the listener was attached to.
         * @propery originalTarget
         * @type Node
         */
        this.originalTarget = resolve(ot);

        var t = e.relatedTarget;
        if (!t) {
            if (e.type == "mouseout") {
                t = e.toElement;
            } else if (e.type == "mouseover") {
                t = e.fromElement;
            }
        }

        /**
         * Node reference to the relatedTarget
         * @propery relatedTarget
         * @type Node
         */
        this.relatedTarget = resolve(t);
        
        //////////////////////////////////////////////////////
        // methods

        /**
         * Stops the propagation to the next bubble target
         * @method stopPropagation
         */
        this.stopPropagation = function() {
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            wrapper && wrapper.stopPropagation();
        };

        /**
         * Stops the propagation to the next bubble target and
         * prevents any additional listeners from being exectued
         * on the current target.
         * @method stopImmediatePropagation
         */
        this.stopImmediatePropagation = function() {
            this.stopPropagation();
            wrapper && wrapper.stopImmediatePropagation();
        };

        /**
         * Prevents the event's default behavior
         * @method preventDefault
         */
        this.preventDefault = function() {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            wrapper && wrapper.preventDefault();
        };

        /**
         * Stops the event propagation and prevents the default
         * event behavior.
         * @method halt
         * @param immediate {boolean} if true additional listeners
         * on the current target will not be executed
         */
        this.halt = function(immediate) {
            if (immediate) {
                this.stopImmediatePropagation();
            } else {
                this.stopPropagation();
            }
            this.preventDefault();
        };

    };

}, "3.0.0");
