/**
 * Encapsulates the life cycle execution of atomic transactions that rely on
 * callback execution. Configured start and end handlers are executed as the
 * default function to corresponding custom events, allowing external monitoring
 * of state changes and default handler prevention on a transaction by
 * transaction basis.
 *
 * Set the default function for at least the start event as well as any other
 * interesting moments during the life of the transaction by defining the event
 * map in the &quot;on&quot; property of the schema object.  Each key
 * is used as the event name and the value its default function.  Use this to
 * define the operational path of the transaction.
 *
 * Transaction schema object passed to the constructor takes the following form:
 * {
 *   events : { // the operational path(s) of the transaction
 *     start    : goManGo,
 *     response : successOrFailure, // define additional events and their
 *     success  : successHandler,   // default functions to describe the
 *     failure  : failureHandler,   // interesting moments that may occur
 *     //end : isProvidedByDefault
 *   },
 *
 *   api : { // Add/override instance methods or properties
 *     customFunction : function (payload) {
 *       this.fire('failure',this.customProperty,payload);
 *     },
 *     customProperty : "foo"
 *   },
 *
 *   host : bubbleTarget // events will bubble to this object if provided
 * }
 *
 * @module transaction
 * @class Transaction
 * @constructor
 * @param schema {Object} 
 * @param sub* {Object} 0..n subscription maps (see _initSubscribers)
 */
function Transaction(schema) {
    Y.mix(schema, Transaction.defaults);

    Transaction.superclass.constructor.apply(this, arguments);

    // Workaround for event-custom not propagating queuable to the defaults
    // collection.
    if ('queuable' in schema) {
        this._yuievt.defaults.queuable = schema.queuable;
    }

    /**
     * The unique id of this transaction.
     *
     * @property id
     * @readOnly
     * @type String
     */
    this.id = Y.guid();

    this._init.apply(this,arguments);
}

Transaction.defaults = {
    emitFacade : true,
    broadcast  : 1,
    queuable : true
};

Y.extend(Transaction, Y.Event.Target, {
    /**
     * Configures the instance.  Mixes in API and event and corresponding  info, then
     * calls _initEvents to set up the individual state change events.  Finally,
     * any additional arguments are scanned for <code>on</code> and
     * <code>after</code> collections to initialize subscriptions to this
     * transaction's events.
     *
     * @method _init
     * @param schema {Object} the schema object passed to the constructor
     * @param sub* {Object} 0..n subscription maps (see _initSubscribers)
     * @protected
     */
    _init : function (schema) {
        schema = schema || {};

        var events = {
                start : "_defStartFn",
                end   : "_defEndFn"
            },
            subs    = Y.Array(arguments,1,true);

        if (Y.Lang.isObject(schema.events)) {
            Y.mix(events, schema.events, true);
        }

        if (Y.Lang.isObject(schema.api)) {
            Y.mix(this, schema.api);
        }

        if (schema.host) {
            this.host = schema.host;
            this.addTarget(schema.host);
        }

        this._initEvents(events);

        if (subs.length) {
            this._initSubscribers(subs);
        }
    },

    /**
     * Publishes the state change events with the configured default functions.
     *
     * @method _initEvents
     * @param events {Object} map of event names to handler functions
     * @protected
     */
    _initEvents : function (events) {
        var type = Y.Lang.type;

        Y.each(events, Y.bind(function (cfg, ev) {
            // Convert strings to bound functions and functions to event
            // publishing configuration
            switch (type(cfg)) {
                case 'string'  : cfg = Y.rbind(cfg, (this.host || this));
                                 // fall through intentional
                case 'function': cfg = { defaultFn: cfg }; break;
            }
            this.publish(ev, cfg);
        }, this));
    },

    /**
     * Subscribes to transaction events using any number of objects in the
     * format
     * <pre>{
     *    on : {
     *      event_name : fn, ...
     *    },
     *    after : {
     *      event_name : fn, ...
     *    }
     * }</pre>
     *
     * @method _initSubscribers
     * @param subs {Array} Array of objects as described above
     * @protected
     */
    _initSubscribers : function (subs) {
        var isObject = Y.Lang.isObject, i, l, s;

        if (Y.Lang.isArray(subs)) {
            for (i = 0, l = subs.length; i < l; ++i) {
                s = subs[i];

                if (isObject(s)) {
                    if (isObject(s.on)) {
                        this.on(s.on);
                    }
                    if (isObject(s.after)) {
                        this.after(s.after);
                    }
                }
            }
        }
    },

    /**
     * Default start event handler.  Should be overridden during instantiation
     * by setting schema.events.start.
     *
     * @method _defStartFn
     * @protected
     */
    _defStartFn: function (e) {
        Y.log("Transaction " + this.id + " started");
        this.fire('end', e);
    },

    /**
     * Default end event handler.  The end event should be fired from the code
     * resulting from the start event's default function, after the body of the
     * transaction is complete.
     *
     * Can be overridden during instantiation by setting schema.events.end.
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
        this.fire('start', Y.merge({ transaction: this }, (info || {})));

        return this;
    }

});

Y.Transaction = Transaction;
