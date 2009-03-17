YUI.add('queue-full', function(Y) {

var EXEC  = 'executeCallback',
    SHIFT = 'shiftCallback';

/**
 * Mechanism for executing a series of callbacks in sequential order.  Supports
 * simple synchronous queueing as well as queuing callbacks across setTimeout.
 * Callback iteration, specifying context and callback arguments, retrieval,
 * removal, and promotion of queued callbacks.
 *
 * Pass in a configuration object with the same keys as a callback object (see
 * the add method) to set the default values for those keys on all callbacks
 * added to this Queue. E.g. <code>Y.Queue({ pauseForIOResponse : true });</code>
 *
 * @module queue
 * @class Queue
 * @constructor
 * @param config {Object} Default settings for callbacks in this Queue
 * @param callback* {Object} (optional) Any number of callbacks to seed the Queue
 */


Y.mix(Y.Queue.defaults, {
    iterations : 1,
    timeout    : -1,
    until      : function () {
        this.iterations |= 0;
        return (this.iterations--) <= 0;
    }
},true);

Y.mix(Y.Queue.prototype, {

    /**
     * Sets the Queue status to active and passes the callback to the
     * appropriate executor (synchronous or asynchronous).
     * 
     * @method _processCallback
     * @param callback {Object} the callback object
     * @protected
     */
    _processCallback : function (callback) {
        this.active = true;

        if (callback.timeout < 0) {
            this._processSync(callback);
        } else {
            this._processAsync(callback);
        }
    },

    /**
     * Handles the execution of synchronous callbacks.
     *
     * @method _processSync
     * @param callback {Object} the callback object to execute
     * @protected
     */
    _processSync : function (callback) {

        while (this.active && this.isReady() && !callback.until()) {
            this._tId = -1;
            this.fire(EXEC,callback);
            this._tId = 0;
        }

        if (this.isReady()) {
            this._shift();
        }

        this.run();
    },

    /**
     * Handles the execution of asynchronous callbacks.
     *
     * @method _processAsync
     * @param callback {Object} the callback object to execute
     * @protected
     */
    _processAsync : function (callback) {
        var self = this;

        if (callback.until()) {
            this._shift();
            this.run();
        } else {
            // Set to execute after the configured timeout
            this._tId = setTimeout(function () {
                self.fire(EXEC,callback);

                self._tId = 0;

                // Loop unless the Queue was paused from inside the callback
                if (self.active) {
                    self.run();
                }
            }, callback.timeout);
        }
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
        if (!this.isReady()) {
            var e = this.on(SHIFT, function () {
                        this._promote(name);
                        e.detach();
                    },this);
        } else {
            this._promote(name);
        }

        return this;
    },

    /**
     * Promotes the named callback to the top of the queue.
     *
     * @method _promote
     * @param name {String|Object} the callback object or a callback's name
     * @return {Queue} the Queue instance
     * @protected
     */
    _promote : function (name) {
        var i,len,c;

        for (i = 0, len = this._q.length; i < len; ++i) {
            if (this._q[i] === name || this._q[i].name === name) {
                c = this._q.splice(i,1)[0];
                this._q.unshift(c);
                this.fire('promoteCallback', c);
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
        // Can't return the removed callback because of the deferral until
        // current callback is complete
        if (!this.isReady()) {
            var e = this.on(SHIFT, function () {
                        this._remove(name);
                        e.detach();
                    },this);
        } else {
            this._remove(name);
        }

        return this;
    },

    /**
     * Removes the callback from the queue.
     *
     * @method remove
     * @param name {String|Object} the callback object or a callback's name
     * @return {Object} the callback object or null if not found
     * @protected
     */
    _remove : function (name) {
        for (var i = 0, len = this._q.length; i < len; ++i) {
            if (this._q[i] === name || this._q[i].name === name) {
                this.fire('removeCallback',this._q.splice(i,1));
            }
        }
    }
},true);

Y.augment(Y.Queue,Y.Event.Target,true);

// APIdoc changes made applicable by this module

/**
 * Event used to trigger the execution of the callback.  Subscribe to this
 * event and call e.preventDefault() to prevent the callback execution.  Doing
 * so will not stop or pause the Queue.
 *
 * @event executeCallback
 * @param callback {Object} the callback object that will be executed
 */

/**
 * Event fired after a callback is shifted from the Queue
 * @event shiftCallback
 * @param callback {Function|Object} The callback passed to <code>add(..)</code>
 */

/**
 * Event fired after the last queued callback is executed.  Not
 * fired if the Queue is stopped via q.stop().
 * @event complete
 */

/**
 * Event fired when callbacks are added to the Queue.
 *
 * @event addCallback
 * @param callbacks {Array} array of added callback objects
 */

/**
 * Add any number of callbacks to the end of the queue.  Callbacks passed
 * in as functions will be wrapped in a callback object.
 *
 * Callbacks can be function references or object literals with these keys:
 * <dl>
 *    <dt>fn</dt>
 *      <dd>{Function} REQUIRED the callback function.</dd>
 *    <dt>name</dt>
 *      <dd>{String} a reference name to use for promotion or access</dd>
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
 *      <dd>{Array} array of arguments passed to callback function</dd>
 * </dl>
 *
 * @method add
 * @param callback* {Function|Object} Any number of callbacks
 * @return {Queue} the Queue instance
 */



}, '@VERSION@' ,{requires:['queue-base', 'event']});
