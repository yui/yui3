YUI.add('transaction', function(Y) {

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
 *   context : obj, // execution context bound to the default functions
 *   args    : [ "extra", "args", "bound", "to", "default", "functions" ],
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
     * any additional arguments are scanned for an &quot;on&quot; collection
     * to initialize subscriptions to this transaction's events.
     *
     * @method _init
     * @param schema {Object} the schema object passed to the constructor
     * @param sub* {Object} 0..n subscription maps (see _initSubscribers)
     * @protected
     */
    _init : function (schema) {
        schema = schema || {};

        var events = {
                start : this._defStartFn,
                end   : this._defEndFn
            },
            args    = 'args' in schema ? Y.Array(schema.args) : [],
            subs    = Y.Array(arguments,1,true),
            context = schema.context || this;

        if (Y.Lang.isObject(schema.events)) {
            Y.mix(events, schema.events, true);
        }

        if (Y.Lang.isObject(schema.api)) {
            Y.mix(this, schema.api);
        }

        this._initEvents(events, context, args);

        if (schema.host) {
            this.addTarget(schema.host);
        }

        if (subs.length) {
            this._initSubscribers(subs, context);
        }
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
     * @param context {Object} Context for the subscriber callback execution
     * @protected
     */
    _initSubscribers : function (subs, context) {
        var isObject = Y.Lang.isObject, i, l, s;

        if (Y.Lang.isArray(subs)) {
            for (i = 0, l = subs.length; i < l; ++i) {
                s = subs[i];

                if (isObject(s)) {
                    if (isObject(s.on)) {
                        this.on(s.on, null, context);
                    }
                    if (isObject(s.after)) {
                        this.after(s.after, null, context);
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
        e.stopImmediatePropagation();
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


}, '@VERSION@' ,{requires:['oop','event-custom']});
