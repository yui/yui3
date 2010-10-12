YUI.add('event-custom-complex', function(Y) {


/**
 * Adds event facades, preventable default behavior, and bubbling.
 * events.
 * @module event-custom
 * @submodule event-custom-complex
 */

var FACADE,
    FACADE_KEYS,
    EMPTY = {},
    CEProto = Y.CustomEvent.prototype,
    ETProto = Y.EventTarget.prototype;

/**
 * Wraps and protects a custom event for use when emitFacade is set to true.
 * Requires the event-custom-complex module
 * @class EventFacade
 * @param e {Event} the custom event
 * @param currentTarget {HTMLElement} the element the listener was attached to
 */

Y.EventFacade = function(e, currentTarget) {

    e = e || EMPTY;

    this._event = e;

    /**
     * The arguments passed to fire
     * @property details
     * @type Array
     */
    this.details = e.details;

    /**
     * The event type, this can be overridden by the fire() payload
     * @property type
     * @type string
     */
    this.type = e.type;

    /**
     * The real event type
     * @property type
     * @type string
     */
    this._type = e.type;

    //////////////////////////////////////////////////////

    /**
     * Node reference for the targeted eventtarget
     * @propery target
     * @type Node
     */
    this.target = e.target;

    /**
     * Node reference for the element that the listener was attached to.
     * @propery currentTarget
     * @type Node
     */
    this.currentTarget = currentTarget;

    /**
     * Node reference to the relatedTarget
     * @propery relatedTarget
     * @type Node
     */
    this.relatedTarget = e.relatedTarget;

};

Y.extend(Y.EventFacade, Object, {

    /**
     * Stops the propagation to the next bubble target
     * @method stopPropagation
     */
    stopPropagation: function() {
        this._event.stopPropagation();
        this.stopped = 1;
    },

    /**
     * Stops the propagation to the next bubble target and
     * prevents any additional listeners from being exectued
     * on the current target.
     * @method stopImmediatePropagation
     */
    stopImmediatePropagation: function() {
        this._event.stopImmediatePropagation();
        this.stopped = 2;
    },

    /**
     * Prevents the event's default behavior
     * @method preventDefault
     */
    preventDefault: function() {
        this._event.preventDefault();
        this.prevented = 1;
    },

    /**
     * Stops the event propagation and prevents the default
     * event behavior.
     * @method halt
     * @param immediate {boolean} if true additional listeners
     * on the current target will not be executed
     */
    halt: function(immediate) {
        this._event.halt(immediate);
        this.prevented = 1;
        this.stopped = (immediate) ? 2 : 1;
    }

});

CEProto.fireComplex = function(args) {
    var es = Y.Env._eventstack, ef, q, queue, ce, ret, events, subs,
        self = this, host = self.host || self, next, oldbubble;

    if (es) {
        // queue this event if the current item in the queue bubbles
        if (self.queuable && self.type != es.next.type) {
            self.log('queue ' + self.type);
            es.queue.push([self, args]);
            return true;
        }
    } else {
        Y.Env._eventstack = {
           // id of the first event in the stack
           id: self.id,
           next: self,
           silent: self.silent,
           stopped: 0,
           prevented: 0,
           bubbling: null,
           type: self.type,
           // defaultFnQueue: new Y.Queue(),
           afterQueue: new Y.Queue(),
           defaultTargetOnly: self.defaultTargetOnly,
           queue: []
        };
        es = Y.Env._eventstack;
    }

    subs = self.getSubs();

    self.stopped = (self.type !== es.type) ? 0 : es.stopped;
    self.prevented = (self.type !== es.type) ? 0 : es.prevented;

    self.target = self.target || host;

    events = new Y.EventTarget({
        fireOnce: true,
        context: host
    });

    self.events = events;

    if (self.preventedFn) {
        events.on('prevented', self.preventedFn);
    }

    if (self.stoppedFn) {
        events.on('stopped', self.stoppedFn);
    }

    self.currentTarget = host;

    self.details = args.slice(); // original arguments in the details

    // self.log("Firing " + self  + ", " + "args: " + args);
    self.log("Firing " + self.type);

    self._facade = null; // kill facade to eliminate stale properties

    ef = self._getFacade(args);

    if (Y.Lang.isObject(args[0])) {
        args[0] = ef;
    } else {
        args.unshift(ef);
    }

    // if (subCount) {
    if (subs[0]) {
        // self._procSubs(Y.merge(self.subscribers), args, ef);
        self._procSubs(subs[0], args, ef);
    }

    // bubble if this is hosted in an event target and propagation has not been stopped
    if (self.bubbles && host.bubble && !self.stopped) {

        oldbubble = es.bubbling;

        // self.bubbling = true;
        es.bubbling = self.type;

        // if (host !== ef.target || es.type != self.type) {
        if (es.type != self.type) {
            es.stopped = 0;
            es.prevented = 0;
        }

        ret = host.bubble(self);

        self.stopped = Math.max(self.stopped, es.stopped);
        self.prevented = Math.max(self.prevented, es.prevented);

        // self.bubbling = false;
        es.bubbling = oldbubble;

    }

    if (self.defaultFn &&
        !self.prevented &&
        ((!self.defaultTargetOnly && !es.defaultTargetOnly) || host === ef.target)) {

        self.defaultFn.apply(host, args);
    }

    // broadcast listeners are fired as discreet events on the
    // YUI instance and potentially the YUI global.
    self._broadcast(args);

    // Queue the after
    if (subs[1] && !self.prevented && self.stopped < 2) {
        if (es.id === self.id || self.type != host._yuievt.bubbling) {
            self._procSubs(subs[1], args, ef);
            while ((next = es.afterQueue.last())) {
                next();
            }
        } else {
            es.afterQueue.add(function() {
                self._procSubs(subs[1], args, ef);
            });
        }
    }

    self.target = null;

    // es.stopped = 0;
    // es.prevented = 0;

    if (es.id === self.id) {
        queue = es.queue;

        while (queue.length) {
            q = queue.pop();
            ce = q[0];
            // set up stack to allow the next item to be processed
            es.next = ce;
            ce.fire.apply(ce, q[1]);
            // es.stopped = 0;
            // es.prevented = 0;
        }

        Y.Env._eventstack = null;
    }

    ret = !(self.stopped);

    if (self.type != host._yuievt.bubbling) {
        es.stopped = 0;
        es.prevented = 0;
        self.stopped = 0;
        self.prevented = 0;
    }

    return ret;
};

CEProto._getFacade = function() {

    var ef = this._facade, o, o2,
    args = this.details;

    if (!ef) {
        ef = new Y.EventFacade(this, this.currentTarget);
    }

    // if the first argument is an object literal, apply the
    // properties to the event facade
    o = args && args[0];

    if (Y.Lang.isObject(o, true)) {

        o2 = {};

        // protect the event facade properties
        Y.mix(o2, ef, true, FACADE_KEYS);

        // mix the data
        Y.mix(ef, o, true);

        // restore ef
        Y.mix(ef, o2, true, FACADE_KEYS);

        // Allow the event type to be faked
        // http://yuilibrary.com/projects/yui3/ticket/2528376
        ef.type = o.type || ef.type;
    }

    // update the details field with the arguments
    // ef.type = this.type;
    ef.details = this.details;

    // use the original target when the event bubbled to this target
    ef.target = this.originalTarget || this.target;

    ef.currentTarget = this.currentTarget;
    ef.stopped = 0;
    ef.prevented = 0;

    this._facade = ef;

    return this._facade;
};

/**
 * Stop propagation to bubble targets
 * @for CustomEvent
 * @method stopPropagation
 */
CEProto.stopPropagation = function() {
    this.stopped = 1;
    Y.Env._eventstack.stopped = 1;
    this.events.fire('stopped', this);
};

/**
 * Stops propagation to bubble targets, and prevents any remaining
 * subscribers on the current target from executing.
 * @method stopImmediatePropagation
 */
CEProto.stopImmediatePropagation = function() {
    this.stopped = 2;
    Y.Env._eventstack.stopped = 2;
    this.events.fire('stopped', this);
};

/**
 * Prevents the execution of this event's defaultFn
 * @method preventDefault
 */
CEProto.preventDefault = function() {
    if (this.preventable) {
        this.prevented = 1;
        Y.Env._eventstack.prevented = 1;
        this.events.fire('prevented', this);
    }
};

/**
 * Stops the event propagation and prevents the default
 * event behavior.
 * @method halt
 * @param immediate {boolean} if true additional listeners
 * on the current target will not be executed
 */
CEProto.halt = function(immediate) {
    if (immediate) {
        this.stopImmediatePropagation();
    } else {
        this.stopPropagation();
    }
    this.preventDefault();
};

/**
 * Registers another EventTarget as a bubble target.  Bubble order
 * is determined by the order registered.  Multiple targets can
 * be specified.
 *
 * Events can only bubble if emitFacade is true.
 *
 * Included in the event-custom-complex submodule.
 *
 * @method addTarget
 * @param o {EventTarget} the target to add
 * @for EventTarget
 */
ETProto.addTarget = function(o) {
    this._yuievt.targets[Y.stamp(o)] = o;
    this._yuievt.hasTargets = true;
};

/**
 * Returns an array of bubble targets for this object.
 * @method getTargets
 * @return EventTarget[]
 */
ETProto.getTargets = function() {
    return Y.Object.values(this._yuievt.targets);
};

/**
 * Removes a bubble target
 * @method removeTarget
 * @param o {EventTarget} the target to remove
 * @for EventTarget
 */
ETProto.removeTarget = function(o) {
    delete this._yuievt.targets[Y.stamp(o)];
};

/**
 * Propagate an event.  Requires the event-custom-complex module.
 * @method bubble
 * @param evt {CustomEvent} the custom event to propagate
 * @return {boolean} the aggregated return value from Event.Custom.fire
 * @for EventTarget
 */
ETProto.bubble = function(evt, args, target) {

    var targs = this._yuievt.targets, ret = true,
        t, type = evt && evt.type, ce, i, bc, ce2,
        originalTarget = target || (evt && evt.target) || this,
        es = Y.Env._eventstack, oldbubble;

    if (!evt || ((!evt.stopped) && targs)) {

        // Y.log('Bubbling ' + evt.type);
        for (i in targs) {
            if (targs.hasOwnProperty(i)) {
                t = targs[i];
                ce = t.getEvent(type, true);
                ce2 = t.getSibling(type, ce);

                if (ce2 && !ce) {
                    ce = t.publish(type);
                }

                oldbubble = t._yuievt.bubbling;
                t._yuievt.bubbling = type;

                // if this event was not published on the bubble target,
                // continue propagating the event.
                if (!ce) {
                    if (t._yuievt.hasTargets) {
                        t.bubble(evt, args, originalTarget);
                    }
                } else {

                    ce.sibling = ce2;

                    // set the original target to that the target payload on the
                    // facade is correct.
                    ce.target = originalTarget;
                    ce.originalTarget = originalTarget;
                    ce.currentTarget = t;
                    bc = ce.broadcast;
                    ce.broadcast = false;

                    // default publish may not have emitFacade true -- that
                    // shouldn't be what the implementer meant to do
                    ce.emitFacade = true;

                    ret = ret && ce.fire.apply(ce, args || evt.details || []);
                    ce.broadcast = bc;
                    ce.originalTarget = null;


                    // stopPropagation() was called
                    if (ce.stopped) {
                        break;
                    }
                }

                t._yuievt.bubbling = oldbubble;
            }
        }
    }

    return ret;
};

FACADE = new Y.EventFacade();
FACADE_KEYS = Y.Object.keys(FACADE);



}, '@VERSION@' ,{requires:['event-custom-base']});
