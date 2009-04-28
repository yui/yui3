YUI.add('dataschema-base', function(Y) {

/**
 * The DataSchema utility provides a common configurable interface for widgets to
 * apply a given schema to a variety of data.
 *
 * @module dataschema
 */
var LANG = Y.Lang,
/**
 * Base class for the YUI DataSchema utility.
 * @class DataSchema.Base
 * @static
 */
    SchemaBase = {
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
    },
    
    /**
     * Applies field parser, if defined
     *
     * @method parse
     * @param value {Object} Original value.
     * @param field {Object} Field.
     * @return {Object} Type-converted value.
     */
    parse: function(value, field) {
        if(field.parser) {
            var parser = (LANG.isFunction(field.parser)) ?
            field.parser : Y.Parsers[field.parser+''];
            if(parser) {
                value = parser.call(this, value);
            }
        }
        return value;
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
            //TODO: use Y.DataSchema.parse?
            parser = (LANG.isFunction(field.parser)) ? field.parser : Y.Parsers[field.parser+''];
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
        var xmldoc = data,
            data_out = {results:[],meta:{}};

        if(LANG.isObject(xmldoc) && schema) {
            // Parse results data
            data_out = SchemaXML._parseResults(schema, xmldoc, data_out);

            // Parse meta data
            data_out = SchemaXML._parseMeta(schema.metaFields, xmldoc, data_out);
        }
        else {
            Y.log("XML data could not be schema-parsed: " + Y.dump(data) + " " + Y.dump(data), "error", SchemaXML.toString());
            data_out.error = true;
        }

        return data_out;
    },

    /**
     * Get an XPath-specified value for a given field from an XML node or document.
     *
     * @method _getLocationValue
     * @param field {String | Object} Field definition.
     * @param context {Object} XML node or document to search within.
     * @return {Object} Data value or null.
     * @static
     * @protected
     */
    _getLocationValue: function(field, context) {
        var locator = field.locator || field.key || field,
            xmldoc = context.ownerDocument || context,
            result, res, value = null;

        try {
            // Standards mode
            if(!LANG.isUndefined(xmldoc.evaluate)) {
                result = xmldoc.evaluate(locator, context, xmldoc.createNSResolver(!context.ownerDocument ? context.documentElement : context.ownerDocument.documentElement), 0, null);
                while(res = result.iterateNext()) {
                    value = res.textContent;
                }
            }
            // IE mode
            else {
                xmldoc.setProperty("SelectionLanguage", "XPath");
                result = context.selectNodes(locator)[0];
                value = result.value || result.text || null;
            }
            return Y.DataSchema.Base.parse(value, field);

        }
        catch(e) {
        }
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
            var key,
                xmldoc = data_in.ownerDocument || data_in;

            for(key in metaFields) {
                if (metaFields.hasOwnProperty(key)) {
                    data_out.meta[key] = SchemaXML._getLocationValue(metaFields[key], xmldoc);
                }
            }
        }
        return data_out;
    },

    /**
     * Schema-parsed list of results from full data
     *
     * @method _parseResults
     * @param schema {Object} Schema to parse against.
     * @param xmldoc {Object} XML document parse.
     * @param data_out {Object} In-progress schema-parsed data to update.
     * @return {Object} Schema-parsed data.
     * @static
     * @protected
     */
    _parseResults: function(schema, xmldoc, data_out) {
        if(schema.resultsLocator && LANG.isArray(schema.resultsFields)) {
            var nodeList = xmldoc.getElementsByTagName(schema.resultsLocator),
                fields = schema.resultsFields,
                results = [],
                node, field, result, i, j;

            if(nodeList.length) {
                // Loop through each result node
                for(i=nodeList.length-1; i>= 0; i--) {
                    result = {};
                    node = nodeList[i];

                    // Find each field value
                    for(j=fields.length-1; j>= 0; j--) {
                        field = fields[j];
                        result[field.key || field] = SchemaXML._getLocationValue(field, node);
                    }
                    results[i] = result;
                }

                data_out.results = results;
            }
            else {
                data_out.error = new Error(this.toString() + " Result nodes retrieval failure");
            }
        }
        return data_out;
    }
};

Y.DataSchema.XML = Y.mix(SchemaXML, Y.DataSchema.Base);



}, '@VERSION@' ,{requires:['dataschema-base']});



YUI.add('dataschema', function(Y){}, '@VERSION@' ,{use:['dataschema-base','dataschema-json','dataschema-xml']});

