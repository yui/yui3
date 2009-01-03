YUI.add('datasource-base', function(Y) {

/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource
 * @requires base
 * @title DataSource Utility
 */
    Y.namespace("DataSource");
    var DS = Y.DataSource;
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource static properties
    //
    /////////////////////////////////////////////////////////////////////////////
    
Y.mix(DS, { 
    /**
     * Global transaction counter.
     *
     * @property DataSource._tId
     * @type Number
     * @static     
     * @private
     * @default 0     
     */
    _tId: 0,
    
    /**
     * Indicates null data response.
     *
     * @property DataSource.ERROR_DATANULL
     * @type Number
     * @static     
     * @final
     * @default 0     
     */
    ERROR_DATANULL: 0,

    /**
     * Indicates invalid data response.
     *
     * @property DataSource.ERROR_DATAINVALID
     * @type Number
     * @static     
     * @final
     * @default 1    
     */
    ERROR_DATAINVALID: 1
});
    
    var LANG = Y.Lang,
    
    /**
     * Base class for the YUI DataSource utility.
     * @class DataSource.Base
     * @extends Base
     * @constructor
     */    
    Base = function() {
        Base.superclass.constructor.apply(this, arguments);
    };
    

    /////////////////////////////////////////////////////////////////////////////
    //
    // Base static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(Base, {    
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static     
     * @final
     * @value "DataSource.Base"
     */
    NAME: "DataSource.Base",

    /////////////////////////////////////////////////////////////////////////////
    //
    // Base Attributes
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
            value: null
        },
        
        /**
        * @attribute ERROR_DATAINVALID
        * @description Error message for invalid data responses.
        * @type String
        * @default "Invalid data"
        */
        ERROR_DATAINVALID: {
            value: "Invalid data"
        },


        /**
        * @attribute ERROR_DATANULL
        * @description Error message for null data responses.
        * @type String
        * @default "Null data"        
        */
        ERROR_DATANULL: {
            value: "Null data"
        }
    },

    /**
     * Executes a given callback.  For object literal callbacks, the third
     * param determines whether to execute the success handler or failure handler.
     *
     * @method issueCallback
     * @param callback {Function|Object} the callback to execute
     * @param params {Array} params to be passed to the callback method
     * @param error {Boolean} whether an error occurred
     * @static
     */
    issueCallback: function (callback, params, error) {
        if(callback) {
            var scope = callback.scope || window,
                callbackFunc = (error && callback.failure) || callback.success;
            if (callbackFunc) {
                callbackFunc.apply(scope, params.concat([callback.argument]));
            }
        }
    }
});
    
Y.extend(Base, Y.Base, {
    /**
    * @property _queue
    * @description Object literal to manage asynchronous request/response
    * cycles enabled if queue needs to be managed (asyncMode/xhrConnMode):
        <dl>
            <dt>interval {Number}</dt>
                <dd>Interval ID of in-progress queue.</dd>
            <dt>conn</dt>
                <dd>In-progress connection identifier (if applicable).</dd>
            <dt>requests {Object[]}</dt>
                <dd>Array of queued request objects: {request:oRequest, callback:_xhrCallback}.</dd>
        </dl>
    * @type Object
    * @default {interval:null, conn:null, requests:[]}    
    * @private     
    */
    _queue: null,

    /**
    * @property _intervals
    * @description Array of polling interval IDs that have been enabled,
    * stored here to be able to clear all intervals.
    * @private        
    */
    _intervals: null,

    /**
    * @method initializer
    * @description Internal init() handler.
    * @private        
    */
    initializer: function() {
        this._queue = {interval:null, conn:null, requests:[]};
        this._intervals = [];
        this._initEvents();
    },

    /**
    * @method destructor
    * @description Internal destroy() handler.
    * @private        
    */
    destructor: function() {
    },

    /**
    * @method _createEvents
    * @description This method creates all the events for this Event
    * Target and publishes them so we get Event Bubbling.
    * @private        
    */
    _initEvents: function() {
        /**
         * Fired when an error is encountered.
         *
         * @event errorEvent
         * @param args {Object} Object literal data payload.         
         * @param args.request {MIXED} The request.
         * @param args.response {Object} The response object.
         * @param args.callback {Object} The callback object.
         */
         
        /**
         * Fired when a request is sent to the live data source.
         *
         * @event requestEvent
         * @param e {Event.Facade} Event Facade.         
         * @param e.tId {Number} Unique transaction ID.             
         * @param e.request {MIXED} The request.
         * @param e.callback {Object} The callback object.
         */
        this.publish("requestEvent", {
            //emitFacade: false,
            defaultFn: this._makeConnection
        });
         
        /**
         * Fired when a response is received from the live data source.
         *
         * @event responseEvent
         * @param e {Event.Facade} Event Facade.         
         * @param e.tId {Number} Unique transaction ID.             
         * @param e.request {MIXED} The request.
         * @param e.callback {Object} The callback object.
         * @param e.response {Object} The raw response data.         
         */
        this.publish("responseEvent", {
            //emitFacade: false,
            defaultFn: this._handleResponse
        });
    },

    /**
     * Overridable default requestEvent handler manages request/response
     * transaction. Must fire responseEvent when response is received. This
     * method should be implemented by subclasses to achieve more complex
     * behavior such as accessing remote data.
     *
     * @method _makeConnection
     * @protected
     * @param e {Event.Facade} Custom Event Facade for requestEvent.
     * @param e.tId {Number} Transaction ID.
     * @param e.request {MIXED} Request.
     * @param e.callback {Object} Callback object.
     */
    _makeConnection: function(e) {
        this.fire("responseEvent", Y.mix(e.details[0], {response:this.get("source")}));
    },

    /**
     * Overridable default responseEvent handler receives raw data response and
     * by default, passes it as-is to returnData.
     *
     * @method _handleResponse
     * @protected
     * @param args.tId {Number} Transaction ID.
     * @param args.request {MIXED} Request.
     * @param args.callback {Object} Callback object.
     * @param args.response {MIXED} Raw data response.
     */
    _handleResponse: function(args) {
        this.returnData(args.tId, args.request, args.callback, {results: args.response});

    },

    /**
     * Generates a unique transaction ID and fires requestEvent.
     *
     * @method sendRequest
     * @param request {MIXED} Request.
     * @param callback {Object} An object literal with the following properties:
     *     <dl>
     *     <dt><code>success</code></dt>
     *     <dd>The function to call when the data is ready.</dd>
     *     <dt><code>failure</code></dt>
     *     <dd>The function to call upon a response failure condition.</dd>
     *     <dt><code>scope</code></dt>
     *     <dd>The object to serve as the scope for the success and failure handlers.</dd>
     *     <dt><code>argument</code></dt>
     *     <dd>Arbitrary data payload that will be passed back to the success and failure handlers.</dd>
     *     </dl>
     * @return {Number} Transaction ID.
     */
    sendRequest: function(request, callback) {
        var tId = DS._tId++;
        this.fire("requestEvent", {tId:tId, request:request,callback:callback});
        return tId;
    },

    /**
     * Sets up a polling mechanism to send requests at set intervals and forward
     * responses to given callback.
     *
     * @method setInterval
     * @param msec {Number} Length of interval in milliseconds.
     * @param request {Object} Request object.
     * @param callback {Object} An object literal with the following properties:
     *     <dl>
     *     <dt><code>success</code></dt>
     *     <dd>The function to call when the data is ready.</dd>
     *     <dt><code>failure</code></dt>
     *     <dd>The function to call upon a response failure condition.</dd>
     *     <dt><code>scope</code></dt>
     *     <dd>The object to serve as the scope for the success and failure handlers.</dd>
     *     <dt><code>argument</code></dt>
     *     <dd>Arbitrary data that will be passed back to the success and failure handlers.</dd>
     *     </dl> 
     * @return {Number} Interval ID.
     */
    setInterval: function(msec, request, callback) {
        if(LANG.isNumber(msec) && (msec >= 0)) {
            var self = this,
                id = setInterval(function() {
                self._makeConnection(request, callback);
            }, msec);
            this._intervals.push(id);
            return id;
        }
        else {
        }
    },
    
    /**
     * Disables polling mechanism associated with the given interval ID.
     *
     * @method clearInterval
     * @param id {Number} Interval ID.
     */
    clearInterval: function(id) {
        // Remove from tracker if there
        var tracker = this._intervals || [],
            i = tracker.length-1;
            
        for(; i>-1; i--) {
            if(tracker[i] === id) {
                tracker.splice(i,1);
                clearInterval(id);
            }
        }
    },

    /**
     * Overridable method returns data to callback.
     *
     * @method returnData
     * @param tId {Number} Transaction ID.
     * @param request {MIXED} Request.
     * @param callback {Object} Callback object.
     * @param response {MIXED} Raw data response.
     */
    returnData: function(tId, request, callback, response) {
        // Problemic response
        if(!response) {
            response = {error:true};
        }
        // Handle any error
        if(response.error) {
            this.fire("errorEvent", {tId:tId, request:request, callback:callback, response:response});
        }

        // Normalize
        response.tId = tId;
        if(!response.results) {
            response.results = [];
        }
        if(!response.meta) {
            response.meta = {};
        }

        // Send the response back to the callback
        Base.issueCallback(callback, [request, response, (callback && callback.argument)], response.error);
    }

});
    
    DS.Base = Base;
    

/**
 * The static Parser Utility provides type conversion functionality of data to
 * String, Number, and Date.
 *
 * @module parser
 * @title Parser Utility
 */
    Y.namespace("String");

    /**
     * Converts data to type String.
     *
     * @method String.parse
     * @param data {MIXED} Data to convert to String. NOTE: The special values null and undefined will return null.
     * @return {String} A string, or null.
     * @static
     */
    Y.String.parse = function(data) {
        // Special case null and undefined
        if(!LANG.isValue(data)) {
            return null;
        }
        
        //Convert to string
        var string = data + "";
    
        // Validate
        if(LANG.isString(string)) {
            return string;
        }
        else {
            return null;
        }
    };
        
    Y.namespace("Number");
    
    Y.Number = {
        /**
         * Converts data to type Number.
         *
         * @method Number.parse
         * @param data {String | Number | Boolean | Null} Data to convert.
         * Beware, null returns as 0.
         * @return {Number} A number, or null if NaN.
         * @static
         */
        parse: function(oData) {
            //Convert to number
            var number = oData * 1;
            
            // Validate
            if(LANG.isNumber(number)) {
                return number;
            }
            else {
                return null;
            }
        },

         /**
         * Takes a native JavaScript Number and formats to string for display to user.
         *
         * @method stringify
         * @param data {Number} Number.
         * @param config {Object} (Optional) Optional configuration values:
         *  <dl>
         *   <dt>prefix {String}</dd>
         *   <dd>String prepended before each number, like a currency designator "$"</dd>
         *   <dt>decimalPlaces {Number}</dd>
         *   <dd>Number of decimal places to round.</dd>
         *   <dt>decimalSeparator {String}</dd>
         *   <dd>Decimal separator</dd>
         *   <dt>thousandsSeparator {String}</dd>
         *   <dd>Thousands separator</dd>
         *   <dt>suffix {String}</dd>
         *   <dd>String appended after each number, like " items" (note the space)</dd>
         *  </dl>
         * @return {String} Formatted number for display.
         */
        stringify: function(data, config) {
            config = config || {};
            
            if(!LANG.isNumber(data)) {
                data *= 1;
            }
        
            if(LANG.isNumber(data)) {
                var isNegative = (data < 0),
                    output = data + "",
                    decimalSeparator = (config.decimalSeparator) ? config.decimalSeparator : ".",
                    dotIndex;
        
                // Manage decimals
                if(LANG.isNumber(config.decimalPlaces)) {
                    // Round to the correct decimal place
                    var decimalPlaces = config.decimalPlaces,
                        decimal = Math.pow(10, decimalPlaces);
                    output = Math.round(data*decimal)/decimal + "";
                    dotIndex = output.lastIndexOf(".");
        
                    if(decimalPlaces > 0) {
                        // Add the decimal separator
                        if(dotIndex < 0) {
                            output += decimalSeparator;
                            dotIndex = output.length-1;
                        }
                        // Replace the "."
                        else if(decimalSeparator !== "."){
                            output = output.replace(".",decimalSeparator);
                        }
                        // Add missing zeros
                        while((output.length - 1 - dotIndex) < decimalPlaces) {
                            output += "0";
                        }
                    }
                }
                
                // Add the thousands separator
                if(config.thousandsSeparator) {
                    var thousandsSeparator = config.thousandsSeparator;
                    dotIndex = output.lastIndexOf(decimalSeparator);
                    dotIndex = (dotIndex > -1) ? dotIndex : output.length;
                    var newOutput = output.substring(dotIndex);
                    var count = -1;
                    for (var i=dotIndex; i>0; i--) {
                        count++;
                        if ((count%3 === 0) && (i !== dotIndex) && (!isNegative || (i > 1))) {
                            newOutput = thousandsSeparator + newOutput;
                        }
                        newOutput = output.charAt(i-1) + newOutput;
                    }
                    output = newOutput;
                }
        
                // Prepend prefix
                output = (config.prefix) ? config.prefix + output : output;
        
                // Append suffix
                output = (config.suffix) ? output + config.suffix : output;
        
                return output;
            }
            // Still not a Number, just return unaltered
            else {
                return data;
            }
        }     
    };


    var xPad=function (x, pad, r)
    {
        if(typeof r === 'undefined')
        {
            r=10;
        }
        for( ; parseInt(x, 10)<r && r>1; r/=10) {
            x = pad.toString() + x;
        }
        return x.toString();
    };

    
    
     Y.namespace("Date");
     
    /**
     * The static Date class provides helper functions to deal with data of type Date.
     *
     * @class Date
     * @static
     */
     var Dt = {
     
        /**
         * Converts data to type Date.
         *
         * @method DS.Parser.parseDate
         * @param oData {Date | String | Number} Data to convert.
         * @return {Date} A Date instance.
         * @static
         */
        parse: function(data) {
            var date = null;
            
            //Convert to date
            if(!(data instanceof Date)) {
                date = new Date(data);
            }
            else {
                return data;
            }
            
            // Validate
            if(date instanceof Date) {
                return date;
            }
            else {
                return null;
            }
        },
        
        formats: {
            a: function (d, l) { return l.a[d.getDay()]; },
            A: function (d, l) { return l.A[d.getDay()]; },
            b: function (d, l) { return l.b[d.getMonth()]; },
            B: function (d, l) { return l.B[d.getMonth()]; },
            C: function (d) { return xPad(parseInt(d.getFullYear()/100, 10), 0); },
            d: ['getDate', '0'],
            e: ['getDate', ' '],
            g: function (d) { return xPad(parseInt(Dt.formats.G(d)%100, 10), 0); },
            G: function (d) {
                    var y = d.getFullYear();
                    var V = parseInt(Dt.formats.V(d), 10);
                    var W = parseInt(Dt.formats.W(d), 10);
        
                    if(W > V) {
                        y++;
                    } else if(W===0 && V>=52) {
                        y--;
                    }
        
                    return y;
                },
            H: ['getHours', '0'],
            I: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, 0); },
            j: function (d) {
                    var gmd_1 = new Date('' + d.getFullYear() + '/1/1 GMT');
                    var gmdate = new Date('' + d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' GMT');
                    var ms = gmdate - gmd_1;
                    var doy = parseInt(ms/60000/60/24, 10)+1;
                    return xPad(doy, 0, 100);
                },
            k: ['getHours', ' '],
            l: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, ' '); },
            m: function (d) { return xPad(d.getMonth()+1, 0); },
            M: ['getMinutes', '0'],
            p: function (d, l) { return l.p[d.getHours() >= 12 ? 1 : 0 ]; },
            P: function (d, l) { return l.P[d.getHours() >= 12 ? 1 : 0 ]; },
            s: function (d, l) { return parseInt(d.getTime()/1000, 10); },
            S: ['getSeconds', '0'],
            u: function (d) { var dow = d.getDay(); return dow===0?7:dow; },
            U: function (d) {
                    var doy = parseInt(Dt.formats.j(d), 10);
                    var rdow = 6-d.getDay();
                    var woy = parseInt((doy+rdow)/7, 10);
                    return xPad(woy, 0);
                },
            V: function (d) {
                    var woy = parseInt(Dt.formats.W(d), 10);
                    var dow1_1 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
                    // First week is 01 and not 00 as in the case of %U and %W,
                    // so we add 1 to the final result except if day 1 of the year
                    // is a Monday (then %W returns 01).
                    // We also need to subtract 1 if the day 1 of the year is 
                    // Friday-Sunday, so the resulting equation becomes:
                    var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
                    if(idow === 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4)
                    {
                        idow = 1;
                    }
                    else if(idow === 0)
                    {
                        idow = Dt.formats.V(new Date('' + (d.getFullYear()-1) + '/12/31'));
                    }
        
                    return xPad(idow, 0);
                },
            w: 'getDay',
            W: function (d) {
                    var doy = parseInt(Dt.formats.j(d), 10);
                    var rdow = 7-Dt.formats.u(d);
                    var woy = parseInt((doy+rdow)/7, 10);
                    return xPad(woy, 0, 10);
                },
            y: function (d) { return xPad(d.getFullYear()%100, 0); },
            Y: 'getFullYear',
            z: function (d) {
                    var o = d.getTimezoneOffset();
                    var H = xPad(parseInt(Math.abs(o/60), 10), 0);
                    var M = xPad(Math.abs(o%60), 0);
                    return (o>0?'-':'+') + H + M;
                },
            Z: function (d) {
            		var tz = d.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, '$2').replace(/[a-z ]/g, '');
            		if(tz.length > 4) {
            			tz = Dt.formats.z(d);
            		}
            		return tz;
        	},
            '%': function (d) { return '%'; }
        },
    
        aggregates: {
            c: 'locale',
            D: '%m/%d/%y',
            F: '%Y-%m-%d',
            h: '%b',
            n: '\n',
            r: 'locale',
            R: '%H:%M',
            t: '\t',
            T: '%H:%M:%S',
            x: 'locale',
            X: 'locale'
            //'+': '%a %b %e %T %Z %Y'
        },
    
         /**
         * Takes a native JavaScript Date and formats to string for display to user.
         *
         * @method format
         * @param oDate {Date} Date.
         * @param oConfig {Object} (Optional) Optional configuration values:
         *  <dl>
         *   <dt>format {String}</dt>
         *   <dd>
         *   <p>
         *   Any format defined by strftime is supported. strftime has several format specifiers defined by the Open group at 
         *   <a href="http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html">http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html</a>
         *   </p>
         *   <p>   
         *   PHP added a few of its own, defined at <a href="http://www.php.net/strftime">http://www.php.net/strftime</a>
         *   </p>
         *   <p>
         *   This javascript implementation supports all the PHP specifiers and a few more.  The full list is below:
         *   </p>
         *   <dl>
         *    <dt>%a</dt> <dd>abbreviated weekday name according to the current locale</dd>
         *    <dt>%A</dt> <dd>full weekday name according to the current locale</dd>
         *    <dt>%b</dt> <dd>abbreviated month name according to the current locale</dd>
         *    <dt>%B</dt> <dd>full month name according to the current locale</dd>
         *    <dt>%c</dt> <dd>preferred date and time representation for the current locale</dd>
         *    <dt>%C</dt> <dd>century number (the year divided by 100 and truncated to an integer, range 00 to 99)</dd>
         *    <dt>%d</dt> <dd>day of the month as a decimal number (range 01 to 31)</dd>
         *    <dt>%D</dt> <dd>same as %m/%d/%y</dd>
         *    <dt>%e</dt> <dd>day of the month as a decimal number, a single digit is preceded by a space (range ' 1' to '31')</dd>
         *    <dt>%F</dt> <dd>same as %Y-%m-%d (ISO 8601 date format)</dd>
         *    <dt>%g</dt> <dd>like %G, but without the century</dd>
         *    <dt>%G</dt> <dd>The 4-digit year corresponding to the ISO week number</dd>
         *    <dt>%h</dt> <dd>same as %b</dd>
         *    <dt>%H</dt> <dd>hour as a decimal number using a 24-hour clock (range 00 to 23)</dd>
         *    <dt>%I</dt> <dd>hour as a decimal number using a 12-hour clock (range 01 to 12)</dd>
         *    <dt>%j</dt> <dd>day of the year as a decimal number (range 001 to 366)</dd>
         *    <dt>%k</dt> <dd>hour as a decimal number using a 24-hour clock (range 0 to 23); single digits are preceded by a blank. (See also %H.)</dd>
         *    <dt>%l</dt> <dd>hour as a decimal number using a 12-hour clock (range 1 to 12); single digits are preceded by a blank. (See also %I.) </dd>
         *    <dt>%m</dt> <dd>month as a decimal number (range 01 to 12)</dd>
         *    <dt>%M</dt> <dd>minute as a decimal number</dd>
         *    <dt>%n</dt> <dd>newline character</dd>
         *    <dt>%p</dt> <dd>either `AM' or `PM' according to the given time value, or the corresponding strings for the current locale</dd>
         *    <dt>%P</dt> <dd>like %p, but lower case</dd>
         *    <dt>%r</dt> <dd>time in a.m. and p.m. notation equal to %I:%M:%S %p</dd>
         *    <dt>%R</dt> <dd>time in 24 hour notation equal to %H:%M</dd>
         *    <dt>%s</dt> <dd>number of seconds since the Epoch, ie, since 1970-01-01 00:00:00 UTC</dd>
         *    <dt>%S</dt> <dd>second as a decimal number</dd>
         *    <dt>%t</dt> <dd>tab character</dd>
         *    <dt>%T</dt> <dd>current time, equal to %H:%M:%S</dd>
         *    <dt>%u</dt> <dd>weekday as a decimal number [1,7], with 1 representing Monday</dd>
         *    <dt>%U</dt> <dd>week number of the current year as a decimal number, starting with the
         *            first Sunday as the first day of the first week</dd>
         *    <dt>%V</dt> <dd>The ISO 8601:1988 week number of the current year as a decimal number,
         *            range 01 to 53, where week 1 is the first week that has at least 4 days
         *            in the current year, and with Monday as the first day of the week.</dd>
         *    <dt>%w</dt> <dd>day of the week as a decimal, Sunday being 0</dd>
         *    <dt>%W</dt> <dd>week number of the current year as a decimal number, starting with the
         *            first Monday as the first day of the first week</dd>
         *    <dt>%x</dt> <dd>preferred date representation for the current locale without the time</dd>
         *    <dt>%X</dt> <dd>preferred time representation for the current locale without the date</dd>
         *    <dt>%y</dt> <dd>year as a decimal number without a century (range 00 to 99)</dd>
         *    <dt>%Y</dt> <dd>year as a decimal number including the century</dd>
         *    <dt>%z</dt> <dd>numerical time zone representation</dd>
         *    <dt>%Z</dt> <dd>time zone name or abbreviation</dd>
         *    <dt>%%</dt> <dd>a literal `%' character</dd>
         *   </dl>
         *  </dd>
         * </dl>
         * @param sLocale {String} (Optional) The locale to use when displaying days of week,
         *  months of the year, and other locale specific strings.  The following locales are
         *  built in:
         *  <dl>
         *   <dt>en</dt>
         *   <dd>English</dd>
         *   <dt>en-US</dt>
         *   <dd>US English</dd>
         *   <dt>en-GB</dt>
         *   <dd>British English</dd>
         *   <dt>en-AU</dt>
         *   <dd>Australian English (identical to British English)</dd>
         *  </dl>
         *  More locales may be added by subclassing of Y.DateLocale.
         *  See Y.DateLocale for more information.
         * @return {String} Formatted date for display.
         * @sa Y.DateLocale
         */
        stringify : function (oDate, oConfig, sLocale) {
            oConfig = oConfig || {};
            
            if(!(oDate instanceof Date)) {
                return LANG.isValue(oDate) ? oDate : "";
            }
    
            var format = oConfig.format || "%m/%d/%Y";
    
            // Be backwards compatible, support strings that are
            // exactly equal to YYYY/MM/DD, DD/MM/YYYY and MM/DD/YYYY
            if(format === 'YYYY/MM/DD') {
                format = '%Y/%m/%d';
            } else if(format === 'DD/MM/YYYY') {
                format = '%d/%m/%Y';
            } else if(format === 'MM/DD/YYYY') {
                format = '%m/%d/%Y';
            }
            // end backwards compatibility block
     
            sLocale = sLocale || "en";
    
            // Make sure we have a definition for the requested locale, or default to en.
            if(!(sLocale in Y.DateLocale)) {
                if(sLocale.replace(/-[a-zA-Z]+$/, '') in Y.DateLocale) {
                    sLocale = sLocale.replace(/-[a-zA-Z]+$/, '');
                } else {
                    sLocale = "en";
                }
            }
    
            var aLocale = Y.DateLocale[sLocale];
    
            var replace_aggs = function (m0, m1) {
                var f = Dt.aggregates[m1];
                return (f === 'locale' ? aLocale[m1] : f);
            };
    
            var replace_formats = function (m0, m1) {
                var f = Dt.formats[m1];
                if(typeof f === 'string') {             // string => built in date function
                    return oDate[f]();
                } else if(typeof f === 'function') {    // function => our own function
                    return f.call(oDate, oDate, aLocale);
                } else if(typeof f === 'object' && typeof f[0] === 'string') {  // built in function with padding
                    return xPad(oDate[f[0]](), f[1]);
                } else {
                    return m1;
                }
            };
    
            // First replace aggregates (run in a loop because an agg may be made up of other aggs)
            while(format.match(/%[cDFhnrRtTxX]/)) {
                format = format.replace(/%([cDFhnrRtTxX])/g, replace_aggs);
            }
    
            // Now replace formats (do not run in a loop otherwise %%a will be replace with the value of %a)
            var str = format.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, replace_formats);
    
            replace_aggs = replace_formats = undefined;
    
            return str;
        }
    };
    
    Y.Date = Dt;
        
    /**
     * The DateLocale class is a container and base class for all
     * localised date strings used by Date. It is used
     * internally, but may be extended to provide new date localisations.
     *
     * To create your own DateLocale, follow these steps:
     * <ol>
     *  <li>Find an existing locale that matches closely with your needs</li>
     *  <li>Use this as your base class.  Use DateLocale if nothing
     *   matches.</li>
     *  <li>Create your own class as an extension of the base class using
     *   Y.merge, and add your own localisations where needed.</li>
     * </ol>
     * See the Y.DateLocale['en-US'] and Y.DateLocale['en-GB']
     * classes which extend Y.DateLocale['en'].
     *
     * For example, to implement locales for French french and Canadian french,
     * we would do the following:
     * <ol>
     *  <li>For French french, we have no existing similar locale, so use
     *   Y.DateLocale as the base, and extend it:
     *   <pre>
     *      Y.DateLocale['fr'] = Y.merge(Y.DateLocale, {
     *          a: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
     *          A: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
     *          b: ['jan', 'f&eacute;v', 'mar', 'avr', 'mai', 'jun', 'jui', 'ao&ucirc;', 'sep', 'oct', 'nov', 'd&eacute;c'],
     *          B: ['janvier', 'f&eacute;vrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'ao&ucirc;t', 'septembre', 'octobre', 'novembre', 'd&eacute;cembre'],
     *          c: '%a %d %b %Y %T %Z',
     *          p: ['', ''],
     *          P: ['', ''],
     *          x: '%d.%m.%Y',
     *          X: '%T'
     *      });
     *   </pre>
     *  </li>
     *  <li>For Canadian french, we start with French french and change the meaning of \%x:
     *   <pre>
     *      Y.DateLocale['fr-CA'] = Y.merge(Y.DateLocale['fr'], {
     *          x: '%Y-%m-%d'
     *      });
     *   </pre>
     *  </li>
     * </ol>
     *
     * With that, you can use your new locales:
     * <pre>
     *    var d = new Date("2008/04/22");
     *    Y.Date.format(d, {format: "%A, %d %B == %x"}, "fr");
     * </pre>
     * will return:
     * <pre>
     *    mardi, 22 avril == 22.04.2008
     * </pre>
     * And
     * <pre>
     *    Y.Date.format(d, {format: "%A, %d %B == %x"}, "fr-CA");
     * </pre>
     * Will return:
     * <pre>
     *   mardi, 22 avril == 2008-04-22
     * </pre>
     * @class DateLocale
     */
     Y.namespace("DateLocale");
     
     var Dl = {
            a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            c: '%a %d %b %Y %T %Z',
            p: ['AM', 'PM'],
            P: ['am', 'pm'],
            r: '%I:%M:%S %p',
            x: '%d/%m/%y',
            X: '%T'
     };
    
     Dl['en'] = Y.merge(Dl, {});
    
     Dl['en-US'] = Y.merge(Dl['en'], {
            c: '%a %d %b %Y %I:%M:%S %p %Z',
            x: '%m/%d/%Y',
            X: '%I:%M:%S %p'
     });
    
     Dl['en-GB'] = Y.merge(Dl['en'], {
            r: '%l:%M:%S %P %Z'
     });
     
     Dl['en-AU'] = Y.merge(Dl['en']);
     
     Y.DateLocal = Dl;
    




}, '@VERSION@' ,{requires:['base']});

YUI.add('datasource-local', function(Y) {

/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource-local
 * @requires datasource-base
 * @title DataSource Local Submodule
 */
    var LANG = Y.Lang,
    
    /**
     * Local subclass for the YUI DataSource utility.
     * @class DataSource.Local
     * @extends DataSource.Base
     * @constructor
     */    
    Local = function() {
        Local.superclass.constructor.apply(this, arguments);
    };
    

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Local static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(Local, {    
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static     
     * @final
     * @value "DataSource.Local"
     */
    NAME: "DataSource.Local",


    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Local Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
    }
});
    
Y.extend(Local, Y.DataSource.Base, {
});
  
    Y.DataSource.Local = Local;
    



}, '@VERSION@' ,{requires:['datasource-base']});

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
     * Overriding requestEvent handler passes query string to IO. Fires
     * responseEvent when response is received.     
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
                        this.fire("responseEvent", Y.mix(args, {response:response}));
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

YUI.add('datasource-cache', function(Y) {

/**
 * Extends DataSource.Base with caching functionality.
 *
 * @module datasource-cache
 * @requires datasource-base,cache
 * @title DataSource Cache Extension
 */
    var LANG = Y.Lang,
        BASE = Y.DataSource.Base,
    
    /**
     * Adds cacheability to the YUI DataSource utility.
     * @class Cacheable
     */    
    Cacheable = {};

Cacheable.ATTRS = {
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Base Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Instance of Y.Cache. Caching is useful to reduce the number of server
     * connections.  Recommended only for data sources that return comprehensive
     * results for queries or when stale data is not an issue.
     *
     * @attribute cache
     * @type Y.Cache
     * @default null
     */
    cache: {
        value: null,
        validator: function(value) {
            return ((value instanceof Y.Cache) || (value === null));
        },
        set: function(value) {
            var i=0,
                handlers = this._cacheHandlers;
            
            // Enabling...
            if(value !== null) {
                // for the first time
                if(handlers === null) {
                    handlers = [];
                    handlers.push(Y.before(this._beforeSendRequest, this, "sendRequest"));
                    handlers.push(Y.before(this._beforeReturnData, this, "returnData"));
                    this._cacheHandlers = handlers;
                }
            }
            // Disabling
            else if(handlers !== null){
                for(;i<handlers; i++) {
                    Y.detach(handlers[i]);
                }
                this._cacheHandlers = null;
            }
            
            //TODO: Handle the destroy() case
        }
    }
};
    
Cacheable.prototype = {
    /**
     * Internal reference to AOP subscriptions, for detaching.
     *
     * @property _cacheHandlers
     * @private
     * @type Array
     */
    _cacheHandlers: null,
    
    /**
     * First look for cached response, then send request to live data.
     *
     * @method _beforeSendRequest
     * @protected
     * @param request {MIXED} Request.
     * @param callback {Object} Callback object.
     */
    _beforeSendRequest: function(request, callback) {
        // Is response already in the Cache?
        var entry = (this.get("cache") && this.get("cache").retrieve(request, callback)) || null;
        if(entry && entry.response) {
            BASE.issueCallback(callback,[request,entry.response]);
            return new Y.Do.Halt("msg", "newRetVal");
        }
    },
    
    /**
     * Adds data to cache before returning data.
     *
     * @method _beforeReturnData
     * @protected
     * @param tId {Number} Transaction ID.
     * @param request {MIXED} Request.
     * @param callback {Object} Callback object.
     * @param response {MIXED} Raw data response.
     */
     _beforeReturnData: function(tId, request, callback, response) {
        // Add to Cache before returning
        if(this.get("cache")) {
            this.get("cache").add(request, response, (callback && callback.argument));
        }
     }
};
    
Y.Base.build(BASE, [Cacheable], {
    dynamic: false
});



}, '@VERSION@' ,{requires:['datasource-base']});

YUI.add('datasource-dataparser', function(Y) {

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
        var response = args.response;

        response = (this.get("parser") && this.get("parser").parse(response)) || {results: response};

        this.returnData(args.tId, args.request, args.callback, response);
    }
};
    
Y.Base.build(BASE, [Parsable], {
    dynamic: false
});



}, '@VERSION@' ,{requires:['datasource', 'dataparser']});



YUI.add('datasource', function(Y){}, '@VERSION@' ,{use:['datasource-base','datasource-local','datasource-xhr','datasource-cache', 'datasource-dataparser']});

