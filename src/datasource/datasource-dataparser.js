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
     * @class Cachable
     * @constructor
     */    
    Parsable = function() {
    };

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
        value: null
    }
};
    
Parsable.prototype = {
    /**
     * Overriding responseEvent handler parses raw data response before sending
     * to returnData().
     *
     * @method _handleResponse
     * @protected
     * @param args.tId {Number} Transaction ID.
     * @param args.request {MIXED} Request.
     * @param args.callback {Object} Callback object.
     * @param args.response {MIXED} Raw data response.
     */
    _handleResponse: function(args) {
        var tId = args.tId,
            oRequest = args.request,
            oCallback = args.callback,
            oFullResponse = args.response;

        var oParsedResponse = (this.get("parser")) ?
                this.get("parser").parse(oFullResponse) : {results: oFullResponse};

        this.returnData(tId, oCallback,[oRequest,oParsedResponse],oParsedResponse.error);
    }
};
    
Y.Base.build(BASE, [Parsable], {
    dynamic: false
});
