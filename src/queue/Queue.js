/**
 * Mechanism to execute a series of callbacks in a non-blocking queue.  Each
 * callback is executed via setTimout unless configured with a negative
 * timeout, in which case it is run in blocking mode in the same execution
 * thread as the previous callback.  Callbacks can be function references or
 * object literals with the following keys:
 * <ul>
 *    <li><code>fn</code> - {Function} REQUIRED the callback function.</li>
 *    <li><code>timeout</code> - {number} millisecond delay to wait after previous callback completion before executing this callback.  Negative values cause immediate blocking execution.  Default 0.</li>
 *    <li><code>until</code> - {Function} boolean function executed before each iteration.  Return true to indicate callback completion.</li>
 *    <li><code>iterations</code> - {Number} number of times to execute the callback before proceeding to the next callback in the chain. Incompatible with <code>until</code>.</li>
 * </ul>
 *
 * @module queue
 * @class Queue
 * @constructor
 * @param callback* {Function|Object} Any number of callbacks to initialize the queue
*/

var _SL = Array.prototype.slice,
    _SP = Array.prototype.splice;

Y.Queue = function () {
    // Factory or Constructor
    var me = this instanceof Y.Queue ? this : new Y.Queue();

    /**
     * The callback queue
     * @property q
     * @type {Array}
     * @private
     */
    me.q = [];

    return me.add.apply(me,arguments);
};

Y.Queue.prototype = {
    /**
     * Timeout id used to pause or stop execution and indicate the execution
     * state of the Queue.  0 indicates paused or stopped, negatives indicate
     * blocking execution, and positives indicate non-blocking execution.
     * @property id
     * @type {number}
     * @private
     */
    id   : 0,

    /**
     * Execute the queue callbacks (also resumes paused Queue).
     * @method run
     * @return {Queue} the Queue instance
     */
    run : function () {
        // Grab the first callback in the queue
        var c  = this.q[0],
            fn;

        // If there is no callback in the queue or the Queue is currently
        // in an execution mode, return
        if (!c) {
            /**
             * Event fired when the callback queue is emptied via execution
             * (not via a call to chain.stop()).
             * @event end
             */
            this.fire('complete');
            return this;
        } else if (this.id) {
            return this;
        }

        fn = c.fn || c;

        if (typeof fn === 'function') {
            var ms   = c.timeout || 0,
                me   = this;
                
            // Execute immediately if the callback timeout is negative.
            if (ms < 0) {
                this.id = ms;
                if (c.until) { // test .until condition
                    for (;!c.until();) {
                        fn();
                    }
                } else if (c.iterations) { // test .iterations
                    for (;c.iterations-- > 0;) {
                        fn();
                    }
                } else { // single shot callback
                    fn();
                }
                this.q.shift();
                this.id = 0;
                return this.run();
            } else {
                if (c.until) { // test .until condition
                    if (c.until()) {
                        // Move to the next callback
                        this.q.shift();
                        return this.run();
                    }
                } else if (!c.iterations || !--c.iterations) { // .iterations
                    this.q.shift();
                }

                // Set to execute after the configured timeout
                this.id = setTimeout(function () {
                    fn();

                    // Loop unless the Queue was paused from inside the callback
                    if (me.id) {
                        // Indicate ready to run state
                        me.id = 0;
                        // Start the fun all over again
                        me.run();
                    }
                },ms);
            }
        }

        return this;
    },
    
    /**
     * Add any number of callbacks to the end of the queue
     * @method add
     * @param c {Function|Object}* Any number of callbacks
     * @return {Queue} the Queue instance
     */
    add  : function () {
        _SP.apply(this.q,[this.q.length,0].concat(_SL.call(arguments)));
        return this;
    },

    /**
     * Pause the execution of the Queue after the current execution of the
     * current callback completes.  If called interstitially, clears the
     * timeout for the pending callback. Paused Queue can be restarted with
     * chain.run()
     * @method pause
     * @return {Queue} the Queue instance
     */
    pause: function () {
        clearTimeout(this.id);
        this.id = 0;
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
        return this;
    }
};
Y.augment(Y.Queue,Y.Event.Target);
