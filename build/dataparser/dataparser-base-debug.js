YUI.add('dataparser-base', function(Y) {

/**
 * The DataParser utility provides a common configurable interface for widgets to
 * parse a variety of data against a given schema.
 *
 * @module dataparser
 * @requires base
 * @title DataParser Utility
 */
    Y.namespace("DataParser");
    var DP = Y.DataParser,
        LANG = Y.Lang,

    /**
     * Base class for the YUI DataParser utility.
     * @class DataParser.Base
     * @extends Base
     * @constructor
     */
    Base = function() {
        Base.superclass.constructor.apply(this, arguments);
    };

    /////////////////////////////////////////////////////////////////////////////
    //
    // Base static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(Base, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "DataParser.Base"
     */
    NAME: "DataParser.Base",

    /////////////////////////////////////////////////////////////////////////////
    //
    // Base Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
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
        schema: {
            value: {}
        },

        /**
        * @attribute ERROR_DATAINVALID
        * @description Error message for invalid data.
        * @type String
        * @default "Invalid data"
        */
        ERROR_DATAINVALID: {
            value: "Invalid data"
        },


        /**
        * @attribute ERROR_DATANULL
        * @description Error message for null data.
        * @type String
        * @default "Null data"
        */
        ERROR_DATANULL: {
            value: "Null data"
        }
    }
});

Y.extend(Base, Y.Base, {
    /**
    * @method initializer
    * @description Internal init() handler.
    * @private
    */
    initializer: function() {
        /**
         * Fired when data is received to parse.
         *
         * @event parse
         * @param e {Event.Facade} Event Facade.
         * @param e.data {MIXED} Data to parse.
         */

        /**
         * Fired upon parse error.
         *
         * @event error
         * @param e {Event.Facade} Event Facade.
         * @param e.data {MIXED} Data.
         */
    },

    /**
     * Abstract overridable parse method returns data as-is.
     *
     * @method _parse
     * @protected
     * @param e {Event.Facade} Custom Event Facade for requestEvent.
     * @param e.data {MIXED} Data to parse.
     */
    _parse: function(data) {
        return data;
    },

    /**
     * Parses data.
     *
     * @method parse
     * @protected
     * @param e {Event.Facade} Custom Event Facade for requestEvent.
     * @param e.data {MIXED} Data to parse.
     */
    parse: function(data) {
        var ok = this.fire("parseEvent", {data:data});
        if(ok) {
            return this._parse(data)
        }
    }
});

    DP.Base = Base;


    
    
    
    




}, '@VERSION@' ,{requires:['base']});
