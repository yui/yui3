var EXECUTE = 'execute',
    SHIFT   = 'shift',
    PROMOTE = 'promote',
    REMOVE  = 'remove',

    isObject   = Y.Lang.isObject,
    isFunction = Y.Lang.isFunction;

// Convenience method to create a new object as a merge of all arguments, but
// only setting properties present on the object in the first arg.
function limitedMerge(master) {
    var copy = Y.merge(master);

    Y.Array.each(Y.Array(arguments,1,true), function (o) {
        if (isObject(o)) {
            for (var k in o) {
                if (o.hasOwnProperty(k) && master.hasOwnProperty(k)) {
                    copy[k] = o[k];
                }
            }
        }
    });

    return copy;
}

/**
 * Mechanism to execute a series of callbacks in sequence.
 * Callbacks can be function references or object literals with the following
 * keys:
 * <dl>
 *    <dt>fn</dt>
 *      <dd>{Function} REQUIRED the callback function.</dd>
 *    <dt>context</dt>
 *      <dd>{Object} the desired execution context of the callback function</dd>
 *    <dt>args</dt>
 *      <dd>{Array} list of arguments to pass to the callback function</dd>
 * </dl>
 *
 * @module queue
 * @class Queue
 * @constructor
 * @param defaults {Object} default callback configuration values
 * @param callback* {Function|Object} 0..n callbacks to initialize the queue
 */
function Queue(defaults) {
    // Factory or Constructor
    var self = this instanceof Queue ? this : new Queue(defaults);

    // To avoid duplicate initialization
    if (self === this) {
        self._init(defaults);
    }

    return self.add.apply(self, Y.Array(arguments,1,true));
}

/**
 * Static default values used to populate callback configuration properties.
 *
 * @property Queue.defaults
 * @type {Object}
 * @static
 */
Queue.defaults = limitedMerge({
    args         : null,
    autoContinue : true,
    context      : Y,
    fn           : null,
    iterations   : 1,
    name         : null,
    timeout      : -1,
    until        : function () {
        this.iterations |= 0;
        return this.iterations <= 0;
    }
}, Y.config.queueDefaults);

Y.extend(Queue, Y.Event.Target, {
    /**
     * Collection of callbacks to execute.
     *
     * @property _q
     * @type {Array}
     * @protected
     */
    _q : null,

    /**
     * Collection of pending async transactions initiated by a callback.
     *
     * @property _pending
     * @type {Object}
     * @protected
     */
    _pending : null,

    /**
     *  used to indicate the Queue is currently executing a callback.
     *
     * @property _running
     * @type {Boolean|Object} true for synchronous callback execution, the
     *                        return handle from Y.later for async callbacks
     * @protected
     */
    _running : false,
    
    /**
     * Indicates the execution state of the Queue.  This should be treated as
     * read-only.  Update it with run(), pause, and stop().
     *
     * @property active
     * @readOnly
     * @type {Boolean}
     * @default false
     */
    active : false,

    /** 
     * Callback defaults for this instance.  Static defaults that are not
     * overridden are also included.
     *
     * @property defaults
     * @type {Object}
     */
    defaults : null,

    /**
     * Initializes the Queue isntance properties and events.
     *
     * @method _init
     * @param defaults {Object} Instance level defaults for all callbacks
     * @param callback* {Object|Function} 0..n callbacks to seed the queue
     * @protected
     */
    _init : function (defaults) {
        Queue.superclass.constructor.call(this,
            Y.merge(defaults, { emitFacade: true }));

        this._q = [];

        this._pending = {};

        this.defaults = Y.merge(
            Queue.defaults,
            { context : this },
            defaults);

        this._initEvents();
    },

    /**
     * Initializes the instance events.
     *
     * @method _initEvents
     * @protected
     */
    _initEvents : function () {
        this.publish(EXECUTE, { defaultFn : this._defExecFn });

        this.publish(SHIFT,   { defaultFn : this._defShiftFn });

        this.publish(PROMOTE, { defaultFn : this._defPromoteFn });

        this.publish(REMOVE,  { defaultFn : this._defRemoveFn });
    },

    /**
     * Execute the queue callbacks (also resumes paused Queue).
     * @method run
     * @return {Queue} the Queue instance
     */
    run : function () {
        var callback;

        this.active = true;

        // A callback is present and not currently executing/scheduled
        while (this._q.length && this.active && !this.isRunning()) {
            // Grab the first callback in the queue
            callback = this._q[0];

            if (callback.until()) {
                this.fire(SHIFT, { callback: callback });
            } else {
                if (callback.timeout < 0) {
                    this._processSync(callback);
                } else {
                    this._processAsync(callback);
                    break;
                }
            }
        }

        if (!this._q.length) {
            this.active = false;

            /**
             * Event fired after the last queued callback is executed.
             * @event complete
             */
            this.fire('complete');
        }

        return this;
    },

    /**
     * Determines if the Queue is in a state that prevents callback execution.
     *
     * @method isRunning
     * @return {Boolean} true if Queue is running or waiting for a response
     *                   from any initiated transactions
     */
    isRunning : function () {
        return this._running || Y.Object.size(this._pending);
    },

    /**
     * Handles the execution of synchronous callbacks.
     *
     * @method _processSync
     * @param callback {Object} the callback object to execute
     * @protected
     */
    _processSync : function (callback) {
        callback.iterations--;
        this._running = true;
        this.fire(EXECUTE, { callback: callback });
        this._running = false;
    },

    /**
     * Handles the execution of asynchronous callbacks.
     *
     * @method _processAsync
     * @param callback {Object} the callback object to execute
     * @protected
     */
    _processAsync : function (callback) {
        // Set to execute after the configured timeout
        this._running = Y.later(callback.timeout, this, function () {
            callback.iterations--;

            this.fire(EXECUTE, { callback: callback });

            this._running = false;

            // Loop unless the Queue was paused from inside the callback
            if (this.active) {
                this.run();
            }
        });
    },

    /**
     * Shifts the first callback off the Queue
     * @method _defShiftFn
     * @protected
     */
    _defShiftFn : function () {
        this._q.shift();
    },
    
    /**
     * Executes the callback function
     * @method _defExecFn
     * @param e {Event} the callback object
     * @protected
     */
    _defExecFn : function (e) {
        var callback = e.callback,
            args;

        if (isObject(callback) && isFunction(callback.fn)) {
            args = Y.Lang.isValue(callback.args) ? Y.Array(callback.args) : [];
            callback.fn.apply(callback.context, args);
        }
    },

    /**
     * Add any number of callbacks to the end of the queue.  Callbacks passed
     * in as functions will be wrapped in a callback object with defaulted
     * config values.
     *
     * @method add
     * @param callback* {Function|Object} 0..n callbacks
     * @return {Queue} the Queue instance
     */
    add : function () {
        var added = [];

        Y.Array.each(arguments, Y.bind(function (c) {
            c = this._prepareCallback(c);

            if (isObject(c)) {
                this._q.push(c);
                added.push(c);
            }
        },this));

        if (added.length) {
            this.fire('add', { callbacks: added });
        }

        return this;
    },

    /**
     * Normalizes the callback into object literal form with required key:value
     * pairs dfaulted to functional values.
     *
     * @method _prepareCallback
     * @param callback {Object|Function} the raw callback
     * @return {Object} the normalized callback object
     * @protected
     */
    _prepareCallback : function (callback) {
        if (isFunction(callback)) {
            callback = { fn : callback };
        }

        return isObject(callback) ? Y.merge(this.defaults,callback) : null;
    },

    /**
     * Pause the execution of the Queue after the execution of the current
     * callback completes.  If called from code outside of a queued callback,
     * clears the timeout for the pending callback. Paused Queue can be
     * restarted with q.run()
     * @method pause
     * @return {Queue} the Queue instance
     */
    pause: function () {
        if (isObject(this._running)) {
            this._running.cancel();
        }

        this._running = this.active = false;

        return this;
    },

    /**
     * Stop and clear the Queue's queue after the current execution of the
     * current callback completes.
     * @method stop
     * @return {Queue} the Queue instance
     */
    stop : function () { 
        this._q = [];

        return this.pause();
    },

    /**
     * Retrieve a callback by its name.  Useful to modify the configuration
     * while the Queue is running.
     *
     * @method getCallback
     * @param name {String} the name assigned to the callback
     * @return {Object} the callback object
     */
    getCallback : function (name) {
        for (var i = 0, len = this._q.length; i < len; ++i) {
            if (this._q[i].name === name) {
                return this._q[i];
            }
        }

        return null;
    },

    /**
     * Promotes the named callback to the top of the queue. If a callback is
     * currently executing or looping (via until or iterations), the promotion
     * is scheduled to occur after the current callback has completed.
     *
     * @method promote
     * @param name {String|Object} the callback object or a callback's name
     * @return {Queue} the Queue instance
     */
    promote : function (name) {
        var payload = { callback : name },e;

        if (this.isRunning()) {
            e = this.after(SHIFT, function () {
                    this.fire(PROMOTE, payload);
                    e.detach();
                }, this);
        } else {
            this.fire(PROMOTE, payload);
        }

        return this;
    },

    /**
     * Promotes the named callback to the top of the queue.
     *
     * The event object will contain a property &quot;callback&quot;, which
     * hold the name of a callback or the callback object itself.
     *
     * @method _defPromoteFn
     * @param e {Event} the custom event
     * @protected
     */
    _defPromoteFn : function (e) {
        var name = e.callback, i, len;

        for (i = 0, len = this._q.length; i < len; ++i) {
            if (this._q[i] === name || this._q[i].name === name) {
                e.promoted = this._q.splice(i,1)[0];
                this._q.unshift(e.promoted);
                break;
            }
        }
    },

    /**
     * Removes the callback from the queue.  If the Queue is active, the
     * removal is scheduled to occur after the current callback has completed.
     *
     * @method remove
     * @param name {String|Object} the callback object or a callback's name
     * @return {Queue} the Queue instance
     */
    remove : function (name) {
        var payload = { callback : name },e;

        // Can't return the removed callback because of the deferral until
        // current callback is complete
        if (this.isRunning()) {
            e = this.after(SHIFT, function () {
                    this.fire(REMOVE, payload);
                    e.detach();
                },this);
        } else {
            this.fire(REMOVE, payload);
        }

        return this;
    },

    /**
     * Removes the callback from the queue.
     *
     * The event object will contain a property &quot;callback&quot;, which
     * hold the name of a callback or the callback object itself.
     *
     * @method _defRemoveFn
     * @param e {Event} the custom event
     * @protected
     */
    _defRemoveFn : function (e) {
        var name = e.callback, i, len;

        for (i = 0, len = this._q.length; i < len; ++i) {
            if (this._q[i] === name || this._q[i].name === name) {
                e.removed = this._q.splice(i,1);
                len--;
            }
        }
    },

    /**
     * Returns the number of items in the queue.  Callbacks configured with
     * <code>iterations</code> or <code>until</code> are counted only once.
     *
     * @method size
     * @return {Number} the number of currently queued callbacks
     */
    size : function () {
        return this._q.length;
    }
});

Y.Queue = Queue;
