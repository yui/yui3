/**
 * Provides methods for managing custom Node data.
 * 
 * @module node
 * @main node
 * @submodule node-data
 */

Y.mix(Y.Node.prototype, {
    _initData: function() {
        if (! ('_data' in this)) {
            this._data = {};
        }
    },

    /**
    * @method getData
    * @description Retrieves arbitrary data stored on a Node instance.
    * If no data is associated with the Node, it will attempt to retrieve
    * a value from the corresponding HTML data attribute. (e.g. node.getData('foo')
    * will check node.getAttribute('data-foo')).
    * @param {string} name Optional name of the data field to retrieve.
    * If no name is given, all data is returned.
    * @return {any | Object} Whatever is stored at the given field,
    * or an object hash of all fields.
    */
    getData: function(name) {
        this._initData();
        var data = this._data,
            ret = data;

        if (arguments.length) { // single field
            if (name in data) {
                ret = data[name];
            } else { // initialize from HTML attribute
                ret = this._getDataAttribute(name);
            }
        } else if (typeof data == 'object' && data !== null) { // all fields
            ret = {};
            Y.Object.each(data, function(v, n) {
                ret[n] = v;
            });

            ret = this._getDataAttributes(ret);
        }

        return ret;

    },

    _getDataAttributes: function(ret) {
        ret = ret || {};
        var i = 0,
            attrs = this._node.attributes,
            len = attrs.length,
            prefix = this.DATA_PREFIX,
            prefixLength = prefix.length,
            name;

        while (i < len) {
            name = attrs[i].name;
            if (name.indexOf(prefix) === 0) {
                name = name.substr(prefixLength);
                if (!(name in ret)) { // only merge if not already stored
                    ret[name] = this._getDataAttribute(name);
                }
            }

            i += 1;
        }

        return ret;
    },

    _getDataAttribute: function(name) {
        var name = this.DATA_PREFIX + name,
            node = this._node,
            attrs = node.attributes,
            data = attrs && attrs[name] && attrs[name].value;

        return data;
    },

    /**
    * @method setData
    * @description Stores arbitrary data on a Node instance.
    * This is not stored with the DOM node.
    * @param {string} name The name of the field to set. If no name
    * is given, name is treated as the data and overrides any existing data.
    * @param {any} val The value to be assigned to the field.
    * @chainable
    */
    setData: function(name, val) {
        this._initData();
        if (arguments.length > 1) {
            this._data[name] = val;
        } else {
            this._data = name;
        }

       return this;
    },

    /**
    * @method clearData
    * @description Clears internally stored data.
    * @param {string} name The name of the field to clear. If no name
    * is given, all data is cleared.
    * @chainable
    */
    clearData: function(name) {
        if ('_data' in this) {
            if (typeof name != 'undefined') {
                delete this._data[name];
            } else {
                delete this._data;
            }
        }

        return this;
    }
});

Y.mix(Y.NodeList.prototype, {
    /**
    * @method getData
    * @description Retrieves arbitrary data stored on each Node instance
    * bound to the NodeList.
    * @see Node
    * @param {string} name Optional name of the data field to retrieve.
    * If no name is given, all data is returned.
    * @return {Array} An array containing all of the data for each Node instance. 
    * or an object hash of all fields.
    */
    getData: function(name) {
        var args = (arguments.length) ? [name] : [];
        return this._invoke('getData', args, true);
    },

    /**
    * @method setData
    * @description Stores arbitrary data on each Node instance bound to the
    *  NodeList. This is not stored with the DOM node.
    * @param {string} name The name of the field to set. If no name
    * is given, name is treated as the data and overrides any existing data.
    * @param {any} val The value to be assigned to the field.
    * @chainable
    */
    setData: function(name, val) {
        var args = (arguments.length > 1) ? [name, val] : [name];
        return this._invoke('setData', args);
    },

    /**
    * @method clearData
    * @description Clears data on all Node instances bound to the NodeList.
    * @param {string} name The name of the field to clear. If no name
    * is given, all data is cleared.
    * @chainable
    */
    clearData: function(name) {
        var args = (arguments.length) ? [name] : [];
        return this._invoke('clearData', [name]);
    }
});
