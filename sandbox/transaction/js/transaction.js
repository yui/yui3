/**
 * Encapsulates atomic transactions rely on callback execution.
 * Configured complete, abort, and error handlers are executed as the default
 * function to coresponding custom events, allowing external monitoring of state
 * changes and default handler prevention on a transaction-by-transaction basis.
 *
 * Additional events can be added, such as success and failure, by including
 * them in the 'on' collection of the configuration
 *
 * Configuration object passed to the constructor takes the following form:
 * {
 *   on : {
 *     complete : successOrFailure,
 *     success  : successHandler, // example of defining additional events
 *     failure  : failureHandler
 *   },
 *   api : { // Add/override instance methods or properties
 *     customFunction : function (payload) {
 *       this.fire('failure',this.customProperty,payload);
 *     },
 *     customProperty : "foo"
 *   },
 *   context : obj, // execution context for the handlers
 *   args    : ["additional", "arguments", "passed", "to", "handlers"]
 * }
 *
 * @module transaction
 * @class Transaction
 * @constructor
 * @param cfg {Object} 
 */
function Transaction(cfg) {
    Transaction.superclass.constructor.apply(this,arguments);

    /**
     * The unique id of this transaction.
     *
     * @property id
     * @readOnly
     * @type String
     */
    this.id = Y.guid();

    this._init(cfg);
}

Y.extend(Transaction, Y.Event.Target, {
    /**
     * Configures the instance.  Mixes in API and event handler info, then
     * calls _initEvents to set up the individual state change events.
     *
     * @method _init
     * @param cfg {Object} the config object passed to the constructor
     * @protected
     */
    _init : function (cfg) {
        cfg = cfg || {};

        var events = {
                complete : this._defCompleteFn,
                abort    : this._defAbortFn,
                error    : this._defErrorFn
            },
            args = 'args' in cfg ? Y.Array(cfg.args) : [];

        if (Y.Lang.isObject(cfg.on)) {
            Y.mix(events, cfg.on, true);
        }

        if (Y.Lang.isObject(cfg.api)) {
            Y.mix(this, cfg.api);
        }

        this._initEvents(events, (cfg.context || this), args);
    },

    /**
     * Publishes the state change events with the configured default functions.
     *
     * @method _initEvents
     * @param events {Object} map of event names to handler functions
     * @param context {Object} execution context of the handler functions
     * @param args {Object} additional arguments to bind to the handler
     *                      function execution
     * @protected
     */
    _initEvents : function (events, context, args) {
        args.unshift(null,context);

        Y.each(events, function (defFn, ev) {
            args[0] = defFn;
            this.publish(ev, {
                emitFacade : true,
                defaultFn  : Y.bind.apply(Y, args)
            });
        }, this);
    },

    /**
     * Default complete event handler
     *
     * @method _defCompleteFn
     * @protected
     */
    _defCompleteFn: function () {
        Y.log("Transaction " + this.id + " completed");
    },

    /**
     * Default abort event handler
     *
     * @method _defAbortFn
     * @protected
     */
    _defAbortFn: function () {
        Y.log("Transaction " + this.id + " aborted");
    },

    /**
     * Default error event handler
     *
     * @method _defErrorFn
     * @protected
     */
    _defErrorFn: function () {
        Y.log("Transaction " + this.id + " encountered an error","error");
    },

    /**
     * Fires the complete event.
     *
     * @method complete
     * @param arg* {MIXED} 0..n additional args that will be passed along to the
     *                        handler (and any subscribers)
     * @return {Transaction} this transaction object
     */
    complete : function () {
        var args = Y.Array(arguments,0,true);
        args.unshift('complete',null);

        this.fire('complete',{ data: Y.Array(arguments,0,true) });

        return this;
    },

    /**
     * Fires the abort event.
     *
     * @method abort
     * @param arg* {MIXED} 0..n additional args that will be passed along to the
     *                        handler (and any subscribers)
     * @return {Transaction} this transaction object
     */
    abort : function () {
        this.fire.apply('abort',{ data: Y.Array(arguments,0,true) });

        return this;
    },

    /**
     * Fires the error event.
     *
     * @method error
     * @param arg* {MIXED} 0..n additional args that will be passed along to the
     *                        handler (and any subscribers)
     * @return {Transaction} this transaction object
     */
    error : function () {
        this.fire('error',{ data: Y.Array(arguments,0,true) });

        return this;
    }
});

Y.Transaction = Transaction;
