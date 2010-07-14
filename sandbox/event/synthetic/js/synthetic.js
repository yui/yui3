YUI.add('xevent-synthetic', function (Y) {

var DOMMap  = Y.Env.evt.dom_map,
    toArray = Y.Array,
    noop   = function () {};

function SyntheticEvent() {
    this._init.apply(this, arguments);
}

SyntheticEvent.prototype = {
    constructor: SyntheticEvent,

    _init: function () {
        this.publishConfig || (this.publishConfig = { emitFacade: true });

        if (!('emitFacade' in this.publishConfig)) {
            this.publishConfig.emitFacade = true;
        }
    },

    init       : noop,
    on         : noop,
    detach     : noop,
    destroy    : noop,
    processArgs: noop,
    //allowDups: false,

    _getEvent: function (node) {
        var ce = node.getEvent(this.type),
            yuid, key;

        if (!ce) {
            yuid = Y.stamp(node._node);
            key  = 'event:' + yuid + this.type;

            ce        = node.publish(this.type, this.publishConfig);
            ce.el     = node._node,
            ce.key    = key,
            ce.domkey = yuid,

            ce.monitor('detach', this._unsubscribe, this);

            (DOMMap[yuid] || (DOMMap[yuid] = {}))[key] = ce;
        }
        
        return ce;
    },

    subscribe: function (args) {
        var handles = [],
            type    = args[0],
            fn      = args[1],
            query   = (typeof args[2] === 'string') ? args[2] : null,
            els     = (query) ? Y.Selector.query(query) : Y.Array(args[2]),
            handle;

        if (!els.length && query) {
            handle = Y.on('available', function () {
                Y.mix(handle, Y.on.apply(Y, args), true);
            }, query);

            return handle;
        }

        Y.each(els, function (el) {
            var node = Y.one(el),
                ce   = this._getEvent(node);

            handle = this._subscribe(ce, args.slice(), node);

            if (handle) {
                handles.push(handle);
            }
        }, this);

        return (!handles.length === 1) ?
            handles[0] :
            new Y.EventHandle(handles);
    },

    _subscribe: function (ce, args, node) {
        var extra = this.processArgs(args),
            handle;

        args[2] = node;
        args.shift();

        // TODO: is getSubs good/flexible enough?
        if (this.allowDups || !this.getSubs(ce, args)[0]) {
            handle = ce.on.apply(ce, args);
            handle.sub._extra = extra;

            if (!ce.initialized) {
                this.init(node, handle.sub, ce);
                ce.initialized = true;
            }

            this.on(node, handle.sub, ce);
        }
        
        return handle;
    },

    //allowDups: false,

    getSubs: function (ce, args) {
        args = args.slice();
        args.unshift(Y.Object.values(ce.getSubs()[0]));

        return this.filterSubs.apply(this, args) || [];
    },

    filterSubs: function (subs, fn, context) {
        var matches = [], i, len, sub;

        for (i = 0, len = subs.length; i < len; ++i) {
            sub = subs[i];
            if ((!fn      || sub.fn === fn) &&
                (!context || sub.context === context)) {
                matches.push(sub);
            }
        }

        return matches;
    },

    unsubscribe: function (args) {
        var type = args[0],
            fn   = args[1],
            els = (typeof args[2] === 'string') ?
                    Y.Selector.query(args[2]) :
                    Y.Array(args[2]);
        
        if (els.length) {
            Y.each(els, function (el) {
                var yuid = Y.stamp(el),
                    key  = 'event:' + yuid + type,
                    node = Y.one(el),
                    ce   = node.getEvent(this.type);

                if (ce) {
                    ce.detach(fn, node);
                }
            }, this);
        }
    },

    _unsubscribe: function (e) {
        var ce   = e.ce,
            fn   = e.sub.fn,
            node = e.sub.context;

        this.detach(node, e.sub, ce);

        if (!ce.hasSubs()) {
            this.destroy(node, e.sub, ce);

            ce.initialized = false;
            ce.detach(this._unsubscribe, this);
        }
    }
};

Y.Node.publish = Y.Event.define = function (type, config) {
    config || (config = {});

    var eventDef = (Y.Lang.isObject(type)) ?
                        type :
                        Y.merge({ type: type }, config),
        Impl, synth;

    if (!Y.Node.DOM_EVENTS[eventDef.type]) {
        Impl = function () {
            SyntheticEvent.apply(this, arguments);
        };
        Y.extend(Impl, SyntheticEvent, eventDef);
        synth = new Impl();

        type = synth.type;

        Y.Node.DOM_EVENTS[type] = Y.Env.evt.plugins[type] = {
            on: function () {
                return synth.subscribe(toArray(arguments));
            },

            detach: function () {
                return synth.unsubscribe(toArray(arguments));
            }
        };

    }
};

}, '0.0.1', { requires: ['node', 'event-custom'] });
