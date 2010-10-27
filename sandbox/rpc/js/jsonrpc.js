var isFunction = Y.Lang.isFunction,
    JSONRPC = {
    type: 'json',

    defaults: {
        version: 2,
        sync: false
    },

    init: function () {
        Y.augment(this, Y.EventTarget);

        var config   = this._config,
            defaults = JSONRPC.defaults;

        if (!('version' in config)) {
            config.version = defaults.version;
        }

        if (!('sync' in config)) {
            config.sync = defaults.sync;
        }

        this.publish('dispatch', {
            emitFacade: true,
            defaultFn: Y.RPC.type.json._defDispatchFn
        });
    },

    exec: function (method, params, callback) {
        var data   = { method: method },
            config = this._config,
            ioConfig = {
                headers: {
                    'content-type': 'application/json'
                },
                method: config.method,
                sync: config.sync,
                on: {}
            },
            success, failure;
            
        if (isFunction(callback)) {
            callback = { on: { success: callback } };
        }
        
        Y.aggregate(ioConfig, callback, true);

        if (params) {
            data.params = params;
        }

        if (config.version > 1) {
            data.jsonrpc = config.version.toFixed(1);
        }

        if (callback) {
            data.id = Y.guid();
            success = callback.on.success;
            failure = callback.on.failure;

            if (success) {
                ioConfig.on.success = function (id, response) {
                    var data;
                    try {
                        data = Y.JSON.parse(response.responseText);
                    }
                    catch (e) {
                        if (failure) {
                            failure.call(ioConfig.context, response,
                                "Invalid JSON response");
                        }
                    }

                    success.call(ioConfig.context, data);
                };
            }
        }

        return this.fire('dispatch', {
            url: config.url,
            method: method,
            params: params,
            callback: callback,
            rpcPayload: data,
            ioConfig: ioConfig
        });

    },

    _defDispatchFn: function (e) {
        e.ioConfig.data = Y.JSON.stringify(e.rpcPayload);

        Y.io(e.url, e.ioConfig);
    },

    loadAPI: function () {
        var config = this._config;

        Y.io(config.url, {
            headers: {
                'content-type': 'application/json'
            },
            sync: config.sync,
            on: {
                success: function (id, response) {
                    var data, i;
                    try {
                        data = Y.JSON.parse(response.responseText);
                    }
                    catch(e) {
                        Y.error("Unable to parse remote API response", e);
                    }

                    if (data.envelope === 'JSON-RPC-1.0') {
                        config.version = 1;
                    }

                    if (data.methods) {
                        for (i = data.methods.length - 1; i >= 0; --i) {
                            Y.RPC.addMethod(this, data.methods[i]);
                        }
                    }

                    this.fire('apiready');
                },
                failure: function () {
                    Y.error("Unable to load remote API");
                    this.fire('apierror');
                }
            },
            context: this
        });

        return this;
    }
};

Y.RPC.type.json = JSONRPC;

Y.jsonrpc = function (url, method, params, callback) {
    if (url && method) {
        // TODO: allow version config
        return new Y.RPC({ url: url, type: 'json' })
            .exec(method, params, callback);
    }
};
