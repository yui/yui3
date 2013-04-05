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
_yuitest_coverage["build/attribute-core/attribute-core.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/attribute-core/attribute-core.js",
    code: []
};
_yuitest_coverage["build/attribute-core/attribute-core.js"].code=["YUI.add('attribute-core', function (Y, NAME) {","","    /**","     * The State class maintains state for a collection of named items, with","     * a varying number of properties defined.","     *","     * It avoids the need to create a separate class for the item, and separate instances","     * of these classes for each item, by storing the state in a 2 level hash table,","     * improving performance when the number of items is likely to be large.","     *","     * @constructor","     * @class State","     */","    Y.State = function() {","        /**","         * Hash of attributes","         * @property data","         */","        this.data = {};","    };","","    Y.State.prototype = {","","        /**","         * Adds a property to an item.","         *","         * @method add","         * @param name {String} The name of the item.","         * @param key {String} The name of the property.","         * @param val {Any} The value of the property.","         */","        add: function(name, key, val) {","            var item = this.data[name];","","            if (!item) {","                item = this.data[name] = {};","            }","","            item[key] = val;","        },","","        /**","         * Adds multiple properties to an item.","         *","         * @method addAll","         * @param name {String} The name of the item.","         * @param obj {Object} A hash of property/value pairs.","         */","        addAll: function(name, obj) {","            var item = this.data[name],","                key;","","            if (!item) {","                item = this.data[name] = {};","            }","","            for (key in obj) {","                if (obj.hasOwnProperty(key)) {","                    item[key] = obj[key];","                }","            }","        },","","        /**","         * Removes a property from an item.","         *","         * @method remove","         * @param name {String} The name of the item.","         * @param key {String} The property to remove.","         */","        remove: function(name, key) {","            var item = this.data[name];","","            if (item) {","                delete item[key];","            }","        },","","        /**","         * Removes multiple properties from an item, or removes the item completely.","         *","         * @method removeAll","         * @param name {String} The name of the item.","         * @param obj {Object|Array} Collection of properties to delete. If not provided, the entire item is removed.","         */","        removeAll: function(name, obj) {","            var data;","","            if (!obj) {","                data = this.data;","","                if (name in data) {","                    delete data[name];","                }","            } else {","                Y.each(obj, function(value, key) {","                    this.remove(name, typeof key === 'string' ? key : value);","                }, this);","            }","        },","","        /**","         * For a given item, returns the value of the property requested, or undefined if not found.","         *","         * @method get","         * @param name {String} The name of the item","         * @param key {String} Optional. The property value to retrieve.","         * @return {Any} The value of the supplied property.","         */","        get: function(name, key) {","            var item = this.data[name];","","            if (item) {","                return item[key];","            }","        },","","        /**","         * For the given item, returns an object with all of the","         * item's property/value pairs. By default the object returned","         * is a shallow copy of the stored data, but passing in true","         * as the second parameter will return a reference to the stored","         * data.","         *","         * @method getAll","         * @param name {String} The name of the item","         * @param reference {boolean} true, if you want a reference to the stored","         * object","         * @return {Object} An object with property/value pairs for the item.","         */","        getAll : function(name, reference) {","            var item = this.data[name],","                key, obj;","","            if (reference) {","                obj = item;","            } else if (item) {","                obj = {};","","                for (key in item) {","                    if (item.hasOwnProperty(key)) {","                        obj[key] = item[key];","                    }","                }","            }","","            return obj;","        }","    };","    /*For log lines*/","    /*jshint maxlen:200*/","","    /**","     * The attribute module provides an augmentable Attribute implementation, which","     * adds configurable attributes and attribute change events to the class being","     * augmented. It also provides a State class, which is used internally by Attribute,","     * but can also be used independently to provide a name/property/value data structure to","     * store state.","     *","     * @module attribute","     */","","    /**","     * The attribute-core submodule provides the lightest level of attribute handling support","     * without Attribute change events, or lesser used methods such as reset(), modifyAttrs(),","     * and removeAttr().","     *","     * @module attribute","     * @submodule attribute-core","     */","    var O = Y.Object,","        Lang = Y.Lang,","","        DOT = \".\",","","        // Externally configurable props","        GETTER = \"getter\",","        SETTER = \"setter\",","        READ_ONLY = \"readOnly\",","        WRITE_ONCE = \"writeOnce\",","        INIT_ONLY = \"initOnly\",","        VALIDATOR = \"validator\",","        VALUE = \"value\",","        VALUE_FN = \"valueFn\",","        LAZY_ADD = \"lazyAdd\",","","        // Used for internal state management","        ADDED = \"added\",","        BYPASS_PROXY = \"_bypassProxy\",","        INIT_VALUE = \"initValue\",","        LAZY = \"lazy\",","","        INVALID_VALUE;","","    /**","     * <p>","     * AttributeCore provides the lightest level of configurable attribute support. It is designed to be","     * augmented on to a host class, and provides the host with the ability to configure","     * attributes to store and retrieve state, <strong>but without support for attribute change events</strong>.","     * </p>","     * <p>For example, attributes added to the host can be configured:</p>","     * <ul>","     *     <li>As read only.</li>","     *     <li>As write once.</li>","     *     <li>With a setter function, which can be used to manipulate","     *     values passed to Attribute's <a href=\"#method_set\">set</a> method, before they are stored.</li>","     *     <li>With a getter function, which can be used to manipulate stored values,","     *     before they are returned by Attribute's <a href=\"#method_get\">get</a> method.</li>","     *     <li>With a validator function, to validate values before they are stored.</li>","     * </ul>","     *","     * <p>See the <a href=\"#method_addAttr\">addAttr</a> method, for the complete set of configuration","     * options available for attributes.</p>","     *","     * <p>Object/Classes based on AttributeCore can augment <a href=\"AttributeObservable.html\">AttributeObservable</a>","     * (with true for overwrite) and <a href=\"AttributeExtras.html\">AttributeExtras</a> to add attribute event and","     * additional, less commonly used attribute methods, such as `modifyAttr`, `removeAttr` and `reset`.</p>","     *","     * @class AttributeCore","     * @param attrs {Object} The attributes to add during construction (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","     *        These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.","     * @param values {Object} The initial attribute values to apply (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","     *        These are not merged/cloned. The caller is responsible for isolating user provided values if required.","     * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","     */","    function AttributeCore(attrs, values, lazy) {","        // HACK: Fix #2531929","        // Complete hack, to make sure the first clone of a node value in IE doesn't doesn't hurt state - maintains 3.4.1 behavior.","        // Too late in the release cycle to do anything about the core problem.","        // The root issue is that cloning a Y.Node instance results in an object which barfs in IE, when you access it's properties (since 3.3.0).","        this._yuievt = null;","","        this._initAttrHost(attrs, values, lazy);","    }","","    /**","     * <p>The value to return from an attribute setter in order to prevent the set from going through.</p>","     *","     * <p>You can return this value from your setter if you wish to combine validator and setter","     * functionality into a single setter function, which either returns the massaged value to be stored or","     * AttributeCore.INVALID_VALUE to prevent invalid values from being stored.</p>","     *","     * @property INVALID_VALUE","     * @type Object","     * @static","     * @final","     */","    AttributeCore.INVALID_VALUE = {};","    INVALID_VALUE = AttributeCore.INVALID_VALUE;","","    /**","     * The list of properties which can be configured for","     * each attribute (e.g. setter, getter, writeOnce etc.).","     *","     * This property is used internally as a whitelist for faster","     * Y.mix operations.","     *","     * @property _ATTR_CFG","     * @type Array","     * @static","     * @protected","     */","    AttributeCore._ATTR_CFG = [SETTER, GETTER, VALIDATOR, VALUE, VALUE_FN, WRITE_ONCE, READ_ONLY, LAZY_ADD, BYPASS_PROXY];","","    /**","     * Utility method to protect an attribute configuration hash, by merging the","     * entire object and the individual attr config objects.","     *","     * @method protectAttrs","     * @static","     * @param {Object} attrs A hash of attribute to configuration object pairs.","     * @return {Object} A protected version of the `attrs` argument.","     */","    AttributeCore.protectAttrs = function (attrs) {","        if (attrs) {","            attrs = Y.merge(attrs);","            for (var attr in attrs) {","                if (attrs.hasOwnProperty(attr)) {","                    attrs[attr] = Y.merge(attrs[attr]);","                }","            }","        }","","        return attrs;","    };","","    AttributeCore.prototype = {","","        /**","         * Constructor logic for attributes. Initializes the host state, and sets up the inital attributes passed to the","         * constructor.","         *","         * @method _initAttrHost","         * @param attrs {Object} The attributes to add during construction (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","         *        These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.","         * @param values {Object} The initial attribute values to apply (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","         *        These are not merged/cloned. The caller is responsible for isolating user provided values if required.","         * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","         * @private","         */","        _initAttrHost : function(attrs, values, lazy) {","            this._state = new Y.State();","            this._initAttrs(attrs, values, lazy);","        },","","        /**","         * <p>","         * Adds an attribute with the provided configuration to the host object.","         * </p>","         * <p>","         * The config argument object supports the following properties:","         * </p>","         *","         * <dl>","         *    <dt>value &#60;Any&#62;</dt>","         *    <dd>The initial value to set on the attribute</dd>","         *","         *    <dt>valueFn &#60;Function | String&#62;</dt>","         *    <dd>","         *    <p>A function, which will return the initial value to set on the attribute. This is useful","         *    for cases where the attribute configuration is defined statically, but needs to","         *    reference the host instance (\"this\") to obtain an initial value. If both the value and valueFn properties are defined,","         *    the value returned by the valueFn has precedence over the value property, unless it returns undefined, in which","         *    case the value property is used.</p>","         *","         *    <p>valueFn can also be set to a string, representing the name of the instance method to be used to retrieve the value.</p>","         *    </dd>","         *","         *    <dt>readOnly &#60;boolean&#62;</dt>","         *    <dd>Whether or not the attribute is read only. Attributes having readOnly set to true","         *        cannot be modified by invoking the set method.</dd>","         *","         *    <dt>writeOnce &#60;boolean&#62; or &#60;string&#62;</dt>","         *    <dd>","         *        Whether or not the attribute is \"write once\". Attributes having writeOnce set to true,","         *        can only have their values set once, be it through the default configuration,","         *        constructor configuration arguments, or by invoking set.","         *        <p>The writeOnce attribute can also be set to the string \"initOnly\",","         *         in which case the attribute can only be set during initialization","         *        (when used with Base, this means it can only be set during construction)</p>","         *    </dd>","         *","         *    <dt>setter &#60;Function | String&#62;</dt>","         *    <dd>","         *    <p>The setter function used to massage or normalize the value passed to the set method for the attribute.","         *    The value returned by the setter will be the final stored value. Returning","         *    <a href=\"#property_Attribute.INVALID_VALUE\">Attribute.INVALID_VALUE</a>, from the setter will prevent","         *    the value from being stored.","         *    </p>","         *","         *    <p>setter can also be set to a string, representing the name of the instance method to be used as the setter function.</p>","         *    </dd>","         *","         *    <dt>getter &#60;Function | String&#62;</dt>","         *    <dd>","         *    <p>","         *    The getter function used to massage or normalize the value returned by the get method for the attribute.","         *    The value returned by the getter function is the value which will be returned to the user when they","         *    invoke get.","         *    </p>","         *","         *    <p>getter can also be set to a string, representing the name of the instance method to be used as the getter function.</p>","         *    </dd>","         *","         *    <dt>validator &#60;Function | String&#62;</dt>","         *    <dd>","         *    <p>","         *    The validator function invoked prior to setting the stored value. Returning","         *    false from the validator function will prevent the value from being stored.","         *    </p>","         *","         *    <p>validator can also be set to a string, representing the name of the instance method to be used as the validator function.</p>","         *    </dd>","         *","         *    <dt>lazyAdd &#60;boolean&#62;</dt>","         *    <dd>Whether or not to delay initialization of the attribute until the first call to get/set it.","         *    This flag can be used to over-ride lazy initialization on a per attribute basis, when adding multiple attributes through","         *    the <a href=\"#method_addAttrs\">addAttrs</a> method.</dd>","         *","         * </dl>","         *","         * <p>The setter, getter and validator are invoked with the value and name passed in as the first and second arguments, and with","         * the context (\"this\") set to the host object.</p>","         *","         * <p>Configuration properties outside of the list mentioned above are considered private properties used internally by attribute,","         * and are not intended for public use.</p>","         *","         * @method addAttr","         *","         * @param {String} name The name of the attribute.","         * @param {Object} config An object with attribute configuration property/value pairs, specifying the configuration for the attribute.","         *","         * <p>","         * <strong>NOTE:</strong> The configuration object is modified when adding an attribute, so if you need","         * to protect the original values, you will need to merge the object.","         * </p>","         *","         * @param {boolean} lazy (optional) Whether or not to add this attribute lazily (on the first call to get/set).","         *","         * @return {Object} A reference to the host object.","         *","         * @chainable","         */","        addAttr : function(name, config, lazy) {","","","            var host = this, // help compression","                state = host._state,","                value,","                added,","                hasValue;","","            config = config || {};","","            if (LAZY_ADD in config) {","                lazy = config[LAZY_ADD];","            }","","            added = state.get(name, ADDED);","","            if (lazy && !added) {","                state.data[name] = {","                    lazy : config,","                    added : true","                };","            } else {","","","                if (!added || config.isLazyAdd) {","","                    hasValue = (VALUE in config);","","","                    if (hasValue) {","","                        // We'll go through set, don't want to set value in config directly","","                        // PERF TODO: VALIDATE: See if setting this to undefined is sufficient. We use to delete before.","                        // In certain code paths/use cases, undefined may not be the same as not present.","                        // If not, we can set it to some known fixed value (like INVALID_VALUE, say INITIALIZING_VALUE) for performance,","                        // to avoid a delete which seems to help a lot.","","                        value = config.value;","                        config.value = undefined;","                    }","","                    config.added = true;","                    config.initializing = true;","","                    state.data[name] = config;","","                    if (hasValue) {","                        // Go through set, so that raw values get normalized/validated","                        host.set(name, value);","                    }","","                    config.initializing = false;","                }","            }","","            return host;","        },","","        /**","         * Checks if the given attribute has been added to the host","         *","         * @method attrAdded","         * @param {String} name The name of the attribute to check.","         * @return {boolean} true if an attribute with the given name has been added, false if it hasn't.","         *         This method will return true for lazily added attributes.","         */","        attrAdded: function(name) {","            return !!(this._state.get(name, ADDED));","        },","","        /**","         * Returns the current value of the attribute. If the attribute","         * has been configured with a 'getter' function, this method will delegate","         * to the 'getter' to obtain the value of the attribute.","         *","         * @method get","         *","         * @param {String} name The name of the attribute. If the value of the attribute is an Object,","         * dot notation can be used to obtain the value of a property of the object (e.g. <code>get(\"x.y.z\")</code>)","         *","         * @return {Any} The value of the attribute","         */","        get : function(name) {","            return this._getAttr(name);","        },","","        /**","         * Checks whether or not the attribute is one which has been","         * added lazily and still requires initialization.","         *","         * @method _isLazyAttr","         * @private","         * @param {String} name The name of the attribute","         * @return {boolean} true if it's a lazily added attribute, false otherwise.","         */","        _isLazyAttr: function(name) {","            return this._state.get(name, LAZY);","        },","","        /**","         * Finishes initializing an attribute which has been lazily added.","         *","         * @method _addLazyAttr","         * @private","         * @param {Object} name The name of the attribute","         * @param {Object} [lazyCfg] Optional config hash for the attribute. This is added for performance","         * along the critical path, where the calling method has already obtained lazy config from state.","         */","        _addLazyAttr: function(name, lazyCfg) {","            var state = this._state;","","            lazyCfg = lazyCfg || state.get(name, LAZY);","","            if (lazyCfg) {","                // PERF TODO: For App's id override, otherwise wouldn't be","                // needed. It expects to find it in the cfg for it's","                // addAttr override. Would like to remove, once App override is","                // removed.","                state.data[name].lazy = undefined;","","                lazyCfg.isLazyAdd = true;","                this.addAttr(name, lazyCfg);","            }","        },","","        /**","         * Sets the value of an attribute.","         *","         * @method set","         * @chainable","         *","         * @param {String} name The name of the attribute. If the","         * current value of the attribute is an Object, dot notation can be used","         * to set the value of a property within the object (e.g. <code>set(\"x.y.z\", 5)</code>).","         * @param {Any} value The value to set the attribute to.","         * @param {Object} [opts] Optional data providing the circumstances for the change.","         * @return {Object} A reference to the host object.","         */","        set : function(name, val, opts) {","            return this._setAttr(name, val, opts);","        },","","        /**","         * Allows setting of readOnly/writeOnce attributes. See <a href=\"#method_set\">set</a> for argument details.","         *","         * @method _set","         * @protected","         * @chainable","         *","         * @param {String} name The name of the attribute.","         * @param {Any} val The value to set the attribute to.","         * @param {Object} [opts] Optional data providing the circumstances for the change.","         * @return {Object} A reference to the host object.","         */","        _set : function(name, val, opts) {","            return this._setAttr(name, val, opts, true);","        },","","        /**","         * Provides the common implementation for the public set and protected _set methods.","         *","         * See <a href=\"#method_set\">set</a> for argument details.","         *","         * @method _setAttr","         * @protected","         * @chainable","         *","         * @param {String} name The name of the attribute.","         * @param {Any} value The value to set the attribute to.","         * @param {Object} [opts] Optional data providing the circumstances for the change.","         * @param {boolean} force If true, allows the caller to set values for","         * readOnly or writeOnce attributes which have already been set.","         *","         * @return {Object} A reference to the host object.","         */","        _setAttr : function(name, val, opts, force)  {","            var allowSet = true,","                state = this._state,","                stateProxy = this._stateProxy,","                cfg,","                initialSet,","                strPath,","                path,","                currVal,","                writeOnce,","                initializing;","","            if (name.indexOf(DOT) !== -1) {","                strPath = name;","","                path = name.split(DOT);","                name = path.shift();","            }","","            cfg = state.data[name] || {};","","            if (cfg.lazy) {","                cfg = cfg.lazy;","                this._addLazyAttr(name, cfg);","            }","","            initialSet = (cfg.value === undefined);","","            if (stateProxy && name in stateProxy && !cfg._bypassProxy) {","                // TODO: Value is always set for proxy. Can we do any better? Maybe take a snapshot as the initial value for the first call to set?","                initialSet = false;","            }","","            writeOnce = cfg.writeOnce;","            initializing = cfg.initializing;","","            if (!initialSet && !force) {","","                if (writeOnce) {","                    allowSet = false;","                }","","                if (cfg.readOnly) {","                    allowSet = false;","                }","            }","","            if (!initializing && !force && writeOnce === INIT_ONLY) {","                allowSet = false;","            }","","            if (allowSet) {","                // Don't need currVal if initialSet (might fail in custom getter if it always expects a non-undefined/non-null value)","                if (!initialSet) {","                    currVal =  this.get(name);","                }","","                if (path) {","                   val = O.setValue(Y.clone(currVal), path, val);","","                   if (val === undefined) {","                       allowSet = false;","                   }","                }","","                if (allowSet) {","                    if (!this._fireAttrChange || initializing) {","                        this._setAttrVal(name, strPath, currVal, val, opts, cfg);","                    } else {","                        // HACK - no real reason core needs to know about _fireAttrChange, but","                        // it adds fn hops if we want to break it out. Not sure it's worth it for this critical path","                        this._fireAttrChange(name, strPath, currVal, val, opts, cfg);","                    }","                }","            }","","            return this;","        },","","        /**","         * Provides the common implementation for the public get method,","         * allowing Attribute hosts to over-ride either method.","         *","         * See <a href=\"#method_get\">get</a> for argument details.","         *","         * @method _getAttr","         * @protected","         * @chainable","         *","         * @param {String} name The name of the attribute.","         * @return {Any} The value of the attribute.","         */","        _getAttr : function(name) {","            var fullName = name,","                tCfgs    = this._tCfgs,","                path,","                getter,","                val,","                attrCfg,","                cfg;","","            if (name.indexOf(DOT) !== -1) {","                path = name.split(DOT);","                name = path.shift();","            }","","            // On Demand - Should be rare - handles out of order valueFn references","            if (tCfgs && tCfgs[name]) {","                cfg = {};","                cfg[name] = tCfgs[name];","                delete tCfgs[name];","                this._addAttrs(cfg, this._tVals);","            }","","            attrCfg = this._state.data[name] || {};","","            // Lazy Init","            if (attrCfg.lazy) {","                attrCfg = attrCfg.lazy;","                this._addLazyAttr(name, attrCfg);","            }","","            val = this._getStateVal(name, attrCfg);","","            getter = attrCfg.getter;","","            if (getter && !getter.call) {","                getter = this[getter];","            }","","            val = (getter) ? getter.call(this, val, fullName) : val;","            val = (path) ? O.getValue(val, path) : val;","","            return val;","        },","","        /**","         * Gets the stored value for the attribute, from either the","         * internal state object, or the state proxy if it exits","         *","         * @method _getStateVal","         * @private","         * @param {String} name The name of the attribute","         * @param {Object} [cfg] Optional config hash for the attribute. This is added for performance along the critical path,","         * where the calling method has already obtained the config from state.","         *","         * @return {Any} The stored value of the attribute","         */","        _getStateVal : function(name, cfg) {","            var stateProxy = this._stateProxy;","","            if (!cfg) {","                cfg = this._state.getAll(name) || {};","            }","","            return (stateProxy && (name in stateProxy) && !(cfg._bypassProxy)) ? stateProxy[name] : cfg.value;","        },","","        /**","         * Sets the stored value for the attribute, in either the","         * internal state object, or the state proxy if it exits","         *","         * @method _setStateVal","         * @private","         * @param {String} name The name of the attribute","         * @param {Any} value The value of the attribute","         */","        _setStateVal : function(name, value) {","            var stateProxy = this._stateProxy;","            if (stateProxy && (name in stateProxy) && !this._state.get(name, BYPASS_PROXY)) {","                stateProxy[name] = value;","            } else {","                this._state.add(name, VALUE, value);","            }","        },","","        /**","         * Updates the stored value of the attribute in the privately held State object,","         * if validation and setter passes.","         *","         * @method _setAttrVal","         * @private","         * @param {String} attrName The attribute name.","         * @param {String} subAttrName The sub-attribute name, if setting a sub-attribute property (\"x.y.z\").","         * @param {Any} prevVal The currently stored value of the attribute.","         * @param {Any} newVal The value which is going to be stored.","         * @param {Object} [opts] Optional data providing the circumstances for the change.","         * @param {Object} [attrCfg] Optional config hash for the attribute. This is added for performance along the critical path,","         * where the calling method has already obtained the config from state.","         *","         * @return {booolean} true if the new attribute value was stored, false if not.","         */","        _setAttrVal : function(attrName, subAttrName, prevVal, newVal, opts, attrCfg) {","","            var host = this,","                allowSet = true,","                cfg = attrCfg || this._state.data[attrName] || {},","                validator = cfg.validator,","                setter = cfg.setter,","                initializing = cfg.initializing,","                prevRawVal = this._getStateVal(attrName, cfg),","                name = subAttrName || attrName,","                retVal,","                valid;","","            if (validator) {","                if (!validator.call) {","                    // Assume string - trying to keep critical path tight, so avoiding Lang check","                    validator = this[validator];","                }","                if (validator) {","                    valid = validator.call(host, newVal, name, opts);","","                    if (!valid && initializing) {","                        newVal = cfg.defaultValue;","                        valid = true; // Assume it's valid, for perf.","                    }","                }","            }","","            if (!validator || valid) {","                if (setter) {","                    if (!setter.call) {","                        // Assume string - trying to keep critical path tight, so avoiding Lang check","                        setter = this[setter];","                    }","                    if (setter) {","                        retVal = setter.call(host, newVal, name, opts);","","                        if (retVal === INVALID_VALUE) {","                            if (initializing) {","                                newVal = cfg.defaultValue;","                            } else {","                                allowSet = false;","                            }","                        } else if (retVal !== undefined){","                            newVal = retVal;","                        }","                    }","                }","","                if (allowSet) {","                    if(!subAttrName && (newVal === prevRawVal) && !Lang.isObject(newVal)) {","                        allowSet = false;","                    } else {","                        // Store value","                        if (!(INIT_VALUE in cfg)) {","                            cfg.initValue = newVal;","                        }","                        host._setStateVal(attrName, newVal);","                    }","                }","","            } else {","                allowSet = false;","            }","","            return allowSet;","        },","","        /**","         * Sets multiple attribute values.","         *","         * @method setAttrs","         * @param {Object} attrs  An object with attributes name/value pairs.","         * @param {Object} [opts] Optional data providing the circumstances for the change.","         * @return {Object} A reference to the host object.","         * @chainable","         */","        setAttrs : function(attrs, opts) {","            return this._setAttrs(attrs, opts);","        },","","        /**","         * Implementation behind the public setAttrs method, to set multiple attribute values.","         *","         * @method _setAttrs","         * @protected","         * @param {Object} attrs  An object with attributes name/value pairs.","         * @param {Object} [opts] Optional data providing the circumstances for the change","         * @return {Object} A reference to the host object.","         * @chainable","         */","        _setAttrs : function(attrs, opts) {","            var attr;","            for (attr in attrs) {","                if ( attrs.hasOwnProperty(attr) ) {","                    this.set(attr, attrs[attr], opts);","                }","            }","            return this;","        },","","        /**","         * Gets multiple attribute values.","         *","         * @method getAttrs","         * @param {Array | boolean} attrs Optional. An array of attribute names. If omitted, all attribute values are","         * returned. If set to true, all attributes modified from their initial values are returned.","         * @return {Object} An object with attribute name/value pairs.","         */","        getAttrs : function(attrs) {","            return this._getAttrs(attrs);","        },","","        /**","         * Implementation behind the public getAttrs method, to get multiple attribute values.","         *","         * @method _getAttrs","         * @protected","         * @param {Array | boolean} attrs Optional. An array of attribute names. If omitted, all attribute values are","         * returned. If set to true, all attributes modified from their initial values are returned.","         * @return {Object} An object with attribute name/value pairs.","         */","        _getAttrs : function(attrs) {","            var obj = {},","                attr, i, len,","                modifiedOnly = (attrs === true);","","            // TODO - figure out how to get all \"added\"","            if (!attrs || modifiedOnly) {","                attrs = O.keys(this._state.data);","            }","","            for (i = 0, len = attrs.length; i < len; i++) {","                attr = attrs[i];","","                if (!modifiedOnly || this._getStateVal(attr) != this._state.get(attr, INIT_VALUE)) {","                    // Go through get, to honor cloning/normalization","                    obj[attr] = this.get(attr);","                }","            }","","            return obj;","        },","","        /**","         * Configures a group of attributes, and sets initial values.","         *","         * <p>","         * <strong>NOTE:</strong> This method does not isolate the configuration object by merging/cloning.","         * The caller is responsible for merging/cloning the configuration object if required.","         * </p>","         *","         * @method addAttrs","         * @chainable","         *","         * @param {Object} cfgs An object with attribute name/configuration pairs.","         * @param {Object} values An object with attribute name/value pairs, defining the initial values to apply.","         * Values defined in the cfgs argument will be over-written by values in this argument unless defined as read only.","         * @param {boolean} lazy Whether or not to delay the intialization of these attributes until the first call to get/set.","         * Individual attributes can over-ride this behavior by defining a lazyAdd configuration property in their configuration.","         * See <a href=\"#method_addAttr\">addAttr</a>.","         *","         * @return {Object} A reference to the host object.","         */","        addAttrs : function(cfgs, values, lazy) {","            if (cfgs) {","                this._tCfgs = cfgs;","                this._tVals = (values) ? this._normAttrVals(values) : null;","                this._addAttrs(cfgs, this._tVals, lazy);","                this._tCfgs = this._tVals = null;","            }","","            return this;","        },","","        /**","         * Implementation behind the public addAttrs method.","         *","         * This method is invoked directly by get if it encounters a scenario","         * in which an attribute's valueFn attempts to obtain the","         * value an attribute in the same group of attributes, which has not yet","         * been added (on demand initialization).","         *","         * @method _addAttrs","         * @private","         * @param {Object} cfgs An object with attribute name/configuration pairs.","         * @param {Object} values An object with attribute name/value pairs, defining the initial values to apply.","         * Values defined in the cfgs argument will be over-written by values in this argument unless defined as read only.","         * @param {boolean} lazy Whether or not to delay the intialization of these attributes until the first call to get/set.","         * Individual attributes can over-ride this behavior by defining a lazyAdd configuration property in their configuration.","         * See <a href=\"#method_addAttr\">addAttr</a>.","         */","        _addAttrs : function(cfgs, values, lazy) {","            var tCfgs = this._tCfgs,","                tVals = this._tVals,","                attr,","                attrCfg,","                value;","","            for (attr in cfgs) {","                if (cfgs.hasOwnProperty(attr)) {","","                    // Not Merging. Caller is responsible for isolating configs","                    attrCfg = cfgs[attr];","                    attrCfg.defaultValue = attrCfg.value;","","                    // Handle simple, complex and user values, accounting for read-only","                    value = this._getAttrInitVal(attr, attrCfg, tVals);","","                    if (value !== undefined) {","                        attrCfg.value = value;","                    }","","                    if (tCfgs[attr]) {","                        tCfgs[attr] = undefined;","                    }","","                    this.addAttr(attr, attrCfg, lazy);","                }","            }","        },","","        /**","         * Utility method to protect an attribute configuration","         * hash, by merging the entire object and the individual","         * attr config objects.","         *","         * @method _protectAttrs","         * @protected","         * @param {Object} attrs A hash of attribute to configuration object pairs.","         * @return {Object} A protected version of the attrs argument.","         * @deprecated Use `AttributeCore.protectAttrs()` or","         *   `Attribute.protectAttrs()` which are the same static utility method.","         */","        _protectAttrs : AttributeCore.protectAttrs,","","        /**","         * Utility method to normalize attribute values. The base implementation","         * simply merges the hash to protect the original.","         *","         * @method _normAttrVals","         * @param {Object} valueHash An object with attribute name/value pairs","         *","         * @return {Object} An object literal with 2 properties - \"simple\" and \"complex\",","         * containing simple and complex attribute values respectively keyed","         * by the top level attribute name, or null, if valueHash is falsey.","         *","         * @private","         */","        _normAttrVals : function(valueHash) {","            var vals,","                subvals,","                path,","                attr,","                v, k;","","            if (!valueHash) {","                return null;","            }","","            vals = {};","","            for (k in valueHash) {","                if (valueHash.hasOwnProperty(k)) {","                    if (k.indexOf(DOT) !== -1) {","                        path = k.split(DOT);","                        attr = path.shift();","","                        subvals = subvals || {};","","                        v = subvals[attr] = subvals[attr] || [];","                        v[v.length] = {","                            path : path,","                            value: valueHash[k]","                        };","                    } else {","                        vals[k] = valueHash[k];","                    }","                }","            }","","            return { simple:vals, complex:subvals };","        },","","        /**","         * Returns the initial value of the given attribute from","         * either the default configuration provided, or the","         * over-ridden value if it exists in the set of initValues","         * provided and the attribute is not read-only.","         *","         * @param {String} attr The name of the attribute","         * @param {Object} cfg The attribute configuration object","         * @param {Object} initValues The object with simple and complex attribute name/value pairs returned from _normAttrVals","         *","         * @return {Any} The initial value of the attribute.","         *","         * @method _getAttrInitVal","         * @private","         */","        _getAttrInitVal : function(attr, cfg, initValues) {","            var val = cfg.value,","                valFn = cfg.valueFn,","                tmpVal,","                initValSet = false,","                readOnly = cfg.readOnly,","                simple,","                complex,","                i,","                l,","                path,","                subval,","                subvals;","","            if (!readOnly && initValues) {","                // Simple Attributes","                simple = initValues.simple;","                if (simple && simple.hasOwnProperty(attr)) {","                    val = simple[attr];","                    initValSet = true;","                }","            }","","            if (valFn && !initValSet) {","                if (!valFn.call) {","                    valFn = this[valFn];","                }","                if (valFn) {","                    tmpVal = valFn.call(this, attr);","                    val = tmpVal;","                }","            }","","            if (!readOnly && initValues) {","","                // Complex Attributes (complex values applied, after simple, in case both are set)","                complex = initValues.complex;","","                if (complex && complex.hasOwnProperty(attr) && (val !== undefined) && (val !== null)) {","                    subvals = complex[attr];","                    for (i = 0, l = subvals.length; i < l; ++i) {","                        path = subvals[i].path;","                        subval = subvals[i].value;","                        O.setValue(val, path, subval);","                    }","                }","            }","","            return val;","        },","","        /**","         * Utility method to set up initial attributes defined during construction,","         * either through the constructor.ATTRS property, or explicitly passed in.","         *","         * @method _initAttrs","         * @protected","         * @param attrs {Object} The attributes to add during construction (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","         *        These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.","         * @param values {Object} The initial attribute values to apply (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","         *        These are not merged/cloned. The caller is responsible for isolating user provided values if required.","         * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","         */","        _initAttrs : function(attrs, values, lazy) {","            // ATTRS support for Node, which is not Base based","            attrs = attrs || this.constructor.ATTRS;","","            var Base = Y.Base,","                BaseCore = Y.BaseCore,","                baseInst = (Base && Y.instanceOf(this, Base)),","                baseCoreInst = (!baseInst && BaseCore && Y.instanceOf(this, BaseCore));","","            if (attrs && !baseInst && !baseCoreInst) {","                this.addAttrs(Y.AttributeCore.protectAttrs(attrs), values, lazy);","            }","        }","    };","","    Y.AttributeCore = AttributeCore;","","","}, '@VERSION@', {\"requires\": [\"oop\"]});"];
_yuitest_coverage["build/attribute-core/attribute-core.js"].lines = {"1":0,"14":0,"19":0,"22":0,"33":0,"35":0,"36":0,"39":0,"50":0,"53":0,"54":0,"57":0,"58":0,"59":0,"72":0,"74":0,"75":0,"87":0,"89":0,"90":0,"92":0,"93":0,"96":0,"97":0,"111":0,"113":0,"114":0,"132":0,"135":0,"136":0,"137":0,"138":0,"140":0,"141":0,"142":0,"147":0,"171":0,"226":0,"231":0,"233":0,"248":0,"249":0,"263":0,"274":0,"275":0,"276":0,"277":0,"278":0,"279":0,"284":0,"287":0,"302":0,"303":0,"407":0,"413":0,"415":0,"416":0,"419":0,"421":0,"422":0,"429":0,"431":0,"434":0,"443":0,"444":0,"447":0,"448":0,"450":0,"452":0,"454":0,"457":0,"461":0,"473":0,"489":0,"502":0,"515":0,"517":0,"519":0,"524":0,"526":0,"527":0,"545":0,"561":0,"582":0,"593":0,"594":0,"596":0,"597":0,"600":0,"602":0,"603":0,"604":0,"607":0,"609":0,"611":0,"614":0,"615":0,"617":0,"619":0,"620":0,"623":0,"624":0,"628":0,"629":0,"632":0,"634":0,"635":0,"638":0,"639":0,"641":0,"642":0,"646":0,"647":0,"648":0,"652":0,"657":0,"674":0,"682":0,"683":0,"684":0,"688":0,"689":0,"690":0,"691":0,"692":0,"695":0,"698":0,"699":0,"700":0,"703":0,"705":0,"707":0,"708":0,"711":0,"712":0,"714":0,"730":0,"732":0,"733":0,"736":0,"749":0,"750":0,"751":0,"753":0,"775":0,"786":0,"787":0,"789":0,"791":0,"792":0,"794":0,"795":0,"796":0,"801":0,"802":0,"803":0,"805":0,"807":0,"808":0,"810":0,"811":0,"812":0,"814":0,"816":0,"817":0,"822":0,"823":0,"824":0,"827":0,"828":0,"830":0,"835":0,"838":0,"851":0,"865":0,"866":0,"867":0,"868":0,"871":0,"883":0,"896":0,"901":0,"902":0,"905":0,"906":0,"908":0,"910":0,"914":0,"938":0,"939":0,"940":0,"941":0,"942":0,"945":0,"966":0,"972":0,"973":0,"976":0,"977":0,"980":0,"982":0,"983":0,"986":0,"987":0,"990":0,"1023":0,"1029":0,"1030":0,"1033":0,"1035":0,"1036":0,"1037":0,"1038":0,"1039":0,"1041":0,"1043":0,"1044":0,"1049":0,"1054":0,"1073":0,"1086":0,"1088":0,"1089":0,"1090":0,"1091":0,"1095":0,"1096":0,"1097":0,"1099":0,"1100":0,"1101":0,"1105":0,"1108":0,"1110":0,"1111":0,"1112":0,"1113":0,"1114":0,"1115":0,"1120":0,"1137":0,"1139":0,"1144":0,"1145":0,"1150":0};
_yuitest_coverage["build/attribute-core/attribute-core.js"].functions = {"State:14":0,"add:32":0,"addAll:49":0,"remove:71":0,"(anonymous 2):96":0,"removeAll:86":0,"get:110":0,"getAll:131":0,"AttributeCore:226":0,"protectAttrs:274":0,"_initAttrHost:301":0,"addAttr:404":0,"attrAdded:472":0,"get:488":0,"_isLazyAttr:501":0,"_addLazyAttr:514":0,"set:544":0,"_set:560":0,"_setAttr:581":0,"_getAttr:673":0,"_getStateVal:729":0,"_setStateVal:748":0,"_setAttrVal:773":0,"setAttrs:850":0,"_setAttrs:864":0,"getAttrs:882":0,"_getAttrs:895":0,"addAttrs:937":0,"_addAttrs:965":0,"_normAttrVals:1022":0,"_getAttrInitVal:1072":0,"_initAttrs:1135":0,"(anonymous 1):1":0};
_yuitest_coverage["build/attribute-core/attribute-core.js"].coveredLines = 245;
_yuitest_coverage["build/attribute-core/attribute-core.js"].coveredFunctions = 33;
_yuitest_coverline("build/attribute-core/attribute-core.js", 1);
YUI.add('attribute-core', function (Y, NAME) {

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
    _yuitest_coverfunc("build/attribute-core/attribute-core.js", "(anonymous 1)", 1);
_yuitest_coverline("build/attribute-core/attribute-core.js", 14);
Y.State = function() {
        /**
         * Hash of attributes
         * @property data
         */
        _yuitest_coverfunc("build/attribute-core/attribute-core.js", "State", 14);
_yuitest_coverline("build/attribute-core/attribute-core.js", 19);
this.data = {};
    };

    _yuitest_coverline("build/attribute-core/attribute-core.js", 22);
Y.State.prototype = {

        /**
         * Adds a property to an item.
         *
         * @method add
         * @param name {String} The name of the item.
         * @param key {String} The name of the property.
         * @param val {Any} The value of the property.
         */
        add: function(name, key, val) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "add", 32);
_yuitest_coverline("build/attribute-core/attribute-core.js", 33);
var item = this.data[name];

            _yuitest_coverline("build/attribute-core/attribute-core.js", 35);
if (!item) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 36);
item = this.data[name] = {};
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 39);
item[key] = val;
        },

        /**
         * Adds multiple properties to an item.
         *
         * @method addAll
         * @param name {String} The name of the item.
         * @param obj {Object} A hash of property/value pairs.
         */
        addAll: function(name, obj) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "addAll", 49);
_yuitest_coverline("build/attribute-core/attribute-core.js", 50);
var item = this.data[name],
                key;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 53);
if (!item) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 54);
item = this.data[name] = {};
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 57);
for (key in obj) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 58);
if (obj.hasOwnProperty(key)) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 59);
item[key] = obj[key];
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
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "remove", 71);
_yuitest_coverline("build/attribute-core/attribute-core.js", 72);
var item = this.data[name];

            _yuitest_coverline("build/attribute-core/attribute-core.js", 74);
if (item) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 75);
delete item[key];
            }
        },

        /**
         * Removes multiple properties from an item, or removes the item completely.
         *
         * @method removeAll
         * @param name {String} The name of the item.
         * @param obj {Object|Array} Collection of properties to delete. If not provided, the entire item is removed.
         */
        removeAll: function(name, obj) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "removeAll", 86);
_yuitest_coverline("build/attribute-core/attribute-core.js", 87);
var data;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 89);
if (!obj) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 90);
data = this.data;

                _yuitest_coverline("build/attribute-core/attribute-core.js", 92);
if (name in data) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 93);
delete data[name];
                }
            } else {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 96);
Y.each(obj, function(value, key) {
                    _yuitest_coverfunc("build/attribute-core/attribute-core.js", "(anonymous 2)", 96);
_yuitest_coverline("build/attribute-core/attribute-core.js", 97);
this.remove(name, typeof key === 'string' ? key : value);
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
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "get", 110);
_yuitest_coverline("build/attribute-core/attribute-core.js", 111);
var item = this.data[name];

            _yuitest_coverline("build/attribute-core/attribute-core.js", 113);
if (item) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 114);
return item[key];
            }
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
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "getAll", 131);
_yuitest_coverline("build/attribute-core/attribute-core.js", 132);
var item = this.data[name],
                key, obj;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 135);
if (reference) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 136);
obj = item;
            } else {_yuitest_coverline("build/attribute-core/attribute-core.js", 137);
if (item) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 138);
obj = {};

                _yuitest_coverline("build/attribute-core/attribute-core.js", 140);
for (key in item) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 141);
if (item.hasOwnProperty(key)) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 142);
obj[key] = item[key];
                    }
                }
            }}

            _yuitest_coverline("build/attribute-core/attribute-core.js", 147);
return obj;
        }
    };
    /*For log lines*/
    /*jshint maxlen:200*/

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
    _yuitest_coverline("build/attribute-core/attribute-core.js", 171);
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
        INIT_VALUE = "initValue",
        LAZY = "lazy",

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
     * <p>Object/Classes based on AttributeCore can augment <a href="AttributeObservable.html">AttributeObservable</a>
     * (with true for overwrite) and <a href="AttributeExtras.html">AttributeExtras</a> to add attribute event and
     * additional, less commonly used attribute methods, such as `modifyAttr`, `removeAttr` and `reset`.</p>
     *
     * @class AttributeCore
     * @param attrs {Object} The attributes to add during construction (passed through to <a href="#method_addAttrs">addAttrs</a>).
     *        These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.
     * @param values {Object} The initial attribute values to apply (passed through to <a href="#method_addAttrs">addAttrs</a>).
     *        These are not merged/cloned. The caller is responsible for isolating user provided values if required.
     * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href="#method_addAttrs">addAttrs</a>).
     */
    _yuitest_coverline("build/attribute-core/attribute-core.js", 226);
function AttributeCore(attrs, values, lazy) {
        // HACK: Fix #2531929
        // Complete hack, to make sure the first clone of a node value in IE doesn't doesn't hurt state - maintains 3.4.1 behavior.
        // Too late in the release cycle to do anything about the core problem.
        // The root issue is that cloning a Y.Node instance results in an object which barfs in IE, when you access it's properties (since 3.3.0).
        _yuitest_coverfunc("build/attribute-core/attribute-core.js", "AttributeCore", 226);
_yuitest_coverline("build/attribute-core/attribute-core.js", 231);
this._yuievt = null;

        _yuitest_coverline("build/attribute-core/attribute-core.js", 233);
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
    _yuitest_coverline("build/attribute-core/attribute-core.js", 248);
AttributeCore.INVALID_VALUE = {};
    _yuitest_coverline("build/attribute-core/attribute-core.js", 249);
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
    _yuitest_coverline("build/attribute-core/attribute-core.js", 263);
AttributeCore._ATTR_CFG = [SETTER, GETTER, VALIDATOR, VALUE, VALUE_FN, WRITE_ONCE, READ_ONLY, LAZY_ADD, BYPASS_PROXY];

    /**
     * Utility method to protect an attribute configuration hash, by merging the
     * entire object and the individual attr config objects.
     *
     * @method protectAttrs
     * @static
     * @param {Object} attrs A hash of attribute to configuration object pairs.
     * @return {Object} A protected version of the `attrs` argument.
     */
    _yuitest_coverline("build/attribute-core/attribute-core.js", 274);
AttributeCore.protectAttrs = function (attrs) {
        _yuitest_coverfunc("build/attribute-core/attribute-core.js", "protectAttrs", 274);
_yuitest_coverline("build/attribute-core/attribute-core.js", 275);
if (attrs) {
            _yuitest_coverline("build/attribute-core/attribute-core.js", 276);
attrs = Y.merge(attrs);
            _yuitest_coverline("build/attribute-core/attribute-core.js", 277);
for (var attr in attrs) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 278);
if (attrs.hasOwnProperty(attr)) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 279);
attrs[attr] = Y.merge(attrs[attr]);
                }
            }
        }

        _yuitest_coverline("build/attribute-core/attribute-core.js", 284);
return attrs;
    };

    _yuitest_coverline("build/attribute-core/attribute-core.js", 287);
AttributeCore.prototype = {

        /**
         * Constructor logic for attributes. Initializes the host state, and sets up the inital attributes passed to the
         * constructor.
         *
         * @method _initAttrHost
         * @param attrs {Object} The attributes to add during construction (passed through to <a href="#method_addAttrs">addAttrs</a>).
         *        These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.
         * @param values {Object} The initial attribute values to apply (passed through to <a href="#method_addAttrs">addAttrs</a>).
         *        These are not merged/cloned. The caller is responsible for isolating user provided values if required.
         * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href="#method_addAttrs">addAttrs</a>).
         * @private
         */
        _initAttrHost : function(attrs, values, lazy) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_initAttrHost", 301);
_yuitest_coverline("build/attribute-core/attribute-core.js", 302);
this._state = new Y.State();
            _yuitest_coverline("build/attribute-core/attribute-core.js", 303);
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
         *        <p>The writeOnce attribute can also be set to the string "initOnly",
         *         in which case the attribute can only be set during initialization
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
        addAttr : function(name, config, lazy) {


            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "addAttr", 404);
_yuitest_coverline("build/attribute-core/attribute-core.js", 407);
var host = this, // help compression
                state = host._state,
                value,
                added,
                hasValue;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 413);
config = config || {};

            _yuitest_coverline("build/attribute-core/attribute-core.js", 415);
if (LAZY_ADD in config) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 416);
lazy = config[LAZY_ADD];
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 419);
added = state.get(name, ADDED);

            _yuitest_coverline("build/attribute-core/attribute-core.js", 421);
if (lazy && !added) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 422);
state.data[name] = {
                    lazy : config,
                    added : true
                };
            } else {


                _yuitest_coverline("build/attribute-core/attribute-core.js", 429);
if (!added || config.isLazyAdd) {

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 431);
hasValue = (VALUE in config);


                    _yuitest_coverline("build/attribute-core/attribute-core.js", 434);
if (hasValue) {

                        // We'll go through set, don't want to set value in config directly

                        // PERF TODO: VALIDATE: See if setting this to undefined is sufficient. We use to delete before.
                        // In certain code paths/use cases, undefined may not be the same as not present.
                        // If not, we can set it to some known fixed value (like INVALID_VALUE, say INITIALIZING_VALUE) for performance,
                        // to avoid a delete which seems to help a lot.

                        _yuitest_coverline("build/attribute-core/attribute-core.js", 443);
value = config.value;
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 444);
config.value = undefined;
                    }

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 447);
config.added = true;
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 448);
config.initializing = true;

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 450);
state.data[name] = config;

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 452);
if (hasValue) {
                        // Go through set, so that raw values get normalized/validated
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 454);
host.set(name, value);
                    }

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 457);
config.initializing = false;
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 461);
return host;
        },

        /**
         * Checks if the given attribute has been added to the host
         *
         * @method attrAdded
         * @param {String} name The name of the attribute to check.
         * @return {boolean} true if an attribute with the given name has been added, false if it hasn't.
         *         This method will return true for lazily added attributes.
         */
        attrAdded: function(name) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "attrAdded", 472);
_yuitest_coverline("build/attribute-core/attribute-core.js", 473);
return !!(this._state.get(name, ADDED));
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
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "get", 488);
_yuitest_coverline("build/attribute-core/attribute-core.js", 489);
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
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_isLazyAttr", 501);
_yuitest_coverline("build/attribute-core/attribute-core.js", 502);
return this._state.get(name, LAZY);
        },

        /**
         * Finishes initializing an attribute which has been lazily added.
         *
         * @method _addLazyAttr
         * @private
         * @param {Object} name The name of the attribute
         * @param {Object} [lazyCfg] Optional config hash for the attribute. This is added for performance
         * along the critical path, where the calling method has already obtained lazy config from state.
         */
        _addLazyAttr: function(name, lazyCfg) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_addLazyAttr", 514);
_yuitest_coverline("build/attribute-core/attribute-core.js", 515);
var state = this._state;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 517);
lazyCfg = lazyCfg || state.get(name, LAZY);

            _yuitest_coverline("build/attribute-core/attribute-core.js", 519);
if (lazyCfg) {
                // PERF TODO: For App's id override, otherwise wouldn't be
                // needed. It expects to find it in the cfg for it's
                // addAttr override. Would like to remove, once App override is
                // removed.
                _yuitest_coverline("build/attribute-core/attribute-core.js", 524);
state.data[name].lazy = undefined;

                _yuitest_coverline("build/attribute-core/attribute-core.js", 526);
lazyCfg.isLazyAdd = true;
                _yuitest_coverline("build/attribute-core/attribute-core.js", 527);
this.addAttr(name, lazyCfg);
            }
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
         * @param {Any} value The value to set the attribute to.
         * @param {Object} [opts] Optional data providing the circumstances for the change.
         * @return {Object} A reference to the host object.
         */
        set : function(name, val, opts) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "set", 544);
_yuitest_coverline("build/attribute-core/attribute-core.js", 545);
return this._setAttr(name, val, opts);
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
         * @param {Object} [opts] Optional data providing the circumstances for the change.
         * @return {Object} A reference to the host object.
         */
        _set : function(name, val, opts) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_set", 560);
_yuitest_coverline("build/attribute-core/attribute-core.js", 561);
return this._setAttr(name, val, opts, true);
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
         * @param {Object} [opts] Optional data providing the circumstances for the change.
         * @param {boolean} force If true, allows the caller to set values for
         * readOnly or writeOnce attributes which have already been set.
         *
         * @return {Object} A reference to the host object.
         */
        _setAttr : function(name, val, opts, force)  {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_setAttr", 581);
_yuitest_coverline("build/attribute-core/attribute-core.js", 582);
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

            _yuitest_coverline("build/attribute-core/attribute-core.js", 593);
if (name.indexOf(DOT) !== -1) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 594);
strPath = name;

                _yuitest_coverline("build/attribute-core/attribute-core.js", 596);
path = name.split(DOT);
                _yuitest_coverline("build/attribute-core/attribute-core.js", 597);
name = path.shift();
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 600);
cfg = state.data[name] || {};

            _yuitest_coverline("build/attribute-core/attribute-core.js", 602);
if (cfg.lazy) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 603);
cfg = cfg.lazy;
                _yuitest_coverline("build/attribute-core/attribute-core.js", 604);
this._addLazyAttr(name, cfg);
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 607);
initialSet = (cfg.value === undefined);

            _yuitest_coverline("build/attribute-core/attribute-core.js", 609);
if (stateProxy && name in stateProxy && !cfg._bypassProxy) {
                // TODO: Value is always set for proxy. Can we do any better? Maybe take a snapshot as the initial value for the first call to set?
                _yuitest_coverline("build/attribute-core/attribute-core.js", 611);
initialSet = false;
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 614);
writeOnce = cfg.writeOnce;
            _yuitest_coverline("build/attribute-core/attribute-core.js", 615);
initializing = cfg.initializing;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 617);
if (!initialSet && !force) {

                _yuitest_coverline("build/attribute-core/attribute-core.js", 619);
if (writeOnce) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 620);
allowSet = false;
                }

                _yuitest_coverline("build/attribute-core/attribute-core.js", 623);
if (cfg.readOnly) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 624);
allowSet = false;
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 628);
if (!initializing && !force && writeOnce === INIT_ONLY) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 629);
allowSet = false;
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 632);
if (allowSet) {
                // Don't need currVal if initialSet (might fail in custom getter if it always expects a non-undefined/non-null value)
                _yuitest_coverline("build/attribute-core/attribute-core.js", 634);
if (!initialSet) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 635);
currVal =  this.get(name);
                }

                _yuitest_coverline("build/attribute-core/attribute-core.js", 638);
if (path) {
                   _yuitest_coverline("build/attribute-core/attribute-core.js", 639);
val = O.setValue(Y.clone(currVal), path, val);

                   _yuitest_coverline("build/attribute-core/attribute-core.js", 641);
if (val === undefined) {
                       _yuitest_coverline("build/attribute-core/attribute-core.js", 642);
allowSet = false;
                   }
                }

                _yuitest_coverline("build/attribute-core/attribute-core.js", 646);
if (allowSet) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 647);
if (!this._fireAttrChange || initializing) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 648);
this._setAttrVal(name, strPath, currVal, val, opts, cfg);
                    } else {
                        // HACK - no real reason core needs to know about _fireAttrChange, but
                        // it adds fn hops if we want to break it out. Not sure it's worth it for this critical path
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 652);
this._fireAttrChange(name, strPath, currVal, val, opts, cfg);
                    }
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 657);
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
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_getAttr", 673);
_yuitest_coverline("build/attribute-core/attribute-core.js", 674);
var fullName = name,
                tCfgs    = this._tCfgs,
                path,
                getter,
                val,
                attrCfg,
                cfg;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 682);
if (name.indexOf(DOT) !== -1) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 683);
path = name.split(DOT);
                _yuitest_coverline("build/attribute-core/attribute-core.js", 684);
name = path.shift();
            }

            // On Demand - Should be rare - handles out of order valueFn references
            _yuitest_coverline("build/attribute-core/attribute-core.js", 688);
if (tCfgs && tCfgs[name]) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 689);
cfg = {};
                _yuitest_coverline("build/attribute-core/attribute-core.js", 690);
cfg[name] = tCfgs[name];
                _yuitest_coverline("build/attribute-core/attribute-core.js", 691);
delete tCfgs[name];
                _yuitest_coverline("build/attribute-core/attribute-core.js", 692);
this._addAttrs(cfg, this._tVals);
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 695);
attrCfg = this._state.data[name] || {};

            // Lazy Init
            _yuitest_coverline("build/attribute-core/attribute-core.js", 698);
if (attrCfg.lazy) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 699);
attrCfg = attrCfg.lazy;
                _yuitest_coverline("build/attribute-core/attribute-core.js", 700);
this._addLazyAttr(name, attrCfg);
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 703);
val = this._getStateVal(name, attrCfg);

            _yuitest_coverline("build/attribute-core/attribute-core.js", 705);
getter = attrCfg.getter;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 707);
if (getter && !getter.call) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 708);
getter = this[getter];
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 711);
val = (getter) ? getter.call(this, val, fullName) : val;
            _yuitest_coverline("build/attribute-core/attribute-core.js", 712);
val = (path) ? O.getValue(val, path) : val;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 714);
return val;
        },

        /**
         * Gets the stored value for the attribute, from either the
         * internal state object, or the state proxy if it exits
         *
         * @method _getStateVal
         * @private
         * @param {String} name The name of the attribute
         * @param {Object} [cfg] Optional config hash for the attribute. This is added for performance along the critical path,
         * where the calling method has already obtained the config from state.
         *
         * @return {Any} The stored value of the attribute
         */
        _getStateVal : function(name, cfg) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_getStateVal", 729);
_yuitest_coverline("build/attribute-core/attribute-core.js", 730);
var stateProxy = this._stateProxy;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 732);
if (!cfg) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 733);
cfg = this._state.getAll(name) || {};
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 736);
return (stateProxy && (name in stateProxy) && !(cfg._bypassProxy)) ? stateProxy[name] : cfg.value;
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
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_setStateVal", 748);
_yuitest_coverline("build/attribute-core/attribute-core.js", 749);
var stateProxy = this._stateProxy;
            _yuitest_coverline("build/attribute-core/attribute-core.js", 750);
if (stateProxy && (name in stateProxy) && !this._state.get(name, BYPASS_PROXY)) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 751);
stateProxy[name] = value;
            } else {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 753);
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
         * @param {Object} [opts] Optional data providing the circumstances for the change.
         * @param {Object} [attrCfg] Optional config hash for the attribute. This is added for performance along the critical path,
         * where the calling method has already obtained the config from state.
         *
         * @return {booolean} true if the new attribute value was stored, false if not.
         */
        _setAttrVal : function(attrName, subAttrName, prevVal, newVal, opts, attrCfg) {

            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_setAttrVal", 773);
_yuitest_coverline("build/attribute-core/attribute-core.js", 775);
var host = this,
                allowSet = true,
                cfg = attrCfg || this._state.data[attrName] || {},
                validator = cfg.validator,
                setter = cfg.setter,
                initializing = cfg.initializing,
                prevRawVal = this._getStateVal(attrName, cfg),
                name = subAttrName || attrName,
                retVal,
                valid;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 786);
if (validator) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 787);
if (!validator.call) {
                    // Assume string - trying to keep critical path tight, so avoiding Lang check
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 789);
validator = this[validator];
                }
                _yuitest_coverline("build/attribute-core/attribute-core.js", 791);
if (validator) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 792);
valid = validator.call(host, newVal, name, opts);

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 794);
if (!valid && initializing) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 795);
newVal = cfg.defaultValue;
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 796);
valid = true; // Assume it's valid, for perf.
                    }
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 801);
if (!validator || valid) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 802);
if (setter) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 803);
if (!setter.call) {
                        // Assume string - trying to keep critical path tight, so avoiding Lang check
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 805);
setter = this[setter];
                    }
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 807);
if (setter) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 808);
retVal = setter.call(host, newVal, name, opts);

                        _yuitest_coverline("build/attribute-core/attribute-core.js", 810);
if (retVal === INVALID_VALUE) {
                            _yuitest_coverline("build/attribute-core/attribute-core.js", 811);
if (initializing) {
                                _yuitest_coverline("build/attribute-core/attribute-core.js", 812);
newVal = cfg.defaultValue;
                            } else {
                                _yuitest_coverline("build/attribute-core/attribute-core.js", 814);
allowSet = false;
                            }
                        } else {_yuitest_coverline("build/attribute-core/attribute-core.js", 816);
if (retVal !== undefined){
                            _yuitest_coverline("build/attribute-core/attribute-core.js", 817);
newVal = retVal;
                        }}
                    }
                }

                _yuitest_coverline("build/attribute-core/attribute-core.js", 822);
if (allowSet) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 823);
if(!subAttrName && (newVal === prevRawVal) && !Lang.isObject(newVal)) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 824);
allowSet = false;
                    } else {
                        // Store value
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 827);
if (!(INIT_VALUE in cfg)) {
                            _yuitest_coverline("build/attribute-core/attribute-core.js", 828);
cfg.initValue = newVal;
                        }
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 830);
host._setStateVal(attrName, newVal);
                    }
                }

            } else {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 835);
allowSet = false;
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 838);
return allowSet;
        },

        /**
         * Sets multiple attribute values.
         *
         * @method setAttrs
         * @param {Object} attrs  An object with attributes name/value pairs.
         * @param {Object} [opts] Optional data providing the circumstances for the change.
         * @return {Object} A reference to the host object.
         * @chainable
         */
        setAttrs : function(attrs, opts) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "setAttrs", 850);
_yuitest_coverline("build/attribute-core/attribute-core.js", 851);
return this._setAttrs(attrs, opts);
        },

        /**
         * Implementation behind the public setAttrs method, to set multiple attribute values.
         *
         * @method _setAttrs
         * @protected
         * @param {Object} attrs  An object with attributes name/value pairs.
         * @param {Object} [opts] Optional data providing the circumstances for the change
         * @return {Object} A reference to the host object.
         * @chainable
         */
        _setAttrs : function(attrs, opts) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_setAttrs", 864);
_yuitest_coverline("build/attribute-core/attribute-core.js", 865);
var attr;
            _yuitest_coverline("build/attribute-core/attribute-core.js", 866);
for (attr in attrs) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 867);
if ( attrs.hasOwnProperty(attr) ) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 868);
this.set(attr, attrs[attr], opts);
                }
            }
            _yuitest_coverline("build/attribute-core/attribute-core.js", 871);
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
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "getAttrs", 882);
_yuitest_coverline("build/attribute-core/attribute-core.js", 883);
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
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_getAttrs", 895);
_yuitest_coverline("build/attribute-core/attribute-core.js", 896);
var obj = {},
                attr, i, len,
                modifiedOnly = (attrs === true);

            // TODO - figure out how to get all "added"
            _yuitest_coverline("build/attribute-core/attribute-core.js", 901);
if (!attrs || modifiedOnly) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 902);
attrs = O.keys(this._state.data);
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 905);
for (i = 0, len = attrs.length; i < len; i++) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 906);
attr = attrs[i];

                _yuitest_coverline("build/attribute-core/attribute-core.js", 908);
if (!modifiedOnly || this._getStateVal(attr) != this._state.get(attr, INIT_VALUE)) {
                    // Go through get, to honor cloning/normalization
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 910);
obj[attr] = this.get(attr);
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 914);
return obj;
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
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "addAttrs", 937);
_yuitest_coverline("build/attribute-core/attribute-core.js", 938);
if (cfgs) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 939);
this._tCfgs = cfgs;
                _yuitest_coverline("build/attribute-core/attribute-core.js", 940);
this._tVals = (values) ? this._normAttrVals(values) : null;
                _yuitest_coverline("build/attribute-core/attribute-core.js", 941);
this._addAttrs(cfgs, this._tVals, lazy);
                _yuitest_coverline("build/attribute-core/attribute-core.js", 942);
this._tCfgs = this._tVals = null;
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 945);
return this;
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
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_addAttrs", 965);
_yuitest_coverline("build/attribute-core/attribute-core.js", 966);
var tCfgs = this._tCfgs,
                tVals = this._tVals,
                attr,
                attrCfg,
                value;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 972);
for (attr in cfgs) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 973);
if (cfgs.hasOwnProperty(attr)) {

                    // Not Merging. Caller is responsible for isolating configs
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 976);
attrCfg = cfgs[attr];
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 977);
attrCfg.defaultValue = attrCfg.value;

                    // Handle simple, complex and user values, accounting for read-only
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 980);
value = this._getAttrInitVal(attr, attrCfg, tVals);

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 982);
if (value !== undefined) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 983);
attrCfg.value = value;
                    }

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 986);
if (tCfgs[attr]) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 987);
tCfgs[attr] = undefined;
                    }

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 990);
this.addAttr(attr, attrCfg, lazy);
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
         * @deprecated Use `AttributeCore.protectAttrs()` or
         *   `Attribute.protectAttrs()` which are the same static utility method.
         */
        _protectAttrs : AttributeCore.protectAttrs,

        /**
         * Utility method to normalize attribute values. The base implementation
         * simply merges the hash to protect the original.
         *
         * @method _normAttrVals
         * @param {Object} valueHash An object with attribute name/value pairs
         *
         * @return {Object} An object literal with 2 properties - "simple" and "complex",
         * containing simple and complex attribute values respectively keyed
         * by the top level attribute name, or null, if valueHash is falsey.
         *
         * @private
         */
        _normAttrVals : function(valueHash) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_normAttrVals", 1022);
_yuitest_coverline("build/attribute-core/attribute-core.js", 1023);
var vals,
                subvals,
                path,
                attr,
                v, k;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 1029);
if (!valueHash) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 1030);
return null;
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 1033);
vals = {};

            _yuitest_coverline("build/attribute-core/attribute-core.js", 1035);
for (k in valueHash) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 1036);
if (valueHash.hasOwnProperty(k)) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 1037);
if (k.indexOf(DOT) !== -1) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 1038);
path = k.split(DOT);
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 1039);
attr = path.shift();

                        _yuitest_coverline("build/attribute-core/attribute-core.js", 1041);
subvals = subvals || {};

                        _yuitest_coverline("build/attribute-core/attribute-core.js", 1043);
v = subvals[attr] = subvals[attr] || [];
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 1044);
v[v.length] = {
                            path : path,
                            value: valueHash[k]
                        };
                    } else {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 1049);
vals[k] = valueHash[k];
                    }
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 1054);
return { simple:vals, complex:subvals };
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
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_getAttrInitVal", 1072);
_yuitest_coverline("build/attribute-core/attribute-core.js", 1073);
var val = cfg.value,
                valFn = cfg.valueFn,
                tmpVal,
                initValSet = false,
                readOnly = cfg.readOnly,
                simple,
                complex,
                i,
                l,
                path,
                subval,
                subvals;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 1086);
if (!readOnly && initValues) {
                // Simple Attributes
                _yuitest_coverline("build/attribute-core/attribute-core.js", 1088);
simple = initValues.simple;
                _yuitest_coverline("build/attribute-core/attribute-core.js", 1089);
if (simple && simple.hasOwnProperty(attr)) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 1090);
val = simple[attr];
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 1091);
initValSet = true;
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 1095);
if (valFn && !initValSet) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 1096);
if (!valFn.call) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 1097);
valFn = this[valFn];
                }
                _yuitest_coverline("build/attribute-core/attribute-core.js", 1099);
if (valFn) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 1100);
tmpVal = valFn.call(this, attr);
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 1101);
val = tmpVal;
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 1105);
if (!readOnly && initValues) {

                // Complex Attributes (complex values applied, after simple, in case both are set)
                _yuitest_coverline("build/attribute-core/attribute-core.js", 1108);
complex = initValues.complex;

                _yuitest_coverline("build/attribute-core/attribute-core.js", 1110);
if (complex && complex.hasOwnProperty(attr) && (val !== undefined) && (val !== null)) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 1111);
subvals = complex[attr];
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 1112);
for (i = 0, l = subvals.length; i < l; ++i) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 1113);
path = subvals[i].path;
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 1114);
subval = subvals[i].value;
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 1115);
O.setValue(val, path, subval);
                    }
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 1120);
return val;
        },

        /**
         * Utility method to set up initial attributes defined during construction,
         * either through the constructor.ATTRS property, or explicitly passed in.
         *
         * @method _initAttrs
         * @protected
         * @param attrs {Object} The attributes to add during construction (passed through to <a href="#method_addAttrs">addAttrs</a>).
         *        These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.
         * @param values {Object} The initial attribute values to apply (passed through to <a href="#method_addAttrs">addAttrs</a>).
         *        These are not merged/cloned. The caller is responsible for isolating user provided values if required.
         * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href="#method_addAttrs">addAttrs</a>).
         */
        _initAttrs : function(attrs, values, lazy) {
            // ATTRS support for Node, which is not Base based
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_initAttrs", 1135);
_yuitest_coverline("build/attribute-core/attribute-core.js", 1137);
attrs = attrs || this.constructor.ATTRS;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 1139);
var Base = Y.Base,
                BaseCore = Y.BaseCore,
                baseInst = (Base && Y.instanceOf(this, Base)),
                baseCoreInst = (!baseInst && BaseCore && Y.instanceOf(this, BaseCore));

            _yuitest_coverline("build/attribute-core/attribute-core.js", 1144);
if (attrs && !baseInst && !baseCoreInst) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 1145);
this.addAttrs(Y.AttributeCore.protectAttrs(attrs), values, lazy);
            }
        }
    };

    _yuitest_coverline("build/attribute-core/attribute-core.js", 1150);
Y.AttributeCore = AttributeCore;


}, '@VERSION@', {"requires": ["oop"]});
