var toArray = Y.Array,
    Lang = Y.Lang,
    isFunction = Lang.isFunction,
    isObject = Lang.isObject;

function Resource() {
    // Allow _init to return an instance of another class, or fall back
    // to an unadorned Resource instance
    return this._init.apply(this, arguments);
}

Resource.prototype = {
    _init: function (config) {
        config || (config = {});

        var type = config.type || '_default',
            Impl = Resource.Type[type] || Resource.Type._default,
            instance, ret;

        if (isFunction(Impl)) {
            instance = Y.Object(Impl.prototype);
            ret = Impl.apply(instance, arguments);
        }

        return ret;
    },

    // support signatures:
    // resource.send([successFn[, failureFn]]),
    // resource.send(data[, successFn[, failureFn]]),
    // resource.send(data, { trxConfig });
    send: function (data, success, failure) {
        var config = (isObject(success, true)) ? success : {};


        if (data !== undefined) {
            config.data = data;
        }

        if (isFunction(success)) {
            config.on || (config.on = {});
            config.on.success = success;
        }

        if (isFunction(failure)) {
            config.on || (config.on = {});
            config.on.failure = failure;
        }

        config.resource = this;
        return new this.Transaction(config).send();
    }
};

Resource.Type = {};
Resource.Transport = {
    _default: {
        createTransaction: function () {
            var instance = Y.Object(Y.Transaction.prototype),
                ret = Y.Transaction.apply(instance, arguments);

            return isObject(ret) ? ret : instance;
        },

        init: function (config) {
            this.data = (config && config.data) || null;
        }
    }
};

function Transaction() {
    this._subs = { on: {}, after: {} };
    this._config = config;
}
Transaction.prototype = {
    // TODO: sig should include the 
    _init: function (config) {
        if (config) {
            if (config.on) {
                // FIXME: wrong sig, and deal with context binding now or later?
                Y.Object.each(config.on, this.on, this);
            }
            if (config.after) {
                // FIXME
                Y.Object.each(config.after, this.after, this);
            }
        }
    },

    on: function () { return this._on(arguments); },
    after: function () { return this._on(arguments, true); },
    _on: function (args, after) {
        var args = toArray(args),
            subs = this._subs[(after) ? 'after' : 'on'],
            type = args.shift(),
            callback = args.shift();

        // TODO: should probably return fake detach handle
        if (isFunction(callback)) {
            // TODO: what should the default context be?
            if (args.length) {
                args[0] || (args[0] = Y);
                args.unshift(callback);
                callback = Y.rbind.apply(Y, args);
            }

            if (!subs[type]) {
                subs[type] = [];
            }

            subs[type].push(callback);
        }
    }
};

Y.io = function (url, success, failure) {
    var config = url;

    // support signatures:
    // Y.io(url[, successFn[, failureFn]]),
    // Y.io(url, { trxConfig });
    // Y.io({ trxConfig });
    if (!isObject(url)) {
        config = { url: url };
    } else if (isObject(success, true)) {
        config = success;
        config.url = url;
        success = null;
    }

    if (isFunction(success)) {
        config.on || (config.on = {});
        config.on.success = success;
    }

    if (isFunction(failure)) {
        config.on || (config.on = {});
        config.on.failure = failure;
    }

    return new Y.Resource(config).send();
};

Y.Resource = Resource;
