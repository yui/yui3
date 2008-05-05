YUI.add('attribute', function(Y) {

    // TODO: rip out when Event supports cancel/preventDef
    var Evt = function(type, prevVal, newVal) {
        this.type = type;
        this.prevVal = prevVal;
        this.newVal = newVal;        
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
        Y.log('att constructor called');
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
         * Returns the current value of the attribute.
         * @method get
         * @param {String} key The attribute whose value will be returned.
         */
        get: function(name) {
            //return this._conf[name];
            return this._conf.get(name, 'value');
        },

        /**
         * Sets the value of an attribute.
         * @method set
         * @param {String} name The name of the attribute
         * @param {Any} value The value to apply to the attribute
         * @param {Boolean} silent Whether or not to suppress change events
         */
        set: function(name, val) {
           var type = name + 'Change',
                conf = this._conf,
                retVal;

            if (conf.get(name, 'readonly')) {
                Y.log('set ' + name + 'failed; attribute is readonly', 'error', 'Attribute');
                return this;
            }

            if (!conf.get(name)) {
                Y.log('adding new attribute: ' + name, 'info', 'Base');
                //throw new Error('attribute ' + name + ' is undefined');
            }

            var e = new Evt(type, this.get(name), val);

            //retVal = this.fire('before' + name.charAt(0).toUpperCase() + name.substring(1) + 'Change');
            retVal = _fireBefore.call(this, e);

/* TODO: allow before to change value? (alternative is cancel then set again)
            if (retVal) {
                if (retVal !== undefined && e._prevent === false) {
                    Y.log('attribute: ' + name + ' modified by before listener', 'info', 'Base');
                    val = retVal;
                }
            }

*/
            if (!e._cancel && !e._prevent && conf.get(name, 'set')) {
                retVal = conf.get(name, 'set').call(this, val);
                if (retVal !== undefined) {
                    Y.log('attribute: ' + name + ' modified by setter', 'info', 'Base');
                    val = retVal; // setter can change value
                }
            }

            var validator = conf.get(name, 'validator');
            if (!e._cancel || ( validator && validator.call(this, val) )) {
                //conf[name] = val;
                conf.add(name, { value: val });
                this.fire(type, e);
            }

            return this;
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
                Y.each(this._conf.get('value'), function(val, att) {
                    o[att] = val; 
                });
            }

            return o;
        }
    };

    Y.augment(Y.Attribute, Y.Event.Target);

}, '3.0.0', { requires: ['state'] });

