YUI.add('datasource-dataparser', function(Y) {

/**
 * Extends DataSource with schema-based parsing functionality.
 *
 * @module datasource-dataparser
 * @requires datasource-base,dataparser-base
 * @title DataSource DataParser Extension
 */

/**
 * Adds parsability to the YUI DataSource utility.
 * @class Parsable
 */    
var Parsable = function() {};

Parsable.ATTRS = {
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Instance of DataParser.
     *
     * @attribute parser
     * @type Y.DataParser.Base
     * @default null
     */
    parser: {
        value: null,
        validator: function(value) {
            return ((value instanceof Y.DataParser.Base) || (value === null));
        }
    }
};
    
Parsable.prototype = {
    /**
     * Parses raw data into a normalized response.
     *
     * @method _defDataFn
     * @param e {Event.Facade} Event Facade.
     * @param o {Object} Object with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * <dt>data (Object)</dt> <dd>The raw response.</dd>
     * </dl>
     * @protected
     */
    _defDataFn: function(e, o) {
        var response = (this.get("parser") && this.get("parser").parse(o.data));
        if(!response) {
            response = {
                meta: {},
                results: o.data
            };
        }
        this.fire("response", null, Y.mix(o, response));
    }
};
    
//Y.DataSource.Local = Y.Base.build(Y.DataSource.Local.NAME, Y.DataSource.Local, [Parsable]);



}, '@VERSION@' ,{requires:['datasource', 'dataparser']});
