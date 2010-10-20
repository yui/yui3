/*
var rpc = new Y.RPC({
    url: url,
    type: 'json',
    methods: ['foo'],
    version: 2,
    preload: true // defaults to false if methods is specified, true otherwise
    on: {
        ready: function () {}, // fired when API loaded
        success: function () {},
        failure: function () {},
        // for all calls
    }
});
rpc.exec('foo', ['bar', 'baz'], function (response) {});
rpc.foo('bar', 'baz', function (response) {});
rpc.foo('bar', 'baz', { on: { success: function (data) {}, ... } });
*/



var isObject   = Y.Lang.isObject,
    isFunction = Y.Lang.isFunction,
    toArray    = Y.Array,
    NOOP       = function () {};

function RPC(config) {
    var methods = config && config.methods,
        impl,
        i;

    config = this._config = Y.merge({
        context: this,
        method: 'POST',
        type: '_default'
    }, config);
    
    // default preload false if methods are specified, else true.
    if (!('preload' in config)) {
        config.preload = !methods;
    }

    impl = RPC.type[config.type];

    // type specific initialization
    impl.init.apply(this, arguments);

    if (methods) {
        for (i = methods.length - 1; i >= 0; --i) {
            RPC.addMethod(this, methods[i]);
        }
    }

    if (config.preload) {
        this.loadAPI();
    }
}

Y.RPC = Y.mix(RPC, {

    type: {
        _default: {
            init: NOOP,
            exec: NOOP,
            loadAPI: NOOP
        }
    },

    // Static methods to avoid name collision with the remote API
    addMethod: function (rpc, name, force) {
        if (force || !rpc[name]) {
            rpc[name] = function () {
                var args = toArray(arguments, 0, true),
                    callback;
                    
                if (isObject(args[args.length - 1])) {
                    callback = args.pop();
                }

                return this.exec(name, args, callback);
            };
        }
    },

    prototype: {
        exec: function () {
            return RPC.type[this._config.type].exec.apply(this, arguments);
        },

        loadAPI: function () {
            return RPC.type[this._config.type].loadAPI.apply(this, arguments);
        }
    }
}, true);

Y.augment(RPC, Y.EventTarget);
