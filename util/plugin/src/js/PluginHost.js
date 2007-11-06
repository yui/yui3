(function() {

    YAHOO.namespace("plugin");
    
    function PluginHost() {}

    PluginHost.prototype = {

        initPlugins : function() {
            this.__.adaptors = [];

            /*
            for (var namespace in this.constructor.PLUGINS) {
                var pluginClass = this.constructor.PLUGINS[namespace];
                // TODO: How to apply config. Pass required params. Flush out by demo
                this[namespace] = new pluginClass();
            }

            for (var adaptorClass in this.constructor.ADAPTORS) {
                if (this.hasAdaptor(adaptorClass) === false) {
                    this.__.adaptorClass.push(adaptorClass);
                    // TODO: How to apply config. Flush out by demo
                    new adaptorClass(); 
                } else {
                    throw('adaptor class already applied');
                }
            }
            */
        },

        addPlugin: function(namespace, pluginClass, config) {
            if (this.hasPlugin(namespace)) {
                throw('plugin namespace' + namespace + ' already in use');
            }
            this[namespace] = new pluginClass(config);
        },

        applyAdaptor: function(adaptorClass, config) {
            if (this.hasAdaptor(adaptorClass)) {
                throw ('adaptor already applied'); // TODO: Get name?
            }
            this.__.adaptors.push(adaptorClass);
            new adaptorClass(config);
        },

        removePlugin : function(namespace, pluginClass) {
            if (this[namespace] instanceof pluginClass) {
                this[namespace].destroy();
                delete this[namespace];
            }
        },

        /*
        removeAdaptor : function(adaptor) {
            // TODO: If there's no namespace, does removing 
            // and adaptor mean anything? Are adaptors apply-only?
        }
        */

        hasPlugin: function(namespace/*, class? */) {
            return namespace in this;
        },

        hasAdaptor : function(class) {
            // TODO: optimize with Array methods if available.
            bApplied = false;
            for (var i = 0; i < this.__.adaptors.length; ++i) {
                if (this.__.adaptors[i] === class) {
                    bApplied = true;
                    break;
                }
            }
            return bApplied;
        }
    };

    YAHOO.plugin.PluginHost = PluginHost;
})();