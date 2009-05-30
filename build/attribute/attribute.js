YUI.add('attribute', function(Y) {

    /**
     * Managed Attribute Provider
     * @module attribute
     */

    /**
     * Maintain state for a collection of items.  Individual properties 
     * are stored in hash tables.  This is instead of having state objects 
     * for each item in the collection.  For large collections, especially 
     * changing ones, this approach may perform better.
     * 
     * @constructor
     * @class State
     */
    Y.State = function() { 
        /**
         * Hash of attributes
         * @property data
         */
        this.data = {};
    };

    Y.State.prototype = {

        /**
         * Add an item with the property and value provided
         *
         * @method add
         * @param name {string} identifier for this attribute
         * @param key {string} property identifier
         * @param val {Any} property value
         */
        add : function(name, key, val) {
            var d = this.data;
            d[key] = d[key] || {};
            d[key][name] = val;
        },

        /**
         * Add an item with all of the properties in the supplied object.
         * 
         * @method addAll
         * @param name {string} identifier for this attribute
         * @param o hash of attributes
         */
        addAll: function(name, o) {
            var key;
            for (key in o) {
                if (o.hasOwnProperty(key)) {
                    this.add(name, key, o[key]);
                }
            }
        },

        /**
         * Remove the given key for a specific item
         *
         * @method remove
         * @param name {string} name of attribute
         * @param o {string} The key to delete.
         */
        remove: function(name, key) {
            var d = this.data;
            if (d[key] && (name in d[key])) {
                delete d[key][name];
            }
        },

        /**
         * Remove entire item, or optionally specified fields
         * 
         * @method removeAll
         * @param name {string} name of attribute
         * @param o {object|array} Collection of keys to delete. If not provided, entire item is removed.
         */
        removeAll: function(name, o) {
            var d = this.data;

            Y.each(o || d, function(v, k) {
                if(Y.Lang.isString(k)) {
                    this.remove(name, k);
                } else {
                    this.remove(name, v);
                }
            }, this);
        },

        /**
         * For a given item, returns the value of the attribute requested, or undefined if not found.
         *
         * @method get
         * @param name {string} name of attribute
         * @param key {string} optional The attribute value to retrieve.
         * @return The value of the supplied key.
         */
        get: function(name, key) {
            var d = this.data;
            return (d[key] && name in d[key]) ?  d[key][name] : undefined;
        },

        /**
         * For a given item, returns a disposable object with all attribute 
         * name/value pairs.
         *
         * @method getAll
         * @param name {string} name of attribute
         * @return An object withall data.
         */
        getAll : function(name) {
            var d = this.data, o;

            Y.each(d, function(v, k) {
                if (name in d[k]) {
                    o = o || {};
                    o[k] = v[name];
                }
            }, this);

            return o;
        }
    };

    /**
     * Managed Attribute Provider
     * @module attribute
     */

    var O = Y.Object,
        EventTarget = Y.EventTarget,

        DOT = ".",
        CHANGE = "Change",

        // Externally configurable props
        GETTER = "getter",
        SETTER = "setter",
        READ_ONLY = "readOnly",
        WRITE_ONCE = "writeOnce",
        VALIDATOR = "validator",
        VALUE = "value",
        VALUE_FN = "valueFn",
        BROADCAST = "broadcast",
        LAZY_ADD = "lazyAdd",

        // Used for internal state management
        ADDED = "added",
        INITIALIZING = "initializing",
        INIT_VALUE = "initValue",
        PUBLISHED = "published",
        DEF_VALUE = "defaultValue",
        LAZY = "lazy",
        IS_LAZY_ADD = "isLazyAdd",

        INVALID_VALUE,
        MODIFIABLE = {};

        // Properties which can be changed after the attribute has been added.
        MODIFIABLE[READ_ONLY] = 1;
        MODIFIABLE[WRITE_ONCE] = 1;
        MODIFIABLE[GETTER] = 1;
        MODIFIABLE[BROADCAST] = 1;

    /**
     * <p>
     * Attribute provides managed attribute support.
     * </p>
     * <p>
     * The class is designed to be augmented onto a host class,
     * and allows the host to support getter/setter methods for attributes,
     * initial configuration support and attribute change events.
     * </p>
     * <p>Attributes added to the host can:</p>
     * <ul>
     *     <li>Be defined as read-only.</li>
     *     <li>Be defined as write-once.</li>
     *     <li>Be defined with a setter function, used to manipulate
     *     values passed to Attribute's set method, before they are stored.</li>
     *     <li>Be defined with a validator function, to validate values before they are stored.</li>
     *     <li>Be defined with a getter function, which can be used to manipulate stored values,
     *     before they are returned by Attribute's get method.</li>
     * </ul>
     *
     * <p>See the <a href="#method_addAtt">addAttr</a> method, for details about how to add attributes with
     * a specific configuration</p>
     *
     * @class Attribute
     * @uses Event.Target
     */
    function Attribute() {

        // Perf tweak - avoid creating event literals if not required.
        this._ATTR_E_FACADE = {};

        EventTarget.call(this, {emitFacade:true});
        this._conf = new Y.State();
    }

    /**
     * The value to return from an attribute setter, in order to prevent the set from going through.
     *
     * @property Attribute.INVALID_VALUE
     * @type Object
     * @static
     */
    Attribute.INVALID_VALUE = {};
    INVALID_VALUE = Attribute.INVALID_VALUE;

    /**
     * The list of properties which can be configured for 
     * each attribute (e.g. setter, getter, writeOnce etc.)
     * 
     * @property Attribute._ATTR_CFG
     * @type Array
     * @static
     * @private
     */
    Attribute._ATTR_CFG = [SETTER, GETTER, VALIDATOR, VALUE, VALUE_FN, WRITE_ONCE, READ_ONLY, LAZY_ADD, BROADCAST];

    Attribute.prototype = {
        /**
         * <p>
         * Adds an attribute with the provided configuration to the host object. Intended
         * to be used by the host object to setup it's set of available attributes.
         * </p>
         * <p>
         * The config argument object literal supports the following optional properties:
         * </p>
         * <dl>
         *    <dt>value &#60;Any&#62;</dt>
         *    <dd>The initial value to set on the attribute</dd>
         *    <dt>readOnly &#60;Boolean&#62;</dt>
         *    <dd>Whether or not the attribute is read only. Attributes having readOnly set to true
         *        cannot be set by invoking the set method.</dd>
         *    <dt>writeOnce &#60;Boolean&#62;</dt>
         *    <dd>Whether or not the attribute is "write once". Attributes having writeOnce set to true, 
         *        can only have their values set once, be it through the default configuration, 
         *        constructor configuration arguments, or by invoking set.</dd>
         *    <dt>setter &#60;Function&#62;</dt>
         *    <dd>The setter function to be invoked (within the context of the host object) before 
         *        the attribute is stored by a call to the setter method. The value returned by the 
         *        setter function will be the finally stored value.</dd>
         *    <dt>getter &#60;Function&#62;</dt>
         *    <dd>The getter function to be invoked (within the context of the host object) before
         *    the stored values is returned to a user invoking the getter method for the attribute.
         *    The value returned by the getter function is the final value which will be returned to the 
         *    user when they invoke get.</dd>
         *    <dt>validator &#60;Function&#62;</dt>
         *    <dd>The validator function which is invoked prior to setting the stored value. Returning
         *    false from the validator function will prevent the value from being stored</dd>
         * </dl>
         *
         * @method addAttr
         *
         * @param {String} name The attribute key
         * @param {Object} config (optional) An object literal specifying the configuration for the attribute.
         * <strong>NOTE:</strong> The config object is modified when adding an attribute, 
         * so if you need to protect the original values, you will need to merge or clone the object.
         *
         * @chainable
         */
        addAttr: function(name, config, lazy) {

            var conf = this._conf;

            lazy = (LAZY_ADD in config) ? config[LAZY_ADD] : lazy;

            if (lazy && !this.attrAdded(name)) {

                conf.add(name, LAZY, config || {});
                conf.add(name, ADDED, true);
            } else {


                if (!this.attrAdded(name) || conf.get(name, IS_LAZY_ADD)) {

                    config = config || {};

                    var value, hasValue = (VALUE in config);

                    if(hasValue) {
                        // We'll go through set, don't want to set value in _conf directory
                        value = config.value;
                        delete config.value;
                    }

                    config.added = true;
                    config.initializing = true;

                    conf.addAll(name, config);

                    if (hasValue) {
                        // Go through set, so that raw values get normalized/validated
                        this.set(name, value);
                    }

                    conf.remove(name, INITIALIZING);
                }
            }

            return this;
        },

        /**
         * Tests if the given attribute has been added to the host
         *
         * @method attrAdded
         * @param {String} name The name of the attribute to check.
         * @return boolean, true if an attribute with the given name has been added.
         */
        attrAdded: function(name) {
            return !!this._conf.get(name, ADDED);
        },

        /**
         * Updates the configuration of an attribute which has already been added.
         * <p>
         * The properties which can be modified through this interface are limited
         * to the following subset of attributes which can be safely modified
         * after a value has been set on the attribute: readOnly, writeOnce, broadcast and 
         * getter.
         * </p>
         * @method modifyAttr
         * @param {String} name The name of the attribute whose configuration is to be updated.
         * @param {Object} config An object literal with the updated configuration properties.
         */
        modifyAttr: function(name, config) {
            if (this.attrAdded(name)) {

                if (this._isLazyAttr(name)) {
                    this._addLazyAttr(name);
                }

                var prop, conf = this._conf;
                for (prop in config) {
                    if (MODIFIABLE[prop] && config.hasOwnProperty(prop)) {
                        conf.add(name, prop, config[prop]);

                        // If we reconfigured broadcast, need to republish
                        if (prop === BROADCAST) {
                            conf.remove(name, PUBLISHED);
                        }
                    }
                }
            }

        },

        /**
         * Removes an attribute.
         *
         * @method removeAttr
         * @param {String} name The attribute key
         */
        removeAttr: function(name) {
            this._conf.removeAll(name);
        },

        /**
         * Returns the current value of the attribute. If the attribute
         * has been configured with a 'getter' function, this method will delegate
         * to the 'getter' to obtain the value of the attribute.
         * The 'getter' will be passed the current value of the attribute 
         * as the only argument.
         *
         * @method get
         *
         * @param {String} name The attribute whose value will be returned. If
         * the value of the attribute is an Object, dot notation can be used to
         * obtain the value of a property of the object (e.g. <code>get("x.y.z")</code>)
         * 
         * @return {Any} The current value of the attribute
         */
        get : function(name) {

            var fullName = name,
                conf = this._conf,
                path,
                getter,
                val;

            if (name.indexOf(DOT) !== -1) {
                path = name.split(DOT);
                name = path.shift();
            }

            // On Demand - Should be rare - handles out of order valueFn references
            if (this._tCfgs && this._tCfgs[name]) {
                var cfg = {};
                cfg[name] = this._tCfgs[name];
                delete this._tCfgs[name];
                this._addAttrs(cfg, this._tVals);
            }

            // Lazy Init
            if (this._isLazyAttr(name)) {
                this._addLazyAttr(name);
            }

            val = conf.get(name, VALUE);
            getter = conf.get(name, GETTER);

            val = (getter) ? getter.call(this, val, fullName) : val;
            val = (path) ? O.getValue(val, path) : val;

            return val;
        },

        /**
         * @method _isLazyAttr
         * @private
         * @param {Object} name
         */
        _isLazyAttr: function(name) {
            return this._conf.get(name, LAZY);
        },

        /**
         * @method _addLazyAttr
         * @private
         * @param {Object} name
         */
        _addLazyAttr: function(name) {
            var conf = this._conf;
            var lazyCfg = conf.get(name, LAZY);
            conf.add(name, IS_LAZY_ADD, true);
            conf.remove(name, LAZY);
            this.addAttr(name, lazyCfg);
        },

        /**
         * Sets the value of an attribute.
         *
         * @method set
         * @chainable
         *
         * @param {String} name The name of the attribute. Note, if the 
         * value of the attribute is an Object, dot notation can be used
         * to set the value of a property within the object (e.g. <code>set("x.y.z", 5)</code>).
         *
         * @param {Any} value The value to apply to the attribute
         *
         * @param {Object} opts Optional event data. This object will be mixed into
         * the event facade passed as the first argument to subscribers 
         * of attribute change events
         *
         * @return {Object} Reference to the host object
         */
        set : function(name, val, opts) {
            return this._setAttr(name, val, opts);
        },

        /**
         * Resets the given attribute or all attributes to the initial value, if the attribute
         * is not readOnly, or writeOnce.
         *
         * @method reset
         * @param {String} name optional An attribute to reset.  If omitted, all attributes are reset.
         * @chainable
         */
        reset : function(name) {
            if (name) {
                if (this._isLazyAttr(name)) {
                    this._addLazyAttr(name);
                }
                this.set(name, this._conf.get(name, INIT_VALUE));
            } else {
                var added = this._conf.data.added;
                Y.each(added, function(v, n) {
                    this.reset(n);
                }, this);
            }
            return this;
        },

        /**
         * Allows setting of readOnly/writeOnce attributes.
         *
         * @method _set
         * @protected
         * @chainable
         *
         * @return {Object} Reference to the host object
         */
        _set : function(name, val, opts) {
            return this._setAttr(name, val, opts, true);
        },

        /**
         * Internal set implementation
         *
         * @method _setAttr
         * @protected
         * @chainable
         *
         * @param {String} name The name of the attribute. Note, if the 
         * value of the attribute is an Object, dot notation can be used
         * to set the value of a property within the object 
         * (e.g. <code>set("x.y.z", 5)</code>).
         *
         * @param {Any} value The value to apply to the attribute
         * 
         * @param {Object} opts Optional event data. This object will be mixed into
         * the event facade passed as the first argument to subscribers 
         * of attribute change events
         *
         * @param {boolean} force If true, allows the caller to set values for 
         * readOnly or writeOnce attributes which have already been set.
         *
         * @return {Object} Reference to the host object
         */
        _setAttr : function(name, val, opts, force) {
            var allowSet = true,
                conf = this._conf,
                data = conf.data,
                initialSet,
                strPath,
                path,
                currVal;

            if (name.indexOf(DOT) !== -1) {
                strPath = name;
                path = name.split(DOT);
                name = path.shift();
            }

            if (this._isLazyAttr(name)) {
                this._addLazyAttr(name);
            }

            initialSet = (!data.value || !(name in data.value));

            if (!this.attrAdded(name)) {
            } else {

                if (!initialSet && !force) {

                    if (conf.get(name, WRITE_ONCE)) {
                        allowSet = false;
                    }

                    if (conf.get(name, READ_ONLY)) {
                        allowSet = false;
                    }
                }

                if (allowSet) {
                    currVal = this.get(name);

                    if (path) {
                       val = O.setValue(Y.clone(currVal), path, val);

                       if (val === undefined) {
                           allowSet = false;
                       }
                    }

                    if (allowSet) {
                        if (conf.get(name, INITIALIZING)) {
                            this._setAttrVal(name, strPath, currVal, val);
                        } else {
                            this._fireAttrChange(name, strPath, currVal, val, opts);
                        }
                    }
                }
            }

            return this;
        },

        /**
         * Utility method to help setup the event payload and 
         * fire the attribute change event.
         * 
         * @method _fireAttrChange
         * @private
         * @param {String} attrName The name of the attribute
         * @param {String} subAttrName The full path of the property being changed, 
         * if this is a sub-attribute value being change. Otherwise null.
         * @param {Any} currVal The current value of the attribute
         * @param {Any} newVal The new value of the attribute
         * @param {Object} opts Any additional event data to mix into the attribute change event's event facade.
         */
        _fireAttrChange : function(attrName, subAttrName, currVal, newVal, opts) {
            var eventName = attrName + CHANGE,
                conf = this._conf,
                facade;

            if (!conf.get(attrName, PUBLISHED)) {
                this.publish(eventName, {
                    queuable:false, 
                    defaultFn:this._defAttrChangeFn, 
                    silent:true,
                    broadcast : conf.get(attrName, BROADCAST)
                });
                conf.add(attrName, PUBLISHED, true);
            }

            facade = (opts) ? Y.merge(opts) : this._ATTR_E_FACADE;

            facade.type = eventName;
            facade.attrName = attrName;
            facade.subAttrName = subAttrName;
            facade.prevVal = currVal;
            facade.newVal = newVal;

            this.fire(facade);
        },

        /**
         * Default handler implementation for Attribute change events
         *
         * @private
         * @method _defAttrChangeFn
         * @param {Event.Facade} e The event object for the custom event
         */
        _defAttrChangeFn : function(e) {
            if (!this._setAttrVal(e.attrName, e.subAttrName, e.prevVal, e.newVal)) {
                // Prevent "after" listeners from being invoked since nothing changed.
                e.stopImmediatePropagation();
            } else {
                e.newVal = this._conf.get(e.attrName, VALUE);
            }
        },

        /**
         * Updates the stored value of the attribute in the privately held State object,
         * if validation and setter passes.
         *
         * @method _setAttrVal
         * @private
         * @param {String} attrName The attribute name.
         * @param {String} subAttrName The sub-attribute name, if setting a sub-attribute property ("x.y.z").
         * @param {Any} prevVal The currently stored value of the attribute.
         * @param {Any} newVal The value which is going to be stored.
         * 
         * @return {booolean} true if the new attribute value was stored, false if not.
         */
        _setAttrVal : function(attrName, subAttrName, prevVal, newVal) {

            var allowSet = true,
                conf = this._conf,

                validator  = conf.get(attrName, VALIDATOR),
                setter = conf.get(attrName, SETTER),
                initializing = conf.get(attrName, INITIALIZING),

                name = subAttrName || attrName,
                retVal;

            if (validator) {
                var valid = validator.call(this, newVal, name);

                if (!valid && initializing) {
                    newVal = conf.get(attrName, DEF_VALUE);
                    valid = true; // Assume it's valid, for perf.
                }
            }

            if (!validator || valid) {
                if (setter) {
                    retVal = setter.call(this, newVal, name);

                    if (retVal === INVALID_VALUE) {
                        allowSet = false;
                    } else if (retVal !== undefined){
                        newVal = retVal;
                    }
                }

                if (allowSet) {
                    if(!subAttrName && newVal === prevVal) {
                        allowSet = false;
                    } else {
                        // Store value
                        if (conf.get(attrName, INIT_VALUE) === undefined) {
                            conf.add(attrName, INIT_VALUE, newVal);
                        }
                        conf.add(attrName, VALUE, newVal);
                    }
                }

            } else {
                allowSet = false;
            }

            return allowSet;
        },

        /**
         * Sets multiple attribute values.
         *
         * @method setAttrs
         * @param {Object} attrs  A hash of attributes: name/value pairs
         * @chainable
         */
        setAttrs : function(attrs) {
            for (var attr in attrs) {
                if ( attrs.hasOwnProperty(attr) ) {
                    this.set(attr, attrs[attr]);
                }
            }
            return this;
        },

        /**
         * Gets multiple attribute values.
         *
         * @method getAttrs
         * @param {Array | Boolean} attrs Optional. An array of attribute names, whose values are required. If omitted, all attribute values are
         * returned. If set to true, all attributes modified from their original values are returned.
         * @return {Object} A hash of attributes: name/value pairs
         */
        getAttrs : function(attrs) {
            var o = {}, i, l, attr, val,
                modifiedOnly = (attrs === true);

            attrs = (attrs && !modifiedOnly) ? attrs : O.keys(this._conf.data.added);

            for (i = 0, l = attrs.length; i < l; i++) {
                // Go through get, to honor cloning/normalization
                attr = attrs[i];
                val = this.get(attr);

                if (!modifiedOnly || this._conf.get(attr, VALUE) != this._conf.get(attr, INIT_VALUE)) {
                    o[attr] = this.get(attr); 
                }
            }

            return o;
        },

        /**
         * Configures attributes, and sets initial values. This method does not 
         * isolate the configuration object by merging/cloning.
         *
         * The caller is responsible for merging/cloning the configuration object if required.
         *
         * @method addAttrs
         * @chainable
         *
         * @param {Object} cfgs Name/value hash of attribute configuration literals.
         * @param {Object} values Name/value hash of initial values to apply. Values defined in the configuration hash will be over-written by the initial values hash unless read-only.
         * @param {boolean} lazy Whether or not to delay the intialization of this attribute until the first call to get/set.
         */
        addAttrs : function(cfgs, values, lazy) {
            if (cfgs) {
                this._tCfgs = cfgs;
                this._tVals = this._splitAttrVals(values);

                this._addAttrs(cfgs, this._tVals, lazy);

                this._tCfgs = this._tVals = null;
            }

            return this;
        },

        /**
         * @method _addAttrs
         * @private
         * @param {Object} cfgs Name/value hash of attribute configuration literals.
         * @param {Object} values Name/value hash of initial values to apply. Values defined in the configuration hash will be over-written by the initial values hash unless read-only.
         * @param {boolean} lazy Whether or not to delay the intialization of this attribute until the first call to get/set.
         */
        _addAttrs : function(cfgs, values, lazy) {
            var attr,
                attrCfg,
                value;

            for (attr in cfgs) {
                if (cfgs.hasOwnProperty(attr)) {

                    // Not Merging. Caller is responsible for isolating configs
                    attrCfg = cfgs[attr];
                    attrCfg.defaultValue = attrCfg.value;

                    // Handle simple, complex and user values, accounting for read-only
                    value = this._getAttrInitVal(attr, attrCfg, this._tVals);

                    if (value !== undefined) {
                        attrCfg.value = value;
                    }

                    if (this._tCfgs[attr]) {
                        delete this._tCfgs[attr];
                    }

                    this.addAttr(attr, attrCfg, lazy);
                }
            }
        },

        /**
         * Utility to split out regular attribute values
         * from complex attribute values, so that complex
         * attributes can be keyed by top level attribute name.
         *
         * @method _splitAttrVals
         * @param {Object} valueHash Name/value hash of initial values
         *
         * @return {Object} Object literal with 2 properties - "simple" and "complex",
         * containing simple and complex attribute values respectively keyed 
         * by attribute the top level attribute name, or null, if valueHash is falsey.
         * @protected
         */
        _splitAttrVals : function(valueHash) {
            var vals = {},
                subvals = {},
                path,
                attr,
                v, k;

            if (valueHash) {
                for (k in valueHash) {
                    if (valueHash.hasOwnProperty(k)) {
                        if (k.indexOf(DOT) !== -1) {
                            path = k.split(DOT);
                            attr = path.shift();
                            v = subvals[attr] = subvals[attr] || [];
                            v[v.length] = {
                                path : path, 
                                value: valueHash[k]
                            };
                        } else {
                            vals[k] = valueHash[k];
                        }
                    }
                }
                return { simple:vals, complex:subvals };
            } else {
                return null;
            }
        },

        /**
         * Returns the initial value of the given attribute from
         * either the default configuration provided, or the 
         * over-ridden value if it exists in the initValues 
         * hash provided, if the attribute is not read-only.
         *
         * @param {String} attr Attribute name
         * @param {Object} cfg Default attribute configuration object literal
         * @param {Object} initValues Name/Value hash of initial attribute values from _splitAttrVals
         *
         * @return {Any} Initial value of the attribute.
         *
         * @method _getAttrInitVal
         * @private
         */
        _getAttrInitVal : function(attr, cfg, initValues) {

            var val = (cfg.valueFn) ? cfg.valueFn.call(this) : cfg.value,
                simple,
                complex,
                i,
                l,
                path,
                subval,
                subvals;

            if (!cfg.readOnly && initValues) {


                // Simple Attributes
                simple = initValues.simple;
                if (simple && simple.hasOwnProperty(attr)) {
                    val = simple[attr];
                }

                // Complex Attributes (complex values applied, after simple, incase both are set)
                complex = initValues.complex;
                if (complex && complex.hasOwnProperty(attr)) {
                    subvals = complex[attr];
                    for (i = 0, l = subvals.length; i < l; ++i) {
                        path = subvals[i].path;
                        subval = subvals[i].value;
                        O.setValue(val, path, subval);
                    }
                }
            }


            return val;
        }
    };

    // Basic prototype augment - no lazy constructor invocation.
    Y.mix(Attribute, EventTarget, false, null, 1);

    Y.Attribute = Attribute;



}, '@VERSION@' ,{requires:['event-custom']});
