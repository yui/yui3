/**
 * Provides the base Widget class along with an augmentable PluginHost interface
 *
 * @module widget
 */

/**
 * An augmentable class, which when added to a "Base" based class, allows 
 * the class to support Plugins, providing plug and unplug methods and performing
 * instantiation and cleanup during the init and destroy lifecycle phases respectively.
 *
 * @class PluginHost
 */

var L = Y.Lang;

function PluginHost(config) {
    this._plugins = {};

    this.after("init", function(e) {this._initPlugins(e.cfg);});
    this.after("destroy", this._destroyPlugins);
}

PluginHost.prototype = {

    /**
     * Register and instantiate a plugin with the Widget.
     * 
     * @method plug
     * @chainable
     * @param p {String | Object |Array} Accepts the registered 
     * namespace for the Plugin or an object literal with an "fn" property
     * specifying the Plugin class and a "cfg" property specifying
     * the configuration for the Plugin.
     * <p>
     * Additionally an Array can also be passed in, with either the above String or 
     * Object literal values, allowing for multiple plugin registration in 
     * a single call.
     * </p>
     */
    plug: function(p, config) {
        if (p) {
            if (L.isFunction(p)) {
                this._plug(p, config);
            } else if (L.isArray(p)) {
                for (var i = 0, ln = p.length; i < ln; i++) {
                    this.plug(p[i]);
                }
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
     * @param {String} ns The namespace key for the Plugin. If not provided,
     * all registered plugins are unplugged.
     * @chainable
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
     * Initializes static plugins registered on the host (the
     * "PLUGINS" static property) and any plugins passed in 
     * for the instance through the "plugins" configuration property.
     *
     * @method _initPlugins
     * @param {Config} the user configuration object for the host.
     * @private
     */
    _initPlugins: function(config) {

        // Class Configuration
        var classes = this._getClasses(), constructor, i;
        for (i = classes.length - 1; i >= 0; i--) {
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
     * Private method used to unplug and destroy all plugins on the host
     * @method _destroyPlugins
     * @private
     */
    _destroyPlugins: function() {
        this._unplug();
    },

    /**
     * Private method used to instantiate and attach plugins to the host
     * @method _plug
     * @param {Function} PluginClass The plugin class to instantiate
     * @param {Object} config The configuration object for the plugin
     * @private
     */
    _plug: function(PluginClass, config) {
        if (PluginClass && PluginClass.NS) {
            var ns = PluginClass.NS;

            config = config || {};
            config.owner = this;

            if (this.hasPlugin(ns)) {
                // Update config
                this[ns].setAttrs(config);
            } else {
                // Create new instance
                this[ns] = new PluginClass(config);
                this._plugins[ns] = PluginClass;
            }
        }
    },

    /**
     * Private method used to unregister and destroy a plugin already instantiated with the host.
     *
     * @method _unplug
     * @private
     * @param {String} ns The namespace key for the Plugin. If not provided,
     * all registered plugins are unplugged.
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
