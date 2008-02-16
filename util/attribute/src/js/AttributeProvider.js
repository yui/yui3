(function() {

    var M = function(Y) {

        /**
         * Provides and manages YUI.Attribute instances
         * @class AttributeProvider
         * @uses YUI.Event.Target
         */
         function AttributeProvider() {}

         AttributeProvider.prototype = {

            /**
             * A key-value map of Attribute configurations
             * @property _configs
             * @protected (may be used by subclasses and augmentors)
             * @private
             * @type {Object}
             */
            _configs: null,

            /**
             * Returns the current value of the attribute.
             * @method get
             * @param {String} key The attribute whose value will be returned.
             */
            get: function(key) {
                this._configs = this._configs || {};
                var config = this._configs[key];

                if (!config) {
                    Y.log(key + ' not found', 'warn', 'AttributeProvider');
                    return undefined;
                }

                return config.getValue();
            },

            /**
             * Sets the value of a config.
             * @method set
             * @param {String} key The name of the attribute
             * @param {Any} value The value to apply to the attribute
             * @param {Boolean} silent Whether or not to suppress change events
             * @return {Boolean} Whether or not the value was set.
             */
            set: function(key, value, silent) {
                this._configs = this._configs || {};
                var config = this._configs[key];
                if (!config) {
                    Y.log('set failed: ' + key + ' not found',
                            'error', 'AttributeProvider');
                    return false;
                }
                
                return config.setValue(value, silent);
            },

            /**
             * Returns an array of attribute names.
             * @method getAttributeKeys
             * @return {Array} An array of attribute names.
             */
            getAttributeKeys: function() {
                this._configs = this._configs;
                var keys = [];
                var config;
                for (var key in this._configs) {
                    config = this._configs[key];
                    if ( Y.object.owns(this._configs, key) && 
                            !Y.isUndefined(config) ) {
                        keys[keys.length] = key;
                    }
                }
                
                return keys;
            },

            /**
             * Sets multiple attribute values.
             * @method setAttributes
             * @param {Object} map  A key-value map of attributes
             * @param {Boolean} silent Whether or not to suppress change events
             */
            setAttributes: function(map, silent) {
                for (var key in map) {
                    if ( Y.object.owns(map, key) ) {
                        this.set(key, map[key], silent);
                    }
                }
            },

            /**
             * Resets the specified attribute's value to its initial value.
             * @method resetValue
             * @param {String} key The name of the attribute
             * @param {Boolean} silent Whether or not to suppress change events
             * @return {Boolean} Whether or not the value was set
             */
            resetValue: function(key, silent) {
                this._configs = this._configs || {};
                if (this._configs[key]) {
                    this.set(key, this._configs[key]._initialConfig.value, silent);
                    return true;
                }
                return false;
            },
        
            /**
             * Sets the attribute's value to its current value.
             * @method refresh
             * @param {Boolean} silent Whether or not to suppress change events
             */
            refresh: function(silent) {
                var keys = this.getAttributeKeys();
                
                for (var i = 0, len = keys.length; i < len; ++i) { 
                    this._configs[keys[i]].refresh(silent);
                }
            },
        
            /**
             * Returns the attribute's properties.
             * @method getAttributeConfig
             * @param {String} key The attribute's name
             * @private
             * @return {object} A key-value map containing all of the
             * attribute's properties.
             */
            getAttributeConfig: function(key) {
                this._configs = this._configs || {};
                var config = this._configs[key] || {};
                var map = {}; // returning a copy to prevent overrides
                
                for (key in config) {
                    if ( Y.object.owns(config, key) ) {
                        map[key] = config[key];
                    }
                }

                return map;
            },

            /**
             * Sets or updates an Attribute instance's properties. 
             * @method setAttributeConfig
             * @param {String} key The attribute's name.
             * @param {Object} map A key-value map of attribute properties
             * @param {Boolean} init Whether or not this should become the intial config.
             */
            setAttributeConfig: function(attr, map, init) {
                this._configs = this._configs || {};
                if (!this._configs[attr]) {
                    this._configs[attr] = this.createAttribute(attr, map);
                } else {
                    this._configs[attr].configure(map, init);
                }
            },

            /**
             * Sets or updates an array of Attribute instance's properties. 
             * @method setAttributeConfigs
             * @param {Array} configs An array of Attribute configs
             * @param {Boolean} init Whether or not this should become the intial config.
             */
            setAttributeConfigs: function(configs, init) {
                for (var attr in configs) {
                    if ( Y.object.owns(configs, attr) ) {
                        this.setAttributeConfig(attr, configs[attr], init);
                    }
                }
            },

            hasAttribute: function(prop) {
                return !! this._configs[prop];
            },

            /**
             * Resets an attribute to its intial configuration. 
             * @method resetAttributeConfig
             * @param {String} key The attribute's name.
             * @private
             */
            resetAttributeConfig: function(key) {
                this._configs = this._configs || {};
                this._configs[key].resetConfig();
            },

            // Wrapper for EventProvider.subscribe wrap type in name prefix
            subscribe: function(type, callback) {
                this._events = this._events || {};

                // Add "name" to type, ("menu:" + "click") when publishing
                type = this._prefixType(type);

                if ( !(type in this._events) ) {
                    this._events[type] = this.publish(type);
                }

                Y.Event.Target.prototype.subscribe.apply(this, arguments);
            },

            // wrapper for EventProvider.fire to wrap type in name prefix
            fire: function(type, args) {
                // Add "name" to type, ("menu:" + "click") when publishing
                arguments[0] = this._prefixType(arguments[0]);
                Y.Event.Target.prototype.fire.apply(this, arguments);
            },

            on: function() {
                this.subscribe.apply(this, arguments);
            },

            addListener: function() {
                this.subscribe.apply(this, arguments);
            },

            /**
             * Fires the attribute's beforeChange event. 
             * @method fireBeforeChangeEvent
             * @param {String} key The attribute's name.
             * @param {Obj} e The event object to pass to handlers.
             */
            fireBeforeChangeEvent: function(e) {
                var type = 'before';
                type += e.type.charAt(0).toUpperCase() + e.type.substr(1) + 'Change';
                e.type = this._prefixType(type);
                return this.fire(type, e);
            },

            /**
             * Fires the attribute's change event. 
             * @method fireChangeEvent
             * @param {String} key The attribute's name.
             * @param {Obj} e The event object to pass to the handlers.
             */
            fireChangeEvent: function(e) {
                e.type += 'Change';
                e.type = this._prefixType(e.type);
                return this.fire(e.type, e);
            },

            createAttribute: function(name, map) {
                return new Y.Attribute(name, map, this);
            },

            // TODO: Does this need to centralized in Y.Event.Target?
            _prefixType : function(type) {
                // TODO: If they pass in "calendar:click" to Menu. 
                // does this mean they are listening for bubble?
                if (type.indexOf(":") == -1) {
                   type = this.name + ":" + type;
                }
                return type;
            }
        };

        Y.augment(AttributeProvider, Y.Event.Target);
        Y.Attribute.Provider = AttributeProvider;
    };

    YUI.add("attributeprovider", M, "3.0.0");
})();