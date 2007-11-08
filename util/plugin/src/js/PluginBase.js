(function() {
    var PluginBase = function() {
        PluginBase.superclass.constructor.call(this, arguments);
    };
    
    PluginBase.CONFIG = {
        'parent': {
            get: function() {
                return this.__.parent;
            }
        },
        'node': {
            get: function() {
                return this.__.node;
            }
        },
        'name': {
            get: function() {
                return this.name;
            }
        }
    };

    var proto = {
        name: 'plugin',
        _listeners: null,
        initializer : function(config) {
            config = config[0];
            var node = null;
            if (config.parent.get && config.parent.get('node')) {
                node = config.parent.get('node');
            }
            if (config.parent.get && config.parent.get('node') && config.parent.get('node') && config.parent.get('node').get('node')) {
                node = config.parent.get('node').get('node');
            }
            this.set('parent', config.parent, true);
            this.set('node', node, true);
            this.set('name', this.name, true);

            this._listeners = [];

            YAHOO.log('Initializing: ' + this.get('name'), 'info', 'PluginBase');
        },
        destructor: function() {
            for (var i = 0; i < this._listeners.length; i++) {
                var event = this._listeners[i];
                event.obj.unsubscribe(event.ev, event.fn);
            }
        },
        listen: function(obj, ev, fn, s, o) {
            this._listeners[this._listeners.length] = { obj: obj, ev: ev, fn: fn };
            obj.on(ev, fn, s, o);
        },
        nolisten: function(obj, ev, fn) {
            obj.unsubscribe(ev, fn);
            for (var i = 0; i < this._listeners.length; i++) {
                if ((this._listeners[i].ev == ev) && (this._listeners[i].fn == fn) && (this._listeners[i].obj == obj)) {
                    this._listeners[i] = null;
                    break;
                }
            }
        },
        listenBefore: function(obj, ev, fn, s, o) {
            ev = 'before' + ev.charAt(0).toUpperCase() + ev.substr(1) + 'Change';
            this.listen(obj, ev, fn, s, o);
        },
        nolistenBefore: function(obj, ev, fn) {
            ev = 'before' + ev.charAt(0).toUpperCase() + ev.substr(1) + 'Change';
            this.nolisten(obj, ev, fn);
        },
        setSilent: function(obj, config, val) {
            obj._configs[config].value = val;
        },
        toString: function() {
            return this.name;
        }
    };


    YAHOO.lang.extend(PluginBase, YAHOO.util.Object, proto);
    YAHOO.namespace('plugin');
    YAHOO.plugin.PluginBase = PluginBase;
})();
