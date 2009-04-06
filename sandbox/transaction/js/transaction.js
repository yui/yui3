/**
 * Encapsulates the life cycle execution of atomic transactions that rely on
 * callback execution. Configured start and end handlers are executed as the
 * default function to corresponding custom events, allowing external monitoring
 * of state changes and default handler prevention on a transaction by
 * transaction basis.
 *
 * Set the default function for at least the start event as well as any other
 * interesting moments during the life of the transaction by defining the event
 * schema in the &quot;on&quot; property of the configuration object.  Each key
 * is used as the event name and the value its default function.  Use this to
 * define the operational schema of the transaction.
 *
 * Configuration object passed to the constructor takes the following form:
 * {
 *   on : {
 *     start    : goManGo,
 *     response : successOrFailure, // define additional events and their
 *     success  : successHandler,   // default functions to describe the
 *     failure  : failureHandler,   // interesting moments that may occur
 *   },
 *   api : { // Add/override instance methods or properties
 *     customFunction : function (payload) {
 *       this.fire('failure',this.customProperty,payload);
 *     },
 *     customProperty : "foo"
 *   },
 *   context : obj, // execution context bound to the default functions
 *   args    : [ "extra", "args", "bound", "to", "default", "functions" ]
 * }
 *
 * @module transaction
 * @class Transaction
 * @constructor
 * @param cfg {Object} 
 */
function Transaction(cfg) {
    Y.mix(cfg, Transaction.defaults);

    Transaction.superclass.constructor.apply(this, arguments);

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

Transaction.defaults = {
    emitFacade : true,
    broadcast  : true
};

Y.extend(Transaction, Y.Event.Target, {
    /**
     * Configures the instance.  Mixes in API and event and corresponding  info, then
     * calls _initEvents to set up the individual state change events.
     *
     * @method _init
     * @param cfg {Object} the config object passed to the constructor
     * @protected
     */
    _init : function (cfg) {
        cfg = cfg || {};

        var events = {
                start : this._defStartFn,
                end   : this._defEndFn
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
            this.publish(ev, { defaultFn  : Y.rbind.apply(Y, args) });
        }, this);
    },

    /**
     * Default start event handler.  Should be overridden during instantiation
     * by setting cfg.on.start.
     *
     * @method _defStartFn
     * @protected
     */
    _defStartFn: function (e) {
        Y.log("Transaction " + this.id + " started");
        e.stopImmediatePropagation();
        this.fire('end', e);
    },

    /**
     * Default end event handler.  The end event should be fired from the code
     * resulting from the start event's default function, after the body of the
     * transaction is complete.
     *
     * Can be overridden during instantiation by setting cfg.on.end.
     *
     * @method _defEndFn
     * @protected
     */
    _defEndFn: function (e) {
        Y.log("Transaction " + this.id + " completed");
    },

    /**
     * Fires the start event, setting the transaction in motion.
     *
     * @method start
     * @param info {Object} object payload of additional properties that will
     *                      be applied to the event facade
     * @return {Transaction} this transaction object
     */
    start : function (info) {
        this.fire('start', info);

        return this;
    }

});

Y.Transaction = Transaction;
