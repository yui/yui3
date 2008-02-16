(function() {

    var M = function(Y) {

        // TODO: Move to Y.add/register
        var _registry = {};

        function Plugin(config) {
            Plugin.superclass.constructor.apply(this, arguments);
        }

        // No attributes
        // Plugin.ATTRS = null

        Plugin.NAME = "plugin";
        Plugin.NS = "plugin";

        // TODO: Move to Y.add
        Plugin.add = function(pluginclass) {
            if (pluginclass.NS) {
                _registry[pluginclass.NS] = pluginclass;
            }
        };

        Plugin.get = function(ns) {
            return _registry[ns];
        };

        var proto = {

            _listeners: null,
            _overrides: null,

            initializer : function(config) {

                if (!config.owner) {
                    throw('plugin needs to have an owner defined');
                }

                this.owner = config.owner;

                this._listeners = [];
                this._overrides = [];

                Y.log('Initializing: ' + this.constructor.NAME, 'info', 'Plugin');
            },

            destructor: function() {
                var i;

                for (i = 0; i < this._listeners.length; i++) {
                    var event = this._listeners[i];
                    if (Y.isObject(event)) {
                        event.obj.unsubscribe(event.ev, event.fn);
                    }
                }

                for (i = 0; i < this._overrides.length; i++) {
                    var o = this._overrides[i];
                    if (Y.isObject(o)) {
                        o.obj[o.method] = o.fn;
                        this._overrides[i] = null;
                    }
                }
            },

            // TODO: Change to use Event Handle, once implemented (and then use Y.bind)
            listen: function(obj, ev, fn, s, o) {
                this._listeners[this._listeners.length] = { obj: obj, ev: ev, fn: fn };
                obj.on(ev, fn, s, o);
            },

            // TODO: Change to use Event Handle, once implemented (and then use Y.bind)
            nolisten: function(obj, ev, fn) {
                obj.unsubscribe(ev, fn);
                for (var i = 0; i < this._listeners.length; i++) {
                    if ((this._listeners[i].ev == ev) && (this._listeners[i].fn == fn) && (this._listeners[i].obj == obj)) {
                        this._listeners[i] = null;
                        break;
                    }
                }
            },

            // TODO: Change to use Event Handle, once implemented (and Y.bind)
            listenBefore: function(obj, ev, fn, s, o) {
                ev = 'before' + ev.charAt(0).toUpperCase() + ev.substr(1) + 'Change';
                this.listen(obj, ev, fn, s, o);
            },

            // TODO: Change to use Event Handle, once implemented (and Y.bind)
            nolistenBefore: function(obj, ev, fn) {
                ev = 'before' + ev.charAt(0).toUpperCase() + ev.substr(1) + 'Change';
                this.nolisten(obj, ev, fn);
            },

            addOverride: function(obj, method, fn) {
                if (Y.isFunction(obj[method]) && Y.isFunction(fn)) {
                    this._overrides[this._overrides.length] = { method: method, obj: obj, fn: obj[method] };
                    obj[method] = fn;
                } else {
                    Y.log('Method (' + method + ') does not belong to object', 'error', 'Plugin');
                }
            },

            removeOverride: function(obj, method) {
                for (var i = 0; i < this._overrides.length; i++) {
                    var o = this._overrides[i];
                    if ((o.obj == obj) && (o.method == method)) {
                        obj[method] = o.fn;
                        this._overrides[i] = null;
                    }
                }
            },

            setSilent: function(obj, config, val) {
                obj._configs[config].value = val;
            },

            toString: function() {
                return this.constructor.NAME + "[" + this.constructor.NS + "]";
            }
        };

        Y.extend(Plugin, Y.Base, proto);
        Y.Plugin = Plugin;
    };

    YUI.add("plugin", M, "3.0.0");
})();