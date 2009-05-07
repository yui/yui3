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
