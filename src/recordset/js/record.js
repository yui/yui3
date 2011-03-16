/**
 * Provides a wrapper around a standard javascript object. Can be inserted into a Recordset instance.
 *
 * @class Record
 */
var Record = Y.Base.create('record', Y.Base, [], {
    _setId: function() {
        return Y.guid();
    },

    initializer: function() {
    },

    destructor: function() {
    },

    /**
     * Retrieve a particular (or all) values from the object
     *
     * @param field {string} (optional) The key to retrieve the value from. If not supplied, the entire object is returned.
     * @method getValue
     * @public
     */
    getValue: function(field) {
        if (field === undefined) {
            return this.get("data");
        }
        else {
            return this.get("data")[field];
        }
        return null;
    }
},
{
    ATTRS: {

        /**
        * @description Unique ID of the record instance
        * @attribute id
        * @type string
        */
        id: {
            valueFn: "_setId"
        },

        /**
        * @description The object stored within the record instance
        * @attribute data
        * @type object
        */
        data: {
            value: null
        }
    }
});

Y.Record = Record;
