YUI.add('datasource-xhr', function(Y) {

/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource-xhr
 * @requires datasource-base
 * @title DataSource XHR Submodule
 */
    var LANG = Y.Lang,
    
    /**
     * XHR subclass for the YUI DataSource utility.
     * @class DataSource.XHR
     * @extends DataSource.Base
     * @constructor
     */    
    XHR = function() {
        XHR.superclass.constructor.apply(this, arguments);
    };
    

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.XHR static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(XHR, {    
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static     
     * @final
     * @value "DataSource.XHR"
     */
    NAME: "DataSource.XHR",


    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.XHR Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
        /**
         * Pointer to IO Utility.
         *
         * @attribute io
         * @type Y.io
         * @default Y.io
         */
        io: {
            value: Y.io
        }
    }
});
    
Y.extend(XHR, Y.DataSource.Base, {
    /**
     * Overriding <code>request</code> event handler passes query string to IO. Fires
     * <code>response</code> event when response is received.     
     *
     * @method _makeConnection
     * @protected     
     * @param args.tId {Number} Transaction ID.     
     * @param args.request {MIXED} Request.     
     * @param args.callback {Object} Callback object.
     */
    _makeConnection: function(args) {
        var uri = this.get("source"),
            cfg = {
                on: {
                    complete: function (id, response, args) {
                        this.fire("response", Y.mix(args, {response:response}));
                        Y.log("Received XHR data response for \"" + args.request + "\"", "info", this.toString());
                        //{tId:args.tId, request:args.request, callback:args.callback, response:response}
                        //this.handleResponse(args.tId, args.request, args.callback, response);
                    }
                },
                context: this,
                arguments: {
                    tId: args.tId,
                    request: args.request,
                    callback: args.callback
                }
            };
        
        this.get("io")(uri, cfg);
        return args.tId;
    }
});
  
    Y.DataSource.XHR = XHR;
    



}, '@VERSION@' ,{requires:['datasource-base']});
