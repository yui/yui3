(function() {

    YAHOO.namespace("plugin");
    
    function PluginHost() {}

    PluginHost.prototype = {

        addPlugin: function(pluginClass, config) {
            config = config || {};
            config.owner = this;

            // TODO - Default namespace: check without instantiation
            var plugin = new pluginClass(config);
            var name = plugin.get("name");
            
            if (this.hasPlugin(name)) {
                throw('plugin namespace' + name + ' already in use');
            }

            this[name] = plugin;
        },

        removePlugin : function(namespace, pluginClass) {
            if (this[namespace] instanceof pluginClass) {
                this[namespace].destroy();
                delete this[namespace];
            }
        },

        hasPlugin: function(namespace/*, pluginClass? */) {
            return namespace in this;
        }
    };

    YAHOO.plugin.PluginHost = PluginHost;
})();
