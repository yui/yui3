/**
 * The DataType utility provides a set of utility functions to operate on native
 * JavaScript data types.
 *
 * @module datatype
 */
var LANG = Y.Lang;

/**
 * Format XML submodule.
 *
 * @class DataType.XML
 * @submodule datatype-xml-format
 * @static
 */
Y.mix(Y.namespace("DataType.XML"), {
    /**
     * Converts data to type XMLDocument.
     *
     * @method format
     * @param data {XMLDoc} Data to convert.
     * @return {String} String.
     * @static
     */
    format: function(data) {
        try {
            if(!LANG.isUndefined(XMLSerializer)) {
                return (new XMLSerializer()).serializeToString(data);
            }
        }
        catch(e) {
            if(data && data.xml) {
                return data.xml;
            }
            else {
                Y.log("Could not format data " + Y.dump(data) + " from type XML", "warn", "datatype-xml");
                return (LANG.isValue(data) && data.toString) ? data.toString() : "";
            }
        }
    }
});

