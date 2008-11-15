
        // TODO: Move to Y.add/register
        // var _registry = {};

        /**
         * Plugin provides a base class for all Plugin classes.
         * 
         * @class Plugin 
         * @extends Base
         * @param {Object} config The configuration object for the
         * plugin.
         */
        function Plugin(config) {
            Plugin.superclass.constructor.apply(this, arguments);
            //this.initializer.apply(this, arguments);
        }

        // No attributes
        // Plugin.ATTRS = null

        /**
         * Static property provides a string to identify the class.
         *
         * @property Plugin.NAME
         * @type {String}
         * @static
         */
        Plugin.NAME = 'plugin';


        /**
         * Static property provides the namespace the plugin will be
         * registered under.
         *
         * @property Plugin.NS
         * @type {String}
         * @static
         */
        Plugin.NS = 'plugin';

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
            _handles: null,

            /**
             * Initializer lifecycle implementation.
             * 
             * @method initializer
             * @param {Object} config Configuration object literal for the plugin
             */
            initializer : function(config) {

                if (config.owner) {
                    this._owner = config.owner;
                } else {
                    Y.log('no owner defined for plugin ' + this, 'error', 'Plugin');
                }

                this._handles = [];

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
                // remove all handles
                for (i = 0; i < this._handles.length; i++) {
                   this.detach(this._handles[i]);
                }
            },

            /**
             * 
             */
            before: function(sFn, fn, context) {
                var owner = this._owner,
                    handle;

                context = context || this;

                if (sFn in owner) { // method
                    handle = Y.Do.before(fn, this._owner, sFn, context);
                } else if (owner.on) { // event
                    handle = owner.on(sFn, fn, context);
                }

                this._handles.push(handle);
                return handle;
            },

            after: function(sFn, fn, context) {
                var owner = this._owner,
                    handle;

                context = context || this;

                if (sFn in owner) { // method
                    handle = Y.Do.after(fn, this._owner, sFn, context);
                } else if (owner.after) { // event
                    handle = owner.after(sFn, fn, context);
                }

                this._handles.push(handle);
                return handle;
            },

            detach: function(handle) {
                if (handle.detach) { // event
                    handle.detach(handle);
                } else { // method
                    Y.Do.detach.apply(Y.Do, arguments);
                }
            },

            toString: function() {
                return this.constructor.NAME + '[' + this.constructor.NS + ']';
            }
        };

        Y.extend(Plugin, Y.Base, proto);
        Y.Plugin = Plugin;
