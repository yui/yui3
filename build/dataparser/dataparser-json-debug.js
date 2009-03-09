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
     * Overriding parse method traverses JSON data according to given schema.
     *
     * @method _parse
     * @protected
     * @param e {Event.Facade} Custom Event Facade for <code>request</code> event.
     * @param e.data {MIXED} Data to parse.
     */
    _parse: function(data) {
        var data_in = (data.responseText && Y.JSON.parse(data.responseText)) || data,
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
                    for (i = resultsList.length - 1; i >= 0; --i) {
                        var r = resultsList[i], rec = {};
                        if(r) {
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
                        }
                        results[i] = rec;
                    }
                }
                else {
                    results = resultsList;
                }

                // Step 3. Parse out meta data if identified
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
