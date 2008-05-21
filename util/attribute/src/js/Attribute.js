YUI.add('attribute', function(Y) {

    var DOT = ".",
        CHANGE = "Change",
        GET = "get",
        SET = "set",
        VALUE = "value",
        READ_ONLY = "readonly",
        VALIDATOR = "validator";

    // TODO: rip out when Event supports cancel/preventDef
    var Evt = function(type, prevVal, newVal, attr, subAttr) {
        this.type = type;
        this.prevVal = prevVal;
        this.newVal = newVal;
        this.attr = attr;
        this.subAttr = subAttr || null;
    };

    var _fireBefore = function(e) {
        this._before = this._before || {};
        var list = this._before[e.type] || {};

        for (var i = 0, len = list.length; i < len; ++i) {
            if (e._cancelled) {
                break;
            }
            list[i].call(this, e);
        }
    };

    Evt.prototype = {
        type: null,
        _prevent: false,
        _default: null,
        _cancel: false,

        stopPropagation: function() {
            this._cancel = true;
        },

        preventDefault: function() {
            this._prevent = true;
        }
    };

    /**
     * Manages attributes
     * @class Att
     * @uses YUI.Event.Target
     */
    Y.Attribute = function() {
        //this._conf = {};
        this._conf = this._conf || new Y.State(); // TODO: fix init order
        Y.log('att constructor called', 'info', 'Attribute');
    };

    Y.Attribute.NAME = 'att';

    Y.Attribute.ATTRS = [];

    Y.Attribute.prototype = {
        /**
         * Adds an attribute.
         * @method add
         * @param {String} name The attribute key
         * @param {Object} val (optional) The attribute value
         */
        addAtt: function(name, hash) {
            //this._conf[name] = val;
            this._conf = this._conf || new Y.State();
            Y.log('adding attribute: ' + name, 'info', 'Attribute');
            this._conf.add(name, hash);
        },

        /**
         * Removes an attribute.
         * @method remove
         * @param {String} name The attribute key
         */
        remove: function(name) {
            //delete this._conf[name];
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
                path = name.split(DOT),
                getFn,
                rawVal,
                val;

            name = path.shift();
            getFn = conf.get(name, GET);
            rawVal = conf.get(name, VALUE);
            val = (getFn) ? getFn.call(this, rawVal) : rawVal;

            return (path.length > 0) ? this._getSubValue(path, val) : val;
        },

        /**
         * Sets the value of an attribute.
         * @method set
         * @param {String} name The name of the attribute
         * @param {Any} value The value to apply to the attribute
         * @param {Boolean} silent Whether or not to suppress change events
         */
        set: function(name, val) {
            var conf = this._conf,
                fullname = name,
                path = name.split(DOT),
                setFn,
                validatorFn,
                retVal,
                currVal,
                type,
                e;

            name = path.shift();

            if (conf.get(name, READ_ONLY)) {
                Y.log('set ' + name + 'failed; attribute is readonly', 'error', 'Attribute');
                return this;
            }

            if (!conf.get(name)) {
                Y.log('adding new attribute: ' + name, 'info', 'Base');
                //throw new Error('attribute ' + name + ' is undefined');
            }

            currVal = this.get(name);

            if (path.length > 0) {
               val = this._setSubValue(path, Y.clone(currVal), val);
               if (val === undefined) {
                   // Path not valid, don't set anything.
                   Y.log('set ' + fullname + 'failed; attribute sub path is invalid', 'error', 'Attribute');
                   return this;
               }
            }

            type = name + CHANGE;
            e = new Evt(type, currVal, val, name, fullname);

            retVal = _fireBefore.call(this, e);

            /* TODO: allow before to change value? (alternative is cancel then set again)
                        if (retVal) {
                            if (retVal !== undefined && e._prevent === false) {
                                Y.log('attribute: ' + name + ' modified by before listener', 'info', 'Base');
                                val = retVal;
                            }
                        }
            */

            setFn = conf.get(name, SET);
            if (!e._cancel && !e._prevent && setFn) {
                retVal = setFn.call(this, val);
                if (retVal !== undefined) {
                    Y.log('attribute: ' + name + ' modified by setter', 'info', 'Base');
                    val = retVal; // setter can change value
                }
            }

            validatorFn = conf.get(name, VALIDATOR);
            if (!e._cancel || ( validatorFn && validatorFn.call(this, val) )) {
                conf.add(name, { value: val });
                this.fire(type, e);
            }

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

                // TODO: Is it OK to allow new properties to be added?
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
        }
    };

    Y.augment(Y.Attribute, Y.Event.Target);

}, '3.0.0', { requires: ['state'] });
