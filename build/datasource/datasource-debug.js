YUI.add('datasource', function(Y) {

/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource
 * @requires base
 * @optional json, get, connection 
 * @title DataSource Utility
 */
    var lang = Y.Lang,
    
    /**
     * Base class for the YUI DataSource utility.
     * @class DataSourceBase
     * @extends Base
     * @constructor
     */    
    DataSourceBase = function() {
        DataSourceBase.superclass.constructor.apply(this, arguments);
    };
    

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSourceBase static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(DataSourceBase, {    
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static     
     * @final
     * @value 'datasource'
     */
    NAME: 'datasource',

    /**
     * Type is unknown.
     *
     * @property TYPE_UNKNOWN
     * @type Number
     * @static     
     * @final
     * @default -1
     */
    TYPE_UNKNOWN: -1,
    
    /**
     * Type is a JavaScript Array.
     *
     * @property TYPE_JSARRAY
     * @type Number
     * @static     
     * @final
     * @default 0
     */
    TYPE_JSARRAY: 0,
    
    /**
     * Type is a JavaScript Function.
     *
     * @property TYPE_JSFUNCTION
     * @type Number
     * @static     
     * @final
     * @default 1
     */
    TYPE_JSFUNCTION: 1,
    
    /**
     * Type is hosted on a server via an XHR connection.
     *
     * @property TYPE_XHR
     * @type Number
     * @static     
     * @final
     * @default 2
     */
    TYPE_XHR: 2,
    
    /**
     * Type is JSON.
     *
     * @property TYPE_JSON
     * @type Number
     * @static     
     * @final
     * @default 3
     */
    TYPE_JSON: 3,
    
    /**
     * Type is XML.
     *
     * @property TYPE_XML
     * @type Number
     * @static     
     * @final
     * @default 4
     */
    TYPE_XML: 4,
    
    /**
     * Type is plain text.
     *
     * @property TYPE_TEXT
     * @type Number
     * @static     
     * @final
     * @default 5
     */
    TYPE_TEXT: 5,
    
    /**
     * Type is an HTML TABLE element. Data is parsed out of TR elements from all TBODY elements.
     *
     * @property TYPE_HTMLTABLE
     * @type Number
     * @static     
     * @final
     * @default 6
     */
    TYPE_HTMLTABLE: 6,
    
    /**
     * Type is hosted on a server via a dynamic script node.
     *
     * @property TYPE_SCRIPTNODE
     * @type Number
     * @static     
     * @final
     * @default 7
     */
    TYPE_SCRIPTNODE: 7,
    
    /**
     * Type is local.
     *
     * @property TYPE_LOCAL
     * @type Number
     * @static     
     * @final
     * @default 8
     */
    TYPE_LOCAL: 8,
    
    /**
     * Type is local.
     *
     * @property TYPE_LOCAL
     * @type Number
     * @static     
     * @final
     * @default 8
     */
    TYPE_LOCAL: 8,

    /**
     * Registry of parsing functions.
     *
     * @property Parser
     * @type Object
     * @static     
     */
    Parser: {
    
        /**
         * Converts data to type String.
         *
         * @method DS.Parser.parseString
         * @param oData {String | Number | Boolean | Date | Array | Object} Data to parse.
         * The special values null and undefined will return null.
         * @return {String} A string, or null.
         * @static
         */
        string: function(oData) {
            // Special case null and undefined
            if(!lang.isValue(oData)) {
                return null;
            }
            
            //Convert to string
            var string = oData + "";
        
            // Validate
            if(lang.isString(string)) {
                return string;
            }
            else {
                Y.log("Could not convert data " + Y.dump(oData) + " to type String", "warn", this.toString());
                return null;
            }
        },
        
        /**
         * Converts data to type Number.
         *
         * @method DS.Parser.parseNumber
         * @param oData {String | Number | Boolean | Null} Data to convert. Beware, null
         * returns as 0.
         * @return {Number} A number, or null if NaN.
         * @static
         */
        number: function(oData) {
            //Convert to number
            var number = oData * 1;
            
            // Validate
            if(lang.isNumber(number)) {
                return number;
            }
            else {
                YAHOO.log("Could not convert data " + lang.dump(oData) + " to type Number", "warn", this.toString());
                return null;
            }
        },
        
        /**
         * Converts data to type Date.
         *
         * @method DS.Parser.parseDate
         * @param oData {Date | String | Number} Data to convert.
         * @return {Date} A Date instance.
         * @static
         */
        date: function(oData) {
            var date = null;
            
            //Convert to date
            if(!(oData instanceof Date)) {
                date = new Date(oData);
            }
            else {
                return oData;
            }
            
            // Validate
            if(date instanceof Date) {
                return date;
            }
            else {
                YAHOO.log("Could not convert data " + lang.dump(oData) + " to type Date", "warn", this.toString());
                return null;
            }
        }
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSourceBase Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
        /**
        * @attribute liveData
        * @description Pointer to live database.
        * @type MIXED
        */
        liveData: {
        },
        
        /**
        * @attribute dataType
        * @description Where the live data is held:
            <ul>
                <li>TYPE_UNKNOWN</li>
                <li>TYPE_LOCAL</li>
                <li>TYPE_XHR</li>
                <li>TYPE_SCRIPTNODE</li>
                <li>TYPE_JSFUNCTION</li>
            </ul>
        * @type Number
        */
        dataType: {
        },

        /**
        * @attribute responseType
        * @description Format of response:
            <ul>
                <li>TYPE_UNKNOWN</li>
                <li>TYPE_JSARRAY</li>
                <li>TYPE_JSON</li>
                <li>TYPE_XML</li>
                <li>TYPE_TEXT</li>
                <li>TYPE_HTMLTABLE</li>
            </ul>
        * @type Number
        */
        responseType: {
        },

        /**
        * @attribute responseSchema
        * @description XXX
        * @type XXX
        */
        responseSchema: {
        },


        /**
        * @attribute maxCacheEntries
        * @description XXX
        * @type XXX
        */
        maxCacheEntries: {
        },


        /**
        * @attribute ERROR_DATAINVALID
        * @description XXX
        * @type XXX
        */
        ERROR_DATAINVALID: {
        },


        /**
        * @attribute ERROR_DATANULL
        * @description XXX
        * @type XXX
        */
        ERROR_DATANULL: {
        }
    }
});
    
Y.extend(DataSourceBase, Y.Base, {
        /**
        * @private
        * @method _createEvents
        * @description This method creates all the events for this Event Target and publishes them so we get Event Bubbling.
        */
        _initEvents: function() {
            
            var events = [
                "cacheFlushEvent",
                "cacheRequestEvent",
                "cacheResponseEvent",
                "dataErrorEvent",
                "requestEvent",
                "responseCacheEvent",
                "responseEvent",
                "responseParseEvent"
            ];
            
            Y.each(events, function(v, k) {
                this.publish(v, {
                    type: v,
                    emitFacade: true,
                    bubbles: true,
                    preventable: false,
                    queuable: true
                });
            }, this);
    
            /*if (this.get('bubbles')) {
                this.addTarget(this.get('bubbles'));
            }*/           
        },

        /**
        * @private
        * @method initializer
        * @description Internal init() handler
        */
        initializer: function() {
        },

        /**
        * @private
        * @method destructor
        * @description Internal destroy() handler
        */
        destructor: function() {
        }
});
    
    Y.namespace('DataSource');    
    Y.DataSource.Base = DataSourceBase;
    



}, '@VERSION@' );
