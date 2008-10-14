
        // TODO: Move to Y.add/register
        // var _registry = {};

        /**
         * Plugin provides a base class for all Plugin classes.
         * 
         * @class YUI.Widget
         * @extends YUI.Base
         * @param {Object} config The configuration object for the
         * plugin.
         */
        function Plugin(config) {
            //Plugin.superclass.constructor.apply(this, arguments);
        }

        // No attributes
        // Plugin.ATTRS = null

        /**
         * Static property provides a string to identify the class.
         *
         * @property YUI.Plugin.NAME
         * @type {String}
         * @static
         */
        Plugin.NAME = "plugin";


        /**
         * Static property provides the namespace the plugin will be
         * registered under.
         *
         * @property YUI.Plugin.NS
         * @type {String}
         * @static
         */
        Plugin.NS = "plugin";

        /**
         * Registers a Plugin. The Plugin class passed in is expected
         * to have a static NS property defined which is used to register
         * the plugin and define it's namespace on the host object
         * 
         * If more than one plugin is registered with the same namespace
         * on the page, the last one registered will win.
         * 
         * @param {Function} pluginclass
         */
        // TODO: Move to Y.add
        // Plugin.add = function(pluginclass) {
        //    if (pluginclass.NS) {
        //        _registry[pluginclass.NS] = pluginclass;
        //    }
        // };

        /**
         * Retrieve the plugin class for a given plugin namespace.
         * @param {Object} ns The plugin's namespace
         */
        // Plugin.get = function(ns) {
        //    return _registry[ns];
        // };

        var proto = {

            _listeners: null,
            _overrides: null,

            /**
             * Initializer lifecycle implementation.
             * 
             * @method initializer
             * @param {Object} config Configuration object literal for the plugin
             */
            initializer : function(config) {

                if (!config.host) {
                    throw('plugin needs to have a host defined');
                }

                this._listeners = [];

                Y.log('Initializing: ' + this.constructor.NAME, 'info', 'Plugin');
            },

            /**
             * desctructor lifecycle implementation.
             * 
             * Removes any listeners attached by the Plugin and restores
             * and over-ridden methods.
             * 
             * @method destructor
             */
            destructor: function() {
                var i;

                for (i = 0; i < this._listeners.length; i++) {
                    var event = this._listeners[i];
                    if (Y.lang.isObject(event)) {
                        event.obj.unsubscribe(event.ev, event.fn);
                    }
                }

                for (i = 0; i < this._overrides.length; i++) {
                    var o = this._overrides[i];
                    if (Y.lang.isObject(o)) {
                        o.obj[o.method] = o.fn;
                        this._overrides[i] = null;
                    }
                }
            },

            /**
             * Registers a listener on the provided object. The listener will
             * be automatically removed when the plugin is unplugged from the host.
             * 
             * @method listen
             * @param {Object} obj
             * @param {Object} ev
             * @param {Object} fn
             * @param {Object} s
             * @param {Object} o
             */
            // TODO: Change to use Event Handle, once implemented (and then use Y.bind)
            listen: function(obj, ev, fn, s, o) {
                this._listeners[this._listeners.length] = { obj: obj, ev: ev, fn: fn };
                obj.on(ev, fn, s, o);
            },

            /**
             * Unregisters a listener from the provided object.
             * 
             * @method nolisten
             * @param {Object} obj
             * @param {Object} ev
             * @param {Object} fn
             * @param {Object} s
             * @param {Object} o
             */
            // TODO: Change to use Event Handle, once implemented (and then use Y.bind)
            noListen: function(obj, ev, fn) {
                obj.unsubscribe(ev, fn);
                for (var i = 0; i < this._listeners.length; i++) {
                    if ((this._listeners[i].ev == ev) && (this._listeners[i].fn == fn) && (this._listeners[i].obj == obj)) {
                        this._listeners[i] = null;
                        break;
                    }
                }
            },

            /**
             * Registers a before change listener on the provided object. The listener will
             * be automatically removed when the plugin is unplugged from the host.
             * 
             * @method listenBefore
             * @param {Object} obj
             * @param {Object} ev
             * @param {Object} fn
             * @param {Object} s
             * @param {Object} o
             */
            // TODO: Change to use Event Handle, once implemented (and Y.bind)
            doBefore: function(obj, ev, fn, s, o) {
                ev = 'before' + ev.charAt(0).toUpperCase() + ev.substr(1) + 'Change';
                this.listen(obj, ev, fn, s, o);
            },

            /**
             * Unregisters a before change listener on the provided object.
             * 
             * @method nolistenbefore
             * @param {Object} obj
             * @param {Object} ev
             * @param {Object} fn
             */
            // TODO: Change to use Event Handle, once implemented (and Y.bind)
            undoBefore: function(obj, ev, fn) {
                ev = 'before' + ev.charAt(0).toUpperCase() + ev.substr(1) + 'Change';
                this.nolisten(obj, ev, fn);
            },

            toString: function() {
                return this.constructor.NAME + "[" + this.constructor.NS + "]";
            }
        };

        //Y.extend(Plugin, Y.Base, proto);
        Plugin.proto = proto;
        Y.Plugin = Plugin;
    };

