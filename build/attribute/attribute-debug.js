YUI.add('attribute', function(Y) {

    var O = Y.object,
        DOT = ".",
        CHANGE = "Change",
        GET = "get",
        SET = "set",
        VALUE = "value",
        READ_ONLY = "readonly",
        VALIDATOR = "validator";

    function _fireChange(type, currVal, newVal, attrName, strFullPath) {
        type = type + CHANGE;

        // TODO: Publishing temporarily,
        // while we address event bubbling.
        this.publish(type, {queuable:false});

        this.fire({
            type: type,
            prevVal: currVal,
            newVal: newVal,
            attrName: attrName,
            subAttrName: strFullPath
        });
    }

    /*
    var Evt = function(cfg) {
        Y.mix(this, cfg, true);
    };

    Evt.prototype = {
        _prevent: false,
        _cancel: false,

        stopImmediatePropagation: function() {
            this._cancel = true;
        },

        preventDefault: function() {
            this._prevent = true;
        }
    };
    */

    /**
     * Manages attributes
     * @class Att
     * @uses YUI.EventTarget
     */
    Y.Attribute = function() {
        this._conf = this._conf || new Y.State();
        Y.log('att constructor called', 'info', 'Attribute');
    };

    Y.Attribute.prototype = {
        /**
         * Adds an attribute.
         * @method add
         * @param {String} name The attribute key
         * @param {Object} val (optional) The attribute value
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
                rawVal,
                val;

            if (name.indexOf(DOT) !== -1) {
                path = name.split(DOT);
                name = path.shift();
            }

            getFn = conf.get(name, GET);
            rawVal = conf.get(name, VALUE);
            val = (getFn) ? getFn.call(this, rawVal) : rawVal;

            return (path) ? this._getSubValue(path, val) : val;
        },

        /**
         * Sets the value of an attribute.
         * @method set
         * @param {String} name The name of the attribute
         * @param {Any} value The value to apply to the attribute
         */
        set: function(name, val) {

            var conf = this._conf,
                strPath,
                path,
                setFn,
                validatorFn,
                retVal,
                currVal,
                eData,
                e;

            if (name.indexOf(DOT) !== -1) {
                strPath = name;
                path = name.split(DOT);
                name = path.shift();
            }

            if (conf.get(name, READ_ONLY)) {
                Y.log('set ' + name + 'failed; attribute is readonly', 'error', 'Attribute');
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

            /*
            e = new Evt({
                type: name + CHANGE,
                prevVal: currVal,
                newVal: val,
                attrName: name,
                subAttrName: strPath
            });

            this._fireBefore.call(this, e);

            if (!e._prevent) {
            */

            setFn = conf.get(name, SET);
            if (setFn) {
                retVal = setFn.call(this, val);
                if (retVal !== undefined) {
                    Y.log('attribute: ' + name + ' modified by setter', 'info', 'Attribute');
                    val = retVal; // setter can change value
                }
            }

            validatorFn = conf.get(name, VALIDATOR);
            if (!validatorFn || validatorFn.call(this, val)) {
                conf.add(name, { value: val });
                if (path) {
                    _fireChange.call(this, strPath, currVal, val, name, strPath);
                }
                _fireChange.call(this, name, currVal, val, name, strPath);
            }

            /* } */

            return this;
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
         * @method setAttributes
         * @param {Object} atts  A hash of attributes: values
         */
        setAtts: function(atts) {
            for (var att in atts) {
                if ( Y.object.owns(atts, att) ) {
                    this.set(att, atts[att]);
                }
            }
        },

        /**
         * Gets multiple attribute values.
         * @method setAttributes
         * @param {Object} atts  A hash of attributes: values
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
         * @private
         */
        _initAtts : function(cfg, initValues) {
            if (cfg) {
                var att,
                    attCfg,
                    atts = Y.merge(cfg);

                for (att in atts) {
                    if (O.owns(atts, att)) {
                        attCfg = atts[att];
                        this.addAtt(att, attCfg);
                        this._initAttValue(att, attCfg, initValues);
                    }
                }
            }
        },

        /**
         * @private
         */
        _initAttValue : function(att, cfg, initValues) {

            // Using 'in' to account for a value of 'undefined'
            var hasVal = ("value" in cfg),
                val = cfg.value;

            if (initValues) {
                if (O.owns(initValues, att)) { 
                    // Simple Attributes
                    hasVal = true;
                    // Not Cloning/Merging user value on purpose. Don't want to clone
                    // references to complex objects [ e.g. a reference to a widget ]
                    // This means the user has to clone anything coming in, if separate
                    // value instances required per base instance
                    val = initValues[att];
                } else {

                    // Complex Attributes
                    // TODO: Look at perf optimization, can't be doing this for
                    // all values which aren't specified

                    /*
                    for (var initAtt in initValues) {
                        if (O.owns(initValues, initAtt)) {
                            var path = initAtt.split(DOT);
                            initAtt = path.shift();
                            if (att === initAtt) {
                                hasValue = true;
                                val = this._setSubValue(path, val, initValues[initAtt]);
                                // Don't break, to account for multiple sub values
                            }
                        }
                    }
                    */
                }
            }

            if (hasVal) {
                this.set(att, val);
            }
        }
    };

    Y.augment(Y.Attribute, Y.EventTarget, null, null, {
        emitFacade: true
    });

}, '3.0.0', { requires: ['state'] });

