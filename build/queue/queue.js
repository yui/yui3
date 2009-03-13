YUI.add('queue', function(Y) {

var Lang = Y.Lang;

/**
 * Mechanism to execute a series of callbacks in a non-blocking queue.  Each
 * callback is executed via setTimout unless configured with a negative
 * timeout, in which case it is run in blocking mode in the same execution
 * thread as the previous callback.  Callbacks can be function references or
 * object literals with the following keys:
 * <dl>
 *    <dt>fn</dt>
 *      <dd>{Function} REQUIRED the callback function.</dd>
 *    <dt>context</dt>
 *      <dd>{Object} the context from which to call the callback function.</dd>
 *    <dt>timeout</dt>
 *      <dd>{number} millisecond delay to wait after previous callback
 *          completion before executing this callback.  Negative
 *          values cause immediate blocking execution.  Default 0.</dd>
 *    <dt>until</dt>
 *      <dd>{Function} boolean function executed before each iteration.
 *          Return true to indicate callback completion.</dd>
 *    <dt>iterations</dt>
 *      <dd>{Number} number of times to execute the callback before
 *          proceeding to the next callback in the queue.
 *          Incompatible with <code>until</code>.</dd>
 *    <dt>args</dt>
 *      <dd>{MIXED} argument passed to callback object</dd>
 * </dl>
 *
 * @module queue
 * @class Queue
 * @constructor
 * @param callback* {Function|Object} Any number of callbacks to initialize the queue
 */
function Queue() {
    // Factory or Constructor
    var self = this instanceof Y.Queue ? this : new Y.Queue();

    /**
     * The callback queue
     * @property q
     * @type {Array}
     * @protected
     */
    self.q = [];

    return self.add.apply(self,arguments);
}

/**
 * Default millisecond timeout used between callback execution.  Override for
 * individual callbacks using the <code>timeout</code> key in callback object
 * notation.
 *
 * @property defaultTimeout
 * @type {int}
 * @static
 */
Queue.defaultTimeout = 10;

Queue.prototype = {
    /**
     * Timeout id used to pause or stop execution and indicate the execution
     * state of the Queue.  0 indicates paused or stopped, negatives indicate
     * blocking execution, and positives indicate non-blocking execution.
     * @property id
     * @type {number}
     * @protected
     */
    _id   : 0,

    /**
     * Execute the queue callbacks (also resumes paused Queue).
     * @method run
     * @return {Queue} the Queue instance
     */
    run : function () {
        // Grab the first callback in the queue
        var callback = this.q[0],
            self     = this;

        // A callback is present and not currently executing/scheduled
        if (callback && !this._id) {

            // Execute immediately if the callback timeout is negative.
            if (callback.timeout < 0) {

                this._id = callback.timeout;

                if (callback.until) {
                    while (!callback.until()) {
                        this._exec(callback);
                    }
                } else if (callback.iterations) {
                    while (callback.iterations-- > 0) {
                        this._exec(callback);
                    }
                } else { // single shot callback
                    this._exec(callback);
                }

                this._shift();
                this._id = 0;

                return this.run();
            } else {
                // Asynchronous callback

                if (callback.until) {
                    if (callback.until()) {
                        // Move to the next callback
                        this._shift();
                        return this.run();
                    }
                } else if (!callback.iterations || !--callback.iterations) {
                    this._shift();
                }

                // Set to execute after the configured timeout
                this._id = setTimeout(function () {
                    self._exec(callback);

                    // Loop unless the Queue was paused from inside the callback
                    if (self._id) {
                        // Indicate ready to run state
                        self._id = 0;
                        // Start the fun all over again
                        self.run();
                    }
                },callback.timeout);
            }

        } else if (!callback) { // The Queue is empty
            /**
             * Event fired after the last queued callback is executed.  Not
             * fired if the Queue is stopped via q.stop().
             * @event end
             */
            this.fire('end');
        }

        return this;
    },

    /**
     * Executes the callback function
     * @method _exec
     * @param callback {Object} the callback object
     * @protected
     */
    _exec : function (callback) {

        if (Lang.isFunction(callback.fn)) {
            /**
             * Fired before a callback is executed
             * @event beforeCallback
             * @param callback {Object} The callback object
             */
            this.fire('beforeCallback',callback);

            callback.fn.apply(callback.context, callback.args);

            /**
             * Fired before a callback is executed
             * @event afterCallback
             * @param callback {Object} The callback object
             */
            this.fire('afterCallback',callback);
        }
    },

    /**
     * Shifts the first callback off the Queue
     * @method _shift
     * @private
     */
    _shift : function () {
        /**
         * Fired after a callback is shifted from the Queue
         * @event shiftCallback
         * @param callback {Function|Object} The callback passed to <code>add(..)</code>
         */
        this.fire('shiftCallback', this.q.shift());
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
    add  : function () {
        var callbacks = Y.Array(arguments,0,true), i, len, c,
            added = [];

        for (i = 0, len = callbacks.length; i < len; ++i) {
            c = callbacks[i];

            if (Lang.isFunction(c)) {
                c = { fn : c };
            }

            if (Lang.isObject(c) && Lang.isFunction(c.fn)) {
                // merge in defaults
                c = Y.merge({
                    context : this,
                    args    : [],
                    timeout : Queue.defaultTimeout
                },c);

                c.args = Y.Array(c.args);

                this.q.push(c);

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
     * Pause the execution of the Queue after the execution of the current
     * callback completes.  If called from code outside of a queued callback,
     * clears the timeout for the pending callback. Paused Queue can be
     * restarted with q.run()
     * @method pause
     * @return {Queue} the Queue instance
     */
    pause: function () {
        clearTimeout(this.id);

        this._id = 0;

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
        this.pause();
        this.q = [];

        /**
         * Fired after Queue is stopped
         * @event stop
         */
        this.fire('stop');

        return this;
    }
};

Y.augment(Queue,Y.Event.Target);

Y.Queue = Queue;


}, '@VERSION@' ,{requires:['event']});
