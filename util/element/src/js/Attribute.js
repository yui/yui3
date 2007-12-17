/**
 * Provides Attribute configurations.
 * @namespace YAHOO.util
 * @class Attribute
 * @constructor
 * @param hash {Object} The intial Attribute.
 * @param {YAHOO.util.AttributeProvider} The owner of the Attribute instance.
 */

YAHOO.util.Attribute = function(map, owner) {
    if (owner) { 
        this.owner = owner;
        this.configure(map, true);
    }
};

YAHOO.util.Attribute.prototype = {
    /**
     * The name of the attribute.
     * @property name
     * @type String
     */
    name: undefined,
    
    /**
     * The value of the attribute.
     * @property value
     * @type String
     */
    value: null,
    
    /**
     * The owner of the attribute.
     * @property owner
     * @type YAHOO.util.AttributeProvider
     */
    owner: null,
    
    /**
     * Whether or not the attribute is read only.
     * @property readOnly
     * @type Boolean
     */
    readOnly: false,
    
    /**
     * Whether or not the attribute can only be written once.
     * @property writeOnce
     * @type Boolean
     */
    writeOnce: false,

    /**
     * The attribute's initial configuration.
     * @private
     * @property _initialConfig
     * @type Object
     */
    _initialConfig: null,
    
    /**
     * Whether or not the attribute's value has been set.
     * @private
     * @property _written
     * @type Boolean
     */
    _written: false,
    
    /**
     * The method to use when setting the attribute's value.
     * The method recieves the new value as the only argument.
     * @property set
     * @type Function
     */
    set: null,
    
    /**
     * The method to use when getting the attribute's value.
     * The method recieves the new value as the only argument.
     * @property get
     * @type Function
     */
    get: null,

    /**
     * The validator to use when setting the attribute's value.
     * @property validator
     * @type Function
     * @return Boolean
     */
    validator: null,
    
    /**
     * Retrieves the current value of the attribute.
     * @method getValue
     * @return {any} The current value of the attribute.
     */
    getValue: function() {
        return this.get ? this.get.apply(this.owner, arguments) : this.value;
    },
    
    /**
     * Sets the value of the attribute and fires beforeChange and change events.
     * @method setValue
     * @param {Any} value The value to apply to the attribute.
     * @param {Boolean} silent If true the change events will not be fired.
     * @return {Boolean} Whether or not the value was set.
     */
    setValue: function(value, silent) {
        var beforeRetVal,
            retVal,
            owner = this.owner,
            name = this.name;
        
        var event = {
            type: name, 
            prevValue: this.getValue(),
            newValue: value
        };
        
        if (this.readOnly || ( this.writeOnce && this._written) ) {
            YAHOO.log( 'setValue ' + name + ', ' +  value +
                    ' failed: read only', 'error', 'Attribute');
            return false; // write not allowed
        }
        
        if (!silent) {
            beforeRetVal = owner.fireBeforeChangeEvent(event);
            if (beforeRetVal === false) { // TODO: event.preventDefault
                YAHOO.log('setValue ' + name + 
                        ' cancelled by beforeChange event', 'info', 'Attribute');
                return false;
            }
        }

        if (this.set) {
            retVal = this.set.call(owner, value);
        }
        
        if (this.validator && !this.validator.call(owner, value) ) {
            YAHOO.log( 'setValue ' + name + ', ' + value +
                    ' validation failed', 'error', 'Attribute');
            return false; // invalid value
        }

        this.value = (retVal === undefined) ? value : retVal;
        this._written = true;
        
        event.type = name;
        
        if (!silent) {
            this.owner.fireChangeEvent(event);
        }
        
        return true;
    },
    
    /**
     * Allows for configuring the Attribute's properties.
     * @method configure
     * @param {Object} map A key-value map of Attribute properties.
     * @param {} init Whether or not this should become the initial config.
     */
    configure: function(map, init) {
        map = map || {};
        this._written = false; // reset writeOnce
        var silent = !!init; // silent set if initializing

        //this._initialConfig = this._initialConfig || {};
        for (var key in map) {
            if ( key && YAHOO.lang.hasOwnProperty(map, key) ) {
                if (key == 'value') {
                    if (map.readOnly && init) { // initialize readOnly with direct set
                        this.value = map[key];
                    } else {
                        this.setValue(map.value, silent);
                    }
                } else {
                    this[key] = map[key];
                }
/* TODO: need initialConfig?

                if (init) {
                    this._initialConfig[key] = map[key];
                }
*/
            }
        }
    },
    
    /**
     * Resets the value to the initial config value.
     * @method resetValue
     * @return {Boolean} Whether or not the value was set.
     */
    resetValue: function() {
        return this.setValue(this._initialConfig.value);
    },
    
    /**
     * Resets the attribute config to the initial config state.
     * @method resetConfig
     */
    resetConfig: function() {
        this.configure(this._initialConfig);
    },
    
    /**
     * Resets the value to the current value.
     * Useful when values may have gotten out of sync with actual properties.
     * @method refresh
     * @return {Boolean} Whether or not the value was set.
     */
    refresh: function(silent) {
        this.setValue(this.value, silent);
    }
};

