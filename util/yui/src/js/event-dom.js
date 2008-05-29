YUI.add("event-dom", function(Y) {

    /*
     * The Event Utility provides utilities for managing DOM Events and tools
     * for building event systems
     *
     * @module event
     * @title Event Utility
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
             * The number of times to poll after window.onload.  This number is
             * increased if additional late-bound handlers are requested after
             * the page load.
             * @property _retryCount
             * @static
             * @private
             */
            var _retryCount = 0;

            /**
             * onAvailable listeners
             * @property _avail
             * @static
             * @private
             */
            var _avail = [];

            /**
             * Custom event wrappers for DOM events.  Key is 
             * 'event:' + Element uid stamp + event type
             * @property _wrappers
             * @type Y.Event.Custom
             * @static
             * @private
             */
            var _wrappers = {};

            /**
             * Custom event wrapper map DOM events.  Key is 
             * Element uid stamp.  Each item is a hash of custom event
             * wrappers as provided in the _wrappers collection.  This
             * provides the infrastructure for getListeners.
             * @property _el_events
             * @static
             * @private
             */
            var _el_events = {};

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
                 * @param {string||string[]}   id the id of the element, or an array
                 * of ids to look for.
                 * @param {function} fn what to execute when the element is found.
                 * @param {object}   p_obj an optional object to be passed back as
                 *                   a parameter to fn.
                 * @param {boolean|object}  p_override If set to true, fn will execute
                 *                   in the context of p_obj, if set to an object it
                 *                   will execute in the context of that object
                 * @param checkContent {boolean} check child node readiness (onContentReady)
                 * @static
                 */
                // @TODO fix arguments
                onAvailable: function(id, fn, p_obj, p_override, checkContent) {

                    // var a = (Y.lang.isString(id)) ? [id] : id;
                    var a = Y.array(id);

                    for (var i=0; i<a.length; i=i+1) {
                        _avail.push({ id:         a[i], 
                                      fn:         fn, 
                                      obj:        p_obj, 
                                      override:   p_override, 
                                      checkReady: checkContent });
                    }
                    _retryCount = this.POLL_RETRYS;
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
                 * @param {string}   id the id of the element to look for.
                 * @param {function} fn what to execute when the element is ready.
                 * @param {object}   p_obj an optional object to be passed back as
                 *                   a parameter to fn.
                 * @param {boolean|object}  p_override If set to true, fn will execute
                 *                   in the context of p_obj.  If an object, fn will
                 *                   exectute in the context of that object
                 *
                 * @static
                 */
                // @TODO fix arguments
                onContentReady: function(id, fn, p_obj, p_override) {
                    this.onAvailable(id, fn, p_obj, p_override, true);
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
                 * @param {function} fn what to execute when the element is found.
                 * @optional context execution context
                 * @optional args 1..n arguments to send to the listener
                 *
                 * @static
                 */
                onDOMReady: function(fn) {
                    // var ev = Y.Event.DOMReadyEvent;
                    // ev.subscribe.apply(ev, arguments);
                    var a = Y.array(arguments, 0, true);
                    a.unshift('event:ready');
                    Y.on.apply(Y, a);
                },

                /**
                 * Appends an event handler
                 *
                 * @method addListener
                 *
                 * @param {String|HTMLElement|Array|NodeList} el An id, an element 
                 *  reference, or a collection of ids and/or elements to assign the 
                 *  listener to.
                 * @param {String}   type     The type of event to append
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
                addListener: function(el, type, fn, obj) {

                    // Y.log('addListener: ' + Y.lang.dump(Y.array(arguments, 0, true), 1));

                    var a=Y.array(arguments, 1, true), override = a[3], E = Y.Event;

                    if (!fn || !fn.call) {
    // throw new TypeError(type + " addListener call failed, callback undefined");
    Y.log(type + " addListener call failed, invalid callback", "error", "Event");
                        return false;
                    }

                    // The el argument can be an array of elements or element ids.
                    if (this._isValidCollection(el)) {

                        // Y.log('collection: ' + el);

                        var handles=[], h, i, l, proc = function(v, k) {
                            // handles.push(this.addListener(el[i], type, fn, obj, override));
                            // Y.log('collection stuff: ' + v);
                            var b = a.slice();
                            b.unshift(v);
                            h = E.addListener.apply(E, b);
                            handles.push(h);
                        };

                        Y.each(el, proc, E);

                        return handles;


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
                            //
                            // defer adding the event until the element is available
                            this.onAvailable(el, function() {
                                // Y.Event.addListener(el, type, fn, obj, override);
                                Y.Event.addListener.apply(Y.Event, Y.array(arguments, 0, true));
                            });

                            return true;
                        }
                    }

                    // Element should be an html element or an array if we get 
                    // here.
                    if (!el) {
                        // this.logger.debug("unable to attach event " + type);
                        return false;
                    }

                    // the custom event key is the uid for the element + type

                    var ek = Y.stamp(el), key = 'event:' + ek + type,
                        cewrapper = _wrappers[key];


                    if (!cewrapper) {
                        // create CE wrapper
                        cewrapper = Y.publish(key, {
                            silent: true,
                            // host: this,
                            bubbles: false
                        });

                        // cache the dom event details in the custom event
                        // for later removeListener calls
                        cewrapper.el = el;
                        cewrapper.type = type;
                        cewrapper.fn = function(e) {
                            cewrapper.fire(Y.Event.getEvent(e, el));
                        };

                        _wrappers[key] = cewrapper;
                        _el_events[ek] = _el_events[ek] || {};
                        _el_events[ek][key] = cewrapper;

                        // attach a listener that fires the custom event
                        this.nativeAdd(el, type, cewrapper.fn, false);
                    }

        
                    // from type, fn, etc to fn, obj, override
                    a = Y.array(arguments, 2, true);
                    // a = a.shift();

                    var context = el;
                    if (override) {
                        if (override === true) {
                            context = obj;
                        } else {
                            context = override;
                        }
                    }

                    a[1] = context;

                    // set context to element if not specified
                    return cewrapper.subscribe.apply(cewrapper, a);


                },

                /**
                 * Removes an event listener
                 *
                 * @method removeListener
                 *
                 * @param {String|HTMLElement|Array|NodeList} el An id, an element 
                 *  reference, or a collection of ids and/or elements to remove
                 *  the listener from.
                 * @param {String} type the type of event to remove.
                 * @param {Function} fn the method the event invokes.  If fn is
                 *  undefined, then all event handlers for the type of event are *  removed.
                 * @return {boolean} true if the unbind was successful, false *  otherwise.
                 * @static
                 */
                removeListener: function(el, type, fn) {

                    if (el && el.detach) {
                        return el.detach();
                    }
                    var i, len, li;

                    // The el argument can be a string
                    if (typeof el == "string") {
                        el = Y.get(el);
                    // The el argument can be an array of elements or element ids.
                    } else if ( this._isValidCollection(el)) {
                        var ok = true;
                        for (i=0,len=el.length; i<len; ++i) {
                            ok = ( this.removeListener(el[i], type, fn) && ok );
                        }
                        return ok;
                    }

                    if (!fn || !fn.call) {
                        // this.logger.debug("Error, function is not valid " + fn);
                        //return false;
                        return this.purgeElement(el, false, type);
                    }


                    var id = 'event:' + Y.stamp(el) + type, 
                        ce = _wrappers[id];
                    if (ce) {
                        return ce.unsubscribe(fn);
                    }

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

                    // Y.log('wrapper for facade: ' + 'event:' + Y.stamp(boundEl) + e.type);

                    return new Y.Event.Facade(ev, boundEl, _wrappers['event:' + Y.stamp(boundEl) + e.type]);
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
                                 (o.each || o.length)              && // o is indexed
                                 !o.tagName            && // o is not an HTML element
                                 !o.alert              && // o is not a window
                                 (o.item || typeof o[0] !== "undefined") );
                    } catch(ex) {
                        Y.log("collection check failure", "warn");
                        return false;
                    }

                },

                /*
                 * Custom event the fires when the dom is initially usable
                 * @event DOMReadyEvent
                 */
                // DOMReadyEvent: new Y.CustomEvent("event:ready", this),
                // DOMReadyEvent: Y.publish("event:ready", this, {
                    // fireOnce: true
                // }),

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
                        // E._ready();
                        Y.fire && Y.fire('event:ready');

                        // Available elements may not have been detected before the
                        // window load event fires. Try to find them now so that the
                        // the user is more likely to get the onAvailable notifications
                        // before the window load notification
                        E._tryPreloadAttach();

                    }
                },

                /*
                 * Fires the DOMReady event listeners the first time the document is
                 * usable.
                 * @method _ready
                 * @static
                 * @private
                 */
                // _ready: function(e) {
                //     var E = Y.Event;
                //     if (!E.DOMReady) {
                //         E.DOMReady=true;

                //         // Fire the content ready custom event
                //         E.DOMReadyEvent.fire();

                //         // Remove the DOMContentLoaded (FF/Opera)
                //         E.nativeRemove(document, "DOMContentLoaded", E._ready);
                //     }
                // },

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
                        return;
                    }

                    if (Y.ua.ie) {
                        // Hold off if DOMReady has not fired and check current
                        // readyState to protect against the IE operation aborted
                        // issue.
                        if (!this.DOMReady) {
                            this.startInterval();
                            return;
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
                        tryAgain = (_retryCount > 0);
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
                    for (i=0,len=_avail.length; i<len; ++i) {
                        item = _avail[i];
                        if (item && !item.checkReady) {
                            el = Y.get(item.id);
                            if (el) {
                                executeItem(el, item);
                                _avail[i] = null;
                            } else {
                                notAvail.push(item);
                            }
                        }
                    }

                    // onContentReady
                    for (i=0,len=_avail.length; i<len; ++i) {
                        item = _avail[i];
                        if (item && item.checkReady) {
                            el = Y.get(item.id);

                            if (el) {
                                // The element is available, but not necessarily ready
                                // @todo should we test parentNode.nextSibling?
                                if (loadComplete || el.nextSibling) {
                                    executeItem(el, item);
                                    _avail[i] = null;
                                }
                            } else {
                                notAvail.push(item);
                            }
                        }
                    }

                    _retryCount = (notAvail.length === 0) ? 0 : _retryCount - 1;

                    if (tryAgain) {
                        // we may need to strip the nulled out items here
                        this.startInterval();
                    } else {
                        clearInterval(this._interval);
                        this._interval = null;
                    }

                    this.locked = false;

                    return;

                },

                /**
                 * Removes all listeners attached to the given element via addListener.
                 * Optionally, the node's children can also be purged.
                 * Optionally, you can specify a specific type of event to remove.
                 * @method purgeElement
                 * @param {HTMLElement} el the element to purge
                 * @param {boolean} recurse recursively purge this element's children
                 * as well.  Use with caution.
                 * @param {string} type optional type of listener to purge. If
                 * left out, all listeners will be removed
                 * @static
                 */
                purgeElement: function(el, recurse, type) {
                    var oEl = (Y.lang.isString(el)) ? Y.get(el) : el,
                        id = Y.stamp(oEl);
                    var lis = this.getListeners(oEl, type), i, len;
                    if (lis) {
                        for (i=0,len=lis.length; i<len ; ++i) {
                            lis[i].unsubscribeAll();
                        }
                    }

                    if (recurse && oEl && oEl.childNodes) {
                        for (i=0,len=oEl.childNodes.length; i<len ; ++i) {
                            this.purgeElement(oEl.childNodes[i], recurse, type);
                        }
                    }
                },

                /**
                 * Returns all listeners attached to the given element via addListener.
                 * Optionally, you can specify a specific type of event to return.
                 * @method getListeners
                 * @param el {HTMLElement|string} the element or element id to inspect 
                 * @param type {string} optional type of listener to return. If
                 * left out, all listeners will be returned
                 * @return {Y.Custom.Event} the custom event wrapper for the DOM event(s)
                 * @static
                 */           
                getListeners: function(el, type) {
                    var results=[], ek = Y.stamp(el), key = (type) ? 'event:' + type : null,
                        evts = _el_events[ek];

                    if (key) {
                        if (evts[key]) {
                            results.push(evts[key]);
                        }
                    } else {
                        for (var i in evts) {
                            results.push(evts[i]);
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

                    var E = Y.Event, i, w;

                    for (i in _wrappers) {
                        w = _wrappers[i];
                        w.unsubscribeAll();
                        E.nativeRemove(w.el, w.type, w.fn);
                        delete _wrappers[i];
                    }

                    E.nativeRemove(window, "unload", E._unload);
                },

                
                /**
                 * Adds a DOM event directly without the caching, cleanup, context adj, etc
                 *
                 * @method nativeAdd
                 * @param {HTMLElement} el      the element to bind the handler to
                 * @param {string}      type   the type of event handler
                 * @param {function}    fn      the callback to invoke
                 * @param {boolen}      capture capture or bubble phase
                 * @static
                 * @private
                 */
                nativeAdd: function(el, type, fn, capture) {
                    if (el.addEventListener) {
                            el.addEventListener(type, fn, !!capture);
                    } else if (el.attachEvent) {
                            el.attachEvent("on" + type, fn);
                    } 
                    // else {
                      //   Y.log('DOM evt error')
                    // }
                },

                /**
                 * Basic remove listener
                 *
                 * @method nativeRemove
                 * @param {HTMLElement} el      the element to bind the handler to
                 * @param {string}      type   the type of event handler
                 * @param {function}    fn      the callback to invoke
                 * @param {boolen}      capture capture or bubble phase
                 * @static
                 * @private
                 */
                nativeRemove: function(el, type, fn, capture) {
                    if (el.removeEventListener) {
                            el.removeEventListener(type, fn, !!capture);
                    } else if (el.detachEvent) {
                            el.detachEvent("on" + type, fn);
                    }
                }
            };

        }();

        var E = Y.Event;

        // Process onAvailable/onContentReady items when when the DOM is ready in IE
        if (Y.ua.ie) {
            Y.subscribe && Y.on('event:ready', E._tryPreloadAttach, E, true);
        }

        E.Custom = Y.CustomEvent;
        E.Subscriber = Y.Subscriber;
        E.Target = Y.EventTarget;

        /**
         * Y.Event.on is an alias for addListener
         * @method on
         * @see addListener
         * @static
         */
        E.attach = function(type, fn, el, data, context) {
            var a = Y.array(arguments, 0, true),
                oEl = a.splice(2, 1);
            a.unshift(oEl[0]);
            return E.addListener.apply(E, a);
        };

        E.detach = function(type, fn, el, data, context) {
            return E.removeListener(el, type, fn, data, context);
        };

        // for the moment each instance will get its own load/unload listeners
        E.nativeAdd(window, "load", E._load);
        E.nativeAdd(window, "unload", E._unload);

        E._tryPreloadAttach();

}, "3.0.0");
