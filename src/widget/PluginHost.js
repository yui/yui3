/**
 * @class PluginHost
 */

var L = Y.Lang;

function PluginHost(config) {
    this._plugins = {};

    this.after("init", function(e, cfg) {this._initPlugins(cfg);});
    this.after("destroy", this._destroyPlugins);
}

PluginHost.prototype = {
    /**
     * Register and instantiate a plugin with the Widget.
     * 
     * @param p {String | Object |Array} Accepts the registered 
     * namespace for the Plugin or an object literal with an "fn" property
     * specifying the Plugin class and a "cfg" property specifying
     * the configuration for the Plugin.
     * <p>
     * Additionally an Array can also be passed in, with either String or 
     * Object literal elements, allowing for multiple plugin registration in 
     * a single call
     * </p>
     * @method plug
     * @chainable
     * @public
     */
    plug: function(p) {
        if (p) {
            if (L.isArray(p)) {
                var ln = p.length;
                for (var i = 0; i < ln; i++) {
                    this.plug(p[i]);
                }
            } else if (L.isFunction(p)) {
                this._plug(p);
            } else {
                this._plug(p.fn, p.cfg);
            }
        }
        return this;
    },

    /**
     * Unregister and destroy a plugin already instantiated with the Widget.
     * 
     * @method unplug
     * @param {String} ns The namespace key for the Plugin
     * @chain
     * @public
     */
    unplug: function(ns) {
        if (ns) {
            this._unplug(ns);
        } else {
            for (ns in this._plugins) {
                if (Y.Object.owns(this._plugins, ns)) {
                    this._unplug(ns);
                }
            }
        }
        return this;
    },

    /**
     * Determines if a plugin has been registered and instantiated 
     * for this widget.
     * 
     * @method hasPlugin
     * @public
     * @return {Boolean} returns true, if the plugin has been applied
     * to this widget.
     */
    hasPlugin : function(ns) {
        return (this._plugins[ns] && this[ns]);
    },

    /**
     * @private
     */

    _initPlugins: function(config) {

        // Class Configuration
        var classes = this._getClasses(), constructor;
        for (var i = 0; i < classes.length; i++) {
            constructor = classes[i];
            if (constructor.PLUGINS) {
                this.plug(constructor.PLUGINS);
            }
        }

        // User Configuration
        if (config && config.plugins) {
            this.plug(config.plugins);
        }
    },

    /**
     * @private
     */
    _destroyPlugins: function() {
        this._unplug();
    },

    /**
     * @private
     */
    _plug: function(PluginClass, config) {
        if (PluginClass && PluginClass.NS) {
            var ns = PluginClass.NS;

            config = config || {};
            config.owner = this;

            if (this.hasPlugin(ns)) {
                // Update config
                this[ns].setAtts(config);
            } else {
                // Create new instance
                this[ns] = new PluginClass(config);
                this._plugins[ns] = PluginClass;
            }
        }
    },

    /**
     * @private
     */
    _unplug : function(ns) {
        if (ns) {
            if (this[ns]) {
                this[ns].destroy();
                delete this[ns];
            }
            if (this._plugins[ns]) {
                delete this._plugins[ns];
            }
        }
    }
};

Y.PluginHost = PluginHost;