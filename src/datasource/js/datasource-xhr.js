/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource
 */
    
/**
 * XHR subclass for the YUI DataSource utility.
 * @class DataSource.XHR
 * @extends DataSource.Local
 * @constructor
 */    
var DSXHR = function() {
    DSXHR.superclass.constructor.apply(this, arguments);
};
    

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.XHR static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(DSXHR, {
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
    
Y.extend(DSXHR, Y.DataSource.Local, {
    /**
     * Passes query string to IO. Fires <code>response</code> event when
     * response is received asynchronously.
     *
     * @method _defRequestFn
     * @param e {Event.Facade} Event Facade.
     * @param o {Object} Object with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * </dl>
     * @protected
     */
    _defRequestFn: function(e, o) {
        var uri = this.get("source"),
            cfg = {
                on: {
                    success: function (id, response, o) {
                        this.fire("data", null, Y.mix(o, {data:response}));
                        Y.log("Received XHR data response for \"" + o.request + "\"", "info", this.toString());
                        //{tId:args.tId, request:args.request, callback:args.callback, response:response}
                        //this.handleResponse(args.tId, args.request, args.callback, response);
                    },
                    failure: function (id, response, o) {
                        o.error = true;
                        this.fire("error", null, Y.mix(o, {data:response}));
                        this.fire("data", null, Y.mix(o, {data:response}));
                        Y.log("Received XHR data response for \"" + o.request + "\"", "info", this.toString());
                        //{tId:args.tId, request:args.request, callback:args.callback, response:response}
                        //this.handleResponse(args.tId, args.request, args.callback, response);
                    }
                },
                context: this,
                arguments: {
                    tId: o.tId,
                    request: o.request,
                    callback: o.callback
                }
            };
        
        this.get("io")(uri, cfg);
        return o.tId;
    }
});
  
Y.DataSource.XHR = DSXHR;
    
