
/*global YAHOO*/
/*global YUI*/
/*global YUI_config*/

var COMPAT_ARG = '~yui|2|compat~', o, L;


if (window.YAHOO != YUI) {

    // get any existing YAHOO obj props
    o = (window.YAHOO) ? YUI.merge(window.YAHOO) : null;

    // Make the YUI global the YAHOO global
    window.YAHOO = YUI;

    // augment old YAHOO props
    if (o) {
        Y.mix(Y, o);
    }
}

// add old namespaces
Y.namespace("util", "widget", "example");

// case/location change
Y.env = (Y.env) ? Y.mix(Y.env, Y.Env) : Y.Env;
Y.lang = (Y.lang) ? Y.mix(Y.lang, Y.Lang) : Y.Lang;
Y.env.ua = Y.UA;

// support Y.register
Y.mix(Y.env, {
        modules: [],
        listeners: [],
        getVersion: function(name) {
            return this.Env.modules[name] || null;
        }
});

L = Y.lang;

// add old lang properties
Y.mix(L, {

    augmentObject: function(r, s) {
        var a = arguments, wl = (a.length > 2) ? Y.Array(a, 2, true) : null,
            ov = (wl), args = [r, s, ov];

        if (wl && wl[0] !== true) {
            args.push(wl);
        }

        return Y.mix.apply(Y, args);
    },

    augmentProto: function(r, s) {
        var a = arguments, wl = (a.length > 2) ? Y.Array(a, 2, true) : null,
            ov = (wl), args = [r, s, ov];
        return Y.augment.apply(Y, args);
    },

    // extend: Y.bind(Y.extend, Y),
    extend: Y.extend,
    // merge: Y.bind(Y.merge, Y)
    merge: Y.merge
}, true);

L.augment = L.augmentProto;

L.hasOwnProperty = function(o, k) {
    return (o.hasOwnProperty(k));
};

Y.augmentProto = L.augmentProto;

// add register function
Y.mix(Y, {
    register: function(name, mainClass, data) {
        var mods = Y.Env.modules;
        if (!mods[name]) {
            mods[name] = { versions:[], builds:[] };
        }
        var m=mods[name],v=data.version,b=data.build,ls=Y.Env.listeners;
        m.name = name;
        m.version = v;
        m.build = b;
        m.versions.push(v);
        m.builds.push(b);
        m.mainClass = mainClass;
        // fire the module load listeners
        for (var i=0;i<ls.length;i=i+1) {
            ls[i](m);
        }
        // label the main class
        if (mainClass) {
            mainClass.VERSION = v;
            mainClass.BUILD = b;
        } else {
            Y.log("mainClass is undefined for module " + name, "warn");
        }
    }
});

// add old load listeners
if ("undefined" != typeof YAHOO_config) {
    var l=YAHOO_config.listener,ls=Y.Env.listeners,unique=true,i;
    if (l) {
        // if YAHOO is loaded multiple times we need to check to see if
        // this is a new config object.  If it is, add the new component
        // load listener to the stack
        for (i=0;i<ls.length;i=i+1) {
            if (ls[i]==l) {
                unique=false;
                break;
            }
        }
        if (unique) {
            ls.push(l);
        }
    }
}

// add old registration for yahoo
Y.register("yahoo", Y, {version: "@VERSION@", build: "@BUILD@"});

if (Y.Event) {

    o = {

        /**
         * Safari detection
         * @property isSafari
         * @private
         * @static
         * @deprecated use Y.Env.UA.webkit
         */
        isSafari: Y.UA.webkit,

        /**
         * webkit version
         * @property webkit
         * @type string
         * @private
         * @static
         * @deprecated use Y.Env.UA.webkit
         */
        webkit: Y.UA.webkit,

        /**
         * Normalized keycodes for webkit/safari
         * @property webkitKeymap
         * @type {int: int}
         * @private
         * @static
         * @final
         */
        webkitKeymap: {
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
         * IE detection
         * @property isIE
         * @private
         * @static
         * @deprecated use Y.Env.UA.ie
         */
        isIE: Y.UA.ie,

        /**
         * Returns scrollLeft
         * @method _getScrollLeft
         * @static
         * @private
         */
        _getScrollLeft: function() {
            return this._getScroll()[1];
        },

        /**
         * Returns scrollTop
         * @method _getScrollTop
         * @static
         * @private
         */
        _getScrollTop: function() {
            return this._getScroll()[0];
        },

        /**
         * Returns the scrollTop and scrollLeft.  Used to calculate the
         * pageX and pageY in Internet Explorer
         * @method _getScroll
         * @static
         * @private
         */
        _getScroll: function() {
            var d = Y.config.doc, dd = d.documentElement, db = d.body;
            if (dd && (dd.scrollTop || dd.scrollLeft)) {
                return [dd.scrollTop, dd.scrollLeft];
            } else if (db) {
                return [db.scrollTop, db.scrollLeft];
            } else {
                return [0, 0];
            }
        },

        /**
         * Returns the event's pageX
         * @method getPageX
         * @param {Event} ev the event
         * @return {int} the event's pageX
         * @static
         */
        getPageX: function(ev) {
            var x = ev.pageX;
            if (!x && 0 !== x) {
                x = ev.clientX || 0;

                if ( Y.UA.ie ) {
                    x += this._getScrollLeft();
                }
            }

            return x;
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
            if (Y.UA.webkit && (code in Y.Event.webkitKeymap)) {
                code = Y.Event.webkitKeymap[code];
            }
            return code;
        },

        /**
         * Returns the event's pageY
         * @method getPageY
         * @param {Event} ev the event
         * @return {int} the event's pageY
         * @static
         */
        getPageY: function(ev) {
            var y = ev.pageY;
            if (!y && 0 !== y) {
                y = ev.clientY || 0;

                if ( Y.UA.ie ) {
                    y += this._getScrollTop();
                }
            }


            return y;
        },

        /**
         * Returns the pageX and pageY properties as an indexed array.
         * @method getXY
         * @param {Event} ev the event
         * @return {[x, y]} the pageX and pageY properties of the event
         * @static
         */
        getXY: function(ev) {
            return [this.getPageX(ev), this.getPageY(ev)];
        },

        /**
         * Returns the event's related target
         * @method getRelatedTarget
         * @param {Event} ev the event
         * @return {HTMLElement} the event's relatedTarget
         * @static
         */
        getRelatedTarget: function(ev) {
            var t = ev.relatedTarget;
            if (!t) {
                if (ev.type == "mouseout") {
                    t = ev.toElement;
                } else if (ev.type == "mouseover") {
                    t = ev.fromElement;
                }
            }

            return this.resolveTextNode(t);
        },

        /**
         * Returns the time of the event.  If the time is not included, the
         * event is modified using the current time.
         * @method getTime
         * @param {Event} ev the event
         * @return {Date} the time of the event
         * @static
         */
        getTime: function(ev) {
            if (!ev.time) {
                var t = new Date().getTime();
                try {
                    ev.time = t;
                } catch(ex) {
                    this.lastError = ex;
                    return t;
                }
            }

            return ev.time;
        },

        /**
         * Convenience method for stopPropagation + preventDefault
         * @method stopEvent
         * @param {Event} ev the event
         * @static
         */
        stopEvent: function(ev) {
            this.stopPropagation(ev);
            this.preventDefault(ev);
        },

        /**
         * Stops event propagation
         * @method stopPropagation
         * @param {Event} ev the event
         * @static
         */
        stopPropagation: function(ev) {
            if (ev.stopPropagation) {
                ev.stopPropagation();
            } else {
                ev.cancelBubble = true;
            }
        },

        /**
         * Prevents the default behavior of the event
         * @method preventDefault
         * @param {Event} ev the event
         * @static
         */
        preventDefault: function(ev) {
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                ev.returnValue = false;
            }
        },

        /**
         * Returns the event's target element.  Safari sometimes provides
         * a text node, and this is automatically resolved to the text
         * node's parent so that it behaves like other browsers.
         * @method getTarget
         * @param {Event} ev the event
         * @param {boolean} resolveTextNode when set to true the target's
         *                  parent will be returned if the target is a
         *                  text node.  @deprecated, the text node is
         *                  now resolved automatically
         * @return {HTMLElement} the event's target
         * @static
         */
        getTarget: function(ev, resolveTextNode) {
            var t = ev.target || ev.srcElement;
            return this.resolveTextNode(t);
        },

        /**
         * In some cases, some browsers will return a text node inside
         * the actual element that was targeted.  This normalizes the
         * return value for getTarget and getRelatedTarget.
         * @method resolveTextNode
         * @param {HTMLElement} node node to resolve
         * @return {HTMLElement} the normized node
         * @static
         */
        resolveTextNode: function(node) {
            if (node && 3 == node.nodeType) {
                return node.parentNode;
            } else {
                return node;
            }
        },

        /**
         * We cache elements bound by id because when the unload event
         * fires, we can no longer use document.getElementById
         * @method getEl
         * @static
         * @private
         * @deprecated Elements are not cached any longer
         */
        getEl: function(id) {
            return Y.get(id);
        }
    };

    Y.mix(Y.Event, o);

    /**
     * Calls Y.Event.attach with the correct argument order
     * @method removeListener
     */
    Y.Event.removeListener = function(el, type, fn, data, override) {

        var context, a=[type, fn, el];

        if (data) {

            if (override) {
                context = (override === true) ? data : override;
            }

            a.push(context);
            a.push(data);
        }

        a.push(COMPAT_ARG);

        return Y.Event.detach.apply(Y.Event, a);
    };

    /**
     * Calls Y.Event.detach with the correct argument order
     * @method addListener
     */
    Y.Event.addListener = function(el, type, fn, data, override) {

        // Y.log('addListener:');
        // Y.log(Y.Array(arguments, 0, true), 1);

        // var a = Y.Array(arguments, 0, true), el = a.shift();
        // a.splice(2, 0, el);
        // return Y.Event.attach.apply(Y.Event, a);
        var context, a=[type, fn, el];

        if (data) {

            if (override) {
                context = (override === true) ? data : override;
            }

            a.push(context);
            a.push(data);
        }

        a.push(COMPAT_ARG);

        return Y.Event.attach.apply(Y.Event, a);
    };

    Y.Event.on = Y.Event.addListener;

    var newOnavail = Y.Event.onAvailable;

    Y.Event.onAvailable = function(id, fn, p_obj, p_override) {
        return newOnavail(id, fn, p_obj, p_override, false, true);
    };

    Y.Event.onContentReady = function(id, fn, p_obj, p_override) {
        return newOnavail(id, fn, p_obj, p_override, true, true);
    };

    Y.Event.onDOMReady = function() {
        var a = Y.Array(arguments, 0, true);
        a.unshift('domready');
        return Y.on.apply(Y, a);
    };

    Y.util.Event = Y.Event;

    var CE = function(type, oScope, silent, signature) {
        //debugger;

        var o = {
            context: oScope,
            silent: silent || false
            // signature: signature || CE.LIST
        };

        CE.superclass.constructor.call(this, type, o);

        this.signature = signature || CE.LIST;
    };

    Y.extend(CE, Y.CustomEvent, {

    });

    /**
     * Subscriber listener sigature constant.  The LIST type returns three
     * parameters: the event type, the array of args passed to fire, and
     * the optional custom object
     * @property YAHOO.util.CustomEvent.LIST
     * @static
     * @type int
     */
    CE.LIST = 0;

    /**
     * Subscriber listener sigature constant.  The FLAT type returns two
     * parameters: the first argument passed to fire and the optional
     * custom object
     * @property YAHOO.util.CustomEvent.FLAT
     * @static
     * @type int
     */
    CE.FLAT = 1;

    Y.util.CustomEvent = CE;

    var EP = function() {
        //console.log('Compat CustomEvent constructor executed: ' + this._yuid);
        if (!this._yuievt) {
            var sub = this.subscribe;
            Y.EventTarget.apply(this, arguments);
            this.subscribe = sub;
            this.__yuiepinit = function() {};
        }
    };

    Y.extend(EP, Y.EventTarget, {

        createEvent: function(type, o) {
            // if (!this._yuievt) {
            //     Y.EventTarget.call(this);
            // }
            o = o || {};
            o.signature = o.signature || CE.FLAT;
            return this.publish(type, o);
        },

        subscribe: function(type, fn, obj, override) {
            var ce = this._yuievt.events[type] || this.createEvent(type),
                a = Y.Array(arguments);

            if (override && true !== override) {
                // a[2] = override;
                // a[1] = obj;
            }

            Y.EventTarget.prototype.on.apply(this, a);
        },

        fireEvent: function(type) {
            return this.fire.apply(this, arguments);
        },

        hasEvent: function(type) {
            if (!this._yuievt) {
                Y.EventTarget.call(this);
            }
            return this.getEvent(type);
        }
    });

    Y.util.EventProvider = EP;

}


Y.register("event", Y.util.Event, {version: "@VERSION@", build: "@BUILD@"});


