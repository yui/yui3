(function() {
    var Lang = YAHOO.util.Lang;

    /*
    Copyright (c) 2006, Yahoo! Inc. All rights reserved.
    Code licensed under the BSD License:
    http://developer.yahoo.net/yui/license.txt
    */
    
    /**
     * Provides and manages YAHOO.util.Attribute instances
     * @namespace YAHOO.util
     * @class AttributeProvider
     * @uses YAHOO.util.EventProvider
     */
    YAHOO.util.AttributeProvider = function() {};

    YAHOO.util.AttributeProvider.prototype = {
        
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
                YAHOO.log(key + ' not found', 'warn', 'AttributeProvider');
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
                YAHOO.log('set failed: ' + key + ' not found',
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
                if ( Lang.hasOwnProperty(this._configs, key) && 
                        !Lang.isUndefined(config) ) {
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
                if ( Lang.hasOwnProperty(map, key) ) {
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
                if ( Lang.hasOwnProperty(config, key) ) {
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
                if ( YAHOO.lang.hasOwnProperty(configs, attr) ) {
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
        
        // wrapper for EventProvider.subscribe
        // to create events on the fly
        subscribe: function(type, callback) {
            this._events = this._events || {};

            if ( !(type in this._events) ) {
                this._events[type] = this.createEvent(type);
            }

            YAHOO.util.EventProvider.prototype.subscribe.apply(this, arguments);
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
            e.type = type;
            return this.fireEvent(type, e);
        },
        
        /**
         * Fires the attribute's change event. 
         * @method fireChangeEvent
         * @param {String} key The attribute's name.
         * @param {Obj} e The event object to pass to the handlers.
         */
        fireChangeEvent: function(e) {
            e.type += 'Change';
            return this.fireEvent(e.type, e);
        },

        createAttribute: function(name, map) {
            return new YAHOO.util.Attribute(name, map, this);
        }
    };
    
    YAHOO.augment(YAHOO.util.AttributeProvider, YAHOO.util.EventProvider);
})();

