var Attr = function() {
};

Attr.prototype = {
    initAttrs: function(config) {
        var defAttrs = this.constructor.ATTRS;
        this._config = {};

        Y.Object.each(defAttrs, function(val, name) {
            val = (name in config) ? config[name] : val.value; 
            this.set(name, val);
        }, this);
    },

    get: function(name) {
        var getter = this.constructor.ATTRS[name].getter || this._get;
        return getter.call(this, name);
    },

    set: function(name, val) {
        var setter = this.constructor.ATTRS[name].setter;
        if (setter) {
            val = setter.call(this, val, name);
        }
        return this._set(name, val);
    },

    _set: function(name, val) {
        var obj = this._config;

        if (this._stateProxy && !this.constructor.ATTRS[name]._bypassProxy) {
            obj = this._stateProxy;
        }
        obj[name] = val;
        return this;
    },

    _get: function(name, val) {
        var obj = this._config;
        if (this._stateProxy && !this.constructor.ATTRS[name]._bypassProxy) {
            obj = this._stateProxy;
        }
        return obj[name];
    }
};

Y.Attr = Attr;
