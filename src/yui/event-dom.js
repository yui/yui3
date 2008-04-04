YUI.add("event-dom", function(Y) {

    /**
     * The Event Utility provides utilities for managing DOM Events and tools
     * for building event systems
     *
     * @module event
     * @title Event Utility
     * @namespace Y
     * @requires yahoo
     */

    /**
     * The event utility provides functions to add and remove event listeners,
     * event cleansing.  It also tries to automatically remove listeners it
     * registers during the unload event.
     *
     * @class Event
     * @static
     */
        Y.Event = function() {

            /**
             * True after the onload event has fired
             * @property loadComplete
             * @type boolean
             * @static
             * @private
             */
            var loadComplete =  false;

            /**
             * Cache of wrapped listeners
             * @property listeners
             * @type array
             * @static
             * @private
             */
            var listeners = [];

            /**
             * User-defined unload function that will be fired before all events
             * are detached
             * @property unloadListeners
             * @type array
             * @static
             * @private
             */
            var unloadListeners = [];

            /**
             * Cache of DOM0 event handlers to work around issues with DOM2 events
             * in Safari
             * @property legacyEvents
             * @static
             * @private
             */
            var legacyEvents = [];

            /**
             * Listener stack for DOM0 events
             * @property legacyHandlers
             * @static
             * @private
             */
            var legacyHandlers = [];

            /**
             * The number of times to poll after window.onload.  This number is
             * increased if additional late-bound handlers are requested after
             * the page load.
             * @property retryCount
             * @static
             * @private
             */
            var retryCount = 0;

            /**
             * onAvailable listeners
             * @property onAvailStack
             * @static
             * @private
             */
            var onAvailStack = [];

            /**
             * Lookup table for legacy events
             * @property legacyMap
             * @static
             * @private
             */
            var legacyMap = [];

            /**
             * Counter for auto id generation
             * @property counter
             * @static
             * @private
             */
            var counter = 0;
            
            /**
             * Normalized keycodes for webkit/safari
             * @property webkitKeymap
             * @type {int: int}
             * @private
             * @static
             * @final
             */
            var webkitKeymap = {
                63232: 38, // up
                63233: 40, // down
                63234: 37, // left
                63235: 39, // right
                63276: 33, // page up
                63277: 34, // page down
                25: 9      // SHIFT-TAB (Safari provides a different key code in
                           // this case, even though the shiftKey modifier is set)
            };

            return {

                /**
                 * The number of times we should look for elements that are not
                 * in the DOM at the time the event is requested after the document
                 * has been loaded.  The default is 2000@amp;20 ms, so it will poll
                 * for 40 seconds or until all outstanding handlers are bound
                 * (whichever comes first).
                 * @property POLL_RETRYS
                 * @type int
                 * @static
                 * @final
                 */
                POLL_RETRYS: 2000,

                /**
                 * The poll interval in milliseconds
                 * @property POLL_INTERVAL
                 * @type int
                 * @static
                 * @final
                 */
                POLL_INTERVAL: 20,

                /**
                 * Element to bind, int constant
                 * @property EL
                 * @type int
                 * @static
                 * @final
                 */
                EL: 0,

                /**
                 * Type of event, int constant
                 * @property TYPE
                 * @type int
                 * @static
                 * @final
                 */
                TYPE: 1,

                /**
                 * Function to execute, int constant
                 * @property FN
                 * @type int
                 * @static
                 * @final
                 */
                FN: 2,

                /**
                 * Function wrapped for context correction and cleanup, int constant
                 * @property WFN
                 * @type int
                 * @static
                 * @final
                 */
                WFN: 3,

                /**
                 * Object passed in by the user that will be returned as a 
                 * parameter to the callback, int constant.  Specific to
                 * unload listeners
                 * @property OBJ
                 * @type int
                 * @static
                 * @final
                 */
                UNLOAD_OBJ: 3,

                /**
                 * Adjusted context, either the element we are registering the event
                 * on or the custom object passed in by the listener, int constant
                 * @property ADJ_SCOPE
                 * @type int
                 * @static
                 * @final
                 */
                ADJ_SCOPE: 4,

                /**
                 * The original obj passed into addListener
                 * @property OBJ
                 * @type int
                 * @static
                 * @final
                 */
                OBJ: 5,

                /**
                 * The original context parameter passed into addListener
                 * @property OVERRIDE
                 * @type int
                 * @static
                 * @final
                 */
                OVERRIDE: 6,

                /**
                 * addListener/removeListener can throw errors in unexpected scenarios.
                 * These errors are suppressed, the method returns false, and this property
                 * is set
                 * @property lastError
                 * @static
                 * @type Error
                 */
                lastError: null,


                /**
                 * poll handle
                 * @property _interval
                 * @static
                 * @private
                 */
                _interval: null,

                /**
                 * document readystate poll handle
                 * @property _dri
                 * @static
                 * @private
                 */
                 _dri: null,

                /**
                 * True when the document is initially usable
                 * @property DOMReady
                 * @type boolean
                 * @static
                 */
                DOMReady: false,

                /**
                 * @method startInterval
                 * @static
                 * @private
                 */
                startInterval: function() {
                    if (!this._interval) {
                        var self = this;
                        var callback = function() { self._tryPreloadAttach(); };
                        this._interval = setInterval(callback, this.POLL_INTERVAL);
                    }
                },

                /**
                 * Executes the supplied callback when the item with the supplied
                 * id is found.  This is meant to be used to execute behavior as
                 * soon as possible as the page loads.  If you use this after the
                 * initial page load it will poll for a fixed time for the element.
                 * The number of times it will poll and the frequency are
                 * configurable.  By default it will poll for 10 seconds.
                 *
                 * <p>The callback is executed with a single parameter:
                 * the custom object parameter, if provided.</p>
                 *
                 * @method onAvailable
                 *
                 * @param {string||string[]}   p_id the id of the element, or an array
                 * of ids to look for.
                 * @param {function} p_fn what to execute when the element is found.
                 * @param {object}   p_obj an optional object to be passed back as
                 *                   a parameter to p_fn.
                 * @param {boolean|object}  p_override If set to true, p_fn will execute
                 *                   in the context of p_obj, if set to an object it
                 *                   will execute in the context of that object
                 * @param checkContent {boolean} check child node readiness (onContentReady)
                 * @static
                 */
                onAvailable: function(p_id, p_fn, p_obj, p_override, checkContent) {

                    var a = (Y.lang.isString(p_id)) ? [p_id] : p_id;

                    for (var i=0; i<a.length; i=i+1) {
                        onAvailStack.push({id:         a[i], 
                                           fn:         p_fn, 
                                           obj:        p_obj, 
                                           override:   p_override, 
                                           checkReady: checkContent });
                    }
                    retryCount = this.POLL_RETRYS;
                    this.startInterval();
                },

                /**
                 * Works the same way as onAvailable, but additionally checks the
                 * state of sibling elements to determine if the content of the
                 * available element is safe to modify.
                 *
                 * <p>The callback is executed with a single parameter:
                 * the custom object parameter, if provided.</p>
                 *
                 * @method onContentReady
                 *
                 * @param {string}   p_id the id of the element to look for.
                 * @param {function} p_fn what to execute when the element is ready.
                 * @param {object}   p_obj an optional object to be passed back as
                 *                   a parameter to p_fn.
                 * @param {boolean|object}  p_override If set to true, p_fn will execute
                 *                   in the context of p_obj.  If an object, p_fn will
                 *                   exectute in the context of that object
                 *
                 * @static
                 */
                onContentReady: function(p_id, p_fn, p_obj, p_override) {
                    this.onAvailable(p_id, p_fn, p_obj, p_override, true);
                },

                /**
                 * Executes the supplied callback when the DOM is first usable.  This
                 * will execute immediately if called after the DOMReady event has
                 * fired.   @todo the DOMContentReady event does not fire when the
                 * script is dynamically injected into the page.  This means the
                 * DOMReady custom event will never fire in FireFox or Opera when the
                 * library is injected.  It _will_ fire in Safari, and the IE 
                 * implementation would allow for us to fire it if the defered script
                 * is not available.  We want this to behave the same in all browsers.
                 * Is there a way to identify when the script has been injected 
                 * instead of included inline?  Is there a way to know whether the 
                 * window onload event has fired without having had a listener attached 
                 * to it when it did so?
                 *
                 * <p>The callback is a Event.Custom, so the signature is:</p>
                 * <p>type &lt;string&gt;, args &lt;array&gt;, customobject &lt;object&gt;</p>
                 * <p>For DOMReady events, there are no fire argments, so the
                 * signature is:</p>
                 * <p>"DOMReady", [], obj</p>
                 *
                 *
                 * @method onDOMReady
                 *
                 * @param {function} p_fn what to execute when the element is found.
                 * @param {object}   p_obj an optional object to be passed back as
                 *                   a parameter to p_fn.
                 * @param {boolean|object}  p_context If set to true, p_fn will execute
                 *                   in the context of p_obj, if set to an object it
                 *                   will execute in the context of that object
                 *
                 * @static
                 */
                onDOMReady: function(p_fn, p_obj, p_override) {
                    if (Y.Event.DOMReady) {
                        setTimeout(function() {
                            var s = Y;
                            if (p_override) {
                                if (p_override === true) {
                                    s = p_obj;
                                } else {
                                    s = p_override;
                                }
                            }
                            p_fn.call(s, "event:ready", [], p_obj);
                        }, 0);
                    } else {
                        Y.Event.DOMReadyEvent.subscribe(p_fn, p_obj, p_override);
                    }
                },

                /**
                 * Appends an event handler
                 *
                 * @method addListener
                 *
                 * @param {String|HTMLElement|Array|NodeList} el An id, an element 
                 *  reference, or a collection of ids and/or elements to assign the 
                 *  listener to.
                 * @param {String}   sType     The type of event to append
                 * @param {Function} fn        The method the event invokes
                 * @param {Object}   obj    An arbitrary object that will be 
                 *                             passed as a parameter to the handler
                 * @param {Boolean|object}  override  If true, the obj passed in becomes
                 *                             the execution context of the listener. If an
                 *                             object, this object becomes the execution
                 *                             context.
                 * @return {Boolean} True if the action was successful or defered,
                 *                        false if one or more of the elements 
                 *                        could not have the listener attached,
                 *                        or if the operation throws an exception.
                 * @static
                 */
                addListener: function(el, sType, fn, obj, override) {

                    if (!fn || !fn.call) {
    // throw new TypeError(sType + " addListener call failed, callback undefined");
    Y.log(sType + " addListener call failed, invalid callback", "error", "Event");
                        return false;
                    }

                    // The el argument can be an array of elements or element ids.
                    if ( this._isValidCollection(el)) {
                        var ok = true;
                        for (var i=0,len=el.length; i<len; ++i) {
                            ok = this.addListener(el[i], 
                                           sType, 
                                           fn, 
                                           obj, 
                                           override) && ok;
                        }
                        return ok;

                    } else if (Y.lang.isString(el)) {
                        var oEl = Y.get(el);
                        // If the el argument is a string, we assume it is 
                        // actually the id of the element.  If the page is loaded
                        // we convert el to the actual element, otherwise we 
                        // defer attaching the event until onload event fires

                        // check to see if we need to delay hooking up the event 
                        // until after the page loads.
                        if (oEl) {
                            el = oEl;
                        } else {
                            // defer adding the event until the element is available
                            this.onAvailable(el, function() {
                               Y.Event.addListener(el, sType, fn, obj, override);
                            });

                            return true;
                        }
                    }

                    // Element should be an html element or an array if we get 
                    // here.
                    if (!el) {
                        // this.logger.debug("unable to attach event " + sType);
                        return false;
                    }

                    // we need to make sure we fire registered unload events 
                    // prior to automatically unhooking them.  So we hang on to 
                    // these instead of attaching them to the window and fire the
                    // handles explicitly during our one unload event.
                    if ("unload" == sType && obj !== this) {
                        unloadListeners[unloadListeners.length] =
                                [el, sType, fn, obj, override];
                        return true;
                    }

                    // this.logger.debug("Adding handler: " + el + ", " + sType);

                    // if the user chooses to override the context, we use the custom
                    // object passed in, otherwise the executing context will be the
                    // HTML element that the event is registered on
                    var context = el;
                    if (override) {
                        if (override === true) {
                            context = obj;
                        } else {
                            context = override;
                        }
                    }

                    // wrap the function so we can return the obj object when
                    // the event fires;
                    var wrappedFn = function(e) {
                            return fn.call(context, Y.Event.getEvent(e, el), 
                                    obj);
                        };

                    var li = [el, sType, fn, wrappedFn, context, obj, override];
                    var index = listeners.length;
                    // cache the listener so we can try to automatically unload
                    listeners[index] = li;

                    if (this.useLegacyEvent(el, sType)) {
                        var legacyIndex = this.getLegacyIndex(el, sType);

                        // Add a new dom0 wrapper if one is not detected for this
                        // element
                        if ( legacyIndex == -1 || 
                                    el != legacyEvents[legacyIndex][0] ) {

                            legacyIndex = legacyEvents.length;
                            legacyMap[el.id + sType] = legacyIndex;

                            // cache the signature for the DOM0 event, and 
                            // include the existing handler for the event, if any
                            legacyEvents[legacyIndex] = 
                                [el, sType, el["on" + sType]];
                            legacyHandlers[legacyIndex] = [];

                            el["on" + sType] = 
                                function(e) {
                                    Y.Event.fireLegacyEvent(
                                        Y.Event.getEvent(e), legacyIndex);
                                };
                        }

                        // add a reference to the wrapped listener to our custom
                        // stack of events
                        //legacyHandlers[legacyIndex].push(index);
                        legacyHandlers[legacyIndex].push(li);

                    } else {
                        try {
                            this._simpleAdd(el, sType, wrappedFn, false);
                        } catch(ex) {
                            // handle an error trying to attach an event.  If it fails
                            // we need to clean up the cache
                            this.lastError = ex;
                            this.removeListener(el, sType, fn);
                            return false;
                        }
                    }

                    return true;
                    
                },

                /**
                 * When using legacy events, the handler is routed to this object
                 * so we can fire our custom listener stack.
                 * @method fireLegacyEvent
                 * @static
                 * @private
                 */
                fireLegacyEvent: function(e, legacyIndex) {
                    // this.logger.debug("fireLegacyEvent " + legacyIndex);
                    var ok=true,le,lh,li,context,ret;
                    
                    lh = legacyHandlers[legacyIndex];
                    for (var i=0,len=lh.length; i<len; ++i) {
                        li = lh[i];
                        if ( li && li[this.WFN] ) {
                            context = li[this.ADJ_SCOPE];
                            ret = li[this.WFN].call(context, e);
                            ok = (ok && ret);
                        }
                    }

                    // Fire the original handler if we replaced one.  We fire this
                    // after the other events to keep stopPropagation/preventDefault
                    // that happened in the DOM0 handler from touching our DOM2
                    // substitute
                    le = legacyEvents[legacyIndex];
                    if (le && le[2]) {
                        le[2](e);
                    }
                    
                    return ok;
                },

                /**
                 * Returns the legacy event index that matches the supplied 
                 * signature
                 * @method getLegacyIndex
                 * @static
                 * @private
                 */
                getLegacyIndex: function(el, sType) {
                    var key = this.generateId(el) + sType;
                    if (typeof legacyMap[key] == "undefined") { 
                        return -1;
                    } else {
                        return legacyMap[key];
                    }
                },

                /**
                 * Logic that determines when we should automatically use legacy
                 * events instead of DOM2 events.  Currently this is limited to old
                 * Safari browsers with a broken preventDefault
                 * @method useLegacyEvent
                 * @static
                 * @private
                 */
                useLegacyEvent: function(el, sType) {
                    if (Y.ua.webkit && ("click"==sType || "dblclick"==sType)) {
                        var v = parseInt(Y.ua.webkit, 10);
                        if (!isNaN(v) && v<418) {
                            return true;
                        }
                    }
                    return false;
                },
                        
                /**
                 * Removes an event listener
                 *
                 * @method removeListener
                 *
                 * @param {String|HTMLElement|Array|NodeList} el An id, an element 
                 *  reference, or a collection of ids and/or elements to remove
                 *  the listener from.
                 * @param {String} sType the type of event to remove.
                 * @param {Function} fn the method the event invokes.  If fn is
                 *  undefined, then all event handlers for the type of event are 
                 *  removed.
                 * @return {boolean} true if the unbind was successful, false 
                 *  otherwise.
                 * @static
                 */
                removeListener: function(el, sType, fn) {
                    var i, len, li;

                    // The el argument can be a string
                    if (typeof el == "string") {
                        el = Y.get(el);
                    // The el argument can be an array of elements or element ids.
                    } else if ( this._isValidCollection(el)) {
                        var ok = true;
                        for (i=0,len=el.length; i<len; ++i) {
                            ok = ( this.removeListener(el[i], sType, fn) && ok );
                        }
                        return ok;
                    }

                    if (!fn || !fn.call) {
                        // this.logger.debug("Error, function is not valid " + fn);
                        //return false;
                        return this.purgeElement(el, false, sType);
                    }

                    if ("unload" == sType) {

                        for (i=0, len=unloadListeners.length; i<len; i++) {
                            li = unloadListeners[i];
                            if (li && 
                                li[0] == el && 
                                li[1] == sType && 
                                li[2] == fn) {
                                    //unloadListeners.splice(i, 1);
                                    unloadListeners[i]=null;
                                    return true;
                            }
                        }

                        return false;
                    }

                    var cacheItem = null;

                    // The index is a hidden parameter; needed to remove it from
                    // the method signature because it was tempting users to
                    // try and take advantage of it, which is not possible.
                    var index = arguments[3];
      
                    if ("undefined" === typeof index) {
                        index = this._getCacheIndex(el, sType, fn);
                    }

                    if (index >= 0) {
                        cacheItem = listeners[index];
                    }

                    if (!el || !cacheItem) {
                        // this.logger.debug("cached listener not found");
                        return false;
                    }

                    // this.logger.debug("Removing handler: " + el + ", " + sType);

                    if (this.useLegacyEvent(el, sType)) {
                        var legacyIndex = this.getLegacyIndex(el, sType);
                        var llist = legacyHandlers[legacyIndex];
                        if (llist) {
                            for (i=0, len=llist.length; i<len; ++i) {
                                li = llist[i];
                                if (li && 
                                    li[this.EL] == el && 
                                    li[this.TYPE] == sType && 
                                    li[this.FN] == fn) {
                                        //llist.splice(i, 1);
                                        llist[i]=null;
                                        break;
                                }
                            }
                        }

                    } else {
                        try {
                            this._simpleRemove(el, sType, cacheItem[this.WFN], false);
                        } catch(ex) {
                            this.lastError = ex;
                            return false;
                        }
                    }

                    // removed the wrapped handler
                    delete listeners[index][this.WFN];
                    delete listeners[index][this.FN];
                    //listeners.splice(index, 1);
                    listeners[index]=null;

                    return true;

                },


                 
                /**
                 * Finds the event in the window object, the caller's arguments, or
                 * in the arguments of another method in the callstack.  This is
                 * executed automatically for events registered through the event
                 * manager, so the implementer should not normally need to execute
                 * this function at all.
                 * @method getEvent
                 * @param {Event} e the event parameter from the handler
                 * @param {HTMLElement} boundEl the element the listener is attached to
                 * @return {Event} the event 
                 * @static
                 */
                getEvent: function(e, boundEl) {
                    var ev = e || window.event;

                    if (!ev) {
                        var c = this.getEvent.caller;
                        while (c) {
                            ev = c.arguments[0];
                            if (ev && Event == ev.constructor) {
                                break;
                            }
                            c = c.caller;
                        }
                    }

                    return new Y.Event.Facade(ev, boundEl);
                },

                /**
                 * Returns the charcode for an event
                 * @method getCharCode
                 * @param {Event} ev the event
                 * @return {int} the event's charCode
                 * @static
                 */
                getCharCode: function(ev) {
                    var code = ev.keyCode || ev.charCode || 0;

                    // webkit normalization
                    if (Y.ua.webkit && (code in webkitKeymap)) {
                        code = webkitKeymap[code];
                    }
                    return code;
                },

                /**
                 * Locating the saved event handler data by function ref
                 *
                 * @method _getCacheIndex
                 * @static
                 * @private
                 */
                _getCacheIndex: function(el, sType, fn) {
                    for (var i=0,len=listeners.length; i<len; ++i) {
                        var li = listeners[i];
                        if ( li                 && 
                             li[this.FN] == fn  && 
                             li[this.EL] == el  && 
                             li[this.TYPE] == sType ) {
                            return i;
                        }
                    }

                    return -1;
                },

                /**
                 * Generates an unique ID for the element if it does not already 
                 * have one.
                 * @method generateId
                 * @param el the element to create the id for
                 * @return {string} the resulting id of the element
                 * @static
                 */
                generateId: function(el) {
                    var id = el.id;

                    if (!id) {
                        id = Y.stamp(el);
                        el.id = id;
                    }

                    return id;
                },


                /**
                 * We want to be able to use getElementsByTagName as a collection
                 * to attach a group of events to.  Unfortunately, different 
                 * browsers return different types of collections.  This function
                 * tests to determine if the object is array-like.  It will also 
                 * fail if the object is an array, but is empty.
                 * @method _isValidCollection
                 * @param o the object to test
                 * @return {boolean} true if the object is array-like and populated
                 * @static
                 * @private
                 */
                _isValidCollection: function(o) {
                    try {
                        return ( o                     && // o is something
                                 typeof o !== "string" && // o is not a string
                                 o.length              && // o is indexed
                                 !o.tagName            && // o is not an HTML element
                                 !o.alert              && // o is not a window
                                 typeof o[0] !== "undefined" );
                    } catch(ex) {
                        Y.log("_isValidCollection error, assuming that " +
                    " this is a cross frame problem and not a collection", "warn");
                        return false;
                    }

                },


                /**
                 * Custom event the fires when the dom is initially usable
                 * @event DOMReadyEvent
                 */
                DOMReadyEvent: new Y.CustomEvent("event:ready", this),

                /**
                 * hook up any deferred listeners
                 * @method _load
                 * @static
                 * @private
                 */
                _load: function(e) {

                    if (!loadComplete) {
                        loadComplete = true;
                        var E = Y.Event;

                        // Just in case DOMReady did not go off for some reason
                        E._ready();

                        // Available elements may not have been detected before the
                        // window load event fires. Try to find them now so that the
                        // the user is more likely to get the onAvailable notifications
                        // before the window load notification
                        E._tryPreloadAttach();

                    }
                },

                /**
                 * Fires the DOMReady event listeners the first time the document is
                 * usable.
                 * @method _ready
                 * @static
                 * @private
                 */
                _ready: function(e) {
                    var E = Y.Event;
                    if (!E.DOMReady) {
                        E.DOMReady=true;

                        // Fire the content ready custom event
                        E.DOMReadyEvent.fire();

                        // Remove the DOMContentLoaded (FF/Opera)
                        E._simpleRemove(document, "DOMContentLoaded", E._ready);
                    }
                },

                /**
                 * Polling function that runs before the onload event fires, 
                 * attempting to attach to DOM Nodes as soon as they are 
                 * available
                 * @method _tryPreloadAttach
                 * @static
                 * @private
                 */
                _tryPreloadAttach: function() {

                    if (this.locked) {
                        return false;
                    }

                    if (Y.ua.ie) {
                        // Hold off if DOMReady has not fired and check current
                        // readyState to protect against the IE operation aborted
                        // issue.
                        if (!this.DOMReady) {
                            this.startInterval();
                            return false;
                        }
                    }

                    this.locked = true;

                    // this.logger.debug("tryPreloadAttach");

                    // keep trying until after the page is loaded.  We need to 
                    // check the page load state prior to trying to bind the 
                    // elements so that we can be certain all elements have been 
                    // tested appropriately
                    var tryAgain = !loadComplete;
                    if (!tryAgain) {
                        tryAgain = (retryCount > 0);
                    }

                    // onAvailable
                    var notAvail = [];

                    var executeItem = function (el, item) {
                        var context = el;
                        if (item.override) {
                            if (item.override === true) {
                                context = item.obj;
                            } else {
                                context = item.override;
                            }
                        }
                        item.fn.call(context, item.obj);
                    };

                    var i,len,item,el;

                    // onAvailable
                    for (i=0,len=onAvailStack.length; i<len; ++i) {
                        item = onAvailStack[i];
                        if (item && !item.checkReady) {
                            el = Y.get(item.id);
                            if (el) {
                                executeItem(el, item);
                                onAvailStack[i] = null;
                            } else {
                                notAvail.push(item);
                            }
                        }
                    }

                    // onContentReady
                    for (i=0,len=onAvailStack.length; i<len; ++i) {
                        item = onAvailStack[i];
                        if (item && item.checkReady) {
                            el = Y.get(item.id);

                            if (el) {
                                // The element is available, but not necessarily ready
                                // @todo should we test parentNode.nextSibling?
                                if (loadComplete || el.nextSibling) {
                                    executeItem(el, item);
                                    onAvailStack[i] = null;
                                }
                            } else {
                                notAvail.push(item);
                            }
                        }
                    }

                    retryCount = (notAvail.length === 0) ? 0 : retryCount - 1;

                    if (tryAgain) {
                        // we may need to strip the nulled out items here
                        this.startInterval();
                    } else {
                        clearInterval(this._interval);
                        this._interval = null;
                    }

                    this.locked = false;

                    return true;

                },

                /**
                 * Removes all listeners attached to the given element via addListener.
                 * Optionally, the node's children can also be purged.
                 * Optionally, you can specify a specific type of event to remove.
                 * @method purgeElement
                 * @param {HTMLElement} el the element to purge
                 * @param {boolean} recurse recursively purge this element's children
                 * as well.  Use with caution.
                 * @param {string} sType optional type of listener to purge. If
                 * left out, all listeners will be removed
                 * @static
                 */
                purgeElement: function(el, recurse, sType) {
                    var oEl = (Y.lang.isString(el)) ? Y.get(el) : el;
                    var elListeners = this.getListeners(oEl, sType), i, len;
                    if (elListeners) {
                        for (i=0,len=elListeners.length; i<len ; ++i) {
                            var l = elListeners[i];
                            this.removeListener(oEl, l.type, l.fn, l.index);
                        }
                    }

                    if (recurse && oEl && oEl.childNodes) {
                        for (i=0,len=oEl.childNodes.length; i<len ; ++i) {
                            this.purgeElement(oEl.childNodes[i], recurse, sType);
                        }
                    }
                },

                /**
                 * Returns all listeners attached to the given element via addListener.
                 * Optionally, you can specify a specific type of event to return.
                 * @method getListeners
                 * @param el {HTMLElement|string} the element or element id to inspect 
                 * @param sType {string} optional type of listener to return. If
                 * left out, all listeners will be returned
                 * @return {Object} the listener. Contains the following fields:
                 * &nbsp;&nbsp;type:   (string)   the type of event
                 * &nbsp;&nbsp;fn:     (function) the callback supplied to addListener
                 * &nbsp;&nbsp;obj:    (object)   the custom object supplied to addListener
                 * &nbsp;&nbsp;adjust: (boolean|object)  whether or not to adjust the default context
                 * &nbsp;&nbsp;context: (boolean)  the derived context based on the adjust parameter
                 * &nbsp;&nbsp;index:  (int)      its position in the Event util listener cache
                 * @static
                 */           
                getListeners: function(el, sType) {
                    var results=[], searchLists;
                    if (!sType) {
                        searchLists = [listeners, unloadListeners];
                    } else if (sType === "unload") {
                        searchLists = [unloadListeners];
                    } else {
                        searchLists = [listeners];
                    }

                    var oEl = (Y.lang.isString(el)) ? Y.get(el) : el;

                    for (var j=0;j<searchLists.length; j=j+1) {
                        var searchList = searchLists[j];
                        if (searchList && searchList.length > 0) {
                            for (var i=0,len=searchList.length; i<len ; ++i) {
                                var l = searchList[i];
                                if ( l  && l[this.EL] === oEl && 
                                        (!sType || sType === l[this.TYPE]) ) {
                                    results.push({
                                        type:   l[this.TYPE],
                                        fn:     l[this.FN],
                                        obj:    l[this.OBJ],
                                        adjust: l[this.OVERRIDE],
                                        context:  l[this.ADJ_SCOPE],
                                        index:  i
                                    });
                                }
                            }
                        }
                    }

                    return (results.length) ? results : null;
                },

                /**
                 * Removes all listeners registered by pe.event.  Called 
                 * automatically during the unload event.
                 * @method _unload
                 * @static
                 * @private
                 */
                _unload: function(e) {

                    var E = Y.Event, i, j, l, len, index;

                    // execute and clear stored unload listeners
                    for (i=0,len=unloadListeners.length; i<len; ++i) {
                        l = unloadListeners[i];
                        if (l) {
                            var context = Y;
                            if (l[E.ADJ_SCOPE]) {
                                if (l[E.ADJ_SCOPE] === true) {
                                    context = l[E.UNLOAD_OBJ];
                                } else {
                                    context = l[E.ADJ_SCOPE];
                                }
                            }
                            l[E.FN].call(context, E.getEvent(e, l[E.EL]), l[E.UNLOAD_OBJ] );
                            unloadListeners[i] = null;
                            l=null;
                            context=null;
                        }
                    }

                    unloadListeners = null;

                    // Remove listeners to handle IE memory leaks
                    //if (Y.ua.ie && listeners && listeners.length > 0) {
                    
                    // 2.5.0 listeners are removed for all browsers again.  FireFox preserves
                    // at least some listeners between page refreshes, potentially causing
                    // errors during page load (mouseover listeners firing before they
                    // should if the user moves the mouse at the correct moment).
                    if (listeners && listeners.length > 0) {
                        j = listeners.length;
                        while (j) {
                            index = j-1;
                            l = listeners[index];
                            if (l) {
                                E.removeListener(l[E.EL], l[E.TYPE], l[E.FN], index);
                            } 
                            j--;
                        }
                        l=null;
                    }

                    legacyEvents = null;

                    E._simpleRemove(window, "unload", E._unload);

                },

                
                /**
                 * Adds a DOM event directly without the caching, cleanup, context adj, etc
                 *
                 * @method _simpleAdd
                 * @param {HTMLElement} el      the element to bind the handler to
                 * @param {string}      sType   the type of event handler
                 * @param {function}    fn      the callback to invoke
                 * @param {boolen}      capture capture or bubble phase
                 * @static
                 * @private
                 */
                _simpleAdd: function () {
                    if (window.addEventListener) {
                        return function(el, sType, fn, capture) {
                            el.addEventListener(sType, fn, (capture));
                        };
                    } else if (window.attachEvent) {
                        return function(el, sType, fn, capture) {
                            el.attachEvent("on" + sType, fn);
                        };
                    } else {
                        return function(){};
                    }
                }(),

                /**
                 * Basic remove listener
                 *
                 * @method _simpleRemove
                 * @param {HTMLElement} el      the element to bind the handler to
                 * @param {string}      sType   the type of event handler
                 * @param {function}    fn      the callback to invoke
                 * @param {boolen}      capture capture or bubble phase
                 * @static
                 * @private
                 */
                _simpleRemove: function() {
                    if (window.removeEventListener) {
                        return function (el, sType, fn, capture) {
                            el.removeEventListener(sType, fn, (capture));
                        };
                    } else if (window.detachEvent) {
                        return function (el, sType, fn) {
                            el.detachEvent("on" + sType, fn);
                        };
                    } else {
                        return function(){};
                    }
                }()
            };

        }();

}, "3.0.0");
