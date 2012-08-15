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
    Y.State = function() {
        /**
         * Hash of attributes
         * @property data
         */
        this.data = {};
    };

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
            var item = this.data[name];

            if (!item) {
                item = this.data[name] = {};
            }

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
            var item = this.data[name],
                key;

            if (!item) {
                item = this.data[name] = {};
            }

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
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
            var item = this.data[name];

            if (item) {
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
            var data;

            if (!obj) {
                data = this.data;

                if (name in data) {
                    delete data[name];
                }
            } else {
                Y.each(obj, function(value, key) {
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
            var item = this.data[name];

            if (item) {
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
            var item = this.data[name],
                key, obj;

            if (reference) {
                obj = item;
            } else if (item) {
                obj = {};

                for (key in item) {
                    if (item.hasOwnProperty(key)) {
                        obj[key] = item[key];
                    }
                }
            }

            return obj;
        }
    };
