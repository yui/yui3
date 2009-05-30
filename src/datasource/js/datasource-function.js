/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource
 */
var LANG = Y.Lang,
/**
 * Function subclass for the YUI DataSource utility.
 * @class DataSource.Function
 * @extends DataSource.Local
 * @constructor
 */    
    DSFn = function() {
        DSFn.superclass.constructor.apply(this, arguments);
    };
    

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Function static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(DSFn, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static     
     * @final
     * @value "dataSourceFunction"
     */
    NAME: "dataSourceFunction",


    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Function Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
        /**
        * @attribute source
        * @description Pointer to live data.
        * @type MIXED
        * @default null
        */
        source: {
            validator: LANG.isFunction
        }
    }
});
    
Y.extend(DSFn, Y.DataSource.Local, {
    /**
     * Passes query string to IO. Fires <code>response</code> event when
     * response is received asynchronously.
     *
     * @method _defRequestFn
     * @param e {Event.Facade} Event Facade with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object with the following properties:
     *     <dl>
     *         <dt>success (Function)</dt> <dd>Success handler.</dd>
     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>
     *     </dl>
     * </dd>
     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>
     * </dl>
     * @protected
     */
    _defRequestFn: function(e) {
        var fn = this.get("source"),
            response;
            
            if(fn) {
                response = fn(e.request, this, e);
                this.fire("data", Y.mix({data:response}, e));
            }
            else {
                e.error = new Error("Function data failure");
                this.fire("error", e);
            }
            
        return e.tId;
    }
});
  
Y.DataSource.Function = DSFn;
    
