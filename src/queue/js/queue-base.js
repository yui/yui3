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
 * @param callback* {Function|Object} Any number of callbacks to initialize the queue
 */
function Queue() {
    // Factory or Constructor
    var self = this instanceof Queue ? this : new Queue();

    return self._init(arguments);
}

/**
 * Defaults used to fill unset callback configuration values.
 *
 * @property defaults
 * @type {Object}
 * @static
 */
Queue.defaults = {};

Queue.prototype = {
    /** 
     * Callback defaults for this instance.  Initially populated from the
     * static Queue.defaults collection.
     *
     * @property defaults
     * @type {Object}
     * @protected
     */
    _defaults : null,

    /**
     * Flag used to indicate the Queue is currently executing a callback.
     *
     * @property _tId
     * @type {Number}
     * @protected
     */
    _tId : 0,
    
    /**
     * Indicates the execution state of the Queue.
     *
     * @property active
     * @type {Boolean}
     */
    active : false,

    /**
     * Initializes the Queue isntance properties and events.
     *
     * @method _init
     * @param args {Array} arguments list from constructor
     * @return {Queue} the Queue instance
     * @protected
     */
    _init : function (args) {
        args = Y.Array(args,0,true);

        var config = args.shift();

        this._q = [];

        this._defaults = Y.merge(
            Queue.defaults,
            { context : this },
            (Y.Lang.isObject(config) ? config : {}));

        this.publish('executeCallback', { defaultFn : this._defExecFn });

        return this.add.apply(this,args);
    },

    /**
     * Execute the queue callbacks (also resumes paused Queue).
     * @method run
     * @return {Queue} the Queue instance
     */
    run : function () {
        // Grab the first callback in the queue
        var callback = this._q[0];

        // A callback is present and not currently executing/scheduled
        if (callback && this.isReady()) {
            this._processCallback(callback);
        } else if (!callback) {
            this.active = false;
            this.fire('complete');
        }

        return this;
    },

    /**
     * Determines if the Queue is in a state that will allow for callback
     * execution.
     *
     * @method isReady
     * @return {Boolean} true if callbacks can be run now
     */
    isReady : function () {
        return !this._tId;
    },

    /**
     * Sets the Queue status to active and executes the callback.
     *
     * @method _processCallback
     * @param callback {Object} the callback object to execute
     * @protected
     */
    _processCallback : function (callback) {
        this.active = true;
        this._tId   = -1;

        this._defExecFn(callback);

        this._shift();
        this._tId = 0;

        this.run();
    },

    /**
     * Executes the callback function
     * @method _defExecFn
     * @param callback {Object} the callback object
     * @protected
     */
    _defExecFn : function (callback) {
        if (Y.Lang.isFunction(callback.fn)) {
            callback.fn.apply(callback.context, Y.Array(callback.args));
        }
    },

    /**
     * Shifts the first callback off the Queue
     * @method _shift
     * @protected
     */
    _shift : function () {
        this.fire('shiftCallback', this._q.shift());
    },
    
    /**
     * Add any number of callbacks to the end of the queue.  Callbacks passed
     * in as functions will be wrapped in a callback object with defaulted
     * config values.
     *
     * @method add
     * @param callback* {Function|Object} Any number of callbacks
     * @return {Queue} the Queue instance
     */
    add : function () {
        var callbacks = Y.Array(arguments,0,true), i, len, c, added = [];

        for (i = 0, len = callbacks.length; i < len; ++i) {
            c = this._prepareCallback(callbacks[i]);

            if (Y.Lang.isObject(c)) {
                this._q.push(c);
                added.push(c);
            }
        }

        /**
         * Fired from within <code>add(..)</code> after callbacks are queued
         * @event addCallback
         * @param callbacks {Array} Array of callbacks passed to <code>add(..)</code>
         */
        this.fire('addCallback',added);

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
        if (Y.Lang.isFunction(callback)) {
            callback = { fn : callback };
        }

        if (Y.Lang.isObject(callback)) {
            callback = Y.merge(this._defaults, callback);
        }

        return callback;
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
        clearTimeout(this._tId);
        this._tId = 0;

        this.active = false;

        /**
         * Fired after Queue is paused
         * @event pause
         */
        this.fire('pause');

        return this;
    },

    /**
     * Stop and clear the Queue's queue after the current execution of the
     * current callback completes.
     * @method stop
     * @return {Queue} the Queue instance
     */
    stop : function () { 
        clearTimeout(this._tId);
        this._tId = 0;

        this.active = false;
        this._q = [];

        /**
         * Fired after Queue is stopped
         * @event stop
         */
        this.fire('stop');

        return this;
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
    },

    /**
     * Placeholder stubs for event methods to allow for less code replacement
     * in extension.
     */
    publish : function () {},
    fire : function () {}
};

Y.Queue = Queue;
