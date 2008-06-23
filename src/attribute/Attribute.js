    /**
     * Managed Attribute Provider
     * @module attribute
     */

    var O = Y.Object,

        DOT = ".",
        CHANGE = "Change",
        GET = "get",
        SET = "set",
        VALUE = "value",
        CLONE = "clone",
        READ_ONLY = "readonly",
        VALIDATOR = "validator",

        CLONE_ENUM;

    /**
     * Attribute provides managed attribute support. 
     * <p>
     * The class is designed to be augmented onto a host class, 
     * and allows the host to support get/set methods for attributes,
     * initial configuration support and attribute change events.
     * </p>
     * <p>Attributes added to the host can be defined as read-only,
     * clonable, with a default setter and validation support.
     * </p>
     * @class Attribute
     * @uses EventTarget
     */
    function Attribute() {
        this._conf = this._conf || new Y.State();
        Attribute.superclass.constructor.apply(this, arguments);
        Y.log('att constructor called', 'info', 'Attribute');
    }

    /**
     * @property Attribute.CLONE
     * @static
     * @final
     * @type {Object}
     * <p>
     * Constants for clone formats supported by Attribute
     * </p>
     * <p>
     * By default attribute values returned by the get method
     * are not cloned. However setting the attribute's "clone"
     * property to:
     * </p>
     * <dl>
     *     <dt>Attribute.CLONE.DEEP</dt>
     *     <dd>Will result in a deep cloned value being returned
     *        (using Y.clone). This can be expensive for complex
     *        objects.
     *     </dd>
     *     <dt>Attribute.CLONE.SHALLOW</dt>
     *     <dd>Will result in a shallow cloned value being returned
     *        (using Y.merge).
     *     </dd>
     *     <dt>Attribute.CLONE.IMMUTABLE</dt>
     *     <dd>Will result in a deep cloned value being returned
     *         when using the get method. Additionally users will
     *         not be able to set sub values of the attribute 
     *         using the complex attribute notation (obj.set("x.y.z, 5)).
     *         However the value of the attribute can be changed, making
     *         it different from a READONLY attribute.
     *     </dd>
     *     <dt>Attribute.CLONE.NONE</dt>
     *     <dd>
     *         The value will not be cloned, resulting in a reference
     *         to the stored value being passed back, if the value is an object.
     *         This is the default behavior.
     *     </dd>
     * </dl>
     */
    Attribute.CLONE = {
        NONE : 0,
        DEEP : 1,
        SHALLOW : 2,
        IMMUTABLE: 3
    };

    CLONE_ENUM = Attribute.CLONE;

    function _fireChange(type, currVal, newVal, attrName, strFullPath, defaultFn, opts) {
        type = type + CHANGE;

        // TODO: Publishing temporarily,
        // while we address event bubbling.
        this.publish(type, {queuable:false, defaultFn:this._defAttrSet});

        var eData = {
            type: type,
            prevVal: currVal,
            newVal: newVal,
            attrName: attrName,
            subAttrName: strFullPath
        };

        if (opts) {
            Y.mix(eData, opts);
        }

        this.fire(eData);
    }

    /**
     * Clone utility method, which will 
     * clone the provided value using YUI's 
     * merge, or clone utilities based
     * on the clone type provided.
     * 
     * @see Attribute.CLONE
     * @method _clone
     * @private 
     * @param {Object} val
     * @param {Object} type
     */
    function _clone(val, type) {
        switch(type) {
            case CLONE_ENUM.SHALLOW:
                val = Y.merge(val);
                break;
            case CLONE_ENUM.DEEP:
            case CLONE_ENUM.IMMUTABLE:
                val = Y.clone(val);
                break;
        }
        return val;
    }

    var proto = {
        /**
         * Adds an attribute.
         *
         * @method add
         * @param {String} name The attribute key
         * @param {Object} val (optional) The attribute configuration
         */
        addAtt: function(name, hash) {
            Y.log('adding attribute: ' + name, 'info', 'Attribute');
            this._conf.add(name, hash);
        },

        /**
         * Removes an attribute.
         * @method remove
         * @param {String} name The attribute key
         */
        remove: function(name) {
            this._conf.remove(name);
        },

        /**
         * Returns the current value of the attribute. If the attribute
         * has been configured with a 'get' handler, this method will delegate
         * to the 'get' handler to obtain the value of the attribute.
         * The 'get' handler will be passed the current value of the attribute 
         * as the only argument.
         * @method get
         * @param {String} key The attribute whose value will be returned.
         */
        get: function(name) {

            var conf = this._conf,
                path,
                getFn,
                clone,
                val;

            if (name.indexOf(DOT) !== -1) {
                path = name.split(DOT);
                name = path.shift();
            }

            val = conf.get(name, VALUE);
            getFn = conf.get(name, GET);
            clone = conf.get(name, CLONE);

            val = (clone) ? _clone(val, clone) : val;
            val = (getFn) ? getFn.call(this, val) : val;
            val = (path) ? this._getSubValue(path, val) : val;

            return val;
        },

        /**
         * Sets the value of an attribute.
         * @method set
         * @param {String} name The name of the attribute
         * @param {Any} value The value to apply to the attribute
         * @param {Object} Event options. This object will be mixed into
         * the event facade passed as the first argument to subscribers 
         * attribute change events
         */
        set: function(name, val, opts) {

            var conf = this._conf,
                strPath,
                path,
                currVal;

            if (name.indexOf(DOT) !== -1) {
                strPath = name;
                path = name.split(DOT);
                name = path.shift();
            }

            if (path && conf.get(name, CLONE) === CLONE_ENUM.IMMUTABLE) {
                Y.log('set ' + name + ' failed; Attribute is IMMUTABLE. Setting a sub value is not permitted', 'info', 'Attribute');
                return this;
            }

            if (conf.get(name, READ_ONLY)) {
                Y.log('set ' + name + ' failed; Attribute is readonly', 'info', 'Attribute');
                return this;
            }

            if (!conf.get(name)) {
                Y.log('Set called with unconfigured attribute. Adding a new attribute: ' + name, 'info', 'Attribute');
            }

            currVal = this.get(name);

            if (path) {
               val = this._setSubValue(path, Y.clone(currVal), val);
               if (val === undefined) {
                   // Path not valid, don't set anything.
                   Y.log('set ' + strPath + 'failed; attribute sub path is invalid', 'error', 'Attribute');
                   return this;
               }
            }

            _fireChange.call(this, name, currVal, val, name, strPath, opts);

            return this;
        },

        /**
         * Default handler implementation for set events
         *
         * @private
         * @param {EventFacade} CustomEvent Facade
         */
        _defAttrSet : function(e) {
            var conf = this._conf,
                name = e.attrName,
                val = e.newVal,
                retVal,
                valFn  = conf.get(name, VALIDATOR),
                setFn = conf.get(name, SET);

            if (setFn) {
                retVal = setFn.call(this, val);
                if (retVal !== undefined) {
                    Y.log('attribute: ' + name + ' modified by setter', 'info', 'Attribute');
                    val = retVal; // setter can change value
                }
            }

            if (!valFn || valFn.call(this, val)) {
                conf.add(name, { value: val });
            }

            e.newVal = val;
        },

        /**
         * Retrieves the sub value at the provided path,
         * from the value object provided.
         *
         * @param {Array} path  A path array, specifying the object traversal path
         *                      from which to obtain the sub value.
         * @param {Object} val  The object from which to extract the property value
         * @return {Any} The value stored in the path or undefined if not found.
         *
         * @private
         */
        _getSubValue: function (path, val) {
            var pl = path.length,
                i;

            if (pl > 0) {
                for (i = 0; val !== undefined && i < pl; ++i) {
                    val = val[path[i]];
                }
            }

            return val;
        },

        /**
         * Sets the sub value at the provided path on the value object.
         * Returns the modified value object, or undefined if the path is invalid.
         *
         * @param {Array} path  A path array, specifying the object traversal path
         *                      at which to set the sub value.
         * @param {Object} val  The object on which to set the sub value.
         * @param {Any} subval  The sub value to set.
         * @return {Object}     The modified object, with the new sub value set, or 
         *                      undefined, if the path was invalid.
         *
         * @private
         */
        _setSubValue: function(path, val, subval) {

            var leafIdx = path.length-1,
                i,
                o;

            if (leafIdx >= 0) {
                o = val;

                for (i = 0; o !== undefined && i < leafIdx; ++i) {
                    o = o[path[i]];
                }

                // Not preventing new properties from being added
                if (o !== undefined /* && o[path[i]] !== undefined */) {
                    o[path[i]] = subval;
                } else {
                    val = undefined;
                }
            }

            return val;
        },

        /**
         * Sets multiple attribute values.
         * 
         * @method setAtts
         * @param {Object} atts  A hash of attributes: name/value pairs
         */
        setAtts: function(atts) {
            for (var att in atts) {
                if ( O.owns(atts, att) ) {
                    this.set(att, atts[att]);
                }
            }
        },

        /**
         * Gets multiple attribute values.
         *
         * @method getAtts
         * @return {Object} A hash of attributes: name/values pairs
         */
        getAtts: function(atts) {
            var o = {};
            if (atts) {
                o = Y.clone(atts);
            } else {
                Y.each(this._conf.get(VALUE), function(val, att) {
                    o[att] = val; 
                });
            }
            return o;
        },

        /**
         * Configures attributes, and sets initial values
         *
         * @method _initAtts
         * @param {Object} cfg Attribute configuration object literal
         * @param {Object} initValues Name/Value hash of initial values to apply
         *
         * @protected
         */
        _initAtts : function(cfg, initValues) {
            if (cfg) {
                var att,
                    attCfg,
                    values,
                    atts = Y.merge(cfg);

                values = this._splitAttVals(initValues);

                for (att in atts) {
                    if (O.owns(atts, att)) {
                        attCfg = atts[att];
                        this.addAtt(att, attCfg);
                        this._initAttValue(att, attCfg, values);
                    }
                }
            }
        },

        /**
         * Utility to split out regular attribute values
         * from complex attribute values
         *
         * @method _splitAttrValues
         * @private
         */
        _splitAttVals: function(valueHash) {
            var vals = {},
                subvals = {},
                path,
                attr,
                v;

            for (var k in valueHash) {
                if (O.owns(valueHash, k)) {
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
        },

        /**
         * Set the initial value of the given attribute from
         * either the default configuration provided, or the 
         * over-ridden value if it exists in the initValues 
         * hash provided.
         *
         * @param {String} att Attribute name
         * @param {Object} cfg Default attribute configuration
         * object literal
         * @param {Object} Initial attribute values.
         *
         * @method _initAttValue
         * @private
         */
        _initAttValue : function(att, cfg, initValues) {

            var hasVal = ("value" in cfg),
                val = cfg.value,
                simple,
                complex,
                i,
                l,
                path,
                subval,
                subvals;

            if (initValues) {
                // Simple Attributes
                simple = initValues.simple;
                if (simple && O.owns(simple, att)) {
                    hasVal = true;
                    val = simple[att];
                }

                // Complex Attributes
                complex = initValues.complex;
                if (complex && O.owns(complex, att)) {
                    hasVal = true;
                    subvals = complex[att];
                    for (i = 0, l = subvals.length; i < l; ++i) {
                        path = subvals[i].path;
                        subval = subvals[i].value;
                        val = this._setSubValue(path, val, subval);
                    }
                }
            }

            if (hasVal) {
                this.set(att, val);
            }
        }
    };

    Y.extend(Attribute, Y.EventTarget, proto);

    Y.Attribute = Attribute;
