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
