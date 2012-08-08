if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/build/attribute-core/attribute-core.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/attribute-core/attribute-core.js",
    code: []
};
_yuitest_coverage["/build/attribute-core/attribute-core.js"].code=["YUI.add('attribute-core', function(Y) {","","    /**","     * The State class maintains state for a collection of named items, with ","     * a varying number of properties defined.","     *","     * It avoids the need to create a separate class for the item, and separate instances ","     * of these classes for each item, by storing the state in a 2 level hash table, ","     * improving performance when the number of items is likely to be large.","     *","     * @constructor","     * @class State","     */","    Y.State = function() {","        /**","         * Hash of attributes","         * @property data","         */","        this.data = {};","    };","","    Y.State.prototype = {","","        /**","         * Adds a property to an item.","         *","         * @method add","         * @param name {String} The name of the item.","         * @param key {String} The name of the property.","         * @param val {Any} The value of the property.","         */","        add : function(name, key, val) {","            var d = this.data;","            d[name] = d[name] || {};","            d[name][key] = val;","        },","","        /**","         * Adds multiple properties to an item.","         *","         * @method addAll","         * @param name {String} The name of the item.","         * @param o {Object} A hash of property/value pairs.","         */","        addAll: function(name, o) {","            var key;","","            for (key in o) {","                if (o.hasOwnProperty(key)) {","                    this.add(name, key, o[key]);","                }","            }","        },","","        /**","         * Removes a property from an item.","         *","         * @method remove","         * @param name {String} The name of the item.","         * @param key {String} The property to remove.","         */","        remove: function(name, key) {","            var d = this.data;","            if (d[name]) {","                delete d[name][key];","            }","        },","","        /**","         * Removes multiple properties from an item, or remove the item completely.","         *","         * @method removeAll","         * @param name {String} The name of the item.","         * @param o {Object|Array} Collection of properties to delete. If not provided, the entire item is removed.","         */","        removeAll: function(name, o) {","            var d = this.data;","","            if (!o) {","                if (d[name]) {","                    delete d[name];","                }","            } else {","                Y.each(o, function(v, k) {","                    if(Y.Lang.isString(k)) {","                        this.remove(name, k);","                    } else {","                        this.remove(name, v);","                    }","                }, this);","            }","        },","","        /**","         * For a given item, returns the value of the property requested, or undefined if not found.","         *","         * @method get","         * @param name {String} The name of the item","         * @param key {String} Optional. The property value to retrieve.","         * @return {Any} The value of the supplied property.","         */","        get: function(name, key) {","            var d = this.data;","            return (d[name]) ? d[name][key] : undefined;","        },","","        /**","         * For the given item, returns an object with all of the","         * item's property/value pairs. By default the object returned","         * is a shallow copy of the stored data, but passing in true","         * as the second parameter will return a reference to the stored","         * data.","         *","         * @method getAll","         * @param name {String} The name of the item","         * @param reference {boolean} true, if you want a reference to the stored","         * object ","         * @return {Object} An object with property/value pairs for the item.","         */","        getAll : function(name, reference) {","            var d = this.data, o;","","            if (!reference) {","                Y.each(d[name], function(v, k) {","                        o = o || {};","                        o[k] = v;","                });","            } else {","                o = d[name];","            }","","            return o;","        }","    };","    /**","     * The attribute module provides an augmentable Attribute implementation, which ","     * adds configurable attributes and attribute change events to the class being ","     * augmented. It also provides a State class, which is used internally by Attribute,","     * but can also be used independently to provide a name/property/value data structure to","     * store state.","     *","     * @module attribute","     */","","    /**","     * The attribute-core submodule provides the lightest level of attribute handling support ","     * without Attribute change events, or lesser used methods such as reset(), modifyAttrs(),","     * and removeAttr().","     *","     * @module attribute","     * @submodule attribute-core","     */","    var O = Y.Object,","        Lang = Y.Lang,","","        DOT = \".\",","","        // Externally configurable props","        GETTER = \"getter\",","        SETTER = \"setter\",","        READ_ONLY = \"readOnly\",","        WRITE_ONCE = \"writeOnce\",","        INIT_ONLY = \"initOnly\",","        VALIDATOR = \"validator\",","        VALUE = \"value\",","        VALUE_FN = \"valueFn\",","        LAZY_ADD = \"lazyAdd\",","","        // Used for internal state management","        ADDED = \"added\",","        BYPASS_PROXY = \"_bypassProxy\",","        INITIALIZING = \"initializing\",","        INIT_VALUE = \"initValue\",","        LAZY = \"lazy\",","        IS_LAZY_ADD = \"isLazyAdd\",","","        INVALID_VALUE;","","    /**","     * <p>","     * AttributeCore provides the lightest level of configurable attribute support. It is designed to be ","     * augmented on to a host class, and provides the host with the ability to configure ","     * attributes to store and retrieve state, <strong>but without support for attribute change events</strong>.","     * </p>","     * <p>For example, attributes added to the host can be configured:</p>","     * <ul>","     *     <li>As read only.</li>","     *     <li>As write once.</li>","     *     <li>With a setter function, which can be used to manipulate","     *     values passed to Attribute's <a href=\"#method_set\">set</a> method, before they are stored.</li>","     *     <li>With a getter function, which can be used to manipulate stored values,","     *     before they are returned by Attribute's <a href=\"#method_get\">get</a> method.</li>","     *     <li>With a validator function, to validate values before they are stored.</li>","     * </ul>","     *","     * <p>See the <a href=\"#method_addAttr\">addAttr</a> method, for the complete set of configuration","     * options available for attributes.</p>","     * ","     * <p>Object/Classes based on AttributeCore can augment <a href=\"AttributeEvents.html\">AttributeEvents</a> ","     * (with true for overwrite) and <a href=\"AttributeExtras.html\">AttributeExtras</a> to add attribute event and ","     * additional, less commonly used attribute methods, such as `modifyAttr`, `removeAttr` and `reset`.</p>   ","     *","     * @class AttributeCore","     * @param attrs {Object} The attributes to add during construction (passed through to <a href=\"#method_addAttrs\">addAttrs</a>). These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.","     * @param values {Object} The initial attribute values to apply (passed through to <a href=\"#method_addAttrs\">addAttrs</a>). These are not merged/cloned. The caller is responsible for isolating user provided values if required.","     * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","     */","    function AttributeCore(attrs, values, lazy) {","        this._initAttrHost(attrs, values, lazy);            ","    }","","    /**","     * <p>The value to return from an attribute setter in order to prevent the set from going through.</p>","     *","     * <p>You can return this value from your setter if you wish to combine validator and setter ","     * functionality into a single setter function, which either returns the massaged value to be stored or ","     * AttributeCore.INVALID_VALUE to prevent invalid values from being stored.</p>","     *","     * @property INVALID_VALUE","     * @type Object","     * @static","     * @final","     */","    AttributeCore.INVALID_VALUE = {};","    INVALID_VALUE = AttributeCore.INVALID_VALUE;","","    /**","     * The list of properties which can be configured for ","     * each attribute (e.g. setter, getter, writeOnce etc.).","     *","     * This property is used internally as a whitelist for faster","     * Y.mix operations.","     *","     * @property _ATTR_CFG","     * @type Array","     * @static","     * @protected","     */","    AttributeCore._ATTR_CFG = [SETTER, GETTER, VALIDATOR, VALUE, VALUE_FN, WRITE_ONCE, READ_ONLY, LAZY_ADD, BYPASS_PROXY];","","    AttributeCore.prototype = {","","        /**","         * Constructor logic for attributes. Initializes the host state, and sets up the inital attributes passed to the ","         * constructor.","         *","         * @method _initAttrHost","         * @param attrs {Object} The attributes to add during construction (passed through to <a href=\"#method_addAttrs\">addAttrs</a>). These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.","         * @param values {Object} The initial attribute values to apply (passed through to <a href=\"#method_addAttrs\">addAttrs</a>). These are not merged/cloned. The caller is responsible for isolating user provided values if required.","         * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","         * @private","         */","        _initAttrHost : function(attrs, values, lazy) {","            this._state = new Y.State();","            this._initAttrs(attrs, values, lazy);","        },","","        /**","         * <p>","         * Adds an attribute with the provided configuration to the host object.","         * </p>","         * <p>","         * The config argument object supports the following properties:","         * </p>","         * ","         * <dl>","         *    <dt>value &#60;Any&#62;</dt>","         *    <dd>The initial value to set on the attribute</dd>","         *","         *    <dt>valueFn &#60;Function | String&#62;</dt>","         *    <dd>","         *    <p>A function, which will return the initial value to set on the attribute. This is useful","         *    for cases where the attribute configuration is defined statically, but needs to ","         *    reference the host instance (\"this\") to obtain an initial value. If both the value and valueFn properties are defined, ","         *    the value returned by the valueFn has precedence over the value property, unless it returns undefined, in which ","         *    case the value property is used.</p>","         *","         *    <p>valueFn can also be set to a string, representing the name of the instance method to be used to retrieve the value.</p>","         *    </dd>","         *","         *    <dt>readOnly &#60;boolean&#62;</dt>","         *    <dd>Whether or not the attribute is read only. Attributes having readOnly set to true","         *        cannot be modified by invoking the set method.</dd>","         *","         *    <dt>writeOnce &#60;boolean&#62; or &#60;string&#62;</dt>","         *    <dd>","         *        Whether or not the attribute is \"write once\". Attributes having writeOnce set to true, ","         *        can only have their values set once, be it through the default configuration, ","         *        constructor configuration arguments, or by invoking set.","         *        <p>The writeOnce attribute can also be set to the string \"initOnly\", in which case the attribute can only be set during initialization","         *        (when used with Base, this means it can only be set during construction)</p>","         *    </dd>","         *","         *    <dt>setter &#60;Function | String&#62;</dt>","         *    <dd>","         *    <p>The setter function used to massage or normalize the value passed to the set method for the attribute. ","         *    The value returned by the setter will be the final stored value. Returning","         *    <a href=\"#property_Attribute.INVALID_VALUE\">Attribute.INVALID_VALUE</a>, from the setter will prevent","         *    the value from being stored.","         *    </p>","         *    ","         *    <p>setter can also be set to a string, representing the name of the instance method to be used as the setter function.</p>","         *    </dd>","         *      ","         *    <dt>getter &#60;Function | String&#62;</dt>","         *    <dd>","         *    <p>","         *    The getter function used to massage or normalize the value returned by the get method for the attribute.","         *    The value returned by the getter function is the value which will be returned to the user when they ","         *    invoke get.","         *    </p>","         *","         *    <p>getter can also be set to a string, representing the name of the instance method to be used as the getter function.</p>","         *    </dd>","         *","         *    <dt>validator &#60;Function | String&#62;</dt>","         *    <dd>","         *    <p>","         *    The validator function invoked prior to setting the stored value. Returning","         *    false from the validator function will prevent the value from being stored.","         *    </p>","         *    ","         *    <p>validator can also be set to a string, representing the name of the instance method to be used as the validator function.</p>","         *    </dd>","         *","         *    <dt>lazyAdd &#60;boolean&#62;</dt>","         *    <dd>Whether or not to delay initialization of the attribute until the first call to get/set it. ","         *    This flag can be used to over-ride lazy initialization on a per attribute basis, when adding multiple attributes through ","         *    the <a href=\"#method_addAttrs\">addAttrs</a> method.</dd>","         *","         * </dl>","         *","         * <p>The setter, getter and validator are invoked with the value and name passed in as the first and second arguments, and with","         * the context (\"this\") set to the host object.</p>","         *","         * <p>Configuration properties outside of the list mentioned above are considered private properties used internally by attribute, ","         * and are not intended for public use.</p>","         * ","         * @method addAttr","         *","         * @param {String} name The name of the attribute.","         * @param {Object} config An object with attribute configuration property/value pairs, specifying the configuration for the attribute.","         *","         * <p>","         * <strong>NOTE:</strong> The configuration object is modified when adding an attribute, so if you need ","         * to protect the original values, you will need to merge the object.","         * </p>","         *","         * @param {boolean} lazy (optional) Whether or not to add this attribute lazily (on the first call to get/set). ","         *","         * @return {Object} A reference to the host object.","         *","         * @chainable","         */","        addAttr: function(name, config, lazy) {","","","            var host = this, // help compression","                state = host._state,","                value,","                hasValue;","","            config = config || {};","","            lazy = (LAZY_ADD in config) ? config[LAZY_ADD] : lazy;","","            if (lazy && !host.attrAdded(name)) {","                state.addAll(name, {","                    lazy : config,","                    added : true","                });","            } else {","","","                if (!host.attrAdded(name) || state.get(name, IS_LAZY_ADD)) {","","                    hasValue = (VALUE in config);","","","                    if (hasValue) {","                        // We'll go through set, don't want to set value in config directly","                        value = config.value;","                        delete config.value;","                    }","","                    config.added = true;","                    config.initializing = true;","","                    state.addAll(name, config);","","                    if (hasValue) {","                        // Go through set, so that raw values get normalized/validated","                        host.set(name, value);","                    }","","                    state.remove(name, INITIALIZING);","                }","            }","","            return host;","        },","","        /**","         * Checks if the given attribute has been added to the host","         *","         * @method attrAdded","         * @param {String} name The name of the attribute to check.","         * @return {boolean} true if an attribute with the given name has been added, false if it hasn't. This method will return true for lazily added attributes.","         */","        attrAdded: function(name) {","            return !!this._state.get(name, ADDED);","        },","","        /**","         * Returns the current value of the attribute. If the attribute","         * has been configured with a 'getter' function, this method will delegate","         * to the 'getter' to obtain the value of the attribute.","         *","         * @method get","         *","         * @param {String} name The name of the attribute. If the value of the attribute is an Object, ","         * dot notation can be used to obtain the value of a property of the object (e.g. <code>get(\"x.y.z\")</code>)","         *","         * @return {Any} The value of the attribute","         */","        get : function(name) {","            return this._getAttr(name);","        },","","        /**","         * Checks whether or not the attribute is one which has been","         * added lazily and still requires initialization.","         *","         * @method _isLazyAttr","         * @private","         * @param {String} name The name of the attribute","         * @return {boolean} true if it's a lazily added attribute, false otherwise.","         */","        _isLazyAttr: function(name) {","            return this._state.get(name, LAZY);","        },","","        /**","         * Finishes initializing an attribute which has been lazily added.","         *","         * @method _addLazyAttr","         * @private","         * @param {Object} name The name of the attribute","         */","        _addLazyAttr: function(name, cfg) {","            var state = this._state,","                lazyCfg = state.get(name, LAZY);","","            state.add(name, IS_LAZY_ADD, true);","            state.remove(name, LAZY);","            this.addAttr(name, lazyCfg);","        },","","        /**","         * Sets the value of an attribute.","         *","         * @method set","         * @chainable","         *","         * @param {String} name The name of the attribute. If the ","         * current value of the attribute is an Object, dot notation can be used","         * to set the value of a property within the object (e.g. <code>set(\"x.y.z\", 5)</code>).","         *","         * @param {Any} value The value to set the attribute to.","         *","         * @return {Object} A reference to the host object.","         */","        set : function(name, val) {","            return this._setAttr(name, val);","        },","","        /**","         * Allows setting of readOnly/writeOnce attributes. See <a href=\"#method_set\">set</a> for argument details.","         *","         * @method _set","         * @protected","         * @chainable","         * ","         * @param {String} name The name of the attribute.","         * @param {Any} val The value to set the attribute to.","         * @return {Object} A reference to the host object.","         */","        _set : function(name, val) {","            return this._setAttr(name, val, null, true);","        },","","        /**","         * Provides the common implementation for the public set and protected _set methods.","         *","         * See <a href=\"#method_set\">set</a> for argument details.","         *","         * @method _setAttr","         * @protected","         * @chainable","         *","         * @param {String} name The name of the attribute.","         * @param {Any} value The value to set the attribute to.","         * @param {Object} opts (Optional) Optional event data to be mixed into","         * the event facade passed to subscribers of the attribute's change event.","         * This is currently a hack. There's no real need for the AttributeCore implementation","         * to support this parameter, but breaking it out into AttributeEvents, results in","         * additional function hops for the critical path.","         * @param {boolean} force If true, allows the caller to set values for ","         * readOnly or writeOnce attributes which have already been set.","         *","         * @return {Object} A reference to the host object.","         */","        _setAttr : function(name, val, opts, force)  {","            ","            // HACK - no real reason core needs to know about opts, but ","            // it adds fn hops if we want to break it out. ","            // Not sure it's worth it for this critical path","            ","            var allowSet = true,","                state = this._state,","                stateProxy = this._stateProxy,","                cfg,","                initialSet,","                strPath,","                path,","                currVal,","                writeOnce,","                initializing;","","            if (name.indexOf(DOT) !== -1) {","                strPath = name;","                path = name.split(DOT);","                name = path.shift();","            }","","            if (this._isLazyAttr(name)) {","                this._addLazyAttr(name);","            }","","            cfg = state.getAll(name, true) || {}; ","","            initialSet = (!(VALUE in cfg));","","            if (stateProxy && name in stateProxy && !cfg._bypassProxy) {","                // TODO: Value is always set for proxy. Can we do any better? Maybe take a snapshot as the initial value for the first call to set? ","                initialSet = false;","            }","","            writeOnce = cfg.writeOnce;","            initializing = cfg.initializing;","","            if (!initialSet && !force) {","","                if (writeOnce) {","                    allowSet = false;","                }","","                if (cfg.readOnly) {","                    allowSet = false;","                }","            }","","            if (!initializing && !force && writeOnce === INIT_ONLY) {","                allowSet = false;","            }","","            if (allowSet) {","                // Don't need currVal if initialSet (might fail in custom getter if it always expects a non-undefined/non-null value)","                if (!initialSet) {","                    currVal =  this.get(name);","                }","","                if (path) {","                   val = O.setValue(Y.clone(currVal), path, val);","","                   if (val === undefined) {","                       allowSet = false;","                   }","                }","","                if (allowSet) {","                    if (!this._fireAttrChange || initializing) {","                        this._setAttrVal(name, strPath, currVal, val);","                    } else {","                        // HACK - no real reason core needs to know about _fireAttrChange, but ","                        // it adds fn hops if we want to break it out. Not sure it's worth it for this critical path","                        this._fireAttrChange(name, strPath, currVal, val, opts);","                    }","                }","            }","","            return this;","        },","","        /**","         * Provides the common implementation for the public get method,","         * allowing Attribute hosts to over-ride either method.","         *","         * See <a href=\"#method_get\">get</a> for argument details.","         *","         * @method _getAttr","         * @protected","         * @chainable","         *","         * @param {String} name The name of the attribute.","         * @return {Any} The value of the attribute.","         */","        _getAttr : function(name) {","            var host = this, // help compression","                fullName = name,","                state = host._state,","                path,","                getter,","                val,","                cfg;","","            if (name.indexOf(DOT) !== -1) {","                path = name.split(DOT);","                name = path.shift();","            }","","            // On Demand - Should be rare - handles out of order valueFn references","            if (host._tCfgs && host._tCfgs[name]) {","                cfg = {};","                cfg[name] = host._tCfgs[name];","                delete host._tCfgs[name];","                host._addAttrs(cfg, host._tVals);","            }","            ","            // Lazy Init","            if (host._isLazyAttr(name)) {","                host._addLazyAttr(name);","            }","","            val = host._getStateVal(name);","                        ","            getter = state.get(name, GETTER);","","            if (getter && !getter.call) {","                getter = this[getter];","            }","","            val = (getter) ? getter.call(host, val, fullName) : val;","            val = (path) ? O.getValue(val, path) : val;","","            return val;","        },","","        /**","         * Gets the stored value for the attribute, from either the ","         * internal state object, or the state proxy if it exits","         * ","         * @method _getStateVal","         * @private","         * @param {String} name The name of the attribute","         * @return {Any} The stored value of the attribute","         */","        _getStateVal : function(name) {","            var stateProxy = this._stateProxy;","            return stateProxy && (name in stateProxy) && !this._state.get(name, BYPASS_PROXY) ? stateProxy[name] : this._state.get(name, VALUE);","        },","","        /**","         * Sets the stored value for the attribute, in either the ","         * internal state object, or the state proxy if it exits","         *","         * @method _setStateVal","         * @private","         * @param {String} name The name of the attribute","         * @param {Any} value The value of the attribute","         */","        _setStateVal : function(name, value) {","            var stateProxy = this._stateProxy;","            if (stateProxy && (name in stateProxy) && !this._state.get(name, BYPASS_PROXY)) {","                stateProxy[name] = value;","            } else {","                this._state.add(name, VALUE, value);","            }","        },","","        /**","         * Updates the stored value of the attribute in the privately held State object,","         * if validation and setter passes.","         *","         * @method _setAttrVal","         * @private","         * @param {String} attrName The attribute name.","         * @param {String} subAttrName The sub-attribute name, if setting a sub-attribute property (\"x.y.z\").","         * @param {Any} prevVal The currently stored value of the attribute.","         * @param {Any} newVal The value which is going to be stored.","         * ","         * @return {booolean} true if the new attribute value was stored, false if not.","         */","        _setAttrVal : function(attrName, subAttrName, prevVal, newVal) {","","            var host = this,","                allowSet = true,","                cfg = this._state.getAll(attrName, true) || {},","                validator = cfg.validator,","                setter = cfg.setter,","                initializing = cfg.initializing,","                prevRawVal = this._getStateVal(attrName),","                name = subAttrName || attrName,","                retVal,","                valid;","","            if (validator) {","                if (!validator.call) { ","                    // Assume string - trying to keep critical path tight, so avoiding Lang check","                    validator = this[validator];","                }","                if (validator) {","                    valid = validator.call(host, newVal, name);","","                    if (!valid && initializing) {","                        newVal = cfg.defaultValue;","                        valid = true; // Assume it's valid, for perf.","                    }","                }","            }","","            if (!validator || valid) {","                if (setter) {","                    if (!setter.call) {","                        // Assume string - trying to keep critical path tight, so avoiding Lang check","                        setter = this[setter];","                    }","                    if (setter) {","                        retVal = setter.call(host, newVal, name);","","                        if (retVal === INVALID_VALUE) {","                            allowSet = false;","                        } else if (retVal !== undefined){","                            newVal = retVal;","                        }","                    }","                }","","                if (allowSet) {","                    if(!subAttrName && (newVal === prevRawVal) && !Lang.isObject(newVal)) {","                        allowSet = false;","                    } else {","                        // Store value","                        if (!(INIT_VALUE in cfg)) {","                            cfg.initValue = newVal;","                        }","                        host._setStateVal(attrName, newVal);","                    }","                }","","            } else {","                allowSet = false;","            }","","            return allowSet;","        },","","        /**","         * Sets multiple attribute values.","         *","         * @method setAttrs","         * @param {Object} attrs  An object with attributes name/value pairs.","         * @return {Object} A reference to the host object.","         * @chainable","         */","        setAttrs : function(attrs) {","            return this._setAttrs(attrs);","        },","","        /**","         * Implementation behind the public setAttrs method, to set multiple attribute values.","         *","         * @method _setAttrs","         * @protected","         * @param {Object} attrs  An object with attributes name/value pairs.","         * @return {Object} A reference to the host object.","         * @chainable","         */","        _setAttrs : function(attrs) {","            for (var attr in attrs) {","                if ( attrs.hasOwnProperty(attr) ) {","                    this.set(attr, attrs[attr]);","                }","            }","            return this;","        },","","        /**","         * Gets multiple attribute values.","         *","         * @method getAttrs","         * @param {Array | boolean} attrs Optional. An array of attribute names. If omitted, all attribute values are","         * returned. If set to true, all attributes modified from their initial values are returned.","         * @return {Object} An object with attribute name/value pairs.","         */","        getAttrs : function(attrs) {","            return this._getAttrs(attrs);","        },","","        /**","         * Implementation behind the public getAttrs method, to get multiple attribute values.","         *","         * @method _getAttrs","         * @protected","         * @param {Array | boolean} attrs Optional. An array of attribute names. If omitted, all attribute values are","         * returned. If set to true, all attributes modified from their initial values are returned.","         * @return {Object} An object with attribute name/value pairs.","         */","        _getAttrs : function(attrs) {","            var host = this,","                o = {}, ","                i, l, attr, val,","                modifiedOnly = (attrs === true);","","            // TODO - figure out how to get all \"added\"","            attrs = (attrs && !modifiedOnly) ? attrs : O.keys(host._state.data);","","            for (i = 0, l = attrs.length; i < l; i++) {","                // Go through get, to honor cloning/normalization","                attr = attrs[i];","                val = host.get(attr);","","                if (!modifiedOnly || host._getStateVal(attr) != host._state.get(attr, INIT_VALUE)) {","                    o[attr] = host.get(attr); ","                }","            }","","            return o;","        },","","        /**","         * Configures a group of attributes, and sets initial values.","         *","         * <p>","         * <strong>NOTE:</strong> This method does not isolate the configuration object by merging/cloning. ","         * The caller is responsible for merging/cloning the configuration object if required.","         * </p>","         *","         * @method addAttrs","         * @chainable","         *","         * @param {Object} cfgs An object with attribute name/configuration pairs.","         * @param {Object} values An object with attribute name/value pairs, defining the initial values to apply.","         * Values defined in the cfgs argument will be over-written by values in this argument unless defined as read only.","         * @param {boolean} lazy Whether or not to delay the intialization of these attributes until the first call to get/set.","         * Individual attributes can over-ride this behavior by defining a lazyAdd configuration property in their configuration.","         * See <a href=\"#method_addAttr\">addAttr</a>.","         * ","         * @return {Object} A reference to the host object.","         */","        addAttrs : function(cfgs, values, lazy) {","            var host = this; // help compression","            if (cfgs) {","                host._tCfgs = cfgs;","                host._tVals = host._normAttrVals(values);","                host._addAttrs(cfgs, host._tVals, lazy);","                host._tCfgs = host._tVals = null;","            }","","            return host;","        },","","        /**","         * Implementation behind the public addAttrs method. ","         * ","         * This method is invoked directly by get if it encounters a scenario ","         * in which an attribute's valueFn attempts to obtain the ","         * value an attribute in the same group of attributes, which has not yet ","         * been added (on demand initialization).","         *","         * @method _addAttrs","         * @private","         * @param {Object} cfgs An object with attribute name/configuration pairs.","         * @param {Object} values An object with attribute name/value pairs, defining the initial values to apply.","         * Values defined in the cfgs argument will be over-written by values in this argument unless defined as read only.","         * @param {boolean} lazy Whether or not to delay the intialization of these attributes until the first call to get/set.","         * Individual attributes can over-ride this behavior by defining a lazyAdd configuration property in their configuration.","         * See <a href=\"#method_addAttr\">addAttr</a>.","         */","        _addAttrs : function(cfgs, values, lazy) {","            var host = this, // help compression","                attr,","                attrCfg,","                value;","","            for (attr in cfgs) {","                if (cfgs.hasOwnProperty(attr)) {","","                    // Not Merging. Caller is responsible for isolating configs","                    attrCfg = cfgs[attr];","                    attrCfg.defaultValue = attrCfg.value;","","                    // Handle simple, complex and user values, accounting for read-only","                    value = host._getAttrInitVal(attr, attrCfg, host._tVals);","","                    if (value !== undefined) {","                        attrCfg.value = value;","                    }","","                    if (host._tCfgs[attr]) {","                        delete host._tCfgs[attr];","                    }","","                    host.addAttr(attr, attrCfg, lazy);","                }","            }","        },","","        /**","         * Utility method to protect an attribute configuration","         * hash, by merging the entire object and the individual ","         * attr config objects. ","         *","         * @method _protectAttrs","         * @protected","         * @param {Object} attrs A hash of attribute to configuration object pairs.","         * @return {Object} A protected version of the attrs argument.","         */","        _protectAttrs : function(attrs) {","            if (attrs) {","                attrs = Y.merge(attrs);","                for (var attr in attrs) {","                    if (attrs.hasOwnProperty(attr)) {","                        attrs[attr] = Y.merge(attrs[attr]);","                    }","                }","            }","            return attrs;","        },","","        /**","         * Utility method to normalize attribute values. The base implementation ","         * simply merges the hash to protect the original.","         *","         * @method _normAttrVals","         * @param {Object} valueHash An object with attribute name/value pairs","         *","         * @return {Object}","         *","         * @private","         */","        _normAttrVals : function(valueHash) {","            return (valueHash) ? Y.merge(valueHash) : null;","        },","","        /**","         * Returns the initial value of the given attribute from","         * either the default configuration provided, or the ","         * over-ridden value if it exists in the set of initValues ","         * provided and the attribute is not read-only.","         *","         * @param {String} attr The name of the attribute","         * @param {Object} cfg The attribute configuration object","         * @param {Object} initValues The object with simple and complex attribute name/value pairs returned from _normAttrVals","         *","         * @return {Any} The initial value of the attribute.","         *","         * @method _getAttrInitVal","         * @private","         */","        _getAttrInitVal : function(attr, cfg, initValues) {","            var val, valFn;","            // init value is provided by the user if it exists, else, provided by the config","            if (!cfg.readOnly && initValues && initValues.hasOwnProperty(attr)) {","                val = initValues[attr];","            } else {","                val = cfg.value;","                valFn = cfg.valueFn;"," ","                if (valFn) {","                    if (!valFn.call) {","                        valFn = this[valFn];","                    }","                    if (valFn) {","                        val = valFn.call(this, attr);","                    }","                }","            }","","","            return val;","        },","","        /**","         * Utility method to set up initial attributes defined during construction, either through the constructor.ATTRS property, or explicitly passed in.","         * ","         * @method _initAttrs","         * @protected","         * @param attrs {Object} The attributes to add during construction (passed through to <a href=\"#method_addAttrs\">addAttrs</a>). These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.","         * @param values {Object} The initial attribute values to apply (passed through to <a href=\"#method_addAttrs\">addAttrs</a>). These are not merged/cloned. The caller is responsible for isolating user provided values if required.","         * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","         */","        _initAttrs : function(attrs, values, lazy) {","            // ATTRS support for Node, which is not Base based","            attrs = attrs || this.constructor.ATTRS;","    ","            var Base = Y.Base,","                BaseCore = Y.BaseCore,","                baseInst = (Base && Y.instanceOf(this, Base)),","                baseCoreInst = (!baseInst && BaseCore && Y.instanceOf(this, BaseCore));","","            if ( attrs && !baseInst && !baseCoreInst) {","                this.addAttrs(this._protectAttrs(attrs), values, lazy);","            }","        }","    };","","    Y.AttributeCore = AttributeCore;","","","}, '@VERSION@' );"];
_yuitest_coverage["/build/attribute-core/attribute-core.js"].lines = {"1":0,"14":0,"19":0,"22":0,"33":0,"34":0,"35":0,"46":0,"48":0,"49":0,"50":0,"63":0,"64":0,"65":0,"77":0,"79":0,"80":0,"81":0,"84":0,"85":0,"86":0,"88":0,"103":0,"104":0,"121":0,"123":0,"124":0,"125":0,"126":0,"129":0,"132":0,"153":0,"208":0,"209":0,"224":0,"225":0,"239":0,"241":0,"254":0,"255":0,"358":0,"363":0,"365":0,"367":0,"368":0,"375":0,"377":0,"380":0,"382":0,"383":0,"386":0,"387":0,"389":0,"391":0,"393":0,"396":0,"400":0,"411":0,"427":0,"440":0,"451":0,"454":0,"455":0,"456":0,"474":0,"489":0,"519":0,"530":0,"531":0,"532":0,"533":0,"536":0,"537":0,"540":0,"542":0,"544":0,"546":0,"549":0,"550":0,"552":0,"554":0,"555":0,"558":0,"559":0,"563":0,"564":0,"567":0,"569":0,"570":0,"573":0,"574":0,"576":0,"577":0,"581":0,"582":0,"583":0,"587":0,"592":0,"609":0,"617":0,"618":0,"619":0,"623":0,"624":0,"625":0,"626":0,"627":0,"631":0,"632":0,"635":0,"637":0,"639":0,"640":0,"643":0,"644":0,"646":0,"659":0,"660":0,"673":0,"674":0,"675":0,"677":0,"696":0,"707":0,"708":0,"710":0,"712":0,"713":0,"715":0,"716":0,"717":0,"722":0,"723":0,"724":0,"726":0,"728":0,"729":0,"731":0,"732":0,"733":0,"734":0,"739":0,"740":0,"741":0,"744":0,"745":0,"747":0,"752":0,"755":0,"767":0,"780":0,"781":0,"782":0,"785":0,"797":0,"810":0,"816":0,"818":0,"820":0,"821":0,"823":0,"824":0,"828":0,"852":0,"853":0,"854":0,"855":0,"856":0,"857":0,"860":0,"881":0,"886":0,"887":0,"890":0,"891":0,"894":0,"896":0,"897":0,"900":0,"901":0,"904":0,"920":0,"921":0,"922":0,"923":0,"924":0,"928":0,"943":0,"962":0,"964":0,"965":0,"967":0,"968":0,"970":0,"971":0,"972":0,"974":0,"975":0,"981":0,"995":0,"997":0,"1002":0,"1003":0,"1008":0};
_yuitest_coverage["/build/attribute-core/attribute-core.js"].functions = {"State:14":0,"add:32":0,"addAll:45":0,"remove:62":0,"(anonymous 2):84":0,"removeAll:76":0,"get:102":0,"(anonymous 3):124":0,"getAll:120":0,"AttributeCore:208":0,"_initAttrHost:253":0,"addAttr:355":0,"attrAdded:410":0,"get:426":0,"_isLazyAttr:439":0,"_addLazyAttr:450":0,"set:473":0,"_set:488":0,"_setAttr:513":0,"_getAttr:608":0,"_getStateVal:658":0,"_setStateVal:672":0,"_setAttrVal:694":0,"setAttrs:766":0,"_setAttrs:779":0,"getAttrs:796":0,"_getAttrs:809":0,"addAttrs:851":0,"_addAttrs:880":0,"_protectAttrs:919":0,"_normAttrVals:942":0,"_getAttrInitVal:961":0,"_initAttrs:993":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/attribute-core/attribute-core.js"].coveredLines = 204;
_yuitest_coverage["/build/attribute-core/attribute-core.js"].coveredFunctions = 34;
_yuitest_coverline("/build/attribute-core/attribute-core.js", 1);
YUI.add('attribute-core', function(Y) {

    /**
     * The State class maintains state for a collection of named items, with 
     * a varying number of properties defined.
     *
     * It avoids the need to create a separate class for the item, and separate instances 
     * of these classes for each item, by storing the state in a 2 level hash table, 
     * improving performance when the number of items is likely to be large.
     *
     * @constructor
     * @class State
     */
    _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 14);
Y.State = function() {
        /**
         * Hash of attributes
         * @property data
         */
        _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "State", 14);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 19);
this.data = {};
    };

    _yuitest_coverline("/build/attribute-core/attribute-core.js", 22);
Y.State.prototype = {

        /**
         * Adds a property to an item.
         *
         * @method add
         * @param name {String} The name of the item.
         * @param key {String} The name of the property.
         * @param val {Any} The value of the property.
         */
        add : function(name, key, val) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "add", 32);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 33);
var d = this.data;
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 34);
d[name] = d[name] || {};
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 35);
d[name][key] = val;
        },

        /**
         * Adds multiple properties to an item.
         *
         * @method addAll
         * @param name {String} The name of the item.
         * @param o {Object} A hash of property/value pairs.
         */
        addAll: function(name, o) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "addAll", 45);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 46);
var key;

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 48);
for (key in o) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 49);
if (o.hasOwnProperty(key)) {
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 50);
this.add(name, key, o[key]);
                }
            }
        },

        /**
         * Removes a property from an item.
         *
         * @method remove
         * @param name {String} The name of the item.
         * @param key {String} The property to remove.
         */
        remove: function(name, key) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "remove", 62);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 63);
var d = this.data;
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 64);
if (d[name]) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 65);
delete d[name][key];
            }
        },

        /**
         * Removes multiple properties from an item, or remove the item completely.
         *
         * @method removeAll
         * @param name {String} The name of the item.
         * @param o {Object|Array} Collection of properties to delete. If not provided, the entire item is removed.
         */
        removeAll: function(name, o) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "removeAll", 76);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 77);
var d = this.data;

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 79);
if (!o) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 80);
if (d[name]) {
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 81);
delete d[name];
                }
            } else {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 84);
Y.each(o, function(v, k) {
                    _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "(anonymous 2)", 84);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 85);
if(Y.Lang.isString(k)) {
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 86);
this.remove(name, k);
                    } else {
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 88);
this.remove(name, v);
                    }
                }, this);
            }
        },

        /**
         * For a given item, returns the value of the property requested, or undefined if not found.
         *
         * @method get
         * @param name {String} The name of the item
         * @param key {String} Optional. The property value to retrieve.
         * @return {Any} The value of the supplied property.
         */
        get: function(name, key) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "get", 102);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 103);
var d = this.data;
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 104);
return (d[name]) ? d[name][key] : undefined;
        },

        /**
         * For the given item, returns an object with all of the
         * item's property/value pairs. By default the object returned
         * is a shallow copy of the stored data, but passing in true
         * as the second parameter will return a reference to the stored
         * data.
         *
         * @method getAll
         * @param name {String} The name of the item
         * @param reference {boolean} true, if you want a reference to the stored
         * object 
         * @return {Object} An object with property/value pairs for the item.
         */
        getAll : function(name, reference) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "getAll", 120);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 121);
var d = this.data, o;

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 123);
if (!reference) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 124);
Y.each(d[name], function(v, k) {
                        _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "(anonymous 3)", 124);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 125);
o = o || {};
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 126);
o[k] = v;
                });
            } else {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 129);
o = d[name];
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 132);
return o;
        }
    };
    /**
     * The attribute module provides an augmentable Attribute implementation, which 
     * adds configurable attributes and attribute change events to the class being 
     * augmented. It also provides a State class, which is used internally by Attribute,
     * but can also be used independently to provide a name/property/value data structure to
     * store state.
     *
     * @module attribute
     */

    /**
     * The attribute-core submodule provides the lightest level of attribute handling support 
     * without Attribute change events, or lesser used methods such as reset(), modifyAttrs(),
     * and removeAttr().
     *
     * @module attribute
     * @submodule attribute-core
     */
    _yuitest_coverline("/build/attribute-core/attribute-core.js", 153);
var O = Y.Object,
        Lang = Y.Lang,

        DOT = ".",

        // Externally configurable props
        GETTER = "getter",
        SETTER = "setter",
        READ_ONLY = "readOnly",
        WRITE_ONCE = "writeOnce",
        INIT_ONLY = "initOnly",
        VALIDATOR = "validator",
        VALUE = "value",
        VALUE_FN = "valueFn",
        LAZY_ADD = "lazyAdd",

        // Used for internal state management
        ADDED = "added",
        BYPASS_PROXY = "_bypassProxy",
        INITIALIZING = "initializing",
        INIT_VALUE = "initValue",
        LAZY = "lazy",
        IS_LAZY_ADD = "isLazyAdd",

        INVALID_VALUE;

    /**
     * <p>
     * AttributeCore provides the lightest level of configurable attribute support. It is designed to be 
     * augmented on to a host class, and provides the host with the ability to configure 
     * attributes to store and retrieve state, <strong>but without support for attribute change events</strong>.
     * </p>
     * <p>For example, attributes added to the host can be configured:</p>
     * <ul>
     *     <li>As read only.</li>
     *     <li>As write once.</li>
     *     <li>With a setter function, which can be used to manipulate
     *     values passed to Attribute's <a href="#method_set">set</a> method, before they are stored.</li>
     *     <li>With a getter function, which can be used to manipulate stored values,
     *     before they are returned by Attribute's <a href="#method_get">get</a> method.</li>
     *     <li>With a validator function, to validate values before they are stored.</li>
     * </ul>
     *
     * <p>See the <a href="#method_addAttr">addAttr</a> method, for the complete set of configuration
     * options available for attributes.</p>
     * 
     * <p>Object/Classes based on AttributeCore can augment <a href="AttributeEvents.html">AttributeEvents</a> 
     * (with true for overwrite) and <a href="AttributeExtras.html">AttributeExtras</a> to add attribute event and 
     * additional, less commonly used attribute methods, such as `modifyAttr`, `removeAttr` and `reset`.</p>   
     *
     * @class AttributeCore
     * @param attrs {Object} The attributes to add during construction (passed through to <a href="#method_addAttrs">addAttrs</a>). These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.
     * @param values {Object} The initial attribute values to apply (passed through to <a href="#method_addAttrs">addAttrs</a>). These are not merged/cloned. The caller is responsible for isolating user provided values if required.
     * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href="#method_addAttrs">addAttrs</a>).
     */
    _yuitest_coverline("/build/attribute-core/attribute-core.js", 208);
function AttributeCore(attrs, values, lazy) {
        _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "AttributeCore", 208);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 209);
this._initAttrHost(attrs, values, lazy);            
    }

    /**
     * <p>The value to return from an attribute setter in order to prevent the set from going through.</p>
     *
     * <p>You can return this value from your setter if you wish to combine validator and setter 
     * functionality into a single setter function, which either returns the massaged value to be stored or 
     * AttributeCore.INVALID_VALUE to prevent invalid values from being stored.</p>
     *
     * @property INVALID_VALUE
     * @type Object
     * @static
     * @final
     */
    _yuitest_coverline("/build/attribute-core/attribute-core.js", 224);
AttributeCore.INVALID_VALUE = {};
    _yuitest_coverline("/build/attribute-core/attribute-core.js", 225);
INVALID_VALUE = AttributeCore.INVALID_VALUE;

    /**
     * The list of properties which can be configured for 
     * each attribute (e.g. setter, getter, writeOnce etc.).
     *
     * This property is used internally as a whitelist for faster
     * Y.mix operations.
     *
     * @property _ATTR_CFG
     * @type Array
     * @static
     * @protected
     */
    _yuitest_coverline("/build/attribute-core/attribute-core.js", 239);
AttributeCore._ATTR_CFG = [SETTER, GETTER, VALIDATOR, VALUE, VALUE_FN, WRITE_ONCE, READ_ONLY, LAZY_ADD, BYPASS_PROXY];

    _yuitest_coverline("/build/attribute-core/attribute-core.js", 241);
AttributeCore.prototype = {

        /**
         * Constructor logic for attributes. Initializes the host state, and sets up the inital attributes passed to the 
         * constructor.
         *
         * @method _initAttrHost
         * @param attrs {Object} The attributes to add during construction (passed through to <a href="#method_addAttrs">addAttrs</a>). These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.
         * @param values {Object} The initial attribute values to apply (passed through to <a href="#method_addAttrs">addAttrs</a>). These are not merged/cloned. The caller is responsible for isolating user provided values if required.
         * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href="#method_addAttrs">addAttrs</a>).
         * @private
         */
        _initAttrHost : function(attrs, values, lazy) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_initAttrHost", 253);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 254);
this._state = new Y.State();
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 255);
this._initAttrs(attrs, values, lazy);
        },

        /**
         * <p>
         * Adds an attribute with the provided configuration to the host object.
         * </p>
         * <p>
         * The config argument object supports the following properties:
         * </p>
         * 
         * <dl>
         *    <dt>value &#60;Any&#62;</dt>
         *    <dd>The initial value to set on the attribute</dd>
         *
         *    <dt>valueFn &#60;Function | String&#62;</dt>
         *    <dd>
         *    <p>A function, which will return the initial value to set on the attribute. This is useful
         *    for cases where the attribute configuration is defined statically, but needs to 
         *    reference the host instance ("this") to obtain an initial value. If both the value and valueFn properties are defined, 
         *    the value returned by the valueFn has precedence over the value property, unless it returns undefined, in which 
         *    case the value property is used.</p>
         *
         *    <p>valueFn can also be set to a string, representing the name of the instance method to be used to retrieve the value.</p>
         *    </dd>
         *
         *    <dt>readOnly &#60;boolean&#62;</dt>
         *    <dd>Whether or not the attribute is read only. Attributes having readOnly set to true
         *        cannot be modified by invoking the set method.</dd>
         *
         *    <dt>writeOnce &#60;boolean&#62; or &#60;string&#62;</dt>
         *    <dd>
         *        Whether or not the attribute is "write once". Attributes having writeOnce set to true, 
         *        can only have their values set once, be it through the default configuration, 
         *        constructor configuration arguments, or by invoking set.
         *        <p>The writeOnce attribute can also be set to the string "initOnly", in which case the attribute can only be set during initialization
         *        (when used with Base, this means it can only be set during construction)</p>
         *    </dd>
         *
         *    <dt>setter &#60;Function | String&#62;</dt>
         *    <dd>
         *    <p>The setter function used to massage or normalize the value passed to the set method for the attribute. 
         *    The value returned by the setter will be the final stored value. Returning
         *    <a href="#property_Attribute.INVALID_VALUE">Attribute.INVALID_VALUE</a>, from the setter will prevent
         *    the value from being stored.
         *    </p>
         *    
         *    <p>setter can also be set to a string, representing the name of the instance method to be used as the setter function.</p>
         *    </dd>
         *      
         *    <dt>getter &#60;Function | String&#62;</dt>
         *    <dd>
         *    <p>
         *    The getter function used to massage or normalize the value returned by the get method for the attribute.
         *    The value returned by the getter function is the value which will be returned to the user when they 
         *    invoke get.
         *    </p>
         *
         *    <p>getter can also be set to a string, representing the name of the instance method to be used as the getter function.</p>
         *    </dd>
         *
         *    <dt>validator &#60;Function | String&#62;</dt>
         *    <dd>
         *    <p>
         *    The validator function invoked prior to setting the stored value. Returning
         *    false from the validator function will prevent the value from being stored.
         *    </p>
         *    
         *    <p>validator can also be set to a string, representing the name of the instance method to be used as the validator function.</p>
         *    </dd>
         *
         *    <dt>lazyAdd &#60;boolean&#62;</dt>
         *    <dd>Whether or not to delay initialization of the attribute until the first call to get/set it. 
         *    This flag can be used to over-ride lazy initialization on a per attribute basis, when adding multiple attributes through 
         *    the <a href="#method_addAttrs">addAttrs</a> method.</dd>
         *
         * </dl>
         *
         * <p>The setter, getter and validator are invoked with the value and name passed in as the first and second arguments, and with
         * the context ("this") set to the host object.</p>
         *
         * <p>Configuration properties outside of the list mentioned above are considered private properties used internally by attribute, 
         * and are not intended for public use.</p>
         * 
         * @method addAttr
         *
         * @param {String} name The name of the attribute.
         * @param {Object} config An object with attribute configuration property/value pairs, specifying the configuration for the attribute.
         *
         * <p>
         * <strong>NOTE:</strong> The configuration object is modified when adding an attribute, so if you need 
         * to protect the original values, you will need to merge the object.
         * </p>
         *
         * @param {boolean} lazy (optional) Whether or not to add this attribute lazily (on the first call to get/set). 
         *
         * @return {Object} A reference to the host object.
         *
         * @chainable
         */
        addAttr: function(name, config, lazy) {


            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "addAttr", 355);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 358);
var host = this, // help compression
                state = host._state,
                value,
                hasValue;

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 363);
config = config || {};

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 365);
lazy = (LAZY_ADD in config) ? config[LAZY_ADD] : lazy;

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 367);
if (lazy && !host.attrAdded(name)) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 368);
state.addAll(name, {
                    lazy : config,
                    added : true
                });
            } else {


                _yuitest_coverline("/build/attribute-core/attribute-core.js", 375);
if (!host.attrAdded(name) || state.get(name, IS_LAZY_ADD)) {

                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 377);
hasValue = (VALUE in config);


                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 380);
if (hasValue) {
                        // We'll go through set, don't want to set value in config directly
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 382);
value = config.value;
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 383);
delete config.value;
                    }

                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 386);
config.added = true;
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 387);
config.initializing = true;

                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 389);
state.addAll(name, config);

                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 391);
if (hasValue) {
                        // Go through set, so that raw values get normalized/validated
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 393);
host.set(name, value);
                    }

                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 396);
state.remove(name, INITIALIZING);
                }
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 400);
return host;
        },

        /**
         * Checks if the given attribute has been added to the host
         *
         * @method attrAdded
         * @param {String} name The name of the attribute to check.
         * @return {boolean} true if an attribute with the given name has been added, false if it hasn't. This method will return true for lazily added attributes.
         */
        attrAdded: function(name) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "attrAdded", 410);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 411);
return !!this._state.get(name, ADDED);
        },

        /**
         * Returns the current value of the attribute. If the attribute
         * has been configured with a 'getter' function, this method will delegate
         * to the 'getter' to obtain the value of the attribute.
         *
         * @method get
         *
         * @param {String} name The name of the attribute. If the value of the attribute is an Object, 
         * dot notation can be used to obtain the value of a property of the object (e.g. <code>get("x.y.z")</code>)
         *
         * @return {Any} The value of the attribute
         */
        get : function(name) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "get", 426);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 427);
return this._getAttr(name);
        },

        /**
         * Checks whether or not the attribute is one which has been
         * added lazily and still requires initialization.
         *
         * @method _isLazyAttr
         * @private
         * @param {String} name The name of the attribute
         * @return {boolean} true if it's a lazily added attribute, false otherwise.
         */
        _isLazyAttr: function(name) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_isLazyAttr", 439);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 440);
return this._state.get(name, LAZY);
        },

        /**
         * Finishes initializing an attribute which has been lazily added.
         *
         * @method _addLazyAttr
         * @private
         * @param {Object} name The name of the attribute
         */
        _addLazyAttr: function(name, cfg) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_addLazyAttr", 450);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 451);
var state = this._state,
                lazyCfg = state.get(name, LAZY);

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 454);
state.add(name, IS_LAZY_ADD, true);
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 455);
state.remove(name, LAZY);
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 456);
this.addAttr(name, lazyCfg);
        },

        /**
         * Sets the value of an attribute.
         *
         * @method set
         * @chainable
         *
         * @param {String} name The name of the attribute. If the 
         * current value of the attribute is an Object, dot notation can be used
         * to set the value of a property within the object (e.g. <code>set("x.y.z", 5)</code>).
         *
         * @param {Any} value The value to set the attribute to.
         *
         * @return {Object} A reference to the host object.
         */
        set : function(name, val) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "set", 473);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 474);
return this._setAttr(name, val);
        },

        /**
         * Allows setting of readOnly/writeOnce attributes. See <a href="#method_set">set</a> for argument details.
         *
         * @method _set
         * @protected
         * @chainable
         * 
         * @param {String} name The name of the attribute.
         * @param {Any} val The value to set the attribute to.
         * @return {Object} A reference to the host object.
         */
        _set : function(name, val) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_set", 488);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 489);
return this._setAttr(name, val, null, true);
        },

        /**
         * Provides the common implementation for the public set and protected _set methods.
         *
         * See <a href="#method_set">set</a> for argument details.
         *
         * @method _setAttr
         * @protected
         * @chainable
         *
         * @param {String} name The name of the attribute.
         * @param {Any} value The value to set the attribute to.
         * @param {Object} opts (Optional) Optional event data to be mixed into
         * the event facade passed to subscribers of the attribute's change event.
         * This is currently a hack. There's no real need for the AttributeCore implementation
         * to support this parameter, but breaking it out into AttributeEvents, results in
         * additional function hops for the critical path.
         * @param {boolean} force If true, allows the caller to set values for 
         * readOnly or writeOnce attributes which have already been set.
         *
         * @return {Object} A reference to the host object.
         */
        _setAttr : function(name, val, opts, force)  {
            
            // HACK - no real reason core needs to know about opts, but 
            // it adds fn hops if we want to break it out. 
            // Not sure it's worth it for this critical path
            
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_setAttr", 513);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 519);
var allowSet = true,
                state = this._state,
                stateProxy = this._stateProxy,
                cfg,
                initialSet,
                strPath,
                path,
                currVal,
                writeOnce,
                initializing;

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 530);
if (name.indexOf(DOT) !== -1) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 531);
strPath = name;
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 532);
path = name.split(DOT);
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 533);
name = path.shift();
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 536);
if (this._isLazyAttr(name)) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 537);
this._addLazyAttr(name);
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 540);
cfg = state.getAll(name, true) || {}; 

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 542);
initialSet = (!(VALUE in cfg));

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 544);
if (stateProxy && name in stateProxy && !cfg._bypassProxy) {
                // TODO: Value is always set for proxy. Can we do any better? Maybe take a snapshot as the initial value for the first call to set? 
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 546);
initialSet = false;
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 549);
writeOnce = cfg.writeOnce;
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 550);
initializing = cfg.initializing;

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 552);
if (!initialSet && !force) {

                _yuitest_coverline("/build/attribute-core/attribute-core.js", 554);
if (writeOnce) {
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 555);
allowSet = false;
                }

                _yuitest_coverline("/build/attribute-core/attribute-core.js", 558);
if (cfg.readOnly) {
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 559);
allowSet = false;
                }
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 563);
if (!initializing && !force && writeOnce === INIT_ONLY) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 564);
allowSet = false;
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 567);
if (allowSet) {
                // Don't need currVal if initialSet (might fail in custom getter if it always expects a non-undefined/non-null value)
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 569);
if (!initialSet) {
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 570);
currVal =  this.get(name);
                }

                _yuitest_coverline("/build/attribute-core/attribute-core.js", 573);
if (path) {
                   _yuitest_coverline("/build/attribute-core/attribute-core.js", 574);
val = O.setValue(Y.clone(currVal), path, val);

                   _yuitest_coverline("/build/attribute-core/attribute-core.js", 576);
if (val === undefined) {
                       _yuitest_coverline("/build/attribute-core/attribute-core.js", 577);
allowSet = false;
                   }
                }

                _yuitest_coverline("/build/attribute-core/attribute-core.js", 581);
if (allowSet) {
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 582);
if (!this._fireAttrChange || initializing) {
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 583);
this._setAttrVal(name, strPath, currVal, val);
                    } else {
                        // HACK - no real reason core needs to know about _fireAttrChange, but 
                        // it adds fn hops if we want to break it out. Not sure it's worth it for this critical path
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 587);
this._fireAttrChange(name, strPath, currVal, val, opts);
                    }
                }
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 592);
return this;
        },

        /**
         * Provides the common implementation for the public get method,
         * allowing Attribute hosts to over-ride either method.
         *
         * See <a href="#method_get">get</a> for argument details.
         *
         * @method _getAttr
         * @protected
         * @chainable
         *
         * @param {String} name The name of the attribute.
         * @return {Any} The value of the attribute.
         */
        _getAttr : function(name) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_getAttr", 608);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 609);
var host = this, // help compression
                fullName = name,
                state = host._state,
                path,
                getter,
                val,
                cfg;

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 617);
if (name.indexOf(DOT) !== -1) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 618);
path = name.split(DOT);
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 619);
name = path.shift();
            }

            // On Demand - Should be rare - handles out of order valueFn references
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 623);
if (host._tCfgs && host._tCfgs[name]) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 624);
cfg = {};
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 625);
cfg[name] = host._tCfgs[name];
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 626);
delete host._tCfgs[name];
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 627);
host._addAttrs(cfg, host._tVals);
            }
            
            // Lazy Init
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 631);
if (host._isLazyAttr(name)) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 632);
host._addLazyAttr(name);
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 635);
val = host._getStateVal(name);
                        
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 637);
getter = state.get(name, GETTER);

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 639);
if (getter && !getter.call) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 640);
getter = this[getter];
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 643);
val = (getter) ? getter.call(host, val, fullName) : val;
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 644);
val = (path) ? O.getValue(val, path) : val;

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 646);
return val;
        },

        /**
         * Gets the stored value for the attribute, from either the 
         * internal state object, or the state proxy if it exits
         * 
         * @method _getStateVal
         * @private
         * @param {String} name The name of the attribute
         * @return {Any} The stored value of the attribute
         */
        _getStateVal : function(name) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_getStateVal", 658);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 659);
var stateProxy = this._stateProxy;
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 660);
return stateProxy && (name in stateProxy) && !this._state.get(name, BYPASS_PROXY) ? stateProxy[name] : this._state.get(name, VALUE);
        },

        /**
         * Sets the stored value for the attribute, in either the 
         * internal state object, or the state proxy if it exits
         *
         * @method _setStateVal
         * @private
         * @param {String} name The name of the attribute
         * @param {Any} value The value of the attribute
         */
        _setStateVal : function(name, value) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_setStateVal", 672);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 673);
var stateProxy = this._stateProxy;
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 674);
if (stateProxy && (name in stateProxy) && !this._state.get(name, BYPASS_PROXY)) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 675);
stateProxy[name] = value;
            } else {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 677);
this._state.add(name, VALUE, value);
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

            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_setAttrVal", 694);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 696);
var host = this,
                allowSet = true,
                cfg = this._state.getAll(attrName, true) || {},
                validator = cfg.validator,
                setter = cfg.setter,
                initializing = cfg.initializing,
                prevRawVal = this._getStateVal(attrName),
                name = subAttrName || attrName,
                retVal,
                valid;

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 707);
if (validator) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 708);
if (!validator.call) { 
                    // Assume string - trying to keep critical path tight, so avoiding Lang check
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 710);
validator = this[validator];
                }
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 712);
if (validator) {
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 713);
valid = validator.call(host, newVal, name);

                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 715);
if (!valid && initializing) {
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 716);
newVal = cfg.defaultValue;
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 717);
valid = true; // Assume it's valid, for perf.
                    }
                }
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 722);
if (!validator || valid) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 723);
if (setter) {
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 724);
if (!setter.call) {
                        // Assume string - trying to keep critical path tight, so avoiding Lang check
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 726);
setter = this[setter];
                    }
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 728);
if (setter) {
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 729);
retVal = setter.call(host, newVal, name);

                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 731);
if (retVal === INVALID_VALUE) {
                            _yuitest_coverline("/build/attribute-core/attribute-core.js", 732);
allowSet = false;
                        } else {_yuitest_coverline("/build/attribute-core/attribute-core.js", 733);
if (retVal !== undefined){
                            _yuitest_coverline("/build/attribute-core/attribute-core.js", 734);
newVal = retVal;
                        }}
                    }
                }

                _yuitest_coverline("/build/attribute-core/attribute-core.js", 739);
if (allowSet) {
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 740);
if(!subAttrName && (newVal === prevRawVal) && !Lang.isObject(newVal)) {
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 741);
allowSet = false;
                    } else {
                        // Store value
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 744);
if (!(INIT_VALUE in cfg)) {
                            _yuitest_coverline("/build/attribute-core/attribute-core.js", 745);
cfg.initValue = newVal;
                        }
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 747);
host._setStateVal(attrName, newVal);
                    }
                }

            } else {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 752);
allowSet = false;
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 755);
return allowSet;
        },

        /**
         * Sets multiple attribute values.
         *
         * @method setAttrs
         * @param {Object} attrs  An object with attributes name/value pairs.
         * @return {Object} A reference to the host object.
         * @chainable
         */
        setAttrs : function(attrs) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "setAttrs", 766);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 767);
return this._setAttrs(attrs);
        },

        /**
         * Implementation behind the public setAttrs method, to set multiple attribute values.
         *
         * @method _setAttrs
         * @protected
         * @param {Object} attrs  An object with attributes name/value pairs.
         * @return {Object} A reference to the host object.
         * @chainable
         */
        _setAttrs : function(attrs) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_setAttrs", 779);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 780);
for (var attr in attrs) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 781);
if ( attrs.hasOwnProperty(attr) ) {
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 782);
this.set(attr, attrs[attr]);
                }
            }
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 785);
return this;
        },

        /**
         * Gets multiple attribute values.
         *
         * @method getAttrs
         * @param {Array | boolean} attrs Optional. An array of attribute names. If omitted, all attribute values are
         * returned. If set to true, all attributes modified from their initial values are returned.
         * @return {Object} An object with attribute name/value pairs.
         */
        getAttrs : function(attrs) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "getAttrs", 796);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 797);
return this._getAttrs(attrs);
        },

        /**
         * Implementation behind the public getAttrs method, to get multiple attribute values.
         *
         * @method _getAttrs
         * @protected
         * @param {Array | boolean} attrs Optional. An array of attribute names. If omitted, all attribute values are
         * returned. If set to true, all attributes modified from their initial values are returned.
         * @return {Object} An object with attribute name/value pairs.
         */
        _getAttrs : function(attrs) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_getAttrs", 809);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 810);
var host = this,
                o = {}, 
                i, l, attr, val,
                modifiedOnly = (attrs === true);

            // TODO - figure out how to get all "added"
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 816);
attrs = (attrs && !modifiedOnly) ? attrs : O.keys(host._state.data);

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 818);
for (i = 0, l = attrs.length; i < l; i++) {
                // Go through get, to honor cloning/normalization
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 820);
attr = attrs[i];
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 821);
val = host.get(attr);

                _yuitest_coverline("/build/attribute-core/attribute-core.js", 823);
if (!modifiedOnly || host._getStateVal(attr) != host._state.get(attr, INIT_VALUE)) {
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 824);
o[attr] = host.get(attr); 
                }
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 828);
return o;
        },

        /**
         * Configures a group of attributes, and sets initial values.
         *
         * <p>
         * <strong>NOTE:</strong> This method does not isolate the configuration object by merging/cloning. 
         * The caller is responsible for merging/cloning the configuration object if required.
         * </p>
         *
         * @method addAttrs
         * @chainable
         *
         * @param {Object} cfgs An object with attribute name/configuration pairs.
         * @param {Object} values An object with attribute name/value pairs, defining the initial values to apply.
         * Values defined in the cfgs argument will be over-written by values in this argument unless defined as read only.
         * @param {boolean} lazy Whether or not to delay the intialization of these attributes until the first call to get/set.
         * Individual attributes can over-ride this behavior by defining a lazyAdd configuration property in their configuration.
         * See <a href="#method_addAttr">addAttr</a>.
         * 
         * @return {Object} A reference to the host object.
         */
        addAttrs : function(cfgs, values, lazy) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "addAttrs", 851);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 852);
var host = this; // help compression
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 853);
if (cfgs) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 854);
host._tCfgs = cfgs;
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 855);
host._tVals = host._normAttrVals(values);
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 856);
host._addAttrs(cfgs, host._tVals, lazy);
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 857);
host._tCfgs = host._tVals = null;
            }

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 860);
return host;
        },

        /**
         * Implementation behind the public addAttrs method. 
         * 
         * This method is invoked directly by get if it encounters a scenario 
         * in which an attribute's valueFn attempts to obtain the 
         * value an attribute in the same group of attributes, which has not yet 
         * been added (on demand initialization).
         *
         * @method _addAttrs
         * @private
         * @param {Object} cfgs An object with attribute name/configuration pairs.
         * @param {Object} values An object with attribute name/value pairs, defining the initial values to apply.
         * Values defined in the cfgs argument will be over-written by values in this argument unless defined as read only.
         * @param {boolean} lazy Whether or not to delay the intialization of these attributes until the first call to get/set.
         * Individual attributes can over-ride this behavior by defining a lazyAdd configuration property in their configuration.
         * See <a href="#method_addAttr">addAttr</a>.
         */
        _addAttrs : function(cfgs, values, lazy) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_addAttrs", 880);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 881);
var host = this, // help compression
                attr,
                attrCfg,
                value;

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 886);
for (attr in cfgs) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 887);
if (cfgs.hasOwnProperty(attr)) {

                    // Not Merging. Caller is responsible for isolating configs
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 890);
attrCfg = cfgs[attr];
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 891);
attrCfg.defaultValue = attrCfg.value;

                    // Handle simple, complex and user values, accounting for read-only
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 894);
value = host._getAttrInitVal(attr, attrCfg, host._tVals);

                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 896);
if (value !== undefined) {
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 897);
attrCfg.value = value;
                    }

                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 900);
if (host._tCfgs[attr]) {
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 901);
delete host._tCfgs[attr];
                    }

                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 904);
host.addAttr(attr, attrCfg, lazy);
                }
            }
        },

        /**
         * Utility method to protect an attribute configuration
         * hash, by merging the entire object and the individual 
         * attr config objects. 
         *
         * @method _protectAttrs
         * @protected
         * @param {Object} attrs A hash of attribute to configuration object pairs.
         * @return {Object} A protected version of the attrs argument.
         */
        _protectAttrs : function(attrs) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_protectAttrs", 919);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 920);
if (attrs) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 921);
attrs = Y.merge(attrs);
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 922);
for (var attr in attrs) {
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 923);
if (attrs.hasOwnProperty(attr)) {
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 924);
attrs[attr] = Y.merge(attrs[attr]);
                    }
                }
            }
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 928);
return attrs;
        },

        /**
         * Utility method to normalize attribute values. The base implementation 
         * simply merges the hash to protect the original.
         *
         * @method _normAttrVals
         * @param {Object} valueHash An object with attribute name/value pairs
         *
         * @return {Object}
         *
         * @private
         */
        _normAttrVals : function(valueHash) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_normAttrVals", 942);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 943);
return (valueHash) ? Y.merge(valueHash) : null;
        },

        /**
         * Returns the initial value of the given attribute from
         * either the default configuration provided, or the 
         * over-ridden value if it exists in the set of initValues 
         * provided and the attribute is not read-only.
         *
         * @param {String} attr The name of the attribute
         * @param {Object} cfg The attribute configuration object
         * @param {Object} initValues The object with simple and complex attribute name/value pairs returned from _normAttrVals
         *
         * @return {Any} The initial value of the attribute.
         *
         * @method _getAttrInitVal
         * @private
         */
        _getAttrInitVal : function(attr, cfg, initValues) {
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_getAttrInitVal", 961);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 962);
var val, valFn;
            // init value is provided by the user if it exists, else, provided by the config
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 964);
if (!cfg.readOnly && initValues && initValues.hasOwnProperty(attr)) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 965);
val = initValues[attr];
            } else {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 967);
val = cfg.value;
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 968);
valFn = cfg.valueFn;
 
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 970);
if (valFn) {
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 971);
if (!valFn.call) {
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 972);
valFn = this[valFn];
                    }
                    _yuitest_coverline("/build/attribute-core/attribute-core.js", 974);
if (valFn) {
                        _yuitest_coverline("/build/attribute-core/attribute-core.js", 975);
val = valFn.call(this, attr);
                    }
                }
            }


            _yuitest_coverline("/build/attribute-core/attribute-core.js", 981);
return val;
        },

        /**
         * Utility method to set up initial attributes defined during construction, either through the constructor.ATTRS property, or explicitly passed in.
         * 
         * @method _initAttrs
         * @protected
         * @param attrs {Object} The attributes to add during construction (passed through to <a href="#method_addAttrs">addAttrs</a>). These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.
         * @param values {Object} The initial attribute values to apply (passed through to <a href="#method_addAttrs">addAttrs</a>). These are not merged/cloned. The caller is responsible for isolating user provided values if required.
         * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href="#method_addAttrs">addAttrs</a>).
         */
        _initAttrs : function(attrs, values, lazy) {
            // ATTRS support for Node, which is not Base based
            _yuitest_coverfunc("/build/attribute-core/attribute-core.js", "_initAttrs", 993);
_yuitest_coverline("/build/attribute-core/attribute-core.js", 995);
attrs = attrs || this.constructor.ATTRS;
    
            _yuitest_coverline("/build/attribute-core/attribute-core.js", 997);
var Base = Y.Base,
                BaseCore = Y.BaseCore,
                baseInst = (Base && Y.instanceOf(this, Base)),
                baseCoreInst = (!baseInst && BaseCore && Y.instanceOf(this, BaseCore));

            _yuitest_coverline("/build/attribute-core/attribute-core.js", 1002);
if ( attrs && !baseInst && !baseCoreInst) {
                _yuitest_coverline("/build/attribute-core/attribute-core.js", 1003);
this.addAttrs(this._protectAttrs(attrs), values, lazy);
            }
        }
    };

    _yuitest_coverline("/build/attribute-core/attribute-core.js", 1008);
Y.AttributeCore = AttributeCore;


}, '@VERSION@' );
