YUI.add('att', function(Y) {

    /**
     * Manages attributes
     * @class AttributeProvider
     * @uses YUI.Event.Target
     */
    Y.Att = function() {
        this._conf = {};

        console.info('att constructor called');
    };

    Y.Att.NAME = 'att';

    Y.Att.prototype = {
        /**
         * Adds an attribute.
         * @method add
         * @param {String} name The attribute key
         * @param {Object} val (optional) The attribute value
         */
        add: function(name, val) {
            this._conf = this._conf || {};
            this._conf[name] = val;
        },

        /**
         * Removes an attribute.
         * @method remove
         * @param {String} name The attribute key
         */
        remove: function(name) {
            this._conf = this._conf || {};
            delete this._conf[name];
        },

        /**
         * Returns the current value of the attribute.
         * @method get
         * @param {String} key The attribute whose value will be returned.
         */
        get: function(name) {
            this._conf = this._conf || {};
            return this._conf[name];
        },

        /**
         * Sets the value of an attribute.
         * @method set
         * @param {String} name The name of the attribute
         * @param {Any} value The value to apply to the attribute
         * @param {Boolean} silent Whether or not to suppress change events
         */
        set: function(name, val) {
            this._conf = this._conf || {};
            this._before = this._before || {};
            var e = val, // simple handler only gets incoming val? event facade?
                b4 = name + 'Change',
                conf = this._conf,
                retVal;

            if (!conf[name]) {
                Y.log('adding new attribute: ' + name, 'info', 'Base');
                this.add(name, val);
                //throw new Error('attribute ' + name + ' is undefined');
            }

            if (this._before[b4]) {
                retVal = this._before[b4](e);
                if (retVal !== undefined && retVal !== Y.CANCEL) {
                    Y.log('attribute: ' + name + ' modified by before', 'info', 'Base');
                    val = retVal;
                }
            }

            if (retVal !== Y.CANCEL) {
                conf[name] = val;
                this.fire(name + 'Change', val);
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
                Y.each(atts, function(val, att) {
                    o[att] = val; 
                });
            }

            return o;
        },

        before: function(name, fn) { // TODO: get from Event.Target
            this._before = this._before || {};
            this._before[name] = fn;
        }

    };

    Y.augment(Y.Att, Y.Event.Target);
}, '3.0.0');

