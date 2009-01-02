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
        this.publish("parseEvent", {
            //defaultFn: this._parse
        });
    },

    /**
     * Abstract overridable default parseEvent handler receives data and parses
     * according to provided schema.
     *
     * @method _parse
     * @protected
     * @param e {Event.Facade} Custom Event Facade for requestEvent.
     * @param e.data {MIXED} Data to parse.
     */
    _parse: function(data) {
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
        return this._parse(data);
    }
});

    DP.Base = Base;


    
    
    
    




}, '@VERSION@' ,{requires:['base']});

YUI.add('dataparser-json', function(Y) {

/**
 * The DataParser utility provides a common configurable interface for widgets to
 * parse a variety of data against a given schema.
 *
 * @module dataparser-json
 * @requires json, dataparser-base
 * @title DataParser JSON Submodule
 */
    var LANG = Y.Lang,

    /**
     * JSON subclass for the YUI DataParser utility.
     * @class DataParser.JSON
     * @extends DataParser.Base
     * @constructor
     */
    JSON = function() {
        JSON.superclass.constructor.apply(this, arguments);
    };


    /////////////////////////////////////////////////////////////////////////////
    //
    // DataParser.JSON static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(JSON, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "DataParser.JSON"
     */
    NAME: "DataParser.JSON",


    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.XHR Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
        /**
        * @attribute schema
        * @description Object literal schema definition:
            <dl>
                <dt>resultsList {String}</dt>
                    <dd>Pointer to array of tabular data</dd>
                <dt>fields {String[] | Object []}</dt>
                    <dd>Array of field names (aka keys), or array of object literals such as:
                    {key:"fieldname", parser:Date.parse}</dd>
                <dt>metaFields {Object}</dt>
                    <dd>Hash of field names (aka keys) to include in the
                    oParsedResponse.meta collection</dd>
            </dl>
        * @type Object
        * @default {}
        */
        schema: {
            value: {}
        }
    }
});

Y.extend(JSON, Y.DataParser.Base, {
    /**
     * Overriding parseEvent handler receives data and parses according to provided schema.
     *
     * @method _parse
     * @protected
     * @param e {Event.Facade} Custom Event Facade for requestEvent.
     * @param e.data {MIXED} Data to parse.
     */
    _parse: function(data) {
        var data_in = (data.responseText) ? Y.JSON.parse(data.responseText) : data,
            schema = this.get("schema"),
            data_out = {results:[],meta:{}};

        if(LANG.isObject(data_in) && schema.resultsList) {
            var fields          = schema.fields,
                resultsList     = data_in,
                results         = [],
                metaFields      = schema.metaFields || {},
                fieldParsers    = [],
                fieldPaths      = [],
                simpleFields    = [],
                bError          = false,
                i,len,j,v,key,parser,path;

            // Function to convert the schema's fields into walk paths
            var buildPath = function (needle) {
                var path = null, keys = [], i = 0;
                if (needle) {
                    // Strip the ["string keys"] and [1] array indexes
                    needle = needle.
                        replace(/\[(['"])(.*?)\1\]/g,
                        function (x,$1,$2) {keys[i]=$2;return '.@'+(i++);}).
                        replace(/\[(\d+)\]/g,
                        function (x,$1) {keys[i]=parseInt($1,10)|0;return '.@'+(i++);}).
                        replace(/^\./,''); // remove leading dot

                    // If the cleaned needle contains invalid characters, the
                    // path is invalid
                    if (!/[^\w\.\$@]/.test(needle)) {
                        path = needle.split('.');
                        for (i=path.length-1; i >= 0; --i) {
                            if (path[i].charAt(0) === '@') {
                                path[i] = keys[parseInt(path[i].substr(1),10)];
                            }
                        }
                    }
                    else {
                        Y.log("Invalid locator: " + needle, "error", this.toString());
                    }
                }
                return path;
            };


            // Function to walk a path and return the pot of gold
            var walkPath = function (path, origin) {
                var v=origin,i=0,len=path.length;
                for (;i<len && v;++i) {
                    v = v[path[i]];
                }
                return v;
            };

            // Parse the response
            // Step 1. Pull the resultsList from data_in (default assumes
            // data_in IS the resultsList)
            path = buildPath(schema.resultsList);
            if (path) {
                resultsList = walkPath(path, data_in);
                if (resultsList === undefined) {
                    bError = true;
                }
            } else {
                bError = true;
            }

            if (!resultsList) {
                resultsList = [];
            }

            if (!LANG.isArray(resultsList)) {
                resultsList = [resultsList];
            }

            if (!bError) {
                // Step 2. Parse out field data if identified
                if(schema.fields) {
                    var field;
                    // Build the field parser map and location paths
                    for (i=0, len=fields.length; i<len; i++) {
                        field = fields[i];
                        key    = field.key || field;
                        parser = ((typeof field.parser === 'function') ?
                            field.parser :
                            Y.DataParser[field.parser+'']) || field.converter;
                        path   = buildPath(key);

                        if (parser) {
                            fieldParsers[fieldParsers.length] = {key:key,parser:parser};
                        }

                        if (path) {
                            if (path.length > 1) {
                                fieldPaths[fieldPaths.length] = {key:key,path:path};
                            } else {
                                simpleFields[simpleFields.length] = {key:key,path:path[0]};
                            }
                        } else {
                            Y.log("Invalid key syntax: " + key,"warn",this.toString());
                        }
                    }

                    // Process the results, flattening the records and/or applying parsers if needed
                    //if (fieldParsers.length || fieldPaths.length) {
                        for (i = resultsList.length - 1; i >= 0; --i) {
                            var r = resultsList[i], rec = {};
                            for (j = simpleFields.length - 1; j >= 0; --j) {
                                // Bug 1777850: data might be held in an array
                                rec[simpleFields[j].key] =
                                        (r[simpleFields[j].path] !== undefined) ?
                                        r[simpleFields[j].path] : r[j];
                            }

                            for (j = fieldPaths.length - 1; j >= 0; --j) {
                                rec[fieldPaths[j].key] = walkPath(fieldPaths[j].path,r);
                            }

                            for (j = fieldParsers.length - 1; j >= 0; --j) {
                                var p = fieldParsers[j].key;
                                rec[p] = fieldParsers[j].parser(rec[p]);
                                if (rec[p] === undefined) {
                                    rec[p] = null;
                                }
                            }
                            results[i] = rec;
                        }
                    //}
                }
                else {
                    results = resultsList;
                }

                for (key in metaFields) {
                    if (LANG.hasOwnProperty(metaFields,key)) {
                        path = buildPath(metaFields[key]);
                        if (path) {
                            v = walkPath(path, data_in);
                            data_out.meta[key] = v;
                        }
                    }
                }

            } else {
                Y.log("JSON data could not be parsed: " +
                        Y.dump(data_in), "error", this.toString());

                data_out.error = true;
            }

            data_out.results = results;
        }
        else {
            Y.log("JSON data could not be parsed: " +
                    Y.dump(data_in), "error", this.toString());
            data_out.error = true;
        }

        return data_out;
    }
});

    Y.DataParser.JSON = JSON;





}, '@VERSION@' ,{requires:['dataparser-base']});



YUI.add('dataparser', function(Y){}, '@VERSION@' ,{use:['dataparser-base','dataparser-json']});

