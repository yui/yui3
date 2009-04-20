/**
 * The DataSchema utility provides a common configurable interface for widgets to
 * apply a given schema to a variety of data.
 *
 * @module dataschema
 */

/**
 * Base class for the YUI DataSchema utility.
 * @class DataSchema.Base
 * @static
 */
var DPBase = {
    /**
     * Returns string name.
     *
     * @method toString
     * @return {String} String representation for this object.
     */
    toString: function() {
        return "DataSchema.Base";
    },

    /**
     * Overridable method returns data as-is.
     *
     * @method apply
     * @param schema {Object} Schema to apply.
     * @param data {Object} Data.
     * @return {Object} Schema-parsed data.
     * @static
     */
    apply: function(schema, data) {
        return data;
    }
};

Y.namespace("DataSchema").Base = DPBase;
