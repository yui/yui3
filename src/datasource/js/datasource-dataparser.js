/**
 * Extends DataSource.Base with schema-based parsing functionality.
 *
 * @module datasource-dataparser
 * @requires datasource-base,dataparser-base
 * @title DataSource DataParser Extension
 */
    var LANG = Y.Lang,
        BASE = Y.DataSource.Base,
    
    /**
     * Adds parsability to the YUI DataSource utility.
     * @class Parsable
     */    
    Parsable = function() {};

Parsable.ATTRS = {
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Base Attributes
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
     * Overriding <code>response</code> event handler parses raw data response before sending
     * to returnData().
     *
     * @method _defResponseHandler
     * @protected
     * @param e {Event.Facade} Event Facade.
     * @param o {Object} Object with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * <dt>response (Object)</dt> <dd>The raw response data.</dd>
     * </dl>
     */
    _defResponseHandler: function(e, o) {
        var response = o.response;

        response = (this.get("parser") && this.get("parser").parse(response)) || {results: response};

        this.returnData(o.tId, o.request, o.callback, response);
    }
};
    
Y.Base.build(BASE, [Parsable], {
    dynamic: false
});
