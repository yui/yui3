YUI.add('dataschema-base', function(Y) {

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
var SchemaBase = {
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

Y.namespace("DataSchema").Base = SchemaBase;



}, '@VERSION@' ,{requires:['base']});

YUI.add('dataschema-json', function(Y) {

/**
 * The DataSchema utility provides a common configurable interface for widgets to
 * apply a given schema to a variety of data.
 *
 * @module dataschema
 */
var LANG = Y.Lang,

/**
 * JSON subclass for the YUI DataSchema utility.
 * @class DataSchema.JSON
 * @extends DataSchema.Base
 * @static
 */
SchemaJSON = {

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSchema.JSON static methods
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
     * Returns string name.
     *
     * @method toString
     * @return {String} String representation for this object.
     */
    toString: function() {
        return "DataSchema.JSON";
    },

    /**
     * Utility function converts JSON locator strings into walkable paths
     *
     * @method DataSchema.JSON.buildPath
     * @param locator {String} JSON value locator.
     * @return {String[]} Walkable path to data value.
     * @static
     */
    buildPath: function(locator) {
        var path = null,
            keys = [],
            i = 0;
            
        if (locator) {
            // Strip the ["string keys"] and [1] array indexes
            locator = locator.
                replace(/\[(['"])(.*?)\1\]/g,
                function (x,$1,$2) {keys[i]=$2;return '.@'+(i++);}).
                replace(/\[(\d+)\]/g,
                function (x,$1) {keys[i]=parseInt($1,10)|0;return '.@'+(i++);}).
                replace(/^\./,''); // remove leading dot

            // Validate against problematic characters.
            if (!/[^\w\.\$@]/.test(locator)) {
                path = locator.split('.');
                for (i=path.length-1; i >= 0; --i) {
                    if (path[i].charAt(0) === '@') {
                        path[i] = keys[parseInt(path[i].substr(1),10)];
                    }
                }
            }
            else {
                Y.log("Invalid locator: " + locator, "error", SchemaJSON.toString());
            }
        }
        return path;
    },

    /**
     * Utility function to walk a path and return the value located there.
     *
     * @method DataSchema.JSON.getLocationValue
     * @param path {String[]} Locator path.
     * @param data {String} Data to traverse.
     * @return {Object} Data value at location.
     * @static
     */
    getLocationValue: function (path, data) {
        var i = 0,
            len = path.length;
        for (;i<len;i++) {
            data = data[path[i]];
        }
        return data;
    },

    /**
     * Applies a given schema to given JSON data.
     *
     * @method apply
     * @param schema {Object} Schema to apply.
     * @param data {Object} JSON data.
     * @return {Object} Schema-parsed data.
     * @static
     */
    apply: function(schema, data) {
        var data_in = data,
            data_out = {results:[],meta:{}};
            
        // Convert incoming JSON strings
        if(!LANG.isObject(data)) {
            try {
                data_in = Y.JSON.parse(data);
            }
            catch(e) {
                data_out.error = e;
                return data_out;
            }
        }

        if(LANG.isObject(data_in) && schema) {
            // Parse results data
            if(!LANG.isUndefined(schema.resultsLocator)) {
                data_out = SchemaJSON._parseResults(schema, data_in, data_out);
            }

            // Parse meta data
            if(!LANG.isUndefined(schema.metaFields)) {
                data_out = SchemaJSON._parseMeta(schema.metaFields, data_in, data_out);
            }
        }
        else {
            Y.log("JSON data could not be schema-parsed: " + Y.dump(data) + " " + Y.dump(data), "error", SchemaJSON.toString());
            data_out.error = true;
        }

        return data_out;
    },

    /**
     * Schema-parsed list of results from full data
     *
     * @method _parseResults
     * @param schema {Object} Schema to parse against.
     * @param data_in {Object} Data to parse.
     * @param data_out {Object} In-progress parsed data to update.
     * @return {Object} Parsed data object.
     * @static
     * @protected
     */
    _parseResults: function(schema, data_in, data_out) {
        var results = [],
            path,
            error;

        if(schema.resultsLocator) {
            path = SchemaJSON.buildPath(schema.resultsLocator);
            if(path) {
                results = SchemaJSON.getLocationValue(path, data_in);
                if (results === undefined) {
                    data_out.results = [];
                    error = new Error(this.toString() + " Results retrieval failure");
                }
                    if(LANG.isArray(schema.resultsFields) && LANG.isArray(results)) {
                        data_out = SchemaJSON._getFieldValues(schema.resultsFields, results, data_out);
                    }
                    else {
                        data_out.results = [];
                        error = new Error(this.toString() + " Fields retrieval failure");
                    }
            }
            else {
                error = new Error(this.toString() + " Results locator failure");
            }

            if (error) {
                Y.log("JSON data could not be parsed: " + Y.dump(data_in), "error", SchemaJSON.toString());
                data_out.error = error;
            }
            
        }
        return data_out;
    },

    /**
     * Get field data values out of list of full results
     *
     * @method _getFieldValues
     * @param fields {Array} Fields to find.
     * @param data_in {Array} Results data to parse.
     * @param data_out {Object} In-progress parsed data to update.
     * @return {Object} Parsed data object.
     * @static
     * @protected
     */
    _getFieldValues: function(fields, data_in, data_out) {
        var results = [],
            len = fields.length,
            i, j,
            field, key, path, parser,
            simplePaths = [], complexPaths = [], fieldParsers = [],
            result, record;

        // First collect hashes of simple paths, complex paths, and parsers
        for (i=0; i<len; i++) {
            field = fields[i]; // A field can be a simple string or a hash
            key = field.key || field; // Find the key

            // Validate and store locators for later
            path = SchemaJSON.buildPath(key);
            if (path) {
                if (path.length === 1) {
                    simplePaths[simplePaths.length] = {key:key, path:path[0]};
                } else {
                    complexPaths[complexPaths.length] = {key:key, path:path};
                }
            } else {
                Y.log("Invalid key syntax: " + key, "warn", SchemaJSON.toString());
            }

            // Validate and store parsers for later
            //TODO: implement shortcuts
            parser = (LANG.isFunction(field.parser)) ? field.parser : Y.DataSchema[field.parser+''];
            if (parser) {
                fieldParsers[fieldParsers.length] = {key:key, parser:parser};
            }
        }

        // Traverse list of data_in, creating records of simple fields,
        // complex fields, and applying parsers as necessary
        for (i=data_in.length-1; i>=0; --i) {
            record = {};
            result = data_in[i];
            if(result) {
                // Cycle through simpleLocators
                for (j=simplePaths.length-1; j>=0; --j) {
                    // Bug 1777850: The result might be an array instead of object
                    record[simplePaths[j].key] =
                            LANG.isUndefined(result[simplePaths[j].path]) ?
                            result[j] : result[simplePaths[j].path];
                }

                // Cycle through complexLocators
                for (j=complexPaths.length - 1; j>=0; --j) {
                    record[complexPaths[j].key] = SchemaJSON.getLocationValue(complexPaths[j].path, result);
                }

                // Cycle through fieldParsers
                for (j=fieldParsers.length-1; j>=0; --j) {
                    key = fieldParsers[j].key;
                    record[key] = fieldParsers[j].parser(record[key]);
                    // Safety net
                    if (LANG.isUndefined(record[key])) {
                        record[key] = null;
                    }
                }
            }
            results[i] = record;
        }
        data_out.results = results;
        return data_out;
    },

    /**
     * Parses results data according to schema
     *
     * @method _parseMeta
     * @param data_out {Object} Data to parse.
     * @param data_in {Object} In-progress parsed data to update.
     * @return {Object} Schema-parsed meta data.
     * @static
     * @protected
     */
    _parseMeta: function(metaFields, data_in, data_out) {
        if(LANG.isObject(metaFields)) {
            var key, path;
            for(key in metaFields) {
                if (metaFields.hasOwnProperty(key)) {
                    path = SchemaJSON.buildPath(metaFields[key]);
                    if (path && data_in) {
                        data_out.meta[key] = SchemaJSON.getLocationValue(path, data_in);
                    }
                }
            }
        }
        else {
            data_out.error = new Error(this.toString() + " Meta retrieval failure");
        }
        return data_out;
    }
};

Y.DataSchema.JSON = Y.mix(SchemaJSON, Y.DataSchema.Base);



}, '@VERSION@' ,{requires:['dataschema-base']});

YUI.add('dataschema-xml', function(Y) {

/**
 * The DataSchema utility provides a common configurable interface for widgets to
 * apply a given schema to a variety of data.
 *
 * @module dataschema
 */
var LANG = Y.Lang,

/**
 * XML subclass for the YUI DataSchema utility.
 * @class DataSchema.XML
 * @extends DataSchema.Base
 * @static
 */
SchemaXML = {

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSchema.XML static methods
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
     * Returns string name.
     *
     * @method toString
     * @return {String} String representation for this object.
     */
    toString: function() {
        return "DataSchema.XML";
    },

    /**
     * Applies a given schema to given XML data.
     *
     * @method apply
     * @param schema {Object} Schema to apply.
     * @param data {XMLDoc} XML document.
     * @return {Object} Schema-parsed data.
     * @static
     */
    apply: function(schema, data) {
        var data_in = data,
            data_out = {results:[],meta:{}};
            
        if(LANG.isObject(data_in) && schema) {
            // Parse results data
            if(!LANG.isUndefined(schema.resultsLocator)) {
                data_out = SchemaXML._parseResults(schema, data_in, data_out);
            }

            // Parse meta data
            if(!LANG.isUndefined(schema.metaFields)) {
                data_out = SchemaXML._parseMeta(schema.metaFields, data_in, data_out);
            }
        }
        else {
            Y.log("XML data could not be schema-parsed: " + Y.dump(data) + " " + Y.dump(data), "error", SchemaXML.toString());
            data_out.error = true;
        }

        return data_out;
    },

    /**
     * Schema-parsed list of results from full data
     *
     * @method _parseResults
     * @param schema {Object} Schema to parse against.
     * @param data_in {Object} Data to parse.
     * @param data_out {Object} In-progress parsed data to update.
     * @return {Object} Parsed data object.
     * @static
     * @protected
     */
    _parseResults: function(schema, data_in, data_out) {
        var results = [],
            nodeList,
            error;

        if(schema.resultsLocator) {
            nodeList =  data_in.getElementsByTagName(schema.resultsLocator);
            //if(xmlList) {
                    if(LANG.isArray(schema.resultsFields) && nodeList.length) {
                        data_out = SchemaXML._getFieldValues(schema.resultsFields, nodeList, data_out);
                    }
                    else {
                        data_out.results = [];
                        data_out.error = new Error(this.toString() + " Fields retrieval failure");
                    }
            //}
            //else {
                //error = new Error(this.toString() + " Results locator failure");
            //}

            //if (error) {
                //Y.log("JSON data could not be parsed: " + Y.dump(data_in), "error", SchemaJSON.toString());
                //data_out.error = error;
            //}
            
        }
        return data_out;
    },

    /**
     * Get field data values out of nodelist of full results
     *
     * @method _getFieldValues
     * @param fields {Array} Fields to find.
     * @param data_in {Array} Results data to parse.
     * @param data_out {Object} In-progress parsed data to update.
     * @return {Object} Parsed data object.
     * @static
     * @protected
     */
    _getFieldValues: function(fields, data_in, data_out) {
        var results = [],
            i = data_in.length-1,
            j,
            item, result_in, result_out, field, key, data, subnode, datapieces;

        try {
            // Loop through each result node
            for(; i>= 0; i--) {
                result_out = {};
                result_in = data_in[i];
                
                // Find each field value
                j = fields.length-1;
                for(; j>= 0; j--) {
                    field = fields[j];
                    key = (LANG.isValue(field.key)) ? field.key : field;

                    // Values may be held in an attribute...
                    if(result_in.attributes.getNamedItem(key)) {
                        data = result_in.attributes.getNamedItem(key).value;
                    }
                    // ...or in a node
                    else {
                        subnode = result_in.getElementsByTagName(key);
                        if(subnode && subnode.item(0)) {
                            item = subnode.item(0);
                            // For IE, then DOM...
                            data = (item) ? ((item.text) ? item.text : (item.textContent) ? item.textContent : null) : null;
                            // ...then fallback, but check for multiple child nodes
                            if(!data) {
                                datapieces = [];
                                for(var k=0, len=item.childNodes.length; k<len; k++) {
                                    if(item.childNodes[k].nodeValue) {
                                        datapieces[datapieces.length] = item.childNodes[k].nodeValue;
                                    }
                                }
                                if(datapieces.length > 0) {
                                    data = datapieces.join("");
                                }
                            }
                        }
                    }
                    // Safety net
                    if(data === null) {
                           data = "";
                    }

                    var parser = (typeof field.parser === 'function') ?
                        field.parser :
                        // TODO: implement shortcuts
                        null;//DS.Parser[field.parser+''];
                    if(parser) {
                        data = parser.call(this, data);
                    }
                    // Safety measure
                    if(data === undefined) {
                        data = null;
                    }
                    result_out[key] = data;
                }
                results[i] = result_out;
            }
        }
        catch(e) {
            data_out.error = new Error(this.toString() + " Fields retrieval failure");
        }

        data_out.results = results;
        return data_out;
    },

    /**
     * Parses results data according to schema
     *
     * @method _parseMeta
     * @param data_out {Object} Data to parse.
     * @param data_in {Object} In-progress parsed data to update.
     * @return {Object} Schema-parsed meta data.
     * @static
     * @protected
     */
    _parseMeta: function(metaFields, data_in, data_out) {
        if(LANG.isObject(metaFields)) {
            var key, path, value;
            for(key in metaFields) {
                if (metaFields.hasOwnProperty(key)) {
                    path = metaFields[key];
                    // Look for a node
                    value = data_in.getElementsByTagName(path)[0];

                    if (value) {
                        value = value.firstChild.nodeValue;
                    } else {
                        // Look for an attribute
                        value = data_in.attributes.getNamedItem(path);
                        if (value) {
                            value = value.value;
                        }
                    }

                    if (LANG.isValue(value)) {
                        data_out.meta[key] = value;
                    }
                }
            }
        }
        else {
            data_out.error = new Error(this.toString() + " Meta retrieval failure");
        }
        return data_out;
    }
};

Y.DataSchema.XML = Y.mix(SchemaXML, Y.DataSchema.Base);



}, '@VERSION@' ,{requires:['dataschema-base']});



YUI.add('dataschema', function(Y){}, '@VERSION@' ,{use:['dataschema-base','dataschema-json','dataschema-xml']});

