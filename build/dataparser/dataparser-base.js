YUI.add('dataparser-base', function(Y) {

/**
 * The DataParser utility provides a common configurable interface for widgets to
 * parse a variety of data against a given schema.
 *
 * @module dataparser
 */

/**
 * Base class for the YUI DataParser utility.
 * @class DataParser.Base
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
        return "DataParser.Base";
    },

    /**
     * Overridable parse method returns data as-is.
     *
     * @method parse
     * @param schema {Object} Schema to parse against.
     * @param data {Object} Data to parse.
     * @return {Object} Schema-parsed data.
     * @static
     */
    parse: function(schema, data) {
        return data;
    }
};

Y.namespace("DataParser").Base = DPBase;



}, '@VERSION@' ,{requires:['base']});
