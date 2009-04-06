YUI.add('dataparser-base', function(Y) {

/**
 * The DataParser utility provides a common configurable interface for widgets to
 * parse a variety of data against a given schema.
 *
 * @module dataparser
 * @title DataParser Utility
 */

/**
 * Base class for the YUI DataParser utility.
 * @class DataParser.Base
 * @static
 */
var DPBase = {
    /////////////////////////////////////////////////////////////////////////////
    //
    // Base static properties
    //
    /////////////////////////////////////////////////////////////////////////////
    
    /**
     * Class name.
     *
     * @property DataParser.Base.NAME
     * @type String
     * @static
     * @final
     * @value "DataParser.Base"
     */
    //NAME: "DataParser.Base",

    /////////////////////////////////////////////////////////////////////////////
    //
    // Base Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    //ATTRS: {
        /**
        * @attribute schema
        * @description Object literal schema definition takes a combination of
        * the following properties:
            <dl>
                <dt>resultsList {String}</dt>
                    <dd>Pointer to array of tabular data</dd>
                <dt>resultNode {String}</dt>
                    <dd>Pointer to node name of row data (XML data only)</dl>
                <dt>recordDelim {String}</dt>
                    <dd>Record delimiter (text data only)</dd>
                <dt>fieldDelim {String}</dt>
                    <dd>Field delimiter (text data only)</dd>
                <dt>fields {String[] | Object []}</dt>
                    <dd>Array of field names (aka keys), or array of object literals such as:
                    {key:"fieldname", parser:Date.parse}</dd>
                <dt>metaFields {Object}</dt>
                    <dd>Hash of field names (aka keys) to include in the
                    oParsedResponse.meta collection</dd>
                <dt>metaNode {String}</dt>
                    <dd>Name of the node under which to search for meta
                    information in XML response data (XML data only)</dd>
            </dl>
        * @type Object
        * @default {}
        */
        //schema: {
            //value: {}
        //}
    //}
//});

//Y.extend(DPBase, Y.Base, {
    /**
    * @method initializer
    * @description Internal init() handler.
    * @private
    */
    //initializer: function() {
        /**
         * Fired when data is received to parse.
         *
         * @event parse
         * @param e {Event.Facade} Event Facade.
         * @param data {MIXED} Data to parse.
         */

        /**
         * Fired upon parse error.
         *
         * @event error
         * @param e {Event.Facade} Event Facade.
         * @param e.data {MIXED} Data.
         */
    //},

    /**
     * Abstract overridable parse method returns data as-is.
     *
     * @method _parse
     * @param schema {Object} Schema to parse against.
     * @param data {Object} Data to parse.
     * @return TBD
     * @protected
     */
   _parse: function(schema, data) {
        return data;
    },

    /**
     * Parses data against schema.
     *
     * @method parse
     * @param schema {Object} Schema to parse against.
     * @param data {Object} Data to parse.
     * @return TBD
     * @protected
     */
    parse: function(schema, data) {
        var ok = this.fire("parse", null, data);
        if(ok) {
            return this._parse(schema, data);
        }
    }
};

Y.augment(DPBase, Y.Event.Target);

Y.namespace("DataParser");
Y.DataParser.Base = DPBase;


    
    
    
    




}, '@VERSION@' ,{requires:['base']});
