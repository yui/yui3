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
     * @method DataSchema.JSON.getPath
     * @param locator {String} JSON value locator.
     * @return {String[]} Walkable path to data value.
     * @static
     */
    getPath: function(locator) {
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
            if(!LANG.isUndefined(data[path[i]])) {
                data = data[path[i]];
            }
            else {
                data = undefined;
                break;
            }
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
            if(!LANG.isUndefined(schema.resultListLocator)) {
                data_out = SchemaJSON._parseResults(schema, data_in, data_out);
            }

            // Parse meta data
            if(!LANG.isUndefined(schema.metaFields)) {
                data_out = SchemaJSON._parseMeta(schema.metaFields, data_in, data_out);
            }
        }
        else {
            data_out.error = new Error(this.toString() + " Schema parse failure");
        }

        return data_out;
    },

    /**
     * Schema-parsed list of results from full data
     *
     * @method _parseResults
     * @param schema {Object} Schema to parse against.
     * @param json_in {Object} JSON to parse.
     * @param data_out {Object} In-progress parsed data to update.
     * @return {Object} Parsed data object.
     * @static
     * @protected
     */
    _parseResults: function(schema, json_in, data_out) {
        var results = [],
            path,
            error;

        if(schema.resultListLocator) {
            path = SchemaJSON.getPath(schema.resultListLocator);
            if(path) {
                results = SchemaJSON.getLocationValue(path, json_in);
                if (results === undefined) {
                    data_out.results = [];
                    error = new Error(this.toString() + " Results retrieval failure");
                }
                else {
                    if(LANG.isArray(schema.resultFields) && LANG.isArray(results)) {
                        data_out = SchemaJSON._getFieldValues(schema.resultFields, results, data_out);
                    }
                    else {
                        data_out.results = [];
                        error = new Error(this.toString() + " Fields retrieval failure");
                    }
                }
            }
            else {
                error = new Error(this.toString() + " Results locator failure");
            }

            if (error) {
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
     * @param array_in {Array} Results to parse.
     * @param data_out {Object} In-progress parsed data to update.
     * @return {Object} Parsed data object.
     * @static
     * @protected
     */
    _getFieldValues: function(fields, array_in, data_out) {
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
            path = SchemaJSON.getPath(key);
            if (path) {
                if (path.length === 1) {
                    simplePaths[simplePaths.length] = {key:key, path:path[0]};
                } else {
                    complexPaths[complexPaths.length] = {key:key, path:path};
                }
            } else {
            }

            // Validate and store parsers for later
            //TODO: use Y.DataSchema.parse?
            parser = (LANG.isFunction(field.parser)) ? field.parser : Y.Parsers[field.parser+''];
            if (parser) {
                fieldParsers[fieldParsers.length] = {key:key, parser:parser};
            }
        }

        // Traverse list of array_in, creating records of simple fields,
        // complex fields, and applying parsers as necessary
        for (i=array_in.length-1; i>=0; --i) {
            record = {};
            result = array_in[i];
            if(result) {
                // Cycle through simpleLocators
                for (j=simplePaths.length-1; j>=0; --j) {
                    // Bug 1777850: The result might be an array instead of object
                    record[simplePaths[j].key] = Y.DataSchema.Base.parse(
                            (LANG.isUndefined(result[simplePaths[j].path]) ?
                            result[j] : result[simplePaths[j].path]), simplePaths[j]);
                }

                // Cycle through complexLocators
                for (j=complexPaths.length - 1; j>=0; --j) {
                    record[complexPaths[j].key] = Y.DataSchema.Base.parse(
                        (SchemaJSON.getLocationValue(complexPaths[j].path, result)), complexPaths[j] );
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
     * @param metaFields {Object} Metafields definitions.
     * @param json_in {Object} JSON to parse.
     * @param data_out {Object} In-progress parsed data to update.
     * @return {Object} Schema-parsed meta data.
     * @static
     * @protected
     */
    _parseMeta: function(metaFields, json_in, data_out) {
        if(LANG.isObject(metaFields)) {
            var key, path;
            for(key in metaFields) {
                if (metaFields.hasOwnProperty(key)) {
                    path = SchemaJSON.getPath(metaFields[key]);
                    if (path && json_in) {
                        data_out.meta[key] = SchemaJSON.getLocationValue(path, json_in);
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
