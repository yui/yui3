YUI.add('datasource-xmlschema', function(Y) {

/**
 * Extends DataSource with schema-parsing on XML data.
 *
 * @module datasource
 * @submodule datasource-xmlschema
 */

/**
 * Adds schema-parsing to the YUI DataSource utility.
 * @class DataSourceXMLSchema
 * @extends Plugin
 */    
var DataSourceXMLSchema = function() {
    DataSourceXMLSchema.superclass.constructor.apply(this, arguments);
};

Y.mix(DataSourceXMLSchema, {
    /**
     * The namespace for the plugin. This will be the property on the host which
     * references the plugin instance.
     *
     * @property NS
     * @type String
     * @static
     * @final
     * @value "schema"
     */
    NS: "schema",

    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "DataSourceXMLSchema"
     */
    NAME: "DataSourceXMLSchema",

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSourceXMLSchema Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
        schema: {
            //value: {}
        }
    }
});

Y.extend(DataSourceXMLSchema, Y.Plugin.Base, {
    /**
    * Internal init() handler.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        this.doBefore("_defDataFn", this._beforeDefDataFn);
    },

    /**
     * Parses raw data into a normalized response.
     *
     * @method _beforeDefDataFn
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object with the following properties:
     *     <dl>
     *         <dt>success (Function)</dt> <dd>Success handler.</dd>
     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>
     *         <dt>scope (Object)</dt> <dd>Execution context.</dd>
     *     </dl>
     * </dd>
     * <dt>data (Object)</dt> <dd>Raw data.</dd>
     * </dl>
     * @protected
     */
    _beforeDefDataFn: function(e) {
        var data = ((this.get("host") instanceof Y.DataSource.XHR) && e.data.responseXML && (e.data.responseXML.nodeType === 9)) ? e.data.responseXML : e.data,
            response = Y.DataSchema.XML.apply(this.get("schema"), data);
            
        // Default
        if(!response) {
            response = {
                meta: {},
                results: data
            };
        }
        
        this.get("host").fire("response", Y.mix({response:response}, e));
        return new Y.Do.Halt("DataSourceXMLSchema plugin halted _defDataFn");
    }
});
    
Y.namespace('plugin').DataSourceXMLSchema = DataSourceXMLSchema;



}, '@VERSION@' ,{requires:['plugin', 'datasource-base', 'dataschema-xml']});
