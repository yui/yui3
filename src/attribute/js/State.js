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
         * Add an item with all of the properties in the supplied object.
         * @method add
         * @param name {string} identifier for this attribute
         * @param o hash of attributes
         */
        add: function(name, o) {
            Y.each(o, function(v, k) {
                if (!this.data[k]) {
                    this.data[k] = {};
                }

                this.data[k][name] = v;
            }, this);
        },

        /**
         * Remove entire item, or optionally specified fields
         * @method remove
         * @param name {string} name of attribute
         * @param o {string|object|array} single key or collection of keys to delete
         */
        remove: function(name, o) {
            var d = this.data, 
                del = function(key) {
                    if (d[key] && (name in d[key])) {
                        delete d[key][name];
                    }
                };

            if (Y.Lang.isString(o)) {
                del(o);
            } else {
                Y.each(o || d, function(v, k) {
                    if(Y.Lang.isString(k)) {
                        del(k);
                    } else {
                        del(v);
                    }
                }, this);

            }
        },

        /**
         * For a given item, gets an attribute.  If key is not
         * supplied, a disposable object with all attributes is 
         * returned.  Use of the latter option makes sense when
         * working with single items, but not if object explosion
         * might cause gc problems.
         * @method get
         * @param name {string} name of attribute
         * @param key {string} optional attribute to get
         * @return either the value of the supplied key or an object with
         * all data.
         */
        // get: function(name, key, val) {
        get: function(name, key) {
            var d = this.data,
                o;

            if (key) {
                return (d[key] && name in d[key]) ?  d[key][name] : undefined;
            } else {
                Y.each(d, function(v, k) {
                    if (name in d[k]) {
                        o = o || {};
                        o[k] = v[name];
                    }
                }, this);

                return o;

            }
        }

        // figure out what kind of functionality we may need here
        // get whole list
        // get a list of items and values for a given key
        // get a list of items where a key has the supplied value
        /*
        list: function(key, val) {
            var o = {}, d = this.data, test = !L.isUndefined(val);

            Y.each(this, function(v, k) {

                // verify key
                if (key && k !== key) {
                    return;
                // verify value.  note, v will be the item names, so this
                // isn't working ... need to iterate v items
                } else if (test && v !== val) {
                    return;
                }

                o[k] = v;

            }, this);

            return o;
        }
        */
    };
